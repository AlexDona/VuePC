<template>
  <!-- 白名单管理 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="distributorName">
            <el-input v-model.trim="listQuery.distributorName" class="selectWidth" placeholder="经销商名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="originCustomerName">
            <el-input v-model.trim="listQuery.originCustomerName" class="selectWidth" placeholder="所属公司" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isBuild">
            <el-select v-model="listQuery.isBuild" style="width:100%" clearable placeholder="是否已建档">
              <el-option
                v-for="item in buildList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
                `/customer/white-list/exportList`
              "
              method-type="post"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="addCustomer">
      <el-button type="primary" @click="importWhite">导入白名单</el-button>
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
      <el-table-column label="项目名称" prop="projectName" show-overflow-tooltip />
      <el-table-column label="核心企业" prop="coreCustomerName" show-overflow-tooltip />
      <el-table-column label="所属公司" prop="originCustomerName" show-overflow-tooltip />
      <el-table-column label="经销商名称" prop="customerName" show-overflow-tooltip />
      <el-table-column label="是否已建档" prop="isBuild" width="150px" :formatter="formatBuild" />
      <el-table-column label="操作" width="150px">
        <template slot-scope="{ row }">
          <el-button v-if="row.isBuild !== 1" type="text" @click="deleteWhite(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 维护 -->
    <batch-import
      title="导入白名单"
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
import { queryWhiteList, deleteWhiteList } from '@/api/customer'
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
      downloadUrl: '/customer/white-list/template',
      uploadUrl: '/api/customer/white-list/import',
      listQuery: {
        distributorCustId: '', //	经销商ID
        distributorName: '', //	经销商名称
        isBuild: '', //	是否建档 0-否 1-是
        originCustomerId: '', //	所属公司ID
        originCustomerName: '', //	所属公司名称
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      buildList: [
        { value: 1, label: '已建档' },
        { value: 0, label: '未建档' }
      ], // 是否已建档
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
      queryWhiteList(this.listQuery).then(res => {
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
    importWhite() {
      this.dialogVisible = true
    },
    // 映射
    formatBuild(row) {
      let isBuilds = ''
      row.isBuild === 1 ? isBuilds = '已建档' : row.isBuild === 0 ? isBuilds = '未建档' : isBuilds = ''
      return isBuilds
    },
    // 删除白名单
    deleteWhite(row) {
      this.$confirm('请确定是否删除该白名单记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWhiteList(row.id).then(res => {
          // console.log(res, 'res')
          if (res.code === '0') {
            this.$message.success(res.msg)
            this.getTableData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
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

