<template>
  <p v-if="ctcResultList.length>0" class="desc-title">{{ t('juTiYongLi') }}</p>
  <CustomTable
    v-if="allCaseInfo.templateType !== 1 && ctcResultList.length>0"
    :table-data="ctcResultList"
    :show-pagination="true"
    :page-info="pageInfo"
    :table-props="tableProps"
    :border="false"
    :custom-col-expand="testSetRow.testsetCategory === 2 ?true:false"
    column-type="noselection"
    row-class-name="custom-table-row"
    cell-class-name="custom-table-cell"
    class="test-set-custom-table"
    @change-sort-rules="changeSortRules"
    @change-page-info="changePageInfo($event, getRecordInfo)"
  >
  <template #ctcNum="{ data:{data} }">
    <span>{{ getCtcList(data.ctcId) }}</span>
  </template>
  <template #expand="{ data:{data} }">
    <div class="set-table">
      <ctc-test-set-table :table-data="data.stepResultList ? data.stepResultList : []" />
    </div>
  </template>
    <template #executionResult="{ data:{data} }">
      <result :status="data.executionResult" />
    </template>
  </CustomTable>
  <!-- 逻辑信息 -->
  <ctc-desc-table v-if="allCaseInfo.templateType === 1 && testSetRow?.templateType!==1" :edit-flag="true" />
  <!-- 底部相关附件 -->
  <div class="table-desc">
    <p class="desc-title">{{ t('xiangGuanFuJian') }}</p>
    <p class="desc-file">
      <span
        v-for="item in fileList"
        :key="item.id"
        class="file-item"
        @click="download(item.id)"
      >
        <el-icon><Document /></el-icon>
        <el-button type="primary" link :disabled="!enableTestsetDownloadRecordAttchment">{{ item.fileName }}</el-button>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import CtcTestSetTable from './CtcTestSetTable.vue'
import CtcDescTable from './DrawerAddResult/CtcDescTable.vue'
import Result from './Result.vue'
import { Document } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useTestSetStore, globalPropsStore } from '@/store/index'
import { getFileList } from '@/api/fileApi'
import { queryTestsetTestcaseResultInfo } from '@/api/testSetApi'
import { UploadFileResponse } from '@/utils/types/testSetType'
import pageHook from '@/hooks/pageAndTableHook'
import usePermission from '@/views/common/usePermission'
const { t } = useI18n()

// 分页相关变量/方法
let { pageInfo, changePageInfo, orderBy, getSortRules } = pageHook()

const $store = useTestSetStore()
const globalPropsstore = globalPropsStore()
const {
  testcaseInfoCopy,
  testSetRow,
  activeNames,
  allCaseInfo,
  ltcData
} = storeToRefs($store)
const { enableTestsetDownloadRecordAttchment } = usePermission('testset_project')

const $props = withDefaults(defineProps<{
  recordId:string
}>(), {
  recordId: ''
})

const emits = defineEmits(['changeTextResult'])

// 表格表头列表
let tableProps = ref([
  {
    label: t('juTiYongLiBianHao'),
    prop: 'ctcNum',
    type: 'custom',
    sortable: 'custom'
  },
  {
    label: t('juTiYongLiMiaoShu'),
    prop: 'ctcDesc'
  },
  {
    label: t('jieGuo'),
    prop: 'executionResult',
    type: 'custom',
    sortable: 'custom'
  },
  {
    label: t('beiZhu'),
    prop: 'note'
  }
])
const changeSortRules = (prop: string, order: string) => {
  getSortRules(prop, order)
  getRecordInfo()
}
// 获取列表数据
let ctcResultList = ref([])
orderBy.value = 'ctc_order asc'
const getRecordInfo = () => {
  let data = {
    pageNo: pageInfo.value.pageNo,
    pageSize: pageInfo.value.pageSize,
    orderBy: orderBy.value,
    params: {
      recordId: $props.recordId,
      testcaseId: $store.testSetRow.testcaseId
    }
  }
  return queryTestsetTestcaseResultInfo(data).then(res => {
    if (res.data?.textResult) {
      // $store.textResult = res.data?.textResult
      emits('changeTextResult', res.data?.textResult)
      ctcResultList.value = []
      return
    }
    // $store.textResult = []
    emits('changeTextResult', {})
    ctcResultList.value = res.data.ctcResultList
    ? res.data.ctcResultList.map((item:any) => {
      // 保持顺序一致性
      let data:any[] = []
      ltcData.value.forEach(ltcItem => {
        let findLtc = item.stepResultList?.find((item:any) => item.stepId === ltcItem.id)
        if (findLtc) data.push(findLtc)
      })
      return {
        ...item,
        stepResultList: data
      }
    })
    : []
    console.log(ctcResultList.value, 'ctcResultList.valuectcResultList.value')
    pageInfo.value.totalRecord = res.data.pageInfo?.totalRecord ? res.data.pageInfo?.totalRecord : 0
  }).catch()
}

const getCtcList = (id:string) => {
  let ctcRow = testcaseInfoCopy.value.ctcList.find((item:any) => item.id === id)
  // console.log(ctcRow, 'ctcRow')
  return ctcRow?.ctcNum ? ctcRow.ctcNum : ''
}

// 根据fileId和类别获取文件
let fileList = ref<UploadFileResponse[]>([])
const getFileListByFileRequest = () => {
  let data = {
    fileId: $props.recordId,
    fileCategory: 'testset_result_file'
  }
  return getFileList(data).then(res => {
    fileList.value = res.data.fileList.map((item:UploadFileResponse) => {
      return {
        ...item,
        name: item.fileName
      }
    })
    // console.log(fileList.value)
  }).catch()
}

// 下载文件
const download = (fileId:string) => {
  if (!enableTestsetDownloadRecordAttchment.value) return
  globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
  globalPropsstore.fileStore.commonFileDownLoad({ id: fileId })
}

watch(() => activeNames.value, () => {
  let findClickResultItem = activeNames.value.find((item:string) => item === $props.recordId)
  if (!findClickResultItem) return
  getRecordInfo()
  getFileListByFileRequest()
}, { immediate: true })

</script>

<style lang="scss" scoped>
@import './style.scss';
.table-desc{
  display: flex;
  .desc-title{
    color: $--global--heavy--text--color ;
    font-weight: bold;
  }
  .desc-file{
    flex: 1;
    display: flex;
    .file-item{
      display: flex;
      align-items: center;
      height: 100%;
      margin-right: 5px;
      .el-icon{
        margin-right: 5px;
      }
    }
  }
}
.set-table{
  padding: 0 20px;
  box-sizing: border-box;
}
// 表格卡片样式
.test-set-custom-table{
  // padding: 0px 5px;
  box-sizing: border-box;
  border-left: 1px solid var(--el-collapse-border-color);
  border-right: 1px solid var(--el-collapse-border-color);
  :deep(.el-table__body-wrapper){
    background: #F8F9FA;
    table{
      // 以下两行为表格tr增加边距
      // border-collapse: separate;
      // border-spacing: 0px 6px;
      .custom-table-row{
        // box-shadow: var(--el-box-shadow);
        &:hover{
          .custom-table-cell{
            background: none;
          }
        }
        .custom-table-cell{
          // border: none;
          padding: 0px;
          height: 40px;
          margin-bottom: 4px;
          &:nth-of-type(1){
            border-radius: 10px 0px 0px 10px;
          }
          &:last-child{
            border-radius: 0px 10px 10px 0px;
          }
        }
      }
    }
  }
}
</style>
