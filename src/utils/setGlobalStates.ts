/* 子应用更改主应用状态，与主应用通信的具体方法 */
import action from './action'
export const setCurrentDataId = (id:string) => {
  action.setGlobalState({ currentDataId: id })
}
// 通知主应用更新
export const setAiStatus = () => {
  action.setGlobalState({ aiInProgress: true })
}
