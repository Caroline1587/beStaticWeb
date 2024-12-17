import { defineStore } from 'pinia'
interface variableType {
  folderId: string
  folderName: string
  variableId:string
  variableName:string
}
interface pageInfoType {
  currentIndex:number,
  totalRecord:number
  params:any
  orderBy:string
  upAndDownBtn:boolean
}

export const routeParamsStore = defineStore('routeParams', {
  persist: {
    key: 'TPA_CASE_ROUTEPARAMS',
    storage: window.sessionStorage
  },
  state: () => {
    return {
      isRouterAlive: true,
      caseInfo: {
        caseId: '',
        caseName: '',
        viewTemplateId: '',
        projectLibraryName: '',
        projectFolderName: '',
        projectFolderId: '',
        projectFolderLevel: 0,
        resourceFolderId: '',
        resourceFolderName: '',
        resourceFolderLevel: 0,
        deleteTime: '',
        deleteUserName: '',
        associatedProject: ''
      },
      variableInfo: {
        folderId: '',
        folderName: '',
        variableId: '',
        variableName: ''
      } as variableType,
      pageInfo: {
        orderBy: '',
        upAndDownBtn: true,
        currentIndex: 0,
        totalRecord: 0,
        params: {}
      } as pageInfoType,
      filterView: {
        voidFilterViewIds: [] as string[],
        filterViewId: '',
        filterViewName: ''
      }
    }
  },
  actions: {
    routeReload () {
      this.isRouterAlive = false
      nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  getters: {}
})
