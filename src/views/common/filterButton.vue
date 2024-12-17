<template>
  <div class="listBtn">
    <transition
      name="opacity-transform"
      mode="out-in"
    >
    <!--  -->
      <div v-if="!showSearch && !showAdvanceSearch">
        <slot></slot>
        <el-button class="icon-text-button" @click="showSearch = true">
          <el-icon><Search /></el-icon>
          <span>{{ t('souSuoNeiRong') }}</span>
        </el-button>
      </div>
      <GreyInput
        v-else-if="!showAdvanceSearch"
        v-model="globalparamsstore.filterKey"
        :placeholder="t('zaiXuanZhongJieDianZhongSouSuo')"
        @keydown.enter="saveFilterKey"
        @close="clearFilter"
      />
    </transition>
    <!-- 高级筛选 -->
    <el-button
      v-show="props.showAdvance"
      class="icon-text-button textButton"
      @click="advanceBtClick"
    >
      <el-icon><svg-icon icon-class="projectCase_filter"></svg-icon></el-icon>
      <span>{{ t('gaoJiShaiXuan') }} </span>
      <i :style="`display:${globalparamsstore.formNumber === 0?'none':'inlie-flex'}`" class="filterNumber">{{ globalparamsstore.formNumber }}</i>
    </el-button>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import { Search } from '@element-plus/icons-vue'
  import { globalParamsStore } from '@/store/index'
  import { computed,defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import GreyInput from "@/components/GreyInput/index.vue"
  // import svgIcon from "@/components/SvgIcon/index.vue"

  const { t } = useI18n()
  const globalparamsstore = globalParamsStore()
  const props = withDefaults(defineProps<{
    level?:number
    showAdvance?:boolean
  }>(), {
    level () {
      return 0
    },
    showAdvance () {
      return true
    }
  })
 /* 按钮操作相关 */
  const showSearch = computed({
    get () {
      if (props.level === 0) {
        return globalparamsstore.showSearch
      } else {
        return globalparamsstore.showSearch2
      }
    },
    set (val:boolean) {
      if (props.level === 0) {
        globalparamsstore.showSearch = val
      } else {
        globalparamsstore.showSearch2 = val
      }
    }
  })
  const showAdvanceSearch = computed({
    get () {
      if (props.level === 0) {
        return globalparamsstore.showAdvanceSearch
      } else {
        return globalparamsstore.showAdvanceSearch2
      }
    },
    set (val:boolean) {
      if (props.level === 0) {
        globalparamsstore.showAdvanceSearch = val
      } else {
        globalparamsstore.showAdvanceSearch2 = val
      }
    }
  })
  const saveFilterKey = () => {
    globalparamsstore.changeInitFlag(props.level)
  }
  const clearFilter = () => {
    if (showSearch.value) {
      globalparamsstore.filterKey = ''
      saveFilterKey()
      showSearch.value = false
    }
  }
  const advanceBtClick = () => {
    showAdvanceSearch.value = !showAdvanceSearch.value
    globalparamsstore.tempFilterFormData = JSON.parse(JSON.stringify(globalparamsstore.filterFormData))
    clearFilter()
  }
</script>
<style
  lang='scss'
  scoped
>
</style>
