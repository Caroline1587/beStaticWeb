<template>
  <TipDialogV5
    ref="tipDialogV5Ref"
    :title="`${status === 'add'?t('xinJianShiTu'):t('bianJiShiTu') }`"
    class="filterFormDialog"
    :width="1200"
    destroy-on-close
    align-center
    @closed="reset"
  >
   <div class="filter-form-main">
      <el-form
        ref="formRef"
        :model="formData"
        :inline="true"
        :rules="rules"
        value-position="top"
      >
        <el-form-item :value="t('shiTuMingCheng')" style="width: 100%;" prop="filterName">
          <el-input
            v-model="formData.filterName"
            :placeholder="t('qingShuRuShiTuMingCheng')"
            show-word-limit
            :maxlength="50"
          />
        </el-form-item>
        <slot name="filterViewField" :filter-form-data="filterFormData"><!-- 这里的插槽用来需要传入的特殊的筛选字段 --></slot>
      </el-form>
      <el-divider>{{ t('qingSheZhiShaiXuanTiaoJian') }}</el-divider>
      <div class="filter-form-container">
        <el-scrollbar>
          <slot name="filterForm" :filter-form-data="filterFormData"><!-- 这里的插槽用来传入高级筛选展示的表单 --></slot>
        </el-scrollbar>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-radio-group v-model="filterFormData.queryType">
          <el-radio :value="1" size="large">{{ t('manZuQuanBuTiaoJian') }}</el-radio>
          <el-radio :value="2" size="large">{{ t('manZuRenYiTiaoJian') }}</el-radio>
        </el-radio-group>
        <el-button class="grey-liner-button" @click="resetForm">{{ t('quXiao') }}</el-button>
        <el-button class="blue-button" @click="submitForm">{{ t('baoCun') }}</el-button>
      </div>
    </template>
  </TipDialogV5>
</template>
<script
  setup
  lang="ts"
>
  import useFilterForm from './useFilterForm'
  import { handleFiterViewSpecialField } from './filterViewFn'
  const props = defineProps<{
    viewType:string
  }>()
  const emits = defineEmits(['initList'])
  const { t } = useI18n()
  const {
    status,
    formData,
    rules,
    filterFormData,
    formRef,
    tipDialogV5Ref,
    reset,
    resetForm,
    submitForm,
    show
  } = useFilterForm(props.viewType, emits)
  filterFormData.value = handleFiterViewSpecialField(props.viewType)
  defineExpose({ show })
</script>
<style
  lang='scss'
  scoped
>
.el-divider{
  margin: 10px 0 20px 0;
  border-top: 1px solid $--global--regular--border--color;;
  :deep(.el-divider__text){
    color:$--global--placeholder--text--color;
  }
}
.el-form-item{
  width: 100%;
}
.el-input{
  width: 100%;
}
.dialog-footer{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.el-radio-group{
  margin-right: 32px;
}
</style>
