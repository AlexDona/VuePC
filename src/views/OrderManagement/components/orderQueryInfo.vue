<!--订单信息-->
<template>
  <div v-if="tableHeader" class="container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custCode">
            <el-input v-model="listQuery.custCode" clearable :placeholder="tableHeader === 1 ? '经销商编号' : '客户编号'" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model="listQuery.custName" clearable :placeholder="tableHeader === 1 ? '经销商名称' : '客户名称'" />
          </el-form-item>
        </el-col>
        <el-col :sm="8" :xs="8">
          <el-form-item>
            <el-button type="primary" @click="getFundOrderPage('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              download-url="/business/saleorder/exportFundOrder"
              method-type="post"
              :params="listQuery"
              file-name="订单查询列表数据"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="tableLabel.length > 0" class="checkboxGroup">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" class="allCheck" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="checkList">
        <template v-for="(item,index) in tableLabel">
          <el-checkbox v-if="index>5" :key="index" :label="item.monthValue" @change="handleCheckGroup" />
        </template>
      </el-checkbox-group>
    </div>
    <el-table
      :data="orderList"
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
      <el-table-column :label="tableHeader === 1 ? '经销商编号' : '客户编号'" prop="custCode" min-width="140px;" />
      <el-table-column :label="tableHeader === 1 ? '经销商名称' : '客户名称'" show-overflow-tooltip prop="custName" min-width="160px;" />
      <template v-if="tableHeader === 1">
        <!-- <el-table-column label="订单号" show-overflow-tooltip prop="saleBillNo" min-width="200px;" /> -->
        <el-table-column label="订单日期" prop="billDate" width="240px;" />
        <el-table-column label="订单金额(元)" align="right" prop="taxAmt" min-width="140px;">
          <template slot-scope="{ row }">
            <span v-format="'#,##0.00'">{{ row.taxAmt }}</span>
          </template>
        </el-table-column>
      </template>
      <template v-if="tableLabel.length > 0">
        <el-table-column label="采购金额(元)" min-width="160px;">
          <template v-for="(item,index) in tableLabel">
            <el-table-column v-if="checkList.includes(item.monthValue)" :key="index" show-overflow-tooltip :label="item.monthValue" :prop="item.monthKey" min-width="140px;">
              <template slot-scope="{ row }">
                <span v-format="'#,##0.00'">{{ Number(row[item.monthKey]) }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
      </template>
      <!--      <el-table-column />-->
      <!-- <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="handleProductCheck(scope.row)">查看</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getFundOrderPage"
    />
  </div>
</template>
<script>
import { fundOrderPage, fundOrderHeader } from '@/api/finance'
import Pagination from '@/components/Pagination'
export default {
  name: 'OrderInfo',
  components: {
    downloadBtn: (resolve) => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  data() {
    return {
      listQuery: {
        custCode: '',
        custName: '',
        fundCustId: '',
        saleBillNo: '',
        billDate: '',
        mainIncludeTaxPrice: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      checkList: [],
      copyCheckList: [], // 默认数据
      checkAll: false,
      isIndeterminate: false,
      tableLabel: [], // 表头数据
      orderList: [],
      tableHeader: '', // 显示那种表头数据 1-- 华润  2--微众
      total: 0
    }
  },
  computed: {
  },
  created() {
    // 获取当前显示的table
    this.fundOrderHeader()
  },
  methods: {
    // 获取表数据
    getFundOrderPage(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      fundOrderPage(this.listQuery).then(res => {
        if (res.code === '0') {
          // 清除数据
          this.tableLabel = []
          this.copyCheckList = []
          if (this.tableHeader === 2) {
            if (res.data && res.data.pageDTO.list) {
              this.orderList = res.data.pageDTO.list
              // 默认选中前6个月
              res.data.months && res.data.months.forEach((item, index) => {
                this.tableLabel.push(item)
                if (index < 6) {
                  this.checkList.push(item.monthValue)
                }
              })
              // 拷贝默认数据
              this.copyCheckList = this.checkList
              this.total = res.data.pageDTO.total
            }
          } else if (this.tableHeader === 1) {
            this.orderList = res.data.list
            // this.tableLabel = res.data.pageDTO.months
            this.total = res.data.total
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取table显示的表头
    fundOrderHeader() {
      fundOrderHeader().then(res => {
        if (res.code === '0') {
          this.tableHeader = res.data
          // 获取订单列表数据
          this.getFundOrderPage()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    handleCheckGroup() {
      this.isIndeterminate = this.checkList.length > 6 && this.checkList.length !== this.tableLabel.length
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkList = val ? this.tableLabel.map(item => item.monthValue) : this.checkList = this.copyCheckList
      /*  const checkedCount = 5
      this.checkAll = this.tableLabel.length === this.checkList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length */
      this.isIndeterminate = false
    },
    // 重置
    resetForm() {
      this.checkAll = false
      this.checkList = []
      this.isIndeterminate = false
      this.listQuery.pageParam.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getFundOrderPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.checkboxGroup {
  .allCheck {
    width: 150px;
  }
  display: flex;
  padding-bottom: 20px;
  ::v-deep.el-checkbox {
    height: 24px;
    line-height: 24px;
  }
}
</style>
