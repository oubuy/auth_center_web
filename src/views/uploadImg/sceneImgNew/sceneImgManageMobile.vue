<template>
  <div class="mescroll-touch-y">
    <div>
      <div class="img_list">
        <!--滑动区域-->
        <div id="mescroll" class="mescroll">
          <div>
            <!--内容...-->
            <div class="img_item" v-for="(item,index) in imgList" @click="goEdit(item.id)" :key="item.id">
              <div class="img_box" @click.stop="goEdit(item.id)">
                <!-- <van-image width="100%" fit="contain" :src="item.imgUrl+'?x-oss-process=image/resize,h_500,w_500/quality,q_80'"
                  style="border-radius: 5px;" /> -->
                <img :src="item.imgUrl+'?x-oss-process=image/resize,h_500,w_500/quality,q_80'" style="display: block;width: 100%;border-top-left-radius: 5px;border-top-right-radius: 5px;">
              </div>
              <div style="padding: 0 .2rem 0;font-size: .36rem;position: relative;">
                <div class="content">
                  <div class="name">{{item.name}}</div>
                  <div @click.stop="deleteItem(item.id)" class="delete_item">
                    <!-- <van-icon class="iconfont" class-prefix='icon' name='ashbin' size=".7rem" /> -->
                    删除
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="position: fixed;bottom: 0;z-index: 10;width: 100%;left: 0;" @click="goUpload">
        <van-button type="info" size="large" block style="height: 1.2rem;font-size: .36rem;">上传</van-button>
      </div>
    </div>
    <v-loading :showPage="showPage" :submitFlag="submitFlag"></v-loading>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  import MeScroll from 'mescroll.js'
  import 'mescroll.js/mescroll.min.css'
  import axios from 'axios';
  import qs from 'qs';
  import {
    sceneCase,
    sceneCaseDelete
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
        let params = {
          page: page.num,
          rows: page.size,
          keyword: "",
          sceneType: "",
          resourceType: "",
          auditStatus: ""
        }
        sceneCase(params).then(res => {
          this.showPage = true;
          if (res.data.code == 200) {
            res.data.data.list.forEach(item => {
              item.imgUrl = item.imageSjtUrl || item.imageXgtUrl;
            });
            this.imgList = this.imgList.concat(res.data.data.list);
            this.mescroll.endSuccess(this.imgList.length, res.data.data.hasNextPage); //必传参数(当前页的数据个数, 是否有下一页true/false)
            document.getElementsByTagName("body")[0].style.background = "#f1f1f1";
          } else {
            this.mescroll.endErr();
          }
        }).catch(e => {
          this.mescroll.endErr();
        })
      },
      goUpload() {
        localStorage.removeItem("formData");
        this.$router.push({
          path: '/sceneImgDetailMobile'
        });
      },
      goEdit(id) {
        this.mescroll.setBounce(true);
        this.$router.push({
          path: '/sceneImgDetailMobile',
          query: {
            id: id
          }
        });
      },
      deleteItem(id) {
        this.$dialog.confirm({
            title: '删除实景案例',
            message: '确定删除该实景案例吗？',
          })
          .then(() => {
            // on confirm
            let ids = [id];
            let params = {
              ids: ids
            }
            axios({
              method: 'post',
              url: '/build-rest/sceneCase/delete',
              data: qs.stringify(params, {
                arrayFormat: 'brackets'
              })
            }).then(res => {
              if (res.data.code == 200) {
                this.$toast("删除成功");
                this.imgList = [];
                let childEl = document.getElementsByClassName("mescroll-upwarp")[0];
                if (childEl) childEl.parentNode.removeChild(childEl);
                this.mescrollInit();
              }
            })
          })
          .catch(() => {
            // on cancel
          });
      }
    }
  }
</script>
<style scoped>
  .mescroll {
    position: fixed;
    top: .2rem;
    bottom: 0;
    width: 100%;
    height: auto;
    left: 0;
    padding: 0 .2rem 1rem;
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
    /* box-shadow: rgb(153, 153, 153) 0px 0px 2px; */
    margin-bottom: .2rem;
    margin-top: .1rem;
    border-radius: 5px;
    background-color: #fff;
  }

  .content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: .34rem 0;
    justify-content: space-between;
  }

  .submit_button {
    margin-top: .5rem;
  }

  .label {
    width: 2rem;
    text-align: left;
  }

  .name {
    width: 6.6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    font-size: .4rem;
  }

  .delete_item {
    border: 1px solid #e32f2f;
    border-radius: 4px;
    color: #e32f2f;
    padding: 0 .3rem;
    font-size: .3rem;
  }
</style>
