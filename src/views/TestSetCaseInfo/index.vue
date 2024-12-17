<template>
  <el-container class="common-info-layout">
    <el-container class="common-info-main-layout">
      <el-header>
        <el-icon :size="20">
          <svg-icon icon-class="status_case"></svg-icon>
        </el-icon>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="allCaseInfo.testcaseNumber"
          placement="top"
        >
          <span>{{ `${allCaseInfo.testcaseNumber}` }}</span>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="allCaseInfo.testcaseName||t('zanWuMingCheng')"
          placement="top"
        >
          <span>{{ `${allCaseInfo.testcaseName||t('zanWuMingCheng')}` }}</span>
        </el-tooltip>
      </el-header>
      <el-main>
        <el-scrollbar>
          <collapse :active-names="activeNames">
            <collapseItem :title="t('yongLiXiangQing')">
              <CaseDetail :reload="reload" />
            </collapseItem>
            <collapseItem :title="t('jieGuoJiLu')">
              <ResultRecord ref="resultRecordRef" />
            </collapseItem>
          </collapse>
        </el-scrollbar>
      </el-main>
    </el-container>
    <el-footer>
      <el-button class="blue-liner-button" @click="$store.pageUp"> {{ t('shangYiTiao') }}</el-button>
      <el-button class="blue-liner-button" @click="$store.pageDown"> {{ t('xiaYiTiao') }}</el-button>
      <el-button class="blue-button" :disabled="testSetRow?.testsetStatus===1 || (testSetRow?.testsetStatus===2 && testSetRow?.testsetCategory===1) || testSetRow?.testsetStatus===6 || !enableTestsetAddResult" @click="drawerVisiable = true">{{ t('tianJiaJieGuoFuJian') }}</el-button>
      <el-button class="blue-liner-button" @click="goTestcaseInfo">{{ t('chaKanYongLi') }}</el-button>
    </el-footer>
    <drawer-add-result
      v-model:drawerVisiable="drawerVisiable"
      :ltc-execution-result="testSetRow.executionResult ? testSetRow.executionResult : 2"
      :ltc-table-row="testSetRow"
      :testset-type="testSetRow?.testsetCategory"
      :click-type="1"
      @submit="handleSubmit"
    />
  </el-container>
</template>

<script setup lang="ts">
import DrawerAddResult from './components/DrawerAddResult/DrawerAddResult.vue'
import { routeParamsStore, useTestSetStore } from '@/store/index'
import { addTestsetTestcaseResultRecord } from '@/api/testSetApi'
import { beforeFormDataAppendFile } from '@/utils/public'
import usePermission from '@/views/common/usePermission'
// import CaseDetail from '@/views/TestSetCaseInfo/components/CaseDetail.vue'
import ResultRecord from '@/views/TestSetCaseInfo/components/ResultRecord.vue'
import CaseDetail from '@/views/ProjectCase/caseManageView/components/caseDetail.vue'

const { t } = useI18n()
const $routeParamsStore = routeParamsStore()
const $store = useTestSetStore()
const { enableTestsetAddResult } = usePermission('testset_project')

const activeNames = [t('yongLiXiangQing'), t('jieGuoJiLu')]

const {
  allCaseInfo,
  pageInfo,
  reload,
  testSetRow
} = storeToRefs($store)

const resultRecordRef = ref()
let drawerVisiable = ref(false)
// 添加执行结果提交
const handleSubmit = (ruleForm:any, ctcResultList:any, fileList:any, descList:any) => {
  // console.log(ruleForm, ctcResultList)
  let testcaseId = testSetRow.value.testcaseId
  let data:{[key:string]:any} = {
    testsetId: testSetRow.value.testsetId,
    testcaseResultList: JSON.stringify([
      {
        testcaseId,
        executionResult: ruleForm.result,
        executionStatus: testSetRow.value.executionStatus || 3,
        note: ruleForm.desc,
        logPath: testSetRow.value.logPath,
        reportPath: testSetRow.value.reportPath,
        ctcResultList: ctcResultList ? ctcResultList : [],
        textResult: descList
      }
    ])
  }
  // 将数据转为 Form Data格式
  const formData = new FormData()
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      formData.append(key, data[key])
    }
  }
  fileList.forEach((item:any) => {
    if (!item.raw) return // 若不存在raw则可能是回显的数据，不需要携带
    formData.append('addAttachment', beforeFormDataAppendFile(item.raw))
  })
  // console.log(data, 'data')
  addTestsetTestcaseResultRecord(formData).then(() => {
    // console.log(res)
    drawerVisiable.value = false
    resultRecordRef.value?.queryTestsetTestcaseResultHistoryList()
    resultRecordRef.value?.queryTestsetAllInfoRequest()
  }).catch()
}

// 跳转测试用例
// 路由跳转前保存分页和筛选信息
const goTestcaseInfo = () => {
  // $routeParamsStore.caseInfo.caseId = testSetRow.value.testcaseId
  $routeParamsStore.caseInfo.caseName = testSetRow.value.testcaseNumber
  $routeParamsStore.pageInfo.currentIndex = pageInfo.value.currentIndex
  $routeParamsStore.pageInfo.totalRecord = pageInfo.value.totalRecord
  $routeParamsStore.pageInfo.params = pageInfo.value.params
  $routeParamsStore.pageInfo.orderBy = pageInfo.value.orderBy
  $routeParamsStore.pageInfo.upAndDownBtn = true
  const globalpropsstore = getGlobalPropsStore()
  globalpropsstore.commonRouter({ path: `/projectCase/projectCaseInfo/caseInfo/${testSetRow.value.testcaseId}`, view: 'project' })
}

onMounted(async () => {
  $store.testSetRowInit()
  await $store.getVariable()
  $store.getCaseInfo()
})

</script>

<style lang="scss" scoped>
@import '@/styles/caseInfo.scss';
.common-info-main-layout {
  .el-footer{
    background-color:#fff;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
    padding: 0px;
  }
  :deep(.el-tabs){
    flex: 1;
    // display: flex;
    // flex-direction: column;
    overflow: hidden;
    .el-tab-pane{
      padding-right: 50px;
      box-sizing: border-box;
    }
    .el-tabs__content{
      overflow: auto;
    }
  }
}
</style>
