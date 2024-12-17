import { handleEditorConfig } from './useRichTextConfig'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { templateStore } from '@/store/index'

// 富文本配置
export default function useMarkdown (data:any, status:string, flag = false) {
  const editorRef = shallowRef()
  const textValue = ref('')
  const toolbarConfig = {
    excludeKeys: [
      'todo',
      'emotion',
      'group-video',
      'fontFamily'
    ]
  }
  // 说明：source属性方便确定当前传入的图片与哪个数据绑定，方便筛选
  const editorConfig = ref({
    ...handleEditorConfig(data.id),
    placeholder: status === 'showonly' ? '' : data.promptText,
    readOnly: status !== 'editable',
    autoFocus: false,
    hoverbarKeys: {
      image: {
        menuKeys: ['imageWidth30', 'imageWidth100', 'deleteImage']
      },
      link: {
        menuKeys: ['editLink', 'unLink', 'viewLink']
      }
    }
  })
  const getFiles = (fileInfo:any) => {
    const templatestore = templateStore()
    if (!templatestore.richTextFiles[data.id]) {
      templatestore.richTextFiles[data.id] = []
    }
    templatestore.richTextFiles[data.id].push(fileInfo)
  }
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    editorRef.value = null
  })
  return {
    Editor,
    Toolbar,
    editorRef,
    textValue,
    toolbarConfig,
    editorConfig,
    getFiles

  }
}
