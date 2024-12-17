<template>
  <el-form
    ref="testcaseFormRef"
    :model="testcaseForm"
    :rules="rules"
    :inline="true"
    label-position="top"
    label-width="80px"
    class="el-case-form"
  >
    <el-form-item :label="t('yongLiBianHao')" prop="testcaseNumber">
      <el-input
        ref="numberInputRef"
        v-model="testcaseForm.testcaseNumber"
        :disabled="props.disabled"
        :maxlength="150"
        show-word-limit />
    </el-form-item>
    <el-form-item :label="t('yongLiMingCheng')" prop="testcaseName">
      <el-input
        v-model="testcaseForm.testcaseName"
        :maxlength="500"
        show-word-limit
        :disabled="props.disabled" />
    </el-form-item>
    <el-form-item :label="t('yongLiMoBan')" prop="templateType">
      <el-select
        v-model="testcaseForm.templateType"
        :placeholder="t('qingXuanZe')"
        :disabled="props.disabled"
      >
        <el-option :value="2" :label="t('ceShiXuLie')" />
        <el-option :value="1" :label="t('ceShiWenBen')" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('ceShiLeiXing')" prop="testType">
      <el-select
        v-model="testcaseForm.testType"
        multiple
        collapse-tags
        collapse-tags-tooltip
        :placeholder="t('qingXuanZe')"
        :disabled="props.disabled"
      >
        <el-option :value="1" :label="t('ziDongCeShi')" />
        <el-option :value="2" :label="t('shouDongCeShi')" />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="showRequires"
      :label="t('guanLianXuQiu')"
      prop="requireNumber"
    >
      <!-- v-if="!BASEPATH.VITE_BASE_API_STAR_CHAIN?.OPEN" -->
      <el-input v-model="testcaseForm.requireNumber" :readonly="starFlag" @click="dialogVisible = true" />
      <!-- <el-button type="primary">进行选择...</el-button> -->
      <!-- <div class="el-input el-input__wrapper formDiv">
        <el-tag>
          <el-icon @click="addRequirement"><Plus /></el-icon>
        </el-tag>
      </div> -->
    </el-form-item>
    <el-form-item :label="t('youXianJi')" prop="priority">
      <PrioritySelect v-model="testcaseForm.priority" :disabled="props.disabled" :edit="route.meta.status === 'edit'" />
      <!-- <el-select
        v-model="testcaseForm.priority"
        :placeholder="t('qingXuanZe')"
        :disabled="props.disabled"
      >
      <el-option :value="3" label="高" />
        <el-option :value="2" label="中" />
        <el-option :value="1" label="低" />
      </el-select> -->
    </el-form-item>
    <el-form-item
      style="width:100%"
      :label="t('miaoShuXinXi')"
      prop="description"
    >
      <el-input
        v-model="testcaseForm.description"
        :disabled="props.disabled"
        :maxlength="500"
        show-word-limit />
    </el-form-item>
    <el-form-item
      style="width:100%"
      :label="t('biaoQian')"
      prop="tags"
    >
      <TagsSelect
        v-model:value="testcaseForm.tags"
        separation=","
        :disabled="props.disabled"
      />
    </el-form-item>
  </el-form>
  <!-- 如若是开启了星链集成并且关联了星链项目则有选择弹窗 -->
  <dialog-require
    v-if="starFlag"
    v-model:dialog="dialogVisible"
    :require-number="testcaseForm.requireNumber"
    @change-require-number="changeRequireNumber"
  />
</template>

