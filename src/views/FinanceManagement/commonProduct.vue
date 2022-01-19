
<template>
  <div class="app-container">
    <div class="containerBox">
      <!-- 预览 -->
      <div v-if="isPreview">
        <p class="title">产品信息</p>
        <productDetailPreview :preview-data="createProductData" />
        <p class="title">授信资料清单</p>
        <div class="pro-container">
          <creditInfoList
            v-if="isShow"
            :page-mode="'preview'"
            :product-id="productId"
            :need-edit-temp-cloum="false"
            :finace-checkbox="finaceNeedCheckbox"
            :finace-need-header="finaceNeedHeader"
            :credit-create-field-common="creditCreateFieldCommon"
            :credit-create-field-video="creditCreateFieldVideo"
            @save="save"
          />
        </div>
        <p class="title">用款资料清单</p>
        <div class="pro-container">
          <useCreditList
            v-if="isShow"
            :page-mode="'preview'"
            :product-id="productId"
            :check-list="checkboxList"
            :checkbox-header="checkboxHeader"
            :use-create-field-video="useCreateFieldVideo"
            :use-create-field-common="useCreateFieldCommon"
            @save="save"
          />
        </div>
        <p class="title">其他配置</p>
        <div class="pro-container">
          <othersConfiguration
            v-if="isShow"
            :page-mode="'preview'"
            :product-id="productId"
            :other-need-header="otherNeedHeader"
            :other-checkbox="otherNeedCheckbox"
            :create-product-data="createProductData"
            @save="save"
          />
        </div>
        <el-button class="btnStyle" plain @click="cancelSubmit">关闭</el-button>
      </div>
      <!-- 新增产品 -->
      <div v-show="!isPreview">
        <div class="createProduct">
          <div class="productLeft">
            <el-tabs v-model="activeName" class="eltabsStyle" :before-leave="beforeLeave">
              <el-tab-pane :disabled="true" :lazy="true" name="1">
                <span slot="label"><span class="number">①</span> 产品信息</span>
                <productDetail
                  v-if="pageMode === 'add' || isShow"
                  ref="productDetail"
                  :page-mode="pageMode"
                  :create-product-data="createProductData"
                  :product-id="productId"
                  @save="save"
                />
              </el-tab-pane>
              <el-tab-pane :disabled="true" :lazy="true" name="2">
                <span slot="label"><span class="number">②</span> 授信资料清单</span>
                <creditInfoList
                  v-if="isShow"
                  ref="creditInfoList"
                  :page-mode="pageMode"
                  :product-id="productId"
                  :finace-checkbox="finaceNeedCheckbox"
                  :finace-need-header="finaceNeedHeader"
                  :credit-create-field-common="creditCreateFieldCommon"
                  :credit-create-field-video="creditCreateFieldVideo"
                  @save="save"
                />
              </el-tab-pane>
              <el-tab-pane :disabled="true" :lazy="true" name="3">
                <span slot="label"><span class="number">③</span> 用款资料清单</span>
                <useCreditList
                  v-if="isShow"
                  ref="useCreditList"
                  :page-mode="pageMode"
                  :product-id="productId"
                  :check-list="checkboxList"
                  :checkbox-header="checkboxHeader"
                  :use-create-field-video="useCreateFieldVideo"
                  :use-create-field-common="useCreateFieldCommon"
                  @save="save"
                />
              </el-tab-pane>
              <el-tab-pane :disabled="true" :lazy="true" name="4">
                <span slot="label"><span class="number">④</span> 其他配置</span>
                <othersConfiguration
                  v-if="isShow"
                  ref="othersConfiguration"
                  :page-mode="pageMode"
                  :product-id="productId"
                  :other-need-header="otherNeedHeader"
                  :other-checkbox="otherNeedCheckbox"
                  :create-product-data="createProductData"
                  @save="save"
                  @submit="submit('pass')"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="productRight">
            <div class="btnTop">
              <el-button class="btnStyle" plain @click="cancelSubmit('cancel')">取消</el-button>
              <template v-if="Number(activeName) > 1">
                <el-button class="btnStyle" @click="lastStep(activeName)">上一步</el-button>
              </template>
              <template v-if="Number(activeName) <=3">
                <el-button class="btnStyle" type="primary" @click="nextStep">下一步</el-button>
              </template>
              <template v-if="Number(activeName)=== 4">
                <el-button class="btnStyle" @click="nextStep">保存</el-button>
                <el-button class="btnStyle" @click="productPreview">预览</el-button>
                <el-button class="btnStyle" type="primary" @click="submit('valid')">提交</el-button>
              </template>
            </div>
            <div class="buttonSolid" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  saveProdInfo,
  saveProds,
  getProductDetail } from '@/api/finance'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: {
    // 产品信息
    productDetail: resolve => require(['./components/productDetail'], resolve),
    // 授信资料清单
    creditInfoList: resolve => require(['./components/creditInfoList'], resolve),
    // 用信资料清单
    useCreditList: resolve => require(['./components/useCreditList'], resolve),
    // 其他配置
    othersConfiguration: resolve => require(['./components/othersConfiguration'], resolve),
    // 预览
    productDetailPreview: resolve => require(['./components/productDetailPreview'], resolve)
  },
  data() {
    return {
      createProductData: {
        attractQrPath: '', //	引流系统二维码
        attractSystemUrl: '', //	引流系统链接
        attractType: 0, //	引流模式，0非引流模式 1授权引流模式 2用款引流模式
        fundId: '', //	资金方ID
        fundName: '', //	资金方名称
        isAssign: '', //	是否配置，0否1是
        isEntrustPay: 0, //	是否受托支付，0否1是
        isGroupCompApprove: 0, //	是否需要核心企业授信审批，
        isLoopLoan: 0, //	是否循环额度，0否1是
        isOneceAccount: 0, //	是否一企业一账号，0否1
        isProdCompAppvove: 0, //	是否需要产业公司授信审
        isPushBill: 0, //	是否推送账单数据，0否1
        isPushOrder: 0, //	是否推送订单数据，0否1
        isSingleTrust: 0, //	是否单笔授信，0否1是
        isTempSave: 1, //	是否暂存，0否1是 默认是1
        isFixOrder: 0, // 是否允许修改订单 0 否1是
        coreCustId: '', // 核心企业
        creditSign: 0, //	是授信签约
        productType: '', //	产品类型 1经营贷、2订单贷
        id: '',
        loanPurpose: '', //	贷款用途
        maxLoanLimit: '', //	最大贷款额度
        maxLoanRate: '', //	最大贷款利率
        maxLoanTime: '', //	最大贷款时间
        maxValidLimit: '', //	最大有效期
        minLoanLimit: '', //	最小贷款额度
        minLoanRate: '', //	最小贷款利率
        minLoanTime: '', // 最小贷款时间
        minValidLimit: '', //	最小有效期
        productDesc: '', //	产品简介
        productName: '', //	产品名称
        isPlatformMaintainAccount: 0, //	"是否平台维护账号 0否1是
        creditApplyAccountCanNull: 0, //	"授信申请账号不为空 0否1是
        productStatus: 1, //	产品状态，0失效，1生效
        repaymentMethod: '', //	还款方式
        repaymentSource: '', //	还款来源
        productSaveMaterialAddParamList: [],
        productSaveMaterialParamList: []
      },
      validateTabs: {
        '1': 'productDetail',
        '2': 'creditInfoList',
        '3': 'useCreditList',
        '4': 'othersConfiguration'
      },
      isPreview: false, // 是否预览
      isRefresh: false, // 更新数据
      currtOperation: '', // 当前操作
      finaceNeedCheckbox: [], // 授信资料清单选中字段
      checkboxList: [], // 用信资料清单选中字段
      otherNeedCheckbox: [], // 其他配置选中字段
      finaceNeedHeader: '', // 授信资料清单表头字段
      checkboxHeader: '', // 用信资料清单表头字段
      otherNeedHeader: '', // 其他配置表头字段
      creditCreateFieldVideo: [], // 授信客户新增文件夹
      creditCreateFieldCommon: [], // 授信客户新增字段
      useCreateFieldVideo: [], // 用信客户新增文件夹
      useCreateFieldCommon: [], // 用信客户新增字段
      activeName: '1', // 当前tab， 默认展示第一个tab
      pageMode: this.$route.query.mode || '', // 新增-add 编辑-edit 查看-preview
      pageFrom: this.$route.query.from || '', // 跳转此页的路由来源
      productId: null, // 产品id
      isShow: false
    }
  },
  computed: {
    ...mapGetters(['addProductParams'])
  },
  watch: {
    activeName: {
      handler: function(tab) {
        if (tab === '2') {
          this.$nextTick(() => {
            // 动态更新获取模板字段
            this.$refs[this.validateTabs[tab]].getNeedEditTempCloum()
          })
        }
      }
    }

  },
  created() {
    this.productId = Number(this.$route.query.productId) || null
    // 编辑、查看页获取数据
    if (this.pageMode === 'edit' || this.pageMode === 'preview') {
      this.getProductDetail()
    } else {
      this.isShow = true
    }
  },
  methods: {
    // 编辑页获取数据
    async getProductDetail(mode) {
      const params = {
        productId: this.productId
      }
      await getProductDetail(params).then((res) => {
        if (res.code === '0') {
          this.isShow = true
          this.createProductData = res.data.productInfo || {}
          // 选中项所有数据、新增字段
          const addProductParams = {
            productSaveMaterialParamList: [],
            productSaveMaterialAddParamList: []
          }
          // 清除数据
          this.finaceNeedCheckbox = []
          this.checkboxList = []
          this.otherNeedCheckbox = []
          this.creditCreateFieldVideo = []
          this.creditCreateFieldCommon = []
          this.useCreateFieldVideo = []
          this.useCreateFieldCommon = []
          // 保存选中的模板字段
          res.data.productMaterialList && res.data.productMaterialList.forEach(item => {
            if (item.parentMaterialType === 1) {
              this.finaceNeedCheckbox.push(item.materialTemplateId)
              this.finaceNeedHeader = item.materialTypeName
            } else if (item.parentMaterialType === 2) {
              this.checkboxList.push(item.materialTemplateId)
              this.checkboxHeader = item.materialTypeName
            } else if (item.parentMaterialType === 3) {
              this.otherNeedCheckbox.push(item.materialTemplateId)
              this.otherNeedHeader = item.materialTypeName
            }
            // 新增影像文件名称
            addProductParams.productSaveMaterialParamList.push(item)
          })
          // 保存新增的模板字段
          res.data.productMaterialAddList && res.data.productMaterialAddList.forEach(item => {
            if (item.productAddCloumType === 2 && item.materialType === 1) {
              // 影像文件夹名称-授信
              this.creditCreateFieldVideo.push(item)
            } else if (item.productAddCloumType === 1 && item.materialType === 1) {
              // 补充字段-授信
              this.creditCreateFieldCommon.push(item)
            } else if (item.productAddCloumType === 2 && item.materialType === 2) {
              // 影像文件夹名称-用信
              this.useCreateFieldVideo.push(item)
            } else if (item.productAddCloumType === 1 && item.materialType === 2) {
              // 补充字段-用信
              this.useCreateFieldCommon.push(item)
            }
          })
          // 新增字段
          addProductParams.productSaveMaterialAddParamList.push(
            ...this.creditCreateFieldVideo, ...this.creditCreateFieldCommon,
            ...this.useCreateFieldVideo, ...this.useCreateFieldCommon
          )
          //  暂存最新数据
          if (mode !== 'preview') this.$store.dispatch('productMaintain/set_addproductparams', addProductParams)
          this.isPreview = mode === 'preview' || this.pageMode === 'preview'
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 切换tabs
    beforeLeave(newTabs, oldTabs) {
      // newTabs > oldTabs 当前操作为"下一步"
      Number(newTabs) > Number(oldTabs) ? this.isRefresh = true : this.isRefresh = false
      // 动态刷新获取模板字段的接口
      return true
    },
    // 暂存
    save(type) {
      const addProductParams = this.addProductParams
      // 第一次点击完之后所有的暂存都需要添加productId
      this.productId ? addProductParams.id = this.productId : ''
      // if (type === 'productDetail' || type === 'otherConfig') {
      // 产品信息、其他配置
      saveProdInfo(addProductParams).then((res) => {
        if (res.code === '0') {
          this.productId = res.data.id
          if (this.activeName !== '4') {
            this.activeName = Number(this.activeName) + 1 + ''
          } else if (this.activeName === '4') {
            this.currtOperation === 'preview' ? this.getProductDetail('preview') : this.$message.success('保存成功')
          }
        } else {
          this.$message.error(res.msg)
        }
      })
      /*  } else {
        // 授信、用款资料清单
        saveProdMaterial(addProductParams).then((res) => {
          if (res.code === '0') {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      } */
    },
    // 上一步
    lastStep(currtActiveTab) {
      this.activeName = Number(currtActiveTab) - 1 + ''
    },
    // 下一步
    nextStep() {
      // 清空存储的数据
      // this.$store.dispatch('productMaintain/set_addproductparams', 'clear')
      // 暂存
      this.$refs[this.validateTabs[this.activeName]].addSaveFinace('save')
    },
    // 提交产品信息
    submit(mode) {
      const addProductParams = this.addProductParams
      addProductParams.isTempSave = 0
      this.productId ? addProductParams.id = this.productId : ''
      if (mode === 'valid') {
        // 保存其他配置tabs的数据 并校验表单
        this.$refs[this.validateTabs[this.activeName]].addSaveFinace('submit')
      } else if (mode === 'pass') {
        // 校验通过提交数据
        saveProds(addProductParams).then((res) => {
          if (res.code === '0') {
            this.$message.success(res.msg)
            this.$store.dispatch('tagsView/delVisitedView', this.$route)
            // 此处必须使用name/params方式跳转路由，否则回到指定路由界面菜单栏会消失
            this.$router.push({
              name: 'ProductMaintain',
              params: {
                isRefresh: true
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 预览
    productPreview() {
      // 点预览默认暂存
      this.$refs[this.validateTabs[this.activeName]].addSaveFinace('save')
      this.currtOperation = 'preview'
      /*
      // （关闭重新打开）销毁元素后不能获取到addSaveFinace
       */
      // 重新获取数据
      // Promise.all([this.getProductDetail()]).then(() => { this.isPreview = true })
    },
    //  关闭
    cancelSubmit(mode) {
      if (this.isPreview && this.pageMode !== 'preview') {
        // 点预览按钮
        this.isPreview = false
        this.currtOperation = ''
        return
      } else if (mode === 'cancel' || this.pageFrom === 'productMaintain') {
        // 产品维护页-取消、查看进入-关闭
        this.$store.dispatch('tagsView/delVisitedView', this.$route)
        // 此处必须使用name/params方式跳转路由，否则回到指定路由界面菜单栏会消失
        this.$router.push({
          name: 'ProductMaintain',
          params: {
            isRefresh: true
          }
        })
      } else if (this.pageFrom === 'productList') {
        // 产品列表页
        this.$store.dispatch('tagsView/delVisitedView', this.$route)
        this.$router.push('/FinanceManagement/productList')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.containerBox {
  overflow-x: auto;
  min-height: 900px;
}
::v-deep{
  .el-tabs__header,
  .el-tabs__nav-wrap,
  .el-tabs__item {
    height:50px
  }
  .el-tabs__nav {
    display: flex;
    align-items:center
  }
  .el-tabs__item.is-disabled {
      color: #3E495B;
      font-weight: bold;
    }
   .el-tabs__item.is-active {
      color: var(--theme);
      font-weight: bold;
    }
}
.title {
  font-size: 14px;
  color: #424D5E
}
.number {
  font-size: 16px;
}
.pro-container {
  padding-left: 20px;
}
.createProduct {
  display: flex;
  .productLeft {
    width: 60%;
    min-width: 750px;
  }
  .productRight {
    width: 40%;
    min-width: 500px;
    text-align: right;
    .btnTop {
      height:48px;
    }
    .buttonSolid {
      height: 2px;
      background-color: #dfe4ed;
    }
  }
}
.btnStyle {
   width: 80px;
   height: 36px;
   margin: 0 10px 0 0;
 }

 // 页面滚动条样式
::v-deep .containerBox::-webkit-scrollbar {
  width: 7px;
  height: 10px;
}
::v-deep .containerBox::-webkit-scrollbar-thumb:hover {
  background-color: #b3bccb;
}

::v-deep .containerBox::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #dee0e8;
}

::v-deep .containerBox::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 5px;
}
</style>
