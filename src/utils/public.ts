import { v4 } from 'uuid'
import { message } from '@/utils/message'
import { ElMessageBox } from 'element-plus'
// import { router } from '@/router/index'
import i18n from '@/lang'
import { DATA_SHORTCUTS } from '@/utils/constant'
// 创建uuid
export function createUUID () {
  const uuid = v4().replace(/-/g, '')
  return uuid
}

// 驼峰命名转为下划线分割命名（匹配数据库字段）
export function toUnderLine (str:string) {
  let nstr = str.replace(/[A-Z]/g, function ($0) { // 函数里只有一个参数时表示与 regexp 中的表达式相匹配的文本。有多个参数时表示与 regexp 中的子表达式相匹配的文本
    return '_' + $0.toLocaleLowerCase()
  })
  // 防止有开头大驼峰
  if (nstr.slice(0, 1) === '_') {
      nstr = nstr.slice(1)
  }
  return nstr
}
// 正则匹配字符串，替换字符串中的特殊字符，只允许数字，字母和汉字
export const validForbid = (value:string) => {
  // 配置不允许输入的特殊字符
  if (value) {
    // /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi
    let regRule = /[^A-Za-z0-9\u4e00-\u9fa5]/ig
    value = value.replace(regRule, '')
  }
  return value
}
export const checkSpecialCharacter = (value:string) => {
  const rule = /^[A-Za-z0-9\u4e00-\u9fa5_-]+$/gi
  if (!rule.test(value)) {
    return true
  }
  return false
}
export const replaceSpace = (value:string) => {
  if (value) {
    value = value.replaceAll(' ', '')
  }
  return value
}
// a标签跳转下载
export function aTagFileDownLoad (data:any) {
  let a = document.createElement('a')
  a.href = data
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
/**
 * @description 打开新页面进行下载
 * @param { id?:string, url?:string } data  id：传id会请求此id对应的下载链接并进行下载；url：传url会直接根据url进行下载
 */
export function commonFileDownLoad (data: {id?:string, url?:string}) {
  const { id, url } = data
  let newUrl = router.resolve({ path: '/TPA/file' })
  window.open(`${newUrl.href}?id=${id}&url=${encodeURIComponent(url ? url : '')}`)
}
// 二进制流下载
export function FileDownLoadByBlob (name:string, data:Blob) {
  const filename = decodeURI(name)
  let blob = new Blob([data])
  let a = document.createElement('a')
  let url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
// 防抖
export function debounce (callback:any, delay:number) {
	let timer:any = null
	return function () {
		clearTimeout(timer)
		timer = setTimeout(() => {
			callback()
		}, delay)
	}
}
// 退出编辑的提示
export function confirmCancle () {
  const global:any = i18n.global
 const t:any = global.t
  return new Promise((resolve:any, reject:any) => {
    ElMessageBox.confirm(
      `<div class="notice-dialog-class-tipInfo">${t('shiFouQueRenTuiChu')}?</div><div class="notice-dialog-class-detail">${t('dangQianNeiRongShangWeiBaoCunTuiChuBianJiJieMianJiangBuHuiBaoCunBenCiXiuGaiDeNeiRong')}</div>`,
       t('quXiaoBianJi'),
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('shi'),
        cancelButtonText: t('fou'),
        customClass: 'customDialogCommonClass notice-dialog-class',
        customStyle: { '--dialog--header--bgcolor': '#0B53FD' },
        confirmButtonClass: 'blue-button'
      }
    ).then(() => {
      resolve('')
    }).catch(() => {
      reject(new Error())
    })
  })
}
// 导入情况说明提示
export function confirmImport (info:string) {
  const global:any = i18n.global
  const t:any = global.t
  ElMessageBox.alert(
    info,
    t('daoRuQingKuangShuoMing'),
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: t('woYiZhiXiaoJiXu'),
      customClass: 'customDialogCommonClass notice-dialog-class',
      confirmButtonClass: 'yellow-button',
      showCancelButton: true,
      cancelButtonText: t('fuZhi'),
      cancelButtonClass: 'grey-line-button',
      distinguishCancelAndClose: true,
      beforeClose: (action:any, instance, done) => {
        if (action === 'cancel') {
          copyText(info.replaceAll('<br>', '\n'))
          message(t('fuZhiChengGong'))
        } else {
          done()
        }
      }
    }
  )
}
// 复制内容到剪切板
export const copyText = (text:string) => {
  if (navigator.clipboard) {
    // clipboard api 复制
    navigator.clipboard.writeText(text)
  } else {
    let textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    // 隐藏此输入框
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'
    // 赋值
    textarea.value = text
    // 选中
    textarea.select()
    // 复制
    document.execCommand('copy', true)
    // 移除输入框
    document.body.removeChild(textarea)
  }
}
export const beforeFormDataAppendFile = (file:any) => {
  if (file) return new File([file as any], encodeURIComponent(file.name), { type: file.type })
  return ''
}
export const beforeFileNameShow = (fileName:string) => {
  return decodeURIComponent(fileName)
}
export const handleDate = (time:any) => {
  if (!time) return ['', '']
  if (Array.isArray(time)) {
    return time
  } else {
    const result = DATA_SHORTCUTS.filter(item => item.prop === time)
    return result.length > 0 ? result[0].value() : ['', '']
  }
}
export const flexColumnWidth = (textArr:string[]) => {
  let columnContent = textArr.join('')
  // 以下分配的单位长度可根据实际需求进行调整
  let flexWidth = 0
  for (const char of columnContent) {
    if ((char >= 'A' && char <= 'Z')) {
      // 如果是英文字符，为字符分配12个单位宽度
      flexWidth += 10
    } else if (['i', 'l', 'j'].indexOf(char) !== -1) {
      flexWidth += 2
    } else if (['f', 't', 'r'].indexOf(char) !== -1) {
      flexWidth += 4
    } else if ((char >= 'a' && char <= 'z')) {
      flexWidth += 8
    } else if (char >= '\u4e00' && char <= '\u9fa5') {
      flexWidth += 14
    } else if (char === '') {
      flexWidth += 2
    } else {
      flexWidth += 4
    }
  }
  // 可以再多留部分的padding
  flexWidth += textArr.length * 4 + (textArr.length - 1) * 10 + 24
  if (flexWidth < 80) {
    // 设置最小宽度
    flexWidth = 80
  }
  return flexWidth + 'px'
}
