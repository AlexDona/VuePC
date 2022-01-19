<template>
  <!-- 修改详情 -->
  <div class="tableStyle">
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="修改字段" prop="propertyCh" />
      <el-table-column label="修改前" prop="beforeValue" />
      <el-table-column label="修改后" prop="afterValue" />
      <el-table-column label="修改人" prop="updateUser" />
      <el-table-column label="修改时间" prop="updateTime" />
    </el-table>
  </div>
</template>

<script>

export default {
  name: '',
  components: {
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
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
.tableStyle {
  padding: 20px;
}
</style>
