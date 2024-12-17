import { testsetServer, caseServer } from '@/utils/axios'
import { ctcListByPageRequest, TestcaseResultByPageRequest } from '@/utils/types/testSetType'

/**
 * @description 测试用例关联测试结果分页查询
 * @param { TestcaseResultByPageRequest }  data: 请求体数据
 * 例:
 *  {
 *      pageNo: 页数
 *      pageSize: 每页数量
 *      orderBy?: 排序方式
 *      params:{
 *        testcaseId?: { string } 测试用例id
 *      }
 *  }
 * @returns void
 */

export const getSelectTestcaseResultRecordByPageParam = (data:TestcaseResultByPageRequest) => {
  return testsetServer({
    url: '/testset/selectTestcaseResultRecordByPageParam',
    method: 'post',
    data
  })
}
/**
 * @description 测试用例测试结果统计
 * @param {Type} data 请求体数据
 * 例:
 *  {
 *      testcaseId: 测试用例id
 *  }
 * @returns void
 */
export const getSelectTestcaseResultRecordStatic = (params: {testcaseId:string}) => {
  return testsetServer({
    url: '/testset/selectTestcaseResultRecordStatic',
    method: 'post',
    params
  })
}
/**
 * @description 查看测试集测试用例详情
 * @param {Type} data 请求体数据
 * 例:
 *  {
 *      testsetId: 测试集id
 *      testcaseId: 测试用例id
 *  }
 * @returns void
 */
export const queryTestsetTestcaseInfo = (data: {id:string}) => {
  return caseServer({
    url: '/testcase/getTestcaseInfo',
    method: 'get',
    params: data
  })
}

/**
 * @description 具体用例执行信息的分页查询
 * @param { ctcListByPageRequest }  data: 请求体数据
 * 例:
 *  {
 *      pageNo: 页数
 *      pageSize: 每页数量
 *      orderBy?: 排序方式
 *      params:{
 *        testsetId: { string } 测试集id
 *        testcaseId?: { string } 测试用例id
 *        executionStatus?: { string } 测试状态1待测试；2测试中；3已完成；4已终止；5异常
 *        executionResult?: { string } 测试结果1未测试；2通过；3失败；4异常；5无判断
 *        queryModel: { string } and 1 ；or 2
 *        queryParams?: { string } 简单查询参数
 *      }
 *  }
 * @returns void
 */
export function queryCtcExecutionList (data: ctcListByPageRequest) {
  return testsetServer({
    url: '/testset/queryCtcExecutionListByPageParam',
    method: 'post',
    data
  })
}
/**
 * @description 查询测试集测试用例结果记录列表
 * @param {Type} data 请求体数据
 * 例:
 *  {
 *      testsetId: 测试集id
 *      testcaseId: 测试用例id
 *  }
 * @returns void
 */
export const queryResultHistoryList = (data: {testsetId: string, testcaseId:string}) => {
  return testsetServer({
    url: '/testset/queryTestsetTestcaseResultHistoryList',
    method: 'post',
    params: data
  })
}
/**
 * @description 查询测试集测试用例结果记录详情
 * @param {Type} data 请求体数据
 * 例:
 *  {
 *      recordId: 结果记录id
 *      testcaseId: 测试用例id
 *  }
 * @returns void
 */
export const queryTestsetTestcaseResultInfo = (data: any) => {
  return testsetServer({
    url: '/testset/queryTestsetTestcaseResultInfo',
    method: 'post',
    data
  })
}
/**
 * @desc 添加执行结果
 * @param { FormData: AddResultRecordRequest } data
 * 例:
 * [
    {
        "testcaseId": "2bbea93e4e0b453093af463ed7dfe1ff", // 多个逻辑用例时此处逗号分隔，此数组只需一个item即可
        "executionResult": "2",
        "executionStatus": "3",
        "note": "测试结果备注,注意有没有更新",
        "logPath": "logPath",
        "reportPath": "reportPath",
        "ctcResultList": [
            {
                "ctcId": "37f1140d2aa54becbbabab23039089f3",
                "executionStatus": "3",
                "executionResult": "2",
                "note": "这里是CTC结果的备注",
                "stepResultList": [
                    {
                        "stepId": "cbe45e6d3d494839a600a49abb3d0b61",
                        "actualResult": "这里填实际结果",
                        "executionResult": "2"
                    }
                ]
            },
            {
                "ctcId": "7f7055313723444bbd0af3506e4720d1",
                "executionStatus": "3",
                "executionResult": "3",
                "note": "这里是第二条的结果记录",
                "stepResultList": []
            }
        ],
        "textResult": {}
    }
  ]
*/
export function addTestsetTestcaseResultRecord (data: FormData) {
  return testsetServer({
    url: '/testset/addTestsetTestcaseResultRecord',
    method: 'post',
    data
  })
}
/**
 * @description 测试用例执行信息的分页查询
 * @param { LtcListByPageRequest }  data: 请求体数据
 * 例:
 *  {
 *      pageNo: 页数
 *      pageSize: 每页数量
 *      orderBy?: 排序方式
 *      params:{
 *        folderId: { string } 文件夹ID
 *        projectId: { string } 项目ID
 *        testsetId: { string } 测试集id
 *        testcaseId?: { string } 测试用例id
 *        executionStatus?: { string } 测试状态1待测试；2测试中；3已完成；4已终止；5异常
 *        executionResult?: { string } 测试结果1未测试；2通过；3失败；4异常；5无判断
 *        priority?: { string }      优先级     1,低，2中，3高用逗号分隔
 *        tags?: { string }  标签，逗号分隔
 *        testcaseNumber?: 测试用例编号
 *        testcaseName?: { string } 测试用例名称
 *        createUser?: { string }  创建人id   用逗号分隔
 *        createTimeBegin?: { string } 开始创建时间
 *        createTimeEnd?: { string } 结束创建时间
 *        sourceType?: { string } “testcase_library”/"testcsae_project"
 *        queryModel: { string } and 1 ；or 2
 *        queryParams?: { string } 简单查询参数
 *      }
 *  }
 * @returns void
 */
export function queryTestcaseExecutionList (data: any) {
  return testsetServer({
    url: '/testset/queryTestcaseExecutionListByPageParam',
    method: 'post',
    data
  })
}

export function findProjectInfoById (data: {id:string}) {
  return testsetServer({
    url: '/project/findProjectInfoById',
    method: 'post',
    data
  })
}
export function queryTestsetAllInfo (testsetId: string) {
  return testsetServer({
    url: '/testset/queryTestsetAllInfo',
    method: 'post',
    params: { testsetId }
  })
}
/**
 * @description: 根据测试集id和测试用例id查已归档测试集的测试用例的存储的信息
 * @param {string} testsetId
 * @param {string} testcaseId
 * @return {*}
 */
export function queryFiledTestsetTestcaseInfo (testsetId: string, testcaseId:string) {
  return testsetServer({
    url: '/testset/queryFiledTestsetTestcaseInfo',
    method: 'get',
    params: { testsetId, testcaseId }
  })
}
