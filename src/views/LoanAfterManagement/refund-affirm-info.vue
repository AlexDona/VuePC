<template>
  <div class="app-container">
    <div v-show="mode === 'maintain'">
      <el-button type="primary" @click="showDialog('','create')">新增维护</el-button>
    </div>
    <el-table
      :data="maintainDetail"
      stripe
      border
      style="width: 100%; margin-top: 20px"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <template v-if="mode !=='planPreview'">
        <el-table-column v-if="mode === 'maintain'" label="贷款状态" prop="loanStatus" :formatter="formatterStatus" min-width="240px;" />
        <el-table-column label="还款金额(元)" prop="repaymentAmount" align="right" min-width="240px;">
          <template slot-scope="{ row }">
            <span v-format="'#,##0.00'">{{ row.repaymentAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="还款日期" prop="repaymentDate" min-width="240px;" />
        <el-table-column label="还款账号" prop="repaymentAcctNo" min-width="240px;" />
        <el-table-column label="最新维护时间" prop="updateTime" min-width="240px;" />
        <el-table-column label="维护人" prop="updateUser" min-width="240px;" />
        <el-table-column v-if="mode === 'maintain'" label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="showDialog(row,'update')">修改</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column label="期数" prop="periodNum" width="240px;" />
        <el-table-column label="本期应还款金额(元)" align="right" prop="repaymentAmount" width="240px;">
          <template slot-scope="{ row }">
            <span v-format="'#,##0.00'">{{ row.repaymentAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="本期应还款日期" prop="repaymentDate" width="240px;" />
        <el-table-column />
      </template>
    </el-table>
    <el-button style="margin-top: 20px" plain @click="toback">返回</el-button>
    <!-- 弹窗--新增、修改 -->
    <el-dialog :visible.sync="dialogVisible" :lock-scroll="false" :close-on-click-modal="false" :title="textMap[titleMode]" width="40%" class="operationDialog" @close="closeDialog">
      <el-form ref="resetForm" :validate-on-rule-change="false" :model="repayRecord" :rules="rules" label-position="left" label-width="150px" class="FormStyle">
        <el-form-item label="贷款状态" prop="loanStatus">
          <el-select v-model="repayRecord.loanStatus" class="selectWidth" placeholder="请选择贷款状态" clearable>
            <el-option v-for="(item, index) in loanStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="还款金额(元)" prop="repaymentAmount">
          <el-input
            v-model.trim="repayRecord.repaymentAmount"
            maxlength="10"
            placeholder="请输入还款金额"
            @input="
              repayRecord.repaymentAmount = lib.fixMoneyMinus(
                repayRecord.repaymentAmount
              )
            "
          />
        </el-form-item>
        <el-form-item label="还款日期" prop="repaymentDate">
          <el-date-picker v-model="repayRecord.repaymentDate" value-format="yyyy-MM-dd" type="date" style="width: 100%;" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="还款账号" prop="repaymentAcctNo">
          <el-input
            v-model="repayRecord.repaymentAcctNo"
            placeholder="请输入还款账号"
            maxlength="25"
            @input="repayRecord.repaymentAcctNo =
              String(repayRecord.repaymentAcctNo)
                .replace(/[^\d\.-]/g, '')
                .replace(/\./g, '')"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="plain" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="createRepayRecord">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRepaymentRecords, addOrEditRepaymentRecord, getRepaymentPlanList } from '@/api/loan'
// import { accountMoney } from '@/utils/validate'
export default {
  name: 'RefundAffirmInfo',
  components: {},
  data() {
    return {
      maintainDetail: [],
      mode: '',
      textMap: {
        create: '新增维护记录',
        update: '修改还款记录'
      },
      repayRecord: {
        id: '',
        loanApplyId: '',
        loanStatus: '',
        repaymentAcctNo: '',
        repaymentAmount: '',
        repaymentDate: ''
      },
      rules: {
        loanStatus: [{
          required: true, message: '请选择还款状态', trigger: 'change'
        }]
      },
      requiredStatus: false,
      loanApplyId: '',
      loanStatusList: [
        { label: '逾期', value: 0 },
        { label: '正常', value: 1 }
      ],
      titleMode: '',
      dialogVisible: false
    }
  },
  watch: {
    'repayRecord.loanStatus': function() {
      // 创建校验规则
      this.rules = {
        loanStatus: [{
          required: true, message: '请选择还款状态', trigger: 'change'
        }],
        repaymentAmount: [
          { required: this.repayRecord.loanStatus === 1, message: '请输入还款金额', trigger: 'change' },
          { validator: (rules, value, callback) => {
            if (Number(value) > 0 || value === '' || value === null) {
              callback()
            } else {
              callback('还款金额必须大于零')
            }
          }, trigger: 'change' }
        ],
        repaymentDate: [{
          required: this.repayRecord.loanStatus === 1, message: '请输入还款日期', trigger: 'change'
        }],
        repaymentAcctNo: [{
          required: this.repayRecord.loanStatus === 1, message: '请输入还款账号', trigger: 'change'
        }]
      }
      // Object.assign(this.rules, createRules)  // 为什么这样合并对象 校验规则有但是红色*不显示
    },
    deep: true
  },
  created() {
    this.mode = this.$route.query.mode
    this.loanApplyId = this.$route.query.id
    if (this.mode === 'planPreview') {
      // 查看还款计划数据
      this.getRepaymentPlanList()
    } else {
      // 获取详情数据
      this.getRepaymentRecords()
    }
  },
  methods: {
    // 获取详情
    getRepaymentRecords() {
      getRepaymentRecords(this.loanApplyId).then((res) => {
        if (res.code === '0') {
          this.maintainDetail = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取还款计划列表
    getRepaymentPlanList() {
      const params = {
        loanApplyId: this.loanApplyId
      }
      getRepaymentPlanList(params).then((res) => {
        if (res.code === '0') {
          this.maintainDetail = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 映射数据
    formatterStatus(row) {
      return row.loanStatus === 0 ? '逾期' : row.loanStatus === 1 ? '正常' : ''
    },
    showDialog(row, type) {
      this.titleMode = type
      this.dialogVisible = true
      if (type === 'update') {
        this.repayRecord = JSON.parse(JSON.stringify(row))
      } else {
        // 重置请求参数
        this.repayRecord = {
          id: '',
          loanApplyId: '',
          loanStatus: '',
          repaymentAcctNo: '',
          repaymentAmount: '',
          repaymentDate: ''
        }
      }
      this.$nextTick(() => {
        this.$refs['resetForm'].clearValidate()
      })
    },
    // 新增、修改记录
    createRepayRecord() {
      this.repayRecord.loanApplyId = this.loanApplyId
      this.$refs['resetForm'].validate(valid => {
        if (valid) {
          addOrEditRepaymentRecord(this.repayRecord).then((res) => {
            if (res.code === '0') {
              this.$message.success('操作成功')
              this.getRepaymentRecords()
              this.closeDialog()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs['resetForm'].resetFields()
      this.dialogVisible = false
    },
    // 返回
    toback() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      if (this.mode === 'maintain' || this.mode === 'planPreview') {
        this.$router.push('/LoanAfterManagement/refund-affirm')
      } else {
        this.$router.push('/LoanAfterManagement/refund-affirm-list')
      }
      // /LoanAfterManagement/refund-affirm
    }
  }
}
</script>
<style lang="scss" scoped>
  .FormStyle {
    width: 70%;
  }
  .selectWidth {
    width: 100%;
  }
  .tabPane {
    width: 40%;
    min-width: 650px;
  }
  ::v-deep.operationDialog .el-dialog__header {
    border-bottom: 1px solid #000;
  }
</style>
