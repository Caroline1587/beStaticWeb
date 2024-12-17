<template>
  <div :key="testSetRow.testcaseId" class="container">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-divider> <span class="divider-title">{{ t('dangQianJiLu') }}</span> </el-divider>
      <ResultRecordCollapseItem :testset-info="testsetInfo" :data="ctcExecutionList.slice(0,1)" />

      <el-divider> <span class="divider-title">{{ t('liShiJiLu') }}</span> </el-divider>
      <ResultRecordCollapseItem :testset-info="testsetInfo" :data="ctcExecutionList.slice(1)" />
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import ResultRecordCollapseItem from './ResultRecordCollapseItem.vue'
import { storeToRefs } from 'pinia'
// import testsetResult from '../hook/testsetResult'
import { useTestSetStore } from '@/store/index'
import { queryResultHistoryList, queryTestsetAllInfo } from '@/api/testSetApi'
const { t } = useI18n()
const $store = useTestSetStore()
const {
  activeNames,
  testSetRow
} = storeToRefs($store)
// const { getCaseInfo, ctcExecutionList } = testsetResult()

const handleChange = (val:string[]) => {
  $store.handleChange(val)
}

// 结果记录列表
let ctcExecutionList = ref([])
// 获取结果记录列表
const queryTestsetTestcaseResultHistoryList = () => {
    let data = {
      testsetId: $store.testSetRow.testsetId,
      testcaseId: $store.testSetRow.testcaseId
    }
    queryResultHistoryList(data).then(async (res) => {
      $store.fullLoading = false
      ctcExecutionList.value = res.data.result
      // console.log(res.data.result[0].id, 'res.data.result[0].id')

      // 根据第一条结果记录获取对应的详情
      if (!res.data.result[0].id) return
      // 测试用例详情，1、包含了ctc列表（含有名称等信息）；2、包含逻辑用例信息
      $store.testcaseInfoCopy = JSON.parse(res.data.result[0].testcaseInfoCopy)
      nextTick(() => {
        // 展开面板
        activeNames.value = [res.data.result[0].id]
      })
    }).catch(() => {
      $store.fullLoading = false
    })
  }
// 获取测试集的信息，用户快速新建缺陷
const testsetInfo = ref<any>({})
const queryTestsetAllInfoRequest = async () => {
  const res = await queryTestsetAllInfo($store.testSetRow.testsetId)
  testsetInfo.value = res.data.testsetBasicInfo
}
// 在结果记录页面点击了上一页下一页
watch(() => testSetRow.value, () => {
  queryTestsetTestcaseResultHistoryList()
  queryTestsetAllInfoRequest()
})

onMounted(() => {
  queryTestsetTestcaseResultHistoryList()
  queryTestsetAllInfoRequest()
})

defineExpose({
  queryTestsetTestcaseResultHistoryList,
  queryTestsetAllInfoRequest
})

</script>

<style lang="scss" scoped>
.container{
  width: 100%;
  height: 100%;
}
.divider-title{
  color: #C0C4CC;
  font-size: 12px;
}
</style>
