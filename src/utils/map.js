import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";

export function initializeMap(mapContainer) {
  return new Map({
    target: mapContainer,
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
}

export function createPopup(element) {
  return new Overlay({
    element,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });
}

export function addPopupToMap(map, popup) {
  map.addOverlay(popup);
}
