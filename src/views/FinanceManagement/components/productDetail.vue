<template>
  <!-- 用户信息--新增 -->
  <div class="app-container">
    <!-- 新增 -->
    <div v-if="pageMode !== 'preview'" class="formBox">
      <el-form ref="rulesForm" label-position="right" :model="listQuery" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="核心企业" label-width="160px" prop="coreCustId">
              <el-select v-model="listQuery.coreCustId" class="selectWidth" clearable filterable placeholder="请选择核心企业" @change="changeFinane(listQuery.coreCustId,coreCustList,'coreCustName')">
                <el-option
                  v-for="item in coreCustList"
                  :key="item.customerId"
                  :label="item.customerName"
                  :value="item.customerId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资金方名称" label-width="160px" prop="fundId">
              <el-select
                v-model="listQuery.fundId"
                class="selectWidth"
                filterable
                clearable
                placeholder="请选择资金方名称"
                @change="changeFinane(listQuery.fundId, fundOptionList,'fundName')"
              >
                <el-option
                  v-for="item in fundOptionList"
                  :key="item.customerId"
                  :label="item.customerName"
                  :value="item.customerId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="金融产品名称" label-width="160px" prop="productName">
              <el-input v-model.trim="listQuery.productName" maxlength="100" class="selectWidth" placeholder="录入金融产品名称" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="textareaStyle">
          <el-col :span="12">
            <el-form-item label="产品简介" label-width="160px" prop="productDesc">
              <el-input v-model="listQuery.productDesc" maxlength="200" type="textarea" rows="4" class="selectWidth" placeholder="录入产品简介" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品类型" label-width="160px" prop="productType">
              <el-select v-model="listQuery.productType" class="selectWidth" filterable placeholder="请选择产品类型">
                <el-option
                  v-for="item in productTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="listQuery.productType === 2">
          <el-col :span="12">
            <el-form-item label="是否允许修改订单" label-width="160px" prop="isFixOrder">
              <el-radio v-model="listQuery.isFixOrder" :label="1">是</el-radio>
              <el-radio v-model="listQuery.isFixOrder" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-right: unset">
          <el-col :span="12">
            <div class="selectOptions">
              <!-- intersectInputValidate  交叉检验 -->
              <el-form-item label="额度区间(元)" label-width="160px" prop="minLoanLimit">
                <el-input v-model="listQuery.minLoanLimit" class="inputmini" placeholder="录入" clearable @input="intersectInputValidate('minLoanLimit','maxLoanLimit')" />
              </el-form-item>
              <span class="text">至</span>
              <el-form-item prop="maxLoanLimit">
                <el-input v-model="listQuery.maxLoanLimit" class="inputmini" placeholder="录入" clearable @input="intersectInputValidate('maxLoanLimit','minLoanLimit')" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="selectOptions">
              <el-form-item label="利率区间(%/年)" label-width="160px" prop="minLoanRate">
                <el-input v-model="listQuery.minLoanRate" class="inputmini" placeholder="录入" clearable @input="intersectInputValidate('minLoanRate','maxLoanRate')" />
              </el-form-item>
              <span class="text">至</span>
              <el-form-item prop="maxLoanRate">
                <el-input v-model="listQuery.maxLoanRate" class="inputmini" placeholder="录入" clearable @input="intersectInputValidate('maxLoanRate','minLoanRate')" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="selectOptions">
              <!--  <el-form-item label="期限区间" label-width="160px" prop="dateRange">
                <el-date-picker v-model="dateRange" class="selectWidth" :unlink-panels="true" value-format="yyyy-MM-dd" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDateRange" />
              </el-form-item> -->
              <el-form-item label="期限区间(月)" label-width="160px" prop="minLoanTime">
                <el-input v-model="listQuery.minLoanTime" maxlength="2" class="inputmini" placeholder="录入" clearable @input="intersectInputValidate('minLoanTime','maxLoanTime')" />
              </el-form-item>
              <span class="text">至</span>
              <el-form-item prop="maxLoanTime">
                <el-input v-model="listQuery.maxLoanTime" maxlength="2" class="inputmini" placeholder="录入" clearable @input="intersectInputValidate('maxLoanTime','minLoanTime')" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="还款方式" label-width="160px" prop="repaymentMethod">
              <el-input v-model.trim="listQuery.repaymentMethod" maxlength="100" class="selectWidth" placeholder="录入" clearable />
              <!-- <el-select v-model="listQuery.repaymentMethod" class="selectWidth" filterable placeholder="请选择还款方式">
                <el-option v-for="item in repaymentMethodList" :key="item.customerId" :label="item.coreCustomerName" :value="item.customerId" />
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="资金用途" prop="loanPurpose" label-width="160px">
              <el-input v-model="listQuery.loanPurpose" maxlength="100" class="selectWidth" placeholder="录入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="还款来源" prop="repaymentSource" label-width="160px">
              <el-input v-model="listQuery.repaymentSource" maxlength="100" class="selectWidth" placeholder="录入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品有效期" prop="maxValidLimit" label-width="160px">
              <!-- <el-input v-model="listQuery.maxValidLimit" class="selectWidth" placeholder="录入" clearable /> -->
              <el-date-picker
                v-model="dateRangeLimit"
                class="selectWidth"
                :unlink-panels="true"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDateRangeLimit"
              />
              <!--  <el-date-picker
                v-model="listQuery.maxValidLimit"
                type="date"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                placeholder="请选择产品有效期"
                class="selectWidth"
              /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否单笔授信" prop="isSingleTrust" label-width="160px">
              <el-radio v-model="listQuery.isSingleTrust" :label="1" @change="()=> listQuery.isLoopLoan = 0">是</el-radio>
              <el-radio v-model="listQuery.isSingleTrust" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否循环额度" prop="isLoopLoan" label-width="160px">
              <el-radio v-model="listQuery.isLoopLoan" :disabled="listQuery.isSingleTrust === 1" :label="1">是</el-radio>
              <el-radio v-model="listQuery.isLoopLoan" :disabled="listQuery.isSingleTrust === 1" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否受托支付" prop="isEntrustPay" label-width="160px">
              <el-radio v-model="listQuery.isEntrustPay" :label="1">是</el-radio>
              <el-radio v-model="listQuery.isEntrustPay" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否一企业一账号" prop="isOneceAccount" label-width="160px">
              <el-radio v-model="listQuery.isOneceAccount" :label="1" @change="handleChange">是</el-radio>
              <el-radio v-model="listQuery.isOneceAccount" :label="0" @change="handleChange">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否平台维护账号" prop="isPlatformMaintainAccount" label-width="160px">
              <el-radio v-model="listQuery.isPlatformMaintainAccount" :disabled="listQuery.isOneceAccount === 1" :label="1">是</el-radio>
              <el-radio v-model="listQuery.isPlatformMaintainAccount" :disabled="listQuery.isOneceAccount === 1" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="授信申请账号不为空" prop="creditApplyAccountCanNull" label-width="160px">
              <el-radio v-model="listQuery.creditApplyAccountCanNull" :disabled="listQuery.isOneceAccount === 1 || listQuery.isPlatformMaintainAccount === 1" :label="1">是</el-radio>
              <el-radio v-model="listQuery.creditApplyAccountCanNull" :disabled="listQuery.isOneceAccount === 1 || listQuery.isPlatformMaintainAccount === 1" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="产品状态" prop="productStatus" label-width="160px">
              <!-- <el-radio v-model="listQuery.productStatus" :label="0">暂存</el-radio> -->
              <el-radio v-model="listQuery.productStatus" :label="1">生效</el-radio>
              <el-radio v-model="listQuery.productStatus" :label="2">失效</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <!--  <el-row>
          <el-button class="btnStyle" type="primary" @click="addSaveFinace('save')">暂存</el-button>
          <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
          <el-button class="btnStyle" type="primary" @click="addSaveFinace('submit')">确认</el-button>
        </el-row> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { getByCustTypeId } from '@/api/finance'
