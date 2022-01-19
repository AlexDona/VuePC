// 机构管理模块
import request from '@/utils/request'

// oss -- 获取签名
export function getSignature() {
  return request({
    url: '/file/oss/getSignature',
    method: 'get'
  })
}
// oss -- 获取oss临时授权
export function credentials() {
  return request({
    url: '/file/oss/credentials',
    method: 'get'
  })
}
// 判断此图片在oss里面是否已存在
export function checkExists(data) {
  return request({
    url: '/file/oss/checkExists',
    method: 'get',
    params: data
  })
}
// 如果此图片在oss里面已存在则保存
export function saveFile(data) {
  return request({
    url: '/file/file/save',
    method: 'post',
    data
  })
}
// oss- 获取文件列表
export function getListFlie(data) {
  return request({
    url: '/file/file/list',
    method: 'GET',
    params: data
  })
}
// oss- 根据文件id列表 获取文件列表
export function listByIdList(data) {
  return request({
    url: '/file/file/listByIdList',
    method: 'post',
    params: data
  })
}
// oss- 删除文件
export function deleteFlie(id) {
  return request({
    url: `/file/file/${id}`,
    method: 'delete'
  })
}
// 文件列表2
export function getFileListByid(id) {
  return request({
    url: `/file/file/${id}`,
    method: 'get'
  })
}

// 更新图片信息
export function postFiles(data) {
  return request({
    url: '/file/v1/biz-files/oss/save',
    method: 'post',
    data: data
  })
}
