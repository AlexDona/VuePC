<template>
  <!-- 产品列表 -->
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery">
      <el-row :gutter="24">
        <el-col v-if="userInfo.custTypeId !== 4" :sm="4" :xs="4">
          <el-form-item prop="fundName">
            <el-input v-model.trim="listQuery.fundName" clearable placeholder="资金方名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName">
            <el-input v-model.trim="listQuery.productName" clearable placeholder="金融产品名称" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productStatus">
            <el-select
              v-model="listQuery.productStatus"
              style="width:100%"
              clearable
              placeholder="产品状态"
            >
              <el-option
                v-for="item in productStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productType">
            <el-select
              v-model="listQuery.productType"
              style="width:100%"
              clearable
              placeholder="产品类型"
            >
              <el-option label="经营贷" value="1" />
              <el-option label="订单贷" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <!--  <el-col :sm="4" :xs="4">
          <el-form-item prop="isGroupCompApprove">
            <el-select
              v-model="listQuery.isGroupCompApprove"
              style="width:100%"
              clearable
              placeholder="核心企业授信审批"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isProdCompAppvove">
            <el-select
              v-model="listQuery.isProdCompAppvove"
              style="width:100%"
              clearable
              placeholder="产业公司授信审批"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isLoopLoan">
            <el-select
              v-model="listQuery.isLoopLoan"
              style="width:100%"
              clearable
              placeholder="是否循环额度"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isSingleTrust">
            <el-select
              v-model="listQuery.isSingleTrust"
              style="width:100%"
              clearable
              placeholder="是否单笔授信"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isPushOrder">
            <el-select
              v-model="listQuery.isPushOrder"
              style="width:100%"
              clearable
              placeholder="是否贷后订单推送"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isPushBill">
            <el-select
              v-model="listQuery.isPushBill"
              style="width:100%"
              clearable
              placeholder="是否贷后收款单推送"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="isEntrustPay">
            <el-select
              v-model="listQuery.isEntrustPay"
              style="width:100%"
              clearable
              placeholder="是否受托支付"
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6" :xs="6">
          <el-form-item>
            <el-button type="primary" @click="getFundProds('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
            <downloadBtn
              btn-name="下载"
              :download-url="`/business/product/downloadProductList1`"
              method-type="post"
              :params="listQuery"
              file-name="产品列表"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in tableCheckOptions" :key="item" :label="item">{{ item }}</el-checkbox>
          <!-- <el-checkbox label="资金用途" />
          <el-checkbox label="还款来源" />
          <el-checkbox label="是否循环额度" />
          <el-checkbox label="是否为单笔授信" />
          <el-checkbox label="产品有效期" />
          <el-checkbox label="贷后订单数据推送" />
          <el-checkbox label="贷后收款单数据推送" />
          <el-checkbox label="是否受托支付" />
          <el-checkbox label="核心企业授信审批" />
          <el-checkbox label="产业公司授信审批" /> -->
        </el-checkbox-group>
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
      <el-table-column label="产品编号" prop="productCode" min-width="180px;" />
      <!-- 资金方端查看不展示资金方名称 -->
      <el-table-column v-if="userInfo.custTypeId !== 4" show-overflow-tooltip open-delay="500" label="资金方名称" prop="fundName" min-width="180px;" />
      <el-table-column label="金融产品名称" show-overflow-tooltip prop="productName" min-width="180px;" />
      <el-table-column label="核心企业" prop="coreCustName" min-width="150px;" show-overflow-tooltip />
      <el-table-column label="产品类型" prop="productType" min-width="150px;" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <span>{{ row.productType === 1 ? '经营贷' : '订单贷' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="额度区间(元)" align="right" prop min-width="200px;">
        <template slot-scope="scope">
          <span v-format="'#,##0.00'">
            {{ scope.row.minLoanLimit }}
          </span>
          <span>-</span>
          <span v-format="'#,##0.00'">
            {{ scope.row.maxLoanLimit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="利率区间(%/年)" prop min-width="120px;">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanRate }} - {{ row.maxLoanRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期限区间(月)" prop min-width="120px;">
        <template slot-scope="{ row }">
          <span>{{ row.minLoanTime }} - {{ row.maxLoanTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="还款方式" show-overflow-tooltip prop="repaymentMethod" min-width="120px;" />
      <!-- 动态表头 -->
      <el-table-column
        v-if="checkList.includes('资金用途')"
        label="资金用途"
        show-overflow-tooltip
        :open-delay="500"
        prop="loanPurpose"
        min-width="140px;"
      />
      <el-table-column
        v-if="checkList.includes('还款来源')"
        label="还款来源"
        show-overflow-tooltip
        prop="repaymentSource"
        min-width="120px;"
      />
      <el-table-column
        v-if="checkList.includes('是否循环额度')"
        label="是否循环额度"
        prop="isLoopLoanVal"
        min-width="120px;"
      />
      <el-table-column
        v-if="checkList.includes('是否为单笔授信')"
        label="是否为单笔授信"
        prop="isSingleTrustVal"
        min-width="130px;"
      />
      <el-table-column
        v-if="checkList.includes('产品有效期')"
        label="产品有效期"
        prop="maxValidLimit"
        min-width="220px;"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.minValidLimit">{{ scope.row.minValidLimit }} 至 {{ scope.row.maxValidLimit }}</span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkList.includes('贷后订单数据推送')"
        label="贷后订单数据推送"
        prop="isPushOrderVal"
        min-width="160px;"
      />
      <el-table-column
        v-if="checkList.includes('贷后收款单数据推送')"
        label="贷后收款单数据推送"
        prop="isPushBillVal"
        min-width="160px;"
      />
      <el-table-column
        v-if="checkList.includes('是否受托支付')"
        label="是否受托支付"
        prop="isEntrustPayVal"
        min-width="140px;"
      />
      <!-- <el-table-column
        v-if="checkList.includes('核心企业授信审批')"
        label="核心企业授信审批"
        prop="isGroupCompApproveVal"
        min-width="140px;"
      />
      <el-table-column
        v-if="checkList.includes('产业公司授信审批')"
        label="产业公司授信审批"
        prop="isProdCompAppvoveVal"
        min-width="140px;"
      /> -->
      <el-table-column label="产品状态" prop="productStatusVal" min-width="100px;" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialog('preview',scope.row)">查看</el-button>
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
import { getFundProds } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: 'ProductList',
  components: {
    downloadBtn: (resolve) => require(['@/views/components/template-xls'], resolve),
    Pagination
  },
  mixins: [curHeight],
  props: {},
  data() {
    return {
      listQuery: {
        fundName: '', // 资金方名称
        productName: '', // 产品名称
        productStatus: '', // 产品状态，0暂存，1生效，2失效
        isGroupCompApprove: '', // 是否需要核心企业授信审批，
        productType: '', // 产品类型，
        isLoopLoan: '', // 是否循环额度，0否1是
        isProdCompAppvove: '', //	是否需要产业公司授信审
        isSingleTrust: '', //	是否单笔授信，0否1是
        isPushOrder: '', //	是否推送订单数据，0否1是
        isPushBill: '', // 是否推送账单数据，0否1是
        isEntrustPay: '', // 是否受托支付，0否1是
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
      total: 0,
      checkList: [],
      userInfo: getUserInfo(),
      checkAll: false,
      isIndeterminate: true,
      tableCheckOptions: ['资金用途', '还款来源', '是否循环额度', '是否为单笔授信', '产品有效期', '贷后订单数据推送', '贷后收款单数据推送', '是否受托支付']
    }
  },
  created() {
    // 获取数据
    this.getFundProds()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkList = val ? this.tableCheckOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.tableCheckOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableCheckOptions.length
    },
    // 获取数据
    getFundProds(type) {
      if (type === 'query') this.listQuery.pageParams.pageIndex = 1
      getFundProds(this.listQuery).then((res) => {
        if (res.code === '0') {
          this.productData =
            res.data &&
            res.data.list &&
            res.data.list.length &&
            res.data.list.map((data) => {
              data.isLoopLoanVal = data.isLoopLoan ? '是' : '否'
              data.isProdCompAppvoveVal = data.isProdCompAppvove ? '是' : '否'
              data.isPushBillVal = data.isPushBill ? '是' : '否'
              data.isPushOrderVal = data.isPushOrder ? '是' : '否'
              data.isSingleTrustVal = data.isSingleTrust ? '是' : '否'
              // isTempSave === 1映射为暂存
              data.productStatusVal =
               data.isTempSave === 1 ? '暂存' : data.productStatus === 1 ? '生效' : data.productStatus === 2 ? '失效' : ''
              data.isEntrustPayVal = data.isEntrustPay ? '是' : '否'
              data.isGroupCompApproveVal = data.isGroupCompApprove ? '是' : '否'
              return data
            })
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 查看
    showDialog(mode, row) {
      // this.$router.push('/BuildManagement/buildRecordPreview')
      this.$router.push({
        path: '/FinanceManagement/previewProductList',
        query: {
          mode,
          productId: row ? row.id : '',
          from: 'productList'
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.listQuery.pageParams.pageIndex = 1
      this.getFundProds()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogStyle {
  ::v-deep .el-dialog {
    width: 40%;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #000;
  }
  .el-dialog__body {
    padding: 30px 80px;
  }
}
.el-form .el-row:last-child {
  text-align: right;
  padding-bottom: 20px;
}
.el-checkbox {
  margin-right: 20px;
}
</style>
