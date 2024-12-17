export interface TreeDataType {
  [key:string]:string|number|TreeDataType[]
  id: string
  name: string
  libraryId: string
  ltcCount: number
  ctcCount: number
  parentId: string
  childrenList:TreeDataType[]
}
export interface caseTableDataType {
  createTime?: string
  createType?: number
  createUser?: string
  createUserName?: string
  ctcNum?: string
  description?: string
  folderId: string
  id: string
  linkId: null
  modifyTime?: string
  modifyUser?: null
  modifyUserName?: null
  preConditionDesc?: string
  priority: string//=====
  resetDesc?: string
  rootId: string
  sourceType?: number
  tags?: string
  templateType?: string
  testType?: string
  testcaseId: string//=====
  testcaseName: string//=====
  testcaseNumber: string//=====
  requireNumberAndId?:string
}

export interface AddOrEditTestcaseType {
  [key:string]:string
  addOrEdit :string
  testcaseInfo :string
  rootId :string
  userId :string
  ltcList :string
  ctcList :string
  deleteFiles: string
  deleteSeqFiles:string
  requires: string
  logId:string
  sourceType: string
  sourceUrl: string
}
export interface TestCaseBasicInfoType{
  [key:string]:string|number|number[]
  testcaseNumber:string
  testcaseName :string
  priority:number | string
  testType: number[],
  sourceType :number
  templateType :number
  tags :string
  description: string,
  requireNumber: string
}
export interface TestcaseInfoType {
  [key:string]:string|number
  id :string
  folderId :string
  testcaseNumber:string
  testcaseName :string
  priority:number | string
  testType :number
  sourceType :number
  templateType :number
  tags :string
  preConditionDesc :string
  resetDesc :string
  description :string
  requireNumber :string
  createType:number
}
export interface LtcModelType{
  [key:string]:string|number
  id:string
  orderNum: number
  testStep :string
  expectResult :string
}

export interface CtcValueObj {
  [key:string]: {
    hightLight: number
    value: string
  }
}
export interface CtcModelType {
  id:string
  ctcOrder: number
  ctcNum :string
  ctcValue :string
  createType :number
}
export interface CaseFilterFormType {
  [key:string]:string|string[]|number|number[]
  testType: string,
  templateType: number[],
  tags: string,
  testcaseNumber: string,
  testcaseName: string,
  createUser: string[],
  priority: number[],
  createTimeRange:string[]
  queryModel: number
}

export interface TableColumn {
  prop: string
  label: string
  rule?: string
  keyNameArr?: string[]
}

export interface TableData {
  [key:string]: any
  id: string
  step: number
}

export interface LtcDataType {
  expectResult: string
  id: string
  orderNum: number
  testStep: string
  testcaseId: string
}
export interface LtcTableDataType {
  id: string
  desc: string
  result: string
  step: number
}
export interface CtcDataType {
  createType: number
  ctcNum: string
  ctcOrder: number
  ctcValue: string
  id: string
  testcaseId: string
  ctcDesc: string
  ctcName: string
}
export interface savedFileListType {
  [key:string]:string
  createTime: string
  creator: string
  fileCategory: string
  fileId: string
  fileName: string
  filePath: string
  fileType: string
  fileUrl: string
  id: string
}

export interface CaseRequiresType {
  id: string
  requireNumber: string
  sourceType: number
  sourceUrl: string
}
