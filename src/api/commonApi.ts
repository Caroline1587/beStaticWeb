import { scenarioServer, authServer, userServer, commonServer, testsetServer } from '@/utils/axios'
import Storage from '@/utils/storage'
// 文件夹树形结构
export function getAllFolders (params: {libraryId:string, parentId:string, type:string, userId:string}) {
  return scenarioServer({
    url: '/folder/getAllFolders',
    method: 'get',
    params
  })
}
export function addFolder (data: FormData) {
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  data.append('creator', USERINFO.id)
  return scenarioServer({
    url: '/folder/addFolder',
    method: 'post',
    data
  })
}

export function editFolder (data: FormData) {
  return scenarioServer({
    url: '/folder/editFolder',
    method: 'post',
    data
  })
}

export function deleteFolder (data: FormData) {
  return scenarioServer({
    url: '/folder/deleteFolder',
    method: 'post',
    data
  })
}
export function checkFolderName (data: FormData) {
  return scenarioServer({
    url: '/folder/checkDuplicateFolderNameByParentId',
    method: 'post',
    data
  })
}
// 日志
export function queryLogs (params: {id:string}) {
  return scenarioServer({
    url: '/log/queryLogsByDataId',
    method: 'post',
    params
  })
}
// 获取所有用户的信息
export function getUserAndGroupList (data: { funcType: string }) {
  return "getUserAndGroupList获取所有用户信息"
  return authServer({
    url: '/scenarioRole/queryUncheckedUserAndGroup',
    method: 'post',
    data
  })
}
// 自定义属性
export function getAllGroups () {
  // 通过部门添加管理员
  return userServer({
    url: '/groupManage/getAllGroups',
    method: 'get'
  })
}
export function getDeptOrUserForGroupMember (data:{parentId: string, targetGroupId: string, deptType: 1|0}) {
  // 通过部门给用户组添加用户
  return userServer({
    url: '/deptManage/getDeptOrUserForGroupMember',
    method: 'post',
    data
  })
}
export function getGroupsByProjectId (projectId:string) {
  // 获取指定项目下的用户组
  return userServer({
    url: '/groupManage/getGroupsByProjectId',
    method: 'get',
    params: {
      projectId
    }
  })
}
export function getDeptOrProjectUser (data:{parentId: string, deptType: 1|0, projectId:string}) {
  // 获取某一项目下的部门层级以及部门下的的用户/部门
  return userServer({
    url: '/deptManage/getDeptOrProjectUser',
    method: 'post',
    data
  })
}
export function getUserForAddGroupMemberByGroup (data:{sourceGroupId: string, targetGroupId: string}) {
  // 通过其他用户组给用户组添加用户
  return userServer({
    url: '/userManage/getUserForAddGroupMemberByGroup',
    method: 'post',
    data
  })
}

export function getUserForAddGroupMemberByName (data:{name: string}) {
  // 通过搜索用户名和真实姓名添加用户
  return userServer({
    url: '/userManage/getUserAndDeptByName',
    method: 'post',
    data
  })
}
// export function getUserForAddGroupMemberByName (data:{name: string, targetGroupId: string}) {
//   // 通过搜索用户名和真实姓名添加用户
//   return userServer({
//     url: '/userManage/getUserForAddGroupMemberByName',
//     method: 'post',
//     data
//   })
// }
// 获取项目下所有用户，用户组用户，及系统管理员
export function getAllProjectUserAndSystemManager (projectId: string) {
  return userServer({
    url: '/userManage/getAllProjectUserAndSystemManager',
    method: 'get',
    params: { projectId }
  })
}
export function getGroupUser (groupId:string) {
  return userServer({
    url: '/groupManage/getGroupUser',
    method: 'post',
    data: { groupId }
  })
}
export function getCustomFieldValue (data:{dataId:string, projectId:string, viewType: string}) {
  return commonServer({
    url: '/fieldValue/getCustomFieldValue',
    method: 'post',
    data
  })
}
export function getCustomField (data:{sourceType:string, projectId:string, viewType: string}) {
  return commonServer({
    url: '/customField/getFieldByProjectAndViewType',
    method: 'post',
    data
  })
}
export function addCustomFieldValue (formData:FormData) {
  return commonServer({
    url: '/fieldValue/addCustomFieldValue',
    method: 'post',
    data: formData
  })
}
export function editCustomFieldValue (formData:FormData) {
  return commonServer({
    url: '/fieldValue/editCustomFieldValue',
    method: 'post',
    data: formData
  })
}
export function getFieldByTemplateId (id:string) {
  return commonServer({
    url: '/customField/getFieldByTemplateId',
    method: 'post',
    data: { viewTemplateId: id }
  })
}
// 缺陷过滤器
export function getFilterListByUser (data:{projectId:string, userId:string, filterType:string}) {
  return testsetServer({
    url: '/filter/getFilterListByUser',
    method: 'post',
    data
  })
}
export function addFilter (data:{filterName:string, userId:string, projectId:string, filterParam:string, filterType:string}) {
  return testsetServer({
    url: '/filter/addFilter',
    method: 'post',
    data
  })
}
export function editFilter (data:{filterName:string, id:string, filterParam:string}) {
  return testsetServer({
    url: '/filter/editFilter',
    method: 'post',
    data
  })
}

export function deleteById (id:string) {
  return testsetServer({
    url: '/filter/deleteById',
    method: 'post',
    data: { id }
  })
}

export function hiddenOrOpenFilter (data:{id:string, userId:string, projectId:string, filterType:string}) {
  return testsetServer({
    url: '/filter/hiddenOrOpenFilter',
    method: 'post',
    data
  })
}
export function setFilterDefault (data:{id:string, userId:string, projectId:string, filterType:string}) {
  return testsetServer({
    url: '/filter/setFilterDefault',
    method: 'post',
    data
  })
}
export function setFilterOrder (ids:string, filterType:string) {
  return testsetServer({
    url: '/filter/setFilterOrder',
    method: 'post',
    data: { ids, filterType }
  })
}
export function getFilterById (id:string) {
  return testsetServer({
    url: '/filter/getFilterById',
    method: 'get',
    params: { id }
  })
}
export function checkDuplicatedFilterName (data:{filerName:string, userId:string, projectId:string, filterType:string}) {
  return testsetServer({
    url: '/filter/checkDuplicatedFilterName',
    method: 'post',
    data
  })
}

/**
 * @description 获取自定义属性
 */
export const queryCustomDomain = () => {
  return commonServer({
    url: '/sysDomain/queryCustomDomain',
    method: 'post'
  })
}
