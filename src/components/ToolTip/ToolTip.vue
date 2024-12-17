<template>
  <div class="toop-tip" :class="props.lineClamp ?'toop-clamp-tip' : ''">
    <el-tooltip
      ref="tip"
      :disabled="!tooltipFlag"
      class="tooltip"
      effect="dark"
      :content="data"
      :show-after="props.lineClamp ? 1000 : 0"
      v-bind="$attrs"
    >
      <span @mouseenter="visibilityChange($event)">{{ data }}</span>
      <!-- <span  @mouseenter="visibilityChange(index)" style="color:#666;overflow: hidden;width: 415px;">{{data}}</span> -->
    </el-tooltip>
  </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
const props = withDefaults(defineProps<{ data: any, lineClamp?:boolean}>(), {
  data: '',
  lineClamp: false // 是否进行多行显示，当前只支持2行，后期有需求拓展一个prop参数决定行数即可
})
let tip = ref()
let tooltipFlag = ref(false)
// tooltip的可控
const visibilityChange = (event:any) => {
  if (props.lineClamp) {
    tooltipFlag.value = true
    return
  }
  const ev = event.target
  // 文本的实际宽度
  const evWidth = ev.offsetWidth
  // 文本容器宽度
  const contentWidth = tip.value.$el.parentNode.offsetWidth
  if (contentWidth < evWidth) {
    // 实际内容宽度 > 父元素（文本容器）宽度  =》内容溢出
    tooltipFlag.value = true // NameIsIncludeWord ? true : !!false
  } else {
    // 否则为不溢出
    tooltipFlag.value = false
  }
}
</script>
<style lang="scss" scoped>
.toop-tip{
  overflow:hidden;
  text-overflow:ellipsis;
  width: 100%;
  white-space: nowrap;
}
.toop-clamp-tip{
  display:-webkit-box;
  -webkit-box-orient:vertical;
  white-space: wrap;
  -webkit-line-clamp:2;//例如超过2行显示省略号
}
</style>
