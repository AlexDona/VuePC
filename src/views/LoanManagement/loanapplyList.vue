<template>
  <!-- 放款列表 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="accountNo">
            <el-input v-model="listQuery.accountNo" clearable placeholder="用款申请编号" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model="listQuery.customerName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label="" prop="loanDateRange">
            <el-date-picker v-model="loanDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="用款申请日期" end-placeholder="用款申请日期" @change="changeDateRange" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label="" prop="lendingDateRange">
            <el-date-picker v-model="lendingDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="放款日期" end-placeholder="放款日期" @change="changeLendingDateRange" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <div class="el-col-money">
            <el-input v-model="listQuery.accountAmountMin" style="width: 100%" placeholder="用款申请金额" @input="listQuery.accountAmountMin = lib.fixMoneyMinus(listQuery.accountAmountMin)" />
            <span class="center-1">至</span>
            <el-input v-model="listQuery.accountAmountMax" placeholder="用款申请金额" @input="listQuery.accountAmountMax = lib.fixMoneyMinus(listQuery.accountAmountMax)" />
          </div>
        </el-col>
        <el-col :sm="4" :xs="4">
          <div class="el-col-money">
            <el-input v-model="listQuery.loanRateMin" placeholder="利率(%/年)" @input="listQuery.loanRateMin = lib.fixInput(listQuery.loanRateMin)" />
            <span class="center-1">至</span>
            <el-input v-model="listQuery.loanRateMax" placeholder="利率(%/年)" @input="listQuery.loanRateMax = lib.fixInput(listQuery.loanRateMax)" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col v-if="userInfo.custTypeId !== 3" :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model="listQuery.industryName" clearable placeholder="产业公司名称" />
          </el-form-item>
        </el-col>
        <el-col v-if="userInfo.custTypeId !== 4" :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model="listQuery.fundName" clearable placeholder="资金方名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label="" prop="dateDueDateRange">
            <el-date-picker v-model="dateDueDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="到期日期" end-placeholder="到期日期" @change="changeDateDueDateRange" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.deadlineMin" placeholder="贷款期限/月" @input="listQuery.deadlineMin = lib.fixInput(listQuery.deadlineMin)" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.deadlineMax" placeholder="贷款期限/月" @input="listQuery.deadlineMax = lib.fixInput(listQuery.deadlineMax)" />
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getLoanapplyListProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="
                `/business/loanapply/maintain/exportApplyMaintainList`
              "
              method-type="post"
              :params="listQuery"
              file-name="放款列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="table"
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
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="用款申请编号" prop="accountNo" min-width="180px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="customerName" min-width="240px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId !== 3" label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId !== 4" label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="180px;" />
      <el-table-column label="用款申请日期" prop="accountDate" min-width="180px;" />
      <el-table-column label="用款申请金额(元)" prop="accountAmount" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.accountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款状态" prop="lendingState" :formatter="formatLendingState" min-width="140px;" />
      <el-table-column label="放款金额(元)" prop="lendingAmount" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.lendingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款日期" prop="lendingDate" min-width="160px;" />
      <el-table-column label="利率(%/年)" prop="loanRate" min-width="100px;" />
      <el-table-column label="期限(月)" prop="deadline" min-width="80px;" />
      <el-table-column label="到期日" prop="dateDue" min-width="160px;" />
      <el-table-column label="总额度(元)" prop="totalQuota" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.totalQuota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已用额度(元)" prop="usedQuota" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.usedQuota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余额度(元)" prop="remainQuota" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.remainQuota }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款账户名称" prop="collAcctName" show-overflow-tooltip min-width="240px;" />
      <el-table-column label="收款账户开户行" prop="collBank" show-overflow-tooltip min-width="180px;" />
      <el-table-column label="收款账户账号" prop="collAcctNo" show-overflow-tooltip min-width="180px;" />
      <el-table-column label="操作人员" prop="receiverName" min-width="140px;" />

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getLoanapplyListProds()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getLoanapplyListProds } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: 'LoanMaintain',
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
        accountNo: '',
        customerName: '',
        accountAmountMin: '',
        accountAmountMax: '',
        accountDateStart: '',
        accountDateEnd: '',
        loanRateMin: '',
        loanRateMax: '',
        dateDueStart: '',
        dateDueEnd: '',
        lendingDateStart: '',
        lendingDateEnd: '',
        industryName: '',
        fundName: '',
        deadlineMin: '',
        deadlineMax: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      loanData: [],
      loanDateRange: ['', ''],
      lendingDateRange: ['', ''],
      dateDueDateRange: ['', ''],
      total: 0,
      userInfo: getUserInfo()
    }
  },
  created() {
    // 获取数据
    this.getLoanapplyListProds()
  },
  methods: {
    // 获取数据
    getLoanapplyListProds(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      getLoanapplyListProds(this.listQuery).then(res => {
        if (res.code === '0') {
          this.loanData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 处理数据
    formatLendingState(row) {
      // 放款状态 1：补充资料（审批退回） 2：资金方审批 3：审批通过 4：拒绝
      switch (row.lendingState) {
        case 0: return '待审批'
        case 1: return '审批通过'
        case 2: return '审批拒绝'
        case 3: return '审批退回(补充资料)'
        case 4: return '资金方审批|平台维护'
        case 6: return '结清'
      }
    },
    // 选择申请日期
    changeDateRange(range) {
      if (!range) {
        this.loanDateRange = ['', '']
        this.listQuery.accountDateStart = ''
        this.listQuery.accountDateEnd = ''
      } else {
        this.listQuery.accountDateStart = range[0]
        this.listQuery.accountDateEnd = range[1]
      }
    },

    // 放款日期
    changeLendingDateRange(range) {
      if (!range) {
        this.lendingDateRange = ['', '']
        this.listQuery.lendingDateStart = ''
        this.listQuery.lendingDateEnd = ''
      } else {
        this.listQuery.lendingDateStart = range[0]
        this.listQuery.lendingDateEnd = range[1]
      }
    },

    // 放款日期
    changeDateDueDateRange(range) {
      if (!range) {
        this.dateDueDateRange = ['', '']
        this.listQuery.dateDueStart = ''
        this.listQuery.dateDueEnd = ''
      } else {
        this.listQuery.dateDueStart = range[0]
        this.listQuery.dateDueEnd = range[1]
      }
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.listQuery.approveDateEnd = ''
      this.listQuery.approveDateStart = ''
      this.listQuery.accountAmountMin = ''
      this.listQuery.accountAmountMax = ''
      this.listQuery.loanRateMin = ''
      this.listQuery.loanRateMax = ''
      this.loanDateRange = ['', '']
      this.listQuery.accountDateStart = ''
      this.listQuery.accountDateEnd = ''
      this.dateDueDateRange = ['', '']
      this.listQuery.dateDueStart = ''
      this.listQuery.dateDueEnd = ''
      this.listQuery.deadlineMin = ''
      this.listQuery.deadlineMax = ''
      this.lendingDateRange = ['', '']
      this.listQuery.lendingDateStart = ''
      this.listQuery.lendingDateEnd = ''
      this.getLoanapplyListProds('query')
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
