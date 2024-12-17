<template>
  <div class="asideContainer">
    <div>
      <div class="title">{{ t('fuJianShangChuan') }}</div>
      <el-upload
        v-if="props.type!=='view'"
        ref="commonUpload"
        v-model:file-list="uploadFiles"
        drag
        multiple
        :class="props.disabled ? 'uploadDisabled' : 'upload'"
        :disabled="props.disabled"
        :auto-upload="false"
        :on-remove="fileRemove"
        :on-change="fileChange"
      >
        <div class="uploadText">{{ t('shangChuanFuJian') }}</div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('danGeWenJianBuNengChaoGuo_400mb') }}
          </div>
        </template>
      </el-upload>
      <ul v-else-if="!props.role.enableDownLoadFile" class="file-info">
        <li
          v-for="item in uploadFiles"
          :key="item.id"
         >
          <div>
            <el-icon><Document /></el-icon>
            <el-tooltip
              effect="dark"
              :show-after="1000"
              :content="item.name"
              placement="top"
            >
              <span class="text">{{ item.name }}</span>
            </el-tooltip>
          </div>
        </li>
      </ul>
      <ul v-else class="enable-file-info file-info">
        <li
          v-for="item in uploadFiles"
          :key="item.id"
          @click="commmonDownLoad(item.id ? item.id :'')"
          >
          <div>
            <el-icon><Document /></el-icon>
            <el-tooltip
              effect="dark"
              :show-after="1000"
              :content="item.name"
              placement="top"
            >
              <span class="text">{{ item.name }}</span>
            </el-tooltip>
          </div>
        </li>
      </ul>
    </div>
    <div>
      <div class="title">{{ t('ceShiXuLieWenJian') }}</div>
      <el-upload
        v-if="props.type!=='view'"
        ref="reqUpload"
        v-model:file-list="uploadSeqFiles"
        drag
        multiple
        :class="props.disabled ? 'uploadDisabled' : 'upload'"
        :disabled="props.disabled"
        :auto-upload="false"
        :limit="1"
        :on-remove="seqfileRemove"
        :on-change="seqfileChange"
        :on-exceed="handleExceed"
      >
        <div class="uploadText">{{ t('shangChuanCeShiXuLieWenJian') }}</div>
        <template #tip>
          <div class="el-upload__tip">
            {{ t('danGeWenJianBuNengChaoGuo_400mb') }}
          </div>
        </template>
      </el-upload>
      <ul v-else-if="!props.role.enableDownLoadSeqFile" class="file-info">
        <li
          v-for="item in uploadSeqFiles"
          :key="item.id"
         >
            <el-icon><Document /></el-icon>
            <el-tooltip
              effect="dark"
              :show-after="1000"
              :content="item.name"
              placement="top"
            >
              <span class="text">{{ item.name }}</span>
            </el-tooltip>
        </li>
      </ul>
      <ul v-else class="enable-file-info file-info">
        <li
          v-for="item in uploadSeqFiles"
          :key="item.id"
          @click="commmonDownLoad(item.id||'')"
        >
          <el-icon><Document /></el-icon>
          <el-tooltip
            effect="dark"
            :show-after="1000"
            :content="item.name"
            placement="top"
          >
            <span class="text">{{ item.name }}</span>
          </el-tooltip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Document } from '@element-plus/icons-vue'
  import { UploadFileWithId } from '@/utils/types/commonType'
  import { UploadUserFile, UploadProps, UploadRawFile, genFileId } from 'element-plus'
  import { errorMessage } from '@/utils/message'
  import { getFileList } from '@/api/fileApi'

  import { routeParamsStore, globalPropsStore } from '@/store/index'

  const routeparamsstore = routeParamsStore()
  const globalPropsstore = globalPropsStore()
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    type?:string
    reload?:boolean
    disabled?:boolean
    role?:{
      enableDownLoadFile:boolean,
      enableDownLoadSeqFile:boolean
    }
  }>(), {
    role () {
      return {
        enableDownLoadFile: true,
        enableDownLoadSeqFile: true
      }
    },
    type () {
      return 'add'
    },
    reload () {
      return false
    },
    disabled () {
      return false
    }
  })
  const emits = defineEmits(['getFileInfo', 'getSeqfileInfo'])
  // 下载文件
  const commmonDownLoad = (id:string) => {
    globalPropsstore.fileStore.commonFileDownLoadNotification() // 开始下载提示
    globalPropsstore.fileStore.commonFileDownLoad({ id })
  }
  // 普通文件
  const uploadFiles = ref<UploadFileWithId[]>([])
  const commonUpload = ref()
  let deleteFile:string[] = []
  let newFile:UploadUserFile[] = []
  const fileRemove: UploadProps['onRemove'] = (uploadFile:UploadFileWithId) => {
    // 保存需要后端删除的文件的id
    if (uploadFile.status === 'success' && uploadFile.id) {
      deleteFile.push(uploadFile.id)
    }
    emits('getFileInfo', newFile, deleteFile)
  }
  const fileChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    // 保存新上传的文件到newFile
    let flag = fileCheck(uploadFile, uploadFiles)
    if (flag) {
      newFile = uploadFiles.filter(item => item.status === 'ready')
      emits('getFileInfo', newFile, deleteFile)
    } else {
      uploadFiles.pop()
      // commonUpload.value.handleRemove(uploadFile)
    }
  }
  // 序列文件
  const uploadSeqFiles = ref<UploadFileWithId[]>([])
  const reqUpload = ref()
  let deleteSeqFile:string[] = []
  let newSeqFile:UploadUserFile[] = []
  const seqfileRemove: UploadProps['onRemove'] = (uploadFile:UploadFileWithId) => {
    // 保存需要后端删除的文件的id
    if (uploadFile.status === 'success' && uploadFile.id) {
      deleteSeqFile.push(uploadFile.id)
    }
    emits('getSeqfileInfo', newSeqFile, deleteSeqFile)
  }
  const seqfileChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    // 保存新上传的文件到newFile
    let flag = fileCheck(uploadFile, uploadFiles)
    if (flag) {
      let namearr = uploadFile.name.split('.')
      let suffix = namearr[namearr.length - 1]
      if (suffix !== 'seq') {
        errorMessage(t('zhiNengShangChuanSeqWenJian'))
        uploadFiles.pop()
        // reqUpload.value.handleRemove(uploadFile)
      } else {
        newSeqFile = uploadFiles.filter(item => item.status === 'ready')
        emits('getSeqfileInfo', newSeqFile, deleteSeqFile)
      }
    } else {
      uploadFiles.pop()
      // reqUpload.value.handleRemove(uploadFile)
    }
  }
  const handleExceed: UploadProps['onExceed'] = (files) => {
    reqUpload.value?.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    reqUpload.value?.handleStart(file)
  }
  const fileCheck = (uploadFile:any, uploadFiles:any) => {
    if (uploadFile.size === 0) {
      errorMessage(t('buNengShangChuanKongWenJian'))
      return false
    }
    let fileSize = Number(uploadFile.size ? uploadFile.size / 1024 / 1024 / 100 : 0)
    let fileNameList = uploadFiles.map((item:any) => item.name)
    fileNameList.pop()
    if (fileSize > 4) {
      errorMessage(t('buNengShangChuanDaXiaoChaoGuo_400mbDeWenJian'))
      return false
    } else if (fileNameList.includes(uploadFile.name)) {
      errorMessage(t('buNengShangChuanZhongMingWenJian'))
      return false
    }
    return true
  }
  // 获取数据
  const getFileInfo = (id:string) => {
    Promise.all([getFileList({ fileId: id, fileCategory: 'testcase_common_file' }), getFileList({ fileId: id, fileCategory: 'testcase_seq_file' })]).then(res => {
      uploadFiles.value = res[0].data.fileList.map((item:any) => {
        item.name = item.fileName
        return item
      })
      uploadSeqFiles.value = res[1].data.fileList.map((item:any) => {
        item.name = item.fileName
        return item
      })
    }).catch()
  }
  watch(() => props.reload, (newValue) => {
    if (newValue) {
      getFileInfo(routeparamsstore.caseInfo.caseId)
    }
  }, { immediate: true })
  onMounted(() => {
    if (props.type !== 'add') {
      getFileInfo(routeparamsstore.caseInfo.caseId)
    }
  })
