import { globalParamsStore, routeParamsStore } from '@/store/index'
import { ElNotification } from 'element-plus'
import { message } from '@/utils/message'
import { editFilter } from '@/api/commonApi'

export default function useFilterNotice () {
  const { t } = useI18n()
  const globalparamsstore = globalParamsStore()
  const routeparamsstore = routeParamsStore()
  const filterFormRef = ref()
  const listAsideRef = ref()
  const submitForm = () => {
    globalparamsstore.filterFormData = JSON.parse(JSON.stringify(globalparamsstore.tempFilterFormData))
    afterChangeFilterData = JSON.stringify({
      ...globalparamsstore.tempFilterFormData,
      ...globalparamsstore.specialFilterFormData,
      queryType: globalparamsstore.queryType
    })
    globalparamsstore.changeInitFlag()
    // 判断本次是否发生筛选条件修改，有的话需要提示用户选择是否保存
    // 先关闭之前的提示，否则会造成数据混乱
    ElNotification.closeAll()
    if (beforeChangeFilterData !== afterChangeFilterData) {
      ElNotification({
        title: t('tiShi'),
        onClick: noticeClick,
        customClass: 'notice filterNotice',
        position: 'bottom-right',
        dangerouslyUseHTMLString: true,
        message: `<span>${t('dangQianShiTuYouXiuGaiWeiBaoCun')}</span><br><div class="btn"><button id="cover" name=${routeparamsstore.filterView.filterViewId} ${routeparamsstore.filterView.voidFilterViewIds.includes(routeparamsstore.filterView.filterViewId) ? 'disabled' : ''}>${t('fuGaiDangQian')}</button><button id="save" name=${routeparamsstore.filterView.filterViewId}>${t('lingCunWei')}</button></div>`,
        duration: 10000
      })
    }
  }
  // 高级筛选修改前保存数据
  let beforeChangeFilterData = ''
  let afterChangeFilterData = ''
  const beforeChangeFilter = () => {
    beforeChangeFilterData = JSON.stringify({
      ...globalparamsstore.tempFilterFormData,
      ...globalparamsstore.specialFilterFormData,
      queryType: globalparamsstore.queryType
    })
  }
  const noticeClick:any = (e:any) => {
    if (e.srcElement.name === routeparamsstore.filterView.filterViewId) {
      if (e.srcElement.id === 'cover') {
        let params = {
          filterName: routeparamsstore.filterView.filterViewName,
          filterParam: afterChangeFilterData,
          id: routeparamsstore.filterView.filterViewId
        }
        editFilter(params).then(() => {
          message(t('yiGengXinRouteparamsstorefilterViewNameShiTuSheZhi', [routeparamsstore.filterView.filterViewName]))
          ElNotification.closeAll()
          listAsideRef.value.getFilterList()
        })
      } else if (e.srcElement.id === 'save') {
        listAsideRef.value.addFilterView(afterChangeFilterData)
        ElNotification.closeAll()
      }
    } else {
      ElNotification.closeAll()
    }
  }
  watch(() => routeparamsstore.filterView.filterViewId, () => {
    ElNotification.closeAll()
  }, { deep: true })
  onBeforeUnmount(() => {
    ElNotification.closeAll()
  })
  return {
    filterFormRef,
    listAsideRef,
    submitForm,
    beforeChangeFilter
  }
}
