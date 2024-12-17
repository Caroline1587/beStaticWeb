import { defineStore } from 'pinia'
import { handleDate } from '@/utils/public'

const formatData = (key:string, value:any) => {
  let text = ''
  if (key !== 'createTimeRange' && key !== 'modifyTimeRange') {
    if (Array.isArray(value)) {
      text = value.join(',')
    } else {
      text = value
    }
  }
  return text
}
export const globalParamsStore2 = defineStore('globalParams2', {
  state: () => {
    return {
      initFlag: false,
      initFlag2: false,
      initTree: false,
      showAdvanceSearch: false,
      showSearch: false,
      filterKey: '',
      queryType: 1,
      filterFormData: {} as {[key:string]:any},
      tempFilterFormData: {} as {[key:string]:any},
      showAdvanceSearch2: false,
      showSearch2: false
    }
  },
  actions: {
    changeInitFlag (level?:number) {
      if (level === 1) {
        this.initFlag2 = true
        nextTick(() => {
          this.initFlag2 = false
        })
      } else {
        this.initFlag = true
        nextTick(() => {
          this.initFlag = false
        })
      }
    },
    handledFilterFormData (allFieldData:any[]) {
      let tempObj:any = {}
      allFieldData.forEach((item:any) => {
        tempObj[item.propertyName || item.id] = {
          fieldType: item.fieldType,
          isSystemField: item.isSystemField
        }
      })
      let form = this.filterFormData
      let paramsForm:any = { customFieldList: [] }
      Object.keys(form).forEach((k) => {
        if (k !== 'createUser' && k !== 'createTimeRange') {
          let filterField:any = tempObj[k]
          let value = formatData(k, form[k])
          if (value) {
            // 自定义字段
            if (filterField.isSystemField === 0) {
              if (filterField.fieldType !== 'date') {
                paramsForm.customFieldList.push({
                  fieldType: filterField.fieldType,
                  fieldId: k,
                  value
                })
              } else {
                // 单独处理时间控件
                const customTime:any = handleDate(form[k])
                paramsForm.customFieldList.push({
                  fieldType: filterField.fieldType,
                  fieldId: k,
                  startDate: customTime[0],
                  endDate: customTime[1]
                })
              }
            } else {
              // 系统字段
              paramsForm[k] = formatData(k, form[k])
            }
          }
        }
      })
      paramsForm.queryType = this.queryType
      paramsForm.createUser = formatData('createUser', form.createUser)
      const createTime:any = handleDate(form.createTimeRange)
      paramsForm.startCreateTime = createTime[0]
      paramsForm.endCreateTime = createTime[1]
      const modifyTime:any = handleDate(form.modifyTimeRange)
      paramsForm.startModifyTime = modifyTime[0]
      paramsForm.endModifyTime = modifyTime[1]
      return paramsForm
    },
    changeInitTree () {
      this.initTree = true
      nextTick(() => {
        this.initTree = false
      })
    }
  },
  getters: {
    formNumber: (state) => {
      if (state.filterFormData) {
        let num = 0
        Object.keys(state.filterFormData).forEach((key:string) => {
          if (!state.filterFormData[key]) {
            num++
          } else if (Array.isArray(state.filterFormData[key])) {
            let arr = state.filterFormData[key] as string[]
            if (arr.length === 0) {
              num++
            } else if (arr[0] === '' && arr[1] === '') {
              num++
            }
          }
        })
       return Object.keys(state.filterFormData).length - num
      } else return 0
    }
  }
})
