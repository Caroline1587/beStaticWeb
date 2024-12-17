  import { errorMessage, message } from '@/utils/message'
  import { confirmImport } from '@/utils/public'
  import { genFileId } from 'element-plus'
  import { importTestcase } from '@/api/testcaseApi'
  import { importVariable } from '@/api/variableApi'
  import type { UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
  import Storage from '@/utils/storage'
  import { useI18n } from 'vue-i18n';

  // 参数含义：根节点id，导入的用例类型
  export default function (rootId:string, source:'project'|'library'|'variable_TPA') {
    const { t } = useI18n()
    const uploadRef = ref()
    const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
    const importDialogRef = ref()
    const fileList = ref<UploadUserFile[]>([])
    // const importApiPromise = () => {
    //   if (fileList.value.length === 0) {
    //     errorMessage(t('weiXuanZeXuYaoDaoRuDeWenJian'))
    //   } else if (!checkChange(fileList.value[0])) {
    //     errorMessage(t('zhiNengXuanZeXlsxXlsHouZhuiDeWenJian'))
    //   } else {
    //     loadingStart({ text: t('wenJianDaoRuZhong') })
    //     if (source === 'variable_TPA') {
    //       const fd = new FormData()
    //       fd.append('file', fileList.value[0].raw as File)
    //       return new Promise((resolve, reject) => {
    //         importVariable(fd).then((res:any) => {
    //           if (!res.data.errorList) {
    //             errorMessage(t('wenJianZhongResdatamessageDaoRuShiBai', [res.data.message]))
    //           } else if (res.data.unImported === 0) {
    //             message(t('wenJianZhongDeBianLiangQuanBuDaoRuChengGong'))
    //           } else {
    //             let errorMsg = t('gongResdataunimportedTiaoBianLiangDaoRuShiBaiBr', [res.data.unImported]) + '<br>'
    //             res.data.errorList.forEach((item:string, index:number) => {
    //               errorMsg += `${index + 1}. ${item}<br>`
    //             })
    //             confirmImport(`${errorMsg}`)
    //           }
    //           resolve(res)
    //         }).catch(e => {
    //           reject(e)
    //         }).finally(() => {
    //           loadingClose()
    //         })
    //       })
    //     } else {
    //       let params:{[key:string]:string} = { rootId, userId: USERINFO.id, source }
    //       const fd = new FormData()
    //       Object.keys(params).forEach(item => { fd.append(item, params[item]) })
    //       fd.append('file', fileList.value[0].raw as File)
    //       return new Promise((resolve, reject) => {
    //         importTestcase(fd).then((res:any) => {
    //           if (res.msg !== '成功') {
    //             if (res.data) {
    //               let errorMsg = ''
    //               res.data.heads.forEach((item:string, index:number) => {
    //                 errorMsg += `<br>${index + 1}. ${item}`
    //               })
    //               confirmImport(`${res.data.message}${errorMsg}`)
    //             } else {
    //               errorMessage(res.msg)
    //             }
    //           } else if (res.data.totalIgnoredCount === 0) {
    //             message(t('wenJianZhongDeQuanBuYongLiDaoRuChengGong'))
    //           } else {
    //             let errorMsg = t('gongResdatatotalignoredcountTiaoYongLiDaoRuShiBaiBr', [res.data.totalIgnoredCount]) + '<br>'
    //             res.data.errorList.forEach((item:string, index:number) => {
    //               errorMsg += `${index + 1}. ${item}<br>`
    //             })
    //             confirmImport(`${errorMsg}`)
    //           }
    //           resolve(res)
    //         }).catch(e => {
    //           reject(e)
    //         }).finally(() => {
    //           loadingClose()
    //         })
    //       })
    //     }
    //   }
    // }
    const handleExceed: UploadProps['onExceed'] = (files) => {
      uploadRef.value?.clearFiles()
      const file = files[0] as UploadRawFile
      file.uid = genFileId()
      uploadRef.value?.handleStart(file)
    }
    const checkChange = (uploadFile:any) => {
      let namearr = uploadFile.name.split('.')
      let suffix = namearr[namearr.length - 1]
      const enableSuffix = ['xlsx', 'xls']
      return enableSuffix.includes(suffix)
    }
    return {
      fileList,
      importDialogRef,
      // importApiPromise,
      handleExceed,
      checkChange,
      uploadRef
    }
  }
