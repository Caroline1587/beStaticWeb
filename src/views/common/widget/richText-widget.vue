<template>
  <div :class="`textContainer is-richText-${props.status}`">
    <div
      class="textarae"
      :style="{
        maxHeight:`${(props.status==='showonly' && !expandFlag) ? '300px': 'none'}`,
        minHeight:`${props.status!=='showonly' ? '140px': '32px'}`,
        resize:`${props.status==='editable' ? 'vertical': 'none'}`
      }"
    >
      <div ref="textInfo" style="flex-direction:column;height:100%;overflow:hidden">
        <EmptyTag v-show="props.status ==='showonly'&&isEmptyValue"></EmptyTag>
        <QuillEditor
          v-show="props.status !=='showonly'||!isEmptyValue"
          ref="editorRef"
          v-model:value="textValue"
          :read-only="props.status!=='editable'"
          :toolbar="props.status!=='showonly'"
          :placeholder="props.data.promptText"
          :style="{
            backgroundColor:props.status ==='showonly'?props.data.backgroundColor||FIELD_BACKGROUNDCOLOR:'',
            minHeight:`${props.status!=='showonly' ? '': '32px'}`,
          }"
          @full-screen-event="toFullScreen"
          @get-files="getFiles"
        >
        </QuillEditor>
      </div>
      <div v-if="!props.isPreview && !expandFlag && height > 300" class="mask"></div>
    </div>
    <div v-if="!props.isPreview && height > 300" class="expand" @click="toExpand">
      {{ expandFlag ? t('shouQiGengDuo'):t('zhanKaiGengDuo') }}
    </div>
    <FullScreenRich ref="fullScreenRichRef" :data="props.data" :flag="props.flag"> </FullScreenRich>
  </div>
</template>

<script lang="ts" setup>
  import { FIELD_BACKGROUNDCOLOR } from '@/utils/constant'
  import EmptyTag from '@/views/common/widget/components/EmptyTag.vue'
  import useRichtext from '@/views/common/widget/components/useRichtext'
  import FullScreenRich from '@/views/common/widget/components/FullScreenRich.vue'

  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      backgroundColor?:string
      id:string
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:string
    flag?:boolean
    isPreview?:boolean
  }>(), {
    status () {
      return 'editable'
    },
    flag () {
      return false
    },
    isPreview () {
      return false
    }
  })
  const emits = defineEmits(['update:value'])
  const { editorRef, textValue, getFiles } = useRichtext(props.data, props.status, props.flag)
  const fullScreenRichRef = ref()
  const toFullScreen = () => {
    fullScreenRichRef.value.show(textValue)
  }
  const textInfo = ref()
  const height = ref(0)
  watch(() => props.status, (newValue:string) => {
    if (newValue === 'editable') {
      editorRef.value.enable()
    }
  })
  const isEmptyValue = computed(() => {
    return !props.value || props.value === '<p></p>' || props.value === '<p><br></p>'
  })
  watch(() => props.value, (newValue) => {
    if (textValue.value !== newValue) textValue.value = newValue
  }, { immediate: true })

  watch(() => textValue.value, (newValue) => {
    if (props.status === 'showonly' && newValue) {
      nextTick(() => {
        // 解决图片加载速度慢导致的高度获取不准确问题
        if (newValue.indexOf('<img ') !== -1) {
          const container = editorRef.value.getEditableContainer()
          const children = container.getElementsByTagName('img')
          if (children.length > 0) {
            children[0].onload = () => { height.value = textInfo.value.offsetHeight }
            children[0].onerror = () => { height.value = textInfo.value.offsetHeight }
          } else {
            height.value = textInfo.value.offsetHeight
          }
        } else {
          height.value = textInfo.value.offsetHeight
        }
      })
    } else if (props.status === 'showonly') {
      height.value = 22
    } else {
      emits('update:value', newValue)
    }
  }, { immediate: true })
  const expandFlag = ref(false)
  const toExpand = () => {
    expandFlag.value = !expandFlag.value
  }
</script>
