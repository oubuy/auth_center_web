<template>
  <div style="padding-bottom: 1.8rem;">
    <div v-if="showPage">
      <div class="input_box">
        <div class="border_bottom">
          <van-field v-model="formData.name" label="名称" clearable placeholder="例:呼和浩特地铁3号线" label-align="left"
            label-width="1.8rem" />
        </div>
        <div class="border_bottom">
          <van-field v-model="formData.introduction" label="简介" clearable placeholder="请输入项目简介" label-align="left"
            label-width="1.8rem" />
        </div>
        <div class="border_bottom" style="display: flex;">
          <div class="label">属性</div>
          <div style="margin-right: .4rem;">
            <van-field :value="formData.caseAttr1" @click="showCaseAttrOneBox" readonly clickable clearable placeholder="请选择"
              label-align="left" label-width="1.8rem" style="width: 3rem;" />
            <van-popup v-model="showCaseAttrOnePicker" round position="bottom">
              <van-picker title="工程属性1" show-toolbar :columns="caseAttrOneColumns" @confirm="onCaseAttrOneConfirm"
                @cancel="onCaseAttrOneCancel" />
            </van-popup>
          </div>
          <div>
            <van-field :value="formData.caseAttr2" @click="showCaseAttrTwoBox" readonly clickable clearable placeholder="请选择"
              label-align="left" label-width="1.8rem" style="width: 3rem;" />
            <van-popup v-model="showCaseAttrTwoPicker" round position="bottom">
              <van-picker title="工程属性2" show-toolbar :columns="columns" @confirm="onCaseAttrTwoConfirm" @cancel="onCaseAttrTwoCancel" />
            </van-popup>
          </div>
        </div>
        <div class="border_bottom">
          <van-field :value="addressVal" @click="showAddressBox" label="地址" readonly clickable clearable placeholder="省/市/区"
            label-align="left" label-width="1.8rem" />
          <van-popup v-model="showCityPicker" round position="bottom">
            <van-picker title="地区" show-toolbar :columns="addressList" value-key="name" @confirm="onConfirm" @cancel="onCancel"
              @change="onChange" />
          </van-popup>
        </div>
      </div>
      <div class="product_box">
        <div class="title">关联产品</div>
        <div class="product_list">
          <div class="product_item" v-for="(item,index) in formData.productList">
            <div class="border_bottom" style="position: relative;">
              <van-field v-model="item.officialModel" label="型号" @input="searchProduct($event,index)" @blur="handleSearchBlur"
                clearable placeholder="请输入型号" label-align="left" label-width="1.8rem" />
              <div class="search_list" v-if="showSearchList&&activedIndex==index">
                <div style="font-size: .36rem;padding: .3rem;text-align: left;border-bottom: 1px solid #f1f1f1;" @click="chooseProduct(cItem,index)"
                  v-for="(cItem,cIndex) in searchList">{{cItem.officialModel}} {{cItem.modityName}}</div>
              </div>
            </div>
            <div class="border_bottom">
              <van-field v-model="item.modityName" label="名称" clearable placeholder="请输入名称" label-align="left"
                label-width="1.8rem" />
            </div>
            <div class="border_bottom">
              <van-field v-model="item.quantity" label="数量/方" type="number" clearable placeholder="请输入数量" label-align="left"
                label-width="1.8rem" />
            </div>
            <div class="border_bottom">
              <van-field v-model="item.usePosition" label="应用位置" clearable placeholder="请输入应用位置" label-align="left"
                label-width="1.8rem" />
            </div>
            <div style="display: flex;justify-content: flex-end;padding: .2rem;">
              <div class="delete_button" @click="deleteProduct(index)">删除</div>
            </div>
          </div>
        </div>
      </div>
      <div class="add_box">
        <div class="add_button" @click="addProduct">{{addProductText}}</div>
      </div>
      <div class="next_step">
        <div class="next_button" @click="goUploadImg">下一步</div>
      </div>
    </div>
    <v-loading :showPage="showPage"></v-loading>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  import {
    findProducts,
    getProvince,
    getCity,
    getCounty,
    sceneCaseDetail
  } from "@/api/uploadImg.js";
  import {
    getComInfo
  } from "@/api/building.js";
  import {
    province,
    city,
    area
  } from "@/api/address.js";
  export default {
    data() {
      return {
        id: this.$route.query.id || "",
        showPage: false,
        showSearchList: false,
        programmeId: "",
        formData: {
          name: "",
          introduction: "",
          caseAttr1: "",
          caseAttr2: "",
          provinceId: "",
          cityId: "",
          areaId: "",
          productList: [],
          imageSjtList: [],
          imageXgtList: [],
          videoList: [],
          sceneType: 1
        },
        showCityPicker: false,
        showCaseAttrTwoPicker: false,
        showLayoutPicker: false,
        showAreaPicker: false,
        showCaseAttrOnePicker: false,
        addressVal: '',
        layoutVal: '',
        sceneVal: '',
        areaVal: '',
        sceneType: '',
        columns: [],
        caseAttrOneColumns: ["市政工程", "标杆性楼盘"],
        layoutColumns: [],
        areaColumns: [],
        searchList: [],
        addProductText: "",
        addressList: [{
          values: []
        }, {
          values: []
        }, {
          values: []
        }],
        idList: []
      }
    },
    components: {},
    created() {
      if (!this.id) {
        let data = localStorage.getItem("formData");
        console.log(data);
        this.getComInfo();
        this.addProductText = "添加产品";
        this.showPage = true;
        if(data) {
          this.formData = JSON.parse(data);
        }
        this.$nextTick(() => {
          // if (this.formData.productList.length > 1) document.getElementsByClassName("next_step")[0].style.position =
          //   "relative";
          let inputList = document.getElementsByClassName("van-field__control");
          let cellList = document.getElementsByClassName("van-cell");
          let labelList = document.getElementsByClassName("van-field__label--left");
          let itemList = document.getElementsByClassName("border_bottom");
          document.getElementsByTagName("body")[0].style.background = "#f1f1f1";
          for (let i = 0; i < labelList.length; i++) {
            labelList[i].style.fontSize = '.36rem';
            labelList[i].style.textAlign = 'left';
            labelList[i].style.color = '#313131';
          }
          for (let i = 0; i < inputList.length; i++) {
            inputList[i].style.fontSize = '.36rem';
          }
          for (let i = 0; i < cellList.length; i++) {
            cellList[i].style.alignItems = 'center';
            cellList[i].style.padding = '.2rem';
          }
          cellList[2].style.padding = '0';
          cellList[3].style.padding = '0';
          cellList[2].style.margin = '.2rem 0';
          cellList[3].style.margin = '.2rem 0';
          cellList[2].style.border = '1px solid #eae7e7';
          cellList[3].style.border = '1px solid #eae7e7';
          cellList[2].style.borderRadius = '2px';
          cellList[3].style.borderRadius = '2px';
          inputList[2].style.padding = '0 .1rem';
          inputList[3].style.padding = '0 .1rem';
        })
      }else {
        this.addProductText = "继续添加";
        this.getSceneCaseDetail();
      }
      this.getProvince();
    },
    mounted() {

    },
    methods: {
      /*
        获取实景案例详情
      */
      getSceneCaseDetail() {
        let id = this.$route.query.id;
        sceneCaseDetail(id).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data.sceneCase;
            this.formData.name = data.name;
            this.formData.introduction = data.introduction;
            this.formData.caseAttr1 = data.caseAttr1;
            this.formData.caseAttr2 = data.caseAttr2;
            if (this.formData.caseAttr1 == "市政工程") this.columns = ["学校", "医院", "市政府大楼", "配套服务中心", "高速服务区", "机场",
              "地铁"
            ];
            else if (this.formData.caseAttr1 == "标杆性楼盘") this.columns = ["特色小区", "特色建筑"];
            this.formData.provinceId = data.provinceId;
            this.formData.cityId = data.cityId;
            this.formData.areaId = data.areaId;
            this.formData.modelName = data.modelName;
            this.formData.modelArea = data.modelArea;
            this.formData.styleId = data.styleId;
            this.formData.buildingId = data.buildingId;
            this.formData.modelId = data.modelId;
            this.formData.sceneType = data.sceneType;
            this.formData.auditStatus = data.auditStatus;
            this.formData.productList = res.data.data.productList;
            this.formData.imageSjtList = res.data.data.imageSjtList;
            this.formData.imageXgtList = res.data.data.imageXgtList;
            this.formData.videoList = res.data.data.videoList;
            this.addressVal = data.provinceName + '/' + data.cityName + '/' + data.areaName;
            this.idList.push(this.formData.provinceId);
            this.idList.push(this.formData.cityId);
            this.idList.push(this.formData.areaId);
            this.showPage = true;
            this.$nextTick(() => {
              // if (this.formData.productList.length > 1) document.getElementsByClassName("next_step")[0].style.position =
              //   "relative";
              let inputList = document.getElementsByClassName("van-field__control");
              let cellList = document.getElementsByClassName("van-cell");
              let labelList = document.getElementsByClassName("van-field__label--left");
              let itemList = document.getElementsByClassName("border_bottom");
              document.getElementsByTagName("body")[0].style.background = "#f1f1f1";
              for (let i = 0; i < labelList.length; i++) {
                labelList[i].style.fontSize = '.36rem';
                labelList[i].style.textAlign = 'left';
                labelList[i].style.color = '#313131';
              }
              for (let i = 0; i < inputList.length; i++) {
                inputList[i].style.fontSize = '.36rem';
              }
              for (let i = 0; i < cellList.length; i++) {
                cellList[i].style.alignItems = 'center';
                cellList[i].style.padding = '.2rem';
              }
              cellList[2].style.padding = '0';
              cellList[3].style.padding = '0';
              cellList[2].style.margin = '.2rem 0';
              cellList[3].style.margin = '.2rem 0';
              cellList[2].style.border = '1px solid #eae7e7';
              cellList[3].style.border = '1px solid #eae7e7';
              cellList[2].style.borderRadius = '2px';
              cellList[3].style.borderRadius = '2px';
              inputList[2].style.padding = '0 .1rem';
              inputList[3].style.padding = '0 .1rem';
            })
          }
        });
      },
      getComInfo() {
        getComInfo().then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            if (data.provinceName && data.cityName && data.districtName) {
              let addressIdStr = data.provinceCode + "," + data.cityCode + "," + data.districtCode;
              this.addressVal = data.provinceName + '/' + data.cityName + '/' + data.districtName;
              this.idList = addressIdStr.split(",");
            }
          }
        })
      },
      addProduct() {
        let obj = {
          productId: "",
          quantity: "",
          usePosition: "",
          officialModel: "",
          modityName: ""
        }
        this.formData.productList.push(obj);
        this.addProductText = "继续添加";
        if (this.formData.productList.length > 1) {
          // document.getElementsByClassName("next_step")[0].style.position = "relative";

        }
        this.$nextTick(() => {
          let inputList = document.getElementsByClassName("van-field__control");
          let cellList = document.getElementsByClassName("van-cell");
          let labelList = document.getElementsByClassName("van-field__label--left");
          for (let i = 3; i < labelList.length; i++) {
            labelList[i].style.fontSize = '.36rem';
            labelList[i].style.textAlign = 'left';
            labelList[i].style.color = '#313131';
          }
          for (let i = 5; i < inputList.length; i++) {
            inputList[i].style.fontSize = '.36rem';
          }
          for (let i = 5; i < cellList.length; i++) {
            cellList[i].style.alignItems = 'center';
            cellList[i].style.padding = '.2rem';
          }
          var t = document.body.clientHeight;
          window.scroll({
            top: t,
            left: 0,
            behavior: 'smooth'
          });
        })
      },
      searchProduct(val, index) {
        if (!val) {
          this.searchList = [];
          this.showSearchList = false;
          return;
        }
        let obj = {
          productName: val
        }
        findProducts(obj).then(res => {
          if (res.data.code == 200) {
            this.searchList = res.data.data;
            this.showSearchList = true;
            this.activedIndex = index;
            if(!this.searchList.length) {
              console.log(this.formData.productList[index].officialModel)
            }
          }
        })
      },
      chooseProduct(item, index) {
        this.formData.productList[index].officialModel = item.officialModel;
        this.formData.productList[index].modityName = item.modityName;
        this.formData.productList[index].productId = item.skuModityId;
        this.searchList = [];
        this.showSearchList = false;
      },
      handleSearchBlur() {
        setTimeout(() => {
          this.showSearchList = false;
        }, 200);
      },
      deleteProduct(index) {
        this.$dialog.confirm({
            title: '删除关联产品',
            message: '确定删除该关联产品吗？',
          })
          .then(() => {
            // on confirm
            this.formData.productList.splice(index, 1);
            // if (this.formData.productList.length < 2) document.getElementsByClassName("next_step")[0].style.position = "absolute";
            if (!this.formData.productList.length) this.addProductText = "添加产品";
          })
          .catch(() => {
            // on cancel
          });
      },
      goUploadImg() {
        if (!this.formData.name) {
          this.$toast('请填写名称');
          return;
        }
        if (!this.formData.introduction) {
          this.$toast('请填写简介');
          return;
        }
        if (!this.formData.caseAttr1) {
          this.$toast('请完整选择工程属性');
          return;
        }
        if (!this.formData.caseAttr2) {
          this.$toast('请完整选择工程属性');
          return;
        }
        if (!this.formData.productList.length) {
          this.$toast('请添加关联产品');
          return;
        }
        let iconRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
        if(iconRule.test(this.formData.name)||iconRule.test(this.formData.introduction)) {
          this.$toast('不能输入表情符号，请重新输入');
          return;
        }
        this.formData.provinceId = this.idList[0];
        this.formData.cityId = this.idList[1];
        this.formData.areaId = this.idList[2];
        this.formData.id = this.$route.query.id || "";
        if (!this.formData.provinceId || !this.formData.cityId || !this.formData.areaId) {
          this.$toast('请完整选择省市区');
          return;
        }
        let flag = true;
        for (let i = 0; i < this.formData.productList.length; i++) {
          if (!this.formData.productList[i].modityName || !this.formData.productList[i].officialModel) {
            this.$toast('请完整填写关联产品信息');
            flag = false;
            break;
          }
          if(iconRule.test(this.formData.productList[i].modityName)||iconRule.test(this.formData.productList[i].officialModel)||
            iconRule.test(this.formData.productList[i].quantity)||iconRule.test(this.formData.productList[i].usePosition)) {
              this.$toast('不能输入表情符号，请重新输入');
              flag = false;
              break;
           }
        }
        if (!flag) return;
        let dataStr = JSON.stringify(this.formData);
        localStorage.setItem("formData", dataStr);
        this.$router.push({
          path: '/sceneImgUploadMobile'
        })
      },
      showCaseAttrTwoBox() {
        this.showCaseAttrTwoPicker = true;
      },
      showCaseAttrOneBox() {
        this.showCaseAttrOnePicker = true;
      },
      onCaseAttrOneConfirm(item) {
        if(this.formData.caseAttr1!=item) this.formData.caseAttr2 = "";
        this.formData.caseAttr1 = item;
        if (this.formData.caseAttr1 == "市政工程") this.columns = ["学校", "医院", "市政府大楼", "配套服务中心", "高速服务区", "机场",
          "地铁"
        ];
        else if (this.formData.caseAttr1 == "标杆性楼盘") this.columns = ["特色小区", "特色建筑"];
        console.log(this.columns)
        this.showCaseAttrOnePicker = false;
      },
      onCaseAttrOneCancel() {
        this.showCaseAttrOnePicker = false;
      },
      onCaseAttrTwoConfirm(item) {
        this.formData.caseAttr2 = item;
        this.showCaseAttrTwoPicker = false;
      },
      onCaseAttrTwoCancel() {
        this.showCaseAttrTwoPicker = false;
      },
      onLayoutConfirm(val) {
        this.layoutVal = val;
        this.showLayoutPicker = false;
      },
      onLayoutCancel() {
        this.showLayoutPicker = false;
      },
      onAreaConfirm(val) {
        this.areaVal = val;
        this.showAreaPicker = false;
      },
      onAreaCancel() {
        this.showAreaPicker = false;
      },
      /*
        选择省市区相关方法
      */
      showAddressBox() {
        this.showCityPicker = true;
      },
      getProvince() {
        province().then(res => {
          if (res.status == 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].provinceName;
              obj.id = res.data.data[i].provinceId;
              this.addressList[0].values.push(obj);
            }
            let originalObj = {
              name: '请选择'
            };
            this.addressList[0].values.splice(0, 0, originalObj);
          }
        });
      },
      getCity(value, index) {
        let obj = {};
        let provinceId = value[index].id;
        if (!provinceId) {
          this.addressList[1].values = [];
          this.addressList[2].values = [];
          return;
        }
        obj.provinceId = provinceId;
        city(obj).then(res => {
          if (res.status == 200) {
            this.addressList[1].values = [];
            this.addressList[2].values = [];
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].cityName;
              obj.id = res.data.data[i].cityId;
              this.addressList[1].values.push(obj);
            }
            let originalObj = {
              name: '请选择'
            };
            this.addressList[1].values.splice(0, 0, originalObj);
          }
        })
      },
      getCounty(val, i) {
        let obj = {};
        let cityId = val[i].id;
        if (!cityId) {
          this.addressList[2].values = [];
          return;
        }
        obj.cityId = cityId;
        area(obj).then(res => {
          if (res.status == 200) {
            this.addressList[2].values = [];
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].areaName;
              obj.id = res.data.data[i].areaId;
              this.addressList[2].values.push(obj);
            }
            let originalObj = {
              name: '请选择'
            };
            this.addressList[2].values.splice(0, 0, originalObj);
          }
        })
      },
      onChange(picker, value, index) {
        if (index == 0) this.getCity(value, index);
        else if (index == 1) this.getCounty(value, index);
      },
      onConfirm(chooseList) {
        let addArr = [];
        let flag = true;
        this.idList = [];
        for (let i = 0; i < chooseList.length; i++) {
          if (!chooseList[i] || !chooseList[i].id) {
            this.$toast('请选择完整省市区');
            flag = false;
            break;
          } else {
            if (chooseList[i].name && chooseList[i].name != '请选择' && chooseList[i].name != "null")
              addArr.push(chooseList[i].name);
            if (chooseList[i].id)
              this.idList.push(chooseList[i].id);
          }
        }
        if (!flag) return;
        this.addressVal = addArr.join('/');
        this.showCityPicker = false;
      },
      onCancel() {
        this.showCityPicker = false;
      },
      /*
        点击按钮相关方法
      */
      save() {

      }
    }
  }
