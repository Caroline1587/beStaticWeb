<template>
  <div
    tabindex="0"
    :class="props.disabled ? 'muli-tags disabled-muli-tags' :'muli-tags'"
    @keyup.enter="showInput"
  >
    <el-scrollbar>
      <el-tag
        v-for="(tag, index) in tags"
        :key="tag"
        :closable="!props.disabled"
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
          :options="options"
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
</template>

<script
  setup
  lang="ts"
>
import { useI18n } from 'vue-i18n';

  import type { InputInstance } from 'element-plus'
  import { getTagNamesByType } from '@/api/testcaseApi'
  import { errorMessage } from '@/utils/message'
  const { t } = useI18n()
  interface ListItem {
    value: string
    label: string
  }
  const props = withDefaults(defineProps<{
    value?:string
    separation:string
    disabled?:boolean
  }>(), {
    value () {
      return ''
    },
    disabled () {
      return false
    }
  })
  const emits = defineEmits(['update:value'])

  // 标签展示
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
    if (tags.value.length > 50) {
      tags.value = tags.value.slice(0, 50)
      errorMessage(t('zuiDuoTianJia_50GeBiaoQian'))
    } else {
      tags.value.forEach((item, index) => {
        label += index === 0 ? item : `${props.separation}${item}`
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
  const options = ref<ListItem[]>([])
  const getTagNames = () => {
    getTagNamesByType(1).then(res => {
      options.value = res.data.map((item:string) => {
      return { value: item, label: item }
    })
    }).catch()
  }
  onMounted(() => {
    getTagNames()
  })

</script>
<style
  lang='scss'
  scoped
>
  .muli-tags {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-wrap:wrap;
    height: 100%;
    width: 100%;
    align-items: center;
    background-color: #fff;
    .el-tag{
      margin: 3px;
      :deep(.el-tag__content){
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .newTag{
      border: 1px solid lightblue;
      /* border: 1px solid $--global--regular--border--color; */
      background-color: #fff;
      color: grey;
      /* color: $--global--regular--text--color; */
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
      }
    }
    :deep(.el-scrollbar__view) {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .disabled-muli-tags{
    background-color: #F5F7FA;
    .newTag{
      display: none;
    }
  }
</style>
