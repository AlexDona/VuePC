<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.fundName" class="selectWidth" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="listQuery.productName" clearable placeholder="金融产品名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model.trim="listQuery.industryName" class="selectWidth" placeholder="所属公司" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="4" :sm="4">
          <el-form-item class="selectWidth" prop="applyDate">
            <el-date-picker
              v-model="applyDate"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="授信申请日期"
              end-placeholder="授信申请日期"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item class="productTerm" prop="approvalMaterialDate">
            <el-date-picker
              v-model="approvalMaterialDate"
              class="selectWidth"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="daterange"
              range-separator="至"
              start-placeholder="审批材料申请日期"
              end-placeholder="审批材料申请日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="8" :xs="8">
          <el-form-item>
            <el-button type="primary" @click="getTableData">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :params="listQuery"
              :download-url="
                `/business/credit/exportCustomerPushList`
              "
              method-type="post"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
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
      <el-table-column label="序号" fixed="left" type="index" width="50" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="240px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="160px" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="240px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="productRateRegion" min-width="140px;" />
      <el-table-column label="期限区间（月）" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" prop="repaymentMethod" min-width="240px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="120px;" />
      <el-table-column label="所属公司" prop="industryName" show-overflow-tooltip min-width="240px;" />
      <el-table-column label="审批材料状态" show-overflow-tooltip prop="approvalMaterialStatusCN" min-width="120px;" />
      <el-table-column label="审批材料申请日期" prop="approvalMaterialDate" min-width="160px;" />
      <el-table-column label="推送日期" prop="pushDate" min-width="120px;" />
      <el-table-column label="操作" prop="action" align="center" fixed="right" min-width="130">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handlePush(row)">推送</el-button>
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
import { curHeight } from '@/mixins/requestCurHeight'
import downloadBtn from '@/views/components/template-xls'
import { selectCustomerPushList, customerPush } from '@/api/CreditMgt/customerPush'

export default {
  name: 'CustomerPush',
  components: {
    downloadBtn,
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      approvalMaterialStatusCN: {
        0: '待申请',
        1: '带推送',
        2: '已推送'
      },
      dateRange: ['', ''],
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      total: 0,
      tableData: [],
      applyDate: [],
      approvalMaterialDate: [],
      listQuery: {
        custName: '', // 客户名称
        fundName: '',
        productName: '',
        industryName: '',
        applyDateEnd: '',
        applyDateStart: '',
        approvalMaterialDateEnd: '',
        approvalMaterialDateStart: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      }
    }
  },
  watch: {
    applyDate(val) {
      if (val) {
        this.listQuery.applyDateStart = val[0]
        this.listQuery.applyDateEnd = val[1]
      } else {
        this.listQuery.applyDateStart = ''
        this.listQuery.applyDateEnd = ''
      }
    },
    approvalMaterialDate(val) {
      if (val) {
        this.listQuery.approvalMaterialDateStart = val[0]
        this.listQuery.approvalMaterialDateEnd = val[1]
      } else {
        this.listQuery.approvalMaterialDateStart = ''
        this.listQuery.approvalMaterialDateEnd = ''
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      console.log(this.listQuery)
      const res = await selectCustomerPushList(this.listQuery)

      if (res.code === '0') {
        this.total = res.data.total
        this.tableData = res.data && res.data.list || []
      } else {
        this.$message.error(res.msg)
      }
    },
    // 重置
    resetForm() {
      this.applyDate = []
      this.approvalMaterialDate = []
      this.listQuery.pageParam.pageIndex = 1
      this.listQuery.pageParam.pageSize = 15
      this.$refs['resetForm'].resetFields()
      this.getTableData()
    },
    handlePage(page) {
      console.log(this.listQuery.pageParam)
      this.listQuery.pageParam.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    handlePush(rowData) {
      this.$confirm('请确定是否推送', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        const res = await customerPush({
          id: rowData.id
        })
        if (res.code === '0') {
          this.$message.success('推送成功')
          this.getTableData()
        } else {
          this.$message.warning(res.msg)
        }
        // 确认，将改变后的状态值赋给绑定的itemValue
      }).catch(() => {
        // 取消，将对立状态值赋给itemValue
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .selectWidth {
    width: 100% !important;
  }
}
</style>
