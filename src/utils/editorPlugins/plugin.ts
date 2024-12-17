import { IDomEditor } from '@wangeditor/editor'
// import { DomEditor } from '@wangeditor/core'

export function withTab<T extends IDomEditor> (editor: T): T {
  // const { handleTab } = editor // 获取当前 editor API
  const newEditor = editor

  // 重写 tab事件
  newEditor.handleTab = () => {
    console.log('unununu')
    // document.
    // return true
    // document.ontouchmove = function(e){ return true; }
    // console.log(new);
    // const selectedNode = DomEditor.getSelectedNodeByType(newEditor, '.editorMain')
    // console.log(selectedNode)
    // if (selectedNode) {
    //   const above = Editor.above(editor) as NodeEntry<SlateElement>

    //   // 常规情况下选中文字外层 table-cell 进行跳转
    //   if (DomEditor.checkNodeType(above[0], 'table-cell')) {
    //     Transforms.select(editor, above[1])
    //   }

    //   let next = Editor.next(editor)
    //   if (next) {
    //     if (next[0] && (next[0] as BaseText).text) {
    //       // 多个单元格同时选中按 tab 导致错位修复
    //       next = (Editor.above(editor, { at: next[1] }) as NodeEntry<Descendant>) ?? next
    //     }
    //     Transforms.select(editor, next[1])
    //   } else {
    //     const topLevelNodes = newEditor.children || []
    //     const topLevelNodesLength = topLevelNodes.length
    //     // 在最后一个单元格按tab时table末尾如果没有p则插入p后光标切到p上
    //     if (DomEditor.checkNodeType(topLevelNodes[topLevelNodesLength - 1], 'table')) {
    //       const p = DomEditor.genEmptyParagraph()
    //       Transforms.insertNodes(newEditor, p, { at: [topLevelNodesLength] })
    //       // 在表格末尾插入p后再次执行使光标切到p上
    //       newEditor.handleTab()
    //     }
    //   }
    //   return
    // }

    // handleTab()
  }
  // 重写其他 API ...

  // 返回 newEditor ，重要！
  return newEditor
}
