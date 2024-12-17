export interface VariableTableDataType {
  annotation: string
  createTime: string
  createUser: string
  description: string
  folderId: string
  id: string
  lastModifyTime: string
  lastModifyUser: string
  orderBy: null
  pageNo: 0
  pageSize: 0
  params: null
  prop: string
  username: string
  variableCategory: null
  variableClass: number
  variableCode: null
  variableDefaultValue: null
  variableName: string
  variableRange: null
  variableType: string
  variableUnit: string
}
export interface MultiAddFormDataType {
  variableName: string,
  annotation: string,
  variableUnit: string,
  description: string,
  variableDefaultValue: string,
  number: {
    max: string,
    min: string
  }[],
  enum: {
    key: string,
    value: string
  }[]
}
export interface MultiAddCardDataType {
  type:number
  formData:MultiAddFormDataType
  id:number
}
export interface FilterFormType {
  [key:string]:string|string[]|number|number[]
  variableName: string
  annotation: string
  variableUnit: string
  variableType: number[]
  variableDefaultValue: string
  createUser: string[]
  createTimeRange:string[]
  queryModel:number
}
export interface VariableBasicInfoType{
  [key:string]:string
  variableName: string
  annotation: string
  variableUnit: string
  description: string
}
