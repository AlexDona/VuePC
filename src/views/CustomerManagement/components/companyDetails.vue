<template>
  <!-- 企业详情 -->
  <div class="app-container">
    <!-- 新增 -->
    <div class="formBox">
      <el-form ref="rulesForm" label-position="right" :model="listQuery">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户编号" label-width="150px" prop="custNo">
              <el-input v-model.trim="listQuery.custNo" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="custType === 2" :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属公司" label-width="150px" prop="personalCustName">
              <el-input v-model.trim="listQuery.personalCustName" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" label-width="150px" prop="custName">
              <el-input v-model.trim="listQuery.custName" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="基本类型" label-width="150px" prop="custType">
              <el-input v-model.trim="listQuery.custType" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户性质" label-width="150px" prop="custTypeId">
              <el-input v-model.trim="listQuery.custTypeId" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" label-width="150px" prop="businessCode">
              <el-input v-model.trim="listQuery.businessCode" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号码" label-width="150px" prop="contactsPersonIdtNo">
              <el-input v-model.trim="listQuery.contactsPersonIdtNo" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人姓名" label-width="150px" prop="contactsPersonName">
              <el-input v-model.trim="listQuery.contactsPersonName" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人手机号码" label-width="150px" prop="contactsPersonMobile">
              <el-input v-model.trim="listQuery.contactsPersonMobile" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人邮箱" label-width="150px" prop="contactsPersonEmail">
              <el-input v-model.trim="listQuery.contactsPersonEmail" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="建档状态" label-width="150px" prop="custStatus">
              <el-input
                v-model.trim="listQuery.custStatus"
                :disabled="true"
                class="selectWidth"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="建档时间" label-width="150px" prop="buildTime">
              <el-input v-model.trim="listQuery.buildTime" :disabled="true" class="selectWidth" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="listQuery.parentCusts && listQuery.parentCusts.length">
          <el-row v-for="(item, index) in listQuery.parentCusts" :key="index + 'parentCusts'">
            <!-- 资金方端查看不展示资金方名称 -->
            <el-row v-if="userInfo.custTypeId !== 4" :gutter="20">
              <el-col :span="12">
                <el-form-item label="一级产业公司" label-width="150px" prop="parentCustName">
                  <el-input v-model.trim="item.parentCustName" :disabled="true" class="selectWidth" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="起始合作时间" label-width="150px" prop="cooperationTime">
                  <el-input v-model.trim="item.cooperationTime" :disabled="true" class="selectWidth" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="起始合作时长(月)" label-width="150px" prop="cooperationMonthNum">
                  <el-input v-model.trim="item.cooperationMonthNum" :disabled="true" class="selectWidth" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
        </template>
        <el-row>
          <el-button class="btnStyle" plain @click="cancel()">关闭</el-button>
        </el-row>
      </el-form>
      <!-- <quota-fund-form :listQuery="listQuery" /> -->
    </div>
  </div>
</template>

<script>
import { queryById } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'

export default {
  name: '',
  props: {
    id: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      listQuery: {},
      userInfo: getUserInfo()
    }
  },
  computed: {
    custType() {
      return +this.$route.query.custType
    }
  },
  created() {
    queryById({
      customerId: this.id
    }).then(res => {
      this.listQuery = res.data || {}
      // 处理数据
      this.listQuery.custStatus = this.listQuery.custStatus === 1 ? '已建档' : this.listQuery.custStatus === 0 ? '未建档' : ''
      this.listQuery.custType = this.listQuery.custType === 1 ? '企业客户' : this.listQuery.custType === 2 ? '个体客户' : ''
      // 后端接口无法获取产业公司 只能列表页过回来
      this.listQuery.parentCustName = this.$route.query.parentCustName
      this.listQuery.custTypeId = this.formatter(this.listQuery.custTypeId)
    })
  },
  methods: {
    formatter(val) {
      switch (val) {
        case 1: return '平台'
        case 2: return '核心企业'
        case 3: return '产业公司'
        case 4: return '资金方'
        case 5: return '经销商'
        case 6: return '零售商'
        case 7: return '种植户'
      }
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.line {
  width: 800px;
  border-bottom: 1px solid #000;
}
.selectWidth {
  width: 400px;
}
.selectOptions {
  display: flex;
  width: 530px;
  .text {
    display: inline-block;
    padding: 0 15px;
    line-height: 36px;
    font-size: 14px;
    color: #606266;
  }
}

.textareaStyle {
  height: 120px;
}
.selectWidthmini,
.inputmini {
  width: 178px;
}
.title,
.el-icon-arrow-left {
  margin: 20px 0;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
</style>
