<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="金融产品维度" name="1">
        <product-dimension />
      </el-tab-pane>
      <el-tab-pane label="企业维度" name="2">
        <company-dimension />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import productDimension from './components/productDimension'
import companyDimension from './components/companyDimension'
export default {
  name: 'ProductList',
  components: {
    productDimension,
    companyDimension
  },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
