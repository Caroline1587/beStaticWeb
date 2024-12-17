export default function () {
  // 容器是否展开
  let asideExpand = ref(true)
  const handleAsideChange = (val:boolean) => {
    asideExpand.value = val
  }

  // 树形结构配置
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
  const treeRef = ref<any>()

  // 树形结构展开/收起
  const handleTreeChange = (val:boolean) => {
    for (let key in treeRef.value?.store.nodesMap) {
      if (treeRef.value?.store.nodesMap[key].level === 1) {
        treeRef.value.store.nodesMap[key].expanded = true
      } else if (treeRef.value?.store.nodesMap[key].expanded || treeRef.value?.store.nodesMap[key].expanded === false) {
        treeRef.value.store.nodesMap[key].expanded = val
      }
    }
  }

  // 树形结构搜索回调
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

  // 树形结构搜索回调
  const filterNodeV2 = (value: string, data: any) => {
    // 获取对应的节点
    const node = treeRef.value?.getNode(data.id) as any
    // 根据节点id获取对应的dom
    const highlightDom = document.querySelector(`.el-tree div[data-key="${data.id}"]`)
    if (!value) {
      // 取消高亮
      if (highlightDom) highlightDom.classList.remove('is-filter')
    } else if (node.label?.includes(value)) {
      // 若当前label包含了value，则进行高亮
      if (highlightDom) highlightDom.classList.add('is-filter')
    } else {
      // 取消高亮
      if (highlightDom) highlightDom.classList.remove('is-filter')
    }
    return true
  }

  // 搜索输入框是否展开
  let searchExpand = ref(false)
  // 选中模块输入框发生变化回调
  const handleChange = (val:boolean) => {
    searchExpand.value = val
  }
  // 输入框的值
  let filterKey = ref('')
  watch(() => filterKey.value, (val) => {
    treeRef.value?.filter(val)
  })

  return {
    asideExpand,
    handleAsideChange,
    customNodeClass,
    defaultProps,
    treeRef,
    handleTreeChange,
    filterNode,
    filterNodeV2,
    searchExpand,
    handleChange,
    filterKey
  }
}
