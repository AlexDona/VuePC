<template>
  <div class="btn-wrapper">
    <template v-if="oprType === 'new'">
      <el-upload
        ref="licenseUpload"
        class="upload-demo"
        :class="disabled ? 'gray' : 'green'"
        :action="addressOss"
        :auto-upload="true"
        :data="dataOss"
        :disabled="disabled"
        :list-type="showType === 'btn' ? '' : 'picture-card'"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="false"
        :headers="{ Authorization: 'Bearer ' + token }"
        :before-upload="beforeUpload"
        accept=".pdf,.png,.jpeg,.bmp,.jpg"
      >
        <el-button v-if="showType === 'btn'" type="primary">点击上传</el-button>
        <template v-else>
          <i class="el-icon-plus" />
          <span>点击上传</span>
        </template>
      </el-upload>
    </template>
    <div
      v-for="item in fileList"
      :key="item.id"
      class="file-box"
    >
      <div class="fileText">
        <span class="filename" @click="preview(item)">{{ item.fileName }}</span>
        <span class="item-actions">
          <span class="item-icon" @click="preview(item)">
            <i
              class="el-icon-zoom-in"
              style="font-size:14px;color: #409eff;"
            />
          </span>
          <template v-if="oprType === 'new' && !disabled">
            <span
              class="item-icon"
              @click="handleRemove(item)"
            >
              <i
                class="el-icon-delete"
                style="font-size:14px;color: #409eff;"
              />
            </span>
          </template>
        </span>
      </div>
    </div>
    <el-dialog
      :title="currentFile.fileName"
      class="el-dialog-wrapper"
      :visible.sync="fileDialogFlagPdf"
      style="left:60%;"
      :center="true"
      :append-to-body="true"
      :modal-append-to-body="false"
      top="10vh"
    >
      <iframe class="iframe" :src="fileUrl" width="100%" :height="windowHeight" />
    </el-dialog>
    <el-image-viewer
      v-if="fileDialogFlagImg"
      v-loading="loading"
      :on-close="closeViwer"
      :url-list="imageUrls"
      :initial-index="currentImgIndex"
      :title-val="currentTitle"
    />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import {
  getSignature, // 获取oss签名
  checkExists,
  postFiles,
  // getListFlie,
  deleteFlie,
  credentials
} from '@/api/uploadOss'
import { getToken } from '@/utils/auth'
const SparkMD5 = require('spark-md5')
let ossCredential = JSON.parse(localStorage.getItem('ossCredential')) || {}
const OSS = require('ali-oss')
const clientOss = new OSS({
  accessKeyId: ossCredential.accessKeyId,
  accessKeySecret: ossCredential.accessKeySecret,
  endpoint: ossCredential.endPoint,
  stsToken: ossCredential.securityToken,
  // region表示您申请OSS服务所在的地域，例如oss-cn-hangzhou。
  bucket: ossCredential.bucketName
})
export default {
  name: 'MyWidgetImage',
  components: {
    ElImageViewer
  },
  props: {
    objectId: {
      type: String,
      default: ''
    },
    oprType: {
      // 查询的文件操作类型  （new-新增、preview-查看）
      type: String,
      default: ''
    },
    objectTypeCode: {
      // 查询的文件对象类型 （成员单位：ORG）
      type: String,
      default: ''
    },
    fileTypeCode: {
      // 文件对象子类型 （授权书：authorization）
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    },
    showType: {
      type: String,
      default: ''
    }
    // isOperation: {
    //   // 文件操作权限 （预览: preview 删除：delete 下载： download  均为Boolean值）
    //   type: Object,
    //   default: () => {}
    // }
  },
  data() {
    return {
      fileDialogFlagPdf: false,
      fileDialogFlagImg: false,
      token: getToken(),
      // openedList: [], // 打开的子菜单
      // dialogVisible: false,
      // dialogImageUrl: '',
      // fileDialogFlag: false, // 文件展示弹窗
      fileUrl: '',
      // isDisabled: disabled,
      loading: false,
      // imageUrl: '',
      // objectTypeCodeList: [],
      imageUrls: [], // 文件夹预览
      // fileListBtn: [],
      // fileList: [],
      // fileIdList: [], // 保存上传后文件id
      addressOss: '', // oss文件地址
      dataOss: {}, // oss 参数
      currentMd5: '', // 当前文件MD5值
      currentIndex: '', // 当前的索引
      currentFile: {}, // 当前查看的文件信息-用来设置当前文件名称
      currentImgIndex: 0, // 当前查看预览图片的索引
      currentTitle: [],
      windowHeight: 0
    }
  },
  created() {
    this.$nextTick(() => {
      this.windowHeight = document.body.clientHeight - 250
    })
  },
  methods: {
    // 获取文件列表
    // getListFlie(params) {
    //   let data = {}
    //   // 如果是上传后获取的参数就用传过来的参数，否则就用父组件传过来的参数
    //   if (params) {
    //     data = params
    //   } else {
    //     data = {
    //       fileTypeCode: this.fileTypeCode,
    //       objectTypeCode: this.objectTypeCode
    //     }
    //   }
    //   this.fileList = []
    //   this.fileIdList = []
    //   getListFlie(data).then(res => {
    //     if (res.code === '0') {
    //       // this.contractData = res.data
    //       this.fileList = res.data
    //       // 回传id
    //       this.fileList.forEach(item => {
    //         this.fileIdList.push(item)
    //       })
    //       const uniqueFileId = this.unique(this.fileIdList)
    //       this.$emit('fileIdList', uniqueFileId)
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   }).catch((err) => {
    //     err.response && this.$message.error(err.response.data.$message)
    //   })
    // },
    requestMd5Val(file) {
      // console.log(file)
      var fileReader = new FileReader()
      // 此处打印file可看到file下的raw为文件属性
      // var dataFile = file.raw;
      var spark = new SparkMD5.ArrayBuffer()
      // 获取文件二进制数据
      fileReader.readAsArrayBuffer(file)
      // 异步执行函数
      return new Promise(resolve => {
        fileReader.onload = function(e) {
          spark.append(e.target.result)
          var md5 = spark.end()
          resolve(md5)
        }
      })
    },
    // 根据数组对象里id去重，并返回某字段的数组
    // unique(array) {
    //   const res = new Map()
    //   const arrNew = array.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    //   const backStrArr = []
    //   arrNew.forEach(item => {
    //     backStrArr.push(item.id)
    //   })
    //   return backStrArr
    // },
    // 上传文件前
    async beforeUpload(file) {
      const resfVal = 'licenseUpload'
      console.log(resfVal)
      // if (!this.bizNo) {
      //   this.$message.warning('请先保存基本信息再上传文件')
      //   this.$refs.resfVal.abort()
      //   return
      // }
      let isLt2M
      if (file.name.substr(file.name.lastIndexOf('\.')) !== '.pdf') {
        isLt2M = file.size / 1024 / 1024 < 100 // 这里做文件大小限制
      } else {
        isLt2M = file.size / 1024 / 1024 < 200 // 这里做文件大小限制
      }
      if (!isLt2M) {
        this.$message.warning('上传图片大小不能超过100M,pdf大小不能超过200M')
        return false
      }
      this.currentMd5 = await this.requestMd5Val(file)
      const exists = await checkExists({ md5: this.currentMd5 }) // 校验是否存在
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fileName = file.name.split('.')[0] + '_' + exists.data.currentTime + '.' + file.name.split('.')[1]
      if (exists.data && exists.data.fileInfo && exists.data.fileInfo.md5) {
        // 已经上传过了该图片
        const list = exists.data.fileInfo
        const dataOssObj = {
          // etag: list.etag, //	oss_etag
          fileName, //	影印件文件名
          filePath: list.filePath, //	影印件文件路径
          fileTypeCode: this.fileTypeCode, //	影印件类型
          md5: list.md5, //	文件内容md5值
          objectKey: list.objectKey, //	对象key(oss文件名)
          objectId: this.objectId,
          objectType: this.objectTypeCode, //	对象类型（ 成员单位 ORG ）
          originalFileName: file.name //	原影印件文件名
        }
        postFiles(dataOssObj).then(res => {
          if (res.data) {
            // this.getListFlie()
            // this.fileIdList = []
            this.fileList.push(res.data)
            // 回传id
            // this.fileIdList.push(res.data)
            // const uniqueFileId = this.unique(this.fileIdList)
            this.$emit('fileIdList', this.fileList)
          }
        }).catch(error => {
          this.$message.error(error.response.data.msg)
        })
        this.loading.close()
        this.$refs.resfVal.abort()
      } else {
        const signReponse = await getSignature() // 索要签名
        this.addressOss = signReponse.data.host // 上传地址
        // 上传额外参数
        this.dataOss = {
          key:
            signReponse.data.dir +
            this.objectTypeCode +
            '/' + fileName,
          OSSAccessKeyId: signReponse.data.accessid,
          policy: signReponse.data.policy,
          signature: signReponse.data.signature,
          callback: signReponse.data.callback,
          'x:md5': this.currentMd5,
          // 'x:file_name': fileName,
          'x:original_file_name': file.name,
          // 'x:original_file_name': file.name.substr(0, file.name.lastIndexOf('\.')) + '_' + exists.data.currentTime + '.' + file.name.split('.').pop(),
          'x:file_type_code': this.fileTypeCode,
          'x:object_id': this.objectId,
          'x:object_type': this.objectTypeCode
        }
      }
      return isLt2M && file.name.substr(0, file.name.lastIndexOf('\.'))
    },
    // 文件上传成功
    uploadSuccess(response, file, fileList) {
      const dataResponse = response.data
      // const params = {
      //   fileTypeCode: dataResponse.fileTypeCode,
      //   objectTypeCode: dataResponse.objectTypeCode
      // }
      // this.getListFlie(params)
      this.fileList.push(dataResponse)
      // this.fileIdList.push(dataResponse)
      // const uniqueFileId = this.unique(this.fileIdList)
      this.$emit('fileIdList', this.fileList)
      this.loading.close()
      if (response.code === '0') {
        this.$message.success({
          title: '成功',
          message: '上传成功'
        })
      }
    },
    // 文件上传失败
    uploadError() {
      // this.isDisabled = false
      this.loading && this.loading.close()
      this.$message.error({
        title: '失败',
        message: '上传失败'
      })
    },
    isAssetTypeAnPdf(fileName) {
      const _index = fileName.lastIndexOf('.')
      const ext = fileName.substr(_index + 1)
      return ['pdf'].indexOf(ext.toLowerCase()) !== -1
    },
    isAssetTypeAnImage(fileName) {
      const _index = fileName.lastIndexOf('.')
      // 获取后缀
      const ext = fileName.substr(_index + 1)
      return (
        [
          'png',
          'txt',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff'
        ].indexOf(ext.toLowerCase()) !== -1
      )
    },
    isAssetTypeAnExcel(fileName) {
      if (!fileName) {
        return false
      }
      const _index = fileName.lastIndexOf('.')
      // 获取后缀
      const ext = fileName.substr(_index + 1)
      return (
        [
          'doc',
          'ppsm',
          'potx',
          'pps',
          'ppt',
          'ppsx',
          'pptx',
          'xlsm',
          'xls',
          'xlsb',
          'xlsx',
          'dotx',
          'docx'
        ].indexOf(ext.toLowerCase()) !== -1
      )
    },
    // 查看文件
    preview(file) {
      this.loading = true
      this.closeViwer()
      // 判断临时授权是否已经过期，如果过期就要重新获取授权
      const expiration = new Date(ossCredential.expiration)
      const currentTime = new Date()
      if (expiration <= currentTime) {
        credentials().then((result) => {
          result.code === '0' && localStorage.setItem('ossCredential', JSON.stringify(result.data))
          ossCredential = JSON.parse(localStorage.getItem('ossCredential')) || {}
        })
      }
      this.currentFile = file
      this.currentTitle = []
      this.imageUrls = []
      // this.imageUrl = clientOss.signatureUrl(fileName.objectKey)
      if (this.isAssetTypeAnPdf(file.fileName) || this.isAssetTypeAnExcel(file.fileName)) {
        this.fileDialogFlagImg = false
        this.fileDialogFlagPdf = true
        this.fileUrl = clientOss.signatureUrl(file.objectKey)
      } else if (this.isAssetTypeAnImage(file.fileName)) {
        this.fileDialogFlagPdf = false
        this.fileDialogFlagImg = true
        this.fileList.forEach((item2) => {
          if (item2.fileName.split('.')[1] !== 'pdf') {
            this.currentTitle.push(item2.fileName)
            // 把文件添加到预览文件夹
            this.imageUrls.push(
              clientOss.signatureUrl(item2.objectKey)
            )
          }
        })
        this.currentTitle.length &&
          this.currentTitle.forEach((res, i) => {
            if (res === file.fileName) {
              this.currentImgIndex = i
            }
          })
        this.loading = false
      }
    },
    // 删除文件
    handleRemove(item) {
      deleteFlie(item.id).then(res => {
        if (res.code === 200) {
          // this.getListFlie()
          this.fileList.forEach((res, i) => {
            if (res.id === item.id) {
              this.fileList.splice(i, 1)
            }
          })
          this.$message.success('删除成功')
        }
      })
    },
    // 关闭文件预览窗口
    closeViwer() {
      this.fileDialogFlagImg = false
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-demo{
  width: 100%;
}
::v-deep .el-upload.el-upload--text{
  width: 100%;
  text-align: left;
}
::v-deep .file-box{
  width: 300px;
  line-height: 40px;
  text-align: left;
}
.el-dialog-wrapper{
  padding: 10px;
  ::v-deep .el-dialog.el-dialog--center{
    width: 100%;
  }
}
::v-deep .v-modal{
  left: 60%;
}
::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}
::v-deep .el-collapse-item__wrap:last-child {
  border-bottom: none;
}
::v-deep .el-image-viewer__wrapper {
  left: 60%;
}
.fileText{
  display: flex;
  color: #409eff;
  justify-content: space-between;
  .filename {
    display: inline-block;
    width: 80%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .item-actions{
    display: inline-block;
    width: 20%;
  }
}
.item-icon{
  padding-left: 10px;
}
.file-box:hover {
  .file {
    color: #409eff;
  }
  background-color: #f5f7fa;
  cursor: pointer;
}
.gray{
  width: 200px;
}
::v-deep .gray .el-upload--picture-card{
  // background: gray;
  // border-color: gray;
  cursor: not-allowed;
}
::v-deep .green .el-upload--picture-card{
  // background: gray;
  // border-color: gray;
  cursor: pointer;
}
</style>
