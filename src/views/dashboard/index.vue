<template>
  <div class="container">
    <Row v-if="!showFunds" type="flex" class="contain-amount">
      <Row v-for="(item, index) in dataCardAmounts" :key="'list' + index" type="flex" class="card-list">
        <div>
          <div class="title">{{ item.title }}</div>
          <div class="amount">{{ item.amounts || 0 }}</div>
        </div>
        <div class="icon-right" :style="{backgroundImage: `url(${item.icon})`}" />
      </Row>
    </Row>
    <div v-if="showGroup" class="contain-approve">
      <div v-for="(item, index) in dataCardApprove" :key="'approve' + index" class="approve">
        <div class="customer">{{ item.customer }}</div>
        <Row class="approveArr" type="flex" justify="space-between">
          <div v-for="(it, idx) in item.approveArr" :key="'arr' + idx" class="item-approve">
            <div class="status"><div :class="'status' + it.statusType" /> {{ it.status }}</div>
            <div class="it-amounts">{{ it.amounts || 0 }}</div>
            <div v-if="it.approveAmounts" class="approve-amounts">{{ index === 1 ? '申请额度：￥' : '' }}  <span v-format="'#,##0.00'">{{ +it.approveAmounts }}</span></div>
          </div>
        </Row>
      </div>
    </div>
    <div v-if="showFunds" class="contain-approve">
      <div v-for="(item, index) in dataCardFundApprove" :key="'approve' + index" class="approve">
        <div class="customer">{{ item.customer }}</div>
        <Row class="approveArr" type="flex" :justify="showFunds ? '' : 'space-between'">
          <div v-for="(it, idx) in item.approveArr" :key="'arr' + idx" class="item-approve">
            <div class="status"><div :class="'status' + it.statusType" /> {{ it.status }}</div>
            <div class="it-amounts">{{ it.amounts }}</div>
            <div v-if="it.approveAmounts" class="approve-amounts">{{ index === 1 ? '申请额度：￥' : '' }} <span v-format="'#,##0.00'">{{ +it.approveAmounts }}</span></div>
          </div>
        </Row>
      </div>
    </div>
    <div class="charts">
      <div class="charts-title">放款</div>
      <div id="chart" :class="{'charts-box': isShowEcharts}" />
      <!-- 没有数据 -->
      <no-data v-if="!isShowEcharts" />
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { Row } from 'element-ui'
import echarts from 'echarts'
import { getHome } from '@/api/dashboard'

