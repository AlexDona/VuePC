import numberInput from '@/directive/input/inputNumber'
import Vue from 'vue'

const install = {
  install: function(Vue) {
    Vue.directive('number-input', numberInput)
  }
}
// if (window.Vue) {
//   window.numberInput = numberInput
//   Vue.use(install) // eslint-disable-line
// }
Vue.use(install) // eslint-disable-line
numberInput.install = install

export default numberInput
