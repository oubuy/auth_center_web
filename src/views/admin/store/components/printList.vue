<template>
    <div class="add-modity">
         <Row style="background:#fff;">
            <Col span="10">
                <Card :bordered="false">
                    <div class="headerSearch">
                        <p>请选择打印的商品</p>
                        <div>
                            <Input v-model="formData.searchValue" clearable placeholder="请输入商品名或型号" style="width: auto">
                            </Input>
                          <Button style="margin-left:8px;" @click="handleLeftSearch" type="primary">搜索</Button>
                        </div>
                    </div>
                    <Table height="610" @on-select="handleSelect" @on-select-all-cancel="handleCancelAll" @on-select-cancel="handleSelceCancel" @on-select-all="handleAll" :loading="loading" :columns="columns1" :data="leftData"></Table>
                      <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" />
                </Card>
            </Col>
          
            <Col span="2" class="centerButton">
                <div class="icon-center">    
                    <div @click="handlRight"><Icon type="ios-arrow-forward" /></div>
                     <div @click="handLeft"><Icon type="ios-arrow-back" /></div>
                </div>
            
          
            </Col>
          <Col span="10" style="margin-left:120px;">
              <Card shadow>
                <div class="headerSearch">
                  <p>已选择打印的商品</p>
                </div>
                  
                    <Table height="610" @on-select="handleRightSelect" @on-select-all="handleRightAll" @on-select-cancel="handleRightSelceCancel" :loading="loading" :columns="columns1" :data="rightData"></Table>
                    <Page  @on-change="handelRightPage" class="paging" :total="rightTotal" show-total :current="formRightData.page" :page-size="formRightData.rows" />
                
              </Card>
          </Col>
    </Row>
    <Row style="margin-left:-60px;margin-top:20px;">
       <Button type="primary" @click="handleSubmit">确定</Button>
      <Button style="margin-left:20px" @click="handleBack">取消</Button>
    </Row>
     <Modal
        v-model="modal1"
        width="900"
        title="请选择打印类型"
       >
         <div class="typeContent">
             <RadioGroup v-model="printRadio" id="myForm">
                <Radio label="ProductCard_62_95" class="oneType">
                    <span>类型一：尺寸62*95</span>
                    <img :src="bigPrice" alt="">
                </Radio>
                <Radio label="ProductCard_70_120" class="towType">
                    <span>类型二：尺寸70*120</span>
                    <img :src="smallPrice" alt="">
                   
                </Radio>
                <Radio label="ProductCard_30_110" class="oneType">
                    <span>类型三：尺寸100*30</span>
                     <img class="imgItem" :src="acrossOne" alt="">
                </Radio>
                  <Radio label="ProductCard_100_28" class="fourType">
                    <span>类型四：尺寸110*28</span>
                      <img class="imgItem" :src="acrossTwo" alt="">
                </Radio>
            </RadioGroup>
         </div>
         <div class="footerButton">
                 <Button type="primary" @click="handleSave">保存</Button>
                 <Button style="margin-left: 8px" @click="">取消</Button>
            </div>
        <div slot="footer">
        </div>
    </Modal>
    
    </div>
</template>

<script>
import { storeModityTable, setPrintData } from "@/api/store.js";
import $ from "jquery";

