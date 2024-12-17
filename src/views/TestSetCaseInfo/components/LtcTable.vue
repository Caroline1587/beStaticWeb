<template>
  <p class="desc-title">{{ testSetRow.templateType===1 ? '文本用例' : '逻辑用例' }}</p>
  <el-table
    :data="tableData"
    :span-method="objectSpanMethod"
    style="width: 100%;"
    border
    :header-cell-style="{'background':'#F8F9FA','color':'#272B31','font-size': '14px'}"
  >
    <HiTableColumn :label="t('qianZhiTiaoJian')">
      <messageComps tag-name="p" class-name="customListLinkAndImage" :info="$store.getImgUrl(testcaseInfoCopy.preConditionDesc)"></messageComps>
      <!-- <p>{{ testcaseInfoCopy.preConditionDesc }}</p> -->
    </HiTableColumn>
    <HiTableColumn prop="name" :label="t('ceShiBuZhou')" class-name="test-condition-column">
      <template #default="scope">
        <div class="test-condition">
          <messageComps tag-name="p" class-name="customListLinkAndImage" :info="$store.getImageHtml(scope.row.testStep)"></messageComps>
        </div>
      </template>
    </HiTableColumn>
    <HiTableColumn :label="t('qiWangJieGuo')">
      <template #default="scope">
        <messageComps tag-name="p" class-name="customListLinkAndImage" :info="$store.getImageHtml(scope.row.expectResult)"></messageComps>
      </template>
    </HiTableColumn>
    <HiTableColumn prop="amount1" :label="t('fuWeiBuZhou')">
      <!-- <template #default="scope"> -->
        <messageComps tag-name="p" class-name="customListLinkAndImage" :info="$store.getImgUrl(testcaseInfoCopy.resetDesc)"></messageComps>
      <!-- </template> -->
    </HiTableColumn>
    <HiTableColumn v-if="testSetRow.templateType===1" :label="t('shiJiJieGuo')">
      <span>{{ $props.textResult.actualResult }}</span>
    </HiTableColumn>
  </el-table>
  <div class="table-desc">
    <p class="desc-title">{{ testSetRow.templateType===1 ? '文本用例备注' : '逻辑用例备注' }}</p>
    <p class="desc-details">{{ $props.note }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TableColumnCtx } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useTestSetStore } from '@/store/index'
import useRenderHtml from '@/views/common/useRenderHtml'
const { handleComps } = useRenderHtml()
const messageComps:any = handleComps()
const { t } = useI18n()
const $store = useTestSetStore()
const { testcaseInfoCopy, ltcData, testSetRow } = storeToRefs($store)

const $props = withDefaults(defineProps<{
  note?: string,
  textResult?: any
}>(), {
  note: '',
  textResult: () => {
    return {}
  }
})

// 保持顺序一致性
const tableData = computed(() => {
  let data:any[] = []
  ltcData.value.forEach(ltcItem => {
    let findLtc = testcaseInfoCopy.value?.ltcList?.find((item:any) => item.id === ltcItem.id)
    if (findLtc) data.push(findLtc)
  })
  return data
})

interface SpanMethodProps {
  row: any
  column: TableColumnCtx<any>
  rowIndex: number
  columnIndex: number
}

const objectSpanMethod = ({ row, rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0 || columnIndex === 3) {
    // 针对第一列进行合并判断
    if (rowIndex === 0 || row.column1 !== testcaseInfoCopy.value.ltcList[rowIndex - 1].column1) {
      let rowspan = 0
      for (let i = rowIndex; i < testcaseInfoCopy.value.ltcList.length; i++) {
        if (row.column1 === testcaseInfoCopy.value.ltcList[i].column1) {
          rowspan++
        } else {
          break
        }
      }
      return {
        rowspan,
        colspan: 1
      }
    } else {
      // 只需要设置合并的单元格返回{ rowspan: 0, colspan: 0 }即可
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import './style.scss';
// 测试条件
:deep(.el-table__body-wrapper .test-condition-column){
  position: relative;
  // display: flex;
  // padding: 0px;
  // &::after{
  //   position: absolute;
  //   left: 29px;
  //   top: 0;
  //   display: block;
  //   content: '';
  //   height: 100%;
  //   width: 1px;
  //   background: $--global--regular--border--color;
  // }
  &:nth-of-type(3){
    &::after{
      display: none;
    }
  }
  .test-condition{
    display: flex;
    min-height: 35px;
    img{
      width: 36px;
      height: 35px;
    }
    .test-variable{
      // border-left: 1px $--global--regular--border--color solid;
      margin-left: 15px;
      i{
        color: var(--el-color-primary);
      }
    }
  }
}
.table-desc{
  .desc-title{
    color: $--global--regular--text--color;
    font-weight: 400;
  }
  .desc-details{
    color: $--global--heavy--text--color ;
  }
}
</style>
