<template>
  <div class="map-viewer">
    <div id="map" ref="map" class="map"></div>
    <div id="popup" ref="popup" class="ol-popup">
      <button class="ol-popup-closer" @click="closePopup"></button>
      <div id="popup-content">
        <p>
          <strong>Timing Point Name:</strong> {{ popupInfo.TimingPointName }}
        </p>
        <p>
          <strong>Trip Stop Status:</strong> {{ popupInfo.TripStopStatus }}
        </p>
        <p>
          <strong>Wheelchair Accessible:</strong>{{ popupInfo.WheelChairAccessible }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import api from "../services/index.js";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import { initializeMap, createPopup, addPopupToMap } from "../utils/map.js";
import { Style, Stroke, Fill } from "ol/style";
import LineString from "ol/geom/LineString";

export default {
  data() {
    return {
      map: null,
      vectorLayer: null,
      popup: null,
      lineVectorLayer: null,
      popupInfo: {
        TimingPointName: "",
        TripStopStatus: "",
        WheelChairAccessible: "",
      },
    };
  },

  mounted() {
    console.log("MapComponent mounted");
    this.map = initializeMap(this.$refs.map);
    this.initializePopup();
    this.map.on("click", this.showPopup.bind(this));

    // Load previous journey if available
    const prevJourney = this.$route.params.id;
    if (prevJourney) {
      this.fetchBusStops(prevJourney);
    }
  },

  watch: {
    $route: "fetchBusStops",
  },

  methods: {
    visualizeOnMap(busStops) {
      if (busStops) {
        const vectorSource = new VectorSource();
        this.vectorLayer = new VectorLayer({
          source: vectorSource,
          style: this.createStopStyle,
        });

        const lineVectorSource = new VectorSource();

        busStops.forEach((stop, index) => {
          if (stop.Latitude && stop.Longitude) {
            const coordinates = fromLonLat([stop.Longitude, stop.Latitude]);
            const feature = new Feature({
              geometry: new Point(coordinates),
            });

            feature.set("TimingPointName", stop.TimingPointName);
            feature.set("TripStopStatus", stop.TripStopStatus);
            feature.set("WheelChairAccessible", stop.WheelChairAccessible);
            // console.log(stop.TimingPointName, stop.TripStopStatus, stop.WheelChairAccessible);
            vectorSource.addFeature(feature);

            if (index > 0) {
              const prevStop = busStops[index - 1];
              if (prevStop.Latitude && prevStop.Longitude) {
                const prevCoordinates = fromLonLat([
                  prevStop.Longitude,
                  prevStop.Latitude,
                ]);

                const lineFeature = new Feature({
                  geometry: new LineString([prevCoordinates, coordinates]),
                });

                lineVectorSource.addFeature(lineFeature);
              }
            }
          }
        });

        this.map.addLayer(this.vectorLayer);

        this.lineVectorLayer = new VectorLayer({
          source: lineVectorSource,
          style: new Style({
            stroke: new Stroke({
              color: "blue",
              width: 2,
            }),
          }),
        });
        this.map.addLayer(this.lineVectorLayer);
      } else {
        console.error("Invalid busStops data:", busStops);
      }
    },

    createStopStyle(feature) {
      return new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "blue",
          }),
          stroke: new Stroke({
            color: "white",
            width: 2,
          }),
        }),
      });
    },

    async fetchBusStops() {
      this.closePopup();

      console.log("Fetching bus stops...");
      const journeyId = this.$route.params.id;
      const journeyData = await api.fetchBusStops(journeyId);
      const busStops = Object.values(journeyData.Stops);
      console.log("Fetched stops:", busStops);

      // Remove old journey layer
      if (this.vectorLayer) {
        this.map.removeLayer(this.vectorLayer);
        this.map.removeLayer(this.lineVectorLayer);
      }
      this.visualizeOnMap(busStops);
    },

    initializePopup() {
      this.popup = createPopup(this.$refs.popup);
      addPopupToMap(this.map, this.popup);
    },

    showPopup(event) {
      const feature = this.map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );

      if (feature) {
        this.popupInfo.TimingPointName = feature.get("TimingPointName");
        this.popupInfo.TripStopStatus = feature.get("TripStopStatus");
        this.popupInfo.WheelChairAccessible = feature.get(
          "WheelChairAccessible"
        );

        this.popup.setPosition(event.coordinate);
      } else {
        this.closePopup();
      }
    },

    closePopup() {
      this.popup.setPosition(undefined);
    },
  },
};
</script>

<style scoped>
.map-viewer {
  width: 100%;
  height: 500px;
}

.map {
  width: 100%;
  height: 100%;
}

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  bottom: 12px;
  left: -50px;
  min-width: 200px;
}

.ol-popup-closer {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
</style>

