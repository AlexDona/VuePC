<template>
  <div class="app-container">
    <el-form v-if="pageType !== 'check'" ref="resetForm" :model="listQuery" label-width="80px">
      <el-row :gutter="24">
        <el-col :sm="8" :xs="8">
          <el-form-item label="流程类型" prop="flowType">
            <el-select v-model="listQuery.flowType" style="width:100%" clearable placeholder="流程类型">
              <el-option
                v-for="item in flowTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="8" :xs="8">
          <el-form-item label="流程名称" prop="flowName">
            <el-input v-model="listQuery.flowName" clearable placeholder="流程名称" maxlength="15" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="pageType !== 'check'" class="container mt48">
      <el-button type="primary" style="cursor: unset">申请人 提交申请</el-button>
      <div v-if="configList.length === 0" class="add-config">
        <el-button
          class="add-btn"
          type="primary"
          size="mini"
          @click="handlePlus(key)"
        >
          <i class="el-icon-plus" />
        </el-button>
      </div>
      <transition-group name="fade">
        <div v-for="(item, key) in configList" :key="'config' + key">
          <div v-if="key === 0" class="add-config">
            <el-button
              class="add-btn"
              type="primary"
              size="mini"
              @click="handlePlus(key)"
            >
              <i class="el-icon-plus" />
            </el-button>
          </div>
          <div class="selects">
            <el-row type="flex" justify="space-between" class="pd0-15 select-title">
              <span><i class="el-icon-user" />  审批人{{ key + 1 }} </span>
              <span><a @click="handleDelete(key)"><i class="el-icon-close" /></a></span>
            </el-row>
            <el-row>
              <el-select v-model="item.flowNode" style="width:100%" clearable placeholder="选择审批节点类型" @change="handleChangeType($event, key)">
                <el-option
                  v-for="it in nodeTypeList"
                  :key="'type' + it.id"
                  :label="it.name"
                  :value="{ name: it.name, id: it.id }"
                />
              </el-select>
              <template v-if="item.flowNode !== '所属公司' && item.flowNode !== '核心企业'">
                <el-select v-if="item.flowNode && item.flowNode.includes('第三方')" v-model="item.custName" style="width:100%" clearable placeholder="选择对应公司" @change="handleChangeCompany($event, key)">
                  <el-option
                    v-for="it in item.companyList"
                    :key="'company' + it.id"
                    :label="it.custName"
                    :value="{value: it.id, label: it.custName}"
                  />
                </el-select>
                <el-select v-if="item.flowNode && item.flowNode.includes('所属公司上级公司')" v-model="item.custLevel" style="width:100%" clearable placeholder="选择向上层级数">
                  <el-option
                    v-for="it in nodeList"
                    :key="'node' + it.value"
                    :label="it.name"
                    :value="it.value"
                  />
                </el-select>
              </template>
            </el-row>
          </div>

          <div class="add-config">
            <el-button
              class="add-btn"
              type="primary"
              size="mini"
              @click="handlePlus(key + 1)"
            >
              <i class="el-icon-plus" />
            </el-button>
          </div>
        </div>
      </transition-group>

      <el-button type="primary" style="width:100%; cursor: unset">平台维护/资金方维护</el-button>
    </div>

    <div v-else class="container mt48">
      <el-button type="primary" style="cursor: unset">申请人 提交申请</el-button>
      <div class="add-config">
        <el-button
          class="add-btn"
          type="primary"
          size="mini"
          @click="handlePlus"
        >
          <i class="el-icon-plus" />
        </el-button>
      </div>
      <el-button type="primary" style="width:100%; cursor: unset">平台维护/资金方维护</el-button>
    </div>

    <div class="footer pd20">
      <el-button type="plain" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="submit()">确定</el-button>
    </div>
  </div>
</template>

<script>
import { flowCustTypeDicList, queryCustByList, updateWorkflow, addConfig, queryFlowNodeById } from '@/api/WorkflowConfig'

