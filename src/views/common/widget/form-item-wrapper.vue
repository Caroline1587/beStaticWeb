<template>
  <div
    :class="`widgetContainer ${props.data.fieldType}_style ${FIELD_TYPE_ITEM[props.data.fieldType] ? 'fullItem':'unitItem'} ${props.canDrag ? '':'is-notDraggable'} ${props.status ==='showonly' ? 'is-formItem-showonly':''}` "
    :style="`${props.data.width ? `width:${props.data.width}!important`:''}`"
    tabindex="2"
    @focusout="focusoutEvent">
    <el-form-item
      ref="formItemRef"
      :label="props.data.fieldName"
      :rules="[defaultRule, props.data.fieldType === 'richText' ? defaultRichRule : defaultRule, ...props.rules]"
      :prop="props.data.propertyName||props.data.id"
    >
      <slot :data="maxlength"></slot>
      <template #label>
        <span :title="props.data.fieldName" class="ellipsis formLabel">
          {{ props.data.fieldName }}
        </span>
      </template>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
  import { FIELD_TYPE_ITEM } from '@/utils/constant'
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    data:{
      id: string,
      fieldType: string,
      fieldName: string,
      propertyName: string,
      isShow: boolean,
      isNecessary:boolean,
      width?:string
    },
    formData?:any
    rules?:any
    canDrag:boolean
    status:any
  }>(), {
    rules () {
      return []
    },
    formData: ''
  })
  const defaultRule = {
    required: props.data.isNecessary,
    message: t('qingCheckboxDateFileMultimemberRadioSinglememberSingleselectindexofpropsdatafieldtype_1ShuRuXuanZePropsdatafieldname', [['checkbox', 'date', 'file', 'multiMember', 'radio', 'singleMember', 'singleSelect'].indexOf(props.data.fieldType) === -1 ? t('shuRu') : t('xuanZe'), props.data.fieldName])
  }
  const checkRichText = (rule:any, value:any, callback:any) => {
    if (props.status === 'editable' && props.data.isNecessary && (value === '<p><br></p>' || value === '<p></p>')) {
      callback(new Error(t('qingShuRuLabel')))
    } else {
      callback()
    }
  }
  const defaultRichRule = { validator: checkRichText, trigger: 'blur' }
  const formItemRef = ref()
  const focusoutEvent = () => {
    if (props.status === 'editable' && ['file', 'multiMember', 'tag', 'richText'].indexOf(props.data.fieldType) !== -1) {
      formItemRef.value?.validate()
    }
  }
  const maxlength = computed(() => {
    if (['input', 'textarea'].indexOf(props.data.fieldType) !== -1) {
      let info = props.rules.filter((item:any) => item.max)
      if (info.length > 0) {
        return info[0].max
      } else {
        return 524288
      }
    } else {
      return 524288
    }
  })
  watch(() => props.formData, (val, val2) => {
    if (props.status === 'editable' && ['multiMember', 'file'].indexOf(props.data.fieldType) !== -1) {
      if (props.data.fieldType === 'file' && (val.length === 0 && val2.length === 0)) {
        return
      }
      formItemRef.value?.validate()
    }
  })
</script>

<style lang="scss" scoped>
.widgetContainer{
  min-height: 30px;
  padding:0 5px;
  border:1px solid transparent;
  &:hover {
    background-color: #F2F2F2;
    border:1px dashed $--global--heavy--border--color;
  }
  :deep(.el-form-item__label){
    height: 24px;
    display: flex!important;
    justify-content: flex-start!important;
  }
  .formLabel{
    height: 20px;
    line-height: 22px;
  }
}
.selected {
  background-color: #F2F2F2;
  border:1px dashed $--global--heavy--border--color;
}
.is-notDraggable{
  background-color: transparent;
  border:1px solid transparent;
  &:hover {
    background-color: transparent;
    border:1px solid transparent;
  }
}
.fullItem{
  width: 100%;
}
.unitItem{
  width: 33.3%;
}
</style>
