<template>
  <!-- 订单管理--订单查询 -->
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="订单信息" name="1">
        <orderQueryInfo />
      </el-tab-pane>
      <el-tab-pane label="收款单信息" name="2">
        <receiptInfo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import orderQueryInfo from './components/orderQueryInfo'
import receiptInfo from './components/receiptInfo'
export default {
  name: 'OrderList',
  components: {
    orderQueryInfo,
    receiptInfo
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
