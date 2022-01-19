<template>
  <div class="customerForm">
    <el-form ref="rulesForm" label-position="right" label-width="170px" :disabled="pageMode === 'preview'|| pageMode === 'dealt'" :rules="rulesForm" :model="listQuery">
      <template v-if="pageMode !== 'add'">
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="客户编号" prop="custNo">
              <el-input v-model.trim="listQuery.custNo" disabled class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="客户类型" prop="custTypeId">
            <el-select v-model="listQuery.custTypeId" filterable :disabled="pageMode !== 'add'" style="width:100%" clearable placeholder="请选择客户类型">
              <el-option
                v-for="item in customerTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!--  <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="基本类型" prop="custType">
            <el-input v-model.trim="listQuery.custType" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row> -->
      <template v-if="pageMode !== 'preview' && pageMode !== 'dealt'">
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="客户名称/统一社会信用代码" class="businessCodeStyle" prop="keyword">
              <el-input v-model.trim="listQuery.keyword" maxlength="50" placeholder="请输入客户名称" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item>
              <el-button type="primary" :disabled="!listQuery.keyword" @click="getCustomerVerificate">核验</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="客户名称" prop="custName">
            <el-input v-model.trim="listQuery.custName" disabled placeholder="请输入客户名称" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="统一社会信用代码" prop="businessCode">
            <el-input v-model.trim="listQuery.businessCode" disabled maxlength="18" placeholder="请输入统一社会信用代码" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="企业类型" prop="entType">
            <el-input v-model.trim="listQuery.entType" disabled placeholder="请输入企业类型" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="企业曾用名" prop="originalName">
            <el-input v-model.trim="listQuery.originalName" disabled placeholder="请输入企业曾用名" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="营业期限" prop="termStartAndEnd">
            <el-input v-model.trim="listQuery.termStartAndEnd" disabled placeholder="请输入营业期限" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <address-list
            label="企业注册地址"
            :is-disabled="true"
            :province.sync="listQuery.province"
            :city.sync="listQuery.city"
            :region.sync="listQuery.area"
            :addr.sync="listQuery.address"
          />
          <address-list
            label="企业通讯地址"
            :is-input-disabled="true"
            :province.sync="listQuery.postalProvince"
            :city.sync="listQuery.postalCity"
            :region.sync="listQuery.postalArea"
            :addr.sync="listQuery.postalAddress"
          />
        </el-col>
      </el-row>
      <!-- 只有产业公司才有上级公司 -->
      <template v-if="listQuery.custTypeId === 3">
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="上级公司" prop="parentCustomerId">
              <el-select v-model="listQuery.parentCustomerId" style="width:100%" filterable clearable placeholder="请选择" @change="changeParentCompany(listQuery.parentCustomerId,parentCompanyList,'parentCustomerName')">
                <el-option
                  v-for="(items) in parentCompanyList"
                  :key="items.custId"
                  :label="items.custName"
                  :value="items.custId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 选了上级公司才展示核心企业 -->
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="核心企业" prop="coreCustomerId">
              <el-select v-model="listQuery.coreCustomerId" style="width:100%" filterable clearable placeholder="请选择" @change="changeParentCompany(listQuery.coreCustomerId,coreCompanyList,'coreCustomerName')">
                <el-option
                  v-for="(item) in coreCompanyList"
                  :key="item.custId"
                  :label="item.custName"
                  :value="item.custId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="法定代表人/经营者姓名" prop="corporateName" class="businessCodeStyle">
            <el-input v-model.trim="listQuery.corporateName" maxlength="32" placeholder="请输入法定代表人/经营者姓名" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="法定代表人/经营者身份证号码" prop="corporatePersonIdtNo" class="businessCodeStyle">
            <el-input v-model.trim="listQuery.corporatePersonIdtNo" maxlength="18" placeholder="请输入法定代表人/经营者身份证号码" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="法定代表人/经营者手机号码" prop="corporatePersonMobile" class="businessCodeStyle">
            <el-input v-model.trim="listQuery.corporatePersonMobile" maxlength="11" placeholder="请输入法定代表人/经营者手机号码" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="经办人姓名" prop="contactsPersonName">
            <el-input v-model.trim="listQuery.contactsPersonName" maxlength="32" placeholder="请输入经办人姓名" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="经办人身份证号码" prop="contactsPersonIdtNo">
            <el-input v-model.trim="listQuery.contactsPersonIdtNo" maxlength="18" placeholder="请输入经办人身份证号码" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="经办人手机号码" prop="contactsPersonMobile">
            <el-input v-model.trim="listQuery.contactsPersonMobile" maxlength="11" placeholder="请输入经办人手机号码" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18" :offset="2">
          <el-form-item label="经办人邮箱" prop="contactsPersonEmail">
            <el-input v-model.trim="listQuery.contactsPersonEmail" placeholder="请输入经办人邮箱" class="selectWidth" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 经销商才展示 -->
      <template v-if="listQuery.custTypeId === 5 && (pageMode !== 'add')">
        <div
          v-for="(item, index) in listQuery.originCustomerInfoDTOList"
          :key="'originCustomer'+ index"
        >
          <el-row :gutter="20">
            <el-col :span="18" :offset="2">
              <el-form-item
                label="所属公司"
                :prop="'originCustomerInfoDTOList.'+ index + '.originCustomerId'"
                :rules="{
                  required: true, message: '请选择所属公司', trigger: 'change'
                }"
              >
                <el-select
                  v-model="listQuery.originCustomerInfoDTOList[index].originCustomerId"
                  style="width:100%"
                  clearable
                  :disabled="pageMode === 'preview'"
                  placeholder="请选择"
                  @change="changeOriginCustomer(listQuery.originCustomerInfoDTOList[index].originCustomerId,index,'originCustomerName')"
                >
                  <el-option
                    v-for="items in originCompanyList"
                    :key="items.custId"
                    :label="items.custName"
                    :value="items.custId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="18" :offset="2">
              <el-form-item
                label="起始合作时间"
                :prop="'originCustomerInfoDTOList.'+ index + '.cooperationTime'"
                :rules="{
                  required: true, message: '请选择起始合作日期', trigger: 'change'
                }"
              >
                <el-date-picker
                  v-model="listQuery.originCustomerInfoDTOList[index].cooperationTime"
                  style="width: 100%"
                  type="date"
                  :disabled="pageMode === 'preview'"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  :unlink-panels="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </template>
      <!-- 维护页新增开户行字段 -->
      <template v-if="(pageMode=== 'maintain' || pageMode === 'preview') && flagStatus !== 'approve'">
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="收款账户名称" prop="accountName">
              <el-input v-model.trim="listQuery.accountName" :disabled="true" class="selectWidth" maxlength="20" placeholder="收款账户名称" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="收款账户开户行" prop="bankName">
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
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18" :offset="2">
            <el-form-item label="收款账户账号" prop="bankAccount">
              <el-input
                v-model.trim="listQuery.bankAccount"
                class="selectWidth"
                maxlength="20"
                placeholder="收款账户账号"
                clearable
                @input="listQuery.bankAccount =
                  String(listQuery.bankAccount)
                    .replace(/[^\d\.-]/g, '')
                    .replace(/\./g, '')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script>
