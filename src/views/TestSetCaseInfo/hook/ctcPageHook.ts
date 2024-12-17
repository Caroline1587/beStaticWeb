import { createUUID } from '@/utils/public'
import { PageInfoEmitType } from '@/utils/types/commonType'
import { queryCtcExecutionList } from '@/api/testSetApi'
import { useTestSetStore } from '@/store/index'

export default function () {
  const $store = useTestSetStore()
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
    queryCtcListByInfoRequest()
  }
  let ctcOrderBy = ref('ctc_order asc')
  const queryCtcListByInfoRequest = () => {
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
  return {
    ctcTableAllData,
    ctcTableData,
    ctcPageInfo,
    ctcChangePageInfo,
    queryCtcListByInfoRequest,
    ctcOrderBy
  }
}
