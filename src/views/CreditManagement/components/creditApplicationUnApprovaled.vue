<template>
  <div class="container">
    <el-form ref="resetForm" :model="reloadParams">
      <el-row type="flex" style="gap: 24px">
        <el-col v-if="userInfo.custTypeId !==3" :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-select v-model="reloadParams.industryName" style="width:100%" clearable filterable placeholder="产业公司名称">
              <el-option v-for="item in industryCompanyList" :key="item.customerId" :label="item.customerName" :value="item.customerName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="reloadParams.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="reloadParams.fundName" class="selectWidth" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="reloadParams.productName" class="selectWidth" placeholder="金融产品名称" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :sm="4" :xs="4">
          <el-form-item prop="approveState">
            <el-select v-model.trim="reloadParams.isHandled" style="width: 100%" placeholder="审批状态">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :sm="4" :xs="4">
          <el-form-item prop="applyDate">
            <el-date-picker
              v-model="dateRange"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              start-placeholder="申请日期"
              end-placeholder="申请日期"
              @change="changeDateRange"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="initEntities(reloadParams)">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" />

    </el-form>

    <el-table
      :data="entities"
      stripe
      border
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="200px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="120px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="120px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="160px;" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="productRateRegion" min-width="140px;" />
      <el-table-column label="期限区间（月）" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" prop="repaymentMethod" show-overflow-tooltip min-width="180px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="120px;" />
      <el-table-column v-if="userInfo.custTypeId !==3" label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="120px;" />
      <el-table-column label="操作人" prop="receiverName" min-width="120px;" />
      <el-table-column label="操作" prop="cust" min-width="220px;" align="center" fixed="right">
        <template slot-scope="scope">
          <div v-if="reloadParams.isHandled === 0">
            <span v-if="!scope.row.receiverName">
              <el-button type="text" @click="handleReceive(scope)">领取</el-button>
            </span>
            <span v-else>
              <el-button type="text" @click="() => entityUpdate(scope)">处理</el-button>
              <el-button type="text" @click="() => handleReturnReceive(scope)">退领</el-button>
            </span>

          </div>
          <div v-if="reloadParams.isHandled === 1">
            <el-button type="text" @click="() => handleDetail(scope)">查看</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageParams.pageSize"
      :page.sync="pageParams.pageIndex"
      @pagination="initEntities()"
    />
    <!--  账号维护对话框  -->
    <account-update-dialog v-if="dialog.visible" :visible="dialog.visible" :select-row="selectRow" @closeDialog="closeDialog" />

    <!--    <batch-import
      :down-params="{ids: batchIdArr}"
      :dialog-visible="dialog.visibleBatchImport"
      :title="'批量导入'"
      :download-url="'/business/credit/exportCreditTemplate'"
      :download-file-name="'批量维护模板'"
      :upload-url="'/api/business/credit/exportCreditExcel'"
      @cancel="cancel"
      @success="uploadSuccess"
    />-->
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
// import batchImport from '@/views/components/batch-import.vue'
import {
  getEntitiesList,
  postCreditMaintainReceive,
  postReturnReceive, postSettle
} from '@/api/CreditMgt/creditApplicationApproval.js'

