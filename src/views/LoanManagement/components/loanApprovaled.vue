<template>
  <div class="">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="accountNo">
            <el-input v-model.trim="listQuery.accountNo" placeholder="用款申请编号" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model.trim="listQuery.customerName" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.fundName" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="listQuery.productName" placeholder="产品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model.trim="listQuery.industryName" placeholder="所属公司" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="applyDate">
            <el-date-picker
              v-model="loanApplyRange"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              start-placeholder="用款申请日期"
              end-placeholder="用款申请日期"
              @change="datePickerDate"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :sm="8" :xs="8">
          <el-form-item>
            <el-button type="primary" @click="getTableData('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
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
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="用款申请编号"
        min-width="240px"
        prop="accountNo"
      />
      <el-table-column
        label="客户名称"
        prop="customerName"
        show-overflow-tooltip
        min-width="160px"
      />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px" />
      <el-table-column label="产品名称" show-overflow-tooltip prop="productName" min-width="240px" />
      <el-table-column label="用款申请日期" prop="accountDate" min-width="240px;" />
      <el-table-column label="用款申请金额(元)" align="right" prop="accountAmount" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.accountAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" prop="industryName" min-width="240px;" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="190px;" />
      <el-table-column label="授信批复日期" prop="approveDate" min-width="240px;" />
      <el-table-column label="授信批复额度(元)" prop="creditApplyLimit" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApplyLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="receiverName" min-width="120;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDraw(scope.row)">查看</el-button>
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
import { selectLoanApproveList } from '@/api/credit'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: 'LoanUnapprovaled',
  components: { Pagination },
  mixins: [curHeight],
  data() {
    return {
      total: 0,
      listQuery: {
        // accountAmountMax: '',
        // accountAmountMin: '',
        accountDateEnd: '',
        accountDateStart: '',
        accountNo: '',
        // approveDateEnd: '',
        // approveDateStart: '',
        // coreName: '',
        productName: '',
        customerName: '',
        fundName: '',
        industryName: '',
        isHandled: 1,
        // lendingState: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      loanApplyRange: [], // 用款申请期日
      tableData: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 获取列表数据
    getTableData(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      selectLoanApproveList(this.listQuery).then(res => {
        console.log(res, 'res')
        if (res.code === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 用款申请日期
    datePickerDate(range) {
      if (!range) {
        this.loanApplyRange = ['', '']
        this.listQuery.accountDateStart = ''
        this.listQuery.accountDateEnd = ''
      } else {
        this.listQuery.accountDateStart = range[0]
        this.listQuery.accountDateEnd = range[1]
      }
    },
    handlePage(page) {
      this.listQuery.pageParam.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    async handleDraw(row) {
      this.$router.push({
        path: '/LoanManagement/LoanDisposePage',
        query: {
          loanId: row.id,
          type: 'preview'
        }
      })
    },
    // 重置
    resetForm() {
      this.listQuery.custName = ''
      this.listQuery.productName = ''
      this.listQuery.custType = ''
      this.listQuery.custTypeId = ''
      this.listQuery.name = ''
      this.listQuery.accountDateStart = ''
      this.listQuery.accountDateEnd = ''
      this.loanApplyRange = ['', '']
      this.$refs['resetForm'].resetFields()
      this.getTableData('query')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
