<template>
	<el-container class="aside-table-layout">
    <el-aside>
      <AsideFilterView ref="listAsideRef" view-type="resource_library">
				<template #filterViewField="{data}">
					<el-form-item :label="t('shiTuLeiXing')" prop="type">
					<TypeBtn ref="typeBtnRef" v-model:list-type="data.filterFormData.showType" display="select"></TypeBtn>
				</el-form-item>
				<el-form-item :label="t('zuoYongFanWei')" prop="show" style="width:auto">
					<ShowBtn v-model:show-scope="data.filterFormData.showScope" display="select"></ShowBtn>
				</el-form-item>
				</template>
				<template #filterForm="{data}">
					<FilterForm v-model:filter-data="data.filterFormData" />
				</template>
			</AsideFilterView>
    </el-aside>
	<el-container class="common-table-layout">
		<el-header>
			<span class="ellipsis" :title="routeparamsstore.filterView.filterViewName">{{ routeparamsstore.filterView.filterViewName }}</span>
			<div class="btn-container">
				<filterButton>
					<TypeBtn
						v-model:list-type="globalparamsstore.specialFilterFormData.showType"
						display="dropMenu"
						@before-change-filter="beforeChangeFilter"
						@change-type="submitForm"
					/>
					<el-button
						:disabled="!enableLibAdd"
						class="blue-button"
						style="margin:0 10px;"
						@click="toAddLib"
					>
						<el-icon style="margin-right:2px;" :size="16"><Plus /></el-icon>
						{{ t('xinJianYongLiKu') }}
					</el-button>
				</filterButton>
			</div>
		</el-header>
		<el-main>
			<SearchDrawer
				v-model:drawer-visiable="globalparamsstore.showAdvanceSearch"
				height="170px"
				@submit-form="submitForm"
			>
				<FilterForm ref="filterFormRef" :filter-data="globalparamsstore.tempFilterFormData" />
			</SearchDrawer>
			<CustomEmpty v-if="tableData.length===0"></CustomEmpty>
			<el-scrollbar v-else>
				<tableInfo
					v-if="cardOrTable==='table'"
					:card-data="tableData"
					@to-lib-list="toCaseList"
					@watch-lib="watchLib"
				/>
				<cardInfo
					v-else
					:card-data="tableData"
					@to-lib-list="toCaseList"
					@watch-lib="watchLib"
				/>
			</el-scrollbar>
		</el-main>
		<el-footer>
			<el-pagination
				v-model:current-page="pageInfo.pageNo"
				v-model:page-size="pageInfo.pageSize"
				:page-sizes="[20, 50, 100, 200]"
				size="small"
				layout="total, sizes, ->, prev, pager, next, jumper"
				:total="pageInfo.totalRecord"
				@size-change="(pageSize:number) => {changePageInfo({
          pageNo: pageInfo.pageNo,
          pageSize
          })
        }"
				@current-change="(pageNo:number) => {changePageInfo({
          pageNo: pageNo,
          pageSize:pageInfo.pageSize,
          })
        }"
			/>
		</el-footer>
		<addCaseLib ref="addCaseLibRef" @init-list="initList" />
	</el-container>
	</el-container>
</template>
<script
  setup
  lang="ts"
>
import { Plus } from '@element-plus/icons-vue'
import { getResourceLibrary, addWatchLibrary, deleteWatchLibrary } from '@/api/caseLibApi'
import { routeParamsStore, globalParamsStore } from '@/store/index'
import { setCurrentDataId } from '@/utils/setGlobalStates'
import useFilterNotice from '@/views/common/AsideFilterView/useFilterNotice'
import FilterForm from '@/views/ResourceCase/caseLib/components/AsideViewComponents/FilterForm.vue'
import tableInfo from './components/tableInfo.vue'
import cardInfo from './components/cardInfo.vue'
import addCaseLib from './components/addCaseLib.vue'
import TypeBtn from '@/views/ResourceCase/caseLib/components/AsideViewComponents/TypeBtn.vue'
import ShowBtn from '@/views/ResourceCase/caseLib/components/AsideViewComponents/ShowBtn.vue'
import moment from 'moment'
import Storage from '@/utils/storage'
import usePermission from '@/views/common/usePermission'
import filterButton from '@/views/common/filterButton.vue'
import useRequestList from '@/views/common/useRequestList'
import AsideFilterView from '@/views/common/AsideFilterView/index.vue'
import CustomEmpty from "@/components/CustomEmpty/index.vue"

const { enableLibAdd } = usePermission('testcase_library')
const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
const routeparamsstore = routeParamsStore()
const globalparamsstore = globalParamsStore()
const router = useRouter()
const { t } = useI18n()
// 高级筛选
globalparamsstore.specialFilterFormData = {
	showScope: 'all',
	showType: 'board'
}
const { submitForm, filterFormRef, beforeChangeFilter, listAsideRef } = useFilterNotice()
// 获取数据
const initTable = () => {
	let order = 'modify_time desc'
	let caseLibParams:any = {
		userId: USERINFO.id,
		libraryType: 1,
		libraryName: globalparamsstore.filterKey,
		showScope: globalparamsstore.specialFilterFormData.showScope === 'all' ? 0 : 1
	}
	if (globalparamsstore.filterKey) {
		caseLibParams = {
			...caseLibParams,
			libraryName: globalparamsstore.filterKey,
			queryType: 2
		}
	} else {
		caseLibParams = {
			...caseLibParams,
			...globalparamsstore.handledFilterFormData,
			createTime1: globalparamsstore.handledFilterFormData.startCreateTime,
      createTime2: globalparamsstore.handledFilterFormData.endCreateTime
		}
	}

	const params = {
		pageSize: pageInfo.value.pageSize,
		pageNo: pageInfo.value.pageNo,
		orderBy: order,
		params: JSON.stringify(caseLibParams)
	}
	return new Promise((resolve, reject) => {
		getResourceLibrary(params).then(res => {
			pageInfo.value.totalRecord = res.data.totalRecord
			res.data.resultList.forEach((item:any) => {
				item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
				item.modifyTime = moment(item.modifyTime).format('YYYY-MM-DD HH:mm:ss')
			})
			resolve(res.data.resultList)
		}).catch(err => {
			reject(err)
		})
	})
}
const { tableData, pageInfo, initList, changePageInfo } = useRequestList(initTable, 'testcaseLibraryList')
const cardOrTable = computed(() => {
	return globalparamsstore.specialFilterFormData.showType
})
// 添加
const addCaseLibRef = ref()
const toAddLib = () => {
	addCaseLibRef.value.show()
}
const watchLib = async (id:string, isAddWatch:boolean) => {
	// 收藏功能
	const params = { userId: USERINFO.id, id }
	isAddWatch ? await addWatchLibrary(params) : await deleteWatchLibrary(params)
	initList()
}

const toCaseList = (id: string) => {
	routeparamsstore.caseInfo.resourceFolderId = ''
  // 通知主应用id
	setCurrentDataId(id)
	router.push(`/TPA/testCase/${id}/libraryCase/info`)
}
</script>
<style
  lang='scss'
  scoped
>
	.el-header {
		border:0!important;
	}
	.el-main {
		background-color: #FBFBFD;
	}
	.el-footer{
		height: 40px;
		background-color: #FBFBFD;
	}
</style>
