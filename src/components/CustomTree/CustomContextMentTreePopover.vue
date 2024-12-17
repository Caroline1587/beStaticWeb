<template>
  <el-popover
    ref="tooltipRef"
    v-model:visible="visible"
    trigger="focus"
    enterable
    :offset="5"
    placement="bottom"
    :popper-options="{
      modifiers: [
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
            enabled: false
          }
        }
      ]
    }"
    :virtual-ref="props.virtualRef"
    virtual-triggering
    popper-class="folderMenu"
    @after-leave="emits('afterLeave', currentCmd)"
  >
    <ul class="folderMenuList">
      <li
        v-for="item in treeMenuData"
        :key="item.cmd"
        :disabled="props.currentNode?.level === item.flag||!props.role[item.roleLabel]||props.currentNodeData?.isFullPermission === 0"
        @click="changeCurrentCmd(item.cmd, currentNode?.level === item.flag)"
      >
        {{ item.label }}
      </li>
      <slot
				name="customMenu"
				:node="currentNode"
				:change-current-cmd="changeCurrentCmd"></slot>
    </ul>
  </el-popover>
</template>

<script lang="ts" setup>

interface TreeMenuDataItem {
  label: string
  cmd: string
  flag: number
  roleLabel: string
}

const props = withDefaults(defineProps<{
  modelValue: boolean,
  treeMenuData: TreeMenuDataItem[]
  currentNode: any
  virtualRef: any
  role:{
    enableFolderAdd:boolean
    enableFolderEdit:boolean
    enableFolderDelete:boolean
  },
  currentNodeData: any
}>(), {
  modelValue: false,
  treeMenuData: () => {
    return []
  },
  currentNode: () => {
    return {}
  },
  currentNodeData: () => {
    return {}
  }
})

const emits = defineEmits(['afterLeave', 'click', 'update:modelValue', 'change'])

// 树形节点操作菜单
const visible = computed({
  get () {
    return props.modelValue
  },
  set (val:boolean) {
    emits('update:modelValue', val)
    return val
  }
})
// const buttonRef = ref()

// 指令
const currentCmd = ref('')
const changeCurrentCmd = (val:string, disabled:boolean) => {
  if (!disabled) {
    currentCmd.value = val
    emits('update:modelValue', false)
  }
  emits('change', val)
}

</script>

<style lang="scss" scoped>
</style>
