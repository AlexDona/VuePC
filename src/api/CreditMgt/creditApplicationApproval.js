import request from '@/utils/request'
// import service from '@/utils/service'
// const prefix = '/api'

const pageParam = {
  asc: true,
  orderBy: '',
  pageIndex: 1,
  pageSize: 20
}

export const getEntitiesList = (params) => request.post('/business/credit/selectCreditApproveList', params) // 授信申请审批列表

export const postEntity = (params) => request.post('/business/credit/maintain/creditMaintain', params) // 授信维护-维护

const params1 = {
  custTypeId: 3,
  pageParam: {
    ...pageParam,
    pageSize: 999
  }
}
export const getIndustryCompanyList = (params) => request.post('/customer/cust/queryPage', { ...params1, ...params }) // 获取产业公司列表

export const getEntityDetail = (params) => request.post('/business/credit/creditPcDesc', params) // 授信维护详情 - 平台端，核心企业端

export const postCreditMaintainReceive = (params) => request.post('/business/credit/maintain/getCreditMaintain', params) // 授信维护领取

export const postReturnReceive = (params) => request.post('/business/credit/maintain/sendbackCreditMaintain', params) // 授信维护退领

export const postSettle = (params) => request.post('/business/credit/maintain/settleCreditMaintain', params) // 授信维护结清

export const postAccountMaintain = (params) => request.post('/business/credit/maintain/accountMaintain', params) // 授信维护-账号维护

export const approveSubmit = (params) => request.post('/business/credit/approveSubmit', params) // 授信审批 - 提交

export const approveStorage = (params) => request.post('/business/credit/approveStorage', params) // 授信审批 - 暂存
export const approveStorageView = (params) => request.post('/business/credit/approveStorageView', params) // 授信审批 - 暂存查看

