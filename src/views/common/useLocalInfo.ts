import Storage from '@/utils/storage'
import { globalParamsStore } from '@/store/index'
const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
export const getFilterInfo = (listName:string) => {
  let localInfo = Storage.localGet(`${USERINFO.id}`)
  let info = localInfo[listName]?.filterInfo
  return info ? info : JSON.stringify({ queryType: 1, orderByInfo: '' })
}
export const getFilterKey = (listName:string) => {
  let localInfo = Storage.localGet(`${USERINFO.id}`)
  let info = localInfo[listName]?.filterKey
  return info ? info : ''
}
export const initLocalInfo = (listName:string) => {
  const { queryType, orderByInfo, ...info } = JSON.parse(getFilterInfo(listName))
  const filterKey = getFilterKey(listName)
  const globalparamsstore = globalParamsStore()
  globalparamsstore.filterKey = filterKey
  globalparamsstore.showSearch = filterKey !== ''
  globalparamsstore.filterFormData = JSON.parse(JSON.stringify(info))
  globalparamsstore.tempFilterFormData = JSON.parse(JSON.stringify(info))
  globalparamsstore.queryType = queryType
  console.log(orderByInfo)
  // defaultSort.value = orderByInfo.split(' ')
  // orderBy.value = toUnderLine(defaultSort.value[0])
  // defaultSort.value[1] === 'descending' ? orderBy.value += ' desc' : orderBy.value += ''
}
