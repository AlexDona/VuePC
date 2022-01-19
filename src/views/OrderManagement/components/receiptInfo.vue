<!--订单信息-->
<template>
  <div class="container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model="listQuery.custName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <!-- <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model="listQuery.productName" placeholder="产业公司名称" />
          </el-form-item>
        </el-col> -->
        <el-col :sm="4" :xs="4">
          <el-form-item prop="saleBillNo">
            <el-input v-model="listQuery.saleBillNo" clearable placeholder="单据号" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="orgName">
            <el-input v-model="listQuery.orgName" clearable placeholder="销售组织" />
          </el-form-item>
        </el-col>
        <el-col v-if="custTypeId === 1 || custTypeId === 6" :sm="4" :xs="4">
          <el-form-item prop="saleMan">
            <el-input v-model="listQuery.saleMan" clearable placeholder="业务人员" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item>
            <el-button type="primary" @click="getOrderList('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>

          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row :gutter="20">-->
      <!--        <el-col :sm="8" :xs="8">-->
      <!--          <el-form-item>-->
      <!--            <el-button type="primary" @click="visibleBatchImport = true">批量导入</el-button>-->
      <!--            <downloadBtn-->
      <!--              btn-name="下载"-->
      <!--              download-url="''"-->
      <!--              method-type="post"-->
      <!--              :params="listQuery"-->
      <!--              file-name="收款单列表数据"-->
      <!--            />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
    </el-form>
    <el-table
      ref="table"
      :data="orderList"
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
      <el-table-column label="收款单系统编号" prop="saleSysNo" min-width="200px;" />
      <el-table-column label="单据号" prop="saleBillNo" min-width="140px;" />
      <el-table-column label="销售组织" prop="orgName" min-width="140px;" />
      <el-table-column label="业务人员" prop="saleMan" min-width="140px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="140px;" />
      <el-table-column label="收款银行账号" prop="billDate" min-width="140px;" />
      <el-table-column label="币种" prop="mcCode" min-width="140px;" />
      <el-table-column label=" 金额" show-overflow-tooltip prop="mcName" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.mcName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打款人" prop="mainUnit" min-width="240px;" />
      <el-table-column label="打款日期" prop="mainNum" min-width="240px;" />
      <el-table-column label="单据日期" prop="mainIncludeTaxPrice" min-width="240px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.mainIncludeTaxPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款类型" prop="taxAmt" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.taxAmt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务年度" prop="transactionType" min-width="240px;" />
    </el-table>
    <!-- 批量导入 -->
    <batch-import
      :dialog-visible="visibleBatchImport"
      :title="'批量导入'"
      :method-type="'get'"
      :download-url="''"
      :download-file-name="'批量导入收款单模板'"
      :upload-url="''"
      @cancel="closeDialog"
      @success="closeDialog('success')"
    />
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getOrderList"
    />
  </div>
</template>
<script>
// import { getOrderList } from '@/api/finance'
import batchImport from '@/views/components/batch-import.vue'
import Pagination from '@/components/Pagination'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: 'ReceiptInfo',
  components: {
    batchImport,
    // downloadBtn: (resolve) => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      custTypeId: getUserInfo().custTypeId,
      listQuery: {
        custName: '', // 客户名称
        orgName: '', // 销售组织名称
        saleBillNo: '', // 销售单编号
        saleMan: '', // 业务员
        saleSysNo: '', // 业务员
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      visibleBatchImport: false,
      orderList: [],
      total: 0
    }
  },
  computed: {
  },
  created() {
    // 获取订单列表数据
    this.getOrderList()
  },
  methods: {
    getOrderList(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      // getOrderList(this.listQuery).then(res => {
      //   if (res.code === '0') {
      //     this.orderList = res.data.list
      //     this.total = res.data.total
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      // }).catch(err => {
      //   this.$message.error(err.msg)
      // })
    },
    // 关闭弹窗
    closeDialog(type) {
      this.visibleBatchImport = false
      if (type === 'success') this.getOrderList()
    },
    // 重置
    resetForm() {
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getOrderList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
