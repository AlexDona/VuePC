<template>
  <!-- 建档维护、建档查询列表-->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model="listQuery.custName" clearable placeholder="企业名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custTypeId">
            <el-select v-model="listQuery.custTypeId" style="width:100%" clearable placeholder="企业类型">
              <el-option
                v-for="item in custTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="contactsPersonName">
            <el-input v-model="listQuery.contactsPersonName" clearable placeholder="经办人" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="createUser">
            <el-input v-model="listQuery.createUser" clearable placeholder="建档人" />
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getRecordList('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              v-if="currentPage=== 'preview'"
              btn-name="下载"
              :params="listQuery"
              :download-url="
                `/customer/customer/bookbuilding/exporList`
              "
              method-type="post"
              file-name="建档列表"
            />

          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="currentPage=== 'maintain'">
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="showDialog('add')">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
      <el-table-column label="企业编号" prop="custNo" min-width="280px;" />
      <el-table-column label="企业类型" prop="custTypeId" :formatter="formatterCustType" min-width="160px;" />
      <el-table-column label="企业名称" show-overflow-tooltip prop="custName" min-width="280px;" />
      <el-table-column label="经办人姓名" prop="contactsPersonName" min-width="160px;" />
      <el-table-column label="经办人手机号" prop="contactsPersonMobile" min-width="160px;" />
      <el-table-column label="经办人邮箱" prop="contactsPersonEmail" min-width="240px;" />
      <el-table-column label="建档人" prop="createUser" min-width="160px;" />
      <el-table-column label="建档时间" prop="buildTime" min-width="240px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <div v-if="currentPage=== 'maintain' && scope.row.status === 0">
            <!-- 平台端才展示停用，同时对平台端和核心企业端单行数据不可停用 -->
            <template v-if="userInfo.custTypeId === 1 && scope.row.custTypeId !== 1 && scope.row.custTypeId !== 2 && scope.row.buildTime">
              <el-button type="text" @click="disableClick('stop',scope.row)">停用</el-button>
            </template>
            <el-button type="text" @click="showDialog('maintain',scope.row)">
              <span v-if="scope.row.custStatus === 0">建档</span>
              <span v-if="scope.row.custStatus === 1">维护</span>
            </el-button>
          </div>
          <div v-else>
            <el-button v-if="currentPage !== 'preview'" type="text" @click="disableClick('begin',scope.row)">启用</el-button>
          </div>
          <div v-if="currentPage=== 'preview'">
            <el-button type="text" @click="showDialog('preview',scope.row)">查看</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getRecordList()"
    />
    <!-- 维护 -->
    <el-dialog
      v-if="dialogVisible && currentPage === 'maintain'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="title"
      class="dialogStyle"
    >
      <customerMaintain
        ref="assetConfirm"
        :dialog-mode="dialogMode"
        :visible="dialogVisible"
        :customer-form="custRowData"
        :cust-type-list="custTypeList"
        @submit="recordSaveAndEdit"
        @cancel="cancel"
      />
    </el-dialog>

  </div>
</template>

<script>
import { recordList, recordSaveAndEdit, customerTypeList, recordDisable, recordUnDisable } from '@/api/record'
import Pagination from '@/components/Pagination'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: 'BuildRecordMaintain',
  components: {
    customerMaintain: resolve => require(['./components/form-operation'], resolve),
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  props: {
    currentPage: {
      type: String,
      default: 'maintain'
    }
  },
  data() {
    return {
      listQuery: {
        contactsPersonName: '', //	经办人姓名
        createUser: '', //	建档人姓名
        custName: '', //	企业名称
        custTypeId: '', //	企业类型(下拉通过接口获取)
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      custTypeList: [], // 企业类型
      title: '',
      total: 0,
      userInfo: getUserInfo(),
      activeName: 'companyDetail', // 默认企业详情
      dialogMode: '',
      custRowData: {},
      customerData: [],
      dialogVisible: false
    }
  },
  created() {
    // 获取数据
    this.getRecordList()
    // 获取企业类型
    this.getCustomerTypeList()
  },
  methods: {
    // 获取数据
    getRecordList(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      recordList(this.listQuery).then(res => {
        if (res.code === '0') {
          this.customerData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取企业类型
    getCustomerTypeList() {
      const params = { type: 1 }
      customerTypeList(params).then(res => {
        if (res.code === '0') {
          this.custTypeList = res.data.filter(item => item.type === 1)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交新增、编辑
    recordSaveAndEdit(data) {
      recordSaveAndEdit(data).then(res => {
        if (res.code === '0') {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.getRecordList('query')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 映射数据
    formatterCustType(row) {
      return this.custTypeList.map(item => {
        return item.id === row.custTypeId ? item.name : ''
      })
    },
    // 禁用
    disableClick(type, row) {
      const params = {
        id: row.id
      }
      if (type === 'stop') {
        this.$confirm('请确认是否停用该笔数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          recordDisable(params).then(res => {
            if (res.code === '0') {
              this.$message.success('操作成功')
              this.getRecordList('query')
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {})
      } else {
        recordUnDisable(params).then(res => {
          if (res.code === '0') {
            this.$message.success('操作成功')
            this.getRecordList('query')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 切换tab
    handleClick() {

    },
    // 维护、维护
    showDialog(type, row) {
      if (type === 'add') {
        this.title = '新增'
        this.custRowData = {
          custTypeId: 4 // 只能新增资金方类型
        }
      } else if (type === 'maintain') {
        this.title = '维护'
        this.custRowData = JSON.parse(JSON.stringify(row))
      } else {
        this.$router.push({
          path: '/BuildManagement/buildRecordPreview'
        })
        localStorage.setItem('buildPreviewViewRow', JSON.stringify(row))
      }

      this.dialogMode = type
      this.dialogVisible = true
    },
    // 重置
    resetForm() {
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getRecordList()
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
</style>
