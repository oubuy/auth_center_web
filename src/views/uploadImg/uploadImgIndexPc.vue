<template>
  <div>
    <div style="text-align: left;margin: 30px;margin-bottom: 10px;">
      <Button size="large" @click="goUpload" style="width: 150px;">上传</Button>
    </div>
    <Table width="1202" border :columns="columns" :data="formData" style="margin-left: 30px;"></Table>
    <div style="overflow: hidden;width: 1202px;margin: 10px 0 0 30px;">
      <div style="float: right;">
        <Page :total="total" show-total :current="page" :page-size="size" @on-change="changePage"></Page>
      </div>
    </div>
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
        page: 1,
        size: 6,
        total: 0,
        fileList: [],
        imgList: [],
        previewList: [],
        formData: [],
        columns: [{
            title: "图片",
            key: "imageUrl",
            width: 200,
            align: "center",
            // fixed: 'left',
            render: (h, params) => {
              return h("img", {
                attrs: {
                  src: params.row.imageUrl + '?x-oss-process=image/resize,h_500,w_500/quality,q_80'
                },
                style: {
                  width: "100px",
                  height: "80px",
                  padding: "5px 0"
                }
              });
            }
          }, {
            title: '小区名称',
            key: 'building_name',
            width: 200,
            align: "center",
            render: (h, params) => {
              return h(
                "span", {
                  style: {
                    color: "#2d8cf0",
                    textDecoration: "underline",
                    cursor: "pointer"
                  },
                  on: {
                    click: event => {
                      this.goEdit(params.row.id, params.row.audit_status);
                    }
                  }
                },
                params.row.building_name
              );
            }
          },
          {
            title: '风格',
            key: 'style_name',
            width: 200,
            align: "center",
          },
          {
            title: '更新时间',
            key: 'update_time',
            width: 150,
            align: "center",
          },
          {
            title: '审核状态',
            key: 'audit_status_text',
            width: 100,
            align: "center",
          },
          {
            title: '得分',
            key: 'score',
            width: 100,
            align: "center",
          },
          {
            title: "操作",
            key: "",
            // fixed: 'right',
            width: 250,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "20px",
                      display: params.row.audit_status == 1 ? "none" : "inline-block"
                    },
                    on: {
                      click: () => {
                        this.submit(params.row.id, params.row.imageUrl, params.row.audit_status)
                      }
                    }
                  },
                  params.row.audit_status == 0 ? "取回修改" : "提交评审",
                ),
                h(
                  "Button", {
                    props: {
                      size: "small"
                    },
                    style: {
                      display: params.row.audit_status == 1 ? "none" : "inline-block"
                    },
                    on: {
                      click: () => {
                        this.deleteItem(params.row.id)
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ]
      }
    },
    components: {},
    created() {
      let breadcrumbs = [
        { name: "首页" },
        { name: "实景图上传" }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      this.findMySceneProgramme();
    },
    mounted() {
      // this.mescrollInit();
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
              size: 8,
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
          page: this.page,
          rows: this.size
        }
        findMySceneProgramme(param).then(res => {
          this.showPage = true;
          if (res.data.code == 200) {
            this.total = res.data.data.total;
            for (let i = 0; i < res.data.data.list.length; i++) {
              res.data.data.list[i].update_time = res.data.data.list[i].update_time.substring(0, 10);
              this.previewList.push(res.data.data.list[i].imageUrl);
              if (res.data.data.list[i].audit_status == 0) res.data.data.list[i].audit_status_text = "待评审";
              else if (res.data.data.list[i].audit_status == 1) res.data.data.list[i].audit_status_text = "评审通过";
              else if (res.data.data.list[i].audit_status == 2) res.data.data.list[i].audit_status_text = "评审不通过";
            }
            this.imgList = this.imgList.concat(res.data.data.list);
            this.formData = this.imgList;
          } else {
          }
        }).catch(e => {
        })
      },
      previewImg(i) {
        // ImagePreview(this.previewList, i);
      },
      changePage(val) {
        this.page = val;
        this.imgList = [];
        this.formData = [];
        this.findMySceneProgramme();
      },
      goUpload() {
        this.$router.push({
          path: '/uploadImgDetailPc'
        });
        localStorage.removeItem("id");
        localStorage.removeItem("readonly");
      },
      goEdit(id, status) {
        let readonly = false;
        if (status == 1 || status == 0) readonly = true;
        this.$router.push({
          path: '/uploadImgDetailPc',
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
                this.$toast(res.data.msg);
                this.page = 1;
                this.imgList = [];
                this.previewList = [];
                this.findMySceneProgramme();
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
            if (res.data.code == 200) {
              this.imgList = [];
              Dialog.alert({
                message: '取回修改成功，现可对该案例进行修改',
              }).then(() => {
                // on close
              });
              this.findMySceneProgramme();
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
              this.$toast(res.data.msg);
              this.findMySceneProgramme();
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
    /* width: 380px; */
    position: relative;
    width: 20%;
    box-shadow: rgb(153, 153, 153) 0px 0px 2px;
    margin-bottom: .6rem;
    margin: .1rem 46px .6rem;
    padding-bottom: 60px;
    cursor: pointer;
  }

  .content {
    display: flex;
    align-items: center;
    /* flex-wrap: wrap; */
    margin: .2rem 0;
  }

  .submit_button {
    position: absolute;
    width: 100%;
    bottom: 0px;
    /* margin-top: .5rem; */
  }

  .label {
    width: 2.5rem;
    text-align: left;
  }

  .name {
    width: 6.6rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
</style>
