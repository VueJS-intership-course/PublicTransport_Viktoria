import { createPopup, addPopupToMap } from "../utils/map.js";

export function initializePopup(map, popupRef) {
  const popup = createPopup(popupRef);
  addPopupToMap(map, popup);
  return popup; 
}

export function showPopup(map, popup, event) {
    const feature = map.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );
  
    if (feature) {
      const stopInfo = {
        TimingPointName: feature.get("TimingPointName"),
        TripStopStatus: feature.get("TripStopStatus"),
        WheelChairAccessible: feature.get("WheelChairAccessible"),
      };
  
      const popupContent = `
        <p><strong>Timing Point Name:</strong> ${stopInfo.TimingPointName}</p>
        <p><strong>Trip Stop Status:</strong> ${stopInfo.TripStopStatus}</p>
        <p><strong>Wheelchair Accessible:</strong> ${stopInfo.WheelChairAccessible}</p>
      `;
  
      // Set the content of the popup using setContent
      popup.setContent(popupContent);
  
      // Set the popup position
      popup.setPosition(event.coordinate);
    } else {
      closePopup(popup);
    }
  }
  

export function closePopup(popup) {
  popup.setPosition(undefined);
}
