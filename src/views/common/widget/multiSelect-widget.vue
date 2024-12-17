<template>
  <el-select
    v-if="props.status!=='showonly'"
    v-model="value"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    :disabled="props.status!=='editable'"
    clearable
    multiple
    collapse-tags
    collapse-tags-tooltip
    :placeholder="props.data.promptText"
  >
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
    :value="value.map(item=>{return {label:item}})"
    :option-list="props.data.optionList"
    :is-multi="true"
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
      return props.value ? props.value.split(',') : []
    },
    set (val:string[]) {
      emits('update:value', val.join(','))
    }
  })
</script>

<style lang="scss" scoped>
.el-select{
  width: 100%;
}
</style>
