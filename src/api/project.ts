import request from "@/utils/request";
// import type {
//   projectPathAbout,
//   IProjectsLinkStatus,
//   ILinkedSequence,
// } from "@/types";

//## 路径等信息获取相关

//目标位置接口
//- 获取所有允许保存位置：
export const fetchTargetPath = ():any => {
  return request.get("/v2/project");
};

//项目名称位置下拉信息
export const getProjectsLinkStatus = ():any => {
  return request.get("/tae/getProjectsLinkStatus");
};

//项目列表展示信息获取
export const getLinkedSequencesByTpaId = (tpaId:string) => {
  console.log(tpaId);
  return request.post("/tae/getLinkedSequencesByTpaId",JSON.stringify({tpaId}));
};
