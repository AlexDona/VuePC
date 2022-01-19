<template>
  <div class="mergeOffsetTable-wrapper">
    <!-- <div v-if="userInfo.orgType === 2" class="overTime"> -->
    <div class="overTime">
      <span class="span-title span-title-overtime">还款提醒设置</span>
      <span class="explain">系统将在如下日期给您发送还款提醒：</span>
      <el-table
        v-loading="loading"
        :header-cell-style="{background: '#eee',color: '#333',}"
        :data="overtimerTableData"
        style="width: 70%"
      >
        <el-table-column
          label="序号"
          type="index"
          width="100"
        />
        <el-table-column
          label="提醒日"
          min-width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.reminderPurpose === 1">应还款日前 {{ scope.row.dueReminderDate }} 个自然日</span>
            <span v-else>到期日前 {{ scope.row.dueReminderDate }} 个自然日</span>
          </template>
        </el-table-column>
        <el-table-column
          label="提醒方式"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.remindType === 1 ? '站内信' : scope.row.remindType === 2 ? '短信' : '短信，站内信' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.flag === 0 ? '打开' : '关闭' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          min-width="50"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    <el-dialog :visible.sync="reviseDateDialog" title="修改" width="480px">
      <div class="text">
        <span>{{ curReviseRow.reminderPurpose === 2 ? '到期日前' : '应还款日前' }}</span><el-input v-model="days" maxlength="3" type="text" /><span>个自然日(自然日最大3位数)</span>
      </div>
      <div class="changeStatus">
        状态：<el-radio v-model="radio" label="0">打开</el-radio><el-radio v-model="radio" label="1">关闭</el-radio>
      </div>
      <div class="changeStatus">
        提醒方式：<el-checkbox v-model="checked1">站内信</el-checkbox><el-checkbox v-model="checked2">短信</el-checkbox>
      </div>
      <div class="confirm-btn">
        <el-button v-preventReClick type="primary" round @click="sureRevise()">确定</el-button><el-button round @click="reviseDateDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { reminderList, updateAndSave } from '@/api/remind'
import { getUserInfo } from '@/utils/auth'

export default {
  // name: 'message',
  // components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 15
      },
      overtimerTableData: [],
      days: '',
      reviseDateDialog: false,
      radio: '1',
      curReviseRow: {},
      userInfo: {},
      loading: true,
      checked1: false,
      checked2: false
    }
  },
  watch: {
    days(newVal, oldVal) {
      if (!/^([1-9][0-9]*)$/.test(newVal)) {
        this.days = ''
      }
    }
  },
  created() {
    this.userInfo = getUserInfo()
    this.getList()
  },
  methods: {
    getList() {
      reminderList().then(res => {
        this.overtimerTableData = res.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        error.response && this.$message.error(error.response.data.msg)
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.reviseDateDialog = true
      this.days = row.dueReminderDate
      this.radio = row.flag + ''
      this.curReviseRow = row
      if (row.remindType === 1) {
        this.checked1 = true
        this.checked2 = false
      } else if (row.remindType === 2) {
        this.checked2 = true
        this.checked1 = false
      } else {
        this.checked1 = true
        this.checked2 = true
      }
    },
    sureRevise() {
      let isSameDayDQ = false
      let isSameDayHK = false
      const vm = this
      // if (this.curReviseRow.reminderPurpose === 2) {
      // }
      this.overtimerTableData.forEach(res => {
        // 如果是同一个提醒类型，并且状态是打开，并且不是当前自己，提醒日不能相同
        if (res.dueReminderDate === +vm.days && res !== vm.curReviseRow && vm.radio === '0' && res.reminderPurpose === 2 && vm.curReviseRow.reminderPurpose === 2) {
          isSameDayDQ = true
        } else if (res.dueReminderDate === +vm.days && res !== vm.curReviseRow && vm.radio === '0' && res.reminderPurpose === 1 && vm.curReviseRow.reminderPurpose === 1) {
          isSameDayHK = true
        }
      })
      if (isSameDayDQ) {
        this.$message.warning('到期提醒日不能为同一天')
        return
      }
      if (isSameDayHK) {
        this.$message.warning('应还款日提醒不能为同一天')
        return
      }
      const remindType = this.checked2 && this.checked1 ? 3 : this.checked1 ? 1 : 2
      updateAndSave({
        dueReminderDate: this.days,
        flag: this.radio,
        id: this.curReviseRow.id,
        reminderPurpose: this.curReviseRow.reminderPurpose,
        remindType
      }).then(res => {
        this.reviseDateDialog = false
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mergeOffsetTable-wrapper{
  padding: 12px 22px 22px;
  margin: 0 22px;
  background: #fff;

  .span-title{
    display: block;
    margin: 14px 0 14px;
    color: #3E495B;
    border-left: 2px solid var(--theme);
    padding-left: 8px;
    font-size: 14px;

    &.span-title-overtime{
      color: #3E495B;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .explain{
    display: block;
    font-size: 16px;
    color: #999;
    padding-bottom: 8px;
  }
  .text{
    text-align: center;

    span{
      color: #4C6072;
    }
  }
  .changeStatus{
    text-align: center;
    padding: 16px 0 0;
  }
  .confirm-btn{
    padding-top: 16px;
    text-align: center;

    button{
      width: 145px;
    }
  }
  .overTime{
    margin-bottom: 80px;
  }
}
::v-deep .el-input{
  width: 58px;
}
::v-deep .el-dialog__header{
  border-bottom: 1px solid #E4E4E4;
}
::v-deep.text input{
  width: 48px;
  color: #4C6072;
  margin: 0 5px;
  padding: 0 2px;
  text-align: center;
}
</style>
