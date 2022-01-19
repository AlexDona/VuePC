<template>
  <!-- 客户建档维护、新增 -->
  <el-form
    ref="resetForm"
    class="resetForm"
    :model="dialogData"
    label-position="left"
    label-width="150px"
    :rules="rules"
  >
    <el-row :gutter="1">
      <el-col>
        <el-form-item
          label="客户编号"
        >
          <el-input
            v-model="dialogData.custNo"
            disabled
            placeholder="客户编号"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="dialogData.custType === 2" :gutter="1">
      <el-col>
        <el-form-item label="所属公司" prop="personalCustName">
          <el-input
            v-model.trim="dialogData.personalCustName"
            maxlength="20"
            placeholder="请输入所属公司"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="1">
      <el-col>
        <el-form-item
          label="客户名称"
          prop="custName"
        >
          <el-input
            v-model="dialogData.custName"
            disabled
            placeholder="客户名称"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="1">
      <el-form-item label="经办人姓名" prop="contactsPersonName">
        <el-input v-model.trim="dialogData.contactsPersonName" maxlength="16" placeholder="请输入经办人姓名" />
      </el-form-item>
    </el-row>
    <el-row :gutter="1">
      <el-form-item label="经办人身份证号码" prop="contactsPersonIdtNo">
        <el-input v-model.trim="dialogData.contactsPersonIdtNo" maxlength="18" placeholder="请输入经办人身份证号码" />
      </el-form-item>
    </el-row>
    <el-row :gutter="1">
      <el-form-item label="经办人手机号码" prop="contactsPersonMobile">
        <el-input v-model.trim="dialogData.contactsPersonMobile" maxlength="11" placeholder="请输入经办人手机号码" />
      </el-form-item>
    </el-row>
    <el-row :gutter="1">
      <el-form-item label="经办人邮箱" prop="contactsPersonEmail">
        <el-input v-model.trim="dialogData.contactsPersonEmail" maxlength="50" placeholder="请输入经办人邮箱" />
      </el-form-item>
    </el-row>
    <template v-if="dialogData.parentCusts && dialogData.parentCusts.length">
      <el-row v-for="(item, index) in dialogData.parentCusts" :key="index + 'customerItemDTO'">
        <el-row :gutter="1">
          <el-col>
            <el-form-item label="一级产业公司" prop="parentCustName">
              <el-input v-model="item.parentCustName" disabled maxlength="18" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="1">
          <el-form-item label="起始合作时间">
            <el-date-picker
              v-model="item.cooperationTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-row>
      </el-row>
    </template>
    <el-row>
      <el-col>
        <el-form-item>
          <el-button plain @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

import { businessCode, tellPhone, validIdcard, validEmailNew } from '@/utils/validate'
import { updateMaintenance } from '@/api/customer'
export default {
  name: 'MaintenaceDialog',
  props: {
    // 表单数据
    formData: {
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
      dialogData: Object.assign({}, this.formData),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      projectNameList: [],
      rules: {
        businessCode: [
          { required: true, message: '请填写统一社会信用代码', trigger: 'change' },
          { validator: businessCode, trigger: 'change' }
        ],
        personalCustName: [
          { required: false, message: '请填写所属公司', trigger: 'change' }
        ],
        custName: [
          { required: true, message: '请填写客户名称', trigger: 'change' }
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
      },
      cooperationTime: this.formData.cooperationTime
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
          // console.log(this.cooperationTime, 'tttt')
          const { personalCustName, contactsPersonName, contactsPersonMobile, contactsPersonIdtNo, contactsPersonEmail, id } = this.dialogData
          // const data = { businessCode, custTypeId, custName, contactsPersonName, contactsPersonMobile, contactsPersonIdtNo, contactsPersonEmail, id, cooperationTime, ownCompany }
          const parentCustParams = this.dialogData.parentCusts.map(item => {
            return {
              cooperationTime: item.cooperationTime,
              parentCustId: item.parentCustId
            }
          })
          const data = {
            contactsPersonEmail: contactsPersonEmail,
            contactsPersonIdtNo: contactsPersonIdtNo,
            contactsPersonName: contactsPersonName,
            contactsPersonMobile: contactsPersonMobile,
            parentCustParams: parentCustParams,
            cooperationTime: this.cooperationTime,
            customerId: id,
            personalCustName: personalCustName
          }
          updateMaintenance(data).then(res => {
            if (res.code === '0') {
              // console.log('res', res)
              this.$message.success('操作成功')
              console.log(this, 'parent')
              this.$emit('handleSubmit', true)
              this.$emit('handleTalbeData')
              // this.$emit('submit', true)
            } else {
              this.$message.error(res.msg)
            }
          })
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

<style lang="scss" scoped>
.resetForm {
  padding: 20px;
  ::v-deep .el-date-editor.el-input,.el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
