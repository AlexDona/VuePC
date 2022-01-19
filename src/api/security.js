import request from '@/utils/request'

// 发送邮件短信
export function sendMessage(query) {
  return request({
    url: '/admin/user/sendEmailCode',
    method: 'post',
    params: query
  })
}

// 发送邮件短信
export function validMessages(query) {
  return request({
    url: '/adapter/v1/biz-notice-records/checkcode/valid',
    method: 'get',
    params: query
  })
}

// 修改邮箱
export function editEmail(query) {
  return request({
    url: '/admin/user/changeEmail',
    method: 'post',
    params: query
  })
}

// 修改手机
export function editPhone(query) {
  return request({
    url: '/admin/user/changePhoneNumber',
    method: 'post',
    params: query
  })
}

// 修改密码
export function editPassword(query) {
  return request({
    url: '/admin/user/changePassword',
    method: 'post',
    params: query
  })
}

// 查询客户信息
export function fetchCustomByDeptId(deptId) {
  return request({
    url: '/customer/v1/biz-customers/deptId',
    method: 'get',
    params: { deptId }
  })
}

// 修改登陆账户号
export function modifyLoginAccount(data) {
  return request({
    url: '/admin/user/modifyLoginAccount',
    method: 'post',
    params: data
  })
}
