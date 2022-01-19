<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTab">
      <el-tab-pane v-for="(item, index) in panelData" :key="'panel' + index" :label="item.label" :name="item.name">
        <content-panel :table-data.sync="tableData" :type="+item.name" @getList="getTableData" @getTableData="getTableData">
          <template v-if="item.name !== '5'" #pagination>
            <!-- 分页器 -->
            <pagination
              v-show="total > 0"
              :total="total"
              :limit.sync="listQuery.pageSize"
              :page.sync="listQuery.pageIndex"
              @pagination="handlePage($event, +item.name)"
            />
          </template>
        </content-panel>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import contentPanel from './components/contentPanel'
import { queryCustomerReport, queryCreditReport, queryLoanApplyReport, queryRepaymentReport, getCustomizeSqlList } from '@/api/MyStatements'

export default {
  name: 'MessageConfigList',
  components: {
    contentPanel,
    Pagination
  },
  data() {
    /**
     ** msgType 场景类型：1 登录，2 授信，3 放款，4 贷后
     * */
    return {
      panelData: (() => {
        if (getUserInfo().custTypeId === 6 && getUserInfo().adminFlag === 1) {
          return [
            {
              name: '1',
              label: '客户统计表'
            },
            {
              name: '2',
              label: '授信统计表'
            },
            {
              name: '3',
              label: '用款统计表'
            },
            {
              name: '4',
              label: '还款统计表'
            },
            {
              name: '5',
              label: '其他统计表'
            }
          ]
        } else {
          return [
            {
              name: '1',
              label: '客户统计表'
            },
            {
              name: '2',
              label: '授信统计表'
            },
            {
              name: '3',
              label: '用款统计表'
            },
            {
              name: '4',
              label: '还款统计表'
            }
          ]
        }
      })(),
      tableData: [],
      activeName: '1',
      total: 0,
      listQuery: {
        asc: true,
        orderBy: '',
        pageIndex: 1,
        pageSize: 15
      }
    }
  },
  created() {
    this.getTableData(1)
  },
  methods: {
    handlePage(page, type) {
      console.log(page, type)
      this.listQuery.pageSize = page.limit
      this.getTableData(type)
      // console.log(page)
    },
    handleTab(el) {
      this.listQuery.pageSize = 15
      this.listQuery.pageIndex = 1
      this.getTableData(+el.index + 1)
    },
    async getTableData(type) {
      if (type === 1) {
        const res = await queryCustomerReport(this.listQuery)
        if (res.code === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
          console.log({ res })
        } else {
          this.$message.warning(res.msg)
        }
      } else if (type === 2) {
        const res = await queryCreditReport(this.listQuery)
        if (res.code === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
          console.log({ res })
        } else {
          this.$message.warning(res.msg)
        }
      } else if (type === 3) {
        const res = await queryLoanApplyReport(this.listQuery)
        if (res.code === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
          console.log({ res })
        } else {
          this.$message.warning(res.msg)
        }
      } else if (type === 4) {
        const res = await queryRepaymentReport(this.listQuery)
        if (res.code === '0') {
          this.tableData = res.data.list
          this.total = res.data.total
          console.log({ res })
        } else {
          this.$message.warning(res.msg)
        }
      } else {
        const res = await getCustomizeSqlList(this.listQuery)
        if (res.code === '0') {
          this.tableData = res.data
          console.log({ res })
        } else {
          this.$message.warning(res.msg)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep {
    .dialogStyle {
      .el-dialog__body {
        //padding-bottom: 0;
      }
    }
    .el-alert {
      height: 48px;
      line-height: 48px;
      .el-alert__title {
        color: #3E495B;
        img {
          display: inline-block;
          vertical-align: text-bottom;
        }
      }
    }
    .el-tabs__header.is-top {
      margin: 0;
    }
  }
  .label {
    color: #aaa;
  }
}
</style>
