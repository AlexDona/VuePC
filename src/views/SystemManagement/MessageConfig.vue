<template>
  <div class="app-container">
    <el-row>配置</el-row>
    <el-row class="mt24" :gutter="20">
      <el-col :span="8"><span class="label">通知场景：</span><span class="fw-6">{{ resData.msgName }}</span></el-col>
      <el-col :span="5"><span class="label">通知方式：</span><span class="fw-6">{{ msgType[resData.msgType] }}</span></el-col>
      <el-col :span="8"><span class="label">通知对象：</span><span class="fw-6">{{ resData.msgNotifyType }}</span></el-col>
    </el-row>
    <el-form ref="messageConfig" class="mt24" label-position="right" :model="listQuery">
      <el-row :gutter="20" :class="{'formItem': count}">
        <el-col :sm="5" :xs="5">
          <el-form-item prop="dealerProvinceList">
            <el-select v-model="listQuery.dealerProvinceList" collapse-tags multiple filterable style="width:100%" clearable placeholder="省份" @change="provinceChange">
              <el-option v-for="item in listQuery.options" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5" :class="{'formItem': count}">
          <el-form-item prop="dealerCityList">
            <el-select v-model="listQuery.dealerCityList" collapse-tags multiple filterable style="width:100%" clearable placeholder="城市" @change="cityChange">
              <el-option v-for="item in listQuery.filterCityArr" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="5" :xs="5" :class="{'formItem': count}">
          <el-form-item prop="dealerAreaList">
            <el-select v-model="listQuery.dealerAreaList" collapse-tags multiple filterable style="width:100%" clearable placeholder="区域">
              <el-option v-for="item in listQuery.areaArr" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="count" class="collapse">
        <el-collapse accordion>
          <el-collapse-item :title="`已选择的维度：已选${ count }项`" name="1">
            <el-row>
              <el-col :span="1" style="line-height: 3">省：</el-col>
              <el-col :span="18" class="area-btn">
                <el-button v-for="(item, index) in listQuery.dealerProvinceList" :key="'province' + index" class="btn" size="mini" @click="handleDelete({item, index, type: 'province'})">
                  {{ item }}&nbsp;&nbsp; <i class="el-icon-delete" />
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="1" style="line-height: 3">市：</el-col>
                <el-col :span="18" class="area-btn">
                  <el-button v-for="(item, index) in listQuery.dealerCityList" :key="'province' + index" class="btn" size="mini" @click="handleDelete({item, index, type: 'city'})">
                    {{ item }}&nbsp;&nbsp; <i class="el-icon-delete" />
                  </el-button>
                </el-col>
              </el-row>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="1" style="line-height: 3">区：</el-col>
                <el-col :span="18" class="area-btn">
                  <el-button v-for="(item, index) in listQuery.dealerAreaList" :key="'province' + index" class="btn" size="mini" @click="handleDelete({item, index, type: 'area'})">
                    {{ item }} <i class="el-icon-delete" />
                  </el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="4" :xs="4">
          <el-form-item prop="custName">
            <el-input v-model.trim="listQuery.custName" class="selectWidth" placeholder="通知对象" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item prop="productName" />
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item>
            <el-button type="primary" @click="queryList('query')">查询</el-button>
            <el-button type="plain" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      :data="tableData"
      stripe
      border
      :max-height="curHeight"
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
      @header-click="handleCell"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="通知主体" prop="custName" min-width="200" />
      <el-table-column label="核心企业" prop="coreCustomerName" min-width="200" />
      <el-table-column label="所在省" prop="province" min-width="240px;" />
      <el-table-column label="所在市" prop="city" min-width="240px;" />
      <el-table-column label="所在区" prop="area" min-width="240px;" />
      <el-table-column label="是否发送" show-overflow-tooltip min-width="140" prop="flag" align="center" fixed="right">
        <!--        <template slot="header">-->
        <!--          <el-switch-->
        <!--            v-model="switchVal"-->
        <!--            :active-value="true"-->
        <!--            :inactive-value="false"-->
        <!--            inactive-text="是否发送"-->
        <!--            active-color="#47AB0D"-->
        <!--            @change="handleAllSwitch($event, 'all')"-->
        <!--          />-->
        <!--        </template>-->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.flag"
            :active-value="0"
            :inactive-value="1"
            :active-color="activeColor"
            @change="handleAllSwitch($event, 'single', scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="handlePage"
    />

    <!--    <el-form class="mt40">-->
    <!--      <el-row>-->
    <!--        <el-col :sm="12" :xs="12">-->
    <!--          <el-form-item prop="custName" label="消息主题" label-width="70px">-->
    <!--            <el-input v-model.trim="listQuery.custName" type="text" class="selectWidth" placeholder="通知模板" clearable />-->
    <!--          </el-form-item>-->
    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </el-form>-->
    <br>
    <footer>
      <el-button @click="handleCancel">关闭</el-button>
    </footer>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import { regionData } from 'element-china-area-data'
