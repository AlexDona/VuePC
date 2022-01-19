<template>
  <div class="container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custBaseType">
            <el-select v-model="listQuery.custBaseType" style="width:100%" clearable placeholder="基本类型">
              <el-option
                v-for="item in propertyBaseList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="contactsPersonName">
            <el-input v-model.trim="listQuery.contactsPersonName" class="selectWidth" placeholder="经办人姓名" clearable />
          </el-form-item>
        </el-col>
        <template v-if="activeName === '1'">
          <el-col :sm="4" :xs="4">
            <el-form-item prop="custStatus">
              <el-select
                v-model="listQuery.custStatus"
                style="width:100%"
                clearable
                placeholder="建档状态"
              >
                <el-option
                  v-for="item in custStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <el-col :sm="8" :xs="8">
          <el-form-item>
            <el-button type="primary" @click="getTableData('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :params="listQuery"
              :download-url="
                `/customer/cust/apply/list/export`
              "
              method-type="post"
            />
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
      <el-table-column label="客户编号" prop="custNo" min-width="180" />
      <el-table-column label="客户名称" show-overflow-tooltip min-width="240" prop="custName" />
      <el-table-column label="基本类型" prop="custBaseType" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.custBaseType === 1">企业客户</span>
          <span v-if="scope.row.custBaseType === 2">个人客户</span>
          <span v-if="scope.row.custBaseType === 3">个体户</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人姓名" prop="contactsPersonName" min-width="80" show-overflow-tooltip />
      <el-table-column label="经办人手机号码" prop="contactsPersonMobile" min-width="100" />
      <template v-if="activeName === '0'">
        <el-table-column label="申请时间" prop="applyTime" min-width="140" show-overflow-tooltip />
      </template>
      <template v-else>
        <el-table-column label="建档状态" prop="custStatus" :formatter="custStatusFormat" min-width="100" show-overflow-tooltip />
        <el-table-column label="审批时间" prop="approveTime" min-width="140" show-overflow-tooltip />
      </template>
      <el-table-column label="操作" prop="action" align="center" fixed="right" min-width="130">
        <template slot-scope="{ row }">
          <template v-if=" activeName === '0'">
            <template v-if="!row.handlerUserId">
              <el-button v-preventReClick type="text" @click="operator('receive',row)">领取</el-button>
            </template>
            <template v-else>
              <template v-if="row.handlerUserId !== userInfo.userId">
                <el-button type="text" @click="operator('preview',row)">查看</el-button>
              </template>
              <template v-else>
                <el-button type="text" @click="operator('dealt',row)">处理</el-button>
                <el-button v-preventReClick type="text" @click="operator('back',row)">退领</el-button>
              </template>
            </template>
          </template>
          <template v-else>
            <el-button type="text" @click="operator('preview',row)">查看</el-button>
          </template>
        </template>
      </el-table-column>

    </el-table>
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
import { getApplyList, getReceiveOrBack } from '@/api/customer'
import { curHeight } from '@/mixins/requestCurHeight'
import { getUserInfo } from '@/utils/auth'
export default {
  name: '',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  filters: {
  },
  mixins: [curHeight],
  props: {
    activeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      customerData: [],
      userInfo: getUserInfo(),
      listQuery: {
        custName: '',
        custBaseType: '',
        contactsPersonName: '',
        parentCustName: '',
        listType: Number(this.activeName),
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      propertyClientList: [],
      propertyBaseList: [
        {
          label: '企业客户',
          value: 1
        },
        {
          label: '个人客户',
          value: 2
        },
        {
          label: '个体户',
          value: 3
        }
      ],
      productData: [],
      productNameList: [],
      custStatusList: [
        { value: 1, label: '已建档' },
        { value: 2, label: '已拒绝' },
        { value: 4, label: '已修改' },
        { value: 6, label: '补充资料' },
        { value: 7, label: '修改已拒绝' },
        { value: 8, label: '修改待补充' }
      ], // 建档状态
      customerTypeList: [], // 客户类型
      cooperationTime: [], // 合作时长
      total: 0,
      curTitleMap: { // tabName
        preview: '审批查看',
        dealt: '审批处理'
      }
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
      getApplyList(this.listQuery).then(res => {
        // console.log(res, 'res')
        if (res.code === '0') {
          this.customerData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 处理数据
    custStatusFormat(row) {
      switch (row.custStatus) {
        case 1: return '已建档'
        case 2: return '已拒绝'
        case 4: return '已修改'
        case 6: return '补充资料'
        case 7: return '修改已拒绝'
        case 8: return '修改待补充'
      }
    },
    // 提交新增、编辑
    recordSaveAndEdit(visible) {
      this.dialogVisible = !this.dialogVisible
    },
    // 操作
    operator(pageMode, row) {
      if (pageMode === 'receive' || pageMode === 'back') {
        // 领取、退领
        this.getReceiveOrBack(row.id, pageMode)
      } else {
        // 处理、查看
        this.$router.push({
          path: '/CustomerManagement/commonCustomer',
          query: {
            pageMode,
            custBaseType: row && row.custBaseType, // 基本类型
            custId: row && row.id,
            // custBaseType: row && row.custBaseType, // 基本类型
            custStatus: row && row.custStatus, // 建档状态
            changeTitle: true, // 打开修改tabs名称的开关
            curTitle: this.curTitleMap[pageMode],
            flag: 'approve'
          }
        })
      }
    },
    // 领取、退领
    getReceiveOrBack(customerId, mode) {
      getReceiveOrBack(customerId, mode).then(res => {
        if (res.code === '0') {
          this.$message.success(res.msg)
          this.getTableData()
        } else {
          this.$message.error(res.msg)
        }
      })
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
    },
    // 关闭弹窗
    cancel() {
      this.dialogVisible = false
    }
  }
  // watch: {
  //   pageParams: {
  //     handle(newVal, oldVal) {
  //       console.log(newVal, oldVal, 'oldValue')
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.addCustomer {
  padding-bottom: 20px;
}
</style>
