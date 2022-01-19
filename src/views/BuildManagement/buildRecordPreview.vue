<template>
  <div class="app-container">
    <!-- 查看 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="企业详情" name="companyDetail">
        <div class="tabPane">
          <FormOperation
            ref="assetConfirm"
            dialog-mode="preview"
            :customer-form="custRowData"
            :cust-type-list="custTypeList"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="维护详情" name="maintainDetail">
        <el-table
          :data="maintainDetail"
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
          <el-table-column label="修改字段" prop="propertyCh" min-width="240px;" />
          <el-table-column label="修改前" prop="beforeValue" min-width="240px;" />
          <el-table-column label="修改后" prop="afterValue" min-width="240px;" />
          <el-table-column label="修改人" prop="updateUser" min-width="240px;" />
          <el-table-column label="修改时间" prop="updateTime" min-width="240px;" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-button style="margin-top: 20px" plain @click="toback">返回</el-button>
  </div>
</template>

<script>
import { getConfigChangeRecord } from '@/api/record'
import FormOperation from './components/form-operation.vue'
import { customerTypeList } from '@/api/record'

export default {
  components: {
    FormOperation
  },
  data() {
    return {
      custRowData: {},
      activeName: 'companyDetail',
      custTypeList: [],
      maintainDetail: []
    }
  },
  created() {
    this.custRowData = JSON.parse(localStorage.getItem('buildPreviewViewRow'))
    // this.custTypeList = JSON.parse(this.$route.query.custTypeList)
    // 获取详情数据
    this.getConfigChangeRecord()
    // 获取客户类型
    this.getCustomerTypeList()
  },
  methods: {
    // 获取客户类型
    getCustomerTypeList() {
      const params = { type: 1 }
      customerTypeList(params).then(res => {
        if (res.code === '0') {
          this.custTypeList = res.data.filter(item => item.type === 1)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取详情
    getConfigChangeRecord() {
      const params = {
        businessId: this.custRowData.id,
        businessType: 'customer_bookbuilding_config'
      }
      getConfigChangeRecord(params).then(res => {
        if (res.code === '0') {
          this.maintainDetail = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 返回
    toback() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.push('/BuildManagement/buildRecordQuery')
    }
  }
}
</script>
<style lang="scss" scoped>
.tabPane {
  width: 40%;
  min-width: 650px;
}
</style>
