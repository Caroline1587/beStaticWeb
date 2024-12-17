<template>
  <el-container class="common-info-layout">
    <el-container class="common-info-main-layout">
      <el-header>
        <el-icon :size="20">
          <svg-icon :icon-class="`${caseBasicInfo.createType === 2 ?'status_case_linked': 'status_case'}`"></svg-icon>
        </el-icon>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="caseBasicInfo.testcaseNumber"
          placement="top"
        >
          <span>{{ `${caseBasicInfo.testcaseNumber}` }}</span>
        </el-tooltip>
        <el-tooltip
          class="box-item"
          effect="light"
          :content="caseBasicInfo.testcaseName||t('zanWuMingCheng')"
          placement="top"
        >
          <span style="margin-left:20px">{{ `${caseBasicInfo.testcaseName||t('zanWuMingCheng')}` }}</span>
        </el-tooltip>
      </el-header>
      <el-main>
        <el-scrollbar>
          <collapse :active-names="activeNames">
            <collapseItem :title="t('yongLiXiangQing')">
              <caseDetail
                :reload="reload"
                :all-case-info="allCaseInfo"
                :ltc-info="ltcInfo"
                :ltc-data="ltcData"
                :ctc-data="ctcData"
                :role="{
                  enableDownLoadFile,
                  enableDownLoadSeqFile
                }"
              ></caseDetail>
            </collapseItem>
            <collapseItem :title="t('xiangMuYinYongQingKuang')">
              <quoteDetail :reload="reload"></quoteDetail>
            </collapseItem>
          </collapse>
        </el-scrollbar>
      </el-main>
    </el-container>
    <el-footer>
      <el-button class="grey-liner-button" @click="goBack">{{ t('fanHui') }}</el-button>
      <el-button
        v-if="routeparamsstore.pageInfo.upAndDownBtn"
        class="blue-liner-button"
        :disabled="routeparamsstore.pageInfo.currentIndex === 1"
        @click="pageUp">
        {{ t('shangYiTiao') }}
      </el-button>
      <el-button
        v-if="routeparamsstore.pageInfo.upAndDownBtn"
        class="blue-liner-button"
        :disabled="routeparamsstore.pageInfo.currentIndex === routeparamsstore.pageInfo.totalRecord"
        @click="pageDown">
        {{ t('xiaYiTiao') }}
      </el-button>
      <el-button class="blue-button" :disabled="!enableDataEdit" @click="toEditTestcase">{{ t('bianJi') }}</el-button>
    </el-footer>
    <HoverButton @float-div-click="showOperateLog">
      <template #default>
        <log ref="logRef" :disabled="!enableDataLog" :file-obj="fileObj" />
      </template>
    </HoverButton>
  </el-container>
</template>
<script
  setup
  lang="ts"
>
  import { routeParamsStore } from '@/store/index'
  // hook
  import caseInfo from './hook/caseInfo'
  import usePermission from '@/views/common/usePermission'
  import caseDetail from './components/caseDetail.vue'
  import quoteDetail from './components/quoteDetail.vue'
  import log from './components/logDetail.vue'
  const { enableDataEdit, enableDataLog, enableDownLoadFile, enableDownLoadSeqFile } = usePermission('testcase_library')
  const { t } = useI18n()
  const activeNames = [t('yongLiXiangQing'), t('xiangMuYinYongQingKuang')]
  const routeparamsstore = routeParamsStore()
  const {
    allCaseInfo,
    ltcInfo,
    ltcData,
    ctcData,
    reload,
    caseBasicInfo,
    pageUp,
    pageDown,
    toEditTestcase,
    fileObj
   } = caseInfo('testcase_library')
  // 日志详情
  const logRef = ref()
  const showLog = ref(false)
  const showOperateLog = () => {
    showLog.value = !showLog.value
    if (showLog.value) logRef.value.getLogsInfo()
  }
const goBack = () => {
  const globalpropsstore = getGlobalPropsStore()
  globalpropsstore.commonRouter({ path: '/libraryCase', type: 'replace', view: 'testCase' })
}
</script>
<style lang="scss" scoped>
@import '@/styles/caseInfo.scss';
</style>
