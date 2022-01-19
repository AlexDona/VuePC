<template>
  <div class="addLoan">
    <el-form
      ref="loanForm"
      :model="loanFormData"
      label-position="right"
      :rules="formRules"
      label-width="130px"
      style="margin-right:50px;"
    >
      <el-form-item label="客户名称" prop="custName">
        <el-select
          v-model="loanFormData.custName"
          class="selectWidth"
          placeholder="请选择客户名称"
          filterable
          remote
          :remote-method="remoteMethod"
          clearable
        >
          <el-option
            v-for="(item, index) in custList"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用款申请日期" prop="applyDate">
        <el-date-picker v-model="loanFormData.applyDate" value-format="yyyy-MM-dd" type="date" style="width: 100%;" placeholder="选择日期" :picker-options="pickerOptions" />
      </el-form-item>
      <el-form-item label="用款申请金额(元)" prop="accountAmount">
        <el-input v-model.trim="loanFormData.accountAmount" />
      </el-form-item>
      <el-form-item label="资金方名称" prop="fundName">
        <el-select
          v-model="loanFormData.fundName"
          class="selectWidth"
          placeholder="请选择资金方名称"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in fundNameList"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="金融产品名称" prop="productName">
        <el-select
          v-model="loanFormData.productName"
          class="selectWidth"
          placeholder="请选择金融产品名称"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in productNameList"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="授信申请编号" prop="creditNo">
        <el-select
          v-model="loanFormData.creditNo"
          class="selectWidth"
          placeholder="请选择授信申请编号"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in creditNoList"
            :key="index"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产业公司名称" prop="industryName">
        <el-input v-model="loanFormData.industryName" disabled />
      </el-form-item>
      <el-form-item label="放款状态" prop="status">
        <el-select
          v-model="loanFormData.lendingState"
          disabled
          class="selectWidth"
          placeholder="请选择状态"
        >
          <el-option
            v-for="(item, index) in loanStatus"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="还款方式" prop="repaymentMethod">
        <el-input v-model="loanFormData.repaymentMethod" maxlength="30" />
      </el-form-item>
      <el-form-item label="收款账户名称" prop="collAcctName">
        <el-input v-model="loanFormData.collAcctName" disabled />
      </el-form-item>
      <el-form-item label="收款账户开户行" prop="collBank">
        <el-input v-model="loanFormData.collBank" disabled />
      </el-form-item>
      <el-form-item label="收款账户帐号" prop="collAcctNo">
        <el-input v-model="loanFormData.collAcctNo" disabled />
      </el-form-item>
    </el-form>
    <div class="btnSubmit">
      <template>
        <el-button plain @click="cancelSubmit">取消</el-button>
        <el-button v-preventReClick type="primary" @click="addLoan">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { accountMoney } from '@/utils/validate'
import { selectCreditListProperty, selectCreditList, add } from '@/api/loan'

export default {
  name: 'AddLoan',
  props: {
  },
  data() {
    return {
      loanFormData: {
        lendingState: '1',
        applyDate: '',
        accountAmount: null,
        custName: null,
        fundName: null,
        industryName: null,
        repaymentMethod: null,
        productName: null,
        creditNo: null
      },
      formRules: {
        accountAmount: [
          { required: true, message: '请输入用款申请金额', trigger: 'blur' },
          { validator: accountMoney }
        ],
        repaymentMethod: [
          { required: true, message: '请输入还款方式', trigger: 'blur' }
        ],
        custName: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
        fundName: [
          { required: true, message: '请选择资金方名称', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请选择金融产品名称', trigger: 'change' }
        ],
        creditNo: [
          { required: true, message: '请选择授信申请编号', trigger: 'change' }
        ],
        applyDate: [
          { required: true, message: '请选择用款申请日期', trigger: 'blur' }
        ]
      },
      statusOptions: [],
      loanStatus: [
        {
          label: '通过',
          value: '1'
        }
      ],
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime()
        }
      },
      custList: [], // 客户名称
      fundNameList: [], // 资金方名称
      productNameList: [], // 金融产品名称
      creditNoList: [] // 授信申请编号
    }
  },
  watch: {
    'loanFormData.custName': function(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.resetData('custName')
        selectCreditListProperty({
          approveState: 1,
          custName: newVal,
          attractType: 2,
          select: 'fundName'
        }).then(res => {
          this.fundNameList = res.data && res.data.length && res.data.map(res => {
            return {
              label: res
            }
          }) || {}
        })
      }
    },
    'loanFormData.fundName': function(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.resetData('fundName')
        selectCreditListProperty({
          approveState: 1,
          custName: this.loanFormData.custName,
          fundName: newVal,
          attractType: 2,
          select: 'productName'
        }).then(res => {
          this.productNameList = res.data && res.data.length && res.data.map(res => {
            return {
              label: res
            }
          }) || {}
        })
      }
    },
    'loanFormData.productName': function(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.resetData('productName')
        selectCreditListProperty({
          approveState: 1,
          custName: this.loanFormData.custName,
          fundName: this.loanFormData.fundName,
          productName: newVal,
          attractType: 2,
          select: 'creditNo'
        }).then(res => {
          this.creditNoList = res.data && res.data.length && res.data.map(res => {
            return {
              label: res
            }
          }) || {}
        })
      }
    },
    'loanFormData.creditNo': function(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        selectCreditList({
          approveState: 1,
          custName: this.loanFormData.custName,
          fundName: this.loanFormData.fundName,
          productName: this.loanFormData.productName,
          creditNo: newVal,
          attractType: 2
        }).then(res => {
          const creditDeatil = res.data && res.data.list && res.data.list[0] || {}
          this.loanFormData.industryName = creditDeatil.industryName
          this.loanFormData.collAcctName = creditDeatil.collAcctName
          this.loanFormData.collAcctNo = creditDeatil.collAcctNo
          this.loanFormData.collBank = creditDeatil.collBank
        })
      }
    }
  },
  created() {
  },
  methods: {
    resetData(type) {
      // 更改了选过的客户名称、资金方名称、金融产品名称的适合，重置数据
      if (type === 'custName') {
        this.loanFormData.fundName = null
      } else if (type === 'fundName') {
        this.loanFormData.productName = null
      } else if (type === 'productName') {
        this.loanFormData.creditNo = null
      }
    },
    remoteMethod(data) {
      selectCreditListProperty({
        approveState: 1,
        custName: data,
        attractType: 2,
        select: 'custName'
      }).then(res => {
        this.custList = res.data && res.data.length && res.data.map(res => {
          return {
            label: res
          }
        })
      })
    },
    addLoan() {
      // 保存数据
      this.$refs['loanForm'].validate(valid => {
        if (valid) {
          add(this.loanFormData).then(res => {
            if (res.code === '0') {
              this.$message.success('新增成功')
              this.cancelSubmit()
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    cancelSubmit() {
      // 清除校验
      this.$refs['loanForm'].clearValidate()
      // 这里是父组件的方法
      this.$emit('closeLoanDialog')
      // 清空数据（不能用resetFields）
      this.loanFormData = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.selectWidth{
  width: 100%;
}
</style>
