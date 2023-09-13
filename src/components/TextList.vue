<template>
  <div class="text-list">
    <h2>Routes Lists</h2>
    <ul>
      <button
        v-for="(route, index) in pageEntries"
        :key="index"
        @click="selectRoute(route)"
      >
        {{ route }}
      </button>
    </ul>
    <paginator :entriesCount="entries.length" v-model:currentPage="page"></paginator>
  </div>
</template>

<script>
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import Paginator from "./Paginator.vue";

export default {
  components: {
    Paginator,
  },
  data() {
    return {
      routes: [],
      entriesPerPage: 15,
      page: 1,
    };
  },

  created() {
    this.fetchJourneys();
  },

  methods: {
    fetchJourneys() {
      axios.get(`${BASE_URL}/journey`).then((response) => {
        if (response.data) {
          this.routes = Object.keys(response.data);
          console.log(`All Journeys: ${this.routes}`);
        }
      });
    },
    onPageChanged(e) {
      this.page = e;
    },
    selectRoute(route) {
      this.$root.$emit("route-selected", route);
    },
  },
  computed: {
    entries() {
      return this.routes;
    },
    startIndex() {
      return this.page * this.entriesPerPage - this.entriesPerPage;
    },
    endIndex() {
      return this.startIndex + this.entriesPerPage;
    },
    pageEntries() {
      const result = this.routes.slice(this.startIndex, this.endIndex);
      return result;
    },
  },
};
</script>


<style scoped>
.text-list {
  /* font-size: 25px; */
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
