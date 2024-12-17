import { caseServer, userServer } from '@/utils/axios'
import { GetResourceLibraryType, CheckLibraryNameType, EditResourceLibraryType } from '@/utils/types/requestType'

export function getResourceLibrary (data: GetResourceLibraryType) {
  return caseServer({
    url: '/resourceLibrary/getResourceLibraryByPageParam',
    method: 'post',
    data
  })
}

export function checkLibraryName (data: CheckLibraryNameType) {
  return caseServer({
    url: '/resourceLibrary/checkDuplicateLibraryName',
    method: 'post',
    data
  })
}

export function addResourceLibrary (data: FormData) {
  return caseServer({
    url: '/resourceLibrary/addResourceLibrary',
    method: 'post',
    data
  })
}

export function editResourceLibrary (data: EditResourceLibraryType) {
  return caseServer({
    url: '/resourceLibrary/editResourceLibrary',
    method: 'post',
    data
  })
}

export function deleteResourceLibrary (data: {id:string}) {
  return caseServer({
    url: '/resourceLibrary/deleteResourceLibrary',
    method: 'post',
    data: {
      ...data,
      libraryType: 1
    }
  })
}

export function setTestcaseLibManager (data:{ userIds: string, libraryId: string, createUser: string }) {
  return userServer({
    url: '/role/setTestcaseLibraryManager',
    method: 'post',
    data
  })
}
export function addWatchLibrary (data:{ userId: string, id: string }) {
  return caseServer({
    url: '/resourceLibrary/addWatchLibrary',
    method: 'post',
    data
  })
}
export function deleteWatchLibrary (data:{ userId: string, id: string }) {
  return caseServer({
    url: '/resourceLibrary/deleteWatchLibrary',
    method: 'post',
    data
  })
}
export function generateTestcaseByAI (data:FormData) {
  return caseServer({
    url: '/ai/generateTestcaseByAI',
    method: 'post',
    data
  })
}
