<template>
  <div class="is-showonly">
    <div
      v-for="option in props.value"
      :key="option.label"
      class="showonly-option"
      :style="`background-color:${props.backgroundColor};width:${props.isMulti?'':'100%'}`"
    >
      <!-- 成员 -->
      <GenderAvatar
        v-if="props.fieldType==='singleMember'||props.fieldType==='multiMember'"
        :size="20"
        :gender="option.gender"
        :info="option.label+''"
        :is-delete="option.isDelete"
      />
      <!-- 单选/多选/日期/数字/文本框/url -->
      <span v-else class="flex-center" style="overflow: hidden;text-overflow: ellipsis;">
        <el-icon v-if="props.fieldType==='date'" style="margin-right: 4px"><Clock /></el-icon>
        <i v-else-if="optionList[option.label]" class="circle" :style="`background-color:${optionList[option.label]}`"></i>
        <el-tooltip
          effect="dark"
          :content="option.label+''||''"
          :show-after="1000"
          placement="top"
        >
          <span class="avater-container">
            <a
              v-if="props.fieldType==='url'"
              class="ellipsis"
              style="display: inline-block!important"
              href="javascript:void(0)"
              @click="toNewPage(option.label+'')"
            >
              {{ option.label }}
            </a>
            <span v-else class="ellipsis" style="display:inline"> {{ option.label+'' }}</span>
          </span>
        </el-tooltip>
      </span>
    </div>
    <EmptyTag v-if="props.value.length===0"></EmptyTag>
  </div>
</template>

<script lang="ts" setup>
  import { Clock } from '@element-plus/icons-vue'
  import { FIELD_BACKGROUNDCOLOR } from '@/utils/constant'
  import GenderAvatar from '@/views/common/GenderAvatar.vue'
  import EmptyTag from '@/views/common/widget/components/EmptyTag.vue'

  const props = withDefaults(defineProps<{
    value:{label:string|number, gender?:string, isDelete?:boolean}[]
    backgroundColor?:string
    fieldType:string
    isMulti?:boolean
    optionList?:{optionValue:string, optionColor:string}[]
  }>(), {
    backgroundColor () {
      return FIELD_BACKGROUNDCOLOR
    },
    optionList () {
      return []
    },
    isMulti: false
  })
  const optionList = computed(() => {
    let colors:any = {}
    props.optionList.forEach(item => {
      colors[item.optionValue] = item.optionColor
    })
    return colors
  })
  const toNewPage = (value:string) => {
    window.open(value)
  }
</script>
