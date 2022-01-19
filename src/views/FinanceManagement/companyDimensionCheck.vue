<template>
  <div class="app-container">
    <el-form label-position="right" label-width="140px" class="clearfix">
      <el-col :xs="12" :sm="12">
        <el-form-item label="客户编号"><span>{{ detailData.custNo }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="客户名称"><span>{{ detailData.custName }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产业公司名称"><span>{{ $route.query.industrialCustName }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="所在省"><span>{{ detailData.customerItemDTO && detailData.customerItemDTO.province }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="所在市"><span>{{ detailData.customerItemDTO && detailData.customerItemDTO.city }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="所在区"><span>{{ detailData.customerItemDTO && detailData.customerItemDTO.area }}</span></el-form-item>
      </el-col>
    </el-form>

    <div class="title-table">已分配的金融产品：</div>
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
      <el-table-column v-if="custTypeId === 1 || custTypeId === 6" label="产业公司编号" show-overflow-tooltip prop="industrialCustNo" min-width="100" />
      <el-table-column v-if="custTypeId === 1 || custTypeId === 6" label="产业公司名称" show-overflow-tooltip prop="industrialCustName" min-width="100" />
      <el-table-column v-if="custTypeId === 1 || custTypeId === 6" label="客户编号" show-overflow-tooltip prop="dealerCustNo" min-width="100" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundCustName" min-width="100" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="150" />
      <el-table-column label="额度区间（元）" align="right" min-width="200" prop="">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">
            {{ row.minLoanLimit }}
          </span>
          <span>~</span>
          <span v-format="'#,##0.00'">
            {{ row.maxLoanLimit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="custNo" min-width="110">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanRate }} - {{ row.maxLoanRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限区间（月）" prop="custName">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanTime }} - {{ row.maxLoanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还款方式" show-overflow-tooltip prop="repaymentMethod" />
      <!-- <el-table-column label="产品状态" prop="productStatus" /> -->
      <el-table-column label="产品状态" prop="productStatus">
        <template slot-scope="scope">{{ scope.row.productStatus | productStatusFilter }}</template>
      </el-table-column>
    </el-table>
    <div class="btn">
      <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { queryById, queryListAssigned } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'

export default {
  name: 'CompanyDimensionCheck',
  filters: {
    productStatusFilter: data => data === 0 ? '暂存' : data === 1 ? '生效' : '失效'
  },
  data() {
    return {
      custTypeId: getUserInfo().custTypeId,
      detailData: {},
      distributionData: []
    }
  },
  watch: {
    '$route.query.customerId'(val) {
      if (this.$route.query.customerId) {
        this.queryById()
        this.queryListAssigned()
      }
    }
  },
  created() {
    this.queryById()
    this.queryListAssigned()
  },
  methods: {
    async queryById() {
      const res = await queryById({
        customerId: this.$route.query.customerId
      })
      if (res.code === '0') {
        console.log(res, 'queryById')
        this.detailData = res.data
        const newArr = this.distributionData.slice()
        // newArr.map(item => {
        //   item.industrialCustNo = this.$route.query.industrialCustNo || ''
        //   item.industrialCustName = this.$route.query.industrialCustName || ''
        //   item.custNo = this.detailData.custNo
        // })
        this.distributionData = newArr
      } else {
        this.$message.error(res.msg)
      }
    },
    async queryListAssigned() {
      const res = await queryListAssigned({
        dealerCustomerId: this.$route.query.customerId,
        industrialCustomerId: this.$route.query.industrialCustomerId
      })
      if (res.code === '0') {
        // console.log(this.detailData, 'detailDatassss')
        this.distributionData = res.data
        console.log(res, 'queryListAssigned')
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
.app-container {
  .title-table {
    color:#606266;
    padding: 24px 0;
  }
  .btn {
    margin-top: 24px;
  }
}
</style>
