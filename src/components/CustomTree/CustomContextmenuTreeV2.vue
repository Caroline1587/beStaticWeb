<template>
  <CustomTreeContainer
    v-model:width="containerWidth"
    :aside-expand="asideExpand"
    :border="border"
    :module-name="moduleName"
    @offse-height-change="offseHeightChange"
  >
    <!-- 头部搜索、图标区域 -->
    <template #header>
      <!-- 搜索输入框 -->
      <CustomTreeSearch
        v-show="asideExpand"
        v-model="filterKey"
        :title="t('propsmodulenameMoKuai', [props.moduleName])"
        @change="handleChange"
        @close="emits('close')"
      />
      <!-- 按钮组 -->
      <CustomTreeButtons
        v-if="!searchExpand && expand"
        :add-icon="props.addIcon"
        @add="emits('add')"
        @aside-change="handleAsideChange"
        @tree-change="expandAllTreeNode"
      />
    </template>
    <!-- 树形结构:通过插槽的方式来展示 -->
    <template #main>
      <CustomContextMentTreePopover
        v-model="visible"
        :tree-menu-data="treeMenuData"
        :role="props.role"
        :current-node="currentNode"
        :current-node-data="currentNodeData"
        :virtual-ref="currentTarget"
        @change="handleContextChange"
        @after-leave="handleTree"
      >
      <template #customMenu="{node, changeCurrentCmd}">
        <slot name="customMenu" :node="node" :change-current-cmd="changeCurrentCmd"></slot>
      </template>
      </CustomContextMentTreePopover>
      <el-tree-v2
        ref="treeRef"
        class="custom-tree"
        node-key="id"
        highlight-current
        :default-expand-all="false"
        :height="offseHeight"
        v-bind="$attrs"
        :filter-method="filterNodeV2"
        :expand-on-click-node="false"
        :data="props.treeData"
        :props="props.props"
        :default-expanded-keys="currentNodeExpand"
        :auto-expand-parent="false"
        @node-click="nodeClick"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
      >
        <template #default="{ node, data }">
          <span
            v-if="!data.edit"
            class="tree_node"
            :style="node.isCurrent?'color:var(--el-color-primary)':''"
            @contextmenu.stop.prevent="nodeContextMenu($event, data, node)"
          >
            <slot name="customLabel" :node="node"></slot>
          </span>
          <span v-else class="tree_node">
            <TreeInput
              ref="treeInputRef"
              :tree-label="treeLabel"
              @cancel="cancel"
              @save="saveFolder" />
          </span>
        </template>
      </el-tree-v2>
    </template>
  </CustomTreeContainer>
</template>
<script lang='ts'>
  import CustomTreeSearch from './CustomTreeSearch.vue'
  import CustomTreeButtons from './CustomTreeButtons.vue'
  import { errorMessage } from '@/utils/message'
  import treeHook from './hook'
  import i18n from '@/lang'
  const i18ntGlobal:any = i18n.global
  const i18nt:any = i18ntGlobal.t
  const defaultTreeMenuData = [
    {
      label: i18nt('xinJianZiWenJianJia'),
      cmd: 'addFolder',
      flag: 10,
      roleLabel: 'enableFolderAdd'
    }, {
      label: i18nt('zhongMingMingWenJianJia'),
      cmd: 'editFolder',
      flag: 1,
      roleLabel: 'enableFolderEdit'
    }, {
      label: i18nt('shanChuWenJianJia'),
      cmd: 'deleteFolder',
      flag: 1,
      roleLabel: 'enableFolderDelete'
    }
  ]
</script>
<script setup lang="ts">
const { t } = useI18n()
const { filterKey, asideExpand, handleAsideChange, treeRef, filterNodeV2, searchExpand, handleChange } = treeHook()

/**
   * @desc 树形结构展开/收起容器
   * @props moduleName: 模块名称 treeData: 树形结构数据 expand是否显示展开收起图标
*/
const props = withDefaults(defineProps<{
  moduleName?: string,
  treeData: any[],
  expand?: boolean,
  border?: boolean,
  role:{
    enableFolderAdd:boolean
    enableFolderEdit:boolean
    enableFolderDelete:boolean
  },
  treeMenuData?: any[],
  addIcon?: boolean,
  props?: any
}>(), {
  moduleName: '',
  treeData: () => { return [] },
  expand: false,
  border: true,
  treeMenuData: () => {
    return defaultTreeMenuData
  },
  props: () => {
    return {
      value: 'id',
      children: 'childrenList',
      label: 'name',
      class: (data:any) => {
        if (data.highlight) {
          return 'is-filter'
        }
        return ''
      }
    }
  }
})
const emits = defineEmits(['deleteNode', 'checkNode', 'nodeClick', 'exportOrImport', 'add', 'close'])
const containerWidth = ref(260)

// 树形节点操作菜单
const visible = ref(false)

// 树形节点数据
const currentNodeData = ref()
const currentNode = ref()

// 控制树形节点展开与否
const currentNodeExpand = ref<string[]>(['27d3d91c9a8d4dd0bb9db28998c3eccf'])
const nodeClick = (data:any, node:any) => {
  if (data.id !== '-1') {
    currentNodeData.value = data
    currentNode.value = node
    emits('nodeClick', data, node)
  }
}
const nodeExpand = (data:any, node:any) => {
  node.expanded = true
  currentNodeExpand.value.push(data.id)
}
const nodeCollapse = (data:any, node:any) => {
  node.expanded = false
  currentNodeExpand.value.splice(currentNodeExpand.value.indexOf(data.id), 1)
}
const currentTarget = ref()
const nodeContextMenu = (event:any, data:any, node:any) => {
  if (data.id !== '-1') {
    currentCmd.value = ''
    currentNodeData.value = data
    currentNode.value = node
    // buttonRef.value = event.currentTarget
    currentTarget.value = event.currentTarget
    visible.value = !visible.value
  }
}

