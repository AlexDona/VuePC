<template>
  <div class="map-content">
    <el-steps :space="200" :active="1">
      <el-step v-for="(item, index) in title" :key="'title' + index" :title="item" icon="el-icon-success" />
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'RouteMap',
  props: {
    title: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.map-content {
  /deep/ {
    .el-step__icon.is-icon {
      width: 25px;
    }
    .el-step__head.is-finish {
      .el-step__line {
        background: #004EA2FF;
      }
    }
    .el-step__head.is-process {
      border-color: #004EA2FF;
      color: #004EA2FF;
    }
    .el-step__title {
      font-weight: bold;
    }
    .el-step__title.is-process {
      color: #004EA2FF;
    }
  }
  .icon {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: #004EA2FF;
    border-radius: 50%;
  }
}
</style>
