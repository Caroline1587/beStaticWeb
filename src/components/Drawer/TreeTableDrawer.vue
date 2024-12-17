<template>
  <el-container class="drawer__content">
    <el-header style="position:relative">
      <div class="selectContainer">
        <slot name="customHeader" :number="props.selectedNumber"></slot>
      </div>
      <!-- 搜索及筛选框 -->
      <filterButton :level="1" />
    </el-header>
    <el-container class="mainContainer">
      <!-- 高级筛选 -->
      <ListSearch
        v-model:drawer-visiable="globalparamsstore.showAdvanceSearch2"
        v-bind="$attrs"
      >
        <slot name="searchForm"></slot>
      </ListSearch>
      <CustomTree
        ref="leftTreeRef"
        :module-name="props.treeTitle"
        show-checkbox
        default-expand-all
        node-key="id"
        :border="false"
        highlight-current
        :tree-data="props.treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="treeNodeClick"
        @check="check"
        @close="closeFilter"
      >
        <template #default="{ node }">
          <div class="nodeLabel" :style="node.isCurrent?'color:var(--el-color-primary)':''">
            <el-tooltip
              :content="node.label"
              placement="top"
              :show-after="1000"
            >
              <span class="label">{{ node.label }}</span>
            </el-tooltip>
            <span>（<i >{{ node.data.testcaseList.length?node.data.testcaseList.length:0 }}</i>）</span>
            <!-- <span>（<i style="text-decoration:underline">{{ node.data.ltcCount || node.data.totalCount }}</i>）</span> -->
          </div>
        </template>
      </CustomTree>
      <el-main class="tableContainer">
        <div
          v-loading="props.loading"
          class="dataTable"
          :element-loading-text="t('biaoGeShuJuJiaZaiZhong')"
        >
          <CustomTable
            col-type="selection"
            v-bind="$attrs"
            :table-data="tableData"
            :show-pagination="true"
            :table-props="props.tableProps"
            :border="false"
            row-key="id"
          >
            <template #empty>
              <CustomEmpty />
            </template>
          </CustomTable>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import {defineProps,defineEmits} from 'vue'
  // import { Search } from '@element-plus/icons-vue'
  import { TablePropsType } from '@/utils/types/commonType'
  // import { ElTree } from 'element-plus'
import CustomTable from "@/components/Drawer/CustomTable.vue"
import CustomTree from "@/components/CustomTree/index.vue"
// import CustomEmpty from "@/components/CustomEmpty/index.vue"
  import { globalParamsStore } from '@/store/index.ts'
  import ListSearch from '@/components/Drawer/SearchDrawer.vue'
  import filterButton from '@/views/common/filterButton.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n();

  const props = withDefaults(defineProps<{
    loading?:boolean
    treeData?:any
    tableData:any
    drawer:boolean
    drawerTitle?:string
    treeTitle?:string
    tableProps:TablePropsType[]
    selectedNumber:number
  }>(), {
    loading () {
      return false
    },
    drawer () {
      return false
    },
    drawerTitle () {
      return ''
    },
    treeData () {
      return []
    },
    treeTitle () {
      return ''
    }
  })
  const emits = defineEmits(['update:drawer', 'treeNodeClick', 'checkChange', 'getQueryParams'])
  const drawerVisible = computed({
    get () {
      return props.drawer
    },
    set (val:boolean) {
      emits('update:drawer', val)
      return val
    }
  })
  const globalparamsstore = globalParamsStore()
  // 树形结构
  const treeSearchExpand = ref(false)
  const folderKey = ref('')
  const leftTreeRef = ref()
  let currentNodeId = ''
  const treeNodeClick = (data:any, node:any) => {
    currentNodeId = data.id
    emits('treeNodeClick', data.id, node.level)
  }
  // 表格相关
  const tableData = computed(() => {
    return props.tableData
  })
  const check = (data:any, status:any) => {
    emits('checkChange', data, status)
  }
  // 高级筛选表单
  // 筛选效果
  watch(folderKey, (val) => {
    leftTreeRef.value?.treeRef.filter(val)
  })

  const filterNode = (value: string, data: any, node:any) => {
    if (!value) {
      node.data.highlight = false
    } else if (node.label?.includes(value)) {
      node.data.highlight = true
    } else {
      node.data.highlight = false
    }
    return true
  }
  const customNodeClass = (data:any) => {
    if (data.highlight) {
      return 'is-filter'
    }
    return ''
  }
  const defaultProps = {
    children: 'childrenList',
    label: 'name',
    class: customNodeClass
  }
  const closeFilter = () => {
    folderKey.value = ''
    treeSearchExpand.value = false
    // 保持原节点高亮
    nextTick(() => {
      leftTreeRef.value?.treeRef.setCurrentKey(currentNodeId)
    })
  }
  defineExpose({
    leftTreeRef
  })
</script>
<style
  lang='scss'
  scoped
>
  /* .el-drawer{ */
    /* .drawer__header{
      display: flex;
      align-items: center;
      height: 30px;
      .exportInfo{
        line-height: 1;
        margin-left: 15px;
        background-color: #FDF6EC;
        height: 100%;
        color: #E6A23C;
        display: flex;
        align-items: center;
      }
    } */
    .drawer__content{
      height: 100%;
      width: 100%;
      overflow: hidden;
      display: flex;
      .el-header{
        padding: 0;
        height: 32px;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        .drawerContainer{
          width: 100%;
          top:40px;
        }
        .selectContainer {
          display: flex;
          align-items: center;
          width:50%;
        }
        .btnContainer{
          width: auto;
          display: flex;
          align-items: center;
          .el-button {
            margin-left: 10px;
            width: 100px;
            height: 32px;
          }
        }
      }
      .mainContainer{
        border: 1px solid #C0C4CC;
        height: calc(100% - 40px);
        position: relative;
        :deep(.mask){
          width: 100%;
          height: 100%;
          .el-form-item{
            width: 33.3%;
            margin-right:0
          }
        }
        .treeAside{
          width: 190px;
          .el-tree{
            font-size: 0;
            display: inline-block;
            min-width: 100%;
            :deep(.el-icon) {
              font-size: 12px;
            }
            .treeLabel{
              font-size: 14px;
            }
            :deep(.el-tree-node__children){
              min-width: 100%;
              display: inline-block;
            }
            :deep(.el-tree-node__label){
              max-width: 140px;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              height: 17px;
            }
          }
          &>div:first-child {
            height: 30px;
            width: 100%;
            padding:0 7px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #E1E1E1;
            padding-left: 5px;
            .el-input{
              height: 25px;
              --el-input-border-color:#fff;
              --el-input-hover-border-color:#fff;
              --el-input-bg-color:#F0F0F0;
              --el-input-focus-border-color:#fff
            }
            >span{
              display: flex;
              align-items: center;
              i{
                margin-left: 3px;
              }
            }
          }
        }
        .tableContainer{
          padding: 0;
          display: flex;
          flex-direction: column;
          flex: 1;
          border-left: 1px solid #E1E1E1;
          .dataTable{
            height: 100%;
          }
        }
      }
    }
  /* } */
</style>
