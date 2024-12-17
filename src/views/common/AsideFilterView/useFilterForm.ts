import type { FormInstance } from 'element-plus'
import { addFilter, getFilterById, editFilter, checkDuplicatedFilterName } from '@/api/commonApi'
import { routeParamsStore } from '@/store'
import { message } from '@/utils/message'
import Storage from '@/utils/storage'
import '@/styles/globalStyle/filterFormDialog.scss'
export default function useFilterForm (filterType:string, emits:any) {
  const { t } = useI18n()
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const routeparamsstore = routeParamsStore()
  const tipDialogV5Ref = ref()
  const status = ref<'add'|'edit'>('add')
  let currentId = ''
  const show = async (state:'add'|'edit', id = '', srcData?:string) => {
    status.value = state
    if (status.value === 'edit') {
      currentId = id
      await getFilterInfo()
    } else if (srcData) {
      filterFormData.value = JSON.parse(srcData)
    }
    tipDialogV5Ref.value.dialogVisible = true
  }
  const formData = ref({
    filterName: ''
  })
  const checkName = async (rule:any, value:any, callback:any) => {
    if (value === '') {
      callback()
    } else if (!(status.value === 'edit' && oldName === value)) {
      // 重名校验待补充
      let res = await checkDuplicatedFilterName({ filerName: value, userId: USERINFO.id, projectId: currentDataId, filterType })
      res.data ? callback(new Error(t('shiTuMingChengZhongFuQingGengHuanShiTuMingCheng'))) : callback()
    } else {
      callback()
    }
  }
  const rules = {
    filterName: [
      { required: true, message: t('qingShuRuShiTuMingCheng'), trigger: 'blur' },
      { max: 50, message: t('shiTuMingChengChangDuShangXianWei_50ZiFu'), trigger: 'blur' },
      { validator: checkName, trigger: 'blur' }
    ]
  }
  const filterFormData = ref<any>({
    queryType: 1
  })
  const submitForm = () => {
    if (!formRef.value) return
    formRef.value.validate((valid, fields) => {
      if (valid) {
        let basicParams = {
          filterName: formData.value.filterName,
          filterParam: JSON.stringify({ ...filterFormData.value })
        }
        if (status.value === 'add') {
          let params = {
            ...basicParams,
            userId: USERINFO.id,
            projectId: currentDataId,
            filterType
          }
          addFilter(params).then((res:any) => {
            tipDialogV5Ref.value.dialogVisible = false
            message(t('shaiXuanShiTuChuangJianChengGong'))
            routeparamsstore.filterView.filterViewId = res.data.res.id
            emits('initList')
          })
        } else {
          let params = {
            ...basicParams,
            id: currentId
          }
          editFilter(params).then(() => {
            tipDialogV5Ref.value.dialogVisible = false
            message(t('shaiXuanShiTuBianJiChengGong'))
            emits('initList')
          })
        }
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  let oldName = ''
  const formRef = ref<FormInstance>()
  const getFilterInfo = async () => {
    const res = await getFilterById(currentId)
    formData.value.filterName = res.data.res.filterName
    oldName = res.data.res.filterName
    filterFormData.value = JSON.parse(res.data.res.filterParam)
  }
  const resetForm = () => {
    tipDialogV5Ref.value.dialogVisible = false
  }
  const reset = () => {
    formData.value.filterName = ''
    filterFormData.value = { queryType: 1 }
  }

  return {
    status,
    formData,
    rules,
    filterFormData,
    formRef,
    tipDialogV5Ref,
    reset,
    resetForm,
    submitForm,
    show
  }
}
