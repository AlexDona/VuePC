
import request from '@/utils/request'
// 获取放款维护详情
export function getLoanMaintain(data) {
  return request({
    url: `/business/loanapply/loanPcDesc`,
    method: 'post',
    params: data
  })
}
// 维护放款信息
export function approval(data) {
  return request({
    url: `/business/loanapply/maintain/approval`,
    method: 'post',
    data: data
  })
}

// 查询还款列表
export function queryRepaymentPage(data) {
  return request({
    url: '/business/loan/maintain/queryRepaymentPage',
    method: 'post',
    data
  })
}
// 查询还款列表
export function loanapplyRepaymentPage(data) {
  return request({
    url: '/business/loanapply/repayment/page',
    method: 'post',
    data
  })
}

// 查询还款列表
export function getRepaymentRecords(id) {
  return request({
    url: `/business/loan/maintain/getRepaymentRecords/${id}`,
    method: 'Get'
  })
}

// 查询还款维护列表
export const repayMaintainList = data => {
  return request({
    url: `/business/loanapply/repayment/page`,
    method: 'post',
    data
  })
}

// 新增编辑还款记录(还款维护列表-维护)
export const addOrEditRepaymentRecord = data => {
  return request({
    url: `/business/loanapply/repayment/addOrEditRepaymentRecord`,
    method: 'post',
    data
  })
}

// 逾期提醒
export const overDueRemind = id => {
  return request({
    url: `/business/loan/maintain/overDueRemind/${id}`,
    method: 'post'
  })
}

// 查看还款计划
export const getRepaymentPlanList = data => {
  return request({
    url: `/business/loanapply/repayment/getRepaymentPlanList`,
    method: 'get',
    params: data
  })
}

/**
 * @description: 领取
 * @name:
 * @param {number} loanApplyId
 * @returns {*}
 */

export const repaymentClaim = data => {
  return request({
    url: `/business/loanapply/repayment/claim`,
    method: 'get',
    params: data
  })
}
/**
 * @description: 退领
 * @name:
 * @param {number} loanApplyId
 * @returns {*}
 */

export const repaymentUnClaim = data => {
  return request({
    url: `/business/loanapply/repayment/unClaim`,
    method: 'get',
    params: data
  })
}

// 用款审批详情
export const loanapplyDetail = id => {
  return request({
    url: `/business/loanapply/${id}`,
    method: 'get'
  })
}

// 授信申请列表 (获取单个属性)
export function selectCreditListProperty(data) {
  return request({
    url: `/business/credit/selectCreditListProperty?select=${data.select}`,
    method: 'post',
    data
  })
}

// 授信申请列表
export function selectCreditList(data) {
  return request({
    url: `/business/credit/selectCreditList`,
    method: 'post',
    data
  })
}

// 新增放款
export function add(data) {
  return request({
    url: `/business/loanapply/maintain/add`,
    method: 'post',
    data
  })
}

// 新增还款指引
export function addRepaymentGuide(data) {
  return request({
    url: `/business/loanapply/maintain/addRepaymentGuide`,
    method: 'post',
    data
  })
}

// 获取还款指引
export function getRepaymentGuide(id) {
  return request({
    url: `/business/loanapply/maintain/repaymentGuide/${id}`,
    method: 'get'
  })
}

// 根据客户id和影像件类型获取文件
export function getFileMapList(data) {
  return request({
    url: `/file/v1/biz-files/getFileMapList`,
    method: 'post',
    data
  })
}

// 删除影印件
export function deleteFile(id) {
  return request({
    url: `/file/v1/biz-files/delete/${id}`,
    method: 'post'
  })
}

// 用款申请PC端详情
export function loanPcDesc(data) {
  return request({
    url: `/business/loanapply/loanPcDesc`,
    method: 'post',
    params: data
  })
}

// 用款审批提交
export function loanApproveSubmit(data) {
  return request({
    url: `/business/loanapply/loanApproveSubmit`,
    method: 'post',
    data
  })
}

// 用款申请暂存
export function approveStorage(data) {
  return request({
    url: `/business/loanapply/approveStorage`,
    method: 'post',
    data
  })
}

// 用款申请查看
export function approveStorageView(data) {
  return request({
    url: `/business/loanapply/approveStorageView`,
    method: 'post',
    data
  })
}

// 修改订单数据
export function updateOrderInfo(data) {
  return request({
    url: `/business/order/updateOrderInfo`,
    method: 'post',
    data
  })
}

