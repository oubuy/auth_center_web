<template>
    <div>
          <!-- @click="handleEditPrice" -->
         <Table border ref="selection" height="550" @on-selection-change="handleSelect" @on-row-click="handleRowClick" :loading="loading" :columns="columns4" :data="data1">
           <template slot-scope="{ row, index }" slot="tags">
              <Tag v-for="(tag,index) in row.tags" :key="index">{{tag}}</Tag>
           </template>
         </Table>
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
  setPhysicalDisplay,
  getStoreModityTags
} from "@/api/store.js";
import $ from "jquery";

export default {
  data() {
    return {
      testH: "",
      showSaveButton: false,
      data1: [],
      dataStr: "", //临时存储数据
      hasPrice: false,
      tableArr: [],

      formData: {
        rows: 10,
        page: 1,
        storeId: "",
        categoryId :"",
        physicalDisplay :"",
        modityName:"",
        modityModel :"",
        officialModel:"",
        hasPrice: ""
      },
      multations: [], //勾选中的
      loading: true,
      total: 0,
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center",
          fixed: 'left'
        },
        {
          title: "图片",
          key: "imageUrl",
          // width: 100,
          fixed: 'left',
          render: (h, params) => {
            // console.log(params, "params");
            if (params.row.$isPhysical || params.row.isPhysical) {
              let creat = this.$createElement;
              let editImageObj = {};
              editImageObj.src = params.row.imageUrl;
              editImageObj.storeModityId = params.row.storeModityId;
              return h("div", [
                creat("dealerStorePhysicalImgColums", {
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
          fixed: 'left'
        },
        {
          title: "商品名称",
          key: "modityName",
          // width: 150
          render: (h, params) => {
              return h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                    textDecoration:"underline",
                    cursor: "pointer"
                  },
                  on: {
                    click:event=>{
                      this.handleEditStore(params);
                    }
                  }
                },
                params.row.modityName
              );
          }
        },
        {
          title: "型号",
          // width: 200,
          key: "officicalModel"
        },
        {
          title: "规格",
          // width: 200,
          key: "modityModel"
        },

        {
          title: "价格(片)",
          key: "storePriceVo",
          // width: 200,
          render: (h, params) => {
            if (params.row.$isEdit) {
              let storePriceVo = {};
              storePriceVo.storePriceVo = params.row.storePriceVo;
              storePriceVo.id = params.row.storeModityId;
              storePriceVo.modityId = params.row.modityId;

              let creat = this.$createElement;
              return h("div", [
                creat("dealerStoreEditPriceColums", {
                  props: {
                    storeObj: storePriceVo
                  },
                  ref: "storePriceOneDom",
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
              let storePriceVo = params.row.storePriceVo;
              storePriceVo.storeNumPrice = storePriceVo.storeNumPrice?storePriceVo.storeNumPrice:0;
              storePriceVo.storeActivityNumPrice = storePriceVo.storeActivityNumPrice?storePriceVo.storeActivityNumPrice:0;
              return h("div", [
                h("dealerStoreColums", {
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
          // width: 200,
          render: (h, params) => {
            if (params.row.$isEdit) {
              let storePriceVo2 = {};
              storePriceVo2.storePriceVo2 = params.row.storePriceVo2;
              storePriceVo2.id = params.row.storeModityId;
              storePriceVo2.modityId = params.row.modityId;
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
              storePriceVo2.storeSquarePrice = storePriceVo2.storeSquarePrice?storePriceVo2.storeSquarePrice:0;
              storePriceVo2.storeActivitySquarePrice = storePriceVo2.storeActivitySquarePrice?storePriceVo2.storeActivitySquarePrice:0;
              return h("div", [
                h("dealerStorePrices", {
                  props: {
                    storePrice2: storePriceVo2
                  }
                })
              ]);
            }
          }
        },
        {
          title: '商品标签',
          key: 'tags',
          slot: 'tags',
          width: 180
        },
      ]
    };
  },
  mounted() {},
  methods: {
    getTable() {
      // console.log(666)
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
        let defaultStoreId = localStorage.getItem("defaultStoreId");
        // localStorage.removeItem("defaultStoreId");
        this.formData.storeId = defaultStoreId;
      }
      if (this.$route.query.categoryId != null ) {
        this.formData.categoryId = this.$route.query.categoryId;
      }
      if (this.$route.query.modityModel != null ) {
        this.formData.modityModel = this.$route.query.modityModel;
      }else{
        this.formData.modityModel ="";
      }
      if (this.$route.query.modityName != null ) {
        this.formData.modityName = this.$route.query.modityName;
      }else{
        this.formData.modityName = "";
      }
      if (this.$route.query.officialModel != null ) {
        this.formData.officialModel = this.$route.query.officialModel;
      }else{
        this.formData.officialModel = "";
      }
      if (this.$route.query.physicalDisplay != null && this.$route.query.physicalDisplay !="null") {
        this.formData.physicalDisplay = this.$route.query.physicalDisplay;
      }else{
        this.formData.physicalDisplay ="";
      }

      // this.formData.storeId=this.$route.query.storeId;

      let params = {};
      params.page = this.formData.page;
      params.rows = this.formData.rows;
      params.storeId = this.formData.storeId;
      params.categoryId = this.formData.categoryId;
      params.physicalDisplay =this.formData.physicalDisplay;
      params.modityName = this.formData.modityName;
      params.modityModel = this.formData.modityModel;
      params.officialModel = this.formData.officialModel;
      params.hasPrice = this.hasPrice;
      this.formData.hasPrice = this.hasPrice;
      // let modityNameStr = this.formData.modityName;
      // let modityModelStr = this.formData.modityModel;
      // if (modityNameStr && !modityModelStr) {
      //   params.searchValue = modityNameStr;
      // } else if (!modityNameStr && modityModelStr) {
      //   params.searchValue = modityModelStr;
      // } else if (!modityNameStr && !modityModelStr) {
      //   params.searchValue = null;
      // }

      storeModityTable(params).then(reponse => {
        if (reponse.data.code == 200) {
          this.total = reponse.data.data.total;
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
            // obj.isPhysical = false;
            obj.storeModityId = item.storeModityId;
            obj.modityId = item.modityId;
            this.data1.push(obj);
          });
          this.tableArr = [...this.data1];
          this.fetchStoreModityTags(this.data1);
          this.loading = false;
        }else{
          this.loading = false;
        }
      });
    },
    fetchStoreModityTags(tableData) {
        if (tableData.length == 0) {
            return;
        }
        let storeModityIds = [];
        tableData.forEach(item => {
            if(item.storeModityId) {
                storeModityIds.push(item.storeModityId);
            }
        });
        if(storeModityIds.length == 0) {
            return;
        }
        getStoreModityTags({storeModityIds}).then(resp => {
            if (resp.data.code == 200) {
                tableData.forEach(row => {
                    for (let i = 0; i < resp.data.data.length; i++) {
                        let item = resp.data.data[i];
                        if (row.storeModityId == item.storeModityId) {
                            this.$set(row, 'tags', item.tags);
                            break;
                        }
                    }
                });
            }
        });
    },
    handleEditStore(data) {
      this.$router.push({
        path: "/dealer/editModity",
        query: {
          storeModityId: data.row.storeModityId,
          storeId: this.$route.query.storeId,
          modityId: data.row.modityId
        }
      });
    },
    handelPage(val) {
      this.showSaveButton = false;
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
       handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
    handleRemove(data) {
      let ids = [];
      ids.push(data.row.storeModityId);
      deleteShopModity({ idList: ids }).then(response => {
        if (response.data.code == 200) {
          this.$Message.success(response.data.msg);
          setTimeout(() => {
            this.getTable();
          }, 400);
        }
      });
    },
    handleEditPrice() {
      for (let i = 0; i < this.data1.length; i++) {
        this.$set(this.data1[i], "$isEdit", true);
      }
      this.showSaveButton = true;
      // let data1Len = this.multations.length;
      // if (data1Len != 0) {
      //   for (let i = 0; i < this.data1.length; i++) {
      //     for (let j = 0; j < this.multations.length; j++) {
      //       if (
      //         this.data1[i].storeModityId == this.multations[j].storeModityId
      //       ) {
      //         this.$set(this.data1[i], "$isEdit", true);
      //       }
      //     }
      //   }
      //   this.showSaveButton = true;
      // } else {
      //   this.$Message.warning("请勾选门店商品！！");
      // }
    },
    handleBack() {
      for (let i = 0; i < this.data1.length; i++) {
        this.$set(this.data1[i], "$isEdit", false);
      }
      // for (let i = 0; i < this.data1.length; i++) {
      //   for (let j = 0; j < this.multations.length; j++) {
      //     if (this.data1[i].storeModityId == this.multations[j].storeModityId) {
      //       this.$set(this.data1[i], "$isEdit", false);
      //     }
      //   }
      // }
      this.$emit("child-table", []);
      this.showSaveButton = false;
    },
    handleEditSave() {
      let eidtArr = this.$refs.storePriceOneDom.handleAssign();
      let editTwoArr = this.$refs.storePriceTwoDom.handleAssign();
      let resultAssignOne = [];
      for (var i = 0; i < eidtArr.length; i++) {
        for (var j = 0; j < editTwoArr.length; j++) {
          if (eidtArr[i].id&&editTwoArr[j].id&&eidtArr[i].id == editTwoArr[j].id) {
            let obj = {};
            obj.id = eidtArr[i].id;
            obj.numberPriceValue = eidtArr[i].numberPriceValue;
            obj.activePriceValue = eidtArr[i].activePriceValue;
            obj.numberPriceTwoValue = editTwoArr[j].numberPriceTwoValue;
            obj.activePriceTwoValue = editTwoArr[j].activePriceTwoValue;
            resultAssignOne.push(obj);
          }else if(eidtArr[i].modityId&&editTwoArr[j].modityId&&eidtArr[i].modityId == editTwoArr[j].modityId){
            let obj = {};
            obj.id = eidtArr[i].id;
            obj.modityId = eidtArr[i].modityId;
            obj.numberPriceValue = eidtArr[i].numberPriceValue;
            obj.activePriceValue = eidtArr[i].activePriceValue;
            obj.numberPriceTwoValue = editTwoArr[j].numberPriceTwoValue;
            obj.activePriceTwoValue = editTwoArr[j].activePriceTwoValue;
            resultAssignOne.push(obj);
          }
        }
      }

      let resultAssign = this.removeDuplicatedItem(resultAssignOne);
      resultAssign = this.removeDuplicatedItem(resultAssign);
      for (var i = 0; i < this.data1.length; i++) {
        for (var j = 0; j < resultAssign.length; j++) {
          if(!this.data1[i].storeModityId) {
            if(this.data1[i].modityId==resultAssign[j].modityId) {
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
              parmas.price1 = resultAssign[j].numberPriceTwoValue; //resultAssign[j].numberPriceValue;
              parmas.activityPrice1 = resultAssign[j].activePriceTwoValue; //resultAssign[j].activePriceValue;
              parmas.price2 = resultAssign[j].numberPriceValue; //resultAssign[j].numberPriceTwoValue;
              parmas.activityPrice2 = resultAssign[j].activePriceValue; //resultAssign[j].activePriceTwoValue;
              if(!this.$route.query.storeId) parmas.storeId = localStorage.getItem("defaultStoreId");
              else parmas.storeId = this.$route.query.storeId;
              parmas.modityId = resultAssign[j].modityId;
              parmas.physicalDisplay = 1;
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

              this.$set(this.data1[i], "$isEdit", false);
            }
          } else {
            if(this.data1[i].storeModityId == resultAssign[j].id) {
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
              parmas.price1 = resultAssign[j].numberPriceTwoValue; //resultAssign[j].numberPriceValue;
              parmas.activityPrice1 = resultAssign[j].activePriceTwoValue; //resultAssign[j].activePriceValue;
              parmas.price2 = resultAssign[j].numberPriceValue; //resultAssign[j].numberPriceTwoValue;
              parmas.activityPrice2 = resultAssign[j].activePriceValue; //resultAssign[j].activePriceTwoValue;
              if(!this.$route.query.storeId) parmas.storeId = localStorage.getItem("defaultStoreId");
              else parmas.storeId = this.$route.query.storeId;
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

              this.$set(this.data1[i], "$isEdit", false);
            }
          }

        }
      }
      this.multations = [];
      this.$emit("child-table", []);
    },
    // 去掉旧数据
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id&&arr[j].id&&arr[i].id == arr[j].id) {
            arr.splice(i, 1); //console.log(arr[j]);
            j--;
          }else if(arr[i].modityId&&arr[j].modityId&&arr[i].modityId == arr[j].modityId){
            arr.splice(i, 1);
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
              this.getTable();
            }
          });
        }
      }
      this.multations = [];
    }
  },
  watch: {
    $route: "getTable",
    hasPrice: "getTable"
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
