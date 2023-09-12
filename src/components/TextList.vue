<template>
  <div class="text-list">
    <h2>Routes Lists</h2>
    <ul>
      <li v-for="(text, index) in dummyRoutes" :key="index">{{ text }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dummyRoutes: ["Route1", "Route2", "Route3", "Route4", "Route5", "Route6"],
    };
  },
};
</script>

<style scoped>
.text-list {
  font-size: 25px;
  width: 25%;
  text-align: left;
  padding: 20px;
  border-right: 1px solid #ccc;
  box-sizing: border-box;
}

h2 {
  text-align: center;
}

ul {
  list-style: none;
  line-height: 40px;
  padding: 0;
  margin: 0;
}
</style>