export default {
  data() {
    return {
      printRadio: "", //选中类型

      multation: [], //左侧仓库
      rightMultation: [], //右边
      formData: {
        page: 1,
        rows: 10,
        storeId: "",
        searchValue: ""
      },
      loading: true,
      total: 0,
      // rightTotal: 0,
      rightTotal: 0,
      rightData_Temp: [],
      formRightData: {
        page: 1,
        rows: 10
      },
      columns1: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "图片",
          key: "imageUrl",
          render: (h, params) => {
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
        },
        {
          title: "类目/型号/名称",
          key: "",
          width: 200,
          render: (h, params) => {
            let obj = {};
            obj.modityName = params.row.modityName;
            obj.officicalModel = params.row.officicalModel;
            obj.categoryName = params.row.categoryName;

            return h("div", [
              h("storeName", {
                props: {
                  addModity: obj
                }
              })
            ]);
          }
        },
        {
          title: "规格",
          key: "modityModel"
        },

        {
          title: "指导价（片）",
          width: 100,
          key: "numPrice"
        },
        {
          title: "指导价（方）",
          key: "squarePrice"
        }
      ],
      leftData: [], //左边存储数据
      rightData: [], //右边

      modal1: false,
      bigPrice: require("@/assets/bigPrint.jpg"),
      smallPrice: require("@/assets/print5.png"), //旧接口
      acrossOne: require("@/assets/print3.png"), //旧接口
      acrossTwo: require("@/assets/smallPrint.jpg"),
      showPrint: false,
      printSrc: "",
      api: ""
    };
  },
  mounted() {
    let breadcrumbs = [
      { name: "首页" },
      { name: "内部商品管理" },
      { name: "打印价格牌" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.getShopAddmodityPage();
  },

  methods: {
    // 选中
    handleSelect(selection, row) {
      this.multation.push(row);
    },
    handleAll(arr) {

      this.multation = arr;
    },
       handleCancelAll(arr){
 
    this.multation = arr;
    },
    //左边 取消
    handleSelceCancel(select, cancelRow) {
      this.multation.forEach((item, index) => {
        if (item.modityId == cancelRow.modityId) {
          this.multation.splice(index, 1);
        }
      });
    },
    handlRight() {
      // this.rightData = [];
      // this.multation.forEach(item => {
      //   this.rightData.push(item);
      // });

      if (this.multation.length != 0) {
        if (this.rightData.length == 0) {
          this.multation.forEach(item => {
            this.rightData.push(item);
          });
          this.rightData_Temp = this.rightData;
          this.rightTotal = this.rightData.length;
        } else {
          for (var i = 0; i < this.multation.length; i++) {
            var isHave = 0;
            for (var j = 0; j < this.rightData.length; j++) {
              if (
                this.multation[i].storeModityId ==
                this.rightData[j].storeModityId
              ) {
                isHave = 1;
                break;
              }
            }
            if (isHave == 0) {
              this.rightData.push(this.multation[i]);
              this.rightData_Temp = this.rightData;
              this.rightTotal = this.rightData_Temp.length;
            }
          }
          var _start = (this.formRightData.page - 1) * this.formRightData.rows;
          var _end = this.formRightData.page * this.formRightData.rows;
          this.rightData = this.rightData_Temp.slice(_start, _end);
        }
      }
    },
    //右边table
    handleRightSelceCancel(select, cancelRow) {
      this.rightMultation.forEach((item, index) => {
        if (item.modityId == cancelRow.modityId) {
          this.rightMultation.splice(index, 1);
        }
      });
    },
    handleRightSelect(selection, row) {
      this.rightMultation.push(row);
    },
    handleRightAll(arr) {
      this.rightMultation = arr;
    },
    handleBack() {
      // this.$router.push({
      //   path:'/admin/store/list'
      // })
      this.$router.go(-1);
    },
    handLeft() {
      // for (var i = 0; i < this.rightData.length; i++) {
      //   for (var j = 0; j < this.rightMultation.length; j++) {
      //     if (
      //       this.rightData[i].modityPriceId ==
      //       this.rightMultation[j].modityPriceId
      //     ) {
      //       this.rightData.splice(i, 1);
      //     }
      //   }
      // }
      // this.rightMultation = [];

      for (var i = 0; i < this.rightData_Temp.length; i++) {
        for (var j = 0; j < this.rightMultation.length; j++) {
          if (
            this.rightData_Temp[i].storeModityId ==
            this.rightMultation[j].storeModityId
          ) {
            this.rightData_Temp.splice(i, 1);
          }
        }
      }

      this.rightTotal = this.rightData_Temp.length;
      var _start = (this.formRightData.page - 1) * this.formRightData.rows;
      var _end = this.formRightData.page * this.formRightData.rows;
      this.rightData = this.rightData_Temp.slice(_start, _end);
      if (this.rightData.length == 0 && this.formRightData.page != 1) {
        this.handelRightPage(this.formRightData.page - 1);
      }
      this.rightMultation = [];
    },
    getShopAddmodityPage() {
      this.leftData = [];
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
      this.formData.storeId = this.$route.query.storeId;
      this.formData.searchValue = this.$route.query.searchValue;

      storeModityTable(this.formData).then(responese => {
        if (responese.data.code == 200) {
          this.total = responese.data.data.total;
          // this.leftData = responese.data.data.list;
            let storeArr = responese.data.data.list;
         
          storeArr.forEach(item => {
            let obj = {};
            obj.applicationSpace = item.applicationSpace;
            obj.attributeJson = item.attributeJson;
            obj.audit = item.audit;
            obj.brandId = item.brandId;
            obj.brandName = item.brandName;
            obj.cateNamePath = item.cateNamePath;
            obj.categoryId = item.categoryId;
            obj.categoryName = item.categoryName;
            obj.characteristics = item.characteristics;
            obj.colourCode = item.colourCode;
            obj.createDate = item.createDate;
            obj.creater = item.creater;
            obj.createrId = item.createrId;
            obj.description = item.description;
            obj.modify = item.modify;
            obj.imageUrl = item.imageUrl + "?x-oss-process=image/resize,w_100";
            obj.modifyDate = item.modifyDate;
            obj.modifyId = item.modifyId;
            obj.modityCode = item.modityCode;
            obj.modityId = item.modityId;
            obj.modityModel = item.modityModel;
            obj.modityName = item.modityName;
            obj.modityPriceId = item.modityPriceId;
            obj.moditySize = item.moditySize;
            obj.officicalModel = item.officicalModel;
            obj.parentIdPath = item.parentIdPath;
            obj.physicalDisplay = item.physicalDisplay;
            obj.sourceType = item.sourceType;
            obj.squarePrice = item.squarePrice;
            obj.status = item.status;
            obj.storeModityId = item.storeModityId;
            obj.storePriceVo = item.storePriceVo;
            obj.storePriceVo2 = item.storePriceVo2;
            obj.txt = item.txt;
            this.leftData.push(obj);
          });
          this.loading = false;
        }
      });
    },
    handelPage(val) {
      this.formData.page = val;
      this.multation=[];
      this.updateRouter();
    },
    handelRightPage(val) {
      this.formRightData.page = val;
      var _start = (this.formRightData.page - 1) * this.formRightData.rows;
      var _end = this.formRightData.page * this.formRightData.rows;
      this.rightData = this.rightData_Temp.slice(_start, _end);
    },
    updateRouter() {
      this.$router.push({
        query: this.formData
      });
    },
    handleLeftSearch() {
      this.updateRouter();
    },
    handleSubmit() {
      if (this.rightData.length != 0) {
        this.modal1 = true;
      } else {
        this.$Message.warning("请选择打印商品！！");
      }
    },
    handleSave() {
      var arr = [];
      for (var i = 0; i < this.rightData.length; i++) {
        if (
          this.rightData[i].cateNamePath != null ||
          this.rightData[i].cateNamePath
        ) {
          if (this.rightData[i].cateNamePath.indexOf("/") != -1) {
            var seriesArr = this.rightData[i].cateNamePath.split("/");

            var obj = {};
            obj.series = seriesArr[seriesArr.length - 1];
            obj.modityId = this.rightData[i].modityId;
            obj.storeId = this.$route.query.storeId;
            obj.modityCode = this.rightData[i].officicalModel;
            obj.modityName = this.rightData[i].modityName;
            obj.officialModel = this.rightData[i].officicalModel;
            obj.modityModel = this.rightData[i].moditySize;
            obj.squarePrice = this.rightData[i].storePriceVo.storeSquarePrice;
            obj.numPrice = this.rightData[i].storePriceVo.storeNumPrice;
            obj.modityGrade = this.rightData[i].modityGrade;
            obj.id = this.rightData[i].modityPriceId;
            arr.push(obj);
          }
        }
      }
      var data = {};
      data.modityInfoList = arr;

      // var _radio = document
      //   .getElementById("myForm")
      //   .getElementsByTagName("input");
      // var type = "";
      // for (var i = 0; i < _radio.length; i++) {
      //   if (_radio[i].checked == true) {
      //     type = _radio[i].value;
      //     break;
      //   }
      // }
      //  data.type =type;

      // console.log(this.printRadio, "printRadio");
      var type = this.printRadio;
      data.type = type;
      if (type == "ProductCard_70_120" || type == "ProductCard_30_110") {
        //旧
        setPrintData(data).then(result => {
          if (result.data.code == 200) {
            let userId = result.data.data.userId;
            this.modal1 = false;
            window.open(
              this.api + "/modity-download/getPrintPageOld?userId=" + userId
            );
          }
        });
      } else if (type == "ProductCard_62_95" || type == "ProductCard_100_28") {
        //新
        setPrintData(data).then(result => {
          if (result.data.code == 200) {
            let userId = result.data.data.userId;
            this.modal1 = false;
            window.open(
              this.api + "/modity-download/getPrintPage?userId=" + userId
            );
          }
        });
      }
    }
  },
  watch: {
    $route: "getShopAddmodityPage"
  }
};
</script>


<style lang="less" scoped>
.headerSearch {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.centerButton {
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translate(-50%, -50%);
}
.icon-center {
  flex-direction: column;

  div {
    background: #eee;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    cursor: pointer;
    &:nth-child(1) {
      margin-bottom: 15px;
    }
  }
}

.paging {
  text-align: right;
  margin-top: 15px;
}
.footerButton {
  text-align: center;
}
.typeContent {
  #myForm {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    .oneType {
      margin-left: 100px;
      margin-bottom: 80px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
    }
    .towType {
      margin-left: 252px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
    }
    .fourType {
      margin-left: 150px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
    }
  }
  img {
    margin: 0 auto;
    width: 200px;
    height: 300px;
    display: block;
  }
  .imgItem {
    width: 300px;
    height: auto;
  }
}
</style>

