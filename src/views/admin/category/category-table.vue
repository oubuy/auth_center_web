<template>
    <div>
          <Table height="538" border @on-selection-change="handleSelect" @on-sort-change="handleTableSort" ref="selection" :loading="loading" :columns="columns4" :data="tableData"></Table>
          <Page class="pageClass" show-sizer :page-size-opts="[10,20,50,80,100]" @on-page-size-change="changePageSize" :total="total" :current="formData.page" :page-size="formData.rows" @on-change="handlePage" show-total />
            <div v-if="showSaveButton" class="footerButton">
              <Button type="primary" @click="handleEditSave()">保 存</Button>
              <Button style="margin-left:15px;" @click="handleBack()">取 消</Button>
          </div>
    </div>
</template>
<script>
import {
  categoryTableList,
  categoryModityNum,
  updateSortNum
} from "@/api/category.js";
export default {
  data() {
    return {
      showSaveButton: false,
      formData: {
        page: 1,
        rows: 10,
        categoryId: "",
        status: "",
        platformJson: "",
        orderByClause: "" //排序  cg.xxxx
      },
      multations: [], //勾选中的
      total: 0,
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        // {
        //   title: "ID",
        //   key: "id",
        //   width: 250,
        //   sortable: "custom"
        // },
        {
          title: "类目",
          key: "cateName",
          width: 150,
          sortable: "custom"
        },
        {
          title: "LOGO",
          key: "logoUrl",
          width: 100,
          render: (h, params) => {
            if (params.row.logoUrl != null && params.row.logoUrl) {
              return h("img", {
                attrs: {
                  src: params.row.logoUrl
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
          title: "上级组织",
          key: "cateNamePath",
          width: 200
        },
        {
          title: "产品数量",
          key: "num",
          width: 100
          //   sortable: "custom"
        },
        {
          title: "排序",
          key: "sortNum",
          width: 100,
          sortable: "custom",
          render: (h, params) => {
            if (params.row.$isEdit) {
              let creat = this.$createElement;
              let categorySortParams = {};
              categorySortParams.id = params.row.id;

              return h("div", [
                creat("categoryColums", {
                  props: {
                    categorySortObj: categorySortParams
                  },
                  ref: "categorySortDom",
                  on: {
                    "on-sortValue": data => {
                      // this.handleFormatterSort(data);
                    }
                  }
                })
              ]);
            } else {
              return h("div", params.row.sortNum);
            }
          }
        },
        {
          title: "是否开启",
          key: "status",
          width: 150,
          //   sortable: "custom",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.status == true ? "#c5c8ce" : "#2db7f5"
                }
              },
              params.row.status == false ? "启用" : "禁用"
            );
          }
        },

        {
          title: "3D云",
          key: "cloud",
          width: 100,
          render: (h, params) => {
            let str = params.row.platformJson;
            if (str != null && str) {
              if (str.indexOf("3D_Cloud") != -1) {
                return h(
                  "span",
                  {
                    style: {
                      color: "#2db7f5"
                    }
                  },
                  "开启"
                );
              } else {
                return h(
                  "span",
                  {
                    style: {
                      color: "#c5c8ce"
                    }
                  },
                  "关闭"
                );
              }
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "关闭"
              );
            }
          }
        },
        {
          title: "IPAD",
          key: "iPad",
          width: 100,
          render: (h, params) => {
            let str = params.row.platformJson;
            if (str != null && str) {
              if (str.indexOf("iPad") != -1) {
                return h(
                  "span",
                  {
                    style: {
                      color: "#2db7f5"
                    }
                  },
                  "开启"
                );
              } else {
                return h(
                  "span",
                  {
                    style: {
                      color: "#c5c8ce"
                    }
                  },
                  "关闭"
                );
              }
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "关闭"
              );
            }
          }
        },

        {
          title: "官网",
          key: "official",
          width: 100,
          render: (h, params) => {
            let str = params.row.platformJson;
            if (str != null && str) {
              if (str.indexOf("official") != -1) {
                return h(
                  "span",
                  {
                    style: {
                      color: "#2db7f5"
                    }
                  },
                  "开启"
                );
              } else {
                return h(
                  "span",
                  {
                    style: {
                      color: "#c5c8ce"
                    }
                  },
                  "关闭"
                );
              }
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#c5c8ce"
                  }
                },
                "关闭"
              );
            }
          }
        },
        {
          title: "创建人",
          key: "creater",
          width: 150,
          sortable: "custom"
        },
        {
          title: "创建时间",
          key: "createDate",
          width: 200,
          sortable: "custom",
          render: function(h, params) {
            return h(
              "div",
              new Date(params.row.createDate).Format("yyyy-MM-dd")
            );
          }
        }
      ],
      tableData: [],
      tableTemp: [],
      loading: true,
      platformJsonObject: {} //平台
    };
  },
  created() {},
  mounted() {
    this.getCategoryTableList();
    this.initFormatter();
  },
  methods: {
    getCategoryTableList() {
    //  if (this.$route.query.addCategoryId) {
    //      console.log('data')
    //     this.$store.dispatch("setTreeSelectedId", -1);
    //     this.$store.dispatch("setTreeExpandIds", []);
    //   }
      this.tableData = [];
      this.tableTemp = [];
      this.loading = true;
      this.formData.categoryId = this.$route.query.categoryTableIdSearch;
      if (this.$route.query.statusSearch == "ALL") {
        this.formData.status = "";
      } else {
        this.formData.status = this.$route.query.statusSearch;
      }
      if (this.$route.query.platformJsonSearch == "ALL") {
        this.formData.status = "";
      } else {
        this.formData.platformJson = this.$route.query.platformJsonSearch;
      }

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

      categoryTableList(this.formData).then(response => {
        if (response.data.code == 200) {
          this.total = response.data.data.total;
          let dataArr = response.data.data.list;
          let categoryIds = [];
          dataArr.forEach(item => {
            categoryIds.push(item.id);
            let obj = {};
            obj.id = item.id;
            obj.cateName = item.cateName;
            obj.logoUrl = item.logoUrl;
            let cate_path_str = item.cateNamePath;
            if (cate_path_str.indexOf("/") != -1) {
              let cate_path_arr = cate_path_str.split("/");
              let cate_last = cate_path_arr.splice(cate_path_arr.length - 1, 1);
              obj.cateNamePath = cate_path_arr.join("/");
            }

            obj.sortNum = item.sortNum;
            obj.status = item.status;
            obj.platformJson = item.platformJson;
            obj.creater = item.creater;
            obj.createDate = item.createDate;
            this.tableTemp.push(obj);
          });
          this.getCategoryModityNum(categoryIds.join(","));
        }
      });
    },

    getCategoryModityNum(ids) {
      categoryModityNum({ categoryIds: ids }).then(response => {
        if (response.data.code == 200) {
          let categoryNum = response.data.data;
          categoryNum.forEach(itemCate => {
            this.tableTemp.forEach(itemTemp => {
              if (itemCate.id == itemTemp.id) {
                itemTemp.num = itemCate.num;
                itemTemp.isEdit = false;
              }
            });
          });
          this.tableData = this.tableTemp;

          this.loading = false;
        }
      });
    },
    initFormatter() {
      Date.prototype.Format = function(fmt) {
        //
        let o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
    },
    updateRouter() {
      let query = Object.assign({}, this.$route.query, this.formData);
      this.$router.push({
        query
      });
    },
    handlePage(page) {
      this.formData.page = page;
      this.updateRouter();
    },
    changePageSize(val) {
      this.formData.rows = val;
      this.updateRouter();
    },
    handleTableSort(param) {
      const toLine = hump =>
        hump.replace(/([A-Z]|\d+)/g, (a, l) => `_${l.toLowerCase()}`);
      if ("asc" == param.order || "desc" == param.order) {
        this.formData.orderByClause =
          "cg" + "." + toLine(param.key) + " " + param.order;
      } else {
        this.formData.orderByClause = null;
      }
      this.formData.page = 1;
      this.updateRouter();
    },
    handleSelect(selection) {
      this.multations = selection;
      this.$emit("child-selection", selection);
    },
    handleEditSort() {
      let data1Len = this.multations.length;
      if (data1Len != 0) {
        for (var i = 0; i < this.tableData.length; i++) {
          for (var j = 0; j < this.multations.length; j++) {
            if (this.tableData[i].id == this.multations[j].id) {
              this.$set(this.tableData[i], "$isEdit", true);
            }
          }
        }
        this.showSaveButton = true;
      } else {
        this.$Message.warning("请勾选类目！！");
      }
    },
    handleFormatterSort(data) {
      // let resultAssign = data;
      // for (var i = 0; i < this.tableData.length; i++) {
      //   for (var j = 0; j < resultAssign.length; j++) {
      //     if (this.tableData[i].id == resultAssign[j].id) {
      //       this.tableData[i].sortNum = resultAssign[j].sortValue;
      //       this.$set(this.tableData[i], "$isEdit", false);
      //       let parmas = {};
      //       parmas.categoryId = resultAssign[j].id;
      //       parmas.sortNum = resultAssign[j].sortValue;
      //       updateSortNum(parmas).then(response => {
      //         if (response.data.code == 200) {
      //           //this.$Message.success(response.data.msg);
      //         }
      //       });
      //     }
      //   }
      // }
    },
    handleEditSave() {
      let resultAssign = this.$refs.categorySortDom.handleAssign();
      if (resultAssign.length == 0) {
        this.$Message.warning("请输入排序号！！");
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          for (var j = 0; j < resultAssign.length; j++) {
            if (this.tableData[i].id == resultAssign[j].id) {
              this.tableData[i].sortNum = resultAssign[j].sortValue;
              this.$set(this.tableData[i], "$isEdit", false);
              let parmas = {};
              parmas.categoryId = resultAssign[j].id;
              parmas.sortNum = resultAssign[j].sortValue;
              let _j = j;
              updateSortNum(parmas).then(response => {
                if (response.data.code == 200) {
                  if (_j == resultAssign.length - 1) {
                    this.showSaveButton = false;
                    this.$Message.success(response.data.msg);
                    this.getCategoryTableList();
                  }
                }
              });
            }
          }
        }
        this.multations = [];
        this.$store.dispatch("handleRecordCategorySort", []);
      }
    },
    handleBack() {
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.multations.length; j++) {
          if (this.tableData[i].id == this.multations[j].id) {
            this.$set(this.tableData[i], "$isEdit", false);
          }
        }
      }
      this.showSaveButton = false;
    }
  },
  watch: {
    $route: "getCategoryTableList"
  }
};
</script>
<style lang="less" scoped>
.pageClass {
  margin-top: 10px;
  position: absolute;
  right: 10px;
}
.footerButton {
  position: absolute;
  bottom: 26px;
  left: 56%;
}
</style>


