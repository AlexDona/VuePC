<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="reloadParams">
      <el-row type="flex" style="gap: 24px">
        <el-col v-if="custTypeId !== 3" :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-input v-model.trim="reloadParams.industryName" class="selectWidth" placeholder="产业公司名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="reloadParams.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="custTypeId !== 4" :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="reloadParams.fundName" class="selectWidth" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="reloadParams.productName" class="selectWidth" placeholder="金融产品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="approveState">
            <el-select v-model.trim="reloadParams.approveState" style="width: 100%" placeholder="授信申请状态" clearable>
              <el-option v-for="item in mapToList(statusMap)" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="applyDate">
            <el-date-picker
              v-model="applyDateRange"
              style="width: 100%"
              type="daterange"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="申请日期"
              end-placeholder="申请日期"
              @change="changeApplyDateRange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="5" :xs="5">
          <el-form-item prop="approveDate">
            <el-date-picker
              v-model="approveDate"
              style="width: 100%"
              type="daterange"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="批复日期"
              end-placeholder="批复日期"
              @change="changeApproveDate"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-col :sm="11" :xs="11">
            <el-form-item prop="creditApplyLimitMin">
              <el-input v-model.number.trim="reloadParams.creditApplyLimitMin" type="number" placeholder="批复额度" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="1" :xs="1" style="line-height: 2;">-</el-col>
          <el-col :sm="11" :xs="11">
            <el-form-item prop="creditApplyLimitMax">
              <el-input v-model.number.trim="reloadParams.creditApplyLimitMax" type="number" placeholder="批复额度" clearable />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="reload">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <!--            <el-button type="primary" @click="download(reloadParams)">下载</el-button>-->
            <downloadBtn btn-name="下载" :download-url="`/business/credit/exportCreditApprovalExcelList`" method-type="post" :params="reloadParams" file-name="授信审批列表" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="custTypeId === 1">
        <downloadBtn
          btn-name="批量下载"
          :download-url="`/business/credit/exportCreditApprovalList`"
          :disabled="hasCheckedData"
          method-type="post"
          file-format="zip"
          :params="exportLoanIds"
          style="margin-bottom:20px;"
          file-name="授信审批列表"
        />
      </el-row>
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
      <el-table-column v-if="custTypeId === 1" type="selection" width="55" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="授信申请编号" show-overflow-tooltip prop="creditNo" min-width="150px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column v-if="custTypeId !== 4" label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" prop="productName" show-overflow-tooltip min-width="240px;" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="productRateRegion" min-width="140px;" />
      <el-table-column label="期限区间（月）" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" show-overflow-tooltip prop="repaymentMethod" min-width="120px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="120px;" />
      <el-table-column label="授信申请状态" prop="approveState" min-width="120px;">
        <template slot-scope="scope">{{ statusMap[scope.row.approveState] }}</template>
      </el-table-column>
      <!-- 1-平台 2-核心企业 3-产业公司 4-资金方 都需要显示该字段 -->
      <template v-if="custTypeId === 1 || custTypeId === 6 || custTypeId === 3 || custTypeId === 4">
        <el-table-column label="建议授信额度（元）" align="right" prop="adviceCreditLimitAmt" min-width="200px;">
          <template slot-scope="{ row }">
            <span v-format="'#,##0.00'">{{ row.adviceCreditLimitAmt }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="批复日期" prop="approveDate" min-width="120px;" />
      <el-table-column label="批复额度（元）" align="right" prop="creditApproveLimit" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApproveLimit }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="授信批复意见" prop="comment" min-width="120px;" /> -->
      <el-table-column label="核心企业" prop="coreName" min-width="240px;" show-overflow-tooltip />
      <el-table-column v-if="custTypeId !== 3" label="产业公司名称" prop="industryName" min-width="240px;" show-overflow-tooltip />
      <el-table-column label="操作" prop="receiverName" min-width="120px;" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="total > 0" :total="total" :limit.sync="reloadParams.pageParam.pageSize" :page.sync="reloadParams.pageParam.pageIndex" @pagination="initEntities(reloadParams)" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
