import { defineStore } from 'pinia'
import { handleDate } from '@/utils/public'

export const globalParamsStore = defineStore('globalParams', {
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
      // 这个字段处理任务中的特殊字段：表格/看板切换，是否展示全部任务，筛选条件等
      specialFilterFormData: {
        showType: 'board',
        showScope: 'all',
        orderBy: 'taskPrefixAndNumber'
      } as {[key:string]:any},
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
    },
    handledFilterFormData: (state) => {
      let form = state.filterFormData
      let paramsForm:any = {}
      Object.keys(form).forEach(item => {
        if (item !== 'createTimeRange') {
          if (Array.isArray(form[item])) {
            paramsForm[item] = form[item].join(',')
          } else {
            paramsForm[item] = form[item]
          }
        }
      })
      paramsForm.queryType = state.queryType
      const createTime:any = handleDate(form.createTimeRange)
      paramsForm.startCreateTime = createTime[0]
      paramsForm.endCreateTime = createTime[1]
      paramsForm.customField = []
      return paramsForm
    }
  }
})
