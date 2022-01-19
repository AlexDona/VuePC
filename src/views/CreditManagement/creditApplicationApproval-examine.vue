<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="申请详情" name="1">
        <div class="formBox">
          <el-card class="formBox-left">
            <el-form ref="resetForm" :model="detail" :rules="rules" label-width="180px">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="授信申请详情" name="1">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item prop="productName" label="授信申请编号" disabled>
                        <el-input v-model.trim="detail.creditNo" placeholder="" disabled clearable />
                      </el-form-item>

                      <el-form-item prop="productName" label="授信申请日期" disabled>
                        <el-input v-model.trim="detail.applyDate" placeholder="" disabled clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="审批详情" name="2">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户名称" prop="collAcctName">
                        <el-input v-model.trim="detail.collAcctName" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户开户行" prop="collBank">
                        <el-input v-model.trim="detail.collBank" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户账号" prop="collAcctNo">
                        <el-input v-model.trim="detail.collAcctNo" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item v-for="item in fieldJsonArr" :key="item.value" :label="item.label">
                        <el-input v-model.trim="item.value" placeholder="" disabled clearable />
                      </el-form-item>

                      <!--                  <el-form-item label="客户评分">-->
                      <!--                    <el-input v-model.trim="detail.custScore" min="0" max="12" placeholder="" disabled clearable @input="mouthChange" />-->
                      <!--                  </el-form-item>-->
                      <template v-if="(userInfo.custTypeId === 6 || userInfo.custTypeId === 4) && detail.adviceCreditLimitAmt">
                        <el-form-item label="建议授信额度(元)" prop="adviceCreditLimitAmt">
                          <el-input v-model.trim="detail.adviceCreditLimitAmt" disabled placeholder="" clearable />
                        </el-form-item>
                      </template>
                      <template v-if="userInfo.custTypeId === 3">
                        <el-form-item label="建议授信额度(元)" prop="adviceCreditLimitAmt">
                          <el-input v-model.trim="detail.adviceCreditLimitAmt" placeholder="" clearable />
                        </el-form-item>
                      </template>
                      <el-form-item label="审批意见">
                        <el-input v-model="comment" :disabled="pageType === 'preview'" type="textarea" maxlength="300" style="with: 150px" />
                        <el-row v-if="errorTip" :class="['tip', {'errorTip': errorTip && !comment.length}]">请输入审批意见</el-row>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <el-row :gutter="20">
                <div class="footer pd20">
                  <el-button type="primary" @click="handleSubmitApprove('save')">暂存</el-button>
                  <el-button plain @click="cancel()">取消</el-button>
                  <el-button class="success" type="primary" @click="handleSubmitApprove('pass')">通过</el-button>
                  <el-button class="refuse" type="primary" @click="handleSubmitApprove('return')">退回</el-button>
                  <!-- <el-button class="btnStyle continue" type="primary" @click="handleSubmitApprove('return')">补充资料</el-button> -->
                </div>
              </el-row>
            </el-form>
          </el-card>
          <el-card class="formBox-right">
            <widget-image title="授信申请影像" :filetype-list="fileTypeList" :file-list.sync="fileList" opr-type="preview" :params="urlParams" :credit-no="creditNo" />
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="审批轨迹" name="2">
        <el-table
          border
          :data="detail.comments"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column prop="taskNode" label="审批节点" width="180">
            <!--   <template slot-scope="scope">
                  {{ approveStateMap[scope.row.approvalState] }}
                </template> -->
          </el-table-column>
          <el-table-column
            prop="receiverName"
            label="审批人"
          />
          <el-table-column
            prop="comment"
            label="审批意见"
          >
            <template slot-scope="scope">
              <span class="preLine">{{ scope.row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="approvalTime"
            label="审批时间"
          />
        </el-table>
        <el-row class="m-t-30">
          <el-button type="plain" @click="cancel()">关闭</el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import { getEntityDetail, approveSubmit, approveStorage, approveStorageView } from '@/api/CreditMgt/creditApplicationApproval.js'
// import { Message } from 'element-ui'
import moment from 'moment'
import WidgetImage from '@/views/components/widget-image'
import service from '@/utils/service'
import { getUserInfo } from '@/utils/auth'

export default {
  name: 'FinancialList',
  components: { WidgetImage },
  data() {
    // 验证只能保留两位小数
    const finaningReg = /^-?\d+(\.\d{1,2})?$/
    const nubReg = /^[0-9]+(\.\d+)?$/ // 验证除小数点以外都是数字
    // 额度区间
    var adviceCreditLimit = (rule, value, callback) => {
      if (value) {
        if (value < 0 || value >= 100000000) {
          return callback(new Error('额度范围应大于零小于一亿'))
        } else if (!nubReg.test(value)) {
          return callback(new Error('只能输入数字'))
        } else if (!finaningReg.test(value)) {
          return callback(new Error('只能保留两位小数'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    return {
      errorTip: false,
      comment: '',
      approveStateMap: {
        pass: '通过',
        end: '拒绝',
        reject: '补充资料'
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      activeName: '1',
      urlParams: {
        objectId: this.$route.query.creditNo
      },
      fileList: [],
      fileTypeList: [{
        idx: '0',
        name: '授信申请影像'
      }],
      rules: {
        adviceCreditLimitAmt: [{ validator: adviceCreditLimit, trigger: 'change' }]
      },
      userInfo: getUserInfo(),
      approveResultArr: [
        { label: '通过', value: 1 },
        { label: '拒绝', value: 2 },
        { label: '补充材料', value: 3 }
      ],
      activeNames: ['1', '2'],
      params: {},
      creditNo: '',
      detail: {},
      fieldJsonArr: [],
      pageType: ''
    }
  },
  async created() {
    this.creditNo = this.$route.query.creditNo
    await this.initEntities({ creditNo: this.creditNo })
    await this.getStorageViewMesg()
  },
  methods: {
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    },
    // 获取暂存查看
    async getStorageViewMesg() {
      const resp = await approveStorageView({ creditNo: this.creditNo })
      console.log(resp)
      service.handleResponse(resp, (data) => {
        this.comment = data ? data.comment : ''
        data ? this.detail.adviceCreditLimitAmt = data.adviceCreditLimitAmt : ''
      }, '')
    },
    handleSubmitApprove(type) {
      const { approveDate, creditApproveLimit, creditNo, creditTerm, expireDate, adviceCreditLimitAmt } = this.detail
      // debugger
      // 暂存不需要检验审批意见必填
      /*   if (!this.comment.length) {
        this.errorTip = true
      } else  */
      this.$refs['resetForm'].validate(async valid => {
        if (valid) {
          if (type !== 'save') {
            this.errorTip = false
            // debugger
            const params = {
              approveDate,
              approveResult: type,
              comment: this.comment,
              creditLimitAmt: creditApproveLimit,
              creditNo,
              creditTrem: creditTerm,
              adviceCreditLimitAmt,
              expireDate
            }
            const res = await approveSubmit(params)
            if (res.code === '0') {
              this.$message.success('操作成功')
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
              this.$router.push('/CreditManagement/creditApplicationApproval')
            } else {
              this.$message.error(res.msg)
            }
          } else {
            const params = {
              approveDate,
              approveResult: type,
              comment: this.comment,
              creditLimitAmt: creditApproveLimit,
              creditNo,
              adviceCreditLimitAmt,
              creditTrem: creditTerm,
              expireDate
            }
            const res = await approveStorage(params)
            service.handleResponse(res, () => {
              // this.$store.dispatch('tagsView/delVisitedView', this.$route)
              // this.$router.push('/CreditManagement/creditApplicationApproval')
            }, '暂存成功')
          }
        }
      })
    },
    handleClick() {},
    mouthChange(val) {
      const { approveDate } = this.params
      if (approveDate) {
        const Milliseconds = moment(approveDate).valueOf() + val * 30 * 24 * 60 * 60 * 1000
        this.params.expireDate = moment(Milliseconds).format('YYYY-MM-DD')
        // debugger
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    submitFrom() {
      // const params = {
      //   ...this.params,
      //   creditNo: this.creditNo,
      //   approveDate: moment(this.params.approveDate).format('YYYY-MM-DD')
      // }
      // postEntity(params).then(res => {
      //   Message({ type: 'success', message: res.msg })
      //   this.$router.push('/CreditManagement/creditMaintain')
      // })
    },
    handleSelectionChange(val) {
      this.productIdList = val.map(item => item.id)
    },
    initEntities(params) {
      getEntityDetail(params).then(res => {
        this.detail = res.data || {}
        const fieldJson = JSON.parse(res.data.fieldJson)
        Object.keys(fieldJson).forEach(key => {
          this.fieldJsonArr.push({
            label: key,
            value: fieldJson[key]
          })
        })
        console.log(this.fieldJsonArr)
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.initEntities({ creditNo: this.creditNo })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #ecf0f9;
}
.tip {
  display: none;
}
.errorTip {
  display: block;
  color: red;
}

.formBox{
    display: flex;
    justify-content: space-between;
    .formBox-left {
      width: 75%;
      ::v-deep {
        .el-collapse-item__header {
          font-size: 16px;
          padding-left: 32px;
          background: #F5F7F9;
          margin-bottom: 20px;
        }
        .el-textarea__inner {
        min-height: 100px !important;
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
        }
     }
   }
   .formBox-right {
      width: 24%;
  }
  ::v-deep.el-card__body {
      padding: 0;
  }
}
</style>
