<template>
  <!-- 新增文件夹名 -->
  <div class="addFieldsName">
    <!--   <div class="imageBox">
      <div v-for="(item,index) in createFieldVideo" :key="index" class="svgBox">
        <div :class="[index === currentIndex && pageMode!=='preview' ? 'currentClass' : '']" @mouseover="mouseOver(index)" @mouseleave="mouseLeave(index)">
          <svg-icon icon-class="files" style="height: 100px;width: 100px;" class="svg-style" />
          <i v-if="index === currentIndex && pageMode!=='preview'" class="el-icon-delete deleteIcon" @click="createFieldVideo.splice(index,1)" />
        </div>
        <el-input v-model="createFieldVideo[index].productAddCloumDesc" maxlength="10" :disabled="pageMode === 'preview'" class="elInput" clearable placeholder="影像文件夹名称" @blur="emitData" />
      </div>
    </div> -->

    <!-- 1919修改为单选下拉新增 -->
    <el-row v-for="(item, index) in createFieldVideo" :key="index" style="margin-top: 20px">
      <el-col>
        <div class="colStyle">
          <svg-icon icon-class="file" class="svg-style" />
          <el-select
            v-model="createFieldVideo[index].productAddCloumName"
            :disabled="pageMode === 'preview' || item.canDelete=== 0 "
            style="width:500px; padding-left: 10px"
            placeholder="请选择"
            @change="changeProductAddCloum(index)"
          >
            <el-option
              v-for="items in createSelectList"
              :key="items.id"
              :label="items.folderName"
              :value="String(items.id)"
            />
          <!-- desc:  特殊处理后端integer  但我们需要的是字符串-->
          </el-select>
          <template v-if="pageMode !== 'preview' && item.canDelete === 1">
            <el-button type="text" style="color: #FF3232; padding-left: 8px" @click="createFieldVideo.splice(index,1)">删除</el-button>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: '',
  components: {
  },
  props: {
    // 图片列表数据
    createFieldVideo: {
      type: Array,
      default: () => []
    },
    // 下拉枚举数据
    createSelectList: {
      type: Array,
      default: () => []
    },
    // 当前页面状态--（add：新增 preview: 查看）
    pageMode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentIndex: '', // 当前下标
      productAddCloumFilter: {}
    }
  },
  computed: {},
  watch: {
  },
  methods: {
    // 移入
    mouseOver(index) {
      this.currentIndex = index
    },
    // 移出
    mouseLeave() {
      this.currentIndex = ''
    },
    changeProductAddCloum(index) {
      this.createSelectList.forEach(item => {
        if (String(item.id) === this.createFieldVideo[index].productAddCloumName) {
          this.createFieldVideo[index].productAddCloumDesc = item.folderName
          return
        }
      })
    },
    // 实时回推最新数据
    emitData() {
      this.$emit('updateFeilds', this.createFieldVideo)
    }
  }
}
</script>

<style lang="scss" scoped>
.addFieldsName{
  .imageBox {
    position: relative;
    display: flex;
    justify-content: flex-start; // 直接写start可以正常运行但是编译会提示warning
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    margin-bottom: 30px;
    color: #3E495B;
    .svgBox {
      position: relative;
      padding: 10px 0;
      margin-right: 24px;
    }
    .elInput {
      display: block;
      // 超过宽度折4行并出现省略号
     /*  display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden; */
      width: 150px;
    }
  }
  .currentClass:before {
    position: absolute;
    content: '';
    width: 100px;
    height: 90px;
    z-index: 888;
    border-radius: 8px;
    background: rgba(0, 0, 0, .4);
  }
  .colStyle {
    display: flex;
    align-items: center;
  }
  .svg-style {
    font-size: 36px;
    line-height: 36px;
  }
  .deleteIcon {
    position: absolute;
    font-size: 20px;
    left: 43%;
    top: 30%;
    color: #FFF;
    z-index: 999;
  }
}
</style>
