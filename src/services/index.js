import axios from "axios";
import { BASE_URL } from "./../utils/constants.js";

export function fetchData() {
  axios
    .get(`${BASE_URL}/journey`)
    .then((response) => {
      if (response.data) {
        const jLength = Object.keys(response.data).length;
        console.log(`Total routes ${jLength}`);
      } else {
        console.error("Error: ", response.data);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

export default fetchData;
