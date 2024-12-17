<template>
  <TipDialogV5
    ref="tipDialogV5Ref"
    :width="1200"
    :modal="false"
    :title="t('quanPingBianJi')"
  >
    <template #default>
      <div style="border:1px solid #E6EAF2;height:600px">
        <QuillEditor
          ref="editorRef"
          v-model:value="textValue"
          :read-only="false"
          :full-screen="false"
          :placeholder="props.data.promptText"
          @get-files="getFiles"
        >
        </QuillEditor>
      </div>
    </template>
    <template #footer>
      <el-button class="grey-liner-button" @click="toCancel">{{ t('quXiao') }}</el-button>
      <el-button class="blue-button" @click="toSave">{{ t('baoCun') }}</el-button>
    </template>
  </TipDialogV5>
</template>

<script
  setup
  lang="ts"
>
  import useRichtext from '@/views/common/widget/components/useRichtext'
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    data: {
      promptText:string
      id:string
    }
    flag:boolean
  }>(), {
    flag () {
      return false
    }
  })
  const { textValue, editorRef, getFiles } = useRichtext(props.data, 'editable', props.flag)
  let info:any = null
  const tipDialogV5Ref = ref()
  // 按钮事件
  const toCancel = () => {
    tipDialogV5Ref.value.dialogVisible = false
  }
  const toSave = () => {
    info.value = textValue.value
    tipDialogV5Ref.value.dialogVisible = false
  }

  const show = (value:Ref<string>) => {
    textValue.value = value.value
    info = value
    tipDialogV5Ref.value.dialogVisible = true
  }
  defineExpose({
    show
  })
</script>
<style
  lang='scss'
  scoped
>
</style>
