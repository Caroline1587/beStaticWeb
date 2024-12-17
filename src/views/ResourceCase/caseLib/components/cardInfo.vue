<template>
  <div class="lib-card-container lib-card-container-common">
    <el-card
      v-for="(item,index) in props.cardData"
      :key="index"
      class="lib-card"
      shadow="never"
      @click="emits('toLibList', item.id)"
    >
      <div class="left">
        <el-image style="width: 40px; height: 40px;border-radius: 8px;" :src="handleIcon(item.libraryIcon)" fit="scale-down" />
      </div>
      <div class="right">
        <div class="libraryName">
          <span class="flex-center">
            <CustomToolTip :content="item.libraryName">
              <span class="ellipsis">{{ item.libraryName }}</span>
            </CustomToolTip>
          </span>
          <el-icon :size="16" @click.stop="emits('watchLib',item.id,!item.isWatch)"><svg-icon :icon-class="item.isWatch?'common_star_active':'common_star'"></svg-icon></el-icon>
        </div>
        <div class="avater flex-center">
          <GenderAvatar
            :size="20"
            :src="item.createUserImg"
            :info="item.createUserName"
            :gender="item.createUserGender">
          </GenderAvatar>
        </div>
        <div class="time">{{ t('zuiHouXiuGaiShiJian') }} {{ item.modifyTime }}</div>
        <div class="desc">
          <CustomToolTip v-if="item.description" :content="item.description" placement="bottom">
            <span style="display: inline-block;">
              <span class="desc-content">{{ item.description }}</span>
            </span>
          </CustomToolTip>
          <span v-else>-</span>
        </div>
        <div class="number">
          <span>{{ t('ltcZongShu') }} <i>{{ item.ltcNum }}</i></span>
          <span>{{ t('ctcZongShu') }} <i>{{ item.ctcNum }}</i></span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script
  setup
  lang="ts"
>
  import { handleIcon } from '@/views/ResourceCase/caseLib/components/AddCaselibComponents/useImage'
  import GenderAvatar from '@/views/common/GenderAvatar.vue'
  import CustomToolTip from "@/components/ToolTip/CustomToolTip.vue"

  const props = defineProps<{
    cardData:any[]
  }>()
  const emits = defineEmits(['toLibList', 'watchLib'])
  const { t } = useI18n()
</script>

<style
  lang='scss'
  scoped
>
</style>
