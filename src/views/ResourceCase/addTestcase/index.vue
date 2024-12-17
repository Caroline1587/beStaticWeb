<template>
  <div class="common-case-layout">
    <el-container style="height:100%">
      <el-container
        style="overflow:hidden"
      >
        <el-main class="mainContainer">
          <el-scrollbar>
            <el-container class="container">
              <el-header class="header">
                <div class="title" style="margin-bottom:10px">{{ t('yongLiXinXi') }}</div>
                  <basicForm
                    ref="basicFormRef"
                    :testcase-form="testcaseForm"
                    :old-name="oldName"
                    :show-requires="false"
                    case-type="testcase_library"
                  />
              </el-header>
              <el-main>
                <div class="title">{{ t('yongLiMiaoShu') }}</div>
                <div v-if="testcaseForm.templateType === 1">
                  <ltcList
                    ref="ltcRef"
                    :type="1"
                    :ltc-info="ltcInfo"
                    @handle-expect-result-value="handleExpectResultValue"
                    @custom-upload="customUpload"
                    @handle-test-step-value="handleTestStepValue"
                    @handle-reset-desc-value="handleResetDescValue"
                    @handle-pre-desc-value="handlePreDescValue"
                  />
                </div>
                <el-tabs
                  v-else
                  v-model="activeDescName"
                  @tab-click="handleClick"
                >
                  <el-tab-pane :label="t('luoJiYongLi')" name="ltc">
                    <el-scrollbar>
                      <ltcList
                        ref="ltcRef"
                        :type="2"
                        :ltc-info="ltcInfo"
                        :ltc-data="ltcData"
                        :ctc-data="ctcData"
                        @custom-upload="customUpload"
                        @handle-reset-desc-value="handleResetDescValue"
                        @handle-pre-desc-value="handlePreDescValue"
                      />
                    </el-scrollbar>
                  </el-tab-pane>
                  <el-tab-pane :label="t('juTiYongLi')" name="ctc">
                    <ctcList
                      ref="CtcRef"
                      :table-data-rules="tableDataRules"
                      :table-data-custom-rules="tableDataCustomRules"
                      :table-column="tableColumn"
                      :table-data="ctcData"
                      @get-current-ctc-data="getCurrentTableRow"
                      @change-table-data="changeTableData"
                      @handle-import-excel-success="handleImportExcelSuccess"
                    />
                  </el-tab-pane>
                </el-tabs>
              </el-main>
            </el-container>
          </el-scrollbar>
        </el-main>
        <el-aside width="300px">
          <div>
            <ltcAside
              v-show="activeDescName==='ltc' || testcaseForm.templateType === 1"
              ref="ltcAsideRef"
              :type="operateStatus"
              @get-seqfile-info="getSeqfileInfo"
              @get-file-info="getFileInfo" />
            <ctcAside
              v-show="activeDescName==='ctc' && testcaseForm.templateType !== 1"
              :editable="true"
              :ltc-info="ltcInfo"
              :ltc-data="ltcData"
              :current-ctc-row="currentRowData"
            />
          </div>
        </el-aside>
      </el-container>
      <el-footer>
        <el-button class="grey-liner-button" @click="globalpropsstore.beforeBack">{{ t('quXiao') }}</el-button>
        <el-button
          class="blue-button"
          @click="saveResorceCase"
        >
          {{ t('baoCun') }}
        </el-button>
        <el-button
          v-if="operateStatus==='add'"
          class="blue-liner-button"
          @click="continueAdd">
          {{ t('tianJiaBingChuangJianXiaYiTiao') }}
        </el-button>
      </el-footer>
    </el-container>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import basicForm from './components/basicForm.vue'
  import ctcList from '@/views/ResourceCase/addTestcase/components/ctcList.vue'
  import ltcList from './components/ltcList.vue'
  import ltcAside from './components/ltcAside.vue'
  import ctcAside from './components/ctcAside.vue'
  import { globalPropsStore } from '@/store/index'
  import { useRouter } from 'vue-router'
  import addCase from './hook/addCase'
  const { t } = useI18n()
  const globalpropsstore = globalPropsStore()
  const router = useRouter()
  const operateStatus = ref<string>(router.currentRoute.value.meta.status as string)
  const {
    activeDescName,
    // 基础信息表单
    oldName,
    basicFormRef,
    testcaseForm,
    // ltc信息
    ltcInfo,
    handlePreDescValue,
    handleResetDescValue,
    handleTestStepValue,
    handleExpectResultValue,
    // 文件信息
    getFileInfo,
    getSeqfileInfo,
    // 保存操作
    continueAdd,
    saveResorceCase,
    // LTC，CTC组件处理
    ltcRef,
    ltcAsideRef,
    CtcRef,
    ctcData,
    ltcData,
    // ctc校验和渲染
    tableDataRules,
    tableDataCustomRules,
    tableColumn,
    handleClick,
    handleImportExcelSuccess,
    currentRowData,
    getCurrentTableRow,
    changeTableData,
    customUpload
    // cancelToLast
  } = addCase('testcase_library')
</script>
