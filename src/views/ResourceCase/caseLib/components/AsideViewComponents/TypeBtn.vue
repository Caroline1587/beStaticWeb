<template>
  <el-select
    v-model="listType"
    :class="props.display==='dropMenu'?'card-list-select__wrapper hidden-select-suffix':'hidden-select-suffix'"
    :style="`width: ${props.display==='dropMenu'?'auto':'100%'}`"
    popper-class="card-list-select"
    @change="changeCardorTable"
    @visible-change="emits('beforeChangeFilter')"
  >
    <template #prefix>
      <span class="flex-center">
        <el-icon>
          <svg-icon :icon-class="icon[listType === 'board'?2:3]"></svg-icon>
        </el-icon>
      </span>
    </template>
    <el-option
      v-for="(item,index) in option"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    >
      <span class="flex-center">
        <el-icon class="el-icon--left" color="#B3B9D2">
          <svg-icon :icon-class="listType===item.value?icon[index+2]:icon[index]"></svg-icon>
        </el-icon>
        <span>{{ item.label }}</span>
      </span>
      <el-icon class="check"><Check /></el-icon>
    </el-option>
  </el-select>
</template>
<script
  setup
  lang="ts"
>
  import { Check } from '@element-plus/icons-vue'
  const { t } = useI18n()
  const props = defineProps<{
    display:'select'|'dropMenu'
    listType:'board'|'table'
  }>()
  const emits = defineEmits(['update:listType', 'changeType', 'beforeChangeFilter'])
  const listType = computed({
    get () {
      return props.listType || 'board'
    },
    set (val:'board'|'table') {
      emits('update:listType', val)
    }
  })
  const option = [
    {
      label: t('kaPian'),
      value: 'board'
    },
    {
      label: t('biaoGe'),
      value: 'table'
    }
  ]
  const changeCardorTable = (val:'board'|'table') => {
    listType.value = val
    emits('changeType')
  }
  const icon = ['common_card', 'common_list', 'common_card_active', 'common_list_active']
</script>
<style
  lang="scss"
  scoped
>
</style>
