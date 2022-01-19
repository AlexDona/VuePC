<template>
  <!-- 放款维护列表 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="accountNo">
            <el-input v-model="listQuery.accountNo" clearable placeholder="用款申请编号" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model="listQuery.industryName" clearable placeholder="产业公司名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model="listQuery.customerName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label prop="loanDateRange">
            <el-date-picker
              v-model="loanDateRange"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="用款申请日期"
              end-placeholder="用款申请日期"
              @change="changeDateRange"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.accountAmountMin" style="width: 100%" placeholder="用款申请金额" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.accountAmountMax" placeholder="用款申请金额" />
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
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.loanRateMin" style="width: 100%" placeholder="利率" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.loanRateMax" placeholder="利率" />
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
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.deadlineMin" style="width: 100%" placeholder="期限/月" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.deadlineMax" placeholder="期限/月" />
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getLendingProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="batchMaintenance()">批量维护</el-button>
          <el-button type="primary" @click="dialogTableVisible = true">新增放款</el-button>
          <el-button type="primary" @click="batchAddLoan()">批量新增放款</el-button>
        </el-form-item>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="用款申请编号" prop="accountNo" min-width="180px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="customerName" min-width="240px;" />
      <el-table-column label="用款申请日期" prop="accountDate" min-width="200px;" />
      <el-table-column label="用款申请金额(元)" prop="accountAmount" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.accountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="custTypeId !== 4" label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="160px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column label="放款金额（元）" prop="lendingAmount" align="right" min-width="120px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.lendingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款状态" prop="lendingState" :formatter="formatLendingState" min-width="100px;">
        <!-- <template slot-scope="{ row }">
          <span v-show="row.lendingState === 1">补充资料</span>
          <span v-show="row.lendingState === 2">资金方审批</span>
          <span v-show="row.lendingState === 3">通过</span>
          <span v-show="row.lendingState === 4">拒绝</span>
        </template> -->
      </el-table-column>
      <el-table-column label="放款日期" prop="lendingDate" min-width="140px;" />
      <el-table-column label="利率（%/年）" prop="loanRate" min-width="120px;" />
      <el-table-column label="期限（月）" prop="deadline" min-width="120px;" />
      <el-table-column label="到期日" prop="dateDue" min-width="160px;" />
      <el-table-column label="还款方式" show-overflow-tooltip prop="repaymentMethod" min-width="200px;" />
      <el-table-column label="收款账户名称" show-overflow-tooltip prop="collAcctName" min-width="240px;" />
      <el-table-column label="收款账户开户行" show-overflow-tooltip prop="collBank" min-width="160px;" />
      <el-table-column label="收款账户账号" show-overflow-tooltip prop="collAcctNo" min-width="160px;" />
      <el-table-column label="操作人" prop="receiverName" min-width="120px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            v-if="!row.receiverName"
            type="text"
            @click="getLendingClaim(row.id)"
          >领取</el-button>
          <template v-else>
            <el-button
              type="text"
              @click="sigleMaintenance(row)"
            >维护</el-button>
            <el-button
              type="text"
              @click="getLendingUnClaim(row.id)"
            >退领</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getLendingProds()"
    />
    <batch-import
      :down-params="{ids: ids}"
      :dialog-visible="batchMaintenanceVisible"
      :title="'批量维护审批结果'"
      :download-url="'/business/loanapply/maintain/export'"
      :download-file-name="'放款维护表'"
      :upload-url="'/api/business/loanapply/maintain/upload'"
      @cancel="cancel"
      @success="uploadSuccess"
    />
    <el-dialog
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :lock-scroll="false"
      :destroy-on-close="true"
      :title="'新增放款'"
      width="40%"
      top="5vh"
      class="operationDialog"
    >
      <form-operation @closeLoanDialog="closeLoanDialog" />
    </el-dialog>
    <batch-import
      :dialog-visible="batchAddLoanVisible"
      :title="'批量新增放款'"
      :method-type="'get'"
      :download-url="'/business/loanapply/maintain/exportLoanApplyTemplate'"
      :upload-url="'/api/business/loanapply/maintain/importLoanApply'"
      @cancel="cancel"
      @success="uploadSuccess"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUserInfo } from '@/utils/auth'
