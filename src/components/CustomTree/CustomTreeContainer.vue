<template>
  <div class="column">
    <div ref="leftDomRef" class="column-left">
    <!-- 真正拖拽宽度的元素 -->
      <div
        ref="resizeBarRef"
        class="resize-bar"
        :class="{'is-resize': !asideExpand || !drag}"
        :style="{height: `${offsetHeight}px`,width: asideExpand? `${width}px`:`${minWidth}px`, 'min-width': !asideExpand? '40px' : '200px'}"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
      ></div>
      <div v-show="asideExpand && drag" class="resize-line"></div>
      <div class="resize-save" :class="{'is-drag': !drag}">
        <!-- 若需动态宽度，增加prop配置即可 :style="`width:${asideExpand ? `${width}px`:`${minWidth}px`}`" -->
        <el-container class="commonContainer" :class="border ? 'common-border' : ''">
          <!-- 头部搜索、图标区域 -->
          <el-header :style="{height: headerHeight + 'px'}">
            <slot name="header"></slot>
          </el-header>
          <!-- 收起时左侧的文案 -->
          <p v-show="!asideExpand" class="aside-desc">
            <slot name="desc">
              <span>{{ `${moduleName}模块` }}</span>
            </slot>
          </p>
          <!-- 树形结构:通过插槽的方式来展示 -->
          <el-main v-show="asideExpand">
            <el-scrollbar>
              <slot name="main"></slot>
            </el-scrollbar>
          </el-main>
          <slot></slot>
          <!-- 给可拖动元素添加鼠标按下事件 -->
        </el-container>
      </div>
    </div>
  </div>
      <!-- <div ref="resizeRef" class="resize"></div> -->
  </template>

  <script lang="ts" setup>
  import { debounce } from 'lodash-es'
  // import { throttle } from 'lodash-es'

  const props = withDefaults(defineProps<{
    asideExpand?: boolean,
    border?: boolean
    moduleName?: string
    width?: number
    minWidth?: number
    drag?: boolean
    headerHeight?:number
  }>(), {
    asideExpand: true,
    border: true,
    moduleName: '',
    width: 260,
    minWidth: 40,
    drag: true,
    headerHeight: 48
  })

  const emits = defineEmits(['offseHeightChange', 'update:width'])

  const leftDomRef = ref()
  const offsetHeight = ref(0)

  const handleResize = () => {
    offsetHeight.value = leftDomRef.value.offsetHeight
    emits('offseHeightChange', offsetHeight.value - props.headerHeight)
  }

  // 是否按下了拖动线条
  const isMouseDown = ref(false)
  // 鼠标按下事件
  const handleMouseDown = () => {
    isMouseDown.value = true
  }
  // 鼠标释放事件
  const handleMouseUp = () => {
    isMouseDown.value = false
  }

  // 解决操作树形结构文件夹后宽度恢复的问题
  const fristFlag = ref(true)
  // 解决操作树形结构文件夹后宽度恢复的问题
  const realWidth = ref(props.width)
  const throttleHandle = debounce(() => {
    // 初次进来以及变化范围小于1时都不改变宽度
    if (!fristFlag.value && resizeBarRef.value?.clientWidth - realWidth.value > 1) {
      realWidth.value = resizeBarRef.value?.clientWidth
      emits('update:width', realWidth.value + 6)
    } else {
      fristFlag.value = false
    }
  }, 500)
  // 监听拖动元素的宽度
  const resizeObserverHandle = () => {
    const resizeObserver = new ResizeObserver(() => {
      // 回调
      throttleHandle()
    })
    // 监听对应的dom
    resizeObserver.observe(resizeBarRef.value)
  }

  const resizeBarRef = ref()
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    nextTick(() => {
      handleResize()
      resizeObserverHandle()
    })
    // document.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    // document.removeEventListener('mouseup', handleMouseUp)
  })

  // /** 拖动改变宽度实现 */
  // let startX = 0
  // // 拖动改变元素宽度
  // const lastX = ref(props.width)
  // // 鼠标移动事件，将鼠标指针相对于屏幕的 X 轴坐标赋值给需要动态变化的元素宽度
  // const mouseMove = (event: any) => {
  //   // lastX.value = event.screenX
  //   let endX = event.clientX
  //   let moveLen = resizeRef.value.offsetLeft + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
  //   console.log(moveLen, 'moveLen')
  //   lastX.value = moveLen
  // }
  // const resizeRef = ref()
  // // 鼠标按下事件
  // const mouseDown = (event: any) => {
  //   startX = event.clientX
  //   document.addEventListener('mousemove', mouseMove)
  // }
  // // 鼠标释放事件
  // const mouseUp = () => {
  //   // 指定元素可改变的最大以及最小宽度
  //   const moveX = lastX.value > 500 ? 500 : lastX.value < props.width ? props.width : lastX.value
  //   lastX.value = moveX
  //   document.removeEventListener('mousemove', mouseMove)
  // }
  // // 鼠标释放节流事件
  // const handleMoveThrottled = throttle(mouseUp, 300)
  // onMounted时添加鼠标移动事件监听器
  // onMounted(() => {
  //   document.addEventListener('mouseup', handleMoveThrottled)
  // })
  // // 组件卸载时移除监听
  // onUnmounted(() => {
  //   document.removeEventListener('mouseup', handleMoveThrottled)
  // })

  </script>

  <style lang="scss" scoped>
  .column{
    display: flex;
    height: 100%;
  }
  .column-left {
    position: relative;
    float: left;
    overflow: hidden;
    // height: 500px;
  }
  .resize-save {
    position: absolute;
    top: 0;
    right: 6px;
    bottom: 0;
    left: 6px;
    padding: 16px;
    overflow-x: hidden;
  }
  .resize-bar {
    flex: 1;
    // min-width: 200px;
    max-width: 500px;
    height: 100%;
    resize: horizontal;
    cursor: ew-resize;
    cursor: col-resize;
    opacity: 0;
    overflow: scroll;
    // transition: all 50ms linear;
  }
  // .no-transition{
  //   transition: all 0.0ms linear;
  // }
  .is-resize{
    resize: none;
    cursor: default;
  }
  .is-drag{
    left: 0;
    right: 0;
  }
  /* 拖拽线 */
  .resize-line {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    // border-right: 2px solid #eee;
    // border-left: 1px solid #bbb;
    pointer-events: none;
  }
  .resize-bar:hover ~ .resize-line,
  .resize-bar:active ~ .resize-line {
      border-left: 1px dashed skyblue;
  }
  .resize-bar::-webkit-scrollbar {
    height: inherit;
  }

  /* Firefox只有下面一小块区域可以拉伸 */
  @supports (-moz-user-select: none) {
    .resize-bar:hover ~ .resize-line,
    .resize-bar:active ~ .resize-line {
        border-left: 1px solid #bbb;
    }
    .resize-bar:hover ~ .resize-line::after,
    .resize-bar:active ~ .resize-line::after {
      content: '';
      position: absolute;
      width: 16px; height: 16px;
      bottom: 0; right: -8px;
      background: url(./resize.svg);
      background-size: 100% 100%;
    }
  }
  .common-border{
    // border: 1px solid $--global--regular--border--color;
    border: 1px solid lightblue;
  }
  .commonContainer{
    // position: relative;
    transition: all 0.5s linear;
    flex-direction: column;
    height: 100%;
    flex: 1;
    position: absolute;
    top: 0;
    right: 0px;
    bottom: 0;
    left: 0;
    >.el-header{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0px 8px;
      // border-bottom: 1px solid $--global--regular--border--color;
      border-bottom: 1px solid lightblue;
    }
    .el-main{
      padding: 0px;
      .el-scrollbar{
        :deep(.el-scrollbar__view){
          height: 100%;
        }
      }
      .el-tree{
        display: inline-block;
        min-width: 100%;
      }
      // 更改选中后的字体颜色
      :deep(.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content){
        color: var(--el-color-primary);
      }
    }
    .aside-desc{
      display: flex;
      align-items: center;
      padding: 10px;
      writing-mode: vertical-lr; // 垂直方向内内容从上到下，水平方向从左到右。
      span{
        // margin: 10px 0;
        writing-mode: vertical-lr;
        letter-spacing: 5px;
      }
    }

  }
  // .resize{
  //     // position: absolute;
  //     // right: 0;
  //     // height: 100%;
  //     // width: 10px;
  //     // cursor: col-resize;
  //     width: 200px;
  //     max-width: 500px;
  //     height: inherit;
  //     resize: horizontal;
  //     cursor: ew-resize;
  //     cursor: col-resize;
  //     opacity: 0;
  //     overflow: scroll;
  //   }
  </style>
