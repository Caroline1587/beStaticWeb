import { commonServer } from '@/utils/axios'
// 回收站
export function repairTestcase (data: {rootId:string, ids:string, folderId:string, userId:string}) {
  return commonServer({
    url: '/recycle/repairTestcase',
    method: 'post',
    data
  })
}
export function deleteRecycleRecordsCompletely (ids:string, dataType:string) {
  return commonServer({
    url: '/recycle/deleteRecycleRecordsCompletely',
    method: 'post',
    data: { ids, dataType }
  })
}
