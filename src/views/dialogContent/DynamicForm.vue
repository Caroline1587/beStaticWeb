<template>
  <el-form :model="formData" label-width="120px">
    <!-- 遍历字段，渲染el-form-item -->
    <template v-for="(field, index) in fields" :key="index">
      <el-form-item :label="field.label">
        <el-input
          v-if="field.type === 'input'"
          v-model="formData[field.value]"
          :placeholder="field.placeholder"
          :disabled="field?.disabled"
          clearable
        />
        <!-- <el-upload
          v-if="field.type === 'file'"
          v-model="formData[field.key]"
          :placeholder="field.placeholder"
          :disabled="field?.disabled"
          @change="handleFileSelect"
          :key="formData[field.key]"
        /> -->
        <div
          v-else-if="field.type === 'file' && field.value === 'excelPath'"
          class="el-form-item__content el-input el-input__wrapper --flex-center"
          tabindex="-1"
        >
          <label for="file_uploads" class="input-file-label">
            {{ selectedFile ? selectedFile : field.placeholder }}</label
          >
          <input
            type="file"
            id="file_uploads"
            class="el-input__inner input-file-self"
            @change="handleFileSelect"
            accept=".xlsx,.xls"
          />
        </div>
        <el-select-v2
          v-else-if="field.type === 'select'"
          :placeholder="field.placeholder"
          v-model="optionValue"
          :options="options"
          clearable
          filterable
          @change="onSelected"
          @focus="onSelectFocused(field.value)"
        >
        </el-select-v2>
      </el-form-item>
      <!-- 如果当前字段是excelPath，后面显示插槽内容 -->
      <template v-if="field.value === 'excelPath'">
        <slot name="selectExtra"></slot>
      </template>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import * as XLSX from "xlsx";

import { fetchTargetPath, getProjectsLinkStatus } from "@/api";
import type { projectPathAbout, IProjectsLinkStatus } from "@/types";

defineProps({
  fields: Array<any>,
  // isClearForm:Boolean
});

interface IEmits {
  (e: "resetFormData"): void;
  (e: "update:formDataValue", value?: string | number | object): void;
  (e: "update:selectedOption", value?: string | number | object): void;
  (e: "update:linkedId", value?: string | number | object): void;
  (e: "update:taeProjectName", value?: string | number | object): void;
}
const emits = defineEmits<IEmits>();

const optionValue = ref("");
const options = ref<any>([]); //包括value和label

const formData = reactive<any>({
  taskId: 9090,
  case_number: "",
  ranges: [], // 假设要提取“编号范围”数据并显示
  converted_case_num: 0, //
  case_source: 0, //excel:1  link:2
  options: [],
  target_location: "",
});

export interface ISheetRange {
  sheetName: String;
  range: String;
}

const selectedFile = ref<String | null>(null);

// 上传前的钩子，检查文件类型
// const beforeUpload = (file: File) => {
//   const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
//   if (!isExcel) {
//     this.$message.error('只能上传 Excel 文件');
//   }
//   return isExcel;  // 返回 false 将会阻止文件上传
// };

