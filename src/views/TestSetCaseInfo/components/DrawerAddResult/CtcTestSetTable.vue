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
        <messageComps tag-name="p" class-name="test-condition customListLinkAndImage" :info="$store.getImageHtml(scope.row.testStep)"></messageComps>
      </template>
    </HiTableColumn>
    <HiTableColumn :label="t('qiWangJieGuo')" prop="expectResult">
      <template #default="scope">
        <messageComps tag-name="p" class-name="test-condition customListLinkAndImage" :info="$store.getImageHtml(scope.row.expectResult)"></messageComps>
      </template>
    </HiTableColumn>
    <HiTableColumn :label="t('shiJiJieGuo')" prop="actualResult">
      <!-- 实际结果 -->
    <template #default="scope">
      <div @click="showEdit(scope)">
        <span v-if="!scope.row.show">{{ scope.row.actualResult ||t('shuRuShiJiJieGuo') }}</span>
        <el-input
          v-else
          v-model="scope.row.actualResult"
          @keyup.enter="scope.row.show = false"
          @blur="scope.row.show = false"
          @input="$emits('changeStep', $props.showReslutSelect ? scope.row.ctcId : scope.row.stepId)"
        >
        </el-input>
      </div>
    </template>
    </HiTableColumn>
    <HiTableColumn v-if="$props.showReslutSelect" :label="t('zhiHangJieGuo')" prop="executionResult">
      <template #default="scope">
        <dropdown-ctc-result :status="scope.row.executionResult ? scope.row.executionResult : 1" @handle-command="handleCommand($event, scope.row)" />
      </template>
    </HiTableColumn>
  </el-table>
</template>

<script setup lang="ts">
import DropdownCtcResult from './DropdownCtcResult.vue'
// import { ref } from 'vue'
import { useTestSetStore } from '@/store/index'
import useRenderHtml from '@/views/common/useRenderHtml'
const { handleComps } = useRenderHtml()
const messageComps:any = handleComps()
const { t } = useI18n()
/**
 * @prop { any[] } tableData 表格数据
 * @prop { boolean } showReslutSelect 是否是文本类型的
 * @prop { boolean } editFlag 是否可编辑（结果记录页面使用）
 */
const $props = withDefaults(defineProps<{
  tableData?: any,
  showReslutSelect?: boolean,
  editFlag?: boolean
}>(), {
  showReslutSelect: true,
  tableData: () => {
    return []
  }
})

const $store = useTestSetStore()

const $emits = defineEmits(['changeStep'])

// 测试用例状态下拉框
const handleCommand = (command: string | number | object, data:any) => {
  // console.log(command, data, 'command')
  data.executionResult = command
  $emits('changeStep', $props.showReslutSelect ? data.stepId : data.ctcId)
}

const showEdit = (scope:any) => {
  if ($props.editFlag) return
  scope.row.show = true
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
