<template>
  <!-- 放款维护 -->
  <div class="loan-maintenance-wrapper">
    <el-tabs v-model="activeName">
      <el-tab-pane label="用款申请批复" :lazy="true" name="first">
        <loanApplyApprove v-if="Object.keys(applyDate).length > 0" :loan-id="loanId" :apply-date="applyDate" :keys-data="keysData" />
      </el-tab-pane>
      <el-tab-pane label="还款计划维护" :lazy="true" name="second">
        <loanPlanMaintain :loan-id="loanId" />
      </el-tab-pane>
      <el-tab-pane label="用款审批轨迹" :lazy="true" name="third">
        <div class="approveWorkflow">
          <el-table
            border
            :data="commentsData"
            style="width: 50%"
          >
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column prop="taskNode" label="审批节点" width="180" />
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
          <footer>
            <el-button plain @click="cancel()">关闭</el-button>
          </footer>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getLoanMaintain } from '@/api/loan'
export default {
  components: {
    loanApplyApprove: (resolve) => require(['./components/loan-apply-approve'], resolve),
    loanPlanMaintain: (resolve) => require(['./components/loan-plan-maintain'], resolve)
  },
  data() {
    return {
      activeName: 'first',
      loanId: '',
      applyDate: {}, // 放款详情数据
      keysData: {}, // 返回keys映射中文集合（订单表头）
      commentsData: []
    }
  },
  computed: {
  },
  created() {
    this.loanId = this.$route.query && Number(this.$route.query.id)
    this.requestLoanMaintenance()
  },
  methods: {
    requestLoanMaintenance() {
      const params = {
        loanId: this.loanId
      }
      getLoanMaintain(params).then((res) => {
        if (res.code === '0') {
          this.applyDate = res.data || {}
          this.commentsData = res.data.comments || []
          // 订单表头集合数据
          res.data.operateTableFieldConfList && res.data.operateTableFieldConfList.map(item => {
            this.keysData[item.fieldEnName] = item.fieldChName
          })
          if (!this.applyDate.collAcctName) {
            this.applyDate.collAcctName = res.data.fundName
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(error => {
        this.$message.error(error.response.data.msg)
      })
    },
    cancel() {
      this.$router.push('/LoanManagement/loan-maintenance-list')
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tabs__nav-scroll {
    padding-left: 20px;
  }
  .el-tabs__header {
    background: #fff;
    margin-bottom: 0;
  }
}
.loan-maintenance-wrapper {
  padding: 0 22px;
}
.approveWorkflow {
  padding: 20px;
  background-color: #fff;
  min-height: calc(100vh - 160px);
  footer {
    padding-top: 20px;
  }
}
</style>