export default {
  name: 'DashBoard',
  components: {
    Row,
    noData: resolve => require(['@/views/components/noData'], resolve)
  },
  data() {
    const userInfo = getUserInfo()
    // console.log(userInfo, 'getUserInfo')
    const getDataCardAmounts = () => {
      if (userInfo.custTypeId === 4) {
        return []
      } else {
        if (userInfo.custTypeId === 1 || userInfo.custTypeId === 6) {
          return [
            {
              title: '产业公司数量',
              amounts: '',
              icon: require('@/assets/home/chanyegongsi.png'),
              custTypeId: userInfo.custTypeId
            },
            {
              title: '客户数量',
              amounts: '',
              icon: require('@/assets/home/kehu.png'),
              custTypeId: userInfo.custTypeId
            },
            {
              title: '资金方数量',
              amounts: '',
              icon: require('@/assets/home/zijinfang.png'),
              custTypeId: userInfo.custTypeId
            },
            {
              title: '产品数量',
              amounts: '',
              icon: require('@/assets/home/chanpinguanli.png'),
              custTypeId: getUserInfo().custTypeId
            }
          ]
        } else {
          return [
            {
              title: '客户数量',
              amounts: 0,
              icon: require('@/assets/home/kehu.png'),
              custTypeId: userInfo.custTypeId
            },
            {
              title: '资金方数量',
              amounts: 0,
              icon: require('@/assets/home/zijinfang.png'),
              custTypeId: userInfo.custTypeId
            },
            {
              title: '产品数量',
              amounts: 0,
              icon: require('@/assets/home/chanpinguanli.png'),
              custTypeId: getUserInfo().custTypeId
            }
          ]
        }
      }
    }

    return {
      userInfo: userInfo, // custTypeId 客户类型 1-平台 2-核心企业 3-产业公司 4-资金方 5-经销商 6-零售商 7-种植户
      dataCardAmounts: getDataCardAmounts(),
      dataCardApprove: [
        {
          customer: '客户授信申请',
          approveArr: [
            {
              statusType: 0,
              status: '可申请',
              amounts: 0
            },
            {
              statusType: 1,
              status: '申请中',
              amounts: 0
            },
            {
              statusType: 2,
              status: '补充资料',
              amounts: 0
            },
            {
              statusType: 3,
              status: '申请成功',
              amounts: 0
            },
            {
              statusType: -1,
              status: '申请拒绝',
              amounts: 0
            }
          ]
        },
        {
          customer: '客户用款申请',
          approveArr: [
            {
              statusType: 0,
              status: '可申请',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: 1,
              status: '申请中',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: 2,
              status: '补充资料',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: 3,
              status: '申请成功',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: -1,
              status: '申请拒绝',
              amounts: 0,
              approveAmounts: '0.00'
            }
          ]
        }
      ],
      dataCardFundApprove: [
        {
          customer: '客户授信申请',
          approveArr: [
            {
              statusType: 2,
              status: '待资金方审批',
              amounts: 0
            },
            {
              statusType: 3,
              status: '审批通过',
              amounts: 0
            },
            {
              statusType: 0,
              status: '拒绝',
              amounts: 0
            },
            {
              statusType: -1,
              status: '退回',
              amounts: 0
            }
          ]
        },
        {
          customer: '客户用款申请',
          approveArr: [
            {
              statusType: 2,
              status: '待资金方审批',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: 3,
              status: '审批通过',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: 0,
              status: '拒绝',
              amounts: 0,
              approveAmounts: '0.00'
            },
            {
              statusType: -1,
              status: '退回',
              amounts: 0,
              approveAmounts: '0.00'
            }
          ]
        }
      ],
      chart: undefined,
      chartData: {
        dateAmount: [],
        moneyAmount: [],
        totalAmount: []
      },
      isShowEcharts: true,
      options: {}
    }
  },
  computed: {
    showGroup() {
      return this.userInfo.custTypeId === 1 || this.userInfo.custTypeId === 6 || this.userInfo.custTypeId === 3
    },
    showFunds() {
      return this.userInfo.custTypeId === 4
    }
  },
  watch: {
    options: {
      handler(val) {
        this.chart.hideLoading()
        this.chart.setOption(this.options)
      },
      deep: true
    }
  },
  created() {
    this.getHomeData()
    const { toggleCustomer } = this.$route.params
    toggleCustomer && window.location.reload(true)
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.listenResize)
    next()
  },
  mounted() {
    // this.initChat()
    this.resizeChart()
  },
  methods: {
    async getHomeData() {
      const res = await getHome()
      if (res.code === '0') {
        console.log(this.dataCardAmounts, 'this.dataCardAmounts.length')
        this.dataCardAmounts.length && this.dataCardAmounts.map(item => {
          if (item.title === '产业公司数量') {
            item.amounts = res.data.industryNum
          }
          if (item.title === '客户数量') {
            item.amounts = res.data.distributorNum
          }
          if (item.title === '资金方数量') {
            item.amounts = res.data.funNum
          }
          if (item.title === '产品数量') {
            item.amounts = res.data.productNum
          }
        })
        if (this.showGroup) {
          this.dataCardApprove[0].approveArr.map(item => {
            if (item.statusType === 0) {
              item.amounts = res.data.creditApplyForNum
            }
            if (item.statusType === 1) {
              item.amounts = res.data.creditApplyingNum
            }
            if (item.statusType === 2) {
              item.amounts = res.data.creditSupplementNum
            }
            if (item.statusType === 3) {
              item.amounts = res.data.creditApplySuccessfulNum
            }
            if (item.statusType === -1) {
              item.amounts = res.data.creditApplyRefuseNum
            }
          })
          this.dataCardApprove[1].approveArr.map(item => {
            if (item.statusType === 0) {
              item.amounts = res.data.loanApplyForNum
              item.approveAmounts = res.data.loanApplyForAmt || '0.00'
            }
            if (item.statusType === 1) {
              item.amounts = res.data.loanApplyingNum
              item.approveAmounts = res.data.loanApplyingAmt || '0.00'
            }
            if (item.statusType === 2) {
              item.amounts = res.data.loanSupplementNum
              item.approveAmounts = res.data.loanSupplementAmt || '0.00'
            }
            if (item.statusType === 3) {
              item.amounts = res.data.loanApplySuccessfulNum
              item.approveAmounts = res.data.loanApplySuccessfulAmt || '0.00'
            }
            if (item.statusType === -1) {
              item.amounts = res.data.loanApplyRefuseNum
              item.approveAmounts = res.data.loanApplyRefuseAmt || '0.00'
            }
          })
        } else if (this.showFunds) {
          this.dataCardFundApprove[0].approveArr.map(item => {
            if (item.statusType === 2) {
              item.amounts = res.data.creditApplyPendingNum
            }
            if (item.statusType === 3) {
              item.amounts = res.data.creditApplyPassNum
            }
            if (item.statusType === 0) {
              item.amounts = res.data.creditApplyRefuseNum
            }
            if (item.statusType === -1) {
              item.amounts = res.data.creditApplyBreakNum
            }
          })
          this.dataCardFundApprove[1].approveArr.map(item => {
            if (item.statusType === 2) {
              item.amounts = res.data.loanApplyPendingNum
              item.approveAmounts = res.data.loanApplyPendingAmt || '0.00'
            }
            if (item.statusType === 3) {
              item.amounts = res.data.loanApplyPassNum
              item.approveAmounts = res.data.loanApplyPassAmt || '0.00'
            }
            if (item.statusType === 0) {
              item.amounts = res.data.loanApplyRefuseNum
              item.approveAmounts = res.data.loanApplyRefuseAmt || '0.00'
            }
            if (item.statusType === -1) {
              item.amounts = res.data.loanApplyBreakNum
              item.approveAmounts = res.data.loanApplyBreakAmt || '0.00'
            }
          })
        }
        this.isShowEcharts = res.data && res.data.loanApplyDTOs.length > 0
        const dateAmount = []
        const moneyAmount = []
        const totalAmount = []
        // const loanApplyDTOs = res.data.loanApplyDTOs.sort((a, b) => {
        //   return new Date(a.loanDate) - new Date(b.loanDate)
        // })
        // console.log(loanApplyDTOs, 'loanApplyDTOs')
        if (res.data.loanApplyDTOs.reduce((total, current) => +total + current.loanAmt, 0) <= 0) {
          this.isShowEcharts = false
          return
        }
        res.data.loanApplyDTOs.map(item => {
          dateAmount.push(item.loanDate)
          moneyAmount.push(item.loanAmt)
          totalAmount.push(item.loanNum)
        })
        // console.log(moneyAmount, totalAmount)
        this.isShowEcharts ? this.initChat(dateAmount, moneyAmount, totalAmount) : ''
      } else {
        this.isShowEcharts = false
        this.$message.error(res.msg)
      }
    },
    resizeChart() {
      this.isShowEcharts ? window.addEventListener('resize', this.listenResize) : ''
    },
    listenResize() {
      this.chart && this.chart.resize()
    },
    initChat(dateAmount, moneyAmount, totalAmount) {
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.showLoading()
      const colors = ['#5470C6', '#91CC75', '#EE6666']
      const options = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // type: 'cross'
          }
        },
        grid: {
          left: '2%',
          top: '20%',
          right: '2%',
          bottom: '0',
          containLabel: true
        },
        legend: {
          data: ['金额', '笔数'],
          top: 0,
          right: '20px'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: dateAmount
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额',
            min: 0,
            max: Math.max(...moneyAmount),
            interval: (function() {
              const maxMoneyAmount = Math.max(...moneyAmount)
              const maxAmount = Math.max(...totalAmount)
              const multiple = Math.floor(maxMoneyAmount / maxAmount)
              return multiple * 5
            })(),
            position: 'left',
            axisLine: {
              show: false,
              lineStyle: {
                // color: 'rgba(80, 159, 34, 1)'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              showMaxLabel: true
              // formatter: '{value} ml'
            }
          },
          // {
          //   type: 'value',
          //   name: 'Precipitation',
          //   min: 0,
          //   max: 250,
          //   position: 'right',
          //   offset: 80,
          //   axisLine: {
          //     show: true,
          //     lineStyle: {
          //       color: colors[1]
          //     }
          //   },
          //   axisLabel: {
          //     formatter: '{value} ml'
          //   }
          // },
          {
            type: 'value',
            name: '笔数',
            min: 0,
            max: Math.max(...totalAmount) * 2,
            // splitNumber: 6,
            minInterval: 1,
            // interval: (function() {
            //   const maxMoneyAmount = Math.max(...moneyAmount)
            //   const maxAmount = Math.max(...totalAmount)
            //   const multiple = Math.floor(maxMoneyAmount / maxAmount)
            //   return multiple * 5
            // })(),
            position: 'right',
            axisLine: {
              show: false,
              lineStyle: {
                // color: colors[2]
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              // formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            barWidth: '40px',
            itemStyle: {
              color: 'rgba(80, 159, 34, 1)'
            },
            // data: [
            //   2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            // ]
            data: moneyAmount
          },
          {
            name: '笔数',
            type: 'line',
            // symbol: 'none',
            yAxisIndex: 1,
            data: totalAmount
          }
        ]
      }

      // const options = {
      //   // title: {
      //   //   text: '动态数据',
      //   //   subtext: '纯属虚构'
      //   // },
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {
      //       type: 'cross'
      //     }
      //     // formatter: function(param) {
      //     //   param = param[0]
      //     //   console.log(param, 'ppppp')
      //     //   return param
      //     // }
      //   },
      //   legend: {
      //     top: 0,
      //     data: ['金额', '笔数'],
      //     right: '20px'
      //   },
      //   grid: {
      //     left: '2%',
      //     top: '20%',
      //     right: '2%',
      //     bottom: '0',
      //     containLabel: true
      //   },
      //   // toolbox: {
      //   //   show: true,
      //   //   feature: {
      //   //     dataView: { readOnly: false },
      //   //     restore: {},
      //   //     saveAsImage: {}
      //   //   }
      //   // },
      //   dataZoom: {
      //     show: false,
      //     start: 0,
      //     end: 100
      //   },
      //   xAxis: [
      //     {
      //       type: 'category',
      //       boundaryGap: true,
      //       lineStyle: {
      //
      //       },
      //       data: dateAmount
      //       // data: (function() {
      //       //   var now = new Date()
      //       //   var res = []
      //       //   var len = 10
      //       //   while (len--) {
      //       //     res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
      //       //     now = new Date(now - 2000)
      //       //   }
      //       //   return res
      //       // })()
      //     },
      //     {
      //       type: 'category',
      //       boundaryGap: true
      //       // data: (function() {
      //       //   var res = []
      //       //   var len = 10
      //       //   while (len--) {
      //       //     res.push(10 - len - 1)
      //       //   }
      //       //   return res
      //       // })()
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       scale: true,
      //       axisLine: {
      //         show: false
      //       },
      //       axisTick: {
      //         show: false
      //       },
      //       name: '金额',
      //       max: Math.max(...moneyAmount),
      //       min: 0,
      //       // boundaryGap: [0.2, 0.2],
      //       // minInterval: 1,
      //       // maxInterval: 6,
      //       // splitNumber: 6,
      //       // interval: Math.max(...moneyAmount) * 2 / 6 < 1 ? 1 : Math.max(...moneyAmount) / 6,
      //       axisLabel: {
      //         formatter: function(value) {
      //           return value === 0 ? 0 : parseInt(value)
      //         },
      //         interval: function() {
      //           const maxMoneyAmount = Math.max(...moneyAmount)
      //           const maxAmount = Math.max(...totalAmount)
      //           if (maxMoneyAmount > maxAmount) {
      //             const multiple = (maxMoneyAmount / maxAmount) < 1 ? 1 : (maxMoneyAmount / maxAmount)
      //             return multiple * 6
      //           } else {
      //             const multiple = (maxAmount / maxMoneyAmount) < 1 ? 1 :(maxAmount / maxMoneyAmount)
      //             return multiple * 6
      //           }
      //         },
      //         margin: 8,
      //         showMaxLabel: true,
      //         hideOverlap: true
      //       }
      //     },
      //     {
      //       type: 'value',
      //       scale: true,
      //       axisLine: {
      //         show: false
      //       },
      //       axisTick: {
      //         show: false
      //       },
      //       name: '笔数',
      //       // max: function(value) {
      //       //   return value.max + 0.2 * value.max
      //       // },
      //       max: Math.max(...totalAmount),
      //       min: 0,
      //       splitNumber: 6,
      //       boundaryGap: [0.2, 0.2],
      //       // interval: function() {
      //       //   const maxMoneyAmount = Math.max(...moneyAmount)
      //       //   const maxAmount = Math.max(...totalAmount)
      //       //   if (maxMoneyAmount > maxAmount) {
      //       //     const multiple = Math.floor(maxMoneyAmount / maxAmount) < 1 ? 1 : Math.floor(maxMoneyAmount / maxAmount)
      //       //     return multiple * 6
      //       //   } else {
      //       //     const multiple = Math.floor(maxAmount / maxMoneyAmount) < 1 ? 1 : Math.floor(maxAmount / maxMoneyAmount)
      //       //     return multiple * 6
      //       //   }
      //       // },
      //       interval: 6,
      //       axisLabel: {
      //         formatter: function(value) {
      //           return parseInt(value) === 0 ? 0 : parseInt(value)
      //         },
      //         // interval: 1,
      //         margin: 8,
      //         showMaxLabel: true,
      //         hideOverlap: true
      //       }
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '金额',
      //       type: 'bar',
      //       showBackground: true,
      //       itemStyle: {
      //         color: 'rgba(80, 159, 34, 1)'
      //       },
      //       barWidth: '75px',
      //       xAxisIndex: 1,
      //       yAxisIndex: 1,
      //       data: moneyAmount
      //       // data: (function() {
      //       //   var res = []
      //       //   var len = 10
      //       //   while (len--) {
      //       //     res.push(Math.round(Math.random() * 1000))
      //       //   }
      //       //   return res
      //       // })()
      //     },
      //     // {
      //     //   name: '笔数',
      //     //   type: 'line',
      //     //   yAxisIndex: 1,
      //     //   // symbol: 'none',
      //     //   barMaxWidth: '60',
      //     //   itemStyle: {
      //     //     color: 'rgba(115, 160, 250, 1)'
      //     //   },
      //     //   data: totalAmount
      //     //   // data: (function() {
      //     //   //   var res = []
      //     //   //   var len = 0
      //     //   //   while (len < 10) {
      //     //   //     res.push((Math.random() * 10 + 5).toFixed(1) - 0)
      //     //   //     len++
      //     //   //   }
      //     //   //   return res
      //     //   // })()
      //     // }
      //   ]
      // }
      this.options = options
      this.chart.setOption(this.options)
    }
  }
  // beforeRouteLeave(to, from, next) {
  //   // console.log(to, from, next)
  // }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
  .contain-amount {
    gap: 14px;
    margin-bottom: 24px;
    .card-list {
      display: flex;
      justify-content: space-between;
      width: 398px;
      padding: 40px 32px;
      background: #fff;
      box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      .title {
        font-size: 20px;
      }
      .amount {
        margin-top: 8px;
        font-weight: bold;
        font-size: 48px;
      }
      .icon-right {
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        width: 72px;
        height: 72px;
      }
    }
  }

  .contain-approve {
    padding: 24px;
    background: #fff;
    box-shadow: 0 0 23px 0 rgba(135, 150, 176, 0.2);
    border-radius: 8px;
    .approve {
      &:not(:nth-of-type(1)) {
        margin-top: 40px;
      }
      .customer {
        font-size: 18px;
        font-weight: 500;
      }
      .approveArr {
        margin-top: 16px;
        gap: 24px;
        .item-approve {
          width: 272px;
          padding: 32px 24px;
          background: #FAFAFA;
          border-radius: 8px;
          .status {
            color: #999;
            font-weight: 500;
            font-size: 18px;
          }
          .it-amounts {
            padding-top: 22px;
            padding-left: 24px;
            font-size: 20px;
          }
          .approve-amounts {
            margin-top: 16px;
            padding-left: 24px;
            color: #999999;
            font-size: 14px;
          }
          @mixin dotBorder {
            vertical-align: top;
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 14px;
          }
          .status0 {
            @include dotBorder();
            border: 5px solid #F68A33;
          }
          .status1 {
            @include dotBorder();
            border: 5px solid #0092B3;
          }
          .status2 {
            @include dotBorder();
            border: 5px solid #6095FF;
          }
          .status3 {
            @include dotBorder();
            border: 5px solid var(--theme)
          }
          .status-1 {
            @include dotBorder();
            border: 5px solid #FF4717;
          }
        }
      }
    }
  }
/*柱状图*/
  .charts {
    margin-top: 24px;
    background: #fff;
    box-shadow: 0 0 23px 0 rgba(135, 150, 176, 0.2);
    border-radius: 8px;
    padding: 23px 10px;
    .charts-title {
      margin-left: 8px;
      width: 56px;
      text-align: center;
      height: 16px;
      line-height: 16px;
      border-left: 2px solid var(--theme);
      font-size: 18px;
    }
    .charts-box {
      width: 100%;
      min-height: 366px;
    }
  }
}
</style>
