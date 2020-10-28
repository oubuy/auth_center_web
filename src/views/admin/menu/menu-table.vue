<template>
    <div>
        <Table :loading="loading" border ref="selection" @on-row-click="handleRowClick" :columns="columns4" :data="dataTable"></Table>
         <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="routerParams.page" :page-size="routerParams.rows" />
    </div>
</template>
<script>
import { menuPage, systemList, menuPermissionName } from "@/api/menu";
import $ from "jquery";

export default {
  data() {
    return {
      total: 0,
      routerParams: {
        parentId: "",
        page: 1,
        rows: 10
      },
      defautParentId: "1", //默认值
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "名称",
          key: "name",
            render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleEidt(params);
                  }
                }
              },
              params.row.name
            );
          }
        },
        {
          title: "对应功能",
          key: "menuName"
        },
        {
          title: "菜单编码",
          key: "code"
        },
        {
          title: "排序",
          key: "seq"
        },
        {
          title: "所属系统",
          key: "system"
        },
        {
          title: "打开方式",
          key: "openType",
          render: (h, params) => {
            return h(
              "span",
              params.row.openType == 0 ? "子窗口打开" : "新窗口打开"
            );
          }
        },

        {
          title: "描述",
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
      dataTemp: [],
      dataTwoTemp: [],
      loading: true
    };
  },
  props: ["parentTableId", "parentDefultTable", "parentFreshTable"],
  created() {},
  mounted() {
    if (localStorage.getItem("menuDefultId")) {
      this.getMenuPageTable();
    }
  },
  methods: {
    handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
    getMenuPageTable() {
      this.loading = true;
      this.dataTable = [];
      this.dataTemp = [];
      this.dataTwoTemp = [];
      if (this.$route.query.parentId != null) {
        this.routerParams.parentId = this.$route.query.parentId;
        this.routerParams.page = Number(this.$route.query.page);
        this.routerParams.rows = Number(this.$route.query.rows);
      } else {
        //默认
        this.routerParams.parentId = localStorage.getItem("menuDefultId");
        // localStorage.removeItem("menuDefultId");
      }
      menuPage(this.routerParams).then(response => {
        if (response.data.code == 200) {
          this.total = response.data.data.total;
          let pageList = response.data.data.list;
          let permissionIdArr = []; //获取上级组织的id
          this.systemIdArr = []; //所属系统id
          pageList.forEach(item => {
            permissionIdArr.push(item.permissionId); //功能
            this.systemIdArr.push(item.systemId); //功能
            this.dataTemp.push(item);
          });
          this.getMenuPermissionName(permissionIdArr.join(",")); //功能
          // this.getSystemList(this.systemIdArr.join(",")); //系统
        }
      });
    },

    // 功能
    getMenuPermissionName(idList) {
      menuPermissionName({ ids: idList }).then(response => {
        if (response.data.code == 200) {
          let menuNameList = response.data.data;
          this.dataTemp.forEach(item => {
            menuNameList.forEach(itemList => {
              if (item.permissionId == itemList.id) {
                item.menuName = itemList.name;
              }
            });
            this.dataTwoTemp.push(item);
          });
          this.getSystemList(this.systemIdArr.join(",")); //系统
        }
      });
    },
    // 所属系统
    getSystemList(idList) {
      systemList({ ids: idList }).then(response => {
        if (response.data.code == 200) {
          let systemListArr = response.data.data;
          this.dataTwoTemp.forEach(item => {
            systemListArr.forEach(itemList => {
              if (item.systemId == itemList.id) {
                item.system = itemList.name;
              }
            });
          });
          this.dataTable = this.dataTwoTemp;

          this.loading = false;
        }
      });
    },
    // 更新router的参数
    updateParams() {
      this.$router.push({
        query: this.routerParams
      });
    },
    handelPage(val) {
      this.routerParams.page = val;
      this.updateParams();
    },
    handleEidt(data) {
      this.$emit("child-edit", data.row);
    }
  },
  watch: {
    parentTableId(val) {
      if (val) {
        this.routerParams.parentId = val;
        this.updateParams();
      }
    },
    $route: "getMenuPageTable"
    // parentFreshTable(val) {
    //   if (val) {
    //     this.getMenuPageTable();
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


