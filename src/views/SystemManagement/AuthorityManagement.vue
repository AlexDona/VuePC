//系统管理-权限管理
<template>
  <div class="app-container">
    <div class="main">
      <div class="content-box">
        <div class="left">
          <tree-transfer
            :title="titleList"
            :from_data="fromData"
            :to_data="toData"
            :default-props="{ label: 'label' }"
            :mode="mode"
            :placeholder="placeholder"
            height="750px"
            filter
            open-all
            @add-btn="add"
            @remove-btn="remove"
            @left-check-change="leftCheckChange"
            @right-check-change="rightCheckChange"
          />
          <div class="btn">
            <el-button
              type="primary"
              :disabled="toData.length === 0"
              @click="getPermissionTreeList"
            >配置权限</el-button>
          </div>
        </div>
        <div v-if="isShowMenu" :class="{ right: true, isClick: menuDisabled }">
          <h3 class="right-title">
            <span> 配置菜单 </span>
          </h3>
          <div class="tree-box">
            <el-tree
              ref="tree"
              class="my-el-tree"
              disabled
              :data="menuData"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              default-expand-all
              :default-checked-keys="defaultKey"
            />
          </div>
        </div>
      </div>
      <el-row
        v-if="isShowMenu"
        :gutter="24"
        style="margin-top: 10px; margin-left: 58%"
      >
        <el-col>
          <el-button
            style="width: 60px"
            type="text"
            :disabled="menuData.length === 0 || toData.length === 0"
            @click="submitData"
          >确定</el-button>
          <!-- <el-button type="text" >删除</el-button> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer' // 引入
