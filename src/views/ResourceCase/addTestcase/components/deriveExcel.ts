import * as exceljs from 'exceljs'
import { saveAs } from 'file-saver'
import moment from 'moment'
import i18n from '@/lang'
/**
 * @desc excel 文件的导出
 * @plugin exceljs 使用此插件导入/导出excle
 * @plugin file-saver 使用此插件下载excle
 * @plugin moment 使用此插件获取日期，用来execl名称的拼接
 * @param columns 导出的表头
 * @param tableData 导出的表格内容
 * @param isParams 是否导出带参excel true：是 false：导出空参模板
 */
export const exportExcel = (tableHeader:any[], tableData:any[], isParams: boolean, type:'variable'|'ctcList') => {
  const global:any = i18n.global
 const t:any = global.t
  // 处理表头数据得到excel所需的格式
  if (type === 'ctcList') {
    let columns = tableHeader.map((item:any) => {
      return {
        ...item,
        name: item.label
      }
    })
    // 处理表格数据得到excel所需的格式
    let rows:any[] = []
    let rowsInfo:any[] = []
    // 携带参数才会进行表格内容数据处理
    if (isParams) {
      tableData.forEach((rowItem:any) => {
        let row:any[] = []
        let rowInfo:any[] = []
        columns.forEach((headerItem:any) => {
          console.log(rowItem[headerItem.name])
          if (headerItem.name === t('bianHao')) { // 表头编号对应的key为ctcNum
            row.push(rowItem.ctcNum.value)
            rowInfo.push(rowItem.ctcNum)
          } else if (headerItem.name === t('mingCheng')) { // 表头名称对应的key为ctcName
            row.push(rowItem.ctcName.value)
            rowInfo.push(rowItem.ctcName)
          } else if (headerItem.name === t('miaoShu')) { // 表头描述对应的key为ctcDesc
            row.push(rowItem.ctcDesc.value)
            rowInfo.push(rowItem.ctcDesc)
          } else {
            row.push(rowItem[headerItem.name].value)
            let rowObj = { ...rowItem[headerItem.name] }
            // 若是枚举类型 则将下拉框选择项保存至此
            if (headerItem.rule === 'Enum') rowObj.keyNameArr = headerItem.keyNameArr
            rowInfo.push(rowObj)
          }
        })
        rowsInfo.push(rowInfo)
        rows.push(row)
      })
    } else {
      // rows.push([])
      // 空模板默认添加2行
      for (let i = 0; i < 2; i++) {
        let row:any[] = []
        let rowInfo:any[] = []
        columns.forEach((headerItem:any) => {
          if (headerItem.name === t('bianHao')) {
            row.push('')
            rowInfo.push({})
          } else {
            row.push('')
            // rowInfo.push({})
            let rowObj:any = {}
            // 若是枚举类型 则将下拉框选择项保存至此
            if (headerItem.rule === 'Enum') rowObj.keyNameArr = headerItem.keyNameArr
            rowInfo.push(rowObj)
          }
        })
        rowsInfo.push(rowInfo)
        rows.push(row)
      }
    }
    // console.log(rows, 'rows')
    // 引入 exceljs，自己灵活引入
    let excel = new exceljs.Workbook()
    let monthSheet = excel.addWorksheet('Sheet')
    monthSheet.addTable({
      name: 'xxx',
      // 插入到多少行，自己设置
      ref: 'A1',
      style: {
        // 风格
        theme: 'TableStyleLight11'
      },
      columns,
      // 表体的内容，与表头顺序对应
      rows
    })
    // 遍历表头设置样式
    columns.forEach((item, i) => {
      // 设置样式，更多样式去看文档
      let width = 30
      // switch (i) {
      //   case 0:
      //     width = 5
      //     break
      //   case 1:
      //     width = 60
      //     break
      //   case 2:
      //     width = 10
      //     break
      //   case 3:
      //     width = 10
      //     break
      //   case 4:
      //     width = 20
      //     break
      //   default:
      //     break
      // }
      monthSheet.getColumn(i + 1).width = width
      monthSheet.getColumn(i + 1).alignment = {
        // vertical: 'middle',
        horizontal: 'left'
      }
    })
    // 遍历单元格设置样式
    // if (isParams) {
      rowsInfo.forEach((rowsItem, i) => {
        // console.log(rowsItem, 'item')
        //  i + 2 跳过首行（表头），取excel当前行的所有列信息
        let row = monthSheet.getRow(i + 2)
        // console.log(row, 'getRows')
        // 遍历每一列判断是否需要高亮显示
        rowsItem.forEach((cellItem:any, index:number) => {
          // 取excel对应的列并为其设置样式
          // console.log(row.getCell(index + 1), index + 1)
          // hightLight 1：高亮，0：不高亮
          if (cellItem.hightLight) {
            row.getCell(index + 1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF00' },
              bgColor: { argb: 'FFFF00' }
            }
          }
          // 设置枚举类型的单元格为下拉单元格
          if (cellItem.keyNameArr) {
            let valueList = cellItem.keyNameArr.map((item:string) => {
              return item.split(':')[0]
            })
            // console.log(valueList, 'cellItem.keyNameArr')
            row.getCell(index + 1).dataValidation = {
              type: 'list',
              allowBlank: true,
              formulae: [`"${valueList.join(',')}"`]
            }
          }
        })
      })
    // }
    // console.log(monthSheet, 'monthSheet')
    // 下载excel
    excel.xlsx.writeBuffer().then(buffer => {
      let excelName = `CTS_LIST_${moment().format('YYYY_MM_DD_hhmmss')}.xlsx`
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        excelName
      )
    })
  } else if (type === 'variable') {
    let columns = tableHeader.map((item:any) => {
      return {
        name: item.label
      }
    })
    let excel = new exceljs.Workbook()
    let monthSheet = excel.addWorksheet(t('bianLiangLieBiao'))
    monthSheet.addTable({
      name: 'xxx',
      // 插入到多少行，自己设置
      ref: 'A1',
      style: {
        // 风格
        theme: 'TableStyleMedium22'
      },
      columns,
      // 表体的内容，与表头顺序对应
      rows: [[]]
    })
    // 遍历表头设置样式
    columns.forEach((item, i) => {
      // 设置样式，更多样式去看文档
      let width = 40
      monthSheet.getColumn(i + 1).width = width
      monthSheet.getColumn(i + 1).alignment = {
        horizontal: 'left'
      }
    })
    // 下载excel
    excel.xlsx.writeBuffer().then(buffer => {
      let excelName = `VARIABLE_LIST_${moment().format('YYYY_MM_DD_hhmmss')}.xlsx`
      saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        excelName
      )
    })
  }
}
