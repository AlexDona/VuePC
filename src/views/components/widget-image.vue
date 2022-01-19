<template>
  <div class="widget-wrapper">
    <el-collapse v-model="activeNames" :title="title">
      <el-collapse-item name="1" class="collapse-title">
        <template slot="title" class="collapse-title">
          <div style="padding-left: 24px">
            <span
              style="font-size: 16px; color: #333333; margin-right: 50px;  font-weight: normal;"
            >
              {{ title }}
            </span>
            <span v-if="objectType === 'CollectionAccount' && uploadBtn()" class="load">
              <el-button
                size="mini"
                type="primary"
                :disabled="fileListBtn.length <= 0"
                @click.stop="batchDownloads()"
              >批量下载</el-button>
            </span>
          </div>
        </template>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          :default-openeds="openedList"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu v-for="(item, index) in fileList" :key="index" :index="''+index">
            <template slot="title">
              <!-- <i class="el-icon-location" /> -->
              <div
                style="
                  display: table-cell;
                  vertical-align: middle;
                  line-height: 56px;
                "
                @click.stop="checkFile(item, index)"
              >
                <svg-icon class-name="icon-files" icon-class="files" />

                <span class="file_name">{{ item.fileTypeCode }}</span>
                <span class="file_name">
                  [{{ item.fileList.length || 0 }}]
                </span>
                <template v-if="oprType !== 'preview'">
                  <el-upload
                    :ref="'licenseUpload' + index"
                    v-preventReClick
                    class="upload-demo"
                    style="display: inline-block"
                    :action="addressOss"
                    :auto-upload="true"
                    :data="dataOss"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                    :headers="{ Authorization: token }"
                    :before-upload="beforeUpload"
                    accept=".pdf, .png, .jpeg, .bmp, .jpg"
                  >
                    <span class="download" style="float: right; cursor: pointer">
                      <svg-icon class-name="icon-upload" icon-class="upload" />
                      <!-- 下载 -->
                    </span>
                  </el-upload>
                </template>
                <!-- <svg-icon class-name="button-upload" /> -->
              </div>
            </template>
            <el-menu-item-group>
              <!-- <div v-for="item2 of fileList" :key="item2.id" class="file-box"> -->

              <div v-for="(it, idx) in item.fileList" :key="it.id" class="file-box">
                <span style="display: inline-block; overflow: hidden">
                  <svg-icon
                    v-if="it.fileType==='pdf'"
                    style="color: red; font-size: 24px; display: inline-block"
                    icon-class="pdf"
                  />
                  <svg-icon
                    v-else
                    style="color: red; font-size: 24px; display: inline-block"
                    icon-class="img"
                  />
                </span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="it.fileName"
                  placement="top"
                  :open-delay="600"
                  :disabled="it.fileName.length < 40"
                >
                  <span v-if="['word', 'txt', 'excel', 'other'].includes(it.fileType) && !isAssetTypeAnImage(it.fileName)" class="file" @click="handleDownload(it)">
                    {{ it.originalFileName }}
                  </span>
                  <span v-else class="file" @click="preview(it, idx, item.fileList)">
                    {{ it.originalFileName }}
                  </span>
                </el-tooltip>

                <span class="item-actions">
                  <span v-if="['word', 'txt', 'excel', 'other'].includes(it.fileType) && !isAssetTypeAnImage(it.fileName)" class="item-icon" @click="handleDownload(it)">
                    <i class="el-icon-download" style="font-size: 14px; color: #409eff" />
                  </span>
                  <span v-else class="item-icon" @click="preview(it, idx, item.fileList)">
                    <i class="el-icon-zoom-in" style="font-size: 14px; color: #409eff" />
                  </span>
                  <!--下载-->
                  <!--                  <span class="item-icon" @click="handleDownload(it)">-->
                  <!--                    <i-->
                  <!--                      class="el-icon-download"-->
                  <!--                      style="font-size: 14px; color: #409eff"-->
                  <!--                    />-->
                  <!--                  </span>-->
                  <template v-if="oprType !== 'preview'">
                    <span class="item-icon" @click="handleRemove(it)">
                      <i class="el-icon-delete" style="font-size: 14px; color: #409eff" />
                    </span>
                  </template>
                </span>
                <!-- <a class="file" @click="preview(item.fileName)">{{
                  item.fileName
                }}</a>-->
                <!-- <span class="download" style="float: right;cursor:pointer">
                  <i class="el-icon-download"></i>
                </span>-->
                <!-- <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>-->
              </div>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      :title="currentFile.fileName"
      class="el-dialog-wrapper"
      :visible.sync="fileDialogFlagPdf"
      style="left: 60%"
      :modal="true"
      :center="true"
      :modal-append-to-body="false"
      top="10vh"
    >
      <!-- style="left:60%;right:-16px;top:0;margin-top:0;height:1500px;" -->
      <iframe :src="fileUrl" width="100%" :height="windowHeight" />
    </el-dialog>
    <!--    <el-dialog :title="currentTitle[currentImgIndex]" class="el-dialog-wrapper" :visible.sync="fileDialogFlagImg" style="left: 60%;right:-16px;" append-to-body :modal="false">-->
    <!--重复图片预览-->
    <!--      <el-image
        width="80%"
        height="600"
        :src="imageUrl"
        :preview-src-list="imageUrls"
      />-->
    <el-image-viewer
      v-if="fileDialogFlagImg"
      :on-close="closeViwer"
      :url-list="imageUrls"
      :initial-index="currentImgIndex"
      :title-val="currentTitle"
    />
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import {
  getSignature, // 获取oss签名
  checkExists,
  saveFile,
  deleteFlie
} from '@/api/uploadOss'
import { getFileDriList } from '@/api/upload'
import { getToken } from '@/utils/auth'
const SparkMD5 = require('spark-md5')
// let ossCredential = JSON.parse(localStorage.getItem('ossCredential')) || {}
// const OSS = require('ali-oss')
// const clientOss = new OSS({
//   accessKeyId: ossCredential.accessKeyId,
//   accessKeySecret: ossCredential.accessKeySecret,
//   endpoint: ossCredential.endPoint,
//   stsToken: ossCredential.securityToken,
//   // region表示您申请OSS服务所在的地域，例如oss-cn-hangzhou。
//   bucket: ossCredential.bucketName
// })
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'WidgetImage',
  components: {
    ElImageViewer
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          fileTypeCode: '',
          objectId: '',
          objectType: ''
        }
      }
    },
    title: {
      type: String,
      default: '资产影像'
    },
    bizNo: {
      // 	业务编号
      // require: true,
      // type() {
      //   return String | Number
      // },
      type: null,
      default: ''
    },
    fileTypeCode: {
      // 		文件对象子类型
      type: String,
      default: ''
    },
    objectTypeCode: {
      // 		文件对象类型
      type: String,
      default: ''
    },
    oprType: {
      // 查询的文件操作类型  （new-新增、 update修改、preview-查看）
      type: String,
      default: ''
    },
    objectType: {
      // 查询的文件对象类型 （Customer-客户，Project-项目，Task-任务，CollectionAccount-资产）
      type: String,
      default: ''
    },
    flowType: {
      // 查询的文件流程类型 （jdsp-建档审批、khsp-客户审批、rwsp-任务审批、xmsp-项目审批、zcsp-资产审批）
      type: String,
      default: ''
    },
    edit: {
      type: Boolean,
      default: false
    },
    filetypeList: {
      // 展示的文件模块
      type: Array,
      default: () => []
    },
    fileList: {
      //  影像文件   ( {contractImage: [],  合同影响invoiceImage: [],  发票影像 authorization: []  授权书影像}
      type: Array,
      default: () => []
    },
    filetype: {
      // 文件类型
      type: String,
      default: 'Customer'
    }
  },
  data() {
    return {
      fileDialogFlagPdf: false,
      fileDialogFlagImg: false,
      CollectionAccount: 'CollectionAccount',
      token: getToken(),
      activeNames: '1',
      openedList: [], // 打开的子菜单
      dialogVisible: false,
      imageUrl: '',
      fileUrl: '',
      imageUrls: [], // 文件夹预览
      fileIds: [], // 上传图片的id
      fileListBtn: [],
      addressOss: '', // oss文件地址
      dataOss: {}, // oss 参数
      currentFileTypeCode: '', // 当前文件code
      currentMd5: '', // 当前文件MD5值
      currentIndex: '', // 当前的索引
      currentFile: {}, // 当前查看的文件信息-用来设置当前文件名称
      currentImgIndex: 0, // 当前查看预览图片的索引
      currentTitle: [],
      currentFileValidate: false, // 判断当前文件是否允许上传
      windowHeight: 0
    }
  },
  mounted() {
    // 修改和查看的时候都需要掉接口
    if (this.oprType !== 'new') {
      // this.getListFlie(params)
      console.log(this.params, 'this.params')
      if (!this.fileList.length) {
        this.getListFiles(this.params)
      }
    }
    this.$nextTick(() => {
      this.windowHeight = document.body.clientHeight - 250
    })
  },
  methods: {
    getFiles() {
      // 获取文件list
    },
    closeViwer() {
      this.fileDialogFlagImg = false
    },
    checkFile(str, index) {
      this.currentFileTypeCode = str.fileTypeCode
      this.currentIndex = index
    },
    requestMd5Val(file) {
      // console.log(file)
      var fileReader = new FileReader()
      // 此处打印file可看到file下的raw为文件属性
      // var dataFile = file.raw;
      var spark = new SparkMD5.ArrayBuffer()
      // 获取文件二进制数据
      fileReader.readAsArrayBuffer(file)

      // 异步执行函数
      return new Promise((resolve) => {
        fileReader.onload = function(e) {
          spark.append(e.target.result)
          var md5 = spark.end()
          resolve(md5)
        }
      })
    },
    async beforeUpload(file) {
      // if (!this.objectId) {
      //   this.$message.warning('请先保存基本信息再上传文件')
      //   this.$refs.resfVal.abort()
      //   return
      // }
      // 判断当前文件是否允许上传
      this.currentFileValidate = false // 如果出现true的时候再次上传需要重置
      this.currentFileValidate =
        !this.isAssetTypeAnImage(file.name) && !this.isAssetTypeAnPdf(file.name)
      if (this.currentFileValidate) {
        this.$message.warning(
          '只能上传.pdf,.png,.jpeg,.bmp,.jpg,bmp,webp,svg,tiff'
        )
        return
      }
      let isLt2M
      const resfVal = 'licenseUpload' + this.currentIndex
      console.log(resfVal)
      if (file.name.substr(file.name.lastIndexOf('.')) !== '.pdf') {
        isLt2M = file.size / 1024 / 1024 < 100 // 这里做图片大小限制
      } else {
        isLt2M = file.size / 1024 / 1024 < 200 // 这里做文件大小限制
      }
      if (!isLt2M) {
        this.$message.warning('上传图片大小不能超过100M,pdf大小不能超过200M')
        this.$refs.resfVal.abort()
      }
      this.currentMd5 = await this.requestMd5Val(file)
      const exists = await checkExists({ md5: this.currentMd5 }) // 校验是否存在
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const fileName =
        file.name.split('.')[0] +
        '_' +
        exists.data.currentTime +
        '.' +
        file.name.split('.')[1]
      if (exists.data && exists.data.fileInfo && exists.data.fileInfo.md5) {
        // 已经上传过了该图片
        const list = exists.data.fileInfo
        const dataOssObj = {
          bizNo: this.bizNo, //	业务编号
          etag: list.etag, //	oss_etag
          fileName, //	影印件文件名
          filePath: list.filePath, //	影印件文件路径
          fileTypeCode: this.currentFileTypeCode, //	影印件类型
          md5: list.md5, //	文件内容md5值
          objectKey: list.objectKey, //	对象key(oss文件名)
          objectTypeCode: this.objectTypeCode, //	对象类型
          originalFileName: file.name //	原影印件文件名
        }
        // this.addressOss = '/api/file/v1/biz-files'
        saveFile(dataOssObj).then((res) => {
          this.fileList[this.currentFileTypeCode].push(res.data)
          // 保存上传的文件id
          this.fileIds.push(res.data.id)
          // 回传文件ids数据
          this.$emit('fileIdsBack', this.fileIds)
          // const params = {
          //   bizNo: this.bizNo || '',
          //   fileTypeCode: dataOssObj.fileTypeCode,
          //   objectTypeCode: dataOssObj.objectType,
          // }
          // this.getListFlie(params)
          // this.getFileListByid(fileId)
        })
        this.loading.close()
        // 只允许调一次接口
        this.$refs.resfVal.abort()
      } else {
        const signReponse = await getSignature() // 索要签名

        // this.addressOss = signReponse.data.host + '?callback=' + signReponse.data.callback // 上传地址
        this.addressOss = signReponse.data.host // 上传地址
        const fileName =
          file.name.substr(0, file.name.lastIndexOf('.')) +
          '_' +
          exists.data.currentTime +
          '.' +
          file.name.split('.').pop()
        this.dataOss = {
          key: signReponse.data.dir + this.objectType + '/' + fileName,
          OSSAccessKeyId: signReponse.data.accessid,
          policy: signReponse.data.policy,
          signature: signReponse.data.signature,
          callback: signReponse.data.callback,
          'x:md5': this.currentMd5,
          'x:file_name': fileName,
          'x:original_file_name': file.name,
          // 'x:original_file_name': file.name.substr(0, file.name.lastIndexOf('\.')) + '_' + exists.data.currentTime + '.' + file.name.split('.').pop(),
          'x:file_type_code': this.currentFileTypeCode,
          'x:biz_no': this.bizNo,
          'x:object_type_code': this.objectTypeCode
        } // 上传额外参数
      }
      return !isLt2M // return 的值为false的情况不上传
    },
    handlePictureCardPreview() {},
    handleOpen() {},
    handleClose() {},
    // 根据数组对象里的id去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    // 查看时获取文件内容
    async getListFiles(params) {
      const res = await getFileDriList(params)
      if (res.code === '0') {
        this.$emit('update:fileList', res.data || [])

        console.log('getFileDriList resp', res.data)
      } else {
        this.$message.error(res.msg)
      }
    },
    // 查询文件
    // getListFlie(params) {
    //   const fileListNew = this.fileList
    //   getListFlie(params)
    //     .then((res) => {
    //       // 然后再把文件放进相对应的文件夹里面
    //       // debugger
    //       for (const item of res.data) {
    //         for (const key in Object(fileListNew)) {
    //           if (key === item.fileTypeCode) {
    //             fileListNew[key].push(item)
    //             // this.fileListBtn.push(item)
    //             // this.fileList[key].push(item)
    //           }
    //           // 数据去重
    //           this.fileList[key] = this.unique(fileListNew[key])
    //         }
    //         this.fileIds.push(item.id)
    //       }
    //       // 授权书校验是否必传
    //       // 回传文件ids数据
    //       this.$emit('fileIdsBack', this.fileIds)
    //       // this.fileList = list
    //     })
    //     .catch()
    // },
    // 文件上传成功
    uploadSuccess(response, file, fileList) {
      this.loading.close()
      if (response.code === '0') {
        this.$message.success({
          title: '成功',
          message: '上传成功'
        })
        this.fileList[response.data.data.fileTypeCode].push(response.data.data)
        // 保存上传的文件id
        this.fileIds.push(response.data.data.id)
        // 回传文件ids数据
        this.$emit('fileIdsBack', this.fileIds)
        // this.filetypeList.forEach((item) => {
        //   if (response.data.fileTypeCode === item.code) {
        //     this.openedList.push(item.i)
        //   }
        // })
        // this.getListFlie()
      } else {
        // this.$message.warning(response.msg)
      }
    },
    // 文件上传失败
    uploadError() {
      if (this.currentFileValidate) return
      this.loading && this.loading.close()
      this.$message.error({
        title: '失败',
        message: '上传失败'
      })
    },
    // 校验是否为图片格式
    isAssetTypeAnImage(fileName) {
      const _index = fileName.lastIndexOf('.')
      // 获取后缀
      const ext = fileName.substr(_index + 1)
      return (
        ['png', 'jpg', 'jpeg', 'bmp', 'gif'].indexOf(
          ext.toLowerCase()
        ) !== -1
      )
    },
    // 校验是否为excel表
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
    // 校验是否为pdf
    isAssetTypeAnPdf(fileName) {
      const _index = fileName.lastIndexOf('.')
      const ext = fileName.substr(_index + 1)
      return ['pdf'].indexOf(ext.toLowerCase()) !== -1
    },
    // 判断文件后后缀
    isPdf(val) {
      const _index = val.lastIndexOf('.')
      // 获取后缀
      const ext = val.substr(_index + 1)
      if (ext !== 'pdf') {
        return false
      } else {
        return true
      }
    },
    // 批量下载按钮权限判断
    uploadBtn() {
      if (
        this.$store.state.user.name === 'wx_kfcs' ||
        this.$store.state.user.name === 'wx_hgfs1' ||
        this.$store.state.user.name === 'wx_hgcs'
      ) {
        return true
      } else {
        return false
      }
    },
    // 查看文件
    preview(file, index, fileList) {
      // console.log(process.env.VUE_APP_BASE_REQUESTURL)
      // 判断临时授权是否已经过期，如果过期就要重新获取授权
      // const expiration = new Date(ossCredential.expiration)
      // const currentTime = new Date()
      // if (expiration <= currentTime) {
      //   credentials().then((result) => {
      //     result.code === '0' && localStorage.setItem('ossCredential', JSON.stringify(result.data))
      //     ossCredential = JSON.parse(localStorage.getItem('ossCredential')) || {}
      //   })
      // }
      // console.log(file.fileName, index, fileList, 'fileName')
      this.currentFile = file
      this.imageUrls = []
      // this.imageUrl = clientOss.signatureUrl(fileName.objectKey)
      const arr = []
      let baseUrl = ''
      this.fileList.map(item => item.fileList.map(it => arr.push(it)))
      // console.log(arr, 'ssssssssssssssss')
      if (
        this.isAssetTypeAnPdf(file.fileName) ||
        this.isAssetTypeAnExcel(file.fileName)
      ) {
        this.fileDialogFlagImg = false
        this.fileDialogFlagPdf = true
        this.fileUrl = file.fileUrl
      } else if (this.isAssetTypeAnImage(file.fileName)) {
        /*  baseUrl = process.env.NODE_ENV === 'development'
          ? process.env.VUE_APP_BASE_REQUESTURL + decodeURI(file.fileUrl)
          : decodeURI(file.fileUrl)
        this.imageUrl = decodeURI(baseUrl) */
        // 需要重新初始化数据
        this.currentTitle = []
        arr.map((item, index) => {
          if (this.isAssetTypeAnImage(item.fileName)) {
            /*  if (item.fileName === file.fileName) {
              this.currentImgIndex = index
            } */
            this.currentTitle.push(item.fileName)
            baseUrl = process.env.NODE_ENV === 'development'
              ? process.env.VUE_APP_BASE_REQUESTURL + decodeURI(item.fileUrl)
              : decodeURI(item.fileUrl)
            this.imageUrls.push(decodeURI(baseUrl))
            // 当前预览图片下标
            this.currentTitle.length &&
            this.currentTitle.forEach((res, i) => {
              if (res === file.fileName) {
                this.currentImgIndex = i
              }
            })
          }
        })
        this.fileDialogFlagImg = true
        this.fileDialogFlagPdf = false
      }

      // if (
      //   this.isAssetTypeAnPdf(file.fileName) ||
      //   this.isAssetTypeAnExcel(file.fileName)
      // ) {
      //   this.fileDialogFlagImg = false
      //   this.fileDialogFlagPdf = true
      //   this.fileUrl = file.fileUrl
      // } else if (this.isAssetTypeAnImage(file.fileName)) {
      //   this.fileDialogFlagPdf = false
      //   this.fileDialogFlagImg = true
      //
      //   // console.log(process.env.VUE_APP_BASE_REQUESTURL, ' process.env.VUE_APP_BASE_REQUESTURL')
      //   const imageUrls = fileList.map(item => process.env.VUE_APP_BASE_REQUESTURL + item.fileUrl.replace(/^\//, ''))
      //   console.log(imageUrls, 'fileUrl')
      //   this.imageUrls = imageUrls
      //   // this.imageUrls.push(
      //   //   // '/api/file/v1/biz-files/preview/' +
      //   //   //   item2.fileName +
      //   //   //   '?accessToken=' +
      //   //   //   this.token
      //   //   file.fileUrl
      //   // )
      //   console.log(this.imageUrls, 'xxxxxxxxxx')
      //   // 按顺序把文件排序，为了保证查询顺序正确
      //   // this.filetypeList.forEach((item) => {
      //   //   for (const key in Object(this.fileList)) {
      //   //     if (item.fileTypeCode === key) {
      //   //       this.fileList[key].forEach((item2, i) => {
      //   //         if (item2.objectKey.split('.')[1] !== 'pdf') {
      //   //           this.currentTitle.push(item2.objectKey)
      //   //           // 把文件添加到预览文件夹
      //   //           this.imageUrls.push(
      //   //             // '/api/file/v1/biz-files/preview/' +
      //   //             //   item2.fileName +
      //   //             //   '?accessToken=' +
      //   //             //   this.token
      //   //             clientOss.signatureUrl(item2.objectKey)
      //   //           )
      //   //         }
      //   //       })
      //   //     }
      //   //   }
      //   // })
      //   this.currentTitle.length &&
      //     this.currentTitle.forEach((res, i) => {
      //       if (res === file.objectKey) {
      //         this.currentImgIndex = i
      //       }
      //     })
      // }
    },
    // 下载单个文件
    handleDownload(file) {
      // console.log(file, 'ffff')
      window.open(file.fileUrl)
    },
    // 批量下载文件
    batchDownloads() {
      window.open(
        'api/file/v1/biz-files/batchDownload?objectId=' +
          this.objectId +
          '&type=collection'
      )
    },
    // 删除文件
    handleRemove(file) {
      this.fileIds = []
      deleteFlie(file.id).then((res) => {
        if (res.code === '0') {
          // 成功删除之后在文件数组里面根据对应下标把删除的文件给移除
          this.fileList[file.fileTypeCode].forEach((item, index) => {
            if (file.id === item.id) {
              this.fileList[file.fileTypeCode].splice(index, 1)
            }
          })
          // 去除对应的id
          this.fileIds.forEach((item, index) => {
            if (item === file.id) {
              // 保存剩余图片的id
              this.fileIds.splice(index, 1)
            }
          })
          // 回传上传图片的id
          this.$emit('fileIdsBack', this.fileIds)
          this.$message.success('删除成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.load {
  display: inline-block;
}

.upload-demo {
  padding-bottom: 32px;
  margin-left: 20px;
}
::v-deep .el-collapse-item__header {
  background-color: #f5f7f9 !important;
}
.file_name {
  display: inline-block;
  margin-right: 20px;
  margin: 0 0 28px 10px;
  color: #606266;
}
.icon-files {
  display: inline-block;
  width: 34px !important;
  height: 34px !important;
  margin-top: 10px;
}
.icon-upload {
  display: inline-block;
  width: 20px !important;
  height: 20px !important;
  margin-bottom: -6px;
}
::v-deep .el-upload-list--picture-card .el-upload-list__item {
  height: 80px;
  width: 80px;
  line-height: 20px;
}
::v-deep
  .el-upload-list--picture-card
  .el-upload-list__item-actions
  span
  + span {
  margin-left: 0;
}
::v-deep .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
::v-deep .addNone .el-upload--picture-card {
  display: none;
}

.file-box {
  display: flex;
  padding-left: 30px;
  padding-right: 10px;
  height: 40px;
  line-height: 40px;
  color: #b3b3b3;
  // justify-content: ;
  // .download {
  //   :hover {
  //     color: #5cb6ff;
  //   }
  // }
  .file {
    margin-left: 15px;
    flex: 4;
    height: 40px;
    overflow: hidden; /*溢出隐藏*/
    white-space: nowrap; /*规定文本不进行换行*/
    text-overflow: ellipsis;
    display: inline-block;
  }
  .item-actions {
    flex: 4;
    text-align: right;
    // overflow: hidden;
    // float: right;
  }
}
.file-box:hover {
  .file {
    color: #409eff;
  }
  background-color: #f5f7fa;
  cursor: pointer;
}
::v-deep .el-dialog {
  width: 100%;
}
::v-deep .v-modal {
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
::v-deep .title {
  background: rgba($color: #000000, $alpha: 0.2);
  line-height: 40px;
  font-size: 16px;
  position: absolute;
  width: 100%;
  padding-left: 16px;
  color: #fff;
}
::v-deep .el-dialog__body {
  padding: 15px 20px 30px;
}
::v-deep .el-dialog__headerbtn {
  font-size: 20px;
}
</style>
