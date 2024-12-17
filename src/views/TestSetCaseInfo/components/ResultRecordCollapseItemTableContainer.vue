<template>
  <!-- 逻辑用例表格 -->
  <ltc-table :note="item.note" :text-result="textResult" />
  <!-- 具体用例表格 -->
  <ctc-table :record-id="item.id" @change-text-result="changeTextResult" />
</template>

<script setup lang="ts">
import LtcTable from './LtcTable.vue'
import CtcTable from './CtcTable.vue'

withDefaults(defineProps<{
  item: any
}>(), {
  item: () => {
    return []
  }
})

const textResult = ref([])
const changeTextResult = (val:any) => {
  textResult.value = val
}

</script>

<style lang="scss" scoped>
</style>
