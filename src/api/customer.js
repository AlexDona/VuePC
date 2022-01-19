import request from '@/utils/request'
// import qs from 'qs'

// 分页查询-客户维护
/**
 * @params {string} contactsPersonName 经办联系人姓名
 * @params {string} custName 最早分配日期-结束
 * @params {number} custType 	客户类型 1-企业 2-个体
* @params {number} custTypeId 客户类型
  *      1 - 平台运营
  *      2 - 集团
  *      3 - 产业公司
  *      4 - 资金方
  *      5 - 经销商
  *      6 - 核心企业
  *      11 - 第三方1
  *      12 - 第三方2
  *      13 - 第三方3
  *      14 - 第三方4
  *      15 - 第三方5
 * @params {boolean} asc 是否升序
 * @params {string} orderBy 排序字段
 * @params {number} pageIndex 当前页
 * @params {number} pageSize 每页显示行数
 * **/
export const queryPage = data => {
  return request({
    url: '/customer/cust/queryPage',
    method: 'post',
    data
  })
}

// 机构客户类型列表
/**
 * @params {number} type 	客户类型 1-企业 2-个体
 * **/
export const queryCustType = data => {
  return request({
    url: '/customer/custType/list',
    method: 'post',
    data
  })
}

// 更新客户维护
/**
 * @params {string} contactsPersonEmail 	经办联系人邮箱
 * @params {string} contactsPersonIdtNo 	经办联系人证件号码
 * @params {string} contactsPersonMobile 经办联系人手机号
 * @params {string} contactsPersonMobile 经办联系人手机号
 * @params {string} contactsPersonName   经办联系人姓名
 * @params {string} cooperationTime 起始合作时间
 * @params {number} customerId
 * **/
export const updateMaintenance = data => {
  return request({
    url: '/customer/cust/update',
    method: 'post',
    data
  })
}
// 是否启用客户维护
/**
 * @params {number} id
 * @params {number} status
 * **/
export const updateStatusMaintenance = (id, status) => {
  const data = { id, status }
  return request({
    url: `/customer/cust/updateStatus`,
    method: 'post',
    data
  })
}

// 查询省数据
export function fetchProvinces() {
  return request({
    url: '/customer/province/getProvinceList',
    method: 'get'
  })
}
// 查询市数据
export function fetchCitiesWithCode(params) {
  return request({
    url: '/customer/city/getCityList',
    method: 'get',
    params: params
  })
}
// 查询区数据
export function fetchRegionsWithCode(params) {
  return request({
    url: '/customer/region/getReginList',
    method: 'get',
    params: params
  })
}

/**
* @params { * }
* @return
* @Descripttion { 客户类型--操作页 }
*
 **/
export const getCustomerTypeList = () => {
  return request({
    url: '/customer/custType/listByJD',
    method: 'get'
  })
}
/**
* @params { * }
* @return
* @Descripttion { 客户类型--列表页 }
*
 **/
export const getListByCustList = () => {
  return request({
    url: '/customer/custType/listByCustList',
    method: 'get'
  })
}

/**
* @params { String }  custName 客户名称
7, "退领")
* @return
* @Descripttion {获取上级公司下拉框 }
*
 **/
export const getParentCustomer = (params) => {
  return request({
    url: '/customer/cust/getParentCustomer',
    method: 'get',
    params
  })
}

/**
* @params { string } keyword	客户名称/社会信用代码
* @params { boolean } searchAgain	默认传0，是再次核验传1，否再次核验传2
* @return
* @Descripttion { 核验 }
*
 **/
export const getCustomerFromQcc = (params) => {
  return request({
    url: '/customer/cust/getCustomerFromQcc',
    method: 'get',
    params
  })
}

/**
* @params { * }
* @return
* @Descripttion { 新增客户暂存 }
*
 **/
export const addCustSaveOrSubmit = (data) => {
  return request({
    url: '/customer/cust/customerSubmit',
    method: 'post',
    data
  })
}

/**
* @params { * }
* @return
* @Descripttion { 白名单列表查询 }
*
 **/
export const queryWhiteList = (data) => {
  return request({
    url: '/customer/white-list/list',
    method: 'post',
    data
  })
}
/**
* @params { integer } id 客户id
* @return
* @Descripttion { 根据客户id删除白名单 }
*
 **/
export const deleteWhiteList = (id) => {
  return request({
    url: `/customer/white-list/delete/${id}`,
    method: 'delete'
  })
}

