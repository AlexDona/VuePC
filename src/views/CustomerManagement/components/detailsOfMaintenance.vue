<template>
  <!-- 客户列表 -->
  <div class="container">
    <el-table
      :data="productData"
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
      <el-table-column label="修改字段" prop="propertyCh" min-width="150px;" />
      <el-table-column label="修改前" prop="beforeValue" min-width="150px;" />
      <el-table-column label="修改后" prop="afterValue" min-width="150px;" />
      <el-table-column label="修改人" prop="updateUser" min-width="150px;" />
      <el-table-column label="修改时间" prop="updateTime" min-width="150px;" />
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParams.pageSize"
      :page.sync="listQuery.pageParams.pageIndex"
      @pagination="getDetailsMaintenance()"
    />
    <footer style="margin-top: 20px;">
      <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
    </footer>
  </div>

</template>

<script>
import { getDetailsMaintenance } from '@/api/finance'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductMaintain',
  components: {
    Pagination
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listQuery: {
        pageParams: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      productData: [],
      total: 0
    }
  },
  created() {
    // 获取数据
    this.getDetailsMaintenance()
  },
  methods: {
    // 获取数据
    getDetailsMaintenance(type) {
      if (type === 'query') this.listQuery.pageParams.pageIndex = 1
      getDetailsMaintenance(Object.assign(this.listQuery, {
        businessId: this.id,
        businessType: 'customer_config'
      })).then(res => {
        if (res.code === '0') {
          this.productData = res.data
          this.total = res.total || 0
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交新增、编辑
    recordSaveAndEdit(data) {

    },
    // 关闭弹窗
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
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
