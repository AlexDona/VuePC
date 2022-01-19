<template>
  <el-form
    ref="resetForm"
    class="dialog-form"
  >
    <el-row>
      <el-col :sm="4" :xs="4">
        <el-button
          type="primary"
          @click.stop="handleDownload"
        >下载模板文件</el-button>
      </el-col>
    </el-row>
    <el-row class="upload-title">请上传模板对应的审批结果文件</el-row>

    <el-row>
      <el-col>
        <el-form-item>
          <el-button plain @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'CreditUploadDialog',
  data() {
    return {
      dataObj: { token: '', key: '' }
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess() {
      this.emitInput(this.tempUrl)
    },
    cancel() {
      this.$refs['resetForm'].resetFields()
      this.$emit('cancel')
    },
    handleDownload() {},
    submit() {}
  }
}
</script>

<style lang="scss" scoped>
.dialog-form {
  .upload-title {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .image-uploader {
    margin-bottom: 20px;
  }
}
</style>
