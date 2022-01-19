<template>
  <div class="app-container">
    <el-card class="box-card profile">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <el-row :gutter="20" class="border">
        <el-col :span="8">
          <i class="fa fa-tag fa-fw" /> 操作人编号
        </el-col>
        <el-col :span="8">
          {{ userInfo.userNo }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="border">
        <el-col :span="8">
          <i class="fa fa-user fa-fw" /> 登录账号
        </el-col>
        <el-col :span="8">
          {{ userInfo.loginName }}
        </el-col>
        <el-col :span="8">
          <el-button v-waves class="filter-item" size="mini" type="primary" @click="handleEditName">
            修改账号
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="border">
        <el-col :span="8">
          <i class="fa fa-lock fa-fw" /> 登录密码
        </el-col>
        <el-col :span="8">
          ******
        </el-col>
        <el-col :span="8">
          <el-button v-waves class="filter-item" size="mini" type="primary" @click="handleEditPassword">
            修改密码
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="border">
        <el-col :span="8">
          <i class="fa fa-envelope fa-fw" /> 绑定邮箱
        </el-col>
        <el-col :span="8">
          {{ userInfo.email }}
        </el-col>
        <el-col :span="8">
          <el-button v-waves class="filter-item" size="mini" type="primary" @click="handleEditEmail">
            修改邮箱
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="border">
        <el-col :span="8">
          <i class="fa fa-tablet fa-fw fa-4g" /> 绑定手机
        </el-col>
        <el-col :span="8">
          {{ userInfo.mobile }}
        </el-col>
        <el-col :span="8">
          <el-button v-waves class="filter-item" size="mini" type="primary" @click="handleEditMobile">
            更换手机
          </el-button>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="20" class="border">
        <el-col :span="8">
          <i class="el-icon-postcard" style="margin-right:5px;" /> 企业资料
        </el-col>
        <el-col :span="8">
          <i class="fa fa-check-circle" />
          {{ businessNo }}
        </el-col>
        <el-col :span="8">
          <el-button v-waves class="filter-item" size="mini" type="primary" @click="handleEditCustom">
            补充资料
          </el-button>
        </el-col>
      </el-row> -->
    </el-card>

    <el-dialog :visible.sync="dialog.dialogNameVisible" title="修改登录账号" width="30%" :close-on-click-modal="false">
      <el-form ref="nameDataForm" :model="nameTemp" :rules="nameRules" label-position="left" label-width="120px" style="margin-left:50px;margin-right:50px;">
        <el-form-item label="原登录账号" prop="">
          <el-input v-model="userInfo.loginName" disabled type="text" />
        </el-form-item>
        <el-form-item label="新登录账号" prop="newName">
          <el-input v-model="nameTemp.newName" type="text" />
        </el-form-item>
        <el-form-item label="确认新登录账号" prop="confirmName">
          <el-input v-model="nameTemp.confirmName" type="text" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="dialog.dialogNameVisible = false">取消</el-button>
        <el-button v-preventReClick type="primary" @click="changeName()">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialog.dialogPasswordVisible" title="修改密码" width="30%" :close-on-click-modal="false">
      <el-form ref="passwordDataForm" :model="passwordTemp" :rules="passwordRules" label-position="left" label-width="80px" style="margin-left:50px;margin-right:50px;">
        <el-form-item label="原密码" prop="passWord">
          <el-input v-model="passwordTemp.passWord" type="password" maxlength="18" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassWord">
          <el-input v-model="passwordTemp.newPassWord" type="password" maxlength="18" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordTemp.confirmPassword" type="password" maxlength="18" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="dialog.dialogPasswordVisible = false">取消</el-button>
        <el-button v-preventReClick type="primary" @click="changePassword()">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialog.dialogEmailVisible" title="修改邮箱" width="30%" :close-on-click-modal="false">
      <el-form ref="emailDataForm" :model="emailTemp" label-position="left" :rules="emailRules" label-width="120px">
        <el-form-item label="新邮箱" prop="email">
          <el-input v-model="emailTemp.email" />
        </el-form-item>
        <el-form-item label="新邮箱验证码" prop="emailCode">
          <el-input v-model="emailTemp.emailCode" style="width:60%;" />
          <el-button v-preventReClick type="primary" style="width:40%;border-radius:0px 4px 4px 0px;" @click="sendEmailMsg">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="dialog.dialogEmailVisible = false">取消</el-button>
        <el-button v-preventReClick type="primary" @click="changeEmail()">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialog.dialogMobileVisible" title="更换手机" width="30%" :close-on-click-modal="false">
      <el-form ref="mobileDataForm" :model="mobileTemp" :rules="mobileRules" label-position="left" label-width="100px">
        <el-form-item label="新手机号码" prop="newPhone">
          <el-input v-model="mobileTemp.newPhone" />
        </el-form-item>
        <el-form-item label="验证码" prop="newPhoneCode">
          <el-input v-model="mobileTemp.newPhoneCode" style="width:60%" />
          <el-button v-preventReClick type="primary" style="width:40%;border-radius:0px 4px 4px 0px;" @click="sendNewPhoneMsg">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.dialogMobileVisible = false">取消</el-button>
        <el-button v-preventReClick type="primary" @click="changeMobile()">确定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog :visible.sync="dialogVisible" width="1100px" title="客户明细">
      <detail-dialog :customer-id="customerId" :dialog-mode.sync="dialogMode" @close="dialogVisible = false" />
    </el-dialog> -->
  </div>
</template>

<script>
import { sendMessage, editEmail, editPhone, editPassword, modifyLoginAccount } from '@/api/security'
// import DetailDialog from '@/views/SystemManagement/detail-dialog'
import { validEmailNew, validEmail, validPhone } from '@/utils/validate'
import waves from '@/directive/waves' // waves directive
import { getUserInfo, setUserInfo } from '@/utils/auth'
// import {
//   mapGetters
// } from 'vuex'

export default {
  name: 'Security',
  // components: { DetailDialog },
  directives: { waves },
  data() {
    return {
      dialog: {
        dialogPasswordVisible: false,
        dialogEmailVisible: false,
        dialogNameVisible: false,
        dialogMobileVisible: false
      },
      passwordTemp: {
        passWord: '',
        newPassWord: '',
        confirmPassword: ''
      },
      nameTemp: {
        newName: '',
        confirmName: ''
      },
      emailTemp: {
        email: '',
        emailCode: '',
        deliveryType: 'EMAIL'
      },
      // dialogMode: '',
      // dialogVisible: false,
      // customerId: '',
      // businessNo: '',
      mobileTemp: {
        // mobile: this.$store.state.user.phone,
        email: '',
        // imgVerificationCode: '',
        // verificationCode: '',
        newPhone: '',
        newPhoneCode: '',
        // newImgVerificationCode: '',
        // newVerificationCode: '',
        // checkcode: '',
        deliveryType: 'PHONE'
      },
      passwordRules: {
        passWord: [
          { required: true, message: '请输入原密码', trigger: 'change' }
        ],
        newPassWord: [
          { required: true, message: '请输入新密码', trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'change' }
        ]
      },
      nameRules: {
        newName: [
          { required: true, message: '请输入新账号', trigger: 'blur' }
        ],
        confirmName: [
          { required: true, message: '请确认新账号', trigger: 'blur' }
        ]
      },
      emailRules: {
        email: [
          { required: true, trigger: 'change', validator: validEmailNew }
        ],
        emailCode: [
          { required: true, message: '请输入验证码', trigger: 'change' }
        ]
      },
      mobileRules: {
        newPhone: [
          { required: true, message: '请输入新手机号', trigger: 'blur' }
        ],
        newPhoneCode: [
          { required: true, message: '请输入验证码', trigger: 'change' }
        ]
        // newVerificationCode: [
        //   { required: true, message: '请输入验证码', trigger: 'change' }
        // ]
      },
      userInfo: {}
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'deptType',
  //     'roleType'
  //   ]),
  //   disabledComputed() {
  //     var flag = true
  //     if (this.deptType === 'wxsk') {
  //       flag = false
  //     } else if (this.roleType !== 1 && this.roleType !== '1') {
  //       flag = false
  //     }
  //     return flag
  //   }
  // },
  created() {
    // this.handleCustom()
    this.userInfo = getUserInfo()
    console.log(this.userInfo)
  },
  methods: {
    handleEditPassword() {
      this.passwordTemp = {
        passWord: '',
        newPassWord: '',
        confirmPassword: ''
      }
      this.dialog.dialogPasswordVisible = true
      this.$nextTick(() => {
        this.$refs['passwordDataForm'].clearValidate()
      })
    },
    changePassword() {
      this.$refs['passwordDataForm'].validate((valid) => {
        if (valid) {
          if (this.passwordTemp.newPassWord !== this.passwordTemp.confirmPassword) {
            this.$message({
              title: '提示',
              message: '两次密码输入不同，请重新输入！',
              type: 'warning',
              duration: 3000
            })
          } else {
            editPassword(this.passwordTemp).then((response) => {
              if (response.code === '0') {
                this.$message({
                  title: '成功',
                  message: response.msg,
                  type: 'success',
                  duration: 3000
                })
                this.dialog.dialogPasswordVisible = false
                this.$store.dispatch('user/logout').then(res => {
                  window.location.href = '/#/login'
                })
              } else {
                this.$message.error(response.msg)
              }
            }).catch(error => {
              error.response && this.$message.error(error.response.data.msg)
            })
          }
        }
      })
    },
    // 修改邮箱单击事件
    handleEditEmail() {
      this.emailTemp.email = ''
      this.emailTemp.emailCode = ''
      this.dialog.dialogEmailVisible = true
      this.$nextTick(() => {
        this.$refs['emailDataForm'].clearValidate()
      })
    },
    // 修改账号单击事件
    handleEditName() {
      this.nameTemp = {
        newName: '',
        confirmName: ''
      }
      this.dialog.dialogNameVisible = true
      this.$nextTick(() => {
        this.$refs['nameDataForm'].clearValidate()
      })
    },
    // 邮件发送验证码
    sendEmailMsg() {
      if (validEmail(this.emailTemp.email)) {
        sendMessage(this.emailTemp).then((response) => {
          if (response.code === '0') {
            this.$message({
              title: '成功',
              message: '验证码发送成功！',
              type: 'success',
              duration: 3000
            })
          } else {
            this.$message.error(response.msg)
          }
        }).catch(error => {
          error.response && this.$message.error(error.response.data.msg)
        })
      } else {
        this.$message({
          title: '提示',
          message: '邮箱格式错误！',
          type: 'warning',
          duration: 3000
        })
      }
    },
    // 修改账号
    changeName() {
      this.$refs['nameDataForm'].validate((valid) => {
        if (valid) {
          if (this.userInfo.loginName === this.nameTemp.newName) {
            this.$message.warning('您录入新的登录账号与原账号一致，请重新输入')
            return
          } else if (this.nameTemp.confirmName !== this.nameTemp.newName) {
            this.$message.warning('您两次录入的新登录账号不一致，请重新输入')
            return
          }
          modifyLoginAccount({
            userName: this.nameTemp.newName
          }).then((response) => {
            if (response.code === '0') {
              this.dialog.dialogNameVisible = false
              this.$store.dispatch('user/logout').then(res => {
                window.location.href = '/#/login'
              })
              this.$message({
                title: '成功',
                message: '修改登录账号成功！',
                type: 'success',
                duration: 3000
              })
            } else {
              this.$message.error(response.msg)
            }
          }).catch(error => {
            error.response && this.$message.error(error.response.data.msg)
          })
        }
      })
    },
    // 更换邮箱
    changeEmail() {
      this.$refs['emailDataForm'].validate((valid) => {
        if (valid) {
          editEmail(this.emailTemp).then((response) => {
            if (response.code === '0') {
              this.$message({
                title: '成功',
                message: '修改绑定邮箱成功！',
                type: 'success',
                duration: 3000
              })
              setUserInfo(Object.assign(this.userInfo, { email: this.emailTemp.email }))
              this.dialog.dialogEmailVisible = false
            } else {
              this.$message({
                title: '失败',
                message: response.msg,
                type: 'error',
                duration: 2000
              })
            }
          }).catch(error => {
            error.response && this.$message.error(error.response.data.msg)
          })
        }
      })
    },
    // 修改手机号
    handleEditMobile() {
      this.mobileTemp = {
        // mobile: this.$store.state.user.phone,
        // imgVerificationCode: '',
        // verificationCode: '',
        // newMobile: '',
        // newImgVerificationCode: '',
        // newVerificationCode: '',
        // checkcode: ''
        email: '',
        // imgVerificationCode: '',
        // verificationCode: '',
        newPhone: '',
        newPhoneCode: '',
        // newImgVerificationCode: '',
        // newVerificationCode: '',
        // checkcode: '',
        deliveryType: 'PHONE'
      }
      this.dialog.dialogMobileVisible = true
      this.$nextTick(() => {
        this.$refs['mobileDataForm'].clearValidate()
      })
    },
    // 原手机发送验证码
    // sendOldPhoneMsg() {
    //   this.mobileTemp.noticeType = '0'
    //   this.mobileTemp.reveiver = this.mobileTemp.mobile
    //   sendMessage(this.mobileTemp).then((response) => {
    //     if (response.code === 200) {
    //       this.$message({
    //         title: '成功',
    //         message: '验证码发送成功！',
    //         type: 'success',
    //         duration: 3000
    //       })
    //     } else {
    //       this.$message({
    //         title: '失败',
    //         message: '验证码发送失败！',
    //         type: 'error',
    //         duration: 2000
    //       })
    //     }
    //   })
    // },
    // 新手机发送验证码
    sendNewPhoneMsg() {
      this.mobileTemp.email = this.userInfo.email
      if (validPhone(this.mobileTemp.newPhone)) {
        sendMessage(this.mobileTemp).then((response) => {
          if (response.code === '0') {
            this.$message({
              title: '成功',
              message: '验证码已发送至邮箱！',
              type: 'success',
              duration: 3000
            })
          } else {
            this.$message({
              title: '失败',
              message: response.msg,
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          error.response && this.$message.error(error.response.data.msg)
        })
      } else {
        this.$message.warning('手机号码错误，请重新填写')
      }
    },
    // 修改手机号
    changeMobile() {
      this.$refs['mobileDataForm'].validate((valid) => {
        if (valid) {
          editPhone(this.mobileTemp).then((response) => {
            if (response.code === '0') {
              this.$message({
                title: '成功',
                message: '请查收登录邮件，以新的账户及密码重新登录',
                type: 'success',
                duration: 3000
              })
              // this.$store.state.user.phone = query.phone
              this.$store.dispatch('user/logout').then(res => {
                window.location.href = '/#/login'
              })
              this.dialog.dialogMobileVisible = false
            } else {
              this.$message({
                title: '失败',
                message: response.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    }
    // 补充资料
    // handleEditCustom() {
    //   this.dialogMode = 'edit'
    //   this.dialogVisible = true
    // },
    // 根据部门查询customId
    // handleCustom() {
    //   fetchCustomByDeptId(this.$store.state.user.deptId).then((response) => {
    //     this.customerId = response.data.id
    //     this.businessNo = response.data.businessNo
    //   })
    // }
  }
}
</script>

<style scoped>
.profile i {
  color: #999;
  width: 15px;
}
.profile i.fa-check-circle {
  color:forestgreen
}
.el-row {
  height:35px;
  padding: 10px 0;
}
::v-deep .profile i{
  color: #3E495B;
}
::v-deep .el-input--medium .el-input__inner{
  border-radius: 4px 0 0 4px;
}
::v-deep .el-form-item--medium .el-form-item__label{
  text-align: right;
}
</style>
