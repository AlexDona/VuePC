<template>
  <div class="container">
    <!-- 新增 -->
    <div class="formBox">
      <el-card class="formBox-left">
        <el-row :gutter="20">
          <el-col>
            <el-form ref="rulesForm" v-model="detailData" label-position="right">
              <el-collapse v-model="activeNameCol2" accordion>
                <el-collapse-item title="审批详情" name="1">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="用款申请编号" label-width="150px" prop="accountNo">
                        <el-input v-model.trim="detailData.accountNo" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row v-for="(item, index) in detailData.detailsData" :key="index + 'detailsData'" :gutter="20">
                    <el-col :span="12">
                      <el-form-item :label="item.productAddCloumDesc" label-width="150px" prop="creditApproveLimit">
                        <el-input v-model.trim="item.productAddCloumNameValue" disabled class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
              <el-collapse v-model="activeNameCol1" accordion>
                <el-collapse-item title="收款账户详情" name="1">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户名称" label-width="150px" prop="collAcctName">
                        <el-input v-model.trim="detailData.collAcctName" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户开户行" label-width="150px" prop="collBank">
                        <el-input v-model.trim="detailData.collBank" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户账号" label-width="150px" prop="collAcctNo">
                        <el-input v-model.trim="detailData.collAcctNo" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <div class="btnStyle">
            <el-button plain @click="cancel()">关闭</el-button>
          </div>
        </el-row>
      </el-card>
      <el-card class="formBox-right">
        <widget-image title="用款影像" :filetype-list="fileTypeList" :file-list.sync="fileList" opr-type="preview" :params="params" />
      </el-card>
    </div>
  </div>
</template>

<script>
import widgetImage from '@/views/components/widget-image'
// import { approveSubmit, approveStorage, approveStorageView } from '@/api/credit'
import { loanapplyDetail } from '@/api/loan'
import { getProductDetail } from '@/api/finance'

export default {
  name: 'LoanAppDetail',
  components: {
    widgetImage
  },
  data() {
    return {
      errorTip: false,
      fileList: [],
      fileTypeList: [{
        idx: '0',
        name: '用款影像'
      }],
      activeNameCol1: '1',
      activeNameCol2: '1',
      activeNameCol3: '1',
      params: {
        objectId: ''
      },
      detailData: {}
    }
  },
  created() {
    const { id } = this.$route.query
    // this.params.objectId = this.detailData.accountNo
    loanapplyDetail(id).then(res => {
      this.detailData = res.data
      this.getConfig()
    })
  },
  methods: {
    getConfig() {
      const detailsData = []
      getProductDetail({
        productId: this.detailData.productId
      }).then(res => {
        if (res.code === '0') {
          const filedJSON = JSON.parse(this.detailData.fieldJson)
          console.log(filedJSON, 'filedJSON')
          res.data.productMaterialAddList.filter(item => {
            if (item.materialType === 2 && item.productAddCloumType === 1) { // materialType 授信1 2用款资料  productAddCloumType 1普通字段 2 影像资料
              item.productAddCloumNameValue = filedJSON[item.productAddCloumName] || null
              detailsData.push(item)
            }
          })
          this.$set(this.detailData, 'detailsData', detailsData)

          const newObj = this.detailData
          this.$emit('update:detailData', newObj)
          this.params.objectId = this.detailData.accountNo
          console.log(this.detailData, 'this.detailData')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  // background: #fff;
  margin: 0 22px;
  .success {
    border: none;
    background: var(--theme);
  }
  .continue {
    border: none;
    background: #6095FF;
  }
  .refuse {
    border: none;
    background: #FF4717;
  }
  .comment {
    position: relative;
   &::before {
     position: absolute;
     content: '*';
     top: 8px;
     left: 70px;
     color: red;
   }
  }
  .tip {
    display: none;
  }
  .errorTip {
    display: block;
    color: red;
  }
  .form-title {
    margin-top: 0;
    padding: 13px 24px;
    background-color: #F5F7F9;
    margin-bottom: 13px;
  }
  .formBox{
    display: flex;
    justify-content: space-between;
    .formBox-left {
    ::v-deep {
      .el-collapse-item__header{
        font-size: 16px;
        padding-left: 32px;
        background: #F5F7F9;
        margin-bottom: 20px;
      }
      .el-textarea__inner {
      min-height: 100px !important;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }
    }
      width: 75%;
    }
    .formBox-right {
      width: 24%;
    }
    ::v-deep.el-card__body {
      padding: 0;
    }
  }
  ::v-deep .el-collapse-item__wrap {
    border-bottom: none;
  }
  .btnStyle {
    margin: 50px 0 50px 20px;
  }
}
</style>
