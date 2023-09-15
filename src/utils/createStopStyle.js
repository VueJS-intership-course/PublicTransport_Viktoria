import CircleStyle from "ol/style/Circle";
import { Style, Stroke, Fill } from "ol/style";


export function createStopStyle(feature) {
    let fillColor;
    const accessibility = feature.get("WheelChairAccessible");

    if (accessibility === "ACCESSIBLE") {
      fillColor = "green";
    } else if (accessibility === "NOTACCESSIBLE") {
      fillColor = "red";
    } else {
      fillColor = "grey";
    }

    return new Style({
      image: new CircleStyle({
        radius: 8,
        fill: new Fill({
          color: fillColor,
        }),
        stroke: new Stroke({
          color: "white",
          width: 1,
        }),
      }),
    });
  }

  export default createStopStyle;