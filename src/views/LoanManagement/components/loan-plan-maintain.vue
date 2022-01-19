<template>
  <div class="container">
    <el-form
      ref="loanForm"
      :model="loanForm"
      :rules="rules"
      :validate-on-rule-change="true"
      label-width="135px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="还款账户名称" prop="collAcctName">
            <el-input v-model="loanForm.collAcctName" placeholder="请输入还款账户名称" clearable maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="还款账户账号" prop="collAcctNo">
            <el-input v-model="loanForm.collAcctNo" type="tel" placeholder="请输入还款账户账号" clearable maxlength="28" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="还款账户开户行" prop="selectedCustAcctBank">
            <el-cascader
              ref="cascaderData"
              key="id"
              v-model="selectedCustAcctBank"
              :props="props"
              clearable
              :show-all-levels="false"
              style="width: 100%;"
              filterable
              placeholder="请选择还款账户开户行"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item class="inline-form-item" label="还款指引" prop="guide">
            <el-input v-model="loanForm.guide" type="textarea" rows="3" placeholder="录入" maxlength="200" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="" prop="">
            <el-upload
              class="upload-demo mt24"
              action="/api/file/v1/biz-files/upload"
              :on-change="handleChangeUpload"
              :on-preview="handlePreview"
              :file-list="fileList"
              :headers="{ Authorization: 'Bearer ' + token }"
              :data="{
                fileTypeCode: 'RepaymentGuide',
                objectId: loanId,
                objectType: 'Project'
              }"
              :before-remove="handleFileRemove"
              list-type="picture"
              accept=".jpg,.png,.pdf"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传 .pdf .png .jpg格式文件</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="plan-wrapper">
      <el-upload
        ref="elUpload"
        v-preventReClick
        :action="'/api/business/loanapply/maintain/uploadRepaymentPlan/' + loanId"
        style="display: inline-block;margin-right: 10px;"
        :auto-upload="true"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :show-file-list="false"
        :headers="{ Authorization: 'Bearer ' + token }"
        accept=".xlsx,.xls"
      >
        <el-button type="primary">上传还款计划表</el-button>
      </el-upload>
      <downLoad :download-url="'/business/loanapply/maintain/downloadRepaymentTemplate'" :file-name="'还款计划表'" :method-type="'get'" :btn-name="'下载模板'" />
      <el-table
        :data="loanForm.repaymentPlanList"
        stripe
        style="width: 50%;margin-top: 20px;"
        :header-row-style="{background:'#eee'}"
      >
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="periodNum" label="期数" />
        <el-table-column prop="repaymentAmount" label="本期应还款金额（元）" />
        <el-table-column prop="repaymentDate" label="本期应还款日期" />
      </el-table>
    </div>
    <footer>
      <el-button type="primary" @click="submit">确定</el-button>
      <el-button @click="cancle">取消</el-button>
    </footer>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getBankBranch, getBankCity, getBankList, getBankProvince } from '@/api/CreditMgt/maintain'