<script lang="ts" setup>
  import dialogRequire from './dialogRequire.vue'
  import { computed, reactive, ref, onMounted } from 'vue'
  import PrioritySelect from '@/views/ResourceCase/caseList/components/PrioritySelect.vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { routeParamsStore } from '@/store/index'
  import { checkTestcaseNum } from '@/api/testcaseApi'
  import { getUserAndGroupList } from '@/api/commonApi'
  import Storage from '@/utils/storage'

  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const { t } = useI18n()
  const BASEPATH = Storage.localGet('ApiUrl')
  const routeparamsstore = routeParamsStore()
  const route = useRoute()
  const props = withDefaults(defineProps<{
    testcaseForm:any,
    oldName?:string,
    disabled?:boolean,
    showRequires?:boolean,
    caseType:'testcase_library'|'testcase_project'
  }>(), {
    oldName () {
      return ''
    },
    showRequires () {
      return true
    },
    disabled () {
      return false
    }
  })
  const numberInputRef = ref()
  const testcaseFormRef = ref<FormInstance>()
  const testcaseForm = computed(() => {
    return props.testcaseForm
  })
  const checkSpecialCharacter = (value:string) => {
  const rule = /(^\s+)|(["'<>\\/]+)|(\s+$)/gi
  return rule.test(value)
}
  const msg = t('qianHouBuNengYouKongGeQieBuNengShuRuYiXiaTeShuZiFu')
  const checkNumber = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error(t('qingShuRuYongLiMingCheng')))
    } else if (props.oldName === value) {
      callback()
    } else if (checkSpecialCharacter(value)) {
      callback(new Error(msg))
    } else {
      let rootId = currentDataId
      let params = { rootId, testcaseNumber: value }
      checkTestcaseNum(params).then(response => {
        if (response.data) {
          callback(new Error(t('ceShiYongLiBianHaoYiCunZai')))
        } else {
          callback()
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }
  const checkName = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback()
    } else if (checkSpecialCharacter(value)) {
      callback(new Error(msg))
    } else {
      callback()
    }
  }
  // const checkSpecialCharacter = (value:string, reg:string) => {
  //   const rule = new RegExp(reg, 'gi')
  //   if (!rule.test(value)) {
  //     return true
  //   }
  //   return false
  // }
  // const checkSpecialCharacter1 = (value:string) => {
  //   const rule = /^[/\\A-Za-z0-9_-]+$/gi
  //   if (!rule.test(value)) {
  //     return true
  //   }
  //   return false
  // }
  const rules = reactive<FormRules>({
    testcaseNumber: [
      { required: true, message: t('qingShuRuCeShiYongLiBianHao'), trigger: 'blur' },
      { max: 150, message: t('ceShiYongLiBianHaoChangDuShangXianWei_150ZiFu'), trigger: 'blur' },
      { validator: checkNumber, trigger: 'blur' }
    ],
    testcaseName: [
      { min: 0, max: 500, message: t('ceShiYongLiMingChengBuNengChaoGuo_500ZiFu'), trigger: 'blur' },
      { validator: checkName, trigger: 'blur' }
    ],
    priority: [
      {
        required: true,
        message: t('qingXuanZeYouXianJi'),
        trigger: 'blur'
      }
    ],
    testType: [
      {
        type: 'array',
        required: true,
        message: t('qingXuanZeCeShiLeiXing'),
        trigger: 'change'
      }
    ],
    templateType: [
      {
        required: true,
        message: t('qingXuanZeYongLiMoBan'),
        trigger: 'blur'
      }
    ],
    description: [
      { min: 0, max: 500, message: t('ceShiYongLiMiaoShuBuNengChaoGuo_500ZiFu'), trigger: 'blur' }
    ]
  })

  // 关联需求dialog
  const starFlag = computed(() => {
    let falg = BASEPATH.VITE_BASE_API_STAR_CHAIN?.OPEN && routeparamsstore.caseInfo.associatedProject
    return falg ? true : false
  })
  const dialogVisible = ref(false)
  // 弹窗点击确定更改选择的关联需求
  const changeRequireNumber = (requireNumber:string, sourceUrl:string) => {
    testcaseForm.value.requireNumber = requireNumber
    testcaseForm.value.sourceUrl = sourceUrl
  }
  const allUser = ref([])
  const getAllUser = () => {
    getUserAndGroupList({ funcType: '' }).then(res => {
      allUser.value = res.data.uncheckUser
    }).catch()
  }
  onMounted(() => {
    getAllUser()
    // if (starFlag.value) testcaseForm.value.sourceType = 0
  })
  defineExpose({
    testcaseFormRef,
    numberInputRef
  })
</script>
