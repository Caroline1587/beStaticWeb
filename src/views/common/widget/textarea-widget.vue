<template>
  <el-input
    v-if="props.status!=='showonly'"
    v-model="value"
    :rows="2"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    :readonly="props.status!=='editable'"
    :disabled="props.status==='disabled'"
    type="textarea"
    :maxlength="props.maxlength"
    :show-word-limit="props.maxlength!==524288"
    :placeholder="props.data.promptText"
  />
  <div v-else class="is-showonly textaraeContainer">
    <EmptyTag v-if="!value"></EmptyTag>
    <div v-else class="textarae" :style="`max-height:${(props.isPreview || expandFlag) ? 'none': '300px'}; background-color:${props.data.backgroundColor||FIELD_BACKGROUNDCOLOR}`">
      <span ref="textInfo">{{ value }}</span>
      <div v-if="!props.isPreview &&!expandFlag&&height > 300" class="mask"></div>
    </div>
    <div v-if="!props.isPreview &&height > 300" class="expand" @click="toExpand">
      {{ expandFlag ? t('shouQiGengDuo'):t('zhanKaiGengDuo') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { FIELD_BACKGROUNDCOLOR } from '@/utils/constant'
  import EmptyTag from '@/views/common/widget/components/EmptyTag.vue'
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      backgroundColor?:string
    }
    maxlength:number
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:string
    isPreview?:boolean
  }>(), {
    status () {
      return 'editable'
    },
    isPreview () {
      return false
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
  const textInfo = ref()
  const height = ref(0)
  watch(() => props.value, () => {
    if (props.status === 'showonly' && value.value) {
      nextTick(() => {
        height.value = textInfo.value.offsetHeight
      })
    }
  }, { immediate: true })
  const expandFlag = ref(false)
  const toExpand = () => {
    expandFlag.value = !expandFlag.value
  }
</script>

<style lang="scss" scoped>
</style>
