export interface UploadFileRaw {
  name: string
  percentage: number
  raw: File
  size: number
  status: string
  uid: number
}
export interface VariableClass {
  id: number
  variableName: string
  annotation: File
  variableCategory: number
  variableCode: string
  description: number
  folderId: number
  variableUnit: string
  variableType: number
  variableClass: string
  variableRange: string
  variableDefaultValue: string
  createUser: string
  createTime: string
  lastModifyTime: string
  lastModifyUser: string
}
