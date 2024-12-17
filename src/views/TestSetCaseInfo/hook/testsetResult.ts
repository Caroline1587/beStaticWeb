import { ref, nextTick } from 'vue'
// import Storage from '@/utils/storage'
import { queryCtcExecutionList, queryResultHistoryList } from '@/api/testSetApi'
// import { getFileList } from '@/api/fileApi'
// import { savedFileListType } from '@/utils/types/testcaseType'
// import { savedFileListType } from '../../../utils/types/testcaseType'
import { useTestSetStore } from '@/store/index'
import { createUUID } from '@/utils/public'
import { PageInfoEmitType } from '@/utils/types/commonType'
// import { UploadFileResponse } from '@/utils/types/testSetType'

export default function () {
  // loading
  let fullLoading = ref(false)
  const $store = useTestSetStore()
  // 折叠面板
  let activeNames:any = ref([])
  const handleChange = (val: string[]) => {
    // 1、val不存在则代表关闭，不需要请求数据
    // if (!val || val.length === 0) return
    // recordId.value = val[0]
    // getRecordInfo()
    // getFileListByFileRequest()
  }
  // 结果记录列表
  let ctcExecutionList = ref([])
  let testcaseInfoCopy = ref()
  // 获取结果记录列表
  const queryTestsetTestcaseResultHistoryList = () => {
    let data = {
      testsetId: $store.testSetRow.testsetId,
      testcaseId: $store.testSetRow.testcaseId
    }
    queryResultHistoryList(data).then(async (res) => {
      fullLoading.value = false
      ctcExecutionList.value = res.data.result
      // console.log(res.data.result[0].id, 'res.data.result[0].id')

      // 根据第一条结果记录获取对应的详情
      if (!res.data.result[0].id) return
      // 测试用例详情，1、包含了ctc列表（含有名称等信息）；2、包含逻辑用例信息
      testcaseInfoCopy.value = JSON.parse(res.data.result[0].testcaseInfoCopy)
      console.log(testcaseInfoCopy.value, 'testcaseInfoCopy.value')

      // recordId.value = res.data.result[0].id
      // await getRecordInfo()
      // getFileListByFileRequest()
      nextTick(() => {
        // 展开面板
        activeNames.value = [res.data.result[0].id]
      })
    }).catch(() => {
      fullLoading.value = false
    })
  }
  // 根据fileId和类别获取文件
  // let fileList = ref<savedFileListType[]>([])
  // const getFileListByFileRequest = () => {
  //   let data = {
  //     fileId: recordId.value,
  //     fileCategory: 'testset_result_file'
  //   }
  //   return getFileList(data).then(res => {
  //     fileList.value = res.data.fileList.map((item:UploadFileResponse) => {
  //       return {
  //         ...item,
  //         name: item.fileName
  //       }
  //     })
  //     // console.log(fileList.value)
  //   }).catch()
  // }
  // 详情页面查询ctc
  let ctcTableAllData = ref()
  let ctcTableData = ref()
  let ctcPageInfo = ref({
    pageNo: 1,
    pageSize: 20,
    totalPage: 0,
    totalRecord: 0
  })
  // ctc 分页
  const ctcChangePageInfo = (page: PageInfoEmitType) => {
    ctcPageInfo.value.pageNo = page.pageNo
    ctcPageInfo.value.pageSize = page.pageSize
    queryCtcListByInfo()
  }
  let ctcOrderBy = ref('ctc_order asc')
  const queryCtcListByInfo = () => {
    let data = {
      pageNo: ctcPageInfo.value.pageNo,
      pageSize: ctcPageInfo.value.pageSize,
      orderBy: ctcOrderBy.value,
      params: {
        testcaseId: $store.testSetRow?.testcaseId as string,
        testsetId: $store.testSetRow?.testsetId,
        executionStatus: '',
        executionResult: '',
        queryModel: 1,
        queryParams: ''
      }
    }
    return queryCtcExecutionList(data).then(res => {
      ctcTableAllData.value = res.data
      ctcTableData.value = res.data.testsetCtcExecutionList?.map((item:any) => {
        return {
          ...item,
          id: item.ctcId,
          stepResultList: res.data.stepList.map((stepItem:any) => {
            // 若之前保存过测试步骤则此处进行回显
            let findStep = item.stepResultList.find((step:any) => step.stepId === stepItem.id)
            if (findStep) {
              return {
                ...findStep,
                ctcId: item.ctcId,
                testStep: stepItem?.testStep,
                expectResult: stepItem?.expectResult
              }
            } else {
              return {
                ...stepItem,
                stepId: stepItem.id,
                id: createUUID(),
                ctcId: item.ctcId,
                actualResult: '',
                executionResult: ''
              }
            }
          })
        }
      })
      ctcPageInfo.value.totalRecord = res.data.pageInfo.totalRecord
      // console.log(ctcTableData.value, 'ctcTableData.value ')

      return res.data
    }).catch()
  }
  // 文本用例结果数据
  let textResult = ref<any>({})
  return {
    activeNames,
    handleChange,
    fullLoading,
    queryTestsetTestcaseResultHistoryList,
    ctcExecutionList,
    // getRecordInfo,
    // ctcResultList,
    testcaseInfoCopy,
    // fileList,
    ctcTableAllData,
    ctcTableData,
    ctcPageInfo,
    ctcChangePageInfo,
    queryCtcListByInfo,
    ctcOrderBy,
    textResult
    // getFileListByFileRequest
  }
}
