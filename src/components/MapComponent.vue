<template>
  <div class="map-viewer">
    <div id="map" ref="map" class="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { fetchData } from "../services/index.js";
// import { fetchJourneys } from "../services/index.js";

export default {
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    this.initializeMap();
    fetchData();
  },

  created() {
    this.fetchBusStopsData();
  },

  methods: {
    initializeMap() {
      this.map = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([6, 52]),
          zoom: 7,
        }),
      });
    },

    visualizeOnMap(busStops) {
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      Object.values(busStops).forEach((stop) => {
        if (stop.Latitude && stop.Longitude) {
          const coordinates = fromLonLat([stop.Longitude, stop.Latitude]);
        //   console.log(coordinates);
          const feature = new Feature({
            geometry: new Point(coordinates),
          });

          vectorSource.addFeature(feature);
        }
      });
      this.map.addLayer(vectorLayer);
    },

    fetchBusStopsData() {
      const apiUrl = `${BASE_URL}/journey/HTM_20230912_21_210072_0`;

      axios
        .get(apiUrl)
        .then((response) => {
          if (response.data.HTM_20230912_21_210072_0.Stops) {
            const busStops = response.data.HTM_20230912_21_210072_0.Stops;
            this.visualizeOnMap(busStops);
            console.log(busStops);
          } else {
            console.error("Error: ", response.data);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    },
  },
};
</script>

<style scoped>
.map-viewer {
  width: 90%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.map {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
