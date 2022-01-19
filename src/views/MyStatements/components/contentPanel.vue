<template>
  <div class="mt24">
    <downloadBtn
      v-if="[1, 2, 3, 4].includes(type)"
      btn-name="下载"
      :download-url="downloadParams"
      method-type="post"
      :params="{}"
    />
    <el-button v-if="type === 5" type="primary" @click="handleDialog('add')">新增查询</el-button>

    <el-table
      v-if="type === 1"
      :data="tableData"
      class="mt24"
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
      <el-table-column label="序号" fixed="left" type="index" width="50" />
      <el-table-column label="客户编号" fixed="left" prop="custNo" min-width="150px;" />
      <el-table-column label="客户名称" fixed="left" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="所在省" prop="province" min-width="120px;" />
      <el-table-column label="所在市" prop="city" min-width="120px;" />
      <el-table-column label="所在区" prop="area" min-width="140px;" />
      <el-table-column label="基本类型" prop="custType" min-width="120" />
      <el-table-column label="客户性质" prop="custNature" min-width="100" />
      <el-table-column label="统一社会信用代码" prop="businessCode" min-width="200px;" />
      <el-table-column label="身份证号码" prop="contactsPersonIdtNo" min-width="200px;" />
      <el-table-column label="经办人姓名" prop="contactsPersonName" min-width="160px;" />
      <el-table-column label="经办人手机号" prop="contactsPersonMobile" min-width="160px;" />
      <el-table-column label="经办人邮箱" prop="contactsPersonEmail" min-width="200" show-overflow-tooltip />
      <el-table-column label="起始合作时间" prop="cooperationTime" min-width="240px;" />
      <el-table-column label="合作时长（月）" prop="cooperationTiming" min-width="120px;" />
      <el-table-column label="产业公司编号" prop="industryNo" min-width="120px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="180px;" />
      <el-table-column label="建档状态" prop="buildStatus" min-width="100px;" />
      <el-table-column label="建档时间" prop="buildTime" min-width="160px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="120px;" />
      <el-table-column label="已分配产品编号" prop="productCode" width="180" :show-overflow-tooltip="true" />
      <el-table-column label="已分配产品名称" prop="productName" width="180" :show-overflow-tooltip="true" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="productRateRegion" min-width="140px;" />
      <el-table-column label="期限区间（月）" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" prop="repaymentMethod" show-overflow-tooltip min-width="180px;" />
      <el-table-column label="累计放款金额(元)" align="right" prop="lendingAmountSum" min-width="120px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">
            {{ +row.lendingAmountSum }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="累计已还款金额（元）" align="right" prop="repaymentAmountSum" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ +row.repaymentAmountSum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计剩余还款金额（元）" align="right" prop="remainAmountSum" min-width="170px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ +row.remainAmountSum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逾期笔数" prop="overdueCount" />
    </el-table>
    <!--授信统计表-->
    <el-table
      v-if="type === 2"
      :data="tableData"
      class="mt24"
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
      <el-table-column label="序号" fixed="left" type="index" width="50" />
      <el-table-column label="授信申请编号" fixed="left" show-overflow-tooltip prop="creditNo" min-width="180px;" />
      <el-table-column label="客户名称" fixed="left" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="180px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="160px;" />
      <el-table-column label="是否循环额度" prop="isLoopLoan" min-width="110" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="240px;" />
      <el-table-column label="授信申请状态" prop="approveState" min-width="120px;" />
      <el-table-column label="建议授信额度（元）" align="right" prop="adviceCreditLimitAmt" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.adviceCreditLimitAmt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批复日期" prop="approveDate" min-width="120px;" />
      <el-table-column label="批复额度（元）" align="right" prop="creditApproveLimit" min-width="120px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApproveLimit }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="批复利率" prop="approveDate" />-->
      <el-table-column label="已用额度(元)" prop="loanUsedLimit" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.loanUsedLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余额度(元)" prop="loanBalance" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.loanBalance }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--用款统计表-->
    <el-table
      v-if="type === 3"
      :data="tableData"
      class="mt24"
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
      <el-table-column label="序号" fixed="left" type="index" width="50" />
      <el-table-column label="用款申请编号" fixed="left" prop="accountNo" min-width="180" />
      <el-table-column label="客户名称" fixed="left" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="180px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="160px;" />
      <el-table-column label="是否循环额度" prop="isLoopLoan" min-width="110" />
      <el-table-column label="授信申请编号" show-overflow-tooltip prop="creditNo" min-width="180" />
      <el-table-column label="授信批复日期" min-width="150" prop="approveDate" />
      <el-table-column label="授信批复额度（元）" min-width="160" align="right" prop="creditApplyLimit">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.creditApproveLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已用额度(元)" prop="loanUsedLimit" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.loanUsedLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余额度(元)" prop="remainQuota" align="right" min-width="160px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.loanBalance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用款申请日期" prop="accountDate" min-width="130" />
      <el-table-column label="用款申请金额(元)" prop="accountAount" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.accountAount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放款日期" prop="lendingDate" min-width="140px;" />
      <el-table-column label="本次放款金额(元)" prop="lendingAmount" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.lendingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="累计放款金额(元)" prop="usedQuota" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ +row.usedQuota }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--还款统计表-->
    <el-table
      v-if="type === 4"
      :data="tableData"
      class="mt24"
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
      <el-table-column label="序号" fixed="left" type="index" width="50" />
      <el-table-column label="用款申请编号" fixed="left" prop="accountNo" min-width="180" />
      <el-table-column label="客户名称" fixed="left" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="180px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="160px;" />
      <el-table-column label="放款日期" prop="lendingDate" min-width="140px;" />
      <el-table-column label="放款金额(元)" prop="lendingAmount" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.lendingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到期日" prop="dateDue" min-width="160px;" />
      <el-table-column label="还款日期" prop="repaymentDate" min-width="140px;" />
      <el-table-column label="本次还款金额(元)" prop="repaymentAmount" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次还款本金(元)" prop="repaymentPrincipal" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentPrincipal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次还款利息(元)" prop="repaymentInterest" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentInterest }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已还金额(元)" prop="repaymentAmountSum" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentAmountSum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已还本金(元)" prop="repaymentPrincipalSum" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentPrincipalSum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已还利息(元)" prop="repaymentInterestSum" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.repaymentInterestSum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="贷款状态" prop="loanStatus" min-width="100px;" />
      <el-table-column label="拖欠金额(元)" prop="oweRepaymentAmount" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.oweRepaymentAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拖欠本金(元)" prop="oweRepaymentPrincipal" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.oweRepaymentPrincipal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拖欠利息(元)" prop="oweRepaymentInterest" align="right" min-width="140px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.oweRepaymentInterest }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下一应还款日" min-width="150" prop="nextRepaymentDate" />
    </el-table>

    <!--其他统计表-->
    <el-table
      v-if="type === 5"
      :data="tableData"
      class="mt24"
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
      <el-table-column label="查询SQL" min-width="250" prop="sqlContent" />
      <el-table-column label="查询用途" min-width="150" prop="title" />
      <el-table-column label="新增时间" prop="createTime" min-width="160px;" />
      <el-table-column label="操作人" prop="createUser" min-width="120px;" />
      <el-table-column label="是否可下载" show-overflow-tooltip min-width="140" prop="status" align="center" fixed="right">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="true"
            :inactive-value="false"
            active-color="#47AB0D"
            @change="handleSwitch($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="action" align="center" fixed="right" min-width="130">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status" type="text" @click="handleDownload(scope.row)">下载</el-button>
          <el-button type="text" @click="handleRecord(scope.row)">下载记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <slot name="pagination" />

    <!-- 新增查询 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="operateType === 'add' ? '新增查询' : '下载记录'"
      class="dialogStyle"
    >
      <template v-if="operateType === 'add'">
        <el-form ref="sqlForm" :model="listQuery" label-width="80px">
          <el-form-item prop="title" label="查询用途" :rules="[{required: true, message:'请输入查询用途', trigger: 'change'}]">
            <el-input v-model.trim="listQuery.title" type="text" class="selectWidth" placeholder="请输入查询用途（30个字以内）" show-word-limit maxlength="30" />
          </el-form-item>
          <el-form-item prop="sqlContent" label="查询SQL" :rules="[{required: true, message:'请输入查询字段的SQL语句', trigger: 'change'}]">
            <el-input v-model="listQuery.sqlContent" type="textarea" rows="4" class="selectWidth" placeholder="请输入需要查询字段的SQL语句" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
      <template v-else class="download-record">
        <el-table
          v-if="type === 5"
          :data="tableRecord"
          class="mt24"
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
          <el-table-column label="下载时间" prop="exportDate" min-width="160px;" />
          <el-table-column label="下载人" prop="exportUser" min-width="120px;" />
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import downloadBtn from '@/views/components/template-xls'
import { curHeight } from '@/mixins/requestCurHeight'
import { exportSQL, updateCustomizeSqlStatus, addCustomizeSql, getExportRecord } from '@/api/MyStatements'

