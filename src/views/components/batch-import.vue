<template>
  <div>
    <!-- 失败提示"上传成功的条数和失败的条数" -->
    <el-dialog
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :title="title"
      class="dialog"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <downLoad
        :file-format="fileFormat"
        :download-url="downloadUrl"
        :file-name="downloadFileName"
        :params="downParams"
        style="margin-bottom: 20px;"
        :method-type="methodType"
        :btn-name="'下载模板文件'"
      />
      <el-upload
        ref="upload"
        :data="uploadParams"
        :multiple="false"
        :show-file-list="true"
        :on-success="handleImageSuccess"
        :on-change="changeFile"
        :on-remove="()=> {
          fileList = []
          flagErrorMsg = false
          responseErrorData = {}
        }"
        :on-error="handleImageError"
        class="image-uploader"
        :headers="token"
        :limit="1"
        :with-credentials="true"
        :auto-upload="false"
        drag
        accept=".xls,.xlsx,.excel"
        :action="uploadUrl"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div v-if="flagErrorMsg" class="errTip">
        <p class="spanTip">已成功导入 {{ responseErrorData.successedCount }} 条，失败 {{ responseErrorData.failedCount }} 条</p>
        <span v-for="(item, index) in responseErrorData.list" :key="'Error'+ index">
          {{ item }}
        </span>
      </div>
      <el-row style="margin-top:15px;">
        <el-col>
          <el-button type="primary" :disabled="fileList.length <= 0" @click="handleClose('success')">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>
<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'BatchImport',
  components: {
    downLoad: (resolve) => require(['./template-xls'], resolve)
  },
  props: {
    // 下载请求方式
    methodType: {
      type: String,
      default: 'post'
    },
    // 下载模板的格式
    fileFormat: {
      type: String,
      default: 'xlsx'
    },
    // 弹窗显隐
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 下载模板的参数
    downParams: {
      type: Object,
      default: () => {}
    },
    // 下载文件的文件名
    downloadFileName: {
      type: String,
      default: ''
    },
    // 标题
    title: {
      type: String,
      default: '批量操作'
    },
    // 上传文件参数
    uploadParams: {
      type: Object,
      default: () => {}
    },
    // 下载文件地址
    downloadUrl: {
      type: String,
      default: ''
    },
    // 上传文件的地址
    uploadUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      token: {
        Authorization: 'Bearer ' + getToken()
      },
      loading: false,
      flagErrorMsg: false,
      // uploadData: [],
      responseErrorData: {}, // 上传失败返回数据
      fileList: []
    }
  },
  created() {},
  methods: {
    changeFile(file) {
      this.fileList.push(file)
    },
    handleImageSuccess(response, file, fileList) {
      this.loading = false
      // this.uploadData.push(fileList)
      if (response.code === '0') {
        this.$emit('success')
        this.$refs['upload'].clearFiles()
        this.$message.success(response.msg || '上传成功')
      } else {
        this.responseErrorData = response.data || {}
        if (response.data) this.responseErrorData.list = response.data && response.data.msgList
        // 上传失败，展示失败条数及成功信息
        this.flagErrorMsg = Object.keys(this.responseErrorData).length > 0
        this.fileList.splice(0, this.fileList.length)
        response.msg && this.$message.error(response.msg)
      }
    },
    handleImageError(err, file, fileList) {
      // 拿不到响应的err对象，做下处理
      const errorResponse = JSON.parse(err.toString().replace('Error: ', ''))
      const errorRes = errorResponse.msg || errorResponse.data && errorResponse.data.errMsg || '上传失败'
      this.loading = false
      this.$refs['upload'].clearFiles()
      errorRes && this.$message.error(errorRes)
      // this.$message.error(response.data.errMsg)
    },
    handleClose(str) {
      if (str === 'success') {
        // 如果有成功的或者失败的数据，说明用户已经上传过数据了，此时用户应该是要关闭弹窗
        if (Object.keys(this.responseErrorData).length > 0) {
          this.$emit('success')
          this.$refs['upload'].clearFiles()
          this.flagErrorMsg = false
          this.responseErrorData = {}
        } else {
          // 上传文件
          this.$refs.upload.submit()
        }
      } else {
        this.flagErrorMsg = false
        this.responseErrorData = {}
        this.$refs['upload'].clearFiles()
        this.fileList.splice(0, this.fileList.length)
        this.$emit('cancel')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog{
    width: 30%;
    min-width: 500px;
  }
  .el-dialog__header {
  border-bottom: 1px solid #e2e2e2;
  }
}
.spanTip {
  color: #4C6072;
  font-size: 14px;
}
.errTip {
 color: red;
 span {
   height: 24px;
   line-height: 24px;
   display: inline-block;
 }
}
</style>
