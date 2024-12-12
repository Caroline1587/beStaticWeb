import request from "@/utils/request";
import type { ParamsToCreateTaskExcel,ParamsToCreateTaskLinked } from "@/types";

//获取所有任务信息
export const fetchTaskData = () => {
  return request.get("/v2/caseGen/task");
};

//新建任务
export const createTask = (params: ParamsToCreateTaskExcel|ParamsToCreateTaskLinked) => {
  return request.post("/v2/caseGen/task", params);
};

//取消指定任务
export const cancelTask = (task_id: number) => {
  return request.put(`/v2/caseGen/task/${task_id}/cancel`);
};

//取消所有任务
export const cancelAllTask = () => {
  return request.put("/v2/caseGen/task/stop");
};

//指定任务上移
export const moveUpByTaskId = (task_id: number) => {
  return request.put(`/v2/caseGen/task/${task_id}/moveUp`);
};

//指定任务下移
export const moveDownByTaskId = (task_id: number) => {
  return request.put(`/v2/caseGen/task/${task_id}/moveDown`);
};
