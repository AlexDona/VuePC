<template>
  <div class="container">
    <!-- 新增 -->
    <div class="formBox">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form ref="formDetail" :validate-on-rule-change="false" :model="detailData" :rules="pageType === 'preview'? {}: rules" label-position="right">
            <el-collapse v-model="activeNameCol1" accordion>
              <el-collapse-item title="授信申请详情" name="1">

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="授信申请编号" label-width="150px" prop="creditNo">
                      <el-input v-model.trim="detailData.creditNo" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="授信申请日期" label-width="150px" prop="applyDate">
                      <el-input v-model.trim="detailData.applyDate" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <el-collapse v-if="detailData.detailsData" v-model="activeNameCol2" accordion>
              <el-collapse-item title="审批详情" name="1">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款账户名称" label-width="150px" prop="collAcctName">
                      <el-input v-model.trim="detailData.collAcctName" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款账户开户行" label-width="150px" prop="collBank">
                      <el-input v-model.trim="detailData.collBank" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款账户账号" label-width="150px" prop="collAcctNo">
                      <el-input v-model.trim="detailData.collAcctNo" :disabled="true" class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-for="(val, key, index) in detailData.detailsData" :key="index + 'detailsData'" :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="key" :prop="'productAddCloumName'+ index" label-width="150px">
                      <el-input v-model.trim="detailData.detailsData[key]" disabled class="selectWidth" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <template v-if="userInfo.custTypeId === 6 || userInfo.custTypeId === 3 || userInfo.custTypeId === 4">
                      <el-form-item label="建议授信额度(元)" prop="adviceCreditLimitAmt" label-width="150px">
                        <el-input v-model.trim="detailData.adviceCreditLimitAmt" disabled class="selectWidth" placeholder="" clearable />
                      </el-form-item>
                    </template>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>

            <el-collapse v-model="activeNameCol3" accordion>
              <el-collapse-item title="授信申请批复" name="1">
                <el-row v-if="detailData.approveState === 'pass' || (pageType === 'preview' && detailData.creditApproveLimit)" :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="授信额度（元）" label-width="150px" prop="creditApproveLimit">
                      <el-input
                        v-model.number.trim="detailData.creditApproveLimit"
                        type="text"
                        maxlength="10"
                        :disabled="pageType === 'preview'"
                        class="selectWidth"
                        clearable
                        @input="val => {
                          val = val.replace(/\D/g,'')
                          // val = val.replace(/^0*(0\.|[1-9])/, '$1')
                          // val = val.replace(/[^\d.]/g,'') //清除数字和.以外的字符
                          // val = val.replace(/^\./g, '') //验证第一个字符是数字而不是字符
                          // val = val.replace(/\.{1,}/g, '.') //只保留第一个.清除多余的
                          // val = val .replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
                          // val = val.replace(/^(\-)*(\d*)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
                          // val = val.indexOf('.') > 0 ? val.split('.')[0].substring(0, 10) + '.' + val.split('.')[1] : val.substring(0, 10)
                          detailData.creditApproveLimit = val
                        }"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--                <el-row :gutter="20">-->
                <!--                  <el-col :span="12">-->
                <!--                    {{ detailData.creditApproveLimit }}-->
                <!--                    <el-form-item label="期限ssss（月）" label-width="150px" prop="creditApproveLimit">-->
                <!--                      <el-input v-model.trim="detailData.creditApproveLimit" class="selectWidth" clearable />-->
                <!--                    </el-form-item>-->
                <!--                  </el-col>-->
                <!--                </el-row>-->
                <el-row v-if="detailData.approveState === 'pass' || (pageType === 'preview' && detailData.creditTerm)" :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      label="期限（月）"
                      label-width="150px"
                      prop="creditTerm"
                    >
                      <el-input
                        v-model.number.trim="detailData.creditTerm"
                        type="text"
                        maxlength="3"
                        :disabled="pageType === 'preview'"
                        class="selectWidth"
                        clearable
                        @input="val => {
                          detailData.creditTerm = val.replace(/\D/g,'')}"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="detailData.approveState === 'pass' || (pageType === 'preview' && detailData.expireDate)" :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="授信到期日" label-width="150px" prop="expireDate">
                      <!--                      <el-date-picker-->
                      <!--                        v-model="detailData.expireDate"-->
                      <!--                        value-format="yyyy-MM-dd"-->
                      <!--                        type="date"-->
                      <!--                        placeholder="选择日期"-->
                      <!--                        :picker-options="pickerOptions"-->
                      <!--                        :disabled="pageType === 'preview'"-->
                      <!--                      />-->
                      <el-input v-model.trim="expireDate" placeholder="系统自动计算" disabled clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="approveState" label-width="150px" label="授信结果">
                      <!--            <el-input v-model.trim="params.approveResult" placeholder="请输入" clearable />-->
                      <el-select v-model="detailData.approveState" width="100%" :disabled="pageType === 'preview'">
                        <el-option v-for="item in approveResultArr" :key="item.value" :value="item.value" :label="item.label" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="'审批意见'" prop="comment" label-width="150px">
                      <el-input v-model="detailData.comment" :disabled="pageType === 'preview'" type="textarea" maxlength="150" style="with: 150px" />
                      <!--                      <el-row v-if="errorTip" :class="['tip', {'errorTip': errorTip && !comment.length}]">请输入审批意见</el-row>-->
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-col>
        <el-col :span="8">
          <widget-image title="授信申请影像" :filetype-list="fileTypeList" :file-list.sync="fileList" opr-type="preview" :params="params" :credit-no="creditNo" />
        </el-col>
      </el-row>
    </div>
    <el-row class="footer">
      <el-button v-if="pageType !== 'preview'" class="btnStyle" type="primary" @click="handleSubmitApprove('save')">暂存</el-button>
      <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
      <el-button v-if="pageType !== 'preview'" class="btnStyle success" type="primary" @click="handleSubmitApprove(detailData.approveState)">提交</el-button>
      <!--      <el-button v-if="pageType !== 'preview'" class="btnStyle continue" type="primary" @click="handleSubmitApprove('return')">补充资料</el-button>-->
      <!--      <el-button v-if="pageType !== 'preview'" class="btnStyle refuse" type="primary" @click="handleSubmitApprove('reject')">拒绝</el-button>-->
    </el-row>
  </div>
