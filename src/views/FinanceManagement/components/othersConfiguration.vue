
<template>
  <!-- 其他配置 -->
  <div class="container">
    <div class="finace">
      <!-- 自动推送的字段 -->
      <p class="p-style">
        <span class="vertical" />
        <span>自动推送的字段</span>
      </p>
      <div class="checkedFields">
        <el-form ref="rulesForm" label-position="left" :model="listQuery" :disabled="pageMode === 'preview'" :rules="rules" label-width="170px">
          <el-row>
            <el-col>
              <el-form-item label="贷后数据推送" prop="isPushOrder">
                <el-radio-group v-model="listQuery.isPushOrder" @change="changeRadio">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="listQuery.isPushOrder">
            <el-row>
              <el-col
                v-for="key in finaceNeedHeader"
                :key="key"
                :span="4"
              >
                <el-radio v-model="selectHeader" :label="key" @change="changeRadio">{{ key }}</el-radio>
              </el-col>
            </el-row>
            <el-row>
              <div class="finaceChecked">
                <el-checkbox-group v-model="otherCheckboxGroup">
                  <el-checkbox v-for="(item) in finaceNeedList[selectHeader]" :key="item.id" disabled :label="item.materialTemplateId" class="checkboxStyle">{{ item.cloumDesc }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-row>
          </template>
          <!--          <el-row>-->
          <!--            <el-col>-->
          <!--              <el-form-item label="贷后收款单数据推送" prop="isPushBill">-->
          <!--                <el-radio-group v-model="listQuery.isPushBill">-->
          <!--                  <el-radio :label="1">是</el-radio>-->
          <!--                  <el-radio :label="0">否</el-radio>-->
          <!--                </el-radio-group>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row>
            <!--   <el-col>
              <el-form-item label="核心企业授信申请审批" prop="isGroupCompApprove">
                <el-radio-group v-model="listQuery.isGroupCompApprove">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
            <el-col>
              <el-form-item label="授信申请审批流程" prop="creditFlowId">
                <el-select v-model="listQuery.creditFlowId">
                  <el-option
                    v-for="item in creditApplyWorkflow"
                    :key="item.id"
                    :label="item.flowName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--  <el-col>
              <el-form-item label="产业公司授信申请审批" prop="isProdCompAppvove">
                <el-radio-group v-model="listQuery.isProdCompAppvove">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
            <el-col>
              <el-form-item label="用款申请审批流程" prop="loanFlowId">
                <el-select v-model="listQuery.loanFlowId">
                  <el-option
                    v-for="item in useAmtApplyWorkflow"
                    :key="item.id"
                    :label="item.flowName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="授信签约(中介协议)" prop="creditSign">
                <el-radio-group v-model="listQuery.creditSign">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <p class="p-dotted" />
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="引流模式" prop="attractType">
                <el-radio-group v-model="listQuery.attractType" class="radioGroup" @change="changeAttract">
                  <el-radio :label="0">非引流模式</el-radio>
                  <el-radio :label="1">授信引流模式</el-radio>
                  <el-radio :label="2">用款引流模式</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <template v-if="drainageMode && (listQuery.attractType === '' || listQuery.attractType !== 1)">
            <el-row>
              <el-col>
                <el-form-item label="是否为用款引流模式">
                  <el-radio-group v-model="listQuery.attractType" @change="changeUseMoney">
                    <el-radio :label="2">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </template> -->
          <template v-if="listQuery.attractType">
            <el-row>
              <el-col class="systemLink">
                <el-form-item label="系统链接" prop="attractSystemUrl">
                  <el-input v-model="listQuery.attractSystemUrl" maxlength="100" placeholder="录入" @input="changeQrcode('update')" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="qcodeUrl">
              <el-col class="systemLink">
                <el-form-item label="二维码">
                  <el-image
                    style="width: 150px; height: 150px"
                    :src="qcodeUrl"
                    :preview-src-list="new Array(qcodeUrl)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </el-form>
      </div>
      <!--  <div class="btn">
        <el-button v-if="pageMode !== 'preview'" class="btnStyle" type="primary" @click="addSaveFinace('save')">暂存</el-button>
        <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
      </div> -->
    </div>

  </div>
</template>

<script>
import { getProductMaterial, createQrCode, queryFlowTmeplateByType } from '@/api/finance'
export default {
  name: '',
  components: {

  },
  props: {
    // 产品信息
    createProductData: {
      type: Object,
      default: () => {}
    },
    // 其他配置选中字段
    otherCheckbox: {
      type: Array,
      default: () => []
    },
    // 当前页面状态--（add：新增 preview: 查看）
    pageMode: {
      type: String,
      default: ''
    },
    // 产品id
    productId: {
      type: Number,
      default: null
    },
    // 选中的表头
    otherNeedHeader: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listQuery: {
        attractQrPath: '', //	引流系统二维码
        attractSystemUrl: '', //	引流系统链接
        attractType: '', //	引流模式，1授权引流模
        creditFlowId: '', //	是否需要核心企业授信审批，
        loanFlowId: '', //	授信申请审批流程
        isPushBill: '', //	是否推送账单数据，0否1
        isPushOrder: '', //	是否推送订单数据，0否1
        creditSign: 0, //	是授信签约
        productSaveMaterialParamList: [], // 系统模板字段
        productSaveMaterialAddParamList: [] // 客户补充字段
      },
      qcodeUrl: '', // 二维码地址
      rules: {
        isPushOrder: [{ required: true, message: '请选择是否贷后订单推送数据', trigger: 'change' }],
        isPushBill: [{ required: true, message: '请选择是否贷后收款单推送数据', trigger: 'change' }],
        creditFlowId: [{ required: true, message: '请选择授信申请审批流程', trigger: 'change' }],
        loanFlowId: [{ required: true, message: '请选择用款申请审批流程', trigger: 'change' }],
        creditSign: [{ required: true, message: '请选择是否授信签约', trigger: 'change' }],
        attractType: [{ required: true, message: '请选择引流模式', trigger: 'change' }],
        attractSystemUrl: [{ required: true, message: '请输入系统连接', trigger: 'change' }]
      },
      finaceNeedList: [], // 资金方需要的字段
      selectHeader: '', // 当前选中的表头字段
      drainageMode: false, // 引力会模式 默人展示授信引流模式
      otherCheckboxGroup: [], // 对应选版本多选项
      finaceNeedHeader: [], // 资金方需要的字段表头
      createCustomerField: [{ customerName: '' }], // 创建新增字段
      contactImgs: [],
      creditApplyWorkflow: [], // 授信申请审批流程
      useAmtApplyWorkflow: [], // 用款申请审批流程
      timer: '',
      isUploadView: false
    }
  },

  created() {
    this.listQuery = this.createProductData
    // 编辑反显数据
    // if (this.pageMode !== 'add') this.selectHeader = this.otherNeedHeader
    // 获取流程
    this.getFlowTmeplateByType()
    // 获取字段
    this.getProductMaterial()
    // 如果是查看需要根据系统链接获取二维码
    this.pageMode !== 'add' ? this.changeQrcode() : ''
  },
  methods: {
    // 获取字段
    getProductMaterial() {
      const params = {
        parentMaterialType: 3,
        productId: this.pageMode === 'edit' ? this.productId : null
      }
      getProductMaterial(params).then((res) => {
        if (res.code === '0') {
          this.finaceNeedList = res.data.templateMaterialMap
          for (const key in res.data.templateMaterialMap) {
            this.finaceNeedHeader.push(key)
          }
          // 表头选中默认值
          this.selectHeader = this.otherNeedHeader ? this.otherNeedHeader : this.finaceNeedHeader[0]

          this.changeRadio() // 默认选中
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取流程
    getFlowTmeplateByType() {
      // 获取授信流程
      queryFlowTmeplateByType({ flowType: 1 }).then((res) => {
        if (res.code === '0') {
          this.creditApplyWorkflow = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      })
      // 获取用款流程
      queryFlowTmeplateByType({ flowType: 2 }).then((res) => {
        if (res.code === '0') {
          this.useAmtApplyWorkflow = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 贷后订单数据推送
    changeRadio() {
      if (!this.selectHeader) return
      if (this.listQuery.isPushOrder === 1) {
        this.otherCheckboxGroup = this.finaceNeedList[this.selectHeader].map(item => item.materialTemplateId)
      } else {
        this.otherCheckboxGroup = []
        this.selectHeader = this.finaceNeedHeader[0]
      }
    },
    // 引流模式
    changeAttract(val) {
      if (val === 0) {
        this.listQuery.attractSystemUrl = ''
        this.qcodeUrl = ''
      }
    },
    // 新增客户需求补充字段
    createCustomer() {
      this.createCustomerField.push({ customerName: '' })
    },
    // 生成二维码
    changeQrcode(type) {
      const params = {
        content: this.listQuery.attractSystemUrl
      }
      // 如果更新系统连，只需调用一次接口
      if (type === 'update') {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          if (this.listQuery.attractSystemUrl) {
            createQrCode(params).then((res) => {
              this.timer = ''
              this.qcodeUrl = 'data:image/png;base64,' +
              btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            })
          } else {
            this.qcodeUrl = ''
          }
        }, 1000)
      } else {
        this.listQuery.attractSystemUrl && createQrCode(params).then((res) => {
          this.qcodeUrl = 'data:image/png;base64,' +
              btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        })
      }
    },
    // 保存和提交数据
    addSaveFinace(mode) {
      // 请先完善产品信息页数据
      if (mode === 'save' && !this.productId) return this.$message.warning('请先完善产品信息页数据')
      // this.listQuery.isTempSave = 1
      const productSaveMaterialParamList = []
      this.otherCheckboxGroup.forEach(item1 => {
        /*  const parentMaterialArr = this.finaceNeedList[this.selectHeader].filter(item2 => {
          return item2.materialTemplateId === item1
        }) */
        // 重构数据结构
        productSaveMaterialParamList.push({ materialTemplateId: item1, parentMaterialType: 3, productId: this.productId })
      })
      this.listQuery.productSaveMaterialParamList = productSaveMaterialParamList
      // 数据去重(防止用户多次点击重复添加数据)
      this.listQuery.productSaveMaterialParamList = this.lib.arrayUnique(this.listQuery.productSaveMaterialParamList, 'materialTemplateId')
      // 保存数据
      this.$store.dispatch('productMaintain/set_addproductparams', this.listQuery)
      if (mode === 'submit') {
        this.$refs['rulesForm'].validate(valid => {
          if (valid) {
            // 校验通过提交数据
            this.$emit('submit', 'pass')
          }
        })
      } else {
        // 最后一个tabs点提交需要先暂存数据
        this.$emit('save')
      }

      // this.listQuery.productSaveMaterialParamList.length > 0 ? this.$emit('submit', valid, 'otherConfig') : '' // this.$message.error('请选择订单表头数据')
    },
    cancel() {
      const { from } = this.$route.query
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      // 此处必须使用name/params方式跳转路由，否则回到指定路由界面菜单栏会消失
      if (from === 'productList') {
        this.$router.go(-1)
        return
      }
      this.$router.push({
        name: 'ProductMaintain',
        params: {
          isRefresh: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .p-style {
    color: #3E495B;
      font-size: 14px;
      line-height: 14px;
      font-weight: bold;
      display: flex;
      align-items: center;
      .vertical{
        height: 13.33px;
        margin: -2px 6px 0 0;
        border: 1px solid var(--theme);
      }
    }
  .finaceRadio {
    ::v-deep .el-radio__label {
      color: #8796B0;
    }
  }
  .finaceChecked {
    padding: 16px;
    width: 740px;
    border-radius: 4px;
    margin: 15px 0;
    border: 1px solid #979797;
    ::v-deep .el-checkbox__label {
      font-size: 15px;
      font-weight: 550;
      color: #3E495B;
    }
    .checkboxStyle {
      width: 40%;
      padding: 5px 0;
    }
  }
  .customerNeedField,.customerNeedVideo {
    padding-left:  64px;
  }
  .col-Style {
    width: 676px;
  }
  .systemLink {
    width: 738px;
  }
  .p-dotted {
    width: 739px;
    border: 1px dotted #979797;
  }
  .uploadPicture {
    ::v-deep .el-upload--picture-card {
        display: none;
    }
  }
}
</style>

