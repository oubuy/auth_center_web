<template>
    <div class="add-modity" style="position: relative;">
         <Row style="background:#fff;display: flex;align-items: center;">
            <Col span="11" style="margin-right: 100px;">
              <!-- :bordered="false" -->
                <Card :bordered="false" >
                    <div class="headerSearch">
                        <p style="color: red;">将产品添加至右侧进行打印</p>
                        <div style="display: flex;">
                            <Input v-model="formData.searchValue" clearable placeholder="请输入商品名或型号" style="width: auto;margin-right: 5px;">
                            </Input>
                            <Cascader :render-format="format" filterable v-model="categoryCascaderId" placeholder="请选择类目" :data="categoryCascaderData" change-on-select></Cascader>
                            <Button style="margin-left:8px;" @click="handleLeftSearch" type="primary">搜索</Button>
                            <Button style="margin-left:8px;" @click="resetSearch">重置</Button>
                        </div>
                    </div>

                    <Table height="630" @on-select-all-cancel="handleCancelAll" @on-select="handleSelect" @on-select-cancel="handleSelceCancel" @on-select-all="handleAll" :loading="loading" :columns="columns1" :data="leftData"></Table>

                      <Page  @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" />
                </Card>
            </Col>
            <!-- <Col span="2" class="centerButton">
                <div class="icon-center">
                     <div @click="handlRight">加入打印<Icon type="ios-arrow-forward" /></div>
                     <div @click="handLeft"><Icon type="ios-arrow-back" />移除打印</div>
                </div>
            </Col> -->
          <Col span="11">
              <Card :bordered="false">
                <div class="headerSearch">
                  <p>待打印商品列表</p>
                </div>

                    <Table height="630" @on-select="handleRightSelect" @on-select-all="handleRightAll" @on-select-cancel="handleRightSelceCancel" :loading="loading" :columns="selectionColumns" :data="rightData"></Table>
                    <Page  @on-change="handelRightPage" class="paging" :total="rightTotal" show-total :current="formRightData.page" :page-size="formRightData.rows" />

              </Card>
          </Col>
    </Row>
      <Row style="width:140px;position: fixed;left: 50%;bottom: 6%;">
         <Button type="primary" @click="handleSubmit">打印</Button>
          <Button style="margin-left:20px" @click="handleBack">取消</Button>
      </Row>
     <Modal
        v-model="modal1"
        width="956"
        title="请选择打印类型"
        style="padding:20px;"
       >
       <!-- <print-price></print-price> -->
       <!-- <div class="typeContent">
               <ul id="myForm">
                   <li>

                        <label><input ref="bigPrice" name="Fruit" type="radio" value="ProductCard_62_95" />类型一：尺寸62*95</label>
                        <img :src="bigPrice" alt="">
                   </li>
                    <li>

                        <label><input name="Fruit" type="radio" value="ProductCard_70_120" />类型二：尺寸70*120 </label>
                        <img :src="smallPrice" alt="">
                   </li>
                    <li>

                        <label><input name="Fruit" type="radio" value="ProductCard_30_110" />类型三：尺寸100*30 </label>
                        <img class="imgItem" :src="acrossOne" alt="">
                   </li>
                    <li>

                        <label><input name="Fruit" type="radio" value="ProductCard_100_28" />类型四：尺寸110*28 </label>
                        <img class="imgItem" :src="acrossTwo" alt="">
                   </li>
               </ul>
         </div> -->

          <div class="typeContent">
             <RadioGroup v-model="printRadio" id="myForm">
               <Radio label="ProductCard_50_120" class="oneType">
                    <span>类型一：尺寸50*120</span>
                      <img  :src="typeA1" alt="">
                </Radio>
                <Radio label="ProductCard_62_95" class="twoType">
                    <span>类型二：尺寸62*95</span>
                    <img :src="bigPrice" alt="">
                </Radio>
                <Radio label="ProductCard_70_120" class="threeType">
                    <span>类型三：尺寸70*120</span>
                    <img :src="smallPrice" alt="">
                </Radio>
                <Radio label="ProductCard_100_40" class="fourType">
                    <span>类型四：尺寸110*40</span>
                      <img  :src="typeA2" alt="">
                </Radio>
                <Radio label="ProductCard_100_28" class="fiveType">
                    <span>类型五：尺寸110*28</span>
                      <img  :src="acrossTwo" alt="">
                </Radio>
                <Radio label="ProductCard_30_110" class="sixType">
                    <span>类型六：尺寸100*30</span>
                     <img  :src="acrossOne" alt="">
                </Radio>
            </RadioGroup>
         </div>
         <div class="footerButton">
                 <Button type="primary" @click="handleSave">保存</Button>
                 <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
            </div>
        <div slot="footer">
        </div>
    </Modal>
    <!-- <form id="printForm" :action="printAction" method="" target="_blank">
    </form> -->
    </div>
