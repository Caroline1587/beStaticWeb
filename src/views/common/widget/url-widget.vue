<template>
  <div v-if="props.status!=='showonly'" class="urlContainer">
    <div
      v-if="linkState"
      :class="`el-input ${props.status==='editable' ? '':`is-${props.status}`}`"
    >
      <div class="el-input__wrapper linkTextContainer" @click="inputFocus">
        <a class="linkText" href="javascript:void(0)" @click="toNewPage(value)">{{ value }}</a>
      </div>
    </div>
    <el-input
      v-else
      ref="inputRef"
      v-model="value"
      :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
      :readonly="props.status!=='editable'"
      :disabled="props.status==='disabled'"
      :placeholder="props.data.promptText"
      @blur="inputBlur"
    />
  </div>
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
    value:string
  }>(), {
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value'])
  const linkState = ref(true)
  const inputRef = ref()
  const value = computed({
    get () {
      return props.value
    },
    set (val:string) {
      emits('update:value', val)
    }
  })
  const inputBlur = () => {
    linkState.value = true
  }
  const inputFocus = () => {
    if (props.status === 'editable') {
      linkState.value = false
      nextTick(() => {
        inputRef.value.focus()
      })
    }
  }
  const toNewPage = (value:string) => {
    window.open(value, '_blank')
  }
</script>

<style lang="scss" scoped>
.urlContainer{
  width: 100%;
}
.el-input__wrapper{
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start!important;
  .el-link{
    &:hover{
      cursor: text;
    }
  }
  padding: 4px 11px;
}
.linkTextContainer{
  display: block;
  line-height: 24px;
}
.linkText{
  color: var(--el-color-primary);
  line-height: 1.5;
  word-break: break-all;
  text-decoration: underline;
  display: inline;
}
</style>
