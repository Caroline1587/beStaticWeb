<template>
  <el-container class="aside-table-layout">
    <el-aside>
      <caseLibTree
        ref="asideTree"
        :tree-data="treeData"
        @export-or-import="exportOrImport"
        @init-tree-folder="initTreeFolder"
        @init-list="initList" />
    </el-aside>
    <el-container class="common-table-layout">
      <el-header>
        <span class="ellipsis" :title="t('yongLiLieBiao')">{{ t('yongLiLieBiao') }}</span>
        <div class="btn-container">
          <caseListButton
            v-show="tableBtnType"
            ref="listBtn"
            :disabled="routeparamsstore.caseInfo.resourceFolderId === ''"
            :tree-data="treeData"
            :folder-permission-disabled="asideTree?.hiTreeRef?.currentNodeData?.isFullPermission===0"
          />
          <tableBtn
            case-type="testcase_library"
            :table-btn-type="selectIds.length ===0"
            :select-ids="selectIds"
            :tree-data="treeData"
            :select-data-number="selectTableData.length"
            @reload="reload"
            @handle-table-props="handleTableProps"
          >
            <el-button
              v-show="!tableBtnType"
              class="red-liner-button"
              :disabled="!enableDataBatchDelete"
              @click="toConfimDelete(selectIds.length+'', selectIds, false)"
            >
              {{ t('shanChu') }}
            </el-button>
          </tableBtn>
        </div>
      </el-header>
      <el-main>
        <CaseListSearch
          v-model:drawer-visiable="globalparamsstore.showAdvanceSearch"
          height="170px"
          @submit-form="submitForm"
        >
          <caseAdvanceForm
            :show-require="false"
            :show-custom="false"
          />
        </CaseListSearch>
        <CustomTable
          :table-data="data"
          :show-pagination="true"
          :page-info="pageInfo"
          :table-props="tableProps"
          :select-ids="selectIdsObj"
          :default-sort="{prop:defaultSort[0], order:defaultSort[1]}"
          @change-sort-rules="changeSortRules"
          @selection-change="getSelection"
          @change-page-info="changePageInfo"
          @header-dragend="setColumWidthInfo"
        >
          <template #empty>
            <CustomEmpty />
          </template>
          <HiTableColumn
            :label="t('yongLiBianHao')"
            sortable="custom"
            property="testcaseNumber"
            :width="getColumWidth('testcaseNumber','input')"
            show-overflow-tooltip
            fixed
          >
            <template #default="scope">
              <span class="tableClickItem" @click="toTestcaseInfo(scope.$index, scope.row)">
                {{ scope.row.testcaseNumber }}
              </span>
            </template>
          </HiTableColumn>
          <HiTableColumn
            :label="t('yongLiMingCheng')"
            sortable="custom"
            property="testcaseName"
            :min-width="getColumWidth('testcaseName','name')"
            show-overflow-tooltip
            fixed
          >
          </HiTableColumn>
          <HiTableColumn
            :label="t('caoZuo')"
            :width="flexColumnWidth(operateLabel)"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                class="text-button"
                :disabled="!enableDataEdit"
                @click="toEditCase(scope.$index, scope.row)"
              >
                {{ operateLabel[0] }}
              </el-button>
              <el-button
                class="text-button"
                :disabled="!enableDataDelete"
                @click="toConfimDelete(scope.row.testcaseNumber, [scope.row.id], true)"
              >
                {{ operateLabel[1] }}
              </el-button>
            </template>
          </HiTableColumn>
        </CustomTable>
      </el-main>
    </el-container>
    <DeleteDialog
      ref="deleteDialogRef"
      case-type="testcase_library"
      @init-list="initTreeFolder"
    />
  </el-container>
</template>
<script
  setup
  lang="ts"
