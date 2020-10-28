import * as types from '../types.js'
const state = {
  dataArr: [], //价格片
  priceVo2Arr: [], //价格方

}

const getters = {
  dataArr: state => {
    return state.dataArr
  },
  priceVo2Arr: state => {
    return state.priceVo2Arr;
  },

}

const actions = {
  recordEditColums({
    commit,
    state
  }, columsParams) {
    commit(types.EDITCOLUMS, columsParams)
  },
  recordPriceVo2({
    commit,
    state
  }, columsParams) {
    commit(types.EDITPRICESVO, columsParams)
  }

}

const mutations = {
  [types.EDITCOLUMS](state, columsParams) { //批量修改价格片
    let dataTemp = [];
    for (var j = 0; j < columsParams.length; j++) {
      let obj = {};
      obj.id = columsParams[j].id;
      obj.modityId = columsParams[j].modityId;
      if (columsParams[j].numberPriceValue!=null) {
        obj.numberPriceValue = columsParams[j].numberPriceValue;
      } else if (columsParams[j].activePriceValue!=null) {
        obj.activePriceValue = columsParams[j].activePriceValue;
      }
      dataTemp.push(obj)
    }
    let resultObj = Object.assign(...dataTemp, {});
    state.dataArr.push(resultObj)
  },
  [types.EDITPRICESVO](state, columsParams) { //批量修改价格方
    let dataTemp = [];
    for (var j = 0; j < columsParams.length; j++) {
      let obj = {};
      obj.id = columsParams[j].id;
      obj.modityId = columsParams[j].modityId;
      if (columsParams[j].numberPriceTwoValue!=null) {
        obj.numberPriceTwoValue = columsParams[j].numberPriceTwoValue;
      } else if (columsParams[j].activePriceTwoValue!=null) {
        obj.activePriceTwoValue = columsParams[j].activePriceTwoValue;
      }
      dataTemp.push(obj)
    }
    let resultObj = Object.assign(...dataTemp, {});
    state.priceVo2Arr.push(resultObj)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
