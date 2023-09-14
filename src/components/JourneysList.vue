<template>
  <div>
    <h1>Journeys List</h1>
    <ul v-if="journeys && journeys.length">
      <li v-for="journey in pageEntries" :key="journey">
        <router-link :to="{ name: 'journey-map', params: { id: journey } }">
          {{ journey }}
        </router-link>
      </li>
      <paginator
        :entriesCount="entries.length"
        v-model:currentPage="currentPage"
      ></paginator>
    </ul>
    <div v-else>Loading journeys...</div>
  </div>
</template>
<script>
import Paginator from "./Paginator.vue";
import api from "../services/index.js";

export default {
  components: {
    Paginator,
  },
  data() {
    return {
      currentPage: 1,
      entriesPerPage: 15,
      journeys: null,
    };
  },
  mounted() {
    this.fetchJourneys();
  },
  computed: {
    visibleNextBtn() {
      return this.currentPage < this.pagesCount;
    },
    visiblePrevBtn() {
      return this.currentPage > 1;
    },
    pagesCount() {
      return Math.ceil(this.journeys.length / this.entriesPerPage);
    },
    entries() {
      return this.journeys;
    },
    startIndex() {
      return this.currentPage * this.entriesPerPage - this.entriesPerPage;
    },
    endIndex() {
      return this.startIndex + this.entriesPerPage;
    },
    pageEntries() {
      const result = this.entries.slice(this.startIndex, this.endIndex);
      return result;
    },
  },
  methods: {
    movePage(step) {
      this.currentPage += step;
    },
    async fetchJourneys() {
      try {
        this.journeys = await api.fetchJourneys();
        console.log("total:" + this.journeys.length);
      } catch (error) {
        console.error("Error fetching journeys:", error);
      }
    },
  },
};
</script>
