<template>
  <div
    v-if="props.status!=='showonly'"
    tabindex="0"
    :class="`el-input ${props.status==='editable' ? '':`is-${props.status}`}`"
    @keyup.enter="showInput"
  >
    <div class="el-input__wrapper">
      <el-scrollbar>
        <el-tag
          v-for="(tag, index) in tags"
          :key="tag"
          :closable="props.status==='editable'"
          :disable-transitions="false"
          @close="delTag(index)"
        >
          {{ tag }}
        </el-tag>
        <el-tag class="newTag">
          <el-select-v2
            v-if="inputVisible"
            ref="inputRef"
            v-model="current"
            filterable
            placeholder="+"
            suffix-icon=""
            :options="props.tags"
            :disabled="props.status!=='editable'"
            @blur="blur"
            @change="change"
            @input="selectInput"
            @keyup.enter="keyUpEnter"
          >
            <template #default="{ item }">
              <el-tooltip
                effect="dark"
                :content="item.label"
                :show-after="1000"
              >
                <div class="ellipsis">{{ item.label }}</div>
              </el-tooltip>
            </template>
          </el-select-v2>
        </el-tag>
      </el-scrollbar>
    </div>
  </div>
  <div v-else class="is-showonly">
    <CustomTag
      v-for="(tag, tagIndex) in tags"
      :key="tag"
      :tag-info="tag"
      :tag-index="tagIndex"
      class="showonly-tag"
    />
    <EmptyTag v-if="tags.length===0"></EmptyTag>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import type { InputInstance } from 'element-plus'
  import { errorMessage } from '@/utils/message'
  import EmptyTag from '@/views/common/widget/components/EmptyTag.vue'
  const { t } = useI18n()
  interface ListItem {
    value: string
    label: string
  }
  const props = withDefaults(defineProps<{
    value?:string
    status?:'showonly'|'preview'|'disabled'|'editable'
    tags?:ListItem[]
  }>(), {
    value () {
      return ''
    },
    tags () {
      return []
    },
    status () {
      return 'editable'
    }
  })
  const emits = defineEmits(['update:value'])
  // 标签展示
  const tags = computed({
    get () {
      return props.value ? props.value.split(',') : []
    },
    set (val:string[]) {
      return val
    }
  })
  const changeValue = () => {
    let label = ''
    if (tags.value.length > 50) {
      tags.value = tags.value.slice(0, 50)
      errorMessage(t('zuiDuoTianJia_50GeBiaoQian'))
    } else {
      tags.value.forEach((item, index) => {
        label += index === 0 ? item : `,${item}`
      })
      emits('update:value', label)
    }
  }
  const delTag = (index:number) => {
    tags.value.splice(index, 1)
    changeValue()
  }
  // 筛选框
  const current = ref('')
  const inputVisible = ref(true)
  const inputRef = ref<InputInstance>()
  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
  const checkCharacter = (value:string) => {
    const rule = /(^\s+)|(["'<>\\/,]+)|(\s+$)/gi
    return rule.test(value)
  }
  const add = () => {
    const val = current.value
    if (!val) {
      return
    } else if (checkCharacter(val)) {
      errorMessage(t('biaoQianQianHouBuNengYouKongGeQieBuNengShuRuRuXiaTeShuZiFu'))
      return
    }
    // 重复标签直接删除本次输入的内容
    if (tags.value.indexOf(val) > -1) {
      current.value = ''
      return
    }
    tags.value.push(val)
    changeValue()
    current.value = ''
  }
  const selectInput = (e:any) => {
    if (e.target.value.length > 50) {
      e.target.value = e.target.value.substring(0, 50)
      errorMessage(t('danGeBiaoQianDeChangDuShangXianShi_50ZiFu'))
    }
  }
  const change = (val:string) => {
    current.value = val
    add()
    inputVisible.value = false
    nextTick(() => {
      showInput()
    })
  }
  const blur = () => {
    current.value = ''
    add()
  }
  const keyUpEnter = (e:any) => {
    current.value = e.target.value
    add()
    inputVisible.value = false
  }

</script>
<style
  lang='scss'
  scoped
>
.el-input__wrapper{
  justify-content: flex-start!important;
  height: 32px;
  width: 100%;
  :deep(.el-scrollbar__view) {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .el-tag{
    margin: 3px 0;
    :deep(.el-tag__content){
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .el-tag+.el-tag{
    margin-left: 6px;
  }
  .newTag{
    border: 1px solid var(--el-border-color);
    background-color: transparent;
    color: $--global--regular--text--color;
    .el-select{
      --el-select-input-focus-border-color:transparent;
      --el-select-border-color-hover:transparent;
      height: 100%;
      :deep(.el-select__wrapper){
        padding:0;
        height: 22px;
        width: 130px;
        --el-input-border-color: transparent;
        --el-input-hover-border-color: transparent;
        --el-input-focus-border-color: transparent;
        box-shadow: 0 0 0 0px var(--el-disabled-border-color) inset!important;
        min-height: 22px;
        line-height: 22px;
        border-radius: 0px;
        background-color: transparent;
      }
      :deep(.el-select__suffix){
        display: none;
      }
    }
  }
}
.showonly-tag{
  margin-right: 8px;
  display: inline-block;
  vertical-align: baseline;
  height: 24px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 26px;
  padding: 0 8px;
  border-radius: 4px;
}
</style>
