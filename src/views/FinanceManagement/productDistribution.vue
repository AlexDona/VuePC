<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="reloadParams">
      <el-row type="flex" :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="coreCustId">
            <el-select
              v-model="reloadParams.coreCustId"
              filterable
              style="width:100%"
              clearable
              placeholder="核心企业"
            >
              <el-option v-for="item in coreOptionsList" :key="item.customerId" :label="item.customerName" :value="Number(item.customerId)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5">
          <el-form-item prop="industrialCustomerIdList">
            <el-select v-model="reloadParams.industrialCustomerIdList" collapse-tags multiple filterable style="width:100%" clearable placeholder="所属公司名称">
              <el-option v-for="item in industryCompanyList" :key="item.customerId" :label="item.customerName" :value="item.customerId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5">
          <el-form-item prop="dealerProvinceList">
            <el-select v-model="reloadParams.dealerProvinceList" collapse-tags multiple filterable style="width:100%" clearable placeholder="省份" @change="provinceChange">
              <el-option v-for="item in listQuery.options" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5">
          <el-form-item prop="dealerCityList">
            <el-select v-model="reloadParams.dealerCityList" collapse-tags multiple filterable style="width:100%" clearable placeholder="城市" @change="cityChange">
              <el-option v-for="item in listQuery.filterCityArr" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5">
          <el-form-item prop="dealerAreaList">
            <el-select v-model="reloadParams.dealerAreaList" collapse-tags multiple filterable style="width:100%" clearable placeholder="区域">
              <el-option v-for="item in listQuery.areaArr" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="dealerCustName">
            <el-input v-model.trim="reloadParams.dealerCustName" class="selectWidth" placeholder="客户名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5">
          <el-form-item prop="assignStatus">
            <el-select v-model.trim="reloadParams.assignStatus" style="width: 100%" placeholder="分配状态" clearable>
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="6" :xs="6">
          <el-form-item prop="allocationMethod" label="分配方式">
            <el-radio v-model="listQuery.allocationMethod" label="1">客户维度</el-radio>
            <el-radio v-model="listQuery.allocationMethod" label="2">非客户维度</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="mb10">
        <el-button type="primary" @click="toBatchList">批量分配</el-button>
      </div>
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
      <el-table-column label="序号" type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="客户编号" prop="dealerCustNo" min-width="160px;" show-overflow-tooltip />
      <el-table-column label="客户名称" show-overflow-tooltip prop="dealerCustName" min-width="120px;" />
      <el-table-column label="所在省" prop="dealerProvince" min-width="120px;" />
      <el-table-column label="所在市" prop="dealerCity" min-width="120px;" />
      <el-table-column label="所在区" prop="dealerArea" min-width="120px;" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreCustomerName" min-width="160px;" />
      <el-table-column label="所属公司编号" prop="industrialCustNo" min-width="160px;" show-overflow-tooltip />
      <el-table-column label="所属公司名称" show-overflow-tooltip prop="industrialCustName" min-width="160px;" />
      <el-table-column label="分配状态" prop="assignStatus" min-width="120px;">
        <template slot-scope="scope">
          {{ scope.row.assignStatus === 1 ? '已分配': '待分配' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scope">
          <!-- 已分配还能继续分配 -->
          <el-button type="text" @click="() => rowClick(scope)">分配</el-button>
          <template v-if="scope.row.assignStatus === 1">
            <el-button type="text" @click="handleDetail(scope)">查看</el-button>
            <el-button type="text" @click="handleRemove(scope)">解除</el-button>
          </template>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageParams.pageSize"
      :page.sync="pageParams.pageIndex"
      @pagination="reload()"
    />
    <!--  单个分配金融列表对话框  -->
    <financial-list v-if="dialog.editVisible" :visible="dialog.editVisible" :select-row="selectRow" :parent-params="reloadParams" @closeDialog="closeDialog" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getByCustTypeId } from '@/api/finance'
import { getEntitiesList, getIndustryCompanyList } from '@/api/FinanceMgt/productDistribution'
import { recordList } from '@/api/record'
// import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { regionData } from 'element-china-area-data'
import FinancialList from '@/views/FinanceManagement/components/productDistribution/financialList'
// import {Message} from "element-ui";
import { curHeight } from '@/mixins/requestCurHeight'
export default {
  name: 'CompanyDimension',
  components: {
    FinancialList,
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      customerList: [],
      selectRow: {},
      dialog: {
        editVisible: false
      },

      props: { multiple: true },
      statusArr: [
        { label: '全部', value: '' },
        { label: '待分配', value: 0 },
        { label: '已分配', value: 1 }
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
        coreCustId: '',
        allocationMethod: '1', // 分配方式
        options: regionData,
        provinceArr: [],
        cityArr: [], // 城市List
        filterCityArr: [], // 城市名称去重后数据
        areaArr: []
      },
      reloadParams: {
        industrialCustomerIdList: [], // 所属公司名称
        dealerProvinceList: [], // 省份
        dealerCityList: [], // 城市
        dealerAreaList: [], // 区域
        coreCustId: '',
        dealerCustName: '', // 客户名称
        assignStatus: null
      },
      // 页面重载参数
      pageParams: {
        asc: true,
        orderBy: '', //	排序字段
        pageIndex: 1, //	当前页
        pageSize: 15 // 每页显示行数
      },
      entities: [],
      coreOptionsList: [], // 核心企业下拉
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
  watch: {
    'reloadParams.dealerProvinceList': function(newVal) {
      if (newVal.length <= 0) {
        // 如果省份没选，清空城市及区域
        this.reloadParams.dealerCityList = []
        this.reloadParams.dealerAreaList = []
      }
    },
    'reloadParams.dealerCityList': function(newVal) {
      if (newVal.length <= 0) {
        // 如果城市没选，清空区域
        this.reloadParams.dealerAreaList = []
      }
    }
  },
  created() {
    // 获取数据
    this.reload()
    // 获取省市区
    this.getIndustryCompanyList()
    // console.log('搜索条件地址:', regionData)
    // 获取核心企业、所属公司数据
    this.getCoreList()
  },
  methods: {
    handleRemove(scope) {
      const { dealerCustNo, dealerCustName, dealerCustomerId, industrialCustomerId } = scope.row
      const params = { dealerCustNo, dealerCustName, dealerCustomerId, industrialCustomerId }
      this.$router.push({ path: '/FinanceManagement/productDistribution-remove', query: params })
    },
    handleDetail(scope) {
      const { dealerCustNo, dealerCustName, dealerCustomerId, industrialCustomerId } = scope.row
      const params = { dealerCustNo, dealerCustName, dealerCustomerId, industrialCustomerId }
      this.$router.push({ path: '/FinanceManagement/productDistribution-detail', query: params })
    },
    toBatchList() {
      const { allocationMethod } = this.listQuery
      const coreCustId = this.customerList[0].coreCustomerId
      const params = { isBatch: true, allocationMethod, coreCustId }

      if (allocationMethod !== '2') {
        if (this.customerList.length === 0) {
          this.$message.info('请至少勾选一条数据')
          return false
        } else if (!this.customerList.every(item => item.coreCustomerId === coreCustId)) {
          this.$message.info('请选择同一个核心企业进行批量处理')
          return false
        }
      } else {
        if (!this.reloadParams.industrialCustomerIdList.length && !this.reloadParams.dealerProvinceList.length && allocationMethod === '2') {
          // 非客户维度，必须选择 所属公司，省份中的一个
          this.$message.warning('非客户维度，必须选择 所属公司，省份中的一个')
          return false
        }
        sessionStorage.setItem('parentParams', JSON.stringify(this.reloadParams))
      }
      this.$router.push({ path: '/FinanceManagement/productDistribution-choose', query: params })
    /*   if (this.listQuery.allocationMethod === '1') {
        // 预校验
        const list = {
          assignParamList: []
        }
        this.customerList.forEach(item => {
          list.assignParamList.push({
            dealerCustomerId: item.dealerCustomerId,
            industrialCustomerId: item.industrialCustomerId
          })
        })
        customerMultiPreCheck(list).then(res => {
          if (res.code === '0') {
            this.$router.push({ path: '/FinanceManagement/productDistribution-choose', query: params })
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        // 预校验
        const list = {
          dealerProvinceList: this.reloadParams.dealerProvinceList, // 经销商 所在区
          dealerCityList: this.reloadParams.dealerCityList, // 经销商 所在市
          dealerAreaList: this.reloadParams.dealerAreaList, // 经销商 所在省
          industrialCustomerIdList: [] // 所属公司id
        }
        this.customerList.forEach(item => {
          list.industrialCustomerIdList.push(item.industrialCustomerId)
        })
        customerOtherPreCheck(list).then(res => {
          if (res.code === '0') {
            this.$router.push({ path: '/FinanceManagement/productDistribution-choose', query: params })
          } else {
            this.$message.error(res.msg)
          }
        })
      } */
    },
    async getCoreList() {
      this.industryCompanyList = []
      // 获取所属公司下拉数据
      const res1 = await recordList({ custTypeId: 3 })
      if (res1.code === '0') {
        this.industryCompanyList.push(...res1.data)
      } else {
        this.$message.error(res1.msg)
      }
      // 获取核心企业下拉数据
      const res2 = await getByCustTypeId({ custTypeId: '6' })
      if (res2.code === '0') {
        this.coreOptionsList = res2.data
        this.industryCompanyList.push(...res2.data)
      } else {
        this.$message.error(res2.msg)
      }
    },
    // 获取省市区
    getIndustryCompanyList() {
      getIndustryCompanyList({}).then(res => {
        const { data } = res
        sessionStorage.setItem('industryCompanyList', JSON.stringify(data.list))
      })
    },
    handleSelectionChange(val) {
      // debugger
      this.customerList = val
      sessionStorage.setItem('customerList', JSON.stringify(val))
    },
    rowClick(scope) {
      // this.dialog.editVisible = true
      this.selectRow = scope.row
      const coreCustId = scope.row.coreCustomerId
      const { dealerCustNo, dealerCustName, dealerCustomerId, industrialCustomerId } = scope.row
      const { allocationMethod } = this.listQuery
      const params = { dealerCustNo, dealerCustName, dealerCustomerId, industrialCustomerId, isBatch: false, allocationMethod, coreCustId }
      this.$router.push({ path: '/FinanceManagement/productDistribution-choose', query: params })
    },
    queryList() {
      this.pageParams.pageIndex = 1
      this.reload()
    },
    reload() {
      this.reloadParams = {
        ...this.reloadParams,
        ...this.pageParams
      }
      // debugger
      this.initEntities(this.reloadParams)
      const regionDataNew = regionData || []
      regionDataNew.forEach(item => {
        this.listQuery.provinceArr.push({ label: item.label, value: item.value })
        this.listQuery.cityArr.concat(item.children)
        item.children.forEach(item2 => {
          this.listQuery.areaArr.concat(item2.children)
        })
      })
    },
    provinceChange(valArr) {
      let newArr = []
      this.listQuery.options.map(item => {
        if (valArr.includes(item.label)) {
          newArr = [
            ...newArr,
            ...item.children
          ]
        }
      })
      const arrLabels = []
      let filterArr = []
      // 过滤 市 信息
      newArr.map((el) => {
        if (!arrLabels.includes(el.label)) {
          arrLabels.push(el.label)
          filterArr = [...filterArr, el]
        }
      })
      this.listQuery.cityArr = newArr // 原始数据
      this.listQuery.filterCityArr = filterArr // 去重数据
      // 如果级联的上一级被取消，也要去除之前选中的值
      const newCheckedArr = [] // 用来保存更新后的选中市
      const curArea = [] // 当前所选的城市所有的区域
      this.listQuery.filterCityArr.forEach(res => {
        if (this.reloadParams.dealerCityList.includes(res.label)) {
          curArea.push(...res.children)
          newCheckedArr.push(res.label)
        }
      })
      this.reloadParams.dealerCityList.splice(0, this.reloadParams.dealerCityList.length, ...newCheckedArr)
      const newCheckedArea = []
      curArea.length && curArea.forEach(res => {
        if (this.reloadParams.dealerAreaList.includes(res.label)) {
          newCheckedArea.push(res.label)
        }
      })
      this.reloadParams.dealerAreaList.splice(0, this.reloadParams.dealerAreaList.length, ...newCheckedArea)
      console.log('根据省份选择城市：', curArea)
    },
    cityChange(valArr) {
      // console.log('cityChange==', this.listQuery.cityArr)
      let areaArr = []

      // 获取 区 信息
      this.listQuery.cityArr.map(item => {
        if (valArr.includes(item.label)) {
          areaArr = [...areaArr, ...item.children]
        }
      })
      // console.log('城市选择区域原始数据areaArr====', areaArr)
      // const arrLabels = []
      // let newArr = []
      // // 区域信息过滤
      // areaArr.map((item) => {
      //   if (!arrLabels.includes(item.label)) {
      //     arrLabels.push(item.label)
      //     newArr = [...newArr, item]
      //   }
      // })
      this.listQuery.areaArr = areaArr
      // 如果级联的上一级被取消，也要去除之前选中的值
      const newCheckedArr = []
      this.listQuery.areaArr.forEach(res => {
        if (this.reloadParams.dealerAreaList.includes(res.label)) {
          newCheckedArr.push(res.label)
        }
      })
      this.reloadParams.dealerAreaList.splice(0, this.reloadParams.dealerAreaList.length, ...newCheckedArr)
      // console.log('区域过滤后数据===', newArr)
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
      this.$refs['resetForm'].resetFields()
      this.pageParams.pageIndex = 1
      this.reload()
      this.listQuery.cityArr = []
      this.listQuery.areaArr = []
    },
    // 关闭弹窗
    closeDialog() {
      this.dialog.editVisible = false
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
