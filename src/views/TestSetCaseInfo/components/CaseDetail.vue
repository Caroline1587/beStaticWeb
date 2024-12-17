<template>
  <case-detail
    :all-case-info="allCaseInfo"
    :variable-otions="variableOtions"
    :variable-unit-set="variableUnitSet"
    :ltc-info="ltcInfo"
    :ltc-data="ltcData"
    :ctc-data="ctcData"
    :file-obj="fileObj"
    :reload="reload"
  />
</template>

<script setup lang="ts">
import CaseDetail from '@/views/ResourceCase/caseInfo/components/caseDetail.vue'
import { storeToRefs } from 'pinia'
import { useTestSetStore } from '@/store/index'

const $store = useTestSetStore()
const {
  allCaseInfo,
  ltcInfo,
  ltcData,
  ctcData,
  reload,
  variableOtions,
  variableUnitSet,
  fileObj
} = storeToRefs($store)

</script>

<style lang="scss" scoped>
// :deep(.el-container){
//   height: 100%;
// }
</style>
