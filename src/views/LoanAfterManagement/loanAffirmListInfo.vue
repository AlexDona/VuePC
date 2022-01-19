<template>
  <div>
    <!-- 还款列表查看 -->
    <loanMaintainList />
  </div>
</template>

<script>
export default {
  name: '',
  components: {
    loanMaintainList: resolve => require(['./refund-affirm-info'], resolve)
  },
  // 定义属性
  data() {
    return {
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
  }
}
</script>

<style scoped>
</style>
