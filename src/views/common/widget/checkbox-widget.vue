<template>
  <el-checkbox-group
    v-if="props.status!=='showonly'"
    v-model="value"
    :class="`${props.status==='editable' ? '':`is-${props.status}`}`"
    :disabled="props.status!=='editable'"
  >
    <el-checkbox
      v-for="item in props.data.optionList"
      :key="item.id"
      :label="item.optionValue"
      :value="item.optionValue"
      :title="item.optionValue"
      border
    >
      <span v-if="item.optionColor" class="circle" :style="`background-color:${item.optionColor}`"></span>
      <span :title="item.optionValue">{{ item.optionValue }}</span>
    </el-checkbox>
  </el-checkbox-group>
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
  const props = defineProps<{
    data: {
      fieldType:string
      backgroundColor?:string
      optionList:{optionValue:string, optionColor:string, id:string}[]
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:string
  }>()
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
.el-checkbox-group{
  width: 100%;
}
.el-checkbox{
  display: inline-flex!important;
  margin-right: 8px!important;
  margin-bottom: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  :deep(.el-checkbox__label){
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
