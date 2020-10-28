import * as types from '../types.js'

const state = {
  dataCategoryArr: [],
};

const getters = {
  dataCategoryArr: state => {
    return state.dataCategoryArr
  },
};

const actions = {
  handleRecordCategorySort({
    commit,
    state
  }, columsParams) {
    console.log(columsParams, 'vuex')
    commit(types.CATEMODITYATTRIBUTE, columsParams)
  }
};

const mutations = {
  [types.CATEMODITYATTRIBUTE](state, columsParams) {
    if (columsParams.length != 0) {
      let dataTemp = [];
      for (var j = 0; j < columsParams.length; j++) {
        let obj = {};
        obj.id = columsParams[j].id;
        if (columsParams[j].sortValue) {
          obj.sortValue = columsParams[j].sortValue;
        } else {
          obj.sortValue = 0;
        }
        dataTemp.push(obj)
      }

      dataTemp.forEach(item => {
        state.dataCategoryArr.push(item)
      })
    }else{
      state.dataCategoryArr=[];
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
