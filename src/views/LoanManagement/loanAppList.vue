<template>
  <!-- 用款审批维护 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="accountNo">
            <el-input v-model.trim="listQuery.accountNo" clearable placeholder="用款申请编号" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model.trim="listQuery.industryName" clearable placeholder="产业公司名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model.trim="listQuery.customerName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4" class="el-col-money">
          <el-input v-model.trim="listQuery.accountAmountMin" style="width: 100%" placeholder="用款申请金额" />
          <span class="center-1">至</span>
          <el-input v-model.trim="listQuery.accountAmountMax" placeholder="用款申请金额" />
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item label="" prop="loanDateRange">
            <el-date-picker v-model="loanDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="申请日期" end-placeholder="申请日期" @change="changeDateRange" />
          </el-form-item></el-col>
        <el-col v-if="userInfo.custTypeId !== 4" :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.fundName" clearable placeholder="资金方名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item label="" prop="approveDateRange">
            <el-date-picker v-model="approveDateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="批复日期" end-placeholder="批复日期" @change="appDateRange" />
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getLoanAppProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="
                `/business/loanapply/exportLoanApprove`
              "
              method-type="post"
              :params="listQuery"
              file-name="用款审批列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <downloadBtn
              btn-name="批量下载"
              :download-url="
                `/business/loanapply/exportLoanApproveZip`
              "
              :disabled="!hasCheckedData"
              method-type="post"
              file-format="zip"
              :params="exportLoanIds"
              file-name="用款审批批量数据列表"
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="用款申请编号" prop="accountNo" min-width="180" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="customerName" min-width="240" />
      <el-table-column v-if="userInfo.custTypeId !== 4" label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240" />
      <el-table-column label="用款申请日期" prop="accountDate" min-width="130" />
      <el-table-column label="用款申请金额(元)" prop="accountAmount" align="right" min-width="130">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.accountAmount }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="用款状态" prop="lendingState" min-width="110">
        <template slot-scope="{ row }">
          <span v-show="row.lendingState === 1">补充资料</span>
          <span v-show="row.lendingState === 2">资金方审批</span>
          <span v-show="row.lendingState === 3">审批通过</span>
          <span v-show="row.lendingState === 4">已拒绝</span>
        </template>
      </el-table-column> -->
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240" />
      <el-table-column label="授信申请编号" show-overflow-tooltip prop="creditNo" min-width="150" />
      <el-table-column label="授信批复日期" min-width="150" prop="approveDate" />
      <el-table-column label="授信批复额度" min-width="160" align="right" prop="creditApplyLimit">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApplyLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="viewDeatil(scope.row)">查看</el-button>
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
import Pagination from '@/components/Pagination'
import { getLoanAppProds } from '@/api/finance'
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
        industryName: '',
        accountDateStart: '',
        accountDateEnd: '',
        approveDateEnd: '',
        approveDateStart: '',
        accountAmountMin: '',
        accountAmountMax: '',
        customerName: '',
        fundName: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      exportLoanIds: {}, // 批量下载id
      loanData: [],
      loanDateRange: ['', ''],
      approveDateRange: ['', ''],
      lendingStateList: [
        { value: 0, label: '暂存' },
        { value: 1, label: '生效' },
        { value: 2, label: '失效' }
      ],
      userInfo: getUserInfo(),
      total: 0,
      hasCheckedData: false
    }
  },
  created() {
    // 获取数据
    this.getLoanAppProds()
  },
  methods: {
    handlePage(page) {
      // console.log(this.listQuery.pageParam)
      this.listQuery.pageParam.pageSize = page.limit
      this.getLoanAppProds()
      // console.log(page)
    },
    // 获取数据
    getLoanAppProds(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      getLoanAppProds(this.listQuery).then(res => {
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
      // 放款状态 1：补充资料（审批退回） 2：资金方审批 3：审批通过 4：已拒绝
      switch (row.lendingState) {
        case 1: return '补充资料(审批退回)'
        case 2: return '资金方审批'
        case 3: return '审批通过'
        case 4: return '已拒绝'
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
    // 批量下载
    handleSelectionChange(data) {
      this.hasCheckedData = data.length
      const arr = data.map(item => {
        return item.id
      })
      this.exportLoanIds.ids = arr
    },
    viewDeatil(item) {
      console.log(item)
      this.$router.push({
        path: 'loanAppDetail',
        query: {
          id: item.id,
          creditNo: item.creditNo
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
      this.getLoanAppProds()
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
