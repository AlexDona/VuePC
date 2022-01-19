<template>
  <div class="addOperation">
    <el-form
      ref="userOperationForm"
      :model="userOperationList"
      label-position="right"
      :rules="formRules"
      label-width="120px"
      style="margin-left:50px;margin-right:50px;"
    >
      <template v-if="preMode === 'preview' || preMode === 'update'">
        <el-form-item label="操作人编号" prop="userNo">
          <el-input v-model="userOperationList.userNo" :disabled="preMode === 'preview' || preMode === 'update'" />
        </el-form-item>
      </template>
      <template v-if="preMode === 'preview'">
        <el-form-item label="登录账号" prop="loginName">
          <el-input v-model="userOperationList.loginName" :disabled="preMode === 'preview'" />
        </el-form-item>
      </template>
      <el-form-item label="姓名" prop="idtName">
        <el-input v-model="userOperationList.idtName" maxlength="32" :disabled="preMode === 'preview'" />
      </el-form-item>
      <el-form-item label="身份证号码" prop="idtNo">
        <el-input v-model="userOperationList.idtNo" maxlength="18" :disabled="preMode === 'preview'" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="userOperationList.mobile" maxlength="11" :disabled="preMode === 'preview'" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userOperationList.email" :disabled="preMode === 'preview'" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="userOperationList.status"
          class="selectWidth"
          :disabled="preMode === 'preview'"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="(item, index) in statusOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <template v-if="preMode === 'preview'">
        <el-form-item label="权限" prop="email">
          <el-input v-model="userOperationList.authorityCollection" :rows="5" disabled type="textarea" />
        </el-form-item>
      </template>
    </el-form>
    <div class="btnSubmit">
      <template v-if="preMode !== 'preview'">
        <el-button plain @click="cancelSubmit">取消</el-button>
        <el-button v-preventReClick type="primary" @click="addOperation">确定</el-button>
      </template>
      <template v-else>
        <el-button plain @click="cancelSubmit">关闭</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddOperation',
  props: {
    userOperationList: {
      type: Object,
      default: () => {}
    },
    preMode: {
      type: String,
      default: ''
    },
    cancel: {
      type: Function,
      default: null
    }
  },
  data() {
    //  身份证校验
    var legalCredentialNumber = (rule, value, callback) => {
      var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      if (value.length === 0) {
        return callback()
      } else if (regIdCard.test(value)) {
        return callback()
      } else if (value && value.length > 18) {
        return callback(new Error('字符长度超限'))
      } else {
        return callback(new Error('请输入正确的证件号码'))
      }
    }
    //  手机号校验
    var validateTel = (rule, value, callback) => {
      var phone = value.replace(/\s/g, '') // 去除空格
      // 校验手机号
      const regs = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (value.length === 0) {
        callback()
      } else {
        if (!regs.test(phone)) {
          callback([new Error('手机号输入不合法')])
        } else {
          callback()
        }
      }
    }
    // 邮箱校验
    var validateEmail = (rule, value, callback) => {
      var email = value && value.replace(/\s/g, '') // 去除空格
      const regs = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (value.length === 0) {
        callback()
      } else {
        if (!regs.test(email)) {
          callback([new Error('邮箱号输入不合法')])
        } else {
          callback()
        }
      }
    }

    return {
      // userOperationList: {
      //   // nickName: "",
      //   // idCard: "",
      //   // mobile: "",
      //   // email: "",
      //   // status: ""
      // },
      // isRefreshPage: false, // 是否重置数据
      statusOptions: [
        { label: '生效', value: '0' },
        { label: '冻结', value: '1' }
      ],
      formRules: {
        userNo: [{ required: true, message: '请填写操作人编号', trigger: 'change' }],
        idtName: [{ required: true, message: '请填写姓名', trigger: 'change' }],
        email: [
          // { required: false, message: '请填写邮箱', trigger: 'change' },
          { required: false, validator: validateEmail, trigger: 'change' }
        ],
        status: [
          { required: true, message: '请填写状态', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'change' },
          { validator: validateTel, trigger: 'change' }
        ],
        idtNo: [
          // { required: false, message: '请填写身份证号码', trigger: 'change' },
          { required: false, validator: legalCredentialNumber, trigger: 'change' }
        ]
      }
    }
  },
  watch: {
  // 页面重新刷新并清除弹窗中表单的数据
    preMode: {
      handler() {
        // 清除校验
        this.$refs['userOperationForm'].resetFields()
      }
    }
  },

  created() {
  },
  methods: {
    addOperation() {
      // 保存数据
      // 添加操作区分标识
      this.userOperationList.operateType = this.preMode === 'create' ? 0 : this.preMode === 'update' ? 4 : ''
      const operationData = {
        data: this.userOperationList,
        mode: this.preMode
      }
      this.$refs['userOperationForm'].validate(valid => {
        if (valid) {
          this.$emit('operationData', operationData)
        }
      })
    },
    cancelSubmit() {
      // 清除校验
      this.$refs['userOperationForm'].clearValidate()
      // 这里是父组件的方法
      this.cancel()
      // 清空数据（不能用resetFields）
      // this.userOperationList = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.btnSubmit {
  display: flex;
  justify-content: flex-end;
  margin-right: 50px;
}
.line {
  border: 1px solid #eeeeee;
}
.selectWidth {
  width: 100%;
}
::v-deep.addOperation {
  padding: 30px 0;
}
</style>
