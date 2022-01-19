<template>
  <div class="main">
    <!-- 新增客户 -->
    <!-- 建档审批详情 -->
    <template v-if="pageMode === 'add'">
      <div class="container">
        <el-card class="left-content">
          <!-- 注册建档 -->
          <header>
            <span>{{ titleMap[pageMode] }}</span>
          </header>
          <customerForm ref="customerForm" :page-mode="pageMode" @customerData="submitFrom" @cancel="cancel" />
          <footer>
            <el-button plain @click="cancel()">
              <span>{{ pageMode !== 'preview' ? '取消' : '关闭' }}</span>
            </el-button>
            <template v-if="pageMode !== 'preview'">
              <el-button type="primary" @click="btnCustomer('save')">暂存</el-button>
              <el-button type="primary" @click="btnCustomer('submit')">确认</el-button>
            </template>
          </footer>
        </el-card>
        <el-card class="right-content">
          <newWidgetImage
            :file-list-data="fileListData"
            object-type="Customer"
            :filetype-list="filetypeList"
            :upload-type="uploadType"
            :title="'企业影像'"
            :file-list-ids.sync="fileListIds"
          />
        </el-card>
      </div>
    </template>
    <template v-else>
      <el-tabs v-model="activeName">
        <el-tab-pane label="建档详情" name="0">
          <div class="buildDetail">
            <el-card class="left-content">
              <header>
                <span>{{ titleMap[pageMode] }}</span>
              </header>
              <customerForm ref="customerForm" :page-mode="pageMode" @customerData="submitFrom" @cancel="cancel" />
              <!-- 建档审批 -->
              <template v-if="flag === 'approve'">
                <header>
                  <span>建档审批</span>
                </header>
                <customerVerificate ref="customerVerificate" :cust-id="custId" :page-mode="pageMode" :flag="flag" />
              </template>
              <footer>
                <el-button plain @click="cancel()">
                  <span>{{ pageMode !== 'preview' ? '取消' : '关闭' }}</span>
                </el-button>
                <template v-if="pageMode !== 'preview'">
                  <template v-if="flag === 'approve'">
                    <el-button type="primary" @click="btnCustomer('pass')">通过</el-button>
                    <el-button type="danger" class="btnStyle" @click="btnCustomer('back')">退回</el-button>
                    <el-button type="danger" class="btnStyle" @click="btnCustomer('reject')">拒绝</el-button>
                  </template>
                  <template v-else>
                    <el-button type="primary" @click="btnCustomer('save')">暂存</el-button>
                    <el-button type="primary" @click="btnCustomer('submit')">确认</el-button>
                  </template>
                </template>
              </footer>
            </el-card>
            <el-card class="right-content">
              <newWidgetImage
                :file-list-data="fileListData"
                object-type="Customer"
                :filetype-list="filetypeList"
                :upload-type="uploadType"
                :title="'企业影像'"
                :file-list-ids.sync="fileListIds"
              />
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="修改详情" name="1">
          <div class="table">
            <updateDetail :table-data="updateTableData" />
            <footer>
              <el-button plain @click="cancel()">
                <span>关闭</span>
              </el-button>
            </footer>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批轨迹" name="2">
          <div class="table">
            <workflow :table-data="workFlowTableData" />
            <footer>
              <el-button plain @click="cancel()">
                <span>关闭</span>
              </el-button>
            </footer>
          </div>
        </el-tab-pane>
      </el-tabs>

    </template>

  </div>
</template>

