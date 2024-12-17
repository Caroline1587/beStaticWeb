import { createPinia } from 'pinia'
// 持久化处理
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 引入根据模块封装好的状态管理
import { routeParamsStore } from './modules/routeParamsStore'
import { useTestSetStore } from './modules/testSetStore'
import { variableStore } from './modules/variableStore'
import { globalParamsStore } from './modules/globalParamsStore'
import { globalParamsStore2 } from './modules/globalParamsStore2'
import { templateStore } from './modules/templateStore'
import { globalPropsStore } from './modules/globalPropsStore'

// 创建pinia状态管理对象
const pinia = createPinia()
// pinia持久化配置
pinia.use(piniaPluginPersistedstate)
// 暴露根据模块封装好的状态管理
export { routeParamsStore, useTestSetStore, variableStore, globalParamsStore, templateStore, globalParamsStore2, globalPropsStore }
// 暴露pinia状态管理对象
export default pinia
