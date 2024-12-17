<template>
  <el-alert
    v-if="$props.clickType===3"
    :title="t('gouXuanLeDuoGeLuoJiCeShiYongLiWuFaXiuGaiJuTiCeShiYongLiZhiHangJieGuo')"
    type="warning"
    show-icon
    :closable="false"
  />
  <CustomTable
    v-if="tableData.length > 0"
    :table-data="tableData"
    :table-props="tableProps"
    :header-cell-style="{ background: '#fff', color: '#272B31', 'font-size': '14px', height: '40px' }"
    :col-expand="$props.testsetType === 2 ?true:false"
    :border="false"
    :show-pagination="$props.clickType === 1 ? true : false"
    :page-info="ctcPageInfo"
    column-type="noselection"
    row-class-name="custom-table-row"
    cell-class-name="custom-table-cell"
    class="test-set-custom-table"
    @change-page-info="ctcChangePageInfo"
    @change-sort-rules="changeSortRules"
  >
    <template #tableExpand="{ data:{data} }">
      <ctc-test-set-table :table-data="data.stepResultList" @change-step="changeStep" />
    </template>
    <!-- 用例描述 -->
    <!-- <template #ctcDesc="{ data:{data} }">
      <span>前置条件: {{ $props.ltcTableRow.preConditionDesc }}</span>
      <span v-for="(item, index) in data.stepResultList" :key="index">
        测试步骤:{{ index + 1 }}、{{ item.testStep }}
        预期结果: {{ item.expectResult + ' ' }}
      </span>
      <span>复位步骤: {{ $props.ltcTableRow.resetDesc }}</span>
    </template> -->
    <!-- 测试结果 -->
    <template #executionResult="{ data:{data} }">
      <dropdown-ctc-result :status="data.executionResult" @handle-command="handleCommand($event, data)" />
    </template>
    <!-- 备注 -->
    <template #note="{ data:{data} }">
      <div @click="data.show = true">
        <span v-if="!data.show">{{ data.note ? data.note : '输入备注' }}</span>
        <el-input
          v-else
          v-model="data.note"
          maxlength="500"
          @input="handleChangeData(data)"
          @keyup.enter="data.show = false"
          @blur="data.show = false"
        >
        </el-input>
      </div>
    </template>
  </CustomTable>
</template>

<script setup lang="ts">
import CtcTestSetTable from './CtcTestSetTable.vue'
import DropdownCtcResult from './DropdownCtcResult.vue'
// import { useTestSetStore } from '@/store/index'
import pageHook from '@/hooks/pageAndTableHook'
import ctcPageHook from '@/views/TestSetCaseInfo/hook/ctcPageHook'

// const $store = useTestSetStore()
// const { ctcTableData, ctcPageInfo, ctcOrderBy } = storeToRefs($store)
const { ctcChangePageInfo, ctcTableData, ctcPageInfo, ctcOrderBy, queryCtcListByInfoRequest } = ctcPageHook()
const { t } = useI18n()
const $props = withDefaults(defineProps<{
  testsetType?: number,
  tableCtcData?: any,
  ltcTableRow?: any
  clickType?: number
}>(), {
  testsetType: 1,
  tableCtcData: () => {
    return []
  },
  ltcTableRow: () => {
    return {}
  },
  clickType: 1
})

const $emits = defineEmits(['changeShowResultCell'])

let { tableProps, getSortRules } = pageHook()

// 表格表头列表
tableProps.value = [
  {
    label: t('juTiYongLiBianHao'),
    prop: 'ctcNum',
    sortable: 'custom'
  },
  {
    label: t('yongLiMiaoShu'),
    prop: 'ctcDesc'
  },
  {
    label: t('zhiHangJieGuo'),
    prop: 'executionResult',
    type: 'custom'
  },
  {
    label: t('beiZhu'),
    prop: 'note',
    type: 'custom'
  }
]

// 表格排序
const changeSortRules = (prop: string, order: string) => {
  ctcOrderBy.value = getSortRules(prop, order, false)
  queryCtcListByInfoRequest()
}

// 修改过的数据
let changeData:any = ref([])
const handleChangeData = (data:any) => {
  // 若已经更改过则进行覆盖
  if (changeData.value.find((item:any) => item.ctcId === data.ctcId)) {
    for (let i = 0; i < changeData.value.length; i++) {
      if (changeData.value[i].ctcId === data.ctcId) {
        changeData.value[i] = data
      }
    }
  } else {
    // 未更改过进行添加
    changeData.value.push(data)
  }
}
// 只修改了测试步骤
const changeStep = (ctcId:string) => {
  let ctcData = tableData.value.find((item:any) => item.ctcId === ctcId)
  handleChangeData(ctcData)
}

