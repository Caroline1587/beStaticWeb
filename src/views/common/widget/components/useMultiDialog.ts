import { getGroupsByProjectId, getDeptOrProjectUser, getUserForAddGroupMemberByGroup, getAllProjectUserAndSystemManager } from '@/api/commonApi'
import { templateStore } from '@/store/index'
import Storage from '@/utils/storage'
export default function useMultiDialog () {
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const { t } = useI18n()
  const memberValue = ref('')
  const fieldName = ref('')
  const templatestore = templateStore()
  const oldData = computed(() => {
    return memberValue.value ? memberValue.value.split(',') : []
  })
  let widgetId = ''
  const showDialog = (id:string, name:string, tagValue = '') => {
    memberValue.value = tagValue
    fieldName.value = name
    widgetId = id
    multiDialogRef.value.showDialog()
    getFilterUser('')
  }
  const multiDialogRef = ref()
  const treeData = ref<any[]>([])
  const currentType = ref('')
  const handleUserData = (data:any[]) => {
    let myself:any = null
    let tempData = data.filter((item:any) => {
      item.isGroupMember = memberValue.value.indexOf(item.id) !== -1 ? 1 : 0
      item.name = item.realName
      item.number = -1
      item.hasNextLevel = false
      let flag = item.id === USERINFO.id
      if (flag) {
        item.myself = true
        myself = item
      }
      return !flag
    })
    return myself ? [myself, ...tempData] : tempData
  }
  // 用户组
  const getAllGroupsInfo = () => {
    getGroupsByProjectId(currentDataId).then(res => {
      treeData.value = res.data.groups.map((item:any) => {
        let number = item.userIds ? item.userIds.split(',').length : 0
        item.name = item.groupName
        item.number = number
        item.hasNextLevel = true
        return item
      })
    }).catch()
  }
  const toGroupsLevel = (isRoot:boolean, data:any) => {
    if (isRoot) {
      getAllGroupsInfo()
    } else {
      let params = {
        sourceGroupId: data.id,
        targetGroupId: ''
      }
      getUserForAddGroupMemberByGroup(params).then(res => {
        treeData.value = handleUserData(res.data.uses)
      }).catch()
    }
  }
  // 部门
  const toDeptsLevel = (isRoot:any, data?:any) => {
    let params = {
      parentId: isRoot ? '1' : data.id,
      deptType: isRoot ? '0' : data.deptType,
      projectId: currentDataId
    }
    getDeptOrProjectUser(params).then(res => {
      if (params.deptType === '0') {
        treeData.value = res.data.depts.map((item:any) => {
          let number = item.userIds ? item.userIds.split(',').length : 0
          item.name = item.deptName
          item.number = number
          item.hasNextLevel = true
          return item
        })
      } else {
        // 获取用户层级
        treeData.value = handleUserData(res.data.users)
      }
    }).catch()
  }
  // 面包屑点击事件
  const toLevel = (isRoot:any, data:any) => {
    if (currentType.value === t('buMen')) {
      toDeptsLevel(isRoot, data)
    } else if (currentType.value === t('yongHuZu')) {
      toGroupsLevel(isRoot, data)
    }
  }
  // 查找方式切换事件
  const typeChange = (label:string) => {
    currentType.value = label
    if (label === t('buMen')) {
      toDeptsLevel(true)
    } else if (label === t('yongHuZu')) {
      getAllGroupsInfo()
    }
  }
  // 按钮事件
  const confim = (checkedIdsArr:string[]) => {
    const result = checkedIdsArr.join(',')
    templatestore.fieldFormData[widgetId] = userOptions.value.filter((item:any) => result.indexOf(item.id) !== -1)
    multiDialogRef.value.closeDialog()
  }
  // 用户筛选
  const userOptions = ref<any[]>([])
  const getFilterUser = async (filterDeptKey = '') => {
    const res = await getAllProjectUserAndSystemManager(currentDataId)
    const info = res.data.uses.filter((item:any) => item.username.indexOf(filterDeptKey) !== -1 || item.realName.indexOf(filterDeptKey) !== -1)
    userOptions.value = handleUserData(info)
  }
  onMounted(() => {
    getFilterUser()
  })
  return {
    multiDialogRef,
    treeData,
    oldData,
    userOptions,
    fieldName,
    showDialog,
    toLevel,
    typeChange,
    confim,
    getFilterUser
  }
}
