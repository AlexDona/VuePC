import moment from 'moment'
import {
  Message
} from 'element-ui'
const util = {
  openNewPage(vm, name, argu, query) {
    const pageOpenedList = vm.$store.state.app.pageOpenedList
    const openedPageLen = pageOpenedList.length
    let i = 0
    let tagHasOpened = false
    while (i < openedPageLen) {
      if (name === pageOpenedList[i].name) {
        // 页面已经打开
        vm.$store.commit('pageOpenedList', {
          index: i,
          argu: argu,
          query: query
        })
        tagHasOpened = true
        break
      }
      i++
    }
    if (!tagHasOpened) {
      let tag = vm.$store.state.app.tagsList.filter(item => {
        if (item.children) {
          return name === item.children[0].name
        } else {
          return name === item.name
        }
      })
      tag = tag[0]
      if (tag) {
        tag = tag.children ? tag.children[0] : tag
        if (argu) {
          tag.argu = argu
        }
        if (query) {
          tag.query = query
        }
        vm.$store.commit('increateTag', tag)
      }
    }
    vm.$store.commit('setCurrentPage', i)
  },
  oneOf(ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
      return true
    } else {
      return false
    }
  },
  setObjNull(obj) {
    // 对象置空
    obj = JSON.parse(JSON.stringify(obj))
    for (const k of Object.keys(obj)) {
      obj[k] = ''
    }
    return obj
  },
  // 输入框金额格式化
  fixMoneyMinus(num) {
    return String(
      num
    ).replace(/[^\d\.-]/g, '')
      .replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-') // 校验是否只有一个负号
      .replace(/\.{2,}/g, '.')
      .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 小数点金额范围
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(/^\./g, '')
      .replace(/^((\-?)\d{9}|10{9})$/, String(num).substring(0, num.length - 1)) // 限制只能输入小于正负一亿的数（超出禁止输入）
  },
  // 金额格式化
  fixMoney(s, flag = '--') {
    let t
    if (s || s === 0) {
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(2) + ''
      var l = s
        .split('.')[0]
        .split('')
        .reverse()
      var r = s.split('.')[1]
      t = ''
      if (l[l.length - 1] === '-') { // 负数不需要分隔号,
        for (var i = 0; i < l.length; i++) {
          if (l[i] === '-') {
            t += l[i] + ''
            continue
          }
          t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length - 1 ? ',' : '')
        }
      } else {
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
        }
      }
      return (
        t
          .split('')
          .reverse()
          .join('') +
        '.' +
        r
      )
    } else {
      return flag
    }
  },
  // Number类型的输入框检验
  fixInput(num) {
    return String(
      num
    ).replace(/[^\d\.-]/g, '') // 不能输入中文
      .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 小数点金额范围(两位小数却只能输入一个小数点)
  },
  // 整数格式化
  fixMoneyInt(s, flag = '--') {
    let t
    if (s || s === 0) {
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(2) + ''
      var l = s
        .split('.')[0]
        .split('')
        .reverse()
      var r = s.split('.')[1]
      t = ''
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
      }
      if (r === '00') {
        return t
          .split('')
          .reverse()
          .join('')
      } else {
        return (
          t
            .split('')
            .reverse()
            .join('') +
          '.' +
          r
        )
      }
    } else {
      return flag
    }
  },
  // 根据数组对象中所有对象的属性值去重
  arrayAllObjUnique(arr) {
    const obj = []
    let str
    if (arr.length === 0) return arr
    return arr.reduce(function(item, next) {
      str = JSON.stringify(next)
      obj.indexOf(str) === -1 ? item.push(next) && obj.push(str) : ''
      return item
    }, [])
  },
  // 数组对象根据属性值去重
  arrayUnique(arr, name) {
    const obj = {}
    return arr.reduce((item, next) => {
      obj[next[name]] ? '' : (obj[next[name]] = true && item.push(next))
      return item
    }, [])
  },
  // 数组对象根据属性值查重
  arrayQueryUnique(arr, name) {
    const obj = {}
    const arrLength = arr.length
    const newArr = arr.reduce((item, next) => {
      obj[next[name]] ? '' : (obj[next[name]] = true && item.push(next))
      return item
    }, [])
    const newArrLength = newArr.length
    // 如果数组长度相同说明没有重复的数据
    return arrLength === newArrLength
  },
  // 空值替换展示
  nullDeal(val, flag = '--') {
    if (
      (val !== 'null' && val !== '' && val !== null && val !== 'undefined') ||
      val === 0
    ) {
      return val
    } else {
      return flag
    }
  },
  /**
     * 验证正整数
     * @len 位数限制
     */
  onlyInt(len) {
    return len
      ? new RegExp(`^[1-9][0-9]{0,${len - 1}}$`)
      : new RegExp(`^[1-9]{0,1}[0-9]*$`)
  },
  // 解决浮点数相加bug
  //   floatAdd(arg1 = 0, arg2 = 0) {
  //     var r1, r2, m
  //     try {
  //       r1 = arg1.toString().split('.')[1].length
  //     } catch (e) {
  //       r1 = 0
  //     }
  //     try {
  //       r2 = arg2.toString().split('.')[1].length
  //     } catch (e) {
  //       r2 = 0
  //     }

  //     function mul(a = 0, b = 0) {
  //       var c = 0
  //       var d = a.toString()
  //       var e = b.toString()
  //       try {
  //         c += d.split('.')[1].length
  //       } catch (f) { }
  //       try {
  //         c += e.split('.')[1].length
  //       } catch (f) { }
  //       return (
  //         (Number(d.replace('.', '')) * Number(e.replace('.', ''))) /
  //         Math.pow(10, c)
  //       )
  //     }
  //     return (
  //       (m = Math.pow(10, Math.max(r1, r2))), (mul(arg1, m) + mul(arg2, m)) / m
  //     )
  //   },
  //   floatSub(arg1, arg2) {
  //     var c, d, e
  //     try {
  //       c = arg1.toString().split('.')[1].length
  //     } catch (f) {
  //       c = 0
  //     }
  //     try {
  //       d = arg2.toString().split('.')[1].length
  //     } catch (f) {
  //       d = 0
  //     }

  //     function mul(a, b) {
  //       var c = 0
  //       var d = a.toString()
  //       var e = b.toString()
  //       try {
  //         c += d.split('.')[1].length
  //       } catch (f) { }
  //       try {
  //         c += e.split('.')[1].length
  //       } catch (f) { }
  //       return (
  //         (Number(d.replace('.', '')) * Number(e.replace('.', ''))) /
  //         Math.pow(10, c)
  //       )
  //     }
  //     return (e = Math.pow(10, Math.max(c, d))), (mul(arg1, e) - mul(arg2, e)) / e
  //   },
  // 浮点数相除
  //   accDiv(arg1, arg2) {
  //     var t1 = 0; var t2 = 0; var r1; var r2
  //     try { t1 = arg1.toString().split('.')[1].length } catch (e) { }
  //     try { t2 = arg2.toString().split('.')[1].length } catch (e) { }
  //     r1 = Number(arg1.toString().replace('.', ''))
  //     r2 = Number(arg2.toString().replace('.', ''))
  //     return (r1 / r2) * Math.pow(10, t2 - t1)
  //   },
  // 按类型返回区间
  //   getTimeDistance(type) {
  //     const now = new Date()
  //     const oneDay = 1000 * 60 * 60 * 24

  //     if (type === 'today') {
  //       now.setHours(0)
  //       now.setMinutes(0)
  //       now.setSeconds(0)
  //       return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  //     }

  //     if (type === 'week') {
  //       let day = now.getDay()
  //       now.setHours(0)
  //       now.setMinutes(0)
  //       now.setSeconds(0)

  //       if (day === 0) {
  //         day = 6
  //       } else {
  //         day -= 1
  //       }

  //       const beginTime = now.getTime() - day * oneDay

  //       return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))]
  //     }

  //     if (type === 'month') {
  //       const year = now.getFullYear()
  //       const month = now.getMonth()
  //       const nextDate = moment(now).add(1, 'months')
  //       const nextYear = nextDate.year()
  //       const nextMonth = nextDate.month()

  //       return [
  //         moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
  //         moment(
  //           moment(
  //             `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
  //           ).valueOf() - 1000
  //         )
  //       ]
  //     }
  //     const year = now.getFullYear()
  //     return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
  //   },
  // 是否月末判断
  getDaysOfMonth(year, month, day) {
    month = month + 1
    let endDay = ''
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        endDay = 31
        break
      case 4:
      case 6:
      case 9:
      case 11:
        endDay = 30
        break
      case 2:
        endDay = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28
        break
    }
    return endDay === day
  },
  // 深拷贝
  //   deepCopy(obj) {
  //     var result = Array.isArray(obj) ? [] : {}
  //     for (var key in obj) {
  //       if (obj.hasOwnProperty(key)) {
  //         if (typeof obj[key] === 'object') {
  //           result[key] = this.deepCopy(obj[key]) // 递归复制
  //         } else {
  //           result[key] = obj[key]
  //         }
  //       }
  //     }
  //     return result
  //   },
  // 正则相关
  reg: {

    /**
     * 验证浮点数
     * @maxLen 位数
     * @poinerLen 小数点后位数
     */
    onlyFloat(maxLen, pointerLen) {
      return new RegExp(
        `^(([1-9][0-9]{0,${maxLen -
        1}})\|(([0]\\.\\d{1,${pointerLen}}\|[1-9][0-9]{0,${maxLen -
        1}}\\.\\d{1,${pointerLen}})))$`
      )
    }
  },
  /**
   * 合并表格
   * @list 表格数据
   * @primaryKey 合并主键
   * @isMergeFile 是否合并文件
   * @sortField 排序字段
   */
  mergeTable(list, primaryKey, isMergeFile = false, sortField = 'createTime') {
    const listData = []
    const obj = {}
    let i = 0
    // 合并同一primaryKey产品相关差错
    for (const item of list) {
      item.id = new Date().getTime() * 1000 + (i++ % 1000) // 生成唯一id
      const val = item[primaryKey]
      if (!obj[val]) {
        item.child = []
        item.childLen = 1
        obj[val] = item
        item.newKey = item[primaryKey] // 保存对账文件所需要的key
      } else {
        obj[val].childLen += 1
        item.childLen = 0
        item.productName = ''
        item.billNo = ''
        item.isMerge = true
        item.newKey = item[primaryKey] // 保存对账文件所需要的key
        item[primaryKey] = new Date().getTime() * 1000 + (i++ % 1000)
        obj[val].child.push(item)
      }
    }
    for (const index in obj) {
      obj[index].fileLen = 1
      listData.push(obj[index])
    }
    console.log('beforeSort', listData)
    // 根据sortField降序
    listData.sort((a, b) => {
      return new Date(b[sortField]) - new Date(a[sortField])
    })
    console.log('sort', listData)
    const res = []
    for (const key of Object.keys(listData)) {
      res.push(listData[key])
      if (listData[key].child.length > 0) {
        const child = listData[key].child
        const fileTypePlace = listData[key].fileTypePlace
        // 同一primaryKey下同一accountcheckFileType相同fileTypePlace进行合并
        for (const childItem of child) {
          if (isMergeFile) {
            if (
              listData[key].accountcheckFileType ===
              childItem.accountcheckFileType && fileTypePlace === childItem.fileTypePlace
            ) {
              listData[key].fileLen += 1
              childItem.fileLen = 0
            } else {
              childItem.fileLen = 1
            }
          }
        }
        // 对子进行文件分类
        for (const key of Object.keys(child)) {
          for (const key2 of Object.keys(child)) {
            if (key2 > key && child[key].fileLen > 0) {
              if (child[key].fileTypePlace !== fileTypePlace && child[key2].fileTypePlace === child[key].fileTypePlace) {
                child[key].fileLen += 1
                child[key2].fileLen = 0
              }
            }
          }
          res.push(child[key])
        }
      }
    }
    // 根据创建时间排序
    return res
  },
  /**
   * 滚动到指定位置
   * @param {*} number 离顶部的距离
   * @param {*} time 动画时间
   */
  scrollTop(number = 0, time) {
    if (!time) {
      document.querySelector('.main_content').scrollTop = document.documentElement.scrollTop = number
      return number
    }
    const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime // 计算循环的次数
    let nowTop = document.querySelector('.main_content').scrollTop + document.documentElement.scrollTop // 获取当前滚动条位置
    const everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离
    const scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
        spacingInex--
        this.scrollTop(nowTop += everTop)
      } else {
        clearInterval(scrollTimer) // 清除计时器
      }
    }, spacingTime)
  },
  /**
   * 返回唯一id
   * @param {*} i 标识
   */
  getOnlyId(i) {
    return new Date().getTime() * 1000 + (i % 1000)
  },
  // 获取数组最大值
  getArrayMaxVal(arr) {
    let max = arr[0]
    for (var i = 1; i < arr.length; i++) {
      const cur = arr[i]
      cur > max ? max = cur : null
    }
    return max
  },
  // 给对象的key值就行排序
  sortObj(obj) {
    const arr = Object.keys(obj)
    if (arr.length < 2) {
      return obj
    }

    const keysArr = Object.keys(obj).sort()

    const sortObj = {}

    for (var i = 0; i < keysArr.length; i++) {
      var key = keysArr[i]
      sortObj[key] = obj[key]
    }
    return sortObj
  },

  /**
   * 根据指定的字段排序，（处理sortable对返回的数据为null/''的时候前端页面排序错乱）
   * @param {*} arr 数据
   * @param {*} str 排序字段
   * @param {*} flag 是否排序
   */
  sortableDate(arr, str, flag) {
    let list = []
    if (flag) {
      arr.forEach(item => {
        if (item[str] === null || item[str] === '') {
          list.push(item)
        } else {
          list.unshift(item)
        }
      })
    } else {
      list = arr
    }
    return list
  },
  // 按照数组中每一项的对象的dateTime升序
  sortDateTime(arr) {
    arr.sort((a, b) => a.datetime.localeCompare(b.datetime))
    return arr
  },
  // 清空对象key为空数组
  deleteObjKeyisEmptyArry(obj) {
    for (const key in obj) {
      if (obj[key].length === 0) {
        delete obj[key]
      }
    }
    return obj
  },
  // 根据凭证日期校验是否符合下载条件
  // (startDate : 开始日期  endDate ：结束日期)
  checkVoucherData(startDate, endDate) {
    // 声明一个开关
    let flag = false
    const today = moment().format('YYYY-MM-DD')
    // 如果需要校验凭证日期并且凭证日期有值
    if (startDate) {
      const day = moment(today).diff(
        moment(startDate),
        'day'
      ) // 凭证开始日期与当前日期相差天数
      const voucherDay = moment(endDate).diff(
        moment(startDate),
        'day'
      ) // 凭证开始日期与凭证结束日期相差天数
      // 凭证起始日期大于当前日期180天&&凭证开始日期与凭证结束日期相差天数大于30天
      if (day > 180) {
        if (voucherDay > 30) {
          flag = false
          Message({
            message: ('查询起始日距离当前日期超过180日，最长下载期间不能超过1个月'),
            type: 'error',
            duration: 5 * 1000
          })
        } else {
          flag = true
        }
      } else {
        // 凭证开始日期距离当前日期小于180天
        flag = true
      }
    } else {
      // 如果凭证日期没值
      Message({
        message: ('请选择凭证日期后再下载'),
        type: 'warning',
        duration: 5 * 1000
      })
      flag = false
    }
    return flag
  }
}

