import { testsetServer, caseServer } from '@/utils/axios'

/**
 * @desc 根据星链跳转携带的id请求tpa项目信息
 * @param { string } asociatedId
 * @returns
 */
export function findProjectIdByAssociatedId (data:{associatedId: string}) {
  return testsetServer({
    url: '/project/findProjectIdByAssociatedId',
    method: 'post',
    data
  })
}

interface UcInfoRequestData {
  params: string
}
/**
 * @desc params内容为如下json对象
 * projectId: string
  projectCode?: string
  functionCode?: string
 */
/**
 * @desc 根据星链关联项目id请求Uc信息，用来关联需求
 * @param { UcInfoRequestData } data
 * @returns
 */
export function getUcInfo (data:UcInfoRequestData) {
  return caseServer({
    url: '/testcase/api/getStarlinkUCList',
    method: 'post',
    data
  })
}
