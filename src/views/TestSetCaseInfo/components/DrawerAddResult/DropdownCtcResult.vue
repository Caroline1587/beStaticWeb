<template>
  <el-dropdown ref="dropdownRef" trigger="contextmenu" @command="handleCommand">
    <el-button class="icon-text-button" :disabled="testSetRow?.testsetStatus===1 || (testSetRow?.testsetStatus===2 && testSetRow?.testsetCategory===1) || testSetRow?.testsetStatus===6" @click="showClick">
      <el-icon>
        <component :is="selectCommand.iconComponent" :color="selectCommand.color" />
      </el-icon>
      <span>{{ selectCommand.name }}</span>
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- 下拉不展示未测试 -->
        <el-dropdown-item v-for="item in statusOptions.slice(1)" :key="item.value" :command="item.value">
          <el-icon><component :is="item.iconComponent" :color="item.color" /></el-icon>
          <span>{{ item.name }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { SuccessFilled, CircleCloseFilled, WarningFilled, RemoveFilled, QuestionFilled, ArrowDown } from '@element-plus/icons-vue'
import { useTestSetStore } from '@/store/index'
import { storeToRefs } from 'pinia'
const { t } = useI18n()
/**
@desc 执行结果下拉框组件
@prop { status } 1: 未测试 2: 通过 3: 失败 4: 异常 5: 无判断
@handleCommand 选中下拉框选中会触发handleCommand回调，此回调会触发emit事件并将当前的command值返回
*/

const $props = withDefaults(defineProps<{
  status: number
}>(), {
  status: 1
})

const $emits = defineEmits(['handleCommand'])

const $store = useTestSetStore()

const {
  testSetRow
} = storeToRefs($store)

// 当前选中的数据
let selectCommand = computed(() => {
  return statusOptions.value[$props.status - 1]
})

// 测试用例状态下拉框
let dropdownRef = ref()
const showClick = () => {
  // 待测试状态禁止展开
  // if ($props.status <= 1) return
  dropdownRef.value.handleOpen()
}
// 下拉状态
const statusOptions = ref([
  {
    name: t('weiCeShi'),
    iconComponent: markRaw(QuestionFilled),
    value: 1,
    color: '#EFEFEF'
  },
  {
    name: t('tongGuo'),
    iconComponent: markRaw(SuccessFilled),
    value: 2,
    color: 'var(--el-color-success-light-3)'
  },
  {
    name: t('shiBai'),
    iconComponent: markRaw(CircleCloseFilled),
    value: 3,
    color: 'var(--el-color-danger)'
  },
  {
    name: t('yiChang'),
    iconComponent: markRaw(WarningFilled),
    value: 4,
    color: 'var(--el-color-warning-light-3)'
  },
  {
    name: t('wuPanDuan'),
    iconComponent: markRaw(RemoveFilled),
    value: 5,
    color: '#CCCCCC'
  }
]
)

const handleCommand = (command: string | number | object) => {
  // console.log(command, data, 'command')
  // data.executionResult = command
  $emits('handleCommand', command)
}

</script>

<style lang="scss" scoped>

</style>
