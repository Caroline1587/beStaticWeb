<template>
  <el-table
    :data="$props.tableData"
    :header-cell-style="{'background':'#F8F9FA','color':'#272B31','font-size': '14px','height':'30px'}"
    :row-style="{height:'48px'}"
    row-class-name="custom-table-row1"
    class="test-set-custom-table1"
    border
  >
    <HiTableColumn :label="t('ceShiBuZhou')" prop="testStep">
      <template #default="scope">
        <messageComps tag-name="p" class-name="test-condition customListLinkAndImage" :info="$store.getImageHtml(getLtcList(scope.row.stepId).testStep)"></messageComps>
      </template>
    </HiTableColumn>
    <HiTableColumn :label="t('qiWangJieGuo')" prop="expectResult">
      <template #default="scope">
        <messageComps tag-name="p" class-name="test-condition customListLinkAndImage" :info="$store.getImageHtml(getLtcList(scope.row.stepId).expectResult)"></messageComps>
      </template>
    </HiTableColumn>
    <HiTableColumn :label="t('shiJiJieGuo')" prop="actualResult">
      <template #default="scope">
        <span>{{ scope.row.actualResult }}</span>
      </template>
    </HiTableColumn>
    <HiTableColumn :label="t('zhiHangJieGuo')" prop="executionResult">
      <template #default="scope">
        <result :status="scope.row.executionResult ? scope.row.executionResult : 1" />
      </template>
    </HiTableColumn>
  </el-table>
</template>

<script setup lang="ts">
import Result from './Result.vue'
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTestSetStore } from '@/store/index'
import useRenderHtml from '@/views/common/useRenderHtml'
const { handleComps } = useRenderHtml()
const messageComps:any = handleComps()
const { t } = useI18n()
const $store = useTestSetStore()
const { testcaseInfoCopy } = storeToRefs(useTestSetStore())

const $props = withDefaults(defineProps<{
  tableData?: any,
}>(), {
  tableData: () => {
    return []
  }
})

const getLtcList = (stepId:string) => {
  let ltcRow = testcaseInfoCopy.value.ltcList.find((item:any) => {
    return item.id === stepId
  })
  return ltcRow ? ltcRow : { testStep: '', expectResult: '' }
}

</script>

<style lang="scss" scoped>
.test-set-custom-table1{
  // padding: 0 10px;
  box-sizing: border-box;
  :deep(.el-table__body-wrapper){
    background: #fff;
    table{
      // 以下两行为表格tr增加边距
      border-collapse: separate;
      border-spacing: 0px!important;
    }
    img{
      width: 36px;
      height: 35px;
    }
  }
}

</style>
