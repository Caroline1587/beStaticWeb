import { VariableClass } from '@/utils/types/addTestcaseType'
import { savedFileListType } from '@/utils/types/testcaseType'

// 删除不必要的html结构
export const deleteTextHtml = (text:string, savedFileList:savedFileListType[]) => {
  if (text) {
    // 去掉开头结尾的换行符
    text = text.replace(/(^(<p><br><\/p>))+|((<p><br><\/p>)+$)/gi, '')
    text = deleteImageHtml(text, savedFileList)
    // 保存a标签和img标签数据
    let arr = text.match(/<a[\s\S]+a>|<img[^>]+>/g)
    arr?.forEach(item => {
      let w = ''
      w = item.replace(/</g, '《').replace(/>/g, '》')
      text = text.replace(item, w)
    })
    // 替换所有的标签,首先用换行符替换</p></p>,然后清空标签，最后替换空格
    let result = text.replace(/<p><br><\/p>/g, '\n').replace(/<\/p><p>/g, '\n').replace(/<\/p>(\n+)<p>/g, '$1\n').replace(/<br>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
    // 还原a标签和img标签
    arr = result.match(/《a[\s\S]+a》|《img[^》]+》/g)
    arr?.forEach(item => {
      let w = ''
      w = item.replace(/《/g, '<').replace(/》/g, '>')
      result = result.replace(item, w)
    })
    return result
  } else {
    return ''
  }
}
// 处理已保存过的图片路径和id转换
export const deleteImageHtml = (text:string, savedFileList:savedFileListType[]) => {
  // 处理img标签数据
  let arr = text.match(/<img[^>]+>/g)
  arr?.forEach(item => {
    let httpArr = item.match(/\bsrc\b\s*=\s*['"]?([^'"]*)['"]?/i)
    if (httpArr) {
      let value = httpArr[1]
      let tempFile = savedFileList.find(item => item.fileUrl === value)
      if (tempFile) {
        text = text.replace(value, tempFile.id)
      }
    }
  })
  return text
}
export const formatTextHtml = (text:string, variableOptions:VariableClass[], fileList:{[key:string]:string}) => {
  let textResult = ''
  textResult = formatVariableHtml(text, variableOptions)
  textResult = formatImageHtml(textResult, fileList)
  return `<p>${textResult}</p>`
}
// 处理图片展示为HTML
export const formatImageHtml = (text:string, fileList:{[key:string]:string}) => {
  if (text) {
    let arr = text.match(/<img[^>]+>/g)
    arr?.forEach(item => {
      let a = item.match(/\bsrc\b\s*=\s*['"]?([^'"]*)['"]?/i)
      if (a) {
        text = text.replace(a[1], fileList[a[1]] ? fileList[a[1]] : '')
      }
    })
  } else {
    text = ''
  }
  return text
}
  // 处理变量展示为HTML
  export const formatVariableHtml = (text:string, variableOptions:VariableClass[]) => {
    if (text) {
      let arr = text?.match(/#[^#\s]* /g)
      if (arr) {
        arr?.forEach((str:any) => {
          if (!str.includes('<img') && !str.includes('<a')) {
            let color = 'red'
            if (checkVariable(str.trim(), variableOptions)) color = 'blue'
            text = text.replace(str, `<span style="color:${color}">${str.trim()}</span> `)
          }
        })
      }
    } else {
      text = ''
    }
    let result = text.replace(/\n/g, '</p><p>')
    return result
  }
  // 判断是否是库中存在的变量
  export const checkVariable = (text:string, variableOptions:VariableClass[]) => {
    // 传来的text会包含 # 号 但是库中存的不会包含#
    let variable = text.split('#')[1]
    let variableOtionItem = variableOptions.find(item => item.variableName === variable)
    if (variableOtionItem) return variableOtionItem
  }
