import request from '@/utils/request'

// 授信审批列表(待处理、已处理)
/**
 * @params {string} data.applyDateEnd 申请时间结束日
 * @params {string} data.applyDateStart 	申请时间起始日
 * @params {string} data.custName 客户名称
 * @params {string} data.fundName 资金方名称
 * @params {string} data.industryName 产业公司名称
 * @params {number} data.isHandled 是否已处理（授信申请可传空，授信审批列表必传）：0-待处理，1-已处理
 * @params {string} data.productName 产品名称
 * *@params {boolean} data.pageParam.asc 是否升序
 * *@params {string} data.pageParam.orderBy 排序字段
 * *@params {number} data.pageParam.pageIndex 当前页
 * *@params {number} data.pageParam.pageSize 每页显示行数
 * **/
export const selectCreditApproveList = data => request({
  url: '/business/credit/selectCreditApproveList',
  method: 'post',
  data
})

/**
 * description { 授信申请列表 }
 * **/
export const selectLoanApproveList = data => request({
  url: '/business/loanapply/selectLoanApproveList',
  method: 'post',
  data
})

// 授信维护-下载模板文件
export const exportCreditTemplate = () => '/business/credit/exportCreditTemplate'

// 授信维护-Excel审批
export const exportCreditExcel = () => '/api/business/credit/exportCreditExcel'

// 授信维护领取
/**
 * @params {number} creditNo 授信申请编号
 * */
export const getCreditMaintain = data => request({
  url: '/business/credit/maintain/getCreditMaintain',
  method: 'post',
  data
})

// 授信维护退领
/**
 * @params {number} creditNo 授信申请编号
 * */
export const sendbackCreditMaintain = data => request({
  url: '/business/credit/maintain/sendbackCreditMaintain',
  method: 'post',
  data
})

// 授信申请PC端详情
/**
 * @params {number} creditNo 授信申请编号
 * */
export const creditPcDesc = data => request({
  url: '/business/credit/creditPcDesc',
  method: 'post',
  data
})

// 授信审批列表(待处理、已处理)-下载
/**
 * @params {string} data.applyDateEnd 申请时间结束日
 * @params {string} data.applyDateStart 	申请时间起始日
 * @params {string} data.custName 客户名称
 * @params {string} data.fundName 资金方名称
 * @params {string} data.industryName 产业公司名称
 * @params {number} data.isHandled 是否已处理（授信申请可传空，授信审批列表必传）：0-待处理，1-已处理
 * @params {string} data.productName 产品名称
 * *@params {boolean} data.pageParam.asc 是否升序
 * *@params {string} data.pageParam.orderBy 排序字段
 * *@params {number} data.pageParam.pageIndex 当前页
 * *@params {number} data.pageParam.pageSize 每页显示行数
 * **/
export const exportCreditApprovalListExcel = data => request({
  url: '/business/credit/exportCreditApprovalListExcel',
  method: 'post',
  data
})

/**
 * @params {string} data.approveDate 批复日期
 * @params {string} data.approveResult 	授信结果 pass 通过 reject 拒绝 return 退回
 * @params {string} data.comment 审批意见
 * @params {string} data.creditLimitAmt 授信额度
 * @params {string} data.creditNo 授信申请编号
 * @params {number} data.creditTrem 授信期限
 * @params {string} data.expireDate 授信到期日
 * **/
export const approveSubmit = data => request({
  url: '/business/credit/approveSubmit',
  method: 'post',
  data
})

// 授信审批暂存
/**
 * @params {string} data.approveDate 批复日期
 * @params {string} data.approveResult 	授信结果 pass 通过 reject 拒绝 return 退回
 * @params {string} data.comment 审批意见
 * @params {string} data.creditLimitAmt 授信额度
 * @params {string} data.creditNo 授信申请编号
 * @params {number} data.creditTrem 授信期限
 * @params {string} data.expireDate 授信到期日
 * **/
export const approveStorage = data => request({
  url: '/business/credit/approveStorage',
  method: 'post',
  data
})

// 授信审批暂存查看
/**
 * @params {number} creditNo 授信申请编号
 * */
export const approveStorageView = data => request({
  url: '/business/credit/approveStorageView',
  method: 'post',
  data
})

// 获取审批资料
export const getMaterial = data => request({
  url: '/business/credit/getMaterial',
  method: 'post',
  data
})
export const getCreditCustomerInfo = data => request({
  url: '/customer/cust/getCreditCustomerInfo',
  method: 'post',
  data
})

/**
* @params { Integer } loanApplyId
* @return
* @Descripttion { 用款申请领取 }
*
 **/
export const clainLoanApply = params => request({
  url: '/business/loanapply/maintain/claim',
  method: 'get',
  params
})
/**
* @params { Integer } loanApplyId
* @return
* @Descripttion { 用款申请退领 }
*
 **/
export const unClainLoanApply = params => request({
  url: '/business/loanapply/maintain/unClaim',
  method: 'get',
  params
})