<script>
import { addCustSaveOrSubmit, getCustomerFileList, getCustomerUpdateFileList, actionRecord, getConfigChangeRecord } from '@/api/customer'
export default {
  name: '',
  components: {
    // 客户表单
    customerForm: (resolve) => require(['./components/customer-form'], resolve),
    // 审批轨迹
    workflow: (resolve) => require(['./components/approve-workflow-table'], resolve),
    // 修改详情
    updateDetail: (resolve) => require(['./components/approve-detail-table'], resolve),
    // 审批核查
    customerVerificate: (resolve) => require(['./components/customer-verificate'], resolve),
    // 影像文件
    newWidgetImage: (resolve) => require(['@/views/components/new-widget-image'], resolve)
  },
  // 定义属性
  data() {
    return {
      activeName: '0',
      pageMode: '',
      titleMap: {
        add: '新增',
        preview: '查看',
        maintain: '维护',
        dealt: '建档申请详情'
      },
      filetypeList: [
        { code: 'yyzz', name: '营业执照' },
        { code: 'fddbrsfz', name: '法定代表人身份证' },
        { code: 'jbrsfz', name: '经办人身份证' },
        { code: 'auth_agreement', name: '授权书' }
      ],
      uploadType: '',
      fileListIds: {}, // 影像件id
      fileListData: {
        yyzz: [],
        fddbrsfz: [],
        jbrsfz: [],
        auth_agreement: []
      },
      workFlowTableData: [], // 审批轨迹
      updateTableData: [], // 修改详情数据
      custId: '',
      flag: ''
    }
  },
  computed: {
  },
  watch: {
    activeName: function(val) {
      if (val === '1') {
        this.getConfigChangeRecord()
      } else if (val === '2') {
        this.getActionRecord()
      }
    }
  },
  created() {
    this.pageMode = this.$route.query.pageMode || ''
    this.custId = this.$route.query.custId || ''
    this.flag = this.$route.query.flag || ''
    // 如果是经销商客户审批不需要展示企业授权书
    // if (this.pageMode === 'dealt') this.filetypeList.splice(this.filetypeList.length - 1, 1)
    // 查看页和客户审批处理页只有查看影像件的权限
    this.uploadType = this.pageMode === 'preview' || this.flag === 'approve' ? 'r' : 'w'
    // 获取文件数据
    this.getCustomerFileList()
  },
  mounted() {
  },
  methods: {
    // 暂存、提交
    submitFrom(data, mode) {
      if (this.pageMode !== 'preview' && mode === 'submit') {
        // 文件必传校验
        if (document.querySelector('.yyzz') && +document.querySelector('.yyzz').innerText.replaceAll(/\[|]/g, '') === 0) {
          this.$message.warning('请先上传营业执照')
          return
        } else if (document.querySelector('.fddbrsfz') && +document.querySelector('.fddbrsfz').innerText.replaceAll(/\[|]/g, '') === 0) {
          this.$message.warning('请先上传法定代表人身份证')
          return
        } else if (document.querySelector('.jbrsfz') && this.pageMode !== 'maintain' && +document.querySelector('.jbrsfz').innerText.replaceAll(/\[|]/g, '') === 0) {
          this.$message.warning('请先上传经办人身份证')
          return
        } else if (document.querySelector('.auth_agreement') && this.pageMode !== 'maintain' && +document.querySelector('.auth_agreement').innerText.replaceAll(/\[|]/g, '') === 0) {
          this.$message.warning('请先上传企业授权书')
          return
        }
      }
      // 提交为2  新增/建档 0 维护 1
      mode === 'submit'
        ? data.postMethod = 2 : this.pageMode === 'maintain'
          ? data.postMethod = 1 : data.postMethod = 0
      // 暂存后返回id,需要传给后端
      if (this.custId) data.custId = this.custId
      // 合并上传的影像件参数
      data = Object.assign(data, this.fileListIds)
      addCustSaveOrSubmit(data).then(res => {
        if (res.code === '0') {
          if (mode === 'submit') this.cancel()
          if (res.data) this.custId = res.data
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 获取审批轨迹
    async getActionRecord() {
      const res = await actionRecord(this.custId)
      this.workFlowTableData = res.data || []
    },
    // 获取文件数据
    getCustomerFileList() {
      const flag = Number(this.$route.query.custStatus) === 3
      if (flag) {
        getCustomerUpdateFileList({
          customerId: this.custId,
          objectType: 'Customer',
          showTemporary: flag,
          viewType: this.pageMode === 'preview' ? 1 : 2
        }).then(res => {
          if (res.code === '0') {
            this.filetypeList.map(item => {
              // this.$set(this.fileListData[item.code], item.code, res.data[item.code])
              res.data.map((items) => {
                if (item.code === items.fileTypeCode) {
                  this.fileListData[item.code].push(items)
                }
              })
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err.response.data.msg)
        })
      } else {
        getCustomerFileList({
          objectId: this.custId,
          objectType: 'Customer',
          showTemporary: flag,
          viewType: this.pageMode === 'preview' ? 1 : 2
        }).then(res => {
          if (res.code === '0') {
            this.filetypeList.map(item => {
              // this.$set(this.fileListData[item.code], item.code, res.data[item.code])
              this.fileListData[item.code] = res.data[item.code] || []
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err.response.data.msg)
        })
      }
    },
    // 获取修改数据
    getConfigChangeRecord() {
      const params = {
        businessId: this.custId, // 业务id
        businessType: 'customer_bookbuilding_config' // customer_bookbuilding_config 修改记录参数
      }
      getConfigChangeRecord(params).then(res => {
        if (res.code === '0') {
          this.updateTableData = res.data || []
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(erorr => {
        this.$message.error(erorr.response.data.msg)
      })
    },
    // button
    btnCustomer(mode) {
      // 触发子组件方法
      this.pageMode === 'dealt' ? this.$refs.customerVerificate.btnCustomer(mode)
        : this.$refs.customerForm.btnCustomer(mode)
    },
    // 返回
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      if (this.flag === 'approve') {
        this.$router.push('/CustomerManagement/customerApprove')
        // 返回审批页
      } else if (this.flag === 'customerList') {
        this.$router.push('/CustomerManagement/customer-list')
      } else {
        // 返回维护页
        this.$router.push('/CustomerManagement/customerMaintenance')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tabs {
    margin: 0 22px;
  }
  .el-tabs__nav-scroll {
    padding-left: 20px;
  }
  .el-tabs__header {
    background: #fff;
    margin-bottom: 0;
  }
  .el-card__body {
    padding: 0;
  }
}
.container {
  padding: 20px 20px 0px 20px;
  display: flex;
  min-height: 900px;
  justify-content: space-between;
  ::v-deep .el-card__body {
      padding: 0;
    }
  }
.buildDetail {
  display: flex;
  min-height: 900px;
  justify-content: space-between;
}
.left-content {
  min-width: 900px;
  width: 74%;
}
.right-content {
  width: 25%;
}
header {
  height: 48px;
  line-height: 48px;
  background-color: #f5f7f9;
  padding-bottom: 10px;
  padding-left: 24px;
  margin-bottom: 20px;
}
footer {
  // margin-left: -20px;
  // position: fixed;
  // bottom: 0;
  // z-index: 20;
  height: 80px;
  line-height: 80px;
  // width: calc(99%);
  // transform: translateX(20px);
  // left: 76px;
  // right: 38px;
  background-color: #fff;
  // padding-left: 20px;
  // box-shadow: 0px -2px 23px 2px rgba(135, 150, 176, 0.2);
.el-button {
  width: 100px;
  margin-left: 32px;
}
.btnStyle{
  border-color: #BF2020;
  background-color: #BF2020;
 }
}
.table {
  min-height: calc(100vh - 160px);
  background-color: #fff;
}
</style>
