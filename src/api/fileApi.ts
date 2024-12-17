import { commonServer } from '@/utils/axios'

export function getFileList (params: { fileId: string, fileCategory:string }) {
  return commonServer({
    url: '/file/getFileListByFileIdAndCategory',
    method: 'post',
    params,
    headers: {
      FileFlag: true
    }
  })
}
export function uploadFile (data:FormData) {
  return commonServer({
    url: '/file/uploadFile',
    method: 'post',
    data
  })
}
export function downloadFile (data:{ id:string }) {
  return commonServer({
    url: '/file/downloadFile',
    method: 'post',
    responseType: 'blob',
    data
  })
}
