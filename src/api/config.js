import request from '@/utils/request'

// 查询分页列表接口
export function selectList(data) {
  return request({
    url: '/business/customList/selectPage',
    method: 'post',
    data
  })
}

// 模板列表查看接口
export function selectListDetail(data) {
  return request({
    url: '/business/customListConf/selectList',
    method: 'get',
    params: data
  })
}

// 列表配置管理-分页条件查询
export function tableConfPage(data) {
  return request({
    url: '/business/tableConf/page',
    method: 'post',
    data: data
  })
}

// 列表配置管理-禁用、启用
export function tableConfDisableEnable(data) {
  return request({
    url: '/business/tableConf/tableConfDisableEnable',
    method: 'post',
    data: data
  })
}

// 新增保存表配置信息提交
export function saveConfSubmit(data) {
  return request({
    url: '/business/tableConf/saveConfSubmit',
    method: 'post',
    data: data
  })
}

// 查询表的配置信息
export function getTableConfInfo(data) {
  return request({
    url: '/business/tableConf/getTableConfInfo',
    method: 'post',
    data: data
  })
}

// 更新表配置信息
export function updateConfSubmit(data) {
  return request({
    url: '/business/tableConf/updateConfSubmit',
    method: 'post',
    data: data
  })
}

// 更新表字段的配置信息提交
export function updateFieldConf(data) {
  return request({
    url: '/business/tableConf/updateFieldConf',
    method: 'post',
    data: data
  })
}
