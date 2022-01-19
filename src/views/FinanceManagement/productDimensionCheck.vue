<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :lazy="true" label="产品详情" name="1">
        <product-dimension-detail :detail-data.sync="detailData" />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="分配详情" name="2">
        <product-distribution-detail />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import productDimensionDetail from './components/productDimensionDetail'
import ProductDistributionDetail from './components/productDistributionDetail'
import { getProductDetail } from '@/api/finance'

export default {
  name: 'ProductDimensionCheck',
  components: {
    ProductDistributionDetail,
    productDimensionDetail
  },
  data() {
    return {
      activeName: '1', // 当前tab， 默认展示第一个tab
      detailData: {}
    }
  },
  watch: {
    '$route.query.productId'(val) {
      if (this.$route.query.productId) {
        this.getDetailData()
      }
    }
  },
  created() {
    this.getDetailData()
  },
  methods: {
    async getDetailData() {
      const res = await getProductDetail({
        productId: this.$route.query.productId
      })
      // console.log(res, 'res')

      if (res.code === '0') {
        this.detailData = res.data.productInfo
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
