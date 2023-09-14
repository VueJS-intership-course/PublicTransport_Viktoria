import MapComponent from "../components/MapComponent.vue";
import JourneysListComponent from "../components/JourneysList.vue";

export const routes = [
    {
      path: "/",
      components: {
        default: JourneysListComponent,
        map: MapComponent,
      },
      name: "home",
    },
    {
      path: "/journey/:id", 
      components: {
        default: JourneysListComponent,
        map: MapComponent,
      },
      name: "journey-map",
    },
  ];

  export default routes;