// import batchImport from '@/views/components/batch-import.vue'
import {
  exportEntity,
  getEntitiesList
  // getIndustryCompanyList
} from '@/api/CreditMgt/creditApprovalList.js'
import { getUserInfo } from '@/utils/auth'
// import AccountUpdateDialog from '@/views/CreditManagement/components/accountUpdateDialog'
// import service from '@/utils/service'
// import moment from 'moment'
import { mapToList } from '@/utils/service'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: '',
  components: {
    downloadBtn: (resolve) =>
      require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      // rules: {
      //   creditApplyLimitMin: [
      //     {
      //       validator: (rule, value, callback) => {
      //         if (value || value === 0) {
      //           if (this.reloadParams.creditApplyLimitMax || this.reloadParams.creditApplyLimitMax === 0) {
      //             this.$refs['resetForm'].validateField(['creditApplyLimitMax'])
      //             if (value < this.reloadParams.creditApplyLimitMax) {
      //               return callback()
      //             } else {
      //               return callback(new Error('请输入正确的批复额度范围'))
      //             }
      //           } else {
      //             this.$refs['resetForm'].validateField(['creditApplyLimitMax'])
      //           // return callback()
      //           }
      //         } else if (this.reloadParams.creditApplyLimitMax || this.reloadParams.creditApplyLimitMax === 0) {
      //           return callback(new Error('请输入批复额度'))
      //         } else {
      //           if (this.reloadParams.creditApplyLimitMax || this.reloadParams.creditApplyLimitMax === 0) {
      //             this.$refs['resetForm'].validateField(['creditApplyLimitMax'])
      //           } else {
      //             this.$refs['resetForm'].clearValidate(['creditApplyLimitMax'])
      //           }
      //         }
      //       }, trigger: ['change', 'blur'] }
      //   ],
      //   creditApplyLimitMax: [
      //     {
      //       validator: (rule, value, callback) => {
      //         if (value || value === 0) {
      //           if (this.reloadParams.creditApplyLimitMin || this.reloadParams.creditApplyLimitMin === 0) {
      //             if (value > this.reloadParams.creditApplyLimitMin) {
      //               return callback()
      //             } else {
      //               return callback(new Error('请输入正确的批复额度范围'))
      //             }
      //           } else {
      //             this.$refs['resetForm'].validateField(['creditApplyLimitMin'])
      //           }
      //         } else if (this.reloadParams.creditApplyLimitMin || this.reloadParams.creditApplyLimitMin === 0) {
      //           return callback(new Error('请输入批复额度'))
      //         } else {
      //           if (this.reloadParams.creditApplyLimitMin || this.reloadParams.creditApplyLimitMin === 0) {
      //             this.$refs['resetForm'].validateField(['creditApplyLimitMin'])
      //           } else {
      //             this.$refs['resetForm'].clearValidate(['creditApplyLimitMin'])
      //           }
      //         }
      //       }, trigger: ['change', 'blur'] }
      //   ]
      // },
      mapToList,
      custTypeId: getUserInfo().custTypeId, // 客户类型 1-平台 2-核心企业 3-产业公司 4-资金方 5-经销商 6-零售商 7-种植户
      batchIdArr: [],
      // 申请状态（0-产业公司审批，1-核心企业审批，2-资金方审批，3-通过，4-拒绝，5-补充资料，6、结清）
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
      applyDateRange: ['', ''],
      approveDate: ['', ''],
      // 页面重载参数
      reloadParams: {
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        },
        industryName: '',
        fundName: '',
        custName: '', // 客户
        productName: '', // 产品
        approveState: '',
        applyDateStart: '',
        applyDateEnd: '',
        approveDateEnd: '', // 批复日期
        approveDateStart: '', // 批复日期
        creditApplyLimitMin: '', // 额度日期
        creditApplyLimitMax: '' // 额度日期
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
      // industryCompanyList: [],
      exportLoanIds: {}, // 批量下载id
      hasCheckedData: true
    }
  },
  mounted() {
    // 获取数据
    this.reload()
    // console.log('ssq:', regionData)
    console.log('getUserInfo====', getUserInfo())
  },
  methods: {
    download() {
      exportEntity(this.reloadParams)
    },
    handleSelectionChange(val) {
      if (val.length) {
        // 只有相同资金方才可以一起被选
        this.hasCheckedData = val.some(item => {
          return item.fundName !== val[0].fundName
        })
        this.hasCheckedData = val.some(item => {
          return item.productId !== val[0].productId
        })

        this.exportLoanIds.ids = this.hasCheckedData
          ? null
          : val.map((item) => item.id)
        if (this.hasCheckedData) {
          this.$message.warning('批量下载只允许勾选同一资金方且同一产品')
        }
      } else {
        this.hasCheckedData = true
      }
    },
    cancel() {
      this.dialog.visibleBatchImport = false
    },
    uploadSuccess() {
      this.dialog.visibleBatchImport = false
    },
    accountUpdate(scope) {
      this.selectRow = scope.row
      this.dialog.visible = true
    },
    handleDetail(row) {
      console.log(row)
      this.$router.push({
        path: '/CreditManagement/creditApprovalListTrace',
        query: { creditNo: row.creditNo }
      })
    },
    entityUpdate(scope) {
      // this.dialog.editVisible = true
      this.$router.push({
        path: '/CreditManagement/creditMaintain-update',
        query: { creditNo: scope.row.creditNo }
      })
      this.selectRow = scope.row
    },
    reload() {
      // const { applyDate, approveDate } = this.reloadParams
      this.reloadParams.pageParam.pageIndex = 1
      const params = {
        ...this.reloadParams
      }
      params.creditApplyLimitMax === '' && delete params.creditApplyLimitMax
      params.creditApplyLimitMin === '' && delete params.creditApplyLimitMin

      this.initEntities(params)
    },
    // 选择日期
    changeApplyDateRange(range) {
      if (!range) {
        this.applyDateRange = ['', '']
        this.reloadParams.applyDateStart = ''
        this.reloadParams.applyDateEnd = ''
      } else {
        this.reloadParams.applyDateStart = range[0]
        this.reloadParams.applyDateEnd = range[1]
      }
    },
    // 选择日期
    changeApproveDate(range) {
      if (!range) {
        this.approveDate = ['', '']
        this.reloadParams.approveDateStart = ''
        this.reloadParams.approveDateEnd = ''
      } else {
        this.reloadParams.approveDateStart = range[0]
        this.reloadParams.approveDateEnd = range[1]
      }
    },
    initEntities(params) {
      // 初始化实体数据
      getEntitiesList(params).then((res) => {
        if (res.code === '0') {
          const { data } = res
          const { list, total } = data
          this.entities = list
          this.total = total
        } else {
          this.$message.error(res.msg)
        }
      })
    },

    // 重置
    resetForm() {
      this.reloadParams.creditApplyLimitMin = ''
      this.reloadParams.creditApplyLimitMax = ''
      this.reloadParams.applyDateStart = ''
      this.reloadParams.applyDateEnd = ''
      this.reloadParams.approveDateStart = ''
      this.reloadParams.approveDateEnd = ''
      this.reloadParams.pageParam.pageIndex = 1
      this.applyDateRange = ['', '']
      this.approveDate = ['', '']
      this.$refs['resetForm'].resetFields()
      const params = { ...this.reloadParams }
      params.creditApplyLimitMax === '' && delete params.creditApplyLimitMax
      params.creditApplyLimitMin === '' && delete params.creditApplyLimitMin
      this.initEntities(params)
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
  ::v-deep .el-dialog {
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
