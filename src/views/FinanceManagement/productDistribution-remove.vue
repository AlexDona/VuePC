<template>
  <div title="产品分配" class="app-container">
    <!--  1 -->
    <el-form ref="resetForm" :model="reloadParams" label-width="90px">
      <!--单个分配end-->
      <el-row v-if="!isBatch" :gutter="20">
        <el-col :span="6">
          <el-form-item prop="dealerCustNo" label="客户编号">
            <el-input v-model.trim="query.dealerCustNo" placeholder="" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="dealerCustName" label="客户名称">
            <el-input v-model.trim="query.dealerCustName" placeholder="" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <!--单个分配end-->

    </el-form>

    <div class="showBox">
      <p class="pb10 pl10">已分配的金融产品如下： </p>
      <el-table
        :data="entities"
        :header-cell-style="{
          background: '#eee',
          color: '#333',
          'text-align': 'center',
        }"
        @select="handleSelectionChange"
      >
        <el-table-column
          label="序号"
          type="index"
          width="55"
        />
        <el-table-column
          prop="productCode"
          label="产品编号"
          width="180"
        />
        <el-table-column
          prop="fundCustName"
          label="资金方名称"
          show-overflow-tootip
          width="180"
        />
        <el-table-column
          prop="productName"
          label="金融产品名称"
          show-overflow-tootip
          width="180"
        />
        <el-table-column prop="maxLoanLimit" label="额度区间（元）" align="right" width="180">
          <template slot-scope="scope">
            <span v-format="'#,##0.00'">
              {{ scope.row.minLoanLimit }}
            </span>
            <span>~</span>
            <span v-format="'#,##0.00'">
              {{ scope.row.maxLoanLimit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="maxLoanRate" label="利率区间（%/年）" width="180">
          <template slot-scope="scope">
            {{ scope.row.minLoanRate }} ~ {{ scope.row.maxLoanRate }}
          </template>
        </el-table-column>
        <el-table-column prop="maxLoanTime" label="期限区间（月）" width="180">
          <template slot-scope="scope">
            {{ scope.row.minLoanTime }} ~ {{ scope.row.maxLoanTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="repaymentMethod"
          label="还款方式"
          show-overflow-tootip
          width="180"
        />
        <el-table-column label="操作" min-width="150px;" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="() => handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <!--    &lt;!&ndash; 分页器 &ndash;&gt;-->
    <!--    <pagination-->
    <!--      v-show="total > 0"-->
    <!--      :total="total"-->
    <!--      :limit.sync="pageParams.pageSize"-->
    <!--      :page.sync="pageParams.pageIndex"-->
    <!--      @pagination="reload()"-->
    <!--    />-->
    <el-button class="mt20" @click="closePage">关闭</el-button>

  </div>
</template>

<script>
import { deleteCustomerProduct, getProductListDetail, postBindProduct } from '@/api/FinanceMgt/productDistribution'
// import { Message } from 'element-ui'
import service, { noRepeat } from '@/utils/service'
// import FinancialList from '@/views/FinanceManagement/components/productDistribution/financialList'
// import Pagination from '@/components/Pagination'
// import FinancialList from '@/views/FinanceManagement/components/productDistribution/financialList'

export default {
  name: 'ProductDistributionChoose',
  components: {
    // FinancialList,
    // Pagination
  },
  data() {
    return {
      visible: false,
      isBatch: false,
      allocationMethod: null,
      query: {},
      notCustomerParams: {},
      reloadParams: {
        fundName: '' // 金融名称
      },
      pageParams: {
        pageIndex: 1,
        pageSize: 15
      },
      selectRow: [],
      selectEntities: [],
      entities: [],
      total: 1,
      productIdList: [],
      customerList: [] // 批量客户列表
    }
  },
  created() {
    const { dealerCustNo, dealerCustName } = this.$route.query
    this.query = { dealerCustNo, dealerCustName }
    this.reload()
    this.customerList = JSON.parse(sessionStorage.getItem('customerList'))
    this.isBatch = this.$route.query.isBatch
    this.allocationMethod = this.$route.query.allocationMethod
    this.notCustomerParams = {
      dealerAreaList: noRepeat(this.customerList.map(item => item.dealerArea)),
      dealerCityList: noRepeat(this.customerList.map(item => item.dealerCity)),
      dealerProvinceList: noRepeat(this.customerList.map(item => item.dealerProvince)),
      industrialCustomerIdList: this.customerList.map(item => item.industrialCustomerId),
      industrialCustomerNameList: this.customerList.map(item => item.industrialCustName)
    }
    // debugger
  },
  methods: {
    closePage() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    },
    handleDelete(scope) {
      this.$confirm('确定解除分配？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomerProduct(scope.row.hash).then(res => service.handleResponse(res, this.reload(), '解除成功'))
      })
    },
    submitFrom() {
      const { dealerCustomerId, industrialCustomerId } = this.$route.query
      const params = {
        assignParamList: [{ dealerCustomerId, industrialCustomerId }],
        productIdList: this.productIdList
      }
      postBindProduct(params).then(res => {
        service.handleResponse(res, false, '分配成功')
        this.$router.push('/FinanceManagement/productDistribution')
      })
    },
    handleSelectionChange(val) {
      const entityIds = this.selectEntities.map(item => item.id)
      val.forEach(item => {
        if (!entityIds.includes(item.id)) {
          this.selectEntities.push(item)
        }
      })
    },
    reload() {
      const { industrialCustomerId, dealerCustomerId } = this.$route.query
      const params = { industrialCustomerId, dealerCustomerId }
      this.initEntities(params)
    },
    initEntities(params) {
      getProductListDetail(params).then(res => {
        this.entities = res.data || []
        // this.total = res.data.total
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.initEntities(this.reloadParams)
    }
  }
}
</script>

<style scoped>
.showBox{max-height: 600px; overflow: auto}
</style>
