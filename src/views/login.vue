<template>
<div class="loginContainer">
    <div class="loginBox">
        <Row class="loginRow" type="flex" justify="center" align="middle">
            <Col span="8">
            <Card style="width:500px;" dis-hover>
                <Row justify="center">
                    <Col span="24">
                    <h3>身份验证</h3>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col span="16">
                    <Form ref="loginForm" :model="loginForm" :rules="loginRule">
                        <FormItem prop="username">
                            <Input type="text" size="large" v-model="loginForm.username" placeholder="请输入用户名" clearable>
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" size="large" v-model="loginForm.password" placeholder="请输入密码" clearable>
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                       
                          <div>
                            <div class="refreshHeader">
                                <span>请点击下图中所有的：{{verifi.type}}</span>
                                <a @click="refreshVerifi()" href="javascript:void(0)" class="refreshA">刷新
                                  <i class="refreshImage"></i>
                                </a>
                            </div>
                            <ul class="ulTemp">
                                <template v-for="item in verifi.images">
                                    <li @click="item.selected=!item.selected">
                                        <img :src="item.imgUrl" alt="">
                                        <i :class="item.selected?'verifi-selected':'verifi-unselected'"></i>
                                    </li>
                                </template>
                            </ul>
                        </div>

                        <FormItem class="buttonLogin">
                            <Button type="primary" @click="handleSubmit('loginForm')">登录</Button>
                            <span class="buttonOut"></span>
                            <Button @click="forgetPassword()">忘记密码</Button>
                        </FormItem>
                    </Form>
                    </Col>

                </Row>

            </Card>
            </Col>
        </Row>
    </div>
    <div class="footer">
        Copyright @ 佛山欧神诺陶瓷有限公司
        <a href="http://www.beian.miit.gov.cn/" target="_blank"> 粤ICP备05023401号-2</a>
    </div>
</div>
</template>

<script>
import { login, getLoginInfo } from "@/api/api.js";
import * as tools from "@/libs/tools.js";
import { getVerifiImage } from "@/api/login.js";
import { Base64 } from "js-base64";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        verifi: []
      },
      loginRule: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      verifi: {
        images: [],
        type: ""
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          //获取选中的验证码
          this.loginForm.verifi = [];
          this.verifi.images.forEach(item => {
            if (item.selected) {
              this.loginForm.verifi.push(item.id);
            }
          });
          if (this.loginForm.verifi.length == 0) {
            this.$Message.warning("请选择验证码");
            return;
          }
          login(this.loginForm).then(res => {
            if (res.data.code === 200) {
              let token = res.data.data;
              this.$store.dispatch("setToken", token);
              localStorage.setItem("jwttoken", token); //本地存储token,防止刷新页面后需要重新登录
              //判断是否需要回到登录前访问页面
              let redirect = tools.getQueryString("redirect");
              if (redirect) {
                //存在重定向参数则跳到重定向指定页面
                this.$router.push({
                  path: redirect,
                  query: { announceFlag: true }
                });
              } else {
                this.$router.push({
                  name: "loginUserInfo",
                  params: { announceFlag: true }
                });
              }
            } else {
              this.refreshVerifi();
            }
          });
        }
      });
    },
    refreshVerifi() {
      getVerifiImage().then(response => {
        let _this = this;
        if (response.data.code == 200) {
          this.verifi.type = response.data.data.type;
          this.verifi.images = [];
          response.data.data.images.forEach(item => {
            let obj = {};
            obj.id = item.id;
            obj.imgUrl = item.imgUrl;
            obj.selected = false;
            this.verifi.images.push(obj);
          });
        }
      });
    },
    forgetPassword() {
      window.open("http://cas.osnyun.com:9081/oceanoPwdReset");
    }
  },
  created() {
    this.refreshVerifi();
  }
};
</script>

<style lang="less">
@import "../style/mixin";

.loginContainer {
  .loginBox {
    margin-top: 250px;

    .buttonLogin {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 24px;
      .buttonOut {
        display: inline-block;
        width: 10px;
      }
    }

    .refreshHeader {
      display: flex;
      justify-content: space-between;
       margin-bottom: 10px;
      .refreshA {
        display: inline-block;
        color: #ff7836; // margin-left: 102px;

        .refreshImage {
          display: inline-block;
          width: 14px;
          height: 14px;
          background: url("~@/assets/refresh.png") no-repeat;
          background-size: cover;
          position: relative;
          top: 2px;
        }
      }
    }
  }
}

.ulTemp {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  li {
    list-style-type: none;
    cursor: pointer;
    width: 65px;
    height: 65px;
    overflow: hidden;
    margin: 0 4px 4px 0;
    background: rgba(255, 255, 255, 0.8);
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }

    .verifi-selected {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      background: url("~@/assets/checked.png");
      background-size: cover;
      z-index: 100;
    }
  }
}
.footer {
  position: fixed;
  bottom: 10px;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 50px;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
