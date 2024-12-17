/**
 * @module 项目loading
 * @desc 1、项目中的loading请统一使用此文件中的方法
 * @desc 2、无需引入,已配置自动导入，直接调用方法即可
 */
import { ElLoading, LoadingOptions } from 'element-plus'
import i18n from '@/lang'
let loading: {
  close: () => void
  visible:{
    value: boolean
  }
}

// loading效果指定区域，若指定当前项目区域则用此常量，禁止重复使用相同字符串！
export const LOADING_TARGET = '.tpa_web_case'

/**
 * @description 开启loading效果
 * @param options LoadingOptions，对应element配置项，指定区域举例：{ target: LOADING_TARGET }
 */
export const loadingStart = (options?:LoadingOptions) => {
  loading?.close()
  const global:any = i18n.global
  const t:any = global.t
  // 若当前已在loading状态，则直接返回
  if (loading?.visible.value) return
  loading = ElLoading.service({
    ...options,
    text: options?.text ? options.text : t('shuJuJiaZaiZhong')
  })
}

/**
 * @description 关闭loading效果
 */
export const loadingClose = () => {
  loading.close()
}
