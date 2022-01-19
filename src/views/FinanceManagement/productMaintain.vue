<template>
  <!-- 产品维护 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model="listQuery.fundName" clearable placeholder="资金方名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model="listQuery.productName" clearable placeholder="金融产品名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productStatus">
            <el-select v-model="listQuery.productStatus" style="width:100%" clearable placeholder="产品状态">
              <el-option
                v-for="item in productStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getFundProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              download-url="/business/product/downloadProductList"
              method-type="post"
              :params="listQuery"
              file-name="产品维护列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button type="primary" @click="createProduct('add',)">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="productData"
      stripe
      border
      style="width: 100%;"
      :max-height="curHeight"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="产品编号" prop="productCode" min-width="160px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" prop="productName" min-width="150px;" show-overflow-tooltip />
      <el-table-column label="核心企业" prop="coreCustName" min-width="150px;" show-overflow-tooltip />
      <el-table-column label="额度区间(元)" align="right" prop="" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.minLoanLimit }}</span>
          <span>-</span>
          <span v-format="'#,##0.00'">{{ row.maxLoanLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间(%/年)" prop="" min-width="200px;">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanRate }} - {{ row.maxLoanRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限区间(月)" prop="" min-width="200px;">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanTime }} - {{ row.maxLoanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还款方式" show-overflow-tooltip prop="repaymentMethod" min-width="240px;" />
      <el-table-column label="产品状态" prop="productStatus" :formatter="formatProductStatus" min-width="240px;" />
      <el-table-column label="是否分配" prop="firstAssignTime" min-width="240px;">
        <template slot-scope="{ row }">
          <span v-if="row.firstAssignTime">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="新增时间" prop="createTime" min-width="240px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.isTempSave === 1">
            <el-button type="text" @click="createProduct('edit',scope.row)">编辑</el-button>
          </template>
          <template v-else>
            <template v-if="scope.row.productStatus === 1 && scope.row.firstAssignTime">
              <el-button type="text" @click="disableClick(scope.row,'stop')">停用</el-button>
              <el-button type="text" @click="createProduct('preview',scope.row)">查看</el-button>
            </template>
            <template v-if="scope.row.productStatus === 1 && !scope.row.firstAssignTime">
              <el-button type="text" @click="createProduct('edit',scope.row)">编辑</el-button>
            </template>
            <template v-if="scope.row.productStatus === 2">
              <el-button type="text" @click="createProduct('preview',scope.row)">查看</el-button>
            </template>
          </template>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParams.pageSize"
      :page.sync="listQuery.pageParams.pageIndex"
      @pagination="getFundProds()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getFundProds, updateProdStatus } from '@/api/finance'
import { curHeight } from '@/mixins/requestCurHeight'

export default {
  name: '',
  components: {
    downloadBtn: resolve => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  props: {
  },
  data() {
    return {
      listQuery: {
        fundName: '',
        productName: '',
        productStatus: '', // 产品状态，0暂存，1生效，2失效
        pageParams: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      productData: [],
      productStatusList: [
        { value: 0, label: '暂存' },
        { value: 1, label: '生效' },
        { value: 2, label: '失效' }
      ],
      // 跳转路径
      pushUrl: {
        add: '/FinanceManagement/createProduct',
        edit: '/FinanceManagement/editProduct',
        preview: '/FinanceManagement/previewProduct'
      },
      total: 0
    }
  },
  created() {
    // 获取数据
    this.getFundProds()
  },
  activated() {
    // 是否刷新数据
    this.$route.params.isRefresh ? this.getFundProds() : ''
  },
  methods: {
    // 获取数据
    getFundProds(type) {
      if (type === 'query') this.listQuery.pageParams.pageIndex = 1
      getFundProds(this.listQuery).then(res => {
        if (res.code === '0') {
          this.productData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    formatProductStatus(row) {
      if (row.isTempSave === 1) {
        return '暂存'
      } else {
        return row.productStatus === 1 ? '生效' : row.productStatus === 2 ? '失效' : ''
      }
    },
    // 禁用
    disableClick(row, type) {
      const parmas = {
        id: row.id,
        productStatus: type === 'stop' ? 2 : type === 'begin' ? 1 : ''
      }
      if (type === 'stop') {
        this.$confirm('请确认是否停用该笔数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateProdStatus(parmas).then(res => {
            if (res.code === '0') {
              this.getFundProds()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        }).catch(() => {})
      } else {
        updateProdStatus(parmas).then(res => {
          if (res.code === '0') {
            this.getFundProds()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 新增、编辑产品
    createProduct(mode, row) {
      // 清空存储的数据
      this.$store.dispatch('productMaintain/set_addproductparams', 'clear')
      this.$router.push({
        path: this.pushUrl[mode],
        query: {
          mode,
          from: 'productMaintain',
          productId: row ? row.id : ''
        }
      })
    },
    // 重置
    resetForm() {
      this.listQuery.pageParams.pageIndex = 1
      this.$refs['resetForm'].resetFields()
      this.getFundProds()
    },
    // 关闭弹窗
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogStyle {
  ::v-deep .el-dialog{
     width: 40%;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #000;
  }
  .el-dialog__body {
    padding: 30px 80px;
  }
}
</style>
