<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import {
  computed,
  defineAsyncComponent,
  onMounted,
  ref,
  watchEffect,
} from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { isEqual } from "lodash";

// import { useTaskStore } from "@/stores/task";
import {
  fetchTaskData,
  createTask,
  cancelAllTask,
} from "@/api/task";
import TaskTable from "@/views/components/TaskTable.vue";
import { ITask, ParamsToCreateTaskExcel,ParamsToCreateTaskLinked } from "@/types";
import { mySetInterval } from "@/hooks";
import { generateTaskNumber } from "@/utils/generateTaskNumber";

const DynamicForm = defineAsyncComponent(
  () => import("@/views/dialogContent/DynamicForm.vue")
);
const TpaUsecaseImport = defineAsyncComponent(
  () => import("@/views/dialogContent/TpaUsecaseImport.vue")
);

export interface ITaskInTable extends ITask {
  operations?: string[] | null;
}
// const taskStore = useTaskStore();

const allTask = ref<ITask[]>([]);

// // 异步获取数据并赋值
async function fetchAllTableData() {
  try {
    const data: ITask[] = await fetchTaskData() as unknown as ITask[]; //获取所有任务数据
    if (Array.isArray(data)) {
      allTask.value = data;
      console.log("allTask===fetchAllTableData", allTask.value);
      // 更新与任务相关的行数据
    } else {
      console.error("Invalid data format: expected an array.");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}
fetchAllTableData()

// 分离并按状态分组, 同时添加对应操作--allTask
const waitingRows = ref<any[]>([]);
const inProgressRows = ref<any[]>([]);
const completedRows = ref<any[]>([]);
const cancelledRows = ref<any[]>([]);
const sortedAllTableData = ref<any[]>([]);

const waitingRowsLengthInAll = computed(() => waitingRows.value.length); //等待队列长度
const firstWaitingRow = ref<any>(null); //等待队列第一个
const lastWaitingRow = ref<any>(null); //等待队列最后一个

const tableData = ref<any>([]); //当前页数据
const length = computed(() => sortedAllTableData.value.length);
const total = ref(length); // 总条目数
const currentPage = ref(1); // 当前页码
const pageSize = ref(20); // 每页条数
const pageSizes = ref([20, 40, 60, 80]); // 可选择每页条数大小

//获取当前页表格数据
const fetchTableData = (page: number, size: number) => {
  let startIndex = (page - 1) * size;
  let endIndex = startIndex + size;
  tableData.value = sortedAllTableData.value.slice(startIndex, endIndex);
  console.log("startIndex, endIndex", startIndex, endIndex);
};

//不同状态对应的operations操作选项 //0-等待中 1-执行中 2-已完成 3-已取消
const waitingOperations = ref(["取消", "上移", "下移"]);
const inProgressOperations = ref(["停止当前"]);
const getOperationsForStatus = (status: number) => {
  switch (status) {
    case 0:
      return waitingOperations;
    case 1:
      return inProgressOperations;
    default:
      return [];
  }
};

// 根据状态获取行数据
function getRowsByStatus(status: number, shouldSort = true) {
  return allTask.value
    .filter((task: ITask) => task.generate_status === status)
    .map((task: ITask) => ({
      ...task,
      operations: getOperationsForStatus(task.generate_status),
    }))
    .sort((a, b) => (shouldSort ? a.order_index - b.order_index : 0)); // 如果需要排序，按 order_index 排序
}

// 对获取的数据进行监听
watchEffect(() => {
  console.log("allTask loaded:", allTask.value);
  if (allTask.value && allTask.value.length > 0) {
    const newWaitingRows = getRowsByStatus(0); // 获取状态为 0 的任务，且按 order_index 排序
    // 只有在 newWaitingRows 发生变化时才更新 waitingRows 和行状态
    if (!isEqual(newWaitingRows, waitingRows.value)) {
      waitingRows.value = newWaitingRows;
      // 更新 firstWaitingRow 和 lastWaitingRow
      if (waitingRows.value.length > 0) {
        firstWaitingRow.value = waitingRows.value[0];
        lastWaitingRow.value = waitingRows.value[waitingRows.value.length - 1];
      } else {
        // 如果没有等待行，清空 firstWaitingRow 和 lastWaitingRow
        firstWaitingRow.value = null;
        lastWaitingRow.value = null;
      }
    }
    const newInProgressRows = getRowsByStatus(1, false); // 获取状态为 1 的任务，不排序
    if (!isEqual(newInProgressRows, inProgressRows.value)) {
      inProgressRows.value = newInProgressRows;
    }
    const newCompletedRows = getRowsByStatus(2, false);
    if (!isEqual(newCompletedRows, completedRows.value)) {
      completedRows.value = newCompletedRows;
    }
    const newCancelledRows = getRowsByStatus(3, false);
    if (!isEqual(newCancelledRows, cancelledRows.value)) {
      cancelledRows.value = newCancelledRows;
    }

    sortedAllTableData.value = [
      ...inProgressRows.value,
      ...waitingRows.value,
      ...completedRows.value,
      ...cancelledRows.value,
    ];

    fetchTableData(currentPage.value, pageSize.value);
    console.log("table data:", tableData.value);
  }
});

// 启动定时器获取任务数据
onMounted(() => {
  // mySetInterval(
  //   fetchAllTableData,
  //   fetchTableData,
  //   1000,
  //   currentPage.value,
  //   pageSize.value
  // );
});

const dynamicForm = ref<any>([]);

const importDialog = ref<HTMLElement | null>(null);
const importDialogVisible = ref(false);
const commandTitle = ref("");
const case_source = ref(0);

//首页下拉框提供不同选项
const handleCommand = (command: string) => {
  importDialogVisible.value = true; //打开对话框
  removeInert(importDialog.value);
  commandTitle.value = command;
  if (command == "excel") case_source.value = 1;
  else case_source.value = 2;

  const options = ref([]);
  //todo: 获取目标路径options
  const byExcelFields = [
    {
      label: "任务编号",
      value: "case_number",
      type: "input",
      placeholder: "请输入任务编号",
    },
    {
      label: "用例文件",
      value: "excelPath", //case_source:1
      // type: "select",
      type: "file",
      placeholder: "请选择任务文件",
      // options,
    },
    {
      label: "目标路径",
      value: "target_location",
      type: "select",
      placeholder: "请选择目标路径",
      options, //点击下拉框时获取
    },
  ];
  const byTestManagementFields = [
    {
      label: "用例来源",
      value: "linkedIdList", //case_source=2
      type: "input",
      placeholder: "TPA",
      disabled: true,
    },
    {
      label: "项目名称",
      value: "projectName", //link...
      type: "select",
      placeholder: "请选择项目名称",
      options,
    },
  ];
  dynamicForm.value =
    command === "excel" ? byExcelFields : byTestManagementFields;
};

//清空select下拉框的值
const clearOptionValue = () => {};

const setInert = (element: HTMLElement | null) => {
  if (element && element instanceof HTMLElement)
    element.setAttribute("inert", ""); //禁止交互
};
const removeInert = (element: HTMLElement | null) => {
  if (element && element instanceof HTMLElement)
    element.removeAttribute("inert"); //交互
};

//关闭dialog对话框前的操作
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      clearOptionValue();
      setInert(importDialog.value);
      done();
    })
    .catch(() => {
      // catch error
    });
};

