<template>
  <div style="position: relative;width: 100%;display: flex;">
    <CustomToolTip :content="isDynamicTime?t('qieHuanPuTongShiJianDuan'):t('qieHuanDongTaiShiJianDuan') ">
      <el-icon class="hover-poniner" style="position: absolute;z-index:2;right:10px;top: -20px;font-size:16px" @click="changeType">
        <svg-icon :icon-class="isDynamicTime?'common_date_btn_active':'common_date_btn'"></svg-icon>
      </el-icon>
    </CustomToolTip>
    <el-date-picker
      v-if="!isDynamicTime"
      ref="datePickerRef"
      v-model="value"
      value-format="YYYY-MM-DD"
      type="daterange"
      unlink-panels
      clearable
      :range-separator="t('zhi') "
      :start-placeholder="t('kaiShiShiJian')"
      :end-placeholder="t('jieShuShiJian')"
      :shortcuts="DATA_SHORTCUTS"
      :prefix-icon="DateIcon"
    >
    </el-date-picker>
    <el-select
      v-else
      v-model="value"
      :placeholder="t('qingXuanZeDongTaiShiJian')"
      clearable
    >
      <el-option
        v-for="item in DATA_SHORTCUTS.slice(1,)"
        :key="item.prop"
        :label="item.text"
        :value="item.prop"
      />
      <template #prefix>
        <el-icon><svg-icon icon-class="common_date_active"></svg-icon></el-icon>
      </template>
    </el-select>
  </div>
</template>
<script
  setup
  lang="ts"
>
import { useI18n } from 'vue-i18n';

  import { DATA_SHORTCUTS } from '@/utils/constant'
  import DateIcon from './DateIcon.vue'
// import CustomToolTip from "@/components/ToolTip/CustomToolTip.vue"

  const { t } = useI18n()
  const props = defineProps<{
    timeRange:any
  }>()
  const emits = defineEmits(['update:timeRange'])
  const value = computed({
    get () {
      return props.timeRange
    },
    set (val:any) {
      emits('update:timeRange', val)
      return val
    }
  })
  const isDynamicTime = computed({
    get () {
      return !Array.isArray(props.timeRange)
    },
    set (val:boolean) {
      return val
    }
  })
  const datePickerRef = ref()
  const changeType = () => {
    if (isDynamicTime.value) {
      value.value = ['', '']
    } else {
      value.value = ''
    }
  }
</script>
<style
  lang="scss"
  scoped
>
</style>
