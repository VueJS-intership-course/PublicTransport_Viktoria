<template>
  <div id="app" class="container">
    <text-list></text-list>
    <map-viewer></map-viewer>
  </div>
</template>

<script>
import TextList from "./components/TextList.vue";
import MapViewer from "./components/MapComponent.vue";


export default {
  components: {
    TextList,
    MapViewer,
  },
};
</script>
