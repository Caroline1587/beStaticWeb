import type { UploadUserFile, TabsPaneContext } from 'element-plus'
import { message, infoMessage } from '@/utils/message'
import { TestcaseInfoType, AddOrEditTestcaseType, TestCaseBasicInfoType, LtcModelType, CtcModelType, TableColumn, TableData, LtcTableDataType, savedFileListType, CaseRequiresType } from '@/utils/types/testcaseType'
import { addOrEditTestcase, getTestcaseById, getVariableByClass } from '@/api/testcaseApi'
import { routeParamsStore, variableStore } from '@/store/index'
import { createUUID, beforeFormDataAppendFile } from '@/utils/public'
import { useRouter } from 'vue-router'
import { getltcData, getCtcData } from '@/views/ResourceCase/addTestcase/components/caseDtailData'
import { TESTCASE_TESTTYPE } from '@/utils/constant'
import { deleteTextHtml, formatTextHtml, formatImageHtml } from '../components/transHtml'
import { VariableClass } from '@/utils/types/addTestcaseType'
import { uploadFile } from '@/api/fileApi'
import Storage from '@/utils/storage'
export default function (caseType: 'testcase_project' | 'testcase_library') {
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const { t } = useI18n()
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const BASEPATH = Storage.localGet('ApiUrl')
  const routeparamsstore = routeParamsStore()
  const variablestore = variableStore()
  const router = useRouter()
  const operateStatus = ref<string>(router.currentRoute.value.meta.status as string)

  const activeDescName = ref('ltc')
  // 基础信息
  const oldName = ref('')
  const basicFormRef = ref()
  const testcaseForm = ref<TestCaseBasicInfoType>({
    testcaseNumber: '',
    testcaseName: '',
    priority: '1',
    testType: [],
    sourceType: 1,
    templateType: 2,
    tags: '',
    description: '',
    requireNumber: '',
    sourceUrl: ''
  })
  // 具体用例信息
  let ltcInfo = ref({
    preConditionDesc: '',
    resetDesc: '',
    testStep: '',
    expectResult: ''
  })
  const handlePreDescValue = (val: string) => {
    ltcInfo.value.preConditionDesc = val
  }
  const handleResetDescValue = (val: string) => {
    ltcInfo.value.resetDesc = val
  }
  const handleTestStepValue = (val: string) => {
    ltcInfo.value.testStep = val
  }
  const handleExpectResultValue = (val: string) => {
    ltcInfo.value.expectResult = val
  }
  // 具体用例文件信息
  let newCaseFile: UploadUserFile[] = []
  let deleteCaseFile: string[] = []
  const getFileInfo = (newFile: UploadUserFile[], deleteFile: string[]) => {
    newCaseFile = newFile
    deleteCaseFile = deleteFile
  }
  let newSeqFile: UploadUserFile[] = []
  let deleteSeqFile: string[] = []
  const getSeqfileInfo = (newFile: UploadUserFile[], deleteFile: string[]) => {
    newSeqFile = newFile
    deleteSeqFile = deleteFile
  }
  // 保存数据到后端创建用例
  const handleParamsPromise = () => {
    return new Promise((resolve, reject) => {
      // 初步处理基本的用例信息和序列信息
      let tempType = 0
      testcaseForm.value.testType.forEach(item => {
        tempType += item
      })
      let testcaseInfo: TestcaseInfoType = {
        id: operateStatus.value === 'edit' ? routeparamsstore.caseInfo.caseId : createUUID(),
        folderId: caseType === 'testcase_project' ? routeparamsstore.caseInfo.projectFolderId : routeparamsstore.caseInfo.resourceFolderId,
        preConditionDesc: deleteTextHtml(ltcInfo.value.preConditionDesc, savedFileList),
        resetDesc: deleteTextHtml(ltcInfo.value.resetDesc, savedFileList),
        ...testcaseForm.value,
        requireNumber: '',
        testType: tempType,
        createType: createType.value
      }
      let ltcList: LtcModelType[] = []
      if (testcaseForm.value.templateType === 1) {
        let step = deleteTextHtml(ltcInfo.value.testStep, savedFileList)
        let result = deleteTextHtml(ltcInfo.value.expectResult, savedFileList)
        if (!step && !result) {
          ltcList = []
        } else {
          ltcList = [{
            id: testcaseInfo.id,
            orderNum: 1,
            testStep: step,
            expectResult: result
          }]
        }
      } else {
        ltcList = []
        ltcRef.value.ltcTableData.forEach((item: any) => {
          if (!deleteTextHtml(item.desc, savedFileList) && !deleteTextHtml(item.result, savedFileList)) {
            // 去除空行
          } else {
            ltcList.push({
              id: item.id,
              orderNum: ltcList.length + 1,
              testStep: deleteTextHtml(item.desc, savedFileList),
              expectResult: deleteTextHtml(item.result, savedFileList)
            })
          }
        })
      }
      let ctcList: CtcModelType[] = CtcRef.value ? CtcRef.value.getRequestParam(ltcRef.value.variableList) : []
      let deleteFileIds = ''
      let deleteSeqFileIds = ''
      deleteCaseFile.forEach(item => {
        deleteFileIds += item + ','
      })
      deleteSeqFile.forEach(item => {
        deleteSeqFileIds += item + ','
      })
      // 处理富文本中的图片数据
      let imageFileList: any[] = [...ltcRef.value.getImageFileList()]
      let uploadPromise: any = []
      imageFileList.forEach(item => {
        let fileFd = new FormData()
        fileFd.append('file', item.file as File)
        fileFd.append('fileId', testcaseInfo.id)
        fileFd.append('isAddLog', 'false') // 不需要单独记录富文本中的图片上传日志
        fileFd.append('creator', USERINFO.id)
        fileFd.append('fileCategory', 'testcase_quill_img')
        let promise = new Promise((resolve, reject) => {
          uploadFile(fileFd).then((res) => {
            if (item.source === 'preConditionDesc') {
              testcaseInfo.preConditionDesc = testcaseInfo.preConditionDesc.replace(item.url, res.data.newFile.id)
            } else if (item.source === 'resetDesc') {
              testcaseInfo.resetDesc = testcaseInfo.resetDesc.replace(item.url, res.data.newFile.id)
            } else if (item.source === 'teststepDesc') {
              ltcList[0].testStep = ltcList[0].testStep.replace(item.url, res.data.newFile.id)
            } else if (item.source === 'expectResultDesc') {
              ltcList[0].expectResult = ltcList[0].expectResult.replace(item.url, res.data.newFile.id)
            } else {
              let arr = item.source.split('--')
              let key = arr[1] === t('buZhouMiaoShu') ? 'testStep' : 'expectResult'
              ltcList[arr[0]][key] = (ltcList[arr[0]][key] as string).replace(item.url, res.data.newFile.id)
            }
            // 文件上传保存后删除本地的临时预览路径
            URL.revokeObjectURL(item.url)
            resolve(res)
          }).catch((e: any) => {
            reject(e)
          })
        })
        uploadPromise.push(promise)
      })
      // 富文本图片上传成功后再执行保存
      Promise.all(uploadPromise).then((res) => {
        let sourceType = testcaseForm.value.sourceType + ''
        if (BASEPATH.VITE_BASE_API_STAR_CHAIN?.OPEN && routeparamsstore.caseInfo.associatedProject) sourceType = '0'
        // 处理最终用于保存的数据
        let params: AddOrEditTestcaseType = {
          addOrEdit: operateStatus.value,
          testcaseInfo: JSON.stringify(testcaseInfo),
          rootId: currentDataId,
          userId: USERINFO.id,
          ltcList: ltcList.length === 0 ? '' : JSON.stringify(ltcList),
          ctcList: JSON.stringify(ctcList),
          deleteFiles: deleteFileIds,
          deleteSeqFiles: deleteSeqFileIds,
          requires: testcaseForm.value.requireNumber,
          logId: operateStatus.value === 'edit' ? createUUID() : '',
          sourceType,
          sourceUrl: testcaseForm.value.sourceUrl + ''
        }
        let fd = new FormData()
        Object.keys(params).forEach(k => {
          fd.append(k, params[k])
        })
        newCaseFile.forEach((file) => {
          fd.append('addFiles', beforeFormDataAppendFile(file.raw))
        })
        newSeqFile.forEach((file) => {
          fd.append('addSeqFiles', beforeFormDataAppendFile(file.raw))
        })
        // 执行保存功能
        addOrEditTestcase(fd).then((res) => {
          message(`${t('yongLi')}${operateStatus.value === 'edit' ? t('bianJi') : t('xinJian')}${t('chengGong')}`)
          routeparamsstore.caseInfo.caseName = testcaseInfo.testcaseNumber
          resolve(res)
        }).catch(e => {
          loadingClose()
          reject(e)
        })
      }).catch((e: any) => {
        console.log(e)
      })
    })
  }
  const resetPage: (() => void | undefined) | undefined = inject('routeReload')
  const continueAdd = async () => {
    await basicFormRef.value.testcaseFormRef.validate(async (valid: boolean) => {
      if (valid) {
        // 校验具体用例
        if (CtcRef.value) {
          if (!await CtcRef.value.getCheck()) return
        }
        loadingStart()
        let promise = handleParamsPromise()
        promise.then(() => {
          basicFormRef.value.testcaseFormRef.resetFields()
          loadingClose()
          if (resetPage) {
            resetPage()
          }
        })
      } else {
        infoMessage(t('youBiTianZiDuanWeiTianXie'))
      }
    })
  }
  const saveResorceCase = async () => {
    await basicFormRef.value.testcaseFormRef.validate(async (valid:boolean) => {
      if (valid) {
        // 校验逻辑用例
        if (ltcRef.value) {
          if (!await ltcRef.value.variableDialog()) return
        }
        // 校验具体用例
        if (CtcRef.value) {
          if (!await CtcRef.value.getCheck()) return
        }
        loadingStart()
        let promise = handleParamsPromise()
        promise.then((res:any) => {
          if (operateStatus.value === 'add') {
            routeparamsstore.pageInfo.upAndDownBtn = false
          }
          const globalpropsstore = getGlobalPropsStore()
          globalpropsstore.commonRouter({ path: `/libraryCase/testCaseInfo/caseDetail/${res.data.id}`, type: 'replace', view: 'testCase' })
          loadingClose()
        })
      } else {
        infoMessage(t('youBiTianZiDuanWeiTianXie'))
      }
    })
  }
  const saveProjectCase = async () => {
    await basicFormRef.value.testcaseFormRef.validate(async (valid:boolean) => {
      if (valid) {
        // 校验逻辑用例
        if (ltcRef.value) {
          if (!await ltcRef.value.variableDialog()) return
        }
        // 校验具体用例
        if (CtcRef.value) {
          if (!await CtcRef.value.getCheck()) return
        }
        loadingStart()
        let promise = handleParamsPromise()
        promise.then((res:any) => {
          if (operateStatus.value === 'add') {
            routeparamsstore.pageInfo.upAndDownBtn = false
          }
          const globalpropsstore = getGlobalPropsStore()
          globalpropsstore.commonRouter({ path: `/projectCase/projectCaseInfo/caseInfo/${res.data.id}`, type: 'replace', view: 'project' })
          loadingClose()
        })
      } else {
        infoMessage(t('youBiTianZiDuanWeiTianXie'))
      }
    })
  }
  const ctcData = ref<TableData[]>([])
  const ltcData = ref<LtcTableDataType[]>([])
  const tableDataColumn = ref(['desc', 'result'])
  let savedFileList: savedFileListType[] = []
  const createType = ref(1)
  const getCaseInfo = () => {
    loadingStart()
    getTestcaseById({ id: routeparamsstore.caseInfo.caseId }).then(res => {
      oldName.value = res.data.testcaseInfo.testcaseNumber
      savedFileList = res.data.avatarList
      createType.value = res.data.testcaseInfo.createType
      let fileObj: { [key: string]: string } = {}
      savedFileList.forEach((item: any) => {
        fileObj[item.id] = item.fileUrl
      })
      Object.keys(testcaseForm.value).forEach(k => {
        if (k === 'testType') {
          if (TESTCASE_TESTTYPE[res.data.testcaseInfo.testType] === t('ziDongCeShiShouDongCeShi-0')) {
            testcaseForm.value.testType = [1, 2]
          } else {
            testcaseForm.value.testType = [Number(res.data.testcaseInfo.testType)]
          }
        } else if (k === 'requireNumber') {
          let msg = ''
          res.data.requires.forEach((item: CaseRequiresType) => {
            msg = `${item.requireNumber}`
          })
          testcaseForm.value.requireNumber = msg
        } else {
          testcaseForm.value[k] = res.data.testcaseInfo[k] ? res.data.testcaseInfo[k] : ''
        }
      })
      ltcInfo.value = {
        preConditionDesc: formatImageHtml(res.data.testcaseInfo.preConditionDesc, fileObj),
        resetDesc: formatImageHtml(res.data.testcaseInfo.resetDesc, fileObj),
        testStep: formatImageHtml((testcaseForm.value.templateType === 1 && res.data.ltcs.length) > 0 ? res.data.ltcs[0].testStep : '', fileObj),
        expectResult: formatImageHtml((testcaseForm.value.templateType === 1 && res.data.ltcs.length) > 0 ? res.data.ltcs[0].expectResult : '', fileObj)
      }
      let data:any = getCtcData(res.data.ctcs)
      tableColumn.value = data.ctcColumn
      ctcData.value = data.ctcData
      nextTick(() => {
        // console.log(CtcRef.value, 'CtcRef.value?')
        // 手动触发ctc表格数据更新
        CtcRef.value?.loadData(tableColumn.value, ctcData.value)
      })
      ltcData.value = getltcData(res.data.ltcs).map((item: any) => {
        let temp: { [key: string]: string } = {}
        tableDataColumn.value.forEach(k => {
          temp[k] = formatTextHtml(item[k], variablestore.variableOptions, fileObj)
        })
        return {
          ...item,
          ...temp
        }
      })
      loadingClose()
    }).catch()
  }
  // Ltc组件ref
  let ltcRef = ref()
  let ltcAsideRef = ref()
  // Ltc组件中的自定义图片上传
  const customUpload = (file: any) => {
    // console.log(file)
    // console.log(ltcAsideRef.value.commonUpload)
    ltcAsideRef.value.commonUpload.handleStart(file)
  }
  // Ctc组件ref
  let CtcRef = ref()
  let tableColumn = ref<TableColumn[]>([])
  // 校验规则
  let tableDataRules = ref<{ [key: string]: any }>({})
  const tableDataCustomRules = ref<{ [key: string]: any }>({})
  // 表格ctc数据
  const getCtcTableData = () => {
    // 空数据模板
    let dataEmpt = {
      value: '',
      hightLight: 0
    }
    // 如果序列中没有输入变量，不需要展示表格
    if (tableColumn.value.length === 1) {
      ctcData.value = []
      currentRowData.value = {
        ctcNum: { value: t('zanWuShuJu'), hightLight: 0 }
      }
    } else {
      // 若列表无数据则根据表头创建两条数据供用户输入
      if (ctcData.value.length === 0) {
        let tableDataItem = { step: 1, id: createUUID() } as TableData
        tableColumn.value.forEach(item => {
          tableDataItem[item.prop] = { ...dataEmpt }
        })
        ctcData.value.push(tableDataItem)
      } else {
        // 若列表有数据则进行变量进行筛选，多则新增，少则过滤
        ctcData.value = ctcData.value.map(item => {
          let data = { step: item.step, id: item.id } as TableData
          // 根据表头决定表格数据的 prop
          tableColumn.value.forEach(tableColumnItem => {
            let tableRow = item[tableColumnItem.prop]
            // 若有当前prop数据则直接使用，没有给其赋值初始化数据
            data[tableColumnItem.prop] = tableRow ? tableRow : { ...dataEmpt }
          })
          return {
            ...data
          }
        })
      }
      // ctcAside数据初始化,默认展示第一条ctcData
      currentRowData.value = ctcData.value[0]
    }
  }
  const handleClick = async (tab: TabsPaneContext) => {
    if (tab.paneName === 'ctc') {
      // 获取目前输入的所有变量,提供给ctc组件当表头使用
      await ltcRef.value.variableDialog()
      tableColumn.value = ltcRef.value.variableList
      tableDataRules.value = ltcRef.value.tableDataRules
      tableDataCustomRules.value = ltcRef.value.tableDataCustomRules
      getCtcTableData()
      // await ltcRef.value.variableDialog()
      // 手动触发ctc表格数据更新
      CtcRef.value?.loadData(tableColumn.value, ctcData.value)
    }
  }
  // excel导入成功
  const handleImportExcelSuccess = (data: TableData[]) => {
    // ctcData.value = data
    // 判断导入前是否存在未填写的用例并进行删除
    let arr = ctcData.value.filter(item => {
      let flag = false
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          // 只要填写过任意一项就不会
          if (item[key].value) flag = true
        }
      }
      return flag
    })
    // 若ctc编号相同则进行替换，不同则进行添加
    data.forEach((item) => {
      let index = arr.findIndex(e =>
        e.ctcNum.value === item.ctcNum.value
      )
      if (index > -1) {
        arr[index] = item
      } else {
        arr.push(item)
      }
    })
    arr = arr.map((item, index) => {
      return {
        ...item,
        step: index + 1
      }
    })
    ctcData.value = arr
    // console.log(ctcData.value)
    // 进行校验
    nextTick(() => {
      // 手动触发ctc表格数据更新
      CtcRef.value?.loadData(tableColumn.value, ctcData.value)
      CtcRef.value.getAllCheck()
    })
  }
  // ctcAside组件
  const currentRowData = ref<any>({
    ctcNum: { value: '', hightLight: 0 }
  })
  const getCurrentTableRow = (row: any) => {
    currentRowData.value = row
  }
  // ctclist表格上方按钮栏功能
  const changeTableData = (flag: string, newData?: TableData[]) => {
    if (flag === 'add') {
      // 添加一条空白的ctc
      let dataEmpt = {
        value: '',
        hightLight: 0
      }
      let tableDataItem = { step: ctcData.value.length + 1, id: createUUID() } as TableData
      tableColumn.value.forEach(item => {
        tableDataItem[item.prop] = { ...dataEmpt }
      })
      ctcData.value.push(tableDataItem)
      // 手动触发ctc表格数据更新
      CtcRef.value?.insertEvent(tableDataItem)
    } else if (flag === 'change') {
      ctcData.value = newData ? newData : []
    }
  }
  // 获取变量和变量单位
  const getVariable = async () => {
    let res = await getVariableByClass(1)
    // 接口返回的数组中会出现null的Item项，进行过滤
    variablestore.variableOptions = res.data.result.filter((item:VariableClass) => item)
  }
  onMounted(async () => {
    await getVariable()
    if (operateStatus.value === 'edit') {
      getCaseInfo()
    }
    basicFormRef.value.numberInputRef.focus()
  })
  return {
    activeDescName,
    // 基础信息表单
    oldName,
    basicFormRef,
    testcaseForm,
    // ltc信息
    ltcInfo,
    handlePreDescValue,
    handleResetDescValue,
    handleTestStepValue,
    handleExpectResultValue,
    // 文件信息
    getFileInfo,
    getSeqfileInfo,
    // 保存操作
    handleParamsPromise,
    continueAdd,
    saveResorceCase,
    saveProjectCase,
    // LTC，CTC组件处理
    ltcRef,
    ltcAsideRef,
    CtcRef,
    ctcData,
    ltcData,
    // ctc校验和渲染
    tableDataRules,
    tableDataCustomRules,
    tableColumn,
    handleClick,
    // excel导入成功
    handleImportExcelSuccess,
    // ctcAside
    currentRowData,
    getCurrentTableRow,
    changeTableData,
    // 富文本的自定义图片上传
    customUpload,
    createType
  }
}