import { getUserMenuList } from '@/api/role' // 左边菜单栏接口
import { getUserInfo } from '@/utils/auth'
import { getUserList } from '@/api/user' // 获取用户相关接口
import {
  getHaveCommonPermission,
  getMenuTreeList,
  getPermissionTreeList,
  getPermissionConfig
} from '@/api/permission' // 权限接口
export default {
  name: '',
  components: { treeTransfer }, // 注册
  data() {
    return {
      userInfo: {}, // 用户信息
      titleList: ['请选择操作人', '待配置权限的操作人'],
      placeholder: '请输入操作人',
      mode: 'transfer', // transfer addressList
      fromData: [], // 用户列表
      toData: [], // 待配置权限用户列表
      userIdList: [], // 声明用户id的数组
      userIdPoolList: [], // 声明待配置用户id的数组
      defaultKey: [], // 默认选中的菜单
      rightIdList: [], // 右边勾选数组
      isShowMenu: false,
      menuData: [
        // 菜单数据
      ],
      menuDisabled: false, // 菜单框是否可以点击
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: this.disabledFn // 用作菜单的禁用事件
      },
      ifPermissionList: []
    }
  },

  watch: {},
  created() {
    // 获取用户信息
    this.userInfo = getUserInfo()
    // 获取配置菜单列表
    this.getMenuTreeList()
  },
  mounted() {
    this.getUserList()
    // this.btnChange()
  },
  updated() {
    // 在组件更新之后再去进行DOM操作，因为在之前的生命周期函数拿不到dom元素
    this.btnChange()
  },
  methods: {
    // 菜单禁用事件
    disabledFn() {
      return this.menuDisabled
    },
    // 确定按钮
    submitData() {
      if (this.ifPermissionList.length === 0) {
        this.$message.warning('请选择待配置权限的操作人')
        return
      }
      const userIdList = []
      this.toData.forEach((item) => {
        userIdList.push(item.id)
      })
      const params = {
        menuIdList: this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys()), // 这个是获取已勾选的数据的key
        userIdList: userIdList
      }
      getPermissionConfig(params).then((res) => {
        if (res.code === '0') {
          // 获取用户信息
          this.userInfo = getUserInfo()
          // 获取配置菜单列表
          this.getMenuTreeList()
          this.getUserList()
          this.getPermissionTreeList()
          getUserMenuList()
          this.$message.success(res.msg)
          this.$forceUpdate()
          location.reload()
        }
      })
      // console.log(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()))
    },
    // 获取用户列表
    getUserList() {
      getUserList(this.userInfo.curCustomerId).then((res) => {
        const list = []
        res.data.forEach((item) => {
          list.push({
            id: item.userId,
            label: item.userName
          })
        })
        this.fromData = list
      })
    },
    // 获取配置菜单列表
    getMenuTreeList() {
      getMenuTreeList(this.userInfo.custTypeId).then((res) => {
        if (res.code === '0') {
          this.menuData = res.data
        }
      })
    },
    // 渲染按钮
    btnChange() {
      // 获取父元素
      const parentNode = document.querySelectorAll(
        '.transfer-left>.transfer-main>.el-tree>.el-tree-node>.el-tree-node__content'
      )
      // console.log(this)
      var _this = this
      // 这里循环的声明要用let，不然的话获取的下标会重复
      for (let j = 0; j < parentNode.length; j++) {
        // 获取最左边的span,清楚掉它的padding
        const isLeafSpan = document.querySelectorAll(
          '.transfer-left>.transfer-main>.el-tree>.el-tree-node>.el-tree-node__content'
        )
        const isLeaf = isLeafSpan[j].children[0]
        isLeaf.style = 'padding:0'

        // 创建一个新的DIV，用作点击查看权限作用
        const newDiv = document.createElement('div')
        newDiv.innerHTML = '查看权限'
        newDiv.id = 'insert'
        // newDiv.style = "";
        newDiv.onclick = function() {
          // 获取到当前点击的用户名字
          const userName = newDiv.previousSibling.children[0].innerHTML
          let usId = ''
          _this.fromData.forEach((item) => {
            if (userName === item.label) {
              usId = item.id
            }
          })
          _this.getMenuTreeList() // 获取到所有的菜单
          // 点击查看当前菜单权限
          const keyList = []
          getPermissionTreeList(usId).then((res) => {
            if (res.code === '0') {
              // this.menuData = res.data
              res.data.forEach((item) => {
                item.children.forEach((item2) => {
                  keyList.push(item2.id)
                  // console.log(item2)
                })
              })
              _this.$nextTick(() => {
                _this.$refs.tree.setCheckedKeys(keyList)
              })

              _this.$forceUpdate()
              // _this.$refs.tree.setCheckedNodes(res.data)
            }
          })
          _this.menuDisabled = true
          _this.isShowMenu = true
        }
        // 追加到当前父元素
        parentNode[j].appendChild(newDiv)
      }
      // }
    },
    // 配置权限
    getPermissionTreeList() {
      if (this.ifPermissionList.length === 0) {
        this.$message.warning('请选择待配置权限的操作人')
        this.isShowMenu = false
        return
      }
      this.isShowMenu = true
      this.menuDisabled = false
      this.getMenuTreeList()
      getPermissionTreeList(this.toData[0].id).then((res) => {
        if (res.code === '0') {
          const keyList = []
          // this.menuData = res.data
          res.data.forEach((item) => {
            item.children.forEach((item2) => {
              keyList.push(item2.id)
              // console.log(item2)
            })
          })
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(keyList)
          })
          this.$forceUpdate()
          // _this.$refs.tree.setCheckedNodes(res.data)
        }
      })
    },
    // 左边勾选用户事件
    leftCheckChange(nodeObj, treeObj, checkAll) {
      if (checkAll) {
        // 如果是全选的话，那就直接遍历用户列表进行判断
        this.fromData.forEach((item) => {
          this.userIdList.push(item.id)
        })
        // 去重
        this.userIdList = [...new Set(this.userIdList)]

        if (this.toData.length > 0) {
          // 这个是待配置权限用户的值，有值就添加进去。
          this.toData.forEach((item) => {
            this.userIdPoolList.push(item.id)
          })
        }
        this.getHaveCommonPermission()
      } else if (!checkAll && !nodeObj) {
        this.userIdList = []
      } else {
        // 单选数据
        // 先判断所勾选的数据，如果有值就删除，没有值就添加。这是为了避免重复添加所勾选的数组
        if (this.userIdList.includes(nodeObj.id)) {
          // 获取下标，根据下标删除值
          var index = this.userIdList.indexOf(nodeObj.id)
          this.userIdList.splice(index, 1)
        } else {
          // 没有值就直接添加
          this.userIdList.push(nodeObj.id)
        }
        if (this.toData.length > 0) {
          // 这个是待配置权限用户的值，有值就添加进去。
          this.toData.forEach((item) => {
            this.userIdPoolList.push(item.id)
          })
        }
      }
      // 所勾选的数组中有值才会发起请求
      if (this.userIdList.length > 0) {
        this.getHaveCommonPermission()
      }
    },
    // 右边勾选事件
    rightCheckChange(nodeObj, treeObj, checkAll) {
      // console.log(this.toData)
      // console.log(treeObj)
      console.log(checkAll)

      if (checkAll) {
        // 如果是全选的话，那就直接遍历用户列表进行判断
        this.toData.forEach((item) => {
          this.rightIdList.push(item.id)
        })
        // 去重
        this.rightIdList = [...new Set(this.rightIdList)]

        if (this.toData.length > 0) {
          // 这个是待配置权限用户的值，有值就添加进去。
          this.toData.forEach((item) => {
            this.userIdPoolList.push(item.id)
          })
        }
        this.ifPermissionList = this.toData
      } else if (!checkAll && !nodeObj) {
        console.log('触发')
        this.rightIdList = []
        this.ifPermissionList = []
      } else {
        // 单选数据
        this.ifPermissionList = treeObj.checkedNodes
        // 先判断所勾选的数据，如果有值就删除，没有值就添加。这是为了避免重复添加所勾选的数组
        if (this.rightIdList.includes(nodeObj.id)) {
          // 获取下标，根据下标删除值
          var index = this.rightIdList.indexOf(nodeObj.id)
          this.rightIdList.splice(index, 1)
        } else {
          // 没有值就直接添加
          this.rightIdList.push(nodeObj.id)
        }
        // if (this.toData.length > 0) {
        //   // 这个是待配置权限用户的值，有值就添加进去。
        //   this.toData.forEach((item) => {
        //     this.rightIdList.push(item.id)
        //   })
        // }
      }
    },
    // 判断是否权限一致
    getHaveCommonPermission() {
      const params = {
        userIdList: this.userIdList,
        // userIdPoolList: this.userIdList,
        userIdPoolList: this.userIdPoolList
      }
      getHaveCommonPermission(params).then((res) => {
        if (res.code === '0') {
          // 添加成功之后清空待配置权限用户id数组
          this.userIdPoolList = []
          // 获取到按钮改变样式，使按钮可以点击
          const isLeafSpan = document.querySelectorAll(
            '.transfer-center>.transfer-center-item>button'
          )
          isLeafSpan[0].style = 'pointer-events: auto;'
        } else {
          // 获取到按钮改变样式，禁用按钮的点击事件
          const isLeafSpan = document.querySelectorAll(
            '.transfer-center>.transfer-center-item>button'
          )
          isLeafSpan[0].style = 'pointer-events: none;'
          this.$message.error(res.msg)
        }
      })
    },
    // 监听穿梭框组件添加(右箭头)
    add(fromData, toData, obj) {
      setTimeout(() => {
        this.btnChange()
      }, 100)
      // this.btnChange();
      this.$forceUpdate()
      this.userIdList = []
      this.menuData = []
      // this.$forceUpdate()
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
    },
    // 监听穿梭框组件移除（左箭头）
    remove(fromData, toData, obj) {
      //  console.log('触发')
      setTimeout(() => {
        this.btnChange()
      }, 100)
      // this.btnChange();
      this.$forceUpdate()
      this.userIdPoolList = []
      if (this.toData.length === 0) {
        console.log('chiufa')
        this.menuData = []
        this.ifPermissionList = []
      }
      //  console.log()
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .wl-transfer .transfer-main {
  padding-left: 4px;
  overflow: hidden;
}
.app-container {
  padding: 0;
  margin: 0 22px;
}
::v-deep #insert {
  margin-left: 10px;
  margin-right: 80px;
  color: val(--theme);
  font-size: 14px;
}
::v-deep .el-tree-node {
  width: 230px;
  overflow: hidden;
}
.main {
  background: #fff;
  padding: 16px;
  .content-box {
    padding-left: 12px;
    display: flex;
    //左边穿梭框样式
    .left {
      width: 35%;
      min-width: 550px;
      position: relative;
      overflow: hidden;
      .wl-transfer .transfer {
        // display: flex;
        height: 100%;
        .transfer-left {
          min-width: 250px;
          .is-leaf .el-tree-node__expand-icon .el-icon-caret-right {
            padding: 0 !important;
          }
        }
        .transfer-center {
          width: 50px;
          min-width: 50px;
        }
        .transfer-right {
          // flex: 8;
          min-width: 250px;
        }
      }
      .btn {
        position: absolute;
        width: 40%;
        text-align: right;
        padding: 10px 20px;
        right: 10%;
        height: 56px;
        border-top: 1px solid #ebeef5;
        bottom: 0px;
      }
    }
    //右边菜单配置
    .right {
      width: 15%;
      height: 750px;

      min-width: 220px;
      box-sizing: border-box;
      vertical-align: middle;
      border: 1px solid #cccccc;
      border-radius: 2px;
      position: relative;
      .tree-box {
        height: 680px;
        overflow: hidden;
        overflow-y: scroll;
      }
    }
  }
}
::v-deep .is-leaf .el-tree-node__expand-icon .el-icon-caret-right {
  padding: 0 !important;
}
::v-deep .wl-transfer .transfer-right {
  right: 10% !important;
  border: 1px solid #cccccc;
  border-radius: 2px;
  min-width: 200px;
}
::v-deep .wl-transfer .transfer-left {
  border: 1px solid #cccccc;
  border-radius: 2px;
  min-width: 200px;
}
::v-deep .wl-transfer .transfer-center {
  width: 10%;
}
// ::v-deep .el-tree-node__content .el-tree-node__content{
//   width: 100px  !important;
// }
::v-deep .custom-tree-node span {
  display: inline-block;
  width: 100px !important;
}
::v-deep .el-input--small .el-input__inner {
  height: 32px;
  width: 100%;
  font-size: 12px;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 16px;
  padding-right: 10px;
  padding-left: 10px;
}
::v-deep .wl-transfer .transfer-title {
  font-size: 14px;
  color: #3e495b;
  margin: 0 0 10px 0;
  background-color: #eee;
}
.right-title {
  // position: absolute;
  border-bottom: 1px solid #ebeef5;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  margin: 0 0 10px 0;
  background-color: #eee;
  font-size: 14px;
  color: #3e495b;
}
::v-deep .el-button {
  color: #ffffff;
  background-color: var(--theme) !important;
  border-color: var(--theme) !important;
  &:hover {
    color: #ffffff !important;
  }
}
::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: var(--theme) !important;
  border-color: var(--theme) !important;
}
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: var(--theme) !important;
  border-color: var(--theme) !important;
}
</style>
