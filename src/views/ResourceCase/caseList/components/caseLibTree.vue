<template>
  <CustomContextmenuTreeV2
    ref="hiTreeRef"
    :module-name="moduleName"
    :tree-data="treeData"
    :expand="true"
    :border="false"
    :add-icon="enableFolderAdd&&hiTreeRef?.currentNodeData?.isFullPermission !== 0"
    :role="{ enableFolderAdd, enableFolderEdit, enableFolderDelete }"
    @export-or-import="exportOrImport"
    @delete-node="deleteConfim"
    @check-node="checkTreeFolderName"
    @node-click="nodeClick"
    @add="addSubFolder"
    @close="closeFilter"
  >
    <template #customMenu="{node, changeCurrentCmd}">
      <ul>
        <li :disabled="node?.level !== 1 ||!enableExcelImport" @click="changeCurrentCmd('import', node?.level !== 1)">{{ t('daoRuExcelWenJian') }}</li>
        <li :disabled="node?.level !== 1 ||!enableExcelExport" @click="changeCurrentCmd('export', node?.level !== 1)">{{ t('daoChuExcelWenJian') }}</li>
        <li v-if="basePath.FEATURES_KEY.indexOf('02') !== -1&&treeType !== 'variable_TPA'" :disabled="!enableExcelExport" @click="changeCurrentCmd('export-AE')">{{ t('daoChuAeCeShiMoBan') }}</li>
      </ul>
    </template>
    <template #customLabel="{node}">
      <div v-if="node?.level===1" class="nodeLabel">
        <el-icon>
          <svg-icon :icon-class="node.isCurrent ? icon.treeRootSelectIcon:icon.treeRootIcon"></svg-icon>
        </el-icon>
        <el-tooltip
          :content="node.label"
          placement="top"
          :show-after="1000"
        >
          <span class="label">{{ node.label }}</span>
        </el-tooltip>
        <el-tooltip
          v-if="treeType !== 'variable_TPA'"
          :content="t('luoJiYongLiShuLiang')"
          placement="top"
          :show-after="1000"
        >
          <span>（<i style="text-decoration:underline">{{ node.data.ltcCount }}</i>:</span>
        </el-tooltip>
        <el-tooltip
          v-if="treeType !== 'variable_TPA'"
          :content="t('juTiYongLiShuLiang')"
          placement="top"
          :show-after="1000"
        >
          <span><i style="text-decoration:underline">{{ node.data.ctcCount }}</i>）</span>
        </el-tooltip>
        <el-tooltip
          v-else-if="treeType === 'variable_TPA'"
          :content="t('bianLiangShuLiang')"
          placement="top"
          :show-after="1000"
        >
          <span>（<i>{{ node.data.totalCount }}</i>）</span>
        </el-tooltip>
      </div>
      <div v-else class="nodeLabel">
        <el-icon>
          <svg-icon :icon-class="`${node.isCurrent ? icon.treeNodeSelectIcon : icon.treeNodeIcon}`"></svg-icon>
        </el-icon>
        <el-tooltip
          :content="node.label"
          placement="top"
          :show-after="1000"
        >
          <span class="label">{{ node.label }}</span>
        </el-tooltip>
        <span v-if="treeType !== 'variable_TPA'">（<i style="text-decoration:underline">{{ node.data.ltcCount }}</i>:</span>
        <span v-if="treeType !== 'variable_TPA'"><i style="text-decoration:underline">{{ node.data.ctcCount }}</i>）</span>
        <span v-else-if="treeType === 'variable_TPA'">（<i>{{ node.data.totalCount }}）</i></span>
      </div>
    </template>
    <template #default="{node}">
      <el-dropdown-item
        v-if="treeType === 'testcase_project' && 0"
        command="commitCase"
      >
        {{ t('tiJiaoCeShiYongLi') }}
      </el-dropdown-item>
      <el-dropdown-item
        v-if="treeType === 'testcase_project'&& 0"
        command="pullCase"
        :disabled="node.level===1"
      >
        {{ t('laQuCeShiYongLi') }}
      </el-dropdown-item>
    </template>
  </CustomContextmenuTreeV2>
  <TipDialogV3
    ref="tipDialogV3Ref"
    :title="t('shanChuWenJianJia')"
    @to-operate="toDelete"
  >
    <template #tipInfo>
      {{ t('shiFouQueRenShanChu') }} <el-tooltip :content="deleteName" placement="top">
        <i class="emphasizeIconText">
          <el-icon color="rgba(11, 83, 253, 0.5)" :size="16">
            <svg-icon :icon-class="icon.treeNodeIcon"></svg-icon>
          </el-icon>
          <span>{{ deleteName }}</span>
        </i>
      </el-tooltip>
      {{ t('wenJianJia') }}
    </template>
    <template #notice>
      <i class="emphasizeRed">{{ t('zhuYi') }}</i>{{ t('ciCaoZuoJiangShanChuWenJianJiaJiQiSuoYouZiWenJianJiaXiaDeCeShiYongLi') }}
    </template>
  </TipDialogV3>
