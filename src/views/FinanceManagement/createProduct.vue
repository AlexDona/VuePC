<template>
  <div>
    <!-- 新增产品 -->
    <commonProduct />
  </div>
</template>

<script>
export default {
  name: '',
  components: {
    commonProduct: resolve => require(['./commonProduct'], resolve)
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
