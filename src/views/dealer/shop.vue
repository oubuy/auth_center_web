<template>
  <div class="shopContainer">
     <div>
        <Card>
          <Form :model="formData"  class="form_box" :label-width="80">
          <!-- <Row type="flex"> -->
                      
                          <FormItem label="门店名称:" >
                              <Input v-model="formData.orgName" placeholder="请输入门店名称" />
                          </FormItem>
                       
                       
                          <FormItem label="类别:">
                            <!-- style="width:200px" -->
                            <Select v-model="formData.type" multiple style="width:260px" placeholder="请选择，可多选">
                                <Option v-for="item in typesDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </FormItem>
                        
                       
                       
                            <FormItem label="状态:">
                                  <Select v-model="formData.disabled" style="width:200px">
                                    <Option v-for="(item,index) in authoudStatus" :value="item.value" :key="index">{{ item.label }}</Option>
                                  </Select>
                            </FormItem>
                       
                    
                <div style="margin-left:80px;">
                    <Button type="primary" class="buttonCommon" @click="handleSearchShop()">搜索</Button>
                    <Button @click="handleResetForm()">重置</Button>
                </div>


            <!-- </Row> -->
        </Form>
        </Card>
     </div>
     <div>
        <div class="editButton">
              <Button class="buttonCommon" size="small" @click="addshop()">新增</Button>
              <Button class="buttonCommon" size="small" @click="editShop()">编辑</Button>
              <Button size="small" @click="deleteShop()">删除</Button>
         </div>
           <Table border ref="selection" @on-row-click="handleRowClick" :loading="loading" :columns="columns4" :data="tableDataOther" @on-selection-change="handleSelectionChange"></Table>

            <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total class="paging" @on-change="changepage"></Page>
     </div>

   
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import ahoudStatus from "@/components/ahoudStatus";
import vAddress from "@/components/address";
import {
  typesList,
  shopList,
  dealerOrganization,
  editDealerOrganization,
  editAdddealerOrganization,
  deleteShop,
  userNumber
} from "@/api/shop.js";
import $ from "jquery";
import uploadTable from "@/components/upload";
import shopUrl from "@/components/shopUrl";
import { sovleQueryString } from "@/libs/tools"; //解决url路由拼接参数乱码
import merge from "webpack-merge";

