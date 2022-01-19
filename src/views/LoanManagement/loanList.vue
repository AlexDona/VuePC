<template>
  <!-- 用款申请维护 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="accountNo">
            <el-input v-model="listQuery.accountNo" clearable placeholder="用款申请编号" />
          </el-form-item>
        </el-col>
        <el-col v-if="userInfo.custTypeId !== 3" :sm="4" :xs="4">
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
          <el-form-item label="" prop="loanDateRange">
            <el-date-picker v-model="loanDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="申请日期" end-placeholder="申请日期" @change="changeDateRange" />
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model="listQuery.accountAmountMin" style="width: 100%" placeholder="金额" />
          <span class="center-1">至</span>
          <el-input v-model="listQuery.accountAmountMax" placeholder="金额" />
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item label="" prop="approveDateRange">
            <el-date-picker v-model="approveDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="批复日期" end-placeholder="批复日期" @change="appDateRange" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getLoanProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="
                `/business/loanapply/exportLoanApply`
              "
              method-type="post"
              :params="listQuery"
              file-name="用款申请列表"
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
      <el-table-column label="用款申请编号" prop="accountNo" min-width="240px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="customerName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="用款申请日期" prop="accountDate" min-width="150px;" />
      <el-table-column label="用款申请金额(元)" prop="accountAmount" align="right" min-width="150px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.accountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId !== 3" label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="240px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="授信批复日期" prop="approveDate" min-width="150px;" />
      <el-table-column label="授信批复额度" prop="creditApplyLimit" align="right" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApplyLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款状态" prop="lendingState" :formatter="formatLendingState" min-width="150px;" />
      <el-table-column v-if="userInfo.custTypeId === 1" label="当前节点" prop="approveCustName" show-overflow-tooltip min-width="150px;" />
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
import Pagination from '@/components/Pagination'
import { getLoanProds } from '@/api/finance'
import { curHeight } from '@/mixins/requestCurHeight'
import { getUserInfo } from '@/utils/auth'

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
      userInfo: getUserInfo(),
      listQuery: {
        accountNo: '',
        industryName: '',
        accountDateStart: '',
        accountDateEnd: '',
        approveDateEnd: '',
        approveDateStart: '',
        accountAmountMin: '',
        accountAmountMax: '',
        customerName: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      loanData: [],
      loanDateRange: ['', ''],
      approveDateRange: ['', ''],
      total: 0
    }
  },
  created() {
    // 获取数据
    this.getLoanProds()
  },
  methods: {
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
    handlePage(page) {
      this.listQuery.pageParam.pageSize = page.limit
      this.getLoanProds()
      // console.log(page)
    },
    // 获取数据
    getLoanProds(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      getLoanProds(this.listQuery).then(res => {
        if (res.code === '0') {
          this.loanData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
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

    // 选择批复日期
    appDateRange(range) {
      if (!range) {
        this.approveDateRange = ['', '']
        this.listQuery.approveDateStart = ''
        this.listQuery.approveDateEnd = ''
      } else {
        this.listQuery.approveDateStart = range[0]
        this.listQuery.approveDateEnd = range[1]
      }
    },
    // 提交新增、编辑
    recordSaveAndEdit(data) {

    },
    // 禁用
    disableClick(row) {

    },
    // 新增用款申请
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
      this.loanDateRange = ['', '']
      this.approveDateRange = ['', '']
      this.getLoanProds()
    },
    // 关闭弹窗
    cancel() {
      this.dialogVisible = false
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
