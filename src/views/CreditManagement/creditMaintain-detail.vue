<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="params" class="container" label-width="180px" style="width: 50%">
      <el-collapse v-model="activeNames">
        <!-- 账号状态为已维护才会有收款账户详情信息 -->
        <template>
          <el-collapse-item title="收款账户详情" name="1">
            <el-form-item prop="fundName" label="收款账户名称">
              <el-input v-model.trim="detail.collAcctName" placeholder="" disabled clearable />
            </el-form-item>

            <el-form-item prop="collBank" label="收款账户开户行" disabled>
              <el-input v-model.trim="detail.collBank" placeholder="" disabled clearable />
            </el-form-item>

            <el-form-item prop="collAcctNo" label="收款账户账号" disabled>
              <el-input v-model.trim="detail.collAcctNo" placeholder="" disabled clearable />
            </el-form-item>
          </el-collapse-item>
        </template>

        <el-collapse-item title="授信申请批复" name="2">
          <el-form-item prop="approveDate" label="授信申请批复日期">
            <el-date-picker v-model="detail.approveDate" type="date" disabled placeholder="选择日期" />
          </el-form-item>

          <el-form-item prop="approveResult" label="授信结果">
            <!--            <el-input v-model.trim="params.approveResult" placeholder="请输入" clearable />-->
            <el-select v-model="detail.approveState" disabled>
              <el-option v-for="item in approveResultArr" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>

          <el-form-item prop="creditLimitAmt" label="授信额度（元）">
            <el-input v-model.trim="detail.creditApproveLimit" placeholder="" disabled clearable />
          </el-form-item>

          <el-form-item prop="creditTrem" label="授信期限（月）">
            <el-input-number v-model.trim="detail.creditTerm" :min="0" :max="12" placeholder="" disabled clearable @input="mouthChange" />
          </el-form-item>

          <el-form-item prop="expireDate" label="授信到期日">
            <el-input v-model.trim="detail.expireDate" placeholder="" disabled clearable />
          </el-form-item>

          <el-form-item prop="comment" label="授信批复意见">
            <el-input v-model.trim="detail.approveComment" type="textarea" placeholder="" disabled clearable />
          </el-form-item>
        </el-collapse-item>

      </el-collapse>
      <div class="pd20">
        <el-button type="plain" @click="cancel">关闭</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
import { getDescByParam, postEntity } from '@/api/CreditMgt/maintain.js'
import { Message } from 'element-ui'
import moment from 'moment'

export default {
  name: 'FinancialList',
  data() {
    return {
      approveResultArr: [
        { label: '待审批', value: 0 },
        { label: '审批通过', value: 1 },
        { label: '审批拒绝', value: 2 },
        { label: '审批退回(补充资料)', value: 3 },
        { label: '资金方审批|平台维护', value: 4 },
        { label: '结清', value: 6 }
      ],
      activeNames: ['1', '2'],
      params: {},
      creditNo: '',
      acctState: '', // 账号状态
      detail: {}
    }
  },
  created() {
    this.creditNo = this.$route.query.creditNo
    this.acctState = Number(this.$route.query.acctState)
    this.initEntities({ creditNo: this.creditNo })
  },
  methods: {
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
      const params = {
        ...this.params,
        creditNo: this.creditNo,
        approveDate: moment(this.params.approveDate).format('YYYY-MM-DD')
      }
      postEntity(params).then(res => {
        Message({ type: 'success', message: '操作成功' })
        this.$router.push('/CreditManagement/creditMaintain')
      })
    },
    handleSelectionChange(val) {
      this.productIdList = val.map(item => item.id)
    },
    initEntities(params) {
      getDescByParam(params).then(res => {
        this.detail = res.data || {}
        console.log(this.detail, 12313)
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.initEntities({ creditNo: this.creditNo })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .container{padding: 24px}
</style>
