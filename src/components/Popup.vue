<template>
  <div class="ol-popup" :style="{ left: popupLeft, top: popupTop }">
    <button class="ol-popup-closer" @click="closePopup"></button>
    <div id="popup-content">
      <p><strong>Timing Point Name:</strong> {{ popupInfo.TimingPointName }}</p>
      <p><strong>Trip Stop Status:</strong> {{ popupInfo.TripStopStatus }}</p>
      <p>
        <strong>Wheelchair Accessible:</strong>
        {{ popupInfo.WheelChairAccessible }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    popupInfo: Object,
    popupLeft: String,
    popupTop: String,
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  /* bottom: 12px;
  left: -50px; */
  min-width: 200px;
}

.ol-popup-closer {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
</style>