</script>
<style
  lang='scss'
  scoped
>
  .asideContainer{
    height: 100%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgb(204, 204, 204);
    .title{
      font-size: 18px;
      height: 19px;
      padding-left: 8px;
      position: relative;
      left: -1px;
      border-left: 4px solid var(--el-color-primary);
    }
    .upload{
      margin: 20px 0px 0 20px;
      .uploadText{
        padding: 10px;
        color: #409EFF;
      }
    }
    .uploadDisabled{
       margin: 20px 0px 0 20px;
      .uploadText{
        padding: 10px;
        color: #C0C4CC;
      }
      :deep(.el-upload-dragger){
        background-color: #F5F7FA;
        border: 1px dashed #C0C4CC;
      }
    }
    >div{
      margin-bottom: 10px;
    }
    .customContainer{
      ul{
        width: 100%;
        padding-left: 20px;
        padding-top: 10px;
        margin:0;
        li{
          display: flex;
          margin-top: 10px;
          height: 35px;
          >label{
            width: 70px;
            margin-right: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 35px;
          }
          .el-input{
            width: calc(100% - 70px);
          }
          .el-select{
            width: calc(100% - 70px);
            padding: 0;
            border: 0;
          }
          >div{
            width: calc(100% - 70px);
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            padding: 0 10px;
            height: 100%;
            border-radius: 4px;
          }
        }
      }
    }
  }
</style>
