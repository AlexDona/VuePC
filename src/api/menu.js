import request from '@/utils/request'
// 获取所有顶级菜单
export function getMenuList(menuName, status) {
  return request({
    url: `/admin/menu/list?menuName=${menuName}&status=${status}`,
    method: 'get'
  })
}
// 新增菜单
export function addMenu(data) {
  return request({
    url: '/admin/menu/saveMenu',
    method: 'post',
    data
  })
}
// 修改菜单信息
export function updateMenu(data) {
  return request({
    url: '/admin/menu/updateMenuById',
    method: 'post',
    data
  })
}
// 根据菜单id删除菜单
export function deleteMenu(id) {
  return request({
    url: `/admin/menu/${id}`,
    method: 'post'
  })
}
