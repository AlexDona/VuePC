import request from '@/utils/request'
// import service from '@/utils/service'
// const prefix = '/api'
const pageParam = {
  asc: true,
  pageIndex: 1,
  pageSize: 20
}
export const getEntitiesList = (params) => request.post('/business/credit/maintain/queryList', { ...params }) // 授信维护列表

export const postEntity = (params) => request.post('/business/credit/maintain/creditMaintain', params) // 授信维护-维护

const params1 = {
  custTypeId: 3,
  pageParam: {
    ...pageParam,
    pageSize: 999
  }
}

export const getIndustryCompanyList = (params) => request.post('/customer/cust/queryPage', { ...params1, ...params }) // 获取产业公司列表

export const getEntityDetail = (params) => request.post('/business/credit/creditPcDesc', params) // 授信申请审批PC端详情

export const postCreditMaintainReceive = (params) => request.post('/business/credit/maintain/getCreditMaintain', params) // 授信维护领取

export const postReturnReceive = (params) => request.post('/business/credit/maintain/sendbackCreditMaintain', params) // 授信维护退领

export const postSettle = (params) => request.post('/business/credit/maintain/settleCreditMaintain', params) // 授信维护结清

export const postAccountMaintain = (params) => request.post('/business/credit/maintain/accountMaintain', params) // 授信维护-账号维护

/**
* @params {String} creditNo 授信申请编号
* @return: ""
* @Descripttion ""
*
 **/
export const getDescByParam = (data) =>
  request({
    url: '/business/credit/maintain/getDescByParam',
    method: 'POST',
    data
  })

/**
  * @params {*}
  * @return:
  * @Descripttion: 收款账户开户行接口
  *
 **/

// 获取银行列表
export function getBankList(data) {
  return request({
    url: '/business/common/business/bank',
    method: 'get',
    params: data
  })
}
// 获取开户行信息--省份
export function getBankProvince(data) {
  return request({
    url: '/business/common/business/province',
    method: 'get',
    params: data
  })
}
// 获取开户行信息--城市
export function getBankCity(data) {
  return request({
    url: '/business/common/business/city',
    method: 'get',
    params: data
  })
}
// 获取开户行信息--支行
export function getBankBranch(data) {
  return request({
    url: '/business/common/business/branch',
    method: 'get',
    params: data
  })
}