import { getLendingProds, getLendingClaim, getLendingUnClaim } from '@/api/finance'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: '',
  components: {
    // downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination,
    batchImport: resolve => require(['../components/batch-import'], resolve),
    formOperation: resolve => require(['./components/form-operation'], resolve)
  },
  mixins: [curHeight],
  props: {
  },
  data() {
    return {
      custTypeId: getUserInfo().custTypeId,
      listQuery: {
        id: '',
        fundName: '',
        accountDateStart: '',
        accountDateEnd: '',
        approveDateEnd: '',
        approveDateStart: '',
        accountAmountMin: '',
        accountAmountMax: '',
        loanRateMin: '',
        loanRateMax: '',
        industryName: '',
        creditNo: '',
        lendingState: '',
        customerName: '',
        lendingDate: '',
        loanRate: '',
        deadline: '',
        dateDue: '',
        repaymentMethod: '',
        deadlineMin: '',
        deadlineMax: '',
        collAcctName: '',
        collBank: '',
        collAcctNo: '',
        receiverName: '',

        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      loanData: [],
      accountNo: '',
      loanDateRange: ['', ''],
      lendingDateRange: ['', ''],
      approveDateRange: ['', ''],
      dateDueDateRange: ['', ''],
      // deadlineRange: ['', ''],
      total: 0,
      batchMaintenanceVisible: false,
      multipleSelection: [], // 多选内容
      ids: null, // 多选的ID数组
      dialogTableVisible: false,
      batchAddLoanVisible: false
    }
  },
  created() {
    // 获取数据
    this.getLendingProds()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    // 获取数据
    getLendingProds(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      getLendingProds(this.listQuery).then(res => {
        if (res.code === '0') {
          this.loanData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 领取
    getLendingClaim(id) {
      const params = { loanApplyId: id }
      getLendingClaim(params).then(res => {
        if (res.code === '0') {
          this.$message.success('领取成功')
        } else {
          this.$message.error(res.msg)
        }
        this.getLendingProds()
      })
    },
    // 退领
    getLendingUnClaim(id) {
      const params = { loanApplyId: id }
      getLendingUnClaim(params).then(res => {
        if (res.code === '0') {
          this.$message.success('退领成功')
        } else {
          this.$message.error(res.msg)
        }
        this.getLendingProds()
      })
    },
    // 维护
    sigleMaintenance(row) {
      this.$router.push({
        path: 'loan-maintenance',
        query: {
          id: row.id,
          accountNo: row.accountNo
        }
      })
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
    // 期限日期
    // changeDeadlineRange(range) {
    //   if (!range) {
    //     this.deadlineRange = ['', '']
    //     this.listQuery.deadlineMin = ''
    //     this.listQuery.deadlineMax = ''
    //   } else {
    //     this.listQuery.deadlineMin = range[0]
    //     this.listQuery.deadlineMax = range[1]
    //   }
    // },
    // 提交新增、编辑
    recordSaveAndEdit(data) {

    },
    // 禁用
    disableClick(row) {

    },
    // 批量维护
    batchMaintenance() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请勾选需要维护的数据')
        return
      }
      let flag = false
      this.multipleSelection.forEach(res => {
        if (!res.receiverName) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('有未领取的记录')
        return
      }
      this.ids = this.multipleSelection.map(data => {
        return data.id
      })
      this.batchMaintenanceVisible = true
    },
    batchAddLoan() {
      this.batchAddLoanVisible = true
    },
    // 新增放款维护列表
    createLoan(mode) {
      this.$router.push({
        path: '/FinanceManagement/createLoan',
        query: {
          mode
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.listQuery.accountDateEnd = ''
      this.listQuery.accountDateStart = ''
      this.listQuery.approveDateEnd = ''
      this.listQuery.approveDateStart = ''
      this.listQuery.accountAmountMin = ''
      this.listQuery.accountAmountMax = ''
      this.listQuery.loanRateMax = ''
      this.listQuery.loanRateMin = ''
      this.loanDateRange = ['', '']
      this.approveDateRange = ['', '']
      this.lendingDateRange = ['', '']
      this.listQuery.lendingDateStart = ''
      this.listQuery.lendingDateEnd = ''
      this.dateDueDateRange = ['', '']
      this.listQuery.dateDueStart = ''
      this.listQuery.dateDueEnd = ''
      // this.deadlineRange = ['', '']
      this.listQuery.deadlineMin = ''
      this.listQuery.deadlineMax = ''
      this.getLendingProds('query')
    },
    // 关闭弹窗
    cancel() {
      this.batchMaintenanceVisible = false
      this.batchAddLoanVisible = false
    },
    closeLoanDialog() {
      this.dialogTableVisible = false
      this.resetForm()
    },
    uploadSuccess() {
      this.resetForm()
      this.batchMaintenanceVisible = false
      this.batchAddLoanVisible = false
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
