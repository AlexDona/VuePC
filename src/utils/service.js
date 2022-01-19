import { Message } from 'element-ui'
import queryString from 'query-string'

export const checkObject = {
  isEmpty: (obj) => {
    try {
      const json = JSON.stringify(obj)
      return json === '{}'
    } catch (ex) {
      console.log(ex)
      return false
    }
  }
}

export function getParamsTo(params) {
  // 指定返回查询条件
  return checkObject.isEmpty(params) ? '' : '?' + queryString.stringify(params)
}

export function noRepeat(arr) {
  // 指定返回查询条件
  return [...new Set(arr)]
}

export function mapToList(mapObj) {
  const newArr = []
  Object.keys(mapObj).forEach(item => {
    newArr.push({
      label: mapObj[item],
      value: item
    })
  })
  return newArr
}

export default {
  handleResponse(res, callback, msg) {
    // 处理响应
    if (Number(res.code) === 0 || res.code === 200) {
      callback && callback(res.data)
      msg && Message.success(msg)
    } else {
      const msg = res.msg || res.message
      Message({
        type: 'error',
        dangerouslyUseHTMLString: true,
        message: msg.replace(/\n+/g, '<br>')
      })
      callback && callback('errro')
      return false
    }
  },
  handleFileImport(info, callback) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      const { response } = info.file
      if (response.code === 0) {
        Message.success(`导入成功`)
        callback && callback(response)
      } else {
        Message.error(response.message)
      }
    } else if (info.file.status === 'error') {
      Message.error(`${info.file.name} 文件上传失败.`)
    }
  },
  handleNOForArr(Arr, pageIndex, pageSize) {
    // 给数组元素进行编号
    if (Arr instanceof Array) {
      Arr.forEach((item, index) => {
        item.NO = index + 1
        // 设置rowkey
        item.id = item.id || (pageIndex && pageSize && ((pageIndex + 1) * pageSize + index)) || index + 1
      })
    }
  },
  listToObj(list = [], name) {
    const obj = {}
    if (list instanceof Array) {
      // eslint-disable-next-line no-return-assign
      list.forEach(item => obj[item.id] = item[name])
    }
    return obj
  },
  getMapBydict(dictArr) {
    const newObj = {}
    for (const item of dictArr || []) {
      newObj[item.value] = item.name
    }
    return newObj
  },
  rowAddDelete(type, index, sourseArrName, addRow, _this) { // 数组行增加与删除
    debugger
    if (type === 'add') {
      _this[sourseArrName].push(addRow)
    } else {
      _this[sourseArrName].splice(index, 1)
    }
    _this.setState({}[sourseArrName] = [])
    _this.setState({}[sourseArrName] = _this[sourseArrName])
  },
  toTreeSelect(item) { // 转化下拉树数据
    item.title = item.name
    item.value = item.id
    item.key = item.id
    item.children = item.dictList
    if (item.dictList instanceof Array && item.dictList.length > 0) {
      item.children.forEach(item => this.toTreeSelect(item))
    }
  },
  unique(arr) {
    // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
    return arr.filter(function(item, index) {
      return arr.indexOf(item, 0) === index
    })
  },
  renderMenuTree(array = []) { // 渲染菜单树
    array.forEach(item => {
      item.title = item.name
      item.value = item.id
      item.key = `${item.code}-${item.nodeId}`
      if (item.children && item.children.length > 0) {
        this.renderMenuTree(item.children)
      }
    })
  },
  forEachTree(array = [], callback) { // 遍历节点树
    array.forEach(item => {
      callback(item)
      if (item.children && item.children.length > 0) {
        this.forEachTree(item.children, callback)
      }
    })
  },
  renderDisabledZoneAndBuildTree(array) { // 渲染菜单树  区和楼栋不可点击
    array.forEach(item => {
      item.title = item.name
      item.value = item.id
      item.key = `${item.code}-${item.nodeId}`
      item.disabled = true
      if (item.type === 'BuildingUnit') {
        item.disabled = false
      }
      if (item.children && item.children.length > 0) {
        this.renderDisabledZoneAndBuildTree(item.children)
      }
    })
  },
  // 列表数据转化为表格树
  listToTableTree(sourceArr, parentId) {
    const temp = []
    const treeArr = sourceArr
    parentId = parentId || 0
    treeArr.forEach((item, index) => {
      // debugger;
      if (item.parentId === parentId) {
        if (this.listToTableTree(treeArr, treeArr[index].id).length > 0) {
          // 递归调用此函数
          treeArr[index].children = this.listToTableTree(treeArr, treeArr[index].id)
        }
        temp.push(treeArr[index])
      }
    })
    return temp
  },
  // 数组排序
  arraySort(array, sortName) {
    let newArr = []
    if (array instanceof Array) {
      newArr = [...array]
      for (let i = 0; i < newArr.length; i++) {
        for (let j = i + 1; j < newArr.length; j++) {
          // debugger;
          if (newArr[i][sortName] > newArr[j][sortName]) {
            const temp = newArr[i]
            newArr[i] = newArr[j]
            newArr[j] = temp
          }
        }
      }
    }
    // debugger;
    return newArr
  }
}

