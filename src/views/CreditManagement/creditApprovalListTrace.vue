<template>
  <div class="app-container">
    <credit-trajectory :detail-data="detailData" />
  </div>
</template>

<script>
import creditTrajectory from './components/creditTrajectory'
import { creditPcDesc } from '@/api/credit'

export default {
  name: '',
  components: {
    creditTrajectory
  },
  data() {
    return {
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
      if (res.code === '0') {
        if (!res.data.comment) {
          res.data.comment = null
        }
        // res.data.approveResult = ''
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

<style scoped>

</style>
