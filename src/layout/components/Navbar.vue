<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <!-- <message :visible="msgVisible" @close="msgVisible = !msgVisible" /> -->

    <div class="right-menu">
      <!-- <span class="right-menu-span" style="display:none;">{{ userInfo }}</span> -->
      <el-dropdown class="avatar-container avatar-container-dropdown right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          {{ userInfo.curCustomerName }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-for="item in customerList">
            <el-dropdown-item :key="item.customerId" @click.native="toggleCustomer(item)">
              <span class="span-item">{{ item.customerName }}</span>
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <span v-if="msgTotal>0" class="right-menu-span cursor" @click="goMsg">
        <el-badge :hidden="msgTotal<1" :value="msgTotal" :max="99" class="item">
          <span class="msg">消息</span>
        </el-badge>
      </span>
      <span class="right-menu-span">欢迎: {{ userInfo.idtName }}</span>
      <span class="right-menu-span cursor" @click="logout">退出登录</span>
      <!-- <template v-if="device!=='mobile'"> -->
      <!-- <search id="header-search" class="right-menu-item" /> -->
      <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
      <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->
      <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      <!-- </template> -->

      <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import Message from '@/components/Message'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import { getUserInfo, getToken, getDefaultConfig } from '@/utils/auth'
import { getMessage } from '@/api/remind'
import { curUserCustList } from '@/api/user'
const CryptoJS = require('crypto-js')

export default {
  components: {
    Breadcrumb,
    Hamburger
    // Message
    // ErrorLog
    // Screenfull,
    // SizeSelect,
    // Search
  },
  data() {
    return {
      msgVisible: false,
      userInfo: {},
      token: getToken(),
      listQuery: {
        page: {
          pageIndex: 1,
          pageSize: 15
        },
        flag: 0
      },
      keyName: getDefaultConfig().keyName,
      customerList: []
      // total: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'msgTotal'
    ])
  },
  created() {
    this.userInfo = getUserInfo()
    console.log(this.userInfo)
    getMessage(this.listQuery).then(res => {
      // this.total = res.data.total
      this.$store.commit('user/SET_MSG_TOTAL', res.data.total)
    })
    curUserCustList({
      readAgreementStatus: 1
    }).then(res => {
      this.customerList = res.data || []
    })
  },
  methods: {
    toggleCustomer(item) {
      const encryptPassword = CryptoJS.AES.encrypt(
        '000000',
        CryptoJS.enc.Latin1.parse('newisdomcss2021.'),
        {
          iv: CryptoJS.enc.Latin1.parse('newisdomcss2021.'),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        }
      ).toString()
      const newArr = this.customerList.filter(res => {
        return res.customerId === item.customerId
      })
      // 如果选择了经销商，引导去移动端使用
      if (newArr[0] && newArr[0].custTypeId === 5) {
        this.$message.warning('经销商请在移动端登录')
        return
      }
      if (item.customerId + '' === this.userInfo.curCustomerId) {
        return
      } else {
        this.$store.dispatch('user/login', {
          username: this.userInfo.mobile,
          password: encryptPassword,
          grant_type: 'password',
          scope: 'server',
          mask: true,
          customerId: item.customerId,
          token: this.token,
          login: true
        }).then(res => {
          this.$message.success('切换成功')
          this.$router.push({
            name: 'Dashboard',
            params: {
              toggleCustomer: true
            }
          })
          this.$store.dispatch('tagsView/delVisitedView', this.$route)
          window.location.reload(true)
        }).catch((error) => {
          error.response && this.$message.error(error.response.data.msg)
        })
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}&tagSystem=${this.keyName}`)
    },
    goMsg() {
      this.$router.push('/SystemManagement/message')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    &:focus {
      outline: none;
    }
    .right-menu-span{
      height: 30px;
      line-height: 30px;
      border-right: 1px solid #D5DFE9;
      padding: 0 40px;
      &:last-child{
        border-right: none;
      }
    }
    .msg {
      background: url('../../assets/msg.svg') no-repeat left 40px center;
      padding: 0 40px 0 60px;
    }
    .cursor{
      cursor: pointer;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      &.avatar-container-dropdown{
        height: 30px;
        line-height: 30px;
        margin-right: 0;
        border-right: 1px solid #D5DFE9;
        padding: 0 40px;
        .avatar-wrapper{
          .el-icon-caret-bottom{
            top: 9px;
          }
        }
      }

      .avatar-wrapper {
        position: relative;
        font-size: 14px;
        color: #5a5e66;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
::v-deep .el-badge__content.is-fixed {
  right: 42px !important;
  top: 8px;
}
</style>
