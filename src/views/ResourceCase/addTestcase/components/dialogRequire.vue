<template>
  <el-dialog v-model="dialogVisible" width="600" @close="handleClose">
    <template #header>
      <div class="title">{{ t('xuanZeGuanLianXuQiu') }}</div>
    </template>
    <!-- 内容 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      height="300px"
      :element-loading-text="t('shuJuJiaZaiZhong')"
    >
      <HiTableColumn width="30">
        <template #default="scope">
          <el-radio v-model="radioId" :value="scope.row.code" @change="handleChange(scope.row)"></el-radio>
        </template>
      </HiTableColumn>
      <HiTableColumn
        prop="code"
        :label="t('ucBianHao')"
        width="150"
        show-overflow-tooltip />
      <HiTableColumn prop="name" :label="t('ucMingCheng')" show-overflow-tooltip />
      <HiTableColumn
        prop="description"
        :label="t('ucMiaoShu')"
        width="260"
        show-overflow-tooltip />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="grey-liner-button" @click="handleClose">{{ t('quXiao') }}</el-button>
        <el-button class="blue-button" @click="confirm">{{ t('queDing') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// import { useRoute } from 'vue-router'
import { routeParamsStore } from '@/store/index'
import { getUcInfo } from '@/api/starChainApi'
import Storage from '@/utils/storage'
import { UcData } from '@/utils/types/starChainType'
const { t } = useI18n()
const BASEPATH = Storage.localGet('ApiUrl')
const $props = defineProps<{
  dialog:boolean,
  requireNumber: string
}>()
const $emits = defineEmits(['update:dialog', 'changeRequireNumber'])
const dialogVisible = computed({
  get () {
    return $props.dialog
  },
  set (val:boolean) {
    $emits('update:dialog', val)
    return val
  }
})

// const route = useRoute()
const routeparamsstore = routeParamsStore()

// 选择的需求id
let radioId = ref('')
let sourceUrl = ref('')
const handleChange = (row:any) => {
  radioId.value = row.code
  sourceUrl.value = row.url
}

// 弹窗关闭回调
const handleClose = () => {
  $emits('update:dialog', false)
  radioId.value = ''
}

const tableData = ref([])
let loading = ref(false)
const getUcInfoRequest = () => {
  let data = BASEPATH.VITE_BASE_API_STAR_CHAIN?.requireData
  data.params = data.params.replace('$projectId$', routeparamsstore.caseInfo.associatedProject)
  loading.value = true
  getUcInfo(data).then(res => {
    if (res.data) {
      tableData.value = res.data.map((item:UcData) => {
        return {
          ...item,
          code: item.code + '_' + item.version
        }
      })
    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

// 确定
const confirm = () => {
  // console.log(radioId.value)
  $emits('changeRequireNumber', radioId.value, sourceUrl.value)
  handleClose()
}

watch(() => dialogVisible.value, () => {
  if (dialogVisible.value) {
    if (tableData.value.length === 0) getUcInfoRequest()
    radioId.value = $props.requireNumber
  }
})

</script>
<style lang="scss" scoped>
</style>
