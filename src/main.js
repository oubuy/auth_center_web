// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill";
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'iview/dist/iview.js'
Vue.use(iView)

// import ViewUI from 'view-design';

// // import style
// import 'view-design/dist/styles/iview.css';

// Vue.use(ViewUI);

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
    Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
  })

import ZkTable from 'vue-table-with-tree-grid'
import * as types from '@/store/types.js'
import axios from 'axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '@/assets/icon_font/iconfont.css'
import Vant from 'vant';
import 'vant/lib/index.css';
// require styles
Vue.use(Vant)
Vue.use(VueAwesomeSwiper)

// import  'lib-flexible'
import test from './views/dealer/test.vue'
import orgColoms from './views/admin/outer/orgColums.vue'
// import roleColoms from './views/admin/role/roleColums.vue'
import showInfoTableColums from './views/admin/role/showInfoTableColums.vue'
import storeColums from './views/admin/store/storeColums.vue'
import storePrices from './views/admin/store/store-priceVo2.vue'
import storeName from './views/admin/store/store-nameModel.vue'
import storePhysicalColums from './views/admin/store/store-physicalColums.vue'

import dealerStorePrices from './views/dealer/store/store-priceVo2.vue'
import dealerStoreColums from './views/dealer/store/storeColums.vue'
import dealerStoreEditPriceColums from './views/dealer/store/storeEditPriceColums.vue'
import dealerStoreEditPriceTwoColums from './views/dealer/store/storeEditPriceTwoColums.vue'
import dealerStorePhysicalImgColums from './views/dealer/store/store-physicalColums.vue'

import categoryColums from './views/admin/category/category-colums.vue'
import vLoading from './components/loading.vue'
// import VueDND from 'awe-dnd'

// Vue.use(VueDND)
import vueDrag from 'vue-dragging'
Vue.use(vueDrag)
// Vue.prototype.$axios = axios
Vue.prototype.GLOBAL_TYPES = types

Vue.use(ZkTable)
Vue.config.productionTip = false






// 注册
Vue.component('test', test)
Vue.component('orgColoms', orgColoms)
// Vue.component('roleColoms', roleColoms)
Vue.component('showInfoTableColums', showInfoTableColums)
Vue.component('storeColums', storeColums)
Vue.component('storePrices', storePrices)
Vue.component('storeName', storeName)
Vue.component('storePhysicalColums', storePhysicalColums)

Vue.component('dealerStorePrices', dealerStorePrices)
Vue.component('dealerStoreColums', dealerStoreColums)
Vue.component('dealerStoreEditPriceColums', dealerStoreEditPriceColums)
Vue.component('dealerStoreEditPriceTwoColums', dealerStoreEditPriceTwoColums)
Vue.component('dealerStorePhysicalImgColums', dealerStorePhysicalImgColums)
Vue.component('categoryColums', categoryColums)
Vue.component('vLoading',vLoading)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

//设置请求拦截，统一设置jwttoken到头部
axios.interceptors.request.use(function(config){
    let url = config.url;
    if(url==="/rest/login"){
        localStorage.setItem('jwttoken',"");
        config.headers.Authorization = "";
    }else{
        config.headers.Authorization =localStorage.getItem("jwttoken");
    }
    return config;
},function(err){
    return Promise.reject(err);
});
//设置响应拦截，进行错误提示
axios.interceptors.response.use(function(res){
  // console.log(res,"main.js axios-response")
    if(res.data.code===401){
      iView.Message.warning(res.data.msg);

      //this.$store.dispatch('logout');
      localStorage.removeItem("jwttoken");
      localStorage.removeItem("loginInfo");

      router.push({
        name: "login"
      });
    }
    if(res.data.code===500){
      iView.Message.error(res.data.msg);
    }
    return res;
},function(err){
    return err;
});