const isConversionScopeShown = ref(false);
const formData = ref<any>(null);

//获取目标路径
const targetLocation = ref("");
const onOptionSelect = (option: string | number | object | undefined) => {
  console.log("目标文件目录 选择", option);
  targetLocation.value = option as string;
};

//获取linked-id
const linkedId = ref("");
const onOptionSelectId = (id: string | number | object | undefined) => {
  console.log("linked-id ", id);
  linkedId.value = id as string;
  //加入task类型中
};
const taeProjectName=ref('')
const onOptionSelectprojectName=(name: string | number | object | undefined) => {
  console.log("linked-projectName ", name);
  taeProjectName.value = name as string;
  //加入task类型中
};

// 页码变化处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  console.log("cur page ", currentPage);
  console.log("page=====", page);

  fetchTableData(page, pageSize.value);
};

// 每页条数变化处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置页码
  fetchTableData(currentPage.value, pageSize.value);
};

//数据更新
const handleUpdate = () => {
  fetchAllTableData(); //更新所有数据
  fetchTableData(currentPage.value, pageSize.value); //刷新当前页数据
};
// 上移下移操作
const handleIndexUpdate = (curIndex: number, changedIndex: number) => {
  console.log("父组件接受的index", curIndex,changedIndex);
  handleUpdate();
};

//excel: 确认关闭对话框前：记录并保存form数据
async function getCreateRes(params: ParamsToCreateTaskExcel|ParamsToCreateTaskLinked) {
  await createTask(params);
  // console.log("创建成功时返回的数据",res);
  // if (res) await fetchAllTableData();
}

