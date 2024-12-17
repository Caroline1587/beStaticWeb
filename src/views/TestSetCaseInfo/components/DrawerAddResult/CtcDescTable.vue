<template>
  <ctc-test-set-table
v-bind="$attrs"
:table-data="tableData"
:show-reslut-select="false"
@change-step="changeStep" />
</template>

<script setup lang="ts">
import CtcTestSetTable from './CtcTestSetTable.vue'
import { useTestSetStore } from '@/store/index'
import { createUUID } from '@/utils/public'
import ctcPageHook from '@/views/TestSetCaseInfo/hook/ctcPageHook'

const $store = useTestSetStore()
const { allCaseInfo } = storeToRefs($store)
const { ctcTableAllData, queryCtcListByInfoRequest } = ctcPageHook()

// 修改过的数据
let changeData:any = ref([])
const handleChangeData = (data:any) => {
  // 若已经更改过则进行覆盖
  if (changeData.value.find((item:any) => item.stepId === data.stepId)) {
    for (let i = 0; i < changeData.value.length; i++) {
      if (changeData.value[i].stepId === data.stepId) {
        changeData.value[i] = data
      }
    }
  } else {
    // 未更改过进行添加
    changeData.value.push(data)
  }
}

// 获取请求所需的ltc&ctc数据结构
const getRequestData = () => {
  let resultList = changeData.value.map((item:any) => {
    return {
      id: item.id,
      stepId: item.stepId,
      actualResult: item.actualResult,
      executionResult: item.executionResult
    }
  })
  return resultList[0]
}

// 只修改了测试步骤
const changeStep = (id:string) => {
  let data = tableData.value.find((item:any) => item.stepId === id)
  console.log(data, id)

  handleChangeData(data)
}

let tableData:any = ref([])

// 请求ctc数据
const queryCtcListByInfo = async () => {
  // 请求ltc对应的ctc
  await queryCtcListByInfoRequest()
  // 得到ctc表格以及测试步骤数据
  tableData.value = ctcTableAllData.value.stepList.map((item:any) => {
    let findTextResult = ctcTableAllData.value.textResult?.find((textItem:any) => textItem.stepId === item.id)
    return {
      ...item,
      id: findTextResult ? findTextResult.id : createUUID(),
      stepId: item.id,
      actualResult: findTextResult ? findTextResult.actualResult : '',
      executionResult: findTextResult ? findTextResult.executionResult : ''
    }
  })
}

onMounted(() => {
  if (allCaseInfo.value.templateType === 1)queryCtcListByInfo()
})

defineExpose({
  getCtcData: queryCtcListByInfo,
  getRequestData
})

</script>

<style lang="scss" scoped>

</style>
