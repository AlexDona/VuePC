<!--
 * @Author: your name
 * @Date: 2021-09-18 16:05:46
 * @LastEditTime: 2021-09-23 15:36:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddf-web\src\views\FinanceManagement\createProduct.vue
-->
<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :lazy="true" label="企业详情" name="1">
        <companyDetails :id="id" />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="维护详情" name="2">
        <detailsOfMaintenance :id="id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { saveProdInfo } from '@/api/finance'
export default {
  name: '',
  components: {
    // 企业详情
    companyDetails: resolve => require(['./components/companyDetails'], resolve),
    // 维护详情
    detailsOfMaintenance: resolve => require(['./components/detailsOfMaintenance'], resolve)
  },
  data() {
    return {
      activeName: '1', // 当前tab， 默认展示第一个tab
      id: this.$route.query.id || ''

    }
  },
  computed: {},
  watch: {
    activeName: {
      handler: function(tab) {

      }
    }

  },

  methods: {
    // 新增提交、暂存
    createProduct(data) {
      saveProdInfo(data).then((res) => {
        if (res.code === '0') {
          this.$message.success(res.msg)
          this.$router.push('/FinanceManagement/productMaintain')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 新增提交、暂存
    othersConfigurationData(data) {
      saveProdInfo(data).then((res) => {
        if (res.code === '0') {
          this.$message.success(res.msg)
          this.$router.push('/FinanceManagement/productMaintain')
        } else {
          this.$message.error(res.msg)
        }
      })
    }

  }
}
</script>

<style lang="scss">
::v-deep .el-tabs__item {
  color: #3E495B !important;
  font-weight: bold ;
}
.btnStyle {
   width: 120px;
   height: 36px;
   margin: 0 22px 0 0;
 }
</style>
