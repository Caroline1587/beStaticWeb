// 文件夹
export interface GetAllFoldersType {
  libraryId:string
  parentId:string
  type:string
}
export interface AddFolderType extends GetAllFoldersType {
  [key:string]:string
  name:string
}
export interface EditFolderType {
  [key:string]:string
  id:string
  name:string
}
export interface CheckFolderNameType{
  [key:string]:string
  parentId:string
  folderName:string
  rootId:string
  folderType:string
}

// 用例
export interface GetTestcaseListParamsType{
  // [key:string]:string
  queryType:number
  rootId:string
  sourceType:string|string
  parentId:string
  testcaseNumber:string
  testcaseName:string
  createUser:string
  priority:string
  testType:string
  templateType:string
  startCreateTime:string
  endCreateTime:string
  tags:string
}

export interface GetTestcaseListType{
  // [key:string]:string|number
  pageNo: number
  pageSize: number
  params:GetTestcaseListParamsType
}
export interface MoveTestcaseType{
  ids: string
  targetFolderId: string
  userId: string
}
export interface CopyTestcaseType extends MoveTestcaseType{
  sourceType:number
}
export interface CommitTestcasesType{
  ids: string
  targetFolderId: string
  targetRootId:string
  userId: string
  projectName:string
}
export interface PullTestcasesType{
  ids: string,
  targetFolderId: string,
  targetRootId: string,
  userId: string,
  isCopy: number,
  libraryName: string
}
 // 用例库
 export interface GetResourceLibraryType{
  // [key:string]:string|number
  pageNo: number
  pageSize: number
  orderBy:string
  params: string
}
export interface CheckLibraryNameType{
  // [key:string]:string|number
  libraryType: number
  libraryName: string
}
export interface AddResourceLibraryType{
  // [key:string]:string|number
  libraryType: number
  libraryName: string
  userId:string
  description:string
}
export interface EditResourceLibraryType{
  id: string
  libraryName: string
  userId:string
  description:string
}
// export interface ImportTestcaseType{
//   id: string
//   libraryName: string
//   userId:string
//   description:string
// }
// 变量
export interface GetVariableListParamsType{
  [key:string]:string|number
  variableName: string
  annotation: string
  variableUnit: string
  variableType: string
  variableDefaultValue: string
  folderId: string
  createUser: string
  createTimeBegin: string
  createTimeEnd: string
  queryModel: number
  queryParams: string
  variableClass: 1
}
export interface GetVariableListType{
  pageNo: number
  pageSize: number
  orderBy: string
  params:string
}
export interface EditVariableType {
  id: string
  variableName: string
  annotation: string
  description: string
  variableCategory: string
  variableCode: string
  variableUnit: string
  variableType: number
  variableRange: string
  variableDefaultValue: string | number
  folderId: string
  variableClass:number
}
export interface AddVariableType extends EditVariableType {
  variableClass: number
}
export interface GetlinkedProjectType {
  pageNo: number,
  pageSize: number,
  params: string,
  orderBy: string
}
