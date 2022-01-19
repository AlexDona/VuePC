<template>
  <!-- <div style="display: inline-block;"> -->
  <el-button
    :disabled="disabled"
    :type="btnType"
    :loading="btnLoading"
    @click.stop="exportFile"
  >{{ btnName }}</el-button>
  <!-- </div> -->
</template>

<script>
// import axios from 'axios'
// import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import moment from 'moment'
export default {
  props: {

    methodType: {
      // 请求方式
      type: String,
      default: ''
    },
    params: {
      // 参数
      type: Object,
      default: function() {
        return {}
      }
    },
    isCheckVoucherDate: {
      // 是否需要校验凭证日期的字段  true:需要校验，false：不需要校验
      type: Boolean,
      default: false
    },
    downloadUrl: {
      // 下载地址
      type: String,
      default: ''
    },
    fileName: {
      // 导出文件名
      type: String,
      default: ''
    },
    /*     fileFormat: {
      // 导出文件格式(默认xlsx)
      type: String,
      default: 'xlsx'
    }, */
    btnType: {
      // 按钮的默认样式
      type: String,
      default: 'primary'
    },
    btnName: {
      // 按钮名称
      type: String,
      default: ''
    },
    disabled: {
      // 是否禁用按钮
      type: Boolean,
      default: false
    },
    permission: {
      // 权限控制
      type: [String, Object],
      default: 'none'
    },
    downloadFlag: {
      /**
      * @params { Boolean } downloadFlag  true 下载  false  重开页面预览
      **/
      type: Boolean,
      default: true // 默认下载
    }
  },
  data() {
    return {
      btnLoading: false
    }
  },
  methods: {
    // responseType 响应类型
    exportFile() {
      this.btnLoading = true

      // 声明一个开关
      let flag = false
      const today = moment().format('YYYY-MM-DD')
      // console.log(moment(this.params.minVoucherDate).add(7, 'days').format("YYYY-MM-DD"))
      // 如果是需要校验凭证日期

      if (this.isCheckVoucherDate) {
        // 如果需要校验凭证日期并且凭证日期有值
        if (this.params.minVoucherDate) {
          const day = moment(today).diff(
            moment(this.params.minVoucherDate),
            'day'
          ) // 凭证开始日期与当前日期相差天数
          const voucherDay = moment(this.params.maxVoucherDate).diff(
            moment(this.params.minVoucherDate),
            'day'
          ) // 凭证开始日期与凭证结束日期相差天数
          // 凭证起始日期大于当前日期180天&&凭证开始日期与凭证结束日期相差天数大于30天
          if (day > 180) {
            if (voucherDay > 30) {
              flag = false
              this.$emit(
                'checkVoucherDate',
                '查询起始日距离当前日期超过180日，最长下载期间不能超过1个月'
              )
              this.btnLoading = false
            } else {
              flag = true
            }
          } else {
            // 凭证开始日期距离当前日期小于180天
            flag = true
          }
        } else {
          // 如果凭证日期没值
          this.$message.warning('请选择凭证日期后再下载')
          this.btnLoading = false
          flag = false
          //  console.log('请选择凭证日期后再下载')
        }
      }
      if (!this.isCheckVoucherDate) {
        // 如果不需要校验凭证日期
        this.download()
      }
      if (flag) {
        this.download()
      }
    },
    download() {
      let requestParams = {}
      // 删除分页参数
      const queryParams = Object.assign({}, this.params)
      delete queryParams.pageParam
      if (this.methodType === 'post') {
        // 设置请求参数
        requestParams = {
          method: this.methodType,
          url: this.downloadUrl,
          data: queryParams,
          responseType: 'blob'
        }
      } else if (this.methodType === 'get') {
        requestParams = {
          method: this.methodType,
          url: this.downloadUrl,
          params: queryParams,
          responseType: 'blob' // 设置文件响应格式
        }
      }
      const vm = this
      request(requestParams)
        .then(response => {
          const res = response.data

          vm.btnLoading = false
          // 文件格式
          const fileFormat = response.headers['content-type'].split(';')[0]
          // 文件后缀
          const fileNameSuffix = fileFormat.split('/')[1] || ''
          if (res.type) {
            // 文件下载
            const blob = new Blob([res], {
              type: fileFormat
            })
            // JSON 格式
            if (fileNameSuffix.indexOf('json') !== -1) {
              const reader = new FileReader() // 创建读取文件对象
              reader.readAsText(blob, 'utf-8') // 设置读取的数据以及返回的数据类型为utf-8
              return new Promise(resolve => {
                reader.onload = function(e) {
                  const res = JSON.parse(reader.result) // 返回的数据
                  vm.$message.error(res.msg)
                }
              })
            }
            let link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            // 预览方式
            if (this.downloadFlag) {
              // 直接下载
              // 获取文件夹名称--decodeURI解析
              const fileName = response.headers['content-disposition'] && response.headers['content-disposition'].split(';')[1] ? decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1]) : vm.fileName
              link.setAttribute('download', `${fileName}`)
              vm.$message.success('下载成功')
            } else {
              // 重开窗口预览
              link.setAttribute('target', '_blank')
            }
            link.click()
            // 释放Blob
            link = null
          }
        })
        .catch(() => {
          vm.btnLoading = false
          vm.$message.error('下载失败')
        })
    }
  }
}
</script>
