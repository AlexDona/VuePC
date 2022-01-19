<template>
  <el-dialog title="账号维护" :close-on-click-modal="false" :visible.sync="visible" width="1000px" :before-close="closeDialog">
    <el-form ref="submitForm" :model="params" label-width="130px">
      <el-row>
        <el-col>
          <el-form-item label="收款账户名称" prop="custAcctName" :rules="required">
            <el-input v-model.trim="params.custAcctName" class="selectWidth" maxlength="20" placeholder="收款账户名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row v-if="params.custAcctBank">-->
      <!--        <el-col>-->
      <!--          <el-form-item label="收款账户开户行" prop="custAcctBank">-->
      <!--            <el-input-->
      <!--              ref="custAcctBankInput"-->
      <!--              v-model.trim="params.custAcctBank"-->
      <!--              disabled-->
      <!--              class="selectWidth"-->
      <!--              placeholder=""-->
      <!--              maxlength="30"-->
      <!--              clearable-->
      <!--            />-->
      <!--          </el-form-item>-->
      <!--        </el-col>-->
      <!--      </el-row>-->
      <el-row>
        <el-col>
          <el-form-item label="收款账户开户行" prop="custAcctBank" :rules="required">
            <el-cascader
              ref="cascaderData"
              key="id"
              v-model.trim="selectedCustAcctBank"
              :props="props"
              clearable
              :show-all-levels="false"
              style="width: 100%;"
              filterable
              placeholder="请选择收款账户开户行"
              @change="handleChange"
            />
          </el-form-item>
          <!--          <el-form-item label="收款账户开户行" prop="custAcctBank" :rules="required">-->
          <!--            <el-input-->
          <!--              v-model.trim="params.custAcctBank"-->
          <!--              class="selectWidth"-->
          <!--              placeholder="收款账户开户行"-->
          <!--              maxlength="30"-->
          <!--              clearable-->
          <!--            />-->
          <!--          </el-form-item>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="收款账户账号" prop="custAcctNo" :rules="required">
            <el-input
              v-model.trim="params.custAcctNo"
              class="selectWidth"
              maxlength="30"
              placeholder="收款账户账号"
              clearable
              @input="params.custAcctNo =
                String(params.custAcctNo)
                  .replace(/[^\d\.-]/g, '')
                  .replace(/\./g, '')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog('cancel')">取 消</el-button>
      <el-button type="primary" @click="submitFrom">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { postAccountMaintain, getBankList, getBankProvince, getBankCity, getBankBranch } from '@/api/CreditMgt/maintain'
import service from '@/utils/service'

export default {
  name: 'FinancialList',
  // props: ['visible', 'selectRow'],
  props: {
    selectRow: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedCustAcctBank: '',
      required: { required: true, message: '请输入', trigger: 'change' },
      params: {
        creditNo: '', // 授信编号
        custAcctBank: null
      },
      detail: {},
      productIdList: [],
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
      }
    }
  },
  created() {
    const newCollAcctName = this.selectRow.collAcctName
    this.params = {
      creditNo: this.selectRow.creditNo,
      custAcctName: newCollAcctName,
      custAcctBank: this.selectRow.collBank,
      custAcctNo: this.selectRow.collAcctNo,
      collBankCode: this.selectRow.collBankCode
    }
    this.selectedCustAcctBank = [this.selectRow.collBank]
    this.initEntities(this.params)
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.cascaderData) {
        this.$refs.cascaderData.inputValue = this.params.custAcctBank
      }
    })
  },
  methods: {
    handleChange(val) {
      // this.province
      // console.log(this.$refs.cascaderData.getCheckedNodes()[0].pathLabels, 'this.$refs.myCascader.getCheckedNodes()[0].pathLabels')
      this.params.custAcctBank = this.$refs.cascaderData.getCheckedNodes().length ? this.$refs.cascaderData.getCheckedNodes()[0].pathLabels.slice(-1)[0] : null
      this.params.collBankCode = [...this.selectedCustAcctBank].pop()
    },
    closeDialog(data) {
      this.$emit('closeDialog', data)
    },
    submitFrom() {
      const params = {
        ...this.params
      }
      this.$refs['submitForm'].validate((valid) => {
        if (valid) {
          postAccountMaintain(params).then(res => {
            service.handleResponse(res, this.closeDialog('sucess'), '已更新')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.productIdList = val.map(item => item.id)
    },
    initEntities() {
      this.detail = {}
    },
    // 重置
    resetForm() {
      this.$refs['resetForm'].resetFields()
      this.initEntities(this.params)
    }
  }
}
</script>

<style scoped>
.showBox{max-height: 600px; overflow: auto}
</style>