const currentCmd = ref('')

const handleContextChange = (val:string) => {
  currentCmd.value = val
}
 // 输入框树形节点
let oldName = ''
const treeInputRef = ref()
const treeLabel = ref('')
const handleTree1 = (tempCmd:string, node:any) => {
  let key = node
  currentCmd.value = tempCmd
  currentNode.value = treeRef.value?.getNode(key)
  currentNodeData.value = currentNode.value.data
  handleTree()
}
const handleTree = () => {
  let key = currentNodeData.value.id
  currentNode.value = treeRef.value?.getNode(key)
  let cmd = currentCmd.value
  if (cmd === 'addFolder' || cmd === 'addLeafFolder') {
    if (currentNode.value.level >= 10) {
      errorMessage(t('wenJianJiaCengJiShenDuXianZhiZuiDaWei_10CengDangQianJieDianWuFaXinJianZiJieDian'))
      return
    }
    const newChild = { id: '-1', label: '', children: [], edit: true }
    treeLabel.value = ''
    if (!currentNode.value.data.childrenList) {
      currentNode.value.data.childrenList = []
    }
    // treeRef.value?.append(newChild, key)
    // 虚拟树形没有 append 方法，直接给数据添加然后通过 setData 方法更新树形即可
    currentNodeData.value.childrenList.push(newChild)
    treeRef.value?.setData(props.treeData)
    // 处理节点关闭的情况
    if (!currentNode.value.expanded) {
      currentNode.value.expanded = true
      currentNodeExpand.value.push(key)
      // 设置树形结构展开的节点key
      treeRef.value?.setExpandedKeys(currentNodeExpand.value)
      nextTick(() => {
        // 等待树形结构展开
        nextTick(() => {
          treeInputRef.value.input.focus()
        })
      })
    }
  } else if (cmd === 'editFolder') {
    treeLabel.value = currentNode.value.label
    oldName = treeLabel.value
    currentNode.value.data.edit = true
  } else if (cmd === 'deleteFolder') {
    emits('deleteNode', currentNodeData.value)
  } else {
    emits('exportOrImport', cmd, key)
  }
}
const cancel = () => {
  let node:any = treeRef.value?.getNode('-1')
  // 虚拟树形没有 remove 方法，直接给数据删除然后通过 setData 方法更新树形即可
  currentNodeData.value.childrenList = currentNodeData.value.childrenList.filter((item:any) => item.id !== node.key)
  treeRef.value?.setData(props.treeData)
  // treeRef.value?.remove(node)
  // nextTick(() => {
    // 保持父节点高亮
    // treeRef.value?.setCurrentKey(currentNodeData.value.id)
    // emits('nodeClick', currentNodeData.value)
  // })
}
const saveFolder = async (newFolderName:string, input:any) => {
  if (currentCmd.value === 'editFolder' && oldName === newFolderName) {
    currentNode.value.data.edit = false
    oldName = ''
    return
  }
  let parentId = currentCmd.value === 'editFolder' ? currentNodeData.value.parentId : currentNodeData.value.id
  emits('checkNode', parentId, newFolderName, currentCmd.value, input, currentNodeData.value)
}

// 递归得到所有的节点id
const flattenArray = (arr:any[]) => {
  let flattened:any[] = []
  for (let i = 0; i < arr.length; i++) {
    // 收集当前层级的数据
    if (arr[i].childrenList?.length > 0) {
      flattened.push(arr[i].id)
      flattened = flattened.concat(flattenArray(arr[i].childrenList))
    }
  }
  return flattened
}

// 控制树形节点是否全部展开
const expandAllTreeNode = (val:boolean) => {
  let nodes = flattenArray(props.treeData)
  if (nodes) {
    if (val) {
      // 展开所有节点
      currentNodeExpand.value = nodes
    } else {
      // 收缩除了最外层以外的节点
      currentNodeExpand.value = [props.treeData[0].id]
    }
    nextTick(() => {
      // 设置树形结构展开的节点key
      treeRef.value?.setExpandedKeys(currentNodeExpand.value)
    })
  }
}

const offseHeight = ref(0) // tree的高度
const offseHeightChange = (val:number) => {
  // 防止内边距等影响出现滚动条
  offseHeight.value = val - 10
}

watch(() => props.treeData, (newValue, oldValue) => {
  if (newValue.length > 0 && oldValue.length === 0) {
    expandAllTreeNode(true)
    nextTick(() => {
      // 默认展开全部的节点
    })
  }
})

defineExpose({
  treeRef,
  currentNodeData,
  nodeClick,
  handleTree: handleTree1
 })

</script>

<style lang="scss" scoped>
.el-tree{
  padding: 4px 8px;

  :deep(.el-icon) {
    font-size: 12px;
  }
  :deep(.el-tree-node__content){
    border-radius: 4px;
    position: relative;
  }
  // 由于外部样式问题，此处给树形结构滚动条向外移动一些。看起来美观
  :deep(.el-virtual-scrollbar){
    right: -8px!important;
  }
}
.tree_node{
  display: flex;
  align-items: center;
  width:100%;
  overflow: hidden;
  justify-content: space-between;
  height: 100%;
  position: relative;
  font-size: 14px;
  >span{
    display: flex;
    align-items: center;
    .el-icon{
      margin-right: 4px;
    }
  }
  .el-input{
    height: 100%;
  }
}
</style>
