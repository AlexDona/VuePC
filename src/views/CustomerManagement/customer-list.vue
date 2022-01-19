<template>
  <!-- 客户列表 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model="listQuery.custName" clearable placeholder="客户名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custTypeId">
            <el-select v-model="listQuery.custTypeId" style="width:100%" clearable placeholder="客户类型">
              <el-option
                v-for="item in customerTypeIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="3" :xs="3">
          <el-form-item prop="custType">
            <el-select v-model="listQuery.custType" style="width:100%" clearable placeholder="基本分类">
              <el-option
                v-for="item in customerTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="contactsPersonName">
            <el-input v-model="listQuery.contactsPersonName" clearable placeholder="经办人姓名" />
          </el-form-item>
        </el-col>
        <el-col :sm="3" :xs="3">
          <el-form-item prop="custStatus">
            <el-select v-model="listQuery.custStatus" style="width:100%" clearable placeholder="建档状态">
              <el-option
                v-for="item in custStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!--        <el-col v-if="userInfo.custTypeId !== 4 && userInfo.custTypeId !== 3" :sm="4" :xs="4">-->
        <!--          <el-form-item prop="parentCustName">-->
        <!--            <el-input v-model="listQuery.parentCustName" clearable placeholder="一级产业公司" />-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getCustProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :params="listQuery"
              :download-url="
                `/customer/cust/exportCustomerList`
              "
              method-type="post"
              file-name="客户列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="productData"
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
      <el-table-column label="客户编号" prop="custNo" min-width="150px;" show-overflow-tooltip />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="150px;" />
      <el-table-column label="基本分类" prop="custTypeCN" min-width="150px;">
        <!-- <template slot-scope="{ row }">
          {{ row.custType === 1 ? '企业客户' : row.custType === 2 ? '个体客户' : '' }}
        </template> -->
      </el-table-column>
      <el-table-column label="客户类型" prop="custTypeIdCN" min-width="100px;" />
      <el-table-column label="统一社会信用代码" prop="businessCode" min-width="200px;" />
      <el-table-column label="身份证号码" prop="personIdtNo" min-width="200px;" />
      <el-table-column label="经办人姓名" prop="contactsPersonName" min-width="100px;" show-overflow-tooltip />
      <el-table-column label="经办人手机号码" prop="contactsPersonMobile" min-width="150px;" />
      <!-- <el-table-column label="经办人邮箱" prop="contactsPersonEmail" min-width="150px;" show-overflow-tooltip /> -->
      <!--<el-table-column label="起始合作时间" prop="cooperationTime" min-width="160px;" />
      <el-table-column label="合作时长（月）" prop="cooperationMonthNum" min-width="120px;" />
      &lt;!&ndash; 资金方端查看不展示资金方名称 &ndash;&gt;
      <el-table-column v-if="userInfo.custTypeId !== 4 && userInfo.custTypeId !== 3" label="一级产业公司" show-overflow-tooltip prop="parentCustName" min-width="180px;" />-->
      <el-table-column label="建档状态" prop="custStatusCN" min-width="100px;">
        <!--  <template slot-scope="{ row }">
          {{ row.custStatus === 0 ? '未建档' : row.custStatus === 1 ? '已建档' : '' }}
        </template> -->
      </el-table-column>
      <el-table-column label="建档时间" prop="buildTime" min-width="160px;" />
      <el-table-column label="收款账户开户行" prop="bankName" min-width="150px;" show-overflow-tooltip />
      <el-table-column label="收款账号" prop="bankAccount" min-width="150px;" show-overflow-tooltip />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="viewProduct(scope.row)">查看</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getCustProds()"
    />
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'
import { queryListPage } from '@/api/finance'
import { getListByCustList } from '@/api/customer'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: 'CustomerList',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  props: {
  },
  data() {
    return {
      listQuery: {
        custName: '',
        custType: '',
        custTypeId: '',
        custStatus: '',
        contactsPersonName: '',
        parentCustName: '',
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      userInfo: {},
      productData: [],
      customerTypeList: [
        { value: 1, label: '企业客户' },
        { value: 2, label: '个人客户' },
        { value: 3, label: '个体户' }
      ],
      custStatusList: [
        { value: 0, label: '待建档' },
        { value: 1, label: '已建档' },
        { value: 2, label: '已拒绝' },
        { value: 3, label: '修改待审批' },
        { value: 4, label: '已修改' },
        { value: 5, label: '待审批' },
        { value: 6, label: '补充资料' },
        { value: 7, label: '修改已拒绝' },
        { value: 8, label: '修改待补充' }
      ], // 建档状态
      customerTypeIdList: [],
      total: 0
    }
  },
  created() {
    // 获取数据
    this.getCustProds()
    this.userInfo = getUserInfo()
    this.getPropertyClientList()
  },
  methods: {
    // 获取数据
    getCustProds(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      queryListPage(this.listQuery).then(res => {
        if (res.code === '0') {
          this.productData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getPropertyClientList() {
      getListByCustList().then(res => {
        if (res.code === '0') {
          this.customerTypeIdList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交新增、编辑
    recordSaveAndEdit(data) {

    },
    formatter(row) {
      if (row.custTypeId === 1) {
        return '平台'
      }
      if (row.custTypeId === 6) {
        return '核心企业'
      }
      if (row.custTypeId === 3) {
        return '产业公司'
      }
      if (row.custTypeId === 4) {
        return '资金方'
      }
      if (row.custTypeId === 5) {
        return '经销商'
      }
      if (row.custTypeId === 6) {
        return '零售商'
      }
      if (row.custTypeId === 7) {
        return '种植户'
      }
    },
    // 禁用
    disableClick(row) {

    },
    // 查看
    viewProduct(row) {
      this.$router.push({
        path: '/CustomerManagement/commonCustomer',
        query: {
          custId: row.id,
          pageMode: 'preview',
          flag: 'customerList',
          changeTitle: true, // 打开修改tabs名称的开关
          curTitle: '客户查看'
        }
      })
    },
    // 重置
    resetForm() {
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getCustProds()
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
