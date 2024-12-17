<template>
  <el-date-picker
    v-if="props.status!=='showonly'"
    v-model="value"
    :readonly="props.status!=='editable'"
    :disabled="props.status==='disabled'"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    type="datetime"
    value-format="YYYY-MM-DD HH:mm:ss"
    :placeholder="props.data.promptText"
  />
  <showTags
    v-else
    :value="value?[{label:moment(value).format('YYYY-MM-DD HH:mm:ss')}]:[]"
    :field-type="props.data.fieldType"
    :background-color="props.data.backgroundColor"
  ></showTags>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import moment from 'moment'
  import showTags from './components/showTag.vue'

  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      fieldType:string
      backgroundColor?:string
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:any
  }>(), {
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value'])
  const value = computed({
    get () {
      return props.value ? moment(props.value).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    set (val:string) {
      emits('update:value', val)
    }
  })
</script>

<style lang="scss">
.el-date-editor.el-input{
  width: 100%!important;
}
</style>
<style lang="scss" scoped>
.is-showonly{
  line-height: 20px;
  .el-icon{
    height: 20px;
    vertical-align: top;
    color:var(--el-text-color-placeholder)
  }
}
</style>
