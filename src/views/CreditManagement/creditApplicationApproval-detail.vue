<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="申请详情" name="1">
        <div class="formBox">
          <el-card class="formBox-left">
            <el-form ref="resetForm" :model="params" class="container" label-width="180px">

              <el-collapse v-model="activeNames">

                <el-collapse-item title="授信申请详情" name="1">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item prop="productName" label="授信申请编号" :disabled="true">
                        <el-input v-model.trim="detail.creditNo" placeholder="" :disabled="true" clearable />
                      </el-form-item>

                      <el-form-item prop="productName" label="授信申请日期" :disabled="true">
                        <el-input v-model.trim="detail.applyDate" placeholder="" :disabled="true" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="审批详情" name="2">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户名称" prop="collAcctName">
                        <el-input v-model.trim="detail.collAcctName" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户开户行" prop="collBank">
                        <el-input v-model.trim="detail.collBank" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款账户账号" prop="collAcctNo">
                        <el-input v-model.trim="detail.collAcctNo" :disabled="true" class="selectWidth" clearable />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item v-for="item in fieldJsonArr" :key="item.value" :label="item.label">
                        <el-input v-model.trim="item.value" placeholder="" :disabled="true" clearable />
                      </el-form-item>
                      <template v-if="(userInfo.custTypeId === 6 || userInfo.custTypeId === 3 || userInfo.custTypeId === 4) && detail.adviceCreditLimitAmt">
                        <el-form-item label="建议授信额度(元)" prop="adviceCreditLimitAmt">
                          <el-input v-model.trim="detail.adviceCreditLimitAmt" disabled placeholder="" clearable />
                        </el-form-item>
                      </template>
                      <!-- <el-form-item label="客户评分">
                    <el-input v-model.trim="detail.custScore" min="0" max="12" placeholder="" :disabled="true" clearable @input="mouthChange" />
                  </el-form-item> -->
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </el-card>
          <el-card class="formBox-right">
            <widget-image title="授信申请影像" :filetype-list="fileTypeList" :file-list.sync="fileList" opr-type="preview" :params="urlParams" :credit-no="creditNo" />
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="审批轨迹" name="2">
        <el-table
          border
          :data="detail.comments"
          style="width: 100%"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column prop="taskNode" label="审批节点" width="180" />
          <el-table-column
            prop="receiverName"
            label="审批人"
          />
          <el-table-column
            prop="comment"
            label="审批意见"
          >
            <template slot-scope="scope">
              <span class="preLine">{{ scope.row.comment }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="approvalTime"
            label="审批时间"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-row class="m-t-30">
      <el-button type="plain" @click="closeTabBar()">关闭</el-button>
    </el-row>
    <!--      <div class="pd20 tc">-->
    <!--        <el-button type="primary" @click="submitFrom()">提交</el-button>-->
    <!--        <el-button type="plain" @click="resetForm">重置</el-button>-->
    <!--      </div>-->

  </div>

</template>

<script>
import { getEntityDetail, postEntity } from '@/api/CreditMgt/maintain.js'
import { Message } from 'element-ui'
import moment from 'moment'
import { getUserInfo } from '@/utils/auth'
import WidgetImage from '@/views/components/widget-image'

export default {
  name: 'FinancialList',
  components: { WidgetImage },
  data() {
    return {
      approveStateMap: {
        pass: '通过',
        end: '拒绝',
        reject: '补充资料'
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      activeName: '1',
      urlParams: {
        objectId: this.$route.query.creditNo
      },
      fileList: [],
      fileTypeList: [{
        idx: '0',
        name: '授信申请影像'
      }],
      userInfo: getUserInfo(),
      approveResultArr: [
        { label: '通过', value: 1 },
        { label: '拒绝', value: 2 },
        { label: '补充材料', value: 3 }
      ],
      activeNames: ['1', '2'],
      params: {},
      creditNo: '',
      detail: {},
      fieldJsonArr: []
    }
  },
  created() {
    this.creditNo = this.$route.query.creditNo
    this.initEntities({ creditNo: this.creditNo })
  },
  methods: {
    handleClick() {},
    mouthChange(val) {
      const { approveDate } = this.params
      if (approveDate) {
        const Milliseconds = moment(approveDate).valueOf() + val * 30 * 24 * 60 * 60 * 1000
        this.params.expireDate = moment(Milliseconds).format('YYYY-MM-DD')
        // debugger
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    submitFrom() {
      const params = {
        ...this.params,
        creditNo: this.creditNo,
        approveDate: moment(this.params.approveDate).format('YYYY-MM-DD')
      }
      postEntity(params).then(res => {
        Message({ type: 'success', message: res.msg })
        this.$router.push('/CreditManagement/creditMaintain')
      })
    },
    handleSelectionChange(val) {
      this.productIdList = val.map(item => item.id)
    },
    initEntities(params) {
      getEntityDetail(params).then(res => {
        this.detail = res.data || {}
        const fieldJson = JSON.parse(res.data.fieldJson)
        Object.keys(fieldJson).forEach(key => {
          this.fieldJsonArr.push({
            label: key,
            value: fieldJson[key]
          })
        })
        console.log(this.fieldJsonArr)
      })
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.initEntities({ creditNo: this.creditNo })
    },
    // 关闭窗口并返回
    closeTabBar() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.formBox{
    display: flex;
    justify-content: space-between;
    .formBox-left {
      width: 75%;
      ::v-deep {
        .el-collapse-item__header {
          font-size: 16px;
          padding-left: 32px;
          background: #F5F7F9;
          margin-bottom: 20px;
        }
        .el-textarea__inner {
        min-height: 100px !important;
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
        }
     }
   }
   .formBox-right {
      width: 24%;
  }
  ::v-deep.el-card__body {
      padding: 0;
  }
}
</style>
