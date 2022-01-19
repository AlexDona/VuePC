/*
 * @Author: your name
 * @Date: 2021-09-20 17:51:45
 * @LastEditTime: 2021-09-24 10:54:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddf-web\src\api\finance.js
 */
import request from '@/utils/request'

// 放款维护列表
export function getLoanapplyListProds(data) {
  return request({
    url: '/business/loanapply/maintain/list',
    method: 'post',
    data
  })
}
// 放款维护列表
export function getLendingProds(data) {
  return request({
    url: '/business/loanapply/maintain/page',
    method: 'post',
    data
  })
}

// 放款维护-领取
export function getLendingClaim(data) {
  return request({
    url: '/business/loanapply/maintain/claim',
    method: 'get',
    params: data
  })
}
// 放款维护-退领
export function getLendingUnClaim(data) {
  return request({
    url: '/business/loanapply/maintain/unClaim',
    method: 'get',
    params: data
  })
}

// 用款申请列表
export function getLoanProds(data) {
  return request({
    url: '/business/loanapply/page',
    method: 'post',
    data
  })
}
// 用款审批列表
export function getLoanAppProds(data) {
  return request({
    url: '/business/loanapply/approve',
    method: 'post',
    data
  })
}

// 金融产品列表
export function getFundProds(data) {
  return request({
    url: '/business/product/getFundProds',
    method: 'post',
    data
  })
}

// 金融产品列表--停用产品
export function updateProdStatus(data) {
  return request({
    url: '/business/product/updateProdStatus',
    method: 'post',
    data
  })
}
// 客户列表
export function getCustProds(data) {
  return request({
    url: '/customer/cust/queryPage',
    method: 'post',
    data
  })
}
// 客户列表-改
export function queryListPage(data) {
  return request({
    url: '/customer/cust/queryListPage',
    method: 'post',
    data
  })
}

// 维护详情
export function getDetailsMaintenance(data) {
  return request({
    url: '/admin/config/getConfigChangeRecord',
    method: 'post',
    data
  })
}

// 单个查询客户
export function queryById(data) {
  return request({
    url: '/customer/cust/queryById',
    method: 'get',
    params: data
  })
}

// 新增金融产品-产品信息
export function saveProdInfo(data) {
  return request({
    url: '/business/product/saveProdInfo',
    method: 'post',
    data
  })
}

// 新增金融产品-资料清单
/* export const saveProdMaterial = data => request({
  url: '/business/product/saveProdMaterial',
  method: 'post',
  data
}) */

// 获取资金方下拉数据
export function getByCustTypeId(data) {
  return request({
    url: '/customer/customer/bookbuilding/getByCustTypeId',
    method: 'post',
    params: data
  })
}

// 获取产品详情
export function getProductDetail(data) {
  return request({
    url: '/business/product/getProductDetail',
    method: 'post',
    params: data
  })
}

// 新增产品信息
export function saveProds(data) {
  return request({
    url: '/business/product/saveProds',
    method: 'post',
    data
  })
}

// 产品分配列表-产品维度
/**
 * @params {number} fundId 资金方ID
 * @params {string} maxValidLimit 最大有效期
 * @params {string} minAssignedEndDate 最早分配日期-结束
 * @params {string} minAssignedStartDate 最早分配日期-开始
 * @params {string} minValidLimit 最小有效期
 * @params {object} pageParam 分页参数
 * @params {boolean} pageParam.asc 是否升序
 * @params {string} pageParam.orderBy 排序字段
 * @params {number} pageParam.pageIndex 当前页
 * @params {number} pageParam.pageSize 每页显示行数
 * @params {number} productId 产品ID
 * @params {string} productName 产品名称
 * **/
export const assignedList = data => request({
  url: '/business/customerProduct/prodDimension/assignedList',
  method: 'post',
  data
})

// 产品分配列表-产品维度-下载

export const exportProdTable = data => request({
  url: '/business/customerProduct/prodDimension/export',
  method: 'post',
  data
})

/**
 * @params {string} data.province 省
 * @params {string} data.productName 产品名称
 * @params {string} data.area 区
 * @params {string} data.city 市
 * @params {string} data.custName 客户名称
 * @params {string} data.fundName 资金方名称
 * @params {string} data.industrialCustomreId 产业公司
 * @params {object} data.pageParam 分页参数
   * @params {boolean} data.pageParam.asc 是否升序
   * @params {string} data.pageParam.orderBy 排序字段
   * @params {number} data.pageParam.pageIndex 当前页
   * @params {number} data.pageParam.pageSize 每页显示行数
 * **/
