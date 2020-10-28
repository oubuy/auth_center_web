import * as types from '../types.js';


const state={
    // 测试url
    userInfo:{
        testId:'',
        testName:''
    }
}

const getters={
    userInfo:state=>{
        return state.userInfo;
    }
}

const actions={
    changeParmas({commit,state},userParams){
        localStorage.setItem('routerParams',userParams);
        commit(types.RUTER_PARAMS,userParams)
    },
    updateParams({commit,state},uploadParams){
      commit(types.UPDATE_PARAMS,uploadParams)
    }

}

const mutations={
    [types.RUTER_PARAMS](state,userParams){
        if(userParams){
            state.userInfo=userParams;
        }else{
            state.userInfo=localStorage.getItem('routerParams');
        }
    },
    [types.UPDATE_PARAMS](state,uploadParams){
      console.log(state,'url',uploadParams)
      state.userInfo=uploadParams;
    }
}

export default{
    state,
    getters,
    actions,
    mutations
}