import request from '@/utils/request'
import { getParamsTo } from '@/utils/service'
// const prefix = '/api'

const pageParam = {
  applicationStatus: 1,
  asc: true,
  pageIndex: 1,
  pageSize: 20
}

export const getEntitiesList = (params) => request.post('/business/credit/selectCreditList', params) // 授信申请列表

export const exportEntity = (params) => window.open('/business/credit/exportCreditList' + getParamsTo(params))// 授信申请 - 导出

const params1 = {
  custTypeId: 3,
  pageParam: {
    ...pageParam,
    pageSize: 999
  }
}

export const getIndustryCompanyList = (params) => request.post('/customer/cust/queryPage', { ...params1, ...params }) // 获取产业公司列表

