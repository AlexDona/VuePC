<!--产品维度-->
<template>
  <div class="container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row type="flex" style="gap: 24px">
        <el-col :xs="4" :sm="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.fundName" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>
        <!--        <el-col>-->
        <!--          <el-form-item prop="fundName">-->
        <!--            <el-select-->
        <!--              v-model="listQuery.fundName"-->
        <!--              style="width:100%"-->
        <!--              clearable-->
        <!--              filterable-->
        <!--              placeholder="资金方名称"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="item in fundNameList"-->
        <!--                :key="item.customerId"-->
        <!--                :label="item.customerName"-->
        <!--                :value="item.customerId"-->
        <!--              />-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :xs="4" :sm="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="listQuery.productName" placeholder="金融产品名称" clearable />
          </el-form-item>
        </el-col>
        <!--        <el-col :xs="4" :sm="4">-->
        <!--          <el-form-item prop="productName">-->
        <!--            <el-select-->
        <!--              v-model="listQuery.productName"-->
        <!--              style="width:100%"-->
        <!--              clearable-->
        <!--              filterable-->
        <!--              placeholder="金融产品名称"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="(item, index) in productNameList"-->
        <!--                :key="'productNameList' + index"-->
        <!--                :label="item.productName"-->
        <!--                :value="item.productName"-->
        <!--              />-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :xs="4" :sm="4">
          <el-form-item class="productTerm" prop="productTerm">
            <el-date-picker
              v-model="productDateRange"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="产品有效期"
              end-placeholder="产品有效期"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="5" :sm="5">
          <el-form-item class="productTerm" prop="earlyTerm">
            <el-date-picker
              v-model="earlyDateRange"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="最早分配日期"
              end-placeholder="最早分配日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="getProdDimension('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="`/business/customerProduct/prodDimension/export`"
              method-type="post"
              :params="{
                fundName: listQuery.fundName,
                maxValidLimit:
                  (productDateRange && productDateRange[1]) || '',
                minAssignedEndDate:
                  (earlyDateRange && earlyDateRange[1]) || '',
                minAssignedStartDate:
                  (earlyDateRange && earlyDateRange[0]) || '',
                minValidLimit:
                  (productDateRange && productDateRange[0]) || '',
                productName: listQuery.productName,
              }"
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
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="180px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreCustName" min-width="180px;" />
      <el-table-column label="额度区间(元)" align="right" prop min-width="240px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.minLoanLimit }}</span>
          <span>-</span>
          <span v-format="'#,##0.00'">{{ row.maxLoanLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间(%/年)" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanRate }} - {{ row.maxLoanRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限区间(月)" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanTime }} - {{ row.maxLoanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还款方式" prop="repaymentMethod" show-overflow-tooltip min-width="140px;" />
      <el-table-column label="资金用途" prop="loanPurpose" show-overflow-tooltip min-width="240px;" />
      <el-table-column label="产品有效期" prop="productExpire" min-width="240px;">
        <template slot-scope="{ row }">
          <span>{{ row.minValidLimit }} - {{ row.maxValidLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核心企业授信审批" prop="companyApprove" min-width="140px">
        <template slot-scope="{row}">
          <span>{{ row.isGroupCompApprove | groupApprove }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产业公司授信审批" prop="companyApprove" min-width="140px">
        <template slot-scope="{row}">
          <span>{{ row.isProdCompAppvove | groupApprove }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最早分配日期" prop="minAssignedDate" min-width="140px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleProductCheck(scope.row)">查看</el-button>
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
import Pagination from '@/components/Pagination'
import { getByCustTypeId } from '@/api/finance'
import { assignedList, listProductSimple } from '@/api/finance'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: 'ProductDimension',
  components: {
    downloadBtn: (resolve) =>
      require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  filters: {
    groupApprove(val) {
      if (val) return '是'
      else return '否'
    }
  },
  mixins: [curHeight],
  data() {
    return {
      userInfo: getUserInfo(),
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      productDateRange: ['', ''],
      earlyDateRange: ['', ''],
      listQuery: {
        productDateRange: '',
        earlyDateRange: '',
        maxValidLimit: '', // 最大有效期
        minValidLimit: '',
        minAssignedEndDate: '',
        minAssignedStartDate: '', // 最早分配日期-开始
        productId: '', // 	产品ID
        productName: '', // 产品名称
        fundName: '', // 资金方名称
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
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
  computed: {
    // productDateRange: {
    //   get() {
    //     return ''
    //   },
    //   set(val) {
    //     console.log(val, 'val')
    //     return val
    //   }
    // },
    // earlyDateRange: {
    //   get() {
    //     return ''
    //   },
    //   set(val) {
    //     console.log(val, 'val')
    //     return val
    //   }
    // }
  },
  created() {
    this.getlistCustomerSimple()
    this.getByCustFinace()
    // 获取数据 产品维度
    this.getProdDimension()
  },
  methods: {
    // 获取资金方下拉数据
    getByCustFinace() {
      const params = {
        custTypeId: 4
      }
      getByCustTypeId(params).then((res) => {
        if (res.code === '0') {
          this.fundNameList = res.data && res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // changeDateRange(range) {
    //   if (!range) {
    //     this.dateRange = ['', '']
    //     this.listQuery.quoteStartDate = ''
    //     this.listQuery.quoteEndDate = ''
    //   } else {
    //     this.listQuery.quoteStartDate = range[0]
    //     this.listQuery.quoteEndDate = range[1]
    //   }
    // },
    // 获取数据
    getProdDimension(type) {
      // console.log(this.listQuery, 'listQuery')
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      const params = {
        fundName: this.listQuery.fundName,
        maxValidLimit:
          (this.productDateRange && this.productDateRange[1]) || '',
        minAssignedEndDate:
          (this.earlyDateRange && this.earlyDateRange[1]) || '',
        minAssignedStartDate:
          (this.earlyDateRange && this.earlyDateRange[0]) || '',
        minValidLimit:
          (this.productDateRange && this.productDateRange[0]) || '',
        productName: this.listQuery.productName,
        // productName: '', // 未给接口
        pageParam: {
          ...this.listQuery.pageParam
        }
      }
      assignedList(params).then((res) => {
        // console.log(res)
        if (res.code === '0') {
          this.productData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getlistCustomerSimple() {
      // console.log(this.userInfo, 'userINfo')
      listProductSimple().then((res) => {
        // console.log(res, 'listProductSimple')
        if (res.code === '0') {
          const maps = new Map()
          this.productNameList = res.data && res.data.filter(item => !maps.has(item.productName) && maps.set(item.productName, 1))
          // this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交新增、编辑
    recordSaveAndEdit(data) {},
    // 禁用
    disableClick(row) {},
    handlePage(page) {
      console.log(this.listQuery.pageParam)
      this.listQuery.pageParam.pageSize = page.limit
      this.getProdDimension()
      // console.log(page)
    },
    handleProductCheck(row) {
      this.$router.push({
        path: '/FinanceManagement/productDimensionCheck',
        query: {
          productId: row.productId
        }
      })
    },
    // 重置
    resetForm() {
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.productDateRange = ['', '']
      this.earlyDateRange = ['', '']
      this.getProdDimension()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogStyle {
  ::v-deep .el-dialog {
    width: 40%;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #000;
  }
  .el-dialog__body {
    padding: 30px 80px;
  }
}
.app-container {
  .productTerm {
    .el-form-item__content {
      min-width: 268px;
      .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
