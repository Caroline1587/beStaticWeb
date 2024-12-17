<template>
  <div class="result">
    <el-icon><component :is="EXECUTION_RESULT[$props.status].icon" :color="EXECUTION_RESULT[$props.status].color" /></el-icon>
    <span>{{ EXECUTION_RESULT[$props.status].name }}</span>
  </div>
</template>

<script setup lang="ts">
import { CircleCheckFilled, QuestionFilled, CircleCloseFilled, WarningFilled, RemoveFilled } from '@element-plus/icons-vue'
const { t } = useI18n()

const $props = withDefaults(defineProps<{
  status: number
}>(), {
  status: 1
})
const EXECUTION_RESULT = {
  1: {
    name: t('weiCeShi'),
    type: 'info',
    icon: QuestionFilled,
    color: '#EFEFEF'
  },
  2: {
    name: t('tongGuo'),
    type: 'success',
    icon: CircleCheckFilled,
    color: 'var(--el-color-success-light-3)'
  },
  3: {
    name: t('shiBai'),
    type: 'danger',
    icon: CircleCloseFilled,
    color: 'var(--el-color-danger)'
  },
  4: {
    name: t('yiChang'),
    type: 'warning',
    icon: WarningFilled,
    color: 'var(--el-color-warning-light-3)'
  },
  5: {
    name: t('wuPanDuan'),
    type: 'warning',
    icon: RemoveFilled,
    color: '#CCCCCC'
  }
}
</script>

<style lang="scss" scoped>
.result{
  display: flex;
  align-items: center;
  .el-icon{
    margin-right: 5px;
  }
}
</style>
