<template>
  <el-select-v2
    v-if="props.status!=='showonly'"
    v-model="memberValue"
    filterable
    :disabled="props.status!=='editable'"
    :class="`memebr-select ${props.status==='editable' ? '':`is-${props.status}`}`"
    :height="200"
    clearable
    :options="props.users"
    :placeholder="props.data.promptText"
  >
    <template #label="item">
      <GenderAvatar :gender="item.gender" :info="item.label"></GenderAvatar>
    </template>
    <template #default="{item}">
      <GenderAvatar :gender="item.gender" :info="item.label"></GenderAvatar>
    </template>
  </el-select-v2>
  <showTags
    v-else
    :value="props.value.value?[props.value]:[]"
    field-type="singleMember"
    :background-color="props.data.backgroundColor"
  ></showTags>
</template>

<script lang="ts" setup>
  import showTags from './components/showTag.vue'
  import GenderAvatar from '@/views/common/GenderAvatar.vue'
  // 全部用户
  interface ListItem {
    value: string
    label: string
    gender?:string
    isDelete?:boolean
  }
  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      backgroundColor?:string
    }
    users?:ListItem[]
    status?:'showonly'|'preview'|'disabled'|'editable'
    value:ListItem
  }>(), {
    users () {
      return []
    },
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value'])
  const memberValue = computed({
    get () {
      if (props.status === 'editable' && props.value.value && !allUserId.value[props.value.value]) {
        emits('update:value', { value: '', label: '' })
        return ''
      } else {
        return props.value.value
      }
    },
    set (val:string) {
      emits('update:value', { value: val || '', label: '' })
      return val
    }
  })
  const allUserId = computed(() => {
    return props.users.reduce((acc:any, item) => {
      acc[item.value] = {
        label: item.label,
        gender: item.gender
      }
      return acc
    }, {})
  })
</script>

<style lang="scss" scoped>
.el-select-v2{
  width: 100%;
  :deep(.el-select-v2__wrapper){
    flex-wrap: nowrap;
  }
  :deep(.el-select-v2__wrapper>div:first-child){
    line-height: 1;
  }
  :deep(.el-select-v2__input-wrapper){
    margin-inline-start: 0px;
  }
  :deep(.el-select-v2__placeholder){
    margin-inline-start:32px
  }
}
</style>
