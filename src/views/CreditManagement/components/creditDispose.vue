<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="申请详情" name="1">
        <credit-detail :detail-data.sync="detailData" :product-id="detailData.productId" />
      </el-tab-pane>
      <el-tab-pane label="审批轨迹" name="2">
        <credit-trajectory :detail-data="detailData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import creditDetail from './creditDetail'
import creditTrajectory from './creditTrajectory'
import { creditPcDesc } from '@/api/credit'

export default {
  name: 'CreditDispose',
  components: {
    creditDetail,
    creditTrajectory
  },
  data() {
    console.log(this.$route.query.creditNo, 'this.$route.query.creditNo')
    return {
      activeName: '1',
      detailData: {}
    }
  },
  created() {
    this.getFormData()
  },
  methods: {
    async getFormData() {
      const res = await creditPcDesc({
        creditNo: this.$route.query.creditNo
      })
      console.log(res, 'rescreditPcDesc')
      if (res.code === '0') {
        if (!res.data.comment) {
          res.data.comment = null
        }
        // res.data.approveResult = ''
        if (res.data.approveState === 1) {
          res.data.approveState = 'pass'
        } else if (res.data.approveState === 2) {
          res.data.approveState = 'reject'
        } else if (res.data.approveState === 3) {
          res.data.approveState = 'return'
        } else {
          res.data.approveState = null
        }
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
.app-container {
  background: #fff;
  padding: 24px 22px;
}
</style>