import { getDefaultConfig } from '@/utils/auth'
import { addFilter, messageList, msgTemplet } from '@/api/messageConfig'

export default {
  name: 'MessageConfigManagement',
  components: {
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      msgType: {
        1: '短信',
        2: '站内信（系统消息）',
        3: '邮件'
      },
      resData: {},
      regions: '',
      listQuery: {
        options: regionData,
        provinceArr: [],
        cityArr: [],
        areaArr: [],
        custName: '',
        dealerProvinceList: [], // 省份
        dealerCityList: [], // 城市
        dealerAreaList: [], // 区域
        pageParam: {
          asc: true,
          orderBy: '', //	排序字段
          pageIndex: 1, //	当前页
          pageSize: 15 // 每页显示行数
        }
      },
      activeColor: getDefaultConfig().toneVal,
      total: 0,
      switchVal: false,
      tableData: []
    }
  },
  computed: {
    count() {
      return this.listQuery.dealerProvinceList.length + this.listQuery.dealerCityList.length + this.listQuery.dealerAreaList.length
    }

  },
  created() {
    this.queryList()
    this.getMsgTemplet()
    const regionDataNew = regionData || []
    regionDataNew.forEach(item => {
      this.listQuery.provinceArr.push({ label: item.label, value: item.value })
      this.listQuery.cityArr.concat(item.children)
      item.children.forEach(item2 => {
        this.listQuery.areaArr.concat(item2.children)
      })
    })
  },
  methods: {
    async getMsgTemplet() {
      const res = await msgTemplet(this.$route.query.msgNo || '')
      if (res.code === '0') {
        this.resData = res.data
        console.log({ res })
      } else {
        this.$message.warning(res.msg)
      }
    },
    async setSwitch({ operationType, values, type, row }) {
      const res = await addFilter({
        coreCustomerId: row.coreCustomerId,
        templetNo: this.$route.query.msgNo || '',
        operationType: operationType,
        patternNo: 'customerBlacklist',
        values: values
      })
      if (res.code === '0') {
        if (type === 'all') {
          this.switchVal = !this.switchVal
        } else if (type === 'single') {
          // eslint-disable-next-line require-atomic-updates
          row.flag = +!row.flag
        }
        await this.queryList()
        // if (this.switchVal === false) {
        //   this.tableData = this.tableData.map(item => {
        //     item.flag = !item.flag
        //     return item
        //   })
        //   this.$message.success(res.msg)
        //   this.switchVal = true
        // } else {
        // }
        console.log({ res })
      } else {
        this.$message.warning(res.msg)
      }
    },
    handleAllSwitch(val, type, row) {
      console.log(val, type, row)
      let text = ''
      if (row) {
        row.flag = +(row.flag !== 1)
        if (row.flag === 0) {
          text = '是否确认打开'
        } else {
          text = '是否确认关闭'
        }
      } else {
        this.switchVal = val = val !== true
        if (val === false) {
          text = '是否确认打开'
        } else {
          text = '是否确认关闭'
        }
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        console.log(this.$route.query.msgNo, this.tableData, 'msg')
        let values = []
        if (type === 'all') {
          values = this.tableData.map(item => item.id)
        }
        if (type === 'single') {
          values = [row.id]
        }
        await this.setSwitch({
          operationType: row !== undefined ? !row.flag : !val,
          values: values,
          type: type,
          row: row
        })
        // 确认，将改变后的状态值赋给绑定的itemValue
      }).catch(() => {
        // 取消，将对立状态值赋给itemValue
      })
    },
    handleCell(column, event) {
      console.log(column, event)
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
        if (this.listQuery.dealerCityList.includes(res.label)) {
          curArea.push(...res.children)
          newCheckedArr.push(res.label)
        }
      })
      this.listQuery.dealerCityList.splice(0, this.listQuery.dealerCityList.length, ...newCheckedArr)
      const newCheckedArea = []
      curArea.length && curArea.forEach(res => {
        if (this.listQuery.dealerAreaList.includes(res.label)) {
          newCheckedArea.push(res.label)
        }
      })
      this.listQuery.dealerAreaList.splice(0, this.listQuery.dealerAreaList.length, ...newCheckedArea)
      console.log('根据省份选择城市：', this.listQuery.dealerProvinceList)
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
        if (this.listQuery.dealerAreaList.includes(res.label)) {
          newCheckedArr.push(res.label)
        }
      })
      this.listQuery.dealerAreaList.splice(0, this.listQuery.dealerAreaList.length, ...newCheckedArr)
      // console.log('区域过滤后数据===', newArr)
    },
    handleDelete({ item, index, type }) {
      if (type === 'province') {
        this.listQuery.dealerProvinceList.splice(index, 1)
      }
      if (type === 'city') {
        this.listQuery.dealerCityList.splice(index, 1)
      }
      if (type === 'area') {
        this.listQuery.dealerAreaList.splice(index, 1)
      }
    },
    async queryList(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      const params = {
        areaList: this.listQuery.dealerAreaList,
        cityList: this.listQuery.dealerCityList,
        provinceList: this.listQuery.dealerProvinceList,
        custName: this.listQuery.custName,
        msgNo: this.$route.query.msgNo,
        orderBy: this.listQuery.pageParam.orderBy,
        pageIndex: this.listQuery.pageParam.pageIndex,
        pageSize: this.listQuery.pageParam.pageSize,
        asc: this.listQuery.pageParam.asc
      }
      const res = await messageList(params)
      if (res.code === '0') {
        console.log({ res })
        this.tableData = res.data.list
        this.total = res.data.total
      } else {
        this.$message.warning(res.msg)
      }
    },
    resetForm() {
      this.$refs['messageConfig'].resetFields()
      this.listQuery.pageParam.pageSize = 15
      this.listQuery.pageParam.pageIndex = 1
      this.listQuery.areaArr = []
      this.listQuery.filterCityArr = []
      console.log(this.listQuery)
      this.queryList()
    },
    handlePage(page) {
      this.listQuery.pageParam.pageSize = page.limit
      this.queryList()
      // console.log(page)
    },
    handleCancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    },
    handleConfirm() {}
  }
}
</script>

<style lang="scss">
/deep/ {
  .el-cascader-node__prefix {
    display: none;
  }
  .el-popper {
    background: red
  }
}
</style>
<style lang="scss" scoped>
.app-container {
  ::v-deep {
    .el-collapse,.el-collapse-item__wrap {
      border: none;
      .el-collapse-item__header{
        border: none;
        width: 175px;
      }
    }
    .el-switch__label{
      color: rgb(51, 51, 51);
      font-weight: bold;
    }
  }
  .mt40 {
    margin-top: 40px;
  }
  .mt24 {
    margin-top: 24px;
  }
  .fw-6 {
    font-weight: 600;
  }
  .label {
    color: #aaa;
  }
  .selected {
    line-height: 1;
    .area-btn {
      line-height: 3;
      /deep/.el-button--mini {
        &:nth-of-type(1) {
          margin-left: 10px;
        }
        color: #47AB0D;
        border-color: #47AB0D;
      }
    }
  }
  ::v-deep {
    .formItem {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>
