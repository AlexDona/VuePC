<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="申请详情" name="1">
        <loanDetail v-if="pageType !== 'preview'" :detail-data.sync="detailData" :keys-data="keysData" :loan-id="detailData.loanId" @getFormData="getFormData" />
        <loanView v-else :preview-data.sync="detailData" :keys-data="keysData" />
      </el-tab-pane>
      <el-tab-pane label="审批轨迹" name="2">
        <loanTrajectory :detail-data.sync="detailData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import loanDetail from './loanDetail'
import loanView from './loanView'
import loanTrajectory from './loanTrajectory'
import { loanPcDesc, approveStorageView } from '@/api/loan'

export default {
  name: 'LoanDispose',
  components: {
    loanDetail,
    loanTrajectory,
    loanView
  },
  data() {
    console.log(this.$route.query.loanapplyId, 'this.$route.query.loanapplyId')
    return {
      keysData: {}, // 返回keys映射中文集合
      listData: [], // 返回key值集合
      loanId: this.$route.query.loanId,
      pageType: this.$route.query.type,
      activeName: '2',
      detailData: {},
      comment: null
    }
  },
  created() {
    if (this.pageType !== 'preview') {
      this.approveStorageView()
    } else {
      this.getFormData()
    }
  },
  methods: {
    async approveStorageView() {
      const params = {
        // approveDate: this.detailData.approveDate || null,
        id: this.loanId
      }
      const res = await approveStorageView(params)
      if (res.code === '0') {
        // console.log({ res })
        this.comment = res.data && res.data.comment
        await this.getFormData()
      }
    },
    async getFormData() {
      const res = await loanPcDesc({
        loanId: this.loanId
      })
      console.log({ res }, 'rescreditPcDesc')
      if (res.code === '0') {
        res.data.remainQuota = res.data.creditApproveLimit - res.data.loanUsedLimit < 0 ? 0 : res.data.creditApproveLimit - res.data.loanUsedLimit
        // res.data.approveResult = ''
        res.data.operateTableFieldConfList && res.data.operateTableFieldConfList.map(item => {
          this.keysData[item.fieldEnName] = item.fieldChName
        })

        res.data.orderList && res.data.orderList.map(item => {
          item.disabled = false
          item.isModify = false
        })
        res.data.comment = this.comment
        if (res.data.fieldJson) {
          res.data.fieldJson = JSON.parse(res.data.fieldJson)
        }
        console.log(res.data.orderList, 'ooooooooo', this.keysData)
        this.detailData = res.data

        // this.tableData = res.data.list
        // console.log(res, 'res handleDraw')
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #ECF0F9FF;
  padding: 0 0 80px 22px;
  ::v-deep {
    .el-tabs__header {
      background: #fff;
      padding: 0 20px;
      margin: 0;
    }
    .el-collapse-item__wrap {
      padding: 24px;
    }
    .el-collapse-item__content {
      padding-top: 18px;
    }
    .el-collapse-item__header {
      font-size: 16px;
      padding-left: 32px;
      background: #F5F7F9;
    }
    .el-textarea__inner {
      min-height: 100px !important;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
}
</style>
