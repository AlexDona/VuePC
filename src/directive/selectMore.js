import Vue from 'vue'
const selectMore = Vue.directive('selectMore', {
  inserted: function(el, binding) {
    const SELECTWRAP_DOM = el.querySelector(
      '.el-select-dropdown .el-select-dropdown__wrap'
    )
    SELECTWRAP_DOM.addEventListener('scroll', function() {
      // 滚动总高度 - 当前滚动高度 <= 可视高度  ---> 说明滚动条到底了，此时需要调借口获取更多数据
      const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
      // debugger
      if (condition) {
        const SELECTINPUT_DOM = el.querySelector(
          '.el-select__input')
        // 重新调接口需要拿到当前搜索的关键字
        binding.value(SELECTINPUT_DOM.value)
      }
    })
  }
})

export {
  selectMore
}
