<template>
    <div>
         <div>
              <Table :loading="loading" border ref="selection" :columns="columns4" :data="dataTable"></Table>
                <Page :total="total" @on-change="handelPage" :current="routerParams.page" :page-size="routerParams.rows" show-total class="paging" />
         </div>
        
    </div>
</template>
<script>
import { getPermissionTable } from "@/api/authod.js";

export default {
  data() {
    return {
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "权限名",
          key: "name"
        },
        {
          title: "权限编码",
          key: "code"
        },
        {
          title: "排序",
          key: "seq"
        },
        {
          title: "是否可用",
          key: "dealerDisabled",
          render: (h, params) => {
            return h(
              "span",
              params.row.dealerDisabled == 0 ? "可用" : "不可用"
            );
          }
        },
        {
          title: "创建人",
          key: "creater"
        },
        {
          title: "创建时间",
          key: "createDate"
        },
        {
          title: "备注",
          key: "description"
        },
        {
          title: "操作",
          key: "",
          render: (h, params) => {
            return h(
              "Button",
              {
                props: {
                  type: "primary",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.handleEidt(params);
                  }
                }
              },
              "编辑"
            );
          }
        }
      ],
      dataTable: [],
      loading: true,
      routerParams: {
        id: "",
        page: 1,
        rows: 10
      },
      total: 0
    };
  },
  props: ["parentTableId", "parentFreshTable", "parentDefultTable"],
  mounted() {
     if (localStorage.getItem("defualtId")) {
       this.getTableList();
    }
  },
  methods: {
    getTableList() {
      let params = {
        parentId: "",
        page: "",
        rows: ""
      };
      this.loading = true;
      this.dataTable = [];
      if (this.$route.query.id) {
        let id = this.$route.query.id;
        let page = this.$route.query.page;
        let row = this.$route.query.rows;

        this.routerParams.page = Number(page);
        this.routerParams.id = id;
        this.routerParams.rows = Number(row);
        params.parentId = id;
        params.page = page;
        params.rows = row;
      } else {
        params.parentId = localStorage.getItem("defualtId");
        // localStorage.removeItem("defualtId");
        params.page = this.routerParams.page;
        params.rows = this.routerParams.rows;
      }

      getPermissionTable(params).then(response => {
        if (response.data.code == 200) {
          this.dataTable = response.data.data.list;
          this.total = response.data.data.total;
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      });
    },
    handleEidt(data) {
      this.$emit("child-edit", data.row);
    },
    // 更新路由参数
    updateParams() {
      this.$router.push({
        query: this.routerParams
      });
    },
    handelPage(val) {
      this.routerParams.page = val;
      this.updateParams();
    }
  },
  watch: {
    parentTableId(val) {
      if (val) {
        this.routerParams.id = val;
        this.updateParams();
      }
    },
    $route: "getTableList"
    // parentFreshTable(val) {
    //   if (val) {
    //     this.getTableList();
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
.paging {
  text-align: right;
  margin-top: 10px;
}
</style>

