<template>
  <div id="app">
    <div class="container">
      <div class="left-column">
        <router-view></router-view> 
      </div>
      <div class="right-column">
        <router-view name="map"></router-view> 
      </div>
    </div>
  </div>
</template>


<style>
#app {
  text-align: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; 
  padding: 20px; 
}

.left-column {
  width: 30%; 
}

.right-column {
  width: 70%; 
}
</style>