export default {
  name: '',
  components: {
  },
  props: {
    // 当前页面状态--（add：新增 edit: 编辑 preview: 查看）
    pageMode: {
      type: String,
      default: ''
    },
    // 产品信息
    createProductData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const _this = this
    // 验证只能保留两位小数
    const finaningReg = /^-?\d+(\.\d{1,2})?$/
    // 正整数校验
    const IntReg = /^[0-9]*$/
    const nubReg = /^[0-9]+(\.\d+)?$/ // 验证除小数点以外都是数字
    // 额度区间
    var LoanLimit = (rule, value, callback) => {
      if (value) {
        if (value < 0 || value >= 100000000) {
          return callback(new Error('额度范围应小于一亿'))
        } else if (!nubReg.test(value)) {
          return callback(new Error('只能输入数字'))
        } else if (!finaningReg.test(value)) {
          return callback(new Error('只能保留两位小数'))
        } else if (_this.listQuery.minLoanLimit && _this.listQuery.maxLoanLimit) {
          if (Number(_this.listQuery.minLoanLimit) > Number(_this.listQuery.maxLoanLimit)) {
            callback(new Error('左侧区间必须小于右侧区间'))
          } else {
            return callback()
          }
        } else if (!_this.listQuery.minLoanLimit && !_this.listQuery.maxLoanLimit) {
          // 可以为空
          return callback()
        } else {
          return callback('请将区间数据填写完整')
        }
      } else {
        return callback()
      }
    }
    // 期限区间
    var quoteDate = (rule, value, callback) => {
      if (value) {
        if (value < 0 || !IntReg.test(value)) {
          return callback(new Error('请输入大于零的正整数字'))
        } else if (_this.listQuery.minLoanTime && _this.listQuery.maxLoanTime) {
          if (Number(_this.listQuery.minLoanTime) >= Number(_this.listQuery.maxLoanTime)) {
            // 可以为空
            callback(new Error('左侧区间必须小于右侧区间'))
          } else {
            return callback()
          }
        } else if (!_this.listQuery.minLoanTime && !_this.listQuery.maxLoanTime) {
          return callback()
        } else {
          return callback('请将区间数据填写完整')
        }
      } else {
        return callback()
      }
    }
    // 利率区间
    var LoanRate = (rule, value, callback) => {
      if (value) {
        if (value < 0 || value > 100) {
          return callback(new Error('请输入0-100以内的数'))
        } else if (!nubReg.test(value)) {
          return callback(new Error('只能输入数字'))
        } else if (!finaningReg.test(value)) {
          return callback(new Error('只能保留两位小数'))
        } else if (_this.listQuery.minLoanRate && _this.listQuery.maxLoanRate) {
          if (Number(_this.listQuery.minLoanRate) > Number(_this.listQuery.maxLoanRate)) {
            return callback(new Error('左侧区间必须小于右侧区间'))
          } else {
            return callback()
          }
        } else if (!_this.listQuery.minLoanRate && !_this.listQuery.maxLoanRate) {
          return callback()
        } else {
          return callback('请将区间数据填写完整')
        }
      } else {
        return callback()
      }
    }
    return {
      // dateRange: ['', ''],
      dateRangeLimit: ['', ''], // 产品有效期
      listQuery: {},
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      fundOptionList: [], // 资金方下拉数据
      productTypeList: [
        { value: 1, label: '经营贷' },
        { value: 2, label: '订单贷' }
      ], // productType: 1, //	产品类型 1经营贷、2订单贷
      repaymentMethodList: [], // 还款方式数据
      coreCustList: [], // 核心企业
      rules: {
        fundId: [{ required: true, message: '请选择资金方', trigger: 'change' }],
        coreCustId: [{ required: true, message: '请选择核心企业', trigger: 'change' }],
        productType: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
        productName: [{ required: true, message: '请输入金融产品名称', trigger: 'blur' }],
        minLoanLimit: [{ validator: LoanLimit, trigger: 'change' }],
        maxLoanLimit: [{ validator: LoanLimit, trigger: 'change' }],
        minLoanRate: [{ validator: LoanRate, trigger: 'change' }],
        minLoanTime: [{ validator: quoteDate, trigger: 'change' }],
        maxLoanTime: [{ validator: quoteDate, trigger: 'change' }],
        maxLoanRate: [{ validator: LoanRate, trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  watch: {
    // 一企业一账户为是的时候禁用授信申请账号不为空选项同时设置为否
    'listQuery.isOneceAccount': function(val) {
      if (val) this.listQuery.creditApplyAccountCanNull = 0
    },
    // 是平台维护账号的时候禁用授信申请账号不为空选项同时设置为否
    'listQuery.isPlatformMaintainAccount': function(val) {
      if (val) this.listQuery.creditApplyAccountCanNull = 1
    }
  },
  created() {
    // 获取资金方下拉数据
    this.getByCustFinace()
    // 重新赋值避免父组件传入修改props绑定值报错
    this.listQuery = this.createProductData
    // 如果是编辑需要反显数据
    if (this.pageMode === 'edit') {
      // this.dateRange = [this.createProductData.minLoanTime, this.createProductData.maxLoanTime]
      const minValidLimit = this.createProductData.minValidLimit ? this.createProductData.minValidLimit : ''
      const maxValidLimit = this.createProductData.maxValidLimit ? this.createProductData.maxValidLimit : ''
      this.dateRangeLimit = [minValidLimit, maxValidLimit]
    }
  },
  methods: {
    handleChange(val) {
      if (val === 1) { // 一企业一账户，平台维护为否，禁用
        this.listQuery.isPlatformMaintainAccount = 0
      }
    },
    // 获取资金方下拉数据
    getByCustFinace() {
      // 获取资金方下拉数据
      getByCustTypeId({
        custTypeId: '4'
      }).then((res) => {
        if (res.code === '0') {
          this.fundOptionList = res.data
          // 特殊处理数据
          /*  this.fundOptionList.forEach(item => {
            item.customerId = parseInt(item.customerId)
          }) */
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取核心企业下拉数据
      getByCustTypeId({
        custTypeId: '6'
      }).then((res) => {
        if (res.code === '0') {
          this.coreCustList = res.data
          // 特殊处理数据
          /*    this.coreCustList.forEach(item => {
            item.customerId = parseInt(item.customerId)
          }) */
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 交叉检验
    intersectInputValidate(prop1, prop2) {
      // 利率超过100的数字自动转为100
      if (prop1 === 'minLoanRate' || prop1 === 'maxLoanRate') {
        this.listQuery[prop1] > 100 ? this.listQuery[prop1] = 100 : ''
      }
      // 禁止数据小数点
      if (prop1 === 'minLoanTime' || prop1 === 'maxLoanTime') {
        this.listQuery[prop1] = String(this.listQuery[prop1]).replace(/\./g, '')
      }
      // 禁止输入非数字/^-?\d+(\.\d{1,2})?$/
      this.listQuery[prop1] = String(this.listQuery[prop1]).replace(/[^\d^\.]+/g, '')
      // 校验另外一个输入框
      this.$refs['rulesForm'].validateField(prop2)
    },
    // 选择期限日期
    changeDateRangeLimit(range) {
      if (!range) {
        this.dateRangeLimit = ['', '']
        this.listQuery.minValidLimit = ''
        this.listQuery.maxValidLimit = ''
      } else {
        this.listQuery.minValidLimit = range[0]
        this.listQuery.maxValidLimit = range[1]
      }
    },
    // 修改资金方
    changeFinane(val, data, key2) {
      data.forEach(item => {
        if (item.customerId === val) {
          this.listQuery[key2] = item.customerName
          return
        }
      })
    },
    // 提交
    addSaveFinace(mode) {
      this.$refs['rulesForm'].validate((valid) => {
        if (valid) {
          if (mode === 'save') {
            // this.listQuery.isTempSave = 1
            this.$store.dispatch('productMaintain/set_addproductparams', this.listQuery)
            this.$emit('save', 'productDetail')
          } else {
            /*    this.listQuery.isTempSave = 0
            this.$store.dispatch('productMaintain/set_addproductparams', this.listQuery) */
            this.$emit('submit')
          }
        }
      })
    },
    //  关闭
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      // 此处必须使用name/params方式跳转路由，否则回到指定路由界面菜单栏会消失
      this.$router.push({
        name: 'ProductMaintain',
        params: {
          isRefresh: true
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.line {
  width: 800px;
  border-bottom: 1px solid #000;
}
.selectWidth {
  width: 400px;
}
.selectOptions {
  display: flex;
  width: 530px;
  .text {
    display: inline-block;
    padding: 0 15px;
    line-height: 36px;
    font-size: 14px;
    color: #606266;
  }
}

.textareaStyle {
  height: 120px;
}
.selectWidthmini,
.inputmini {
  width: 178px;
}
.title,
.el-icon-arrow-left {
  margin: 20px 0;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}

</style>
