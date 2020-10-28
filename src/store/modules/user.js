import * as types from '../types.js'
import { Base64 } from 'js-base64';

// initial state
const state = {
  token: localStorage.getItem('jwttoken')||"",
  loginInfo:JSON.parse(localStorage.getItem('loginInfo'))
//   loginInfo:JSON.parse(localStorage.getItem('loginInfo'))||{
//     username:"",
//     realName:"",
//     userId:"",
//     comId:"",
//     comName:"",
//     orgId:"",
//     orgName:"",
//     reportTo:""
//     // position:"",
//     // userManagementOrgList:[],
//     // gender:'',
//     // staffCode:'',//工号
//     // mobile:'',
//     // areaCode:'',//区号
//     // telephoneCode:'',//号码
//     // extensionCode:'',//分机号
//     // phoneShort:'',//短号
//
//   }
}

// getters
const getters = {
  loginInfo: state => {
    return state.loginInfo
  },
  token: state => {
    return state.token
  }
}

//actions
const actions = {
  setToken({commit},token){
    commit(types.SET_TOKEN, token)
  },
  setLoginInfo({commit},loginInfo){
    commit(types.SET_LOGIN_INFO, loginInfo)
  },
  logout({commit}){
    commit(types.CLEAR_TOKEN, "")
    commit(types.SET_LOGIN_INFO, {
      username:"",
      realName:"",
      userId:"",
      comId:"",
      comName:"",
      orgId:"",
      orgName:"",
      reportTo:""
      // position:"",
      // 后面新增的
      // userManagementOrgList:[],
      // gender:'',
      // staffCode:'',//工号
      // mobile:'',//手机号
      // areaCode:'',//区号
      // telephoneCode:'',//号码
      // extensionCode:'',//分机号
      // phoneShort:'',//短号

    })
  },
}

// mutations
const mutations = {
  [types.CLEAR_TOKEN](state, token){
    state.token = "";
  },
  [types.SET_TOKEN](state, token) {
    state.token = token;
    //解析token载荷
    // console.log(token,'token');
    // let payload = JSON.parse(Base64.decode(token.split(".")[1]));
    // console.log(payload,'payload');
    // // let payloadInfo = Base64.decode(payload);
    // // console.log(payloadInfo,'payloadInfo');
    // state.loginInfo = {
    //   username:payload.username,
    //   realName:payload.realName,
    //   userId:payload.userId,
    //   comId:payload.comId,
    //   comName:payload.comName,
    //   orgId:payload.orgId,
    //   orgName:payload.orgName,
    //   reportTo:payload.reportTo
    // }
  },
  [types.SET_LOGIN_INFO](state,loginInfo){
    state.loginInfo = loginInfo;
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
