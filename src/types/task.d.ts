import { GenerateStatus } from "../config";

export interface ITask {
  id: number;
  case_number: string;
  converted_case_num: number;
  case_source: number;
  order_index: number;
  target_location: string;
  generate_status: GenerateStatus; //0-等待中 1-执行中 2-已完成 3-已取消
  create_time: string;
  finish_time: string;
}

// case_source: number,//用例来源（Excel=1，TPA=2）
// other_info : json结构
//      若case_source为1，则需包含一个key为 excelPath 的map
//      若case_source为2，则需包含一个key为 linkedIdList 的map

export type ParamsToCreateTaskExcel = Pick<
  ITask,
  "case_number" | "converted_case_num" | "target_location"
> &
{
  case_source: 1;
  other_info:  { excelPath: any;}
}

export type ParamsToCreateTaskLinked = Pick<
  ITask,
  "case_number" | "converted_case_num" | "target_location"
> &
{
  case_source: 2;
  // other_info:{linkedIdList: Map;}
  other_info: { linkedIdList: string[],tpaProjectId?: string,taeProjectName?:string};
};


