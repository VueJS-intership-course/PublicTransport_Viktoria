import axios from "axios";
import { BASE_URL } from "../utils/constants";

const instance = axios.create({
  baseURL: BASE_URL,
});

// API functions
const api = {
  getRoutesLength: () => {
    return instance.get("/journey")
      .then((response) => {
        if (response.data) {
          const journeysCount = Object.keys(response.data).length;
          console.log(`Total routes: ${journeysCount}`);
          return journeysCount;
        } else {
          console.error("Error: ", response.data);
          throw new Error("Error fetching data");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  },

  getBusStopsData: (journeyId) => {
    const apiUrl = `/journey/${journeyId}`;

    return instance.get(apiUrl)
      .then((response) => {
        if (response.data) {
          return response.data.Stops;
        } else {
          console.error("Error: ", response.data);
          throw new Error("Error fetching data");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  },
};

export default api;
