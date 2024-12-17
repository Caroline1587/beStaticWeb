<template>
  <el-form
    ref="advanceFormRef"
    :model="globalparamsstore.tempFilterFormData"
    :inline="true"
    label-position="top"
    class="filter-form"
  >
    <el-form-item
      prop="testcaseNumber"
      :label="t('yongLiBianHao')"
    >
      <el-input v-model="globalparamsstore.tempFilterFormData.testcaseNumber" @input="globalparamsstore.tempFilterFormData.testcaseNumber = replaceSpace(globalparamsstore.tempFilterFormData.testcaseNumber)" />
    </el-form-item>
    <el-form-item
      prop="testcaseName"
      :label="t('yongLiMingCheng')"
    >
      <el-input v-model="globalparamsstore.tempFilterFormData.testcaseName" @input="globalparamsstore.tempFilterFormData.testcaseName = replaceSpace(globalparamsstore.tempFilterFormData.testcaseName)" />
    </el-form-item>
    <el-form-item
      prop="createUser"
      :label="t('chuangJianRen')"
    >
      <UserSelect v-model="globalparamsstore.tempFilterFormData.createUser" :options="allUser" />
    </el-form-item>
    <el-form-item
      prop="priority"
      :label="t('youXianJi')"
      class="formitem"
    >
      <!-- <PrioritySelect v-model="globalparamsstore.tempFilterFormData.priority" multiple /> -->
      <!-- <el-select
        v-model="globalparamsstore.tempFilterFormData.priority"
        :placeholder="t('weiXuanZe')"
        multiple
        collapse-tags
        collapse-tags-tooltip
      >
        <el-option label="高" :value="3" />
        <el-option label="中" :value="2" />
        <el-option label="低" :value="1" />
      </el-select> -->
    </el-form-item>
    <el-form-item
      prop="testType"
      :label="t('ceShiLeiXing')"
      class="formitem"
    >
      <el-select
        v-model="globalparamsstore.tempFilterFormData.testType"
        :placeholder="t('weiXuanZe')"
        multiple
        collapse-tags
        collapse-tags-tooltip
      >
        <el-option :label="t('ziDongCeShi')" :value="1" />
        <el-option :label="t('shouDongCeShi')" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item
      prop="templateType"
      :label="t('yongLiMoBan')"
      class="formitem"
    >
      <el-select
        v-model="globalparamsstore.tempFilterFormData.templateType"
        :placeholder="t('weiXuanZe')"
        multiple
        collapse-tags
        collapse-tags-tooltip
      >
      <el-option :label="t('ceShiWenBen')" :value="1" />
        <el-option :label="t('ceShiXuLie')" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item
      prop="createTimeRange"
      :label="t('chuangJianShiJian')"
    >
      <DateFilter v-model:timeRange="globalparamsstore.tempFilterFormData.createTimeRange"></DateFilter>
    </el-form-item>
    <el-form-item
      prop="tags"
      :label="t('biaoQian')"
    >
      <TagsSelect
        v-model:value="globalparamsstore.tempFilterFormData.tags"
        separation=","
      />
    </el-form-item>
  </el-form>
</template>
<script
  setup
  lang="ts"
>
  import { FormInstance } from 'element-plus'
  import { replaceSpace } from '@/utils/public'
  import { globalParamsStore } from '@/store/index'
  import getAllUserDataHook from '@/views/common/getAllUserDataHook'
  // import PrioritySelect from './PrioritySelect.vue'
  import { useI18n } from 'vue-i18n'
  import {ref} from "vue"
  // import UserSelect from "@/components/Select/UserSelect.vue"
  // import DateFilter from "@/components/DateFilter/index.vue"
  // import TagsSelect from "@/components/TagsInput/TagsSelect.vue"


  const { allUser } = getAllUserDataHook()
  const { t } = useI18n()
  const globalparamsstore = globalParamsStore()
  const advanceFormRef = ref <FormInstance>()

</script>
<style
  lang="scss"
  scoped
>
.el-select-v2{
  width: 100%;
}
</style>
