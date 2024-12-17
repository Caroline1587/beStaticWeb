/** 测试集 */
import { PageInfoEmitType } from '@/utils/types/commonType'
export interface TestsetsByPageRequestData extends PageInfoEmitType{
  orderBy: string
  params?:{
    projectId: string, // 需传
    testsetName: string,
    testsetStatus: string,
    testsetType: string,
    testsetCategory: string,
    testedObjectId: string,
    testsetTags:string,
    director:string,
    createUser: string,
    createTimeBegin: string,
    createTimeEnd: string,
    queryModel: number, // 需传，1为and 2 为or
    queryParams: string, // 简单搜索的参数
    showFiledTestset: boolean// 需传，是否显示已归档的测试集 true 显示；false 不显示
  }
}
export interface TestsetResponseData{
  // testsetInfoList:{
    abnormalCtcNum: string
    abnormalLtcNum: string
    alreadyTestedCtcNum: string
    alreadyTestedLtcNum: number
    createTime: string
    createUser: string
    createUserName: string
    description: string
    director: string
    directorName: string
    executionStartTime: string
    executionStopTime: string
    failLtcNum: string
    id: string
    lastModifyTime: string
    lastModifyUser: string
    noResutlLtcNum: string
    passLtcNum: string
    projectId: string
    testEnvironment: string
    testedObjectId: string
    testedSampleName: string
    testsetCategory: number
    testsetCtcNum: number
    testsetLtcNum: number
    testsetName: string
    testsetStatus: number
    testsetTags: string
    testsetType: number
    vehiclemodelId: string
    testProgress?: number
  // }
}

export interface testsetBasicInfo extends PageInfoEmitType{
  orderBy: string
  params?:{
    projectId: string, // 需传
    testsetName: string,
    testsetStatus: string,
    testsetType: string,
    testsetCategory: string,
    testedObjectId: string,
    testsetTags:string,
    director:string,
    createUser: string,
    createTimeBegin: string,
    createTimeEnd: string,
    queryModel: number, // 需传，1为and 2 为or
    queryParams: string, // 简单搜索的参数
    showFiledTestset: boolean// 需传，是否显示已归档的测试集 true 显示；false 不显示
  }
}

export interface AddTestset{
  testsetBasicInfo:{
    id: string, // 需传
    testsetName: string,
    testsetTags: string,
    testedObjectId: string,
    testsetType: string,
    testsetCategory: string,
    projectId:string,
    description:string,
    director: string,
  }
  testcaseStructure?: {
    testcaseId: string
    ctcIdsStr: string
  }[]
  testedSampleIds?: string

}

export interface UploadFileResponse {
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

export interface UploadFileRequest{
  file: File | File[] | FormData
  isAddLog: boolean
  fileId: string
  creator: string
  fileCategory: string
}
// export interface TestsetExecutionResponse{
//   abnormalCtcNum: number
//   abnormalLtcNum: number
//   failLtcNum: number
//   noResultLtcNum: number
//   passLtcNum: number
//   testedCtcNum: number
//   testedLtcNum: number
//   testsetId: string
// }

export interface LtcListByPageRequest extends PageInfoEmitType{
  orderBy?: string
  params:{
    folderId: string
    projectId: string
    testsetId: string
    testcaseId?: string
    executionStatus?: string
    executionResult?: string
    priority?: string
    tags?: string
    testcaseNumber?: string
    testcaseName?: string
    createUser?: string
    createTimeBegin?: string
    createTimeEnd?: string
    sourceType?: string
    queryModel: number
    queryParams?: string
  }
}
export interface ctcListByPageRequest extends PageInfoEmitType{
  orderBy?: string
  params:{
    testsetId: string
    testcaseId?: string
    executionStatus?: string
    executionResult?: string
    queryParams?: string
  }
}
export interface TestcaseResultByPageRequest extends PageInfoEmitType {
  orderBy?: string
  params:{
    testcaseId?: string
  }
}

export interface StepResultList {
  stepId: string
  actualResult: string
  executionResult: string
}
export interface CtcResultList {
  ctcId: string
  executionStatus: string
  executionResult: string
  note: string
  stepResultList: StepResultList[]
}
export interface TestcaseResultList {
  testcaseId: string
  executionResult: string
  executionStatus: number
  note: string
  logPath?: string
  reportPath?: string
  ctcResultList: CtcResultList[]
  textResult?: any
}
export interface AddResultRecordRequest {
  testsetId: string
  addAttachment?: string
  testcaseResultList: TestcaseResultList[]
}
