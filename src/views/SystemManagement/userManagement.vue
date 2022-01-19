<template>
  <div class="app-container">
    <div class="">
      <el-form ref="detailsForm" :model="listQuery" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item prop="idtName" width="150">
              <el-input v-model="listQuery.idtName" clearable placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="mobile" width="150">
              <el-input v-model="listQuery.mobile" clearable placeholder="手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="btnWidth">
              <el-button type="primary" @click="getQueryUserList('query')">查询</el-button>
              <el-button @click="resetForm()">重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-button type="primary" @click="showDialog('','create')"><i class="el-icon-plus" /> 新增</el-button>
            <!-- <el-button type="primary" @click="toAuthority"><i class="el-icon-plus" /> 权限管理</el-button> -->
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="userList"
        stripe
        border
        :max-height="curHeight"
        style="width: 100%;margin-top: 10px;"
        :header-cell-style="{
          background: '#eee',
          height: '55px',
          color: '#333',
          'text-align': 'center',
        }"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="序号" type="index" width="55" />
        <el-table-column prop="userNo" label="操作人编号" show-overflow-tooltip />
        <el-table-column prop="idtName" label="姓名" show-overflow-tooltip />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="status" :formatter="formatterStatus" label="状态" />
        <el-table-column prop="hasAuthority" :formatter="formatterAuthority" label="权限" />
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scoped">
            <el-button type="text" @click="showDialog(scoped.row,'update')">修改</el-button>
            <el-button type="text" @click="showDialog(scoped.row,'preview')">查看</el-button>
            <el-button v-if="scoped.row.status === '1'" type="text" @click="comfirmDelete(scoped.row)">删除</el-button>
            <!-- <el-button v-if="scoped.row.status === '0'" type="text" @click="sentResetPassword(scoped.row)">重新发送密码</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :limit.sync="listQuery.pageParam.pageSize" :page.sync="listQuery.pageParam.pageIndex" @pagination="getQueryUserList" />
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :close-on-click-modal="false" :lock-scroll="false" :title="textMap[titleMode]" width="40%" class="operationDialog" @close="cancel">
      <form-operation :pre-mode="titleMode" :user-operation-list="userListRow" :cancel="cancel" @operationData="getOperationData" />
    </el-dialog>
    <!-- 删除账号 -->
    <!-- <el-dialog :visible.sync="dialogDeleteVisible" :close-on-click-modal="false" width="480px" class="MaintainDialog" title="删除">
      <p>确认删除用户吗？</p>
      <div class="btnSubmit">
        <el-button
          type="danger"
          plain
          round
          size="mini"
          @click="comfirmDelete"
        >删除</el-button>
        <el-button
          round
          plain
          size="mini"
          @click="dialogDeleteVisible = false"
        >取消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { addUser, queryUserList, updateUser, deleteUser, resetPassword } from '@/api/user'
import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: '',
  components: {
    Pagination,
    formOperation: (resolve) => require(['./components/formOperation'], resolve)
  },
  mixins: [curHeight],
  data() {
    return {
      listQuery: {
        idtName: '',
        mobile: '',
        pageParam: { pageIndex: 1, pageSize: 15 }
      },
      dialogTableVisible: false,
      // dialogDeleteVisible: false,
      total: 0,
      // deleteId: '', // 删除用户id
      titleMode: '',
      userListRow: {
        userNo: '',
        loginName: '',
        idtName: '',
        idtNo: '',
        mobile: '',
        email: '',
        status: '',
        authorityCollection: ''
      },
      textMap: {
        // 弹窗名头
        create: '新增操作人',
        update: '修改操作人',
        preview: '操作人查看'
      },
      userList: []
    }
  },
  computed: {},
  created() {
    this.getQueryUserList()
  },
  methods: {
    getQueryUserList(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      queryUserList(this.listQuery).then((res) => {
        if (res.code === '0') {
          this.userList = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        this.$message.error(err.msg)
      })
    },
    // 添加权限
    // toAuthority() {
    //   this.$router.push('/SystemManagement/AuthorityManagement')
    // },
    // 新增/修改操作用户
    showDialog(row, mode) {
      this.titleMode = mode
      if (mode === 'create') {
        this.userListRow = {
          userNo: '',
          loginName: '',
          idtName: '',
          idtNo: '',
          mobile: '',
          email: '',
          status: '',
          authorityCollection: ''
        }
      }
      this.userListRow = JSON.parse(JSON.stringify(row)) || this.userListRow
      this.dialogTableVisible = true
    },
    // 处理状态
    formatterStatus(val) {
      return val.status === '0' ? '生效' : '冻结'
    },
    // 处理权限
    formatterAuthority(val) {
      return val.hasAuthority === true ? '已配置' : '未配置'
    },
    // 删除用户
    // deleteUser(row) {
    //   this.dialogDeleteVisible = true
    //   this.deleteId = row.userId
    // },
    // 提交删除
    comfirmDelete(row) {
      this.$confirm('删除将导致该合同信息及影像都从系统中清除，请确认是否删除。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser(row.userId).then(res => {
            if (res.code === '0') {
              this.$message.success('删除成功')
              this.getQueryUserList()
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            err.response && this.$message.error(err.response.data.msg)
          })
        })
        .catch(() => {})
    },
    getOperationData(row) {
      if (row.mode === 'create') {
        addUser(row.data).then(res => {
          if (res.code === '0') {
            this.cancel('success')
            this.$message.success('新增成功')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          err.response && this.$message.error(err.response.data.msg)
        })
      } else if (row.mode === 'update') {
        updateUser(row.data).then(res => {
          if (res.code === '0') {
            this.$message.success('修改成功')
            this.cancel('success')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          err.response && this.$message.error(err.response.data.msg)
        })
      }
    },
    // 重置用户密码
    sentResetPassword(row) {
      const data = { userId: Number(row.userId) }
      resetPassword(data).then((res) => {
        if (res.code === '0') {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        err.response && this.$message.error(err.response.data.msg)
      })
    },
    // 重置
    resetForm() {
      this.$refs['detailsForm'].resetFields()
      this.getQueryUserList()
    },
    cancel(type) {
      this.titleMode = ''
      this.userListRow = {
        userNo: '',
        loginName: '',
        idtName: '',
        idtNo: '',
        mobile: '',
        email: '',
        status: '',
        authorityCollection: ''
      }
      this.dialogTableVisible = false
      if (type === 'success') this.getQueryUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  padding: 20px;
  background-color: #fff;
}
::v-deep.operationDialog .el-dialog__body {
  padding: 0 !important;
}
::v-deep.operationDialog .el-dialog__header{
    border-bottom: 1px solid #000;
  }
.btnWidth{
    width: 100%;
    min-width: 150px;
  }
.MaintainDialog{
  ::v-deep.el-dialog__header{
    // padding: 30px;
    border-bottom: 1px solid #555;
  }
  p {
    text-align: center;
  }
}
::v-deep .el-table--medium td {
    padding: 4px 0 ;
}
.btnSubmit {
 padding-top: 20px;
 text-align: center;
 .el-button {
   width: 145px;
   height: 30px;
 }
}
</style>
