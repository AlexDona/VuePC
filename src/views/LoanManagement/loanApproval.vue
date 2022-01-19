<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待处理" :lazy="true" name="1">
        <loan-unapprovaled />
      </el-tab-pane>
      <el-tab-pane label="已处理" :lazy="true" name="2">
        <loan-approvaled />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import loanUnapprovaled from './components/loanUnapprovaled'
import loanApprovaled from './components/loanApprovaled'
export default {
  name: 'LoanApproval',
  components: {
    loanApprovaled,
    loanUnapprovaled
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
