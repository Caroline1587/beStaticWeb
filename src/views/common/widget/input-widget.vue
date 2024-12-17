<template>
  <el-input
    v-if="props.status!=='showonly'"
    v-model="value"
    placement="bottom"
    autocomplete="on"
    :name="`input-${props.data.id}`"
    :readonly="props.status!=='editable'"
    :disabled="props.status==='disabled'"
    :placeholder="props.data.promptText"
    :maxlength="props.maxlength"
    :show-word-limit="props.maxlength!==524288"
   />
  <showTags
    v-else
    :value="value?[{label:value}]:[]"
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
      id:string
    }
    maxlength:number
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
      return props.value
    },
    set (val:string) {
      emits('update:value', val)
    }
  })
</script>

<style lang="scss" scoped>
</style>
