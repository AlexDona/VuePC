<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-select v-model="listQuery.industryName" style="width:100%" filterable clearable placeholder="产业公司名称">
              <el-option v-for="item in industryCompanyList" :key="item.customerId" :label="item.customerName" :value="item.customerName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.fundName" class="selectWidth" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="listQuery.productName" class="selectWidth" placeholder="金融产品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="approveState">
            <el-select v-model.trim="listQuery.approveState" placeholder="授信申请状态" style="width:100%" clearable>
              <el-option v-for="item in mapToList(statusMap)" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="applyDate">
            <el-date-picker
              v-model="applyDate"
              type="daterange"
              style="width:100%;"
              :unlink-panels="true"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="申请日期"
              end-placeholder="申请日期"
              @change="changeApplyDateRange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="approveDate">
            <el-date-picker
              v-model="approveDate"
              type="daterange"
              :unlink-panels="true"
              style="width:100%;"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="批复日期"
              end-placeholder="批复日期"
              @change="changeApproveDateRange"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-row>
            <el-col :sm="11" :xs="11">
              <el-form-item prop="creditApproveLimitMin">
                <el-input v-model.trim="listQuery.creditApproveLimitMin" ty style="width:100%;" placeholder="批复额度" clearable @input="listQuery.creditApproveLimitMin = lib.fixMoneyMinus(listQuery.creditApproveLimitMin)" />
              </el-form-item>
            </el-col>
            <el-col :sm="2" :xs="2" style="text-align: center">
              <el-form-item prop="creditApproveLimitMin">
                <span>至</span>
              </el-form-item>
            </el-col>
            <el-col :sm="11" :xs="11">
              <el-form-item prop="creditApproveLimitMax">
                <el-input v-model.trim="listQuery.creditApproveLimitMax" style="width:100%;" placeholder="批复额度" clearable @input="listQuery.creditApproveLimitMax = lib.fixMoneyMinus(listQuery.creditApproveLimitMax)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="acctState">
            <el-select v-model.trim="listQuery.acctState" placeholder="账号状态" style="width:100%" clearable>
              <el-option v-for="item in accountStatusArr" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="initEntities(listQuery, 'query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="mb10">
        <el-button type="primary" :disabled="checkedData.length === 0" @click="batchMaintain">批量维护</el-button>
        <!-- <el-button type="primary" @click="batchMaintain">批量维护</el-button> -->
      </div>
    </el-form>
    <el-table
      :data="entities"
      stripe
      border
      style="width: 100%;"
      :max-height="curHeight"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="180px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="productRateRegion" min-width="140px;" />
      <el-table-column label="期限区间（月）" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" show-overflow-tooltip prop="repaymentMethod" min-width="240px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="120px;" />
      <el-table-column label="授信申请状态" prop="approveState" min-width="120px;">
        <template slot-scope="scope">
          {{ statusMap[scope.row.approveState] }}
        </template>
      </el-table-column>

      <el-table-column label="批复日期" prop="approveDate" min-width="120px;" />
      <el-table-column label="批复额度（元）" align="right" prop="creditApproveLimit" min-width="120px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApproveLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" prop="acctState" min-width="120px;">
        <template slot-scope="scope">
          {{ accountStatusMap[scope.row.acctState] }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="用款申请" prop="approveState" min-width="120px;">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.isLoanApplyStatus === 1 ? '已提交' : '待提交' }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作人" prop="receiverName" min-width="120px;" />
      <el-table-column label="操作" prop="cust" min-width="220px;" align="center" fixed="right">
        <!--approveState 审批状态 0-待审批 1-审批通过 2-审批拒绝 3-审批退回（补充资料） 4-资金方审批|平台维护 6-结清    -->
        <!--acctState 账户状态：0-待维护，1-客户录入，2-已维护-->
        <template slot-scope="scope">
          <div v-if="scope.row.approveState !== 1">
            <!-- 操作领取后管理员可维护、退领 -->
            <template v-if="scope.row.receiverId === Number(userInfo.userId)">
              <el-button type="text" @click="() => entityUpdate(scope)">维护</el-button>
              <el-button type="text" @click="() => handleReturnReceive(scope)">退领</el-button>
            </template>
            <el-button v-if="!scope.row.receiverId && scope.row.approveState === 4" type="text" @click="() => handleReceive(scope)">领取</el-button>
            <el-button v-else type="text" @click="() => handleDetail(scope)">查看</el-button>
            <el-button v-if="scope.row.acctState !== 1 && [0, 3, 4].includes(scope.row.approveState)" type="text" @click="() => accountUpdate(scope)">账号维护</el-button>
          </div>
          <div>
            <template v-if="scope.row.approveState === 1">
              <el-button type="text" @click="() => handleSettle(scope)">结清</el-button>
              <el-button type="text" @click="() => handleDetail(scope)">查看</el-button>
            </template>
          </div>
          <!--          <div v-if="scope.row.approveState === 3">&lt;!&ndash;已通过&ndash;&gt;-->
          <!--            <template v-if="scope.row.acctState !== 1 && scope.row.isLoanApplyStatus !== 1">-->
          <!--              <el-button type="text" @click="() => accountUpdate(scope)">账号维护</el-button>-->
          <!--            </template>-->
          <!--            <el-button type="text" @click="() => handleDetail(scope)">查看</el-button>-->
          <!--            <el-button type="text" @click="() => handleSettle(scope)">结清</el-button>-->
          <!--          </div>-->
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="initEntities(listQuery)"
    />
    <!--  账号维护对话框  -->
    <account-update-dialog v-if="dialog.visible" :visible="dialog.visible" :select-row="selectRow" @closeDialog="closeDialog" />

    <batch-import
      :down-params="{ids: batchIdArr}"
      :dialog-visible="dialog.visibleBatchImport"
      :title="'批量导入'"
      :download-url="'/business/credit/exportCreditTemplate'"
      :download-file-name="'批量维护模板'"
      :upload-url="'/api/business/credit/exportCreditExcel'"
      @cancel="cancel"
      @success="uploadSuccess"
    />
  </div>