</template>

<script>
import { storeModityTable, setPrintData, categoryTree } from "@/api/store.js";
import $ from "jquery";
import axios from "axios";

export default {
  data() {
    return {
      printAction: "",
      printRadio: "", //选中类型
      multation: [], //左侧仓库
      rightMultation: [], //右边
      categoryCascaderId: [],
      formData: {
        page: 1,
        rows: 10,
        storeId: "",
        searchValue: "",
        categoryId: ""
      },
      loading: true,
      total: 0,
      categoryCascaderData: [],
      columns1: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: "图片",
          key: "imageUrl",
          width: 100,
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
          width: 100,
          key: "modityModel"
        },

        {
          title: "价格（片）",
          width: 100,
          key: "",
          render: (h, params) => {
            params.row.storePriceVo.storeNumPrice = params.row.storePriceVo
              .storeNumPrice
              ? params.row.storePriceVo.storeNumPrice
              : 0;
            return h("div", params.row.storePriceVo.storeNumPrice);
          }
        },
        {
          title: "价格（方）",
          width: 100,
          key: "",
          render: (h, params) => {
            params.row.storePriceVo.storeSquarePrice = params.row.storePriceVo
              .storeSquarePrice
              ? params.row.storePriceVo.storeSquarePrice
              : 0;
            return h("div", params.row.storePriceVo.storeSquarePrice);
          }
        },
        {
          title: "操作",
          key: "",
          // fixed: 'right',
          width: 120,
          align: "center",
          render: (h, params) => {
            if (params.row.txt == "添加至打印") {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      size: "small"
                    },
                    style: {
                      boxShadow: "none"
                    },
                    on: {
                      click: e => {
                        if (e.target.innerText == "已添加") return;
                        e.target.innerText = "已添加";
                        e.target.style.color = "#ccc";
                        e.target.style.cursor = "not-allowed";
                        this.multation.push(params.row);
                        this.handlRight(params.row);
                      }
                    }
                  },
                  params.row.txt
                )
              ]);
            } else if (params.row.txt == "已添加") {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      size: "small"
                    },
                    style: {
                      boxShadow: "none",
                      color: "#ccc",
                      cursor: "not-allowed"
                    }
                  },
                  params.row.txt
                )
              ]);
            }
          }
        }
      ],

      rightTotal: 0,
      rightData_Temp: [],
      formRightData: {
        page: 1,
        rows: 10
      },
      selectionColumns: [
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: "图片",
          key: "imageUrl",
          width: 100,
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
          width: 100,
          key: "modityModel"
        },

        {
          title: "价格（片）",
          width: 100,
          key: "",
          render: (h, params) => {
            return h("div", params.row.storePriceVo.storeNumPrice);
          }
        },
        {
          title: "价格（方）",
          width: 100,
          key: "",
          render: (h, params) => {
            return h("div", params.row.storePriceVo.storeSquarePrice);
          }
        },
        {
          title: "操作",
          key: "",
          // fixed: 'right',
          width: 120,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    boxShadow: "none",
                    color: "red"
                  },
                  on: {
                    click: e => {
                      this.handLeft(params.index);
                    }
                  }
                },
                "移除"
              )
            ]);
          }
        }
      ],
      leftData: [], //左边存储数据
      rightData: [], //右边

      modal1: false,
      typeA1: require("@/assets/printTypeA1.png"),
      typeA2: require("@/assets/printTypeA2.png"),
      bigPrice: require("@/assets/printTypeB1.png"),
      smallPrice: require("@/assets/printTypeC1.png"), //旧接口
      acrossOne: require("@/assets/printTypeC2.png"), //旧接口
      acrossTwo: require("@/assets/printTypeB2.png"),
      showPrint: false,
      printSrc: "",
      api: "",
      txt: "添加至打印",
      treeData: []
    };
  },
  mounted() {
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "门店管理" },
      { name: "打印价格牌" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.getShopAddmodityPage();
    this.getCategoryTree();
  },

  methods: {
    format(labels, selectedData) {
      const index = labels.length - 1;
      const data = selectedData[index];
      if (data) {
        this.formData.categoryId = data.id;
        return labels[index];
      }
      return labels[index];
    },
    // 类目
    getCategoryTree() {
      categoryTree().then(responese => {
        if (responese.data.code == 200) {
          let categoryArr = responese.data.data;
          let dataValue = this.getTree(categoryArr);
          this.treeData = dataValue;
          this.categoryCascaderData = dataValue;
        }
      });
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.checked = item.checked;
          obj.state = item.state;
          obj.id = item.id;
          obj.title = item.text;
          obj.attributes = item.attributes;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;

          // 关联
          obj.value = item.id;
          obj.label = item.text;

          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    // 选中
    handleSelect(selection, row) {
      this.multation.push(row);
    },
    handleAll(arr) {
      this.multation = arr;
    },

    handleCancelAll(arr) {
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

    handlRight(d) {
      // console.log(this.rightData,8888)
      if (this.rightData_Temp.length) this.rightData = this.rightData_Temp;
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
                this.multation[i].storeModityId &&
                this.rightData[j].storeModityId &&
                this.multation[i].storeModityId ==
                  this.rightData[j].storeModityId
              ) {
                isHave = 1;
                break;
              } else if (
                this.multation[i].modityId &&
                this.rightData[j].modityId &&
                this.multation[i].modityId == this.rightData[j].modityId
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
      // console.log(this.rightData,9999);
      // console.log(this.rightData_Temp,777);
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
      this.$router.push({
        path: "/dealer/list"
      });
      // this.$router.go(-1);
    },
    handLeft(index) {
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
      //  this.rightTotal = this.rightData.length;
      // this.rightMultation = [];
      // this.rightData_Temp = this.rightData;

      // for (var i = 0; i < this.rightData_Temp.length; i++) {
      //   for (var j = 0; j < this.rightMultation.length; j++) {
      //     if (
      //       this.rightData_Temp[i].storeModityId ==
      //       this.rightMultation[j].storeModityId
      //     ) {
      //       this.rightData_Temp.splice(i, 1);
      //     }
      //   }
      // }
      let $index =
        (this.formRightData.page - 1) * this.formRightData.rows + index;
      this.rightData_Temp.splice($index, 1);
      this.multation.splice($index, 1);
      this.rightTotal = this.rightData_Temp.length;
      var _start = (this.formRightData.page - 1) * this.formRightData.rows;
      var _end = this.formRightData.page * this.formRightData.rows;
      this.rightData = this.rightData_Temp.slice(_start, _end);
      if (this.rightData.length == 0 && this.formRightData.page != 1) {
        this.handelRightPage(this.formRightData.page - 1);
      }
      this.rightMultation = [];
      this.getShopAddmodityPage();
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
          for (var i = 0; i < responese.data.data.list.length; i++) {
            responese.data.data.list[i].txt = "添加至打印";
            for (var j = 0; j < this.rightData_Temp.length; j++) {
              if (
                responese.data.data.list[i].storeModityId &&
                this.rightData_Temp[j].storeModityId &&
                responese.data.data.list[i].storeModityId ==
                  this.rightData_Temp[j].storeModityId
              ) {
                responese.data.data.list[i].txt = "已添加";
              } else if (
                responese.data.data.list[i].modityId &&
                this.rightData_Temp[j].modityId &&
                responese.data.data.list[i].modityId ==
                  this.rightData_Temp[j].modityId
              ) {
                responese.data.data.list[i].txt = "已添加";
              }
            }
          }

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
      this.multation = [];
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
      if (
        document.getElementsByClassName("ivu-cascader-label")[0].innerText == ""
      ) {
        this.formData.categoryId = "";
      }
      this.updateRouter();
    },
    resetSearch() {
      this.formData.searchValue = "";
      this.formData.categoryId = "";
      this.categoryCascaderId = [];
      this.updateRouter();
    },
    handleSubmit() {
      // this.modal1 = true;
      if (this.rightData.length != 0) {
        this.modal1 = true;
      } else {
        this.$Message.warning("请选择打印商品！！");
      }
    },
    handleCancel() {
      this.modal1 = false;
    },
    handleSave() {
      if (this.printRadio == null || this.printRadio == "") {
        this.$Message.warning("请选择打印类型！！");
        return;
      }
      var arr = [];
      for (var i = 0; i < this.rightData_Temp.length; i++) {
        if (
          this.rightData_Temp[i].cateNamePath != null ||
          this.rightData_Temp[i].cateNamePath
        ) {
          if (this.rightData_Temp[i].cateNamePath.indexOf("/") != -1) {
            var seriesArr = this.rightData_Temp[i].cateNamePath.split("/");

            var obj = {};
            obj.series = seriesArr[seriesArr.length - 1];
            obj.modityId = this.rightData_Temp[i].modityId;
            obj.storeId = this.$route.query.storeId;
            obj.modityCode = this.rightData_Temp[i].officicalModel;
            obj.modityName = this.rightData_Temp[i].modityName;
            obj.officialModel = this.rightData_Temp[i].officicalModel;
            obj.modityModel = this.rightData_Temp[i].moditySize
              ? this.rightData_Temp[i].moditySize
              : this.rightData_Temp[i].modityModel;
            obj.squarePrice = this.rightData_Temp[
              i
            ].storePriceVo.storeSquarePrice;
            obj.numPrice = this.rightData_Temp[i].storePriceVo.storeNumPrice;
            obj.modityGrade = this.rightData_Temp[i].modityGrade;
            obj.id = this.rightData_Temp[i].modityPriceId;
            arr.push(obj);
          }
        }
      }
      var data = {};
      var date2 = this.rightMultation;
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

      var type = this.printRadio;
      data.type = type;
      if (type == "ProductCard_70_120" || type == "ProductCard_30_110") {
        //旧
        setPrintData(data).then(result => {
          if (result.data.code == 200) {
            let userId = result.data.data.userId;
            this.modal1 = false;
            // this.printAction = this.api + "/modity-download/getPrintPageOld/" + userId
            window.open(
              this.api + "/modity-download/getPrintPageOld/" + userId
            );
            // this.printAction = this.api + "/modity-download/getPrintPageOld?userId=" + userId
            // var printForm = document.getElementById("printForm")
            // printForm.action = this.api + "/modity-download/getPrintPageOld?userId=" + userId
            // console.log('action1:',printForm.action)
            // printForm.submit();
          }
        });
      } else if (
        type == "ProductCard_62_95" ||
        type == "ProductCard_100_28" ||
        type == "ProductCard_50_120" ||
        type == "ProductCard_100_40"
      ) {
        //新
        setPrintData(data).then(result => {
          if (result.data.code == 200) {
            let userId = result.data.data.userId;
            this.modal1 = false;
            // this.printAction = this.api + "/modity-download/getPrintPage/" + userId
            // alert('准备弹出窗口打印')
            window.open(this.api + "/modity-download/getPrintPage/" + userId);

            // this.printAction = this.api + "/modity-download/getPrintPage?userId=" + userId
            // this.userId = userId;
            // var printForm = document.getElementById("printForm")
            // printForm.action = this.api + "/modity-download/getPrintPage/" + userId
            // printForm.submit();
          }
        });

        // window.open(
        //       this.api + "/modity-download/getPrintPage/10429"
        //     );

        // let result = await axios({method: 'post', url: '/modity/setPrintData', data:data})
        //   if (result.data.code == 200) {
        //     let userId = result.data.data.userId;
        //     this.modal1 = false;
        //     this.printAction = this.api + "/modity-download/getPrintPage/" + userId
        //     // window.open(
        //     //   this.api + "/modity-download/getPrintPage/" + userId
        //     // );

        //     // this.printAction = this.api + "/modity-download/getPrintPage?userId=" + userId
        //     // this.userId = userId;
        //     // var printForm = document.getElementById("printForm")
        //     // printForm.action = this.api + "/modity-download/getPrintPage/" + userId
        //     // printForm.submit();
        // }
      }
    }
  },
  watch: {
    $route: "getShopAddmodityPage"
    // ,
    // printAction(newVal,oldVal){
    //   console.log('newVal:',newVal)
    //   window.open(
    //           this.printAction,"_blank"
    //         );
    // }
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
  // position: absolute;
  // top: 50%;
  // left: 46%;
  transform: translate(-50%, -50%);
  margin-left: 7%;
}
.icon-center {
  flex-direction: column;

  div {
    background: #eee;
    // width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
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
// .typeContent {
//   ul {
//     list-style-type: none;
//     display: flex;
//     flex-wrap: wrap;
//     li {
//       list-style-type: none;
//       width: 50%;
//       display: flex;
//       flex-direction: column;
//       margin-bottom: 50px;
//       text-align: center;
//       img {
//         margin: 0 auto;
//         width: 200px;
//         height: 300px;
//       }
//       .imgItem {
//         width: 300px;
//         height: auto;
//       }
//       label {
//         margin-bottom: 20px;
//         input {
//           vertical-align: middle;
//           margin-right: 4px;
//         }
//       }
//     }
//   }
// }

.typeContent {
  #myForm {
    list-style-type: none;
    display: flex;
    // justify-content: space-around;
    flex-wrap: wrap;
    .oneType {
      // margin-left: 100px;
      // margin-bottom: 80px;
      span {
        font-size: 12px;
        display: inline-block;
        margin-bottom: 15px;
      }
      img {
        margin-left: 67px;
        width: 142px;
        height: auto;
      }
    }
    .twoType {
      margin-left: 99px;
      // margin-bottom: 80px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
      img {
        margin-left: 50px;
        width: 184px;
        height: auto;
      }
    }
    .threeType {
      margin-left: 73px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
      img {
        margin-left: 48px;
        width: 188px;
        height: auto;
      }
    }
    .fourType {
      margin-top: 20px;
      margin-bottom: 30px;
      // margin-left: 10px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
      img {
        margin-left: 0px;
        width: 286px;
        height: auto;
      }
    }
    .fiveType {
      margin-top: 20px;
      margin-bottom: 30px;
      margin-left: 21px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
      img {
        // margin-left: 20px;
        width: 286px;
        height: auto;
      }
    }
    .sixType {
      margin-top: 20px;
      margin-bottom: 30px;
      margin-left: 21px;
      span {
        display: inline-block;
        margin-bottom: 15px;
      }
      img {
        // margin-left: 80px;
        width: 286px;
        height: auto;
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
