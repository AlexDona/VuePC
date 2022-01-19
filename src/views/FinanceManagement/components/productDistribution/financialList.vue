<template>
  <el-dialog title="已选中的金融产品" :close-on-click-modal="false" :visible.sync="visible" width="1000px" :before-close="closeDialog" class="proDialog">
    <p class="cancel-tips">取消选择，则客户无法对该金融产品进行授信申请</p>
    <div class="showBox">
      <el-table
        :ref="'multipleTable'"
        row-key="id"
        :data="entities"
        style="width: 100%"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column
          prop="productCode"
          label="产品编号"
          width="180"
        />
        <el-table-column
          prop="fundName"
          label="资金方名称"
          width="180"
        />
        <el-table-column
          prop="productName"
          label="金融产品名称"
          width="180"
        />
        <el-table-column prop="maxLoanLimit" label="额度区间（元）" width="180">
          <template slot-scope="{ row }">
            <span v-format="'#,##0.00'">{{ row.minLoanLimit }}</span>
            <span>-</span>
            <span v-format="'#,##0.00'">{{ row.maxLoanLimit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="maxLoanRate" label="利率区间（%/年）" width="180">
          <template slot-scope="scope">
            {{ scope.row.minLoanRate }} - {{ scope.row.maxLoanRate }}
          </template>
        </el-table-column>
        <el-table-column prop="maxLoanTime" label="期限区间（月）" width="180">
          <template slot-scope="scope">
            {{ scope.row.minLoanTime }} - {{ scope.row.maxLoanTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="repaymentMethod"
          label="还款方式"
          width="180"
        />
      </el-table>
      <!--  1  -->
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <!--      <el-button type="primary" :disabled="productIdList.length === 0" @click="submitFrom">确 定</el-button>-->
    </span>
  </el-dialog>
</template>

<script>
import { postBindProduct, postOtherBindProduct } from '@/api/FinanceMgt/productDistribution'
// import { Message } from 'element-ui'
import { Message } from 'element-ui'

export default {
  name: 'FinancialList',
  // props: ['visible', 'query', 'entities', 'notCustomerParams'],
  props: {
    query: {
      type: Object,
      default: () => {}
    },
    notCustomerParams: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    },
    entities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      reloadParams: {
        fundName: '', // 金融名称
        pageParams: { pageSize: 9999 }
      },
      productIdList: []
    }
  },
  methods: {
    openDialog() {
      this.$nextTick(() => {
        this.entities.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item, true)
        })
      })
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    submitFrom() {
      const params = {
        assignParamList: [],
        productIdList: this.productIdList,
        coreCustId: this.query.coreCustId
      }
      if (params.productIdList.length === 0) {
        Message.info('请选择该客户可申请授信的金融产品')
        return false
      }
      const { isBatch, allocationMethod, dealerCustomerId, industrialCustomerId } = this.$route.query
      const customerList = JSON.parse(sessionStorage.getItem('customerList'))
      if (isBatch) {
        if (allocationMethod === '1') { // 客户维度
          params.assignParamList = customerList.map(item => {
            return {
              dealerCustomerId: item.dealerCustomerId,
              industrialCustomerId: item.industrialCustomerId
            }
          })
          postBindProduct(params).then(res => {
            this.closeWarning(res)
            /*  service.handleResponse(res, () => {
              this.closeDialog()
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
              this.$router.go(-1)
            }, '分配成功') */
          })
        } else { // 非客户维度
          const newParams = {
            productIdList: this.productIdList,
            ...this.notCustomerParams,
            coreCustId: this.query.coreCustId
          }
          postOtherBindProduct(newParams).then(res => {
            this.closeWarning(res)
            /*  service.handleResponse(res, () => {
              this.closeDialog()
              this.$store.dispatch('tagsView/delVisitedView', this.$route)
              this.$router.go(-1)
            }, '分配成功') */
          })
        }
      } else {
        params.assignParamList = [{ dealerCustomerId, industrialCustomerId }]
        postBindProduct(params).then(res => {
          this.closeWarning(res)
          /*  service.handleResponse(res, () => {
            this.closeDialog()
            this.$store.dispatch('tagsView/delVisitedView', this.$route)
            this.$router.go(-1)
          }, '分配成功') */
        })
      }
      console.log('params', params)
    },
    // 关闭提示
    closeWarning(res) {
      if (res.code === '0') {
        this.closeDialog()
        this.$message.success('分配成功')
        this.$store.dispatch('tagsView/delVisitedView', this.$route)
        this.$router.go(-1)
      } else {
        this.$confirm(res.msg, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {})
      }
    },
    // 选中弹窗列表中-点击-取消
    handleSelectionChange(val, row) {
      // this.productIdList = val.map(item => item.id)
      this.$emit('selectItemChange', row)
    },
    // 选中全部取消
    handleSelectAll(val) {
      this.entities.forEach((item) => {
        this.$emit('selectItemChange', item)
      })
    }

  }
}
</script>

<style scoped>
.cancel-tips{
  margin-top: -20px;
}
  .showBox{max-height: 600px; overflow: auto}
</style>

