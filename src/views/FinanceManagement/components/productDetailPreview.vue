<template>
  <!-- 用户信息--查看 -->
  <div class="pagePreview">
    <!-- 查看 -->
    <el-form class="clearfix" label-position="right" label-width="160px">
      <el-col :xs="12" :sm="12">
        <el-form-item label="核心企业">
          <span>{{ previewData.coreCustName }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="资金方名称">
          <span>{{ previewData.fundName }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="金融产品名称">
          <span class="textStyle">{{ previewData.productName }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品简介">
          <span class="preLine textStyle">{{ previewData.productDesc }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品类型">
          <span>{{ previewData.productType === 1 ? '经营贷': '订单贷' }}</span>
        </el-form-item>
      </el-col>
      <el-col v-if="previewData.productType === 2" :xs="12" :sm="12">
        <el-form-item label="是否允许修改订单">
          <span>{{ previewData.isFixOrder === 1 ? '是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="额度区间(元)">
          <span v-format="'#,##0.00'">{{ Number(previewData.minLoanLimit) }}</span>
          <span>~</span>
          <span v-format="'#,##0.00'">{{ Number(previewData.maxLoanLimit) }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="利率区间（%/年）">
          <span>{{ previewData.minLoanRate }} - {{ previewData.maxLoanRate }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="期限区间(月)">
          <span>{{ previewData.minLoanTime }} - {{ previewData.maxLoanTime }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="还款方式">
          <span>{{ previewData.repaymentMethod }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="资金用途">
          <span>{{ previewData.loanPurpose }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="还款来源">
          <span>{{ previewData.repaymentSource }}</span>
        </el-form-item>
      </el-col>

      <el-col :xs="12" :sm="12">
        <el-form-item label="产品有效期">
          <span v-if="previewData.minValidLimit">{{ previewData.minValidLimit }} 至 {{ previewData.maxValidLimit }}</span>
          <span v-else> - </span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否单笔授信">
          <span>{{ previewData.isSingleTrust === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否循环额度">
          <span>{{ previewData.isLoopLoan === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否一企业一账号">
          <span>{{ previewData.isOneceAccount === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否受托支付">
          <span>{{ previewData.isEntrustPay === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="是否平台维护账号">
          <span>{{ previewData.isPlatformMaintainAccount === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="授信申请账号不为空">
          <span>{{ previewData.creditApplyAccountCanNull === 1 ?'是': '否' }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="12" :sm="12">
        <el-form-item label="产品状态">
          <!--           <span v-if="previewData.productStatus === 0">暂存</span> -->
          <span v-if="previewData.productStatus === 1">生效</span>
          <span v-if="previewData.productStatus === 2">失效</span>
        </el-form-item>
      </el-col>
    </el-form>
    <!--  <footer>
      <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
    </footer> -->
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    // 产品信息
    previewData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {
  },
  methods: {
    //  关闭
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      // this.$router.push('/FinanceManagement/productMaintain')
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.pagePreview {
  ::v-deep{
    .el-form-item {
      margin-bottom: 0;
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
.textStyle {
  width: 450px;
  word-wrap: break-word;
  display: block;
}
.btnStyle {
  margin-top: 30px;
}
</style>
