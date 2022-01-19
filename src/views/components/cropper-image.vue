<template>
  <!-- 上传图片并且支持剪切 -->
  <div>
    <!-- <el-dialog title="图片剪裁" :visible.sync="shearPlateVisible" append-to-body> -->
    <template v-if="shearPlateVisible">
      <div class="cropper-content">
        <!-- <div class="cropper" style="text-align:center"> -->
        <vueCropper
          ref="cropper"
          :img="option.img"
          :output-size="option.outputSize"
          :output-type="option.outputType"
          :info="option.info"
          :can-scale="option.canScale"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :fixed="option.fixed"
          :fixed-box="option.fixedBox"
        />
        <!-- :fixed-number="option.fixedNumber" -->
        <!-- </div> -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btnStyle" @click="resetUpload">重新上传</el-button>
        <el-button class="btnStyle" type="primary" :loading="loading" @click="finish">确认</el-button>
      </div>
    </template>
    <!-- 上传图片 -->
    <template v-else>
      <div>
        <el-upload
          class="avatar-uploader"
          :class="{ 'active-avatar': !imageUrl }"
          action="/api/file/v1/biz-files/upload"
          :data="{
            objectId,
            fileTypeCode,
            objectType,
          }"
          :headers="{ Authorization: 'Bearer ' + token }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          accept=".pdf, .png, .jpeg, .bmp, .jpg"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </div>
    </template>
    <!-- </el-dialog> -->
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { uploadFile } from '@/api/upload'
import { getToken } from '@/utils/auth'
export default {
  components: {
    VueCropper
  },
  props: {
    objectType: {
      // 查询的文件对象类型 （Customer-客户，Project-项目，Task-任务，CollectionAccount-资产）
      type: String,
      default: ''
    },
    fileTypeCode: {
      // 		文件对象子类型
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      shearPlateVisible: false, // 显示剪切板
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 80, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: true, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        canMove: true
      },
      token: getToken(),
      objectId: Math.random().toString().substr(2),
      picsList: [], // 页面显示的数组
      // 防止重复提交
      loading: false,
      fileinfo: {}
    }
  },
  methods: {
    // 上传前校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 上传成功后将图片地址赋值给裁剪框显示图片
    handleAvatarSuccess(res, file, fileList) {
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw)
        this.fileinfo = res
        this.imageFormat = res.data.originalFileName.split('.')[1]
        this.shearPlateVisible = true
      })
    },
    // 重新上传
    resetUpload() {
      this.option.img = ''
      this.fileinfo = ''
      this.shearPlateVisible = false
    },
    // 剪切
    finish() {
      this.$refs.cropper.getCropBlob((blob) => {
        this.imageUrl = URL.createObjectURL(blob)
        // this.loading = true
        this.shearPlateVisible = false
        const formData = new FormData()
        formData.append('objectId', this.objectId)
        formData.append('fileTypeCode', this.fileTypeCode)
        formData.append('objectType', this.objectType)
        formData.append('file', blob, new Date().getTime() + '.' + this.imageFormat)
        uploadFile(formData).then((response) => {
          if (response.code === '0') {
            this.$message.success('操作成功')
            this.$emit('update:imageUrl', this.imageUrl)
            this.$emit('update:fileUrl', response.data.fileUrl)
          } else {
            this.$message.error('操作失败')
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .avatar-uploader{
    /* background:red!important; */
    border-radius: 5px;
    width: 360px;
    height:150px;
    text-align: center;
    line-height: 150px;
  }
  ::v-deep {
    .el-upload {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  // .active-avatar {
  //   border: 1px dashed #DDD;
  // }
  .el-icon-plus{
    color: #DDDDDD;
    font-size:30px;
  }
  .cropper-content{
    width: 360px;
    height: 300px;
    ::v-deep {
      .vue-cropper {
        background-image: none;
      }
    }
  }
  .cropper{
    width: 360px;
    height:300px;
    background: #fff;
  }
  .dialog-footer {
    // text-align: center;
    padding-top: 5px;
    padding-left: 10px;
  }
  .btnStyle {
    width: 100px;
    border: 1px solid #E1E1E1;
  }
</style>
