<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery" label-position="left">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="flowName" width="150">
            <el-input v-model="listQuery.flowName" type="text" clearable placeholder="流程名称" maxlength="15" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div class="btnWidth">
            <el-button type="primary" @click="getQueryList('query')">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button type="primary" @click="handleCreate"><i class="el-icon-plus" /> 新增</el-button>
          <!-- <el-button type="primary" @click="toAuthority"><i class="el-icon-plus" /> 权限管理</el-button> -->
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="table"
      class="mt24"
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
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="流程编号" show-overflow-tooltip prop="flowNo" min-width="240px;" />
      <el-table-column label="流程类型" show-overflow-tooltip prop="flowType" min-width="160px;">
        <template slot-scope="scoped">
          <span v-if="scoped.row.flowType === 1">授信申请审批</span>
          <span v-if="scoped.row.flowType === 2">用款申请审批</span>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" show-overflow-tooltip prop="flowName" min-width="150px;" />
      <el-table-column label="是否应用" show-overflow-tooltip prop="apply" min-width="120px;">
        <template slot-scope="scoped">
          <span v-if="scoped.row.apply === 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" show-overflow-tooltip prop="updateTime" min-width="160px;" />
      <el-table-column label="更新人" show-overflow-tooltip prop="updateUser" min-width="120px;" />
      <el-table-column :key="Math.random()" label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scoped">
          <el-button type="text" @click="handleOperation('check',scoped.row)">查看</el-button>
          <el-button v-if="scoped.row.isInit === 0" type="text" @click="handleOperation('modify',scoped.row)">修改</el-button>
          <el-button v-if="scoped.row.apply === 0 && scoped.row.isInit === 0" type="text" @click="handleOperation('delete',scoped.row)">删除</el-button>
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
import { queryByPage, deleteFlowById } from '@/api/WorkflowConfig'

export default {
  name: 'WorkflowConfig',
  components: { Pagination },
  mixins: [curHeight],
  data() {
    return {
      listQuery: {
        flowName: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      total: 0,
      tableData: []
    }
  },
  created() {
    this.getQueryList()
  },
  methods: {
    async getQueryList() {
      const res = await queryByPage({
        apply: 0, // 是否应用 0-不应用 1-应用 （客户端查应用状态的数据，其他根据条件选择）
        flowName: this.listQuery.flowName, // 流程名称
        flowType: 0, // 流程类型：1授信申请审批、2用款申请审批
        pageParam: this.listQuery.pageParam
      })
      if (res.code === '0') {
        this.tableData = res.data.list || []
        this.total = res.data.total

        console.log(res)
      } else {
        this.$message.warning(res.msg)
      }
    },
    // 重置
    resetForm() {
      this.listQuery.pageParam.pageSize = 15
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getQueryList()
    },
    async handleOperation(operaType, rowData) {
      if (operaType === 'check') {
        this.$router.push({
          path: '/SystemManagement/WorkflowConfigView',
          query: {
            id: rowData.id
          }
        })
      } else if (operaType === 'modify') {
        this.$router.push({
          path: '/SystemManagement/WorkflowConfigAdd',
          query: {
            changeTitle: true,
            curTitle: '修改流程配置',
            id: rowData.id,
            pageType: 'modify'
          }
        })
      } else {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await deleteFlowById({
            id: rowData.id
          })
          if (res.code === '0') {
            this.$message.success(res.data.data || '删除成功')
            await this.getQueryList()
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(() => {})
      }
    },
    handleCreate() {
      this.$router.push({
        path: '/SystemManagement/WorkflowConfigAdd',
        query: {
          changeTitle: true,
          curTitle: '新增流程配置'
        }
      })
    },
    handlePage(page) {
      console.log(this.listQuery.pageParam)
      this.listQuery.pageParam.pageSize = page.limit
      this.getQueryList()
      // console.log(page)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
