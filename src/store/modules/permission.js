import { constantRoutes } from '@/router'
import { getUserMenuList } from '@/api/role'
import { newUUID } from '@/utils'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

export function generaMenu(result, menus, level, parent) {
  // level++
  menus.forEach(menu => {
    const item = {
      path: menu.path,
      // component: menu.children && menu.children.length ? Layout : () => import('@/views' + item.path),
      // component: menu.children && menu.children.length ? Layout : async resolve => {
      component: !menu.parentId ? Layout : async resolve => {
        await require(['@/views' + item.path.replace(/(\/\:).*$/ig, '')], resolve)
      },
      name: menu.pageName,
      meta: {
        title: menu.menuTitle,
        icon: menu.level > 1 ? '' : menu.icon // 'user'
      },
      children: [],
      hidden: menu.hidden,
      level: menu.level
    }
    if (menu.children && menu.children.length) {
      generaMenu(item.children, menu.children, menu.level, menu.level === 1 ? item : parent)
    } else {
      if (menu.level > 2) {
        const target = Object.assign({}, item)
        target['hidden'] = true
        target.component = async resolve => {
          await require(['@/views' + target.path.replace(/(\/\:).*$/ig, '')], resolve)
        }
        parent.children.push(target)
        const newid = newUUID(8)
        item.path += newid
        item.name += newid
        item['redirect'] = target.path
      }
    }
    result.push(item)
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      const menus = []
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      getUserMenuList().then(res => {
        generaMenu(menus, res.data, 0)
        accessedRoutes = menus
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

