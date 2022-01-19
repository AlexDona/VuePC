<template>
  <!-- 还款列表 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="accountNo">
            <el-input v-model="listQuery.accountNo" clearable placeholder="用款申请编号" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="loanStatus">
            <el-select v-model="listQuery.loanStatus" style="width:100%" clearable placeholder="贷款状态">
              <el-option
                v-for="item in loanStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model="listQuery.customerName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model="listQuery.productName" clearable placeholder="金融产品名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label prop="dateDueDateRange">
            <el-date-picker
              v-model="dateDueDateRange"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="到期日期"
              end-placeholder="到期日期"
              @change="changeDateDueDateRange"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label prop="lendingDateRange">
            <el-date-picker
              v-model="lendingDateRange"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="放款日期"
              end-placeholder="放款日期"
              @change="changeLendingDateRange"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="24">
        <el-col v-if="userInfo.custTypeId === 1 || userInfo.custTypeId === 6 || userInfo.custTypeId === 3" :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model="listQuery.fundName" clearable placeholder="资金方名称" />
          </el-form-item>
        </el-col>
        <el-col v-if="userInfo.custTypeId === 1 || userInfo.custTypeId === 6 || userInfo.custTypeId === 4" :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model="listQuery.industryName" clearable placeholder="产业公司名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.minLendingAmount" style="width: 100%" placeholder="放款金额" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.maxLendingAmount" placeholder="放款金额" />
        </el-col>
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.minDeadline" style="width: 100%" placeholder="期限/月" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.maxDeadline" placeholder="期限/月" />
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="queryRepaymentPage('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="
                `/business/loan/maintain/exportRepayments`
              "
              method-type="post"
              :params="listQuery"
              file-name="还款列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="loanData"
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
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="用款申请编号" prop="accountNo" min-width="180px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="customerName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId === 1 || userInfo.custTypeId === 6 || userInfo.custTypeId === 3" label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="放款日期" prop="lendingDate" min-width="140px;" />
      <el-table-column label="放款金额（元）" align="right" prop="lendingAmount" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.lendingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限（月）" prop="deadline" min-width="100px;" />
      <el-table-column label="到期日" prop="dateDue" min-width="160px;" />
      <el-table-column label="贷款状态" prop="loanStatus" min-width="100px;">
        <template slot-scope="{ row }">
          <span v-show="row.loanStatus === 0">逾期</span>
          <span v-show="row.loanStatus === 1">正常</span>
        </template>
      </el-table-column>
      <el-table-column label="已还款金额（元）" align="right" prop="repaymentAmount" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余还款金额（元）" align="right" prop="remainAmount" min-width="170px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.remainAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还款日期" prop="repaymentDate" min-width="160px;" />
      <el-table-column label="还款账号" show-overflow-tooltip prop="repaymentAcctNo" min-width="180px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId === 1 || userInfo.custTypeId === 6 || userInfo.custTypeId === 4" label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column label="操作人" prop="operator" min-width="120px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center " fixed="right">
        <template slot-scope="scoped">
          <el-button type="text" @click="showDialog(scoped.row,'preview')">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="queryRepaymentPage()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { queryRepaymentPage } from '@/api/loan'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: '',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  props: {
  },
  data() {
    return {
      listQuery: {
        id: '',
        accountNo: '',
        fundName: '',
        minLendingAmount: '',
        maxLendingAmount: '',
        industryName: '',
        productName: '',
        lendingAmount: '',
        repaymentAmount: '',
        remainAmount: '',
        repaymentDate: '',
        repaymentAcctNo: '',
        minDeadline: '',
        maxDeadline: '',
        operator: '',
        loanStatus: '',
        customerName: '',
        lendingDate: '',
        deadline: '',
        dateDue: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      userInfo: getUserInfo(),
      loanData: [],
      lendingDateRange: ['', ''],
      dateDueDateRange: ['', ''],
      loanStatusList: [
        { value: 0, label: '逾期' },
        { value: 1, label: '正常' }
      ],
      total: 0
    }
  },
  computed: {},
  created() {
    // 获取数据
    this.queryRepaymentPage()
  },
  methods: {
    // handleSelectionChange(val) {
    //   this.multipleSelection = val
    // },
    // 获取数据
    queryRepaymentPage(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      queryRepaymentPage(this.listQuery).then(res => {
        if (res.code === '0') {
          this.loanData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 放款日期
    changeLendingDateRange(range) {
      if (!range) {
        this.lendingDateRange = ['', '']
        this.listQuery.minLendingDate = ''
        this.listQuery.maxLendingDate = ''
      } else {
        this.listQuery.minLendingDate = range[0]
        this.listQuery.maxLendingDate = range[1]
      }
    },

    // 到期日期
    changeDateDueDateRange(range) {
      if (!range) {
        this.dateDueDateRange = ['', '']
        this.listQuery.minDateDue = ''
        this.listQuery.maxDateDue = ''
      } else {
        this.listQuery.minDateDue = range[0]
        this.listQuery.maxDateDue = range[1]
      }
    },

    showDialog(row, mode) {
      this.$router.push({
        path: '/LoanAfterManagement/loanAffirmListInfo',
        query: {
          mode,
          id: row ? row.id : ''
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.listQuery.minLendingAmount = ''
      this.listQuery.maxLendingAmount = ''
      this.listQuery.loanRateMax = ''
      this.listQuery.loanRateMin = ''
      this.lendingDateRange = ['', '']
      this.listQuery.minLendingDate = ''
      this.listQuery.maxLendingDate = ''
      this.dateDueDateRange = ['', '']
      this.listQuery.minDateDue = ''
      this.listQuery.maxDateDue = ''
      this.listQuery.minDeadline = ''
      this.listQuery.maxDeadline = ''
      this.listQuery.productName = ''
      this.queryRepaymentPage()
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
  .el-col-money {
    display: flex;
  }
  .el-col-money .center-1 {
    justify-items: center;
    padding: 0 12px;
    height: 36px;
    line-height: 36px;
  }
  .selectWidth {
    width: 100% !important;
  }
</style>
