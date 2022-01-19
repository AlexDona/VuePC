<template>
  <div class="widget-wrapper">
    <el-collapse v-model="activeNames" :title="title">
      <el-collapse-item name="1" class="collapse-title">
        <template slot="title" class="collapse-title">
          <div style="padding-left: 24px">
            <span
              style="font-size: 16px; color: #333333; margin-right: 50px;  font-weight: normal;"
            >{{ title }}
            </span>
          </div>
        </template>
        <el-menu
          default-active="1"
          :unique-opened="true"
          class="el-menu-vertical-demo"
        >
          <el-submenu v-for="(item, index) in filetypeList" :key="index" :index="String(index)">
            <!-- :index="item.i + ''" 默认联动展开、关闭所有子菜单 -->
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
                <span class="file_name">{{ item.name }}</span>
                <!-- 每个文件夹添加对应的类名用于检验文件夹是否上传文件 -->
                <span :class="['file_name', item.code]">
                  [{{ fileList[item.code] ? fileList[item.code].length : "0" }}]
                </span>
                <template v-if="uploadType === 'w'">
                  <el-upload
                    :ref="'licenseUpload' + index"
                    class="upload-demo"
                    style="display: inline-block"
                    action="/api/file/v1/biz-files/upload"
                    :auto-upload="true"
                    :before-upload="beforeUpload"
                    :data="{
                      objectId: Math.random().toString().substr(2),
                      fileTypeCode: item.code,
                      objectType,
                    }"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :show-file-list="false"
                    :headers="{ Authorization: 'Bearer ' + token }"
                    accept=".pdf, .png, .jpeg, .bmp, .jpg"
                  >
                    <span class="download" style="float: right; cursor: pointer">
                      <svg-icon
                        class-name="icon-upload"
                        icon-class="upload"
                      />
                    <!-- 下载 -->
                    </span>
                  </el-upload>
                </template>
                <!-- <svg-icon class-name="button-upload" /> -->
              </div>
            </template>
            <el-menu-item-group>
              <!-- <div v-for="item2 of fileList" :key="item2.id" class="file-box"> -->
              <div v-for="item2 in fileList[item.code]" :key="item2.id" class="file-box">
                <span style="display: inline-block; overflow: hidden">
                  <svg-icon
                    v-if="isPdf(item2.originalFileName)"
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
                  :content="item2.fileName"
                  placement="top"
                  :open-delay="600"
                  :disabled="item2.fileName.length < 40"
                >
                  <span class="file" @click="preview(item2)">
                    {{ item2.originalFileName }}
                  </span>
                </el-tooltip>
                <span class="item-actions">
                  <!-- 预览影像件 -->
                  <span class="item-icon" @click="preview(item2)">
                    <i class="el-icon-zoom-in" style="font-size: 14px; color: #409eff" />
                  </span>
                  <!-- 下载影像件 -->
                  <!-- <span class="item-icon" @click="handleDownload(item2)">
                    <i class="el-icon-download" style="font-size: 14px; color: #409eff" />
                  </span> -->
                  <template v-if="uploadType === 'w'">
                    <span class="item-icon" @click="handleRemove(item2)">
                      <i class="el-icon-delete" style="font-size: 14px; color: #409eff" />
                    </span>
                  </template>
                </span>
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
    <el-image-viewer
      v-if="fileDialogFlagImg"
      :on-close="closeViwer"
      :url-list="imageUrls"
      :initial-index="currentImgIndex"
      :title-val="currentTitle"
    />
  </div>
</template>

