export default function () {
  const handleComps = () => {
    return {
      render: (ele:any) => {
        return h(
          // 1. 要渲染的标签名称：第一个参数【必需】
          ele.$attrs['tag-name'],
          // 2. 渲染标签的属性：第二个参数【可选】
          {
            style: ele.$attrs.style || {},
            class: ele.$attrs['class-name'],
            innerHTML: ele.$attrs.info
          }
        )
      }
    }
  }
  return {
    handleComps
  }
}
