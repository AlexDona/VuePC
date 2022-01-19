// 权限管理
import request from '@/utils/request'
// 查询是否拥有相同的权限
export function getHaveCommonPermission(data) {
  return request({
    url: '/admin/permission/haveCommonPermission',
    method: 'post',
    data
  })
}
// 查看用户权限列表(树形结构)
export function getPermissionTreeList(userId) {
  return request({
    url: `/admin/permission/treeList/${userId}`,
    method: 'get'

  })
}
// 获取机构菜单树
export function getMenuTreeList(orgType) {
  return request({
    url: `/admin/menu/treeList/${orgType}`,
    method: 'get'
  })
}
// 权限配置
export function getPermissionConfig(data) {
  return request({
    url: '/admin/permission/config',
    method: 'post',
    data
  })
}

