<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import colorPicker from '@/components/ThemePicker/colorPicker.vue'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    // RightPanel,
    // Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin, colorPicker],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      // showSettings: state => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.colorPicker
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 1400px;
  overflow: auto;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

// 修改table的滚动条样式
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
  height: 10px;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #b3bccb;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: #dee0e8;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 5px;
}
::v-deep {
  // 设置el-table的fixed属性左右固定高度
   .el-table__fixed,.el-table__fixed-right {
     height: calc(100% + 0px - 10px) !important;
     background: #fff;
   }
  // right: 0px !important;
}
// // 表格放大后线条对不齐
::v-deep .el-table th.gutter {
  display: table-cell !important;
}
::v-deep .el-table__body {
  width: 100%;
  table-layout: fixed !important;
}
.el-table--border th.gutter:last-of-type {
  display: block !important;
  width: 17px !important;
}
</style>

<style>
</style>
