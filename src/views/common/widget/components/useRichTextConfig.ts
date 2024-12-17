import { createUUID } from '@/utils/public'
import { errorMessage } from '@/utils/message'
import { templateStore } from '@/store/index'
// 富文本配置
type InsertFnType = (url: string, alt: string, href: string) => void
export const handleEditorConfig = (source:string) => {
  const templatestore = templateStore()
  const { t } = useI18n()
  return {
    scroll: false,
    MENU_CONF: {
      uploadImage: {
        async customUpload (file: File, insertFn: InsertFnType) {
          let namearr = file.name.split('.')
          let suffix = namearr[namearr.length - 1]
          const enableSuffix = ['png', 'jpg', 'gif', 'svg', 'PNG', 'JPG', 'GIF', 'SVG']
          if (enableSuffix.includes(suffix)) {
            let objectUrl = URL.createObjectURL(file)
            if (!templatestore.richTextFiles[source]) {
              templatestore.richTextFiles[source] = []
            }
            templatestore.richTextFiles[source].push({
              id: createUUID(),
              url: objectUrl,
              file
            })
            insertFn(objectUrl, file.name, '')
          } else {
            errorMessage(t('fuWenBenKuangZhongZhiYunXuChaRuPngjpggifsvgDengLeiXingDeTuPian'))
          }
        }
      },
      insertLink: {
        checkLink: customCheckLinkFn, // 也支持 async 函数
        parseLinkUrl: customParseLinkUrl // 也支持 async 函数
      }
    },
    hoverbarKeys: {
      image: {
        menuKeys: ['imageWidth30', 'imageWidth100', 'deleteImage']
      },
      link: {
        menuKeys: ['editLink', 'unLink', 'viewLink']
      }
    }
  }
}
// 自定义校验链接
function customCheckLinkFn (text: string, url: string): string | boolean | undefined {
  if (!url) {
    return
  }
  return true
}
// 自定义转换链接 url
function customParseLinkUrl (url: string): string {
  if (url.indexOf('http') !== 0) { // 如果不是以http开头则添加http
    return `http://${url}`
  }
  return url
}
export const toolbarConfig = {
  toolbarKeys: ['insertLink', 'uploadImage']
}
