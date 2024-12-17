import axios from 'axios'
import Storage from './storage'
import { ElMessageBox } from 'element-plus'
import { errorMessage, warningMessage } from '@/utils/message'
// import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import i18n from '@/lang'
import { beforeFileNameShow } from '@/utils/public'
// import router from '@/router/index'
let messageCount = 0
let showMesssageBox = true
const confirmReLogin = (res:any) => {
  const global:any = i18n.global
  const t:any = global.t
  // if (!qiankunWindow.__POWERED_BY_QIANKUN__) 
  {
    return new Promise((resolve:any) => {
      if (showMesssageBox) {
        showMesssageBox = false
        ElMessageBox.confirm(
          `<div class="notice-dialog-class-tipInfo">${t('qingZhongXinDengLu')}</div><div class="notice-dialog-class-detail">${res.msg}。</div>`,
           t('dengChuTiShi'),
          {
            dangerouslyUseHTMLString: true,
            showCancelButton: false,
            confirmButtonText: t('zhongXinDengLu'),
            customClass: 'customDialogCommonClass notice-dialog-class',
            confirmButtonClass: 'yellow-button'
          }
        ).then(() => {
          showMesssageBox = true
          Storage.localRemove('TPA_TOKEN')
        }).catch(() => {
          resolve()
          showMesssageBox = true
        })
      }
    })
  } 
  // else {
  //   location.reload()
  // }
}
const handleError = () => {
  return new Promise((resolve:any) => {
    if (showMesssageBox) {
      showMesssageBox = false
      const global:any = i18n.global
      const t:any = global.t
      warningMessage(t('gaiYeMianQueShaoQingQiuShuJuWuFaJiXuFangWenJiJiangWeiNinTiaoZhuanDaoShouYe'))
      setTimeout(() => {
        showMesssageBox = true
        // router.push('/TPA/home')
      }, 2000)
      resolve('')
    }
  })
}
const createService = (baseURL: string | undefined) => {
  // 超时时间以及基础请求路径
  const _axios = axios.create({
    timeout: 5 * 60 * 1000, // 超时时间
    baseURL
  })

  // 在发送请求之前增加token
  _axios.interceptors.request.use((config: any): object => {
    // let token = Storage.sessionGet('TPA_COMMON_USER').token
    let token = localStorage.getItem('TPA_TOKEN')
    if (token) {
      config.headers['TPA-Token'] = token
    }
    config.headers['TPA-User'] = Storage.sessionGet('TPA_COMMON_USER').userInfo?.id
    config.headers['Accept-Language'] = Storage.localGet('lang') === 'en' ? 'en_US' : 'zh_CN'
    return config
  }, err => {
    return Promise.reject(err)
  })

  // http response 拦截器,处理异常
  _axios.interceptors.response.use(
    async response => {
      if (response.headers['content-type'] === 'application/octet-stream') {
        return response
      }
      let res = response.data
      if (res.type && res.type === 'application/octet-stream') {
        return response
      }
      if (typeof (res) === 'string') {
        res = JSON.parse(res)
      }
      if ([50008, 50009, 50010, 50011, 50012].includes(res.code)) {
        await confirmReLogin(res)
      } else if (res.code !== 20000) {
        handleError()
      } else {
        if (response.config?.headers?.FileFlag) {
          res.data.fileList.forEach((item:any) => {
            item.fileName = beforeFileNameShow(item.fileName)
            return item
          })
        }
        return res
      }
    },
    error => {
      const global:any = i18n.global
      const t:any = global.t
      if (error.config.data && error.config.data instanceof FormData) {
        errorMessage(t('qingJianChaYiShangChuanWenJianShiFouZaiBenDiJinHangLeXiuGaiHuoLianXiGuanLiYuan'))
        loadingClose()
      } else {
        if (messageCount === 0) {
          messageCount++
          errorMessage(t('fuWuYiChangQingLianXiGuanLiYuan'))
        }
      }
      return Promise.reject(error)
    }
  )
  return _axios
}
let basePath = Storage.localGet('ApiUrl')
export const caseServer = createService(basePath.VITE_BASE_API_CASE)
export const commonServer = createService(basePath.VITE_BASE_API_COMMON)
export const scenarioServer = createService(basePath.VITE_BASE_API_SCENARIO)
export const authServer = createService(basePath.VITE_BASE_API_AUTH)
export const testsetServer = createService(basePath.VITE_BASE_API_PROJECT)
export const userServer = createService(basePath.VITE_BASE_API_USER)
