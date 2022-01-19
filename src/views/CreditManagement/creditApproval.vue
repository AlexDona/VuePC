<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待处理" name="1">
        <credit-unapprovaled />
      </el-tab-pane>
      <el-tab-pane label="已处理" name="2">
        <credit-approvaled />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import creditUnapprovaled from './components/creditUnapprovaled'
import creditApprovaled from './components/creditApprovaled'
export default {
  name: 'CreditApproval',
  components: {
    creditApprovaled,
    creditUnapprovaled
  },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  padding: 24px 22px;
}
</style>
