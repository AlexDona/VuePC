<!--查看流程配置-->
<template>
  <div class="app-container">
    <div class="container mt48">
      <el-button type="primary" style="cursor: unset">申请人 提交申请</el-button>
      <div v-for="item in configList" :key="item.id">
        <div class="add-config" />
        <el-button v-if="item.custName" type="primary" style="width:100%; cursor: unset">{{ item.custName }}</el-button>
        <el-button v-else type="primary" style="width:100%; cursor: unset">{{ item.flowNode }} <span v-if="item.custLevel"> - 向上{{ item.custLevel }}级</span></el-button>
      </div>
      <div class="add-config" />
      <el-button type="primary" style="width:100%; cursor: unset">平台维护/资金方维护</el-button>
    </div>
    <div class="footer pd20">
      <el-button type="plain" @click="cancel()">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { queryFlowNodeById } from '@/api/WorkflowConfig'

export default {
  name: 'WorkflowConfigView',
  data() {
    return {
      configList: []
    }
  },
  created() {
    this.queryFlowById()
  },
  methods: {
    async queryFlowById() {
      const res = await queryFlowNodeById(this.$route.query.id)
      if (res.code === '0') {
        console.log(res)
        this.configList = res.data.nodeList
      } else {
        this.$message.warning(res.msg)
      }
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .container {
    margin: 48px auto;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 60px;
    .add-config {
      display: flex;
      margin: 0 auto;
      justify-content: center;
      background: url('../../assets/arrow.svg') no-repeat center center;
      background-size: contain;
      width: 30px;
      height: 120px;
    }
  }
}
</style>
