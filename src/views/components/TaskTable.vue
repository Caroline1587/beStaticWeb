<script setup lang="ts">
import {
  RefreshRight,
  MoreFilled,
  SuccessFilled,
} from "@element-plus/icons-vue";
import {
  cancelTask,
  moveUpByTaskId,
  moveDownByTaskId,
} from "@/api";

const props = defineProps({
  tableData: Array, // 表格当前页数据
  total: Number, // 总条目数
  currentPage: Number, // 当前页码
  pageSize: Number, // 每页条数
  pageSizes: Array, //每页条数 选项
  waitingRowsLengthInAll: Number, //“等待中”数据总数
  firstWaitingRow:Object,//“等待中”第一项
  lastWaitingRow:Object,//“等待中”最后一项
});

const emits = defineEmits([
  "update:currentPage",
  "update:pageSize",
  "remove",
  "update:index",
  "update:cancel",
  "update:all",
]);

// const handleRemove = (index: number) => emits("remove", index);
const handlePageChange = (page: number) => {
  emits("update:currentPage", page);
};
const handleSizeChange = (size: number) => {
  emits("update:pageSize", size);
};

// 上移下移操作
const handleMoveUp = async (curPageIndex: any,row: { id: number; }) => {
  console.log('当前行 row:======',curPageIndex,row);
  console.log('等待队列 firstWaitingRow:======',props.firstWaitingRow);
  console.log('等待队列 lastWaitingRow:======',props.lastWaitingRow);
  
  console.log("currentPage====", props.currentPage);
  console.log('row in tasktable',row);
  await moveUpByTaskId(row.id)

  emits("update:index"); // 通过事件将更新的数据传递给父组件
};

const handleMoveDown = async (curPageIndex: any,row: { id: number; }) => {
  await moveDownByTaskId(row.id)
 console.log(curPageIndex)
  emits("update:index");
};

// 停止当前任务
const handleStop = async (curPageIndex: any,row: { id: number; }) => {
  console.log("certain row in tasktable",row);
  console.log(curPageIndex)
  await cancelTask(row.id)
  emits("update:all");
};

const handleCancel = async (curPageIndex: any,row: { id: number; }) => {
  console.log("row in cancel",row);
  console.log(curPageIndex)
  await cancelTask(row.id)
  
  emits("update:all");
};

const formatCaseSource=(row: any, column: any, cellValue: number, index: any)=>{
  console.log(row,column,index)
  if (cellValue === 1) {
      return 'excel';  // 如果 case_source 为 1，显示 excel
    } else if (cellValue === 2) {
      return 'tpa';    // 如果 case_source 为 2，显示 tpa
    } else {
      return '';       // 其他情况显示为空
    }
}
</script>

<template>
  <div>
    <!-- :default-sort="{ prop: 'buildStatus', order: 'descending' }" -->
    <el-table
      :data="tableData"
      stripe
      height="85vh"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" fixed />
      <el-table-column prop="case_number" label="任务编号" />
      <el-table-column prop="create_time" label="开始时间">
        <template #default="{ row }">
          <span :style="{ fontSize: '12px' }">{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="finish_time" label="完成时间">
        <template #default="{ row }">
          <span :style="{ fontSize: '12px' }">{{ row.finish_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="converted_case_num"
        label="转换用例数"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="case_source"
        label="用例来源"
        :formatter="formatCaseSource"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        prop="target_location"
        label="目标位置"
        show-overflow-tooltip
      />
      <!-- sortable -->
      <el-table-column prop="generate_status" label="生成状态" align="center">
        <template #default="scope">
          <div class="buildStatusWrapper">
            <!-- todo： 根据 buildStatus 动态调整图标 -->
            <div
              class="buildStatusContent --flex-center --buildStatus-color--executing"
              v-if="scope.row.generate_status === 1"
            >
              <el-icon class="is-loading --buildStatus-color--executing"
                ><RefreshRight
              /></el-icon>
              <span>执行中</span>
            </div>
            <div
              class="buildStatusContent --flex-center --buildStatus-color--waiting"
              v-else-if="scope.row.generate_status === 0"
            >
              <el-icon class="isWaiting --buildStatus-color--waiting"
                ><MoreFilled
              /></el-icon>
              <span>等待中</span>
            </div>
            <div
              class="buildStatusContent --flex-center --buildStatus-color--finished"
              v-else-if="scope.row.generate_status === 2"
            >
              <el-icon class="--buildStatus-color--finished"
                ><SuccessFilled
              /></el-icon>
              <span>已完成</span>
            </div>
            <div
              class="buildStatusContent --flex-center --buildStatus-color--waiting"
              v-else-if="scope.row.generate_status === 3"
            >
              <span>已取消</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100" align="center">
        <template #default="scope">
          <!-- todo： 根据 buildStatus 动态调整可执行操作 -->
          <div class="operationsWrapper --flex-center">
            <!-- 等待中 -->
            <div
              class="operationsContent --flex-center"
              v-if="scope.row.generate_status === 0"
            >
              <el-button
                link
                type="primary"
                size="small"
                @click="handleCancel(scope.$index,scope.row)"
              >
                <img
                  src="@/assets/cancel.svg"
                  class="cancel icon"
                  alt="cancel icon"
                  srcset=""
                />
                取消</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                :disabled="(scope.row.id==firstWaitingRow?.id)"
                @click="handleMoveUp(scope.$index,scope.row)"
              >
                <img
                  src="@/assets/moveUp.svg"
                  class="moveUp icon"
                  alt="moveUp icon"
                  srcset=""
                />
                上移</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                :disabled="(scope.row.id==lastWaitingRow?.id)"
                @click="handleMoveDown(scope.$index,scope.row)"
              >
                <img
                  src="@/assets/moveDown.svg"
                  class="moveDown icon"
                  alt="moveDown icon"
                  srcset=""
                />
                下移</el-button
              >
            </div>
            <!-- 执行中 -->
            <div
              class="operationsContent"
              v-if="scope.row.generate_status === 1"
            >
              <el-button
                link
                type="primary"
                size="small"
                @click="handleStop(scope.$index,scope.row)"
              >
                <img
                  src="@/assets/stop.svg"
                  class="stop icon"
                  alt="stop icon"
                  srcset=""
                />
                停止当前</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination .btn-prev) {
  margin-left: auto;
}
.buildStatusContent {
  display: flex;
  justify-content: center;
  align-items: center;
  // justify-content: flex-start;
  // color:var(--buildStatus--waiting);
  .el-icon {
    margin-right: 0.1rem;
    border-radius: 50%;
    color: white;
  }
  .--buildStatus-color--finished {
    color: #1dc872;
  }
  .is-loading {
    background-color: #409eff;
  }
  .isWaiting {
    background-color: #cdcdcd;
  }
  .isFinished {
    background-color: lightgreen;
  }
}
.operationsWrapper {
  .operationsContent {
    .el-button + .el-button {
      margin: auto;
    }
  }
}
:deep(.el-button.is-link) {
  padding: 4px;
}
:deep(.el-table__body colgroup col:nth-child(3)) {
  font-size: 10px;
}
.icon {
  height: 1em;
  width: 1em;
}

</style>
