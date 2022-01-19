<!--查看用款-->
<template>
  <el-row :gutter="20">
    <el-form ref="formDetail" :model="previewData" label-width="160px" label-position="right">
      <el-collapse v-model="activeNameCol1" accordion>
        <el-collapse-item title="用款申请审批" name="1">
          <el-col :xs="12" :sm="12">
            <el-form-item label="用款申请编号">
              <span>{{ previewData.accountNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="客户名称">
              <span>{{ previewData.customerName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="资金方名称">
              <span>{{ previewData.fundName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="金融产品名称">
              <span>{{ previewData.productName }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="用款申请金额">
              <span>{{ previewData.accountAmount }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="用款申请日期">
              <span>{{ previewData.accountDate }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="已授信额度（元）">
              <span>{{ previewData.creditApproveLimit }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="已用额度（元）">
              <span>{{ previewData.loanUsedLimit }}</span>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-form-item label="剩余额度（元）">
              <span>{{ previewData.remainQuota }}</span>
            </el-form-item>
          </el-col>
          <el-col v-for="(item, key) in previewData.fieldJson" :key="key" :xs="12" :sm="12">
            <el-form-item :label="key" label-width="150px" prop="remainQuota">
              <span>{{ previewData.fieldJson[key] }}</span>
            </el-form-item>
          </el-col>
        </el-collapse-item>
      </el-collapse>
      <el-collapse v-if="previewData.orderList && previewData.orderList.length" v-model="activeNameCol2" accordion>
        <el-collapse-item title="订单列表" name="2">
          <el-table
            ref="multipleTable"
            :data="previewData.orderList"
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
              <el-table-column :key="key" :label="keysData[key]" :prop="key" min-width="200px;" />

            </template>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <footer>
      <el-button plain @click="cancel()">取消</el-button>
    </footer>
  </el-row>
</template>

<script>
export default {
  name: 'LoanView',
  props: {
    previewData: {
      type: Object,
      default: () => {}
    },
    keysData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fieldJson: this.previewData.fieldJson ? JSON.parse(this.previewData.fieldJson) : {},
      activeNameCol1: '1',
      activeNameCol2: '2'
    }
  },
  methods: {
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss" rel>
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
</style>
