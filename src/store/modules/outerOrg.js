import * as types from '../types.js'

const state = {
  treeLongId: '',
  refElement: '', //元素
  treeSelectedId: -1,
  treeExpandIds: [],
  recordParamsObj: {
    pageParentId: "",
    pageParentName: ""
  }
};
// getters
const getters = {
  treeLongId: state => {
    return state.treeLongId;
  },
  refElement: state => {
    return state.refElement;
  },
  statusParams:state=>{
       return state.recordParamsObj
  },
  treeSelectedId: satte => {
    return state.treeSelectedId;
  },
  treeExpandIds: satte => {
    return state.treeExpandIds;
  }

};

const actions = {
  recordTreeLongId({
    commit,
    state
  }, longId) {
    if (typeof (longId) == 'undefined') {

      commit(types.OUTER_TREE, '')
    } else {
      commit(types.OUTER_TREE, longId)
    }

  },
  recordElement({
    commit,
    state
  }, ele) {
    commit(types.OUTER_ELEMENT, ele)
  },
  setTreeSelectedId({
    commit,
    state
  }, id) {
    commit("treeSelectedId", id)
  },
  setTreeExpandIds({
    commit,
    state
  }, ids) {
    commit("treeExpandIds", ids)
  },
  setTreeStatus({
    commit,
    state
  }, data) {
    commit(types.RECORD_TREE, data)
  }


};

const mutations = {
  [types.OUTER_TREE](state, longId) {
    state.treeLongId = longId;
  },
  [types.OUTER_ELEMENT](state, ele) {
    state.refElement = ele;
  },
  treeSelectedId(state, id) {
    state.treeSelectedId = id
  },
  treeExpandIds(state, ids) {
    state.treeExpandIds = ids
  },
  [types.RECORD_TREE](state, data) {
    state.recordParamsObj.pageParentId = data.pageParentId;
    state.recordParamsObj.pageParentName = data.pageParentName;

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
