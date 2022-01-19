<template>
  <!-- 列表配置 - 新增，修改，查看 -->
  <div class="app-container">
    <el-tabs v-model="activeName" :before-leave="handleClick">
      <el-tab-pane label="基本信息" name="1">
        <el-form ref="el-form" :rules="rules" :model="listQuery" label-position="right" style="width:40%;">
          <el-form-item prop="coreId" label="核心企业" label-width="100px">
            <el-select v-model="listQuery.coreId" :disabled="pageType !== 'add'" clearable placeholder="请选择核心企业" @change="changeCore">
              <el-option
                v-for="item in customerCores"
                :key="item.custId"
                :label="item.custName"
                :value="item.custId"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="confType" label="是否按产品配置" label-width="135px">
            <el-radio-group v-model="listQuery.confType">
              <el-radio :disabled="pageType === 'preview'" :label="1">是</el-radio>
              <el-radio :disabled="pageType === 'preview'" :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="listQuery.confType === 1" prop="productId" label="产品名称" label-width="100px">
            <template v-if="pageType !== 'add'">
              <el-select v-model="listQuery.productName" :disabled="pageType !== 'add'" clearable placeholder="请选择产品名称">
                <el-option
                  v-for="item in products"
                  :key="item.productId"
                  :label="item.productName"
                  :value="item.productId"
                />
              </el-select>
            </template>
            <template v-else>
              <el-select v-model="listQuery.productId" :disabled="pageType !== 'add'" clearable placeholder="请选择产品名称">
                <el-option
                  v-for="item in products"
                  :key="item.productId"
                  :label="item.productName"
                  :value="item.productId"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item prop="operate" label="操作端" label-width="100px">
            <el-select v-model="listQuery.operate" multiple :disabled="pageType !== 'add'" clearable placeholder="请选择操作端">
              <el-option
                v-for="item in orgTypelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="templateTableId" label="列表模板" label-width="100px">
            <el-select v-model="listQuery.templateTableId" :disabled="pageType !== 'add'" clearable placeholder="请选择列表模板" @change="changeTemplate">
              <el-option
                v-for="item in templateList"
                :key="item.templateId"
                :label="item.templateName"
                :value="item.templateId"
              />
            </el-select>
          </el-form-item>
          <!-- 返显模板列表名称，可以修改； -->
          <el-form-item prop="confTableName" label="列表名称" label-width="100px">
            <el-input v-model.trim="listQuery.confTableName" :disabled="pageType === 'preview'" maxlength="10" style="width:200px" placeholder="请填写列表名称" clearable />
          </el-form-item>
          <!-- 如果选择的模板列表中，有excel导入的字段，则联动展示该选项；如果都是接口对接的，则不需要展示该选项； -->
          <el-form-item prop="isExcelIn" label="是否excel数据导入" label-width="160px">
            <el-radio-group v-model="listQuery.isExcelIn">
              <el-radio :disabled="pageType === 'preview'" :label="1">是</el-radio>
              <el-radio :disabled="pageType === 'preview'" :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 选择了是excel导入才有导入方选择 -->
          <el-form-item v-if="listQuery.isExcelIn === 1" prop="excelIn" label="excel导入方" label-width="120px">
            <el-checkbox-group v-if="drfList.length" v-model="listQuery.excelIn">
              <template v-for="item in drfList">
                <el-checkbox :key="item.id" :disabled="pageType === 'preview'" :label="item.id">{{ item.name }}</el-checkbox>
              </template>
            </el-checkbox-group>
            <template v-else><span style="color:red;">请先选择操作端</span></template>
          </el-form-item>
          <el-form-item v-if="curOperate && listQuery.confType === 1" prop="isRelationOrder" label="是否为经营贷的关联表" label-width="182px">
            <el-radio-group v-model="listQuery.isRelationOrder">
              <el-radio :disabled="pageType === 'preview'" :label="1">是</el-radio>
              <el-radio :disabled="pageType === 'preview'" :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="" @click="cancel()">{{ pageType !== 'preview' ? '取消' : '返回' }}</el-button>
            <el-button v-if="pageType === 'add'" type="primary" @click="next()">下一步</el-button>
            <el-button v-if="pageType === 'revise'" type="primary" @click="sureTab()">确定</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="列表表头" name="2">
        <el-table
          ref="table"
          :data="listData"
          stripe
          style="width: 100%;"
          :max-height="curHeight"
          :header-cell-style="{
            background: '#F2F5FF',
            color: '#333',
            'text-align': 'center',
          }"
        >
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column label="模板" prop="fieldName" width="250px;" />
          <el-table-column label="是否展示" prop="isView" width="140px;">
            <template slot-scope="{ row }">
              <el-switch v-model="row.isView" :active-value="1" :inactive-value="0" :disabled="row.canRevise" />
            </template>
          </el-table-column>
          <el-table-column label="列表表头" prop="fieldChViewName" width="140px;">
            <template slot-scope="{ row }">
              <el-input v-if="!row.canRevise" v-model="row.fieldChViewName" />
              <span v-else>{{ row.fieldChViewName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="表头次序" prop="priority" width="140px;">
            <template slot-scope="{ row }">
              <el-input v-if="!row.canRevise" v-model="row.priority" maxlength="3" />
              <span v-else>{{ row.priority }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="140px;">
            <template slot-scope="{ row }">
              <el-button v-if="row.canRevise" :disabled="pageType === 'preview' || row.disabled" type="text" @click="confirm(row)">修改</el-button>
              <template v-else>
                <el-button type="text" @click="confirm(row, 'cancel')">取消</el-button>
                <el-button type="text" @click="confirm(row, 'save')">保存</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;">
          <el-button type="" @click="cancel()">{{ pageType === 'add' ? '取消' : '返回' }}</el-button>
          <el-button v-if="pageType === 'add'" type="primary" @click="activeName = '1'">上一步</el-button>
          <el-button v-if="pageType === 'add'" v-preventReClick type="primary" @click="submit()">确定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :limit.sync="pageParam.pageSize"
      :page.sync="pageParam.pageIndex"
      @pagination="getlistData"
    /> -->
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import { curHeight } from '@/mixins/requestCurHeight'
import { getCustomerCores, orgTypelist, templateList, getProducts } from '@/api/dict'
import { selectListDetail, saveConfSubmit, getTableConfInfo, updateFieldConf, updateConfSubmit } from '@/api/config'

export default {
  // components: {
  //   Pagination
  // },
  mixins: [curHeight],
  data() {
    return {
      activeName: '1',
      total: 0,
      pageParam: {
        asc: true,
        orderBy: '',
        pageIndex: 1,
        pageSize: 15
      },
      listData: [],
      listQuery: {
        isExcelIn: 0,
        isRelationOrder: 0,
        confTableName: '',
        productId: '',
        confType: 1, // 配置类型(1-按产品配置,0-按核企配置)
        operate: [],
        excelIn: [] // 导入方
      },
      customerCores: [],
      products: [],
      orgTypelist: [],
      templateList: [],
      rules: {
        coreId: [{ required: true, message: '请选择核心企业', trigger: 'change' }],
        productId: [{ required: true, message: '请选择产品名称', trigger: 'change' }],
        operate: [{ required: true, message: '请选择操作端', trigger: 'change' }],
        excelIn: [{ type: 'array', required: true, message: '请至少选择一个导入方', trigger: 'change' }],
        templateTableId: [{ required: true, message: '请选择列表模板', trigger: 'change' }],
        confTableName: [{ required: true, message: '请填写列表名称', trigger: 'blur' }]
      },
      pageType: '', // revise 修改，preview 查看，‘’ 新增
      curRowData: null, // 记录当前被点击修改的数据，当用户点击取消的时候替换掉输入的修改值
      lastTemplateTableId: '',
      drfList: []
    }
  },
  computed: {
    curOperate() {
      // 当前选择的操作端，如果包含经商商才展示 '是否为订单带的关联表' 选项
      let curOperateVal = false
      const vm = this
      const temporary = []
      vm.orgTypelist.forEach(res => {
        if (vm.listQuery && vm.listQuery.operate.indexOf(res.id) !== -1) {
          temporary.push(res)
          if (res.name === '经销商') {
            curOperateVal = true
          }
        }
      })
      vm.drfList.splice(0, vm.drfList.length, ...temporary) // 存被选的操作段，用于excel导入方的数据源
      return curOperateVal
    }
  },
  created() {
    // 新增，修改，查看同一个页面
    const { type, id } = this.$route.query
    this.pageType = type
    // 修改及查看-查询数据
    if (type !== 'add') {
      getTableConfInfo({
        tableConfId: id
      }).then(res => {
        const listArr = res.data && res.data.fields
        // 字段不统一的进行二次赋值
        listArr.length && listArr.map(res => {
          res.fieldName = res.fieldChName
          res.canRevise = true
          res.fieldNo = res.id // 新增配置的时候，列表接口查到的数据没有ID，用这个fieldNo做唯一值的，修改的时候也赋值一个Id给他
          return res
        })
        this.listData.splice(0, this.listData.length, ...listArr)
        // 单选框如果拿接口的值直接赋值，反显后无法切换
        const isExcelIn = res.data.excelIn.split('|').length ? 1 : 0
        res.data.isExcelIn = isExcelIn
        this.listQuery = res.data
        this.listQuery.coreId = res.data.coreId + '' // 核心企业的反显值配合修改
        // this.listQuery.isExcelIn = isExcelIn
        this.listQuery.excelIn = res.data.excelIn.split('|').map(Number) || []
        this.listQuery.operate = res.data.operate.split('|').map(Number) || []
        delete this.listQuery.fields
      })
    }
    // 获取核心企业列表
    getCustomerCores().then(res => {
      this.customerCores = res.data
    })
    // 机构类型（下拉类表）操作端
    orgTypelist().then(res => {
      this.orgTypelist = res.data
    })
    // 模板表类表（下拉列表）
    templateList().then(res => {
      this.templateList = res.data
    })
  },
  methods: {
    confirm(data, type) {
      if (type === 'save' && data.isView && !data.fieldChViewName) {
        // 如果是保存，需要作校验
        this.$message.warning('列表表头必填')
        return false
      } else if ((!data.priority || !(/^[1-9]\d*$/.test(data.priority))) && type === 'save' && data.isView) {
        this.$message.warning('表头次序不能为空且只能为正整数')
        return false
      }
      if (this.pageType === 'revise' && type === 'save') {
        // 修改的时候单条提交
        /*  params:
              fieldChViewName	字段配置展示中文名		false
              fieldId	字段配置id		false
              isView	字段是否展示（0-否，1-是）		false
              priority	优先级
        */
        updateFieldConf({
          fieldChViewName: data.fieldChViewName,
          fieldId: data.id,
          isView: data.isView ? 1 : 0,
          priority: data.priority
        }).then(res => {
          if (res.code === '0') {
            this.changeStatus(data)
            this.$message.success('修改成功')
          } else {
            this.$message.warning(res.msg)
          }
        })
      } else {
        // 点击修改的时候把状态翻转下；列表没有返回id，用的fieldNo做唯一值判断
        // 前端翻转列表的状态方法
        this.changeStatus(data, type)
      }
    },
    changeStatus(data, type) {
      const vm = this
      const listArr = [].concat(this.listData)
      const curArr = listArr.length > 0 && listArr.map(res => {
        if (res.fieldNo === data.fieldNo) {
          if (type === 'cancel') {
            // 点击取消的时候再用点击修改记住的数据覆盖掉用户修改的数据
            res = !res.canRevise ? JSON.parse(JSON.stringify(vm.curRowData)) : res
          } else {
            // 点击修改的时候先记住当前的行数据
            vm.curRowData = !res.canRevise ? vm.curRowData : Object.assign({}, res)
            res.canRevise = !res.canRevise
          }
        } else {
          res.disabled = !res.disabled
        }
        return res
      })
      this.listData.splice(0, this.listData.length, ...curArr)
    },
    changeCore(data) {
      // 模板表类表（下拉列表）
      getProducts({
        coreId: data
      }).then(res => {
        if (this.products !== res.data) {
          this.listQuery.productId = ''
        }
        this.products = res.data
      })
    },
    changeTemplate(data) {
      this.templateList.length && this.templateList.forEach(res => {
        if (res.templateId === data) {
          this.listQuery.confTableName = res.templateName
        }
      })
    },
    cancel() {
      this.$router.go(-1)
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
    },
    handleClick(activeName) {
      const vm = this
      // 切换tab的钩子，切换之前会触发
      let canToggle = false
      // 查看的时候不进行必填检验
      if (activeName === '2' && vm.pageType !== 'preview') {
        this.$refs['el-form'].validate((valid) => {
          if (valid) {
            canToggle = true
            // 只有新增的时候才查列表表头
            vm.pageType === 'add' && vm.lastTemplateTableId !== vm.listQuery.templateTableId && vm.selectListDetailFunc()
          } else {
            // 点击下一步已经把activeName设置为'2'了,如果不还原,再次点击下一步不会再触发此钩子
            this.activeName = '1'
            canToggle = false
            return false
          }
        })
      } else {
        canToggle = true
      }
      return canToggle
    },
    next() {
      this.activeName = '2'
    },
    selectListDetailFunc() {
      // 记住当前的列表模板ID,用于在下一步返回来之后判断列表ID是否有修改，如果没有修改则不再请求列表表头数据
      this.lastTemplateTableId = this.listQuery.templateTableId
      // 查询配置的字段列表
      selectListDetail({
        configurationId: this.listQuery.templateTableId
      }).then(res => {
        // 预设置接口没返回的字段
        res.data && res.data.length > 0 && res.data.map(res => {
          res.isView = false // 是否展示
          res.canRevise = true // 是否可以修改
          res.priority = '' // 排序
          res.fieldChViewName = res.fieldName // 后端接口列表返回跟提交字段不统一的，重置值
          return res
        })
        this.listData.splice(0, this.listData.length, ...res.data)
      })
    },
    submit() {
      const submitParams = this.listQuery
      const newListParams = JSON.parse(JSON.stringify(this.listData))
      // 新增一次性提交，只需要4个值
      submitParams.fieldParams = newListParams.map(res => {
        return {
          id: res.id,
          priority: res.priority,
          fieldChViewName: res.fieldChViewName,
          isView: res.isView ? 1 : 0
        }
      })
      saveConfSubmit(submitParams).then(res => {
        if (res.code === '0') {
          this.$message.success('新增成功')
          this.$router.go(-1)
          this.$store.dispatch('tagsView/delVisitedView', this.$route)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    sureTab() {
      // 修改基本配置信息
      /*  params:
            confId	配置表ID（更新时传必传，不传则认为时保存）		false
            confTableName	配置展示表名		false
            isExcelIn	是否为excel导入（0-不导入或维护，1-下载维护字段，2-execl导入）		false
            isRelationOrder	是否为订单贷关联表(0-否，1-是)
      */
      updateConfSubmit({
        confId: this.listQuery.id,
        confTableName: this.listQuery.confTableName,
        isExcelIn: this.listQuery.isExcelIn,
        isRelationOrder: this.listQuery.isRelationOrder,
        operate: this.listQuery.operate,
        excelIn: this.listQuery.excelIn
      }).then(res => {
        if (res.code === '0') {
          this.activeName = '2'
          this.$message.success('修改成功')
        } else {
          this.$message.warning(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