<script>
import { getToken, getUserInfo } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'WidgetImage',
  components: {
    ElImageViewer
  },
  props: {
    title: {
      type: String,
      default: '资产影像'
    },
    objectId: {
      // 	用户ID
      type: [String, Number],
      default: ''
    },
    // 是否可以上传
    uploadType: {
      type: String, // w 上传 r 只读
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
    objectType: {
      // 查询的文件对象类型 （Customer-客户，Project-项目，Task-任务，CollectionAccount-资产）
      type: String,
      default: ''
    },
    filetypeList: {
      // 展示的文件模块
      type: Array,
      default: () => []
    },
    fileListData: {
      // 查看页、审批页文件数据
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileDialogFlagPdf: false,
      fileDialogFlagImg: false,
      token: getToken(),
      activeNames: '1',
      openedList: [], // 打开的子菜单
      dialogVisible: false,
      fileUrl: '',
      imageUrls: [], // 文件夹预览
      fileListIds: {}, // 上传图片的id
      fileListBtn: [],
      fileFormat: ['png', 'jpg', 'jpeg', 'bmp', 'pdf'],
      fileList: {},
      currentFileTypeCode: '', // 当前文件code
      currentMd5: '', // 当前文件MD5值
      currentIndex: '', // 当前的索引
      currentFile: {}, // 当前查看的文件信息-用来设置当前文件名称
      currentImgIndex: 0, // 当前查看预览图片的索引
      currentTitle: [],
      windowHeight: 0,
      userInfo: getUserInfo()
    }
  },
  watch: {
    // 检验营业执照知否必传
    /* 'fileList.yyzzCustomer': {
      handler: function() {
        this.$emit('fileListChild', this.fileList)
      },
      deep: true
    } */
    fileListData: {
      handler: function() {
        this.fileList = Object.assign(this.fileList, this.fileListData)
        for (const key in this.fileListData) {
          this.fileListIds[key] = []
          this.fileListData[key].filter((item) => {
            this.fileListIds[key].push(item.id)
          })
        }
        // 回传上传文件所需的id
        this.$emit('update:fileListIds', this.fileListIds)
        this.$forceUpdate()
      },
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.windowHeight = document.body.clientHeight - 250
    })
  },
  methods: {
    closeViwer() {
      this.fileDialogFlagImg = false
    },
    checkFile(str, index) {
      this.currentFileTypeCode = str.code
      this.currentIndex = index
    },
    beforeUpload(file) {
      const vm = this
      // if (!this.objectId) {
      //   this.$message.warning('请先保存基本信息再上传文件')
      //   this.$refs.resfVal.abort()
      //   return
      // }
      const resfVal = 'licenseUpload' + vm.currentIndex
      const fileNameStr = file.name.substr(file.name.lastIndexOf('.') + 1)
      let isLt2M; const fileGs = this.fileFormat.includes(fileNameStr)
      if (!fileGs) {
        vm.$message.warning('只允许上传图片和pdf格式文件')
      }
      console.log(resfVal)
      if (fileNameStr !== 'pdf') {
        isLt2M = file.size / 1024 / 1024 < 50 // 这里做图片大小限制 ---> 图片大小不能超过50M
      } else {
        isLt2M = file.size / 1024 / 1024 < 50 // 这里做文件大小限制 ---> pdf大小不能超过50M
      }
      if (!isLt2M) {
        vm.$message.warning('上传影像件的格式为图片或pdf格式，大小不超过50M')
        vm.$refs.resfVal && vm.$refs.resfVal.abort()
      }
      isLt2M && fileGs && (this.loading = vm.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }))
      // 只允许调一次接口
      vm.$refs.resfVal && vm.$refs.resfVal.abort()
      return isLt2M && fileGs // return 的值为false的情况不上传
    },
    handlePictureCardPreview() {},
    // 根据数组对象里的id去重
    // unique(arr) {
    //   const res = new Map()
    //   return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    // },
    // 文件上传成功
    uploadSuccess(response, file, fileList) {
      this.loading.close()
      if (response.code === '0' || response.code === 200) {
        this.$message.success({
          title: '成功',
          message: '上传成功'
        })
        const obj = {}
        const arr = []
        arr.push(response.data)
        obj[response.data.fileTypeCode] = arr
        this.fileList[response.data.fileTypeCode]
          ? this.fileList[response.data.fileTypeCode].push(response.data)
          : (this.fileList = Object.assign(this.fileList, obj))

        // 保存影像文件id
        if (this.fileListIds[response.data.fileTypeCode] && this.fileListIds[response.data.fileTypeCode].length > 0) {
          if (!this.fileListIds[response.data.fileTypeCode].includes(response.data.id)) {
            this.fileListIds[response.data.fileTypeCode].push(response.data.id)
          }
        } else {
          this.fileListIds[response.data.fileTypeCode] = []
          this.fileListIds[response.data.fileTypeCode].push(response.data.id)
        }
        /*  this.filetypeList.forEach((item) => {
          if (response.data.fileTypeCode === item.code) {
            this.openedList.push(item.i)
          }
        }) */
        // 重置数组触发监听
        // this.$set(this.fileList, file.fileTypeCode, this.fileList[file.fileTypeCode])
        this.$forceUpdate()

        // 回传上传文件所需的id
        this.$emit('update:fileListIds', this.fileListIds)
        // this.getListFlie()
      } else {
        this.$message.warning(response.msg)
      }
    },
    // 文件上传失败
    uploadError() {
      this.loading && this.loading.close()
      this.$message.error({
        title: '失败',
        message: '上传失败'
      })
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
    // 查看文件
    preview(fileName) {
      this.currentFile = fileName
      this.currentTitle = []
      this.imageUrls = []
      let baseUrl = ''
      // this.imageUrl = clientOss.signatureUrl(fileName.objectKey)
      if (this.isAssetTypeAnPdf(fileName.fileName) || this.isAssetTypeAnExcel(fileName.fileName)) {
        this.fileDialogFlagImg = false
        this.fileDialogFlagPdf = true
        baseUrl = process.env.NODE_ENV === 'development'
          ? process.env.VUE_APP_BASE_REQUESTURL + decodeURI(fileName.fileUrl)
          : decodeURI(fileName.fileUrl)
        this.fileUrl = baseUrl
      } else if (this.isAssetTypeAnImage(fileName.fileName)) {
        this.fileDialogFlagPdf = false
        this.fileDialogFlagImg = true
        // 按顺序把文件排序，为了保证查询顺序正确
        this.filetypeList.forEach((item) => {
          for (const key in Object(this.fileList)) {
            if (item.code === key) {
              this.fileList[key].forEach((item2, i) => {
                if (item2.fileName.split('.')[1] !== 'pdf') {
                  this.currentTitle.push(item2.fileName)
                  baseUrl = process.env.NODE_ENV === 'development'
                    ? process.env.VUE_APP_BASE_REQUESTURL + decodeURI(item2.fileUrl)
                    : decodeURI(item2.fileUrl)
                  this.imageUrls.push(baseUrl)
                }
              })
            }
          }
        })
        this.currentTitle.length &&
          this.currentTitle.forEach((res, i) => {
            if (res === fileName.fileName) {
              this.currentImgIndex = i
            }
          })
      }
    },
    // 下载单个文件
    handleDownload(file) {
      window.open('/file/v1/biz-files/' + file.id + '/download', '_blank')
    },
    // 删除文件
    handleRemove(file, index) {
      // 成功删除之后在文件数组里面根据对应下标把删除的文件给移除
      this.fileList[file.fileTypeCode].forEach((item, index) => {
        if (file.id === item.id) {
          this.fileList[file.fileTypeCode].splice(index, 1)
        }
      })
      // 删除id
      this.fileListIds[file.fileTypeCode].splice(this.fileListIds[file.fileTypeCode].indexOf(file.id), 1)
      // 重置数组触发监听
      // this.$set(this.fileList, file.fileTypeCode, this.fileList[file.fileTypeCode])
      this.$forceUpdate()
      // 回传上传文件所需的id
      this.$emit('update: fileListIds', this.fileListIds)
      /*  delFileList(file.id).then((res) => {
        if (res.code === '0' || res.code === 200) {
          // 成功删除之后在文件数组里面根据对应下标把删除的文件给移除
          this.fileList[file.fileTypeCode].forEach((item, index) => {
            if (file.id === item.id) {
              this.fileList[file.fileTypeCode].splice(index, 1)
            }
          })
          // 删除id
          this.fileListIds[file.fileTypeCode].splice(this.fileListIds[file.fileTypeCode].indexOf(file.id), 1)
          // 重置数组触发监听
          // this.$set(this.fileList, file.fileTypeCode, this.fileList[file.fileTypeCode])
          this.$forceUpdate()
          // 回传上传文件所需的id
          this.$emit('update: fileListIds', this.fileListIds)
        }
      }) */
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
