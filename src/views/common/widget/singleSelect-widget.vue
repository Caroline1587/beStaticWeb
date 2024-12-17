<template>
  <el-select
   v-if="props.status!=='showonly'"
    v-model="value"
    :disabled="props.status!=='editable'"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    :placeholder="props.data.promptText"
    clearable
    filterable
  >
    <template #prefix>
      <span v-if="optionColor" class="circle" :style="`background-color:${optionColor}`"></span>
    </template>
    <el-option
      v-for="item in props.data.optionList"
      :key="item.optionValue"
      :label="item.optionValue"
      :value="item.optionValue"
    >
      <span v-if="item.optionColor" class="circle" :style="`background-color:${item.optionColor}`"></span>
      <span :title="item.optionValue">{{ item.optionValue }}</span>
    </el-option>
  </el-select>
  <showTags
    v-else
    :value="value?[{label:value}]:[]"
    :option-list="props.data.optionList"
    :field-type="props.data.fieldType"
    :background-color="props.data.backgroundColor"
  ></showTags>
</template>

<script lang="ts" setup>
  import showTags from './components/showTag.vue'
  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      fieldType:string
      backgroundColor?:string
      optionList:{optionValue:string, optionColor:string}[]
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:string
  }>(), {
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value'])
  const value = computed({
    get () {
      if (props.value && allValue.value.indexOf(props.value) !== -1) {
        return props.value
      } else {
        emits('update:value', '')
        return ''
      }
    },
    set (val:string) {
      emits('update:value', val ? val : '')
    }
  })
  const optionColor = computed(() => {
    if (value.value) {
      return props.data.optionList.filter(item => item.optionValue === value.value)[0].optionColor
    } else {
      return ''
    }
  })
  const allValue = computed(() => {
    return props.data.optionList.map(item => item.optionValue)
  })
</script>

<style lang="scss" scoped>
.el-select{
  width: 100%;
  height:32px;
  :deep(.el-input__prefix-inner>:first-child){
    margin-right:0!important
  }
}
</style>
