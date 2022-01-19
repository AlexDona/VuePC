<template>
  <!-- 客户建档维护、新增 -->
  <div class="container">
    <el-form
      ref="resetForm"
      class="resetForm"
      :model="customerForm"
      label-position="left"
      label-width="150px"
      :rules="rules"
    >
      <template v-if="dialogMode === 'maintain' || dialogMode === 'preview'">
        <el-row :gutter="1">
          <el-col>
            <el-form-item
              label="企业编号"
              prop="custNo"
            >
              <el-input
                v-model="customerForm.custNo"
                disabled
                placeholder="企业编号"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="1">
        <el-col>
          <el-form-item label="企业类型" prop="custTypeId">
            <el-select
              v-model="customerForm.custTypeId"
              class="filter-item"
              disabled
              placeholder="请选择企业类型"
              style="width:100%"
            >
              <el-option
                v-for="item in custTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-col>
          <el-form-item
            label="企业名称"
            prop="custName"
          >
            <el-input
              v-model.trim="customerForm.custName"
              maxlength="16"
              :disabled="dialogMode ==='preview' || customerForm.custTypeId !== 4"
              :placeholder=" dialogMode !== 'preview'? '企业名称' : ''"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-col>
          <el-form-item label="统一社会信用代码" prop="businessCode">
            <el-input v-model.trim="customerForm.businessCode" :disabled="dialogMode === 'preview'" maxlength="18" :placeholder="dialogMode !== 'preview' ? '请输入统一社会信用代码': ''" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="1">
        <el-form-item label="经办人姓名" prop="contactsPersonName">
          <el-input v-model.trim="customerForm.contactsPersonName" maxlength="16" :disabled="dialogMode === 'preview'" :placeholder=" dialogMode !== 'preview'? '请输入经办人姓名': ''" />
        </el-form-item>
      </el-row>
      <el-row :gutter="1">
        <el-form-item label="经办人身份证号码" prop="contactsPersonIdtNo">
          <el-input v-model.trim="customerForm.contactsPersonIdtNo" maxlength="18" :disabled="dialogMode === 'preview'" :placeholder=" dialogMode !== 'preview' ? '请输入经办人身份证号码': ''" />
        </el-form-item>
      </el-row>
      <el-row :gutter="1">
        <el-form-item label="经办人手机号" prop="contactsPersonMobile">
          <el-input v-model.trim="customerForm.contactsPersonMobile" maxlength="11" :disabled="dialogMode === 'preview'" :placeholder=" dialogMode !== 'preview' ? '请输入经办人手机号': ''" />
        </el-form-item>
      </el-row>
      <el-row :gutter="1">
        <el-form-item label="经办人邮箱" prop="contactsPersonEmail">
          <el-input v-model.trim="customerForm.contactsPersonEmail" maxlength="50" :disabled="dialogMode === 'preview'" :placeholder=" dialogMode !== 'preview'? '请输入经办人邮箱': ''" />
        </el-form-item>
      </el-row>
      <el-row v-if="dialogMode !== 'preview'">
        <el-col>
          <el-form-item>
            <el-button plain @click="cancel">取消</el-button>
            <el-button type="primary" @click="submit()">确定</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import { businessCode, tellPhone, validIdcard, validEmailNew } from '@/utils/validate'
export default {

  props: {
    // 表单数据
    customerForm: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 当前操作状态--新增、维护
    dialogMode: {
      type: String,
      default: ''
    },
    // 客户类型
    custTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      projectNameList: [],
      rules: {
        businessCode: [
          { required: false, message: '请填写统一社会信用代码', trigger: 'change' },
          { validator: businessCode, trigger: 'change' }
        ],
        custTypeId: [
          { required: true, message: '请填写企业类型', trigger: 'change' }
        ],
        custName: [
          { required: true, message: '请填写企业名称', trigger: 'change' }
        ],
        contactsPersonName: [
          { required: true, message: '请填写经办人姓名', trigger: 'change' }
        ],
        contactsPersonMobile: [
          { required: true, message: '请填写经办人手机号', trigger: 'change' },
          { validator: tellPhone, trigger: 'change' }
        ],
        contactsPersonIdtNo: [
          { required: false, message: '请填写经办人身份证号', trigger: 'change' },
          { validator: validIdcard, trigger: 'change' }
        ],
        contactsPersonEmail: [
          { required: false, message: '请填写邮箱号', trigger: 'change' },
          { validator: validEmailNew, trigger: 'change' }
        ]
      }
    }
  },
  watch: {

  },
  created() {
  },
  methods: {
    submit() {
      this.$refs['resetForm'].validate(valid => {
        if (valid) {
          const { businessCode, custTypeId, custName, contactsPersonName, contactsPersonMobile, contactsPersonIdtNo, contactsPersonEmail, id } = this.customerForm
          const data = { businessCode, custTypeId, custName, contactsPersonName, contactsPersonMobile, contactsPersonIdtNo, contactsPersonEmail, id }
          this.$emit('submit', data)
        }
      })
    },
    cancel() {
      this.$refs['resetForm'].resetFields()
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.resetForm {
  padding: 20px;
}
</style>
