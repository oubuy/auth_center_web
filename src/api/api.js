// import axios from '@/api/axios'
import axios from 'axios'

//用户登录
export function login(params){
    return axios.post("/rest/login",params);
}

//获取个人菜单
export function getMenu(params){
  return axios.get('/rest/menu', {
    params: params
  })
}

//获取jwttoken（已进行cas登录）
// export function getToken(){
//   return axios.get('jwt-token')
// }

//获得登录信息
export function getLoginInfo(){
  return axios.get('/rest/login-info')
}

// 修改密码
export function changePassword(params) {
  return axios({
    method: 'post',
    url: '/rest/changePassword',
    data: require('qs').stringify(params)
  });
}

//获得聚客宝系统的token
export function getJukebaoToken(){
  return axios.get('/rest/jukebao/token')
}