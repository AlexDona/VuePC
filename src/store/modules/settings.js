
import defaultSettings from '@/settings'
import { getDefaultConfig } from '@/utils/auth'
const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: getDefaultConfig().toneVal,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
    // const colorFileName = ['subMenuActiveText', 'menuHover', 'subMenuHover']
    // 保存当前颜色
    // window.localStorage.setItem('curtSystemColor', value)
    // 修改颜色
    /* for (const keys in state.variables) {
      if (colorFileName.includes(keys)) {
        state.variables[keys] = value
      }
    } */
    // window.location.href = '/#/dashboard'
    // console.log(state.variables, 333333)
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

