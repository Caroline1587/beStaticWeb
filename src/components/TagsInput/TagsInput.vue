<template>
  <div
    class="muli-tags"
    @click="focus"
  >
    <el-tag
      v-for="(tag, index) in tags"
      :key="index"
      closable
      @close="delTag(index)"
    >
    {{ tag }}
    </el-tag>
    <el-input
      ref="inputRef"
      v-model="current"
      maxlength="10"
      @keyup.enter="add"
      @keydown.delete="del"
      @blur="add"
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
  import type { InputInstance } from 'element-plus'
  const props = withDefaults(defineProps<{
    value:string
    separation:string
    // reset:boolean
  }>(), {})
  const emits = defineEmits(['update:value'])
  const current = ref('')
  const inputRef = ref<InputInstance>()
  const tags = computed({
    get () {
      return props.value ? props.value.split(props.separation) : []
    },
    set (val:string[]) {
      return val
    }
  })
  const changeValue = () => {
    let label = ''
    tags.value.forEach((item, index) => {
      if (index === 0) {
        label += item
      } else {
        label += `${props.separation}${item}`
      }
    })
    emits('update:value', label)
  }
  const add = (e:any) => {
    const val = e.target.value
    if (!val) return
    // 重复标签直接删除本次输入的内容
    if (tags.value.indexOf(val) > -1) {
      current.value = ''
      return
    }
    tags.value.push(val)
    changeValue()
    current.value = ''
  }
  const del = (e:any) => {
    if (!e.target.value.length) {
      tags.value.pop()
      changeValue()
    }
  }
  const delTag = (index:number) => {
    tags.value.splice(index, 1)
    changeValue()
  }
  // 设置展示框中的焦点自动定位到输入框中
  const focus = () => {
    inputRef.value?.focus()
  }
  // watch(() => props.reset, newValue => {
  //   if (newValue) {
  //     tags.value = []
  //   }
  // }, { immediate: true })
</script>
<style
  lang='scss'
  scoped
>
  .muli-tags {
    padding: 2px 2px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-wrap:wrap;
    height: 100%;
    width: 100%;
    align-items: center;
    .el-tag{
      margin-left: 3px;
    }
    .el-input{
      flex: 1;
      height: 100%;
      --el-input-border-color: transparent;
      --el-input-hover-border-color: transparent;
      --el-input-focus-border-color: transparent;
    }
  }
</style>
