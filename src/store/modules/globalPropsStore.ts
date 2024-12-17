import { defineStore } from 'pinia'
export const globalPropsStore = defineStore('globalProps', {
  state: () => {
    return {
      beforeBack: <any>{},
      checkUpRole: <any>{},
      checkUpProjectRole: <any>{},
      checkUpTestcaseRole: <any>{},
      fileStore: <any>{},
      commonRouter: <any>{}
    }
  }
})
