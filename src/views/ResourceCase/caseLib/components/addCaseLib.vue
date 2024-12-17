<template>
  <AsideDrawer
    ref="asideDrawerRef"
    :title="t('xinJianCeShiYongLiKu')"
    :size="800"
    @closed="closed"
  >
    <el-form
      ref="addCaselibFormRef"
      :model="caseLibForm"
      :rules="rules"
      label-width="120px"
      status-icon
      label-position="top"
    >
      <el-form-item :label="t('ceShiYongLiKuMingCheng')" prop="libraryName">
        <el-input v-model="caseLibForm.libraryName" />
      </el-form-item>
      <el-form-item :label="t('yongLiKuMiaoShu')" prop="description">
        <el-input
          v-model="caseLibForm.description"
          type="textarea"
          show-word-limit
          maxlength="500"
          :rows="8"
        />
      </el-form-item>
      <el-form-item :label="t('yongLiKuTuBiao')" prop="projectDescription">
        <IconSelect ref="iconSelectRef"></IconSelect>
      </el-form-item>
    </el-form>
    <template #drawerFooter>
      <el-button class="grey-liner-button" @click="hidden">{{ t('quXiao') }}</el-button>
      <el-button class="blue-button" @click="toAdd">{{ t('baoCun') }}</el-button>
    </template>
  </AsideDrawer>
</template>

<script
  setup
  lang="ts"
>
  import type { FormInstance } from 'element-plus'
  import { message } from '@/utils/message'
  import { checkLibraryName, setTestcaseLibManager, addResourceLibrary } from '@/api/caseLibApi'
  import Storage from '@/utils/storage'
  import IconSelect from '@/views/ResourceCase/caseLib/components/AddCaselibComponents/IconSelect.vue'

  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const { t } = useI18n()
  const emits = defineEmits(['initList'])

  /* 新建项目表单相关 */
  const addCaselibFormRef = ref<FormInstance>()
  const caseLibForm = reactive({
    libraryName: '',
    description: ''
  })
  const checkName = async (rule: any, value: any, callback: any) => {
    const res = await checkLibraryName({
      libraryType: 1,
      libraryName: value
    })
    res.data ? callback(new Error(t('yongLiKuMingChengYiCunZai'))) : callback()
  }
  const rules = {
    libraryName: [
      { required: true, message: t('qingShuRuYongLiKuMingCheng'), trigger: 'blur' },
      { max: 50, message: t('yongLiKuMingChengChangDuShangXianWei_50ZiFu'), trigger: 'blur' },
      { validator: checkName, trigger: 'blur' }
    ],
    description: [
      { max: 500, message: t('yongLiKuMiaoShuShangXianShi_500ZiFu'), trigger: 'blur' }
    ]
  }
  // 添加用例库
  const iconSelectRef = ref()
  const toAdd = () => {
    if (!addCaselibFormRef.value) return
    addCaselibFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        const fd = new FormData()
        const params:any = {
          ...caseLibForm,
          libraryType: 1,
          userId: USERINFO.id,
          icon: iconSelectRef.value.currentImgIndex === 13 ? 'OTHER' : `SystemIcon${iconSelectRef.value.currentImgIndex}`
        }
        for (let key in params) {
          fd.append(key, params[key])
        }
        if (params.icon === 'OTHER') fd.append('file', iconSelectRef.value.file)
        const res = await addResourceLibrary(fd)
        await setTestcaseLibManager({
          userIds: JSON.stringify([USERINFO.id]),
          createUser: USERINFO.id,
          libraryId: res.data.id
        })
        message(t('yongLiKuTianJiaChengGong'))
        hidden()
        emits('initList')
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  // drawer组件
  const asideDrawerRef = ref()
  const show = () => {
    asideDrawerRef.value.dialogVisible = true
  }
  const hidden = () => {
    asideDrawerRef.value.dialogVisible = false
  }
  const closed = () => {
    addCaselibFormRef.value?.resetFields()
  }

  defineExpose({
    show
  })
</script>

<style
  lang='scss'
  scoped
>
  .el-drawer{
    .demo-drawer__content{
      height: 100%;
    }
    .el-form{
      width: 100%;
    }
    .el-avatar{
      margin-right: 5px;
    }
  }
  .el-dialog{
    .dialog-header{
      font-weight: 700;
      font-size: 20px;
      color: #000000;
    }
    .memberInfo{
      display: flex;
      align-items: center;
      .el-avatar{
        margin-right: 15px;
      }
    }
    .tableHeader{
      margin-top:10px;
    }
    .tableBottom{
      height: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-avatar{
        margin-left: -5px;
        border: 1px solid #fff;
      }
    }
    .el-button-group{
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      .el-button{
        flex: 1;
      }
    }
    .dialog-footer{
      display: flex;
      align-items: center;
      height: 35px;
      justify-content: flex-end;
    }
  }
</style>