import { addRepaymentGuide, getRepaymentGuide, getFileMapList, deleteFile } from '@/api/loan'
import { accountMoney, validzzs, validateCollAcctName, validateCollAcctNo } from '@/utils/validate'
export default {
  name: '',
  components: {
    downLoad: (resolve) => require(['@/views/components/template-xls'], resolve)
  },
  props: {
    loanId: {
      type: Number,
      default: null
    }
  },
  // 定义属性
  data() {
    return {
      loanForm: {
        customerName: '',
        fundName: '',
        productName: '',
        lendingAmount: '',
        lendingDate: '',
        loanRate: '',
        accountAmount: '',
        deadline: '',
        repaymentMethod: '',
        dateDue: '',
        approvalState: '',
        replyDate: null,
        comment: '',
        guide: '',
        id: '',
        repaymentPlanList: [],
        collAcctNo: '',
        collBank: '',
        collBankNo: '', //	收款账户开户行Code
        collAcctName: '',
        custAcctBank: ''
      },
      selectedCustAcctBank: [],
      token: getToken(),
      props: {
        lazy: true,
        value: 'value',
        label: 'label',
        lazyLoad(node, resolve) {
          const { level } = node
          switch (level) {
            case 0:
              getBankList().then(response => {
                resolve(response.data)
              })
              break
            case 1:
              this.bankName = node.label
              getBankProvince({ bankName: node.label }).then(response => {
                resolve(response.data)
              })
              break
            case 2:
              this.province = node.label
              getBankCity({
                bankName: this.bankName,
                province: node.label
              }).then(response => {
                if (
                  node.label === '北京市' ||
                  node.label === '上海市' ||
                  node.label === '重庆市' ||
                  node.label === '天津市'
                ) {
                  response.data = [{ label: '市辖区', value: '市辖区' }]
                  resolve(response.data)
                } else {
                  resolve(response.data)
                }
              })
              break
            case 3:
              getBankBranch({
                bankName: this.bankName,
                province: node.parent.label,
                city: node.label === '市辖区' ? this.province : node.label
              }).then(response => {
                let res = []
                const obj = {}
                let newData = []
                newData = response.data && response.data.reduce((cur, next) => {
                  // obj[next.value] ? '' : obj[next.value] = true && cur.push(next)
                  if (!obj[next.value]) {
                    obj[next.value] = true
                    cur = [...cur, next]
                  }
                  return cur
                }, [])
                res = newData.map(item => ({
                  ...item,
                  leaf: true
                }))
                resolve(res)
              })
              break
          }
        }
      },
      fileList: [],
      rules: {
        replyDate: [
          {
            required: true,
            message: '请选择用款申请批复日期',
            trigger: 'change'
          }
        ],
        approvalState: [
          { required: true, message: '请选择批复结果', trigger: 'change' }
        ],
        lendingAmount: [
          { required: true, message: '请输入放款金额', trigger: 'blur' },
          { validator: accountMoney }
        ],
        lendingDate: [
          { required: true, message: '请选择放款日期', trigger: 'change' }
        ],
        loanRate: [{ required: true, message: '请输入利率', trigger: 'blur' }, { validator: accountMoney }],
        repaymentMethod: [
          { required: true, message: '请输入还款方式', trigger: 'blur' }
        ],
        deadline: [
          { required: true, message: '请输入期限', trigger: 'change' },
          { validator: validzzs }
        ],
        collAcctName: [
          { validator: validateCollAcctName, trigger: 'change' }
        ],
        collAcctNo: [
          { validator: validateCollAcctNo, trigger: 'change' }
        ],
        /* dateDue: [
          { required: true, message: '请选择到期日', trigger: 'change' }
        ], */
        comment: [
          { required: false, message: '请输入用款批复意见', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  watch: {},
  created() {
    this.getRepaymentGuide()
    this.getPdf()
  },
  mounted() {
  },
  methods: {
    handleChange(val) {
      // 获取级联开户行
      this.loanForm.custAcctBank = this.$refs.cascaderData.getCheckedNodes().length ? this.$refs.cascaderData.getCheckedNodes()[0].pathLabels.slice(-1)[0] : null
      this.loanForm.collBankNo = [...this.selectedCustAcctBank].pop()
    },
    handlePreview(data) {
      console.log(data)
      window.open(data.url)
    },
    handleChangeUpload(data) {
      if (data.response) data.id = data.response.data.id
      setTimeout(() => {
        const imgLength = document.querySelectorAll('.el-upload-list__item-thumbnail').length
        document.querySelectorAll('.el-upload-list__item-thumbnail').forEach(item => {
          console.log(item)
          if (data.name.includes('.pdf')) {
            document.querySelectorAll('.el-upload-list__item-thumbnail')[imgLength - 1].src = require('@/assets/pdf.svg')
          }
        })
      }, 500)
    },
    async handleFileRemove(file, fileList) {
      console.log(file, 'deleteFile')
      const res = await deleteFile(file.id)
      if (res.code === '0') {
        console.log({ res })
      } else {
        this.$message.warning(res.msg)
      }
    },
    async getRepaymentGuide() {
      const res = await getRepaymentGuide(this.loanId)
      if (res.code === '0' && res.data) {
        this.loanForm.custAcctBank = res.data.collBank
        this.loanForm.collAcctName = res.data.collAcctName
        this.loanForm.collBankNo = res.data.collBankNo
        this.loanForm.guide = res.data.guide
        this.loanForm.collAcctNo = res.data.collAcctNo
        this.loanForm.repaymentPlanList = res.data.repaymentPlanList || []
        // 由于一下直辖市和区同名所以特殊处理所以同步修改为市辖区
        if (res.data.pcrStr) {
          const province = ['北京市', '上海市', '重庆市', '天津市']
          const pcrStr = res.data.pcrStr && res.data.pcrStr.split(',')
          if (province.includes(pcrStr[2])) pcrStr[2] = '市辖区'
          this.selectedCustAcctBank = pcrStr
        }
        // console.log({ res })
      } else {
        res.msg && this.$message.warning(res.msg)
      }
    },
    async getPdf() {
      const res = await getFileMapList({
        fileTypeCode: 'RepaymentGuide',
        objectId: this.loanId,
        objectType: 'Project'
      })
      let fileList = []
      if (res.code === '0') {
        if (res.data && res.data.RepaymentGuide) {
          this.fileList = res.data.RepaymentGuide.filter(item => {
            if (item.fileName.includes('.jpg') || item.fileName.includes('.png') || item.fileName.includes('.pdf')) {
              fileList = [...fileList, {
                name: item.originalFileName,
                url: item.fileUrl,
                fileType: item.fileType,
                id: item.id
              }]
            }
          })
        }
        this.fileList = fileList
        // 缩略图修改
        setTimeout(() => {
          document.querySelectorAll('.el-upload-list__item-thumbnail').forEach(item => {
            // console.log(item)
            if (item.src.includes('.pdf')) {
              item.src = require('@/assets/pdf.svg')
            }
          })
        }, 500)
        console.log({ res }, fileList)
      } else {
        this.$message.warning(res.msg)
      }
    },
    // 文件上传成功
    uploadSuccess(response, file, fileList) {
      if (response.code === '0') {
        this.$message.success({
          title: '成功',
          message: '上传成功'
        })
        this.loanForm.repaymentPlanList.splice(0, this.loanForm.repaymentPlanList.length, ...response.data)
      } else {
        this.$message.warning(response.msg)
      }
    },
    // 文件上传失败
    uploadError() {
      this.$message.error({
        title: '失败',
        message: '上传失败'
      })
    },
    async submit() {
      const res = await addRepaymentGuide({
        collAcctName: this.loanForm.collAcctName,
        collBank: this.loanForm.custAcctBank,
        guide: this.loanForm.guide,
        collAcctNo: this.loanForm.collAcctNo,
        collBankNo: this.loanForm.collBankNo,
        loanApplyId: this.loanId,
        repaymentPlanList: this.loanForm.repaymentPlanList
      })
      if (res.code === '0') {
        this.$message.success('维护成功！')
        this.$router.push('/LoanManagement/loan-maintenance-list')
        this.$store.dispatch('tagsView/delVisitedView', this.$route)
      } else {
        this.$message.warning(res.msg)
      }
    },
    cancle() {
      this.$router.push('/LoanManagement/loan-maintenance-list')
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20px;
  background-color: #fff;
}
.plan-wrapper {
  padding-left: 20px;
}
.el-upload-list__item-thumbnail {
    background: red;
    &:after {
      content: ' ';
      display: block;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('../../../assets/pdf.svg');
      background-size: 100% 100%;
    }
  }
  ::v-deep {
    .el-upload-list--picture .el-upload-list__item {
        height: 70px;
        line-height: 48px;
    }
    .el-upload-list--picture .el-upload-list__item-thumbnail {
      height: 50px;
      width: 50px;
    }
  }
  footer {
    padding: 20px;
  }
</style>
