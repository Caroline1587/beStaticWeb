<template>
  <CustomTreeContainer :aside-expand="treeAsideExpand" :border="false" :module-name="t('quanBuShiTu')">
    <template #header>
      <div class="header">
        <span v-show="treeAsideExpand" class="aside-title">{{ t('quanBuShiTu') }}</span>
        <span v-show="treeAsideExpand">
          <CustomToolTip :content="t('xinJianShiTu')"><el-button class="icon-button" @click="addFilterView()"><el-icon><Plus /></el-icon></el-button></CustomToolTip>
          <CustomToolTip :content="t('shiTuGuanLi')"><el-button class="icon-button" @click="editFilterView"><el-icon><Setting /></el-icon></el-button></CustomToolTip>
          <CustomToolTip :content="t('shouQi')"><el-button class="icon-button" @click="treeAsideExpand=false"><el-icon><svg-icon icon-class="tree_fold"></svg-icon></el-icon></el-button></CustomToolTip>
        </span>
        <span v-show="!treeAsideExpand">
          <CustomToolTip :content="t('zhanKai')"> <el-button class="icon-button" style="width:20px" @click="treeAsideExpand=true"><el-icon><svg-icon icon-class="tree_expand"></svg-icon></el-icon></el-button></CustomToolTip>
        </span>
      </div>
    </template>
    <template #main>
      <div class="main">
        <el-scrollbar>
          <el-tree
            v-show="treeAsideExpand"
            ref="filterViewTreeRef"
            :data="showViews"
            node-key="id"
            highlight-current
            @node-click="nodeClick">
            <template #default="{ node, data }">
              <el-icon class="tree-icon">
                <svg-icon :icon-class="`${node.isCurrent ? 'defect_filterview_full' : 'defect_filterview'}`"></svg-icon>
              </el-icon>
              <span class="node-text" :title="node.label">
                <span>{{ data.filterName }}</span>
              </span>
              <span v-if="data.isDefault===1" class="defaultTag">{{ t('moRen') }}</span>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </template>
    <template #desc>
      <span class="fold-title">{{ t('quanBuShiTu') }}</span>
    </template>
  </CustomTreeContainer>
  <FilterFormDialog ref="filterFormDialogRef" :view-type="props.viewType" @init-list="getFilterList">
    <!-- 继承具名插槽 -->
    <template
      v-for="(index, name) in $slots"
      :key="name"
      #[name]="scope">
      <slot :name="name" :data="scope" />
    </template>
  </FilterFormDialog>
  <ConfigViewDialog
    ref="editDialogRef"
    v-model:allFilterViews="allViews"
    :view-type="props.viewType"
    @init-list="getFilterList"
    @to-edit="toEdit"
  />
</template>
<script
  setup
  lang="ts"
>
  import { Plus, Setting } from '@element-plus/icons-vue'
  import { routeParamsStore, globalParamsStore } from '@/store/index'
  import { getFilterListByUser } from '@/api/commonApi'
  import { handleFiterView, handleSaveFiterView } from './filterViewFn'
  import ConfigViewDialog from './ConfigViewDialog.vue'
  import Storage from '@/utils/storage'
  import CustomToolTip from "@/components/ToolTip/CustomToolTip.vue"

  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    viewType: string
  }>(), {})
  const FilterFormDialog = defineAsyncComponent(() => import('./FilterFormDialog.vue'))
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const routeparamsstore = routeParamsStore()
  const globalparamsstore = globalParamsStore()
  interface filterType{
    filterName: string
    filterOrder: number
    id: string
    isDefault: number
    isHidden: number
    isSystemFilter: number
  }
  const allViews = ref<filterType[]>([])
  const showViews = ref<filterType[]>([])
  const currentData = ref<any>({})
  const nodeClick = (data: any) => {
    currentData.value = data
    routeparamsstore.filterView.filterViewName = data.filterName
    routeparamsstore.filterView.filterViewId = data.id
    // 更新列表数据
    const filterParam = data.filterParam ? JSON.parse(data.filterParam) : { queryType: 1 }
    globalparamsstore.queryType = filterParam.queryType
    delete filterParam.queryType
    handleSaveFiterView(props.viewType, filterParam)
    globalparamsstore.filterFormData = JSON.parse(JSON.stringify(globalparamsstore.tempFilterFormData))
    globalparamsstore.changeInitFlag()
  }
  // 添加视图
  const filterFormDialogRef = ref()
  const addFilterView = (srcData = '') => {
    filterFormDialogRef.value.show('add', '', srcData)
  }
  // 管理视图
  const editDialogRef = ref()
  const editFilterView = () => {
    editDialogRef.value.show()
  }
  const toEdit = (id:string) => {
    filterFormDialogRef.value.show('edit', id)
  }
  // 侧边展开
  const treeAsideExpand = ref(true)
  // 获取视图
  const filterViewTreeRef = ref()
  const getFilterList = async () => {
    const res = await getFilterListByUser({ projectId: currentDataId, userId: USERINFO.id, filterType: props.viewType })
    showViews.value = res.data.notHiddenFilter
    allViews.value = res.data.allFilter

    // stoer记录一下默认存在的视图的id，这类模板在修改时不能覆盖本身
    routeparamsstore.filterView.voidFilterViewIds = showViews.value.filter(item => item.isSystemFilter === 1).map(item => item.id)

    // 处理“我的任务”等特殊视图
    handleFiterView(props.viewType, showViews.value)

    // 设置要选中的视图
    const newData = showViews.value.filter(item => item.id === routeparamsstore.filterView.filterViewId)[0]
    currentData.value = newData || showViews.value.filter(item => item.isDefault)[0]
    routeparamsstore.filterView.filterViewId = currentData.value.id
    routeparamsstore.filterView.filterViewName = currentData.value.filterName

    nextTick(() => {
      filterViewTreeRef.value.setCurrentKey(routeparamsstore.filterView.filterViewId)
      nodeClick(currentData.value)
    })
  }
  onMounted(async () => {
    getFilterList()
  })
  defineExpose({
    getFilterList,
    addFilterView
  })
</script>
<style
  lang='scss'
  scoped
>
.header{
  height: 48px;
  width: 100%;
  transition: all 0.5s linear;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom:1px solid $--global--regular--border--color;
  >span{
    overflow:hidden;
    white-space:nowrap
  }
  .aside-title{
    padding-left: 12px;
  }
}
.fold-title{
  text-align: center;
  word-break: break-all;
  display: flex;
  flex-direction: column;
  writing-mode: vertical-lr;
  letter-spacing: 5px;
  width: 16px;
  line-height: 16px;
}
.main{
  flex: 1;
  overflow: hidden;
  .el-tree{
    padding: 4px 8px;
    :deep(.el-tree-node__content){
      border-radius: 4px;
      padding-left: 8px!important;
    }
    :deep(.el-tree-node__expand-icon){
      display: none;
    }
    .node-text{
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tree-icon {
      margin-right:4px;
      width: auto;
      padding: 0;
      min-width: 16px;
      max-width: 16px;
      display:inline-block;
    }
  }
}
</style>
