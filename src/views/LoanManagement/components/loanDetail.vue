<template>
  <div class="content">
    <!-- 新增 -->
    <div class="formBox">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form v-if="pageType !== 'preview'" ref="formDetail" :validate-on-rule-change="false" :model="detailData" :rules="rules" label-position="right">
            <el-collapse v-model="activeNameCol1" accordion>
              <el-collapse-item title="用款申请审批" name="1">

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="用款申请编号" label-width="150px" prop="accountNo">
                      <el-input v-model.trim="detailData.accountNo" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="客户名称" label-width="150px" prop="customerName">
                      <el-input v-model.trim="detailData.customerName" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="资金方名称" label-width="150px" prop="fundName">
                      <el-input v-model.trim="detailData.fundName" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="金融产品名称" label-width="150px" prop="productName">
                      <el-input v-model.trim="detailData.productName" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="用款申请金额" label-width="150px" prop="accountAmount">
                      <el-input v-model.trim="detailData.accountAmount" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="用款申请日期" label-width="150px" prop="accountDate">
                      <el-input v-model.trim="detailData.accountDate" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款账户名称" label-width="150px" prop="collAcctName">
                      <el-input v-model.trim="detailData.collAcctName" :disabled="true" class="selectWidth" maxlength="20" placeholder="收款账户名称" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款账户开户行" label-width="150px" prop="collBank">
                      <el-input v-model.trim="detailData.collBank" :disabled="true" class="selectWidth" maxlength="20" placeholder="收款账户名称" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款账户账号" label-width="150px" prop="collAcctNo">
                      <el-input v-model.trim="detailData.collAcctNo" :disabled="true" class="selectWidth" maxlength="20" placeholder="收款账户名称" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="已授信额度（元）" label-width="150px" prop="creditApproveLimit">
                      <el-input v-model.trim="detailData.creditApproveLimit" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="已用额度（元）" label-width="150px" prop="loanUsedLimit">
                      <el-input v-model.trim="detailData.loanUsedLimit" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="剩余额度（元）" label-width="150px" prop="remainQuota">
                      <el-input v-model.trim="detailData.remainQuota" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-for="(item, key) in detailData.fieldJson" :key="key" :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="key" label-width="150px" prop="remainQuota">
                      <el-input v-model.trim="detailData.fieldJson[key]" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="!detailData.orderList || detailData.orderList.length === 0" :gutter="20" style="background: #fff">
                  <el-col :span="12">
                    <el-form-item :label="'审批意见'" prop="comment" label-width="150px">
                      <el-input v-model="detailData.comment" type="textarea" maxlength="150" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-if="detailData.orderList && detailData.orderList.length" v-model="activeNameCol3" accordion>
              <el-collapse-item title="订单列表" name="1">
                <el-table
                  ref="multipleTable"
                  :data="detailData.orderList"
                  tooltip-effect="dark"
                  :max-height="curHeight"
                  stripe
                  border
                  style="width: 100%;"
                  :header-cell-style="{
                    background: '#eee',
                    color: '#333',
                    'text-align': 'center',
                  }"
                >
                  <el-table-column label="序号" type="index" width="50" />
                  <template v-for="(item, key) in keysData">
                    <el-table-column :key="key" :label="keysData[key]" :prop="key" min-width="200px;">
                      <template slot-scope="{ row }">
                        <el-input v-if="row.isModify" v-model="row[key]" @change="handleRowData(row, key ,$event)" />
                        <span v-else>{{ row[key] }}</span>
                      </template>
                    </el-table-column>

                  </template>
                  <el-table-column v-if="detailData.isFixOrder" label="操作" prop="action" align="center" fixed="right" min-width="130">
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.isModify" type="text" @click="handleTemplate('cancel', scope.row, scope.$index)">取消</el-button>
                      <el-button v-else type="text" :disabled="scope.row.disabled" @click="handleTemplate('modify', scope.row)">修改</el-button>
                      <el-button type="text" :disabled="!scope.row.isModify" @click="handleTemplate('save', scope.row, scope.$index)">保存</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="mt24">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item :label="'审批意见'" prop="comment" label-width="150px">
                        <el-input v-model="detailData.comment" type="textarea" maxlength="150" />
                        <!--                      <el-row v-if="errorTip" :class="['tip', {'errorTip': errorTip && !comment.length}]">请输入审批意见</el-row>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-col>
        <el-col :span="8">
          <widget-image
            v-if="detailData.accountNo"
            title="用款申请影像"
            :filetype-list="fileTypeList"
            :file-list.sync="fileList"
            opr-type="preview"
            :params="{
              objectId: detailData.accountNo
            }"
            :credit-no="creditNo"
          />
        </el-col>
      </el-row>
    </div>
    <footer>
      <el-button v-if="pageType !== 'preview'" type="primary" @click="handleSubmitApprove('save')">暂存</el-button>
      <el-button plain @click="cancel()">取消</el-button>
      <el-button v-if="pageType !== 'preview'" class="btnStyle success" type="primary" @click="handleSubmitApprove('return')">退回</el-button>
      <el-button v-if="pageType !== 'preview'" class="btnStyle success" type="primary" @click="handleSubmitApprove('reject')">拒绝</el-button>
      <el-button v-if="pageType !== 'preview'" type="primary" @click="handleSubmitApprove('pass')">通过</el-button>
    </footer>
  </div>
