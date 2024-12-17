<template>
  <el-container>
    <el-header v-if="props.editable">
      <div class="leftBtns">
        <el-button
          :disabled="leftBtnDisabled"
          class="blue-button"
          @click="addCtcData">
          <el-icon style="margin-right:2px" :size="16"><Plus /></el-icon>
          {{ t('xinJianJuTiYongLi') }}
        </el-button>
        <el-button
          class="icon-text-button"
          style="margin-right:12px"
          :disabled="leftBtnDisabled"
          @click="importDialogRef.dialogVisible=true"
        >
          {{ t('daoRu') }}
        </el-button>
        <el-dropdown trigger="click" @command="exportCommand">
          <el-button class="icon-text-button" :disabled="leftBtnDisabled">
            {{ t('daoChu') }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="1">{{ t('daoChuExcelCanShuBiao') }}</el-dropdown-item>
              <el-dropdown-item :command="0">{{ t('daoChuCanShuBiaoKongMoBan') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="rightBtns">
        <el-button class="icon-text-button" :disabled="rightBtnDisabled" @click="markCtc">
          <el-icon size="16px"><svg-icon icon-class="case_mark_ctctable"></svg-icon></el-icon>
        </el-button>
        <el-button class="icon-text-button" :disabled="selectTableData.length===0 || rightBtnDisabled" @click="copyCtc">
          <el-icon size="16px"><DocumentCopy /></el-icon>
        </el-button>
        <el-button class="icon-text-button" :disabled="selectTableData.length===0 ||rightBtnDisabled" @click="deleteCtc">
          <el-icon size="16px"><Delete /></el-icon>
        </el-button>
      </div>
    </el-header>
    <el-main>
      <div class="tableContainer">
        <FormTable
          ref="formTableRef"
          :table-data="tableData"
          :table-column="props.tableColumn"
          :rules="props.tableDataRules"
          :editable="props.editable"
          table-id="table1"
          @handle-table="handleTable"
          @selection-change="getSelection"
          @row-click="rowClick"
          @cell-click="cellClick"
          @sortable-on-end="sortableOnEnd"
          @scroll-load="load"
        >
        </FormTable>
      </div>
      <messageComps tag-name="span" class-name="totalSpan" :info="t('gongJiZongShuPropstabledatalengthTiao', [`<i>${props.tableData.length}</i>`])"></messageComps>
    </el-main>
    <!-- 导出 -->
    <TipDialogV5
      ref="exportDialogRef"
      :title="t('daoChuJuTiYongLiCanShuBiao')"
    >
      <div class="dialog-body">
        <div class="exportInfo">
          <el-icon><WarningFilled /></el-icon>
          {{ t('shiFouQueDingBaoCunDangQianXinXiBingDaoChuExcelCanShuBiao') }}
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button class="grey-liner-button" @click="exportDialogRef.dialogVisible=false">{{ t('quXiao') }}</el-button>
          <el-button class="blue-button" @click="exportExcel(props.tableColumn,tableData, isParams, 'ctcList'), exportDialogRef.dialogVisible=false">{{ t('daoChu') }}</el-button>
        </div>
      </template>
    </TipDialogV5>
    <!-- 复制和删除 -->
    <TipDialogV5
      ref="copyDialogRef"
      :title="t('fuZhiJuTiYongLi')"
    >
      <messageComps tag-name="div" class-name="dialogInfo" :info="t('yiXuanZhongSelecttabledatalengthTiaoJuTiCeShiYongLiQingQueRenShiFouFuZhi', [`<i>${ selectTableData.length }</i>`])"></messageComps>
      <div style="margin-top:10px;color:var(--global--regular--text--color)">{{ t('shuoMingPiLiangFuZhiSuoXuanDeJuTiCeShiYongLiJuTiYongLiBianHaoHouZiDongJiaFuBen') }}</div>
       <template #footer>
        <el-button class="grey-liner-button" @click="copyDialogRef.dialogVisible=false">{{ t('quXiao') }}</el-button>
        <el-button class="blue-button" @click="tipDialogRun(0)">{{ t('queDing') }}</el-button>
      </template>
    </TipDialogV5>
    <TipDialogV3
      ref="deleteDialogRef"
      :title="t('shanChuJuTiYongLi')"
      @to-operate="tipDialogRun"
    >
      <template #tipInfo>
        <messageComps tag-name="div" class-name="dialogInfo" :info="t('yiXuanZhongSelecttabledatalengthTiaoJuTiCeShiYongLiQingQueRenShiFouShanChu', [`<i>${ selectTableData.length }</i>`])"></messageComps>
      </template>
      <template #notice>
        <i class="emphasizeRed">{{ t('zhuYi') }}</i>{{ t('piLiangShanChuSuoXuanDeJuTiCeShiYongLiCiCaoZuoBuKeHuiFu') }}
      </template>
    </TipDialogV3>
    <!-- 导入 -->
    <TipDialogV5
      ref="importDialogRef"
      :title="t('daoRuJuTiYongLiCanShuBiao')"
    >
      <ul class="importInfo">
        <li>{{ t('daoRuDeExcelWenJianBianLiangMingChengJiShuLiangBiXuYuPingTaiZhongYiZhi') }}</li>
        <li>{{ t('daoRuHouHuiGenJuJuTiYongLiBianHaoZiDongXinJianHeGengXinJuTiCeShiYongLi') }}</li>
        <li>{{ t('daoRuDeShuJuBuFuHeGuiFanHuoZheWeiKongZhiJiangBuNengDaoRu') }}</li>
      </ul>
      <import-excel
        ref="importUploadRef"
        :table-column="props.tableColumn"
        @on-success="onSuccessHandle" />
      <template #footer>
        <el-button class="grey-liner-button" @click="importDialogRef.dialogVisible=false">{{ t('quXiao') }}</el-button>
        <el-button class="blue-button" @click="confrimImportHandle()">{{ t('daoRu') }}</el-button>
      </template>
    </TipDialogV5>
  </el-container>
</template>

<script lang="ts" setup>
  import { Plus, ArrowDown, DocumentCopy, WarningFilled, Delete } from '@element-plus/icons-vue'
  import { exportExcel } from './deriveExcel'
  import { TableColumn, CtcModelType, CtcValueObj, TableData } from '@/utils/types/testcaseType'
  import FormTable from '@/components/Table/FormTable.vue'
  import importExcel from './importExcel.vue'
  import { errorMessage, warningMessage } from '@/utils/message'
  import { createUUID } from '@/utils/public'
  import useRenderHtml from '@/views/common/useRenderHtml'
  const { handleComps } = useRenderHtml()
  const messageComps:any = handleComps()
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    editable?:boolean,
    tableColumn: TableColumn[]
    tableData:any[],
    tableDataRules?:{[key:string]:any}
    // disabled?:boolean
  }>(), {
    editable () {
      return true
    },
    tableColumn () {
      return []
    },
    tableDataRules () {
      return {}
    }
  })
  const $emits = defineEmits(['handleImportExcelSuccess', 'getCurrentCtcData', 'changeTableData'])
  // 表格上方功能行
  const leftBtnDisabled = ref(false)
  const rightBtnDisabled = ref(false)
  const addCtcData = () => {
    $emits('changeTableData', 'add')
    formTableRef.value.tableScrollToBottom()
  }
  // 表格数据
  const tableData = ref<TableData[]>([]) // 存储分页数据
  const tableAllData = ref<TableData[]>([]) // 存储所有数据
  const selectTableData = ref<TableData[]>([])
  const sortableOnEnd = (list:any) => {
    tableData.value = []
    tableData.value = list
  }
  const getSelection = (val:TableData[]) => {
    selectTableData.value = val
  }
  /* 表格按钮操作 */
  // 是否携带参数
  let isParams = ref(false)
  // 导入导出
  const exportDialogRef = ref()
  const exportCommand = (command:number) => {
    if (command) {
      isParams.value = true
      exportDialogRef.value.dialogVisible = true
    } else {
      isParams.value = false
      if (props.tableColumn.length === 0) return
      // 不需要打开弹窗直接下载即可
      exportExcel(props.tableColumn, tableData.value, isParams.value, 'ctcList')
    }
  }
  const importDialogRef = ref()
  // 标记高亮
  const markCtc = () => {
    // console.log(currentCell.column)
    // 排除掉不支持高亮的列
    if (currentCell.column === t('bianHao') || currentCell.column === t('xuHao') || currentCell.column === t('miaoShu')) {
      errorMessage(t('suoXuanDanYuanGeBuZhiChiGaoLiang'))
    } else {
      let hightLight = tableData.value[currentCell.row][currentCell.column].hightLight === 0 ? 1 : 0
      tableData.value[currentCell.row][currentCell.column].hightLight = hightLight
    }
  }
  // 删除和复制
  const deleteDialogRef = ref()
  const deleteCtc = () => {
    deleteDialogRef.value.dialogVisible = true
  }
  const copyDialogRef = ref()
  const copyCtc = () => {
    copyDialogRef.value.dialogVisible = true
  }
  const tipDialogRun = (operateType = 1) => {
    // 0是复制, 1是删除
    handleTable(operateType, selectTableData.value)
  }
  const handleTable = (operateType:number, selectTableData:TableData[]) => {
    if (operateType === 0) {
      selectTableData.forEach(item => {
        let temp = JSON.parse(JSON.stringify(item))
        tableAllData.value.push({
          ...temp,
          step: tableAllData.value.length + 1,
          ctcNum: { value: t('itemctcnumvalueFuBen', [item.ctcNum.value]), highLight: 0 },
          id: createUUID(),
          checked: false
        })
      })
      copyDialogRef.value.dialogVisible = false
    } else {
      let temp = selectTableData.map(item => item.id)
      let data = tableAllData.value.filter(item => !temp.includes(item.id))
      tableAllData.value = data.map((item, index) => {
        return {
          ...item,
          step: index + 1
        }
      })
      $emits('getCurrentCtcData', tableAllData.value[0] ? tableAllData.value[0] : voidTableRow)
      deleteDialogRef.value.dialogVisible = false
    }
    $emits('changeTableData', 'change', tableAllData.value)
  }
  // excel导入成功
  let tableDataCahe:TableData[] = []
  const onSuccessHandle = ({ excleTable }:any) => {
    // 将exce数据进行暂存
    tableDataCahe = excleTable.map((item:TableData, index:number) => {
      return {
        ...item,
        step: index + 1,
        id: createUUID()
      }
    })
  }
  // 上传文件ref
  let importUploadRef = ref()
  // 确定导入
  const confrimImportHandle = () => {
    if (tableDataCahe.length === 0) {
      warningMessage(t('qingXianShangChuanWenJian'))
      return
    }
    // tableData.value = tableDataCahe
    let data = tableDataCahe.map(item => {
      // 若导入的数据类型应为String类型，但excel填的为number类型，则此处进行 number -> string的转换，防止初次校验不通过
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          let tableColumn = props.tableColumn.find(cloumn => cloumn.prop === key)
          // console.log(tableColumn, 'tableColumn')
          if (tableColumn?.rule === 'String') {
            item[key].value = item[key].value + ''
          }
        }
      }
      return {
        ...item
      }
    })
    tableData.value = []
    $emits('handleImportExcelSuccess', data)
    // console.log(tableDataCahe, 'tableDataCahe')
    importDialogRef.value.dialogVisible = false
    // 清空上传的文件以及暂存的数据
    tableDataCahe = []
    importUploadRef.value.ulpoadRef.clearFiles()
  }
  // 调用formTable子组件进行表单验证
  let formTableRef = ref()
  const getCheck = () => {
    return formTableRef.value.handleFormValidate()
  }
  // 收集请求所需数据
  const getRequestParam = (variableList:TableColumn[]) => {
    let arr:CtcModelType[] = []
    tableData.value.forEach(item => {
      let value = {} as CtcValueObj
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          if (key === 'step' || key === 'ctcNum' || key === 'id' || key === 'ctcName' || key === 'ctcDesc') continue
          // 若当前key不在变量当中则不进行数据收集
          if (!variableList.find(item => item.prop === key)) continue
          value[key] = {
            value: item[key].value,
            hightLight: item[key].hightLight
          }
        }
      }
      let data = {
        id: item.id,
        ctcOrder: item.step,
        ctcNum: item.ctcNum.value,
        ctcName: item.ctcName.value,
        ctcDesc: item.ctcDesc.value,
        ctcValue: JSON.stringify(value),
        createType: 1
      }
      arr.push(data)
    })
    return arr
  }
  // 表格中行点击事件，收集当前选中行的数据渲染ctcAside
  const rowClick = (row:any) => {
    $emits('getCurrentCtcData', row)
  }
  // 表格中单元格点击事件，获取当前选中的单元格的数据
  let currentCell = {
    row: 0,
    column: ''
  }
  const cellClick = (row:any, column:any) => {
    currentCell = {
      row: row.step - 1,
      // column: column.label
      column: column.title
    }
  }
  let page = 1 // 最开始为第一页
  let limit = 20 // 每页有20条数据
  let pageLength = 0 // 总页数
  const getPageLimitData = () => { // 从数组中通过slice截取出新数组
    let nextPageData = tableAllData.value.slice((page - 1) * limit, page * limit) // page-1开始下标page*limit结束下标
    tableData.value.push(...nextPageData)
    // console.log(tableData.value, 'nextPageData')
  }
  // // 滚动到底部
  const load = () => {
    console.log('load')
    // 若到最后一页则直接返回
    if (page === pageLength) return
    // 页数+1
    page++
    // 将对应页数的数据添加到表格中
    getPageLimitData()
  }
  let voidTableRow:any = {}
  watch(() => props.tableData, (val) => {
    tableAllData.value = val
     // 初始化页数
    page = 1
    tableData.value = []
    // 总页数
    pageLength = Math.ceil(tableAllData.value.length / limit)
    getPageLimitData()
    // tableData.value = val
    rightBtnDisabled.value = val.length === 0
  }, { deep: true, immediate: true })
  watch(() => props.tableColumn, (val) => {
    leftBtnDisabled.value = val.length === 1
    currentCell.column = val[1]?.label
    voidTableRow = { step: 1, id: '' } as TableData
    val.forEach(item => {
      voidTableRow[item.prop] = { value: '', hightLight: 0 }
    })
  }, { deep: true, immediate: true })
  defineExpose({
    getRequestParam,
    getCheck
  })
  onMounted(() => {
    // bcbf
  })

</script>
<style
  lang='scss'
  scoped
>
  .el-container{
    height: 100%;
    .el-header{
      height: 50px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-main{
      padding: 0;
      .totalSpan{
        height: 20px;
        i{
          color: var(--el-color-primary);
        }
      }
      .tableContainer{
        height: 420px;
        border: 1px solid #ccc;
        :deep(td .cell){
          height: 100%;
        }
      }
    }
    .el-dialog .dialog-body >div{
      border:0;
      /* background-color: red; */
    }
    .exportInfo{
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      .el-icon{
        color: #E6A23C;
        margin-right: 5px;
      }
    }
    .dialogInfo{
      color:$--global--heavy--text--color;
      i{
        color: var(--el-color-primary);
        margin:0 5px;
      }
    }
    .importInfo{
      padding: 0 20px;
      li{
        height: 30px;
        list-style:disc;
      }
    }
  }
</style>
