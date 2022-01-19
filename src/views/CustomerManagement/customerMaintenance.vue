<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custTypeId">
            <el-select v-model="listQuery.custTypeId" style="width:100%" clearable placeholder="客户类型">
              <el-option
                v-for="item in customerTypeList"
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
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getTableData('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :params="listQuery"
              :download-url="
                `/customer/cust/export`
              "
              method-type="post"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="addCustomer">
      <el-button type="primary" @click="toCustomer('add')">新增</el-button>
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
      <el-table-column label="客户编号" prop="custNo" min-width="180" show-overflow-tooltip />
      <el-table-column label="客户名称" prop="custName" min-width="240" show-overflow-tooltip />
      <el-table-column label="客户类型" prop="custTypeIdCN" min-width="100">
        <!--  <template slot-scope="scope">
          <span>{{ scope.row.custTypeId | getCustTypeId }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="基本分类" prop="custType" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.custType === 1">企业客户</span>
          <span v-if="scope.row.custType === 2">个人客户</span>
          <span v-if="scope.row.custType === 3">个体户</span>
        </template>
      </el-table-column>
      <el-table-column label="统一社会信用代码" prop="businessCode" min-width="240" show-overflow-tooltip />
      <el-table-column label="身份证号码" prop="personIdtNo" min-width="240" show-overflow-tooltip />
      <el-table-column label="经办人姓名" prop="contactsPersonName" min-width="240" show-overflow-tooltip />
      <el-table-column label="经办人手机号码" prop="contactsPersonMobile" min-width="130" />
      <el-table-column label="建档状态" prop="custStatusCN" min-width="150" show-overflow-tooltip />
      <el-table-column label="建档时间" prop="buildTime" min-width="150" show-overflow-tooltip />
      <!-- 资金方端查看不展示资金方名称 -->
      <!-- <el-table-column v-if="userInfo.custTypeId !== 4 && userInfo.custTypeId !== 3" label="一级产业公司" prop="parentCustName" show-overflow-tooltip min-width="240" />
      <el-table-column label="起始合作时间" prop="cooperationTime" min-width="130" />-->
      <el-table-column label="操作" prop="action" align="center" fixed="right" min-width="130">
        <template slot-scope="scope">
          <!-- 待建档且不是经销商 ==> 建档 -->
          <template v-if="scope.row.custStatus === 0 && scope.row.custTypeId !== 5">
            <el-button type="text" @click="toCustomer('build', scope.row)">建档</el-button>
          </template>
          <template v-else>
            <!-- 已建档和已修改 ==> 维护 -->
            <template v-if="scope.row.custStatus === 1 || scope.row.custStatus === 4">
              <el-button type="text" @click="toCustomer('maintain', scope.row)">维护</el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="toCustomer('preview',scope.row)">查看</el-button>
            </template>
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
      @pagination="handlePage"
    />

    <!-- 维护 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="维护"
      class="dialogStyle"
    >
      <maintenance-dialog
        ref="assetConfirm"
        :visible="dialogVisible"
        :form-data="dialogData"
        @handleTalbeData="getTableData"
        @handleSubmit="recordSaveAndEdit"
        @cancel="cancel"
      />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { queryPage, getListByCustList } from '@/api/customer'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: '',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  filters: {
    getCustTypeId(val) {
      // 客户类型 1-平台 2-核心企业 3-产业公司 4-资金方 5-经销商 6-零售商 7-种植户
      // console.log(val, 'getCustTypeId')
      switch (val) {
        case 1: return '平台'
        case 2: return '核心企业'
        case 3: return '产业公司'
        case 4: return '资金方'
        case 5: return '经销商'
        case 6: return '零售商'
        case 7: return '种植户'
      }
    }
  },
  mixins: [curHeight],
  data() {
    return {
      customerData: [],
      dialogData: {},
      listQuery: {
        custName: '',
        custType: '',
        custTypeId: '',
        custStatus: '',
        contactsPersonName: '',
        parentCustName: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
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
      customerTypeList: [], // 客户类型
      cooperationTime: [], // 合作时长
      total: 0,
      curTitleMap: {
        add: '客户新增',
        preview: '客户查看',
        build: '客户建档',
        maintain: '客户维护'
      }, // tab名称
      dialogVisible: false
    }
  },
  created() {
    // 获取数据
    this.getTableData()
    // 获取客户类型
    this.getListByCustList()
  },
  methods: {
    // 获取客户类型
    getListByCustList() {
      getListByCustList().then(res => {
        if (res.code === '0') {
          this.customerTypeList = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    handlePage(page) {
      this.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    // 获取数据
    getTableData(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      queryPage(this.listQuery).then(res => {
        // console.log(res, 'res')
        if (res.code === '0') {
          this.customerData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交新增、编辑
    recordSaveAndEdit(visible) {
      this.dialogVisible = !this.dialogVisible
    },
    // 新增客户
    toCustomer(pageMode, row) {
      this.$router.push({
        path: '/CustomerManagement/commonCustomer',
        query: {
          pageMode,
          custId: row && row.id,
          changeTitle: true, // 打开修改tabs名称的开关
          curTitle: this.curTitleMap[pageMode]
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
.app-container {
  padding: 24px 22px;
  background: #fff;
  .productTerm {
    .el-form-item__content {
      min-width: 238px;
      .el-input__inner {
        width: 100%;
      }
    }
  }
}
.addCustomer {
  padding-bottom: 20px;
}
</style>
