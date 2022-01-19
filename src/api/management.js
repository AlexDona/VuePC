import request from '@/utils/request'

export function fetchMenuList(query) {
  return request({
    url: '/rbac/menu/v1/management/tree/menu',
    method: 'get',
    params: query
  })
}
export function fetchCheckedMenuList(query) {
  return request({
    url: '/rbac/menu/v1/management/tree/menu/checked',
    method: 'get',
    params: query
  })
}
export function createMenu(data) {
  return request({
    url: '/rbac/menu/v1/management/save/menu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/rbac/menu/v1/management/update',
    method: 'put',
    data
  })
}

export function getDeptTreeList() {
  return request({
    url: '/rbac/menu/v1/management/depttreelist',
    method: 'get'
  })
}

export function updateMenuDeptRalation(data) {
  return request({
    url: '/rbac/menu/v1/management/dept/menu/relation',
    method: 'post',
    data
  })
}

// 删除菜单
export function removeMenu(menuId) {
  return request({
    url: '/rbac/menu/v1/' + menuId,
    method: 'delete'
  })
}

// 下载管理列表
export function queryPage(data) {
  return request({
    url: '/file/v1/fileSyncDownload/queryPage',
    method: 'post',
    data: data
  })
}
