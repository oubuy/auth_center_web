import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import app from './modules/app.js'
import address from './modules/address.js'
import outerOrg from './modules/outerOrg.js'
import dlearStore from './modules/store.js'
import modityAttibute from './modules/category.js'
import dealerModity from './modules/dealerModity.js'

import test from './modules/test.js'


Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
  modules: {
    app,
    user,
    address,
    test,
    outerOrg,
    dlearStore,
    modityAttibute,
    dealerModity
  },
  strict: debug
})
