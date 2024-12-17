<template>
  <CustomTreeContainer
    :aside-expand="asideExpand"
    :border="border"
    :module-name="moduleName"
    :drag="drag"
    :header-height="40"
  >
    <!-- 头部搜索、图标区域 -->
    <template #header>
      <!-- 搜索输入框 -->
      <CustomTreeSearch
        v-show="asideExpand"
        v-model="filterKey"
        :title="t('propsmodulenameMoKuai', [props.moduleName])"
        @change="handleChange"
      />
      <!-- 按钮组 -->
      <CustomTreeButtons v-if="!searchExpand && expand" @aside-change="handleAsideChange" @tree-change="handleTreeChange" />
    </template>
    <!-- 树形结构:通过插槽的方式来展示 -->
    <template #main>
      <el-tree
        v-bind="$attrs"
        ref="treeRef"
        node-key="id"
        highlight-current
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :data="treeData"
        :props="props.props"
      >
        <template #default="{ node, data }">
          <span class="tree_node">
            <slot v-bind="{ node, data }">
            </slot>
          </span>
        </template>
      </el-tree>
    </template>
  </CustomTreeContainer>
</template>

<script setup lang="ts">
import CustomTreeSearch from './CustomTreeSearch.vue'
import CustomTreeButtons from './CustomTreeButtons.vue'
import treeHook from './hook'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
/**
   * @desc 树形结构展开/收起容器
   * @props moduleName: 模块名称 treeData: 树形结构数据 expand是否显示展开收起图标
   */

const props = withDefaults(defineProps<{
  moduleName?: string
  treeData: any[]
  expand?: boolean
  border?: boolean
  props?: any
  drag?: boolean
}>(), {
  moduleName: '',
  treeData: () => { return [] },
  expand: false,
  border: true,
  props: () => {
    return {
      children: 'childrenList',
      label: 'name',
      class: (data:any) => {
        if (data.highlight) {
          return 'is-filter'
        }
        return ''
      }
    }
  },
  drag: true
})

const { filterKey, asideExpand, handleAsideChange, treeRef, handleTreeChange, filterNode, searchExpand, handleChange } = treeHook()

defineExpose({ treeRef })

</script>

<style lang="scss" scoped>

.tree_node{
  display: flex;
  align-items: center;
  width:100%;
  overflow: hidden;
  justify-content: space-between;
  height: 100%;
  position: relative;
  font-size: 14px;
}
</style>
