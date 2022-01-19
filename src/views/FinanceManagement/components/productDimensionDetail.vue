<template>
  <div class="app-container">
    <el-form label-position="right" label-width="140px" class="clearfix">
      <el-col :xs="12" :sm="12">
        <el-form-item label="核心企业">
          <span>{{ detailData.coreCustName }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="资金方名称"><span>{{ detailData.fundName }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="金融产品名称"><span>{{ detailData.productName }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品简介">
          <span class="preLine textStyle">{{ detailData.productDesc }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品类型">
          <span>{{ detailData.productType === 1 ? '经营贷': '订单贷' }}</span>
        </el-form-item>
      </el-col>
      <el-col v-if="detailData.productType === 2" :xs="12" :sm="12">
        <el-form-item label="是否允许修改订单">
          <span>{{ detailData.isFixOrder === 1 ? '是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="额度区间(元)">
          <span v-format="'#,##0.00'">
            {{ detailData.minLoanLimit }}
          </span>
          <span>-</span>
          <span v-format="'#,##0.00'">
            {{ detailData.maxLoanLimit }}
          </span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="利率区间（%/年）"><span>{{ detailData.minLoanRate }} - {{ detailData.maxLoanRate }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="期限区间(月)"><span>{{ detailData.minLoanTime }} - {{ detailData.maxLoanTime }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="还款方式"><span>{{ detailData.repaymentMethod }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="资金用途"><span>{{ detailData.loanPurpose }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="还款来源"><span>{{ detailData.repaymentSource }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否单笔授信"><span>{{ detailData.isSingleTrust === 1 ?'是': '否' }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否循环额度"><span>{{ detailData.isLoopLoan === 1 ?'是': '否' }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品有效期"><span>{{ detailData.minValidLimit }} - {{ detailData.maxValidLimit }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否受托支付"><span>{{ detailData.isEntrustPay === 1 ?'是': '否' }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否平台维护账号">
          <span>{{ detailData.isPlatformMaintainAccount === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="授信申请账号不为空">
          <span>{{ detailData.creditApplyAccountCanNull === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="贷后订单数据推送"><span>{{ detailData.isPushOrder === 1 ?'是': '否' }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="贷后收款单数据推送"><span>{{ detailData.isPushBill === 1 ?'是': '否' }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="核心企业授信申请审批"><span>{{ detailData.isGroupCompApprove === 1 ?'是': '否' }}</span></el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品状态" prop="productStatus">
          <!-- <el-radio v-model="listQuery.productStatus" :label="0">暂存</el-radio> -->
          <span>{{ detailData.productStatus === 1 ?'生效': '失效' }}</span>
          <!--          <el-radio v-model="detailData.productStatus" :label="1">生效</el-radio>-->
          <!--          <el-radio v-model="detailData.productStatus" :label="2">失效</el-radio>-->
        </el-form-item>
      </el-col>
      <el-col>
        <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ProductDimensionDetail',
  props: {
    detailData: {
      type: Object,
      default: () => {}
    },
    // 产品信息
    previewData: {
      type: Object,
      default: () => {}
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

<style lang="scss" scoped>
::v-deep .el-form-item__label{
  color: #aaa;
  font-weight: normal;
}
</style>