</template>

<script>
import widgetImage from '@/views/components/widget-image'
import { approveSubmit, approveStorage, approveStorageView } from '@/api/credit'
// import { getProductDetail } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'

export default {
  name: 'CreditDetail',
  components: {
    widgetImage
  },
  props: {
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
      approveResultArr: [
        { label: '通过', value: 'pass' },
        { label: '拒绝', value: 'reject' },
        { label: '补充材料', value: 'return' }
      ],
      approveState: {
        0: '待审批',
        1: '审批通过',
        2: '审批拒绝',
        3: '补充资料',
        4: '平台维护'
      },
      num: 0,
      formDetail: 'formDetail',
      rules: {
        approveState: [
          { required: true, message: '请选择授信批复结果', trigger: 'blur' }
        ]
        // productAddCloumNameValue: [
        //   // { required: true, message: '必填内容', trigger: 'change' }
        //   { required: true, validator: this.checkValue, trigger: 'change' }
        // ],
      },
      userInfo: getUserInfo(),
      detailsData: [],
      pageType: this.$route.query.type,
      errorTip: false,
      fileList: [],
      fileTypeList: [{
        idx: '0',
        name: '授信申请影像'
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
      params: {
        objectId: this.$route.query.creditNo
      },
      flag: false
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
        if (val.fieldJson) {
          this.detailData.detailsData = JSON.parse(val.fieldJson)
        }

        if (this.detailData.approveState === 'pass') {
          this.$refs['formDetail'].clearValidate(['comment'])
          this.rules = {
            approveState: [
              { required: true, message: '请选择授信批复结果', trigger: 'blur' }
            ],
            creditApproveLimit: [
              { required: true, message: '请输入授信额度', trigger: 'blur' }
            ],
            creditTerm: [
              { required: true, message: '请输入期限', trigger: 'blur' }
            ],
            expireDate: [
              { required: true, message: '请输入授信到期日', trigger: 'blur' }
            ],
            comment: [
              { required: false, message: '请输入审批意见', trigger: 'blur' }
            ]
          }
        } else {
          // this.$refs['formDetail'].clearValidate()
          this.rules = {
            approveState: [
              { required: true, message: '请选择授信批复结果', trigger: 'blur' }
            ],
            comment: [
              { required: true, message: '请输入审批意见', trigger: 'blur' }
            ]
          }
        }

        if (this.pageType !== 'preview' && !this.flag) {
          this.getPreviewData()
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
  },
  methods: {
    async getPreviewData() {
      const res = await approveStorageView({
        creditNo: this.creditNo
      })
      if (res.code === '0') {
        console.log(this.detailData, 'detailDataxxxxxxxxx')

        this.comment = res.data?.comment || null
        // if (res.data && res.data.approveResult === 'save') {
        //   res.data.approveResult = null
        // }
        // } else if (res.data.approveResult === 'pass') {
        //   res.data.approveResult = '通过'
        // } else if (res.data.approveResult === 'reject') {
        //   res.data.approveResult = '拒绝'
        // } else {
        //   res.data.approveResult = '补充资料'
        // }
        const newObj = Object.assign(this.detailData, res.data)
        newObj.creditApproveLimit = newObj.creditLimitAmt // 同步newObj响应
        newObj.creditTerm = newObj.creditTrem
        if (newObj.approveResult) {
          newObj.approveState = newObj.approveResult
        }

        // this.detailData = newObj
        // this.$emit('update: detailData', newObj)
      } else {
        this.$message.error(res.msg)
      }
    },
    checkValue(rule, value, callback) {
      console.log(rule, value, callback)
    },
    // getConfig() {
    //   const detailsData = []
    //   getProductDetail({
    //     productId: this.productId
    //   }).then(res => {
    //     if (res.code === '0') {
    //       const filedJSON = JSON.parse(this.detailData.fieldJson)
    //       console.log(filedJSON, 'filedJSON')
    //       const newDetailData = Object.assign({}, this.detailData)
    //       res.data.productMaterialAddList.filter((item, index) => {
    //         if (item.materialType === 1 && item.productAddCloumType === 1) { // materialType 授信1 2用款资料  productAddCloumType 1普通字段 2 影像资料
    //           item.productAddCloumNameValue = filedJSON[item.productAddCloumName] || null
    //           detailsData.push(item)
    //         }
    //       })
    //       // const newRule = Object.assign({}, this.rules)
    //       detailsData.map((item, index) => { // 避免出现校验bug,把所有配置值赋值到detailData，通过遍历索引index设置prop
    //         newDetailData['productAddCloumName' + index] = filedJSON[item.productAddCloumName] || null
    //         // newRule[ 'productAddCloumName' + index] = { required: true, message: '必填内容', trigger: 'change' }
    //       })
    //       // this.rules = newRule // 设置新增配置项校验
    //       // 防止一进页面触发校验
    //       newDetailData.detailsData = detailsData // 设置遍历数组方便循环遍历
    //
    //       // this.$emit('update:detailData', newDetailData)
    //       // 设置配置校验规则
    //       // detailsData.map(item => {
    //       //   this.$set(this.rules)
    //       // })
    //       console.log(this.detailData, 'this.detailData')
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   })
    // },
    async handleSubmitApprove(type) {
      this.detailData.expireDate = this.expireDate
      // console.log(this.detailData, 'detailData')
      if (type === 'save') {
        const approveStatus = this.detailData.approveState
        const params = {
          // approveDate: this.detailData.approveDate || null,
          approveResult: approveStatus,
          comment: this.detailData.comment,
          creditLimitAmt: approveStatus !== 'pass' ? null : this.detailData.creditApproveLimit || null,
          creditNo: this.detailData.creditNo || null,
          creditTrem: approveStatus !== 'pass' ? null : this.detailData.creditTerm || null,
          expireDate: approveStatus !== 'pass' ? null : this.detailData.expireDate || null
        }
        console.log(params, 'saveparams')
        const res = await approveStorage(params)
        if (res.code === '0') {
          // console.log(res)
          this.$message.success('暂存成功')
          // this.$router.push({
          //   path: '/CreditManagement/creditApproval'
          // })
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$refs['formDetail'].validate(async valid => {
          // console.log(valid, 'valid')
          if (valid) {
            const params = {
              // approveDate: this.detailData.approveDate || null,
              approveResult: type,
              comment: this.detailData.comment || '',
              creditLimitAmt: this.detailData.creditApproveLimit || null,
              creditNo: this.detailData.creditNo || null,
              creditTrem: this.detailData.creditTerm || null,
              expireDate: this.detailData.expireDate || null
            }
            const res = await approveSubmit(params)
            if (res.code === '0') {
              // console.log(res)
              this.$message.success('操作成功')
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
              this.$router.push({
                path: '/CreditManagement/creditApproval'
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
.container {
  .success {
    border: none;
    background: var(--theme);
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
  .form-title {
    margin-top: 0;
    padding: 13px 32px;
    background-color: #F5F7F9;
    margin-bottom: 13px;
  }
  .footer {
    margin-top: 20px;
  }
}
</style>
