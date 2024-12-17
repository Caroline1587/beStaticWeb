  import { errorMessage, message } from '@/utils/message'
  import { caseTableDataType } from '@/utils/types/testcaseType'
  import { getAllCaseLibrary, getTestcaseAndIds, exportTestcase, pullTestcases, commitTestcases, exportTestcaseTemplate } from '@/api/testcaseApi'
  import { getVariableList, exportVariables } from '@/api/variableApi'
  import { CommitTestcasesType, PullTestcasesType, GetVariableListParamsType } from '@/utils/types/requestType'
  import { getAllFolders } from '@/api/commonApi'
  import { PageInfoPropsType, PageInfoEmitType } from '@/utils/types/commonType'
  import { globalParamsStore, globalPropsStore } from '@/store/index'
  import Storage from '@/utils/storage'
  import { initLocalInfo } from '@/views/common/useLocalInfo'
  import { useI18n } from 'vue-i18n'

  // 参数含义：根节点id，测试类型，容器名称，左侧树形是否需要下拉单选处理
  export default function (rootId:string, hooktype:'testcase_library'|'testcase_project'|'variable_TPA', containerRef:any) {
    const { t } = useI18n()
    const USERINFO = Storage.sessionGet('TPA_COMMON_USER')?.userInfo
    const listName = hooktype === 'variable_TPA' ? 'variableList' : `${hooktype}List`
    const globalparamsstore = globalParamsStore()
    const globalPropsstore = globalPropsStore()
    /* --------------------公共数据和处理方法-------------------- */
    interface selectOptionType {
      id:string
      name:string
    }
    // 数据初始化
    const initData = () => {
      globalparamsstore.filterKey = ''
      globalparamsstore.showSearch = false
      globalparamsstore.showSearch2 = false
      globalparamsstore.showAdvanceSearch = false
      globalparamsstore.showAdvanceSearch2 = false
      globalparamsstore.filterFormData = {}
      globalparamsstore.tempFilterFormData = {}
      globalparamsstore.queryType = 1
    }
    // 数据重置
    const resetData = () => {
      allSelectId.value = {}
      leftTreeRootId = rootId
      leftSelectValue.value = ''
      pageInfo.value = {
        pageNo: 1,
        pageSize: 20,
        totalPage: 0,
        totalRecord: 0
      }
      containerRef.value.leftTreeRef.treeRef.setCheckedKeys([])
      globalparamsstore.tempFilterFormData = {}
      initLocalInfo(listName)
    }
    // 公共的数据获取方法
    const getAllLibPromise = () => {
      return new Promise((resolve, reject) => {
        getAllCaseLibrary({ libraryType: 1, userId: USERINFO?.id }).then(res => {
          let tempOptions:selectOptionType[] = []
          res.data.forEach((item:any) => {
            tempOptions.push({
              id: item.id,
              name: item.libraryName
            })
          })
          resolve(tempOptions)
        }).catch(e => {
          reject(e)
        })
      })
    }
    const getAllFoldersPromise = (libraryId:string) => {
      return new Promise((resolve, reject) => {
        getAllFolders({
          libraryId,
          parentId: '',
          type: 'testcase_library',
          userId: USERINFO?.id
        }).then((res:any) => {
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    }
    /* --------------------左侧树形以及下拉单选框部分----------------- */
    let leftTreeNodeId = ''
    let leftTreeRootId = rootId
    let leftTreeNodeLevel = 0
    // 左侧树形节点被点击时触发的事件
    const leftTreeNodeClick = (id:string, level:number) => {
      leftTreeNodeId = id
      leftTreeNodeLevel = level - 1
      getTableData()
    }
    // 左侧节点复选框被选中时触发的事件
    const checkChange = (data:any, status:any) => {
      let label = hooktype === 'variable_TPA' ? 'totalCount' : 'ltcCount'
      if (data[label] === 0) {
        setTreeNodeChecked2(data, label)
      } else {
        let node = containerRef.value.leftTreeRef.treeRef.getNode(data.id)
        let promise = getNodeAllIds(data.id, node.level)
        console.log('getNodeAllIds==',getNodeAllIds);//=====
        
        promise.then(list => {
          // 处理当前节点下ids
          let folderAllIds = list as string[]
          setTreeNodeChecked1(data, status.checkedKeys.includes(data.id), folderAllIds, label)
        })
      }
    }
    // 左侧下拉单选功能相关
    const leftSelectValue = ref('')
    const leftSelectOptions = ref<selectOptionType[]>([])
    // 获取左侧下拉框中的数据
    const getLeftSelectOption = () => {
      let promise = getAllLibPromise()
      promise.then((options:any) => {
        leftSelectOptions.value = options as selectOptionType[]
        // 获取到下拉数据后初始化树形数据
        console.log("  // 获取左侧下拉框中的数据");
        
        leftSelectValue.value = leftSelectOptions.value[0].id
        getLeftTreeData(leftSelectOptions.value[0].id)
      })
    }
    // 根据select组件数据获取左侧树形组件中的数据
    const leftTreeData = ref<any[]>([])
    const getLeftTreeData = (libraryId:string) => {
      let promise = getAllFoldersPromise(libraryId)
      promise.then((res:any) => {
        leftTreeData.value = res.data.result
        nextTick(() => {
          leftTreeRootId = leftTreeData.value[0]?.id
          // 获取新树形数据后都需要初始化，保持第一个节点的选中状态和表格数据初始化
          containerRef.value.leftTreeRef.treeRef.setCurrentKey(leftTreeData.value[0]?.id)
          getTableData()
        })
      })
    }
    /* --------------------右侧树形以及下拉框部分----------------- */
    let rightTreeNodeId = ''
    let rightTreeRootId = ''
    const rightTreeData = ref<any[]>([])
    // 右侧树形节点被点击时触发的事件
    const rightTreeNodeClick = (id:string) => {
      rightTreeNodeId = id
    }
     // 右侧下拉单选功能相关
    let rightSelectValue = ref('')
    const rightSelectOptions = ref<{id:string, name:string}[]>([])
    // 获取右侧下拉框中的数据
    // const getRightSelectOption = () => {
    //   let promise = getAllLibPromise()
    //   promise.then((options:any) => {
    //     rightSelectOptions.value = options as selectOptionType[]
    //     // 获取到下拉数据后初始化树形数据
    //     getRightTreeData(rightSelectOptions.value[0].id)
    //   })
    // }
    // 根据右侧select数据获取右侧树形数据
    // const getRightTreeData = (libraryId:string) => {
    //   rightSelectValue.value = libraryId
    //   let promise = getAllFoldersPromise(libraryId)
    //   promise.then((res:any) => {
    //     rightTreeData.value = res.data.result
    //     nextTick(() => {
    //       rightTreeRootId = rightTreeData.value[0]?.id
    //       rightTreeNodeId = rightTreeRootId
    //       // 获取新树形数据后都需要初始化，保持第一个节点的选中状态和表格数据初始化
    //       containerRef.value.rightTreeRef.setCurrentKey(rightTreeData.value[0]?.id)
    //     })
    //   })
    // }
    /* --------------------中间表格部分-------------------------- */
    watch(() => globalparamsstore.initFlag2, newValue => {
      if (newValue) {
        getTableData()
      }
    })
    // 根据不同页面调用不同的数据获取方法
    const tableLoading = ref(false)
    const getTableData = () => {
      tableLoading.value = true
      // if (hooktype === 'variable_TPA') {
      //   // getVariable()
      // } else 
      // {
        getTestcaseList()
      // }
    }
    // 分页数据
    const pageInfo = ref<PageInfoPropsType>({
      pageNo: 1,
      pageSize: 20,
      totalPage: 0,
      totalRecord: 0
    })
    const changePageInfo = (page:PageInfoEmitType) => {
      pageInfo.value.pageNo = page.pageNo
      pageInfo.value.pageSize = page.pageSize
      getTableData()
    }
    // 表格数据获取,表格数据中涉及到的tree数据都是左侧树形中的数据
    let sourceType = hooktype
    const tableData = ref<caseTableDataType[]>([])
    const getTestcaseList = () => {
      let params:any = {
        rootId: leftTreeRootId,
        sourceType,
        parentId: leftTreeNodeId === leftTreeRootId ? '' : leftTreeNodeId,
        userId: USERINFO?.id,
        folderLevel: leftTreeNodeLevel ? leftTreeNodeLevel : 0
      }
      if (globalparamsstore.filterKey) {
        params = {
          ...params,
          testcaseNumber: globalparamsstore.filterKey,
          testcaseName: globalparamsstore.filterKey,
          queryType: 2
        }
      } else {
        params = { ...params, ...globalparamsstore.handledFilterFormData }
      }
      let p = {
        pageNo: pageInfo.value.pageNo,
        pageSize: pageInfo.value.pageSize,
        params: JSON.stringify(params)
      }
      // getTestcaseAndIds(p).then(res => {

      //   tableData.value = res.data.pageBean.resultList
      //   pageInfo.value.totalRecord = res.data.pageBean.totalRecord
      //   tableLoading.value = false
      // }).catch()
      const res=getTestcaseAndIds(p);
      tableData.value = res.data.pageBean.resultList;
      console.log('tableData.value====res.data.pageBean.resultList',tableData.value);
      
      pageInfo.value.totalRecord = res.data.pageBean.totalRecord
      // console.log('pageInfo.value.totalRecord===',pageInfo.value.totalRecord);
      
      tableLoading.value = false
    }
    // const getVariable = () => {  
    //   let initVariableListParams:any = {
    //     folderId: leftTreeNodeId,
    //     variableName: '',
    //     annotation: '',
    //     variableUnit: '',
    //     variableType: '',
    //     variableDefaultValue: '',
    //     createUser: '',
    //     createTimeBegin: '',
    //     createTimeEnd: '',
    //     queryModel: 1,
    //     queryParams: '',
    //     variableClass: 1
    //   }
    //   if (globalparamsstore.filterKey) {
    //     initVariableListParams = {
    //       ...initVariableListParams,
    //       queryParams: globalparamsstore.filterKey
    //     }
    //   } else {
    //     initVariableListParams = {
    //       ...initVariableListParams,
    //       ...globalparamsstore.handledFilterFormData,
    //       createTimeBegin: globalparamsstore.handledFilterFormData.startCreateTime,
    //       createTimeEnd: globalparamsstore.handledFilterFormData.endCreateTime
    //     }
    //     initVariableListParams.queryModel = initVariableListParams.queryType
    //   }
    //   getVariableList({
    //     pageNo: pageInfo.value.pageNo,
    //     pageSize: pageInfo.value.pageSize,
    //     orderBy: 'last_modify_time desc',
    //     params: JSON.stringify(initVariableListParams)
    //   }).then(res => {
    //     tableData.value = res.data.variableList
    //     Object.keys(pageInfo.value).forEach(k => {
    //       pageInfo.value[k] = res.data.pageInfo[k]
    //     })
    //     tableLoading.value = false
    //   }).catch()
    // }
    const getNodeAllIds = (folderId:string, folderLevel:number) => {
      // if (hooktype === 'variable_TPA') {
      //    return getVariableNodeAllIds(folderId)
      // } else {
         return getCaseNodeAllIds(folderId, folderLevel)
      // }
    }
    const getCaseNodeAllIds = (folderId:string, folderLevel:number) => {
      let params = {
        rootId: leftTreeRootId,
        sourceType,
        testType: '',
        templateType: '',
        tags: '',
        parentId: folderId === leftTreeRootId ? '' : folderId,
        testcaseNumber: '',///===
        testcaseName: '',///===
        createUser: '',
        priority: '',///===
        startCreateTime: '',
        endCreateTime: '',
        queryType: 1,
        userId: USERINFO?.id,
        folderLevel: folderLevel - 1
      }
      let p = {
        pageNo: 1,
        pageSize: 1,
        params: JSON.stringify(params)
      }
      return new Promise((resolve, reject) => {
        const res=getTestcaseAndIds(p)
        resolve(res.data.idsList)
        // getTestcaseAndIds(p).then(res => {
        //   resolve(res.data.idsList)
        // }).catch((e) => {
        //   reject(e)
        // })
      })
    }
    const getVariableNodeAllIds = (folderId:string) => {
      let initVariableListParams:GetVariableListParamsType = {
        variableName: '',
        annotation: '',
        variableUnit: '',
        variableType: '',
        variableDefaultValue: '',
        folderId,
        createUser: '',
        createTimeBegin: '',
        createTimeEnd: '',
        queryModel: 1,
        queryParams: globalparamsstore.filterKey,
        variableClass: 1
      }
      return new Promise((resolve, reject) => {
        getVariableList({
          pageNo: pageInfo.value.pageNo,
          pageSize: pageInfo.value.pageSize,
          orderBy: 'last_modify_time desc',
          params: JSON.stringify(initVariableListParams)
        }).then(res => {
          resolve(res.data.idList)
        }).catch((e) => {
          reject(e)
        })
      })
    }
    // 处理表格中选中的数据（包括表格选中和通过树形快速选中的数据）
    const allSelectId = ref<{[key:string]:boolean}>({})
    // 手动单选
    const tableCheckOne = (selection:any, row:any) => {
      allSelectId.value[row.id] = !allSelectId.value[row.id]
      // 处理选中的单行数据对应的树形文件夹状态
      setTreeNodeChecked2({ parentId: row.folderId }, hooktype === 'variable_TPA' ? 'totalCount' : 'ltcCount')
    }
    // 手动全选
    const tableCheckAll = (selection:any[]) => {
      let selectStatus = selection.length === 0
      let selectRows = selectStatus ? tableData.value : selection
      let allFolderIds = selectRows.map(item => item.folderId)
      let allFolderIds2 = [...new Set(allFolderIds)]
      selectRows.forEach((row:any) => {
        // 如果selection为空数组，说明是全不选状态，需要操作当前的tabledata中对应的id为false
        allSelectId.value[row.id] = !selectStatus
      })
      let obj = {}
      allFolderIds2.forEach((item:string) => {
        // 处理选中的单行数据对应的树形文件夹状态
        setTreeNodeChecked3({ parentId: item }, hooktype === 'variable_TPA' ? 'totalCount' : 'ltcCount', obj)
      })
    }
    // 根据当前的folderId修改最近一级文件夹的状态的方法(点击左侧树形的复选框影响树形和表格)
    const setTreeNodeChecked1 = (data:any, status:boolean, currentFolderAllIds:string[], label:string) => {
      // 当前节点下的idsList,将这些用例置为选中状态
      currentFolderAllIds.forEach(k => {
        allSelectId.value[k] = status
      })
      // 递归处理所有父节点数据
      setTreeNodeChecked2(data, label)
    }
    // 处理单个folder的所有父级文件夹的选择框展示效果
    const setTreeNodeChecked2 = (data:any, label:string) => {
      const { parentId } = data
      // 判断当前节点是不是根节点,是的话无需操作，不是的话需要递归处理数据
      if (parentId) {
        // 将父文件夹置为选中/不选中状态
        containerRef.value.leftTreeRef.treeRef.setChecked(parentId, true, false)
        let node= containerRef.value.leftTreeRef.treeRef.getNode(parentId)
        console.log('node:containerRef.value.leftTreeRef.treeRef.getNode(parentId)=',node);

        node.indeterminate = false
        // 获取父节点的全部ids
        let promise = getNodeAllIds(parentId, node.level)
        promise.then(list => {
          // 处理当前父级节点下ids
          let parentFolderAllIds = list as string[]
          let number = 0
          parentFolderAllIds.forEach(k => {
            if (allSelectId.value[k]) {
              number++
            }
          })
          let node = containerRef.value.leftTreeRef.treeRef.getNode(parentId)
          if (number === 0) {
            containerRef.value.leftTreeRef.treeRef.setChecked(parentId, false, false)
            setTreeNodeChecked2(node.data, label)
          } else if (number === node.data[label]) {
            containerRef.value.leftTreeRef.treeRef.setChecked(parentId, true, false)
            setTreeNodeChecked2(node.data, label)
          } else {
            while (node && node.parent) {
              node.indeterminate = true
              node = node.parent
            }
            leftTreeNodeClick(leftTreeNodeId, leftTreeNodeLevel)
          }
        })
      } else {
        leftTreeNodeClick(leftTreeNodeId, 1)
      }
    }
    // 批量处理所有父级文件夹的选择框展示效果
    const setTreeNodeChecked3 = (data:{parentId:string}, label:string, hasChecked:{[key:string]:boolean}) => {
      const { parentId } = data
      // 判断当前节点是不是根节点,是的话无需操作，不是的话需要递归处理数据
      if (parentId) {
        if (hasChecked[parentId]) {
          // leftTreeNodeClick(leftTreeNodeId)
        } else {
          hasChecked[parentId] = true
          // 将父文件夹置为选中/不选中状态
          containerRef.value.leftTreeRef.treeRef.setChecked(parentId, true, false)
          let node = containerRef.value.leftTreeRef.treeRef.getNode(parentId)
          console.log('node:containerRef.value.leftTreeRef.treeRef.getNode(parentId)=',node);
          
          node.indeterminate = false
          // 获取父节点的全部ids
          let promise = getNodeAllIds(parentId, node.level)
          promise.then(list => {
            // 处理当前父级节点下ids
            let parentFolderAllIds = list as string[]
            let number = 0
            parentFolderAllIds.forEach(k => {
              if (allSelectId.value[k]) {
                number++
              }
            })
            let node = containerRef.value.leftTreeRef.treeRef.getNode(parentId)
            if (number === 0) {
              containerRef.value.leftTreeRef.treeRef.setChecked(parentId, false, false)
              setTreeNodeChecked3(node.data, label, hasChecked)
            } else if (number === node.data[label]) {
              containerRef.value.leftTreeRef.treeRef.setChecked(parentId, true, false)
              setTreeNodeChecked3(node.data, label, hasChecked)
            } else {
              while (node && node.parent) {
                node.indeterminate = true
                node = node.parent
              }
            }
          })
        }
      } else {
        leftTreeNodeClick(leftTreeNodeId, leftTreeNodeLevel)
      }
    }
    // 表格的高级筛选表单
    const submitForm = () => {
      globalparamsstore.filterFormData = JSON.parse(JSON.stringify(globalparamsstore.tempFilterFormData))
      getTableData()
    }
    /* --------------------底部的功能-------------------------- */
    // 导出功能中的导出
    const exportLoading = ref(false)
    const exportPromise = () => {
      exportLoading.value = true
      const ids = JSON.stringify(Object.keys(allSelectId.value).filter(item => allSelectId.value[item]))
      const checkedNodes = containerRef.value.leftTreeRef.treeRef.getCheckedNodes()
      const checkedKeys = new Set(checkedNodes.filter((item:any) => item.isFullPermission === 1).map((item:any) => item.id))
      const halfCheckedKeys = new Set(containerRef.value.leftTreeRef.treeRef.getHalfCheckedKeys())
      const differenceSet = new Set([...checkedKeys].filter(item => !halfCheckedKeys.has(item)))
      // const differenceSet = new Set([...checkedKeys, ...halfCheckedKeys])
      return new Promise((resolve, reject) => {
        globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
        exportTestcase({
          ids,
          libraryId: rootId,
          userId: USERINFO?.id,
          type: hooktype,
          folderIds: [...differenceSet].join(',')
        }).then(res => {
          globalPropsstore.fileStore.commonFileDownLoad({ url: res.data })
          exportLoading.value = false
          resolve(res)
        }).catch((e) => {
          reject(e)
        })
      })
    }
    const exportTemplate = () => {
      globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
      exportTestcaseTemplate().then(res => {
        globalPropsstore.fileStore.commonFileDownLoad({ url: res.data })
      }).catch(err => {
        console.log(err)
      })
    }
    // const variableExportPromise = (str?:string) => {
    //   let ids = str === '' ? '' : JSON.stringify(Object.keys(allSelectId.value).filter(item => allSelectId.value[item]))
    //   return new Promise((resolve, reject) => {
    //     globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
    //     exportVariables({ ids }).then(res => {
    //       globalPropsstore.fileStore.commonFileDownLoad({ url: res.data.filePath })
    //       resolve(res)
    //     }).catch((e) => {
    //       reject(e)
    //     })
    //   })
    // }
    // 拉取功能中的引用和复制
    const pullLoading = ref(false)
    const copyLoading = ref(false)
    const pullCase = (isCopy:number, targetFolderId:string) => {
      isCopy === 0 ? pullLoading.value = true : copyLoading.value = true
      let params:PullTestcasesType = {
        ids: JSON.stringify(Object.keys(allSelectId.value).filter(item => allSelectId.value[item])),
        targetFolderId,
        targetRootId: rootId,
        userId: USERINFO?.id,
        isCopy,
        libraryName: leftSelectOptions.value.filter(item => item.id === leftTreeRootId)[0].name
      }
      return new Promise((resolve, reject) => {
        pullTestcases(params).then((res) => {
          pullLoading.value = false
          copyLoading.value = false
          message(t('laQuZiYuanKuYongLiChengGong'))
          resolve(res)
        }).catch(e => {
          reject(e)
        })
      })
    }
    // 提交功能中的提交
    const commitLoading = ref(false)
    const commitCase = (projectName:string) => {
      if (rightTreeNodeId === '' || rightTreeNodeId === rightTreeRootId) {
        errorMessage(t('yongLiKuGenWenJianJiaBuNengZuoWeiTiJiaoDeMuBiaoQingXuanZeQiTaWenJianJia'))
      } else {
        commitLoading.value = true
        let params:CommitTestcasesType = {
          ids: JSON.stringify(Object.keys(allSelectId.value).filter(item => allSelectId.value[item])),
          targetFolderId: rightTreeNodeId,
          targetRootId: rightTreeRootId,
          userId: USERINFO?.id,
          projectName
        }
        return new Promise((resolve, reject) => {
          commitTestcases(params).then((res) => {
            commitLoading.value = false
            message(t('xiangMuZhongYongLiTiJiaoChengGong'))
            resolve(res)
          }).catch(e => {
            reject(e)
          })
        })
      }
    }
    return {
      // 表格的分页
      pageInfo,
      changePageInfo,
      // 表格数据和多选功能
      tableData,
      allSelectId,
      tableCheckOne,
      tableCheckAll,
      // 左侧树形
      leftTreeNodeClick,
      checkChange,
      // 左侧树形相关的下拉单选
      leftSelectValue,
      leftSelectOptions,
      leftTreeData,
      getLeftSelectOption,
      getLeftTreeData,
      // 右侧树形
      rightTreeNodeClick,
      rightTreeNodeId,
      rightTreeRootId,
      rightTreeData,
      // 左侧树形相关的下拉单选
      rightSelectValue,
      rightSelectOptions,
      // getRightSelectOption,
      // getRightTreeData,
      // 高级筛选
      submitForm,
      initData,
      // 加载提示
      tableLoading,
      // 复位
      resetData,
      // 导出
      exportLoading,
      exportPromise,
      exportTemplate,
      // variableExportPromise,
      // 拉取
      pullLoading,
      copyLoading,
      pullCase,
      // 提交
      commitLoading,
      commitCase
    }
  }
