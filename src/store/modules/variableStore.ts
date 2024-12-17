import { defineStore } from 'pinia'
import { VariableClass } from '@/utils/types/addTestcaseType'
// import { savedFileListType } from '@/utils/types/testcaseType'

export const variableStore = defineStore('test', {
  state: () => ({
    variableOptions: <VariableClass[]>[]
  }),
  actions: {},
  getters: {
    variableUnitSet: (state) => {
      let unitSet:{[key:string]:string} = {}
      state.variableOptions.forEach(item => {
        unitSet[item.variableName] = item.variableUnit
      })
      return unitSet
    }
  }
})
