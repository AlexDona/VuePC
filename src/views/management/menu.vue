<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.menuName"
        placeholder="菜单名称"
        clearable
        style="width: 200px;"
        size="mini"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        clearable
        style="width: 200px;margin-left:10px; margin-right:10px;"
        size="mini"
        class="filter-item"
        placeholder="状态..."
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <!-- <el-button
        class="filter-item"
        size="mini"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >新增</el-button> -->
    </div>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      ref="deptTree"
      :data="list"
      row-key="menuId"
      style="width: 100%"
      :header-cell-style="{background:'#eee',color:'#333'}"
      stripe
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column type="index" width="50" label="序号" />
      <!-- <el-table-column prop="menuId" align="center" label="menuId" min-width="120" /> -->
      <el-table-column prop="deptName" align="center" label="" min-width="120" />
      <el-table-column align="center" label="排序" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuName" align="center" label="菜单名称" min-width="120" />
      <el-table-column align="center" label="请求地址" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="类型" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.menuType }}</span>
        </template>
      </el-table-column> -->

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <!-- <el-tag :type="row.status | statusFilter">{{ row.status === '1' ? '生效' : '冻结' }}</el-tag> -->
          <span>{{ row.status ==1?'隐藏':"显示" }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="Drag" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="{row,$index}">
          <el-button
            icon="fa fa-pencil-square-o"
            size="mini"
            type="text"
            @click="handleUpdate(row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="fa fa-trash"
            @click="handleDelete(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="margin-left:50px;margin-right:50px;"
      >
        <el-form-item v-show="dialogStatus==='create'" label="上级菜单" prop="parentName">
          <el-input v-model="temp.parentName" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="菜单类型" prop="menuType">
          <el-select
            v-model="temp.menuType"
            class="filter-item"
            placeholder="请选择..."
            style="width:100%"
          >
            <el-option
              v-for="item in menuTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />

           <el-option v-for="item in menuTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName" />
        </el-form-item>
        <el-form-item label="请求地址" prop="path">
          <el-input v-model="temp.path" />
        </el-form-item>
        <!-- <el-form-item label="打开方式" prop="openType">
          <el-input v-model="temp.openType" />
        </el-form-item> -->
        <el-form-item label="显示排序" prop="orderNum">
          <el-input v-model="temp.orderNum" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-select
            v-model="temp.status"
            class="filter-item"
            placeholder="请选择..."
            style="width:100%"
          >

            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </span>
    </el-dialog>

    <!-- <div class="show-d">
      <el-tag>The default order :</el-tag> {{ oldList }}
    </div>
    <div class="show-d">
      <el-tag>The after dragging order :</el-tag> {{ newList }}
    </div>-->
  </div>
</template>

<script>
import { fetchMenuList, createMenu, updateMenu, removeMenu } from '@/api/management'
import Sortable from 'sortablejs'
import waves from '@/directive/waves' // waves directive

const statusOptions = [
  { key: '0', display_name: '显示' },
  { key: '1', display_name: '隐藏' }
]
// const menuTypeOptions = [
//   { key: 'M', display_name: '目录' },
//   { key: 'F', display_name: '菜单' },
//   { key: 'C', display_name: '按钮' }

// ]
export default {
  name: 'Menu',
  // components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        freeze: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        menuName: '',
        status: ''
      },
      sortable: null,
      // oldList: [],
      // newList: [],
      statusOptions,
      // menuTypeOptions,
      deptOptions: ['部门01', '部门02'],
      temp: {
        id: undefined,
        deptName: '',
        name: '',
        url: '',
        sort: 0,
        type: '',
        status: '',
        openType: '标签页',
        rightKey: '',
        parent: '',
        icon: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        // type: [
        //   { required: true, message: '请选择菜单类型', trigger: 'change' }
        // ],
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入显示排序', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // debugger
      // this.listQuery.deptId = 100
      // console.log(this.$store.user.state.deptId)
      // debugger
      console.log(this.listQuery)
      const { data } = await fetchMenuList(this.listQuery)
      console.log(data)
      this.list = data

      this.listLoading = false
      // this.oldList = this.list.map(v => v.id)
      // this.newList = this.oldList.slice()
      // this.$nextTick(() => {
      //   this.setSort();
      // });
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: (evt) => {
          let startIndex = 0
          let endIndex = 0
          evt.oldIndex > evt.newIndex
            ? ((startIndex = evt.newIndex), (endIndex = evt.oldIndex))
            : ((startIndex = evt.oldIndex), (endIndex = evt.newIndex))
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          for (let i = startIndex; i <= endIndex; i++) {
            this.list[i].sort = i + 1
          }

          // // for show the changes, you can delete in you code
          // const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          // this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        deptName: '',
        name: '',
        url: '',
        sort: 0,
        type: '',
        status: '',
        openType: '标签页',
        rightKey: '',
        parent: '',
        icon: ''
      }
    },
    // 删除菜单
    handleDelete(row, index) {
      this.$confirm('确定要删除该菜单吗？', '删除菜单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return removeMenu(row.menuId)
      })
        .then((response) => {
          if (response.code === 200) {
            this.$message({
              title: '成功',
              message: '删除成功！',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$message({
              title: '失败',
              message: response.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
        .catch(function() {})
        /* .then(async() => {
          this.$message({
            title: '成功',
            message: '删除菜单成功！',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
        .catch(() => {}) */
    },
    // 点击'修改'菜单
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 点击'新增'菜单
    handleCreate(row) {
      this.resetTemp()
      const _selectData = this.$refs.deptTree.selection
      // const { data } = getDeptTreeList();
      if (_selectData.length > 0) {
        this.temp.parentName = _selectData[0].menuName
        this.temp.parentId = _selectData[0].menuId
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 子窗体在'创建'时点击'确定'
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createMenu(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              title: '成功',
              message: '创建菜单成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 子窗体在'编辑'时点击'确定'
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMenu(tempData).then(() => {
            // const index = this.list.findIndex((v) => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$message({
              title: '成功',
              message: '更新菜单成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
