import { globalPropsStore } from '@/store/index'

export default function usePermission (type:'testcase_library'|'testcase_project'|'variable_TPA'|'testset_project') {
  const globalpropsstore = globalPropsStore()
  // const isAdmin = globalpropsstore?.checkUpRole([])
  const isAdmin = true;
  const roleDesc:{[key:string]:any} = {
    testcase_project: {
      fn: globalpropsstore?.checkUpProjectRole,
      folderAdd: 'pTestcaseFolderAdd',
      folderEdit: 'pTestcaseFolderEdit',
      folderDelete: 'pTestcaseFolderDelete',
      excelImport: 'pTestcaseExcleImport',
      excelExport: 'pTestcaseExcleExport',
      dataAdd: 'pTestcaseAdd',
      dataEdit: 'pTestcaseEdit',
      dataDelete: 'pTestcaseDelete',
      dataMove: 'pTestcaseMove',
      dataCommit: 'pTestcaseCommit',
      dataPull: 'pTestcasePull',
      downLoadFile: 'pTestcaseDownLoadFile',
      downLoadSeqFile: 'pTestcaseDownLoadSeqFile',
      dataLog: 'pTestcaseLog',
      dataBatchDelete: 'pTestcaseDeleteBatch',
      dataBatchCopy: ''
    },
    testcase_library: {
      fn: globalpropsstore?.checkUpTestcaseRole,
      libAdd: 'testcaseLibraryAdd',
      folderAdd: 'lTestcaseFolderAdd',
      folderEdit: 'lTestcaseFolderEdit',
      folderDelete: 'lTestcaseFolderDelete',
      excelImport: 'lTestcaseExcleImport',
      excelExport: 'lTestcaseExcleExport',
      dataAdd: 'lTestcaseAdd',
      dataEdit: 'lTestcaseEdit',
      dataDelete: 'lTestcaseDelete',
      dataMove: 'lTestcaseMove',
      dataCommit: 'lTestcaseCommit',
      dataPull: 'lTestcasePull',
      downLoadFile: 'lTestcaseDownLoadFile',
      downLoadSeqFile: 'lTestcaseDownLoadSeqFile',
      dataLog: 'lTestcaseLog',
      dataBatchDelete: 'lTestcaseDeleteBatch',
      dataBatchCopy: ''
    },
    variable_TPA: {
      fn: globalpropsstore?.checkUpRole,
      folderAdd: 'variableFolderAdd',
      folderEdit: 'variableFolderEdit',
      folderDelete: 'variableFolderDelete',
      excelImport: 'variableExcelImport',
      excelExport: 'variableExcelExport',
      dataAdd: 'variableAdd',
      dataEdit: 'variableEdit',
      dataDelete: 'variableDelete',
      dataMove: 'variableMove',
      dataCommit: '',
      dataPull: '',
      downLoadFile: '',
      downLoadSeqFile: '',
      dataLog: '',
      dataBatchAdd: 'variableAddBatch',
      dataBatchDelete: 'variableDeleteBatch',
      dataBatchCopy: 'variableCopyBatch'
    },
    testset_project: {
      fn: globalpropsstore?.checkUpProjectRole,
      addResult: 'pTestsetAddResult',
      downloadRecordAttchment: 'pTestsetDownloadRecordAttchment'
    }
  }
  const currentRole = roleDesc[type]
  const enableLibAdd = isAdmin || globalpropsstore?.checkUpRole([currentRole.libAdd])
  const enableFolderAdd = isAdmin || currentRole.fn([currentRole.folderAdd])
  const enableFolderEdit = isAdmin || currentRole.fn([currentRole.folderEdit])
  const enableFolderDelete = isAdmin || currentRole.fn([currentRole.folderDelete])
  const enableExcelImport = isAdmin || currentRole.fn([currentRole.excelImport])
  const enableExcelExport = isAdmin || currentRole.fn([currentRole.excelExport])
  const enableDataAdd = isAdmin || currentRole.fn([currentRole.dataAdd])
  const enableDataEdit = isAdmin || currentRole.fn([currentRole.dataEdit])
  const enableDataDelete = isAdmin || currentRole.fn([currentRole.dataDelete])
  const enableDataMove = isAdmin || currentRole.fn([currentRole.dataMove])
  const enableDataCommit = isAdmin || currentRole.fn([currentRole.dataCommit])
  const enableDataPull = isAdmin || currentRole.fn([currentRole.dataPull])
  const enableDownLoadFile = isAdmin || currentRole.fn([currentRole.downLoadFile])
  const enableDownLoadSeqFile = isAdmin || currentRole.fn([currentRole.downLoadSeqFile])
  const enableDataLog = isAdmin || currentRole.fn([currentRole.dataLog])
  const enableDataBatchAdd = isAdmin || currentRole.fn([currentRole.dataBatchAdd])
  const enableDataBatchDelete = isAdmin || currentRole.fn([currentRole.dataBatchDelete])
  const enableDataBatchCopy = isAdmin || currentRole.fn([currentRole.dataBatchCopy])
  const enableTestsetAddResult = computed(() => {
    return isAdmin || currentRole.fn([currentRole.addResult])
  })
  const enableTestsetDownloadRecordAttchment = computed(() => {
    return isAdmin || currentRole.fn([currentRole.downloadRecordAttchment])
  })
  // 用例库
  const enableLibConfig = isAdmin || globalpropsstore?.checkUpTestcaseRole(['testcaseLibraryDelete', 'testcaseLibraryEdit', 'testcaseLibraryMemberManage', 'testcaseLibraryFormManage'])
  return {
    enableLibAdd,
    enableFolderAdd,
    enableFolderEdit,
    enableFolderDelete,
    enableExcelImport,
    enableExcelExport,
    enableDataAdd,
    enableDataEdit,
    enableDataDelete,
    enableDataMove,
    enableDataCommit,
    enableDataPull,
    enableDownLoadFile,
    enableDownLoadSeqFile,
    enableDataLog,
    enableDataBatchAdd,
    enableLibConfig,
    enableDataBatchDelete,
    enableTestsetAddResult,
    enableDataBatchCopy,
    enableTestsetDownloadRecordAttchment
  }
}
