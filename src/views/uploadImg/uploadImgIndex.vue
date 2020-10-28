<template>
  <div class="mescroll-touch-y">
    <div>
      <div style="position: fixed;top: 2%;z-index: 10;width: 92%;left: 50%;margin-left: -46%;" @click="goUpload">
        <van-button type="default" size="large" block style="height: 1rem;font-size: .36rem;">上传</van-button>
      </div>
      <div style="padding: 1.5rem .8rem 0;">
        <van-divider :style="{fontSize: '.36rem'}">我的上传</van-divider>
      </div>
      <div class="img_list">
        <!--滑动区域-->
        <div id="mescroll" class="mescroll">
          <div>
            <!--内容...-->
            <div class="img_item" v-for="(item,index) in imgList" @click="goEdit(item.id,item.audit_status)" :key="item.id">
              <div class="img_box" style="margin: 0 .2rem 0;padding-top: .2rem;" @click.stop="goEdit(item.id,item.audit_status)">
                <van-image width="100%" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,h_500,w_500/quality,q_80'" />
              </div>
              <div style="padding: 0 .2rem .2rem;font-size: .36rem;position: relative;">
                <div class="content">
                  <div class="label">小区名称：</div>
                  <div class="name">{{item.building_name}}</div>
                </div>
                <div class="content">
                  <div class="label">风格：</div>
                  <div class="name">{{item.style_name}}</div>
                </div>
                <div class="content">
                  <div class="label">更新时间：</div>
                  <div class="name">{{item.update_time}}</div>
                </div>
                <div class="content" v-if="item.audit_status!=-1">
                  <div class="label">评审状态：</div>
                  <div class="name">{{item.audit_status_text}}</div>
                </div>
                <div class="content" style="display: flex;justify-content: space-between;">
                  <div class="" style="display: flex;">
                    <span class="label">得分：</span>
                    <van-rate v-model="item.starValue" allow-half size="17" readonly/>
                    <span style="padding-left: .4rem;">{{item.score}}</span>
                  </div>
                  <div @click.stop="deleteItem(item.id)" v-if="item.audit_status==-1||item.audit_status==2">
                    <van-icon class="iconfont" class-prefix='icon' name='ashbin' size=".7rem" />
                  </div>
                </div>
                <div class="submit_button" @click.stop="submit(item.id,item.imageUrl,item.audit_status)" v-if="item.audit_status!=1">
                  <van-button type="info" size="large" block style="height: 1rem;font-size: .36rem;">{{item.audit_status==0?"取回修改":"提交评审"}}</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-loading :showPage="showPage" :submitFlag="submitFlag"></v-loading>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  import MeScroll from 'mescroll.js'
  import 'mescroll.js/mescroll.min.css'
  import {
    findMySceneProgramme,
    deleteMySceneProgramme,
    submitAudit,
    backModify
  } from "@/api/uploadImg.js";
  import {
    ImagePreview,
    Dialog
  } from "vant";
  export default {
    data() {
      return {
        showPage: false,
        submitFlag: false,
        page: 0,
        rows: 10,
        fileList: [],
        imgList: [],
        previewList: []
      }
    },
    components: {},
    created() {},
    mounted() {
      this.mescrollInit();
    },
    methods: {
      mescrollInit() {
        var self = this;
        self.mescroll = new MeScroll("mescroll", { //请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
          up: {
            callback: self.findMySceneProgramme, //上拉回调
            //以下参数可删除,不配置
            isBounce: true, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            page: {
              size: 5,
              num: 0
            }, //可配置每页8条数据,默认10
            lazyLoad: {
              use: true // 是否开启懒加载,默认false
            },
            htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
            noMoreSize: 1,
            empty: {
              //列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
              warpId: "mescroll", //父布局的id (1.3.5版本支持传入dom元素)
              tip: "暂无相关数据" //提示
            }
          },
          down: {
            use: false
          }
        });
      },
      findMySceneProgramme(page, mescroll) {
        let param = {
          page: page.num,
          rows: page.size
        }
        findMySceneProgramme(param).then(res => {
          this.showPage = true;
          if (res.data.code == 200) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              res.data.data.list[i].update_time = res.data.data.list[i].update_time.substring(0, 10);
              this.previewList.push(res.data.data.list[i].imageUrl);
              if (res.data.data.list[i].audit_status == 0) res.data.data.list[i].audit_status_text = "待评审";
              else if (res.data.data.list[i].audit_status == 1) res.data.data.list[i].audit_status_text = "评审通过";
              else if (res.data.data.list[i].audit_status == 2) res.data.data.list[i].audit_status_text = "评审不通过";
              if(res.data.data.list[i].score>0&&res.data.data.list[i].score<20) {
                res.data.data.list[i].starValue = 0.5;
              }else if(res.data.data.list[i].score>=20&&res.data.data.list[i].score<30) {
                res.data.data.list[i].starValue = 1;
              }else if(res.data.data.list[i].score>=30&&res.data.data.list[i].score<40) {
                res.data.data.list[i].starValue = 1.5;
              }else if(res.data.data.list[i].score>=40&&res.data.data.list[i].score<50) {
                res.data.data.list[i].starValue = 2;
              }else if(res.data.data.list[i].score>=50&&res.data.data.list[i].score<60) {
                res.data.data.list[i].starValue = 2.5;
              }else if(res.data.data.list[i].score>=60&&res.data.data.list[i].score<70) {
                res.data.data.list[i].starValue = 3;
              }else if(res.data.data.list[i].score>=70&&res.data.data.list[i].score<80) {
                res.data.data.list[i].starValue = 3.5;
              }else if(res.data.data.list[i].score>=80&&res.data.data.list[i].score<90) {
                res.data.data.list[i].starValue = 4;
              }else if(res.data.data.list[i].score>=90&&res.data.data.list[i].score<100) {
                res.data.data.list[i].starValue = 4.5;
              }else if(res.data.data.list[i].score>=100) {
                res.data.data.list[i].starValue = 5;
              }
            }
            this.imgList = this.imgList.concat(res.data.data.list);
            this.mescroll.endSuccess(this.imgList.length, res.data.data.hasNextPage); //必传参数(当前页的数据个数, 是否有下一页true/false)
          } else {
            this.mescroll.endErr();
          }
        }).catch(e => {
          this.mescroll.endErr();
        })
      },
      previewImg(i) {
        // ImagePreview(this.previewList, i);
      },
      goUpload() {
        this.$router.push({
          path: '/uploadImgDetail'
        });
        localStorage.removeItem("id");
        localStorage.removeItem("readonly");
      },
      goEdit(id, status) {
        let readonly = false;
        if (status == 1 || status == 0) readonly = true;
        this.mescroll.setBounce(true);
        this.$router.push({
          path: '/uploadImgDetail',
          query: {
            id: id,
            readonly: readonly
          }
        });
        localStorage.setItem("id", id);
        localStorage.setItem("readonly", readonly);
      },
      deleteItem(id) {
        this.$dialog.confirm({
            title: '删除实景图',
            message: '确定删除该实景图吗？',
          })
          .then(() => {
            // on confirm
            deleteMySceneProgramme(id).then(res => {
              if (res.data.code == 200) {
                let childEl = document.getElementsByClassName("mescroll-upwarp")[0];
                if (childEl) childEl.parentNode.removeChild(childEl);
                this.$toast(res.data.msg);
                this.page = 0;
                // this.findMySceneProgramme();
                this.imgList = [];
                this.previewList = [];

                this.mescrollInit();
              }
            })
          })
          .catch(() => {
            // on cancel
          });
      },
      submit(id, imageUrl, status) {
        if (status == 0) {
          backModify(id).then(res => {
            console.log(res);
            if(res.data.code==200) {
              this.imgList = [];
              let childEl = document.getElementsByClassName("mescroll-upwarp")[0];
              if (childEl) childEl.parentNode.removeChild(childEl);
              Dialog.alert({
                message: '取回修改成功，现可对该案例进行修改',
              }).then(() => {
                // on close
              });
              this.mescrollInit();
            }
          });
        } else {
          if (!imageUrl) {
            this.$toast("该实景案例尚未上传空间图片，请上传后再提交评审");
            return;
          }
          this.submitFlag = true;
          submitAudit(id).then(res => {
            this.submitFlag = false;
            if (res.data.code == 200) {
              this.imgList = [];
              let childEl = document.getElementsByClassName("mescroll-upwarp")[0];
              if (childEl) childEl.parentNode.removeChild(childEl);
              this.$toast(res.data.msg);
              this.mescrollInit();
            }
          })
        }
      }
    }
  }
</script>
<style scoped>
  .mescroll {
    position: fixed;
    top: 3rem;
    bottom: 0;
    width: 100%;
    height: auto;
    left: 0;
    padding: 0 .4rem;
  }

  .mescroll::-webkit-scrollbar {
    display: none;
  }

  .img_list {
    padding: 0 .8rem;
    color: #333;
    font-size: .36rem;
  }

  .img_item {
    box-shadow: rgb(153, 153, 153) 0px 0px 2px;
    margin-bottom: .6rem;
    margin-top: .1rem;
  }

  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: .2rem 0;
  }

  .submit_button{
    margin-top: .5rem;
  }

  .label{
    width: 2rem;
    text-align: left;
  }

  .name{
    width: 6.6rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: left;
  }
</style>
