<template>
  <el-container style="height:100%">
    <el-main>
      <div class="dataTable">
        <!-- <div style="display: flex; flex-direction: column; flex: 1; height:100%"> -->
          <HiTable
            :header-cell-style="props.headerCellStyle"
            :row-style="{height:'40px'}"
            :data="props.tableData"
            :column-type="props.colType"
            :drop-col="props.tableProps"
            :current-page-index="currentPageIndex"
            v-bind="$attrs"
            height="100%"
            row-key="id"
            stripe
            @sort-change="handleSortChange"
          >
            <slot></slot>
            <!-- 继承具名插槽 -->
            <template
              v-for="(index, name) in $slots"
              :key="name"
              #[name]="scope">
              <slot :name="name" :data="scope" />
            </template>
            <!-- <template v-for="(index, name) in $slots" #[name]>
              <slot :name="name" />
            </template> -->
          </HiTable>
      </div>
    </el-main>
    <el-footer v-if="props.showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="props.pageSizes"
        size="small"
        layout="total, sizes, ->, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- </div> -->
    </el-footer>
  </el-container>
</template>

<script
  setup
  lang="ts"
>
  import { ElTable } from 'element-plus'
  import HiTable from './HiTable.vue'
  import { PageInfoPropsType, PageInfoEmitType } from '@/utils/types/commonType'
  /* 接收数据和方法 */
  const props = withDefaults(defineProps<{
    tableData:any[]
    colType?:string
    pageInfo?:PageInfoPropsType
    showPagination?:boolean,
    tableProps?:any,
    pageSizes?:number[],
    headerCellStyle?: any
  }>(), {
    pageInfo: () => {
      return {
        pageNo: 1,
        pageSize: 20,
        totalRecord: 0,
        totalPage: 0
      }
    },
    colType: () => {
      return 'toggle'
    },
    tableProps: () => {
      return []
    },
    pageSizes: () => {
      return [20, 50, 100, 200]
    },
    headerCellStyle: () => {
      return { background: 'var(--el-fill-color-lighter)', color: '#272B31', 'font-weight': 400, 'font-size': '14px', height: '32px' }
    }
   })
  const emits = defineEmits(['changePageInfo', 'changeSortRules'])
  /* 列表展示内容相关 */
  const hiTableRef = ref < InstanceType < typeof ElTable >>()
  // 排序
  const handleSortChange = (column:any) => {
    emits('changeSortRules', column.prop, column.order)
  }
  /* 分页组件相关 */
  let currentPage = computed({
    get () {
      return props.pageInfo.pageNo
    },
    set (val:number) {
      return val
    }
  })
  let pageSize = computed({
    get () {
      return props.pageInfo.pageSize
    },
    set (val:number) {
      return val
    }
  })
  let total = computed(() => props.pageInfo.totalRecord)
  const currentPageIndex = computed(() => {
    return (currentPage.value - 1) * pageSize.value
  })
  const handleSizeChange = (val: number) => {
    let page:PageInfoEmitType = { pageNo: currentPage.value, pageSize: val }
    emits('changePageInfo', page)
  }
  const handleCurrentChange = (val: number) => {
    let page:PageInfoEmitType = { pageNo: val, pageSize: pageSize.value }
    emits('changePageInfo', page)
  }
  onMounted(() => {
    // initSelection()
  })
  onUnmounted(() => {
    // table组件销毁时需要将选中的数据清空
    hiTableRef.value?.clearSelection()
  })
  defineExpose({
     hiTableRef
  })
</script>
<style
  lang='scss'
  scoped
>
  .el-main {
    background-color: #fff;
    padding: 0;
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;

    .dataTable {
      height: 100%;
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    height: 40px;
    background-color: #fff;
    padding: 0;
    width: 100%;
    /* border-top: 1px solid #ccc; */

    .el-pagination {
      width: 100%;
      padding: 0 10px;
    }
  }
</style>
