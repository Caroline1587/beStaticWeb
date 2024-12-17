<template>
  <el-input-number
    v-if="props.status!=='showonly'"
    v-model="value"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    :readonly="props.status!=='editable'"
    :disabled="props.status==='disabled'"
    :placeholder="props.data.promptText"
    controls-position="right"
    @keydown="clearInput"
    @paste="clearInput2"
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
      promptText:string,
      fieldType:string
      backgroundColor?:string
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:number|null
  }>(), {
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value'])
  const value = computed({
    get () {
      return typeof props.value === 'number' && !isNaN(props.value) ? props.value : null
    },
    set (val:any) {
      typeof val === 'number' && !isNaN(val) ? emits('update:value', val) : emits('update:value', null)
    }
  })
  const clearInput = (e:any) => {
    let key = e.key
    if (key === 'e' || key === 'E') {
      e.preventDefault()
    }
  }
  const clearInput2 = (event:any) => {
    let paste = event.clipboardData.getData('text')
    paste = paste.replace('e', '')
    value.value = Number(paste)
    event.preventDefault()
  }
</script>

<style lang="scss" scoped>
.el-input-number {
  width: 100%!important;
}
</style>
