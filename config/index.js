'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

/*
接口调用环境 test/local/other
*/
const env = 'test'
// const loaclServerIP="http://10.16.11.27";  //本地开发环境IP
const loaclServerIP="http://10.16.11.23";
// const loaclServerIP="http://10.16.11.28";
const localBuildPort="8000";
// const localModityPort="8093"; //开发环境商品中心端口
// const localModityPort="8091";
const localModityPort="8083";
// const localBuildPort="8096"; //开发环境楼盘中心端口
const authPort="8091"; //开发环境权限中心端口
/*****************************/


const testServerIP="http://edasapp.osnyun.com";   //测试服务器IP
var modityURL   //商品中心地址
var buildURL  //楼盘中心地址
var authURL  //权限中心地址
if(env == 'test'){ //测试环境
  modityURL = testServerIP + ":" +"8081/";
  buildURL = testServerIP + ":" +"8082/";
  authURL = testServerIP + ":" +"8085/";
}else if(env == 'local'){  //本地环境
  modityURL = loaclServerIP + ":"+ localModityPort+"/";
  buildURL = loaclServerIP + ":"+localBuildPort +"/";
  authURL = loaclServerIP + ":" +authPort+"/";
}else{   //自定义配置
  modityURL = loaclServerIP + ":" +"8093/";
  buildURL = testServerIP + ":" +"8082/";
  authURL = testServerIP + ":" +"8085/";
}


module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/common': {

        target: authURL,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },
      '/rest': {

        target: authURL,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },

      // 楼盘中心 ue4管理
      '/build-rest': {
        target:buildURL,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },

      // 公告管理
      '/notice': {
        target: modityURL,
        changeOrigin: true,
        pathRewrite: {
          '': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },

      //基础数据
      '/basicData': {
        target: modityURL,
        changeOrigin: true,
        pathRewrite: {
          '^/basicData/': '/rest/basicData/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },

      // 门店
      '/modity/': {
        target: modityURL,
        changeOrigin: true,
        pathRewrite: {
          '^/modity/': '/rest/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },
      // 门店
      '/modity-fileUpload/': {
        target: modityURL,
        //  target: 'http://edasapp.osnyun.com:8081/',
        changeOrigin: true,
        pathRewrite: {
          '^/modity-fileUpload/': '/file/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      },


    '/modity-download/':{
     target: modityURL,
      // target: 'http://edasapp.osnyun.com:8081/',
     changeOrigin: true,
     pathRewrite: {
       '^/modity-download/':'/downLoad/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
     }
    },
    '/modity-ue/':{
      target: modityURL,
      changeOrigin: true,
      pathRewrite:{
        '^/modity-ue/':'/build-rest/'
      }
    },
    '/modity-ueScence/':{
      target: modityURL,
      changeOrigin: true,
      pathRewrite:{
        '^/modity-ueScence/':'/build-rest/'
      }
    },
   },



    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 9090, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build:{
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.htm'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
