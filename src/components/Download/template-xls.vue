<template>
  <!-- <div style="display: inline-block;"> -->
  <el-button :disabled="disabled" type="primary" :loading="btnLoading" @click="exportFile">{{
    btnName
  }}</el-button>
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
    fileFormat: {
      // 导出文件格式(默认xlsx)
      type: String,
      default: 'xlsx'
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
      console.log(this.params.minVoucherDate)
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
          this.$emit('checkVoucherDate', '请选择凭证日期后再下载')
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
      request({
        method: this.methodType,
        url: this.downloadUrl,
        // headers: {
        //   Authorization: 'Bearer ' + getToken()
        // },
        // this.btnLoading = true
        data: this.params,
        responseType: 'blob'
      })
        .then((res) => {
          this.btnLoading = false
          if (res.type) {
            // 文件下载
            const blob = new Blob([res], {
              type: 'application/vnd.ms-excel'
            })
            let link = document.createElement('a')
            link.href = URL.createObjectURL(blob)

            link.setAttribute('download', `${this.fileName}.${this.fileFormat}`)
            link.click()
            link = null
            this.$message.success('下载成功')
          }
          //  else {
          //   // 返回json
          //   this.$message.warning(res.data.msg)
          // }
        })
        .catch(() => {
          this.btnLoading = false
          this.$message.error('下载失败')
        })
    }
  }
}
</script>