// 日期格式化
// Date.prototype.format = function(format) {
//   var o = {
//     'M+': this.getMonth() + 1, // month
//     'd+': this.getDate(), // day
//     'h+': this.getHours(), // hour
//     'm+': this.getMinutes(), // minute
//     's+': this.getSeconds(), // second
//     'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
//     S: this.getMilliseconds() // millisecond
//   }
//   if (/(y+)/.test(format)) {
//     format = format.replace(
//       RegExp.$1,
//       (this.getFullYear() + '').substr(4 - RegExp.$1.length)
//     )
//   }
//   for (var k in o) {
//     if (new RegExp('(' + k + ')').test(format)) {
//       format = format.replace(
//         RegExp.$1,
//         RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
//       )
//     }
//   }
//   return format
// }
// for of添加对象迭代器
// Object.prototype[Symbol.iterator] = function() {
//   const _this = this
//   let index = 0
//   const length = Object.keys(_this).length
//   return {
//     next: () => {
//       const value = _this[index]
//       const done = index >= length
//       index++
//       return {
//         value,
//         done
//       }
//     }
//   }
// }
// 字符串增加查询字节长度方法
// String.prototype.gbLen = function() {
//   if (this === null || !this) return 0
//   return this.replace(/[^\x00-\xff]/g, '01').length
// }

export default util
