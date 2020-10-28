<template>
  <div>
    <Card style="margin-bottom:16px; text-align:left;" dis-hover>
      <Form ref="formValidate" :label-width="80" style="display:flex;flex-wrap: wrap;">
        <FormItem label="小区名称" style="width:200px">
          <Input v-model="formValidate.buildingName" placeholder="小区名称" clearable />
        </FormItem>
        <FormItem label="风格" style="width:200px">
          <Select v-model="styleVal" @on-change="changeStyle" clearable>
            <Option v-for="(item,index) in styleColumns" :value="item.styleId" :key="index">{{ item.styleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="方案" style="width:200px">
          <Input v-model="formValidate.id" placeholder="请输入方案ID" clearable />
        </FormItem>
        <FormItem label="经销商" style="width:200px">
          <!-- <Input v-model="formValidate.dealer" placeholder="所属经销商" clearable/> -->
          <AutoComplete v-model.trim="dealer" :data="dealerList" @on-select="handleSearch" @on-change="changeDealer"
            placeholder="所属经销商" clearable></AutoComplete>
        </FormItem>
        <FormItem label="上传人" style="width:200px">
          <Input v-model="formValidate.creater" placeholder="上传人" clearable />
        </FormItem>
        <FormItem label="包含视频" style="width:200px">
          <Select @on-change="changeHaveVideo" clearable v-model="haveVideoVal">
            <Option v-for="(item,index) in videoColumns" :value="item.haveVideo" :key="index">{{ item.haveVideoVal }}</Option>
          </Select>
        </FormItem>
        <FormItem label="提交日期" style="width:320px">
          <div style="display: flex;">
            <Date-picker clearable :value="formValidate.submitTimeStart" type="date" placeholder="选择日期" style="width: 200px"
              format="yyyy-MM-dd" @on-change="changeTimeStart"></Date-picker>
            <span style="padding: 0 10px;"> - </span>
            <Date-picker clearable :value="formValidate.submitTimeEnd" type="date" placeholder="选择日期" style="width: 200px"
              format="yyyy-MM-dd" @on-change="changeTimeEnd"></Date-picker>
          </div>
        </FormItem>
        <FormItem label="分数" style="width:220px;">
          <div style="display: flex;">
            <Select @on-change="changePointRange" clearable v-model="pointRangeVal">
              <Option v-for="(item,index) in pointColumns" :value="item.pointRange" :key="index">{{ item.pointRangeVal }}</Option>
            </Select>
            <Input v-model="formValidate.score" style="width: 60px;margin-left: 10px;"></Input>
          </div>
        </FormItem>
        <FormItem label="状态" style="width:200px">
          <Select @on-change="changeStatus" clearable v-model="statusVal">
            <Option v-for="(item,index) in statusColumns" :value="item.statusId" :key="index">{{ item.statusVal }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleFind()">查询</Button>
          <Button @click="handleReset()" style="margin-left: 8px">重 置</Button>
        </FormItem>
      </Form>
    </Card>
    <div style="text-align: left;margin: 0 0 10px;"><Button type="primary" @click="goUpload">新增</Button></div>
    <div>
      <Table border :columns="columns" :data="formData" :loading="loading"></Table>
      <div style="overflow: hidden;margin: 10px 0 0 30px;">
        <div style="float: right;">
          <Page :total="total" show-total :current="formValidate.page" :page-size="formValidate.rows" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
  </div>
</template>

<script>
  import aletTip from "@/components/alertTip.vue";
  import {
    findSceneList,
    getListStyle,
    deleteScene
  } from "@/api/uploadImg.js";
  import {
    findDealer,
  } from "@/api/adminOuter.js";
  export default {
    data() {
      return {
        formValidate: {
          page: 1,
          rows: 10
        },
        alertShow: false,
        loading: true,
        styleVal: "",
        dealer: "",
        haveVideoVal: "",
        pointRangeVal: "",
        statusVal: "",
        programmeId: "",
        total: 0,
        formData: [],
        styleColumns: [],
        dealerList: [],
        dealerMsgList: [],
        alertTipParams: {
          headTip: '删除确认',
          titleTip: '确认删除该实景案例吗？'
        },
        videoColumns: [{
          haveVideo: 1,
          haveVideoVal: "是"
        }, {
          haveVideo: 0,
          haveVideoVal: "否"
        }],
        pointColumns: [{
          pointRange: "gt",
          pointRangeVal: "大于"
        }, {
          pointRange: "ge",
          pointRangeVal: "大于等于"
        }, {
          pointRange: "lt",
          pointRangeVal: "小于"
        }, {
          pointRange: "le",
          pointRangeVal: "小于等于"
        }, {
          pointRange: "eq",
          pointRangeVal: "等于"
        }, {
          pointRange: "ne",
          pointRangeVal: "不等于"
        }],
        statusColumns: [{
          statusId: -1,
          statusVal: "草稿"
        }, {
          statusId: 0,
          statusVal: "待审核"
        }, {
          statusId: 1,
          statusVal: "已通过"
        }, {
          statusId: 2,
          statusVal: "不通过"
        }],
        columns: [{
            title: 'ID',
            key: 'id',
            minWidth: 120,
            align: "center"
          }, {
            title: '小区',
            key: 'building_name',
            minWidth: 150,
            align: "center"
          },
          {
            title: '风格',
            key: 'style_name',
            minWidth: 100,
            align: "center",
          },
          {
            title: '分数',
            key: 'score',
            minWidth: 70,
            align: "center",
            sortable: true
          },
          {
            title: '审核状态',
            key: 'audit_status_text',
            minWidth: 100,
            align: "center",
          },
          {
            title: '包含视频',
            key: 'hasVideo',
            minWidth: 100,
            align: "center",
          },
          {
            title: '所属经销商',
            key: 'dealer',
            minWidth: 200,
            align: "center",
          },
          {
            title: '提交人',
            key: 'creater',
            minWidth: 100,
            align: "center",
          },
          {
            title: '提交时间',
            key: 'submit_time',
            minWidth: 150,
            align: "center",
            sortable: true
          },
          {
            title: "操作",
            key: "",
            minWidth: 160,
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
                      // display: params.row.audit_status != 0 && params.row.audit_status != 2 ? "none" : ""
                    },
                    on: {
                      click: () => {
                        this.goReview(params.row.id)
                      }
                    }
                  },
                  "评审"
                  // params.row.audit_status != 0 && params.row.audit_status != 2 ? "详情" : "评审"
                ),
                h(
                  "Button", {
                    props: {
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.deleteScene(params.row.id)
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
    components: {
      aletTip
    },
    created() {
      let breadcrumbs = [{
          name: "首页"
        },
        {
          name: "实景案例评审"
        }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      this.findSceneList();
      this.getListStyle();
    },
    beforeRouteLeave(to, from, next) {
      from.meta.keepAlive = false;
      next();
    },
    methods: {
      findSceneList() {
        this.loading = true;
        findSceneList(this.formValidate).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            this.total = data.total;
            for (let i = 0; i < data.list.length; i++) {
              if (data.list[i].audit_status == 0) {
                data.list[i].audit_status_text = "待审核";
              } else if (data.list[i].audit_status == 1) {
                data.list[i].audit_status_text = "审核通过";
              } else if (data.list[i].audit_status == 2) {
                data.list[i].audit_status_text = "审核不通过";
              } else if (data.list[i].audit_status == -1) {
                data.list[i].audit_status_text = "草稿";
              }
              if (data.list[i].video_url) {
                data.list[i].hasVideo = "是";
              } else {
                data.list[i].hasVideo = "否";
              }
              if(!data.list[i].score) data.list[i].score = "";
            }
            this.formData = data.list;
          }
          this.loading = false;
        })
      },
      getListStyle() {
        getListStyle().then(res => {
          if (res.data.code == 200) {
            this.styleList = res.data.data;
            for (let i = 0; i < this.styleList.length; i++) {
              this.styleColumns.push(this.styleList[i]);
            }
          }
        })
      },
      changeStyle(val) {
        this.formValidate.styleId = val;
      },
      changeDealer(val) {
        if (val == '') {
          this.dealerList = [];
          this.dealerMsgList = [];
          this.formValidate.comId = "";
          return;
        }
        let params = {
          dealerName: val
        };
        findDealer(params).then(data => {
          if (data.data.code == 200) {
            this.dealerList = [];
            this.dealerMsgList = [];
            data.data.data.list.forEach(item => {
              this.dealerList.push(item.orgName);
              this.dealerMsgList.push(item);
            });
          }
        });
      },
      changeHaveVideo(val) {
        if (val == 1) val = true;
        else if (val == 0) val = false;
        else val = "";
        this.formValidate.hasVideo = val;
      },
      changePointRange(val) {
        this.formValidate.scoreRangeType = val;
      },
      changeStatus(val) {
        this.formValidate.auditStatus = val;
      },
      changeTimeStart(val) {
        this.formValidate.submitTimeStart = val;
      },
      changeTimeEnd(val) {
        this.formValidate.submitTimeEnd = val;
      },
      handleSearch(val) {},
      handleFind() {
        for (let i = 0; i < this.dealerMsgList.length; i++) {
          if (this.dealer == this.dealerMsgList[i].orgName) {
            this.formValidate.comId = this.dealerMsgList[i].id;
          }
        }
        if (!this.dealer) {
          this.formValidate.comId = "";
          this.dealerMsgList = [];
          this.dealerList = [];
        }
        if (this.formValidate.scoreRangeType) {
          if (!this.formValidate.score) {
            this.$Message.warning("请填写分数");
            return;
          }
        } else {
          if (this.formValidate.score) {
            this.$Message.warning("请填写分数范围");
            return;
          }
        }
        // this.$router.push({
        //   query: this.formValidate
        // });
        this.findSceneList();
      },
      handleReset() {
        this.dealer = "";
        this.haveVideoVal = "";
        this.pointRangeVal = "";
        this.statusVal = "";
        this.styleVal = "";
        this.formValidate = {
          page: 1,
          rows: 10
        }
        this.findSceneList();
      },
      changePage(val) {
        this.formValidate.page = val;
        this.findSceneList();
      },
      goReview(id) {
        this.$router.push({
          path: '/sceneImgReviewDetail',
          query: {
            id: id
          }
        });
      },
      goUpload() {
        this.$router.push({
          path: '/uploadImgDetailPc',
          query: {
            comeFrom: "review"
          }
        });
      },
      handleCloseTip(flag) {
        if (flag == 'true') {
          deleteScene(this.programmeId).then(res => {
            if (res.data.code == 200) {
              this.$Message.success(res.data.msg);
              this.findSceneList();
            }
          })
        }
        this.alertShow = false;
      },
      deleteScene(id) {
        this.$Modal.confirm({
          title: '请确认',
          content: '<p>确定删除所选数据？</p>',
          onOk: () => {
            this.programmeId = id;
            deleteScene(this.programmeId).then(res => {
              if (res.data.code == 200) {
                this.$Message.success(res.data.msg);
                this.findSceneList();
              }
            })
          }
        });
      }
    }
  }
</script>

<style>
</style>
