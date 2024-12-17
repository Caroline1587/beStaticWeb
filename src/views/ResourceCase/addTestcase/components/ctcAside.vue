<template>
  <div class="asideContainer">
    <el-scrollbar>
      <div class="headerContainer">
        <div class="title">{{ t('juTiYongLiBianHao') }}</div>
        <div>{{ props.currentCtcRow.ctcNum.value }}</div>
      </div>
      <div class="middleContainer">
        <div class="title">{{ t('juTiYongLiMiaoShu') }}</div>
        <div class="mainDesc">
          <ul>
            <li> {{ t('qianZhiTiaoJian') }} </li>
            <messageComps
              tag-name="li"
              class-name="customListLinkAndImage"
              :info="props.currentCtcRow.id?props.ltcInfo.preConditionDesc:''">
            </messageComps>
          </ul>
          <ul>
            <li> {{ t('ceShiBuZhou') }} </li>
            <messageComps
              v-for="(item, index) in currentCtcDesc.testStep"
              :key="index"
              tag-name="li"
              class-name="customListLinkAndImage"
              :info="`${props.currentCtcRow.id? item: ''}`">
            </messageComps>
          </ul>
          <ul>
            <li> {{ t('fuWeiBuZhou') }} </li>
            <messageComps
              :info="props.currentCtcRow.id?props.ltcInfo.resetDesc:''"
              tag-name="li"
              class-name="customListLinkAndImage"
            ></messageComps>
          </ul>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
  import { variableStore } from '@/store/index'
  import useRenderHtml from '@/views/common/useRenderHtml'
  const { handleComps } = useRenderHtml()
  const messageComps:any = handleComps()
  const variablestore = variableStore()
  const { t } = useI18n()
  const props = withDefaults(defineProps<{
    type?:string
    currentCtcRow:any
    ltcInfo:{
      preConditionDesc:string
      resetDesc:string
      testStep?:string
    },
    ltcData:any[],
    editable:boolean
  }>(), {
    type () {
      return 'add'
    }
  })
  const currentCtcDesc = ref<{
    testStep: string[]
  }>({
    testStep: []
  })
  const formatText = (text:string) => {
    let arr = text?.match(/#[^#\s]*<\/span> /g) as string[]
    // 数组去重
    arr = [...new Set(arr)]
    if (arr) {
      arr?.forEach((str:any) => {
        let key = str.replace('</span> ', '').trim().slice(1)
        if (key) {
          let newStr = str.replaceAll(key, `${key} = ${props.currentCtcRow[key] ? props.currentCtcRow[key].value : ''} ${variablestore.variableUnitSet[key] ? variablestore.variableUnitSet[key] : ''}`)
          // 单位和赋值拼接
          text = text.replaceAll(str, newStr)
        }
      })
    }
    return text
  }
  const getCtcDesc = () => {
    currentCtcDesc.value = {
      testStep: props.ltcData.map(item => {
        if (item.desc === '<p><br></p>') {
          item.desc = ''
        }
        if (item.result === '<p><br></p>') {
          item.result = ''
        }
        return {
          ...item
        }
      }).map((item, index) => {
        if (item.desc && item.result) {
          return `${item.desc.replace('<p>', `<p>${index + 1}. `)}<i style="font-size:12px;color:grey">${t('yuQiJieGuo')}</i>${item.result}`
        } else if (item.desc) {
          return item.desc.replace('<p>', `<p>${index + 1}. `)
        } else if (item.result) {
          return `${index + 1}. <br><i style="font-size:12px;color:grey">${t('yuQiJieGuo')}</i>${item.result}`
        } else {
          return `${index + 1}. `
        }
      }).map((item) => formatText(item))
    }
  }
  watch(() => props.currentCtcRow, () => {
    getCtcDesc()
  }, { immediate: true, deep: true })
  onMounted(() => {
    getCtcDesc()
  })
</script>
<style
  lang='scss'
  scoped
>
  .asideContainer{
    word-break: break-all;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: 5px;
    .title{
      font-size: 18px;
      height: 19px;
      padding-left: 8px;
      position: relative;
      left: -1px;
      border-left: 4px solid var(--el-color-primary);
    }
    .headerContainer{
      min-height: 75px;
      >div:last-child{
        min-height: 39px;
        border: 1px solid $--global--regular--border--color;
        margin: 10px 0 10px 20px;
        padding: 10px 10px;
        border-radius: 4px;
      }
    }
    >div{
      z-index: 1;
    }
    .middleContainer{
      padding:15px 0;
      .mainDesc{
        border-radius: 4px;
        border: 1px solid $--global--regular--border--color;
        margin: 10px 0 10px 20px;
        ul{
          margin:5px 0 5px 10px;
          li{
            padding: 3px 0;
            line-height: 1.7;
            /* height: 20px; */
          }
          li:first-child{
            padding: 0;
            padding-top: 5px;
            color: $--global--regular--text--color;
          }
        }
      }
    }
  }
</style>
