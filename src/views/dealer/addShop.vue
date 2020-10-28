<template>
    <div>
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="编码:" prop="orgCode" v-if="showCode" style="width:300px">
            <p>{{formValidate.orgCode}}</p>
        </FormItem>
         <FormItem label="类别:" prop="type" style="width:520px">
             <Row>
               <Col span="12">
                <Select v-model="formValidate.type" placeholder="请选择类别">
                   <Option v-for="item in typesDataList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
             </Col>
           </Row>
          
        </FormItem>
        <FormItem label="名称:" prop="orgName" style="width:300px">
            <Input v-model="formValidate.orgName" placeholder="请输入名字"></Input>
        </FormItem>

         <!-- <FormItem label="地址:" prop="address">
             <Row>
               <Col span="18">
                <v-address :addressInfo="addInfoAddress" @child-province="handleProvince" @child-city="handleCity" @child-area="handleArea"></v-address>
                
             </Col>
              <Col span="12">
                <Input style="margin-top:18px;width:300px;" v-model="formValidate.address" placeholder="请输入地址"></Input>
              </Col>
           </Row>
        </FormItem> -->
         <div class="addressContent">
              <FormItem label="地址:" prop="provinceCode">
              <Row>
               <Col span="18">
                 <Select v-model="formValidate.provinceCode" placeholder="省" style="width:150px" clearable label-in-value @on-change="handleprovice">
                    <Option v-for="(item,index) in provinceListData"  :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
             </Col>
             
            </Row>
          </FormItem>
           <FormItem class="cityCodeButton" prop="cityCode" :label-width="20">
                <Select v-model="formValidate.cityCode" placeholder="市" style="width:150px" clearable label-in-value @on-change="handlecity">
                      <Option v-for="(item,index) in cityListData"  :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
          </FormItem>
           
            <FormItem :label-width="20">
               <Select v-model="formValidate.districtCode" placeholder="区" style="width:150px" clearable label-in-value @on-change="handlearea">
                    <Option v-for="(item,index) in areaListData"  :value="item.value" :key="index" >{{ item.label }}</Option>
              </Select>
            </FormItem>
         </div>
           


           <FormItem class="addressButton" prop="address" style="width:400px">
                <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
          </FormItem>

        <FormItem label="经纬度:" prop="lngLat" style="width:600px">
            <Row>
               <Col span="12">
                 <Input v-model="formValidate.lngLat" placeholder="请输入经纬度"></Input>
             </Col>
           <Col span="6" style="text-align: center"><a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" style="margin-left: 15px;">获取经纬度</a></Col>
           </Row>
        </FormItem>
         <FormItem  label="门店电话:" style="width:300px">
            <Input v-model="formValidate.phone" placeholder="请输入门店电话"></Input>
        </FormItem>
          <FormItem label="营业时间:" style="width:800px">
            <Row>
                <Col span="6">
                    <FormItem prop="time1">
                        <TimePicker type="time" placeholder="请选择时间" v-model="formValidate.time1"></TimePicker>
                    </FormItem>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="6">
                    <FormItem prop="time2">
                        <TimePicker type="time" placeholder="请选择时间" v-model="formValidate.time2"></TimePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
      
        <ahoud-status @child-authodstats="handleStatus" :parentStatus="formValidate.disabled"></ahoud-status>

        <FormItem label="备注:" prop="remark" style="width:600px">
              <Row>
               <Col span="12">
                 <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
             </Col>
           </Row>
        </FormItem>
        
        <FormItem label="门店图:" prop="shopUrl">
            <!-- <div> <shop-url :picOnlyUrl="formValidate.shopWatcherPic" @child-upload="uploadFun" @child-deleteshop="deleteShopPicture" ></shop-url></div>  -->
              <div>提示: 可上传1张, 分辨率为480*320像素, 格式为jpg,png,jpeg的图片</div> 
             <div> <shop-url :picOnlyUrl="formValidate.shopWatcherPic" @child-upload="uploadFun" @child-deleteshop="deleteShopPicture" ></shop-url></div> 
         
        </FormItem>


          <FormItem label="体验馆案例:">
            <Button class="buttonCommon" size="small" @click="addCase()">新增案例</Button>
            <!-- 表格 -->
           <table ref="tableElement" class="tableStyle" border="1">
             <thead>
               <tr>
                 <th>类型</th>
                <th><span class="casePicture">*</span>案例图片</th>
                <th>案例描述</th>
               </tr>
             </thead>
             <tbody>
                <tr class="trTest" v-for="(itemObj,index) in formValidate.tableArr" :key="index" v-if="showTr">
                <td>
                    <Select v-model="itemObj.type" placeholder="请选择类别" style="width:100px">
                      <Option v-for="item in styleList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </td>
                <td>
                  <upload-table @child-upload="uploadFun" @child-delete="deletePicture" :shop="index" :picUrl="itemObj.waterUrl"></upload-table>
               </td>
                <td>
                   <Input v-model="itemObj.description" placeholder="最多只能输入100个字!!" :maxlength="100" style="width: 300px" type="textarea"></Input>
                </td>
              </tr>
             </tbody>
           </table>
        </FormItem>
          
          
              
        <FormItem>
    
        </FormItem>
    </Form>
      <div>
         <Button type="primary" @click="handleSubmit('formValidate')">保 存</Button>
           <Button @click="goBack()" style="margin-left: 15px">返 回</Button>
    </div>
    </div>
