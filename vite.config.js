import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// import { fileURLToPath, URL } from 'node:url'
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
export default defineConfig({
    base: "./",
    plugins: [
        vue(),
        //引入vue 插件
        AutoImport({
            imports: ["vue"],
            dts: "src/auto-import.d.ts",
        }),
        //plus按需引入
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        //plus按需引入
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            // '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@': path.resolve(__dirname, 'src'), // 确保路径正确指向你的源代码目录
            '/img': './src/assets'
        },
    },
    build: {
        minify: "terser", // 必须开启：使用terserOptions才有效果
        terserOptions: {
            compress: {
                //生产环境时移除console
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    server: {
        //使用IP能访问
        host: "0.0.0.0",
        // 热更新
        hmr: true,
        //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
        strictPort: false,
        port: 3000, //运行 vite 开发服务器时，本地3000端口启动
        proxy: {
            "/api": {
                target: "http://127.0.0.1:9999",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ""); },
            },
        },
    },
});
