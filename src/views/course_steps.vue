<template>
  <div id="hole">
      <div class="osn">
          <div class="list_steps people_managing" v-for="(item,index) in imgList" v-show="index+1==step">
              <div class="step_one">
                  <img :src="item.path" alt="">
                  <div class="button_box" :style="{top:item.topSide+'%',left: item.leftSide+'%'}">
                      <img src="../assets/guide/back.png" alt="" @click="back" class="back" v-show="step>1">
                      <img src="../assets/guide/next_step.png" alt="" @click="nextStep" v-show="step<imgList.length">
                      <img src="../assets/guide/skip.png" alt="" style="margin-left:10px;" v-show="step<imgList.length" @click="finish">
                      <img src="../assets/guide/finish.png" alt="" style="margin-left:10px;" @click="finish" v-show="step==imgList.length">
                  </div>
              </div>
          </div>
      </div>
      <div class="problems" v-show="showFlag&&index=='4'">
          <div class="problem_list" v-show="!pOne&&!pTwo">
            <div class="problem_one" @click="problemOne">
              <h2>一、 无法登录</h2>
              <div>创建客户、编辑客户、客户资料、订单详情、报价单等</div>
            </div>
            <div class="problem_one" @click="problemTwo">
              <h2>一、 无法打开软件</h2>
              <div>快速浏览瓷砖数据、生成订单</div>
            </div>
            <div class="code_box"><img src="../assets/guide/code.png" alt=""></div>
          </div>
          <div class="problem_detail" v-show="pOne">
            <h2 style="border-bottom: 1px solid #ccc;padding: 20px 0;">无法登录</h2>
            <p>1.登录账号使用<span>企信账号、密码</span></p>
            <p>2.如提示账号<span>密码错误，</span>请联系本经销商内的管理员在人员管理中重置密码，也可自己找回密码</p>
            <p>3.确认当前账号有相关门店的<span>管辖范围</span>，管理员账号在人员管理中查看</p>
            <div class="code_box"><img src="../assets/guide/problem_box.png" alt=""></div>
          </div>
          <div class="problem_detail" v-show="pTwo">
            <h2 style="border-bottom: 1px solid #ccc;padding: 20px 0;">无法打开软件</h2>
            <p>Ipad导购系统安装后，打开提示如图所示</p>
            <div class="code_box"><img src="../assets/guide/problem_img.png" alt=""></div>
            <div class="solve_way" style="margin-top: 10px;">
              <div style="margin-bottom: 10px;">解决方法:</div>
              <div>打开Ipad-设置-通用-描述文件与设备（或设备管理），点击选中Oceano的信息，同意授权即可</div>
            </div>
          </div>
          <div style="display: flex;justify-content: center;"><div class="go_back" @click="goBack" v-show="pOne||pTwo">返回</div></div>
      </div>
  </div>
</template>

<script>
    import { courseInfo } from "@/api/course.js";
  export default {
    data() {
      return {
        courseId: this.$route.query.courseId,
        index: this.$route.query.index,
        step: 1,
        pOne: false,
        pTwo: false,
        imgList: [],
        name: '',
        showFlag: false
      };
    },
    created() {

    },
    mounted() {
        this.courseInfo();
    },
    components: {

    },
    methods: {
        courseInfo() {
            courseInfo({courseId: this.courseId}).then(res=>{
                console.log(res);
                if(res.data.code == 200) {
                    let chapters = res.data.data.chapters;
                    chapters = chapters.sort(this.compare("seq"));
                    this.imgList = chapters[this.index].attachments;
                    this.imgList = this.imgList.sort(this.compare("seq"));
                    this.name = res.data.data.name;
                    if(this.name == "Ipad导购系统") this.showFlag = true;
                }
            });
        },
        compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        nextStep() {
            this.step+=1;
        },
        back() {
            this.step-=1;
        },
        finish() {
            window.close();
        },
        problemOne() {
          this.pOne = true;
        },
        problemTwo() {
          this.pTwo = true;
        },
        goBack() {
          this.pOne = false;
          this.pTwo = false;
        }
    },

  };
</script>
<style lang="less" scoped>
    body{
        font-family: 'SimHei';
        color: #515a6d;
        overflow: auto;
    }
    img{
        display: block;
        width: 100%;
    }
    .people_managing {
        .step_one{
            position: relative;
            .button_box{
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 25%;
                img{
                    cursor: pointer;
                    width: 30% !important;
                }
                .back{
                    width: 20% !important;
                }
            }
        }
        .back{
            height: 20px;
            margin-right: 30px;
            width: 20% !important;
        }
    }

    .problems {
      padding: 10px 20px;
      text-align: left;
      .problem_one{
        border-bottom: 1px solid #ccc;
        padding: 20px 0;
        cursor: pointer;
      }
      .code_box{
        width: 200px;
        height: 200px;
        margin-top: 20px;
        img{
          width: 100%;
        }
      }
    }

    .problem_detail{
      p{
        margin-top: 10px;
        span{
          color: orange;
        }
      }
      .code_box{
        width: 300px;
        margin-top: 20px;
        img{
          width: 100%;
        }
      }
    }

    .go_back {
      width: 100px;
      height: 40px;
      font-size: 20px;
      margin-top: 150px;
      cursor: pointer;
      text-align: center;
      border: 1px solid #999;
      line-height: 40px;
      border-radius: 10px;
    }
</style>
