<template>
  <div class="tree-buttons-container" :class="{'aside-expand': !asideExpand}">
    <!-- 展开状态的图标展示 -->
    <template v-if="asideExpand">
      <!-- TODO:此处可拓展更多按钮 -->
      <slot name="btn"></slot>
      <!-- 新建按钮需通过配置开启 -->
      <el-tooltip
        v-if="$props.addIcon"
        class="box-item"
        :content="t('xinZengZiWenJianJia')"
        placement="top"
      >
        <el-button class="icon-button" @click="emits('add')">
          <el-icon><svg-icon icon-class="tree_addNode"></svg-icon></el-icon>
        </el-button>
      </el-tooltip>
      <!-- 默认存在折叠以及收起功能 -->
      <el-tooltip :content="`${treeExpand?t('quanBuZheDie'):t('quanBuZhanKai')}`" placement="top">
        <el-button class="icon-button" @click="handleTreeChange">
          <el-icon><svg-icon :icon-class="`${treeExpand ? 'tree_nodeFold' :'tree_nodeExpand'}`"></svg-icon></el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip placement="top" :content="t('shouQiPropsmodulenameMoKuai', [$props.moduleName])">
        <el-button class="icon-button" @click="handleAsideExpandChange(false)">
          <el-icon><svg-icon icon-class="tree_fold"></svg-icon></el-icon>
        </el-button>
      </el-tooltip>
    </template>
    <!-- 未展开状态的图标展示 -->
    <template v-else>
      <el-tooltip :content="t('zhanKaiPropsmodulenameMoKuai', [$props.moduleName])" placement="top">
        <el-button class="icon-button" @click="handleAsideExpandChange(true)">
          <el-icon><svg-icon icon-class="tree_expand"></svg-icon></el-icon>
        </el-button>
      </el-tooltip>
    </template>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const $props = withDefaults(defineProps<{
  moduleName?: string
  addIcon?: boolean
}>(), {
  moduleName: ''
})

const emits = defineEmits(['add', 'treeChange', 'asideChange'])

// 容器是否展开
let asideExpand = ref(true)
const handleAsideExpandChange = (val:boolean) => {
  asideExpand.value = val
  emits('asideChange', asideExpand.value)
}

// 树形结构是否（纵向）展开
let treeExpand = ref(true)
const handleTreeChange = () => {
  treeExpand.value = !treeExpand.value
  emits('treeChange', treeExpand.value)
}

</script>

<style lang="scss" scoped>
.tree-buttons-container{
  display: flex;
  align-items: center;
}
.aside-expand{
  width: 100%;
  justify-content: center;
  .el-icon{
    margin: 0px;
  }
}
</style>
