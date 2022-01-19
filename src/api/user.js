import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/auth/oauth/token',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/token/logout',
    method: 'get'
  })
}

// 用户重置密码
export function retrievePassword(data) {
  return request({
    url: '/admin/user/retrievePassword',
    method: 'post',
    params: data
  })
}
// 根据机构ID查询用户列表
export function getUserList(custId) {
  return request({
    url: `/admin/user/listByCustId/${custId}`,
    method: 'get' })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/admin/user/save',
    method: 'post',
    data
  })
}
// 新增用户
export function updateUser(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}
// 查询用户列表
export function queryUserList(data) {
  return request({
    url: '/admin/user/page',
    method: 'post',
    data
  })
}
// 查询用户列表
export function deleteUser(userId) {
  return request({
    url: `/admin/user/delete/${userId}`,
    method: 'post'
  })
}

// 重置用户密码
export function resetPassword(data) {
  return request({
    url: '/admin/user/resetPassword',
    method: 'post',
    params: data
  })
}

// 重置用户密码
export function resetPassword4OrgAdmin(data) {
  return request({
    url: '/admin/user/resetPassword4OrgAdmin',
    method: 'post',
    params: data
  })
}

// 发送短信验证码
export function sendMsg(data) {
  return request({
    url: '/admin/sms/sendMsg',
    method: 'post',
    data: data
  })
}

// 公司列表
export function curUserCustList(data) {
  return request({
    url: '/admin/user/curUserCustList',
    method: 'get',
    params: data
  })
}

/**
* @params { string } appApply	客户端是否保存 0-不应用 1-应用
* @params { string } fileType	影像支持的格式(图片、文本、PDF、表格)
* @params { string } olderName	影像名称
* @params { string } folderNo	影像编号
* @return
* @Descripttion { 分页条件查询文件夹配置 }
*
 **/
export function queryFileByPage(data) {
  return request({
    url: '/business/fileFolder/queryByPage',
    method: 'post',
    data
  })
}

/**
* @params { * }
* @return
* @Descripttion { 新增文件夹配置 }
*
 **/
export function addFileFolder(data) {
  return request({
    url: '/business/fileFolder/add',
    method: 'post',
    data
  })
}
/**
* @params { * }
* @return
* @Descripttion { 查询影像格式数据字典 }
*
 **/
export function getFileFolderConfDicList(data) {
  return request({
    url: '/business/fileFolder/getFileFolderConfDicList',
    method: 'post',
    data
  })
}
/**
* @params { coreCustomerId } 核心企业
* @params { h5LogoPath } h5 logo地址
* @params { keyName } 标识
* @params { menuLogoPath } 单栏 logo地址
* @params { pcLogoPath } pclogo
* @params { toneVal } 界面色调值，例：#FF0011
* @return
* @Descripttion { 系统主题配置 }
*
 **/
export function systemThemeConfig(data) {
  return request({
    url: '/admin/pageSysConfig/config',
    method: 'post',
    data
  })
}
/**
* @params { keyName } 标识
* @return
* @Descripttion { 根据keyName标识获取配置 }
*
 **/
export function pageSysConfig(params) {
  return request({
    url: '/admin/pageSysConfig/info',
    method: 'get',
    params
  })
}
