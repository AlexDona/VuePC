
import request from '@/utils/request'
// import service from '@/utils/service'
// const prefix = '/api'

const defaultParams = {
  asc: true,
  pageIndex: 1,
  pageSize: 15
}

export const getEntitiesList = (params) => request.post('/customer/cust/queryCustomerRelationPage', { ...defaultParams, ...params }) // 获取实体列表

const params1 = {
  custTypeId: 3,
  pageParam: {
    ...defaultParams,
    pageSize: 999
  }
}
export const getIndustryCompanyList = (params) => request.post('/customer/cust/queryPage', { ...params1, ...params }) // 获取产业公司列表

export const getFundProds = (params) => request.post('/business/product/getFundProds', { pageParams: defaultParams, ...params }) // 金融产品列表

export const postBindProduct = (params) => request.post('/business/customerProduct/multi/submitSelectedList', params) // 产品分配-单个-多个客户

export const postOtherBindProduct = (params) => request.post('/business/customerProduct/other/submitSelectedList', params) // 产品分配-非客户维度

export const getProductListDetail = (params) => request.get('/business/customerProduct/queryListAssigned', { params }) // 查询客户(经销商)已分配的产品列表

export const deleteCustomerProduct = (data) => request({
  url: `/business/customerProduct/delete/${data}`,
  method: 'post'
}) // 删除、解除客户产品

// 客户维度(预校验)
export const customerMultiPreCheck = (data) => request({
  url: `/business/customerProduct/multi/preCheck`,
  method: 'post',
  data
})

// 非客户维度(预校验)
export const customerOtherPreCheck = (data) => request({
  url: `/business/customerProduct/other/preCheck`,
  method: 'post',
  data
})

