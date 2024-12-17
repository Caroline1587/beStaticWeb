import { getCustomField } from '@/api/commonApi'
import { FIELD_BACKGROUNDCOLOR } from '@/utils/constant'
// import { getCustomFieldValue, getCustomField } from '@/api/commonApi'
import { templateStore, routeParamsStore } from '@/store/index'

// 参数说明：依次为来源类型, 视图模板类型,项目id(项目特殊，因为有分类)
export default function useCustomField (sourceType:string, viewType: string, projectId = '') {
  interface filedDataType {
    [key:string]:any
    id: string,
    fieldType: string,
    fieldName: string,
    propertyName: string,
    isShow: boolean,
    isNecessary:boolean,
    isSystemField:number
  }
  const templatestore = templateStore()
  const routeparamsstore = routeParamsStore()

  let leftField:filedDataType[] = []
  let rightField:filedDataType[] = []
  /* 准备自定义字段需要的数据 */
  // 标签
  templatestore.getAllTags(viewType === 'testcase' ? 1 : 0)
  // 用户
  templatestore.getAllGroupUser(projectId)
  const getCustomFieldRequest = async () => {
    // 获取自定义字段
    let res1 = await getCustomField({ sourceType, projectId, viewType })
    res1.data.fieldList.forEach((item:any) => {
      let flag = item.isSystemField !== 0 && item.moduleType && item.moduleType.indexOf(viewType) !== -1
      let newItem = {
        ...item,
        isShow: !item.isHidden,
        isNecessary: item.isNecessary === 1,
        isSystemField: flag ? item.isSystemField : 0,
        propertyName: flag ? item.propertyName : '',
        backgroundColor: item.colorCode || FIELD_BACKGROUNDCOLOR
      }
      item.fieldLayout === 'left' ? leftField.push(newItem) : rightField.push(newItem)
    })
    routeparamsstore.caseInfo.viewTemplateId = res1.data.viewTemplateId
    templatestore.moduleType = viewType
    templatestore.leftFieldData = leftField
    templatestore.rightFieldData = rightField
    templatestore.handleLeftDataStyle()
    templatestore.initFieldFormData()
  }
  onMounted(async () => {
    await getCustomFieldRequest()
  })
  return { getCustomFieldRequest }
}
