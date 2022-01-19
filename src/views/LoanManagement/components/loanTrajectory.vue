<template>
  <div class="content">
    <el-table
      :data="comments || []"
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
      <el-table-column label="审批节点" prop="taskNode" min-width="240px;" />
      <el-table-column label="审批人" prop="receiverName" min-width="240px;" />
      <el-table-column label="审批意见" prop="comment" min-width="240px;">
        <template slot-scope="scope">
          <span class="preLine">{{ scope.row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批时间" prop="approvalTime" min-width="240px;" />

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="detailData.comments && detailData.comments.length"
      :total="detailData.comments ? detailData.comments.length : 0"
      :limit.sync="pageSize"
      :page.sync="pageIndex"
      @pagination="handlePage"
    />
    <RouteMap class="route-map"></RouteMap>
    <el-row class="footer">
      <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
    </el-row>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import RouteMap from '@/components/RouteMap'

export default {
  name: 'CreditTrajectory',
  components: {
    Pagination,
    RouteMap
  },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      pageSize: 15,
      pageIndex: 1
    }
  },
  computed: {
    comments: {
      get() {
        return this.detailData.comments && this.detailData.comments.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      },
      set(val) {
        return val
      }
    }
  },
  created() {
  },
  methods: {
    handlePage(page) {
      this.pageSize = page.limit
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background: #fff;
  padding: 24px;
  .route-map {
    margin-top: 75px;
  }
  .footer {
    margin-top: 20px;
  }
}
</style>