// 产品分配列表-企业维度
export const companyAssignedList = data => request({
  url: '/business/customerProduct/custDimension/assignedList',
  method: 'post',
  data
})

// 产品分配列表-产品维度-查询产品被分配的客户
/**
 * @params {number} productId
 * */
export const listCustByProd = data => request({
  url: '/business/customerProduct/listCustByProd',
  method: 'get',
  params: data
})

// 企业维度获取已分配的金融产品
/**
 * @params {number} dealerCustomerId custId 客户id
 * @params {number} industrialCustomerId
 * */
export const queryListAssigned = data => request({
  url: '/business/customerProduct/queryListAssigned',
  method: 'get',
  params: data
})

// 获取客户下拉框
/**
 * @params {number} custTypeId 客户类型 1-平台 2-核心企业 3-产业公司 4-资金方 5-经销商 6-零售商 7-种植户
 * */
export const listProductSimple = _ => request({
  url: `/business/product/listProductSimple`,
  method: 'get'
})

/**
* @params {integer} materialType	资料清单类型，大类里面的小类，比如微众、华润等等
* @params {integer} parentMaterialType	资料类型，1授信资料清单，2用款资料清单，3其他
* @params {integer} productId	产品ID
* @return
* @Descripttion 获取产品模板字段和勾选字段
*
 **/
export const getProductMaterial = data => request({
  url: '/business/product/getProductMaterial',
  method: 'post',
  mask: false,
  data
})
// 获取产品需要用户编辑的模板字段
export const getNeedEditTempCloum = data => request({
  url: '/business/product/getNeedEditTempCloum',
  method: 'post',
  data
})

// 生成二维码
export const createQrCode = data => request({
  url: '/business/common/business/createQrCode',
  method: 'post',
  // 设置文件流响应的类型
  responseType: 'arraybuffer',
  params: data
})

// 订单列表
export const getOrderList = data => request({
  url: '/business/saleorder/page',
  method: 'post',
  data
})

// 订单查询
export const fundOrderPage = data => request({
  url: '/business/saleorder/fundOrderPage',
  method: 'post',
  data
})
// 月度订单信息列表
export const queryOrderByMonth = data => request({
  url: '/business/saleorder/queryOrderByMonth',
  method: 'post',
  data
})

/**
* @params {String} custCode 客户编号
* @params {String} custName	客户名称
* @params {String} m1	当前月
* @params {String} orgName	销售组织
* @return
* @Descripttion {String} 月度订单信息批量补录
*
 **/

export const batchWriteOrderByMonth = data => request({
  url: '/business/saleorder/batchWriteOrderByMonth',
  method: 'post',
  data
})

// 订单查询
export const fundOrderHeader = () => request({
  url: '/business/saleorder/fundOrderHeader',
  method: 'get'
})

// 订单删除
/**
 * @params {array} data.ids
 * */
export const deleteByIds = (data) => request({
  url: '/business/saleorder/deleteByIds',
  method: 'get',
  params: data
})
/**
* @params { integer } flowType
* @return
* @Descripttion { 按流程类型查询可用流程信息 }
*
 **/
export const queryFlowTmeplateByType = (data) => request({
  url: '/business/flowTemplet/queryFlowTmeplateByType',
  method: 'post',
  params: data
})

/**
* @params { * }
* @return
* @Descripttion { 获取影像配置模板列表 }
*
 **/
export const getFileFolderTemplate = () => request({
  url: '/business/fileFolder/getFileFolderTemplate',
  method: 'post'
})

// ------------------------------------------- 新版订单列表  ------------------------------------------
// 获取列表配置面板信息
export function getTableConfPanelInfo(data) {
  return request({
    url: '/business/tableConf/getTableConfPanelInfo',
    method: 'post',
    data: data
  })
}
// 获取产品（下拉框）
export function getProductConfPulldown() {
  return request({
    url: '/business/tableConf/getProductConfPulldown',
    method: 'post'
  })
}

// 获取列表名称（下拉框）
export function getTableConfPulldown(data) {
  return request({
    url: '/business/tableConf/getTableConfPulldown',
    method: 'post',
    params: data
  })
}

// 获取查询的表配置信息，用于前端展示数据）
export function getTableConfViewInfo(data) {
  return request({
    url: '/business/tableConf/getTableConfViewInfo',
    method: 'post',
    params: data
  })
}

// 分页条件查询订单类客户数据
export function page(data) {
  return request({
    url: '/business/order/page',
    method: 'post',
    data: data
  })
}

// 条件查询订单类客户excel文件数据生成
export function queryDownload(data) {
  return request({
    url: '/business/order/queryDownload',
    method: 'post',
    data: data
  })
}
