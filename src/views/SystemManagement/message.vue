<template>
  <div class="mergeOffsetTable-wrapper">
    <span class="span-title">历史消息</span>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="未读" name="first">
        <el-table v-loading="loading" :data="tableData" style="width: 70%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            type="index"
            width="80"
          >
            <template slot="header" slot-scope="">
              <span class="markReaded" @click="markReaded">标记已读</span>
            </template>
          </el-table-column>
          <el-table-column
            label=""
            prop="createTime"
            width="160"
          />
          <el-table-column
            label=""
            prop="content"
          />
          <el-table-column
            align="right"
            width="50"
          >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.hasRead"
                size="mini"
                type="text"
                @click="handleEdit(scope.$index, scope.row)"
              >已读</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已读" name="second">
        <el-table v-loading="loading" :data="tableData" style="width: 70%">
          <el-table-column
            type="index"
            width="110"
            align="center"
          >
            <template slot="header" slot-scope="">
              <span>所有已读信息</span>
            </template>
          </el-table-column>
          <el-table-column
            label=""
            prop="createTime"
            width="160"
          />
          <el-table-column
            label=""
            prop="content"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page.pageIndex" :limit.sync="listQuery.page.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getMessage, haveRead } from '@/api/remind'

export default {
  // name: 'message',
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: {
          pageIndex: 1,
          pageSize: 15
        },
        flag: 0
      },
      activeName: 'first',
      tableData: [],
      total: 0,
      tableCheckedArr: [],
      loading: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listQuery.flag = this.activeName === 'first' ? 0 : 1
      getMessage(this.listQuery).then(res => {
        this.loading = false
        this.tableData = res.data.list || []
        this.tableData.length && this.tableData.map(res => {
          res.hasRead = this.activeName === 'second'
        })
        this.total = res.data.total
        this.activeName === 'first' && this.$store.commit('user/SET_MSG_TOTAL', res.data.total)
      })
    },
    handleClick(tab, event) {
      this.listQuery.page.pageIndex = 1
      this.getList()
    },
    handleEdit(index, row) {
      this.updateTableData([row.id])
    },
    markReaded() {
      const vm = this
      if (!vm.tableCheckedArr.length) {
        this.$message.warning('请先选择要标记的消息')
        return
      }
      vm.updateTableData(vm.tableCheckedArr.map(res => {
        return res.id
      }))
    },
    updateTableData(ids) {
      // const vm = this
      haveRead({
        ids: ids
      }).then(res => {
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.tableCheckedArr = val
    }
  }
}
</script>

<style lang="scss" scoped>
.mergeOffsetTable-wrapper{
  padding: 0px 22px 22px;
  margin: 0 22px;
  background: #fff;

  .span-title{
    display: block;
    padding: 14px 0 14px;
    color: #3E495B;
    font-size: 14px;
  }
  .explain{
    font-size: 12px;
    color: #8090B0;
  }
}
.markReaded {
  cursor: pointer;
  color: var(--theme);
}
</style>