</template>

<script
  setup
  lang="ts"
>
  import { errorMessage, message } from '@/utils/message'
  import { addFolder, editFolder, deleteFolder, checkFolderName } from '@/api/commonApi'
  import { deleteLinkedTestcaseByFolderId } from '@/api/testcaseApi'
  import { TreeDataType } from '@/utils/types/testcaseType'
  import { AddFolderType, EditFolderType, CheckFolderNameType } from '@/utils/types/requestType'
  import { routeParamsStore } from '@/store/index'
  import { useRouter } from 'vue-router'
  import usePermission from '@/views/common/usePermission'
  import Storage from '@/utils/storage'
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const router = useRouter()
  const routeparamsstore = routeParamsStore()
  const props = defineProps<{
    treeData:any[]
  }>()
  const basePath = Storage.localGet('ApiUrl')
  const { t } = useI18n()
  const emits = defineEmits(['initList', 'initTreeFolder', 'exportOrImport'])
  // 来源判断：项目用例，用例库，变量
  const treeType = router.currentRoute.value.meta.source as 'testcase_library'|'testcase_project'|'variable_TPA'
  const moduleName = treeType === 'variable_TPA' ? t('bianLiang') : t('yongLi')
  const icon = {
    treeRootIcon: treeType === 'variable_TPA' ? 'variable_folder_root' : 'librarycase_folder_root',
    treeRootSelectIcon: treeType === 'variable_TPA' ? 'variable_folder_root_full' : 'librarycase_folder_root_full',
    treeNodeIcon: treeType === 'variable_TPA' ? 'variable_folder_node' : 'librarycase_folder_node',
    treeNodeSelectIcon: treeType === 'variable_TPA' ? 'variable_folder_node_full' : 'librarycase_folder_node_full'
  }
  const { enableFolderAdd, enableFolderEdit, enableFolderDelete, enableExcelImport, enableExcelExport } = usePermission(treeType)
  // 功能行
  const addSubFolder = () => {
    hiTreeRef.value.handleTree('addFolder', currentNode)
  }
  // 树形数据
  const treeData = computed(() => {
    return props.treeData
  })
  const hiTreeRef = ref()
  let currentNode:TreeDataType = {
    id: '',
    name: '',
    libraryId: '',
    ltcCount: 0,
    ctcCount: 0,
    parentId: '',
    childrenList: []
  }
  const nodeClick = (data: any, node:any) => {
    let rawData = toRaw(data)
    if (rawData.id !== '-1') {
      Object.keys(currentNode).forEach(k => {
        currentNode[k] = rawData[k]
      })
    }
    if (treeType === 'testcase_project') {
      routeparamsstore.caseInfo.projectFolderName = currentNode.name
      routeparamsstore.caseInfo.projectFolderLevel = node.level - 1
      routeparamsstore.caseInfo.projectFolderId = currentNode.id === currentNode.libraryId ? '' : currentNode.id
    } else if (treeType === 'testcase_library') {
      routeparamsstore.caseInfo.resourceFolderName = currentNode.name
      routeparamsstore.caseInfo.resourceFolderLevel = node.level - 1
      routeparamsstore.caseInfo.resourceFolderId = currentNode.id === currentNode.libraryId ? '' : currentNode.id
    } else if (treeType === 'variable_TPA') {
      routeparamsstore.variableInfo.folderName = currentNode.name
      routeparamsstore.variableInfo.folderId = currentNode.id === currentNode.libraryId ? '' : currentNode.id
    }
    emits('initList')
  }
  // 文件夹节点操作
  const addTreeFolder = (folderName:string, data:any) => {
    const fd = new FormData()
    let jsonParams:AddFolderType = {
      libraryId: treeType === 'variable_TPA' && !data.libraryId ? null : data.libraryId,
      parentId: treeType === 'variable_TPA' && !data.id ? null : data.id,
      type: treeType,
      name: folderName
    }
    Object.keys(jsonParams).forEach(k => {
      fd.append(k, jsonParams[k])
    })
    addFolder(fd).then(() => {
      message(t('ziWenJianJiaTianJiaChengGong'))
      emits('initTreeFolder')
    }).catch()
  }
  const editTreeFolder = (folderName:string, data:any) => {
    const fd = new FormData()
    let jsonParams:EditFolderType = {
      id: data.id,
      name: folderName
    }
    Object.keys(jsonParams).forEach(k => {
      fd.append(k, jsonParams[k])
    })
    editFolder(fd).then(() => {
      message(t('wenJianJiaZhongMingMingChengGong'))
      emits('initTreeFolder')
    }).catch()
  }
  const deleteName = ref('')
  const tipDialogV3Ref = ref()
  const currentData = ref<any>()
  const deleteConfim = (data:any) => {
    let dataNumber = treeType === 'variable_TPA' ? data.totalCount : data.ltcCount
    if (dataNumber > 0) {
      deleteName.value = data.name
      currentData.value = data
      tipDialogV3Ref.value.dialogVisible = true
    } else {
      deleteTreeFolder(data)
    }
  }
  const toDelete = () => {
    if (treeType === 'testcase_library') {
      let promise = new Promise((resolve, reject) => {
        deleteLinkedTestcaseByFolderId({
          folderId: currentData.value.id,
          libraryId: currentDataId
        }).then(() => {
          resolve('')
        }).catch((e) => {
          reject(new Error(e))
        })
      })
      promise.then(() => {
        deleteTreeFolder(currentData.value)
      })
    } else { deleteTreeFolder(currentData.value) }
  }
  const deleteTreeFolder = (data:any) => {
    const fd = new FormData()
    let jsonParams:EditFolderType = {
      id: data.id,
      name: data.name
    }
    Object.keys(jsonParams).forEach(k => {
      fd.append(k, jsonParams[k])
    })
    deleteFolder(fd).then(() => {
      message(t('wenJianJiaShanChuChengGong'))
      if (treeType === 'testcase_project') {
        routeparamsstore.caseInfo.projectFolderId = ''
      } else if (treeType === 'testcase_library') {
        routeparamsstore.caseInfo.resourceFolderId = ''
      } else if (treeType === 'variable_TPA') {
        routeparamsstore.variableInfo.folderId = ''
      }
      currentNode.id = ''
      currentNode.libraryId = ''
      tipDialogV3Ref.value.dialogVisible = false
      emits('initTreeFolder')
    }).catch()
  }
  const checkSpecialCharacter = (value:string) => {
    const ruleReg = /[\\?/:*"<>|@#\s]+/gi
    return ruleReg.test(value)
  }
  const checkTreeFolderName = (parentId:string, folderName:string, command:string, input:any, data:any) => {
    if (checkSpecialCharacter(folderName)) {
      errorMessage(t('wenJianJiaMingChengZhongBuNengBaoHanKongGeHeYiXiaZiFu'))
      input.value.focus()
    } else {
      const fd = new FormData()
      let currentlibraryId = treeType === 'variable_TPA' ? '' : currentDataId
      let jsonParams:CheckFolderNameType = {
        parentId: parentId === currentlibraryId ? '' : parentId,
        folderName,
        rootId: currentlibraryId,
        folderType: treeType
      }
      Object.keys(jsonParams).forEach(k => {
        fd.append(k, jsonParams[k])
      })
      checkFolderName(fd).then(res => {
        if (res.data.result) {
          // true表示有重名项
          errorMessage(t('gaiWenJianJiaXiaYiYouTongMingWenJianJiaQingGengHuanWenJianJiaMingCheng'))
          input.value.focus()
        } else {
          if (command === 'addFolder') {
            addTreeFolder(folderName, data)
          } else if (command === 'editFolder') {
            editTreeFolder(folderName, data)
          }
        }
      }).catch()
    }
  }
  const exportOrImport = (cmd:string, id:string) => {
    emits('exportOrImport', cmd, id)
  }
  // 筛选功能
  const closeFilter = () => {
    // 保持原节点高亮
    nextTick(() => {
      let key = ''
      if (treeType === 'variable_TPA') {
        key = routeparamsstore.variableInfo.folderId
      } else if (treeType === 'testcase_project') {
        key = routeparamsstore.caseInfo.projectFolderId === '' ? currentDataId : routeparamsstore.caseInfo.projectFolderId
      } else if (treeType === 'testcase_library') {
        key = routeparamsstore.caseInfo.resourceFolderId === '' ? currentDataId : routeparamsstore.caseInfo.resourceFolderId
      }
      hiTreeRef.value.treeRef.setCurrentKey(key)
    })
  }
  onMounted(() => {
    emits('initTreeFolder')
  })
  defineExpose({
    hiTreeRef
  })
</script>
<style
  lang='scss'
  scoped
>
  .commonContainer{
    transition: all 0.5s linear;
    >div{
      height: 100%;
    }
    .foldAside{
      display: flex;
      flex-direction: column;
      align-items: center;
      >span{
        margin: 10px 0;
        letter-spacing: 5px;
      }
    }
    .treeContainer{
      height: calc(100% - 40px);
    }
    .caseLib{
      height: 40px;
      width: 100%;
      padding:0 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #C0C4CC;
      .el-input{
        height: 30px;
        --el-input-border-color:#fff;
        --el-input-hover-border-color:#fff;
        --el-input-bg-color:#F0F0F0;
        --el-input-focus-border-color:#fff
      }
      >span{
        display: flex;
        align-items: center;
        white-space: nowrap;
        i{
          margin-left: 5px;
        }
      }
      >div{
        display: flex;
        align-items: center;
      }
    }
    .el-tree{
      :deep(.el-tree-node__label){
        width: 100%;
        padding: 0 5px 0 0;
        height: 100%;
      }
    }
  }
</style>
