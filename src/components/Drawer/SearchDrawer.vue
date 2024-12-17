<template>
  <div
    :style="`z-index:${drawer?'998':'-1'}`"
    class="mask"
    @click="closeDrawer"
  >
    <div
      :style="`max-height:${drawer?'240px':'0px'}`"
      class="drawerContainer"
      @click.stop="stopClose">
      <el-scrollbar>
        <div>
          <suspense>
            <slot></slot>
          </suspense>
        </div>
      </el-scrollbar>
      <div>
        <el-radio-group v-model="globalparamsstore.queryType">
          <el-radio :value="1" size="large">{{ t('manZuQuanBuTiaoJian') }}</el-radio>
          <el-radio :value="2" size="large">{{ t('manZuRenYiTiaoJian') }}</el-radio>
        </el-radio-group>
        <el-button class="blue-button" @click.stop="submitForm">{{ t('chaXun') }}</el-button>
        <el-button class="grey-liner-button" @click.stop="resetForm">{{ t('zhongZhi') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import { computed } from 'vue'
  import { globalParamsStore } from '@/store/index'
  import { useI18n } from 'vue-i18n';


  const { t } = useI18n()
  const globalparamsstore = globalParamsStore()
  const props = defineProps<{
    drawerVisiable:boolean
  }>()
  const emits = defineEmits(['update:drawerVisiable', 'submitForm'])
  const drawer = computed({
    get () {
      return props.drawerVisiable
    },
    set (val:boolean) {
      emits('update:drawerVisiable', val)
      return val
    }
  })
  const closeDrawer = () => {
    drawer.value = false
  }
  const stopClose = () => {
    drawer.value = true
  }
  const submitForm = () => {
    drawer.value = false
    emits('submitForm')
  }
  const resetForm = () => {
    globalparamsstore.queryType = 1
    globalparamsstore.tempFilterFormData = {}
    drawer.value = false
    emits('submitForm')
  }
</script>
<style
  lang='scss'
  scoped
>
  .mask{
    background-color: transparent;
    position: absolute;
    transition: all 0.5s;
    width: 100%;
    height: 100%;
    .drawerContainer{
      width: 100%;
      position: absolute;
      z-index: 999;
      transition: all .5s;
      background-color: #FAFAFA;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      max-height: 400px;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      padding-right: 10px;
      box-sizing: border-box;
      >div:first-child{
        margin-top: 20px;
        flex: 1;
        height: 100%;
      }
      >div:last-child{
        height: 40px;
        align-self: flex-end;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .el-radio-group{
          margin-right:30px;
        }
      }
    }
  }
</style>
<style lang='scss'>
 .drawerContainer{
    .el-scrollbar__view{
      max-height: 152px;
    }
  }
</style>