// 测试用例状态下拉框
const handleCommand = (command: string | number | object, data:any) => {
  // console.log(command, data, 'command')
  data.executionResult = command
  handleChangeData(data)
}
// 获取请求所需的ltc&ctc数据结构
const getRequestData = () => {
  let ctcResultList = changeData.value.map((item:any) => {
    return {
      ctcId: item.ctcId,
      ctcNum: item.ctcNum,
      executionStatus: item.executionStatus,
      executionResult: item.executionResult,
      note: item.note,
      stepResultList: item.stepResultList.map((stepItem:any) => {
        return {
          id: stepItem.id,
          stepId: stepItem.stepId,
          actualResult: stepItem.actualResult,
          executionResult: stepItem.executionResult
        }
      })
    }
  })
  return ctcResultList
}

let tableData:any = ref([])

// 请求ctc数据
const queryCtcListByInfo = async () => {
  // 请求ltc对应的ctc
  await queryCtcListByInfoRequest()
  // 得到ctc表格以及测试步骤数据
  tableData.value = ctcTableData.value?.map((item:any) => {
    return {
      ...item,
      stepResultList: item?.stepResultList.map((stepItem:any) => {
        return {
          ...stepItem,
          testStep: stepItem.testStep
        }
      })
    }
  })
  console.log(tableData.value, 'tableData.value')
  if (tableData.value.length === 0) {
    $emits('changeShowResultCell', false)
  } else {
    $emits('changeShowResultCell', true)
  }
}

// 根据点击的类型确定数据来源
const getCtcData = () => {
  switch ($props.clickType) {
    case 1:
      // 请求ltc对应的ctc
      queryCtcListByInfo()
      break
    case 3:
      // 请求ltc对应的ctc
      // console.log($store.ctcRow, 'ctcRow')
      tableData.value = []
      break
    default:
      break
  }
}
// 数据改变时重新赋值
watch(() => ctcTableData.value, () => {
  tableData.value = ctcTableData.value
})
defineExpose({
  getCtcData,
  getRequestData
})

</script>

<style lang="scss" scoped>
// 表格卡片样式
// .test-set-custom-table{
//   // padding: 0px 5px;
//   box-sizing: border-box;
//   border-left: 1px solid var(--el-collapse-border-color);
//   border-right: 1px solid var(--el-collapse-border-color);
//   :deep(.el-table__body-wrapper){
//     background: #F8F9FA;
//     table{
//       // 以下两行为表格tr增加边距
//       // border-collapse: separate;
//       // border-spacing: 0px 6px;
//       .custom-table-row{
//         // box-shadow: var(--el-box-shadow);
//         &:hover{
//           .custom-table-cell{
//             background: none;
//           }
//         }
//         .custom-table-cell{
//           // border: none;
//           padding: 0px;
//           height: 40px;
//           margin-bottom: 4px;
//           &:nth-of-type(1){
//             border-radius: 10px 0px 0px 10px;
//           }
//           &:last-child{
//             border-radius: 0px 10px 10px 0px;
//           }
//         }
//       }
//     }
//   }
// }

.test-set-custom-table{
  // padding: 0px 5px;
  box-sizing: border-box;
  border-left: 1px solid var(--el-collapse-border-color);
  border-right: 1px solid var(--el-collapse-border-color);
  :deep(.el-table__body-wrapper){
    // background: #F8F9FA;
    table{
      // 以下两行为表格tr增加边距
      border-collapse: separate;
      border-spacing: 0px 3px;
      .custom-table-row{
        // box-shadow: var(--el-box-shadow);
        box-shadow: 0px 0px 0px 1px rgb(0 0 0 / 2%), 0px 5px 11px rgb(0 0 0 / 2%);
        &:hover{
          .custom-table-cell{
            background: none;
          }
        }
        .custom-table-cell{
          // border: none;
          padding: 0px;
          height: 40px;
          margin-bottom: 4px;
          &:nth-of-type(1){
            border-radius: 10px 0px 0px 10px;
          }
          &:last-child{
            border-radius: 0px 10px 10px 0px;
          }
        }
      }
    }
  }
}
</style>
