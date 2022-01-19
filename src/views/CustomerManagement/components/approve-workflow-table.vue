<template>
  <!-- 客户审批详情轨迹 -->
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
      <el-table-column label="审批节点" prop="remark2" />
      <el-table-column label="审批人" prop="createUser" />
      <el-table-column label="审批结果" prop="action">
        <template slot-scope="{ row }">
          {{ approveStatus[row.action] }}
        </template>
      </el-table-column>
      <el-table-column label="审批意见" prop="remark1" />
      <el-table-column label="审批时间" prop="createTime" />
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
      approveStatus: {
        1: '提交申请',
        2: '暂存',
        3: '通过',
        4: '拒绝',
        5: '退回',
        6: '领取',
        7: '退领'
      }

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
