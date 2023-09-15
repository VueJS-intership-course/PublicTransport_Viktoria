<template>
  <div v-if="$route.params.id" class="map-viewer">
    <div id="map" ref="map" class="map"></div>
    <Popup
      v-if="popupInfo.TimingPointName"
      :popupInfo="popupInfo"
      :popupLeft="popupLeft"
      :popupTop="popupTop"
      @close="closePopup"
    />
  </div>
  <div v-else>
    <p>Please select a journey.</p>
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
import {
  initializeMap,
  createPopup,
  addPopupToMap,
} from "../utils/mapAndPopupInit.js";
import { Style, Stroke, Fill } from "ol/style";
import LineString from "ol/geom/LineString";
import Popup from "./Popup.vue";
import { createStopStyle } from "../utils/createStopStyle.js";

export default {
  components: {
    Popup,
  },
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
      popupLeft: "0px",
      popupTop: "0px",
    };
  },

  mounted() {
    console.log("MapComponent mounted");
    this.map = initializeMap(this.$refs.map);
    this.initializePopup();
    this.map.on("click", this.showPopup.bind(this));

    // load previous journey if available
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
          style: createStopStyle,
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
              color: "black",
              width: 2,
            }),
          }),
        });
        this.map.addLayer(this.lineVectorLayer);
      } else {
        console.error("Invalid busStops data:", busStops);
      }
    },

    async fetchBusStops() {
      this.closePopup();

      console.log("Fetching bus stops...");
      const journeyId = this.$route.params.id;
      const journeyData = await api.fetchBusStops(journeyId);
      const busStops = Object.values(journeyData.Stops);
      console.log("Fetched stops:", busStops);

      // remove old journey layer
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

        const popupPosition = event.coordinate;
        const pixel = this.map.getPixelFromCoordinate(popupPosition);
        this.popupLeft = pixel[0] + "px";
        this.popupTop = pixel[1] + "px";
      } else {
        this.closePopup();
      }
    },

    closePopup() {
      this.popupInfo.TimingPointName = "";
      this.popupInfo.TripStopStatus = "";
      this.popupInfo.WheelChairAccessible = "";
    },
  },
};
</script>

<style scoped>
.map-viewer {
  width: 100%;
  height: 43em;
  padding: 1rem;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
