<template>
  <div class="allContainer">
    <div class="treeContainer">
      <el-input v-model="filterText" placeholder="Filter keyword" />
      <div v-if="loading" class="loading-container">
        <ElLoading></ElLoading> <!-- You can use <el-loading></el-loading> here as well -->
        <span>加载中...</span>
      </div>
      <el-tree-v2
        v-else
        ref="treeRef"
        :props="defaultProps"
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="currentNodeExpand"
        :default-checked-keys="currentNodeChecked"
        :expand-on-click-node="expandOnClickNode"
        :auto-expand-parent="autoExpandParent"
        check-strictly
        :highlight-current="true"
        :filter-node-method="filterNode"
       
        @check-change="handleCheckChange"
        @node-click="nodeClick"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
      >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span v-if="(data.testcaseList.length)!==0">({{ (data.testcaseList.length) }})</span>
        </span>
      </template>

      </el-tree-v2>
    </div>
    <!-- :row-key="getRowKey" -->
    <!-- :virtual-scroll="true"
        :scrolling="scrolling"
        :total="tableData.length"
        :visible-count="visibleCount" -->
    <div class="tableContainer">
      <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          :columns="columns"
          :data="tableData"
          :width="width"
          :height="height"
           fixed
        />
      </template>
    </el-auto-resizer>

      <!-- <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%"
        max-height="70vh"
        height="100%"
        border
        @selection-change="handleSelectionChange"
  
      > -->
        <!-- 表格的多选框 -->
        <!-- <el-table-column type="selection" width="50px" fixed /> -->
        <!-- 数据列 -->
        <!-- <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          sortable
        />
      </el-table> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElTable, ElTree,ElLoading  } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
import {  ref, watch, defineEmits, nextTick } from "vue";
import { getLinkedSequencesByTpaId } from "@/api";
import {  ITestcase } from "@/types";
import {useDebounce} from "@/hooks"
const props=defineProps<{linkedId:string}>();
const linkedId=ref(props.linkedId)

interface TreeNodeData {
  id: string; //id
  name: string; //name
  childrenList: TreeNodeData[]; //childrenList
  hasChildren: boolean; // //hasChildren用于标记是否是叶节点
  testcaseList: ITestcase[];
  isPenultimate?: boolean;
}
// 树形节点的属性配置
const defaultProps = {
  label: "name",
  children: "childrenList",
  isLeaf: (node:TreeNodeData)=>!node.hasChildren,
};


const treeData = ref<TreeNodeData[]>([]);
const allData = ref<any[]>([]);

// 表格数据与列配置
// interface TableColumn {
//   label: string;
//   prop: string;
//   width?: string;
//   minWidth?: string;
// }

interface TableColumn {
  key: string;
  dataKey: string;
  title:string,
  width?: string;
  minWidth?: string;
}
const loading=ref(true)
// const visibleCount = ref(20); // 默认可见行数
// // row-key 函数，确保每一行有唯一的键
// // const getRowKey = (row: { testcaseId: any; }) => row.testcaseId;
//  // 处理滚动事件的状态
//  const scrolling = ref(false);


const columns = ref<TableColumn[]>([
  {
    key:"testcaseNumber",//唯一标志	
    dataKey:"testcaseNumber",//data 的唯一标志符	
    // prop: "testcaseNumber",
    title: "用例编号",
    minWidth: "20%",
    width: "160px",
  },
  { key: "testcaseName", dataKey: "testcaseName",title: "用例名称", minWidth: "60%" },
  { key: "priority",dataKey: "priority", title: "优先级", minWidth: "10%", width: "100px" },
]);

// const columns = ref<TableColumn[]>([
//   {
//     prop: "testcaseNumber",
//     label: "用例编号",
//     minWidth: "20%",
//     width: "160px",
//   },
//   { prop: "testcaseName", label: "用例名称", minWidth: "60%" },
//   { prop: "priority", label: "优先级", minWidth: "10%", width: "100px" },
// ]);

// 树的节点展开和选择相关的状态
const expandOnClickNode = ref(true);
const autoExpandParent = ref(true);
const currentNodeExpand = ref<string[]>([]); //["r2"]; // 例如默认展开 id 为 r2 的节点
const currentNodeChecked = ref<string[]>([]);
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

// 防抖-搜索输入框
const debounceFilter = useDebounce(filterText,500);
watch(debounceFilter,(newVal)=>{
  if(newVal){
    treeRef.value?.filter(newVal);//调用 Tree 实例对象的 filter 方法来过滤树节点。 方法的参数就是过滤关键字
  }else {
    treeRef.value?.filter(''); // 当搜索框为空时，恢复所有树节点
  }
});
// 过滤函数:  树节点的筛选
const filterNode = (inputValue: string, data: TreeNodeData) => {
  if (!inputValue) return true;
  const normalizedValue = inputValue.trim().toLowerCase();
  return data.name.toLowerCase().includes(normalizedValue);
};

const selectedNodes = ref<TreeNodeData[]>([]); // 用于存储选中节点的数据
const expandedNodes = ref<TreeNodeData[]>([]); // 用于存储展开节点的数据

// // 依据选中的节点更新表格数据
// const updateTableData = () => {
//   // 表格数据是与树节点的某些数据有关
//   const selectedTestcases =selectedNodes.value.flatMap(
//     (node: TreeNodeData) =>
//       node.testcaseList?.map(
//         (testcase: { testcaseInfo: ITestcaseInfo }) => testcase.testcaseInfo
//       ) || []
//   );
//   tableData.value = selectedTestcases;
//   // selectTableRows(selectedTestcases)
// };

