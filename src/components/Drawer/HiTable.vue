 <template>
  <el-table
    v-bind="$attrs"
    ref="hiTableRef"
    class="tableDrag"
    :data="tableData"
    row-key="id"
    border
    style="width: 100%"
    :tooltip-options="{'raw-content':true,'show-after':1000}"
    :select-table-data="props.selectIds"
    @selection-change="handleSelectionChange"
    @select="tableCheckOne"
    @select-all="tableCheckAll"
  >
    <template
      v-for="(index, name) in $slots"
      #[name]
      :key="name">
      <!-- 展开列插槽处理 -->
      <HiTableColumn v-if="props.colExpand" type="expand" width="30">
        <template #default="scope">
          <slot name="tableExpand" :scope="scope" :data="scope.row" />
        </template>
      </HiTableColumn>
      <HiTableColumn v-if="props.customColExpand" type="expand" width="30">
        <template #default="scope">
          <slot name="expand" v-bind="scope" :data="scope.row" />
        </template>
      </HiTableColumn>
      <HiTableColumn
        v-if=" props.columnType === 'index'"
        :label="t('xuHao')"
        :resizable="false"
        type="index"
        width="70"
        align="center"
        fixed
      >
        <template #default="scope">
          {{ props.currentPageIndex + scope.$index + 1 }}
        </template>
      </HiTableColumn>
      <HiTableColumn
        v-else-if="props.columnType === 'selection'"
        type="selection"
        :reserve-selection="props.reserveSelection"
        width="70"
        align="center"
      />
      <el-table-column
        v-else-if="props.columnType === 'toggle'"
        type="selection"
        width="70"
        align="center"
      >
        <template #default="scope">
          <div class="indexContainer">
            <span id="selectSpan" :class="checkedId[scope.row.id]?'hiddenIndexOrCheckBox':''">
              {{ props.currentPageIndex + scope.$index + 1 }}
            </span>
            <span id="selectCheckbox" :class="checkedId[scope.row.id]?'':'hiddenIndexOrCheckBox'">
              <el-checkbox
                v-model="checkedId[scope.row.id]"
                @change="handleCheckedChange(scope)">
              </el-checkbox>
            </span>
          </div>
        </template>
      </el-table-column>
      <slot :name="name" />
      <HiTableColumn
        v-for="item in dropColumn"
        :key="item.prop||item.label"
        class-name="dragColumn"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :min-width="item.width ? item.width : '180px'"
        :sortable="item.sortable"
        show-overflow-tooltip
      >
        <template v-if="item.type === 'tag'" #default="scope">
          <CustomTag
            v-for="(tag, tagIndex) in scope.row[item.prop]?scope.row[item.prop].split(','):[]"
            :key="tag"
            :tag-info="tag"
            :tag-index="tagIndex"
          />
        </template>
        <template v-else-if="item.timeFormatter" #default="scope">
          {{ moment(scope.row[item.prop]).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <!-- 自定义列插槽处理 -->
        <template v-else-if="item.type === 'custom'" #default="scope">
          <slot :name="item.prop" :data="scope.row" />
        </template>
      </HiTableColumn>
      <HiTableColumn
        v-if="props.showOperateColumn && !props.customRowHandle"
        :label="t('caoZuo')"
        width="70"
        align="center">
        <el-link class="rowMove"><el-icon><Rank /></el-icon></el-link>
      </HiTableColumn>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
  import moment from 'moment'
  import Sortable from 'sortablejs'
  import { Rank } from '@element-plus/icons-vue'
  import { useI18n } from 'vue-i18n';
  import HiTableColumn from "@/components/Drawer/HiTableColumn.vue"
  // import CustomTag from "@/components/Tag/CustomTag.vue"

  const { t } = useI18n()
  interface dropColType {
    label:string
    prop:string
  }
  const props = withDefaults(defineProps<{
    allowColumnDrag?:boolean
    showOperateColumn?:boolean
    customRowHandle?:boolean
    data:any[]
    dropCol?:dropColType[]
    rowKey?:string
    columnType?:string
    reserveSelection?:boolean
    selectIds?:{[key:string]:boolean}
    currentPageIndex?:number
    colExpand?:boolean
    customColExpand?:boolean
  }>(), {
    allowColumnDrag () {
      return false
    },
    customRowHandle () {
      return false
    },
    showOperateColumn () {
      return false
    },
    data () {
      return []
    },
    dropCol () {
      return []
    },
    rowKey () {
      return ''
    },
    columnType () {
      return ''
    },
    reserveSelection () {
      return false
    },
    selectIds () {
      return {}
    },
    currentPageIndex () {
      return 0
    }
  })
  const emits = defineEmits(['selectionChange', 'tableCheckOne', 'tableCheckAll'])
  const tableCheckOne = (selection:any, row:any) => {
    emits('tableCheckOne', selection, row)
  }
  const tableCheckAll = (selection:any) => {
    emits('tableCheckAll', selection)
  }
  const tableData = computed({
    get () {
      return props.data
    },
    set (val:any[]) {
      return val
    }
  })
  const dropColumn = computed({
    get () {
      return props.dropCol
    },
    set (val:any[]) {
      return val
    }
  })
  const initData = () => {
    if (tableData.value.length > 0 && Object.keys(tableData.value[0]).indexOf('id') === -1) {
      tableData.value.forEach((item) => {
        item.id = Math.floor(Math.random() * 100000000)
      })
    }
  }
  /* 行拖拽 */
  const sortableRowInstance = ref()
  const sortableRow = () => {
    const tableRow = hiTableRef.value.$el.getElementsByTagName('tbody')[0]
    sortableRowInstance.value = Sortable.create(tableRow as HTMLElement, {
      animation: 150,
      filter: '.indexColumn',
      handle: '.rowMove',
      onEnd: ({ newIndex, oldIndex }:any) => {
        const currRow = tableData.value.splice(oldIndex, 1)[0]
        tableData.value.splice(newIndex, 0, currRow)
      }
    })
  }
  const sortableColumnInstance = ref()
  /* 列拖拽 */
  const sortableColumn = () => {
    const tableColumn = document.querySelector('.tableDrag .el-table__header-wrapper tr')
    sortableColumnInstance.value = Sortable.create(tableColumn as HTMLElement, {
      animation: 150,
      handle: '.dragColumn',
      onEnd: ({ newIndex, oldIndex }:any) => {
        if (newIndex > 0) {
          const oldItem = dropColumn.value[oldIndex - 1]
          dropColumn.value.splice(oldIndex - 1, 1)
          dropColumn.value.splice(newIndex - 1, 0, oldItem)
        }
        let temp = dropColumn.value
        dropColumn.value = []
        nextTick(() => {
          dropColumn.value = temp
        })
      }
    })
  }
  const hiTableRef = ref()
  /* 自定义勾选 */
  const handleCheckedChange = (value:any) => {
    if (value.row) {
      hiTableRef.value?.toggleRowSelection(value.row, checkedId.value[value.row.id])
    }
  }
  let checkedId = ref<{
    [key:string]:boolean
  }>({})
  /* 选项发生变化时触发 */
  const handleSelectionChange = (selection:any) => {
    if (props.columnType === 'toggle') {
      if (selection.length === 0) {
        Object.keys(checkedId.value).forEach(item => {
          checkedId.value[item] = false
        })
      } else {
        Object.keys(checkedId.value).forEach(item => {
          checkedId.value[item] = false
        })
        selection.forEach((item:any) => {
          checkedId.value[item.id] = true
        })
      }
    }
    emits('selectionChange', selection)
  }
  const initSelection = () => {
    // 初始化时设置部分数据处于选中状态
    props.data.forEach(item => {
      if (props.selectIds[item.id]) {
        hiTableRef.value?.toggleRowSelection(item, true)
      } else {
        hiTableRef.value?.toggleRowSelection(item, false)
      }
    })
  }
  onMounted(() => {
    initData()
    initSelection()
    if (props.showOperateColumn) {
      sortableRow()
    }
    if (props.allowColumnDrag) {
      sortableColumn()
    }
  })
  onUpdated(() => {
    initSelection()
  })
  onUnmounted(() => {
    sortableRowInstance.value?.destroy()
    sortableColumnInstance.value?.destroy()
  })
  defineExpose({
    hiTableRef
  })
</script>
<style
  lang='scss'
  scoped
>
  .indexContainer{
    &:hover{
      #selectSpan {
        display: none;
      }
      #selectCheckbox{
        display: block;
      }
    }
  }
  .hiddenIndexOrCheckBox{
    display: none;
  }
  .common-ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
</style>
