<template>
  <div class="loanApply">
    <el-card class="page-left">
      <div class="loan-maintenance-approve">
        <div class="title">申请详情</div>
        <p />
        <el-form
          class="clearfix applyDetail"
          :model="loanForm"
          label-width="200px"
          label-position="right"
        >
          <el-col :xs="12" :sm="12">
            <el-form-item label="用款申请编号">
              <span>{{ loanForm.accountNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="客户名称">
              <span>{{ loanForm.customerName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="资金方名称">
              <span>{{ loanForm.fundName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="金融产品名称">
              <span>{{ loanForm.productName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="用款申请金额(元)">
              <span>{{ loanForm.accountAmount }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="用款申请日期">
              <span>{{ loanForm.accountDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="收款账户名称">
              <span>{{ loanForm.collAcctName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="收款账户开户行">
              <span>{{ loanForm.collBank }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="收款账户账号">
              <span>{{ loanForm.collAcctNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="已授信额度(元)">
              <span v-format="'#,##0.00'">{{ loanForm.creditApproveLimit }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="已用额度(元)">
              <span v-format="'#,##0.00'">{{ loanForm.loanUsedLimit }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="剩余额度(元)">
              <span v-format="'#,##0.00'">{{ loanForm.creditApproveLimit - loanForm.loanUsedLimit }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- 如果是订单贷，则返显该信息；否则隐藏本信息栏 -->
      <div v-if="loanForm.isFixOrder" class="loan-plan">
        <div class="title" style="width: 100%;">订单列表</div>
        <div class="pd20">
          <el-table
            ref="table"
            :data="loanForm.orderList"
            stripe
            border
            style="width: 100%;"
            :header-cell-style="{
              background: '#eee',
              color: '#333',
              'text-align': 'center',
            }"
          >
            <template v-for="(item, key) in keysData">
              <el-table-column :key="key" :label="keysData[key]" :prop="key" min-width="200px;">
                <template slot-scope="{ row }">
                  <el-input v-if="row.isModify" v-model="row[key]" @change="handleRowData(row, key ,$event)" />
                  <span v-else>{{ row[key] }}</span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
      <!-- 批复意见 -->
      <div class="approveDate">
        <div class="title">批复日期</div>
        <div style="padding: 20px">
          <el-form
            ref="applyForm"
            class="clearfix"
            :model="loanForm"
            :rules="rules"
            :validate-on-rule-change="true"
            label-width="135px"
          >
            <el-col :xs="12" :sm="12">
              <el-form-item label="用款申请批复日期" prop="replyDate">
                <el-date-picker
                  v-model="loanForm.replyDate"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12">
              <el-form-item label="批复结果" prop="approvalState">
                <el-select
                  v-model="loanForm.approvalState"
                  placeholder="请选择"
                  style="width:100%;"
                  :disabled="approvalState === 'pass'"
                  @change="changeState"
                >
                  <template v-for="item in approvalStateArr">
                    <el-option :key="item.label" :label="item.label" :value="item.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="loanForm.approvalState === 'pass'">
              <el-col :xs="12" :sm="12">
                <el-form-item label="放款金额（元）" prop="lendingAmount">
                  <el-input v-model="loanForm.lendingAmount" placeholder="录入" />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12">
                <el-form-item label="放款日期" prop="lendingDate">
                  <el-date-picker
                    v-model="loanForm.lendingDate"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12">
                <el-form-item label="利率（%/年）" prop="loanRate">
                  <el-input v-model="loanForm.loanRate" placeholder="录入" />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12">
                <el-form-item label="期限（月）" prop="deadline">
                  <el-input v-model="loanForm.deadline" maxlength="2" placeholder="录入" />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12">
                <el-form-item label="还款方式" prop="repaymentMethod">
                  <el-input v-model="loanForm.repaymentMethod" maxlength="20" placeholder="录入" />
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12">
                <el-form-item label="到期日" prop="dateDue">
                  <!--  <el-date-picker
                  v-model="loanForm.dateDue"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  style="width: 100%;"
                /> -->
                  <el-input v-model.trim="expireDate" placeholder="系统自动计算" disabled clearable />
                </el-form-item>
              </el-col>
            </template>
            <el-col :xs="12" :sm="12">
              <el-form-item label="用款批复意见" prop="comment">
                <el-input v-model="loanForm.comment" type="textarea" maxlength="150" placeholder="录入" />
              </el-form-item>
            </el-col>
          </el-form>
        </div>
      </div>
      <div>
        <footer>
          <el-button type="primary" @click="sureLoan">确定</el-button>
          <el-button @click="cancle">取消</el-button>
        </footer>
      </div>
    </el-card>
    <el-card class="page-right">
      <widgetImage
        title="用款申请影像"
        :filetype-list="fileTypeList"
        :file-list.sync="fileList"
        opr-type="preview"
        :params="{
          objectId: accountNo
        }"
      />
    </el-card>
  </div>
</template>

<script>
import { approval } from '@/api/loan'
import { accountMoney, validzzs, validateCollAcctName, validateCollAcctNo } from '@/utils/validate'
import moment from 'moment'
export default {
  name: '',
  components: {
    widgetImage: (resolve) => require(['@/views/components/widget-image'], resolve)
  },
  props: {
    loanId: {
      type: Number,
      default: null
    },
    // 详情数据
    applyDate: {
      type: Object,
      default: () => {}
    },
    // 订单表头数据
    keysData: {
      type: Object,
      default: () => {}
    }
  },
  // 定义属性
  data() {
    return {
      approvalState: '',
      loanForm: {
        accountNo: '',
        customerName: '',
        fundName: '',
        productName: '',
        accountAmount: '',
        accountDate: '',
        collAcctName: '',
        collBank: '',
        collAcctNo: '',
        creditApproveLimit: '',
        loanUsedLimit: '',
        replyDate: '',
        approvalState: '',
        lendingAmount: '',
        lendingDate: '',
        loanRate: '',
        deadline: '',
        orderList: {},
        repaymentMethod: '',
        comment: ''
      },
      rules: {
        replyDate: [
          {
            required: true,
            message: '请选择用款申请批复日期',
            trigger: 'change'
          }
        ],
        approvalState: [
          { required: true, message: '请选择批复结果', trigger: 'change' }
        ],
        lendingAmount: [
          { required: true, message: '请输入放款金额', trigger: 'blur' },
          { validator: accountMoney }
        ],
        lendingDate: [
          { required: true, message: '请选择放款日期', trigger: 'change' }
        ],
        loanRate: [{ required: true, message: '请输入利率', trigger: 'blur' }, { validator: accountMoney }],
        repaymentMethod: [
          { required: true, message: '请输入还款方式', trigger: 'blur' }
        ],
        deadline: [
          { required: true, message: '请输入期限', trigger: 'change' },
          { validator: validzzs }
        ],
        collAcctName: [
          { validator: validateCollAcctName, trigger: 'change' }
        ],
        collAcctNo: [
          { validator: validateCollAcctNo, trigger: 'change' }
        ],
        /* dateDue: [
          { required: true, message: '请选择到期日', trigger: 'change' }
        ], */
        comment: [
          { required: false, message: '请输入用款批复意见', trigger: 'blur' }
        ]
      },
      accountNo: '',
      fileTypeList: [{
        idx: '0',
        name: '用款申请影像'
      }],
      fileList: [],
      approvalStateArr: [
        {
          label: '通过',
          value: 'pass'
        },
        {
          label: '拒绝',
          value: 'reject'
        },
        {
          label: '补充资料',
          value: 'return'
        }
      ],
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime()
        }
      }
    }
  },
  computed: {
    // 到期日计算
    expireDate() {
      const currentTime = this.loanForm.lendingDate
      if (currentTime && +this.loanForm.deadline) {
        return moment(currentTime).add(this.loanForm.deadline, 'months').subtract(1, 'days').format('YYYY-MM-DD')
      } else {
        return ''
      }
    }
  },
  created() {
    this.accountNo = this.$route.query.accountNo || ''
    this.loanForm = Object.assign(this.loanForm, this.applyDate)
    this.approvalState = this.applyDate.approvalState
  },
  beforeUpdate() {
    if (this.$refs.cascaderData) {
      this.$refs.cascaderData.inputValue = this.loanForm.custAcctBank
    }
  },
  methods: {
    sureLoan() {
      this.loanForm.dateDue = this.expireDate
      this.$refs['applyForm'].validate((valid) => {
        if (valid) {
          // 和后端统一去除该检验
          /*  if (this.loanForm.deadline > 36) {
            this.$message.warning('期限不能大于36')
            return
          } else */
          if (this.loanForm.loanRate > 100) {
            this.$message.warning('利率不能大于100')
            return
          }
          console.log(this.loanForm)
          approval(this.loanForm).then(async(res) => {
            if (res.code === '0') {
              this.$message.success('维护成功！')
              this.$router.push('/LoanManagement/loan-maintenance-list')
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
            } else {
              this.$message.warning(res.msg)
            }
          }).catch(erorr => {
            this.$message.warning(erorr.response.data.msg)
          })
        } else {
          return
        }
      })
    },
    cancle() {
      this.$refs['applyForm'].resetFields()
      this.$router.go(-1)
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
    },
    changeState(data) {
      if (data === 'pass') {
        this.rules.comment[0].required = false
      } else {
        this.rules.comment[0].required = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-card__body {
    padding: 0;
  }
  .applyDetail {
    .el-form-item {
      margin-bottom: 5px;
      .el-form-item__label {
        color: #aaaaaa;
        padding-right: 16px;
        font-weight: normal;
      }
      .el-form-item__content {
        color: #3e495b;
        font-size: 14px;
      }
    }
  }
}
.loanApply {
  display: flex;
  justify-content: space-between;
  .page-left {
    // min-width: 900px;
    width: 74%;
  }
  .page-right {
    width: 25%;
  }
}
.title {
  background: #f5f7f9;
  height: 48px;
  line-height: 48px;
  padding-left: 32px;
  color: #333;
  font-size: 16px;
}
footer {
  padding: 20px;
}

</style>
