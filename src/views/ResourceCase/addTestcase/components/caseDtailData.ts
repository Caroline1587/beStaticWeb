import { LtcDataType, CtcDataType, TableColumn } from '@/utils/types/testcaseType'
import i18n from '@/lang'
export const getltcData = (data:LtcDataType[]) => {
  return data.map(item => {
    return {
      id: item.id,
      desc: item.testStep,
      result: item.expectResult,
      step: item.orderNum
    }
  })
}
export const getCtcData = (data:CtcDataType[]) => {
  const global:any = i18n.global
  const t:any = global.t
  // console.log(globalProperties)
  let ctcColumn:TableColumn[] = [
    { prop: 'ctcNum', label: t('bianHao'), rule: 'Number' },
    { prop: 'ctcName', label: t('mingCheng'), rule: 'String' }
  ]
  let ctcData:CtcDataType[] = data.map((item, index) => {
    let value:any = JSON.parse(item.ctcValue)
    // console.log(item.ctcValue, 'item.ctcValue')

    if (index === 0) {
      // 后端返回时顺序反了此处进行取反，保证测试步骤出的变量顺序和具体用例出的变量顺序一致
      // Object.keys(value).reverse().forEach(k => {
      //   if (k === 'ctcName' || k === 'ctcDesc') return
      //   ctcColumn.push({
      //     prop: k, label: k, rule: k
      //   })
      // })
      // 当前后端返回顺序是正确的
      Object.keys(value).forEach(k => {
        if (k === 'ctcName' || k === 'ctcDesc') return
        ctcColumn.push({
          prop: k, label: k, rule: k
        })
      })
    }
    return {
      // ...item,
      ...value,
      ctcNum: {
        value: item.ctcNum,
        hightLight: 0
      },
      ctcName: {
        value: item.ctcName,
        hightLight: 0
      },
      ctcDesc: {
        value: item.ctcDesc,
        hightLight: 0
      },
      id: item.id,
      step: item.ctcOrder
    }
  })
  ctcColumn.push({ prop: 'ctcDesc', label: t('miaoShu'), rule: 'String' })
  // console.log(ctcColumn, ctcData)
  return { ctcColumn, ctcData }
}
