<template>
  <div class="mt24">
    <el-table
      :data="tableData"
      class="mt24"
      stripe
      border
      :max-height="curHeight"
      style="width: 100%;"
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align': 'center',
      }"
    >
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column label="通知场景" prop="msgName" show-overflow-tooltip min-width="180" />
      <el-table-column label="通知方式" show-overflow-tooltip min-width="150" prop="msgType">
        <template slot-scope="scope">
          {{ msgType[scope.row.msgType] }}
        </template>
      </el-table-column>
      <el-table-column label="通知对象" prop="msgNotifyType" min-width="180" />
      <el-table-column v-if="sceneType !== 1" label="消息主题" prop="title" min-width="100" />
      <el-table-column label="通知模板" prop="msgContent" show-overflow-tooltip min-width="280" />
      <el-table-column v-if="sceneType !== 1" label="发送开关" prop="msgContent" fixed="right" min-width="">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.notifyStatus"
            :disabled="scope.row.msgType === 2"
            :active-value="true"
            :inactive-value="false"
            :active-color="activeColor"
            @change="handleSwitch($event, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="action" align="center" fixed="right" min-width="130">
        <template slot-scope="scope">
          <el-button type="text" @click="handleTemplate(scope.row)">修改模板</el-button>
          <el-button v-if="scope.row.msgType !== 2 && sceneType !== 1 && scope.row.notifyStatus" type="text" @click="handleConfig(scope.row)">配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!--    <pagination-->
    <!--      v-show="total > 0"-->
    <!--      :total="total"-->
    <!--      :limit.sync="listQuery.pageParam.pageSize"-->
    <!--      :page.sync="listQuery.pageParam.pageIndex"-->
    <!--      @pagination="handlePage"-->
    <!--    />-->
  </div>
</template>

<script>
import { curHeight } from '@/mixins/requestCurHeight'
import { messageSwitch } from '@/api/messageConfig'
import { getDefaultConfig } from '@/utils/auth'
export default {
  name: 'MessageFirstPanel',
  mixins: [curHeight],
  props: {
    sceneType: {
      type: Number,
      default: 1
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      total: 0,
      msgType: {
        1: '短信',
        2: '站内信（系统消息）',
        3: '邮件'
      },
      activeColor: getDefaultConfig().toneVal
      // listQuery: {
      //   pageParam: {
      //     asc: true,
      //     orderBy: '',
      //     pageIndex: 1,
      //     pageSize: 15
      //   }
      // }
    }
  },
  methods: {
    handleSwitch(val, row) {
      let text = ''
      row.notifyStatus = val = val !== true
      if (val === false) {
        text = '是否确认打开'
      } else {
        text = '是否确认关闭'
      }
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        const res = await messageSwitch({
          msgNo: row.msgNo,
          notifyStatus: !row.notifyStatus
        })
        if (res.code === '0') {
          // eslint-disable-next-line require-atomic-updates
          row.notifyStatus = !row.notifyStatus
          this.$emit('getList', this.sceneType)
          console.log({ res })
        } else {
          this.$message.warning(res.msg)
        }
        // 确认，将改变后的状态值赋给绑定的itemValue
      }).catch(() => {
        // 取消，将对立状态值赋给itemValue
      })
    },
    handleConfig(row) {
      console.log(row)
      this.$router.push({
        path: '/SystemManagement/MessageConfig',
        query: {
          msgNo: row.msgNo
        }
      })
    },
    handlePage(page) {
      this.listQuery.pageParam.pageSize = page.limit
      this.getTableData()
      // console.log(page)
    },
    handleTemplate(row) {
      console.log(row)
      this.$emit('handleDialog', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  color: #aaa;
}
.mt24 {
  margin-top: 24px;
}
</style>
