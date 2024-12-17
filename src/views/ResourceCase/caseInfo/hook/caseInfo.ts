  import { infoMessage } from '@/utils/message'
  import { useRoute, useRouter } from 'vue-router'
  import { getTestcaseById, getTestcaseList, getVariableByClass } from '@/api/testcaseApi'
  import { routeParamsStore, variableStore } from '@/store/index'
  import { LtcDataType, CtcDataType, savedFileListType, CaseRequiresType } from '@/utils/types/testcaseType'
  import { VariableClass } from '@/utils/types/addTestcaseType'
  import { getltcData } from '@/views/ResourceCase/addTestcase/components/caseDtailData'
  import { formatTextHtml, formatImageHtml } from '@/views/ResourceCase/addTestcase/components/transHtml'
  import Storage from '@/utils/storage'
  import caseBeforeEach from '@/router/caseBeforeEach'

  export default function (caseType:'testcase_project'|'testcase_library') {
    const { t } = useI18n()
    const routeparamsstore = routeParamsStore()
    const variablestore = variableStore()
    const router = useRouter()
    const route = useRoute()
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
    const toEditTestcase = () => {
      const globalpropsstore = getGlobalPropsStore()
      if (caseType === 'testcase_project') {
        globalpropsstore.commonRouter({ path: `/projectCase/editProjectCase/${routeparamsstore.caseInfo.caseId}`, view: 'project' })
      } else {
        globalpropsstore.commonRouter({ path: `/libraryCase/editTestCase/${routeparamsstore.caseInfo.caseId}`, view: 'testCase' })
      }
    }
    // 底部的功能
    const getNearInfo = (targetIndex:number) => {
      let initPageParams = {
        pageNo: targetIndex,
        pageSize: 1,
        orderBy: routeparamsstore.pageInfo.orderBy,
        params: JSON.stringify(routeparamsstore.pageInfo.params)
      }
      getTestcaseList(initPageParams).then(res => {
        let newId = res.data.resultList[0].id
        routeparamsstore.caseInfo.caseId = newId
        routeparamsstore.pageInfo.currentIndex = targetIndex
        routeparamsstore.caseInfo.caseName = res.data.resultList[0].testcaseNumber
        getCaseInfo()
        reload.value = true
      })
    }
    const pageUp = () => {
      reload.value = false
      if (routeparamsstore.pageInfo.currentIndex > 1) {
        getNearInfo(routeparamsstore.pageInfo.currentIndex - 1)
      } else {
        infoMessage(t('yiJingShiDiYiTiaoShuJu'))
      }
    }
    const pageDown = () => {
      reload.value = false
      if (routeparamsstore.pageInfo.currentIndex < routeparamsstore.pageInfo.totalRecord) {
        getNearInfo(routeparamsstore.pageInfo.currentIndex + 1)
      } else {
        infoMessage(t('yiJingShiZuiHouYiTiaoShuJu'))
      }
    }
    // 是否是星链跳转来的
    const BASEPATH = Storage.localGet('ApiUrl')
    const starFlag = computed(() => {
      let falg = BASEPATH.VITE_BASE_API_STAR_CHAIN?.OPEN && route.query.testcaseId
      return falg ? falg : false
    })
    // 获取数据
    let fileList = ref<savedFileListType[]>([])
    let fileObj = ref<{[key:string]:string}>({})
    let requires = ref<CaseRequiresType[]>([])

    const getCaseInfo = () => {
      let id = route.query?.testcaseId ? route.query.testcaseId as string : routeparamsstore.caseInfo.caseId
      getTestcaseById({ id }).then(async (res) => {
        fileList.value = res.data.avatarList
        fileObj.value = {}
        fileList.value.forEach((item:any) => {
          fileObj.value[item.id] = item.fileUrl
        })
        Object.keys(caseBasicInfo.value).forEach(k => {
          caseBasicInfo.value[k] = res.data.testcaseInfo[k]
        })
        allCaseInfo.value = res.data.testcaseInfo
        ltcInfo.value = {
          preConditionDesc: formatImageHtml(res.data.testcaseInfo.preConditionDesc, fileObj.value),
          resetDesc: formatImageHtml(res.data.testcaseInfo.resetDesc, fileObj.value),
          testStep: formatImageHtml((allCaseInfo.value.templateType === 1 && res.data.ltcs.length > 0) ? res.data.ltcs[0].testStep : '', fileObj.value),
          expectResult: formatImageHtml((allCaseInfo.value.templateType === 1 && res.data.ltcs.length > 0) ? res.data.ltcs[0].expectResult : '', fileObj.value)
        }
        ctcData.value = res.data.ctcs
        ltcData.value = getltcData(res.data.ltcs).map((item:any) => {
          let temp:{[key:string]:string} = {}
          tableDataColumn.value.forEach(k => {
            temp[k] = formatTextHtml(item[k], variablestore.variableOptions, fileObj.value)
          })
          return {
            ...item,
            ...temp
          }
        })
        requires.value = res.data.requires
        // 若为星链跳转来的则请求此测试用例对应的项目信息
        if (starFlag.value) {
          const { findProjectInfoByIdRequest } = caseBeforeEach()
          await findProjectInfoByIdRequest(res.data.testcaseInfo.rootId)
        }
        loadingClose()
      }).catch()
    }
    // 获取变量和变量单位
    const getVariable = async () => {
      let res = await getVariableByClass(1)
      // 接口返回的数组中会出现null的Item项，进行过滤
      variablestore.variableOptions = res.data.result.filter((item:VariableClass) => item)
    }
    const tableDataColumn = ref(['desc', 'result'])
    // 保持路由和tab页对应
    watch(() => router.currentRoute.value.path, (newValue) => {
      let temparr = newValue.split('/')
      activeName.value = temparr[temparr.length - 1]
    }, { immediate: true })
    onMounted(async () => {
      // 说明： 这里引起子组件改变是通过传入一个reload参数，子组件监听reload变化来实现的，为什么不使用inject更新页面？因为使用inject这里的事件会被多次注册，请求会累加
      loadingStart()
      document.addEventListener('keyup', keyUpEvent)
      await getVariable()
      getCaseInfo()
    })
    onBeforeUnmount(() => {
      document.removeEventListener('keyup', keyUpEvent)
    })
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
      fileList,
      fileObj,
      requires
    }
  }
