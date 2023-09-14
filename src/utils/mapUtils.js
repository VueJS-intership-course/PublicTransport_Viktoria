import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import { Style, Stroke, Fill } from "ol/style";
import LineString from "ol/geom/LineString";

export function visualizeOnMap(map, busStops) {
  if (busStops) {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: createStopStyle,
    });

    const lineVectorSource = new VectorSource(); 

    busStops.forEach((stop, index) => {
      if (stop.Latitude && stop.LongitudAe) {
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

    map.addLayer(vectorLayer);

    const lineVectorLayer = new VectorLayer({
      source: lineVectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
      }),
    });
    map.addLayer(lineVectorLayer);
  } else {
    console.error("Invalid busStops data:", busStops);
  }
}

export function createStopStyle(feature) {
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
}