/**
* @params { integer }  custId 客户id
* @return
* @Descripttion { 客户审批、查看 }
*
 **/
export const getByCustomerId = (params, mode) => {
  return request({
    url: '/customer/cust/queryById',
    method: 'get',
    params
  })
}
/**
* @params { integer }  custId 客户id
* @return
* @Descripttion { 客户维护、查看 }
*
 **/
export const maintainByCustomerId = (params, mode) => {
  // 查看和维护需要不同的接口
  const reqUrl = mode === 'preview' ? '/customer/cust/getByCustomerId' : '/customer/cust/maintainByCustomerId'
  return request({
    url: reqUrl,
    method: 'get',
    params
  })
}
/**
* @return
* @Descripttion { 客户审批列表 }
*
 **/
export const getApplyList = (data) => {
  return request({
    url: '/customer/cust/apply/list',
    method: 'post',
    data
  })
}
/**
* @params { integer }  customerId 客户id
* @return
* @Descripttion { 客户审批 -领取 }
*
 **/
export const getReceiveOrBack = (customerId, mode) => {
  const reqUrl = mode === 'receive' ? `/customer/cust/pickUp/${customerId}`
    : `/customer/cust/pickDown/${customerId}`
  return request({
    url: reqUrl,
    method: 'get'
  })
}

/**
* @params { integer }  customerId 客户id
* @return
* @Descripttion { 客户审批 -核查列表 }
*
 **/
export const getverfiyList = (customerId) => {
  return request({
    url: `/customer/cust/verify/${customerId}`,
    method: 'get'
  })
}

/**
* @params { integer }  customerId 客户id
* @return
* @Descripttion { 客户审批 -核查 }
*
 **/
export const custVerfiy = (params) => {
  return request({
    url: `/customer/cust/verify/${params.customerId}?verifyType=${params.verifyType}`,
    method: 'post'
  })
}

/**
* @params { integer }  customerId 客户id
* @params { string }  remark 审批意见
* @params { integer }  actionType 1 --"提交申请"  2 --"暂存" 3 --"通过" 4 --"拒绝" 5 --"退回" 6 --"领取"
7, "退领")
* @return
* @Descripttion { 客户审批 -退回、拒绝、通过 }
*
 **/
export const custAction = (params) => {
  return request({
    url: `/customer/cust/action/${params.customerId}
    ?actionType=${params.actionType}&remark=${params.remark}`,
    method: 'post'
  })
}

/**
* @params { String }  coreCustomerName 核心企业
* @params { String }  customerName 产业公司
* @params { String }  parentCustomerName 上级产业公司
7, "退领")
* @return
* @Descripttion { 客户关系列表(列表查询) }
*
 **/
export const customerRelationList = (data) => {
  return request({
    url: '/customer/customerRelation/list',
    method: 'post',
    data
  })
}
/**
* @params { String }  fileTypeCode  影印件类型ID
* @params { String }  objectId  对象ID
* @params { String }  objectType   对象类型（Customer，Project，Task）
* @params { Integer }  viewType   1-查看页面，2-处理页面 7, "退领")
* @return
* @Descripttion { 批量客户获取文件 }
*
 **/
export const getCustomerFileList = (data) => {
  return request({
    url: '/file/v1/biz-files/getCustomerFileList',
    method: 'post',
    data
  })
}
// 待修改审批状态需要替换接口获取文件数据
export const getCustomerUpdateFileList = (params) => {
  return request({
    url: '/customer/cust/queryFiles',
    method: 'get',
    params
  })
}

/**
* @Descripttion { 获取核心企业下拉数据 }
*
 **/
export const queryListByCustId = (params) => {
  return request({
    url: `/customer/customerRelation/queryListByCustId`,
    method: 'get',
    params
  })
}
/**
* @Descripttion { 客户审批查看-审批轨迹 }
*
 **/
export const actionRecord = (customerId) => {
  return request({
    url: `/customer/cust/actionRecord/${customerId}`,
    method: 'get'
  })
}

/**
* @params { String } businessId 业务ID
* @params { String } businessType 业务类型
* @return
* @Descripttion { 查询修改记录列表 }
*
 **/
export const getConfigChangeRecord = (data) => {
  return request({
    url: '/admin/config/getConfigChangeRecord',
    method: 'post',
    data
  })
}
