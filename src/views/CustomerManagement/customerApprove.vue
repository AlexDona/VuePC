<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="0" :lazy="true">
        <approvePage v-if="activeName === '0'" :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="已处理" name="1" :lazy="true">
        <approvePage v-if="activeName === '1'" :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: '',
  components: {
    approvePage: resolve => require(['./components/approve-page'], resolve)
  },
  // 定义属性
  data() {
    return {
      activeName: '0'
    }
  },
  computed: {
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    // 切换tabs
    handleClick() {

    }
  }
}
</script>

<style scoped>
</style>