// 处理选择的文件
const handleFileSelect = (event: Event) => {
  // console.log("File selection triggered");
  const inputElement = event.target as HTMLInputElement;
  console.log("input element value:===", inputElement.value);
  selectedFile.value = inputElement.value;

  if (!inputElement || !inputElement.files) {
    console.error("No files selected");
    return;
  }
  formData["excelPath"] = inputElement.value;

  const file = inputElement.files[0]; // 获取选中的文件
  if (!file) {
    console.error("No file selected");
    return;
  }
  console.log("Selected file:", file);

  let count = 0;
  // 使用 FileReader 读取文件
  const reader = new FileReader();
  // 绑定事件
  reader.onload = (e) => {
    const data = e.target?.result;
    if (!data) return;

    // 使用 xlsx 库解析 Excel 文件
    const workbook = XLSX.read(data, { type: "array" });

    // 解析每个 sheet 的数据
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonSheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log(`Sheet ${sheetName}:`, jsonSheetData);

      // 查找“编号范围”列的索引
      const headerRow: any = jsonSheetData[0];
      const rangeColumnIndex = headerRow.indexOf("编号范围"); // 查找“编号范围”列
      if (rangeColumnIndex !== -1) {
        // 提取“编号范围”列的所有数据
        const ranges = jsonSheetData
          .slice(1)
          .map((row: any) => row[rangeColumnIndex]);
        console.log(`编号范围 in ${sheetName}:`, ranges);

        const eachSheet: ISheetRange = {
          sheetName,
          range: ranges.join(", "),
        };
        // 将结果存储到 formData 中，用于在页面显示
        formData.ranges.push(eachSheet);
        count += ranges.length; //统计数
        // formData.ranges[sheetName] = ranges.join(", "); // 将数组合并为字符串
      } else {
        console.error(
          `Sheet ${sheetName} does not have the "编号范围" column.`
        );
      }
      formData.converted_case_num = count;
      console.log("formdatada", formData);
      emits("update:formDataValue", formData);
    });
  };

  // 读取文件为 ArrayBuffer（二进制数据）
  reader.readAsArrayBuffer(file);
};

//当选择器的输入框获得焦点时触发，加载options选项
async function onSelectFocused(value: string | number | undefined) {
  if (value === "target_location") {
    formData.case_source = 1; //excel

    let res = (await fetchTargetPath()) as unknown as [];
    console.log("path---res", res);
    options.value = res.map((project: { projectName: any; absPath: any }) => {
      const show = `${project.projectName}: ${project.absPath}`;

      return { label: show, value: project.absPath };
    }); //获取项目绝对路径
    formData.options = options.value;
  } else if (value === "projectName") {
    formData.case_source = 2; //tpa
    let res = await getProjectsLinkStatus();

    console.log("res===获取getProjectsLinkStatus", res);
    let linked: any;
    if (Array.isArray(res)) {
      linked = res
        .filter((project: IProjectsLinkStatus) => project.isLinked)
        .map((project: IProjectsLinkStatus) => ({
          label: project.linkedProjectName,
          value: project.linkedId,
          disabled: false,
          projectName: project.projectName,
        }));
    } else {
      console.error("Received data is not an array", res);
    }

    //linkedIdList==项目名称位置下拉信息
    // const linked=res.filter((project:IProjectsLinkStatus)=>project.isLinked).map((project:IProjectsLinkStatus)=>({ label: project.linkedProjectName, value: project.linkedId, disabled:false,projectName:project.projectName }));
    formData.options = options.value;

    return (options.value = linked);
  }
}

const projectName=ref<any>();//tae
/**
 * select选项，调对应接口
 */
const onSelected = async () => {
  console.log("optionValue=====", optionValue.value); //获取project-id
  //options已获取
  console.log("options.value=====", options.value);
  projectName.value=options.value.find((option: any)=>option.value===optionValue.value).projectName;

  const confirmedOption: projectPathAbout = options.value.map((op: any) => {
    if (optionValue.value === op.value) return op;
  })[0]; //判断id获取对应的完整project信息

  //获取所有允许保存位置：
  const allPath = await fetchTargetPath() as unknown as [];
  const project: projectPathAbout = allPath.filter(
    (path: projectPathAbout) => path.projectName == confirmedOption.projectName
  )[0];

  console.log();
  

  const target_location = project.absPath;
  formData.target_location = target_location;

  emits("update:formDataValue", formData);
  emits("update:selectedOption", target_location);
  emits("update:linkedId", optionValue.value);
  // emits("update:linkedId", optionValue.value);
  console.log('update:linkedId=====',optionValue.value);
  
  emits("update:taeProjectName", projectName.value);
};
</script>
<style lang="scss" scoped>
::-webkit-file-upload-button {
  font-size: inherit;
  height: inherit;
  color: red;
}
:deep(.el-form-item__label) {
  max-width: 120px !important;
}
.input-file-self {
  width: auto;
  opacity: 0;
}
.input-file-label {
  color: #a8abb2;
}
</style>
