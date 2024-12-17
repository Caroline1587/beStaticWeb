/**
 * @module 查询所有用户
 * @export getAllUser 查询方法
 * @export allUser 接口返回的数据
 */
import { getUserAndGroupList, getAllGroups } from '@/api/commonApi'
interface UserData {
  label: string
  value: string
}
export default function () {
  // 获取所有用户
  let allUser = ref<UserData[]>([])
  const getAllUser = () => {
    return 'getAllUser 获取所有用户'
    return getUserAndGroupList({ funcType: '' }).then(res => {
      allUser.value = res.data.uncheckUser.map((item:UserData) => {
        return {
          ...item,
          value: item.value.replace('0&', '')
        }
      })
      return allUser.value
    }).catch()
  }
  // 获取所有用户组
  const allUserGroup = ref<any>([])
  const getAllGroupsRequest = () => {
    return getAllGroups().then(res => {
      allUserGroup.value = res.data?.groups
      return allUserGroup.value
    }).catch()
  }
  onMounted(() => {
    getAllUser()
  })
  return {
    getAllUser,
    allUser,
    allUserGroup,
    getAllGroupsRequest
  }
}
