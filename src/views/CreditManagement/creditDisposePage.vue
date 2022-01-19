<template>
  <div>
    <!-- 授信审批处理 -->
    <creditDispose />
  </div>
</template>

<script>
export default {
  name: '',
  components: {
    creditDispose: resolve => require(['./components/creditDispose'], resolve)
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
