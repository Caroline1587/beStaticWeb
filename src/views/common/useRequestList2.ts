import { ref, Ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { PageInfoPropsType, PageInfoEmitType, TablePropsType } from '@/utils/types/commonType'
import { toUnderLine } from '@/utils/public'
import { globalParamsStore2 } from '@/store/index'
import Storage from '@/utils/storage'
import { TABLE_FIELD_TYPE_WIDTH } from '@/utils/constant'
import { isNumber, isString } from 'lodash'

export const useColumWidth = (listName:string) => {
  // 项目下的名称格式为 id_name，列宽缓存按模块进行缓存，此处排除带id的情况
  const listNameArr = listName.split('_')
  let listNameStr = listNameArr.length > 1 ? listNameArr.slice(1).join('_') : listNameArr[0]
  listNameStr += 'WidthInfo'
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  // 保存列宽数信息到本地，注意：需要缓存宽度的表格必须加上 header-dragend 事件！！！！
  const setColumWidthInfo = (newWidth:number, oldWidth:number, column:any) => {
    let localInfo = Storage.localGet(`${USERINFO.id}`) || {}
    localInfo[listNameStr] = localInfo[listNameStr] || {}
    if (localInfo[listNameStr].columWidthInfo) {
      localInfo[listNameStr].columWidthInfo = JSON.stringify({
        ...JSON.parse(localInfo[listNameStr]?.columWidthInfo),
        [column.property]: newWidth
      })
    } else {
      localInfo[listNameStr].columWidthInfo = JSON.stringify({
        [column.property]: newWidth
      })
    }
    Storage.localSet(`${USERINFO.id}`, localInfo)
  }
  const getColumWidthInfo = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`)
    let info = localInfo[listNameStr]?.columWidthInfo
    return info ? JSON.parse(info) : false
  }
  const columWidthInfo = getColumWidthInfo()
  /**
   * @param prop 当前列的prop属性
   * @param defaultWidthOrProp 若查不到当前prop的缓存则需要的给的默认值
   * @returns 当前列宽
   */
  const getColumWidth = (prop:string, defaultWidthOrProp?:number | string) => {
    // 默认宽度180
    let width = 180
    // 存在缓存采用缓存数据
    if (columWidthInfo[prop]) {
      width = columWidthInfo[prop]
    } else if (isString(defaultWidthOrProp)) {
      // 没有缓存，且defaultWidthOrProp是string类型，则读取默认值
      width = TABLE_FIELD_TYPE_WIDTH[defaultWidthOrProp]
    } else if (isNumber(defaultWidthOrProp)) {
      // 传入的是number则直接赋值
      width = defaultWidthOrProp
    }
    return width
  }
  return {
    setColumWidthInfo,
    getColumWidthInfo,
    columWidthInfo,
    getColumWidth
  }
}

export default function useList (ListRequestFn:(...args: any) => Promise<any>, listName = '') {
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const globalparamsstore = globalParamsStore2()
  const tableData = ref<any[]>([]) as Ref<any[]>
  // 是否开始加载高级筛选表单标识
  const isShowFilterFrom = ref(false)

  const initList = () => {
    loadingStart({ target: LOADING_TARGET })
    // 保存筛选条件
    setFilterInfo()
    setFilterKey()
    // 保存分页数据
    setPageInfo()
    // 请求数据
    let promise = ListRequestFn()
    promise.then((data:any) => {
      tableData.value = data
      // 列表数据完成后开始加载高级筛选表单
      isShowFilterFrom.value = true
      loadingClose()
    }).catch().finally(() => {
      loadingClose()
    })
  }
  // 表格排序
  const orderBy = ref('')
  const changeSortRules = (prop: string, order: string) => {
    // 注意：这里认为属性名长度为32位即认为是自定义属性的排序，一般正常的属性名不会到32位
    orderBy.value = prop.length === 32 ? `_${prop}` : toUnderLine(prop)
    order === 'descending' ? orderBy.value += ' desc' : orderBy.value += ''
    defaultSort.value = [prop, order]
    initList()
  }
  // 分页
  const pageInfo = ref<PageInfoPropsType>({
    pageNo: 1,
    pageSize: 20,
    totalPage: 0,
    totalRecord: 0
  })
  const changePageInfo = (page: PageInfoEmitType) => {
    pageInfo.value.pageNo = page.pageNo
    pageInfo.value.pageSize = page.pageSize
    initList()
  }
  const tableProps = ref<TablePropsType[]>([])
  const handleTableProps = (val: TablePropsType[]) => {
    tableProps.value = val
  }
  // 表格行选中
  const selectTableData = ref<any[]>([])
  const selectIds = ref<string[]>([])
  const selectIdsObj = ref<{[key:string]:boolean}>({})
  const tableBtnType = ref(true)

  const getSelection = (selection: any[]) => {
    tableBtnType.value = selection.length === 0
    selectTableData.value = selection
    selectIds.value = selection.map(item => item.id)
    selectIdsObj.value = {}
    selection.forEach(item => {
      selectIdsObj.value[item.id] = true
    })
  }
  // 监听页面变化数据
  watch(() => globalparamsstore.initFlag, newValue => {
    if (newValue) {
      initList()
    }
  })
  // 保存分页数据信息到本地
  const setPageInfo = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`) || {}
    localInfo[listName] = localInfo[listName] || {}
    localInfo[listName].pageInfo = JSON.stringify({
      pageNo: pageInfo.value.pageNo,
      pageSize: pageInfo.value.pageSize
    })
    Storage.localSet(`${USERINFO.id}`, localInfo)
  }
  const getPageInfo = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`)
    let info = localInfo[listName]?.pageInfo
    return info ? info : JSON.stringify(pageInfo.value)
  }
  const defaultSort = ref(['', ''])
  // 保存高级筛选信息到本地
  const setFilterInfo = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`) || {}
    localInfo[listName] = localInfo[listName] || {}
    localInfo[listName].filterInfo = JSON.stringify({ ...globalparamsstore.filterFormData, queryType: globalparamsstore.queryType, orderByInfo: defaultSort.value.join(' ') })
    Storage.localSet(`${USERINFO.id}`, localInfo)
  }
  const getFilterInfo = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`)
    let info = localInfo[listName]?.filterInfo
    return info ? info : JSON.stringify({ queryType: 1, orderByInfo: '' })
  }
  // 保存普通筛选信息到本地
  const setFilterKey = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`) || {}
    localInfo[listName] = localInfo[listName] || {}
    localInfo[listName].filterKey = globalparamsstore.filterKey
    Storage.localSet(`${USERINFO.id}`, localInfo)
  }
  const getFilterKey = () => {
    let localInfo = Storage.localGet(`${USERINFO.id}`)
    let info = localInfo[listName]?.filterKey
    return info ? info : ''
  }
  const initLocalInfo = () => {
    const { queryType, orderByInfo, ...info } = JSON.parse(getFilterInfo())
    const filterKey = getFilterKey()
    globalparamsstore.filterKey = filterKey
    globalparamsstore.showSearch = filterKey !== ''
    globalparamsstore.filterFormData = JSON.parse(JSON.stringify(info))
    globalparamsstore.tempFilterFormData = JSON.parse(JSON.stringify(info))
    globalparamsstore.queryType = queryType
    defaultSort.value = orderByInfo.split(' ')
    orderBy.value = defaultSort.value[0].length === 32 ? `_${defaultSort.value[0]}` : toUnderLine(defaultSort.value[0])
    defaultSort.value[1] === 'descending' ? orderBy.value += ' desc' : orderBy.value += ''
    let cachePageInfo = JSON.parse(getPageInfo())
    pageInfo.value.pageNo = cachePageInfo.pageNo
    pageInfo.value.pageSize = cachePageInfo.pageSize
  }
  const getLocalInfo = () => {
    initLocalInfo()
  }
  // 本地数据初始化
  onMounted(() => {
    if (listName) getLocalInfo()
  })
  onBeforeUnmount(() => {
    globalparamsstore.showAdvanceSearch = false
  })
  // 将缓存列宽的方法在此处暴露出去，方便同表格其他API一起使用
  const { setColumWidthInfo, getColumWidth } = useColumWidth(listName)
  return {
    isShowFilterFrom,
    tableData,
    tableBtnType,
    pageInfo,
    tableProps,
    changeSortRules,
    handleTableProps,
    setColumWidthInfo,
    getColumWidth,
    changePageInfo,
    initList,
    getSelection,
    selectTableData,
    selectIds,
    orderBy,
    selectIdsObj,
    defaultSort
  }
}