export default {
  name: 'ContentPanel',
  components: {
    downloadBtn
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
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogVisible: false,
      operateType: 'add',
      listQuery: {
        title: '',
        sqlContent: ''
      },
      tableRecord: []
    }
  },
  computed: {
    downloadParams() {
      if (this.type === 1) return `/business/statisticalReport/exportCustomerReport`
      else if (this.type === 2) return `/business/statisticalReport/exportCreditReport`
      else if (this.type === 3) return `/business/statisticalReport/exportLoanApplyReport`
      else return `/business/statisticalReport/exportRepaymentReport`
    }
  },
  methods: {
    handleDialog(type) {
      this.listQuery.title = ''
      this.listQuery.sqlContent = ''
      this.dialogVisible = !this.dialogVisible
      this.operateType = type
    },
    handleSubmit() {
      this.$refs['sqlForm'].validate(async(valid) => {
        if (valid) {
          const res = await addCustomizeSql({
            sqlContent: this.listQuery.sqlContent,
            title: this.listQuery.title
          })
          if (res.code === '0') {
            this.$message.success(res.msg || '操作成功')
            this.dialogVisible = false
            this.$emit('getTableData')
          } else {
            this.$message.warning(res.msg)
          }
        }
      })
    },
    handleSwitch(val, row) {
      let text = ''
      row.status = val = val !== true
      if (val === false) {
        text = '是否确认打开'
      } else {
        text = '是否确认关闭'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        const res = await updateCustomizeSqlStatus(row.id, {
          status: !row.status
        })
        if (res.code === '0') {
          // eslint-disable-next-line require-atomic-updates
          row.status = !row.status
          this.$emit('getTableData')
          this.$message.success('操作成功')
        } else {
          this.$message.warning(res.msg)
        }
        // 确认，将改变后的状态值赋给绑定的itemValue
      }).catch(() => {
        // 取消，将对立状态值赋给itemValue
      })
    },
    async handleDownload(row) {
      const res = await exportSQL(row.id)
      if (res.code === '0') {
        console.log({ res })
      }
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      })
      let link = document.createElement('a')
      link.href = URL.createObjectURL(blob)

      link.setAttribute('download', row.title)
      link.click()
      link = null
      this.$message.success('下载成功')
    },
    async handleRecord(row) {
      this.handleDialog('record')
      const res = await getExportRecord(row.id)
      if (res.code === '0') {
        this.tableRecord = res.data
      } else {
        this.$message.warning(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  color: #aaa;
}
.mt24 {
  margin-top: 24px;
}
.download-record {
  padding-bottom: 20px;
}
</style>
