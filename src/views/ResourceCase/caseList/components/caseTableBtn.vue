<template>
  <div>
    <div v-show="!props.tableBtnType">
      <el-button class="grey-liner-button" :disabled="!enableDataAdd" @click="copyCase">{{ t('fuZhi') }}</el-button>
      <el-button class="grey-liner-button" :disabled="!enableDataMove" @click="moveCase">{{ t('yiDong') }}</el-button>
      <slot></slot>
    </div>
    <span v-show="props.tableBtnType">
      <TableMenu
        :table-props="tableAllProps"
        :disabled-props="disabledProps"
        :default-checked-props="defaultCheckedProps"
        :local-name="`${currentDataId}_${props.caseType}List`"
        :is-custom-menu="false"
        @handle-table-props="handleTableProps"
      />
    </span>
    <FilterTreeDialog
      ref="filterTreeDialogRef"
      :tree-data="props.treeData"
      @submit="getSelectTreeNode"
    >
      <template #dialogTip>
        <messageComps tag-name="div" class-name="dialogTip" :info="t('yiXuanScopenumberXiangCeShiYongLi', [`<i style='color:var(--el-color-primary);margin:0 3px'>${props.selectIds.length}</i>`])"></messageComps>
      </template>
      <template #default="{ node }">
        <span v-if="node?.level ===1">
          <span class="flex-center" :style="node.isCurrent?'color:var(--el-color-primary)':''">
            <el-icon style="margin-right:4px">
              <svg-icon :icon-class="`${node.isCurrent ?'librarycase_folder_root_full': 'librarycase_folder_root'}`"></svg-icon>
            </el-icon>
            {{ node.label }}
          </span>
        </span>
        <span v-else class="tree_node">
          <span class="flex-center" :style="node.isCurrent?'color:var(--el-color-primary)':''">
            <el-icon style="margin-right:4px">
              <svg-icon :icon-class="`${node.isCurrent ?'librarycase_folder_node_full': 'librarycase_folder_node'}`"></svg-icon>
            </el-icon>
            {{ node.label }}
          </span>
        </span>
      </template>
    </FilterTreeDialog>
  </div>
</template>
<script
  setup
  lang="ts"
>
  import { message, errorMessage } from '@/utils/message'
  import { TablePropsType } from '@/utils/types/commonType'
  import { copyTestcase, moveTestcase } from '@/api/testcaseApi'
  import FilterTreeDialog from '@/views/common/FilterTreeDialog.vue'
  import Storage from '@/utils/storage'
  import usePermission from '@/views/common/usePermission'
  import { useColumWidth } from '@/views/common/useRequestList'
  import useRenderHtml from '@/views/common/useRenderHtml'
  const { handleComps } = useRenderHtml()
  const messageComps:any = handleComps()
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const { t } = useI18n()
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const props = withDefaults(defineProps<{
    treeData:any[]
    selectIds?:string[]
    tableBtnType:boolean
    caseType:'testcase_library'|'testcase_project'
  }>(), {
    selectIds () {
      return []
    }
  })

  const { getColumWidth } = useColumWidth(`${props.caseType}List`)

  const { enableDataMove, enableDataAdd } = usePermission(props.caseType)
  const emits = defineEmits(['handleTableProps', 'reload'])
  const filterTreeDialogRef = ref()
  const copyOrMove = ref('move')
  const moveCase = () => {
    copyOrMove.value = 'move'
    filterTreeDialogRef.value.show(t('yiDongCeShiYongLi'))
  }
  const copyCase = () => {
    copyOrMove.value = 'copy'
    filterTreeDialogRef.value.show(t('fuZhiCeShiYongLi'))
  }
  const getSelectTreeNode = (id:string, node:any) => {
    const parentId = props.treeData[0].id
    if (parentId === id) {
      errorMessage(t('genWenJianJiaBuYunXuZuoWeiFuZhiHuoYiDongDeMuBiao'))
      return
    } else if (id === '') {
      errorMessage(t('weiXuanZeMuBiaoWenJianJia'))
      return
    } else if (node.data.isFullPermission === 0) {
      errorMessage(t('ninMeiYouGaiWenJianJiaDeQuanXian'))
      return
    }
    loadingStart({ text: `${t('ceShiYongLi')}${copyOrMove.value === 'copy' ? t('fuZhiZhong') : t('yiDongZhong')}...` })
    let params = {
      ids: JSON.stringify(props.selectIds),
      userId: USERINFO.id,
      targetFolderId: id
    }
    if (copyOrMove.value === 'copy') {
      copyTestcase({
        ...params,
        sourceType: 1
      }).then(() => {
        message(t('fuZhiCeShiYongLiChengGong'))
        filterTreeDialogRef.value.hidden()
        emits('reload')
        loadingClose()
      }).catch()
    } else if (copyOrMove.value === 'move') {
      moveTestcase(params).then(() => {
        message(t('yiDongCeShiYongLiChengGong'))
        filterTreeDialogRef.value.hidden()
        emits('reload')
        loadingClose()
      }).catch()
    }
  }
  // 控制表格展示列
  const tableAllProps = ref<TablePropsType[]>([
    {
      label: t('yongLiBianHao'),
      prop: 'testcaseNumber',
      isSystemField: 1,
        width: getColumWidth('testcaseNumber', 'input')
    },
    {
      label: t('yongLiMingCheng'),
      prop: 'testcaseName',
      isSystemField: 1,
      width: getColumWidth('testcaseName', 'name')
    },
    {
      label: t('youXianJi'),
      prop: 'priority',
      isSystemField: 1,
      width: getColumWidth('priority', 'singleSelect')
    },
    {
      label: t('ceShiLeiXing'),
      prop: 'testType',
      isSystemField: 1,
      width: getColumWidth('testType', 'singleSelect')
    },
    {
      label: t('biaoQian'),
      prop: 'tags',
      type: 'tag',
      sortable: false,
      width: getColumWidth('tags', 'tag')
    },
    {
      label: t('juTiYongLiShuLiang'),
      prop: 'ctcNum',
      isSystemField: 1,
      width: getColumWidth('ctcNum', 'input')
    },
    {
      label: t('yongLiMoBan'),
      prop: 'templateType',
      isSystemField: 1,
      width: getColumWidth('templateType', 'singleSelect')
    },
    {
      label: t('miaoShuXinXi'),
      prop: 'description',
      sortable: false,
      width: getColumWidth('description', 'textarea')
    },
    {
      label: t('chuangJianRen'),
      prop: 'createUserName',
      isSystemField: 1,
      width: getColumWidth('createUserName', 'singleMember')
    },
    {
      label: t('chuangJianShiJian'),
      prop: 'createTime',
      isSystemField: 1,
      width: getColumWidth('createTime', 'date')
    }
  ])
  if (props.caseType === 'testcase_project') {
    tableAllProps.value.push({
      label: t('guanLianXuQiu'),
      prop: 'requireNumberAndId',
      width: getColumWidth('requireNumberAndId', 'input')
    })
  }
  const disabledProps = ['testcaseNumber', 'testcaseName']
  const defaultCheckedProps = ['testType', 'tags', 'priority', 'ctcNum', 'createUserName', 'templateType']
  const handleTableProps = (props:TablePropsType[]) => {
    emits('handleTableProps', props)
  }
  onMounted(() => {
    // c
  })
</script>
<style
  lang="scss"
  scoped
>
  .dialogTip{
    margin-bottom: 10px;
    i{
      color: var(--el-color-primary);
    }
  }
</style>
