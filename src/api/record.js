// 建档管理
import request from '@/utils/request'

// 建档维护列表
export function recordList(params) {
  return request({
    url: '/customer/customer/bookbuilding/getByCustTypeId',
    method: 'post',
    params
  })
}
// 建档维护新增与编辑
export function recordSaveAndEdit(data) {
  return request({
    url: '/customer/customer/bookbuilding/saveAndEdit',
    method: 'post',
    data
  })
}
// 机构客户类型列表
export function customerTypeList(data) {
  return request({
    url: '/customer/custType/list',
    method: 'post',
    params: data
  })
}
// 建档维护停用
export function recordDisable(data) {
  return request({
    url: '/customer/customer/bookbuilding/disable',
    method: 'post',
    params: data
  })
}

// 建档维护启用
export function recordUnDisable(data) {
  return request({
    url: '/customer/customer/bookbuilding/enable',
    method: 'post',
    params: data
  })
}

// 建档查询详情
export function getConfigChangeRecord(data) {
  return request({
    url: '/admin/config/getConfigChangeRecord',
    method: 'post',
    data: data
  })
}

