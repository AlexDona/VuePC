<template>
  <!-- 列表配置 - 列表 -->
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="列表模板" name="1">
        <el-form>
          <el-row :gutter="20">
            <el-col :sm="4" :xs="4">
              <el-form-item prop="productName">
                <el-input v-model.trim="reloadParams.productName" class="selectWidth" placeholder="列表名称" clearable />
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
                  start-placeholder="创建日期"
                  end-placeholder=""
                  @change="datePickerDate"
                />
              </el-form-item>
            </el-col>
            <el-col :sm="6" :xs="6">
              <el-form-item>
                <el-button type="primary" @click="requestListData('reset')">查询</el-button>
                <el-button type="plain" @click="resetForm">重置</el-button>
                <!-- <el-button type="primary" @click="downLoadData">下载</el-button> -->
              <!-- <downloadBtn
                btn-name="下载"
                download-url="/business/order/queryDownload"
                method-type="post"
                :params="orderDownParams"
                file-name="订单列表数据"
              /> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="table"
          :data="listData"
          stripe
          border
          style="width: 100%;"
          :max-height="curHeight"
          :header-cell-style="{
            background: '#F2F5FF',
            color: '#333',
            'text-align': 'center',
          }"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="列表编号" prop="customListNo" min-width="200px;" />
          <el-table-column label="列表名称" prop="customListName" min-width="140px;" />
          <el-table-column label="创建时间" prop="lastModifiedTime" min-width="140px;" />
          <el-table-column label="操作" prop="mainIncludeTaxPrice" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="goDetail(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="列表配置" name="2">
        <el-form>
          <el-row :gutter="20">
            <el-col :sm="4" :xs="4">
              <el-form-item prop="coreName">
                <el-input v-model.trim="listQuery.coreName" class="selectWidth" placeholder="核心企业" clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="4" :xs="4">
              <el-form-item prop="productName">
                <el-input v-model.trim="listQuery.productName" class="selectWidth" placeholder="产品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="4" :xs="4">
              <el-form-item>
                <el-select v-model="listQuery.operate" style="width: 100%;" placeholder="选择操作端">
                  <template v-for="item in operateList">
                    <el-option :key="item.id" :label="item.name" :value="item.id" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="4" :xs="4">
              <el-form-item prop="templateTableName">
                <el-input v-model.trim="listQuery.templateTableName" class="selectWidth" placeholder="模板列表" clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="4" :xs="4">
              <el-form-item prop="confTableName">
                <el-input v-model.trim="listQuery.confTableName" class="selectWidth" placeholder="列表名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :sm="4" :xs="4">
              <el-form-item>
                <el-button type="primary" @click="requestListData('reset')">查询</el-button>
                <el-button type="plain" @click="resetForm">重置</el-button>
                <!-- <el-button type="primary" @click="downLoadData">下载</el-button> -->
              <!-- <downloadBtn
                btn-name="下载"
                download-url="/business/order/queryDownload"
                method-type="post"
                :params="orderDownParams"
                file-name="订单列表数据"
              /> -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="margin-bottom: 20px;">
          <el-button type="primary" @click="addConfig('add')">新增</el-button>
        </div>
        <el-table
          ref="table"
          :data="listData2"
          stripe
          border
          style="width: 100%;"
          :max-height="curHeight"
          :header-cell-style="{
            background: '#F2F5FF',
            color: '#333',
            'text-align': 'center',
          }"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="核心企业" prop="coreName" min-width="200px;" />
          <el-table-column label="产品名称" prop="productName" min-width="140px;" />
          <el-table-column label="操作端" prop="operateCN" min-width="140px;" />
          <el-table-column label="模板列表" prop="templateTableName" min-width="140px;" />
          <el-table-column label="列表名称" show-overflow-tooltip prop="confTableName" min-width="140px;" />
          <el-table-column label="配置人" prop="updateUser" min-width="140px;" />
          <el-table-column label="配置时间" prop="updateTime" min-width="140px;" />
          <el-table-column label="操作" align="center" min-width="140px;">
            <template slot-scope="{ row }">
              <!-- <el-button v-if="row.isDisable === 0" type="text" @click="reviseConfig(row)">修改</el-button> -->
              <el-button type="text" @click="reviseConfig(row)">修改</el-button>
              <el-button type="text" @click="goConfigDetail(row)">查看</el-button>
              <el-button v-if="row.isDisable === 0" type="text" @click="disableClick(row)">禁用</el-button>
              <el-button v-if="row.isDisable === 1" type="text" @click="openFunc(row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="listQuery.pageParam.pageSize"
      :page.sync="listQuery.pageParam.pageIndex"
      @pagination="getlistData"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import { selectList, tableConfPage, tableConfDisableEnable } from '@/api/config'
import { orgTypelist } from '@/api/dict'

export default {
  components: {
    Pagination
  },
  mixins: [curHeight],
  data() {
    return {
      activeName: '1',
      total: 0,
      reloadParams: {

      },
      listQuery: {
        confTableName: '', // 列表名称
        coreName: '', // 核心企业名称
        operate: '', // 操作端
        productName: '', //	产品名称
        templateTableName: '', // 模板列表
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      listData: [],
      listData2: [],
      operateList: [] // 操作端
    }
  },
  created() {
    this.getlistData()
  },
  methods: {
    handleClick() {
      this.getlistData()
    },
    requestListData() {
      this.getlistData()
    },
    getlistData() {
      if (this.activeName === '1') {
        selectList(this.listQuery).then(res => {
          this.listData = res.data && res.data.list || []
          this.total = res.data && res.data.total || 0
        })
        // 机构类型（下拉类表）操作端
        orgTypelist().then(res => {
          this.operateList = res.data || []
        })
      } else {
        tableConfPage(this.listQuery).then(res => {
          this.listData2 = res.data && res.data.list || []
          this.total = res.data && res.data.total || 0
        })
      }
    },
    goDetail(data) {
      this.$router.push({
        path: 'listConfigDetail',
        query: {
          customId: data.id,
          customListName: data.customListName
        }
      })
    },
    addConfig(data) {
      this.$router.push({
        path: 'addConfig',
        query: {
          type: 'add',
          changeTitle: true,
          curTitle: '新增配置'
        }
      })
    },
    disableClick(data) {
      this.$confirm('禁用后，该表不再展示?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tableConfDisableEnable({
          confId: data.id,
          disableOrEnable: 1
        }).then(res => {
          if (res.code === '0') {
            this.$message.success('禁用成功')
            this.getlistData()
          } else {
            this.$message.warning(res.msg)
          }
        })
      }).catch(() => {
      })
    },
    openFunc(data) {
      // console.log(data)
      tableConfDisableEnable({
        confId: data.id,
        disableOrEnable: 0
      }).then(res => {
        if (res.code === '0') {
          this.$message.success('启用成功')
          this.getlistData()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    reviseConfig(row) {
      this.$router.push({
        path: 'addConfig',
        query: {
          id: row.id,
          changeTitle: true,
          curTitle: '修改配置',
          type: 'revise'
        }
      })
    },
    goConfigDetail(row) {
      this.$router.push({
        path: 'addConfig',
        query: {
          id: row.id,
          changeTitle: true,
          curTitle: '查看配置',
          type: 'preview'
        }
      })
    },
    resetForm() {
      // 重置
    },
    datePickerDate() {
      this.reloadParams.applyDateStart = this.reloadParams.applyDate[0] || ''
      this.reloadParams.applyDateEnd = this.reloadParams.applyDate[1] || ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'addConfig') {
        vm.activeName = '2'
        setTimeout(() => {
          vm.getlistData()
        }, 200)
      }
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