</template>
<script>

import { curHeight } from '@/mixins/requestCurHeight'
import Pagination from '@/components/Pagination'
import { getUserInfo } from '@/utils/auth'
import batchImport from '@/views/components/batch-import.vue'
import {
  getEntitiesList,
  postCreditMaintainReceive,
  postReturnReceive, postSettle
} from '@/api/CreditMgt/maintain.js'

// import { regionData } from 'element-china-area-data'
import AccountUpdateDialog from '@/views/CreditManagement/components/accountUpdateDialog'
import service from '@/utils/service'
import { mapToList } from '@/utils/service'
import { recordList } from '@/api/record'

export default {
  name: 'CreditMaintain',
  components: {
    batchImport,
    AccountUpdateDialog,
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      batchIdArr: [],
      // 审批状态 0-待审批 1-审批通过 2-审批拒绝 3-审批退回（补充资料） 4-资金方审批|平台维护 6-结清
      statusMap: {
        0: '待审批',
        1: '审批通过',
        2: '审批拒绝',
        3: '审批退回(补充资料)',
        4: '资金方审批|平台维护',
        6: '结清'
      },
      accountStatusMap: { 0: '待维护', 1: '客户录入', 2: '已维护' },
      selectRow: {},
      dialog: {
        visible: false,
        visibleBatchImport: false
      },
      props: { multiple: true },
      accountStatusArr: [
        { label: '待维护', value: 0 },
        { label: '客户录入', value: 1 },
        { label: '已维护', value: 2 }
      ],
      statusArr: [
        { label: '待提交', value: 0 },
        { label: '已提交', value: 1 }
      ],
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      userInfo: getUserInfo(),
      applyDate: ['', ''],
      approveDate: ['', ''],
      listQuery: {
        industryName: '',
        fundName: '',
        approveState: '',
        acctState: '',
        creditApproveLimitMin: '',
        creditApproveLimitMax: '',
        applyDateStart: '', // 申请时间起始日
        applyDateEnd: '', // 申请时间结束日
        approveDateeStart: '', // 	批复时间起始日
        approveDateEnd: '', // 批复时间结束日
        custName: '', // 客户
        productName: '', // 产品
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      entities: [],
      fundNameList: [],
      productNameList: [],
      productStatusList: [
        { value: 0, label: '暂存' },
        { value: 1, label: '生效' },
        { value: 2, label: '失效' }
      ],
      total: 0,
      industryCompanyList: [],
      mapToList,
      checkedData: []
    }
  },
  created() {
    // 获取数据
    this.reload()
    // console.log('ssq:', regionData)
  },
  methods: {
    batchMaintain() {
      const canMaintain = this.checkedData.some(res => {
        return res.receiverName && res.approveState === 2
      })
      if (!canMaintain) {
        this.$message.warning('未领取的数据及非资金方审批状态的数据不可进行批量维护')
      } else {
        this.batchIdArr = this.checkedData.map(item => item.id)
        this.dialog.visibleBatchImport = true
      }
    },
    changeApplyDateRange(range) {
      if (!range) {
        this.applyDate = ['', '']
        this.listQuery.applyDateStart = ''
        this.listQuery.applyDateEnd = ''
      } else {
        this.listQuery.applyDateStart = range[0]
        this.listQuery.applyDateEnd = range[1]
      }
    },
    changeApproveDateRange(range) {
      if (!range) {
        this.approveDate = ['', '']
        this.listQuery.approveDateeStart = ''
        this.listQuery.approveDateEnd = ''
      } else {
        this.listQuery.approveDateeStart = range[0]
        this.listQuery.approveDateEnd = range[1]
      }
    },
    handleSettle(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      this.$confirm('结清后,可再次对该笔产品申请授信,请确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postSettle(params).then(res => {
          service.handleResponse(res, () => this.initEntities(this.listQuery), '已结清')
        }).catch((error) => {
          this.$message.error(error.response.data.msg)
        })
      }).catch(() => {})
    },
    handleSelectionChange(val) {
      this.checkedData = [...val]
      // this.batchIdArr = val.map(item => item.id)
    },
    cancel() {
      this.dialog.visibleBatchImport = false
    },
    uploadSuccess() {
      this.dialog.visibleBatchImport = false
      this.initEntities(this.listQuery)
    },
    handleReturnReceive(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postReturnReceive(params).then(res => {
        service.handleResponse(res, '', '退领成功')
        // 请求成功和请求失败都要刷新数据
        this.initEntities(this.listQuery)
      })
    },
    handleReceive(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postCreditMaintainReceive(params).then(res => {
        // service.handel
        service.handleResponse(res, '', '领取成功')
        // 请求成功和请求失败都要刷新数据
        this.initEntities(this.listQuery)
      })
    },
    accountUpdate(scope) {
      this.selectRow = scope.row
      this.dialog.visible = true
    },
    handleDetail(scope) {
      this.$router.push({ path: '/CreditManagement/creditMaintain-detail', query: { creditNo: scope.row.creditNo, acctState: scope.row.acctState }})
    },
    entityUpdate(scope) {
      // this.dialog.editVisible = true
      this.$router.push({ path: '/CreditManagement/creditMaintain-update', query: { creditNo: scope.row.creditNo }})
      this.selectRow = scope.row
    },
    reload() {
      this.initEntities(this.listQuery)
      // getIndustryCompanyList({}).then(res => {
      //   const { data } = res
      //   this.industryCompanyList = data.list || []
      //   this.industryCompanyList.forEach(item => {
      //     item.label = item.custName
      //     item.value = item.id
      //   })
      // })
      recordList({
        custTypeId: 3
      }).then(res => {
        if (res.code === '0') {
          this.industryCompanyList = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    initEntities(params, type) { // 初始化实体数据
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      getEntitiesList(params).then(res => {
        const { data } = res
        const { list, total } = data
        this.entities = list
        this.total = total
      })
    },

    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.listQuery.pageParam.pageIndex = 1
      this.listQuery.applyDateStart = ''
      this.listQuery.applyDateEnd = ''
      this.listQuery.approveDateeStart = ''
      this.listQuery.approveDateEnd = ''
      this.applyDate = ['', '']
      this.approveDate = ['', '']
      this.listQuery.creditApproveLimitMin = ''
      this.listQuery.creditApproveLimitMax = ''
      this.initEntities(this.listQuery)
    },
    // 关闭弹窗
    closeDialog(data) {
      this.dialog.visible = false
      data === 'sucess' && this.reload()
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

.container {
  padding: 24px;
  .productTerm {
    .el-form-item__content {
      min-width: 238px;
      .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
