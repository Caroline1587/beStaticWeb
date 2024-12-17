<template>
 <div class="ltsContainer">
  <div class="ltsDescTable">
    <ToolbarEditor
      ref="preConditionDescRef"
      :title="t('qianZhiTiaoJian')"
      source="preConditionDesc"
      :editable="listStatus === 'view'?false:!props.disabled"
      :data="ltcInfo.preConditionDesc"
      @custom-upload="customUpload"
      @handle-text-value="handlePreDescValue" />
  </div>
  <div class="ltsDescTable">
    <RichInputTable
      v-if="props.type === 2"
      ref="teststepTableRef"
      :table-data="ltcTableData"
      :table-column="tableDataColumn"
      :editable="listStatus === 'view'?false:!props.disabled"
      table-id="testProcedure"
      class="richInputTable"
      :title="t('ceShiBuZhou')"
      @custom-upload="customUpload"
    />
    <ToolbarEditor
      v-else
      ref="teststepRef"
      source="teststepDesc"
      :title="t('ceShiBuZhou')"
      :editable="listStatus === 'view'?false:!props.disabled"
      :data="ltcInfo.testStep"
      @custom-upload="customUpload"
      @handle-text-value="handleTestStepValue"
    />
  </div>
  <div class="ltsDescTable">
    <ToolbarEditor
      v-if="props.type !== 2"
      ref="resultRef"
      source="expectResultDesc"
      :title="t('qiWangJieGuo')"
      :editable="listStatus === 'view'?false:!props.disabled"
      :data="ltcInfo.expectResult"
      @custom-upload="customUpload"
      @handle-text-value="handleExpectResultValue"
    />
  </div>
  <div class="ltsDescTable">
    <ToolbarEditor
      ref="resetDescRef"
      source="resetDesc"
      :title="t('fuWeiBuZhou')"
      :editable="listStatus === 'view'?false:!props.disabled"
      :data="ltcInfo.resetDesc"
      @custom-upload="customUpload"
      @handle-text-value="handleResetDescValue" />
  </div>
 </div>
</template>