export default {
  name: 'WorkflowConfigAdd',
  data() {
    return {
      valid: '',
      pageType: this.$route.query.pageType || '',
      flowTypeList: [
        {
          label: '授信申请审批',
          value: 1
        },
        {
          label: '用款申请审批',
          value: 2
        }
      ],
      nodeList: [
        {
          name: '1级',
          value: 1
        },
        {
          name: '2级',
          value: 2
        },
        {
          name: '3级',
          value: 3
        },
        {
          name: '4级',
          value: 4
        },
        {
          name: '5级',
          value: 5
        },
        {
          name: '6级',
          value: 6
        }
      ],
      nodeTypeList: [],
      listQuery: {
        flowType: '',
        flowName: ''
      },
      configList: []
    }
  },
  created() {
    const { curTitle } = this.$route.query
    if (curTitle) {
      this.$route.meta.title = curTitle
      this.$forceUpdate()
      // this.$store.dispatch('tagsView/addView', this.$route)
    }
    this.getNodeType()
    if (this.pageType === 'modify') {
      this.queryFlowNodeById()
    }
  },
  methods: {
    async queryFlowNodeById() {
      const res = await queryFlowNodeById(this.$route.query.id)
      if (res.code === '0') {
        console.log(res)
        this.listQuery.flowType = res.data.flowType
        this.listQuery.flowName = res.data.flowName
        this.configList = res.data.nodeList
      } else {
        this.$message.warning(res.msg)
      }
    },
    async getNodeType() {
      // 如果选择的是第三方，则需要选择对应类型项下已建档的具体公司；
      // 如果选择的是所属公司上级公司，则需要选择向上的层级数，层级数枚举值为1-6；如果选择的向上层级数为2，则所属公司的上一级公司、所属公司的上二级公司需要审批；如果该所属公司只有上一级公司，则只需要上一级公司审批
      const res = await flowCustTypeDicList()
      if (res.code === '0') {
        this.nodeTypeList = res.data
        console.log(res)
      } else {
        this.$message.warning(res.msg)
      }
    },
    async handleChangeType($event, index) {
      console.log(index, this.configList[index])
      this.configList[index].custId = undefined // 设置默认其企业id空
      this.configList[index].custName = undefined
      // this.$forceUpdate()
      // this.$set(this.configList, 'custId', '')
      this.configList[index].flowNode = $event.name
      const val = $event.name
      console.log(val, $event)
      if (val && val.includes('第三方')) {
        const res = await queryCustByList({
          custTypeId: $event.id
        })
        if (res.code === '0') {
          this.configList[index].companyList = res.data
          this.$forceUpdate()
        } else {
          this.$message.warning(res.msg)
        }
      }
    },
    handleChangeCompany($event, index) {
      // console.log($event, index)
      this.configList[index].custId = $event.value
      this.configList[index].custName = $event.label
    },
    handlePlus(index) {
      console.log(index + 1)
      if (index !== undefined) {
        this.configList.splice(index, 0, {
          companyList: [],
          custId: undefined, // 公司id
          custLevel: undefined, // 层级数 1-6层级
          custName: undefined, // 公司名称
          flowNode: undefined, // 审批节点类型：所属公司、所属公司上级公司、核心企业、第三方1、第三方2、第三方3
          flowOrder: undefined, // 节点顺序
          deleted: 0 // 默认 0
        })
      } else {
        this.configList.push({
          companyList: [],
          custId: undefined, // 公司id
          custLevel: undefined, // 层级数 1-6层级
          custName: undefined, // 公司名称
          flowNode: undefined, // 审批节点类型：所属公司、所属公司上级公司、核心企业、第三方1、第三方2、第三方3
          flowOrder: undefined, // 节点顺序
          deleted: 0 // 默认 0
        })
      }
    },
    handleDelete(index) {
      this.configList.splice(index, 1)
    },
    async handleAdd() {
      // const configList = this.configList.splice(0).map(item => {
      //   delete item.companyList
      // })
      console.log(this.listQuery.flowType, this.listQuery.flowName)
      if (!this.listQuery.flowType) {
        this.$message.warning('请选择流程类型')
        return
      }
      if (!this.listQuery.flowName) {
        this.$message.warning('请输入流程名称')
        return
      }

      const newConfigList = this.configList
      // 校验必填

      newConfigList.every(item => { // 校验
        delete item.companyList
        if (!item.flowNode) {
          this.$message.warning('请补充流程节点')
          this.valid = false
          return false
        } else if (item.flowNode.includes('第三方') && !item.custName) {
          this.$message.warning('请选择对应公司')
          this.valid = false
          return false
        } else if (item.flowNode.includes('所属公司上级公司') && !item.custLevel) {
          this.$message.warning('请选择向上层级数')
          return false
        } else {
          this.valid = true
          return true
        }
      })
      newConfigList.map((item, index) => {
        item.flowOrder = index + 1 // 重新设置flowOrder
      })
      // console.log(newConfigList)
      let res = {}
      if (!this.valid && newConfigList.length) {
        // console.log(this.valid, 'valids')
        return
      }
      if (this.pageType === 'modify') {
        res = await updateWorkflow({
          id: this.$route.query.id,
          apply: 0, // 	是否应用 0-不应用 1-应用
          flowName: this.listQuery.flowName, // 流程名称
          flowType: this.listQuery.flowType, // 流程类型：1授信申请审批、2用款申请审批
          isInit: 0, //	0否1是，如果是初始化模板，不能编辑修改
          detailList: newConfigList
        })
      } else {
        debugger
        console.log(newConfigList, 'WorkflowConfigAdd')
        res = await addConfig({
          apply: 0, // 	是否应用 0-不应用 1-应用
          flowName: this.listQuery.flowName, // 流程名称
          flowType: this.listQuery.flowType, // 流程类型：1授信申请审批、2用款申请审批
          isInit: 0, //	0否1是，如果是初始化模板，不能编辑修改
          detailList: newConfigList
        })
      }
      if (res.code === '0') {
        this.nodeTypeList = res.data
        this.$message.success('操作成功')
        await this.$store.dispatch('tagsView/delVisitedView', this.$route)
        this.$router.push('/SystemManagement/WorkflowConfig')
        // console.log(res)
      } else {
        this.$message.warning(res.msg)
      }
    },
    cancel() {
      this.$store.dispatch('tagsView/delVisitedView', this.$route)
      this.$router.go(-1)
    },
    submit() {
      // console.log(this.configList.map(item => {
      //   delete item.companyList
      // }), this.configList)
      // this.handleUpdate()
      this.handleAdd()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .container {
    margin: 48px auto;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 60px;
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
    .add-config {
      display: flex;
      margin: 0 auto;
      justify-content: center;
      background: url('../../assets/arrow.svg') no-repeat center center;
      background-size: contain;
      width: 30px;
      height: 120px;
      .add-btn {
        margin-top: -30px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-self: center;
        .el-icon-plus {
          font-size: 16px;
        }
      }
    }
    .selects {
      width: 100%;
      color: #fff;
      border-radius: 4px;
      border: 1px solid #00000033;
      .select-title {
        height: 42px;
        line-height: 42px;
        background-color: #EAA721FF;
      }
      ::v-deep {
        .el-input__inner {
          border: none;
        }
      }
    }
  }
  .footer {
    position: absolute;
    bottom: 20px;
    width: 100vw;
  }
}
::v-deep.el-select-dropdown__item.selected {
  color: #606266;
}
</style>
