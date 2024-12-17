<template>
  <div class="listBtn">
    <!-- <filterButton>
      <el-button
        :disabled="props.disabled||props.folderPermissionDisabled||!enableDataAdd"
        class="blue-button"
        @click="toAddUsecase"
      >
        <el-icon style="margin-right:2px;" :size="16"><Plus /></el-icon>
        {{ t('xinJianYongLi') }}
      </el-button>
      <el-button
        class="icon-text-button"
        :disabled="!props.disabled||!enableExcelImport"
        @click="importDialogRef.dialogVisible=true"
      >
        <el-icon><svg-icon icon-class="projectCase_import"></svg-icon></el-icon>
        <span>{{ t('daoRu') }}</span>
      </el-button>
      <el-dropdown trigger="click" @command="exportCommand">
        <el-button class="icon-text-button" :disabled="!props.disabled||!enableExcelExport">
          <el-icon><svg-icon icon-class="projectCase_export"></svg-icon></el-icon>
          <span>{{ t('daoChu') }}</span>
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="exportCase">{{ t('daoChuExcelYongLi') }}</el-dropdown-item>
            <el-dropdown-item command="exportTemplate">{{ t('daoChuExcelKongMoBan') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </filterButton> -->
    <!-- <TipDialogV5
      ref="importDialogRef"
      :title="t('daoRuExcelCeShiYongLi')"
      @closed="fileList=[]"
    >
      <ul class="importInfo">
        <li>{{ t('daoRuDeExcelWenJianBiXuFuHeTpaDeExcelBianXieGuiFan') }}</li>
        <li>{{ t('daoRuHouHuiGenJuShiJiQingKuangZiDongXinJianHeGengXinCeShiYongLi') }}</li>
        <li>{{ t('daoRuHouHuiGenJuShiJiQingKuangZiDongXinJianWenJianJiaJieDian') }}</li>
      </ul>
      <el-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        class="importUpload"
        accept=".xlsx, .xls"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed">
        <el-button class="blue-liner-button fileBtn">{{ t('xuanZeWenJian') }}</el-button>
      </el-upload>
      <template #footer>
        <el-button class="grey-liner-button" @click="importDialogRef.dialogVisible = false">{{ t('quXiao') }}</el-button>
        <el-button class="blue-button" @click="importCase">{{ t('daoRu') }}</el-button>
      </template>
    </TipDialogV5> -->
    <TreeTableDrawer
      ref="containerRef"
      v-model:drawer="exportDialogVisiable"
      :tree-data="props.treeData"
      :drawer-title="t('daoChuExcelCeShiYongLi')"
      :tree-title="t('xuanZeYongLiMoKuai')"
      :table-props="tableProps"
      :loading="tableLoading"
      :table-data="tableData"
      :page-info="pageInfo"
      :select-ids="allSelectCaseId"
      :selected-number="Object.keys(allSelectCaseId).filter(item => allSelectCaseId[item]).length"
      @table-check-one="tableCheckOne"
      @table-check-all="tableCheckAll"
      @check-change="checkChange"
      @tree-node-click="leftTreeNodeClick"
      @change-page-info="changePageInfo"
      @submit-form="submitForm"
      @close="cancelExport"
    >
      <template #customHeader="scope">
        <messageComps tag-name="span" class-name="flex-center" :info="t('yiXuanScopenumberXiangCeShiYongLi', [`<i style='color:var(--el-color-primary);margin:0 3px'>${scope.number}</i>`])"></messageComps>
      </template>
      <template #searchForm>
        <caseAdvanceForm class="drawerForm" />
      </template>
      <template #customFooter>
        <div class="drawerBtn">
          <el-button class="grey-liner-button" :disabled="exportLoading" @click="exportDialogVisiable=false">{{ t('quXiao') }}</el-button>
          <el-button
            :disabled="Object.keys(allSelectCaseId).filter(item => allSelectCaseId[item]).length === 0"
            class="blue-button"
            :loading="exportLoading"
            @click="exportCase"
          >
            {{ t('daoChu') }}
          </el-button>
        </div>
      </template>
    </TreeTableDrawer>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import { Plus, ArrowDown } from '@element-plus/icons-vue'
  import { globalParamsStore } from '@/store/index'
  import treeTableHook from '../hook/treeTableHook'
  import importHook from '../hook/importHook'
  import usePermission from '@/views/common/usePermission'
  import Storage from '@/utils/storage'
  import caseAdvanceForm from './caseAdvanceForm.vue'
  import filterButton from '@/views/common/filterButton.vue'
  import useRenderHtml from '@/views/common/useRenderHtml'
  import { useI18n } from 'vue-i18n';
  import {getGlobalPropsStore} from "@/utils/autoImport"
  import {defineProps,ref,nextTick} from "vue"

  const { handleComps } = useRenderHtml()
  const messageComps:any = handleComps()
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const { enableExcelImport, enableExcelExport, enableDataAdd } = usePermission('testcase_library')
  const { t } = useI18n()
  const globalparamsstore = globalParamsStore()
  const props = withDefaults(defineProps<{
    treeData:any
    disabled:boolean
    folderPermissionDisabled?:boolean
  }>(), {
    folderPermissionDisabled: false
  })
  const containerRef = ref()
  const {
    // 表格的分页
    pageInfo,
    changePageInfo,
    // 表格数据
    tableData,
    allSelectId: allSelectCaseId,
    // 左侧树形
    leftTreeNodeClick,
    checkChange,
    // 高级筛选
    submitForm,
    tableCheckOne,
    tableCheckAll,
    exportPromise,
    resetData,
    initData,
    tableLoading,
    exportLoading,
    exportTemplate
  } = treeTableHook(currentDataId, 'testcase_library', containerRef)

  const globalpropsstore = getGlobalPropsStore()
  /* 按钮操作相关 */
  const toAddUsecase = () => {
    globalpropsstore.commonRouter({ path: '/libraryCase/addTestCase', view: 'testCase' }, true)
  }
  // 导入
  const { importDialogRef, fileList, importApiPromise, uploadRef, handleExceed } = importHook(currentDataId, 'library')
  const importCase = () => {
    let promise = importApiPromise()
    promise?.then(() => {
      importDialogRef.value.dialogVisible = false
      globalparamsstore.changeInitTree()
    })
  }
  const showImportDialog = () => {
    importDialogRef.value.dialogVisible = true
  }
  // 导出
  const exportDialogVisiable = ref(false)
  const tableProps = [
    {
      label: t('yongLiBianHao'),
      prop: 'testcaseNumber'
    },
    {
      label: t('yongLiMingCheng'),
      prop: 'testcaseName'
    },
    {
      label: t('youXianJi'),
      prop: 'priority'
    }
  ]
  const exportCommand = (val:string) => {
    if (val === 'exportCase') {
      // 导出的弹窗数据初始化
      initData()
      leftTreeNodeClick(currentDataId, 0)
      exportDialogVisiable.value = true
      nextTick(() => {
        containerRef.value.leftTreeRef.setCurrentKey(currentDataId)
      })
    } else {
      exportTemplate()
    }
  }
  const exportCase = () => {
    let promise = exportPromise()
    promise.then(() => {
      exportDialogVisiable.value = false
      resetData()
    }).catch()
  }
  const cancelExport = () => {
    resetData()
  }
  defineExpose({
    showImportDialog,
    exportCommand
  })
</script>
<style
  lang='scss'
  scoped
>
  .listBtn {
    height: 100%;
    width: 100%;
    .drawerForm{
      :deep(.el-form-item){
        width: 33.3%!important
      }
    }
  }
</style>
