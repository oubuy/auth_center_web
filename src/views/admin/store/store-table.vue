<template>
    <div>
         <Table border ref="selection" height="550" @on-selection-change="handleSelect" :loading="loading" :columns="columns4" :data="data1"></Table>
          <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" />
          <div v-if="showSaveButton" class="footerButton">
              <Button type="primary" @click="handleEditSave()">保 存</Button>
              <Button style="margin-left:15px;" @click="handleBack()">取 消</Button>
          </div>
    </div>
</template>

<script>
import {
  storeModityTable,
  deleteShopModity,
  shopModityMannyPrice,
  setPhysicalDisplay
} from "@/api/store.js";

export default {
  data() {
    return {
      showSaveButton: false,
      data1: [],
      formData: {
        rows: 10,
        page: 1,
        storeId: ""
      },
      multations: [], //勾选中的
      loading: true,
      total: 0,
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: "left"
        },
        {
          title: "图片",
          key: "imageUrl",
          fixed: "left",
          // width: 100,
          render: (h, params) => {
            if (params.row.$isPhysical || params.row.isPhysical) {
              let creat = this.$createElement;
              let editImageObj = {};
              editImageObj.src = params.row.imageUrl;
              editImageObj.storeModityId = params.row.storeModityId;
              return h("div", [
                creat("storePhysicalColums", {
                  props: {
                    editImageObj: editImageObj
                  },
                  ref: "physicalImgDom",
                  on: {
                    "on-setPhysical": data => {
                      // console.log(data, "data22");
                      this.cancelPhysical(data);
                    }
                  }
                })
              ]);
            } else {
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
          }
        },
        {
          title: "类目",
          key: "categoryName",
          // width: 300,
          fixed: "left"
        },
        {
          title: "商品名称",
          key: "modityName",
          // width: 150
        },
        {
          title: "型号",
          // width: 200,
          key: "officicalModel"
        },
        {
          title: "规格",
          // width: 193,
          key: "modityModel"
        },

        {
          title: "价格(片)",
          key: "storePriceVo",
          // width: 150,
          render: (h, params) => {
            if (params.row.$isEdit) {
              let storePriceVo = {};
              storePriceVo.storePriceVo = params.row.storePriceVo;
              storePriceVo.id = params.row.storeModityId;
              let creat = this.$createElement;
              return h("div", [
                creat("dealerStoreEditPriceColums", {
                  props: {
                    storeObj: storePriceVo
                  },
                  ref: "storePriceOneDom",
                  on: {
                    "on-numberPriceValue": data => {},
                    "on-activePriceValue": data => {}
                  }
                })
              ]);
            } else {
              let storePriceVo = params.row.storePriceVo;
              return h("div", [
                h("storeColums", {
                  props: {
                    storeObj: storePriceVo
                  }
                })
              ]);
            }
          }
        },
        {
          title: "价格(方)",
          key: "storePriceVo2",
          // width: 150,
          render: (h, params) => {
            if (params.row.$isEdit) {
              let storePriceVo2 = {};
              storePriceVo2.storePriceVo2 = params.row.storePriceVo2;
              storePriceVo2.id = params.row.storeModityId;
              let creat = this.$createElement;
              return h("div", [
                creat("dealerStoreEditPriceTwoColums", {
                  props: {
                    storeParams: storePriceVo2
                  },
                  ref: "storePriceTwoDom",
                  on: {
                    "on-numberPriceValue": data => {
                      // this.data1[
                      //   params.index
                      // ].storePriceVo.storeNumPrice = data;
                      // this.$set(this.data1[params.index], '$isEdit', false)
                    },
                    "on-activePriceValue": data => {
                      // this.data1[
                      //   params.index
                      // ].storePriceVo.storeActivityNumPrice = data;
                    }
                  }
                })
              ]);
            } else {
              let storePriceVo2 = params.row.storePriceVo2;
              return h("div", [
                h("storePrices", {
                  props: {
                    storePrice2: storePriceVo2
                  }
                })
              ]);
            }
          }
        },

        // {
        //   title: "审核状态",
        //   key: "audit",
        //   width: 100,
        //   render: (h, params) => {
        //     if (params.row.type == "1") {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "#2db7f5"
        //           }
        //         },
        //         "审核通过"
        //       );
        //     } else if (params.row.type == "2") {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "c5c8ce"
        //           }
        //         },
        //         "审核不通过"
        //       );
        //     } else {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "c5c8ce"
        //           }
        //         },
        //         "待审核"
        //       );
        //     }
        //   }
        // },
        // {
        //   title: "上架状态",
        //   key: "status",
        //   width: 100,
        //   render: (h, params) => {
        //     if (params.row.status == "0") {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "#2db7f5"
        //           }
        //         },
        //         "上架"
        //       );
        //     } else if (params.row.status == "1") {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "#c5c8ce"
        //           }
        //         },
        //         "下架"
        //       );
        //     }
        //   }
        // },
        // {
        //   title: "创建人",
        //   key: "creater",
        //   width: 100
        // },
        // {
        //   title: "创建时间",
        //   key: "createDate",
        //   width: 100
        // },
        {
          title: "操作",
          key: "",
          width: 150,
          fixed: "right",
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
                      this.handleEditStore(params);
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
                "移除"
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    // if (localStorage.getItem("innerModityStoreId")) {
    //   this.handleGetTable();
    // }
    this.handleGetTable();
  },
  methods: {
    handleGetTable() {
      this.data1 = [];
      this.loading = true;
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
      if (this.$route.query.storeId != null) {
        this.formData.storeId = this.$route.query.storeId;
      } else {
        this.$emit("child-cancleStatus", true);
        this.formData.storeId = 0; //默认值
        // return;
      }

      let params = {};
      params.page = this.formData.page;
      params.rows = this.formData.rows;
      params.storeId = this.formData.storeId;
      params.categoryId = this.$route.query.categoryId;
      params.physicalDisplay = this.$route.query.physicalDisplay;
      let modityNameStr = this.$route.query.modityName;
      let modityModelStr = this.$route.query.modityModel;
      if (modityNameStr && !modityModelStr) {
        params.searchValue = modityNameStr;
      } else if (!modityNameStr && modityModelStr) {
        params.searchValue = modityModelStr;
      } else if (!modityNameStr && !modityModelStr) {
        params.searchValue = null;
      }

      storeModityTable(params).then(reponse => {
        if (reponse.data.code == 200) {
          this.total = reponse.data.data.total;
          // this.data1 = reponse.data.data.list;
          let storeArr = reponse.data.data.list;
          storeArr.forEach(item => {
            let obj = {};
            obj.imageUrl = item.imageUrl+"?x-oss-process=image/resize,w_100";
            obj.categoryName = item.categoryName;
            obj.modityName = item.modityName;
            obj.officicalModel = item.officicalModel;
            obj.modityModel = item.modityModel;
            obj.storePriceVo = item.storePriceVo;
            obj.storePriceVo2 = item.storePriceVo2;
            obj.audit = item.audit;
            obj.status = item.status;
            obj.creater = item.creater;
            obj.createDate = item.createDate;
            obj.isEdit = false;
            if (item.physicalDisplay != null) {
              if (item.physicalDisplay == 0) {
                obj.isPhysical = true;
              } else if (item.physicalDisplay == 1) {
                obj.isPhysical = false;
              }
            } else {
              obj.isPhysical = false;
            }
            obj.storeModityId = item.storeModityId;
            this.data1.push(obj);
          });
          this.loading = false;
        }
      });
    },

    handleEditStore(data) {
      this.$router.push({
        path: "/admin/store/editModity",
        query: {
          storeModityId: data.row.storeModityId,
          storeId: this.$route.query.storeId
        }
      });
    },
    handelPage(val) {
      this.formData.page = val;
      this.updateRouter();
    },
    updateRouter() {
      this.$router.push({
        query: this.formData
      });
    },
    handleSelect(row) {
      this.multations = row;
      this.$emit("child-qcord", this.multations);
    },
    handleRemove(data) {
      let ids = [];
      ids.push(data.row.storeModityId);
      deleteShopModity({ idList: ids }).then(response => {
        if (response.data.code == 200) {
          this.$Message.success(response.data.msg);
          setTimeout(() => {
            this.handleGetTable();
          }, 400);
        }
      });
    },
    handleEditPrice() {
      let data1Len = this.multations.length;
      if (data1Len != 0) {
        for (let i = 0; i < this.data1.length; i++) {
          for (let j = 0; j < this.multations.length; j++) {
            if (
              this.data1[i].storeModityId == this.multations[j].storeModityId
            ) {
              this.$set(this.data1[i], "$isEdit", true);
            }
          }
        }
        this.showSaveButton = true;
      } else {
        this.$Message.warning("请勾选门店商品！！");
      }
    },
    handleEditSave() {
      let eidtArr = this.$refs.storePriceOneDom.handleAssign();
      let editTwoArr = this.$refs.storePriceTwoDom.handleAssign();

      let resultAssignOne = [];
      for (var i = 0; i < eidtArr.length; i++) {
        for (var j = 0; j < editTwoArr.length; j++) {
          if (eidtArr[i].id == editTwoArr[j].id) {
            let obj = {};
            obj.id = eidtArr[i].id;
            obj.numberPriceValue = eidtArr[i].numberPriceValue;
            obj.activePriceValue = eidtArr[i].activePriceValue;
            obj.numberPriceTwoValue = editTwoArr[j].numberPriceTwoValue;
            obj.activePriceTwoValue = editTwoArr[j].activePriceTwoValue;
            resultAssignOne.push(obj);
          }
        }
      }
      let resultAssign = this.removeDuplicatedItem(resultAssignOne);

      for (var i = 0; i < this.data1.length; i++) {
        for (var j = 0; j < resultAssign.length; j++) {
          if (this.data1[i].storeModityId == resultAssign[j].id) {
            this.data1[i].storePriceVo.storeNumPrice =
              resultAssign[j].numberPriceValue;
            this.data1[i].storePriceVo.storeActivityNumPrice =
              resultAssign[j].activePriceValue;
            this.data1[i].storePriceVo2.storeSquarePrice =
              resultAssign[j].numberPriceTwoValue;
            this.data1[i].storePriceVo2.storeActivitySquarePrice =
              resultAssign[j].activePriceTwoValue;
            this.$set(this.data1[i], "$isEdit", false);
            let _this = this;
            let parmas = {};
            //activityPrice1， price1是方   price2 activityPrice2是片
            parmas.storeModityId = resultAssign[j].id;
            parmas.price1 = resultAssign[j].numberPriceTwoValue;
            parmas.activityPrice1 = resultAssign[j].activePriceTwoValue;
            parmas.price2 = resultAssign[j].numberPriceValue;
            parmas.activityPrice2 = resultAssign[j].activePriceValue;
            if (j == resultAssign.length - 1) {
              shopModityMannyPrice(parmas).then(response => {
                if (response.data.code == 200) {
                  this.showSaveButton = false;
                  this.$Message.success(response.data.msg);
                }
              });
            } else {
              shopModityMannyPrice(parmas).then(response => {
                if (response.data.code == 200) {
                  this.showSaveButton = false;
                }
              });
            }

            // this.$set(this.data1[i], "$isEdit", false);
          }
        }
      }
      this.multations = [];
      this.$emit("child-table", []);
    },
    handleBack() {
      for (let i = 0; i < this.data1.length; i++) {
        for (let j = 0; j < this.multations.length; j++) {
          if (this.data1[i].storeModityId == this.multations[j].storeModityId) {
            this.$set(this.data1[i], "$isEdit", false);
          }
        }
      }
      this.$emit("child-table", []);
      this.showSaveButton = false;
    },
    // 去掉旧数据
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id == arr[j].id) {
            arr.splice(i, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      return arr;
    },
    handleSetPhysicalDisplay() {
      let data1Len = this.data1.length;
      if (data1Len != 0) {
        if (this.multations.length != 0) {
          for (let i = 0; i < this.data1.length; i++) {
            for (let j = 0; j < this.multations.length; j++) {
              if (
                this.data1[i].storeModityId == this.multations[j].storeModityId
              ) {
                this.$set(this.data1[i], "$isPhysical", true);
                let parmas = {};
                parmas.storeIdModityId = this.multations[j].storeModityId;
                parmas.physicalDisplay = "0";
                let _j = j;
                setPhysicalDisplay(parmas).then(response => {
                  if (_j == this.multations.length - 1) {
                    this.$Message.success(response.data.msg);
                  }
                });
              }
            }
          }
          // console.log(this.data1, "data1");
          this.$emit("child-table", []);
        } else {
          this.$Message.warning("请选择商品！！");
        }
      } else {
        this.$Message.warning("门店没有商品，不能设置实物图！！");
      }
    },
    cancelPhysical(data) {
      let cancelData = data;
      for (let i = 0; i < this.data1.length; i++) {
        if (this.data1[i].storeModityId == cancelData.storeModityId) {
          this.$set(this.data1[i], "$isPhysical", false);
          let parmas = {};
          parmas.storeIdModityId = cancelData.storeModityId;
          parmas.physicalDisplay = "1";
          setPhysicalDisplay(parmas).then(response => {
            if (response.data.code == 200) {
              this.$Message.success("取消成功！！");
              this.handleGetTable();
            }
          });
        }
      }
      this.multations = [];
    }
  },
  watch: {
    $route: "handleGetTable"
  }
};
</script>

<style lang="less" scoped>
.paging {
  text-align: right;
  margin-top: 10px;
}
.footerButton {
  position: absolute;
  bottom: 20px;
  left: 55%;
}
</style>

