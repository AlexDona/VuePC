<template>
  <!-- 建档审批核验  -->
  <div class="verification">
    <el-form :model="verifyList" label-position="right" label-width="170px">
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="是否白名单" prop="">
            <el-input v-model.trim="verifyList[4]" disabled class="selectWidth" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="isShow" :span="3">
          <el-button type="primary" @click="toCustVerfiy(custId, 4)">核查</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="三要素核查" prop="">
            <el-input v-model.trim="verifyList[0]" disabled class="selectWidth" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="isShow" :span="3">
          <el-button type="primary" @click="toCustVerfiy(custId, 0)">核查</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="是否失信被执行人" prop="">
            <el-input v-model.trim="verifyList[6]" disabled class="selectWidth" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="isShow" :span="3">
          <el-button type="primary" @click="toCustVerfiy(custId, 6)">核查</el-button>
        </el-col>
      </el-row>
      <el-row v-if="isShow" :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="审批意见" prop="">
            <el-input v-model.trim="comment" type="textarea" :rows="3" maxlength="300" class="selectWidth" placeholder="录入审批意见" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getverfiyList, custVerfiy, custAction } from '@/api/customer'
export default {
  name: '',
  components: {
  },
  props: {
    custId: {
      type: String,
      default: ''
    },
    pageMode: {
      type: String,
      default: ''
    },
    flag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      verifyList: {
        0: '', // 三要素核查
        1: '', // 营业执照核查
        2: '', // 经办人身份证核查
        3: '', // 法人身份证核查
        4: '', // 白名单核查
        5: '', // 企业法人执行案件信息核查
        6: '' // 企业的法院失信被执行人的执行案件信息核查
      },
      comment: '', // 审批意见
      isShow: false
    }
  },
  computed: {
  },
  watch: {},
  created() {
    this.isShow = this.pageMode !== 'preview' && this.flag === 'approve'
    // 获取核验列表
    this.getverfiyList()
  },
  mounted() {},
  methods: {
    // 获取核验列表
    getverfiyList() {
      getverfiyList(this.custId).then(res => {
        if (res.code === '0') {
          res.data && res.data.map(item => {
            this.verifyList[item.type] = item.result ? '通过' : '不通过'
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    // 核验
    toCustVerfiy(customerId, verifyType) {
      const params = {
        customerId,
        verifyType
      }
      custVerfiy(params).then(res => {
        if (res.code === '0' && res.data) {
          const obj = {}
          obj[res.data.type] = res.data.result ? '通过' : '不通过'
          this.verifyList = Object.assign(this.verifyList, obj)
          res.msg && this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    // 确认按钮，由父组件触发
    btnCustomer(mode) {
      if (!this.comment && (mode === 'reject' || mode === 'back')) {
        this.$message.warning('请填写审批意见')
        return
      }
      // 通过--白名单必须为是
      // 映射数据
      const paramsFilter = {
        pass: 3,
        reject: 4,
        back: 5
      }
      if (mode === 'pass' && this.verifyList[4] === '不通过') {
        this.$message.warning('当前客户不在白名单内，无法审批通过')
        return
      }
      const params = {
        customerId: this.custId,
        actionType: paramsFilter[mode],
        remark: this.comment
      }
      if (mode === 'reject' || mode === 'back') {
        this.$confirm(`请确认是否${mode === 'reject' ? '拒绝' : '退回'}该笔数据`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          custAction(params).then(res => {
            res.msg && this.$message.success(res.msg)
            this.$store.dispatch('tagsView/delVisitedView', this.$route)
            this.$router.push('/CustomerManagement/customerApprove')
          }).catch(err => {
            this.$message.error(err.response.data.msg)
          })
        }).catch(() => {})
      } else {
        custAction(params).then(res => {
          res.msg && this.$message.success(res.msg)
          this.$store.dispatch('tagsView/delVisitedView', this.$route)
          this.$router.push('/CustomerManagement/customerApprove')
        }).catch(err => {
          this.$message.error(err.response.data.msg)
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
