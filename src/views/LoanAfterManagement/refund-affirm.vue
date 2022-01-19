<template>
  <!-- 还款确认列表 -->
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
        <el-col v-if="userInfo.custTypeId === 1" :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model="listQuery.fundName" clearable placeholder="资金方名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model="listQuery.customerName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model="listQuery.productName" clearable placeholder="金融产品名称" />
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
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.minLendingAmount" style="width: 100%" placeholder="放款金额" @input="listQuery.minLendingAmount = lib.fixMoneyMinus(listQuery.minLendingAmount)" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.maxLendingAmount" style="width: 100%" placeholder="放款金额" @input="listQuery.maxLendingAmount = lib.fixMoneyMinus(listQuery.maxLendingAmount)" />
        </el-col>
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.minDeadline" style="width: 100%" placeholder="期限" @input="listQuery.minDeadline = lib.fixMoneyMinus(listQuery.minDeadline)" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.maxDeadline" style="width: 100%" placeholder="期限" @input="listQuery.maxDeadline = lib.fixMoneyMinus(listQuery.maxDeadline)" />
        </el-col>
        <el-col :sm="5" :xs="5">
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

        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="queryRepaymentPage('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="
                `/business/loanapply/repayment/exportRepayments`
              "
              method-type="post"
              :params="listQuery"
              file-name="还款确认列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="checkListStyle">
        <el-col :sm="4" :xs="4">
          <el-button type="primary" @click="batchMaintenance()">批量维护</el-button>
        </el-col>
        <el-col :sm="20" :xs="20">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="贷款状态" />
            <el-checkbox label="已还款金额(元)" />
            <el-checkbox label="剩余还款金额(元)" />
            <el-checkbox label="还款日期" />
            <el-checkbox label="还款账号" />
            <el-checkbox label="操作人" />
          </el-checkbox-group>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="loanData"
      stripe
      border
      style="width: 100%; margin-top:20px"
      :max-height="curHeight"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="changeSelectable" align="center" width="50" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="用款申请编号" prop="accountNo" min-width="200px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="customerName" min-width="240px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId === 1" show-overflow-tooltip label="资金方名称" prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="放款日期" prop="lendingDate" min-width="160px;" />
      <el-table-column label="放款金额(元)" align="right" prop="lendingAmount" min-width="120px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">
            {{ row.lendingAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="期限(月)" prop="deadline" min-width="120px;" />
      <el-table-column label="到期日" prop="dateDue" min-width="160px;" />
      <el-table-column v-if="checkList.includes('贷款状态')" label="贷款状态" prop="loanStatus" min-width="100px;">
        <template slot-scope="{ row }">
          <span v-if="row.loanStatus === 0">逾期</span>
          <span v-if="row.loanStatus === 1">正常</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkList.includes('已还款金额(元)')" label="已还款金额(元)" align="right" prop="repaymentAmount" min-width="150px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">
            {{ row.repaymentAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkList.includes('剩余还款金额(元)')" label="剩余还款金额(元)" align="right" prop="remainAmount" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">
            {{ row.remainAmount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkList.includes('还款日期')" label="还款日期" prop="repaymentDate" min-width="160px;" />
      <el-table-column v-if="checkList.includes('还款账号')" label="还款账号" show-overflow-tooltip prop="repaymentAcctNo" min-width="180px;" />
      <el-table-column v-if="checkList.includes('操作人')" label="操作人" show-overflow-tooltip prop="operator" min-width="120px;" />
      <el-table-column label="操作" prop="cust" min-width="280px;" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-dropdown
            v-if="row.loanStatus === 0"
            style="margin-left: 10px"
          >
            <el-button type="text" @click="dueRemind(row.id)">逾期提醒</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>{{ row.overDueRemind }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <template v-if="!row.operator">
            <el-button type="text" style="margin-left: 10px" @click="repaymentClaim(row.id)">领取</el-button>
          </template>
          <template v-else>
            <el-button type="text" style="margin-left: 10px" @click="toMaintain(row,'maintain')">维护</el-button>
            <el-button type="text" @click="repaymentUnClaim(row.id)">退领</el-button>
          </template>
          <el-button type="text" @click="toMaintain(row,'planPreview')">查看还款计划</el-button>
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
    <batch-import
      title="上传审批结果"
      download-file-name="审批结果模板"
      :download-url="downloadUrl"
      :down-params="multipleSelection"
      :file-format="fileFormat"
      :upload-url="uploadUrl"
      :dialog-visible="batchMaintenanceVisible"
      @success="uploadSuccess"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { loanapplyRepaymentPage, overDueRemind, repaymentClaim, repaymentUnClaim } from '@/api/loan'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: '',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    BatchImport: resolve => require(['@/views/components/batch-import'], resolve),
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
        minDeadline: '',
        maxDeadline: '',
        industryName: '',
        productName: '',
        lendingAmount: '',
        repaymentAmount: '',
        remainAmount: '',
        repaymentDate: '',
        repaymentAcctNo: '',
        operator: '',
        loanStatus: '',
        overDueRemind: '',
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
      fileFormat: 'xls',
      downloadUrl: '/business/loanapply/repayment/export',
      uploadUrl: '/api/business/loanapply/repayment/upload',
      loanData: [],
      lendingDateRange: ['', ''],
      dateDueDateRange: ['', ''],
      loanStatusList: [
        { value: 0, label: '逾期' },
        { value: 1, label: '正常' }
      ],
      total: 0,
      checkList: [],
      checkAll: false,
      isIndeterminate: true,
      tableCheckOptions: [
        '贷款状态',
        '已还款金额(元)',
        '剩余还款金额(元)',
        '还款日期',
        '还款账号',
        '产业公司名称',
        '操作人'
      ],
      batchMaintenanceVisible: false,
      multipleSelection: {
        ids: []
      }, // 多选数据内容
      ids: null // 多选的ID数组
    }
  },
  created() {
    // 获取数据
    this.queryRepaymentPage()
  },
  methods: {
    // 多选数据
    handleSelectionChange(data) {
      this.multipleSelection.ids = data.map(item => {
        return item.id
      })
    },
    // 当前行数据是否禁用选中
    changeSelectable(data) {
      return data.operator
    },
    handleCheckAllChange(val) {
      this.checkList = val ? this.tableCheckOptions : []
      this.isIndeterminate = false
    },
    // 获取数据
    queryRepaymentPage(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      loanapplyRepaymentPage(this.listQuery).then(res => {
        if (res.code === '0') {
          this.loanData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 逾期提醒
    dueRemind(id) {
      overDueRemind(id).then(res => {
        if (res.code === '0') {
          this.queryRepaymentPage()
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 领取
    repaymentClaim(id) {
      const params = { loanApplyId: id }
      repaymentClaim(params).then(res => {
        if (res.code === '0') {
          this.$message.success('领取成功')
        } else {
          this.$message.error(res.msg)
        }
        this.queryRepaymentPage()
      })
    },
    // 退领
    repaymentUnClaim(id) {
      const params = { loanApplyId: id }
      repaymentUnClaim(params).then(res => {
        if (res.code === '0') {
          this.$message.success('退领成功')
        } else {
          this.$message.error(res.msg)
        }
        this.queryRepaymentPage()
      })
    },
    // 维护
    sigleMaintenance(id) {
      this.$router.push({
        path: 'loan-maintenance',
        query: {
          id
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
    // 维护列表
    toMaintain(row, mode) {
      const pushUrl = {
        'maintain': '/LoanAfterManagement/loanMaintainList',
        'planPreview': '/LoanAfterManagement/loanMaintainInfo'
      }
      this.$router.push({
        path: pushUrl[mode],
        query: {
          mode,
          id: row ? row.id : ''
        }
      })
    },

    // 提交新增、编辑
    recordSaveAndEdit(data) {

    },
    // 禁用
    disableClick(row) {

    },
    // 批量维护
    batchMaintenance() {
      if (!this.multipleSelection.ids.length) {
        this.$message.warning('请勾选需要维护的数据')
        return
      }
      this.batchMaintenanceVisible = true
    },
    // 新增还款确认列表
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
      this.listQuery.pageParam.pageIndex = 1
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
    },
    // 关闭弹窗
    cancel() {
      this.batchMaintenanceVisible = false
    },
    uploadSuccess() {
      this.resetForm()
      this.batchMaintenanceVisible = false
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
  .checkListStyle .el-col:last-child {
    text-align: right;
    .el-checkbox-group {
      padding-top: 15px;
  }
}
</style>
