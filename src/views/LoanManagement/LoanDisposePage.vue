<template>
  <div>
    <!-- 授信审批处理 -->
    <loanDispose />
  </div>
</template>

<script>
export default {
  name: 'LoanDisposePage',
  components: {
    loanDispose: resolve => require(['./components/loanDispose'], resolve)
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
