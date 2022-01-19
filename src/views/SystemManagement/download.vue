<template>
  <!-- 下载管理 -->
  <div class="download-wrapper">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="listQuery.reqBizName" placeholder="报表名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button plain @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="150"
      />
      <el-table-column
        prop="reqBizName"
        label="报表名称"
        min-width="150"
      />
      <el-table-column
        prop="applyTime"
        label="申请下载时间"
        min-width="120"
      />
      <el-table-column
        prop="fileStatus"
        label="状态"
        min-width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fileStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="100"
      >
        <template slot-scope="scope">
          <!-- <el-button v-if="scope.row.fileStatus === 1" type="text" size="small" @click="downloadReport(scope.row)">下载</el-button> -->
          <downloadBtn
            v-if="scope.row.fileStatus === 1"
            btn-name="下载"
            download-url="/file/v1/fileSyncDownload/downloadFile"
            method-type="get"
            :params="{downloadId: scope.row.id}"
            :btn-type="'text'"
            file-name="订单列表数据"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageParam.pageIndex" :limit.sync="listQuery.pageParam.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { queryPage } from '@/api/management'
// const ossCredential = JSON.parse(localStorage.getItem('ossCredential')) || {}
// const OSS = require('ali-oss')
// const clientOss = new OSS({
//   accessKeyId: ossCredential.accessKeyId,
//   accessKeySecret: ossCredential.accessKeySecret,
//   endpoint: ossCredential.endPoint,
//   stsToken: ossCredential.securityToken,
//   // region表示您申请OSS服务所在的地域，例如oss-cn-hangzhou。
//   bucket: ossCredential.bucketName
// })

export default {
  name: 'Download',
  components: {
    Pagination,
    downloadBtn: (resolve) => require(['@/views/components/template-xls'], resolve)
  },
  filters: {
    statusFilter(data) {
      const str = data === 1 ? '处理完成' : '处理中'
      return str
    }
  },
  data() {
    return {
      listQuery: {
        reqBizName: '',
        pageParam: {
          pageIndex: 1,
          pageSize: 15
        }
      },
      total: 0,
      tableData: [],
      orderDownParams: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      queryPage(this.listQuery).then(res => {
        this.tableData = res.data && res.data.list
        this.total = res.data && res.data.total
      })
    },
    onSearch() {
      this.listQuery.pageParam.pageIndex = 1
      this.getList()
    },
    onReset() {
      this.listQuery.reqBizName = ''
      this.listQuery.pageParam.pageIndex = 1
      this.getList()
    }
    // downloadReport(data) {
    //   this.orderDownParams.downloadId = data.id
    //   // 配置响应头实现通过URL访问时自动下载文件，并设置下载后的文件名。
    //   // const filename = data.reportName + '.' + data.objectKey.split('.').pop() // 自定义下载后的文件名。
    //   // const response = {
    //   //   'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
    //   // }
    //   // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    //   // const url = clientOss.signatureUrl(data.objectKey, { response })
    //   // window.open(data)
    // }
  }
}
</script>

<style scoped>
  .download-wrapper{
    padding: 22px 32px;
    margin: 0 22px;
    background: #fff;
  }
</style>
