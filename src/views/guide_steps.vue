<template>
  <div id="hole">
      <div class="osn" v-if="system=='osn'">
          <div class="list_steps people_managing">
              <div class="step_one">
                  <img :src="getUrl(step)" alt="">
                  <div class="button_box" :style="{top:styleList1[index][step-1].top,left:styleList1[index][step-1].left}">
                      <img src="../assets/guide/back.png" alt="" @click="back" class="back" v-show="step>1">
                      <img src="../assets/guide/next_step.png" alt="" @click="nextStep" v-show="step<allStep">
                      <img src="../assets/guide/skip.png" alt="" style="margin-left:10px;" v-show="step<allStep" @click="finish">
                      <img src="../assets/guide/finish.png" alt="" style="margin-left:10px;" @click="finish" v-show="step==allStep">
                  </div>
              </div>
          </div>
      </div>
      <div class="ipad" v-if="system=='ipad'&&index!='4'">
          <div class="list_steps people_managing">
              <div class="step_one">
                  <img :src="getUrl(step)" alt="">
                  <div class="button_box" :style="{top:styleList2[index][step-1].top,left:styleList2[index][step-1].left}">
                      <img src="../assets/guide/back.png" alt="" @click="back" class="back" v-show="step>1">
                      <img src="../assets/guide/next_step.png" alt="" @click="nextStep" v-show="step<allStep">
                      <img src="../assets/guide/skip.png" alt="" style="margin-left:10px;" v-show="step<allStep" @click="finish">
                      <img src="../assets/guide/finish.png" alt="" style="margin-left:10px;" @click="finish" v-show="step==allStep">
                  </div>
              </div>
          </div>
      </div>
      <div class="problems" v-show="system=='ipad'&&index=='4'">
          <!-- <img src="../assets/guide/problems1.jpg" alt="">
          <img src="../assets/guide/problems2.jpg" alt="">
          <img src="../assets/guide/problems3.jpg" alt=""> -->
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
  export default {
    data() {
      return {
        step: 1,
        allStep: this.$route.query.step,
        styleList1: [[{
            top:'42%',
            left:'23%'
        },{
            top:'56%',
            left:'26%'
        },{
            top: '83%',
            left: '45%'
        },{
            top: '58%',
            left: '33%'
        }],[{
            top:'48%',
            left:'24%'
        },{
            top:'63%',
            left:'19%'
        },{
            top: '68%',
            left: '36%'
        },{
            top: '93%',
            left: '63.5%'
        },{
            top: '89%',
            left: '54%'
        },{
            top: '46%',
            left: '73%'
        }],[{
            top:'48%',
            left:'22%'
        },{
            top:'56%',
            left:'22%'
        },{
            top: '73%',
            left: '31.5%'
        }],[{
            top:'55%',
            left:'21%'
        },{
            top:'55%',
            left:'22%'
        },{
            top: '73%',
            left: '25.5%'
        },{
            top: '64%',
            left: '36%'
        }],[{
            top:'60%',
            left:'20.5%'
        },{
            top:'56%',
            left:'22%'
        },{
            top: '89%',
            left: '28.5%'
        }],[{
            top:'64%',
            left:'22%'
        },{
            top:'55%',
            left:'28%'
        }]],
        styleList2: [[{
            top:'88%',
            left:'44.5%'
        },{
            top:'50%',
            left:'59%'
        },{
            top: '48%',
            left: '60%'
        },{
            top: '38%',
            left: '60.5%'
        },{
            top:'85%',
            left:'57.5%'
        },{
            top:'87%',
            left:'48.5%'
        }],[{
            top:'88%',
            left:'53%'
        },{
            top:'52%',
            left:'29%'
        },{
            top: '69%',
            left: '59.2%'
        },{
            top: '78%',
            left: '60.2%'
        },{
            top: '67%',
            left: '32.5%'
        },{
            top: '83%',
            left: '59%'
        }],[{
            top:'70%',
            left:'63.5%'
        },{
            top:'52%',
            left:'27.5%'
        },{
            top: '52%',
            left: '43.5%'
        },{
            top: '90%',
            left: '63%'
        }],[{
            top:'53%',
            left:'63.5%'
        },{
            top:'52%',
            left:'27.5%'
        },{
            top: '52%',
            left: '43.5%'
        },{
            top: '81%',
            left: '31%'
        },{
            top: '85%',
            left: '34%'
        }]],
        system: this.$route.query.system,
        index: this.$route.query.index,
        pOne: false,
        pTwo: false
      };
    },
    created() {

    },
    mounted() {

    },
    components: {

    },
    methods: {
        getUrl(step) {
            if(this.system=='osn') {
                if(this.index==0) return require('@/assets/guide/people_manage'+step+'.jpg');
                else if(this.index==1) return require('@/assets/guide/store_goods'+step+'.jpg');
                else if(this.index==2) return require('@/assets/guide/buildings_manage'+step+'.jpg');
                else if(this.index==3) return require('@/assets/guide/layouts_manage'+step+'.jpg');
                else if(this.index==4) return require('@/assets/guide/cases_manage'+step+'.jpg');
                else if(this.index==5) return require('@/assets/guide/webs_building'+step+'.jpg');
            }else if(this.system=='ipad') {
                if(this.index==0) return require('@/assets/guide/customer_manage'+step+'.jpg');
                else if(this.index==1) return require('@/assets/guide/products'+step+'.jpg');
                else if(this.index==2) return require('@/assets/guide/fit_up_cases'+step+'.jpg');
                else if(this.index==3) return require('@/assets/guide/village_buildings'+step+'.jpg');
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
                width: 25%;
                img{
                    cursor: pointer;
                    width: 30% !important;
                }
                .back{
                    width: 16% !important;
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
