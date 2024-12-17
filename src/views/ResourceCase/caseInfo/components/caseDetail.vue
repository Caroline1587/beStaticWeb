<template>
  <el-container class="common">
    <el-main>
      <el-scrollbar v-toTop>
        <el-container class="container">
          <el-header style="padding:0 5px">
            <ul>
              <li
                v-for="(key,index) in Object.keys(caseInfoLabel)"
                :key="index"
                :class="`${key === 'description'||key === 'tags' ? 'fullItem':''}`">
                <label>{{ caseInfoLabel[key] }}：</label>
                <span v-if="key === 'tags'">
                  <CustomTag
                    v-for="(tag, tagIndex) in caseInfo[key]?caseInfo[key].split(','):[]"
                    :key="tagIndex"
                    :tag-info="tag"
                    :tag-index="tagIndex"
                    style="margin:0 2px 4px 2px"
                  />
                </span>
                <span v-else-if="key === 'requirement'">
                  <el-link
                    v-if="props.requires[0]?.sourceType===0"
                    type="primary"
                    link
                    href="javascript:void(0)"
                    target="_blank"
                    @click="toNewPage(props.requires[0]?.sourceUrl)">
                    {{ requireMsg }}
                  </el-link>
                  <span v-else>{{ requireMsg }}</span>
                </span>
                <span v-else>{{ caseInfo[key] }}</span>
              </li>
            </ul>
          </el-header>
          <el-main style="padding:0 5px">
            <el-tabs
              v-model="activeDescName"
            >
              <el-tab-pane :label="props.allCaseInfo.templateType ===1 ?t('yongLiMiaoShu') : t('luoJiYongLi')" name="ltc">
                <ltcList
                  ref="ltcRef"
                  :type="props.allCaseInfo.templateType?props.allCaseInfo.templateType:1"
                  :ltc-info="ltcInfo"
                  :ltc-data="ltcData" />
              </el-tab-pane>
              <el-tab-pane
                v-if="props.allCaseInfo.templateType!==1"
                :label="t('juTiYongLi')"
                name="ctc">
                <ctcList
                  :editable="false"
                  :table-data="ctcData"
                  :table-column="ctcColumn"
                  @get-current-ctc-data="getCurrentTableRow"
                />
              </el-tab-pane>
            </el-tabs>
          </el-main>
        </el-container>
      </el-scrollbar>
    </el-main>
    <el-aside>
      <ltcAside
        v-show="activeDescName==='ltc' || props.allCaseInfo.templateType===1"
        v-bind="$attrs"
        type="view"
        :role="props.role"
      />
      <ctcAside
        v-show="activeDescName==='ctc' && props.allCaseInfo.templateType!==1"
        type="view"
        :editable="false"
        :ltc-info="ltcInfo"
        :ltc-data="ltcData"
        :current-ctc-row="currentRowData" />
    </el-aside>
  </el-container>
</template>

<script lang="ts" setup>
  import ctcList from '../../addTestcase/components/ctcList.vue'
  import ltcList from '../../addTestcase/components/ltcList.vue'
  import ltcAside from '../../addTestcase/components/ltcAside.vue'
  import ctcAside from '../../addTestcase/components/ctcAside.vue'
  import { CtcDataType, TableColumn, TableData, LtcTableDataType, CaseRequiresType } from '@/utils/types/testcaseType'
  import { getCtcData } from '@/views/ResourceCase/addTestcase/components/caseDtailData'
  import { useRouter } from 'vue-router'
  import { warningMessage } from '@/utils/message'
  import { TESTCASE_TEMPLATETYPE, TESTCASE_TESTTYPE } from '@/utils/constant'
  const { t } = useI18n()
  const router = useRouter()
  const sourceType = ref<string>(router.currentRoute.value.meta.source as string)
  // import { routeParamsStore } from '@/store/index'
  // const routeparamsstore = routeParamsStore()

  const props = withDefaults(defineProps<{
    allCaseInfo:any
    ltcInfo:{
      preConditionDesc:string
      resetDesc: string
      testStep: string
    },
    ltcData:LtcTableDataType[]
    ctcData:CtcDataType[]
    requires?: CaseRequiresType[]
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
    requires () {
      return []
    }
  })
  const caseInfo = computed(() => {
    return {
      ...props.allCaseInfo,
      templateType: TESTCASE_TEMPLATETYPE[props.allCaseInfo.templateType],
      testType: TESTCASE_TESTTYPE[props.allCaseInfo.testType]
    }
  })
  const toNewPage = (value:string) => {
    if (value) {
      window.open(value, '_blank')
    } else {
      warningMessage(t('guanLianXuQiuWeiBaoHanTiaoZhuanDiZhi'))
    }
  }
  const ltcData = ref<LtcTableDataType[]>([])
  // 基本信息
  const activeDescName = ref('ltc')
  const caseInfoLabel = ref<{[key:string]:string}>({
    templateType: t('yongLiMoBan'),
    testType: t('ceShiLeiXing'),
    requirement: t('guanLianXuQiu'),
    priority: t('youXianJi'),
    description: t('miaoShuXinXi'),
    tags: t('biaoQian')
  })
  const requireMsg = computed(() => {
    let msg = ''
    props.requires?.forEach((item, index) => {
        msg += `${item.requireNumber}${index === (props.requires.length - 1) ? '' : ';'}`
      })
    return msg
  })
  // 具体用例侧边展示信息
  const ltcRef = ref()
  const currentRowData = ref<any>({ ctcNum: { value: '', hightLight: 0 } })
  const getCurrentTableRow = (row:any) => {
    currentRowData.value = row
  }

  watch(() => props.ltcData, (val) => {
    activeDescName.value = 'ltc'
    ltcData.value = val
  }, { deep: true, immediate: true })
  const ctcData = ref<TableData[]>([])
  let ctcColumn = ref<TableColumn[]>([])
  watch(() => props.ctcData, (val) => {
    let data:any = getCtcData(val)
    ctcData.value = data.ctcData
    ctcColumn.value = data.ctcColumn
    currentRowData.value = ctcData.value[0] ? ctcData.value[0] : { ctcNum: { value: t('zanWuShuJu'), hightLight: 0 } }
  }, { deep: true, immediate: true })
  onMounted(() => {
    if (sourceType.value !== 'testcase_project') {
      delete caseInfoLabel.value.requirement
    }
  })
</script>
<style
  lang='scss'
  scoped
>
   .common{
    width: 100%;
    >.el-main{
      padding: 0;
    }
    .container{
      padding-right:10px
    }
    .el-header{
      height: auto;
      /* max-height: 150px; */
      overflow-y:auto ;
      ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li{
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          >span{
            color: #828A99;
            word-break: break-all;
          }
        }
        .fullItem{
          width: 100%;
          display: block;
          label{
            width: 80px;
          }
        }
      }
    }
    .el-aside{
      width: 260px;
    }
    .mainTabs{
      height: 100%;
      display: flex;
      /* flex-direction: column; */
      :deep(.el-tabs__content){
        flex:1
      }
      :deep(.el-tab-pane){
        height: 100%;
      }
    }
  }
</style>
