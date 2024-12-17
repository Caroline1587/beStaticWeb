<template>
  <el-collapse-item
v-for="(item) in $props.data"
:key="item.id"
:name="item.id"
:class="resultClassArr[item.executionResult-2]">
    <!-- 头部状态 -->
    <template #title>
      <div class="title-container">
        <div class="title-left">
          <result :status="item.executionResult" />
        </div>
        <div class="title-right">
          <img
            width=""
            height=""
            src="@/assets/images/testSetCaseInfo.png"
            alt=""
          />
          <span class="name">{{ item.createUser }}</span>
          <span class="time">{{ moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
          <ResultRecordButton :data="item" :testset-info="$props.testsetInfo"></ResultRecordButton>
        </div>
      </div>
    </template>
    <!-- 表格 -->
    <ResultRecordCollapseItemTableContainer :item="item" />
  </el-collapse-item>
</template>

<script setup lang="ts">
import Result from './Result.vue'
import moment from 'moment'
// import testsetResult from '../hook/testsetResult'
import ResultRecordButton from './ResultRecordButton.vue'
import ResultRecordCollapseItemTableContainer from './ResultRecordCollapseItemTableContainer.vue'

const $props = withDefaults(defineProps<{
  data: any
  testsetInfo:any
}>(), {
  data: () => {
    return []
  }
})

// const { getCaseInfo, ctcExecutionList } = testsetResult()

const resultClassArr = ['success', 'error', 'warning', 'no']

</script>

<style lang="scss" scoped>
.el-collapse-item{
  // border-left: 1px solid var(--el-collapse-border-color);
  // border-right: 1px solid var(--el-collapse-border-color);
  margin-bottom: 10px;
  :deep(.el-collapse-item__header){
    background: #F6FFF2;
    padding-left: 10px!important;
    box-sizing: border-box;
    border-top: none!important;
    border-bottom: 1px solid var(--el-collapse-border-color);
  }
}
.success{
  :deep(.el-collapse-item__header){
    background: #F6FFF2!important;
  }
}
.error{
  :deep(.el-collapse-item__header){
    background: #FFF5F5!important;
  }
}
.warning{
  :deep(.el-collapse-item__header){
    background: #FFF7EC!important;
  }
}
.no{
  :deep(.el-collapse-item__header){
    background: #F2F2F2!important;
  }
}
.title-container{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  box-sizing: border-box;
  .title-left{
    display: flex;
    align-items: center;
    .el-icon{
      margin-right: 5px;
    }
  }
  .title-right{
    display: flex;
    align-items: center;
    .name{
      color: $--global--heavy--text--color ;
      margin: 0px 10px;
    }
    .time{
      color: $--global--regular--text--color;
    }
  }
}
</style>
