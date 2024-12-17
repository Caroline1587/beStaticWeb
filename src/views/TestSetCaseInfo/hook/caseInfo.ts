/*
 * @Author: luyao.feng luyao.feng@hirain.com
 * @Date: 2024-09-02 18:06:37
 * @LastEditors: luyao.feng luyao.feng@hirain.com
 * @LastEditTime: 2024-09-25 13:52:59
 * @FilePath: \tpa_web_maind:\work\TPA5.0-branch-build\dev\tpa_web_case\src\views\TestSetCaseInfo\hook\caseInfo.ts
 * @Description: 测试集跳转用例
 */
  import { infoMessage } from '@/utils/message'
  import { queryTestsetAllInfo, queryTestsetTestcaseInfo, queryTestcaseExecutionList, queryFiledTestsetTestcaseInfo } from '@/api/testSetApi'
  import { getVariableByClass } from '@/api/testcaseApi'
  import { LtcDataType, CtcDataType, savedFileListType, CaseRequiresType } from '@/utils/types/testcaseType'
  import { VariableClass } from '@/utils/types/addTestcaseType'
  import { getltcData } from '@/views/ResourceCase/addTestcase/components/caseDtailData'
  import { routeParamsStore } from '@/store'
  import { formatTextHtml, formatImageHtml } from '@/views/ResourceCase/addTestcase/components/transHtml'
  import Storage from '@/utils/storage'

  export default function (caseType:'testcase_project'|'testcase_library') {
    const { t } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const routeparamsstore = routeParamsStore()
    /* ************ 用例详情页面 ************************ */
    const allCaseInfo = ref<any>({
      templateType: 1,
      testType: 1,
      priority: 1
    })
    const ltcData = ref<LtcDataType[]>([])
    const ctcData = ref<CtcDataType[]>([])
    // 具体用例信息
    let ltcInfo = ref({
      preConditionDesc: '',
      resetDesc: '',
      testStep: '',
      expectResult: ''
    })
    const reload = ref<boolean>(false)
    const fullLoading = ref(false)
    const activeName = ref('caseDetail')
    const caseBasicInfo = ref<{
      [key:string]:string|number
    }>({
      id: '',
      createType: 1,
      testcaseNumber: '',
      testcaseName: '',
      sourceType: 2
    })
    // 快捷键
    const keyUpEvent = (e:any) => {
      if (e.keyCode === 37) {
        pageUp()
      } else if (e.keyCode === 39) {
        pageDown()
      } else if (e.key === 'E') {
        toEditTestcase()
      }
    }
    const globalpropsstore = getGlobalPropsStore()
    const toEditTestcase = () => {
      if (caseType === 'testcase_project') {
        globalpropsstore.commonRouter({ path: `/projectCase/editProjectCase/${routeparamsstore.caseInfo.caseId}`, view: 'project' })
      } else {
        globalpropsstore.commonRouter({ path: `/libraryCase/editTestCase/${testSetRow.value.testcaseId}`, view: 'testCase' })
      }
    }
    // 分页数据以及测试用例数据发生变化
    // 底部的功能
    let pageInfo = ref(Storage.sessionGet('PAGE_INFO'))
    const testSetRow = ref<any>({
      testsetId: route.params.testsetId as string,
      testcaseId: route.params.caseId as string,
      testsetStatus: 0,
      testcaseCopyInfo: ''
    })
    const testSetRowInit = () => {
      testSetRow.value.testsetId = route.params.testsetId as string
      testSetRow.value.testcaseId = route.params.caseId as string
      testSetRow.value.testsetStatus = 0
      testSetRow.value.testcaseCopyInfo = ''
    }
    const getNearInfo = (targetIndex:number) => {
      let initPageParams = {
        pageNo: targetIndex,
        pageSize: 1,
        orderBy: pageInfo.value.orderBy,
        params: pageInfo.value.params
      }
      queryTestcaseExecutionList(initPageParams).then(async (res) => {
        let newId = res.data.testsetLtcExecutionList[0].testcaseId
        testSetRow.value = {
          ...testSetRow.value,
          ...res.data.testsetLtcExecutionList[0]
        }
        testSetRow.value.testcaseId = newId
        pageInfo.value.currentIndex = targetIndex
        Storage.sessionSet('PAGE_INFO', pageInfo.value)
        globalpropsstore.commonRouter({ path: `/testsetCase/${testSetRow.value.testsetId}/testSetCaseInfo/${testSetRow.value.testcaseId}`, view: 'project' })
        await getCaseInfo()
        // console.log(testSetRow.value, 'testSetRow')
        reload.value = true
      })
    }
    const pageUp = () => {
      reload.value = false
      if (pageInfo.value.currentIndex > 1) {
        getNearInfo(pageInfo.value.currentIndex - 1)
      } else {
        infoMessage(t('yiJingShiDiYiTiaoShuJu'))
      }
    }
    const pageDown = () => {
      reload.value = false
      if (pageInfo.value.currentIndex < pageInfo.value.totalRecord) {
        getNearInfo(pageInfo.value.currentIndex + 1)
      } else {
        infoMessage(t('yiJingShiZuiHouYiTiaoShuJu'))
      }
    }
    // 获取数据
    let fileList = ref<savedFileListType[]>([])
    let fileObj = ref<{[key:string]:string}>({})
    let requires = ref<CaseRequiresType[]>([])
    // 对数据进行处理
    const getData = (data:any) => {
      fileList.value = data.avatarList
        fileObj.value = {}
        fileList.value.forEach((item:any) => {
          fileObj.value[item.id] = item.fileUrl
        })
        Object.keys(caseBasicInfo.value).forEach(k => {
          caseBasicInfo.value[k] = data.testcaseInfo[k]
        })
        allCaseInfo.value = data.testcaseInfo
        ltcInfo.value = {
          preConditionDesc: formatImageHtml(data.testcaseInfo.preConditionDesc, fileObj.value),
          resetDesc: formatImageHtml(data.testcaseInfo.resetDesc, fileObj.value),
          testStep: formatImageHtml((allCaseInfo.value.templateType === 1 && data.ltcs.length > 0) ? data.ltcs[0].testStep : '', fileObj.value),
          expectResult: formatImageHtml((allCaseInfo.value.templateType === 1 && data.ltcs.length > 0) ? data.ltcs[0].expectResult : '', fileObj.value)
        }
        ctcData.value = data.ctcs
        ltcData.value = getltcData(data.ltcs).map((item:any) => {
          let temp:{[key:string]:string} = {}
          tableDataColumn.value.forEach(k => {
            temp[k] = formatTextHtml(item[k], variableOtions.value, fileObj.value)
          })
          return {
            ...item,
            ...temp
          }
        })
        requires.value = data.requires
    }
    const getCaseInfo = async () => {
      const res = await queryTestsetAllInfo(testSetRow.value.testsetId)
      const { testsetBasicInfo } = res.data
      testSetRow.value = {
        ...testSetRow.value,
        testsetStatus: testsetBasicInfo.testsetStatus,
        testsetCategory: testsetBasicInfo.testsetCategory
      }
      pageInfo.value = Storage.sessionGet('PAGE_INFO')
      if (testSetRow.value.testsetStatus === 6) {
        // 测试集基本信息获取testsetStatus； 如果归档，新接口获取testcaseCopyInfo用于展示；
        const res = await queryFiledTestsetTestcaseInfo(testSetRow.value.testsetId, testSetRow.value.testcaseId)
        getData(JSON.parse(res.data.res.testcaseCopyInfo))
        return
      }
      const caseId = testSetRow.value.testcaseId
      const caseRes = await queryTestsetTestcaseInfo({ id: caseId })
      getData(caseRes.data)
      fullLoading.value = false
    }
    // 处理前置条件、复位步骤图片
    const getImgUrl = (testStep:string) => {
      return formatImageHtml(testStep, fileObj.value)
    }
    // 处理期望结果、测试步骤图片以及变量
    const getImageHtml = (testStep:string) => {
      return formatTextHtml(testStep, variableOtions.value, fileObj.value)
    }
    // 获取变量和变量单位
    const variableOtions = ref<VariableClass[]>([])
    const variableUnitSet = ref<{[key:string]:string}>({})
    const getVariable = () => {
      return getVariableByClass(1).then(res => {
        // 接口返回的数组中会出现null的Item项，进行过滤
        variableOtions.value = res.data.result.filter((item:VariableClass) => item)
        // 处理变量数据保证快速找到单位，用于ctcAside组件获取描述信息数据
        variableUnitSet.value = {}
        variableOtions.value.forEach(item => {
          variableUnitSet.value[item.variableName] = item.variableUnit
        })
      }).catch()
    }
    const tableDataColumn = ref(['desc', 'result'])
    // 保持路由和tab页对应
    watch(() => router.currentRoute.value.path, (newValue) => {
      let temparr = newValue.split('/')
      activeName.value = temparr[temparr.length - 1]
    }, { immediate: true })

    return {
      allCaseInfo,
      ltcInfo,
      ltcData,
      ctcData,
      reload,
      activeName,
      caseBasicInfo,
      pageUp,
      pageDown,
      toEditTestcase,
      getCaseInfo,
      testSetRowInit,
      variableOtions,
      variableUnitSet,
      fileList,
      fileObj,
      fullLoading,
      requires,
      keyUpEvent,
      getVariable,
      testSetRow,
      pageInfo,
      getImgUrl,
      getImageHtml
    }
  }
