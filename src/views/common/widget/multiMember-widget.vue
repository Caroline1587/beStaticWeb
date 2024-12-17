<template>
  <div
    v-if="props.status!=='showonly'"
    tabindex="0"
    :class="`el-input ${props.status==='editable' ? '':`is-${props.status}`}`"
    @click="showDialog"
  >
    <div class="el-input__wrapper">
      <div v-show="!props.value" class="el-input__placeholder">{{ props.data.promptText }}</div>
      <el-scrollbar>
        <div class="tagContainer">
          <el-tag
            v-for="(tag, index) in tags"
            :key="tag.id"
            :closable="props.status==='editable'"
            :disable-transitions="false"
            @close="delTag(index)"
          >
            {{ tag.realName }}
          </el-tag>
        </div>
      </el-scrollbar>
    </div>
    <div class="suffix">
      <el-icon><ArrowDown /></el-icon>
    </div>
  </div>
  <showTags
    v-else
    :value="tags.map(item=>{return {label:item.realName, gender:item.gender, isDelete:item.isDelete}})"
    :is-background="true"
    :is-multi="true"
    :field-type="props.data.fieldType"
    :background-color="props.data.backgroundColor"
  ></showTags>
</template>

<script lang="ts" setup>
  import { ArrowDown } from '@element-plus/icons-vue'
  import showTags from './components/showTag.vue'
  interface ListItem {
    id: string
    realName: string
    gender?:string
    isDelete?:boolean
  }
  const props = withDefaults(defineProps<{
    data: {
      id:string
      fieldName:string
      promptText:string
      fieldType:string
      backgroundColor?:string
    }
    status?:'showonly'|'preview'|'disabled'|'editable'
    userOptions:any[]
    value:ListItem[]
  }>(), {
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value', 'showMultiDialog'])
  const tags = computed({
    get () {
      if (props.status === 'editable' && props.value) {
        const data = props.value.map(item => item.id).join(',')
        const result = props.userOptions?.filter((item:any) => data.indexOf(item.id) !== -1)
        if (result.length !== props.value.length) emits('update:value', result)
        return result
      } else {
        return props.value
      }
    },
    set (val:ListItem[]) {
      return val || []
    }
  })
  const delTag = (index:number) => {
    tags.value.splice(index, 1)
    emits('update:value', tags.value)
  }
  const showDialog = () => {
    if (props.status === 'editable') {
      emits('showMultiDialog', props.data.id, props.data.fieldName, props.value.map(item => item.id).join(','))
    }
  }
</script>

<style lang="scss" scoped>
  .el-input{
    height: 32px;
    position: relative;
  }
  .el-input__wrapper{
    padding-right: 30px;
    padding-left: 5px;
    width: 100%;
    position: relative;
    justify-content: flex-start!important;
    .el-input__placeholder{
      color: var(--el-text-color-placeholder);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      -webkit-margin-start: 12px;
      margin-inline-start: 12px;
      width: calc(100% - 52px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tagContainer{
      display: flex;
      align-items: center;
    }
    .el-tag{
      margin: 3px;
      :deep(.el-tag__content){
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
  .suffix{
    position:absolute;
    width: 30px;
    height: 100%;
    right: 0px;
    top:0px;
    color: var(--el-input-icon-color,var(--el-text-color-placeholder));
    padding-left: 4px;
    padding-top: 2px;
  }
</style>
