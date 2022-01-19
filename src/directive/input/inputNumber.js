function onInput(el, ele, binding, vnode) {
  function handle() {
    console.log(ele.value,'vvv')
    // 只保留数字
    ele.value = ele.value.replace(/[^\d]/g, '')
  }
  return handle
}

export default {
  bind(el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
  }
}
