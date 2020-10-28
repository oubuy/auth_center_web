<template>
    <div>
       <div>
             <Form inline :label-width="90" style="text-align:left;">
            <FormItem label="UE4程序版本">
              <Select v-model="formInline.ue4Version" style="width:200px">
                    <Option value="">全部</Option>
                    <Option v-for="item in ue4VersionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="场景名称">
                <Input v-model="formInline.title">
                </Input>
            </FormItem>
            <FormItem label="创建人">
                <Input v-model="formInline.creater">
                </Input>
            </FormItem>
            <FormItem label="是否可用">
                <Select v-model="formInline.enabled" style="width:100px;">
                   <Option value="2">全部</Option>
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                    
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit()">查询</Button>
            </FormItem>
        </Form>
       </div>
       <div>
             <div class="add_head"><Button @click="handleAdd">新增场景</Button></div>
           <div><Table :loading="loading" border height="580" :columns="columns7" :data="data6"></Table></div>
            <div id="page-wrap" style="padding-top:8px; text-align:right;"> 
               <Page show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" :total="total" show-total :page-size="formInline.rows" @on-page-size-change="changePageSize" :current="formInline.page" />
             </div>
       </div>
        <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>
<script>
import { getScenceList, versionList, secenceDelete } from "@/api/ue4.js";
import aletTip from "@/components/alertTip.vue";
export default {
  data() {
    return {
        total: 0, //总数
      formInline: {
        ue4Version: "",
        title: "",
        enabled: "1",
        creater: "",
        page: 1,
        rows: 5
      },
      alertTipParams: {
        headTip: "删除",
        titleTip: "你确认删除当前场景吗？删除后终端门店将不可继续使用该场景!"
      },
      deleteComfirm: false,
      deleteRowId: "",
      alertShow: false,
      loading: false,
      ue4VersionList: [],
      columns7: [
        {
          title: "uuid",
          key: "uuid",
          width: 300,
          fixed: "left"
        },
        {
          title: "场景名称",
          key: "title",
          width: 163
        },
        {
          title: "UE4程序版本",
          key: "ue4Version",
          width: 150
        },
        {
          title: "md5",
          key: "md5",
          width: 300
        },
        {
          title: "创建时间/创建人",
          key: "",
          width: 200,
          render: (h, params) => {
            let creatInfo = "";
            if (params.row.createTime) {
              creatInfo = params.row.createTime;
            }
            if (params.row.creater) {
              creatInfo = params.row.creater;
            }
            if (params.row.createTime && params.row.creater) {
              creatInfo = params.row.createTime + " / " + params.row.creater;
            }
            return h("div", creatInfo);
          }
        },
        {
          title: "修改时间/修改人",
          key: "",
          width: 200,
          render: (h, params) => {
            let updateInfo = "";
            if (params.row.updateTime) {
              updateInfo = params.row.updateTime;
            }
            if (params.row.updator) {
              updateInfo = params.row.updator;
            }
            if (params.row.updateTime && params.row.updator) {
              updateInfo = params.row.updateTime + " / " + params.row.updator;
            }
            return h("div", updateInfo);
          }
        },
        {
          title: "是否可用",
          key: "enabled",
          width: 150,
          render: (h, params) => {
            if (params.row.enabled == true) {
              return h("div", "是");
            } else if (params.row.enabled == false) {
              return h("div", "否");
            }
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleCopy(params.row);
                    }
                  }
                },
                "复制"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleRemove(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      data6: []
    };
  },
  components: {
    aletTip
  },
  created() {
    let breadcrumbs = [{ name: "VR场景管理" }, { name: "场景管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.handleScenceList();
    this.handleGetVersionList();
  },
  methods: {
   
      // 需改页码数
    changePage(val) {
      this.formInline.page = val;
      this.updateRouterParam();
    },
    changePageSize(val) {
      this.formInline.rows = val;
      this.updateRouterParam();
    },
        // 修改路由参数值
    updateRouterParam() {
      let query = this.formInline;
      this.$router.push({
        query: query
      });
    },
    handleScenceList() {
        let page = this.$route.query.page;
      let rows = this.$route.query.rows;

      if (page && !isNaN(page)) {
        this.formInline.page = parseInt(page);
      } else {
        this.formInline.page = 1;
      }
      if (rows && !isNaN(rows)) {
        this.formInline.rows = parseInt(rows);
      } else {
        this.formInline.rows = 10;
      }
      this.loading = true;
      // this.data6 = [];

      let params = {};
      params.ue4Version = this.formInline.ue4Version;
      params.title = this.formInline.title;
      params.creater = this.formInline.creater;
      params.page = this.formInline.page;
      params.rows = this.formInline.rows;
      if (this.formInline.enabled == "1") {
        params.enabled = true;
      } else if (this.formInline.enabled == "2") {
        params.enabled = "";
      } else if (this.formInline.enabled == "0") {
        params.enabled = false;
      }

      getScenceList(params).then(res => {
        if (res.data.code == 200) {
           this.data6 = [];
          if (res.data.data.list.length != 0) {
            console.log(res.data.data.list)
             this.total = res.data.data.total;
            let res_data = res.data.data.list;
            res_data.forEach(item => {
              this.data6.push(item);
            });
            this.loading = false;
          } else {
            this.loading = false;
          }
        }
      });
    },
    handleSubmit() {
      this.handleScenceList();
    },
    handleAdd() {
      this.$router.push({
        path: "/admin/ue4/spectacle_addEdit"
      });
    },
    handleEdit(data) {
      this.$router.push({
        path: "/admin/ue4/spectacle_addEdit",
        query: { id: data.row.uuid }
      });
    },
    handleRemove(data) {
      this.alertShow = true;
      this.deleteRowId = data.row.uuid;
    },
    handleGetVersionList() {
      versionList().then(res => {
        if (res.data.code == 200) {
          let ue4Version_data = res.data.data;
          ue4Version_data.forEach(item => {
            let obj = {};
            obj.value = item;
            obj.label = item;

            this.ue4VersionList.push(obj);
          });
        }
      });
    },
    handleCloseTip(data) {
      this.deleteComfirm = data;
      if (this.deleteComfirm == "true") {
        let ids = [];
        ids.push(this.deleteRowId.toString());
        secenceDelete({ ids: ids }).then(res => {
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.handleScenceList();
          }
        });
        this.alertShow = false;
      } else {
        this.alertShow = false;
      }
    },
    handleCopy(data) {
    
      let obj = {};
      obj.title = data.title;
      obj.uri = data.uri;
      obj.thumbUri = data.thumbUri;
      obj.version = data.version;
      obj.md5 = data.md5;
      obj.ue4Version = data.ue4Version;
      if (data.enabled == true) {
        obj.enabled = "1";
      } else if (data.enabled == false) {
        obj.enabled = "0";
      }
       if (data.vr == true) {
        obj.vr = "1";
      } else if (data.vr == false) {
        obj.vr = "0";
      };
        this.$router.push({
        path: "/admin/ue4/spectacle_addEdit",
        query:{
          params_data:obj,
          copyFlag:true
        }
      });
    }
  },
  watch:{
     $route: function() {
      this.handleScenceList();
    },
  }
};
</script>
<style lang="less" scoped>
.add_head {
  text-align: left;
  margin-bottom: 15px;
}
</style>