</template>
<script>
import { province, city, area } from "@/api/address.js";
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

export default {
  data() {
    return {
      styleList: [
        {
          value: "卫浴",
          label: "卫浴"
        },
        {
          value: "厨房",
          label: "厨房"
        },
        {
          value: "玄关",
          label: "玄关"
        },
        {
          value: "大堂",
          label: "大堂"
        },
        {
          value: "过道",
          label: "过道"
        }
      ], //类型
      formValidate: {
        id: "",
        //新增
        orgCode: "",
        type: "", //类别
        orgName: "",
        address: "",
        lngLat: "",
        phone: "",
        time1: "",
        time2: "",
        disabled: 0,
        remark: "",
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        districtCode: "",
        districtName: "",
        // styleType: "", //类型
        // descTow: "",
        tableArr: [], //table数组

        adressObj: {
          //使用组件存储值
          provinceName: "",
          provinceCode: "",
          cityName: "",
          cityCode: "",
          districtCode: "",
          districtName: "",
          choose: ""
        },
        adressObjShow: {
          //新增
          provinceName: "",
          provinceCode: "",
          cityName: "",
          cityCode: "",
          districtCode: "",
          districtName: "",
          choose: ""
        },
        shopUrl: "", //门店图

        shopWaterUrl: "", //提交水印图

        shopWatcherPic: {
          watchUrl: "",
          url: ""
        } //编辑水影图
      },
      provinceListData: [],
      cityListData: [],
      areaListData: [],

      typesDataList: [], //类别
      tableObj: {}, //储存类型给table

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
        ],
        provinceCode: [
          {
            required: true,
            message: "请选择省",
            trigger: "change"
          }
        ],
        cityCode: [
          {
            required: true,
            message: "请选择市",
            trigger: "change"
          }
        ]
      },

      showTr: false,

      textTitle: "",

      showCode: false,
      flag: false,
      addShow: false,

      indexNumber: 0, //防止多次触发点击
      showButton: true, //防止多次触发事件
      addInfoAddress: {} //地址
    };
  },

  components: {
    ahoudStatus,
    uploadTable,
    vAddress,
    shopUrl
  },
  mounted() {
    // this.breadcrumbs = [{name:'123'}]
    if (this.$route.query.id) {
      this.handleEdit(this.$route.query.id);
      this.textTitle = "编辑门店";
    } else {
      this.textTitle = "新增门店";
    }

    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: this.textTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    // 获取类型
    typesList().then(response => {
      if (response.data.code == 200) {
        let gettypesData = response.data.data;
        gettypesData.forEach(item => {
          let obj = {};
          //   this.tableObj[item.id] = item.text;
          obj.value = item.id;
          obj.label = item.text;
          this.typesDataList.push(obj);
        });
      }
    });

    let tokenId = localStorage.getItem("jwttoken");

    // 获取省
    province().then(response => {
      if (response.data.code == 200) {
        this.provinceListData = [];
        let provinceList = response.data.data;
        for (let i = 0; i < provinceList.length; i++) {
          let obj = {};
          obj.value = provinceList[i].provinceId;
          obj.label = provinceList[i].provinceName;
          this.provinceListData.push(obj);
        }
      }
    });
  },
  methods: {
    handleEditAddress(val) {
      this.formValidate.provinceCode = val.provinceCode;
      if (val.provinceCode) {
        city({ provinceId: val.provinceCode }).then(response => {
          if (response.data.code == 200) {
            this.cityListData = [];
            let cityList = response.data.data;
            for (let i = 0; i < cityList.length; i++) {
              let obj = {};
              obj.value = cityList[i].cityId;
              obj.label = cityList[i].cityName;
              this.cityListData.push(obj);
            }
            this.formValidate.cityCode = val.cityCode;
          }
        });
      }
      if (val.cityCode) {
        area({ cityId: val.cityCode }).then(response => {
          if (response.data.code == 200) {
            this.areaListData = [];
            let areayList = response.data.data;
            for (let i = 0; i < areayList.length; i++) {
              let obj = {};
              obj.value = areayList[i].areaId;
              obj.label = areayList[i].areaName;
              this.areaListData.push(obj);
            }
            this.formValidate.districtCode = val.districtCode;
          }
        });
      }
    },
    handleprovice(val) {
      this.cityListData = [];
      this.formValidate.cityCode = "";
      if (typeof val != "undefined") {
        this.formValidate.provinceName = val.label;
        this.formValidate.provinceCode = val.value;

        city({ provinceId: val.value }).then(response => {
          if (response.data.code == 200) {
            let cityList = response.data.data;
            for (let i = 0; i < cityList.length; i++) {
              let obj = {};
              obj.value = cityList[i].cityId;
              obj.label = cityList[i].cityName;
              this.cityListData.push(obj);
            }
          }
        });
      }
    },
    handlecity(val) {
      this.areaListData = [];
      this.formValidate.districtCode = "";
      if (typeof val != "undefined") {
        this.formValidate.cityName = val.label;
        this.formValidate.cityCode = val.value;

        area({ cityId: val.value }).then(response => {
          if (response.data.code == 200) {
            let areayList = response.data.data;
            for (let i = 0; i < areayList.length; i++) {
              let obj = {};
              obj.value = areayList[i].areaId;
              obj.label = areayList[i].areaName;
              this.areaListData.push(obj);
            }
          }
        });
      }
    },
    handlearea(val) {
      if (typeof val != "undefined") {
        this.formValidate.districtName = val.label;
        this.formValidate.districtCode = val.value;
      }
    },
    // 新增 编辑提交
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        this.indexNumber++;
        if (valid) {
          //    if(this.formValidate.tableArr.length==0){
          //     this.$Message.warning('请上传案例图片！！');
          //     return;
          // }
          let params = {};
          let organization = {};

          let caseList = [];
          // params.dealerOrganizationSpaceList = this.formValidate.tableArr;
          let pictureUrlList = this.formValidate.tableArr;

          for (let i = 0; i < pictureUrlList.length; i++) {
            if (pictureUrlList[i].url) {
              caseList.push(pictureUrlList[i]);
            } else {
              this.$Message.warning("请上传案例图片!");
              return;
            }
            params.dealerOrganizationSpaceList = caseList;
          }

          organization.orgCode = this.formValidate.orgCode;
          organization.type = this.formValidate.type;
          organization.orgName = this.formValidate.orgName;
          organization.address = this.formValidate.address;
          organization.lngLat = this.formValidate.lngLat;
          organization.phone = this.formValidate.phone;
          organization.businessHours =
            this.formValidate.time1 + "-" + this.formValidate.time2;
          organization.remark = this.formValidate.remark;
          organization.id = this.formValidate.id;
          organization.provinceName = this.formValidate.provinceName;
          organization.provinceCode = this.formValidate.provinceCode;
          organization.cityName = this.formValidate.cityName;
          organization.cityCode = this.formValidate.cityCode;
          organization.districtCode = this.formValidate.districtCode;
          organization.districtName = this.formValidate.districtName;

          organization.shopUrl = this.formValidate.shopUrl;
          organization.shopWaterUrl = this.formValidate.shopWaterUrl; //水印图

          if (this.formValidate.disabled == 0) {
            organization.disabled = false;
          } else if (this.formValidate.disabled == 1) {
            organization.disabled = true;
          }
          params.organization = organization;
          if (organization.id) {
            // 编辑
            editAdddealerOrganization(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                // this.shopModal = false;
                this.$router.go(-1);
                let tokenId = localStorage.getItem("jwttoken");
                let data = {};
              }
            });
          } else {
            // 新增
            dealerOrganization(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
                // this.shopModal = false;
                let tokenId = localStorage.getItem("jwttoken");
                let data = {};
              }
            });
          }
        } 
      });
    },
    // 编辑
    handleEdit(shopId) {
      editDealerOrganization({ dealerOrganizationId: shopId }).then(
        response => {
          if (response.data.code == 200) {
            let organizationData = response.data.data.organization;
            let dealerOrganizationSpaceList =
              response.data.data.dealerOrganizationSpaceList;
            this.flag = true;
            this.formValidate.adressObj.choose = "editShop";

            this.formValidate.adressObj.provinceName =
              organizationData.provinceName;
            this.formValidate.adressObj.provinceCode =
              organizationData.provinceCode;
            this.formValidate.adressObj.cityName = organizationData.cityName;
            this.formValidate.adressObj.cityCode = organizationData.cityCode;
            this.formValidate.adressObj.districtCode =
              organizationData.districtCode;
            this.formValidate.adressObj.districtName =
              organizationData.districtName;

            this.addInfoAddress = this.formValidate.adressObj;

            this.formValidate.type = organizationData.type;
            this.formValidate.orgCode = organizationData.id; //编辑门店编码
            this.formValidate.id = organizationData.id;
            this.formValidate.shopUrl = organizationData.shopUrl; //门店图片
             this.formValidate.shopWaterUrl = organizationData.shopWaterUrl; //门店水印图片（提交）
            //   门店图  水印图
            this.formValidate.shopWatcherPic.watchUrl =
              organizationData.shopWaterUrl; //门店图水印图
            this.formValidate.shopWatcherPic.url = organizationData.shopUrl; //门店图水印图

            this.formValidate.orgName = organizationData.orgName;
            this.formValidate.address = organizationData.address;

            // this.formValidate.provinceName = organizationData.provinceName;
            // this.formValidate.provinceCode = organizationData.provinceCode;
            // this.formValidate.cityName = organizationData.cityName;
            // this.formValidate.cityCode = organizationData.cityCode;
            // this.formValidate.districtCode = organizationData.districtCode;
            // this.formValidate.districtName = organizationData.districtName;
            let paramsObject = {
              provinceCode: organizationData.provinceCode,
              cityCode: organizationData.cityCode,
              provinceName: organizationData.provinceName,
              cityName: organizationData.cityName,
              districtName: organizationData.districtName,
              districtCode: organizationData.districtCode
            };
            this.handleEditAddress(paramsObject);

            this.formValidate.lngLat = organizationData.lngLat;
            this.formValidate.phone = organizationData.phone;

            if (organizationData.businessHours) {
              let timeList = organizationData.businessHours.split("-");
              this.formValidate.time1 = timeList[0];
              this.formValidate.time2 = timeList[1];
            }

            this.formValidate.disabled = organizationData.disabled;
            this.formValidate.remark = organizationData.remark;

            this.formValidate.tableArr = [];
            if (dealerOrganizationSpaceList.length > 0) {
              this.showTr = true;
              let arr = [];
              for (let i = 0; i < dealerOrganizationSpaceList.length; i++) {
                let obj = {};
                obj.type = dealerOrganizationSpaceList[i].type;
                obj.url = dealerOrganizationSpaceList[i].url;
                // waterUrl
                obj.waterUrl = dealerOrganizationSpaceList[i].waterUrl;
                obj.description = dealerOrganizationSpaceList[i].description;
                arr.push(obj);
              }
              this.formValidate.tableArr = arr;
            }
          }
        }
      );
    },

    // 状态
    handleStatus(val) {
      // console.log(val, "状态");
      if (val == 0) {
        this.formValidate.disabled = false;
      } else if (val == 1) {
        this.formValidate.disabled = true;
      }
      this.formValidate.disabled = val;
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
     
         this.formValidate.shopUrl="";
         this.formValidate.shopWaterUrl=""; //水印图

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
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.tableStyle {
  width: 75%;
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

.addressContent {
  display: flex;
}
</style>

