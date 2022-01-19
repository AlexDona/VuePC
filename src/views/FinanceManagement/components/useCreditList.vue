
<template>
  <!-- 用信资料清单 -->
  <div class="container">
    <div class="finace">
      <!-- 自动推送的字段 -->
      <p class="p-style">
        <span class="vertical" />
        <span>自动推送的字段</span>
      </p>
      <div class="checkedFields">
        <el-form>
          <el-row>
            <div v-for="(item,index) in autoPushList" :key="index" style="padding-top: 10px">
              <!-- v-model绑定当前表字段 { "客户表": true/false } 全选-->
              <el-checkbox
                v-model="isAllCheckboxList[item[0].materialTypeName]"
                :indeterminate="isIndeterminate[item[0].materialTypeName]"
                :label="item[0].materialTypeName"
                :disabled="pageMode === 'preview'"
                @change="changeCheckbox(item[0].materialTypeName)"
              />
              <div class="finaceChecked">
                <el-checkbox-group v-model="checkboxList">
                  <!-- 后端需要所有字段 -->
                  <el-checkbox
                    v-for="itemObj in item"
                    :key="itemObj.id"
                    disabled
                    :label="itemObj.materialTemplateId"
                    class="checkboxStyle"
                    @change="changeCheck(itemObj)"
                  >{{ itemObj.cloumDesc }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-row>
          <!-- <el-row v-else>
            <el-col>
              <el-form-item label="已选中的字段">
                <el-tag v-for="tag in tagsList" :key="tag.name" style="margin-right: 16px; color: #3357CC" :type="tag.type">{{ tag.name }}</el-tag>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
      </div>

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
            <el-col v-if="pageMode !== 'preview'" class="col-Style" :span="22">
              <el-form-item>
                <el-button class="btnStyle" type="primary" @click="createCustomer('common')">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in createFieldCommon" :key="index">
            <el-col class="col-Style" :span="22">
              <el-form-item :label="'字段名称'+(index+1)" label-width="76px">
                <el-input v-model="createFieldCommon[index].productAddCloumDesc" maxlength="10" :disabled="pageMode === 'preview'" placeholder="录入" />
              </el-form-item>
            </el-col>
            <el-col v-if="pageMode !== 'preview'" :span="2">
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
    <!--   <div class="btn">
        <el-button v-if="pageMode !== 'preview'" class="btnStyle" type="primary" @click="addSaveFinace('save')">暂存</el-button>
        <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getProductMaterial, getFileFolderTemplate } from '@/api/finance'
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
    useCreateFieldVideo: {
      // 授信客户新增文件夹
      type: Array,
      default: () => []
    },
    useCreateFieldCommon: {
      // 授信客户新增字段
      type: Array,
      default: () => []
    },
    checkList: {
      // 对应选版本多选项
      type: Array,
      default: () => []
    },
    // 产品id
    productId: {
      type: Number,
      default: null
    },
    // 选中的表头
    checkboxHeader: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listQuery: {
        productSaveMaterialParamList: [], // 系统模板字段
        productSaveMaterialAddParamList: [] // 客户补充字段
      },
      createFieldCommon: [], // 创建普通字段
      isIndeterminate: {}, // 全选
      autoPushList: {}, // 自动推送送字段
      checkboxList: [], // 选中数据
      isAllCheckboxList: {}, // 是否全选某张表数据
      allCheckboxList: [], // 全选数据
      createFieldVideo: [], // 创建影像文件夹字段
      createSelectList: [], // 客户需求补充影像件下拉框数据
      copyCheckboxList: {} // 备份选中数据
      // tagsList: [], // 已选中的字段
    }
  },
  watch: {
    isAllCheckboxList: function() {

    },
    deep: true
  },
  created() {
    this.createFieldCommon = this.useCreateFieldCommon
    this.checkboxList = this.checkList
    this.createFieldVideo = this.useCreateFieldVideo
    // 获取影像文件
    this.getFileFolderTemplate()
    // 获取字段
    this.getProductMaterial()
    // 反显选中的表头
    if (this.pageMode !== 'add') this.isAllCheckboxList[this.checkboxHeader] = true
  },
  methods: {
    // 新增客户需求补充字段
    createCustomer(mode) {
      if (!this.productId) return this.$message.warning('请先完善产品信息页数据')
      const cloumNameCommon = 'cloumn_' + (this.createFieldCommon.length + 1)
      // const cloumNameVideo = 'cloumn_' + (this.createFieldVideo.length + 1)
      const addFieldsObj = {
        canDelete: 1, // 可以操作删除
        materialType: 2, // 资料清单类型，1授信资料清单，2用款资料清单，3其他
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
    // 获取字段
    getProductMaterial() {
      const params = {
        parentMaterialType: 2,
        productId: this.productId
      }
      getProductMaterial(params).then((res) => {
        if (res.code === '0') {
          // 模板字段
          this.autoPushList = res.data.templateMaterialMap || []
          for (const key in this.autoPushList) {
            this.isAllCheckboxList[key] = true
            this.changeCheckbox(this.autoPushList[key][0].materialTypeName)
            return
          }
          // 备份数据
          // this.copyCheckboxList = this.autoPushList
          /*  // 保存选中的模板字段
          res.data.productMaterialList && res.data.productMaterialList.forEach(item => {
            this.checkboxList.push(item.materialTemplateId)
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
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 更新数据
    updateFeilds(data) {
      this.createFieldVideo = data
    },
    changeCheckbox(key) {
      this.isIndeterminate[key] = false
      // this.checkboxList.push(...this.autoPushList[val])
      // 先清除数据重新根据选中的数据赋值
      this.checkboxList = []
      // 修改其他选中状态为false
      for (const keys in this.isAllCheckboxList) {
        if (key !== keys) {
          this.isAllCheckboxList[keys] = false
        }
      }
      // 全选数据
      this.autoPushList[key].forEach((items, idnex) => {
        this.isAllCheckboxList[key] ? this.checkboxList.push(items.materialTemplateId) : ''
      })
      /*  for (const key in this.isAllCheckboxList) {
        if (this.isAllCheckboxList[key]) {
          // 根据对应的表全选表数据
          this.autoPushList[key].forEach((items, idnex) => {
            this.checkboxList.push(items.materialTemplateId)
          })
        }
      } */
    },
    // 选中项
    changeCheck(item) {
      // 保存对应表选中的数量
      this.copyCheckboxList[item.materialTypeName] = null
      this.autoPushList[item.materialTypeName].forEach(items => {
        if (this.checkboxList.includes(items.materialTemplateId)) {
          this.copyCheckboxList[item.materialTypeName] = (this.copyCheckboxList[item.materialTypeName] + 1) || 1
          return
        }
      })
      // 对比总数数据量--非全选状态
      this.isIndeterminate[item.materialTypeName] = this.copyCheckboxList[item.materialTypeName] > 0 && this.copyCheckboxList[item.materialTypeName] < this.autoPushList[item.materialTypeName].length
      if (this.copyCheckboxList[item.materialTypeName] === this.autoPushList[item.materialTypeName].length) {
        // 全选状态
        this.isAllCheckboxList[item.materialTypeName] = true
      } else if (!this.copyCheckboxList[item.materialTypeName]) {
        // 全不选状态
        this.isAllCheckboxList[item.materialTypeName] = false
        this.isIndeterminate[item.materialTypeName] = false
      }
      /* const obj = {}
      // 保存选中的数据
      this.autoPushList[item.materialTypeName].forEach(items => {

      })
      console.log(obj) */
    },
    // 提交
    addSaveFinace(mode) {
      // 请先完善产品信息页数据
      if (mode === 'save' && !this.productId) return this.$message.warning('请先完善产品信息页数据')
      // 重构数据结构
      const productSaveMaterialParamList = []
      this.checkboxList.forEach(item => {
        productSaveMaterialParamList.push({
          productId: this.productId,
          parentMaterialType: 2,
          materialTemplateId: item

        })
      })
      // 模板字段
      // this.listQuery.productSaveMaterialParamList = productSaveMaterialParamList
      // 客户新增字段
      // this.listQuery.productSaveMaterialAddParamList.push(...this.updateFeildsArr, ...this.createFieldCommon)
      // 去除空数据
      this.createFieldVideo = this.createFieldVideo.filter(item => item.productAddCloumDesc)
      this.createFieldCommon = this.createFieldCommon.filter(item => item.productAddCloumDesc)
      // 防止新增的数据重复
      this.createFieldCommon = this.lib.arrayUnique(this.createFieldCommon, 'productAddCloumDesc')
      this.createFieldVideo = this.lib.arrayUnique(this.createFieldVideo, 'productAddCloumDesc')
      const productSaveMaterialAddParamList = []
      productSaveMaterialAddParamList.push(...this.createFieldVideo, ...this.createFieldCommon)
      const params = {
        productSaveMaterialParamList,
        productSaveMaterialAddParamList
      }
      this.$store.dispatch('productMaintain/set_addproductparams', params)
      if (mode !== 'submit') this.$emit('save', 'creditInfoList')
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
    color: #3e495b;
    font-size: 14px;
    line-height: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    .vertical {
      height: 13.33px;
      margin: -2px 6px 0 0;
      border: 1px solid var(--theme);
    }
  }
  .finaceRadio {
    ::v-deep .el-radio__label {
      color: #8796b0;
    }
  }
 ::v-deep.is-disabled {
    span.el-checkbox__label {
     color: #000 !important;
    }
  }
  .finaceChecked {
    padding: 16px;
    width: 740px;
    border-radius: 4px;
    margin-top: 10px;
    // color: #3E495B;
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
  .customerNeedVideoBox {
    margin-left: 36px;
  }
  .customerNeedField,
  .customerNeedVideo {
    padding-left: 64px;
  }
  .col-Style {
    width: 590px;
    ::v-deep .el-input__inner {
      width: 100%;
    }
  }
  .btn {
    margin-top: 20px;
  }
}
</style>

