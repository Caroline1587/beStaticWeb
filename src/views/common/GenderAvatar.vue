<template>
  <span class="flex-center" style="overflow: hidden;text-overflow: ellipsis;">
    <el-avatar
      :size="props.size"
      :style="{background: props.gender ? props.gender === '0' ? '#9EB9FF' : '#FFC9C9' : '#C4C4C4',color:'#fff','line-height':`${props.size}px`, 'font-size':`${props.fontSize}px`}"
      :src="props.src"
    >
      {{ props.info ? props.info.substring(0,1) : '' }}
    </el-avatar>
    <el-tooltip
      v-if="!props.hiddenInfo"
      effect="dark"
      :content="props.info||''"
      :show-after="1000"
      placement="top"
    >
      <span class="avater-container">
        <span class="ellipsis" :style="{'text-decoration': props.isDelete?'line-through':''}"> {{ props.info || '' }}</span>
      </span>
    </el-tooltip>
  </span>
</template>
<script
  setup
  lang="ts"
>
  const props = withDefaults(defineProps<{
    gender?: string
    info:string
    size?:number
    fontSize?:number
    color?:string
    hiddenInfo?:boolean
    src?:''
    isDelete?:boolean
  }>(), {
    size () {
      return 24
    },
    fontSize () {
      return 12
    },
    gender () {
      return ''
    },
    color () {
      return '#5E6884'
    },
    hiddenInfo () {
      return false
    },
    src: '',
    isDelete: false
  })
</script>
