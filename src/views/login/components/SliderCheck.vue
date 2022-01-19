<template>
  <div class="slider-check-box">
    <div class="mask" />
    <div class="slider-check" :class="rangeStatus ? 'success' : ''">
      <i id="drag" :class="rangeStatus ? successIcon : startIcon" @mousedown="rangeMove" />
      <span :class="rangeStatus ? 'zIndex' : 'noZindex'">{{ rangeStatus ? successText : startText }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 成功之后的函数
    successFun: {
      type: Function,
      default: () => {}
    },
    // 成功图标
    successIcon: {
      type: String,
      default: 'el-icon-success'
    },
    // 成功文字
    successText: {
      type: String,
      default: '验证成功'
    },
    // 开始的图标
    startIcon: {
      type: String,
      default: 'el-icon-d-arrow-right'
    },
    // 开始的文字
    startText: {
      type: String,
      default: '请拖住滑块，拖动到最右边'
    },
    // 失败之后的函数
    errorFun: {
      type: Function,
      default: () => {}
    },
    // 或者用值来进行监听
    status: {
      type: String,
      default: ''
    },
    // 重置滑块
    resetSlider: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disX: 0,
      rangeStatus: false
    }
  },
  watch: {
    resetSlider() {
      this.rangeStatus = false
      document.querySelector('#drag').style.transition = '0.1s all'
      document.querySelector('#drag').style.transform = 'translateX(0)'
      document.querySelector('.mask').style.width = '0px'
      // 执行失败的函数
      this.errorFun && this.errorFun()
    }
  },
  methods: {
    // 滑块移动
    rangeMove(e) {
      const ele = e.target
      const startX = e.clientX
      const eleWidth = ele.offsetWidth
      const parentWidth = ele.parentElement.offsetWidth
      const MaxX = parentWidth - eleWidth
      if (this.rangeStatus) {
        // 不运行
        return false
      }
      document.onmousemove = (e) => {
        const endX = e.clientX
        this.disX = endX - startX
        if (this.disX <= 0) {
          this.disX = 0
        }
        if (this.disX >= MaxX - eleWidth) {
          // 减去滑块的宽度,体验效果更好
          this.disX = MaxX
        }
        ele.style.transition = '0s all'
        document.querySelector('.mask').style.width = this.disX + 'px'
        ele.style.transform = 'translateX(' + this.disX + 'px)'
        e.preventDefault()
      }
      document.onmouseup = () => {
        if (this.disX !== MaxX) {
          ele.style.transition = '0s all'
          ele.style.transform = 'translateX(0)'
          document.querySelector('.mask').style.width = '0px'
          // 执行失败的函数
          this.errorFun && this.errorFun()
        } else {
          this.rangeStatus = true
          if (this.status) {
            this.$parent[this.status] = true
          }
          // 执行成功的函数
          this.successFun && this.successFun()
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin jc-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.slider-check-box {
  position: relative;
  .slider-check {
    background-color: #e9e9e9;
    position: relative;
    transition: 1s all;
    user-select: none;
    color: #585858;
    @include jc-flex;
    height: 35px;
    &.success {
      background-color: var(--theme);
      color: #fff;
      i {
        color: var(--theme);
      }
    }
    i {
      position: absolute;
      left: 0;
      width: 50px;
      height: 100%;
      color: var(--theme);
      background-color: #fff;
      border: 1px solid #d8d8d8;
      cursor: pointer;
      font-size: 24px;
      @include jc-flex;
      z-index: 99;
    }
    .zIndex{
      position: absolute;
      z-index: 99;
      color: #fff;
    }
    .noZindex{
      z-index: 0;
       color: #999;
    }
  }
  .mask{
    background: var(--theme);
    height: 35px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 98;
  }
}
</style>
