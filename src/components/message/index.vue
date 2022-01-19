<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="visible" :before-close="beforeClose" :modal="false" width="430px" :top="'6vh'" :custom-class="'dialogStyle'" :show-close="false">
    <div class="message-wrapper">
      <div class="title">
        <span class="" @click="goMessageList()">消息通知<i class="el-icon-arrow-right" /></span>
        <span class="all-readed" @click="readMessage('all')">全部已读</span>
      </div>
      <ul v-for="(item, index) in listData" :key="index" class="msg-list">
        <li class="list-item" @click="readMessage('one', item, index)">
          <span :class="item.hasRead ? '' : 'red-around'" class="span-1">{{ item.value }}</span>
          <span class="span-2">{{ item.date }}</span>
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Message',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listData: [{
        value: '尊敬的铁投核心企业，您的成员单位四川路桥公司有一笔来自四川建设公司的金额为300,000.00元的应付账款的待…尊敬的铁投核心企业，您的成员单位四川路桥公司有一笔来自四川建设公司的金额为300',
        date: '3月12日',
        hasRead: false
      }, {
        value: '尊敬的铁投核心企业，您的成员单位四川路桥公司',
        date: '3月12日',
        hasRead: false
      }]
    }
  },
  methods: {
    beforeClose() {
      this.$emit('close', null)
    },
    readMessage(type, item, index) {
      this.listData.map(res => {
        if (res === item && type === 'one') {
          res.hasRead = true
        } else if (type === 'all') {
          res.hasRead = true
        }
        return res
      })
    },
    goMessageList() {
      this.$router.push('/SystemManagement/message')
    }
  }
}
</script>

<style lang="scss" scoped>
  ul,li{
    font-style: normal;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ::v-deep .dialogStyle{
    left: 25% !important;
  }
  .title {
    border-bottom: 1px solid #ECEEF5;
    text-align: right;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      cursor: pointer;
    }
    .all-readed {
      line-height: 50px;
    }
  }
  .msg-list{
    overflow-y: scroll;
    max-height: 430px;
    padding: 0 20px;
  }
  .list-item{
    line-height: 20px;
    color: #999;
    padding: 16px 0;
    display: flex;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    &:hover{
      background: #F4F7FA;
    }
    .span-1{
      flex: 6;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .span-2{
      flex: 1;
      color: #999;
      text-align: right;
    }
    .red-around{
      color: #3E495B;
      &::after{
        content: '';
        width: 8px;
        height: 8px;
        background: #FF2828;
        border-radius: 50%;
        left: -10px;
        top: 18px;
        position: absolute;
      }
    }
  }
  ::v-deep .el-dialog__body{
    padding: 0 0 20px;
    margin-top: -30px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.26);
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width:4px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.3);
    border-radius:10px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius:10px;
    background:rgba(0,0,0,0.1);
    -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background:#B3BCCB;
  }
</style>
