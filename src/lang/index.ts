import { createI18n } from 'vue-i18n'
import Storage from '@/utils/storage'
import EN from './en.json'
import ZH from './zh.json'
import ZH1 from './zh_sales.json'

const messages:any = {
  zh: { },
  en: { }
}
if (Storage.localGet('ApiUrl').tosales) {
  messages.zh = { ...ZH1 }
} else {
  messages.zh = { ...ZH }
}
messages.en = { ...EN }
const i18n = createI18n({
  locale: Storage.localGet('lang') || 'zh', // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages
})

export default i18n
