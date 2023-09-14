import axios from "axios";
import { BASE_URL } from "../utils/constants";

const instance = axios.create({
  baseURL: BASE_URL,
});

const api = {
  async fetchJourneys() {
    try {
      const response = await instance.get("/journey");
    //   console.log("response", Object.keys(response.data));
      return Object.keys(response.data); 
    } catch (error) {
      console.error("Error fetching journeys:", error);
      throw error;
    }
  },

  async fetchBusStops(journeyId) {
    try {
      const response = await instance.get(`/journey/${journeyId}`);
      return response.data[journeyId]; 
    } catch (error) {
      console.error("Error fetching bus stops:", error);
      throw error;
    }
  },
};

export default api;

