<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ref, defineEmits,defineProps, defineAsyncComponent } from "vue";

// import Tree from "@/views/dialogContent/Tree.vue";
const Tree = defineAsyncComponent(
  () => import("@/views/dialogContent/Tree.vue")
);

interface IProps{
  linkedId:string
}
const props=defineProps<IProps>();
const linkedId=ref(props.linkedId);

interface IEmits {
  (e: "update:selectedRows", value: any): void;
  (e: "update:selectedRowsLength", value: any): void;
}
const emits = defineEmits<IEmits>();

const searchInput = ref("");
const selectedRowsLength=ref(0);

const getSelectedRowsLength=(rowsLen:number)=>selectedRowsLength.value=rowsLen;
const getSelectedRows = (selectedRows:any) => {
  console.log("selectedRows  in tae", selectedRows);
  emits("update:selectedRows", selectedRows);
};
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <div class="title-wrapper">
        <div class="rectangle"></div>
        <div class="title">TPA用例导入</div>
      </div>
    </div>
    <div class="content">
      <div class="content__function">
        <div class="content__function__selectedCount">
          <div class="selectedContent">已选 <span class="selectedContent__length">{{selectedRowsLength}}</span> 项测试用例</div>
        </div>
        <div class="content__function__searchNFilter">
          <div class="searchfold">
            <el-input
              class="search-input"
              v-model="searchInput"
              placeholder="搜索内容"
              :prefix-icon="Search"
            />
          </div>
          <div class="advancedFilter">
            <img class="filterIcon" src="../../assets/filter.svg" alt="" />
            <span>高级筛选</span>
          </div>
        </div>
      </div>
      
      <div class="content__main">
        <Tree :linkedId="linkedId" @update:selectedRows="getSelectedRows"  @update:selectedRowsLength="getSelectedRowsLength"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  .header {
    .title-wrapper {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: fit-content; 
      height: 29px;
      box-sizing: border-box;
      padding: 0px 0px 0px 43px;
      gap: 8px;
      opacity: 0px;

      .rectangle {
        width: 3px;
        height: 17px;
        gap: 0px;
        opacity: 0px;
        background: #5a78ff;
      }
      .title {
        height: 29px;
        gap: 0px;
        opacity: 0px;
        color: #283a64;
        font-family: Noto Sans SC;
        font-size: 20px;
        font-weight: 700;
        line-height: 28.96px; 
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    width: 80vw;
    height: fit-content;
    gap: 0px;
    opacity: 0px;
    .content__function {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: fit-content;
      gap: 0px;
      opacity: 0px;
      .content__function__selectedCount {
        width: 110px;
        height: 17px;
        gap: 16px;
        opacity: 0px;
        .selectedContent {
          width: 120px;
          height: 17px;
          gap: 0px;
          opacity: 0px;
          font-family: Noto Sans SC;
          font-size: 12px;
          font-weight: 400;
          line-height: 17.38px;
          text-align: left;
          text-underline-position: from-font;
          text-decoration-skip-ink: none;
          &__length{
            color: red;
            font-weight: bolder;
            font-size: 14px;
          }
        }
      }
      .content__function__searchNFilter {
        display: flex;
        align-items: center;
        // height: 40px;
        height: fit-content;
        opacity: 0px;
        // gap: 32px;
        .searchUnfold {
          height: 40px;
          padding: 2.86px 12.86px 2.86px 12.86px;
          gap: 7.14px;
          border-radius: 7.14px 0px 0px 0px;
          opacity: 0px;
          background: #f4f4f4;
        }
        .advancedFilter {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 32px;
          gap: 5px;
        }
        // .searchIcon,
        .filterIcon {
          max-width: 24px;
          max-height: 24px;
        }
      }
    }
    .content__main {
      flex: 1;
      width: 100%;
      gap: 0px;
      border: 1px 0px 0px 0px;
      opacity: 0px;
      border: 1px solid #e4e7ed;
    }
    .content__buttons {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      height: 56px;
      padding: 8px 0px 8px 0px;
      gap: 16px;
      opacity: 0px;

      .cancel,
      .ok {
        width: 80px;
        height: 40px;
      }
    }
  }
}
.search-input {
  width: 120px !important;
  :deep(.el-input__wrapper) {
    box-shadow: none;
  }
}
:deep(.el-input__prefix) {
  color: #8d8e92;
}
</style>
