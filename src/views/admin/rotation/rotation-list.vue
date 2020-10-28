<template>
      <Layout>
        <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
               <!-- 功能键 -->
         <div style="padding:15px 0 15px 0">
               <Button @click="addRotation">增 加</Button>
               <Button style="margin:0 5px;" @click="editRotation">编 辑</Button>
               <Button @click="handleStartRotation">启 用</Button>
               <Button style="margin-left:5px;" @click="handleEnabledRotation">禁 用</Button>
            </div>
            <!-- 查询结果 -->
            <div>
                <Table border @on-row-click="handleRowClick" :loading="loading" ref="selection" :columns="columns" :data="tableData" @on-selection-change="handleSelectionChange">
                    <template slot-scope="{ row }" slot="name">
                        <div style="cursor: pointer;">{{ row.name }}</div>
                    </template>
                    <template slot-scope="{ row }" slot="imageUrl">
                        <img :src="row.imageUrl" alt="">
                    </template>
                     <template slot-scope="{ row, index }" slot="action">
                          <Button type="primary" size="small" style="margin-right: 5px" @click="handleRowEdite(row)">编 辑</Button>
                          <!-- <Button type="error" size="small" @click="handleRowEnable(row)">禁用</Button> -->
                           <Button type="error" size="small" @click="handleDelete(row)">删 除</Button>
                      </template>
                </Table>
                <Page :total="total" :page-size="routerParams.size" :current="routerParams.page" show-total class="paging" @on-change="changePage"></Page>
            </div>

        </Content>
    </Layout>
</template>
<script>
import {
  getBannerList,
  enabledRotation,
  deleteRotation
} from "@/api/rotation.js";

export default {
  data() {
    return {
      actionText: "启用",
      total: 0, // 初始化信息总条数
      loading: true,
      multipleSelection: [],
      routerParams: {
        id: "",
        page: 1,
        size: 10
      },
      tableData: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名字",
          slot: "name"
        },
        {
          title: "图片",
          slot: "imageUrl"
        },
        {
          title: "链接",
          key: "linkUrl"
        },
        {
          title: "排序",
          key: "seq",
          width:100
        },
        {
          title: "启用状态",
          key: "enabled",
          width: 150,
          render: (h, params) => {
            if (params.row.enabled == true) {
              return h(
                "span",
                {
                  style: {
                    color: "#2db7f5"
                  }
                },
                "启用"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "禁用"
              );
            }
          }
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ]
    };
  },
  created() {
    let breadcrumbs = [{ name: "交互屏管理" }, { name: "轮播图管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.fetchBannerList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changePage(val) {
      this.routerParams.page = val;
      this.updateRouterParam();
    },
    fetchBannerList() {
      this.loading = true;
      this.tableData = [];
      let page = this.$route.query.page;
      let size = this.$route.query.size;
      if (page != undefined) {
        this.routerParams.page = Number(page);
      } else {
        this.routerParams.page = 1;
      }
      if (size != undefined) {
        this.routerParams.size = Number(size);
      } else {
        this.routerParams.size = 10;
      }
      let params = {
        page: this.routerParams.page,
        size: this.routerParams.size
        // enabled: this.routerParams.enabled,
        // deletable: undefined
      };
      getBannerList(params).then(res => {
        if (res.data.code == 200) {
          this.total = res.data.data.total;
          if (res.data.data.list.length != 0) {
            let fetcheData = res.data.data.list;
          
            fetcheData.forEach(item => {
              let obj = {};
              obj.id = item.id;
              obj.name = item.name;
              obj.imageUrl =
                item.imageUrl + "?x-oss-process=image/resize,w_100";
              obj.linkUrl = item.linkUrl;
              obj.enabled = item.enabled;
              obj.seq = item.seq;
              this.tableData.push(obj);
            });
            this.loading = false;
          } else {
            this.loading = false;
          }
        }
      });
    },
    updateRouterParam() {
      // 修改路由参数值
      this.$router.push({
        query: this.routerParams
      });
    },
    addRotation() {
      this.$router.push({
        path: "/admin/rotation/edit"
      });
    },
    handleRowEdite(data) {
      //行编辑

      this.multipleSelection = [];
      this.multipleSelection.push(data);
      this.editRotation();
    },
    editRotation() {
      //功能键编辑

      this.$router.push({
        path: "/admin/rotation/edit",
        query: {
          id: this.multipleSelection[0].id
        }
      });
    },
    handleDelete(data) {
     
      let params = {
        id: data.id
      };
      deleteRotation(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.fetchBannerList();
          this.multipleSelection = [];
        }
      });
    },
    handleRowEnable(data) {
      //行禁用
      this.multipleSelection = [];
      this.multipleSelection.push(data);
      this.handleEnabledRotation();
    },
    handleEnabledRotation() {
      //功能键禁用
      // enabledRotation
      if (this.multipleSelection.length == 0) {
        this.$Message.warning("请勾选禁用选项！");
      } else if (this.multipleSelection.length > 1) {
        this.$Message.warning("只能一条一条禁用！");
      } else {
        let params = {
          id: this.multipleSelection[0].id,
          enabled: false
        };
        enabledRotation(params).then(res => {
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.fetchBannerList();
            this.multipleSelection = [];
          }
        });
      }
    },
    handleStartRotation() {
      //功能键启用
      if (this.multipleSelection.length == 0) {
        this.$Message.warning("请勾选启用选项！");
      } else if (this.multipleSelection.length > 1) {
        this.$Message.warning("只能一条一条启用！");
      } else {
        let params = {
          id: this.multipleSelection[0].id,
          enabled: true
        };
        enabledRotation(params).then(res => {
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.fetchBannerList();
            this.multipleSelection = [];
          }
        });
      }
    },
    handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    }
  },
  watch: {
    $route: "fetchBannerList"
  }
};
</script>
<style scoped>
.paging {
  text-align: right;
  margin-top: 10px;
}
</style>