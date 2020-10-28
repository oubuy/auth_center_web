<template>
    <div>

        <div class="add_head"><Button @click="handleAdd">新增版本</Button></div>
         <div>
              <Table :loading="loading" border :columns="columns7" :data="data_list"></Table>
               <div id="page-wrap" style="padding-top:8px; text-align:right;"> 
                   <Page show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" :total="total" show-total :page-size="formData.rows" @on-page-size-change="changePageSize" :current="formData.page" />
              </div>
         </div>
          <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>
<script>
import { versionList, deleteVersion } from "@/api/version.js";
import aletTip from "@/components/alertTip.vue";
export default {
  data() {
    return {
       total: 0, //总数
       formData: {
        page: 1, //当前页
        rows: 10, //每页显示多少条
      },
      alertTipParams: {
        headTip: "删除",
        titleTip:
          "确认删除当前版本吗？删除有可能会影响场景的正常使用，请谨慎操作！"
      },
      deleteComfirm: false,
      deleteRowId: "",
      alertShow: false,
       loading: false,
      columns7: [
        {
          title: "版本号",
          key: "version",
          width: 100,
           fixed: 'left'
        },
        {
          title: "版本名称",
          key: "name",
          width: 200,
           fixed: 'left'
        },
        {
          title: "说明",
          key: "packageInfo",
          width: 450
        },
        {
          title: "安装包大小",
          key: "packageSize",
          width: 110
        },
        {
          title: "发版时间",
          key: "editionTime",
          width: 150
        },
        {
          title: "创建时间/创建人",
          key: "",
          width: 253,
          render: (h, params) => {
            let creatInfo = "";
            if (params.row.createdTime) {
              creatInfo = params.row.createdTime;
            }
            if (params.row.createdByName) {
              creatInfo = params.row.createdByName;
            }
            if (params.row.createdTime && params.row.createdByName) {
              creatInfo = params.row.createdTime + " / " + params.row.createdByName;
            }
            return h("div", creatInfo);
          }
        },
        {
          title: "修改时间/修改人",
          key: "",
          width: 250,
          render: (h, params) => {
            let updateInfo = "";
            if (params.row.modifyTime) {
              updateInfo = params.row.modifyTime;
            }
            if (params.row.modifyByName) {
              updateInfo = params.row.modifyByName;
            }
            if (params.row.modifyTime && params.row.modifyByName) {
              updateInfo = params.row.modifyTime + " / " + params.row.modifyByName;
            }
            return h("div", updateInfo);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          fixed: 'right',
          align: "center",
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
                      this.handleEidt(params);
                    }
                  }
                },
                "编辑"
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
      data_list: []
    };
  },
  components: {
    aletTip
  },
  created() {
    let breadcrumbs = [{ name: "交互屏管理" }, { name: "版本管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.handleGetList();
  },
  methods: {
     // 需改页码数
    changePage(val) {
      this.formData.page = val;
      this.updateRouterParam();
    },
    changePageSize(val) {
      this.formData.rows = val;
      this.updateRouterParam();
    },
      // 修改路由参数值
    updateRouterParam() {
      let query = this.formData;
      this.$router.push({
        query: query
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/admin/version/addEdit"
      });
    },
    handleGetList() {
       let page = this.$route.query.page;
      let rows = this.$route.query.rows;

      if (page && !isNaN(page)) {
        this.formData.page = parseInt(page);
      } else {
        this.formData.page = 1;
      }
      if (rows && !isNaN(rows)) {
        this.formData.rows = parseInt(rows);
      } else {
        this.formData.rows = 10;
      }
       this.loading=true;
       this.data_list=[];
      versionList(this.formData).then(res => {
        if (res.data.code == 200) {
           
          if (res.data.data.list.length != 0) {
             this.total = res.data.data.total;
            let data_arr = res.data.data.list;
            data_arr.forEach(item => {
              this.data_list.push(item);
            });
             this.loading=false;
          }else{
             this.loading=false;
          }
        }
      });
    },
    handleEidt(data) {
      this.$router.push({
        path: "/admin/version/addEdit",
        query: {
          versionId: data.row.id
        }
      });
    },
    handleRemove(params) {
      this.alertShow = true;
      this.deleteRowId = params.row.id;
    },
    handleCloseTip(data) {
      this.deleteComfirm = data;
      if (this.deleteComfirm == "true") {
        let ids = [];
        ids.push(this.deleteRowId.toString());

        deleteVersion({ ids: ids }).then(res => {
       
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
             this.handleGetList();
          }
        });
        this.alertShow = false;
      } else {
        this.alertShow = false;
      }
    }
  },
  watch:{
     $route: function() {
      this.handleGetList();
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
