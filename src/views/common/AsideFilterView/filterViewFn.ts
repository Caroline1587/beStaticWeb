import Storage from '@/utils/storage'
import { globalParamsStore } from '@/store/index'
import i18n from '@/lang'
// 一些视图模板中需要对新建模板数据中的特殊字段做初始化
export const handleFiterViewSpecialField = (viewType:string) => {
  let result:any = { queryType: 1 }
  switch (viewType) {
    case 'task':
      result = {
        showType: 'board',
        showScope: 'all',
        orderBy: 'taskPrefixAndNumber',
        queryType: 1
      }
      break
    case 'resource_library':
      result = {
        showType: 'board',
        showScope: 'all',
        queryType: 1
      }
      break
    default:
      break
  }
  return result
}
// 一些筛选视图模板中需要对后端的数据做初始化，如：我的任务等
export const handleFiterView = (viewType:string, showViews:any[]) => {
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const global:any = i18n.global
  const t:any = global.t
  // 部分视图模板需要初始化，注意：需要处理国际化情况下的名称
  let result = [...showViews]
  switch (viewType) {
    case 'task':
      result.forEach((item:any) => {
        if (item.filterName === t('woDeRenWu')) { item.filterParam = JSON.stringify({ assignedTo: [USERINFO.id], queryType: 1 }) }
      })
      break
    case 'resource_library':
      result.forEach((item:any) => {
        if (item.filterName === t('woShouCangDe')) { item.filterParam = JSON.stringify({ showScope: 'watch', queryType: 1 }) }
      })
      break
    default:
      break
  }
  return result
}
// 一些视图模板中需要对保存的字段做处理，如：任务中有一些筛选字段是不进入到高级筛选表单的
export const handleSaveFiterView = (viewType:string, filterParam:any) => {
  const globalparamsstore = globalParamsStore()
  const { showType, showScope, orderBy, ...otherParams } = filterParam
  switch (viewType) {
    case 'task':
      // 处理任务中的特殊字段：表格/看板切换，是否展示全部任务，筛选条件等
      globalparamsstore.specialFilterFormData = {
        showType: showType || 'board',
        showScope: showScope || 'all',
        orderBy: orderBy || 'taskPrefixAndNumber'
      }
      globalparamsstore.tempFilterFormData = otherParams
      break
    case 'resource_library':
      // 处理用例库中的特殊字段：表格/看板切换，搜索范围是全部还是收藏数据
      globalparamsstore.specialFilterFormData = {
        showType: showType || 'board',
        showScope: showScope || 'all'
      }
      globalparamsstore.tempFilterFormData = otherParams
      break
    default:
      globalparamsstore.tempFilterFormData = filterParam
      break
  }
}
