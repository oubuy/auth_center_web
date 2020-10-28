import * as types from '../types.js'

const state={
    mainInfoImgParams:{},//主图
    infoImgParams:{}//纹理图
};

const getters={
  
};

const actions={
     editMainImg({commit,state},data){
         console.log(data,'actions')
        commit(types.DEALERMODITY,data)
     }
};

const mutations={
    [types.DEALERMODITY](state,data){
           console.log(data,'vuex');
           state.mainInfoImgParams=data;
    }
}






export default{
    state,
    getters,
    actions,
    mutations
}