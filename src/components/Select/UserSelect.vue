<template>
  <el-select-v2
    v-model="value"
    v-bind="$attrs"
    :placeholder="t('weiXuanZe')"
    filterable
    multiple
    collapse-tags
    collapse-tags-tooltip
  >
    <template #default="{ item }">
      <el-tooltip
        effect="dark"
        :content="item?.label"
        :show-after="1000"
        placement="top"
      >
        <!-- <span class="labelContainer"> -->
          <span class="ellipsis"> {{ item?.label }}</span>
        <!-- </span> -->
      </el-tooltip>
    </template>
  </el-select-v2>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';


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

</script>

<style lang="scss" scoped>
</style>
