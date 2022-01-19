<template>
  <!-- 订单管理--订单列表 -->
  <div class="app-container">
    <el-tabs v-if="tabsData.length" v-model="activeName" @tab-click="handleClick">
      <template v-for="(tabdata) in tabsData">
        <el-tab-pane :key="tabdata.index" :label="tabdata.name" :name="tabdata.index + ''">
          <template v-if="tabdata.name === '产品维度'">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="产品名称">
                <el-select v-model="formInline.productId" placeholder="选择产品名称" @change="changeProduct">
                  <template v-for="item in productList">
                    <el-option :key="item.id" :label="item.name" :value="item.id" />
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="列表名称">
                <el-select v-model="formInline.tableConfId" placeholder="选择列表名称" @change="changeTable">
                  <template v-for="item in tabelListData">
                    <el-option :key="item.id" :label="item.name" :value="item.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-form>
            <template v-if="fieldViewConditions.length > 0 || fieldTableHeadViews.length > 0">
              <el-form>
                <el-row :gutter="20">
                  <template v-for="item in fieldViewConditions">
                    <el-col :key="item.id" :sm="4" :xs="4">
                      <el-form-item>
                        <el-input v-model.trim="item.fieldEnNameInput" :placeholder="item.fieldChName" />
                      </el-form-item>
                    </el-col>
                  </template>
                  <el-col :sm="6" :xs="6">
                    <el-form-item>
                      <el-button type="primary" @click="requestListData('reset')">查询</el-button>
                      <!-- <el-button type="plain" @click="resetForm">重置</el-button> -->
                      <el-button type="primary" @click="downLoadData">下载</el-button>
                      <downloadBtn
                        btn-name="下载"
                        download-url="/business/order/queryDownload"
                        method-type="post"
                        :params="orderDownParams"
                        file-name="订单列表数据"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item>
                      <el-button v-if="isExcelIn === 2 || isExcelIn === 3" type="primary" @click="batchImportVisible">批量导入</el-button>
                      <el-button v-if="isExcelIn === 1 || isExcelIn === 3" :disabled="selectTable.length === 0" type="primary" @click="handleMultiplySave">批量补录</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table
                ref="table"
                :data="orderList"
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
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" type="index" width="50" />
                <template v-for="item in fieldTableHeadViews">
                  <el-table-column :key="item.id" :label="item.fieldChName" :prop="item.fieldEnName" min-width="200px;" />
                </template>
              </el-table>
            </template>
            <template v-else>
              <div class="noImage">
                <img :src="noDate" alt="">
              </div>
            </template>
          </template>
          <!-- 分页器 -->
          <pagination
            v-show="total > 0"
            :total="total"
            :limit.sync="listQuery.pageParam.pageSize"
            :page.sync="listQuery.pageParam.pageIndex"
            @pagination="requestListData"
          />
          <template v-if="tabdata.name === '列表维度'">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="列表名称">
                <el-select v-model="formInline.tableConfId" placeholder="选择列表名称" @change="changeTable">
                  <template v-for="item in tabelListData2">
                    <el-option :key="item.id" :label="item.name" :value="item.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-form>
            <template v-if="fieldViewConditions.length > 0 || fieldTableHeadViews.length > 0">
              <el-form>
                <el-row :gutter="20">
                  <template v-for="item in fieldViewConditions">
                    <el-col :key="item.id" :sm="4" :xs="4">
                      <el-form-item>
                        <el-input v-model.trim="item.fieldEnNameInput" :placeholder="item.fieldChName" />
                      </el-form-item>
                    </el-col>
                  </template>
                  <el-col :sm="6" :xs="6">
                    <el-form-item>
                      <el-button type="primary" @click="requestListData('reset')">查询</el-button>
                      <!-- <el-button type="plain" @click="resetForm">重置</el-button> -->
                      <el-button type="primary" @click="downLoadData">下载</el-button>
                      <downloadBtn
                        btn-name="下载"
                        download-url="/business/order/queryDownload"
                        method-type="post"
                        :params="orderDownParams"
                        file-name="订单列表数据"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item>
                      <el-button v-if="isExcelIn === 2 || isExcelIn === 3" type="primary" @click="batchImportVisible">批量导入</el-button>
                      <el-button v-if="isExcelIn === 1 || isExcelIn === 3" :disabled="selectTable.length === 0" type="primary" @click="handleMultiplySave">批量补录</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-table
                ref="table"
                :data="orderList"
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
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" type="index" width="50" />
                <template v-for="item in fieldTableHeadViews">
                  <el-table-column :key="item.id" :label="item.fieldChName" :prop="item.fieldEnName" min-width="200px;" />
                </template>
              </el-table>
            </template>
            <template v-else>
              <div class="noImage">
                <img :src="noDate" alt="">
              </div>
            </template>
            <!-- 分页器 -->
            <pagination
              v-show="total > 0"
              :total="total"
              :limit.sync="listQuery.pageParam.pageSize"
              :page.sync="listQuery.pageParam.pageIndex"
              @pagination="requestListData"
            />
          </template>
          <template v-if="tabdata.name === '订单维度'">
            <el-form ref="resetForm" :model="listQueryTypeOrder">
              <el-row :gutter="20">
                <el-col :sm="4" :xs="4">
                  <el-form-item prop="custCode">
                    <el-input v-model="listQueryTypeOrder.custCode" clearable :placeholder="tableHeader === 1 ? '经销商编号' :'客户编号'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="4" :xs="4">
                  <el-form-item prop="custName">
                    <el-input v-model="listQueryTypeOrder.custName" clearable :placeholder="tableHeader === 1 ? '经销商名称' : '客户名称'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="8">
                  <el-form-item>
                    <!-- <el-button type="primary" @click="getFundOrderPage('query')">查询</el-button> -->
                    <!-- <el-button type="plain" @click="resetForm">重置</el-button> -->
                    <!-- <downloadBtn
                      btn-name="下载"
                      download-url="/business/saleorder/exportFundOrder"
                      method-type="post"
                      :params="listQuery"
                      file-name="订单查询列表数据"
                    /> -->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
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
              <el-table-column :label="tableHeader === 1 || tableHeader === 3? '经销商编号' : '客户编号'" prop="custCode" min-width="140px;" />
              <el-table-column :label="tableHeaderFormatter[tableHeader]" show-overflow-tooltip prop="custName" min-width="160px;" />
              <template v-if="tableHeader === 1 || tableHeader === 3">
                <el-table-column :label=" tableHeader === 1 ? '订单日期' : '统计月份'" prop="billDate" width="240px;" />
                <el-table-column :label=" tableHeader === 1 ? '订单金额(元)' : '月进货额(元)'" align="right" prop="taxAmt" min-width="140px;">
                  <template slot-scope="{ row }">
                    <span v-format="'#,##0.00'">{{ row.taxAmt }}</span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
            <!-- 分页器 -->
            <pagination
              v-show="total > 0"
              :total="total"
              :limit.sync="listQuery.pageParam.pageSize"
              :page.sync="listQuery.pageParam.pageIndex"
              @pagination="requestListData"
            />
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <template v-else>
      <div class="noImage">
        <img :src="noDate" alt="">
      </div>
    </template>
    <!-- 批量导入 -->
    <batch-import
      :dialog-visible="visibleBatchImport"
      :title="methodType === 'get' ? '批量导入' : '批量补录'"
      :method-type="methodType"
      :download-url="downloadUrl"
      :download-file-name="'订单模板'"
      :upload-url="uploadUrl"
      :down-params="downParams"
      :upload-params="uploadParams"
      @cancel="closeDialog"
      @success="closeDialog('success')"
    />

  </div>
