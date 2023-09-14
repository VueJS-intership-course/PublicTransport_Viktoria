import MapComponent from "../components/MapComponent.vue";
import JourneysListComponent from "../components/JourneysList.vue";

export const routes = [
  {
    path: "/", 
    redirect: "/journey", 
  },
  {
    path: "/journey/:id?", 
    components: {
      default: JourneysListComponent,
      map: MapComponent,
    },
    name: "journey-map",
  },
  ];

  export default routes;