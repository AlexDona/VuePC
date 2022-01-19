import request from '@/utils/request'
// 核心企业端-首页数据统计
export function getGroup() {
  return request({
    url: '/admin/statistics/total/group',
    method: 'get'
  })
}
// 成员端-首页数据统计
export function getMemberGroup() {
  return request({
    url: '/admin/statistics/total/member',
    method: 'get'
  })
}
// 获取会计科目列表
export function getAcctCourseList() {
  return request({
    url: '/accounts/api/v1/contract/account/uphold/getAcctCourseList',
    method: 'get'
  })
}
// 核心企业端-成员端-首页图表统计
export function getchart(acctCourse) {
  return request({
    url: `/admin/statistics/chat/${acctCourse}`,
    method: 'get'
  })
}

// 获取首页数据
export const getHome = () => request({
  url: `/business/home`,
  method: 'get'
})
