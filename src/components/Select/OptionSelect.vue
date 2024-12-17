<template>
  <el-select-v2
    v-model="value"
    v-bind="$attrs"
    :placeholder="t('weiXuanZe')"
    filterable
    multiple
    collapse-tags
    collapse-tags-tooltip
    :props="selectProps"
  >
    <template #default="{ item }">
      <el-tooltip
        effect="dark"
        :content="item?.optionValue"
        :show-after="1000"
        placement="top"
      >
        <!-- <span class="labelContainer"> -->
          <span class="ellipsis"> {{ item?.optionValue }}</span>
        <!-- </span> -->
      </el-tooltip>
    </template>
  </el-select-v2>
</template>

<script lang="ts" setup>
const { t } = useI18n()

const props = withDefaults(defineProps<{
  modelValue: string[]
}>(), {
  modelValue: () => { return [] }
})

const emits = defineEmits(['update:modelValue'])

const value = computed({
  get () {
    return props.modelValue
  },
  set (val:string[]) {
    emits('update:modelValue', val)
    return val
  }
})

const selectProps = {
  value: 'optionValue',
  label: 'optionValue'
}

</script>

<style lang="scss" scoped>
</style>
