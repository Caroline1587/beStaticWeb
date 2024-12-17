import { createApp } from "vue";
import { createPinia } from "pinia";
// import { createI18n } from 'vue-i18n';
import i18n from './lang'

import "./style.css";
import App from "./App.vue";
import router from "./router/index"

// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"; // 引入样式
import zhCn from "element-plus/es/locale/lang/zh-cn";

// 引入 Bootstrap 样式及js文件
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 引入 Bootstrap 的 JS 和 Popper

// 导入你的翻译文件
// import en from './locales/en.json';
// import fr from './locales/fr.json';

// 创建 i18n 实例
// const i18n = createI18n({
//   legacy: false,  // 设置为 false 使用 Composition API
//   locale: 'en',   // 默认语言
//   messages: {
//     // en,
//     // fr,
//   },
// });

const app = createApp(App);

// 安装 i18n 插件
app.use(i18n);

app.use(router);


// 配置 Element Plus 使用中文
app.use(ElementPlus, { locale: zhCn });
// app.use(ElementPlus)  // 使用 Element Plus 插件

app.use(createPinia());


const rootValue = 16;
const rootWidth = 780; //设计稿宽度
const deviceWidth = document.documentElement.clientWidth; //屏幕宽度
document.documentElement.style.fontSize =
  (deviceWidth * rootValue) / rootWidth + "px";

app.mount("#app");
