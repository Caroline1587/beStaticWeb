export interface caseLibFormType {
  [key:string]:string | string[]
  libraryName: string
  description: string
  // member?: string[]
}
export interface caseLibInfoType {
  [key:string]:string | number
  createTime: string
  createUser: string
  createUserName: string
  ctcNum: number
  description: string
  id: string
  libraryName: string
  libraryType: number
  ltcNum: number
  modifyTime: string
  modifyUser: string
  modifyUserName: string
}
