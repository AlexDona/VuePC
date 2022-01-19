import request from '@/utils/request'

// 客户推送列表
export const selectCustomerPushList = data => {
  return request({
    url: '/business/credit/selectCustomerPushList',
    method: 'post',
    data
  })
}

// 客户推送
export const customerPush = data => {
  return request({
    url: '/business/credit/customerPush',
    method: 'get',
    params: data
  })
}
