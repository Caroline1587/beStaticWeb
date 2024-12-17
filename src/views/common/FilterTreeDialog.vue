<template>
  <TipDialogV5
    ref="tipDialogV5Ref"
    :width="400"
    :title="tipTitle"
    @closed="reset"
  >
    <slot name="dialogTip"></slot>
    <div class="container">
      <div class="inputBtn">
        <el-input v-model="filterKey" :placeholder="t('souSuoLuJing')">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <el-scrollbar>
        <el-tree
          ref="treeRef"
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          node-key="id"
          default-expand-all
          @node-click="treeNodeClick"
        >
          <template #default="{ node }">
            <slot :node="node"></slot>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button class="grey-liner-button" @click="tipDialogV5Ref.dialogVisible = false">{{ t('quXiao') }}</el-button>
      <el-button class="blue-button" @click="submit">{{ t('queDing') }}</el-button>
    </template>
  </TipDialogV5>
</template>
<script lang="ts" setup>
  import { ElTree } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  const { t } = useI18n()
  const props = defineProps<{
    treeData:any[]
  }>()
  const emits = defineEmits(['submit'])
  // dialog展示控制
  const tipDialogV5Ref = ref()
  // 树形结构
  const treeRef = ref<InstanceType<typeof ElTree>>()
  const customNodeClass = (data:any) => {
    if (data.highlight) {
      return 'is-filter'
    }
    return ''
  }
  const defaultProps = {
  children: 'childrenList',
  label: 'name',
  class: customNodeClass
}
  const data = computed(() => {
    return JSON.parse(JSON.stringify(props.treeData))
  })
  // 树形结构节点筛选
  const filterKey = ref('')
  let currentNodeId = ''
  let currentNode:any = null
  const treeNodeClick = (data:any, node:any) => {
    currentNodeId = data.id
    currentNode = node
  }
  const filterNode = (value: string, data: any, node:any) => {
    if (!value) {
      node.data.highlight = false
    } else if (node.label?.includes(value)) {
      node.data.highlight = true
    } else {
      node.data.highlight = false
    }
    return true
  }
  watch(filterKey, (val) => {
    treeRef.value?.filter(val)
  })
  // 底部按钮
  const submit = () => {
    emits('submit', currentNodeId, currentNode)
  }
  const tipTitle = ref('')
  const show = (title:string) => {
    tipTitle.value = title
    tipDialogV5Ref.value.dialogVisible = true
  }
  const hidden = () => {
    tipDialogV5Ref.value.dialogVisible = false
  }
  const reset = () => {
    currentNodeId = ''
    currentNode = null
  }
  defineExpose({
    show,
    hidden
  })
</script>
<style lang="scss" scoped>
  .container{
    height: 320px;
    border-radius: 4px;
    border: 1px solid $--global--regular--border--color;
    display: flex;
    flex-direction: column;
    width: 100%;
    .inputBtn{
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .el-input{
        height: 30px;
        --el-input-border-color:$--global--regular--border--color;
      }
    }
  }
</style>
