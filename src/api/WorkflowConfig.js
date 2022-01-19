import request from '@/utils/request'

// 流程配置-分页查询
export function queryByPage(data) {
  return request({
    url: `/business/flowTemplet/queryByPage`,
    method: 'post',
    data
  })
}

// 流程配置-分页查询
export function flowCustTypeDicList(data) {
  return request({
    url: `/business/flowTemplet/flowCustTypeDicList`,
    method: 'post',
    data
  })
}

// 编辑流程模板
export function updateWorkflow(data) {
  return request({
    url: `/business/flowTemplet/update`,
    method: 'post',
    data
  })
}

// 流程配置-查看模板详情
export function queryFlowById(id) {
  return request({
    url: `/business/flowTemplet/queryFlowById/${id}`,
    method: 'get'
  })
}

// 新增流程模板
export function addConfig(data) {
  return request({
    url: `/business/flowTemplet/add`,
    method: 'post',
    data
  })
}

// 查询客户列表
export function queryCustByList(data) {
  return request({
    url: `/customer/cust/queryCustByList`,
    method: 'post',
    data
  })
}

// 流程配置-查看审批节点轨迹详情
export function queryFlowNodeById(id) {
  return request({
    url: `/business/flowTemplet/queryFlowNodeById/${id}`,
    method: 'get'
  })
}

// 删除流程模板
export function deleteFlowById(data) {
  return request({
    url: `/business/flowTemplet/deleteFlowById`,
    method: 'delete',
    params: data
  })
}
