<template>
  <div class="app-container">
    <p>列表名称：{{ customListName }}</p>
    <el-table
      ref="table"
      :data="listData"
      stripe
      border
      style="width: 100%;"
      :max-height="curHeight"
      :header-cell-style="{
        background: '#F2F5FF',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="字段编号" prop="fieldNo" min-width="200px;" />
      <el-table-column label="字段名称" prop="fieldName" min-width="140px;" />
      <el-table-column label="字段类型" prop="fieldType" min-width="140px;" />
      <el-table-column label="长度" prop="fieldLength" min-width="140px;" />
      <el-table-column label="对接方式" prop="dockingMethod" min-width="140px;">
        <template slot-scope="{ row }">
          <span>{{ row.dockingMethod === 1 ? 'Excel' : '接口' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否为查找项" prop="searchItemFlag" min-width="140px;">
        <template slot-scope="{ row }">
          <span>{{ row.searchItemFlag === 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;">
      <el-button type="primary" @click="cancel()">返回</el-button>
    </div>
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageParam.pageSize"
      :page.sync="pageParam.pageIndex"
      @pagination="getlistData"
    /> -->
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import { selectListDetail } from '@/api/config'

export default {
  // components: {
  //   Pagination
  // },
  mixins: [curHeight],
  data() {
    return {
      total: 0,
      pageParam: {
        asc: true,
        orderBy: '',
        pageIndex: 1,
        pageSize: 15
      },
      listData: [],
      customListName: null
    }
  },
  created() {
    const { customId } = this.$route.query
    this.customListName = this.$route.query && this.$route.query.customListName
    selectListDetail({
      configurationId: customId
    }).then(res => {
      this.listData = res.data || []
    })
  },
  methods: {
    cancel() {
      this.$router.go(-1)
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  color: #3E495B;
  font-size: 14px;
  font-weight: bold;
}
</style>
