import { getTestcaseList, exportTestcaseByAE } from '@/api/testcaseApi'
import { getAllFolders } from '@/api/commonApi'
import { routeParamsStore, globalParamsStore, globalPropsStore } from '@/store/index'
import { TESTCASE_TEMPLATETYPE, TESTCASE_TESTTYPE } from '@/utils/constant'
import useRequestList from '@/views/common/useRequestList'
import moment from 'moment'
import Storage from '@/utils/storage'
import { errorMessage } from '@/utils/message'

export default function (caseType: 'testcase_project' | 'testcase_library') {
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const routeparamsstore = routeParamsStore()
  const globalparamsstore = globalParamsStore()
  const globalPropsstore = globalPropsStore()
  const { t } = useI18n()
  // 文件夹树形结构
  const asideTree = ref()
  const treeData = ref<any[]>([])
  const initTreeFolder = () => {
    loadingStart({ target: LOADING_TARGET })
    getAllFolders({
      libraryId: currentDataId,
      parentId: '',
      type: caseType,
      userId: USERINFO.id
    }).then(res => {
      treeData.value = res.data.result
      nextTick(() => {
        setTimeout(() => {
          let currentFolderId = caseType === 'testcase_project' ? routeparamsstore.caseInfo.projectFolderId : routeparamsstore.caseInfo.resourceFolderId
          let id = treeData.value[0].id
          let node:any = null
          // 解决加文件夹权限后有些节点被删掉后id失效问题
          if (currentFolderId) {
            const node = asideTree.value.hiTreeRef.treeRef.getNode(currentFolderId)
            if (node) id = currentFolderId
          }
          // 不能直接获取表格数据而是通过树形设置当前节点的原因：解决一些缓存问题，直接设置的话当前树形选中效果会失效
          nextTick(() => {
            node = asideTree.value.hiTreeRef.treeRef.getNode(id)
            asideTree.value.hiTreeRef.treeRef.setCurrentKey(id)
            asideTree.value.hiTreeRef.nodeClick(node.data, node)
          })
        }, 500)
      })
    }).catch(() => {
      loadingClose()
    })
  }
  const listBtn = ref()
  const getMaxLevel = (arr:any[]) => {
    let maxLevel = 0
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].level > maxLevel) {
        maxLevel = arr[i].level
      }
      if (arr[i].children?.length > 0) maxLevel = getMaxLevel(arr[i].children)
    }
    return maxLevel
  }
  const toExportAEReport = async (id:string) => {
    const node = asideTree.value.hiTreeRef.treeRef.getNode(id)
    const currentLevel = node.level
    const maxLevel = getMaxLevel([node])
    if (maxLevel - currentLevel < 6) {
      globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
      const res = await exportTestcaseByAE({
        folderId: id,
        projectId: currentDataId,
        userId: USERINFO.id,
        type: caseType
      })
      globalPropsstore.fileStore.commonFileDownLoad({ url: res.data })
    } else {
      errorMessage(t('wenJianJiaCengJiChaoGuo_6JiWuFaDaoChu'))
    }
  }
  const exportOrImport = (cmd: 'import' | 'export' |'commitCase' | 'pullCase'|'export-AE', id:string) => {
    switch (cmd) {
      case 'import':
        listBtn.value.showImportDialog()
        break
      case 'export':
        listBtn.value.exportCommand('exportCase')
        break
      case 'export-AE':
        toExportAEReport(id)
        break
      default:
        break
    }
  }
  const submitForm = () => {
    globalparamsstore.filterFormData = JSON.parse(JSON.stringify(globalparamsstore.tempFilterFormData))
    initList()
  }
  // 表格展示数据
  let initCaseListParams:any = {}
  const initTable = () => {
    let order = orderBy.value
    if (orderBy.value.startsWith('create_user_name') || orderBy.value.startsWith('ctc_num')) {
      order = order.replace(/(create_user_name)|(ctc_num)/g, defaultSort.value[0])
    }
    initCaseListParams = {
      rootId: currentDataId,
      sourceType: caseType,
      parentId: caseType === 'testcase_project' ? routeparamsstore.caseInfo.projectFolderId : routeparamsstore.caseInfo.resourceFolderId,
      userId: USERINFO.id,
      folderLevel: caseType === 'testcase_project' ? routeparamsstore.caseInfo.projectFolderLevel : routeparamsstore.caseInfo.resourceFolderLevel
    }
    if (globalparamsstore.filterKey) {
      initCaseListParams = {
        ...initCaseListParams,
        testcaseNumber: globalparamsstore.filterKey,
        testcaseName: globalparamsstore.filterKey,
        queryType: 2
      }
    } else {
      initCaseListParams = {
        ...initCaseListParams,
        ...globalparamsstore.handledFilterFormData,
        customFieldList: []
      }
      initCaseListParams = {
        ...initCaseListParams,
        testType: initCaseListParams.testType?.replace('2,1', '1,2')
      }
    }
    // 为了详情页的上一页下一页，保存参数
    routeparamsstore.pageInfo.params = initCaseListParams
    routeparamsstore.pageInfo.orderBy = orderBy.value
    let params = {
      pageNo: pageInfo.value.pageNo,
      pageSize: pageInfo.value.pageSize,
      orderBy: order,
      params: JSON.stringify(initCaseListParams)
    }
    return new Promise((resolve, reject) => {
      getTestcaseList(params).then(res => {
        pageInfo.value.totalRecord = res.data.totalRecord
        res.data.resultList.forEach((item:any) => {
          item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        })
        resolve(res.data.resultList)
      }).catch(err => {
        reject(err)
      })
    })
  }
  const data = computed(() => {
    return tableData.value.map((item:any) => {
      item.testType = TESTCASE_TESTTYPE[item.testType]
      item.templateType = TESTCASE_TEMPLATETYPE[item.templateType]
      item.requireNumberAndId = item.requireNumberAndId ? item.requireNumberAndId.substring(0, item.requireNumberAndId.length - 33) : ''
      return item
    })
  })
  const { tableData, pageInfo, selectIds, selectIdsObj, selectTableData, orderBy, initList, tableBtnType, changeSortRules, defaultSort, changePageInfo, tableProps, handleTableProps, getSelection, setColumWidthInfo, getColumWidth } = useRequestList(initTable, `${currentDataId}_${caseType}List`)
  watch(() => globalparamsstore.initTree, newValue => {
    if (newValue) {
      initTreeFolder()
    }
  })
  // 表格行删除操作
  const deleteDialogRef = ref()
  const toConfimDelete = (nameOrNumber: string, id: string[], isSingle?:boolean, createType?: number) => {
    // createType:1是删除，2是移除
    deleteDialogRef.value.showDeleteDialog(nameOrNumber, JSON.stringify(id), isSingle, createType)
  }
  // 路由跳转前保存分页和筛选信息
  const beforeToTestcaseInfo = (index: number, row: any) => {
    // routeparamsstore.caseInfo.caseId = row.id
    routeparamsstore.caseInfo.caseName = row.testcaseNumber
    routeparamsstore.pageInfo.currentIndex = (pageInfo.value.pageNo - 1) * pageInfo.value.pageSize + (index + 1)
    routeparamsstore.pageInfo.totalRecord = pageInfo.value.totalRecord
    routeparamsstore.pageInfo.upAndDownBtn = true
  }
  const reload = () => {
    initTreeFolder()
    initList()
  }
  return {
    // 树形
    asideTree,
    treeData,
    initTreeFolder,
    // 表格
    data,
    initList,
    defaultSort,
    tableBtnType,
    setColumWidthInfo,
    getColumWidth,
    // 表格分页
    pageInfo,
    changePageInfo,
    changeSortRules,
    // 表格控制列是否展示
    tableProps,
    handleTableProps,
    // 表格行选中
    selectTableData,
    selectIds,
    selectIdsObj,
    getSelection,
    // 表格行删除功能
    deleteDialogRef,
    toConfimDelete,
    // 路由跳转
    beforeToTestcaseInfo,
    // 其他
    reload,
    listBtn,
    exportOrImport,
    submitForm
  }
}
