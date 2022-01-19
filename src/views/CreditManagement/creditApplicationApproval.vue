<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待处理" name="1">
        <CreditApplicationUnApprovaled />
      </el-tab-pane>
      <el-tab-pane label="已处理" name="2">
        <CreditApplicationApprovaled />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>

// import Pagination from '@/components/Pagination'
// import batchImport from '@/views/components/batch-import.vue'
import {
  getEntitiesList,
  getIndustryCompanyList,
  postCreditMaintainReceive,
  postReturnReceive, postSettle
} from '@/api/CreditMgt/creditApplicationApproval.js'

import { regionData } from 'element-china-area-data'
// import AccountUpdateDialog from '@/views/CreditManagement/components/accountUpdateDialog'
import CreditApplicationApprovaled from './components/creditApplicationApprovaled.vue'
import CreditApplicationUnApprovaled from './components/creditApplicationUnApprovaled.vue'
import { getUserInfo } from '@/utils/auth'
import service from '@/utils/service'
export default {
  name: 'CreditMaintain',
  components: {
    // batchImport,
    // AccountUpdateDialog,
    // Pagination,
    CreditApplicationApprovaled,
    CreditApplicationUnApprovaled
  },
  data() {
    return {
      activeName: '1',
      batchIdArr: [],
      selectRow: {},
      dialog: {
        visible: false,
        visibleBatchImport: false
      },
      props: { multiple: true },
      accountStatusArr: [
        { label: '待维护', value: 0 },
        { label: '客户录入', value: 1 },
        { label: '已维护', value: 2 }
      ],
      statusArr: [
        { label: '待处理', value: 0 },
        { label: '已处理', value: 1 }
      ],
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      userInfo: getUserInfo(),
      dateRange: ['', ''],
      earlyDateRange: ['', ''],
      listQuery: {
        allocationStatus: '',
        allocationMethod: '1', // 分配方式
        options: regionData,
        provinceArr: [],
        cityArr: [],
        areaArr: []
      },
      reloadParams: {
        applyDateEnd: '',
        applyDateStart: '',
        industryName: '',
        fundName: '',
        custName: '', // 客户
        productName: '', // 产品
        isHandled: 0
      },
      // 页面重载参数
      pageParams: {
        asc: true,
        orderBy: '', //	排序字段
        pageIndex: 1, //	当前页
        pageSize: 15 // 每页显示行数
      },
      entities: [],
      fundNameList: [],
      productNameList: [],
      productStatusList: [
        { value: 0, label: '暂存' },
        { value: 1, label: '生效' },
        { value: 2, label: '失效' }
      ],
      total: 0,
      industryCompanyList: []
    }
  },
  created() {
    // 获取数据
    // this.reload()
    // console.log('ssq:', regionData)
  },
  methods: {
    handleSettle(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postSettle(params).then(res => {
        service.handleResponse(res, () => this.reload(), '已结清')
      })
    },
    handleSelectionChange(val) {
      this.batchIdArr = val.map(item => item.id)
    },
    cancel() {
      this.dialog.visibleBatchImport = false
    },
    uploadSuccess() {
      this.dialog.visibleBatchImport = false
    },
    handleReturnReceive(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postReturnReceive(params).then(res => {
        service.handleResponse(res, res => this.reload(), '退领成功')
      })
    },
    handleReceive(scope) {
      const params = {
        creditNo: scope.row.creditNo
      }
      postCreditMaintainReceive(params).then(res => {
        // service.handel
        service.handleResponse(res, res => this.reload(), '领取成功')
      })
    },
    accountUpdate(scope) {
      this.selectRow = scope.row
      this.dialog.visible = true
    },
    handleDetail(scope) {
      this.$router.push({ path: '/CreditManagement/creditApplicationApproval-detail', query: { creditNo: scope.row.creditNo }})
    },
    entityUpdate(scope) {
      // this.dialog.editVisible = true
      this.$router.push({ path: '/CreditManagement/creditApplicationApproval-examine', query: { creditNo: scope.row.creditNo }})
      this.selectRow = scope.row
    },
    reload() {
      this.reloadParams = {
        ...this.reloadParams,
        ...this.pageParams
      }
      this.initEntities(this.reloadParams)
      getIndustryCompanyList({}).then(res => {
        const { data } = res
        this.industryCompanyList = data.list || []
        this.industryCompanyList.forEach(item => {
          item.label = item.custName
          item.value = item.id
        })
      })

      const regionDataNew = regionData || []
      regionDataNew.forEach(item => {
        this.listQuery.provinceArr.push({ label: item.label, value: item.value })
        this.listQuery.cityArr.concat(item.children)
        item.children.forEach(item2 => {
          this.listQuery.areaArr.concat(item2.children)
        })
      })
    },
    // 选择申请日期
    changeDateRange(range) {
      if (!range) {
        this.dateRange = ['', '']
        this.reloadParams.applyDateStart = ''
        this.reloadParams.applyDateEnd = ''
      } else {
        this.reloadParams.applyDateStart = range[0]
        this.reloadParams.applyDateEnd = range[1]
      }
    },
    provinceChange(valArr) {
      let newArr = []
      this.listQuery.options.forEach(item => {
        if (valArr.includes(item.label)) {
          newArr = [
            ...newArr,
            ...item.children
          ]
        }
      })
      this.listQuery.cityArr = newArr
    },
    cityChange(valArr) {
      let newArr = []
      let cityArr = []
      regionData.forEach(item => {
        cityArr = [...cityArr, ...item.children]
      })
      cityArr.forEach(item => {
        if (valArr.includes(item.label)) {
          newArr = [...newArr, ...item.children]
        }
      })
      this.listQuery.areaArr = newArr
    },
    initEntities(params) { // 初始化实体数据
      getEntitiesList(params).then(res => {
        const { data } = res
        const { list, total } = data
        this.entities = list
        this.total = total
      })
    },

    // 重置
    resetForm() {
      this.dateRange = ['', '']
      this.reloadParams.applyDateStart = ''
      this.reloadParams.applyDateEnd = ''
      this.$refs['resetForm'].resetFields()
      this.initEntities(this.reloadParams)
    },
    // 关闭弹窗
    closeDialog() {
      this.dialog.visible = false
      this.reload()
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
