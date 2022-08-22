import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// import "./assets/main.css";
import "./index.css";
// TailWind 和 Element Plus 有冲突, 所以将 Element Plus 的样式放到后边
import "element-plus/dist/index.css";

import ECharts from "vue-echarts";

const app = createApp(App);

// register globally (or you can do it locally)
app.component("v-chart", ECharts);
app.use(createPinia());
app.use(router);

app.mount("#app");
