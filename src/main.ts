import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";

// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入样式
import zhCn from "element-plus/es/locale/lang/zh-cn";

// 引入 Bootstrap 样式及js文件
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入 Bootstrap 的 JS 和 Popper

const app = createApp(App);

// 配置 Element Plus 使用中文
app.use(ElementPlus, { locale: zhCn });

app.use(createPinia());

// app.use(ElementPlus)  // 使用 Element Plus 插件

const rootValue = 16;
const rootWidth = 780; //设计稿宽度
const deviceWidth = document.documentElement.clientWidth; //屏幕宽度
document.documentElement.style.fontSize =
  (deviceWidth * rootValue) / rootWidth + "px";

app.mount("#app");
