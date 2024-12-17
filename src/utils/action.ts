/* 封装主应用与子应用之间交互的方法 */

import { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
 // 空值处理
function emptyAction () {
  console.log('Current execute action is empty!')
  return false
}

class Actions {
  // 默认值为空 Action
  actions: QiankunProps = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  }

  // 设置 actions
  setActions (actions: QiankunProps) {
    this.actions = actions
  }

  // 映射监听方法
  onGlobalStateChange (params:any, f?:boolean) {
    return this.actions.onGlobalStateChange(params, f)
  }

  // 映射修改方法
  setGlobalState (params: any) {
    return this.actions.setGlobalState(params)
  }
}

const actions = new Actions()
export default actions