//2. test management导入
const testManagementVisible = ref(false);
const testManagementDialog = ref<HTMLElement | null>(null);

// 选择linked project后
const onNext = () => {
  testManagementVisible.value = true; //打开下一个对话框
  removeInert(testManagementDialog.value);
};
// 关闭对话框前
const handleCloseTestManagement = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      setInert(testManagementDialog.value);
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 选择的testCase
const selectedRowsInTae = ref<any[]>([]);
const onSelectedRows = (selectedRows:any) => {
  selectedRowsInTae.value = selectedRows;
};

// tae导入的数据 加入任务列表
const onConfirmTAEImport = () => {
  testManagementVisible.value = false; //关闭当前窗口；
  setInert(testManagementDialog.value);

  importDialogVisible.value = false; //关闭项目选项窗口；
  setInert(importDialog.value);

  //- 1.选中的所有usecase构成一个任务（to be continued）
  const ids = selectedRowsInTae.value.map((row) => row.id);
  console.log("ids  in homepage", ids);
  console.log("form data in home", formData.value);

  //- 2.每条usecase为一个任务
  selectedRowsInTae.value.forEach((row) => {
    const params: ParamsToCreateTaskLinked = {
      case_number: `TASK-${generateTaskNumber()}`, //自建：（excel中的formData.value.taskId）,
      converted_case_num: 1, //formData.value.converted_case_num,//
      target_location: formData.value.target_location, //
      case_source: formData.value.case_source, //2
      other_info: { linkedIdList: [row.id],tpaProjectId:linkedId.value,taeProjectName:taeProjectName.value }
    };
    getCreateRes(params);
    console.log("params====", params);
  });

  console.log("selectedRowsInTae.value", ...selectedRowsInTae.value);
  
  currentPage.value=1;//回到首页
  //刷新
  handleUpdate();
};

const onCancelTAEImport=()=>{
  testManagementVisible.value= false;

}

// 停止所有任务
const onStopAll = () => {
  cancelAllTask();
};



// TODO: 1. excel-确认导入
const onConfirm = () => {
  importDialogVisible.value = false; //关闭对话框
  setInert(importDialog.value);
  //todo: 数据展示在table中
  //todo: 创建新任务======createTask(params)
  //- excel:
  const params = {
    case_number: formData.value.taskId,
    converted_case_num: formData.value.converted_case_num,
    target_location: formData.value.target_location,
    case_source: formData.value.case_source, //1
    other_info: { excelPath: formData.value.excelPath },
 
  };
  console.log("formdata====", formData.value);

  console.log("params===", params);
  const res = getCreateRes(params);
  // const id = res[0].id;
  console.log("创建成功时返回的数据", res); //[{"id":1}]

  console.log("currentPage===", currentPage.value);

  fetchTableData(currentPage.value, pageSize.value);
};

//转换范围模块
const onSourceFileSelect = (
  formVal: { [key: string]: string | object } | null
) => {
  formData.value = formVal;
  console.log("formData======", formData.value);
  if (formData.value.excelPath) isConversionScopeShown.value = true;
};

const onCancel=(id:string|undefined|null)=>{
  console.log(id);
}
</script>

