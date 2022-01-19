<template>
  <div class="app-container">

    <el-collapse v-model="activeNames">
      <el-collapse-item v-show="detail.isOneceAccount === '1'" title="收款账户详情" name="1">
        <el-form class="container" label-width="180px" style="width: 50%">
          <el-form-item prop="fundName" label="收款账户名称">
            <el-input v-model.trim="detail.collAcctName" placeholder="请输入" :disabled="disabled" />
          </el-form-item>

          <el-form-item prop="productName" label="收款账户开户行">
            <el-input v-model.trim="detail.collBank" placeholder="请输入" :disabled="disabled" />
          </el-form-item>

          <el-form-item prop="productName" label="收款账户账号">
            <el-input v-model.trim="detail.collAcctNo" placeholder="请输入" :disabled="disabled" />
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <el-collapse-item title="授信申请批复" name="2">
        <el-form ref="rulesForm" :model="params" :rules="formRules" class="container" label-width="180px" style="width: 50%">
          <el-form-item prop="approveDate" label="授信申请批复日期" required>
            <el-date-picker v-model="params.approveDate" type="date" placeholder="选择日期" :picker-options="pickerOptions" />
          </el-form-item>

          <el-form-item prop="approveResult" label="授信结果" required>
            <!--            <el-input v-model.trim="params.approveResult" placeholder="请输入" clearable />-->
            <el-select v-model="params.approveResult">
              <el-option v-for="item in approveResultArr" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>

          <template v-if="params.approveResult==='pass'">
            <el-form-item prop="creditLimitAmt" label="授信额度(元)" :rules="creditLimitAmtRule">
              <el-input v-model.trim="params.creditLimitAmt" type="number" placeholder="请输入" maxlength="8" clearable />
            </el-form-item>

            <el-form-item prop="creditTrem" label="授信期限(月)" :rules="creditTremRule">
              <el-input v-model.trim="params.creditTrem" placeholder="请输入" maxlength="2" clearable />
            </el-form-item>

            <el-form-item prop="expireDate" label="授信到期日">
              <el-input v-model.trim="expireDate" placeholder="系统自动计算" disabled clearable />
            </el-form-item>

          </template>
          <el-form-item prop="comment" label="授信批复意见" :rules="commentRules">
            <el-input v-model="params.comment" type="textarea" placeholder="请输入" clearable />
          </el-form-item>
        </el-form>
      </el-collapse-item>

    </el-collapse>

    <div class="pd20 ">
      <el-button type="primary" @click="submitFrom()">提交</el-button>
      <el-button type="plain" @click="cancel">取消</el-button>
    </div>

  </div>

</template>

<script>
import { getEntityDetail, postEntity } from '@/api/CreditMgt/maintain.js'
// import { Message } from 'element-ui'
import moment from 'moment'
import { validzzs } from '@/utils/validate'

export default {
  name: '',
  data() {
    return {
      approveResultArr: [
        { label: '通过', value: 'pass' },
        { label: '拒绝', value: 'reject' },
        { label: '补充材料', value: 'return' }
      ],
      activeNames: ['1', '2'],
      params: {
        approveDate: '',
        approveResult: '',
        creditLimitAmt: '',
        creditTrem: ''
      },
      creditNo: '',
      detail: {},
      disabled: true,
      formRules: {
        approveDate: [
          { required: true, message: '请选择授信批复日期', trigger: ['blur', 'change'] }
        ],
        approveResult: [
          { required: true, message: '请选择授信批复结果', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000
        }
      }
    }
  },
  computed: {

    // 授信额度规则校验
    creditLimitAmtRule() {
      if (this.params.approveResult === 'pass') {
        return [
          { required: true, message: '请输入授信额度', trigger: 'blur' }
        ]
      } else {
        return []
      }
    },
    // 授信期限规则校验
    creditTremRule() {
      if (this.params.approveResult === 'pass') {
        return [
          { required: true, message: '请输入授信期限', trigger: 'blur' },
          { validator: validzzs }
        ]
      } else {
        return []
      }
    },
    // 批复意见规则校验
    commentRules() {
      if (this.params.approveResult === 'reject' || this.params.approveResult === 'return') {
        return [
          { required: true, message: '请输入批复意见', trigger: 'blur' }
        ]
      } else {
        return []
      }
    },
    // 授信到期日计算
    expireDate() {
      const currentTime = this.params.approveDate
      if (currentTime && +this.params.creditTrem) {
        return moment(currentTime).add(this.params.creditTrem, 'months').subtract(1, 'days').format('YYYY-MM-DD')
      } else {
        return ''
      }
    }
  },
  created() {
    this.creditNo = this.$route.query.creditNo
    this.initEntities({ creditNo: this.creditNo })
  },
  methods: {
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    submitFrom() {
      this.$refs['rulesForm'].validate((valid) => {
        if (valid) {
          const params = {
            ...this.params,
            creditNo: this.creditNo,
            approveDate: moment(this.params.approveDate).format('YYYY-MM-DD'),
            expireDate: this.expireDate
          }
          postEntity(params).then(res => {
            if (res.code === '0') {
              this.$message({ type: 'success', message: '操作成功' })
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
              this.$router.push('/CreditManagement/creditMaintain')
            } else {
              this.$message.warning(res.msg)
            }
          })
        } else {
          this.$message({ type: 'warning', message: '请完善授信批复信息' })
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.productIdList = val.map(item => item.id)
    },
    initEntities(params) {
      getEntityDetail(params).then(res => {
        this.detail = res.data || {}
      })
    },
    // 重置
    resetForm() {
      this.$refs['rulesFrom'].resetFields()
      this.initEntities({ creditNo: this.creditNo })
    }
  }
}
</script>

<style scoped>
.container{padding: 24px}
::v-deep .el-collapse-item__header {
  font-size: 16px;
  padding-left: 20px;
  background-color: #f5f7f9 !important;
}

</style>