>
  import { flexColumnWidth } from '@/utils/public'
  import { routeParamsStore, globalParamsStore } from '@/store/index'
  import caseLibTree from './components/caseLibTree.vue'
  import caseListButton from './components/caseListBtn.vue'
  import CaseListSearch from '@/components/Drawer/SearchDrawer.vue'
  import tableBtn from './components/caseTableBtn.vue'
  import DeleteDialog from '@/views/ProjectCase/caseManageList/components/DeleteDialog.vue'
  // hook
  import caseList from './hook/caseList'
  import usePermission from '@/views/common/usePermission'
  import CustomEmpty from "@/components/CustomEmpty/index.vue"

  const caseAdvanceForm = defineAsyncComponent(() => import('./components/caseAdvanceForm.vue'))
  const { t } = useI18n()
  const operateLabel = [t('bianJi'), t('shanChu')]
  const { enableDataEdit, enableDataDelete, enableDataBatchDelete } = usePermission('testcase_library')
  const routeparamsstore = routeParamsStore()
  const globalparamsstore = globalParamsStore()
  const {
    // 树形
    asideTree,
    treeData,
    initTreeFolder,
    // 表格
    defaultSort,
    data,
    initList,
    changeSortRules,
    tableBtnType,
    setColumWidthInfo,
    getColumWidth,
    // 表格分页
    pageInfo,
    changePageInfo,
    // 表格控制列是否展示
    tableProps,
    handleTableProps,
    // 表格行选中
    selectTableData,
    selectIds,
    selectIdsObj,
    getSelection,
    // 表格行删除功能
    deleteDialogRef,
    toConfimDelete,
    // 路由跳转
    beforeToTestcaseInfo,
    // 其他
    reload,
    listBtn,
    exportOrImport,
    submitForm
  } = caseList('testcase_library')

  const globalpropsstore = getGlobalPropsStore()
  // 路由跳转
  const toTestcaseInfo = (index:number, row:any) => {
    beforeToTestcaseInfo(index, row)
    globalpropsstore.commonRouter({ path: `/libraryCase/testCaseInfo/caseDetail/${row.id}`, view: 'testCase' }, true)
  }
  const toEditCase = (index:number, row:any) => {
    beforeToTestcaseInfo(index, row)
    globalpropsstore.commonRouter({ path: `/libraryCase/editTestCase/${row.id}`, view: 'testCase' }, true)
  }
</script>
<style
  lang='scss'
  scoped
>
  .common-layout {
    height: 100%;
    margin-bottom: 10px;
    .mainContainer {
      height: 100%;
    }

    .el-aside {
      width: auto;
      background-color: #F2F5FA;
      margin-right: 10px;
      border-right: 1px solid #ccc;
    }

    .el-header {
      background-color: #fff;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 30px;
      padding-right: 30px;
      position: relative;
      .drawerContainer{
        width: calc(100% - 60px);
        top:60px;
      }
    }

    .el-main {
      overflow: hidden;
      background-color: #fff;
      padding: 0;
      padding: 0 30px 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      :deep(.mask){
        width: calc(100% - 60px);
        height: calc(100% - 20px);
      }
      :deep(.el-form){
        .el-form-item{
          width: 25%;
          margin-right:0
        }
      }
    }
    .mainData{
      border: 1px solid $--global--regular--border--color;
      position: relative;
      flex: 1;
      flex-basis: auto;
      padding: 0;
      display: flex;
      height: calc(100% - 105px);
      .el-aside{
        width: auto;
        height: 100%;
        margin-right: 0;
        position: relative;
        background-color: #fff;
        >div{
          height: 100%;
        }
      }
      .el-main{
        padding:0 10px;
        .tableHeader {
          display: flex;
          height: 40px;
          align-items: center;
          justify-content: space-between;
          >span{
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            color: $--global--heavy--text--color ;
          }
          :deep(.el-button){
            height: 30px;
          }
        }
        .tableMain{
          height: calc(100% - 40px);
        }
      }
    }
    .el-footer {
      display: flex;
      align-items: center;
      height: 60px;
      background-color: #fff;
      padding: 0;

      .el-pagination {
        width: 100%;
      }
    }

    .drawerFooter {
      .el-button {
        width: 70px;
        font-weight: 400;
        font-size: 16px;
      }

      button:last-child {
        background-color: var(--el-color-primary);
      }
    }
    .dialogInfo{
      i{
        background-color: #ECF5FF;
        margin:0 5px;
      }
    }
  }
  .flex-box{
    display: flex;
    align-items: center;
  }
</style>