</script>

<style scoped>
  .label {
    width: 2rem;
    padding-left: .2rem;
    text-align: left;
    display: flex;
    align-items: center;
    font-size: .36rem;
    color: #313131;
  }

  .product_item {
    margin: 0 0 .2rem;
    padding-left: .2rem;
    background: #fff;
  }

  .border_bottom {
    border-bottom: 1px solid #ebedf0;
  }

  .input_box {
    padding: 0 0.2rem 0 0.2rem;
    background-color: #fff;
  }

  .button_box {
    margin-top: .6rem;
    margin-right: .4rem;
  }

  .icon_box {
    position: absolute;
    right: -0.5rem;
    top: -0.4rem;
    width: 1rem;
    height: 1rem;
  }

  .van-cell:not(:last-child)::after {
    border: none !important;
  }

  .title {
    text-align: left;
    margin: .2rem 0;
    background-color: #fff;
    color: rgb(49, 49, 49);
    font-size: .36rem;
    font-weight: bold;
    padding: .2rem 0 .2rem .4rem;
  }

  .delete_button {
    border: 1px solid #e32f2f;
    border-radius: 4px;
    color: #e32f2f;
    padding: .1rem .4rem;
    font-size: .3rem;
  }

  .add_box {
    display: flex;
    justify-content: center;
    /* margin-bottom: 1.8rem; */
    background: #fff;
    padding: .3rem 0;
  }

  .next_step {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
  }

  .add_button {
    color: #fff;
    background-color: #1989fa;
    border: 1px solid #1989fa;
    font-size: .36rem;
    padding: .1rem .2rem;
    border-radius: 2px;
  }

  .next_button {
    color: #fff;
    background-color: #1989fa;
    border: 1px solid #1989fa;
    font-size: .36rem;
    padding: .4rem 0;
  }

  .search_list {
    position: absolute;
    width: 100%;
    max-height: 4rem;
    background: #fff;
    top: 1.2rem;
    left: -0.1rem;
    overflow: auto;
    z-index: 99;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, .2);
  }
</style>
