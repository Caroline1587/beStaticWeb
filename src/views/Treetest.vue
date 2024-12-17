<template>
    <div class="allContainer">
        <h1>tree-test</h1>
        <caseListBtn :treeData="treeData" :disabled="false"/>
        <!-- <TreeTableDrawer :treeData="treeData" :tableData="tableData" :loading="loading"/> -->
    </div>
</template>
<script setup lang="ts">
import { getLinkedSequencesByTpaId } from "@/api";

// import TreeTableDrawer from "@/components/Drawer/TreeTableDrawer.vue"
import caseListBtn from "@/views/ProjectCase/caseManageList/components/caseListBtn.vue"

import { ITestcase } from "@/types";


/**
 *   const props = withDefaults(defineProps<{
    loading?:boolean
    treeData?:any
    tableData:any
    drawer:boolean
    drawerTitle?:string
    treeTitle?:string
    tableProps:TablePropsType[]
    selectedNumber:number
 * 
*/
const drawer=ref(false)
const tableProps=ref();
const treeLabel=ref('treeLabel')
const loading=ref(false)
const folderExpand= ref<boolean>(false)
const treeData=ref<any>();
const filterText=ref('');
const role={
  enableFolderAdd:true,
  enableFolderEdit:true,
  enableFolderDelete:true,
}

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

treeData.value= await getLinkedSequencesByTpaId('5e6a6b20937f4db991203b369c9d9686')
console.log('treeData.value=======',treeData.value);
const tableData=ref();
tableData.value=treeData.value[0].testcaseList
// console.log('treeData.value');

</script>
<style lang="scss" scoped>
.allContainer{
    background-color: red;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  .el-header{
    display: flex;
  }
  }
  :deep(.el-container .el-header .listBtn){
    display: flex;
    align-items: center;
  }
</style>