<!--
 * @Author: luyao.feng luyao.feng@hirain.com
 * @Date: 2024-10-11 16:54:48
 * @LastEditors: luyao.feng luyao.feng@hirain.com
 * @LastEditTime: 2024-10-11 17:11:58
 * @FilePath: tpa_web_project\src\components\Table\HiTableColumn.vue
 * @Description: 二次封装一下表格列控件，实现表头不换行展示
-->
<template>
  <el-table-column v-bind="$attrs">
    <template #header="{ column }">
      <span class="table_header" :title="column.label">{{ column.label }}</span>
    </template>
    <!-- 遍历子组件插槽，并对父组件暴露 -->
    <template v-for="(index, name) in $slots" #[name]="scope">
      <slot :name="name" v-bind="scope"></slot>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
</script>
<style
  lang='scss'
  scoped
>
  .table_header{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: auto;
  }
</style>
