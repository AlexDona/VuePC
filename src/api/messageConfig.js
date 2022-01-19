import request from '@/utils/request'

// 通知场景模板列表
export function getList(data) {
  return request({
    url: `/notify/msgTemplet/list`,
    method: 'post',
    data
  })
}

// 修改模板内容
export function updateContent(data) {
  return request({
    url: `/notify/msgTemplet/content`,
    method: 'post',
    params: data
  })
}

// 模板信息发送开关设置
export function messageSwitch(data) {
  return request({
    url: `/notify/msgTemplet/switch`,
    method: 'post',
    params: data
  })
}

//  客户配置列表
export function messageList(data) {
  return request({
    url: `/customer/custNotice/list`,
    method: 'post',
    data
  })
}

//  添加通知拦截信息
export function addFilter(data) {
  return request({
    url: `/notify/msgNotify/addFilter`,
    method: 'post',
    data
  })
}

// 模板查询
export function msgTemplet(msgNo) {
  return request({
    url: `/notify/msgTemplet/${msgNo}`,
    method: 'get'
  })
}

