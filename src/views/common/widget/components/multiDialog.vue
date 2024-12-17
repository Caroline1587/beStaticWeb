<template>
  <tipDialogV5
    ref="tipDialogV5Ref"
    :title="t('tianJiaChengYuan')"
    :width="800"
    destroy-on-close
    @closed="resetData"
  >
    <template #default>
      <div class="globalBody">
        <div class="container">
          <div class="left">
            <el-popover
              placement="bottom"
              trigger="click"
              width="328"
            >
              <template #reference>
                <div>
                  <el-input
                    v-model="filterDeptKey"
                    :placeholder="t('souSuoChengYuan')"
                    :prefix-icon="Search"
                    clearable
                    @input="debounceRemote"
                    @keydown.stop="keyupspace"
                  />
                </div>
              </template>
              <el-tree-v2
                class="selectTree"
                :data="props.userOptions"
                show-checkbox
                :props="props.treeProps"
                :default-checked-keys="checkedIdsArr"
                :height="300"
                node-key="id"
                :item-size="56"
                :empty-text="t('meiYouFuHeTiaoJianDeYongHu')"
                @check-change="changeChecked"
              >
                <template #default="{ data }">
                  <GenderAvatar
                    :gender="data.gender"
                    :info="data.realName"
                    :hidden-info="true"
                  ></GenderAvatar>
                  <div class="center mainItem">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="data.realName"
                      :show-after="1000"
                      placement="top"
                    >
                      <span class="realName">
                        <span class="ellipsis"> {{ data.realName }}</span>
                        <span v-if="data.myself" class="myself">{{ t('woZiJi') }}</span>
                      </span>
                    </el-tooltip>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="data.username"
                      :show-after="1000"
                      placement="top"
                    >
                      <span class="ellipsis userName"> {{ t('yongHuMingDatausername', [data.username]) }}</span>
                    </el-tooltip>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="formatPath(data.deptPathName)"
                      :show-after="1000"
                      placement="top"
                    >
                      <span class="ellipsis userName"> {{ formatPath(data.deptPathName) }}</span>
                    </el-tooltip>
                  </div>
                </template>
              </el-tree-v2>
            </el-popover>
            <span class="mainHeader">
              <el-icon v-if="!showTypeInfo" @click="backHome"><ArrowLeft /></el-icon>
              <span :title="props.mainTitle">{{ props.mainTitle }}</span>
            </span>
            <!-- 弹窗首页展示 -->
            <div v-if="showTypeInfo">
              <ul class="typeList">
                <li
                  v-for="(item, index) in props.dialogTypeInfo"
                  :key="index"
                  @click="changeType(item)"
                >
                  <span>{{ item }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </li>
              </ul>
            </div>
            <!-- 弹窗数据展示 -->
            <div v-else>
              <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item>
                  <span class="breadcrumbContext first" @click="toLevel(true)">{{ currentType }}</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item
                  v-for="(item, index) in breadcrumbData"
                  :key="item.id"
                >
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content="item.name"
                    :show-after="1000"
                    placement="top"
                  >
                    <span class="breadcrumbContext" @click="toLevel(false, index, item)">{{ item.name }}</span>
                  </el-tooltip>
                </el-breadcrumb-item>
              </el-breadcrumb>
              <el-tree-v2
                :data="listData"
                show-checkbox
                :height="320"
                :item-size="32"
                :props="props.treeProps"
                :default-checked-keys="checkedIdsArr"
                @check-change="changeChecked"
              >
                <template #default="{ data }">
                  <el-avatar v-if="data.hasNextLevel&&data.deptType" :size="24" shape="square">
                    <el-icon :size="16">
                      <svg-icon :icon-class="`${data.deptType ==='1'?icon.treeDepartmentNodeIcon:icon.treeOrganizationNodeIcon}`"></svg-icon>
                    </el-icon>
                  </el-avatar>
                  <el-avatar v-else-if="data.hasNextLevel" :size="24" shape="square">
                    {{ data.name?data.name.substring(0,1):'' }}
                  </el-avatar>
                  <GenderAvatar
                    v-else
                    :gender="data.gender"
                    :info="data.name"
                    :hidden-info="true">
                  </GenderAvatar>
                  <span class="center flex-center">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      :content="data.hasNextLevel ? data.name +' ('+data.number+')' : data.name"
                      :show-after="1000"
                      placement="top"
                    >
                      <span class="ellipsis"> {{ data.hasNextLevel ? data.name +' ('+data.number+')' : data.name }}</span>
                    </el-tooltip>
                  </span>
                  <span
                    v-if="data.hasNextLevel"
                    class="last"
                    @click="nextLevel(data)"
                  >
                    <i>{{ t('xiaJi') }}</i>
                  </span>
                  <span v-else-if="data.myself" class="myself">{{ t('woZiJi') }}</span>
                </template>
              </el-tree-v2>
            </div>
          </div>
          <div class="right">
            <span>{{ t('yiXuanZeCheckeditemlengthalluserlength', [`${checkedItem.length}/${allUser.length}`]) }}</span>
            <el-scrollbar>
              <ul>
                <li
                  v-for="item in checkedItem"
                  :key="item.id"
                  class="hover_bg"
                >
                  <GenderAvatar :gender="item.gender" :info="item.name" :hidden-info="true"></GenderAvatar>
                  <span class="center flex-center"> {{ item.name }}</span>
                  <el-icon @click="cancelChecked(item)"><Close /></el-icon>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <el-button class="grey-liner-button" @click="tipDialogV5Ref.dialogVisible = false">{{ t('quXiao') }}</el-button>
      <el-button class="blue-button" @click="confim">{{ t('queRen') }}</el-button>
    </template>
  </tipDialogV5>
</template>
<script
  setup
  lang="ts"
>
  import { ArrowRight, Close, Search, ArrowLeft } from '@element-plus/icons-vue'
  import { getGroupUser } from '@/api/commonApi'
  import { debounce } from '@/utils/public'
  import { errorMessage } from '@/utils/message'
  import GenderAvatar from '@/views/common/GenderAvatar.vue'
  const { t } = useI18n()
  type listDataType = {
    name:string
    id:string
    realName:string
    gender:string
    hasNextLevel:boolean
  }
  const props = defineProps<{
    title:string
    mainTitle:string
    treeProps:any
    userOptions:any[]
    dialogTypeInfo:string[]
    treeData:listDataType[]
    oldSelectIds:string[]
  }>()
  const emits = defineEmits(['typeChange', 'confim', 'toLevel', 'getUserByName'])
  // 弹窗展示相关
  const tipDialogV5Ref = ref()
  const showDialog = () => {
    tipDialogV5Ref.value.dialogVisible = true
    getAllGroupUser()
  }
  const closeDialog = () => {
    tipDialogV5Ref.value.dialogVisible = false
    resetData()
  }
  const treeV2Ref = ref()
  const resetData = () => {
    breadcrumbData.value = []
    showTypeInfo.value = true
    filterDeptKey.value = ''
    currentType.value = ''
    checkedIds.value = {}
    treeV2Ref?.value?.setCheckedKeys([])
  }
  // 筛选
  const filterDeptKey = ref('')
  // 弹窗主页展示数据
  const showTypeInfo = ref(true)
  const currentType = ref('')
  const changeType = (label:string) => {
    showTypeInfo.value = false
    currentType.value = label
    emits('typeChange', label)
  }
  // 主要展示数据
  const listData = computed(() => {
    return JSON.parse(JSON.stringify(props.treeData))
  })
  const breadcrumbData = ref<any[]>([])
  const nextLevel = (data:any) => {
    breadcrumbData.value.push({
      name: data.name,
      id: data.id,
      deptType: data.deptType,
      hasNextLevel: data.hasNextLevel
    })
    emits('toLevel', false, data)
  }
  const toLevel = (isRoot:boolean, index = 0, data?:any) => {
    if (isRoot) {
      breadcrumbData.value = []
    } else {
      breadcrumbData.value.splice(index + 1)
    }
    emits('toLevel', isRoot, data)
  }
  const backHome = () => {
    showTypeInfo.value = true
    breadcrumbData.value = []
  }
  // 右侧展示相关数据
  const checkedIds = ref<{[key:string]:boolean}>({})
  const changeChecked = (info:any, value:boolean) => {
    if (info.hasNextLevel) {
      let arr:string[] = info.userIds ? info.userIds.split(',') : []
      arr = arr.filter(item => props.oldSelectIds.indexOf(item) === -1)
      arr.forEach((item:string) => { checkedIds.value[item] = value })
    } else {
      checkedIds.value[info.id] = value
    }
  }
  const checkedItem = computed(() => {
    return allUser.value.filter(item => checkedIds.value[item.id])
  })
  const checkedIdsArr = computed(() => {
    return [...checkedItem.value.map(item => item.id), ...props.oldSelectIds]
  })
  const cancelChecked = (info:any) => {
    checkedIds.value[info.id] = false
  }
  const confim = () => {
    if (checkedItem.value.length === 0) {
      errorMessage(t('qingXuanZeYongHu'))
    } else {
      emits('confim', checkedIdsArr.value, checkedItem.value)
    }
  }
  const keyupspace = (e:any) => {
    if (e.code === 'Space') e.preventDefault()
  }
  // 搜索功能
  const getRemoteData = () => {
    emits('getUserByName', filterDeptKey.value)
  }
  const debounceRemote = debounce(getRemoteData, 500)
  const formatPath = (text:string) => {
    return text.replaceAll('|', '>').substring(0, text.length - 1)
  }
  // 获取全部用户
  const allUser = ref<listDataType[]>([])
  const getAllGroupUser = () => {
    getGroupUser('').then(res => {
      allUser.value = res.data.unCheckUserList.map((item:any) => {
        return { ...item, name: item.realName }
      })
    }).catch()
  }
  const icon = {
    treeRootIcon: 'permission_folder_user_root',
    treeRootSelectIcon: 'permission_folder_user_root_full',
    treeOrganizationNodeIcon: 'permission_user_organization_folder_node',
    treeOrganizationNodeSelectIcon: 'permission_user_organization_folder_node_full',
    treeDepartmentNodeIcon: 'permission_user_department_folder_node',
    treeDepartmentNodeSelectIcon: 'permission_user_department_folder_node_full',
    treeOrganizationNodeIconBlue: 'permission_user_organization_folder_node_blue',
    treeDepartmentNodeIconBlue: 'permission_user_department_folder_node_blue'
  }
  defineExpose({
    showDialog,
    closeDialog
  })
</script>
<style
  lang='scss'
  scoped
>
.hover_bg{
  &:hover{
    background-color: #F5F7FA;
  }
}
.globalTitle{
  display: flex;
  align-items: center;
  border-left: 4px solid #fff;
  padding-left: 8px;
  height: 21px;
}
.bodyTitle{
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-bottom: 10px;
}
.el-main{
  >div{
    border: 1px solid $--global--regular--border--color;
    border-radius: 4px;
    padding: 15px;
  }
}
.list-header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
}
.btnGroup{
  .el-button{
    height: 32px;
  }
}
.el-footer{
  justify-content: flex-end;
}
.globalBody{
  width: 100%;
  display: flex;
  flex-direction: column;
  >span{
    font-size: 14px;
    color: $--global--regular--text--color;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    .el-icon{
      color: #F1DF3B;
      margin-left: 10px;
    }
  }
  :deep(.el-virtual-scrollbar){
    right:-10px!important;
  }
  :deep(.el-scrollbar__view){
    max-height: 500px;
  }
  :deep(.el-scrollbar__bar){
    z-index:3;
    right: 0px!important;
  }
}
.container{
  display: flex;
  height: 400px;
  >div{
    width: 50%;
  }
  .left{
    padding-right: 12px;
    border-right: 1px solid #eee;
    .mainHeader{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      height: 30px;
      position: relative;
      .el-icon{
        position: absolute;
        left: 0;
        &:hover{
          color: var(--el-color-primary);
          cursor: pointer;
        }
      }
      >span:last-child{
        flex:1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space:nowrap
      }
    }
    .el-breadcrumb{
      min-height: 30px;
      height: auto;
      flex-wrap: wrap;
      :deep(.el-breadcrumb__item){
        padding: 3px 0;
      }
      .breadcrumbContext{
        display: inline-block;
        max-width: 64px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover{
          color: var(--el-color-primary);
          cursor: pointer;
        }
      }
      .breadcrumbContext.first{
        max-width: 72px;
      }
    }
    .typeList{
      li{
        font-size: 14px;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >span{
          display: flex;
          align-items: center;
          &::before{
            content: '';
            height: 1px;
            background-color: $--global--regular--text--color;
            width: 8px;
            display: inline-block;
            margin-right: 16px;
          }
        }
        &:hover{
          color: var(--el-color-primary);
          >span{
            &::before{
              background-color: var(--el-color-primary);
            }
          }
        }
      }
    }
    .myself{
      background-color: $--global--regular--border--color;
      color: #b7b8bb;
      display: flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 8px;
      line-height: 1;
    }
  }
  .right{
    font-size: 14px;
    padding-left: 12px;
    display: flex;
    flex-direction: column;
    ul{
      padding-right: 8px;
      padding-top: 5px;
      .el-icon{
        &:hover{
          cursor: pointer;
          color:var(--el-color-primary);
        }
      }
    }
  }
  :deep(.el-tree-node__expand-icon){
    display: none;
  }
  :deep(.el-tree-node__content){
    cursor: default;
    padding-left: 4px!important;
    border-radius: 4px;
  }
  .el-tree-node,li{
    display: flex;
    height: 32px;
    padding: 5px;
    align-items: center;
    >div{
      display: flex;
      align-items: center;
      width: 100%;
    }
    .el-avatar{
      background-color: #F8F9FA;
      border:0;
      color:$--global--heavy--border--color;
      font-size: 12px;
    }
    .el-checkbox{
      margin-right: 16px!important;
    }
    .center{
      flex:1;
      padding:0 8px;
      color: #000;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 100%;
    }
    .last{
      font-size: 12px;
      color: var(--el-color-primary);
      line-height: 20px;
      display: flex;
      align-items: center;
      i{
        line-height: 26px;
        padding: 0 5px;
        border-radius: 4px;
        &:hover{
          cursor: pointer;
          color:#608FFF
        }
      }
      &:before{
        content: '';
        width: 1px;
        height: 20px;
        display: inline-block;
        margin-right: 8px;
        border-left:1px solid var(--el-color-primary);
      }
    }
    &:hover{
      border-radius: 6px;
      cursor: default;
    }
  }
}
</style>