// import { regionData } from 'element-china-area-data'
import AccountUpdateDialog from '@/views/CreditManagement/components/accountUpdateDialog'
import { getUserInfo } from '@/utils/auth'
import service from '@/utils/service'
import { recordList } from '@/api/record'
export default {
  name: 'CreditApplicationUnApprovaled',
  components: {
    // batchImport,
    AccountUpdateDialog,
    Pagination
  },
  data() {
    return {
      batchIdArr: [],
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
        { label: '待处理', value: 0 },
        { label: '已处理', value: 1 }
      ],
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      userInfo: getUserInfo(),
      dateRange: ['', ''],
      earlyDateRange: ['', ''],
      // listQuery: {
      //   allocationStatus: '',
      //   allocationMethod: '1', // 分配方式
      //   options: regionData,
      //   provinceArr: [],
      //   cityArr: [],
      //   areaArr: []
      // },
      reloadParams: {
        applyDateEnd: '',
        applyDateStart: '',
        industryName: '',
        fundName: '',
        custName: '', // 客户
        productName: '', // 产品
        isHandled: 0
      },
      // 页面重载参数
      pageParams: {
        asc: true,
        orderBy: '', //	排序字段
        pageIndex: 1, //	当前页
        pageSize: 15 // 每页显示行数
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
      industryCompanyList: []
    }
  },
  created() {
    // 获取数据
    this.reload()
    // console.log('ssq:', regionData)
  },
  methods: {
    handleSettle(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postSettle(params).then(res => {
        service.handleResponse(res, () => this.reload(), '已结清')
      })
    },
    handleSelectionChange(val) {
      this.batchIdArr = val.map(item => item.id)
    },
    cancel() {
      this.dialog.visibleBatchImport = false
    },
    uploadSuccess() {
      this.dialog.visibleBatchImport = false
    },
    handleReturnReceive(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postReturnReceive(params).then(res => {
        service.handleResponse(res, res => this.reload(), '退领成功')
      })
    },
    handleReceive(scope) {
      const vm = this
      const params = {
        creditNo: scope.row.creditNo
      }
      postCreditMaintainReceive(params).then(res => {
        // service.handel
        service.handleResponse(res, function(res) {
          vm.reload()
        }, '领取成功')
      })
    },
    accountUpdate(scope) {
      this.selectRow = scope.row
      this.dialog.visible = true
    },
    handleDetail(scope) {
      this.$router.push({ path: '/CreditManagement/creditApplicationApproval-detail', query: { creditNo: scope.row.creditNo }})
    },
    entityUpdate(scope) {
      // this.dialog.editVisible = true
      this.$router.push({ path: '/CreditManagement/creditApplicationApproval-examine', query: { creditNo: scope.row.creditNo }})
      this.selectRow = scope.row
    },
    reload() {
      this.initEntities()
      recordList({
        custTypeId: 3
      }).then(res => {
        if (res.code === '0') {
          this.industryCompanyList = res.data || []
          /*  this.industryCompanyList.forEach(item => {
            item.label = item.custName
            item.value = item.id
          }) */
        } else {
          this.$message.error(res.msg)
        }
      })
      // getIndustryCompanyList({}).then(res => {
      //   const { data } = res
      //   this.industryCompanyList = data.list || []
      //   this.industryCompanyList.forEach(item => {
      //     item.label = item.custName
      //     item.value = item.id
      //   })
      // })

      // const regionDataNew = regionData || []
      // regionDataNew.forEach(item => {
      //   this.listQuery.provinceArr.push({ label: item.label, value: item.value })
      //   this.listQuery.cityArr.concat(item.children)
      //   item.children.forEach(item2 => {
      //     this.listQuery.areaArr.concat(item2.children)
      //   })
      // })
    },
    // 选择申请日期
    changeDateRange(range) {
      if (!range) {
        this.dateRange = ['', '']
        this.reloadParams.applyDateStart = ''
        this.reloadParams.applyDateEnd = ''
      } else {
        this.reloadParams.applyDateStart = range[0]
        this.reloadParams.applyDateEnd = range[1]
      }
    },
    // provinceChange(valArr) {
    //   let newArr = []
    //   this.listQuery.options.forEach(item => {
    //     if (valArr.includes(item.label)) {
    //       newArr = [
    //         ...newArr,
    //         ...item.children
    //       ]
    //     }
    //   })
    //   this.listQuery.cityArr = newArr
    // },
    // cityChange(valArr) {
    //   let newArr = []
    //   let cityArr = []
    //   regionData.forEach(item => {
    //     cityArr = [...cityArr, ...item.children]
    //   })
    //   cityArr.forEach(item => {
    //     if (valArr.includes(item.label)) {
    //       newArr = [...newArr, ...item.children]
    //     }
    //   })
    //   this.listQuery.areaArr = newArr
    // },
    initEntities() { // 初始化实体数据
      const params = { ...this.reloadParams, pageParam: this.pageParams }
      getEntitiesList(params).then(res => {
        if (res) {
          const { data } = res
          const { list, total } = data
          this.entities = list
          this.total = total
        }
      })
    },

    // 重置
    resetForm() {
      this.dateRange = ['', '']
      this.reloadParams.applyDateStart = ''
      this.reloadParams.applyDateEnd = ''
      this.pageParams.pageIndex = 1
      this.pageParams.pageSize = 15
      this.$refs['resetForm'].resetFields()
      this.initEntities()
    },
    // 关闭弹窗
    closeDialog() {
      this.dialog.visible = false
      this.reload()
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
