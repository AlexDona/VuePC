import request from '@/utils/request'

// 查看本公司提醒设置列表
export function reminderList(query) {
  return request({
    url: '/notify/reminderconfig/selectList',
    method: 'post',
    data: query
  })
}

// 修改-新增提醒设置
export function updateAndSave(query) {
  return request({
    url: '/notify/reminderconfig/updateAndSave',
    method: 'post',
    data: query
  })
}

// 分页查询当前登录人消息通知
export function getMessage(query) {
  return request({
    url: '/notify/reminderrecording/page',
    method: 'post',
    data: query
  })
}

// 将消息通知置位已读
export function haveRead(query) {
  return request({
    url: `/notify/reminderrecording/haveRead?ids=${query.ids}`,
    method: 'get'
  })
}
