<template>
  <div>
    <div class="search-box">
      <div>
        <Input v-model="searchData.name" placeholder="请输入名称/人名查询" clearable></Input>
      </div>
      <div>
        <Select v-model="searchData.styleVal" placeholder="类型" clearable>
          <Option v-for="(item,index) in styleColumns" :key="index" :value="index">{{ item }}</Option>
        </Select>
      </div>
      <div>
        <Select v-model="searchData.resourceVal" placeholder="资源类型" clearable>
          <Option v-for="(item,index) in resourceColumns" :key="index" :value="index">{{ item }}</Option>
        </Select>
      </div>
      <div>
        <Select v-model="searchData.statuVal" placeholder="审核状态" clearable>
          <Option v-for="(item,index) in statusColumns" :key="index" :value="index">{{ item }}</Option>
        </Select>
      </div>
      <Button type="primary" @click="findSceneCase">查询</Button>
      <Button @click="resetData" style="margin-left: 10px;">重置</Button>
    </div>
    <div class="button-box">
      <Button @click="goUpload" type="primary">上传实景</Button>
      <Button style="margin: 0 10px;" @click="goAudit" v-if="premissionFlag">审核</Button>
      <Button @click="deleteSceneCase">删除</Button>
    </div>
    <div class="list-box">
      <Table ref="table" width="1462" border @on-selection-change="handleSelect" @on-row-click="handleClick" :columns="columns"
        :data="formData" :loading="loading"></Table>
      <div style="overflow: hidden;width: 1462px;margin: 10px 0 0 0;">
        <div style="float: right;">
          <Page :total="total" show-total :current="searchData.page" :page-size="searchData.size" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    sceneCase,
    sceneCaseDelete,
    checkPermission
  } from "@/api/uploadImg.js";
  import {
    Dialog
  } from "vant";
  import axios from 'axios';
  import qs from 'qs';
  export default {
    data() {
      return {
        total: 0,
        loading: false,
        premissionFlag: false,
        searchData: {
          name: this.$route.query.name || "",
          styleVal: this.$route.query.styleVal || "",
          resourceVal: this.$route.query.resourceVal || "",
          statuVal: this.$route.query.statuVal || "",
          page: Number(this.$route.query.page) || 1,
          size: 10
        },
        styleColumns: ["家装", "工程"],
        resourceColumns: ["包含视频", "包含实景图", "包含效果图"],
        statusColumns: ["待审核", "审核通过", "审核不通过"],
        caseList: [],
        columns: [{
            type: "selection",
            width: 60,
            align: "center",
            // fixed: 'left'
          }, {
            title: '名称',
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
                      this.goEdit(params.row.id);
                    }
                  }
                },
                params.row.building_name
              );
            }
          },
          {
            title: '类型',
            key: 'kind',
            width: 100,
            align: "center",
          },
          {
            title: '视频',
            key: 'videoNum',
            width: 100,
            align: "center",
          },
          {
            title: '实景图',
            key: 'sceneNum',
            width: 100,
            align: "center",
          },
          {
            title: '效果图',
            key: 'renderingNum',
            width: 100,
            align: "center",
          },
          {
            title: '关联产品数',
            key: 'productNum',
            width: 100,
            align: "center",
          },
          {
            title: '审核状态',
            key: 'auditStatus',
            width: 100,
            align: "center",
          },
          {
            title: '创建人',
            key: 'creater',
            width: 150,
            align: "center",
          },
          {
            title: '创建日期',
            key: 'creatDate',
            width: 150,
            align: "center",
            sortable: true, //开启排序
            // sortType: "asc" //初始化排序
          },
          {
            title: '修改人',
            key: 'reviser',
            width: 150,
            align: "center",
          },
          {
            title: '修改日期',
            key: 'reviseDate',
            width: 150,
            align: "center"
          }
        ],
        formData: []
      }
    },
    components: {},
    created() {
      let breadcrumbs = [{
          name: "首页"
        },
        {
          name: "实景图管理"
        }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      this.checkPermission();
      this.getList();
      if (this.searchData.styleVal) this.searchData.styleVal = Number(this.searchData.styleVal);
      if (this.searchData.resourceVal) this.searchData.resourceVal = Number(this.searchData.resourceVal);
      if (this.searchData.statuVal) this.searchData.statuVal = Number(this.searchData.statuVal);
    },
    mounted() {

    },
    methods: {
      checkPermission() {
        checkPermission("admin_build_sceneCase_audit").then(res => {
          if (res.data.code == 200) {
            this.premissionFlag = res.data.data;
          }
        });
      },
      getList() {
        this.loading = true;
        let params = {
          page: this.searchData.page,
          rows: 10,
          keyword: this.searchData.name,
          sceneType: this.searchData.styleVal,
          resourceType: this.searchData.resourceVal,
          auditStatus: this.searchData.statuVal
        }
        sceneCase(params).then(res => {
          this.loading = false;
          if (res.data.code == 200) {
            this.formData = [];
            let data = res.data.data;
            this.total = data.total;
            for (let i = 0, l = data.list.length; i < l; i++) {
              let obj = {};
              obj.building_name = data.list[i].name;
              if (data.list[i].sceneType == 0) obj.kind = "家装";
              else if (data.list[i].sceneType == 1) obj.kind = "工程";
              if (data.list[i].auditStatus == 0) obj.auditStatus = "待审核";
              else if (data.list[i].auditStatus == 1) obj.auditStatus = "审核通过";
              else if (data.list[i].auditStatus == 2) obj.auditStatus = "审核不通过";
              obj.videoNum = data.list[i].videoCount;
              obj.sceneNum = data.list[i].imageSjtCount;
              obj.renderingNum = data.list[i].imageXgtCount;
              obj.productNum = data.list[i].productCount;
              obj.creater = data.list[i].creater;
              obj.creatDate = data.list[i].createTime;
              obj.reviser = data.list[i].updater;
              obj.reviseDate = data.list[i].updateTime;
              obj.id = data.list[i].id;
              this.formData.push(obj);
            }
          }
        })
      },
      findSceneCase() {
        this.$router.push({
          query: this.searchData
        })
        this.getList();
      },
      resetData() {
        this.searchData.page = 1;
        this.searchData.name = "";
        this.searchData.styleVal = "";
        this.searchData.resourceVal = "";
        this.searchData.statuVal = "";
        this.$router.push({
          query: this.searchData
        })
        this.getList();
      },
      goUpload() {
        this.$router.push({
          path: '/sceneImgUpload'
        })
      },
      goEdit(id) {
        this.$router.push({
          query: {
            id: id
          },
          path: '/sceneImgUpload'
        })
      },
      goAudit() {
        if (this.caseList.length > 1) {
          this.$Message.warning("每次只能选择一个实景案例进行评审");
          return;
        }
        if (!this.caseList.length) {
          this.$Message.warning("请选择实景案例");
          return;
        }
        if(!this.premissionFlag) {
          this.$Message.warning("您没有审核权限");
          return;
        }
        this.$router.push({
          query: {
            id: this.caseList[0].id,
            origin: "audit",
            page: this.searchData.page
          },
          path: '/sceneImgUpload'
        })
      },
      handleSelect(val) {
        this.caseList = val;
      },
      handleClick(data, index) {
        this.$refs.table.toggleSelect(index);
      },
      deleteSceneCase() {
        if (!this.caseList.length) {
          this.$Message.warning("请选择实景案例");
          return;
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除已选数据，删除后将不可恢复！</p>',
          onOk: () => {
            let ids = [];
            if (!this.caseList.length) {
              this.$Message.warning("请选择实景案例");
              return;
            }
            this.caseList.forEach(item => {
              ids.push(item.id)
            })
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
                this.$Message.success("删除成功");
                this.getList();
              }
            })
          }
        });
      },
      changePage(val) {
        this.searchData.page = val;
        this.$router.push({
          query: this.searchData
        })
        this.getList();
      },
    }
  }
</script>
<style scoped>
  .search-box {
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }

  .search-box>div {
    width: 200px;
    margin-right: 20px;
    text-align: left;
  }

  .button-box {
    text-align: left;
    margin: 20px 0;
  }
</style>
