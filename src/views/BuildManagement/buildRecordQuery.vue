<template>
  <!-- 建档查询 -->
  <buildRecordMaintain current-page="preview" />
</template>

<script>
export default {
  name: 'BuildRecordQuery',
  components: {
    buildRecordMaintain: resolve => require(['./buildRecordMaintain'], resolve)
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