</template>

<script>
import { getProductConfPulldown, getTableConfPulldown, getTableConfViewInfo, page, queryDownload, getTableConfPanelInfo } from '@/api/finance'
import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import batchImport from '@/views/components/batch-import.vue'

export default {
  // name: 'orderList',
  components: {
    Pagination,
    downloadBtn: (resolve) => require(['@/views/components/template-xls'], resolve),
    batchImport
  },
  mixins: [curHeight],
  data() {
    return {
      activeName: '2',
      formInline: {
        productId: '',
        tableConfId: ''
      },
      noDate: require('../../assets/noOrderData.png'),
      productList: [],
      tabelListData: [],
      tabelListData2: [],
      total: 0,
      listQuery: {
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      listQueryTypeOrder: {
        custCode: '',
        custName: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      tableHeader: 1,
      tableHeaderFormatter: {
        1: '经销商名称',
        2: '客户名称',
        3: '经销商公司全称'
      },
      orderList: [],
      fieldViewConditions: [], // 搜索字段
      fieldTableHeadViews: [], // 表格表头
      tableConfId: '', // 当前配置表的ID
      visibleBatchImport: false,
      isExcelIn: 0,
      selectTable: [],
      downloadUrl: '',
      methodType: '',
      uploadUrl: '',
      downParams: {},
      uploadParams: {},
      oldPageIndex: '',
      tabsData: [] // 订单tab数组
    }
  },
  computed: {
    orderDownParams() {
      const params = {
        tableConfId: this.tableConfId,
        conditions: this.fieldViewConditions && this.fieldViewConditions.length && this.fieldViewConditions.map(res => {
          res.fieldValue = res.fieldEnNameInput
          return res
        })
      }
      return params
    }
  },
  created() {
    getTableConfPanelInfo().then(res => {
      this.tabsData = res.data || []
    })
  },
  methods: {
    handleClick() {
      if (this.activeName === '0') {
        getTableConfPulldown({
          tableConfigType: this.activeName
        }).then(res => {
          this.tabelListData2 = res.data || []
          this.fieldTableHeadViews = []
          this.fieldViewConditions = []
          this.formInline = {}
          this.total = 0
        })
      } else if (this.activeName === '1') {
        getProductConfPulldown().then(res => {
          this.productList = res.data || []
          this.fieldTableHeadViews = []
          this.fieldViewConditions = []
          this.formInline = {}
          this.total = 0
        })
      }
    },
    downLoadData() {
      queryDownload(this.orderDownParams).then(res => {
        console.log(res)
        if (res.code === '0') {
          this.$message.success('下载已处理，请到系统管理-下载管理的菜单中下载')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleSelectionChange(data) {
      this.selectTable = data
    },
    // 选择产品
    changeProduct(data) {
      this.formInline.tableConfId = null
      getTableConfPulldown({
        productId: data,
        tableConfigType: this.activeName
      }).then(res => {
        this.tabelListData = res.data || []
      })
    },
    // 选择列表名称后查询表头及搜索条件和按钮
    changeTable(data) {
      this.tableConfId = data
      getTableConfViewInfo({
        tableConfId: data
      }).then(res => {
        this.fieldViewConditions = res.data && res.data.fieldViewConditions
        this.fieldTableHeadViews = res.data && res.data.fieldTableHeadViews
        this.isExcelIn = res.data && res.data.isExcelIn
        // 选择列表名称后调用列表接口查询列表数据
        this.requestListData('reset')
      })
    },
    requestListData(type) {
      this.listQuery.pageParam.pageIndex = type === 'reset' ? 1 : this.listQuery.pageParam.pageIndex
      // 后来加的totalcount,firstId,lastId,oldPageIndex 为配合后端搜索加上的
      const queryParams = {
        totalCount: type === 'reset' ? 0 : this.total,
        firstId: this.orderList[0] && this.orderList[0].id,
        lastId: this.orderList[this.orderList.length - 1] && this.orderList[this.orderList.length - 1].id,
        oldPageIndex: this.oldPageIndex,
        tableConfId: this.tableConfId,
        pageParam: this.listQuery.pageParam,
        conditions: this.fieldViewConditions && this.fieldViewConditions.length && this.fieldViewConditions.map(res => {
          res.fieldValue = res.fieldEnNameInput
          return res
        }) || []
      }
      page(queryParams).then(res => {
        if (res.code === '0') {
          this.orderList = res.data && res.data.list
          this.total = res.data && res.data.total
          this.oldPageIndex = this.listQuery.pageParam.pageIndex
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 关闭弹窗
    closeDialog(type) {
      this.visibleBatchImport = false
      if (type === 'success') this.requestListData('reset')
    },
    // 批量导入
    batchImportVisible() {
      this.downloadUrl = '/business/order/exportOrderNoneTemplate'
      this.visibleBatchImport = true
      this.methodType = 'get'
      this.uploadUrl = '/api/business/customList/batchImport'
      this.downParams = {
        tableConfId: this.tableConfId
      }
      this.uploadParams = {
        id: this.tableConfId
      }
    },
    // 批量补录
    handleMultiplySave() {
      const ids = this.selectTable.length && this.selectTable.map(res => {
        return res.id
      })
      this.downloadUrl = '/business/order/exportUpdateOrderTemplate'
      this.visibleBatchImport = true
      this.methodType = 'post'
      this.uploadUrl = '/api/business/customList/supplementaryRecord'
      this.downParams = {
        tableConfId: this.tableConfId,
        recordIds: ids
      }
      this.uploadParams = {
        id: this.tableConfId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.noImage {
  min-height: calc(100vh - 218px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

