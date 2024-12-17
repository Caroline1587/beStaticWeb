<template>
  <el-button :disabled="props.data.executionResult!==3&&props.data.executionResult!==4" class="blue-button" @click.stop="toAddDefect">
    {{ t('tiQueXian') }}
  </el-button>
</template>

<script setup lang="ts">
import { useTestSetStore } from '@/store/index'
import Storage from '@/utils/storage'
const $store = useTestSetStore()
const { t } = useI18n()
const router = useRouter()
const {
  allCaseInfo
} = storeToRefs($store)
const props = withDefaults(defineProps<{
  data: any,
  testsetInfo:any
}>(), {})
const toAddDefect = () => {
  const bugInfo = {
    testedSample: props.testsetInfo.testedSampleIds.split(',')[0],
    assignedTo: props.testsetInfo.director,
    bugName: allCaseInfo.value.testcaseName,
    description: allCaseInfo.value.description
  }
  const testsetList = [{
    head: props.testsetInfo.directorName,
    testsetName: props.testsetInfo.testsetName,
    executionResult: props.data.executionResult,
    testcaseId: props.data.testcaseId,
    testsetId: props.data.testsetId,
    testcaseName: allCaseInfo.value.testcaseName,
    testcaseNumber: allCaseInfo.value.testcaseNumber
  }]
  let info = Storage.sessionGet('TPA_PROJECT_ROUTEPARAMS') || {}
  let defaultInfo = info.defaultInfo || {}
  defaultInfo = { bugInfo, testsetList }
  Storage.sessionSet('TPA_PROJECT_ROUTEPARAMS', { ...info, defaultInfo })
  const globalpropsstore = getGlobalPropsStore()
  const url = globalpropsstore.commonRouter({ path: '/defect/fullAdd', view: 'project', getPath: true }) as string
  const newUrl = router.resolve({ path: url })
  window.open(`${newUrl.href}?from=testset`)
}
</script>

<style lang="scss" scoped>
.blue-button{
  margin-left: 12px;
  height:28px!important;
}
</style>
