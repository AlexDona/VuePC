<template>
  <div class="vm-chart-bar vm-panel">
    <div
      :id="elId"
      class="panel-body"
      :style="{ height: height + 'px', background: '#fff', padding: '20px' }"
    />
  </div>
</template>
<script>
import chartTheme from './mixins/chartTheme'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// var ecConfig  = require("echarts/config");
// 引入柱状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/dataZoom')
require('echarts/lib/component/markLine')
require('echarts/lib/component/markPoint')
export default {
  name: 'ChartBar',
  props: {
    // 图表区域高度
    title: {
      type: Object,
      default: function() {
        return {}
      }
    },
    height: {
      type: Number,
      default: 500
    },
    // width: {
    //   type: Number,
    //   //  default: 100

    // },
    tooltip: {
      type: Object,
      default: function() {
        return {
          trigger: 'axis',
          // axisPointer: {
          //   type: "cross",
          //   crossStyle: {
          //     color: "#999"
          //   }
          // },
          formatter: (params) => {
            let relVal = params[0].name
            for (const item of params) {
              relVal += `<div>${item.marker}${item.seriesName} : ${
                item.value || item.value === 0 ? item.value + '%' : ''
              }</div>`
            }
            return relVal
          },
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: {
            align: 'left',
            fontSize: 12,
            color: '#333333'
          },
          extraCssText: 'box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2)' // 添加阴影
        }
      }
    },
    // 图表形状颜色, ecahrt依次选择颜色渲染
    color: {
      type: Array,
      default: function() {
        return chartTheme.color
      }
    },
    legend: {
      type: Object,
      default: function() {
        return {
          data: [],
          top: 0,
          left: 0,
          itemWidth: 16,
          itemHeight: 8,
          padding: [5, 0, 20, 0],
          textStyle: {},
          inactiveColor: '#DBDBDB'
        }
      }
    },
    toolbox: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dataZoom: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: '#fff'
    },
    // 横坐标数据
    xAxisData: {
      type: Array,
      required: true
    },
    // 纵坐标标的
    yAxisData: {
      type: Array,
      required: true
    },
    // 纵坐标数据
    series: {
      type: Array,
      required: true
    },
    // 点击事件
    // eventHandle: {
    //   type: Function
    // },
    // legend切换事件
    // legendChange: {
    //   type: Function
    // },
    legendType: {
      type: String,
      default: () => null
    },
    // 是否需要返回图片
    requireImg: {
      type: Boolean,
      default: false
    }
    // grid: {
    //   left: '2%',
    //   right: '0',
    //   bottom: '1%',
    //   containLabel: true
    // }
    // 距离左侧的宽度
    // gridLeft: {
    //   default: () =>
    // },
    // // 距离顶部高度
    // gridTop: {
    //   default: () => 35
    // },
    // // 距离底部的高度
    // gridBottom: {
    //   default: () => 0
    // },
    // // 距离右侧宽度
    // gridRight: {
    //   default: () => '2%'
    // }
  },
  data() {
    return {
      // 刻度颜色
      axisColor: {
        type: String,
        default: '#797979'
      },
      // 分割线颜色
      splitLineColor: {
        type: String,
        default: '#dcdcdc'
      },
      chart: null,
      elId: ''
    }
  },
  computed: {
    // 生成一个随机id, 实现图表组件的复用
    // id: function() {
    //   return parseInt(Math.random() * 1000000);
    // },
    legendData: function() {
      const legendData = []
      for (const elem of this.series) {
        if (legendData.indexOf(elem.name) === -1) {
          legendData.push(
            Object.assign({ name: elem.name }, this.legend.textStyle)
          )
        }
      }
      legendData.reverse() // 设置legendData倒叙
      return legendData
    }
  },
  watch: {
    xAxisData() {
      this.renderChart()
    },
    series() {
      this.renderChart()
    },
    width() {
      this.renderChart()
    }
  },
  created() {
    this.elId = parseInt(Math.random() * 1000000)
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(document.getElementById(this.elId))
      // 指定图表的配置项和数据
      var option = {
        // title: {
        //   text: 'ECharts 入门示例'
        // },
        tooltip: {},
        legend: this.legend,

        xAxis: this.xAxisData,
        grid: {
          // left: 40,
          containLabel: true
        },
        yAxis: {
          splitLine: {
            show: true,

            lineStyle: {
              width: 0.8,
              color: '#d8d8d8',
              type: 'dashed'
            }
          }, // 隐藏对称线
          axisLabel: {
            textStyle: {
              // 改变刻度字体样式
              color: 'rgba(0, 0, 0, 0.45)'
            }
          },
          axisTick: { show: false }, // 隐藏刻度
          axisLine: { show: false } // 隐藏坐标轴

        },
        color: this.color,
        series: this.series
      }
      // if (this.dataZoom) {
      //       option.dataZoom = this.dataZoom;
      //     }
      // 图标自适应
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.chart.resize()
        })
      })
      // 使用刚指定的配置项和数据显示图表。
      option && this.chart.setOption(option, true)
    },
    downloadImg() {
      return this.chart.getDataURL()
    }
  }
}
</script>
<style scoped>
.panel-body .title {
  display: inline-block;
  z-index: 99;
}
</style>
