import request from '@/utils/request'

// 客户统计表
export function queryCustomerReport(data) {
  return request({
    url: `/business/statisticalReport/queryCustomerReport`,
    method: 'post',
    data
  })
}

// 授信统计表导出
export function exportCreditReport(data) {
  return request({
    url: `/business/statisticalReport/exportCreditReport`,
    method: 'post',
    data
  })
}

// 授信统计表
export function queryCreditReport(data) {
  return request({
    url: `/business/statisticalReport/queryCreditReport`,
    method: 'post',
    data
  })
}

// 用款统计表
export function queryLoanApplyReport(data) {
  return request({
    url: `/business/statisticalReport/queryLoanApplyReport`,
    method: 'post',
    data
  })
}

// 还款统计表
export function queryRepaymentReport(data) {
  return request({
    url: `/business/statisticalReport/queryRepaymentReport`,
    method: 'post',
    data
  })
}

// 获取SQL列表
export function getCustomizeSqlList(data) {
  return request({
    url: `/business/customizeSql/getCustomizeSqlList`,
    method: 'post',
    data
  })
}

// 根据自定义SQL导出Excel
export function exportSQL(id) {
  return request({
    url: `/business/customizeSql/export/${id}`,
    responseType: 'blob',
    method: 'get'
  })
}

// 更新SQL状态
export function updateCustomizeSqlStatus(id, data) {
  return request({
    url: `/business/customizeSql/updateCustomizeSqlStatus/${id}`,
    method: 'post',
    params: data
  })
}

// 添加SQL
export function addCustomizeSql(data) {
  return request({
    url: `/business/customizeSql/addCustomizeSql`,
    method: 'post',
    data
  })
}

// 获取自定义SQL导出记录
export function getExportRecord(id) {
  return request({
    url: `/business/customizeSql/getExportRecord/${id}`,
    method: 'get'
  })
}
