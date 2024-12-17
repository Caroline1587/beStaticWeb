<template>
  <el-radio-group
    v-if="props.status!=='showonly'"
    v-model="value"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    :disabled="props.status!=='editable'"
    @change="changeValue"
  >
    <el-radio
      v-for="item in props.data.optionList"
      :key="item.optionValue"
      border
      :label="item.optionValue"
      :value="item.optionValue"
      :title="item.optionValue"
      @click="radioClick(item.optionValue)"
    >
      <span v-if="item.optionColor" class="circle" :style="`background-color:${item.optionColor}`"></span>
      <span :title="item.optionValue">{{ item.optionValue }}</span>
    </el-radio>
  </el-radio-group>
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
      return props.value
    },
    set (val:string) {
      emits('update:value', val)
    }
  })
  let cancleFlag = false
  const radioClick = (key:string) => {
    if (value.value === key) {
      cancleFlag = true
      value.value = ''
    }
  }
  const changeValue = () => {
    if (cancleFlag) {
      cancleFlag = false
      value.value = ''
    }
  }
</script>

<style lang="scss" scoped>
.el-radio-group{
  width: 100%;
}
.el-radio{
  margin-right: 8px!important;
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  :deep(.el-radio__label){
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
