<template>
  <div class="">
    <el-form ref="resetForm" :model="listQuery">
      <el-row type="flex" style="gap: 24px">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.productName" class="selectWidth" placeholder="金融产品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="approvalMaterialStatus">
            <el-select v-model.trim="listQuery.approvalMaterialStatus" placeholder="审批材料状态" style="width:100%" clearable>
              <el-option v-for="item in mapList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
              "menu
              method-type="get"
              file-name="建档列表"
            />-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-button :disabled="!hasCheckedData" type="primary" @click="getMaterial">获取审批资料</el-button>
          <downloadBtn
            btn-name="审批材料下载"
            :download-url="
              `/business/credit/exportMaterialList`
            "
            :disabled="!hasCheckedData"
            method-type="post"
            file-format="zip"
            :params="exportLoanIds"
            file-name="授信审批文件"
          />
          <el-button
            type="primary"
            @click.stop="handleDialog"
          >上传审批结果</el-button>
        </el-col>
      </el-row>
    </el-form>
    <br>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      stripe
      border
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      :cell-style="({ row, column, rowIndex, columnIndex }) => {
        if (columnIndex === 0) {
          return {
            textAlign: 'center'
          }
        }
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
      />
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        label="授信申请编号"
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
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="240px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间(%/年)" prop="productRateRegion" min-width="240px;" />
      <el-table-column label="期限区间(月)" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" prop="repaymentMethod" min-width="240px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="240px;" />
      <el-table-column label="所属公司" show-overflow-tooltip prop="industryName" min-width="180px;" />
      <el-table-column label="审批材料状态" show-overflow-tooltip prop="approvalMaterialStatusCN" min-width="180px;" />
      <el-table-column label="操作人" prop="receiverName" min-width="120;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.receiverName" type="text" @click="handleDraw(scope.row)">领取</el-button>
          <div v-else>
            <el-button type="text" @click="handleDispose(scope.row)">处理</el-button>
            <el-button type="text" @click="handleRevert(scope.row, 'revert')">退领</el-button>
          </div>
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
      @success="success"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCreditApproveList, exportCreditTemplate, exportCreditExcel, getCreditMaintain, sendbackCreditMaintain, exportCreditApprovalListExcel, getMaterial } from '@/api/credit'
import BatchImport from '@/views/components/batch-import'
import downloadBtn from '@/views/components/template-xls'

export default {
  name: 'CreditApprovaled',
  components: { BatchImport, Pagination, downloadBtn },
  data() {
    console.log(exportCreditTemplate, 'exportCreditTemplate')
    return {
      mapList: [ // 0-待申请，1-待推送，2-已推送
        {
          label: '待申请',
          value: 0
        },
        {
          label: '待推送',
          value: 1
        },
        {
          label: '已推送',
          value: 2
        }
      ],
      total: 0,
      listQuery: {
        approvalMaterialStatus: '', // 审批材料状态
        productName: '',
        isHandled: 0,
        custName: '',
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
      exportLoanIds: {}, // 批量下载
      exportIds: [], // 获取审批资料
      uploadParams: null,
      multipleSelection: [],
      hasCheckedData: false
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getMaterial() {
      try {
        const res = await getMaterial(this.exportIds)
        if (res.code === '0') {
          this.$message.success(res.msg)
          this.getTableData()
          // this.tableData = res.data.list
          // console.log(res, 'res handleDraw')
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        this.$message.error(error.response.data.msg)
      }
    },
    // 批量下载文件
    async batchDownloads() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning({
          message: '请先勾选下载列表'
        })
        return
      }
      const params = {}
      this.multipleSelection.map(item => {
        params.custName = item.custName
        params.fundName = item.fundName
        params.industryName = item.industryName
        params.isHandled = this.listQuery.isHandled
        params.productName = item.productName
        params.pageParam = this.listQuery.pageParam
      })
      console.log(this.multipleSelection, params, 'multipleSelection')
      window.open(
        'api/file/v1/biz-files/batchDownload?objectId=' +
        this.objectId +
        '&type=collection'
      )
      const res = await exportCreditApprovalListExcel()
      if (res.code === '0') {
        // this.$message.success('领取成功')
        // this.getTableData()
        // this.tableData = res.data.list
        // console.log(res, 'res handleDraw')
      } else {
        this.$message.error(res.msg)
      }
    },
    handlePage(page) {
      this.listQuery.pageParam.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    async handleDraw(row) {
      const res = await getCreditMaintain({
        creditNo: row.creditNo
      })
      if (res.code === '0') {
        this.$message.success('领取成功')
        // this.tableData = res.data.list
        // console.log(res, 'res handleDraw')
      } else {
        this.$message.error(res.msg)
      }
      this.getTableData()
    },
    handleDispose(row) {
      console.log('处理')
      this.$router.push({
        path: '/CreditManagement/creditDisposePage',
        query: {
          creditNo: row.creditNo
        }
      })
    },
    async handleRevert(row, type) {
      this.$confirm(type === 'revert' ? '确定退领？' : '确定领取？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await sendbackCreditMaintain({
          creditNo: row.creditNo
        })
        if (res.code === '0') {
          this.$message.success('退领成功')
          // this.tableData = res.data.list
          // console.log(res, 'res handleDraw')
        } else {
          this.$message.error(res.msg)
        }
        this.getTableData()
      })
    },
    // handleDialog() {
    //   this.dialogVisible = !this.dialogVisible
    // },

    // 上传模板
    handleDialog() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请勾选需要的数据')
        return
      }
      let flag = false
      this.multipleSelection.every(res => {
        if (!res.receiverName) {
          flag = true
        }
      })
      if (flag) {
        this.$message.warning('有未领取的记录')
        return
      }
      this.downParams.ids = this.multipleSelection.map(data => {
        return data.id
      })
      console.log(this.multipleSelection, this.downParams.ids, 'this.multipleSelection')
      this.dialogVisible = true
    },
    handleUpload() {
    },
    success() {
      this.resetForm()
      this.dialogVisible = false
    },
    // 关闭弹窗
    cancel() {
      this.dialogVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.hasCheckedData = val.length
      const arr = val.map(item => {
        return item.id
      })
      this.downParams.ids = arr
      this.exportLoanIds.ids = arr
      // this.exportLoanIds = this.listQuery
      this.exportIds = arr
    },
    getTableData(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      selectCreditApproveList(this.listQuery).then(res => {
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
      this.$refs['resetForm'].resetFields()
      this.getTableData('query')
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
