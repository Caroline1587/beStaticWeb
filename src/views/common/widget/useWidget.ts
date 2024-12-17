import { defineAsyncComponent } from 'vue'
// vite 构建
let modules: { [key: string]: any } = {}
const Files = import.meta.glob('../widget/*.vue')
for (const [key, value] of Object.entries(Files)) {
  const name = key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
  modules[name] = defineAsyncComponent(value)
}
export default modules
