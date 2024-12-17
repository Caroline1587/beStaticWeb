<template>
  <el-input
    v-model="filterKey"
    v-bind="$attrs"
    @input="handleInput"
  >
    <template #prefix>
      <slot name="prefix">
        <el-icon><Search /></el-icon>
      </slot>
    </template>
    <template #suffix>
      <slot name="suffix">
        <el-icon class="circle-close" @click="closeFilter"><CircleClose /></el-icon>
      </slot>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { Search, CircleClose } from '@element-plus/icons-vue'

/**
 * @desc 灰色搜索输入框组件
 * @attrs 此组件不接受任何prop，通过attrs来默认继承父组件所传递的所有prop参数和部分emit事件,方便写el-input的各种属性和事件
 * @emit update:modelValue:搜索框输入的值（父组件通过v-modle绑定） close: 关闭回调
 */

const $emits = defineEmits(['update:modelValue', 'close', 'input'])

// 搜索变量
let filterKey = ref('')
// 清除数据并通知父组件触发搜索回调
const closeFilter = () => {
  filterKey.value = ''
  $emits('update:modelValue', '')
  $emits('close')
}
// 输入框输入回调
const handleInput = (val:string) => {
  $emits('input', val)
  $emits('update:modelValue', val)
}

</script>

<style lang="scss" scoped>
.el-input {
  border-radius: 9px;
  --el-input-border-color:#F0F0F0;
  --el-input-hover-border-color:#F0F0F0;
  --el-input-bg-color:#F0F0F0;
  --el-input-focus-border-color:#F0F0F0;
  .circle-close{
    cursor: pointer;
  }
}
</style>
