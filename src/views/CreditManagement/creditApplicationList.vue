<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="reloadParams">
      <el-row type="flex" style="gap: 20px">
        <el-col v-if="userInfo.custTypeId !== 3" :sm="4" :xs="4">
          <el-form-item prop="industryName">
            <el-select v-model="reloadParams.industryName" style="width:100%" clearable filterable placeholder="产业公司名称">
              <el-option v-for="item in industryCompanyList" :key="item.customerId" :label="item.customerName" :value="item.customerName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="reloadParams.custName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="reloadParams.fundName" class="selectWidth" placeholder="资金方名称" clearable />
          </el-form-item>
        </el-col>

        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="reloadParams.productName" class="selectWidth" placeholder="金融产品名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="applyDate">
            <el-date-picker
              v-model="reloadParams.applyDate"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              start-placeholder="申请日期"
              end-placeholder="申请日期"
              @change="datePickerDate"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item>
            <el-button type="primary" @click="reload('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="4" :xs="4">
          <el-form-item>
            <downloadBtn
              btn-name="下载"
              :download-url="`/business/credit/exportCreditList`"
              method-type="post"
              :params="reloadParams"
              file-name="授信申请列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="entities"
      stripe
      border
      style="width: 100%;"
      :max-height="curHeight"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="授信申请编号" prop="creditNo" min-width="240px;" />
      <el-table-column label="客户名称" show-overflow-tooltip prop="custName" min-width="240px;" />
      <el-table-column label="资金方名称" show-overflow-tooltip prop="fundName" min-width="240px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="240px;" />
      <el-table-column label="额度区间（元）" align="right" prop="productLimitRegion" min-width="200px;">
        <template slot-scope="{ row }">
          <span v-format="'#,##0.00'">{{ row.productLimitRegion }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间（%/年）" prop="productRateRegion" min-width="140px;" />
      <el-table-column label="期限区间（月）" prop="productTermRegion" min-width="120px;" />
      <el-table-column label="还款方式" prop="repaymentMethod" show-overflow-tooltip min-width="200px;" />
      <el-table-column label="授信申请日期" prop="applyDate" min-width="120px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreName" min-width="240px;" />
      <el-table-column v-if="userInfo.custTypeId !== 3" label="产业公司名称" show-overflow-tooltip prop="industryName" min-width="240px;" />
      <el-table-column label="授信申请状态" prop="approveState" min-width="160px;">
        <template slot-scope="scope">{{ statusMap[scope.row.approveState] }}</template>
      </el-table-column>
      <el-table-column v-if="userInfo.custTypeId === 1" label="当前节点" show-overflow-tooltip prop="approveCustName" min-width="180px;" />
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="reloadParams.pageParam.pageSize"
      :page.sync="reloadParams.pageParam.pageIndex"
      @pagination="initEntities()"
    />

  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import {
  exportEntity,
  getEntitiesList
} from '@/api/CreditMgt/creditApplicationList.js'

import { regionData } from 'element-china-area-data'
// import AccountUpdateDialog from '@/views/CreditManagement/components/accountUpdateDialog'
// import service from '@/utils/service'
import { getUserInfo } from '@/utils/auth'
import { recordList } from '@/api/record'
export default {
  name: 'CreditMaintain',
  components: {
    downloadBtn: (resolve) => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      statusMap: {
        0: '待审批',
        1: '审批通过',
        2: '审批拒绝',
        3: '审批退回(补充资料)',
        4: '资金方审批|平台维护',
        6: '结清'
      },
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
        { label: '待提交', value: 0 },
        { label: '已提交', value: 1 }
      ],
      pickerOptions: {
        // 限制选择日期只能从当前日期开始
        disabledDate(time) {
          // return time.getTime() < Date.now() - 8.64e7
        }
      },
      productDateRange: ['', ''],
      earlyDateRange: ['', ''],
      listQuery: {
        allocationStatus: '',
        allocationMethod: '1', // 分配方式
        options: regionData,
        provinceArr: [],
        cityArr: [],
        areaArr: []
      },
      // 查询条件信息
      reloadParams: {
        applyDate: [],
        industryName: '',
        fundName: '',
        custName: '', // 客户
        productName: '', // 产品
        // 翻页参数信息
        pageParam: {
          applicationStatus: 1,
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
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
      industryCompanyList: [],
      userInfo: getUserInfo()
    }
  },
  created() {
    // 获取数据
    this.reload()
    // console.log('ssq:', regionData)
  },
  methods: {
    handleSelectionChange(val) {
      this.batchIdArr = val.map(item => item.id)
    },
    cancel() {
      this.dialog.visibleBatchImport = false
    },
    uploadSuccess() {
      this.dialog.visibleBatchImport = false
    },
    accountUpdate(scope) {
      this.selectRow = scope.row
      this.dialog.visible = true
    },
    handleDetail(scope) {
      this.$router.push({ path: '/CreditManagement/creditMaintain-detail', query: { creditNo: scope.row.creditNo }})
    },
    entityUpdate(scope) {
      // this.dialog.editVisible = true
      this.$router.push({ path: '/CreditManagement/creditMaintain-update', query: { creditNo: scope.row.creditNo }})
      this.selectRow = scope.row
    },
    getRecordList() {

    },
    reload(type) {
      const { applyDate } = this.reloadParams
      const params = {
        ...this.reloadParams
      }
      // debugger
      if (applyDate && applyDate.length === 2) {
        params.applyDateStart = applyDate[0]
        params.applyDateEnd = applyDate[1]
      } else {
        params.applyDateStart = ''
        params.applyDateEnd = ''
      }
      // 下载需要根据查询条下载
      this.reloadParams = Object.assign(this.reloadParams, params)
      delete params.applyDate
      this.initEntities()
      if (type === 'query') {
        this.reloadParams.pageParam.pageIndex = 1
      } else {
        recordList({
          custTypeId: 3
        }).then(res => {
          if (res.code === '0') {
            this.industryCompanyList = res.data || []
          } else {
            this.$message.error(res.msg)
          }
        })
      }

      // const regionDataNew = regionData || []
      // regionDataNew.forEach(item => {
      //   this.listQuery.provinceArr.push({ label: item.label, value: item.value })
      //   this.listQuery.cityArr.concat(item.children)
      //   item.children.forEach(item2 => {
      //     this.listQuery.areaArr.concat(item2.children)
      //   })
      // })
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
    download() {
      exportEntity(this.reloadParams)
    },
    initEntities() { // 初始化实体数据
      console.log('getEntitiesList params', this.reloadParams)
      getEntitiesList({ ...this.reloadParams }).then(res => {
        const { data } = res
        const { list, total } = data
        this.entities = list
        this.total = total
      })
    },
    datePickerDate() {
      this.reloadParams.applyDateStart = this.reloadParams.applyDate[0] || ''
      this.reloadParams.applyDateEnd = this.reloadParams.applyDate[1] || ''
    },
    // 重置
    resetForm() {
      this.reloadParams.applyDateStart = ''
      this.reloadParams.applyDateEnd = ''
      this.reloadParams.pageParam = {
        asc: true,
        orderBy: '', //	排序字段
        pageIndex: 1, //	当前页
        pageSize: 15 // 每页显示行数
      }
      this.$refs['resetForm'].resetFields()
      this.initEntities()
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

.container {
  padding: 24px;
  .productTerm {
    .el-form-item__content {
      min-width: 238px;
      .el-input__inner {
        width: 100%;
      }
    }
  }
}
</style>
