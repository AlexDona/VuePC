<template>
  <!-- 客户列表 -->
  <div class="app-container">
    <el-form ref="resetForm" :rules="rules" :model="listQuery">
      <el-row :gutter="5">
        <el-col :sm="8" :xs="8">
          <el-form-item prop="coreCustomerId" label="请选择核心企业" label-width="140px">
            <el-select v-model="listQuery.coreCustomerId" style="width:100%" clearable placeholder="">
              <el-option
                v-for="item in coreOptionsList"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :sm="8" :xs="8">
          <el-form-item prop="keyName" label="网址标识" label-width="140px">
            <el-input v-model="listQuery.keyName" maxlength="8" clearable placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :sm="4" :xs="4">
          <el-form-item>
            <span class="palceholderText">输入3-8个字母</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :sm="6" :xs="6">
          <p>更改PC端颜色</p>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :sm="6" :xs="6">
          <el-form-item label="主题颜色" label-width="140px">
            <el-color-picker v-model="listQuery.toneVal" />
            <!-- <themePicker @change="themeChange" /> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span class="titleStyle">上传Logo图片</span>
    <span class="titleStyle">预览</span>
    <div class="uploadImage">
      <div class="imgLeft">
        <cropperImage object-type="Other" file-type-code="logo" :image-url.sync="imageUrl" :file-url.sync="fileUrl" />
      </div>
      <div class="imgCenter">
        <div class="imgLogin">
          <p>登录</p>
          <div class="imgLogin-box">
            <template v-if="imageUrl">
              <img class="imageStyle" :src="imageUrl">
            </template>
          </div>
          <p>200*80</p>
        </div>
        <div class="imgMenu">
          <p>菜单栏</p>
          <div class="imgMenu-box">
            <template v-if="imageUrl">
              <img class="imageStyle" :src="imageUrl">
            </template>
          </div>
          <p>150*60</p>
        </div>
      </div>
      <div class="imgRight">
        <p>移动端登录</p>
        <div class="imgRight-box">
          <template v-if="imageUrl">
            <img class="imageStyle" :src="imageUrl">
          </template>
        </div>
        <p>360*160</p>
      </div>
    </div>
    <!-- 提交 -->
    <div class="btnStyle">
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>

</template>

<script>
import { curHeight } from '@/mixins/requestCurHeight'
import { getByCustTypeId } from '@/api/finance'
import { systemThemeConfig } from '@/api/user'
import { networkKey } from '@/utils/validate'
import { getDefaultConfig } from '@/utils/auth'
export default {
  name: '',
  components: {
    // 上传logo图片
    cropperImage: resolve => require(['@/views/components/cropper-image'], resolve)
  },
  mixins: [curHeight],
  props: {
  },
  data() {
    return {
      listQuery: {
        coreCustomerId: '', // 核心企业
        h5LogoPath: '', // h5 logo地址
        keyName: '', // 标识
        menuLogoPath: '', // 单栏 logo地址
        pcLogoPath: '', // pclogo
        toneVal: '' // 界面色调值，例：#FF0011
      },
      rules: {
        coreCustomerId: [
          { required: true, message: '请选择核心企业', trigger: 'change' }
        ],
        keyName: [
          { required: true, validator: networkKey, trigger: 'change' }
        ]
      },
      imageUrl: '',
      fileUrl: '',
      coreOptionsList: [] // 核心企业下拉数据
    }
  },
  watch: {
    fileUrl: function(val) {
      this.listQuery.h5LogoPath = val
      this.listQuery.pcLogoPath = val
      this.listQuery.menuLogoPath = val
    }
  },
  created() {
    // 获取核心企业下拉数据
    this.getCoreList()
    // 设置默认色
    this.listQuery.toneVal = getDefaultConfig().toneVal
  },
  methods: {
    // 修改主体颜色
    /*  themeChange(val) {
      this.listQuery.toneVal = val
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: this.listQuery.toneVal
      })
      this.$forceUpdate()
    }, */
    // 获取核心企业下拉数据
    getCoreList() {
      getByCustTypeId({
        custTypeId: '6'
      }).then((res) => {
        if (res.code === '0') {
          this.coreOptionsList = res.data
          // 特殊处理数据
          this.coreOptionsList.forEach(item => {
            item.customerId = parseInt(item.customerId)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 提交
    submit() {
      if (!this.fileUrl) return this.$message.warning('请上传主题Logo')
      this.$refs['resetForm'].validate(valid => {
        if (valid) {
          systemThemeConfig(this.listQuery).then(res => {
            if (res.code === '0') {
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadImage {
  display: flex;
  height: 360px;
  .imgLeft {
    width: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 40px;
    border: 1px solid #DDDDDD;
  }
  .imgCenter {
    width: 280px;
    color: #949494;
    margin-right: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    // text-align: center;
    border: 1px solid #DDDDDD;
    .imgLogin-box {
      width: 200px;
      height: 80px;
      border: 1px dashed #DDDDDD;
    }
    .imgMenu-box {
      width: 150px;
      height: 60px;
      border: 1px dashed #DDDDDD;
    }
  }
  .imgRight {
    width: 392px;
    color: #949494;
    border: 1px solid #DDDDDD;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .imgRight-box {
      width: 360px;
      height: 160px;
      justify-content: center;
      border: 1px dashed #DDDDDD;
    }
  }
  .imageStyle {
    width: 100%;
    height: 100%;
  }
}
.titleStyle {
  width: 400px;
  color: #303133;
  font-weight: bold;
  height: 38px;
  line-height: 38px;
  display: inline-block;
}
.btnStyle {
  padding: 20px 0;
}
.palceholderText {
  color: #AAA;
}
</style>

