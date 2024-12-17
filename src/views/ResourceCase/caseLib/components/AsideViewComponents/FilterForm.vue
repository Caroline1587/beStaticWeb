<template>
  <el-form
    v-model="filterFormData"
    :inline="true"
    label-position="top"
    class="filter-form"
  >
    <el-form-item
      v-for="item in formItems"
      :key="item.id"
      :prop="item.propertyName || item.id"
      :label="item.fieldName"
    >
    <template #label>
      <span :title="item.fieldName" class="ellipsis filterFormLabel">{{ item.fieldName }}</span>
    </template>
      <!-- 输入搜索 -->
      <el-input v-if="['input', 'number','textarea','url'].indexOf(item.fieldType) !== -1" v-model="filterFormData[item.propertyName || item.id]" />
    </el-form-item>
    <!-- 两个固定的搜索：创建人和创建时间 -->
    <el-form-item
      prop="createUser"
      :label="t('chuangJianRen')"
    >
      <UserSelect v-model="filterFormData.createUser" :options="allUsers" />
    </el-form-item>
    <el-form-item
      prop="createTimeRange"
      :label="t('chuangJianShiJian')"
    >
      <DateFilter v-model:timeRange="filterFormData.createTimeRange"></DateFilter>
    </el-form-item>
  </el-form>
</template>
<script
  setup
  lang="ts"
>
  import { getUserAndGroupList } from '@/api/commonApi'
  import emitter from '@/views/common/eventBus'
  const { t } = useI18n()
  const props = defineProps<{
    filterData:any
  }>()
  const emits = defineEmits(['update:filterData'])
  const formItems = ref([
    {
      id: 1,
      propertyName: 'libraryName',
      fieldName: t('yongLiKuMingCheng'),
      fieldType: 'input',
      optionList: []
    },
    {
      id: 2,
      propertyName: 'description',
      fieldName: t('yongLiKuMiaoShu'),
      fieldType: 'input',
      optionList: []
    }
  ])
  const filterFormData = computed({
    get () {
      return props.filterData
    },
    set (val:any) {
      emits('update:filterData', val)
    }
  })
  // 通知高级筛选组件关闭加载效果
  emitter.emit('showAdvanceSearch')

  const allUsers = ref<{label:string, value:string}[]>([])
  onMounted(async () => {
    const res = await getUserAndGroupList({ funcType: '' })
    allUsers.value = res.data.uncheckUser.map((item:any) => {
      return {
        ...item,
        value: item.value.replaceAll('0&', '')
      }
    })
  })
</script>
<style
  lang="scss"
  scoped
>

</style>
