/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 邮箱校验
 * @param {String} value
 * @returns {Function}
 */
export function validEmailNew(rule, value, callback) {
  // const regs = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  // 邮箱号可输入中文
  const regs = /[-+.]*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  if (value === undefined || value === null || value === '') {
    return callback()
  } else {
    var email = value.replace(/\s/g, '') // 去除空格
    if (!regs.test(email)) {
      return callback([new Error('邮箱号输入不合法')])
    } else {
      return callback()
    }
  }
}

// 正整数校验

export function validzzs(rule, value, callback) {
  const regs = /^[1-9]\d*$/
  if (value === undefined) {
    return callback()
  } else {
    var zzs = (value + '').replace(/\s/g, '') // 去除空格
    if (!regs.test(zzs)) {
      return callback([new Error('请填写正确的授信期限')])
    } else {
      return callback()
    }
  }
}
/**
 * @param {Number} value
 * @returns {Function}
 */
// 校验发票代码是否位数字，并且长度为10或者12位
export function billCodeReg(rule, value, callback) {
  if (value.length >= 1) {
    if (isNaN(Number(value))) {
      return callback(new Error('发票代码只能为数字'))
    } else
    if (value.length !== 10 && value.length !== 12) {
      return callback(new Error('发票代码只能10、12位'))
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}
/**
 * @param {Number} value
 * @returns {Function}
 */
// 校验发票代码是否位数字，并且长度为10或者12位
export function billNoReg(rule, value, callback) {
  if (value.length >= 1) {
    if (isNaN(Number(value))) {
      return callback(new Error('发票代码只能为数字'))
    } else if (value.length !== 8) {
      return callback(new Error('发票号码长度只能为8位'))
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}
/**
 * @param {Number} value
 * @returns {Function}
 */
// 校验发票代码是否位数字，并且长度为10或者12位
export function totalFareTaxReg(rule, value, callback) {
  const reg = /^\d+.?\d{0,2}$/
  const newValue = value + ''
  if (value.length >= 1) {
    if (isNaN(Number(newValue))) {
      return callback(new Error('发票代码只能为数字'))
    } else if (newValue >= 100000000) {
      return callback(new Error('价税合计只能小于1亿'))
    } else if (!reg.test(newValue)) {
      return callback(new Error('价税合计最多保留两位小数'))
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}
/**
 * @param {Number} value
 * @returns {Function}
 */
// 校验金额只能输入保留两位小数的数字
export function accountMoney(rule, value, callback) {
  const reg = /^\d+.?\d{0,2}$/
  if (value.length >= 1) {
    if (isNaN(Number(value))) {
      return callback(new Error('只能输数字'))
    } else if (!reg.test(value)) {
      return callback(new Error('保留两位小数'))
    } else if (value >= 100000000) {
      return callback(new Error('金额只能小于1亿'))
    } else {
      return callback()
    }
  } else {
    return callback()
  }
}

/**
 * @param {String} value
 * @returns {Function}
 */
export function validPhone(value) {
  const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
  return reg.test(value)
}

//  社会信用代码
export function businessCode(rule, value, callback) {
  const regBusiness = /^[0-9A-Z]{18}$/
  if (value) {
    if (regBusiness.test(value)) {
      return callback()
    } else {
      return callback(new Error('统一社会信用代码只能输入18位数字或大写英文字母'))
    }
  } else {
    return callback()
  }
}

// 企业名称+社会信用代码
export function validBusinessCodeCustName(rule, value, callback) {
  const reg = /[\u4e00-\u9fa5]/g
  const regBusiness = /^[0-9A-Z]{18}$/
  if (value && value.length >= 2) {
    if (reg.test(value) || regBusiness.test(value)) {
      return callback()
    } else {
      return callback(new Error('请输入正确的企业名称'))
    }
  } else {
    return callback()
  }
}
// 手机号校验
export function tellPhone(rule, value, callback) {
  var phone = value.replace(/\s/g, '') // 去除空格
  // 校验手机号
  const regs = /^1(2\d|3\d|4[0-9]|5[0-35-9]|6[0-9]|7[0-8]|8\d|9[0-35-9])\d{8}$/
  if (value.length === 0) {
    return callback()
  } else {
    if (!regs.test(phone)) {
      return callback([new Error('手机号输入不合法')])
    } else {
      return callback()
    }
  }
}
// 身份证校验
/* export function validIdcard(rule, value, callback) {
  var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  if (value === undefined || value.length === 0) {
    // 不做必填校验，如果必填可以在使用页面单独添加
    return callback()
  } else if (!regIdCard.test(value)) {
    return callback(new Error('请输入正确的证件号码'))
  } else if (value && value.length > 18) {
    return callback(new Error('字符长度超限'))
  } else {
    return callback()
  }
} */
/**
* @params { * }
* @return
* @Descripttion { 身份证检验 }
*
 **/
export function validIdcard(rule, value, callback) {
  const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
    21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏',
    33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南',
    42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆',
    51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃',
    63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
  }
  // 不做必填校验，如果必填可以在使用页面单独添加
  if (value === null || value === '' || value.length === 0) {
    return callback()
  } else if (isCardNo(value) && checkProvince(value, city) && checkBirthday(value) && checkParity(value)) {
    // 校验长度，类型、检查省份、校验生日、检验位的检测
    return callback()
  } else {
    return callback(new Error('请输入正确的证件号码'))
  }

  // 检查号码是否符合规范，包括长度，类型
  function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    const reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(card) !== false
  }
  // 取身份证前两位,校验省份
  function checkProvince(card, city) {
    const province = card.substr(0, 2)
    return city[province] !== undefined
  }
  // 检查生日是否正确
  function checkBirthday(card) {
    const len = card.length
    // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if (len === 15) {
      const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
      const arr_data = card.match(re_fifteen)
      const year = arr_data[2]
      const month = arr_data[3]
      const day = arr_data[4]
      const birthday = new Date('19' + year + '/' + month + '/' + day)
      return verifyBirthday('19' + year, month, day, birthday)
    } else if (len === 18) {
      // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
      const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
      const arr_data = card.match(re_eighteen)
      const year = arr_data[2]
      const month = arr_data[3]
      const day = arr_data[4]
      const birthday = new Date(year + '/' + month + '/' + day)
      return verifyBirthday(year, month, day, birthday)
    } else {
      return false
    }
  }
  // 校验日期
  function verifyBirthday(year, month, day, birthday) {
    const now = new Date()
    const now_year = now.getFullYear()
    // 年月日是否合理
    if (birthday.getFullYear() === +year && (birthday.getMonth() + 1) === +month && birthday.getDate() === +day) {
      // 判断年份的范围（0岁到130岁之间)
      const time = now_year - year
      return time >= 0 && time <= 130
    } else {
      return false
    }
  }

  // 校验位的检测
  function checkParity(card) {
    // 15位转18位
    card = changeFifteenToEighteen(card)
    const len = card.length
    if (len === 18) {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let cardTemp = 0
      let i
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      const valnum = arrCh[cardTemp % 11]
      return valnum === card.substr(17, 1).toLocaleUpperCase()
    } else {
      return false
    }
  }
  // 15位转18位身份证号
  function changeFifteenToEighteen(card) {
    if (card.length === 15) {
      const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      let cardTemp = 0
      let i
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i]
      }
      card += arrCh[cardTemp % 11]
      return card
    }
    return card
  }
}

/**
 * @description: 空格判断
 * @param {String} value
 * @return {Function}
 */
// 空格判断
export function validSpace(rule, value, callback) {
  if (value.indexOf(' ') !== -1) {
    return callback(new Error('不能输入空格'))
  } else {
    return callback()
  }
}

// 还款账户名称
export function validateCollAcctName(rule, value, callback) {
  if (value && value.length < 2) {
    return callback(new Error('还款账户名称限制2-30个字符'))
  } else {
    return callback()
  }
}

// 还款账户账号
export function validateCollAcctNo(rule, value, callback) {
  if (value && value.length < 8) {
    return callback(new Error('还款账户账号限制8-28个字符'))
  } else {
    return callback()
  }
}
/**
* @params { * }
* @return
* @Descripttion { 限制输入3-8个字母 }
*
 **/

export function networkKey(rule, value, callback) {
  const regs = /^[a-zA-Z]+$/
  if (value && !regs.test(value)) {
    return callback(new Error('请输入3-8个字母'))
  } else if (value && value.length < 3) {
    return callback(new Error('请输入3-8个字母'))
  } else {
    return callback()
  }
}

