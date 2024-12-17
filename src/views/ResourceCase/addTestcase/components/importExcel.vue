<template>
  <el-upload
    ref="ulpoadRef"
    class="importUpload"
    :auto-upload="false"
    accept=".xlsx, .xls"
    :limit="1"
    :on-change="uploadChangeHandle"
  >
    <el-button class="blue-liner-button fileBtn">{{ t('xuanZeWenJian') }}</el-button>
  </el-upload>
</template>
<script setup lang="ts">
import * as Excel from 'exceljs'
import { UploadFileRaw } from '@/utils/types/addTestcaseType'
import { TableColumn } from '@/utils/types/testcaseType'
import { warningMessage } from '@/utils/message'
const { t } = useI18n()

const $emits = defineEmits(['onSuccess'])
const $props = withDefaults(defineProps<{
    tableColumn: TableColumn[]
  }>(), {
    tableColumn () {
      return []
    }
  })
let ulpoadRef = ref()

const loadExcelFile = async (file:File) => {
  const wb = new Excel.Workbook()
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  await new Promise((resolve, reject) => {
    reader.onload = () => {
      const buffer = reader.result
      wb.xlsx.load(buffer as ArrayBuffer).then((workbook:any) => {
        // let workbookData = []
        // excel 导入后返回的第一页 数据数组
        const worksheet = workbook.getWorksheet(1)
        // console.log(worksheet, 'worksheet')
        // 第一页没数据直接返回
        if (!worksheet) {
          warningMessage(t('qingQueBaoExcelWenJianDiYiYeCunZaiShuJu'))
          ulpoadRef.value.clearFiles()
          return
        }
        // worksheet.getSheetValues() // 获取每一行的数据但是没样式
        // 表格头部
        let header:any[] = []
        // 表格内容数据
        let excleTable:any[] = []
        // 筛选为空的数据（表格前几行可能为空，此时会影响下边头部数据的提取）
        worksheet._rows = worksheet._rows.filter((item:any) => item)
        // console.log(worksheet._rows[0]._cells.length, 'worksheet._rows.length', $props.tableColumn.length)
        // 导入的列数不对 直接返回
        if (worksheet._rows[0]._cells.length !== $props.tableColumn.length) {
          warningMessage(t('biaoTouMingChengBuDuiYingQingZhongXinDaoRu'))
          ulpoadRef.value.clearFiles()
          return
        }
        // 记录描述列的地址
        let descCellCol = ''
        for (let i = 0; i < worksheet._rows.length; i++) {
          // 表格头部取excel第一行数据即可
          if (i === 0) {
            // 若存在表头名称为空的情况
            if (worksheet._rows[i]._cells.length !== worksheet._rows[i]._cells.filter((item:any) => item).length) {
              warningMessage(t('biaoTouMingChengBuNengWeiKong'))
              reject(new Error(t('ruoCunZaiBiaoTouMingChengWeiKongDeQingKuang')))
              ulpoadRef.value.clearFiles()
              return
            }
            let headerList:string[] = []
            worksheet._rows[i]._cells.forEach((cell:any) => {
              headerList.push(cell._value.value)
              // 表头 编号 对应的prop为 ctcNum
              header.push(cell._value.value === t('bianHao') ? 'ctcNum' : cell._value.value === t('mingCheng') ? 'ctcName' : cell._value.value === t('miaoShu') ? 'ctcDesc' : cell._value.value)
              // 记录描述列的地址: 描述列不是必填项，方便后续非空判断
              if (cell.value === t('miaoShu')) descCellCol = cell.col
            })
            // console.log($props.tableColumn, 'xxx')
            for (let i = 0; i < $props.tableColumn.length; i++) {
              if ($props.tableColumn[i].label !== t('bianHao') && !headerList.find(item => item === $props.tableColumn[i].label)) {
                warningMessage(t('biaoTouMingChengBuDuiYingQingZhongXinDaoRu'))
                reject(new Error(t('biaoTouMingChengBuDuiYingQingZhongXinDaoRu')))
                ulpoadRef.value.clearFiles()
                return
              }
            }
          } else {
            // 定义每一行的数据 object
            let excelCellObject:any = {}
            // 遍历当前行的列
            let _cells = Array.from(worksheet._rows[i]._cells)
            // 列数长度是否相等, 长度不相同时代表有空数据
            const isLengthEquality = _cells.length !== $props.tableColumn.length
            // 描述列是否有数据，描述列可为空，暂不考虑其他变量可为空情况
            const isDescCellEmpty = _cells.find((item:any) => item.col === descCellCol)
            // 不存在描述列时，cell长度加1是否和表头长度一致
            const isCellEqualityHeaderLength = !isDescCellEmpty ? _cells.length + 1 !== $props.tableColumn.length : isLengthEquality
            // 存在空数据时进行提示并返回
            if (isCellEqualityHeaderLength) {
              warningMessage(t('diitiaoYongLiZhongCunZaiKongShuJuQingJinHangTianXie', [i]))
              ulpoadRef.value.clearFiles()
              return
            }
            for (let j = 0; j < _cells.length; j++) {
              let cell = _cells[j] as any
              // console.log(cell, 'cell')
              if (!cell) {
                warningMessage(t('diitiaoYongLiZhongCunZaiKongShuJuQingJinHangTianXie', [i]))
                ulpoadRef.value.clearFiles()
                return
              }
              let bgColorIndex = cell._row._cells[j].style?.fill?.bgColor?.indexed // 背景色
              // 若单元格内的字体有不同的样式，则会被解析成数组，此处进行处理
              let cellValue = ''
              if (cell._value.value?.richText) {
                cell._value.value?.richText.forEach((item:any) => {
                  cellValue += item.text
                })
              } else {
                cellValue = cell._value.value
              }
              // 将每一列的数据根据index下标和表头各个属性关联在一起
              excelCellObject[header[j]] = {
                value: cellValue, // 名称
                hightLight: bgColorIndex === 64 ? 1 : 0 // 是否高亮，1：高亮，0：不高亮 微软设置背景色填充黄色后id为64，此处便判断这个id
              }
            }
            // Array.from(worksheet._rows[i]._cells).forEach((cell:any, index:number) => {
            //   if (!cell) {
            //     warningMessage(`第${i}条用例中存在空数据，请进行填写`)
            //     return
            //   }
            //   let bgColorIndex = cell._row._cells[index].style?.fill?.bgColor?.indexed // 背景色
            //   // 将每一列的数据根据index下标和表头各个属性关联在一起
            //   excelCellObject[header[index]] = {
            //     value: cell._value.value, // 名称
            //     hightLight: bgColorIndex === 64 ? 1 : 0 // 是否高亮，1：高亮，0：不高亮 微软设置背景色填充黄色后id为64，此处便判断这个id
            //   }
            // })
            // console.log(excleTable, 'excleTable', excelCellObject, 'excelCellObject')

            // console.log(excleTable.find(item => item.ctcNum?.value === excelCellObject.ctcNum?.value), 'excleTable.find(item => item.ctcNum.value === excelCellObject.ctcNum.value)')
            // 查找编号是否重复
            if (excleTable.find(item => item.ctcNum.value === excelCellObject.ctcNum.value)) {
              warningMessage(t('bianHaoBuNengZhongFuQingZhongXinDaoRu'))
              reject(new Error(t('bianHaoBuNengZhongFuQingZhongXinDaoRu')))
              ulpoadRef.value.clearFiles()
            }
            excleTable.push(excelCellObject)
          }
        }
        // console.log($props.tableColumn, 'tableColumn')
        if (excleTable.length === 0) {
          warningMessage(t('shuJuWeiKongQingZhongXinDaoRu'))
          ulpoadRef.value.clearFiles()
          return
        }
        $emits('onSuccess', { header, excleTable })
        resolve(true)
      })
    }
  })
}
const uploadChangeHandle = (file:UploadFileRaw) => {
  // console.log('rawFile', file.raw.type)
  // 获取文件后缀
  let filetType = file.name.substring(file.name.lastIndexOf('.') + 1)
  // 校验上传文件格式
  if (!['xlsx', 'xls'].includes(filetType)) {
    ulpoadRef.value.clearFiles()
    warningMessage(t('zhiNengShangChuanGeShiWeiXlsxxlsGeShiDeWenJian'))
    return
  }
  loadExcelFile(file.raw)
}

defineExpose({
  ulpoadRef
})

</script>
