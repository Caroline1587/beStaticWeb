<template>
  <el-drawer
    v-model="drawerVisiable"
    size="60%"
    @close="handleClose"
  >
    <template #header>
      <span class="title">{{ t('tianJiaZhiHangJieGuo') }}</span>
    </template>
    <!-- 内容区 -->
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      status-icon
      label-position="top"
    >
      <el-form-item :label="t('luoJiYongLiZhiHangJieGuo')" prop="result">
        <el-select v-model="ruleForm.result" :placeholder="t('weiXuanZe')" size="large">
          <template #prefix>
            <el-icon v-if="ruleForm.result">
              <component :is="statusOptions[ruleForm.result - 2]?.iconComponent" :color="statusOptions[ruleForm.result - 2]?.color" />
            </el-icon>
          </template>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
            class="custom-option"
          >
            <div class="option-container">
              <el-icon><component :is="item.iconComponent" :color="item.color" /></el-icon>
              <span>{{ item.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('luoJiYongLiBeiZhu')">
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
          rows="5"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <el-form-item v-if="$props.ltcTableRow.templateType===1" :label="t('luoJiYongLiXinXi')">
        <ctc-desc-table ref="tableDescRef" />
      </el-form-item>
      <el-form-item v-if="showResultCell&&$props.ltcTableRow.templateType!==1" :label="t('juTiYongLiZhiHangJieGuo')">
        <ctc-result-table
          ref="tableCtcRef"
          v-bind="$attrs"
          :ltc-table-row="$props.ltcTableRow"
          @change-show-result-cell="changeShowResultCell" />
      </el-form-item>
      <el-form-item :label="t('xiangGuanFuJian')" class="upload-item">
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          drag
          multiple
          action="#"
          :auto-upload="false"
          :limit="10"
          :on-exceed="handleExceed"
          :on-change="uploadChangeHandle"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ t('jiangWenJianTuoDaoCiChuHuo') }} <em>{{ t('dianJiShangChuan') }}</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ t('danGeWenJianBuNengChaoGuo_400mb') }}
</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button class="grey-liner-button" @click="resetForm(ruleFormRef)">{{ t('quXiao') }}</el-button>
      <el-button class="blue-button" :loading="loading" @click="submitForm(ruleFormRef)">{{ t('baoCun') }}</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import CtcResultTable from './CtcResultTable.vue'
import CtcDescTable from './CtcDescTable.vue'
import { warningMessage } from '@/utils/message'
import type { FormInstance, FormRules, UploadInstance, UploadProps, UploadUserFile } from 'element-plus'
import { SuccessFilled, CircleCloseFilled, WarningFilled, RemoveFilled, UploadFilled } from '@element-plus/icons-vue'
const { t } = useI18n()
// import { useTestSetStore } from '@/store/index'

// const $store = useTestSetStore()

const $props = withDefaults(defineProps<{
  drawerVisiable:boolean,
  ltcTableRow:any,
  ltcExecutionResult?: any
}>(), {
  drawerVisiable: false,
  ltcExecutionResult: 2,
  ltcTableRow: () => {
    return {}
  }
})

const $emits = defineEmits(['update:drawerVisiable', 'submit'])

const drawerVisiable = computed({
  get () {
    return $props.drawerVisiable
  },
  set (val:boolean) {
    $emits('update:drawerVisiable', val)
    return val
  }
})

let loading = ref(false)

const handleClose = () => {
  ruleForm.result = ''
  ruleForm.desc = ''
  loading.value = false
  uploadRef.value?.clearFiles()
  $emits('update:drawerVisiable', false)
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  result: '' as string | number,
  desc: ''
})

const rules = reactive<FormRules>({
  result: [
    { required: true, message: t('qingXuanZeZhiHangJieGuo'), trigger: 'change' }
  ]
})

// 是否显示具体用例执行结果一行
let showResultCell = ref(true)
const changeShowResultCell = (val:boolean) => {
  showResultCell.value = val
}

// 下拉状态
const statusOptions = ref([
  {
    name: t('tongGuo'),
    iconComponent: markRaw(SuccessFilled),
    value: 2,
    color: '#92D073'
  },
  {
    name: t('shiBai'),
    iconComponent: markRaw(CircleCloseFilled),
    value: 3,
    color: '#F98F8F'
  },
  {
    name: t('yiChang'),
    iconComponent: markRaw(WarningFilled),
    value: 4,
    color: '#F3C886'
  },
  {
    name: t('wuPanDuan'),
    iconComponent: markRaw(RemoveFilled),
    value: 5,
    color: '#CCCCCC'
  }
]
)

let fileList = ref<UploadUserFile[]>([])
// 上传组件
const uploadRef = ref<UploadInstance>()
// 上传变化回调
const uploadChangeHandle: UploadProps['beforeUpload'] = (file) => {
  // 上传文件大小是否大于400M
  const sizeFlag = file.size / 1024 / 1024 / 4 / 100 <= 1
  if (!sizeFlag) {
    uploadRef.value?.handleRemove(file)
    warningMessage(t('danGeWenJianBuNengChaoGuo_400mb'))
  }
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  warningMessage(t('zuiDaShangChuan_10GeWenJianNinXuanZeLeFileslengthWenJian', [files.length]))
}
let tableDescRef = ref()
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let ctcResultList = tableCtcRef.value?.getRequestData()
      let descList = tableDescRef.value?.getRequestData()
      loading.value = true
      $emits('submit', ruleForm, ctcResultList, fileList.value, descList)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  uploadRef.value?.clearFiles()
  $emits('update:drawerVisiable', false)
}

// 打开抽屉时通知ctc组件获取数据
let tableCtcRef = ref()
watch(() => $props.drawerVisiable, (val) => {
  ruleForm.result = $props.ltcExecutionResult === 1 ? 2 : $props.ltcExecutionResult
  console.log($props.ltcExecutionResult, ' $props.ltcExecutionResult')
  if (val) {
    nextTick(() => {
      tableCtcRef.value?.getCtcData()
      tableDescRef.value?.getCtcData()
    })
    // 回显点击下拉框的状态
    if (drawerVisiable.value)ruleForm.result = $props.ltcExecutionResult === 1 ? 2 : $props.ltcExecutionResult
  } else {
    changeShowResultCell(true)
  }
}, { immediate: true, deep: true })

</script>

<style lang="scss" scoped>
  .el-form{
    .el-select{
      width: 100%;
    }
    .el-alert{
      height: 38px;
      width: 54%;
    }
    .upload-item{
      div{
        width: 100%;
      }
      .el-upload__text{
        width: auto;
      }
      .el-upload{
        width: 100%;
      }
    }
  }
  // 下拉选项样式
  .custom-option{
    .option-container{
      display: flex;
      align-items: center;
      .el-icon{
        margin-right: 5px;
      }
    }
  }
</style>