</template>

<script>
import { curHeight } from '@/mixins/requestCurHeight'
import widgetImage from '@/views/components/widget-image'
import { loanApproveSubmit, approveStorage, updateOrderInfo } from '@/api/loan'
// import { getProductDetail } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'

export default {
  name: 'LoanDetail',
  components: {
    widgetImage
  },
  mixins: [curHeight],
  props: {
    keysData: {
      type: Object,
      default: () => {}
    },
    detailData: {
      type: Object,
      default: () => {}
    },
    productId: {
      type: Number,
      default: 0
    }
  },
  data() {
    // console.log(this.$route.query.type, ' this.$route.query.type')
    return {
      previewData: [], // 预览数据
      loanId: this.$route.query.loanId || '',
      approveResultArr: [
        { label: '通过', value: 'pass' },
        { label: '拒绝', value: 'reject' },
        { label: '补充材料', value: 'return' }
      ],
      num: 0,
      formDetail: 'formDetail',
      rules: {
        comment: [
          { required: true, message: '请输入审批意见', trigger: 'blur' }
        ]
      },
      userInfo: getUserInfo(),
      detailsData: [],
      pageType: this.$route.query.type,
      errorTip: false,
      fileList: [],
      fileTypeList: [{
        idx: '0',
        name: '用款申请影像'
      }],
      creditNo: this.$route.query.creditNo,
      activeNameCol1: '1',
      activeNameCol2: '1',
      activeNameCol3: '1',
      listQuery: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      comment: null,
      flag: false,
      tableData: [],
      orderInfo: {}
    }
  },
  computed: {
    // 到期日计算
    expireDate() {
      const currentTime = this.detailData.replyDate
      if (currentTime && +this.detailData.creditTerm) {
        return moment(currentTime).add(this.detailData.creditTerm, 'months').subtract(1, 'days').format('YYYY-MM-DD')
      } else {
        return ''
      }
    }
  },
  // computed: {
  //   'this.detailData.comment'(val) {
  //     console.log(val,'vvvvvvv')
  //     return this.detailData.comments.filter(item => item.receiverId === getUserInfo().userId)[0]
  //   }
  // },
  watch: {
    productId() {
      // this.getConfig()
    },
    detailData: {
      handler(val, oldVal) {
        // if (JSON.stringify(val) === JSON.stringify(oldVal)) return
        // if (val.fieldJson) {
        //   this.detailData.detailsData = JSON.parse(val.fieldJson)
        // }

        if (this.detailData.approveState === 'pass') {
          this.$refs['formDetail'].clearValidate(['comment'])
          this.rules = {
            approveState: [
              { required: true, message: '请选择用款批复结果', trigger: 'blur' }
            ],
            creditApproveLimit: [
              { required: true, message: '请输入用款额度', trigger: 'blur' }
            ],
            creditTerm: [
              { required: true, message: '请输入期限', trigger: 'blur' }
            ],
            expireDate: [
              { required: true, message: '请输入用款到期日', trigger: 'blur' }
            ],
            comment: [
              { required: false, message: '请输入审批意见', trigger: 'blur' }
            ]
          }
        } else {
          // this.$refs['formDetail'].clearValidate()
          this.rules = {
            approveState: [
              { required: true, message: '请选择用款批复结果', trigger: 'blur' }
            ],
            comment: [
              { required: true, message: '请输入审批意见', trigger: 'blur' }
            ]
          }
        }

        if (this.pageType !== 'preview' && !this.flag) {
          this.flag = true
        }
        const userId = getUserInfo().userId
        if (val.comments.length && this.pageType === 'preview') {
          const comment = this.detailData.comments.filter(item => item.receiverId === +userId)
          // console.log(comment, 'comment')
          this.detailData.comment = comment[0] && comment[0].comment
          this.$refs['formDetail'].clearValidate(['creditApproveLimit'])
        }
      },
      deep: true
    }
  },
  created() {
    console.log(this.detailData, 'orderList')
  },
  methods: {
    checkValue(rule, value, callback) {
      console.log(rule, value, callback)
    },
    handleRowData(row, key, val) {
      // console.log(row, key, val)
      this.orderInfo[key] = val
    },
    handleTemplate(type, rowData, index) {
      if (type === 'save') {
        this.detailData.orderList.map((item, id) => {
          item.disabled = false
        })
        rowData.isModify = false
        console.log(rowData, index, 'xie')
        this.updateOrderInfo(rowData)
      } else if (type === 'modify') {
        this.detailData.orderList.map((item, id) => {
          if (index !== id) {
            item.disabled = true
          }
        })
        rowData.isModify = true
      } else { // 取消
        this.$emit('getFormData')
        rowData.isModify = false
        this.detailData.orderList.map((item, id) => {
          item.disabled = false
        })
      }
    },
    async updateOrderInfo(rowData) {
      const res = await updateOrderInfo({
        orderId: rowData.id,
        orderInfo: this.orderInfo,
        templateTableId: this.detailData.templateTableId
      })
      if (res.code === '0') {
        console.log({ res })
        this.$message.success('保存成功')
        this.orderInfo = {} // 清空修改数据
      } else {
        this.$message.error(res.msg)
      }
    },
    async handleSubmitApprove(type) {
      this.detailData.expireDate = this.expireDate
      // console.log(this.detailData, 'detailData')
      if (type === 'save') {
        const params = {
          // approveDate: this.detailData.approveDate || null,
          id: this.loanId,
          comment: this.detailData.comment
        }
        console.log(params, 'saveparams')
        const res = await approveStorage(params)
        if (res.code === '0') {
          // console.log(res)
          this.$message.success('暂存成功')
        /*   this.$router.push({
            path: '/LoanManagement/loanApproval'
          }) */
        } else {
          this.$message.error(res.msg)
        }
      } else {
        if (type === 'pass') {
          this.rules.comment = [] // 通过审批意见可不填
        }
        this.$refs['formDetail'].validate(async valid => {
          // console.log(valid, 'valid')
          if (valid) {
            const params = {
              // approveDate: this.detailData.approveDate || null,
              approvalState: type,
              id: this.loanId,
              comment: this.detailData.comment
            }
            const res = await loanApproveSubmit(params)
            if (res.code === '0') {
              // console.log(res)
              this.$message.success('操作成功')
              this.$router.push({
                path: '/LoanManagement/loanApproval'
              })
            } else {
              this.$message.error(res.msg)
            }
          }
        })
      }
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  .success {
    border: none;
    background: #3357CC;
  }
  .continue {
    border: none;
    background: #6095FF;
  }
  .refuse {
    border: none;
    background: #FF4717;
  }
  .comment {
    position: relative;
   &::before {
     position: absolute;
     content: '*';
     top: 8px;
     left: 70px;
     color: red;
   }
  }
  .tip {
    display: none;
  }
  .errorTip {
    display: block;
    color: red;
  }
  ::v-deep {
    .el-collapse-item__wrap {
      padding: 24px;
      border-bottom: none;
    }
    .el-collapse-item__content {
      padding-top: 18px;
    }
    .el-collapse-item__header {
      font-size: 16px;
      padding-left: 32px;
      background: #F5F7F9;
    }
    .el-textarea__inner {
      min-height: 100px !important;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
  .form-title {
    margin-top: 0;
    padding: 13px 32px;
    background-color: #F5F7F9;
    margin-bottom: 13px;
  }
  footer {
    margin-left: -20px;
    position: fixed;
    bottom: 0;
    z-index: 20;
    height: 80px;
    line-height: 80px;
    // width: calc(99%);
    // transform: translateX(20px);
    // left: 76px;
    // right: 38px;
    background-color: #fff;
    width: calc(100%);
    // padding-left: 20px;
    box-shadow: 0px -2px 23px 2px rgba(135, 150, 176, 0.2);
    .el-button {
      width: 100px;
      margin-left: 32px;
    }
    .btnStyle{
      border-color: #BF2020;
      background-color: #BF2020;

    }
  }
}
</style>
