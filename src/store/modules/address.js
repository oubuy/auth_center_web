import * as types from '../types.js'

const state={
    addressInfo:{
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        districtCode: "",
        districtName: "",
    }
};

const getters={
    addressInfo:state=>{
        return state.addressInfo
    }
};

const actions={
    recordAddress({commit,state},address){
       commit(types.ADDRESS,address)
    }
};

const mutations={
    [types.ADDRESS](state,address){
        //    console.log(address,'vuex');
           state.addressInfo=address;
    }
}

export default{
    state,
    getters,
    actions,
    mutations
}