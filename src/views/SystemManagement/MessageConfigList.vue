<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTab">
      <el-tab-pane label="登录" name="1">
        <el-alert
          type="warning"
          :closable="false"
        >
          <template #title>
            <img :src="require('@/assets/notify.svg')" alt=""> 温馨提示：以下为系统中登录相关的短信通知，默认为短信推送；仅允许修改短信模板
          </template>
        </el-alert>
        <message-panel :scene-type="1" :table-data.sync="tableData" :dialog-visible="dialogVisible" @getList="getTableData" @handleDialog="handleDialog" />
      </el-tab-pane>
      <el-tab-pane label="授信" name="2">
        <el-alert
          type="warning"
          :closable="false"
        >
          <template #title>
            <img :src="require('@/assets/notify.svg')" alt=""> 温馨提示：以下为系统中授信相关的短信及站内信通知，通知模板均允许修改；站内信默认为都推送；短信是否发送可进行配置
          </template>
        </el-alert>
        <message-panel :scene-type="2" :table-data="tableData" :dialog-visible="dialogVisible" @getList="getTableData" @handleDialog="handleDialog" />
      </el-tab-pane>
      <el-tab-pane label="放款" name="3">
        <el-alert
          type="warning"
          :closable="false"
        >
          <template #title>
            <img :src="require('@/assets/notify.svg')" alt=""> 温馨提示：以下为系统中放款相关的短信及站内信通知，通知模板均允许修改；站内信默认为都推送；短信是否发送可进行配置
          </template>
        </el-alert>
        <message-panel :scene-type="3" :table-data="tableData" :dialog-visible="dialogVisible" @getList="getTableData" @handleDialog="handleDialog" />
      </el-tab-pane>
      <el-tab-pane label="贷后" name="4">
        <el-alert
          type="warning"
          :closable="false"
        >
          <template #title>
            <img :src="require('@/assets/notify.svg')" alt=""> 温馨提示：以下为系统中贷后相关的短信及站内信通知，通知模板均允许修改；站内信默认为都推送；短信是否发送可进行配置
          </template>
        </el-alert>
        <message-panel :scene-type="4" :table-data="tableData" :dialog-visible="dialogVisible" @getList="getTableData" @handleDialog="handleDialog" />
      </el-tab-pane>
    </el-tabs>

    <!-- 修改模板 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="修改模板"
      class="dialogStyle"
    >
      <el-form ref="updateTemplate" :model="{}">
        <el-form-item prop="templateText" label="通知模板" label-width="70px" :rules="[{validator: validateTemplate, message:'模板输入有误', trigger: 'change'}]">
          <el-input v-model.trim="templateText" type="textarea" rows="4" class="selectWidth" placeholder="通知模板" show-word-limit maxlength="120" />
          <div class="label">{{ remark }}</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import messagePanel from './components/messagePanel'
import { getList, updateContent } from '@/api/messageConfig'

export default {
  name: 'MessageConfigList',
  components: {
    messagePanel
  },
  data() {
    /**
     ** sceneType 场景类型：1 登录，2 授信，3 放款，4 贷后
     * */
    return {
      sceneType: '',
      dialogVisible: false,
      activeName: '1',
      tableData: [],
      templateText: '',
      originalText: '',
      remark: ''
    }
  },
  created() {
    this.getTableData(1)
  },
  methods: {
    validateTemplate(rule, value, callback) {
      const originalPattern = this.remark.match(/\{(.*?)\}/g)
      const params = [] // 获取返回参数
      originalPattern && originalPattern.length && originalPattern.some(item => {
        params.push(item.replace(/\{|\}/g, ''))
      })

      const pattern = this.templateText.match(/\{(.*?)\}/g)
      if (pattern) {
        if (pattern.length && pattern.every(item => {
          if (params.includes(item.replace(/\{|\}/g, ''))) {
            return true
          }
        })) {
          return callback()
        } else {
          return callback(new Error('模板输入有误'))
        }
      } else {
        return callback()
      }
    },
    async getTableData(sceneType) {
      const res = await getList({
        sceneType: sceneType
      })
      if (res.code === '0') {
        this.tableData = res.data
        console.log({ res })
      } else {
        this.$message.warning(res.msg)
      }
    },
    handleTab(el) {
      this.sceneType = +el.index + 1
      this.getTableData(+el.index + 1)
    },
    handleDialog(rowData) {
      this.dialogVisible = !this.dialogVisible
      this.msgNo = rowData.msgNo
      this.originalText = rowData.msgContent
      this.templateText = rowData.msgContent
      this.remark = rowData.remark
    },
    handleSubmit() {
      this.$refs['updateTemplate'].validate(async(valid) => {
        if (valid) {
          if (this.templateText) {
            const res = await updateContent({
              msgNo: this.msgNo,
              content: this.templateText
            })
            if (res.code === '0') {
              await this.getTableData(this.sceneType || 1)
              this.$message.success(res.msg || '修改成功')
              this.dialogVisible = false
              console.log({ res })
            } else {
              this.$message.warning(res.msg)
            }
          } else {
            this.$message.warning('模板内容不能为空')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep {
    .dialogStyle {
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .el-alert {
      height: 48px;
      line-height: 48px;
      .el-alert__title {
        color: #3E495B;
        img {
          display: inline-block;
          vertical-align: text-bottom;
        }
      }
    }
    .el-tabs__header.is-top {
      margin: 0;
    }
  }
  .label {
    color: #aaa;
  }
}
</style>
