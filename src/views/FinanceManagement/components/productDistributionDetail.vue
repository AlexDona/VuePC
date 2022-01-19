<template>
  <div class="app-container">
    <el-table
      :data="distributionData"
      stripe
      border
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column v-if="custTypeId === 1 || custTypeId === 6" label="产业公司编号" prop="industrialCustNo" min-width="100" />
      <el-table-column v-if="custTypeId === 1 || custTypeId === 6" label="产业公司名称" prop="industrialCustName" show-overflow-tooltip min-width="100" />
      <el-table-column label="所在省" prop="province" min-width="100" />
      <el-table-column label="所在市" prop="city" min-width="120" />
      <el-table-column label="所在区" prop="area" />
      <el-table-column label="客户编号" prop="custNo" min-width="110" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" />
      <el-table-column label="分配日期" prop="firstAssignTime" />
    </el-table>
    <br>
    <el-row>
      <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import { listCustByProd } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'

export default {
  name: 'ProductDistributionDetail',
  data() {
    return {
      custTypeId: getUserInfo().custTypeId,
      distributionData: [],
      total: 0
    }
  },
  watch: {
    '$route.query.productId'(val) {
      if (this.$route.query.productId) {
        this.getDistributionData()
      }
    }
  },
  created() {
    this.getDistributionData()
  },
  methods: {
    async getDistributionData() {
      const res = await listCustByProd({
        productId: this.$route.query.productId
      })

      if (res.code === '0') {
        // console.log(res, 'ressss')
        this.distributionData = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