import { getListByCustList, getCustomerFromQcc, getByCustomerId, maintainByCustomerId, getParentCustomer, queryListByCustId } from '@/api/customer'
import {
  // businessCode,
  tellPhone,
  validIdcard,
  validBusinessCodeCustName,
  validEmailNew } from '@/utils/validate'
import { getBankList, getBankProvince, getBankCity, getBankBranch } from '@/api/CreditMgt/maintain'
export default {
  name: '',
  components: {
    addressList: (resolve) => require(['@/views/components/AddressList'], resolve)
  },
  props: {
    // 表单模式
    pageMode: {
      type: String,
      default: ''
    }
  },
  // 定义属性
  data() {
    return {
      listQuery: {
        businessCode: '', //	统一社会信用代码
        contactsPersonEmail: '', //	经办人邮箱
        contactsPersonIdtNo: '', //	经办人证件号码
        contactsPersonMobile: '', //	经办人手机号
        contactsPersonName: '', //	经办人姓名
        corporateName: '', //	法定代表人姓名
        corporatePersonIdtNo: null, //	法人代表身份证号码
        corporatePersonMobile: null, //	法人代表手机号码
        custName: '', //	客户名称
        keyword: '', //	客户名称/统一社会信用代码
        custTypeId: '', //	资金方、产业公司、核心企业、第三方
        entType: '', //	企业类型
        parentCustomerId: '', //	上级公司
        parentCustomerName: '', //	产业公司名称
        coreCustomerId: '', //	核心企业
        coreCustomerName: '', //	核心企业名称
        originCustomerId: '', //	所属公司id		false
        originCustomerName: '', //	所属公司name
        originalName: '', //	企业曾用名
        postMethod: '', //	请求方式： 0 平台新增建档暂存 1 暂存，2 提交
        postalAddress: '', //	企业通讯地址-详细地址
        postalArea: '', //	企业通讯地址-区
        postalCity: '', //	企业通讯地址-市
        postalProvince: '', //	企业通讯地址-省
        address: '', //	企业注册地址-详细地址
        area: '', //	企业注册地址-区
        city: '', //	企业注册地址-市
        province: '', //	企业注册地址-省
        termStartAndEnd: '', //	营业期限
        bankAccount: '', //	收款账户账号
        bankName: '', //	收款账户开户行
        bankCode: '', //	收款账户开户行Code
        accountName: '', //	收款账户名称
        originCustomerInfoDTOList: []
      },
      selectedCustAcctBank: '',
      customerTypeList: [], // 客户类型
      rulesForm: {
        // 校验规则
        custTypeId: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
        // custName: [{ required: true, message: '请输入客户名称', trigger: 'change' }],
        keyword: [
          { required: false, message: '请输入客户名称或统一社会信用代码', trigger: 'change' },
          { validator: validBusinessCodeCustName, trigger: 'change' }
        ],
        corporateName: [{ required: true, message: '请输入法定代表人/经营者姓名', trigger: 'blur' }],
        contactsPersonName: [{ required: true, message: '请输入经办人姓名', trigger: 'change' }],
        // coreCustomerId: [{ required: true, message: '请选择核心企业', trigger: 'change' }],
        // businessCode: [{ required: false, validator: businessCode, trigger: 'change' }],
        corporatePersonIdtNo: [
          { required: true, message: '请输入法定代表人/经营者身份证号码', trigger: 'blur' },
          { required: true, validator: validIdcard, trigger: 'change' }
        ],
        contactsPersonIdtNo: [
          { required: true, message: '请输入经办人身份证号码', trigger: 'change' },
          { required: true, validator: validIdcard, trigger: 'change' }
        ],
        contactsPersonEmail: [{ required: false, validator: validEmailNew, trigger: 'change' }],
        corporatePersonMobile: [
          { required: true, message: '请输入法定代表人/经营者手机号码', trigger: 'change' },
          { required: true, validator: tellPhone, trigger: 'change' }
        ],
        contactsPersonMobile: [
          { required: true, message: '请输入经办人手机号码', trigger: 'change' },
          { required: true, validator: tellPhone, trigger: 'change' }
        ]
      },
      custId: '',
      bankName: '',
      flagStatus: '',
      custBaseType: '', // 基本类型
      parentCompanyList: [], // 上级公司
      originCompanyList: [], // 所属公司
      coreCompanyList: [], // 核心企业
      isVerificationAgain: 0, // 是否二次核验确认
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
  computed: {
    /*  isVerification() {
      // 客户名称和统一社会信用代码任意填写一个可以核验
      let flag = !this.listQuery.custName && !this.listQuery.businessCode
      // 如果填写了统一社会信用代码必须通过检验才能点击核验
      if (this.listQuery.businessCode.length > 0) {
        flag = !/^[0-9A-Z]{18}$/.test(this.listQuery.businessCode)
      }
      return flag
    } */
  },
  watch: {
    'listQuery.custTypeId': function() {
      if (this.listQuery.custTypeId === 3) {
        this.queryListByCustId()
      }
    }
  },
  mounted() {

  },
  async created() {
    this.custId = this.$route.query.custId || ''
    this.flagStatus = this.$route.query.flag || ''
    this.custBaseType = Number(this.$route.query.custBaseType) || ''
    // 获取客户类型
    this.getListByCustList()
    // 获取上级公司下拉
    this.getParentCustomer()
    // 根据客户id查看数据
    if (this.pageMode !== 'add') await this.getByCustomerId()
  },
  methods: {
    // 获取客户类型
    getListByCustList() {
      // const params = { custName: this.listQuery.custName }
      getListByCustList().then(res => {
        if (res.code === '0') {
          if (this.pageMode === 'add' || this.pageMode === 'build') {
            // 建档和新增不需要经销商
            this.customerTypeList = res.data.filter(item => {
              return item.id !== 5
            })
          } else {
            this.customerTypeList = res.data || []
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    // 获取上级公司下拉、所属公司
    getParentCustomer() {
      const params = {
        coreCustomerId: this.listQuery.coreCustomerId
      }
      getParentCustomer(params).then(res => {
        if (res.code === '0') {
          this.parentCompanyList = res.data || []
          // 客户维护或建档的时候如果是产业公司、需要去除当前公司
          // ps：只有产业公司才展示上级公司  所以这里没做该逻辑处理
          if (this.pageMode === 'maintain' || this.pageMode === 'build') this.parentCompanyList = this.parentCompanyList.filter(item => item.custId !== this.listQuery.id)
          this.originCompanyList = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    // 处理所属公司数据
    changeOriginCustomer(id, index, key) {
      this.originCompanyList.map(item => {
        if (item.custId === id) {
          this.listQuery.originCustomerInfoDTOList[index][key] = item.custName
        }
      })
    },
    // 根据上级公司获取核心企业
    queryListByCustId() {
      const params = { custId: this.listQuery.parentCustomerId }
      queryListByCustId(params).then(res => {
        if (res.code === '0') {
          this.coreCompanyList = res.data || []
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    handleChange(val) {
      // this.province
      // console.log(this.$refs.cascaderData.getCheckedNodes()[0].pathLabels, 'this.$refs.myCascader.getCheckedNodes()[0].pathLabels')
      this.listQuery.bankName = this.$refs.cascaderData.getCheckedNodes().length ? this.$refs.cascaderData.getCheckedNodes()[0].pathLabels.slice(-1)[0] : null
      this.listQuery.bankCode = [...this.selectedCustAcctBank].pop()
    },
    changeParentCompany(id, list, key) {
      list.map(item => {
        if (item.custId === id) {
          this.listQuery[key] = item.custName
        }
      })
      // 如果是上级公司需要动态获取对应的核心企业
      if (key === 'parentCustomerName') {
        this.listQuery.coreCustomerId = ''
        this.listQuery.coreCustomerName = ''
        this.coreCompanyList = []
        this.queryListByCustId()
      }
    },
    // 核验
    getCustomerVerificate() {
      // 触发统一社会信用代码校验
      // this.$refs['rulesForm'].validateField('businessCode')
      /*  if (!this.listQuery.custName && !this.listQuery.businessCode) return this.$message.warning('客户名称或统一社会信用代码二者任意填一个')
      const params = {
        businessCode: this.listQuery.businessCode,
        custName: this.listQuery.custName,
        searchAgain: this.isVerificationAgain
      } */

      const params = {
        keyword: this.listQuery.keyword,
        searchAgain: this.isVerificationAgain
      }
      getCustomerFromQcc(params).then(res => {
        if (res.code === '0') {
          this.isVerificationAgain = 0
          this.listQuery = Object.assign(this.listQuery, res.data)
        } else if (res.code === '30001') {
          res.msg && this.$confirm(res.msg, '提示', {
            distinguishCancelAndClose: true, // 区分是点“否”关闭---cancel / 还是点右上的 X 或者是Esc  ---close
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.isVerificationAgain = 1
            this.getCustomerVerificate()
          }).catch((action) => {
            if (action === 'cancel') {
              this.isVerificationAgain = 2
              this.getCustomerVerificate()
            }
          })
          // 清空数据
          // this.listQuery = Object.assign
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 根据客户id查看客户信息
    async getByCustomerId() {
      const res = this.flagStatus === 'approve' ? await getByCustomerId(
        { customerId: this.custId, showTemporary: Number(this.$route.query.custStatus) === 3 }
      ) : await maintainByCustomerId({ custId: this.custId }, this.pageMode)
      if (res.code === '0') {
        this.listQuery = res.data || {}
        // 由于一下直辖市和区同名所以特殊处理所以同步修改为市辖区
        if (res.data.pcrStr) {
          const province = ['北京市', '上海市', '重庆市', '天津市']
          const pcrStr = res.data.pcrStr && res.data.pcrStr.split(',')
          if (province.includes(pcrStr[2])) pcrStr[2] = '市辖区'
          this.selectedCustAcctBank = pcrStr
        }
        if (this.flagStatus === 'approve') {
          // 特殊处理所属公司
          this.listQuery.originCustomerInfoDTOList = res.data.parentCusts
          const address = {
            province: res.data.customerItemDTO.province || '',
            city: res.data.customerItemDTO.city || '',
            area: res.data.customerItemDTO.area || '',
            address: res.data.customerItemDTO.address || '',
            postalProvince: res.data.customerItemDTO.postalProvince || '',
            postalCity: res.data.customerItemDTO.postalCity || '',
            postalArea: res.data.customerItemDTO.postalArea || '',
            postalAddress: res.data.customerItemDTO.postalAddress || ''
          }
          this.listQuery = Object.assign(this.listQuery, address)
          // 特殊处理经办人和法定人信息
          if (this.custBaseType === 3) {
            // 如果是个体户，法定代表人和经营者取经办人信息，同时清空经办人信息
            this.listQuery.contactsPersonName = ''
            this.listQuery.contactsPersonIdtNo = ''
            this.listQuery.contactsPersonMobile = ''
          }
        }
        if (this.listQuery.custTypeId === 5 && this.pageMode === 'add' && this.listQuery.originCustomerInfoDTOList.length === 0) {
          // 新增的时候如果经销商数据为空的时候需要添加一个默认数据供客户选择
          this.listQuery.originCustomerInfoDTOList.push(
            {
              cooperationTime: '',
              id: null,
              originCustomerId: '',
              originCustomerName: ''
            }
          )
        }
        // 收款账户名称（如果反显值为空要客户名称）
        this.listQuery.accountName ? true : this.listQuery.accountName = this.listQuery.custName
        /* this.$nextTick(() => {
            if (this.$refs.cascaderData) {
              this.$refs.cascaderData.inputValue = this.listQuery.bankName
            }
          }) */
      } else {
        this.$message.error(res.msg)
      }
    },
    // 确认按钮，父组件触发
    btnCustomer(mode) {
      let flag = true
      if (mode === 'submit') {
        this.$refs['rulesForm'].validate(valid => {
          flag = valid
        })
      } else if (mode === 'save') {
        // 如果点击了提交，校验不过再点击保存(不需要校验)需要清除校验
        this.$refs['rulesForm'].clearValidate()
      }
      if (flag) this.$emit('customerData', this.listQuery, mode)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .businessCodeStyle {
      .el-form-item__label {
        line-height: 20px;
      }
      // margin-bottom: 0;
  }
}
</style>
