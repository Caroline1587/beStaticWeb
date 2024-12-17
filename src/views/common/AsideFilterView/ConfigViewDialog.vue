<template>
  <TipDialogV5
    ref="tipDialogV5Ref"
    :title="t('shiTuGuanLi')"
    :width="500"
    style="height:auto"
  >
    <div class="dialog-body-container">
      <div class="tip-info">{{ t('guanLiZhanShiDeShiTuBingWeiQiPaiXu') }}</div>
      <el-scrollbar>
        <ul class="viewContainer">
          <li
            v-for="item in viewData"
            :key="item.id"
            :class="item.isHidden===1||item.isSystemFilter===1?'forbid':''">
            <el-icon
              class="handle"
              :size="16"
            >
              <svg-icon icon-class="tableMenu_handle"></svg-icon>
            </el-icon>
            <span class="name">
              <span :title="item.filterName" class="ellipsis">{{ item.filterName }}</span>
              <span v-if="item.isDefault" class="defaultTag">{{ t('moRen') }}</span>
            </span>
            <span class="operate">
              <el-button
                :disabled="item.isHidden===1 || item.isDefault===1"
                class="text-button"
                @click="toSetDefault(item.id)">{{ t('sheWeiMoRen') }}</el-button>
              <el-button
                :disabled="item.isSystemFilter===1"
                class="text-button"
                @click="toEdit(item.id)">{{ t('bianJi') }}</el-button>
              <el-popconfirm
                :title="t('queDingYaoShanChuCiShiTuMa')"
                icon-color="var(--el-color-primary)"
                :width="200"
                :icon="WarningFilled"
                @confirm="toDelete(item)"
              >
                <template #reference>
                  <el-button
                    :disabled="item.isSystemFilter===1 || item.isDefault===1"
                    class="text-button"
                  >{{ t('shanChu') }}</el-button>
                </template>
              </el-popconfirm>
            </span>
            <el-switch
              v-model="item.isShow"
              size="small"
              :disabled="item.isSystemFilter===1||item.isDefault===1"
              @change="changeView(item.id)" />
          </li>
        </ul>
      </el-scrollbar>
    </div>
 </TipDialogV5>
</template>
<script
 setup
 lang="ts"
>
  import { hiddenOrOpenFilter, deleteById, setFilterDefault, setFilterOrder } from '@/api/commonApi'
  import { WarningFilled } from '@element-plus/icons-vue'
  import Sortable from 'sortablejs'
  import Storage from '@/utils/storage'
  const USERINFO = Storage.sessionGet('TPA_COMMON_USER').userInfo
  const currentDataId = Storage.sessionGet('TPA_COMMON_GLOBAL').currentDataId
  const tipDialogV5Ref = ref()
  const { t } = useI18n()
  interface viewDataType {
    filterName: string
    filterOrder: number
    filterParam: string
    id: string
    isDefault: number
    isHidden: number
    isShow: boolean
    isSystemFilter: number
  }
  const props = withDefaults(defineProps<{
    allFilterViews:any[]
    viewType:string
  }>(), {})
  const emits = defineEmits(['toEdit', 'update:allFilterViews', 'initList'])
  const show = () => {
    tipDialogV5Ref.value.dialogVisible = true
    nextTick(() => {
      checkDrag()
    })
  }
  const viewData = computed({
    get () {
      let temp:viewDataType[] = props.allFilterViews.map(item => {
        return {
          ...item,
          isShow: !item.isHidden
        }
      })
      return temp
    },
    set (val:viewDataType[]) {
      emits('update:allFilterViews', val)
    }
  })
  const changeView = async (id:string) => {
    await hiddenOrOpenFilter({ id, userId: USERINFO.id, projectId: currentDataId, filterType: props.viewType })
    emits('initList')
  }
  const toEdit = (id:string) => {
    tipDialogV5Ref.value.dialogVisible = false
    emits('toEdit', id)
  }
  const toSetDefault = async (id:string) => {
    await setFilterDefault({ id, userId: USERINFO.id, projectId: currentDataId, filterType: props.viewType })
    emits('initList')
  }
  const toDelete = async (data:viewDataType) => {
    await deleteById(data.id)
    emits('initList')
  }
  const sortableInstance = ref()
  const checkDrag = () => {
    const el = document.querySelector('.viewContainer')
    sortableInstance.value = Sortable.create(el, {
      handle: '.handle',
      filter: '.forbid',
      // 禁止拖动到forbid的对象
      onMove: (e:any) => {
        if (e.related.className === 'forbid') return false
        return true
      },
      onEnd: async ({ newIndex, oldIndex }: { newIndex: number, oldIndex: number }) => {
        if (newIndex !== oldIndex) {
          const currRow = viewData.value.splice(oldIndex, 1)[0]
          viewData.value.splice(newIndex, 0, currRow)
          let data = viewData.value.filter(item => item.isSystemFilter === 0 && item.isHidden === 0).map(item => item.id)
          await setFilterOrder(JSON.stringify(data), props.viewType)
          emits('initList')
        }
      }
    })
  }
  onUnmounted(() => {
    sortableInstance.value?.destroy()
  })
  defineExpose({
    show
  })
</script>
<style
 lang='scss'
 scoped
>
.tip-info{
  color: #B3B9D2;
  font-size: 12px;
  margin-bottom:8px;
}
.container{
  max-height:400px;
}
.dialog-body-container{
  margin-bottom: 20px;
  :deep(.el-scrollbar__view){
    max-height:400px
  }
}
li{
  height: 32px;
  display: flex;
  align-items: center;
  border-radius:4px;
  padding:0 8px;
  .name{
    flex: 1;
    display: flex;
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
    margin:0 8px
  }
  .handle{
    color:#bcbdc2;
    &:hover{
      cursor:pointer
    }
  }
  .defaultTag{
    color: var(--el-color-primary);
    border:1px solid rgb(11, 83, 253, 0.5);
    border-radius: 5px;
    text-align: center;
    font-size: 10px;
    margin-left: 6px;
    width: 36px;
    height: 18px;
  }
  .operate{
    display:none;
    padding-right:4px;
  }
  &:hover{
    background-color:#F1F3F6;
    .operate{
      display:flex;
    }
  }
  &:focus-within{
    background-color:#F1F3F6;
    .operate{
      display:flex;
    }
  }
}
.forbid{
  .handle{
    color:#DCDFE6;
    &:hover{
      cursor:not-allowed
    }
  }
}
</style>
