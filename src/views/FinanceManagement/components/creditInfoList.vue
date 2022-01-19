
<template>
  <!-- 授信资料清单 -->
  <div class="container">
    <div class="finace">
      <!-- 资金方需要的字段 -->
      <p class="p-style">
        <span class="vertical" />
        <span>资金方需要的字段</span>
      </p>
      <el-row>
        <el-col
          v-for="key in finaceHeaderGroup"
          :key="key"
          :span="4"
        >
          <el-radio v-model="selectHeader" :disabled="pageMode === 'preview'" :label="key" @change="changeRadio(true)">{{ key }}</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <div class="finaceChecked">
          <el-checkbox-group v-model="finaceNeedCheckbox">
            <!-- 后端需要所有字段 -->
            <el-checkbox v-for="(item) in finaceNeedList[selectHeader]" :key="item.id" disabled :label="item.materialTemplateId" class="checkboxStyle">{{ item.cloumDesc }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-row>

      <!-- 客户需要补充的字段 -->
      <template v-if="createFieldCommon.length > 0 || pageMode !=='preview'">
        <p class="p-style">
          <span class="vertical" />
          <span>客户需要补充的字段</span>
        </p>
      </template>
      <div class="customerNeedField">
        <el-form :model="listQuery">
          <el-row>
            <el-col class="col-Style" :span="22">
              <el-form-item>
                <el-button v-if="pageMode !== 'preview'" class="btnStyle" type="primary" @click="createCustomer('common')">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in createFieldCommon" :key="index">
            <el-col class="col-Style" :span="22">
              <el-form-item :label="'字段名称'+(index+1)" label-width="100px">
                <el-input v-model="createFieldCommon[index].productAddCloumDesc" maxlength="10" :disabled="pageMode === 'preview' || item.canDelete=== 0 " placeholder="录入" />
              </el-form-item>
            </el-col>
            <el-col v-if="pageMode !== 'preview' && item.canDelete === 1" :span="2">
              <el-button type="text" style="color: #FF3232; padding-left: 8px" @click="createFieldCommon.splice(index,1)">删除</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 客户需求补充的影像 -->
      <template v-if="createFieldVideo.length > 0 || pageMode !=='preview'">
        <p class="p-style">
          <span class="vertical" />
          <span>客户需求补充的影像</span>
        </p>
      </template>
      <div class="customerNeedVideo">
        <el-button v-if="pageMode !== 'preview'" class="btnStyle" type="primary" @click="createCustomer('video')">新增</el-button>
        <template v-if="createFieldVideo.length > 0">
          <div class="customerNeedVideoBox">
            <addFieldsName :create-field-video="createFieldVideo" :create-select-list="createSelectList" :page-mode="pageMode" @updateFeilds="updateFeilds" />
          </div>
        </template>
      </div>
      <!--  <div class="btn">
        <el-button v-if="pageMode !== 'preview'" class="btnStyle" type="primary" @click="addSaveFinace('save')">暂存</el-button>
        <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
      </div> -->
    </div>

  </div>
</template>

<script>
import { getProductMaterial, getNeedEditTempCloum, getFileFolderTemplate } from '@/api/finance'
export default {
  name: '',
  components: {
    addFieldsName: resolve => require(['./add-fields-name'], resolve)
  },
  props: {
    // 当前页面状态--（add：新增 preview: 查看）
    pageMode: {
      type: String,
      default: ''
    },
    // 选中的表头
    finaceNeedHeader: {
      type: String,
      default: ''
    },
    creditCreateFieldVideo: {
      // 授信客户新增文件夹
      type: Array,
      default: () => []
    },
    creditCreateFieldCommon: {
      // 授信客户新增字段
      type: Array,
      default: () => []
    },
    finaceCheckbox: {
      // 对应选版本多选项
      type: Array,
      default: () => []
    },
    // 产品id
    productId: {
      type: Number,
      default: null
    },
    // 是否需要调获取字段
    needEditTempCloum: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      listQuery: {
        productSaveMaterialParamList: [], // 系统模板字段
        productSaveMaterialAddParamList: [] // 客户补充字段
      },
      selectHeader: '', // 当前选中的表头字段
      finaceNeedList: [], // 资金方需要的字段
      finaceNeedCheckbox: [], // 对应选版本多选项
      finaceHeaderGroup: [], // 资金方需要的字段表头
      createFieldCommon: [], // 创建普通字段
      createFieldVideo: [], // 创建影像文件夹字段
      contactImgs: [],
      createSelectList: [], // 客户需求补充影像件下拉框数据
      curtRadio: ''// 当前面选中版本
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.createFieldCommon = this.creditCreateFieldCommon
    this.createFieldVideo = this.creditCreateFieldVideo.length > 0 ? this.creditCreateFieldVideo : []
    this.finaceNeedCheckbox = this.finaceCheckbox
    // 获取影像文件
    this.getFileFolderTemplate()
    // 获取字段
    this.getProductMaterial()
    // 编辑反显数据
    /*  if (this.pageMode !== 'add') {
      this.selectHeader = this.finaceNeedHeader
    } */
  },
  methods: {
  // 新增客户需求补充字段
    createCustomer(mode) {
      if (!this.productId) return this.$message.warning('请先完善产品信息页数据')
      const cloumNameCommon = 'cloumn_' + (this.createFieldCommon.length + 1)
      // const cloumNameVideo = 'cloumn_' + (this.createFieldVideo.length + 1)
      const addFieldsObj = {
        canDelete: 1, // 可以操作删除
        materialType: 1, // 资料清单类型，1授信资料清单，2用款资料清单，3其他
        materialTypeSub: null, // 大类里面的小类，比如微众、华润等等
        productAddCloumDesc: '', // key
        productAddCloumName: '', // value
        productAddCloumType: '', // 1 普通字段、2 影像字段
        productId: this.productId
      }
      if (mode === 'common') {
        addFieldsObj.productAddCloumName = cloumNameCommon
        addFieldsObj.productAddCloumType = 1
        this.createFieldCommon.push(addFieldsObj)
      } else {
        // addFieldsObj.productAddCloumName = cloumNameVideo
        addFieldsObj.productAddCloumType = 2
        this.createFieldVideo.push(addFieldsObj)
      }
    },
    // 获取产品需要的模板字段
    getNeedEditTempCloum() {
      // 如果是新增默认获取第一个版对应的资金方需要的字段，否则就是动态获取资金方需要的字段
      if (this.finaceNeedList[this.selectHeader]) {
        const params = {
          /* 说明
              这里的materialType并不是和上面一样代表当前tabs(资料清单类型，1授信资料清单...)
              而是代表选中的是微众还是华润
          */
          materialType: this.finaceNeedList[this.selectHeader][0].materialType,
          parentMaterialType: 1,
          productId: this.productId
        }
        // 清除由接口返回的数据
        this.createFieldCommon = this.createFieldCommon.filter(item => !item.materialTypeSub)
        getNeedEditTempCloum(params).then((res) => {
          if (res.code === '0') {
            // 补充的模板字段
            this.createFieldCommon.unshift(...res.data)
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 获取模板字段
    getProductMaterial() {
      const params = {
        parentMaterialType: 1,
        productId: this.productId
      }
      getProductMaterial(params).then((res) => {
        if (res.code === '0') {
          // 模板字段
          this.finaceNeedList = res.data.templateMaterialMap || []
          /*  // 保存选中的模板字段
          res.data.productMaterialList && res.data.productMaterialList.forEach(item => {
            this.finaceNeedCheckbox.push(item.materialTemplateId)
          })
          // 保存新增的模板字段
          res.data.productMaterialAddList && res.data.productMaterialAddList.forEach(item => {
            if (item.productAddCloumType === 2) {
              // 影像文件夹名称
              this.createFieldVideo.push(item)
            } else if (item.productAddCloumType === 1) {
              // 补充字段
              this.createFieldCommon.push(item)
            }
          }) */
          for (const key in res.data.templateMaterialMap) {
            // 设置单选表头
            this.finaceHeaderGroup.push(key)
          }
          // 表头选中默认值
          this.selectHeader = this.finaceNeedHeader ? this.finaceNeedHeader : this.finaceHeaderGroup[0]
          this.changeRadio(true) // 默认选中
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取影像文件
    getFileFolderTemplate() {
      getFileFolderTemplate().then((res) => {
        if (res.code === '0') {
          this.createSelectList = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 更新数据
    updateFeilds(data) {
      this.createFieldVideo = data
    },
    // 选中表头字段
    changeRadio(mode) {
      // 获取产品需要的模板字段
      if (mode && this.needEditTempCloum) this.getNeedEditTempCloum()
      if (!this.selectHeader) return
      this.finaceNeedCheckbox = this.finaceNeedList[this.selectHeader].map(item => item.materialTemplateId)
    },
    // 提交
    addSaveFinace(mode) {
      // 请先完善产品信息页数据
      if (mode === 'save' && !this.productId) return this.$message.warning('请先完善产品信息页数据')
      // 重构数据结构
      const productSaveMaterialParamList = []
      this.finaceNeedCheckbox.forEach(item => {
        productSaveMaterialParamList.push({
          productId: this.productId,
          parentMaterialType: 1,
          materialTemplateId: item
        })
      })
      // 模板字段
      // this.listQuery.productSaveMaterialParamList = productSaveMaterialParamList
      // 客户新增字段
      const productSaveMaterialAddParamList = []
      // 去除空数据
      this.createFieldVideo = this.createFieldVideo.filter(item => item.productAddCloumDesc)
      this.createFieldCommon = this.createFieldCommon.filter(item => item.productAddCloumDesc)
      // 防止新增的数据重复
      this.createFieldCommon = this.lib.arrayUnique(this.createFieldCommon, 'productAddCloumDesc')
      this.createFieldVideo = this.lib.arrayUnique(this.createFieldVideo, 'productAddCloumDesc')
      productSaveMaterialAddParamList.push(...this.createFieldVideo, ...this.createFieldCommon)
      const params = {
        productSaveMaterialParamList,
        productSaveMaterialAddParamList
      }
      this.$store.dispatch('productMaintain/set_addproductparams', params)
      if (mode !== 'submit') this.$emit('save')
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
  ::v-deep.is-disabled {
    span.el-radio__label {
     color: #000 !important;
    }
  }
  .finaceChecked {
    padding: 16px;
    width: 650px;
    border-radius: 4px;
    margin-top: 10px;
    border: 1px solid #979797;
    ::v-deep .el-checkbox__label {
      font-size: 15px;
      font-weight: 500;
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
  .customerNeedVideoBox {
    margin-left: 55px;
  }
  .col-Style {
    width: 590px;
    ::v-deep .el-input__inner {
      width: 490px;
    }
  }
}
</style>
