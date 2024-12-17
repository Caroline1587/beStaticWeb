import type { UploadUserFile } from 'element-plus'
// 主子应用传参部分
export interface BreadListType {
  label: string,
  path: string
}
// 分页组件接收和传递的数据类型规定
export interface PageInfoPropsType {
  [key:string]:number
  pageNo: number
  pageSize: number
  totalRecord: number
  totalPage: number
}
export interface PageInfoEmitType {
  pageNo: number
  pageSize: number
}
// 表格接收的列
export interface TablePropsType {
  label: string
  prop: string
  isSystemField?:boolean|number
  fieldType?:string
  type?:string
  sortable?: boolean|'custom'
  width?:number
}
// 文件
export interface UploadFileWithId extends UploadUserFile {
  id?: string
}
// 日志
export interface LogDetailType {
  [key:string]:boolean|string
  id: string
  logId: string
  newValue: string
  oldValue: string
  propKey: string
}
export interface LogDataType {
  createTime: string
  dataId: string
  id: string
  logDetailList: LogDetailType[]
  notes: string
  operateType: string
  userId: string
}
