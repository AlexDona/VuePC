<template>
  <div class="app-container">
    <el-button type="primary" @click="addConfig('add')">新增</el-button>
    <el-table
      :data="tableData"
      class="tableSytle"
      border
      stripe
      :header-cell-style="{
        background: '#eee',
        color: '#333',
        'text-align':'center'
      }"
    >
      <el-table-column label="序号" align="center" type="index" width="50px" />
      <el-table-column prop="folderNo" min-width="200px" label="影像编号" align="left" />
      <el-table-column prop="folderName" min-width="200px" label="影像名称" show-overflow-tooltip align="left" />
      <el-table-column prop="appApply" min-width="120px" label="数据仓库存储" align="left">
        <template slot-scope="{ row }">
          <span v-if="row.appApply === 1">是</span>
          <span v-if="row.appApply === 0">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileType" min-width="180px" label="影像支持的格式" align="left" />
      <el-table-column prop="createTime" min-width="160px" label="创建时间" align="left" />
      <el-table-column prop="createUser" min-width="160px" label="创建人" align="left" />
      <el-table-column prop="startTime" min-width="160px" label="操作" align="left">
        <template slot-scope="{ row }">
          <el-button type="text" @click="addConfig('update', row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :limit.sync="listQuery.pageParam.pageSize" :page.sync="listQuery.pageParam.pageIndex" @pagination="getQueryFileByPage" />

    <!-- 新增配置弹窗 -->
    <el-dialog :visible.sync="dialogVisiable" :title="'新增影像配置'" :close-on-click-modal="false" append-to-body :before-close="cancel">
      <el-form ref="resetForm" :model="addConfigFile" :rules="rules">
        <el-row>
          <el-col>
            <el-form-item label="影像名称" prop="folderName" label-width="120px">
              <el-input v-model="addConfigFile.folderName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="影像格式" prop="fileTypeArr" label-width="120px">
              <el-checkbox-group v-model="addConfigFile.fileTypeArr">
                <el-checkbox
                  v-for="(item, index) in checkListFormat"
                  :key="'fileType'+ index"
                  :label="item.typeCode"
                  class="checkoboxStyle"
                >
                  {{ item.typeName+' ('+item.permitType+')' }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="存储至数据仓库" prop="appApply" label-width="120px">
              <el-radio v-model="addConfigFile.appApply" :label="1">是</el-radio>
              <el-radio v-model="addConfigFile.appApply" :label="0">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button plain @click="cancel">取消</el-button>
            <el-button type="primary" @click="submitFileFolder">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryFileByPage, addFileFolder, getFileFolderConfDicList } from '@/api/user'
import Pagination from '@/components/Pagination'
export default {
  name: '',
  components: {
    Pagination
  },
  // 定义属性
  data() {
    return {
      listQuery: {
        pageParam: {
          asc: false,
          orderBy: false,
          pageIndex: 1, // 	当前页
          pageSize: 15 // 	每页显示行数
        },
        appApply: '', //	客户端是否保存 0-不应用 1-应用
        fileType: '', //	影像支持的格式(图片、文本、PDF、表格)
        folderName: '', //	影像名称
        folderNo: '' //	影像编号
      },
      addConfigFile: {
        fileType: '', // 	映射数据字符串--->影像支持的格式(图片、文本、PDF、表格)
        fileTypeArr: [], // 	影像支持的格式(图片、文本、PDF、表格)
        folderName: '', // 	影像名称
        folderNo: '', // 	影像编号
        appApply: 0	// 客户端是否保存 0-不应用 1-应用
      },
      checkListFormat: [], // 选择影像文件格式
      rules: {
        folderName: [{
          required: true, message: '请输入影像名称', trigger: 'blur'
        }],
        fileTypeArr: [
          { type: 'array', required: true, message: '请至少选择一中影像文件格式', trigger: 'change' }
        ]
      },
      total: 0,
      dialogVisiable: false,
      tableData: []
    }
  },
  computed: {
  },
  watch: {},
  created() {
    // 获取表数据
    this.getQueryFileByPage()
  },
  mounted() {
  },
  methods: {
    // 获取表数据
    getQueryFileByPage() {
      queryFileByPage(this.listQuery).then(res => {
        if (res.code === '0') {
          this.tableData = res.data.list || []
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.response.data.msg)
      })
    },
    // 获取文件格式

    // 确定
    submitFileFolder() {
      this.$refs['resetForm'].validate(valid => {
        // 处理数据
        this.addConfigFile.fileType = this.addConfigFile.fileTypeArr.join(',')
        if (valid) {
          addFileFolder(this.addConfigFile).then(res => {
            if (res.code === '0') {
              this.cancel()
              this.getQueryFileByPage()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.$message.error(err.response.data.msg)
          })
        }
      })
    },
    // 新增配置
    async addConfig(type, row) {
      if (type === 'update') {
        this.addConfigFile.fileTypeArr = row.typeList
        this.addConfigFile.appApply = row.appApply
        this.addConfigFile.folderName = row.folderName
        this.addConfigFile.folderNo = row.folderNo
        this.addConfigFile.id = row.id
      }
      // 无数据才调用(防止多次点击弹窗)
      if (this.checkListFormat.length === 0) {
        await getFileFolderConfDicList().then(res => {
          if (res.code === '0') {
            this.checkListFormat = res.data
          } else {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err.response.data.msg)
        })
      }
      this.dialogVisiable = true
    },
    cancel() {
      this.addConfigFile = {
        fileType: '', // 	映射数据字符串--->影像支持的格式(图片、文本、PDF、表格)
        fileTypeArr: [], // 	影像支持的格式(图片、文本、PDF、表格)
        folderName: '', // 	影像名称
        folderNo: '', // 	影像编号
        appApply: 0	// 客户端是否保存 0-不应用 1-应用
      }
      this.dialogVisiable = false
      this.$refs['resetForm'].resetFields()
    }
  }
}
</script>
<style>
/* 单独设置 el-tooltip 的宽度
   warning：修改vue组件样式不能使用scoped 除此之外可以将其设置为全局数据
*/
.el-tooltip__popper {
  max-width: 280px;
}
</style>

<style lang="scss" scoped>
.tableSytle {
  margin-top: 20px;
}
::v-deep {
  .el-dialog{
    width: 600px;
  }
  .el-dialog__header {
  border-bottom: 1px solid #e2e2e2;
  }
}
.checkoboxStyle {
  display: block;
}
</style>
