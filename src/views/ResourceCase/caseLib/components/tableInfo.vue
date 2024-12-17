<template>
  <div class="lib-card-container-common">
    <el-card
      v-for="(item,index) in props.cardData"
      :key="index"
      class="lib-table"
      shadow="never"
      @click="emits('toLibList', item.id)"
    >
      <div class="main">
        <el-image style="width: 24px; height: 24px;border-radius: 4px;" :src="handleIcon(item.libraryIcon)" fit="scale-down" />
        <div class="libraryName">
          <CustomToolTip :content="item.libraryName">
            <span class="ellipsis">{{ item.libraryName }}</span>
          </CustomToolTip>
          <el-icon :size="16" @click.stop="emits('watchLib',item.id, !item.isWatch)">
            <svg-icon :icon-class="item.isWatch?'common_star_active':'common_star'"></svg-icon>
          </el-icon>
        </div>
        <div class="avater flex-center">
          <GenderAvatar
            :size="20"
            :src="item.createUserImg"
            :info="item.createUserName"
            :gender="item.createUserGender">
          </GenderAvatar>
        </div>
        <div class="createTime"><span>{{ t('chuangJianYu') }}</span> {{ item.createTime }}</div>
        <div class="modifyTime"><span>{{ t('zuiJinXiuGaiYu') }}</span> {{ item.modifyTime }}</div>
      </div>
    </el-card>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import GenderAvatar from '@/views/common/GenderAvatar.vue'
  import { handleIcon } from '@/views/ResourceCase/caseLib/components/AddCaselibComponents/useImage'
  import CustomToolTip from "@/components/ToolTip/CustomToolTip.vue"

  const { t } = useI18n()
  const props = defineProps<{
    cardData:any[]
  }>()
  const emits = defineEmits(['toLibList', 'watchLib'])
</script>

<style
  lang='scss'
  scoped
>
</style>
