import { testsetServer } from '@/utils/axios'

/**
 * @description 关联缺陷统计
 * @param { relateType: string, relBugId: string, relTestcaseId: string, relTestsetId: string } data
 * @returns void
 */
export function getSelectRelBugsStatistics (data: { relateType: string, relBugId?: string, relTestcaseId?: string, relTestsetId?: string }) {
  return testsetServer({
    url: '/bug/selectRelBugsStatistics',
    method: 'post',
    data
  })
}

// 缺陷
export function getBugByPageParams (data:{'pageNo':number, 'pageSize': number, 'params': string, 'orderBy': string}) {
  return testsetServer({
    url: '/bug/getBugByPageParams',
    method: 'post',
    data
  })
}
