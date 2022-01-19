<template>
  <div title="产品分配" class="app-container">
    <!--  1 -->
    <el-form ref="resetForm" :model="reloadParams" label-width="90px">
      <!--单个分配end-->
      <el-row v-if="!isBatch" :gutter="20">
        <el-col :span="6">
          <el-form-item prop="dealerCustNo" label="客户编号">
            <el-input v-model.trim="query.dealerCustNo" placeholder disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="dealerCustName" label="客户名称">
            <el-input v-model.trim="query.dealerCustName" placeholder disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <!--单个分配end-->
      <!--批量分配-->
      <div v-if="isBatch && allocationMethod === '1'" class="pb20">
        <p>已勾选的客户如下</p>
        <div class="showBox1">
          <el-table :data="tableData1" style="width: 100%" border>
            <!--            <el-table-column
              type="index"
              width="55"
            >
              <template slot-scope="scope">
                {{ scope.row.idx }}
              </template>
            </el-table-column>-->
            <el-table-column prop="dealerCustNo" label="序号" width="50">
              <template slot-scope="scope">{{ scope.row.idx }}</template>
            </el-table-column>
            <el-table-column prop="dealerCustNo" label="客户编号" width="180" />
            <el-table-column prop="dealerCustName" label="客户名称" width="280" />
            <el-table-column prop="industrialCustNo" label="产业公司编号" width="180" />
            <el-table-column prop="industrialCustName" label="产业公司名称" />
          </el-table>
        </div>
        <!-- 分页器 -->
        <!--        <pagination-->
        <!--          v-show="tableData1.length > 0"-->
        <!--          :total="tableData1.length"-->
        <!--          :limit.sync="pageParams1.pageSize"-->
        <!--          :page.sync="pageParams1.pageIndex"-->
        <!--          @pagination="reloadSelected"-->
        <!--        />-->
      </div>
      <div v-if="isBatch && allocationMethod === '2'" class="" style="width: 50%">
        <div class="pb10">已勾选的客户范围如下：</div>
        <el-form-item v-if="notCustomerParams.industrialCustomerNameList && notCustomerParams.industrialCustomerNameList.length" label="产业公司:">
          <!-- <el-input
            v-model.trim="notCustomerParams.industrialCustomerNameList"
            placeholder
            disabled
          /> -->
          <span>{{ notCustomerParams.industrialCustomerNameList | dataFilter }}</span>
        </el-form-item>
        <el-form-item v-if="notCustomerParams.dealerProvinceList && notCustomerParams.dealerProvinceList.length" label="省份:">
          <!-- <el-input v-model.trim="notCustomerParams.dealerProvinceList" placeholder disabled /> -->
          <span>{{ notCustomerParams.dealerProvinceList | dataFilter }}</span>
        </el-form-item>
        <el-form-item v-if="notCustomerParams.dealerCityList && notCustomerParams.dealerCityList.length" label="市:">
          <!-- <el-input v-model.trim="notCustomerParams.dealerCityList" placeholder disabled /> -->
          <span>{{ notCustomerParams.dealerCityList | dataFilter }}</span>
        </el-form-item>
        <el-form-item v-if="notCustomerParams.dealerAreaList && notCustomerParams.dealerAreaList.length" label="区:">
          <!-- <el-input v-model.trim="notCustomerParams.dealerAreaList" placeholder disabled /> -->
          <span>{{ notCustomerParams.dealerAreaList | dataFilter }}</span>
        </el-form-item>
      </div>
      <div class="pb20">请选择该客户可申请授信的金融产品</div>
      <!--批量分配end-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item prop="fundName" label="资金方名称">
            <el-input
              v-model.trim="reloadParams.fundName"
              class="selectWidth"
              placeholder="资金方名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="productName" label-width="100px" label="金融产品名称">
            <el-input
              v-model.trim="reloadParams.productName"
              class="selectWidth"
              placeholder="金融产品名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="() => { pageParams.pageIndex = 1; reload();}">查询</el-button>
          <el-button type="plain" @click="resetForm">重置</el-button>
          <el-button type="primary" @click="openSelectedPro">已选中的金融产品</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="showBox">
      <el-table
        ref="tableList"
        :data="entities"
        style="width: 100%"
        stripe
        border
        :header-cell-style="{
          background: '#eee',
          color: '#333',
          'text-align': 'center',
        }"

        @select="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="productCode" label="产品编号" width="180" :show-overflow-tooltip="true" />
        <el-table-column prop="fundName" label="资金方名称" width="180" :show-overflow-tooltip="true" />
        <el-table-column
          prop="productName"
          label="金融产品名称"
          width="180"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="maxLoanLimit" label="额度区间（元）" align="right" width="200">
          <template slot-scope="scope">
            <span v-format="'#,##0.00'">{{ scope.row.minLoanLimit }}</span>
            <span>~</span>
            <span v-format="'#,##0.00'">{{ scope.row.maxLoanLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="maxLoanRate" label="利率区间（%/年）" width="180">
          <template slot-scope="scope">{{ scope.row.minLoanRate }} ~ {{ scope.row.maxLoanRate }}</template>
        </el-table-column>
        <el-table-column prop="maxLoanTime" label="期限区间（月）" width="180">
          <template slot-scope="scope">{{ scope.row.minLoanTime }} ~ {{ scope.row.maxLoanTime }}</template>
        </el-table-column>
        <el-table-column prop="repaymentMethod" label="还款方式" />
      </el-table>
      <!--  1  -->
    </div>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageParams.pageSize"
      :page.sync="pageParams.pageIndex"
      @pagination="reload()"
    />
    <div class="mt20">
      <el-button type="primary" @click="submitSelected">确定</el-button>
      <el-button @click="cancel">关闭</el-button>
    </div>

    <!--    <div slot="footer" class="dialog-footer pd20">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :disabled="productIdList.length === 0" @click="submitFrom">确 定</el-button>
    </div>-->

    <!--  单个分配金融列表对话框  -->
    <financial-list
      ref="childList"
      :visible="visible"
      :entities="selectEntities"
      :query="query"
      :not-customer-params="notCustomerParams"
      @selectItemChange="selectItemChange"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import {
  getFundProds,
  postBindProduct
} from '@/api/FinanceMgt/productDistribution'
// import { Message } from 'element-ui'
import service from '@/utils/service'
// import FinancialList from '@/views/FinanceManagement/components/productDistribution/financialList'
import Pagination from '@/components/Pagination'
import FinancialList from '@/views/FinanceManagement/components/productDistribution/financialList'

export default {
  name: 'ProductDistributionChoose',
  components: {
    FinancialList,
    Pagination
  },
  filters: {
    dataFilter: data => data.length && data.join('，')
  },
  data() {
    return {
      visible: false,
      isBatch: false,
      allocationMethod: null,
      query: {
        coreCustId: '',
        dealerCustNo: '',
        dealerCustName: ''
      },
      notCustomerParams: {},
      reloadParams: {
        fundName: '', // 金融名称
        productName: '',
        coreCustId: '', // 核心企业id
        productStatus: 1
      },
      pageParams1: {
        pageIndex: 1,
        pageSize: 15
      },
      pageParams: {
        pageIndex: 1,
        pageSize: 15
      },
      selectRow: [],
      selectEntities: [],
      entities: [],
      total: 1,
      total1: 1,
      productIdList: [],
      tableData1: []
      // customerList: [] // 批量客户列表
    }
  },
  computed: {
    customerList: {
      get() {
        return this.tableData1.slice(
          (this.pageParams1.pageIndex - 1) * this.pageParams1.pageSize,
          this.pageParams1.pageIndex * this.pageParams1.pageSize
        )
      },
      set(val) {
        return val
      }
    },
    // 多选-选中行-id
    entityIds() {
      return this.selectEntities.map((item) => item.id) || []
    }
  },
  created() {
    const { dealerCustNo, dealerCustName, coreCustId } = this.$route.query
    this.reloadParams.coreCustId = coreCustId
    let industrialCustomerNameList
    this.query = { dealerCustNo, dealerCustName, coreCustId }
    this.reload()
    const customerList =
      JSON.parse(sessionStorage.getItem('customerList')) || []
    customerList.length &&
      customerList.map((item, index) => {
        item.idx = index + 1
        return item
      })
    this.tableData1 = customerList
    this.isBatch = this.$route.query.isBatch
    this.allocationMethod = this.$route.query.allocationMethod
    // debugger
    const industryCompanyList = JSON.parse(
      sessionStorage.getItem('industryCompanyList')
    )
    const parentParams = JSON.parse(sessionStorage.getItem('parentParams'))
    if (parentParams && parentParams.industrialCustomerIdList && parentParams.industrialCustomerIdList.length > 0) {
      industrialCustomerNameList = industryCompanyList
        .filter(
          (item) => parentParams.industrialCustomerIdList.indexOf(item.id) >= 0
        )
        .map((item) => item.custName)
    }
    this.notCustomerParams = {
      ...parentParams,
      industrialCustomerNameList
    }
    // debugger
  },
  methods: {
    openSelectedPro() {
      this.visible = true
      this.$refs.childList.openDialog()
    },
    submitSelected() {
      this.$refs.childList.productIdList = this.selectEntities.map(
        (item) => item.id
      )
      this.$refs.childList.submitFrom()
    },
    reloadSelected(page) {
      this.pageParams1.pageSize = page.limit
      this.pageParams1.pageIndex = page.page
      this.customerList = this.tableData1.slice(
        (this.pageParams1.pageIndex - 1) * this.pageParams1.pageSize,
        this.pageParams1.pageIndex * this.pageParams1.pageSize
      )
      console.log(this.customerList, this.tableData1, 'sss')
    },
    closeDialog() {
      this.visible = false
    },
    submitFrom() {
      const { dealerCustomerId, industrialCustomerId } = this.$route.query
      const params = {
        assignParamList: [{ dealerCustomerId, industrialCustomerId }],
        productIdList: this.productIdList
      }
      postBindProduct(params).then((res) => {
        service.handleResponse(res, false, '分配成功')
        this.$router.push('/FinanceManagement/productDistribution')
      })
    },
    // 单行选中改变
    handleSelectionChange(val, row) {
      console.log('handleSelectionChange===', val, row)
      if (this.entityIds.includes(row.id)) {
        // 当前行已存在选中列表中--删除
        this.selectedRemoveItem(row.id)
      } else {
        // 添加当前行到选中列表中
        this.selectEntities.push(row)
      }
      // val.forEach((item) => {
      //   if (!entityIds.includes(item.id)) {
      //     this.selectEntities.push(item)
      //   }
      // })
      // if (val.length === 0) this.selectEntities = []
    },
    // 从已选列表中删除当前选中行
    selectedRemoveItem(id) {
      this.selectEntities = this.selectEntities.filter((item) => item.id !== id)
      console.log(this.selectEntities)
    },
    // 全选改变
    handleSelectAll(val) {
      console.log(val)
      // 全选--选中
      if (val && val.length > 0) {
        val.forEach((el) => {
          // 未添加的进行追加，已添加的不做处理
          if (!this.entityIds.includes(el.id)) {
            // 添加当前行到选中列表中
            this.selectEntities.push(el)
          }
        })
      } else {
        // 全选--取消
        val.forEach((el) => {
          // 存在的取消，不存在的忽略
          if (this.entityIds.includes(el.id)) {
            // 添加当前行到选中列表中
            this.selectedRemoveItem(el.id)
          }
        })
      }
    },
    // 已选中弹窗中，触发选中或者取消
    selectItemChange(val) {
      this.selectedRemoveItem(val.id)
      this.$refs.childList.openDialog()
      // 当前页面List中选中项同步取消
      this.entities.forEach((item) => {
        if (item.id === val.id) {
          this.$refs.tableList.toggleRowSelection(item, false)
        }
      })
    },
    reload() {
      const params = {
        ...this.reloadParams,
        pageParams: this.pageParams
      }
      this.initEntities(params)
    },
    initEntities(params) {
      getFundProds(params).then((res) => {
        this.entities = res.data.list || []
        this.total = res.data.total
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.pageParams.pageIndex = 1
      this.reload()
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.has-gutter {
  background-color: #cccccc;
}
.showBox1 {
  max-height: 750px;
  overflow: auto;
}
.showBox {
  max-height: 750px;
  overflow: auto;
}
th {
  background-color: #ccc;
}
</style>
