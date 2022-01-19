import request from '@/utils/request'

/**
 * @params {string} fileTypeCode 授信申请编号
 * @params {string} objectId 授信申请编号
 * @params {string} objectType 授信申请编号
 * */
export const getListFiles = data => request({
  url: '/file/v1/biz-files',
  method: 'get',
  params: data
})
export const getFileDriList = data => request({
  url: '/file/v1/biz-files/fileDriList',
  method: 'get',
  params: data
})

/**
 * @params {string} type 资产-collection;资产包-Task;项目-Project
 * @params {string} objectId 授信申请编号
 * */
// export const downloadFile = data => request({
//   url: '/file/v1/biz-files/batchDownload',
//   method: 'get',
//   params: data
// })

/**
* @params { Integer } 文件 id
* @return
* @Descripttion { 删除文件 }
*
 **/

export const delFileList = id => request({
  url: `/file/v1/biz-files/delete/${id}`,
  method: 'post'
})

/**
* @params { * }
* @return
* @Descripttion { String }
*
 **/

export const uploadFile = data => request({
  url: '/file/v1/biz-files/upload',
  method: 'post',
  data
})