export default {
  data() {
    return {
      formData: {
        orgName: null,
        type: [],
        page: 1,
        rows: 10,
         disabled: 2,
      },
      // 初始化信息总条数
      total: 0,
      typesDataList: [], //类别
    
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },

        {
          title: "门店/部门",
          key: "shop"
        },
        {
          title: "类型",
          key: "type",
          render: (h, params) => {
            return h(
              "span",
              params.row.type ? this.tableObj[params.row.type] : ""
            );
          }
        },
        {
          title: "编码",
          // key: "code"
          key: "id"
        },
        {
          title: "地址",
          key: "address",
            width: 200,
        },
          {
          title: "状态",
          key: "disabled",
          width: 100,
          render: (h, params) => {
            return h("span", {
                style: {
                  color: params.row.disabled == true ? "#c5c8ce" : "#2db7f5"
                }
              }, params.row.disabled == false ? "启用" : "禁用");
          }
        },

        {
          title: "经纬度",
          key: "longAndLat"
        },
        {
          title: "电话",
          key: "phone"
        },
        {
          title: "有效员工数量",
          key: "userNum"
        },
        //  {
        //   title: "来源",
        //   key: "resource"
        // },
        {
          title: "备注",
          key: "remark"
        }
      ],
      loading: true,
      tableData: [],
      tableDataOther: [], //table数据
      multipleSelection: [], //勾选中的值
      tableObj: {}, //储存类型给table
      shopModal: false,
      ruleValidate: {
        type: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "change"
          }
        ],
        orgName: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "blur"
          }
        ]
      },

      visible: false,
      uploadList: [],
      numberTr: 0, //添加多行
      // headerToken: { Authorization: "" }, //token
      showTr: false,
      uploadPictures: [],
      uploadPicturesTemp: [], //临时
      textTitle: "",
      showCode: false,
      flag: false,
      addShow: false,

      indexNumber: 0, //防止多次触发点击
      showButton: true, //防止多次触发事件
      addInfoAddress: {},//地址
       // 状态
      authoudStatus: [
        {
          value: 0,
          label: "启用" //false
        },
        {
          value: 1,
          label: "禁用" //true
        },
        {
          value: 2,
          label: "全部" //null
        }
      ],
    };
  },
  components: {
    VDistpicker,
    ahoudStatus,
    uploadTable,
    vAddress,
    shopUrl
  },
  mounted() {
    // this.breadcrumbs = [{name:'123'}]
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "门店管理" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    // 获取类型
    typesList().then(response => {
      if (response.data.code == 200) {
        let gettypesData = response.data.data;
        gettypesData.forEach(item => {
          let obj = {};
          this.tableObj[item.id] = item.text;
          obj.value = item.id;
          obj.label = item.text;
          this.typesDataList.push(obj);
        });
      }
    });

    let tokenId = localStorage.getItem("jwttoken");

    this.getTableList();
  },
  methods: {
    // 获取列表
    getTableList() {
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
      this.formData.orgName = this.$route.query.orgName;
      this.formData.type = this.$route.query.type;
       let disabled = this.$route.query.disabled;
      if (disabled==0) {
        this.formData.disabled = parseInt(disabled);
      } else if (disabled==1) {
        this.formData.disabled = parseInt(disabled);
      } else {
        this.formData.disabled = 2;
      }

      // console.log(this.formData, 888888888);
      let params = {};
        if (this.formData.disabled == 0) {
        params.disabled = false;
      } else if (this.formData.disabled == 1) {
        params.disabled = true;
      } else if (this.formData.disabled == 2) {
        params.disabled = null;
      }
      params.page = this.formData.page;
      params.rows = this.formData.rows;
      params.orgName = this.formData.orgName;

      if (this.isArray(this.formData.type)) {
        params.type = this.formData.type.join(",");
      } else {
        params.type = this.formData.type;
      }
      shopList(params).then(response => {
        let _this = this;
        if (response.data.code == 200) {
          this.tableData = [];
          let tableDataArr = response.data.data.list;
          let idArr = [];
          this.total = response.data.data.total;
          tableDataArr.forEach(item => {
            let obj = {};
            obj.id = item.id;
            obj.shop = item.org_name;
            obj.type = item.type;
            obj.disabled = item.disabled;
            obj.code = item.id;

            // obj.address = item.address;
            obj.address = item.province_name+item.city_name+item.district_name+item.address;

            obj.longAndLat = item.lng_lat;
            obj.phone = item.phone;
            idArr.push(item.id);

            obj.remark = item.remark;
            this.tableData.push(obj);
          });
          this.getUserNumber(idArr.join(","));

          setTimeout(() => {
            _this.loading = false;
          }, 300);
        }
      });
    },
    // 判断数组
    isArray(obj) {
      return typeof obj == "object" && obj.constructor == Array;
    },

    // 改变路由的参数
    updateRouterParam() {
      // 修改路由参数值
      this.$router.push({
        query: this.formData
      });
    },
    // 员工数量
    getUserNumber(dataIds) {
      userNumber({ ids: dataIds }).then(response => {
        if (response.data.code == 200) {
          let resultDataArr = response.data.data;
          resultDataArr.forEach(item => {
            this.tableData.forEach(itemData => {
              if (item.id == itemData.id) {
                itemData.userNum = item.userNum;
              }
            });
          });
          this.tableDataOther = this.tableData;
        }
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
      handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
    handleSearchShop() {
      this.formData.page = 1;
      this.updateRouterParam();
    },

    handleResetForm() {
      this.loading = true;
      this.formData.orgName = "";
      this.formData.type = [];

      this.formData.page = 1;
      this.formData.rows = 10;
       this.formData.disabled = 2;
      this.updateRouterParam();
    },
 
    addshop() {
    this.$router.push({
        path:'/dealer/addOrg'
    })
    },
    editShop() {
      if (this.multipleSelection.length == 0) {
        this.$Message.info("请勾选内容");
      } else if (this.multipleSelection.length > 1) {
        this.$Message.info("不能勾选多条");
      } else {
       

        let shopId = this.multipleSelection[0].id;
        this.$router.push({
            path:'/dealer/addOrg',
            query:{id:shopId}
        })
      }
    },

    changepage(val) {
      this.formData.page = val;
      this.updateRouterParam();
    },
  
    // 新增案例
    addCase() {
      let obj = {};
      obj.type = "";
      obj.url = "";
      obj.description = "";
      obj.waterUrl = "";
      this.showTr = true;
      this.formValidate.tableArr.push(obj);
    },
    uploadFun(res) {
      //   if (typeof res.index == "undefined") {
      //     this.formValidate.shopUrl = res.data[0];
      //   } else {
      //     let tablePramsList = this.formValidate.tableArr;
      //     for (let i = 0; i < tablePramsList.length; i++) {
      //       if (res.index == i) {
      //         tablePramsList[i].url = res.data[0];
      //       }
      //     }
      //   }

      if (typeof res.index == "undefined") {
        this.formValidate.shopUrl = res.url;
        this.formValidate.shopWaterUrl = res.watchUrl;
      } else {
        let tablePramsList = this.formValidate.tableArr;

        for (let i = 0; i < tablePramsList.length; i++) {
          if (res.index == i) {
            tablePramsList[i].url = res.url;
            tablePramsList[i].waterUrl = res.watchUrl;
          }
        }
      }
    },
    // 删除图片 table
    deletePicture(url) {
      let tableArrUrl = this.formValidate.tableArr;
      for (let i = 0; i < tableArrUrl.length; i++) {
        if (url.toString() == tableArrUrl[i].url) {
          tableArrUrl[i].url = "";
        }
      }
    },
    // 门店图  删除
    deleteShopPicture(url) {
      console.log(url, 999999);
    },
    handleProvince(val) {
      if (typeof val != undefined) {
        this.formValidate.provinceName = val.label;
        this.formValidate.provinceCode = val.value;
      }
    },
    handleCity(val) {
      if (typeof val != undefined) {
        this.formValidate.cityName = val.label;
        this.formValidate.cityCode = val.value;
      }
    },
    handleArea(val) {
      if (typeof val != undefined) {
        this.formValidate.districtName = val.label;
        this.formValidate.districtCode = val.value;
      }
    },
    deleteShop() {
      if (this.multipleSelection.length > 0) {
        let params = this.multipleSelection;
        let deleteId = [];
        for (let i = 0; i < params.length; i++) {
          deleteId.push(params[i].id.toString());
        }
        deleteShop({ organizationIdList: deleteId }).then(response => {
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.multipleSelection = [];
            // 初始化 table列表
            let tokenId = localStorage.getItem("jwttoken");
            // let paramObj = { dealerOrganizationId: tokenId }; //这个值不用
            let data = {};
            this.getTableList(data);
          }
        });
      } else {
        this.$Message.warning("请勾选删除选项！");
      }
    },
    // 判断是否是空对象
    isEmptyObject(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    }
  },
  watch: {
    $route: "getTableList"
  }
};
</script>

<style scoped lang="less">

.shopContainer{
  .form_box{
    display: flex;
  }
}

.distpicker-address-wrapper {
  width: 550px;
}

.buttonCommon {
  margin-right: 10px;
}
.editButton {
  display: flex;
  margin: 10px 0;
}
.tableStyle {
  width: 100%;
}
.tableStyle {
  border-collapse: collapse;
  border: 0px solid #dddee1;
  text-align: center;
  tr {
    th:nth-child(1) {
      width: 200px;
    }
    .casePicture {
      display: inline-block;
      margin-right: 4px;
      position: relative;
      top: 3px;
      font-weight: 800;
      line-height: 1;
      font-size: 12px;
      color: #ed3f14;
    }
  }
  tbody {
    tr {
      height: 100px;
    }
  }
}

// 图片
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.paging {
  float: right;
  margin-top: 10px;
}
</style>
