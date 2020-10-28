<template>
    <div>
          <Table border ref="selection" @on-row-click="handleRowClick" @on-selection-change="handleSelectionChange" height="500" :loading="loading" :columns="columns4" :data="data1"></Table>
          <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="formTableData.page" :page-size="formTableData.rows" />
    </div>
</template>
<script>
import { dealerModityList, relationStoreNum } from "@/api/dealerModity.js";
export default {
  data() {
    return {
      formTableData: {
        rows: 10,
        page: 1,
        audit: null,
        status: null
      },
      loading: true,
      total: 0,
      multipleSelection: [],
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "图片",
          key: "imageUrl",
          width: 100,
          render: (h, params) => {
            // console.log(params, "params");
            if (params.row.imageUrl != null) {
              return h("img", {
                attrs: {
                  src: params.row.imageUrl
                },
                style: {
                  width: "50px",
                  height: "50px",
                  padding: "5px 0"
                }
              });
            }
          }
        },
        {
          title: "商品型号",
          key: "officialModel",
          width: 200,
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handdleEditModity(params.row.id);
                  }
                }
              },
              params.row.officialModel
            );
          }
        },
        {
          title: "类目",
          key: "categoryName",
          width: 245
        },
        {
          title: "商品名称",
          key: "modityName",
          width: 150
        },
        {
          title: "商品排序",
          key: "sortNum",
          width: 100
        },
        {
          title: "规格",
          key: "modityModel",
          width: 150
        },
        {
          title: "审核状态",
          key: "audit",
          width: 100,
          render: (h, params) => {
            if (params.row.audit == "1") {
              return h(
                "span",
                {
                  style: {
                    color: "#2db7f5"
                  }
                },
                "审核通过"
              );
            } else if (params.row.audit == "2") {
              return h(
                "span",
                {
                  style: {
                    color: "c5c8ce"
                  }
                },
                "审核不通过"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "c5c8ce"
                  }
                },
                "待审核"
              );
            }
          }
        },
        {
          title: "上架状态",
          key: "status",
          width: 100,
          render: (h, params) => {
            if (params.row.status == "0") {
              return h(
                "span",
                {
                  style: {
                    color: "#2db7f5"
                  }
                },
                "上架"
              );
            } else if (params.row.status == "1") {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "下架"
              );
            }
          }
        },
        {
          title: "关联案例数",
          key: "relationStoreNum",
          width: 100,
          render: (h, params) => {
            if (params.row.relationStoreNum == 0) {
              return h("span", 0);
            } else {
              return h("span", params.row.relationStoreNum);
            }
          }
        },

        {
          title: "创建时间",
          key: "createDate",
          width: 150
        },
        {
          title: "创建人",
          key: "creater",
          width: 100
        },
        {
          title: "修改时间",
          key: "modifyDate",
          width: 150
        },
        {
          title: "修改人",
          key: "modify",
          width: 100
        }
      ],
      data1: []
    };
  },
  created() {
    this.getModityList();
  },
  methods: {
    getModityList() {
      // console.log(this.$route.query, "路由");
      this.loading = true;
      let page = this.$route.query.page;
      let rows = this.$route.query.rows;
      if (page && !isNaN(page)) {
        this.formTableData.page = parseInt(page);
      } else {
        this.formTableData.page = 1;
      }
      if (rows && !isNaN(rows)) {
        this.formTableData.rows = parseInt(rows);
      } else {
        this.formTableData.rows = 10;
      }
      if (
        this.$route.query.audit != null &&
        this.$route.query.audit != "null"
      ) {
        this.formTableData.audit = this.$route.query.audit;
      } else {
        this.formTableData.audit = "";
      }
      if (
        this.$route.query.status != null &&
        this.$route.query.status != "null"
      ) {
        this.formTableData.status = this.$route.query.status;
      } else {
        this.formTableData.status = "";
      }

      let params = {
        page: this.formTableData.page,
        rows: this.formTableData.rows,
        modityName: this.$route.query.modityName,
        modityLength: this.$route.query.modityLength,
        modityWidth: this.$route.query.modityWidth,
        audit: this.formTableData.audit,
        status: this.formTableData.status,
        creater: this.$route.query.creater,
        createDateStart: this.$route.query.createDateStart,
        createDateEnd: this.$route.query.createDateEnd,
        modifyDateStart: this.$route.query.modifyDateStart,
        modifyDateEnd: this.$route.query.modifyDateEnd
      };
      if (this.isChinese(this.$route.query.categoryParams)) {
        params.categoryId = this.$route.query.categoryParams;
      } else {
        params.categoryName = this.$route.query.categoryParams;
      }
      this.formTableData.modityName = params.modityName;
      this.formTableData.modityLength = params.modityLength;
      this.formTableData.modityWidth = params.modityWidth;
      this.formTableData.creater = params.creater;
      this.formTableData.createDateStart = params.createDateStart;
      this.formTableData.createDateEnd = params.createDateEnd;
      this.formTableData.modifyDateStart = params.modifyDateStart;
      this.formTableData.modifyDateEnd = params.modifyDateEnd;
      if(params.categoryId) this.formTableData.categoryParams = params.categoryId;
      else if(params.categoryName) this.formTableData.categoryParams = params.categoryName;
      // console.log(params, "参数");
      this.data1 = [];
      dealerModityList(params).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.rows.length != 0) {
            this.total = res.data.data.total;
            this.data1 = [];
            this.data1 = res.data.data.rows;
            let modityIds = [];
            this.data1.forEach(item => {
              modityIds.push(item.officialModel);
            });
            //   this.loading = false;
            this.handleRelationStoreNum(modityIds);
          } else {
            this.loading = false;
          }
        }
      });
    },
    handleRelationStoreNum(data) {
      // { modityIds: data }
      relationStoreNum({ modityModels: data }).then(res => {
        if (res.data.code == 200) {
          let relationStoreNumData = res.data.data;
          this.data1.forEach(item => {
            let relationCount = 0;
            for (var i = 0; i < relationStoreNumData.length; i++) {
              if (item.officialModel == relationStoreNumData[i].modityModel) {
                relationCount = relationStoreNumData[i].relationNum;
                item.relationStoreNum = relationCount;
                break;
              } else {
                item.relationStoreNum = 0;
              }
            }
          });
          this.loading = false;
        }
      });
    },
    isChinese(temp) {
      if (/^[\u4e00-\u9fa5]/.test(temp)) {
        return false;
      } else {
        return true;
      }
    },
    handelPage(val) {
      this.formTableData.page = val;
      this.updateRouter();
    },
    updateRouter() {
      this.$router.push({
        query: this.formTableData
      });
    },
    handdleEditModity(data) {
      this.$router.push({
        path: "/dealer/addEditeDealerModity",
        query: { id: data }
      });
    },
    // 选中
    handleSelectionChange(val) {
     
      this.multipleSelection = val;
      this.$emit("child-multipSelection", this.multipleSelection);
    },
      handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
  },
  watch: {
    $route: "getModityList"
  }
};
</script>

<style lang="less" scoped>
.paging {
  text-align: right;
  margin-top: 10px;
}
</style>
