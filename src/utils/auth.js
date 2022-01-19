import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const UserInfo = 'userInfo'

const AccountSubjectunt = 'AccountSubjectunt'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  return JSON.parse(Cookies.get(UserInfo))
}

export function setUserInfo(userInfo) {
  return Cookies.set(UserInfo, userInfo)
}

export function getAccountSubject() {
  return JSON.parse(Cookies.get(AccountSubjectunt))
}

// 保存主题配置
export function setDefaultConfig(data) {
  return Cookies.set('setDefaultConfig', data)
}
// 获取主题配置
export function getDefaultConfig() {
  if (Cookies.get('setDefaultConfig')) {
    return JSON.parse(Cookies.get('setDefaultConfig'))
  } else return {}
}
// 清除数据主题配置
export function removeDefaultConfig() {
  return Cookies.remove('setDefaultConfig', '', -1)
}