<template>
  <div class="home-warpper" id="home">
    <div class="header">
      <div class="header__left --flex-center">
        <img src="../assets/bigAIIcon.svg" alt="ai logo" class="header__icon" />
        <div class="header__title">任务记录</div>
      </div>

      <div class="header__btn --flex-center">
        <!-- inert -->
        <el-dropdown @command="handleCommand" class="header__btn__create">
          <el-button type="primary">
            新建任务<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 注释：暂时取消 EXCEL导入-->
              <!-- <el-dropdown-item command="excel">EXCEL导入 </el-dropdown-item> -->
              <el-dropdown-item command="test-management">
                Test management导入
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          class="header__btn__monitor"
          type="danger"
          aria-label="停止所有"
          @click="onStopAll"
        >
          停止所有
        </el-button>
      </div>
    </div>
    <el-dialog
      v-model="importDialogVisible"
      :title="`${commandTitle} 导入`"
      :before-close="handleClose"
      v-if="importDialogVisible"
      ref="importDialog"
    >
      <!-- :isClearForm="isClearForm" -->
      <DynamicForm
        :fields="dynamicForm"
        @update:formDataValue="(formData:any) => onSourceFileSelect(formData)"
        @update:selectedOption="(option:string | number | object | undefined) => onOptionSelect(option)"
        @update:linkedId="(id) => onOptionSelectId(id)"
        @update:taeProjectName="(projectName)=>onOptionSelectprojectName(projectName)"
      >
        <!-- 插入动态内容 -->
        <template #selectExtra>
          <!-- && dynamicForm.find((item)=>item.key==='usecaseFile') -->
          <div
            v-if="isConversionScopeShown"
            class="innerConversionScope --flex-center"
          >
            <span class="innerConversionScope__title">转换范围</span>

            <el-card class="innerConversionScope__content">
              <template #header>
                <div class="card-header --flex-center">
                  <span class="card-header__page">sheet 页</span>
                  <span class="card-header__range">编号范围</span>
                </div>
              </template>
              <div
                class="card__content --flex-center"
                v-for="(range, index) in formData.ranges"
                :key="index"
              >
                <div class="card__content__page">
                  {{ range.sheetName }}
                </div>
                <div class="card__content__range">
                  {{ range.range }}
                </div>
              </div>

              <template #footer>Footer content</template>
            </el-card>
          </div>
        </template>
      </DynamicForm>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="
              () => {
                importDialogVisible = false;
                setInert(importDialog);
              }
            "
            >Cancel</el-button
          >
          <el-button
            v-if="commandTitle === 'excel'"
            type="primary"
            @click="onConfirm"
          >
            Confirm
          </el-button>
          <el-button
            v-else-if="commandTitle === 'test-management'"
            type="primary"
            @click="onNext"
          >
            next
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- test management导入框：树形结构 -->
    <el-dialog
      v-if="testManagementVisible"
      ref="testManagementDialog"
      class="tpe-usecase-import"
      v-model="testManagementVisible"
      title="新建任务"
      modal-class="usecase-modal"
      :before-close="handleCloseTestManagement"
    >
      <template #header="{}">
        <div class="my-header">
          <div class="rectangle"></div>
          <div class="title">新建任务</div>
        </div>
      </template>
      <TpaUsecaseImport
        @update:selectedRows="onSelectedRows"
        :linkedId="linkedId"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onCancelTAEImport">Cancel</el-button>
          <el-button type="primary" @click="onConfirmTAEImport"> Ok </el-button>
        </div>
      </template>
    </el-dialog>

    <TaskTable
      class="main"
      :table-data="tableData"
      :total="total"
      :pageSizes="pageSizes"
      :waitingRowsLengthInAll="waitingRowsLengthInAll"
      :firstWaitingRow="firstWaitingRow"
      :lastWaitingRow="lastWaitingRow"
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      @update:cancel="(id:string)=>onCancel(id)"
      @update:index="handleIndexUpdate"
      @update:all="handleUpdate"
      @update:currentPage="(page: number) => handlePageChange(page)"
      @update:pageSize="(size:number)=>handleSizeChange(size)"
    />
  </div>
</template>

<style lang="scss" scoped>
.home-warpper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    .header__left {
      .header__icon {
        width: 50px;
      }
      .header__title {
        font-weight: bolder;
      }
    }
    .header__btn {
      &__create {
        margin-right: 0.5rem;
      }
    }
  }
  .innerConversionScope {
    margin-bottom: 18px;
    &__content {
      flex: 1;
      max-width: 100%;
      max-height: 200px;
      overflow-y: auto;
    }
    &__title {
      box-sizing: border-box;
      width: 120px;
      text-align: end;
      align-self: first baseline;
      padding: 0 12px 0 0;
    }
    .card-header,
    .card__content {
      &__page,
      &__range {
        text-align: left;
      }
      &__page {
        flex: 1;
      }
      &__range {
        flex: 2;
      }
    }
  }
  :deep(.el-overlay .el-overlay-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    gap: 0px;
    .my-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 172px;
      height: 29px;
      box-sizing: border-box;
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
        width: 118px;
        height: 29px;
        gap: 0px;
        opacity: 0px;
        color: #283a64;
        font-family: Noto Sans SC;
        font-size: 16px;
        font-weight: 700;
        line-height: 28.96px;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
      }
    }
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    height: 80%;
    // overflow: scroll;
    width: 100%;
    :deep(.el-pagination) {
      margin-top: 0.5rem;
    }
  }
}
:deep(.tpe-usecase-import) {
  width: fit-content;
}
:deep(.el-dialog) {
  margin: 0px;
}
</style>
