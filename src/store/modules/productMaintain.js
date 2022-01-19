
// 保存产品维护的数据
import lib from '@/utils/lib'
const state = {
  // 保存产品信息参数
  addProductParams: {
    productSaveMaterialParamList: [],
    productSaveMaterialAddParamList: []
  },
  // 每个tabs的数据
  MaterialParamList: {
  },
  MaterialAddParamList: {

  }
}

const mutations = {
  SET_ADDPRODUCTPARAMS: (state, data) => {
    // 如果是新增编辑需要清空原来的数据
    if (data === 'clear') {
      state.addProductParams.productSaveMaterialParamList = []
      state.addProductParams.productSaveMaterialAddParamList = []
      state.MaterialParamList = {}
      state.MaterialAddParamList = {}
    } else {
      // 清除原来选中的数据
      for (const key in data) {
        // 如果没有产品id用户新增字段名称不能保存进去
        if (key === 'productSaveMaterialParamList' || key === 'productSaveMaterialAddParamList') {
          const filterData = data[key].filter(item => item.productId)
          // 保存每个tabs的数据
          if (filterData.length > 0) {
            state.addProductParams[key] = []
            if (key === 'productSaveMaterialParamList') {
              state.MaterialParamList[filterData[0].parentMaterialType] = filterData
              for (const keys in state.MaterialParamList) {
                state.addProductParams[key].push(...state.MaterialParamList[keys])
              }
            } else if (key === 'productSaveMaterialAddParamList') {
              state.MaterialAddParamList[filterData[0].materialType] = filterData
              for (const keys in state.MaterialAddParamList) {
                state.addProductParams[key].push(...state.MaterialAddParamList[keys])
              }
            }
          }
          /*  else {
            state.addProductParams[key].push(...filterData)
          } */
          // 对象的所有属性相同去重
          state.addProductParams[key] = lib.arrayAllObjUnique(state.addProductParams[key])
        } else {
          state.addProductParams[key] = data[key]
        }
      }
    }
  }
}

const actions = {
  set_addproductparams({ commit }, data) {
    commit('SET_ADDPRODUCTPARAMS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
