<template>
  <div class="app-container">
    <el-form ref="resetForm" :model="listQuery" label-position="left">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item prop="contractName" width="150">
            <el-input v-model="listQuery.contractName" type="text" clearable placeholder="协议名称" maxlength="15" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="coreCustName" width="150">
            <el-input v-model="listQuery.coreCustName" type="text" clearable placeholder="核心企业" maxlength="15" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="productId" width="150">
            <el-select v-model="listQuery.productId" style="width: 100%" placeholder="选择产品名称">
              <template v-for="item in productList">
                <el-option :key="item.id" :label="item.productName" :value="item.productId" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="custName" width="150">
            <el-input v-model="listQuery.custName" type="text" clearable placeholder="签约方" maxlength="15" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="applyDate">
            <el-date-picker
              v-model="applyDateRange"
              style="width: 100%"
              type="daterange"
              value-format="yyyy-MM-dd"
              :unlink-panels="true"
              range-separator="至"
              start-placeholder="签约日期"
              end-placeholder="签约日期"
              @change="changeApplyDateRange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div class="btnWidth">
            <el-button type="primary" @click="getQueryList('query')">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="table"
      class="mt24"
      :data="tableData"
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
      <el-table-column label="协议编号" show-overflow-tooltip prop="contractNo" min-width="150px;" />
      <el-table-column label="协议名称" show-overflow-tooltip prop="contractName" min-width="160px" />
      <el-table-column label="核心企业" show-overflow-tooltip prop="coreCustName" min-width="180px;" />
      <el-table-column label="产品名称" show-overflow-tooltip prop="productName" min-width="160px" />
      <el-table-column label="签约方" show-overflow-tooltip prop="custName" min-width="160px" />
      <el-table-column label="签约日期" prop="lastSignTime" min-width="180px" />
      <el-table-column label="操作" prop="cust" min-width="150px;" align="center" fixed="right">
        <template slot-scope="scoped">
          <el-button type="text" @click="handleOperation('check',scoped.row)">查看</el-button>
          <el-button type="text" @click="handleOperation('download',scoped.row)">
            <downloadBtn
              class="downBtn"
              btn-name="下载"
              :download-url="
                `/file/v1/biz-files/${scoped.row.fileId}/download`
              "
              method-type="get"
              file-format="pdf"
              file-name="协议文件"
            />
          </el-button>
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
  </div>
</template>

<script>
import downloadBtn from '@/views/components/template-xls'
import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import { selectPage, getCreditSigningProducts, getFile } from '@/api/ProtocolManagement/protocolManagement'
import { getToken } from '@/utils/auth'

export default {
  name: 'ProtocolManagement',
  components: { Pagination, downloadBtn },
  mixins: [curHeight],
  data() {
    return {
      productList: [],
      applyDateRange: [],
      listQuery: {
        contractName: '', // 协议名称
        coreCustName: '', // 核心企业名称
        custName: '', // 签约方
        productId: '', // 产品id
        productName: '', // 产品名称
        signTimeStart: '',
        signTimeEnd: '',
        pageParam: {
          asc: true,
          orderBy: '',
          pageIndex: 1,
          pageSize: 15
        }
      },
      total: 0,
      tableData: []
    }
  },
  created() {
    this.getQueryList()
    getCreditSigningProducts().then(res => {
      this.productList = res.data || []
    })
  },
  methods: {
    async getQueryList(type) {
      if (type === 'query') this.listQuery.pageParam.pageIndex = 1
      const res = await selectPage(this.listQuery)
      if (res.code === '0') {
        this.tableData = res.data.list
        this.total = res.data.total
        console.log(res)
      } else {
        this.$message.warning(res.msg)
      }
    },
    changeApplyDateRange(range) {
      if (!range) {
        this.applyDate = ['', '']
        this.listQuery.signTimeStart = ''
        this.listQuery.signTimeEnd = ''
      } else {
        this.listQuery.signTimeStart = range[0]
        this.listQuery.signTimeEnd = range[1]
      }
    },
    // 重置
    resetForm() {
      this.applyDateRange = []
      this.listQuery.pageParam.pageIndex = 1
      this.listQuery.signTimeStart = ''
      this.listQuery.signTimeEnd = ''
      this.$refs['resetForm'].resetFields()
      this.getQueryList()
    },
    handlePage(page) {
      console.log(this.listQuery.pageParam)
      this.listQuery.pageParam.pageSize = page.limit
      this.getQueryList()
      // console.log(page)
    },
    async handleOperation(type, row) {
      console.log(type, row)
      if (type === 'check') {
        const res = await getFile({
          fileId: row.fileId
        })
        if (res.code === '0') {
          console.log(res)
          window.open(res.data.fileUrl)
        } else {
          this.$message.warning(res.msg)
        }
      } else {
        // const res = await downloadFile(row.fileId)
        // console.log(typeof res)
        // const link = document.createElement('a')
        // // try {
        // // 如果文件类型不确定的时候，可以不设置type
        // console.log(new File([res], 'files.pdf'), 'ffffffffff')
        // const reader = new FileReader()
        // reader.readAsArrayBuffer(new File([res], 'files.pdf'))
        // let blob
        // reader.onload = (e) => {
        //   debugger
        //   if (typeof e.target.result === 'object') {
        //     blob = new Blob([e.target.result])
        //   } else {
        //     blob = e.target.result
        //   }
        //   const url = window.URL || window.webkitURL || window.moxURL
        //
        //   console.log(Object.prototype.toString.call(blob))
        //   link.href = url.createObjectURL(blob)
        //   link.href = res
        //   link.class = 'ggs'
        //   link.setAttribute('download', '协议文件.pdf')
        //   document.body.appendChild(link)
        //   link.click()
        //   document.body.removeChild(link)
        //   url.revokeObjectURL(link.href)// 销毁url对象
        // }
        // const blob = new Blob(rs)

        // const _fileName = res.headers['content-disposition'].split(';')[1].split('=')[1]// 文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到
        // link.style.display = 'none'
        // // 兼容不同浏览器的URL对象

        // } catch (e) {
        //   console.log('下载的文件出错', e)
        // }
        // window.open(res.data.fileUrl)
        // const res = await downloadFile(row.fileId)
        // window.open('http://dev1919.wxsksystem.com/api/file/v1/biz-files/' + row.fileId + '/download', '_blank')

        var xmlResquest = new XMLHttpRequest()
        xmlResquest.open('get', `/file/v1/biz-files/${row.fileId}/download`, true)
        xmlResquest.setRequestHeader('Content-type', 'application/pdf')
        xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())// 将获取的token放在请求头中（套用时删掉）
        xmlResquest.responseType = 'blob'
        xmlResquest.onload = function(oEvent) {
          var content = xmlResquest.response
          var elink = document.createElement('a')
          elink.download = 'test.pdf'
          elink.style.display = 'none'
          console.log(content, 'content')
          const blob = new Blob([content], {
            type: 'application/pdf'
          })
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
        }
        xmlResquest.send()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.downBtn {
  background: transparent;
  border: none;
  color: #2D61C0;
  padding: 0;
  &:hover {
    background: unset;
    color: unset;
  }
}
</style>