const tableData = ref<any[]>([]);//当前表格展示的数据
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);//表格实例
const selectedTableRows=ref<any[]>([]);//当前表格中选中的行

// 选中节点的回调
const handleCheckChange = (
  node: TreeNodeData,
  checked: boolean,
  indeterminate: boolean
) => {
  console.log("handleCheckChange", node, checked, indeterminate);
  if (checked && node.testcaseList.length!==0) {
    const newData=node.testcaseList.map(
    (testcase: any) => testcase.testcaseInfo || []
  )
    // 避免重复添加数据
    const newEntries = newData.filter(
      (newRow: any) => !tableData.value.some((row: any) => row.id === newRow.id)
    );
    if (newEntries.length > 0) {
      // 合并新数据
      tableData.value.push(...newEntries);
    }
    //自动选中表格中新增的行
    // nextTick(() => {
      // if(tableRef.value){
      //   const updatedSelection=[...selectedTableRows.value,...newData]
      //   tableRef.value.clearSelection();//清空表格当前选中状态
      //   console.log('tableRef.value',tableRef.value);
      //   updatedSelection.forEach((row)=>tableRef.value.toggleRowSelection(row,true));
      //   selectedTableRows.value=updatedSelection;
      // }
    // });

  } else if(!checked && node.testcaseList){
  // 如果节点取消选中，从表格中移除
    const idsToRemove = node.testcaseList.map(
      (testcase: any) => testcase.testcaseInfo.id
    );

    tableData.value = tableData.value.filter(
      (item: any) => !idsToRemove.includes(item.id)
    );

    // 更新表格选中状态
    nextTick(() => {
      if (tableRef.value) {
        const updatedSelection = selectedTableRows.value.filter(
          (row) => !idsToRemove.includes(row.id)
        );
        tableRef.value.clearSelection();
        updatedSelection.forEach((row) => {
          tableRef.value!.toggleRowSelection(row, true);
        });
        selectedTableRows.value = updatedSelection;
      }
    });
  }
};

// 展开、选择当前节点de其子节点
const checkChildren = (data: TreeNodeData[]) => {
  data.forEach((each) => {
    // if (!currentNodeChecked.value.includes(each.id)) {
    //   currentNodeChecked.value.push(each.id); // 记录选中节点的 ID
    //   //加入选中结点 列表
    //   if (!selectedNodes.value.includes(each)) {
    //     selectedNodes.value.push(each);
    //   }
    // }
    if (!currentNodeExpand.value.includes(each.id)) {
      currentNodeExpand.value.push(each.id); // 记录展开节点的 ID
       //加入zhankai 结点 列表
      if (!expandedNodes.value.includes(each)) {
        expandedNodes.value.push(each);
      }
    }

    // 如果当前节点不是叶子节点，递归处理其子节点
    if (each.hasChildren && each.childrenList && each.childrenList.length > 0) {
      checkChildren(each.childrenList);
    }
  });
};

// 获取全部数据：linkedId
const asyncgetAll= async() => {
  const data = await getLinkedSequencesByTpaId(linkedId.value) as unknown as any[];
  allData.value =data;
  treeData.value = data;
  loading.value = false; 
  console.log('getLinkedSequencesByTpaId:data===',data);

  if(!data) return;
  console.log("selectedNodes", selectedNodes.value);

  //展开第一项及其子项
  currentNodeExpand.value.push(data[0].id);
  // currentNodeChecked.value.push(data[0].id);
  checkChildren(data[0].childrenList);
  // updateTableData();
};
onMounted(()=>{
  asyncgetAll();
})



interface IEmits {
  (e: "update:selectedRows", value: any): void;
  (e: "update:selectedRowsLength", value: any): void;
}
const emits = defineEmits<IEmits>();

// // 记录选择的表格行
// const selectedRows = ref<ITestcase[]>([]);
// const selectedRowsLenth=ref(0);

//监听表格多选状态变化
const handleSelectionChange = (rows: any) => {
  selectedTableRows.value=rows;

  // selectedRows.value = rows;
  // selectedRowsLenth.value=rows.length;
  console.log("当前选择的行:", selectedTableRows.value);

  emits("update:selectedRows", selectedTableRows.value);
  emits("update:selectedRowsLength", selectedTableRows.value.length);
};

// todo: 其他处理
const nodeClick = (data: TreeNodeData, node: Node) => {
  console.log("节点点击:", data, node);
  // 根据点击的树节点，更新表格的数据
  // updateTableData(data);
};

const nodeExpand = (data: TreeNodeData, node: Node) => {
  console.log("节点展开:", data, node);
};
const nodeCollapse = (data: TreeNodeData, node: Node) => {
  console.log("节点折叠:", data, node);
};

// const handleCancel = (node: Node) => {
//   // 处理取消编辑操作
//   console.log("编辑取消:", node);
// };
// const handleSave = (node: Node, newData: TreeNodeData) => {
//   // 处理保存编辑的操作
//   console.log("编辑保存:", node, newData);
// };
</script>

<style lang="scss" scoped>
.allContainer {
  width: 100%;
  display: flex;

  .treeContainer {
    display: flex;
    flex-direction: column;
    flex: 2;
    :deep(.el-tree){
      flex: 1;
      min-height:200px
    };
    :deep(.el-vl__wrapper){
      height: 100%;
    };
    :deep(.el-vl__window){
      height: 100% !important;
    };
  }
  .tableContainer {
    flex: 8;
    overflow: auto;
    // max-width: 800px;
    max-height: 100%;
    :deep(.el-table__header-wrapper) {
      // min-width: 220px;
    }
  }
}
</style>
