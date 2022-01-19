<template>
  <div>
    <el-form ref="resetForm" :model="listQuery">
      <el-row type="flex" style="gap: 24px">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="listQuery.productName" class="selectWidth" placeholder="金融产品" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getTableData('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <!-- <downloadBtn
              btn-name="下载"
              :download-url="
                `/adapter/v1/property/description`
              "
              method-type="get"
              file-name="建档列表"
            />-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :max-height="curHeight"
      stripe
      border
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="授信申请编号"
        show-overflow-tooltip
        min-width="240px"
      >
        <template slot-scope="scope">{{ scope.row.creditNo }}</template>
      </el-table-column>
      <el-table-column
        label="客户名称"
        prop="custName"
        show-overflow-tooltip
        min-width="160px"
      />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="160px" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间(%/年)" prop="productRateRegion" min-width="240px;" />
      <el-table-column label="期限区间(月)" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" prop="repaymentMethod" min-width="240px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="180px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handlePreview(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageIndex"
      @pagination="handlePage"
    />

    <!-- 上传 -->
    <batch-import
      :file-format="fileFormat"
      title="上传审批结果"
      download-file-name="审批结果模板"
      :download-url="downloadUrl"
      :down-params="downParams"
      :upload-params="uploadParams"
      :upload-url="uploadUrl"
      :dialog-visible="dialogVisible"
      @success="cancel"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCreditApproveList, exportCreditTemplate, exportCreditExcel } from '@/api/credit'
import BatchImport from '@/views/components/batch-import'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: 'CreditUnApprovaled',
  components: { BatchImport, Pagination },
  mixins: [curHeight],
  data() {
    console.log(exportCreditTemplate, 'exportCreditTemplate')
    return {
      total: 0,
      listQuery: {
        productName: '',
        custName: '',
        isHandled: 1,
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      tableData: [],
      dialogVisible: false,
      fileFormat: 'xls',
      uploadUrl: exportCreditExcel(),
      downloadUrl: exportCreditTemplate(),
      downParams: {
        ids: []
      },
      uploadParams: null
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleDialog() {
      this.dialogVisible = !this.dialogVisible
    },
    handleUpload() {
    },
    success() {
      this.dialogVisible = false
    },
    // 关闭弹窗
    cancel() {
      this.dialogVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePage(page) {
      this.listQuery.pageParam.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    getTableData(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      selectCreditApproveList(this.listQuery).then(res => {
        console.log(res, 'res')
        if (res.code === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
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
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getTableData('query')
    },
    handlePreview(row) {
      this.$router.push({
        path: '/CreditManagement/creditDisposeDetail',
        query: {
          creditNo: row.creditNo,
          type: 'preview',
          changeTitle: true,
          curTitle: '授信申请详情'
        }
      })
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
    padding: 20px;
    border-bottom: 1px solid #000;
  }
  .el-dialog__body {
    padding: 30px 80px;
  }
}
</style>
