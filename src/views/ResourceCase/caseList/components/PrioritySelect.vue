<template>
  <!-- <el-select-v2
    v-model="value"
    v-bind="$attrs"
    :placeholder="t('weiXuanZe')"
    :options="options"
    filterable
    collapse-tags
    collapse-tags-tooltip
  >
  </el-select-v2> -->
  <el-select
    v-model="value"
    v-bind="$attrs"
    :placeholder="t('weiXuanZe')"
    filterable
    collapse-tags
    collapse-tags-tooltip
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { queryCustomDomain } from '@/api/commonApi'

const props = withDefaults(defineProps<{
  modelValue: any
  edit?:boolean
}>(), {
  modelValue: () => { return [] }
})

const { t } = useI18n()

const emits = defineEmits(['update:modelValue'])

const value = computed({
  get () {
    console.log(props.modelValue, 'props.modelValue')

    return props.modelValue
  },
  set (val:string[]) {
    console.log(val)

    emits('update:modelValue', val)
    return val
  }
})

const options = ref<any[]>([])
const queryCustomDomainRequest = () => {
  queryCustomDomain().then(res => {
    options.value = res.data?.configpriorityList?.map((item:any) => {
      return {
        ...item,
        value: item.domainKey + '',
        label: item.domainValue
      }
    })
  }).catch()
}

watch(() => props.modelValue, () => {
  // 编辑模式时根据label值查找对应的value进行回显
  if (props.edit) {
    const findSomeItem = options.value.find(item => item.label === props.modelValue)
    if (findSomeItem) value.value = findSomeItem.value
    }
})

queryCustomDomainRequest()

</script>

<style lang="scss" scoped>
</style>
