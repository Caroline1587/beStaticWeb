<!--
 * @Author: bo.yang2
 * @Date: 2024-08-16 17:44:04
 * @LastEditors: bo.yang2
 * @LastEditTime: 2024-10-17 13:52:59
 * @FilePath: \tpa_web_maind:\work\TPA5.0-branch-build\dev\tpa_web_case\src\components\CustomTree\CustomTreeSearch.vue
 * @Description:
 *
-->
<template>
  <div class="tree-search">
    <GreyInput
      v-if="treeSearchExpand"
      v-model="filterKey"
      :placeholder="t('souSuoWenJianJia')"
      @input="handleInput"
      @down-enter="$emits('downEnter', filterKey)"
      @close="closeFilter"
    />
    <span v-else class="search-text">
      <el-icon @click="treeSearchExpand=!treeSearchExpand, $emits('change',treeSearchExpand)"><Search /></el-icon>
      <i class="ellipsis" :title="$props.title||t('xuanZeMoKuai')">{{ $props.title||t('xuanZeMoKuai') }}</i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n';
import GreyInput from "@/components/GreyInput/index.vue"

const { t } = useI18n()

/**
 * @desc树形结构头部搜索组件
 * @props title:搜索框未展开时的文案
 * @emit update:modelValue:搜索框输入的值（父组件通过v-modle绑定） handleChange：输入框展开关闭回调 downEnter:按下回车通知父组件进行搜索
 */

const $props = withDefaults(defineProps<{
  title?: string
}>(), {
  title: ''
})

const $emits = defineEmits(['update:modelValue', 'change', 'downEnter', 'close'])

// 显示开关
let treeSearchExpand = ref(false)
// 搜索变量
let filterKey = ref('')

const handleInput = (val:string) => {
  $emits('update:modelValue', val)
}

const closeFilter = () => {
  filterKey.value = ''
  treeSearchExpand.value = false
  $emits('change', treeSearchExpand.value)
  $emits('update:modelValue', '')
  $emits('close')
}

defineExpose({
  filterKey
})

</script>

<style lang="scss" scoped>
.tree-search{
  display: flex;
  align-items: center;
  height: 40px;
  // padding: 0px 4px;
  width: 100%;
  box-sizing: border-box;
  // border-bottom: 1px solid $--global--regular--border--color;
  white-space: nowrap;
  overflow: hidden;
  .search-text{
    display: flex;
    align-items: center;
    overflow: hidden;
    .el-icon{
      margin-right: 5px;
    }
  }
  .el-icon{
    cursor: pointer;
  }
}
</style>
