<template>
  <div class="container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row type="flex" style="gap: 24px">
        <el-col v-if="custTypeId === 1 || custTypeId === 6" :sm="4" :xs="4">
          <el-form-item prop="industrialCustomerName">
            <el-input v-model.trim="listQuery.industrialCustomerName" placeholder="产业公司名称" clearable />
            <!--            <el-select v-model="listQuery.industrialCustomerId" style="width:100%" clearable filterable placeholder="产业公司名称">-->
            <!--              <el-option-->
            <!--                v-for="item in fundNameList"-->
            <!--                :key="item.customerId"-->
            <!--                :label="item.customerName"-->
            <!--                :value="item.customerId"-->
            <!--              />-->
            <!--            </el-select>-->
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="province">
            <el-select v-model="listQuery.province" style="width:100%" clearable filterable placeholder="省份" @change="handleProvinceChange">
              <el-option v-for="item in province" :key="item.label" :label="item.label" :value="item.label" />
            </el-select>
            <!--            <el-cascader placeholder="省/市/区" :options="listQuery.options" clearable />-->
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item prop="city">
            <el-select v-model="listQuery.city" style="width:100%" clearable filterable placeholder="城市" @change="handleCityChange">
              <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
            <!--            <el-cascader placeholder="省/市/区" :options="listQuery.options" clearable />-->
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item prop="area">
            <el-select v-model="listQuery.area" style="width:100%" clearable filterable placeholder="区域" @change="handleAreaChange">
              <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
            <!--            <el-cascader placeholder="省/市/区" :options="listQuery.options" clearable />-->
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <!--        <template v-if="custTypeId === 1">-->
        <!--          &lt;!&ndash;          <el-col :sm="4" :xs="4">&ndash;&gt;-->
        <!--          &lt;!&ndash;            <el-form-item prop="fundName">&ndash;&gt;-->
        <!--          &lt;!&ndash;              <el-input v-model.trim="listQuery.fundName" class="selectWidth" placeholder="资金方名称" clearable />&ndash;&gt;-->
        <!--          &lt;!&ndash;            </el-form-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;          </el-col>&ndash;&gt;-->
        <!--          <el-col :sm="4" :xs="4">-->
        <!--            <el-form-item prop="productName">-->
        <!--              <el-input v-model.trim="listQuery.productName" class="selectWidth" placeholder="产品名称" clearable />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </template>-->
      </el-row>
      <el-row>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getTableData('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="`/business/customerProduct/custDimension/export`"
              method-type="post"
              :params="listQuery"
              file-name="产品分配列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="table"
      :data="productData"
      stripe
      border
      style="width: 100%;"
      :max-height="curHeight"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="客户编号" prop="custNo" min-width="240px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="所在省" prop="province" min-width="240px;" />
      <el-table-column label="所在市" prop="city" min-width="240px;" />
      <el-table-column label="所在区" prop="area" min-width="240px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreCustName" min-width="180px;" />
      <el-table-column v-if="custTypeId !== 3" label="产业公司编号" prop="industrialCustNo" min-width="240px;" />
      <el-table-column v-if="custTypeId !== 3" label="产业公司名称" show-overflow-tooltip prop="industrialCustName" min-width="240px;" />
      <!--      &lt;!&ndash;<el-table-column label="产品名称" prop="productName" min-width="240px;" />-->
      <!--      <el-table-column label="额度区间(元)">-->
      <!--        <template slot-scope="{ row }">-->
      <!--          <span>{{ row.minLoanLimit }} - {{ row.maxLoanLimit }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="利率区间(%/年)" prop="" min-width="240px;">-->
      <!--        <template slot-scope="{ row }">-->
      <!--          <span>{{ row.minLoanRate }} - {{ row.maxLoanRate }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="期限区间(月)" prop="" min-width="240px;">-->
      <!--        <template slot-scope="{ row }">-->
      <!--          <span>{{ row.minLoanTime }} - {{ row.maxLoanTime }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="还款方式" prop="repaymentMethod" min-width="240px;" />-->
      <!--      <el-table-column label="产品状态" prop="productStatus" min-width="240px;">&ndash;&gt;-->
      <!--        <template slot-scope="scope">{{ scope.row.productStatus | productStatusFilter }}</template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCompanyCheck(scope.row)">查看</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="handlePage"
    />
  </div>
</template>
<script>
import { getUserInfo } from '@/utils/auth'
import { regionData } from 'element-china-area-data'
import Pagination from '@/components/Pagination'
import { companyAssignedList, getByCustTypeId } from '@/api/finance'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: 'CompanyDimension',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  filters: {
    productStatusFilter: data => data === 0 ? '暂存' : data === 1 ? '生效' : '失效'
  },
  mixins: [curHeight],
  data() {
    return {
      custTypeId: getUserInfo().custTypeId,
      productDateRange: ['', ''],
      earlyDateRange: ['', ''],
      province: regionData,
      city: [],
      area: [],
      listQuery: {
        province: '',
        city: '',
        area: '',
        custName: '',
        // fundName: '',
        industrialCustomerName: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      productData: [],
      fundNameList: [],
      productNameList: [],
      productStatusList: [
        { value: 0, label: '暂存' },
        { value: 1, label: '生效' },
        { value: 2, label: '失效' }
      ],
      total: 0
    }
  },
  created() {
    if (this.custTypeId === 1 || this.custTypeId === 6) {
      this.getByCustFinace()
    }
    // 获取数据
    this.getTableData()
  },
  methods: {
    // 获取资金方下拉数据
    getByCustFinace() {
      const params = {
        custTypeId: 3
      }
      getByCustTypeId(params).then((res) => {
        if (res.code === '0') {
          this.fundNameList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    changeDateRange(range) {
      if (!range) {
        this.dateRange = ['', '']
        this.listQuery.quoteStartDate = ''
        this.listQuery.quoteEndDate = ''
      } else {
        this.listQuery.quoteStartDate = range[0]
        this.listQuery.quoteEndDate = range[1]
      }
    },
    handleProvinceChange(val) {
      let newArr
      regionData.filter(item => {
        if (val.includes(item.label)) {
          newArr = item.children
        }
      })
      this.city = newArr
      this.listQuery.city = ''
      this.listQuery.area = ''
    },
    handleCityChange(val) {
      let newArr = []
      this.city.map(item => {
        if (val.includes(item.label)) {
          newArr = item.children
        }
      })
      this.listQuery.area = ''
      this.area = newArr
    },
    handleAreaChange(val) {
    },
    // 获取数据
    async getTableData(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      const res = await companyAssignedList(this.listQuery)
      if (res.code === '0') {
        this.productData = res.data.list
        this.total = res.data.total
      } else {
        this.$message.error(res.msg)
      }
      // getFundProds(this.listQuery).then(res => {
      //   if (res.code === '0') {
      //     this.productData = res.data.list
      //     this.total = res.data.total
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // })
    },
    // 提交新增、编辑
    recordSaveAndEdit(data) {

    },
    // 禁用
    disableClick(row) {

    },
    // 新增产品
    createProduct() {
      this.$router.push({
        path: '/FinanceManagement/createProduct',
        params: {

        }
      })
    },
    handlePage(page) {
      console.log(this.listQuery.pageParam)
      this.listQuery.pageParam.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    // 企业维度查看
    handleCompanyCheck(row) {
      // console.log(row, 'row')
      this.$router.push({
        path: '/FinanceManagement/companyDimensionCheck',
        query: {
          customerId: row.custId,
          industrialCustName: row.industrialCustName,
          industrialCustomerId: row.industrialCustomerId
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.listQuery.industrialCustomerId = ''
      this.listQuery.pageParam.pageIndex = 1
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogStyle {
  ::v-deep .el-dialog{
    width: 40%;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #000;
  }
  .el-dialog__body {
    padding: 30px 80px;
  }
}
.container {
  .productTerm {
    .el-form-item__content {
      min-width: 238px;
      .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
