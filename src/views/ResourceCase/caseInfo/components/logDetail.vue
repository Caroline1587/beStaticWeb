<template>
  <div class="operateLog">
    <div class="logTitle title">{{ t('caoZuoRiZhi') }}</div>
    <div
      id="logTimeLine"
      class="logTimeLine"
    >
      <CustomEmpty
        v-if="props.disabled"
        style="width:100%"
        :description="t('ninMeiYouQuanXianChaKanRiZhiShuJu')" />
      <el-timeline v-else>
        <el-scrollbar v-toTop>
          <CustomEmpty v-if="logData.length === 0" :description="t('zanWuRiZhiShuJu')" />
          <el-timeline-item
            v-for="log in logData"
            v-else
            :key="log.id"
          >
            <div class="logHeader">
              <span>{{ moment(log.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              <span>@{{ log.userId }}</span>
            </div>
            <ul v-if="LOG_TYPE[log.operateType]">
              <li>{{ LOG_TYPE[log.operateType].desc }}</li>
            </ul>
            <ul v-else-if="log.operateType ==='edit'">
              <li
                v-for="(logDetail,key,index) in log.logDetailList"
                :key="index"
              >
                <!-- 普通展开 -->
                <span v-if="logDetail.propType" class="expandLog">
                  <i>{{ TESTCASE_LOG[logDetail.propKey]?.name }}</i>
                  {{ t('faShengLeXiuGai') }} <i
                    class="pointerCursor"
                    :style="`color:${logDetail.valueExpand?'#5DAF34':'#FFC700'}`"
                    @click="logDetail.valueExpand = !logDetail.valueExpand"
                  >
                    {{ logDetail.valueExpand?t('shouQiDuiBi'):t('chaKanDuiBi') }}
                  </i>
                  <div
                    v-if="logDetail.valueExpand"
                    class="tableCompare"
                    style="border:1px dashed #ccc">
                    <messageComps
                      tag-name="div"
                      :style="{border:'1px dashed #FFC700',padding: '0 5px'}"
                      class-name="customListLinkAndImage"
                      :info="logDetail.propKey === 'preConditionDesc' || logDetail.propKey === 'resetDesc'?formatImageHtml(logDetail.oldValue, props.fileObj) : logDetail.oldValue">
                    </messageComps>
                    <messageComps
                      class-name="customListLinkAndImage"
                      tag-name="div"
                      :style="{border:'1px dashed #5DAF34',padding: '0 5px'}"
                      :info="logDetail.propKey === 'preConditionDesc' || logDetail.propKey === 'resetDesc'?formatImageHtml(logDetail.newValue, props.fileObj) :logDetail.newValue">
                    </messageComps>
                  </div>
                </span>
                <!-- 表格展开 -->
                <span v-else-if="logDetail.tablePropType" class="expandLog">
                  <i>{{ TESTCASE_LOG[logDetail.propKey]?.name }}</i>
                  {{ t('faShengLeXiuGai') }} <i
                    class="pointerCursor"
                    :style="`color:${logDetail.compareTableExpand?'#5DAF34':'#FFC700'}`"
                    @click="logDetail.compareTableExpand = !logDetail.compareTableExpand"
                  >
                    {{ logDetail.compareTableExpand?t('shouQiDuiBi'):t('chaKanDuiBi') }}
                  </i>
                  <div
                    v-if="logDetail.compareTableExpand"
                    class="tableCompare"
                    style="border:1px dashed #ccc"
                  >
                    <div style="border:1px dashed #FFC700">
                      <el-table
                      border
                      :data="handleTableData(logDetail.oldValue)"
                      style="width: 100%">
                      <HiTableColumn
                        type="index"
                        width="70"
                        align="center"
                        :label="t('xuHao')"
                      />
                      <HiTableColumn
                        prop="value"
                        :label="TESTCASE_LOG[logDetail.propKey]?.name"
                      >
                        <template #default="scope">
                          <messageComps
                            class-name="customListLinkAndImage"
                            tag-name="div"
                            :info="formatTextHtml(scope.row.value, variablestore.variableOptions, props.fileObj)"></messageComps>
                        </template>
                      </HiTableColumn>
                    </el-table>
                    </div>
                    <div style="border:1px dashed #5DAF34">
                      <el-table
                      border
                      :data="handleTableData(logDetail.newValue)"
                      style="width: 100%">
                      <HiTableColumn
                        type="index"
                        width="70"
                        align="center"
                        :label="t('xuHao')" />
                      <HiTableColumn
                        prop="value"
                        :label="TESTCASE_LOG[logDetail.propKey]?.name"
                      >
                        <template #default="scope">
                          <messageComps
                            class-name="customListLinkAndImage"
                            tag-name="div"
                            :info="formatTextHtml(scope.row.value, variablestore.variableOptions, props.fileObj)"></messageComps>
                        </template>
                      </HiTableColumn>
                    </el-table>
                    </div>
                  </div>
                </span>
                <!-- 标签展示 -->
                <span v-else-if="TESTCASE_LOG[logDetail.propKey]?.name === t('biaoQian')" class="commonLog">
                  <i>{{ TESTCASE_LOG[logDetail.propKey].name }}</i>
                  {{ t('cong') }}<i class="oldValue">
                    <CustomTag
                      v-for="(tag, tagIndex) in logDetail.oldValue?logDetail.oldValue.split(','):[]"
                      :key="tag"
                      :tag-info="tag"
                      :tag-index="tagIndex"
                    />
                    </i>
                  {{ t('xiuGaiWei') }}<i class="newValue">
                    <CustomTag
                      v-for="(tag, tagIndex) in logDetail.newValue?logDetail.newValue.split(','):[]"
                      :key="tag"
                      :tag-info="tag"
                      :tag-index="tagIndex"
                    />
                  </i>
                </span>
                <!-- 普通展示 -->
                <span v-else class="commonLog">
                  <i>{{ TESTCASE_LOG[logDetail.propKey]?.name }}</i>
                  {{ t('cong') }} <i class="oldValue">"{{ handleValueByPropKey(logDetail.propKey, logDetail.oldValue) }}"</i>
                  {{ t('xiuGaiWei') }}<i class="newValue">"{{ handleValueByPropKey(logDetail.propKey, logDetail.newValue) }}"</i>
                </span>
              </li>
            </ul>
            <ul v-if="log.operateType ==='deleteFile'||log.operateType ==='uploadFile'||log.operateType ==='downloadFile'">
              <li class="fileLog">
                <i>{{ `${TESTCASE_LOG[log.operateType].name}${handleFileByNotes(log.notes)}${t('wenJian')}` }}</i>
                <i>{{ beforeFileNameShow(log.notes.split('#')[1]) }}</i>
              </li>
            </ul>
            <ul v-else-if="log.operateType ==='syncFile'">
              <li class="fileLog">
                <i>{{ `${TESTCASE_LOG[log.operateType].name}` }}</i>
                <i>{{ beforeFileNameShow(log.notes.split('#')[1].split(' applicant')[0]) }}</i>
              </li>
            </ul>
          </el-timeline-item>
        </el-scrollbar>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { queryLogs } from '@/api/commonApi'
  import { routeParamsStore, variableStore } from '@/store/index'
  import { LogDataType } from '@/utils/types/commonType'
  import { TESTCASE_LOG, LOG_TYPE } from '@/utils/constant'
  import { formatTextHtml, formatImageHtml } from '@/views/ResourceCase/addTestcase/components/transHtml'
  import { beforeFileNameShow } from '@/utils/public'
  import moment from 'moment'
  import useRenderHtml from '@/views/common/useRenderHtml'
  import CustomEmpty from "@/components/CustomEmpty/index.vue"
  
  const { handleComps } = useRenderHtml()
  const messageComps:any = handleComps()
  const routeparamsstore = routeParamsStore()
  const variablestore = variableStore()
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    fileObj:{[key:string]:string}
    disabled:boolean
  }>(), {
    disabled () {
      return false
    }
  })
  const logData = ref<LogDataType[]>([])
  const getLogsInfo = () => {
    loadingStart({ target: '#logTimeLine' })
    queryLogs({ id: routeparamsstore.caseInfo.caseId }).then(res => {
      logData.value = res.data.result
      logData.value.forEach((log) => {
        if (log.operateType === 'syncFile') {
          log.userId = log.notes.split('applicant#')[1]
        } else if (log.logDetailList) {
          log.logDetailList = log.logDetailList.filter(detail => {
            if (!TESTCASE_LOG[detail.propKey]) {
              return false
            }
            if (handleTypeByProp(detail.propKey)) {
              detail.valueExpand = false
              detail.propType = true
            } else if (handleTableTypeByProp(detail.propKey)) {
              detail.compareTableExpand = false
              detail.tablePropType = true
            }
            return true
          })
        }
      })
    loadingClose()
    }).catch()
  }
  // 处理展示形式是否需要展开框显示
  const handleTypeByProp = (prop:string) => {
     return prop === 'description' || prop === 'preConditionDesc' || prop === 'resetDesc'
  }
  // 处理展示形式是否需要展开框+表格显示
  const handleTableTypeByProp = (prop:string) => {
     return prop === 'testcaseStep' || prop === 'expectResult'
  }
  // 处理新旧数据
  const handleValueByPropKey = (propKey:string, value:any) => {
   if (TESTCASE_LOG[propKey]?.constant) {
    return TESTCASE_LOG[propKey].constant[value]
   } else {
    return value
   }
  }
  // 处理文件数据
  const handleFileByNotes = (notes:string) => {
    if (notes.split('#')[0] === 'testcaseSeqFile') {
      return t('xuLie')
    }
    return ''
  }
  // 处理表格中数据修改后的展示效果
  const handleTableData = (notes:string) => {
    notes = notes.substring(0, notes.lastIndexOf('@'))
    return notes.split('@').map(item => {
      return {
        value: item
      }
    })
  }
  defineExpose({
    getLogsInfo
  })
</script>
<style
  lang='scss'
  scoped
>
.operateLog{
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 20px 15px;
  z-index: 5;
  display: flex;
  flex-direction: column;
}
.logTitle{
  height: 18px;
  font-style: normal;
  font-size: 16px;
  line-height: 16px;
  margin-left: 3px;
  white-space: nowrap;
  overflow: hidden;
}
.logTimeLine{
  flex: 1;
  overflow: hidden;
  padding-top:20px;
  display: flex;
  width: 100%;
  :deep(.el-timeline-item__content){
    white-space: nowrap;
    p{
      margin-top:10px;
      span{ line-height: 25px; }
    }
  }
}
.el-timeline{
  width: 100%;
  min-width: 270px;
}
.el-timeline-item{
  white-space: pre-wrap;
  word-break: break-all;
  padding-bottom: 0px;
  .logHeader{
    min-height: 20px;
    >span:first-child{
      color:$--global--regular--text--color;
      background-color: #F6F6F6;
      border-radius: 4px;
      padding:3px 8px;
      font-size: 12px;
      margin-right: 10px;
    }
    >span:last-child{
      color: var(--el-color-primary);
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
  ul{
    padding:5px 0px;
    word-break: break-all;
    li{
      margin:10px 0;
      display: flex;
      flex-wrap: wrap;
      i{
        white-space: pre-wrap;
        word-break: break-all;
      }
      .commonLog{
        display: flex;
        flex-wrap: wrap;
        i{
          white-space: pre-wrap;
          word-break: break-all;
          margin:0 5px;
        }
        >i:first-child{
          color: var(--el-color-primary);
        }
      }
      .expandLog{
        line-height: 2;
        i{
          margin:0 5px;
          min-width: 40px;
          display: inline-block;
        }
        >i:first-child{
          color: var(--el-color-primary);
        }
        >div{
          margin-top: 5px;
          min-width: 10px;
          border-radius: 4px;
        }
      }
      .tagsLog{
        display: flex;
        flex-wrap: wrap;
        line-height: 2;
        .el-tag{
          margin: 2px;
          white-space: pre-wrap;
          padding: 0px 6px;
          height: auto;
          line-height: 1.5;
        }
      }
    }
    .fileLog{
      i{
        margin:0 5px;
      }
      >i:last-child{
        color: #5DAF34;
      }
    }
    .tableCompare{
      padding: 5px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      >div{
        line-height: 2;
        width: 100%;
        padding: 0 5px;
        white-space: pre-wrap;
        min-height: 30px;
      }
      >div+div{
        margin-top: 10px;
      }
    }
  }
}
</style>
