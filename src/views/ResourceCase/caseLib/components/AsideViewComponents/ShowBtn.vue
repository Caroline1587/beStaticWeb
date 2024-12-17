<template>
  <el-radio-group v-model="listType" @change="changeCardorTable">
    <el-radio
      v-for="item in option"
      :key="item.value"
      :value="item.value"
      style="margin-right:10px"
      border
    >
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>
<script
  setup
  lang="ts"
>
  const props = defineProps<{
    display: 'select'|'dropMenu'
    showScope: 'all'|'root'
  }>()
  const { t } = useI18n()
  const emits = defineEmits(['update:showScope', 'changeType', 'beforeChangeFilter'])
  const listType = computed({
    get () {
      return props.showScope || 'all'
    },
    set (val:'all'|'root') {
      emits('update:showScope', val)
    }
  })
  const changeCardorTable = (val:'all'|'root') => {
    listType.value = val
    emits('changeType')
  }
  const option = [
    {
      label: t('suoYouYongLiKu'),
      value: 'all'
    },
    {
      label: t('shouCangYongLiKu'),
      value: 'watch'
    }
  ]
</script>
<style
  lang="scss"
  scoped
>
</style>
