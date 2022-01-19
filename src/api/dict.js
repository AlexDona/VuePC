// 字典
import request from '@/utils/request'

// 根据字典类型查询字典数据信息
export function getDictDataByType(type) {
  return request({
    url: '/base/dict/data/v1/getDictDataByType',
    method: 'get',
    params: { type }
  })
}

// 已经建档的核心企业；
export function getCustomerCores() {
  return request({
    url: '/customer/cust/getCustomerCores',
    method: 'post'
  })
}

// 已经建档的核心企业；
export function orgTypelist() {
  return request({
    url: '/customer/custType/orgTypelist',
    method: 'get'
  })
}

// 已经建档的核心企业；
export function templateList() {
  return request({
    url: '/business/customList/templateList',
    method: 'post'
  })
}

// 已经建档的核心企业；
export function getProducts(data) {
  return request({
    url: '/business/product/getProducts',
    method: 'get',
    params: data
  })
}
