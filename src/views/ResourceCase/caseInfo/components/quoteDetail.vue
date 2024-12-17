<template>
  <el-container>
    <el-header>
      <messageComps tag-name="span" :info="t('gaiCeShiYongLiYiGongBeiPageinfototalrecordGeXiangMuYinYong',[`<i>${pageInfo.totalRecord }</i>`])"></messageComps>
    </el-header>
    <el-main>
      <CustomTable
        :table-data="tableData"
        :show-pagination="true"
        :page-info="pageInfo"
        :border="false"
        col-type="index"
        @change-sort-rules="changeSortRules"
        @change-page-info="changePageInfo"
      >
        <HiTableColumn
          :label="t('xiangMuMingCheng')"
          sortable="custom"
          property="projectName"
          min-width="150px"
          show-overflow-tooltip
        >
        </HiTableColumn>
        <HiTableColumn
          v-for="item in tableAllProps"
          :key="item.prop"
          :label="item.label"
          :sortable="item.sortable"
          :property="item.prop"
          min-width="150px"
          show-overflow-tooltip
        >
        </HiTableColumn>
      </CustomTable>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
  import { TablePropsType, PageInfoPropsType, PageInfoEmitType } from '@/utils/types/commonType'
  import { getlinkedProject } from '@/api/testcaseApi'
  import { routeParamsStore } from '@/store/index'
  import { toUnderLine } from '@/utils/public'
  import moment from 'moment'
  import useRenderHtml from '@/views/common/useRenderHtml'
  const { handleComps } = useRenderHtml()
  const messageComps:any = handleComps()
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    reload?:boolean
  }>(), {
    reload () {
      return false
    }
  })
  const routeparamsstore = routeParamsStore()
  const tableData = ref<any>([])
  // 表格分页
  const pageInfo = ref<PageInfoPropsType>({
    pageNo: 1,
    pageSize: 20,
    totalPage: 0,
    totalRecord: 0
  })
  const changePageInfo = (page:PageInfoEmitType) => {
    pageInfo.value.pageNo = page.pageNo
    pageInfo.value.pageSize = page.pageSize
    getProjectInfo()
  }
  // 控制表格展示列
  const tableAllProps:TablePropsType[] = [
    {
      label: t('xiangMuJianJie'),
      prop: 'projectDescription'
    },
    {
      label: t('chuangJianRen'),
      prop: 'createUserName',
      sortable: 'custom'
    },
    {
      label: t('chuangJianShiJian'),
      prop: 'createTime',
      sortable: 'custom'
    }
  ]
  let caseListOrderBy = ''
  const changeSortRules = (prop:string, order:string) => {
    caseListOrderBy = toUnderLine(prop)
    if (prop === 'createUserName' || prop === 'createTime') {
      caseListOrderBy = prop
    }
    order === 'ascending' ? caseListOrderBy += '' : caseListOrderBy += ' desc'
    getProjectInfo()
  }
  const getProjectInfo = () => {
    let params = {
      pageNo: pageInfo.value.pageNo,
      pageSize: pageInfo.value.pageSize,
      orderBy: caseListOrderBy,
      params: JSON.stringify({ libraryId: routeparamsstore.caseInfo.caseId })
    }
    getlinkedProject(params).then(res => {
      Object.keys(pageInfo.value).forEach(item => {
        pageInfo.value[item] = res.data.pageBean[item]
      })
      tableData.value = res.data.projectList
      tableData.value.forEach((item:any) => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      })
    }).catch()
  }
  watch(() => props.reload, (newValue) => {
    if (newValue) {
      getProjectInfo()
    }
  }, { immediate: true })
  onMounted(() => {
    getProjectInfo()
  })
</script>
<style
  lang='scss'
  scoped
>
  .el-container{
    width: 100%;
    .el-header{
      padding: 0;
      height: 32px;
      font-size: 14px;
      i{
        color: blue;
        font-size: 30px;
      }
    }
    .el-main{
      padding: 0;
      display: flex;
      flex-direction: column;
      .tableHeader{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 10px 0 15px;
        :deep(.el-button){
          height: 30px;
        }
      }
      .tableMain{
        flex:1;
        :deep(.el-footer){
          padding:0 10px 0 15px
        }
      }
    }
  }
</style>
