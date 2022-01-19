<!--分页-->
<template>
  <div class="pagination">
    <!-- <span  class="total">共{{ total }}条记录</span> -->
    <ul class="paging">
      <li class="prev arrow" :class="{'disabled':currentPage<=1}" @click="currentPage<=1?'':pagination(currentPage-1)"><i class="el-icon-arrow-left" /></li>
      <li
        v-for="i in showPageBtn"
        :key="i"
        class="number"
        :class="{'active':i===currentPage,'el-icon-more':i==='-'||i==='+','el-icon-d-arrow-left':toPrev && i==='-','el-icon-d-arrow-right':toNext && i==='+'}"
        @mouseenter="i==='-'?toPrev=true:i==='+'?toNext=true:''"
        @mouseleave="i==='-'?toPrev=false:i==='+'?toNext=false:''"
        @click="i==='-'?pagination(currentPage-1):i==='+'? pagination(currentPage+1):pagination(i)"
      >{{ i>0?i:'' }}</li>
      <li class="next arrow" :class="{'disabled':currentPage>=totalPage}" @click="currentPage>=totalPage?'':pagination(currentPage+1)"><i class="el-icon-arrow-right" /></li>
    </ul>
    <el-select v-model="limitNum" class="pageSize" @change="pagination(currentPage)">
      <el-option
        v-for="item in pageSizes"
        :key="item"
        :label="item + '条/页'"
        :value="item"
      />
    </el-select>
    <span v-if="isViewTotal" class="jump">前往<input v-model="goPage" type="number" autocomplete="off" min="1" :max="totalPage" @keyup.enter="pagination(goPage)">页</span>
  </div>
</template>

<script>
export default {
  name: 'MyPagination',
  props: {
    currentPage: {
      // 当前页码
      type: Number,
      default: 1
    },
    limit: {
      // 每页显示条数
      type: Number,
      default: 10
    },
    // 每页展示的条数(可选框)
    pageSizes: {
      type: Array,
      default: () => [15, 30, 45, 60]
    },
    total: {
      // 总条数
      type: Number,
      required: true
    },
    isViewTotal: {
      // 是否展示总条数
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      goPage: '', // 前往第某一页
      limitNum: '', // 保存当前页
      toPrev: false, // 前往上一页
      toNext: false // 前往下一页
    }
  },
  computed: {
    // 计算页码
    totalPage() {
      return Math.ceil(this.total / this.limit)
    },
    // 展示的页码
    showPageBtn() {
      // 页码数
      const pageNum = Number(this.totalPage)
      // 当前页码
      const index = Number(this.currentPage)
      const arr = []
      // 总页码小于9页直接全部展示
      if (pageNum <= 9) {
        for (let i = 1; i <= pageNum; i++) {
          arr.push(i)
        }
        return arr
      }
      // 总页码大于9 且当前页小于5
      // if (index < 5) return [1, 2, 3, 4, 5, 6, 7, '+', pageNum]
      // 总页码大于9 且当前页小于5  让最后一条展示为省略号
      if (index < 5) return [1, 2, 3, 4, 5, '-', pageNum - 5, pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, '+']
      if (index >= pageNum - 1) {
        return [
          1,
          2,
          '-',
          pageNum - 5,
          pageNum - 4,
          pageNum - 3,
          pageNum - 2,
          pageNum - 1,
          pageNum
        ]
      }

      if (index === pageNum - 2) {
        return [
          1,
          2,
          '-',
          pageNum - 5,
          pageNum - 4,
          pageNum - 3,
          pageNum - 2,
          pageNum - 1,
          pageNum
        ]
      }
      return [
        1,
        '-',
        index - 2,
        index - 1,
        index,
        index + 1,
        index + 2,
        '+'
      ]
    }
  },
  created: function() {
    this.initLimitNums()
  },
  methods: {
    initLimitNums() {
      this.limitNum = this.limit
      // if (this.pageSizes.indexOf(this.limit) == -1) {
      if (!this.pageSizes.includes(this.limit)) {
        this.pageSizes.push(this.limit)
        this.pageSizes.sort(function(a, b) {
          return a - b
        })
      }
    },
    // 翻页，显示条数变化
    pagination(page) {
      let i = parseInt(Number(page))
      if (i < 1) {
        i = 1
      } else if (i > this.totalPage) {
        i = this.totalPage
      }

      // 修改每页展示的条数
      if (this.limitNum !== this.limit && this.limitNum !== '') {
        const pages = Math.ceil(this.total / this.limitNum)
        if (page > pages) {
          i = pages
        }
        // 回传
        this.$emit('update:limit', this.limitNum)
        this.$emit('update:currentPage', i)
        // 触发事件
        this.$emit('size-change')
      } else {
        this.$emit('update:currentPage', i)
        this.$emit('pagination')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
}
.paging {
  display: flex;
  padding-left: 10px;
   li {
    // text-decoration: none;
    list-style-type: none;
    padding: 0 4px;
    background: #f4f4f5;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
  }
  ::v-deep li.active {
    color: #fff;
    background-color: #004099;
    cursor: default;
  }
}
.number{
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px;
}
::v-deep .el-input--medium .el-input__inner{
  width: 100px;
  height: 28px;
}
.arrow{
  border-radius: 2px;
  margin: 0 5px;
  width: 30px;
}
::v-deep i.el-select__caret.el-input__icon.el-icon-arrow-up {
    line-height: 14px;
}
</style>
