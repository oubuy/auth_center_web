import * as types from '../types.js'

const state = {
  breadcrumbs:[{name:"首页"}]
}

const getters = {
  breadcrumbs: state => {
    return state.breadcrumbs
  }
}

const actions = {
  updateBreadcrumbs({commit},breadcrumbs){
    commit(types.SET_breadcrumbs, breadcrumbs)
  }
}

const mutations = {
  [types.SET_breadcrumbs](state, bcs) {
    state.breadcrumbs = bcs;
  }
}

export default {
  getters,
  state,
  mutations,
  actions
}
