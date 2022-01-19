import request from '@/utils/request'

// 客户统计表
export function selectPage(data) {
  return request({
    url: `/customer/contractSign/selectPage`,
    method: 'post',
    data
  })
}

// 获取产品下拉框数据(授信签约)
export function getCreditSigningProducts(data) {
  return request({
    url: `/business/product/getCreditSigningProducts`,
    method: 'get',
    params: data
  })
}

// 通过ID获取文件
export function getFile(data) {
  return request({
    url: `/file/v1/biz-files/getFile`,
    method: 'get',
    params: data
  })
}

// 通过ID下载文件
export function downloadFile(data) {
  return request({
    url: `file/v1/biz-files/${data}/download`,
    method: 'get'
  })
}
