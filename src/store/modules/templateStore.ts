import { defineStore } from 'pinia'
import { getTagNamesByType } from '@/api/testcaseApi'
import { getAllProjectUserAndSystemManager } from '@/api/commonApi'
import { TESTCASE_LOG } from '@/utils/constant'
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
export const templateStore = defineStore('template', {
	state: () => {
		return {
			moduleType: '',
			leftFieldData: <filedDataType[]>[],
			rightFieldData: <filedDataType[]>[],
			selectedFiled: <filedDataType>{},
			fieldFormData: <{[key:string]:any}>{},
			allTags: <{value:string, label:string}[]>([]),
			allUsers: <{value:string, label:string}[]>([]),
			removeFileIds: <string[]>([]),
			removeSystemFileIds: <{[key:string]:string[]}>({}),
			richTextFiles: <{[key:string]:{id:string, url:string, file:File}[]}>({}),
			hasSavedRichTextFiles: <{[key:string]:{id:string, url:string, file:File}[]}>({})
		}
	},
	actions: {
		changeFieldFormData (id:string, fieldType:string, propertyName = '', defaultValue = '') {
			if (fieldType === 'file') {
				this.fieldFormData[propertyName || id] = defaultValue || []
			} else if (fieldType === 'number') {
				this.fieldFormData[propertyName || id] = defaultValue || null
			} else if (fieldType === 'singleMember') {
				this.fieldFormData[propertyName || id] = { label: '', value: '' }
			} else if (fieldType === 'multiMember') {
				this.fieldFormData[propertyName || id] = []
			} else {
				this.fieldFormData[propertyName || id] = defaultValue || ''
			}
    },
		initFieldFormData () {
			const temp = [...this.leftFieldData, ...this.rightFieldData]
			temp.forEach((item) => {
				this.changeFieldFormData(item.id, item.fieldType, item.propertyName, item.defaultValue)
			})
    },
		initCustomFieldFormData () {
			let temp = [...this.leftFieldData, ...this.rightFieldData].filter(item => item.isSystemField === 0)
			temp.forEach((item) => {
				this.changeFieldFormData(item.id, item.fieldType, '', item.defaultValue)
			})
    },
		// 自定义属性获取固定数据
		getAllTags (type:number) {
			getTagNamesByType(type).then(res => {
				this.allTags = res.data.map((item:string) => {
					return { value: item, label: item }
				})
			})
		},
		getAllGroupUser (projectId:string) {
			getAllProjectUserAndSystemManager(projectId)
			.then(res => {
				this.allUsers = res.data.uses.map((item:any) => {
          return {
            ...item,
						value: item.id,
						label: `${item.realName}(${item.username})`
          }
        })
			}).catch()
		},
		handleLeftDataStyle () {
			// 暂时无需考虑左右移动的情况。因为左右的只有用例，用例里的模板不可以移动，不可删除，隐藏不会受影响
			this.leftFieldData.forEach(item => {
				if (this.moduleType === 'supplier') {
					if (['supplierCode', 'interfacePerson', 'phone', 'email'].indexOf(item.propertyName) !== -1) {
						item.width = '50%'
					}
				} else if (this.moduleType === 'testset') {
					if (['testsetCategory', 'testsetType'].indexOf(item.propertyName) !== -1) {
						item.width = '50%'
					}
				} else if (this.moduleType === 'testcase') {
					if (['templateType', 'testType'].indexOf(item.propertyName) !== -1) {
						item.width = '33.3%'
					}
				}
				return item
			})
		}
  },
	getters: {
		allFieldData: (state) => {
      return [...state.leftFieldData, ...state.rightFieldData]
    },
		// 主要是日志需要使用
		fieldNameMap: (state) => {
			let data = [...state.leftFieldData, ...state.rightFieldData]
			let result:any = {}
			data.forEach(item => {
				result[item.propertyName || item.id] = { name: item.fieldName, fieldType: item.fieldType }
			})
      return { ...result, ...TESTCASE_LOG }
    }
	}
})
