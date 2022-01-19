<template>
  <!-- 客户层级管理 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="coreCustomerName">
            <el-input v-model.trim="listQuery.coreCustomerName" class="selectWidth" placeholder="核心企业" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="customerName">
            <el-input v-model.trim="listQuery.customerName" class="selectWidth" placeholder="产业公司" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="parentCustomerName">
            <el-input v-model.trim="listQuery.parentCustomerName" class="selectWidth" placeholder="上级公司" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="8" :xs="8">
          <el-form-item>
            <el-button type="primary" @click="getTableData('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :params="listQuery"
              :download-url="
                `/customer/customerRelation/exporList`
              "
              method-type="post"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="addCustomer">
      <el-button type="primary" @click="importOriginaLabel">导入组织层级</el-button>
    </div>
    <el-table
      :data="customerData"
      stripe
      border
      :max-height="curHeight"
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="核心企业" prop="coreCustomerName" />
      <el-table-column label="产业公司" show-overflow-tooltip prop="customerName" />
      <el-table-column label="上级公司" prop="parentCustomerName" show-overflow-tooltip />
    </el-table>
    <!-- 维护 -->
    <batch-import
      title="导入组织层级"
      :download-url="downloadUrl"
      :upload-url="uploadUrl"
      :dialog-visible="dialogVisible"
      @success="uploadSuccess"
      @cancel="cancel"
    />
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getTableData"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { customerRelationList } from '@/api/customer'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: '',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination,
    batchImport: resolve => require(['@/views/components/batch-import'], resolve)
  },
  filters: {
  },
  mixins: [curHeight],
  data() {
    return {
      pickerOptions: {
      // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      customerData: [],
      downloadUrl: '/customer/customerRelation/export',
      uploadUrl: '/api/customer/customerRelation/upload',
      listQuery: {
        coreCustomerName: '',
        customerName: '',
        parentCustomerName: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      total: 0,
      dialogVisible: false
    }
  },
  created() {
    // 获取数据
    this.getTableData()
  },
  methods: {

    // 获取数据
    getTableData(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      customerRelationList(this.listQuery).then(res => {
      // console.log(res, 'res')
        if (res.code === '0') {
          this.customerData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 导入组织层级
    importOriginaLabel() {
      this.dialogVisible = true
    },
    cancel() {
      this.dialogVisible = false
    },
    uploadSuccess() {
      this.dialogVisible = false
      this.getTableData()
    },
    // 重置
    resetForm() {
      this.listQuery.custName = ''
      this.listQuery.custType = ''
      this.listQuery.custTypeId = ''
      this.listQuery.pageParam.pageIndex = 1
      this.cooperationTime = ['', '']
      this.$refs['resetForm'].resetFields()
      this.getTableData('query')
    }
  }
}
</script>
<style lang="scss" scoped>
.addCustomer {
padding-bottom: 20px;
}
</style>

