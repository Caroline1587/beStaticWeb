<template>
  <form-item-wrapper
    v-for="widget in props.data"
    :key="widget.id"
    :data="widget"
    :rules="props.rules[widget.propertyName || widget.id] || []"
    :can-drag="false"
    :form-data="templatestore.fieldFormData[widget.propertyName|| widget.id]"
    :status="widget.disabled&&props.status==='editable'?'disabled': props.status"
  >
    <template #default="scope">
      <!--单独处理多选成员情况 -->
      <component
        :is="fieldComponents[`${widget.fieldType}-widget`]"
        v-if="widget.fieldType === 'multiMember'"
        v-model:value="templatestore.fieldFormData[widget.propertyName|| widget.id]"
        :data="widget"
        :user-options="userOptions"
        :status="widget.disabled&&props.status==='editable'?'disabled': props.status"
        @show-multi-dialog="showDialog"
      />
      <!--单独处理seq文件情况 -->
      <component
        :is="fileSeqWidget"
        v-else-if="widget.propertyName==='seqFile'"
        v-model:value="templatestore.fieldFormData[widget.propertyName|| widget.id]"
        :data="widget"
        :status="widget.disabled&&props.status==='editable'?'disabled': props.status"
        :enable-download="!props.isPreview&&enableDownLoadSeqFile"
        @download-file="toDownloadFile"
        @get-file-info="getFileInfo"
      />
      <!--单独处理文件情况 -->
      <component
        :is="fieldComponents[`${widget.fieldType}-widget`]"
        v-else-if="widget.fieldType === 'file'"
        v-model:value="templatestore.fieldFormData[widget.propertyName|| widget.id]"
        :data="widget"
        :status="widget.disabled&&props.status==='editable'?'disabled': props.status"
        :enable-download="!props.isPreview&&enableDownLoadFile"
        @download-file="toDownloadFile"
        @get-file-info="getFileInfo"
      />
      <!--单独处理星联关联需求输入框情况 -->
      <component
        :is="charChainWidget"
        v-else-if="widget.propertyName==='require'&&starFlag"
        v-model:value="templatestore.fieldFormData[widget.propertyName|| widget.id]"
        :source-url="templatestore.fieldFormData?.sourceUrl ? templatestore.fieldFormData?.sourceUrl: ''"
        :data="widget"
        :status="props.status==='editable'? 'readonly' : props.status"
        :maxlength="scope.data"
        @open-star-chain-dialog="props.status!=='readonly' && $emits('openStarChainDialog')"
      />
      <component
        :is="fieldComponents[`${widget.fieldType}-widget`]"
        v-else
        v-model:value="templatestore.fieldFormData[widget.propertyName|| widget.id]"
        :is-preview="props.isPreview"
        :data="widget"
        :tags="widget.fieldType ==='tag'?templatestore.allTags:[]"
        :users="widget.fieldType ==='singleMember'?templatestore.allUsers:[]"
        :status="widget.disabled&&props.status==='editable'?'disabled': props.status"
        :maxlength="scope.data"
      />
    </template>
  </form-item-wrapper>
  <multiDialog
    ref="multiDialogRef"
    :title="t('tianJiaChengYuan')"
    :main-title="fieldName"
    :tree-props="{disabled:'isGroupMember'}"
    :tree-data="treeData"
    :dialog-type-info="[t('buMen'), t('yongHuZu')]"
    :old-select-ids="oldData"
    :user-options="userOptions"
    @get-user-by-name="getFilterUser"
    @to-level="toLevel"
    @type-change="typeChange"
    @confim="confim"
  />
</template>

<script lang="ts" setup>
  import fieldComponents from '@/views/common/widget/useWidget'
  import formItemWrapper from '@/views/common/widget/form-item-wrapper.vue'
  import fileSeqWidget from '@/views/ProjectCase/addProjectCase/components/file-seq-widget.vue'
  import charChainWidget from '@/views/ProjectCase/addProjectCase/components/char-chain-widget.vue'
  import multiDialog from './multiDialog.vue'
  import useMultiDialog from './useMultiDialog'
  import { templateStore, routeParamsStore, globalPropsStore } from '@/store/index'
  import Storage from '@/utils/storage'
  import { computed } from 'vue'
  import usePermission from '@/views/common/usePermission'

  const { t } = useI18n()
  const BASEPATH = Storage.localGet('ApiUrl')
  const routeparamsstore = routeParamsStore()
  const templatestore = templateStore()
  const globalPropsstore = globalPropsStore()
  const props = withDefaults(defineProps<{
    type:'testcase_library'|'testcase_project'|'variable_TPA'|'testset_project',
    data:any[]
    rules?:any
    status?:any,
    isPreview?:boolean
  }>(), {
    rules () {
      return {}
    },
    status () {
      return 'editable'
    },
    isPreview () {
      return false
    }
  })
  // openStarChainDialog 为星联专用
  const $emits = defineEmits(['openStarChainDialog'])
  const { enableDownLoadFile, enableDownLoadSeqFile } = usePermission(props.type)
  const {
    multiDialogRef,
    treeData,
    userOptions,
    oldData,
    fieldName,
    showDialog,
    toLevel,
    typeChange,
    confim,
    getFilterUser
  } = useMultiDialog()
  const getFileInfo = (deleteFileId:string, data:any) => {
    // 需要区分删除的是系统字段还是自定义字段的文件
    if (data.isSystemField !== 0) {
      if (!templatestore.removeSystemFileIds[data.propertyName || data.id]) {
        templatestore.removeSystemFileIds[data.propertyName || data.id] = []
      }
      templatestore.removeSystemFileIds[data.propertyName || data.id].push(deleteFileId)
    } else {
      templatestore.removeFileIds.push(deleteFileId)
    }
  }
  const toDownloadFile = (id:string) => {
    globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
    globalPropsstore.fileStore.commonFileDownLoad({ id })
    // downloadFile({ id }).then(res => {
    //   FileDownLoadByBlob(res.headers['content-disposition'].split('filename=')[1], res.data)
    //   message('文件下载成功')
    // }).catch(() => {
    //   errorMessage('文件下载失败')
    // })
  }
  // 关联需求dialog
  const starFlag = computed(() => {
    let falg = BASEPATH.VITE_BASE_API_STAR_CHAIN?.OPEN && routeparamsstore.caseInfo.associatedProject
    return falg ? true : false
  })
</script>

<style lang="scss" scoped>
</style>