<script lang="ts" setup>
  import { ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { TableColumn } from '@/utils/types/testcaseType'
  import { createUUID } from '@/utils/public'
  import { variableStore } from '@/store/index'
  import { cloneDeep } from 'lodash'
  import RichInputTable from '@/components/Table/RichTable.vue'
  import ToolbarEditor from '@/components/RichTextBox/ToolbarEditor.vue'
  import useVariableCheck from '@/views/VariableDictionary/operateVariable/useVariableCheck'

  const { specialCharacterRule, specialCharacterCustomRule, nameSpecialCharacterRule } = useVariableCheck()

  const router = useRouter()
  const { t } = useI18n()
  const variablestore = variableStore()
  const props = withDefaults(defineProps<{
    type:number
    disabled?:boolean
    ltcInfo:{
      preConditionDesc:string
      resetDesc:string
      testStep?:string
      expectResult?:string
    },
    ltcData?:any[]
    ctcData?: []
  }>(), {
    ltcData () {
      return []
    },
    disabled () {
      return false
    },
    ctcData () {
      return []
    }
  })
  const emits = defineEmits(['handlePreDescValue', 'handleResetDescValue', 'handleTestStepValue', 'handleExpectResultValue', 'customUpload'])
  const listStatus = ref(router.currentRoute.value.meta.status)
  const ltcTableData = ref<any[]>([])
  const resetDescRef = ref()
  const preConditionDescRef = ref()
  const teststepRef = ref()
  const resultRef = ref()
  const teststepTableRef = ref()
  const ltcInfo = computed(() => {
    return {
      preConditionDesc: props.ltcInfo.preConditionDesc,
      resetDesc: props.ltcInfo.resetDesc,
      testStep: props.ltcInfo.testStep ? props.ltcInfo.testStep : '',
      expectResult: props.ltcInfo.expectResult ? props.ltcInfo.expectResult : ''
    }
  })
  const tableDataColumn = ref([
    {
      prop: 'desc',
      label: t('buZhouMiaoShu')
    },
    {
      prop: 'result',
      label: t('yuQiJieGuo')
    }
  ])
  const handlePreDescValue = (val:string) => {
    emits('handlePreDescValue', val)
  }
  const handleResetDescValue = (val:string) => {
    emits('handleResetDescValue', val)
  }
  const handleTestStepValue = (val:string) => {
    emits('handleTestStepValue', val)
  }
  const handleExpectResultValue = (val:string) => {
    emits('handleExpectResultValue', val)
  }
  // 自定义上传
  const customUpload = (file:any) => {
    emits('customUpload', file)
  }

  const checkCustomCharacter = (variableName:string) => {
    tableDataCustomRules.value[variableName] = [
      {
        required: true,
        min: 0,
        max: 100,
        validator: specialCharacterCustomRule
      }
    ]
  }
  // 字符串校验
  const checkCharacter = (variableName:string) => {
    tableDataRules[variableName] = [
      { required: true, message: '', trigger: 'blur' },
      { min: 0, max: 100, trigger: 'blur', message: '' },
      { validator: specialCharacterRule, trigger: 'blur' }
    ]
  }
  const checkCustomPython = (value:string) => {
    let resultData = {
      result: true,
      message: ''
    }
    if (value.length === 0 || value.length > 1000) {
      resultData.result = false
      resultData.message = t('changDu_1000')
    }
    return resultData
  }
  // 数值类型校验
  const checkPython = () => {
    return (rule: any, value: any, callback: any) => {
      if (value.length === 0 || value.length > 1000) {
        callback(new Error(t('changDu_1000')))
      } else {
        callback()
      }
    }
  }
  const checkPythonCustomCharacter = (variableName:string) => {
    tableDataCustomRules.value[variableName] = [
      {
        required: true,
        validator: checkCustomPython
      }
    ]
  }
  // python校验
  const checkPythonCharacter = (variableName:string) => {
    tableDataRules[variableName] = [
      { required: true, message: '', trigger: 'change' },
      { validator: checkPython(), trigger: 'change' }
      // { min: 0, max: 100, trigger: 'blur', message: '长度0~100' }
    ]
  }
  const checkCustomNumber = (numArr:string[] | RegExpMatchArray, value:string|number) => {
    let resultData = {
      result: true,
      message: ''
    }
    // 无变量范围限制只需判断是否为数字即可
    if (numArr[0] === 'Min' && numArr[1] === 'Max') {
      if (isNaN(+value)) {
        resultData.result = false
        resultData.message = t('qingShuRuShuZi')
      }
    } else if (numArr[0] === 'Min') {
      if (!(value && +value <= +numArr[1])) {
        resultData.message = t('shuRuNumarr0numarr1', [numArr[0], numArr[1]])
        resultData.result = false
      }
    } else if (numArr[1] === 'Max') {
      if (!(value && +value >= +numArr[0])) {
        resultData.message = t('shuRuNumarr0numarr1', [numArr[0], numArr[1]])
        resultData.result = false
      }
    } else if (value && +value <= +numArr[1] && +value >= +numArr[0]) {
      // 输入框输入的是string类型的，所以此时value转换为number类型，否在就是字符串（编码）之间的比较
      resultData.message = ''
    } else {
      resultData.message = t('shuRuNumarr0numarr1', [numArr[0], numArr[1]])
      resultData.result = false
    }
    return resultData
  }
  // 数值类型校验
  const checkNumber = (numArr:string[] | RegExpMatchArray) => {
    return (rule: any, value: any, callback: any) => {
      // 无变量范围限制只需判断是否为数字即可
      if (numArr[0] === 'Min' && numArr[1] === 'Max') {
        if (!isNaN(+value)) {
          callback()
        } else {
          callback(new Error(t('qingShuRuShuZi')))
        }
      } else if (numArr[0] === 'Min') {
        if (value && +value <= +numArr[1]) {
          callback()
        } else {
          callback(new Error(t('shuRuNumarr0numarr1', [numArr[0], numArr[1]])))
        }
      } else if (numArr[1] === 'Max') {
         if (value && +value >= +numArr[0]) {
          callback()
        } else {
          callback(new Error(t('shuRuNumarr0numarr1', [numArr[0], numArr[1]])))
        }
      } else if (value && +value <= +numArr[1] && +value >= +numArr[0]) {
        // 输入框输入的是string类型的，所以此时value转换为number类型，否在就是字符串（编码）之间的比较
        callback()
      } else {
        callback(new Error(t('shuRuNumarr0numarr1', [numArr[0], numArr[1]])))
      }
    }
  }
  const checkCustomEnmuKey = (keyNameArr:string[], value:string) => {
    let resultData = {
      result: true,
      message: ''
    }
    if (keyNameArr.indexOf(value) === -1) {
      resultData.result = false
      resultData.message = t('jianMingBuFuHe')
    }
    return resultData
  }
  // 枚举类型校验
  const checkEnmuKey = (keyNameArr:string[]) => {
    return (rule: any, value: any, callback: any) => {
      if (keyNameArr.indexOf(value) > -1) {
        callback()
      } else {
        callback(new Error(t('jianMingBuFuHe')))
      }
    }
  }
  const checkCustomRepeatCtcNum = (field: any, value: any) => {
    let resultData = {
      result: true,
      message: ''
    }
    // 转为字符串类型判断长度
    let val = value + ''
    // 获取当前输入框所在数组的下标
    let ctcNumIndex = +field.match(/\[(\S*)\]/)[1]
    // console.log(ctcNumIndex, props.ctcData.find((item:any, index:number) => (item.ctcNum.value + '') === val && index !== ctcNumIndex), 'props.ctcData')
    // 若其他数据中存在相同的value则校验不通过
    if (!props.ctcData.find((item:any, index:number) => (item.ctcNum.value + '') === val && index !== ctcNumIndex)) {
      resultData.result = true
    } else {
      resultData.result = false
      resultData.message = t('bianHaoBuNengZhongFu')
    }
    return resultData
  }
  // 校验重复ctc编号
  const checkRepeatCtcNum = (rule: any, value: any, callback: any) => {
    // 转为字符串类型判断长度
    let val = value + ''
    // 获取当前输入框所在数组的下标
    let ctcNumIndex = +rule.field.match(/\[(\S*)\]/)[1]
    // console.log(ctcNumIndex, props.ctcData, 'props.ctcData')
    // 若其他数据中存在相同的value则校验不通过
    if (!props.ctcData.find((item:any, index:number) => (item.ctcNum.value + '') === val && index !== ctcNumIndex)) {
      callback()
    } else {
      callback(new Error(t('bianHaoBuNengZhongFu')))
    }
  }
  const checkCharacterCustomLength = (value:string) => {
    let resultData = {
      result: true,
      message: ''
    }
    // 判断长度，转为字符串类型判断长度
    let val = value + ''
    if (val.length > 0 && val.length <= 200) {
      resultData.result = true
    } else {
      resultData.result = false
      resultData.message = t('changDu_1200')
    }
    return resultData
  }
  // 字符长度校验，使用自定义校验原因：若只输入数字导入时判断长度会失败
  const checkCharacterLength = (rule: any, value: any, callback: any) => {
    // ctc编号判断长度，转为字符串类型判断长度
    let val = value + ''
    if (val.length > 0 && val.length <= 200) {
      callback()
    } else {
      callback(new Error(t('changDu_1200')))
    }
  }
  const checkCharacterCustomLength2 = (value:string) => {
    let resultData = {
      result: true,
      message: ''
    }
    // ctc名称判断长度
    let val = value + ''
    if (val.length > 50) {
      resultData.result = false
      resultData.message = t('changDu_050')
    }
    return resultData
  }
  const checkCharacterLength2 = (rule: any, value: any, callback: any) => {
    // ctc名称判断长度
    let val = value + ''
    if (val.length > 50) {
      callback(new Error(t('changDu_050')))
    } else {
      callback()
    }
  }
  const checkCharacterCustomLength3 = (value:string) => {
    let resultData = {
      result: true,
      message: ''
    }
    // ctc描述判断长度
    let val = value + ''
    if (val.length > 2000) {
      resultData.result = false
      resultData.message = t('changDu_02000')
    }
    return resultData
  }
  const checkCharacterLength3 = (rule: any, value: any, callback: any) => {
    // ctc描述判断长度
    let val = value + ''
    if (val.length > 2000) {
      callback(new Error(t('changDu_02000')))
    } else {
      callback()
    }
  }
  // 所有变量类型
  const variableAllObj = ['String', 'Number', 'Enum', 'Python']
  // 提取变量存放数组（具体用例表头）
  let variableList = ref<TableColumn[]>([])
  // 校验规则
  let tableDataRules = reactive<{[key:string]:any}>({
    ctcNum: [
      { required: true, message: '', trigger: 'blur' },
      { validator: checkCharacterLength, trigger: 'blur' },
      { validator: checkRepeatCtcNum, trigger: 'blur' }
    ],
    ctcName: [
      { validator: checkCharacterLength2, trigger: 'blur' }
    ],
    ctcDesc: [
      { validator: checkCharacterLength3, trigger: 'blur' }
    ]
  })
  // 校验规则--手动校验时使用
  const tableDataCustomCommonRules = () => cloneDeep({
    ctcNum: [
      {
        required: true,
        message: t('changDu_1200'),
        validator: checkCharacterCustomLength
      },
      {
        requireFiled: true,
        validator: checkCustomRepeatCtcNum
      }
    ],
    ctcName: [
      {
        message: t('changDu_050'),
        validator: checkCharacterCustomLength2
      }
    ],
    ctcDesc: [
      {
        message: t('changDu_02000'),
        validator: checkCharacterCustomLength3
      }
    ]
  })
  const tableDataCustomRules = ref<{[key:string]:any}>(tableDataCustomCommonRules())
  // 提取校验规则
  let arr:TableColumn[] = []
  const getTableDataRules = (variable:string) => {
    // 查找此变量是否是库中的变量
    let variableOtionItem = variablestore.variableOptions.find(item => item.variableName === variable)
    // 提取枚举类型的key名
    let keyNameArr:string[] = []
    if (variableOtionItem) {
      if (variableOtionItem.variableType === 0) { // 字符串类型
        checkCharacter(variable)
        checkCustomCharacter(variable)
      }
      if (variableOtionItem.variableType === 1) { // 数值类型
        // 提取最大最小值
        let tempArr = variableOtionItem.variableRange.split(';')
        let maxAndMinNumArr = [tempArr[0].split(':')[1], tempArr[1].split(':')[1]]
        // console.log(maxAndMinNumArr, 'maxAndMinNumArr')
        // 添加rule
        tableDataRules[variableOtionItem.variableName] = [
          { required: true, message: '', trigger: 'change' },
          { validator: checkNumber(maxAndMinNumArr), trigger: 'change' }
        ]
        // 手动规则添加role
        tableDataCustomRules.value[variableOtionItem.variableName] = [
          {
            required: true,
            maxAndMinNumArr,
            validator: checkCustomNumber
          }
        ]
      }
      if (variableOtionItem.variableType === 2) { // 枚举类型
        // 按;号提取多个key
        let keyStringArr = variableOtionItem.variableRange.split(';')
        keyStringArr.forEach(item => {
          if (!item) return
          // keyNameArr.push(item.split(':')[0])
          keyNameArr.push(item)
        })
        let keyNameArr2:string[] = []
        keyStringArr.forEach(item => {
          if (!item) return
          keyNameArr2.push(item.split(':')[0])
        })
        // 添加rule
        tableDataRules[variableOtionItem.variableName] = [
          { required: true, message: '', trigger: 'change' },
          { validator: checkEnmuKey(keyNameArr2), trigger: 'change' }
        ]
        // 手动规则添加role
        tableDataCustomRules.value[variableOtionItem.variableName] = [
          {
            required: true,
            keyNameArr: keyNameArr2,
            validator: checkCustomEnmuKey
          }
        ]
      }
      if (variableOtionItem.variableType === 3) { // python类型
        checkPythonCharacter(variableOtionItem.variableName)
        checkPythonCustomCharacter(variableOtionItem.variableName)
      }
    } else { // 普通本地变量使用python校验
      checkPythonCharacter(variable)
      checkPythonCustomCharacter(variable)
    }
    // 根据变量生成表头
    let rule = variableOtionItem ? variableAllObj[variableOtionItem.variableType] : 'String'
    arr.push({
      prop: variable,
      label: variable,
      rule,
      keyNameArr
    })
  }
  // 变量提取
  const variableExtract = (variable:string) => {
    // 正则匹配#号之后 </ 之前的字符，若加了g，则结果会携带#与</
    let result = variable.match(/#(\S*)<\/s/ig)
    result?.forEach((item:string) => {
      // 去除#与</
      let variable = item.slice(1, -3)
      if (variable) {
        // 根据变量生成校验规则
        getTableDataRules(variable)
      }
    })
  }
const lengthErrorVariable = ref<string[]>([])
  const characterErrorVariable = ref<string[]>([])
  const checkVariableName = (list:TableColumn[]) => {
    lengthErrorVariable.value = []
    characterErrorVariable.value = []
    let enabledvariable:TableColumn[] = []
    list.forEach(item => {
      if (item.label.length > 100) {
        lengthErrorVariable.value.push(`<i style="color:blue;word-break:break-all">${item.label}</i>`)
      } else if (!nameSpecialCharacterRule(item.label)) {
        characterErrorVariable.value.push(`<i style="color:blue;word-break:break-all">${item.label}</i>`)
      } else {
        enabledvariable.push(item)
      }
    })
    return enabledvariable
  }
  const variableDialog = () => {
    getVariableList()
    let lengthError = lengthErrorVariable.value.join('<br>')
    let characterError = characterErrorVariable.value.join('<br>')
    if (lengthError || characterError) {
      return new Promise((resolve, reject) => {
        let info = `
          ${lengthError ? `<i>${t('changDuChuCuo')}</i><br>${lengthError}<br>` : ''}
          ${characterError ? `<i>${t('teShuZiFuChuCuo')}</i><br>${characterError}<br>` : ''}
          <br>
          <i style="color:grey;font-size:12px">${t('yiShangBianLiangMingChengBuFuHeGuiFanWuFaYongYuYongLiXinXiDeBaoCunHeZhanShi')}</i>
        `
        ElMessageBox.confirm(
          info,
          t('bianLiangQingKuangShuoMing'),
          {
            dangerouslyUseHTMLString: true,
            showCancelButton: false,
            confirmButtonText: t('woZhiDaoLe'),
            customClass: 'customDialogCommonClass notice-dialog-class',
            confirmButtonClass: 'yellow-button'
          }
        ).then((e) => {
          reject(e)
        })
        .catch((e:any) => {
          reject(e)
        })
      })
    } else {
      return true
    }
  }
  const getVariableList = () => {
    let val = ltcTableData.value
    arr = []
    tableDataCustomRules.value = tableDataCustomCommonRules()
    val.forEach(item => {
      if (item.desc) {
        variableExtract(item.desc)
      }
      if (item.result) {
        variableExtract(item.result)
      }
    })
    // 去重
    let map = new Map()
    for (let variableItem of arr) {
      if (!map.has(variableItem.prop)) {
        map.set(variableItem.prop, variableItem)
      }
    }
    variableList.value = [...map.values()]
    variableList.value = checkVariableName(variableList.value)

    // 表头添加ctc编号以及名称列
    variableList.value.unshift(
      {
        prop: 'ctcNum',
        label: t('bianHao')
      },
      {
        prop: 'ctcName',
        label: t('mingCheng')
      }
    )
    // 尾部添加ctc描述列
    variableList.value.push(
      {
        prop: 'ctcDesc',
        label: t('miaoShu')
      }
    )
  }
  watch(() => props.ltcData, (val) => {
    ltcTableData.value = val
  }, { deep: true, immediate: true })
  // 获取富文本中的图片信息
  const getImageFileList = () => {
    let teststepImgList = []
    let expectResultImgList = []
    // 序列类型
    if (props.type === 2) {
      teststepImgList = teststepTableRef.value.fileList
    } else {
      teststepImgList = teststepRef.value.fileList
      expectResultImgList = resultRef.value ? resultRef.value.fileList : []
    }
    return [...preConditionDescRef.value.fileList, ...resetDescRef.value.fileList, ...teststepImgList, ...expectResultImgList]
  }
  defineExpose({
    variableList,
    ltcTableData,
    tableDataRules,
    tableDataCustomRules,
    getImageFileList,
    variableDialog,
    getVariableList
  })

  onMounted(() => {
    if (listStatus.value === 'add' && ltcTableData.value.length === 0) {
      for (let i = 1; i < 4; i++) {
        ltcTableData.value.push({
          id: createUUID(),
          desc: '',
          result: '',
          step: i
        })
      }
    }
  })
</script>
<style
  lang='scss'
  scoped
>
  .ltsContainer{
    padding: 10px 0 0!important;
  }
  .el-container{
    .ltsDescTable{
      margin-bottom:10px;
      >div{
        border: 1px solid #ccc
      }
      >span{
        width: 65px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #1F1F1F;
      }
      .richInputTable{
        width: 100%;
      }
    }
    .ltsDescTable:last-child{
      margin-bottom: 0;
    }
  }
</style>
