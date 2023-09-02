import { createApp } from "vue";
import App from "./App.vue";
import { Icon } from "@iconify/vue";

import "./style.css";

createApp(App)
    .component("Icon", Icon)

    .mount("#app");
