/**
 * @module 项目下需要自动导入的API
 * @desc 1、无需引入,已配置自动导入，直接调用方法即可
 * @desc 2、baseLoading 自动导入loading相关API
 * @desc 3、routeParamsStore 自动导入路由传参API
 */

import { loadingStart, loadingClose, LOADING_TARGET } from '../baseLoading'
import { routeParamsStore, globalPropsStore } from '@/store/index'

const getRouteParamsStore = () => {
  return routeParamsStore()
}

const getGlobalPropsStore = () => {
  return globalPropsStore()
}

export {
  loadingStart,
  loadingClose,
  LOADING_TARGET,
  getRouteParamsStore,
  getGlobalPropsStore
}
