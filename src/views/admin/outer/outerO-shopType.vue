<template>
    <div>
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
           <FormItem v-if="flagDisabled" label="门店编码:" prop="id" style="width:300px">
                  {{formValidate.id}}
          </FormItem>
          <FormItem label="类别:" prop="type" style="width: 300px">
            <Select v-model="formValidate.type" placeholder="请选择类别">
                <Option v-for="item in typesDataList" :value="item.value" :key="item.value">
                 {{item.label}}
                </Option>
            </Select>
          </FormItem>

         <!-- <FormItem label="上级组织:" prop="parentId" style="width:300px">
            <Input v-model="formValidate.parentId"></Input>
        </FormItem> -->
         <FormItem label="上级组织" prop="parentName">
            <Input v-model="formValidate.parentName" placeholder="请选择上级组织" @on-focus="orgModal=true" class="field-width" readonly/>
            <span class="field-tip">{{fullOrgName}}</span>
            <Modal v-model="orgModal" title="选择所属组织">
                <div style="height:500px; padding: 10px; overflow:auto;">
                    <org-tree ref="orgTree" type="outer" @org-select="handleOrgSelect"></org-tree>
                </div>
                <Card :bordered="false">
                    <span style="color: #2db7f5;">已选组织：</span>
                    <span>{{fullOrgNameSelection}}</span>
                </Card>
                <div slot="footer">
                    <Button type="text" size="large" @click="orgModal=false">取消</Button>
                    <Button type="primary" size="large" @click="handleOrgSelectOk">确定</Button>
                </div>
            </Modal>
        </FormItem>

         <FormItem label="名称:" prop="orgName" style="width:300px">
            <Input v-model="formValidate.orgName" placeholder="请输入门店名称"></Input>
        </FormItem>
        <FormItem label="简称:" prop="orgNameAbbr" style="width:300px">
            <Input v-model="formValidate.orgNameAbbr" placeholder="请输入门店简称"></Input>
        </FormItem>
        <!-- <FormItem label="地址:" prop="address">
            <v-address :addressInfo="addInfoAddress" @child-province="handleProvince" @child-city="handleCity" @child-area="handleArea"></v-address>
            <Input style="margin-top:18px;width:300px" v-model="formValidate.address" placeholder="请输入地址"></Input>
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

          <FormItem label="经纬度:" prop="lngLat">
            <Input  style="width:200px;" v-model="formValidate.lngLat" placeholder="请输入经纬度，以逗号分隔"></Input>
            <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" style="margin-left: 15px;">获取经纬度</a>
        </FormItem>
          <FormItem label="门店电话:" style="width:300px">
                <Input v-model="formValidate.phone" placeholder="请输入门店电话"></Input>
        </FormItem>
          <FormItem label="营业时间:">
            <Row>
                <Col span="3">
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
          <ahoud-status @child-authodstats="handleStatus" :parentDisabled="true" :parentStatus="formValidate.disabled"></ahoud-status>
            <FormItem label="备注:" prop="remark" style="width:400px;">
              <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
           </FormItem>
               <FormItem label="门店图:" prop="shopUrl">
                 <!-- watchUrl -->
                        <!-- <div> <shop-url :picOnlyUrl="formValidate.shopUrl" @child-upload="uploadFun" @child-deleteshop="deleteShopPicture" ></shop-url></div>  -->
                         <div>提示: 可上传1张, 分辨率为480*320像素, 格式为jpg,png,jpeg的图片</div>
                        <div> <shop-url :picOnlyUrl="formValidate.shopWatcherPic" @child-upload="uploadFun" @child-deleteshop="deleteShopPicture" ></shop-url></div>

                </FormItem>

            <FormItem label="体验馆案例:">
                 <Button class="buttonCommon" style="margin-top:6px;" size="small" @click="addCase()">新增案例</Button>
                 <table ref="tableElement" class="tableStyle" border="1">
                     <thead>
                        <tr>
                            <th>类型</th>
                            <th><span class="casePicture">*</span>案例图片</th>
                             <th>案例描述</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr v-for="(itemObj,index) in formValidate.tableArr" :key="index" v-if="showTr">
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
       </Form>
       <div>
         <Button type="primary" @click="handleSubmit('formValidate')">保 存</Button>
        <Button style="margin-left:15px;" @click="handleBack()">返 回</Button>
    </div>
    </div>
</template>
<script>
import {
  outerOrgShopTypeList,
  outerOrgShopType,
  editOuterOrgShopType,
  outerOrgAllInfo
} from "@/api/outOrgDealer.js";
import vAddress from "@/components/address";
import ahoudStatus from "@/components/ahoudStatus";
import uploadTable from "@/components/upload";
import shopUrl from "@/components/shopUrl";
import orgTree from "@/components/org-tree";
import { getFullOrgName } from "@/api/adminOuter.js";

import { province, city, area } from "@/api/address.js";

export default {
  data() {
    return {
      formValidate: {
        id: "",
        type: "",
        parentName: "", // 上级组织名称
        orgName: "",
        orgNameAbbr: "",
        lngLat: "",
        address: "", //地址
        provinceCode: "",
        provinceName: "",
        cityCode: "",
        cityName: "",
        districtCode: "",
        districtName: "",
        phone: "",
        time1: "",
        time2: "",
        remark: "",
        tableArr: [], //table数组
        disabled: 0,
        parentId: "", //上级组织id
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

      // 上级组织
      orgModal: false,
      fullOrgName: "", // 所属组织全称
      fullOrgNameSelection: "", // 已选组织全称

      showTr: false,
      typesDataList: [], //类别
      addInfoAddress: {}, //地址详情
      flagDisabled: false, //勾选状态值
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
      ], //案例中的类型
      ruleValidate: {
        type: [
          {
            required: true,
            message: "类别不能为空",
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
        parentName: [
          {
            required: true,
            message: "请选择上级组织",
            trigger: "change"
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
      outShopTypeTitle: ""
    };
  },
  created() {
    if (this.$route.query.id) {
      this.outShopTypeTitle = "编辑门店/部门";
    } else {
      this.outShopTypeTitle = "新增门店/部门";
    }
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "组织管理" },
      { name: this.outShopTypeTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.getOutOrgShopTypeList();
    this.formValidate.parentId = this.$route.query.pageParentId;
    this.formValidate.parentName = this.$route.query.pageParentName;
  },
  mounted() {
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
    if (this.$route.query.id) {
      this.handleEdit(this.$route.query.id);
    }
  },
  components: {
    vAddress,
    ahoudStatus,
    uploadTable,
    orgTree,
    shopUrl
  },
  methods: {
    // 获取类别
    getOutOrgShopTypeList() {
      outerOrgShopTypeList().then(respone => {
        if (respone.data.code == 200) {
          let shopTypeList = respone.data.data;
          shopTypeList.forEach(item => {
            let obj = {};
            obj.value = item.id;
            obj.label = item.text;
            this.typesDataList.push(obj);
          });
        }
      });
    },
    // 添加案例
    addCase() {
      let obj = {};
      obj.type = "";
      obj.url = "";
      obj.waterUrl = "";
      obj.description = "";
      this.showTr = true;
      this.formValidate.tableArr.push(obj);
    },
    uploadFun(res) {
      // if (typeof res.index == "undefined") {
      //   this.formValidate.shopUrl = res.data[0];
      // } else {
      //   let tablePramsList = this.formValidate.tableArr;
      //   for (let i = 0; i < tablePramsList.length; i++) {
      //     if (res.index == i) {
      //       tablePramsList[i].url = res.data[0];
      //     }
      //   }
      // }

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
    // 删除图片
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
      // console.log(url, 999999);
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
    // 状态
    handleStatus(val) {

      if (val == 0) {
        this.formValidate.disabled = false;
      } else if (val == 1) {
        this.formValidate.disabled = true;
      }
      this.formValidate.disabled = val;
    },
    handleSubmit(name) {
        // console.log(this.formValidate, "3333");
      this.$refs[name].validate(valid => {
        if (valid) {
          // if(this.formValidate.tableArr.length==0){
          //     this.$Message.warning('请上传案例图片！！');
          //     return;
          // }

          let params = {};
          let organization = {};
          organization.businessHours =
            this.formValidate.time1 + "-" + this.formValidate.time2;
          if (this.formValidate.disabled == 0) {
            organization.disabled = false;
          } else if (this.formValidate.disabled == 1) {
            organization.disabled = true;
          }
          organization.type = this.formValidate.type;
          organization.orgName = this.formValidate.orgName;
          organization.address = this.formValidate.address;
          organization.lngLat = this.formValidate.lngLat;
          organization.phone = this.formValidate.phone;
          organization.provinceName = this.formValidate.provinceName;
          organization.provinceCode = this.formValidate.provinceCode;
          organization.cityName = this.formValidate.cityName;
          organization.cityCode = this.formValidate.cityCode;
          organization.districtCode = this.formValidate.districtCode;
          organization.districtName = this.formValidate.districtName;
          organization.id = this.formValidate.id;
          organization.remark = this.formValidate.remark;
          organization.parentId = this.formValidate.parentId;
          organization.shopUrl = this.formValidate.shopUrl;
          organization.shopWaterUrl = this.formValidate.shopWaterUrl; //水印图

          let caseList = [];
          let pictureUrlList = this.formValidate.tableArr;
          for (let i = 0; i < pictureUrlList.length; i++) {
            if (pictureUrlList[i].url) {
              caseList.push(pictureUrlList[i]);
            } else {
              this.$Message.warning("请上传图片!");
              return;
            }
          }
          params.organization = organization;
          params.dealerOrganizationSpaceList = caseList;
          if (this.formValidate.id) {
            //编辑
            editOuterOrgShopType(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              }
            });
          } else {
            //新增
            outerOrgShopType(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              }
            });
          }
        }
      });
    },
    // 编辑
    handleEdit(id) {
      outerOrgAllInfo({ orgId: id }).then(response => {
        if (response.data.code == 200) {
          this.flagDisabled = true;
          let paramsInfoObj = response.data.data.organization;
          let dealerOrganizationSpaceList =
            response.data.data.dealerOrganizationSpaceList;
          this.formValidate.id = paramsInfoObj.id;
          this.formValidate.type = paramsInfoObj.type;
          this.formValidate.orgName = paramsInfoObj.orgName;
          this.formValidate.orgNameAbbr = paramsInfoObj.orgNameAbbr;
          this.formValidate.lngLat = paramsInfoObj.lngLat;
          this.formValidate.phone = paramsInfoObj.phone;
          this.formValidate.address = paramsInfoObj.address;


            let paramsObject = {
              provinceCode: paramsInfoObj.provinceCode,
              cityCode: paramsInfoObj.cityCode,
              provinceName: paramsInfoObj.provinceName,
              cityName: paramsInfoObj.cityName,
              districtName: paramsInfoObj.districtName,
              districtCode: paramsInfoObj.districtCode
            };
            this.handleEditAddress(paramsObject);

          this.formValidate.remark = paramsInfoObj.remark;
          this.formValidate.disabled = paramsInfoObj.disabled;
          this.formValidate.shopUrl = paramsInfoObj.shopUrl; //门店图片

            this.formValidate.shopWaterUrl = paramsInfoObj.shopWaterUrl; //门店水图片

          this.formValidate.shopWatcherPic.watchUrl =
            paramsInfoObj.shopWaterUrl; //门店图水印图
          this.formValidate.shopWatcherPic.url = paramsInfoObj.shopUrl; //门店图水印图

          this.formValidate.parentName = response.data.data.parentOrgName;
          this.fullOrgName = response.data.data.parentOrgLongName;
          this.formValidate.parentId = paramsInfoObj.parentId.toString();
          if (paramsInfoObj.businessHours) {
            let timeList = paramsInfoObj.businessHours.split("-");
            this.formValidate.time1 = timeList[0];
            this.formValidate.time2 = timeList[1];
          }

          //   案例
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
          console.log(this.formValidate)
          // 省市区
          let addressObj = {};
          addressObj.provinceCode = this.formValidate.provinceCode;
          addressObj.provinceName = this.formValidate.provinceName;
          addressObj.cityCode = this.formValidate.cityCode;
          addressObj.cityName = this.formValidate.cityName;
          addressObj.districtCode = this.formValidate.districtCode;
          addressObj.districtName = this.formValidate.districtName;
          this.addInfoAddress = addressObj;
        }
      });
    },
    handleBack() {
      this.$router.go(-1);
    },
    // 上级组织
    handleOrgSelect(org) {
      this.orgSelection = org;
      getFullOrgName({
        orgId: org.id
      }).then(resp => {
        if (resp.data.code == 200) {
          this.fullOrgNameSelection = resp.data.data;
        }
      });
    },
    handleOrgSelectOk() {
      // 确定选择
      if (this.orgSelection == null) {
        this.$Message.warning("请选择所属组织");
        return;
      }
      this.formValidate.parentId = this.orgSelection.id;
      this.formValidate.parentName = this.orgSelection.orgName;
      this.fullOrgName = this.fullOrgNameSelection;
      if (this.comId != this.orgSelection.comId) {
        this.comId = this.orgSelection.comId;
      }
      this.orgModal = false;
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
      handleEditAddress(val) {
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
            let provice_arr = this.provinceListData;
            for (let i = 0; i < provice_arr.length; i++) {
              if (provice_arr[i].value == val.provinceCode) {
               this.formValidate.provinceName = provice_arr[i].label;
               this.formValidate.provinceCode = val.provinceCode;
              }
            }
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
                     this.setHandleProvice(val, this.cityListData);
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
                  // this.formValidate.districtCode = val.districtCode;
                     this.setHandleDisct(val,this.areaListData)
                }
              });
            }
          }
        });
      //    let provice_arr = this.provinceListData;
      // for (let i = 0; i < provice_arr.length; i++) {
      //   if (provice_arr[i].value == val.provinceCode) {
      //    this.formValidate.provinceName = provice_arr[i].label;
      //    this.formValidate.provinceCode = val.provinceCode;
      //   }
      // }
      // if (val.provinceCode) {
      //   city({ provinceId: val.provinceCode }).then(response => {
      //     if (response.data.code == 200) {
      //       this.cityListData = [];
      //       let cityList = response.data.data;
      //       for (let i = 0; i < cityList.length; i++) {
      //         let obj = {};
      //         obj.value = cityList[i].cityId;
      //         obj.label = cityList[i].cityName;
      //         this.cityListData.push(obj);
      //       }
      //          this.setHandleProvice(val, this.cityListData);
      //     }
      //   });
      // }
      // if (val.cityCode) {
      //   area({ cityId: val.cityCode }).then(response => {
      //     if (response.data.code == 200) {
      //       this.areaListData = [];
      //       let areayList = response.data.data;
      //       for (let i = 0; i < areayList.length; i++) {
      //         let obj = {};
      //         obj.value = areayList[i].areaId;
      //         obj.label = areayList[i].areaName;
      //         this.areaListData.push(obj);
      //       }
      //       // this.formValidate.districtCode = val.districtCode;
      //          this.setHandleDisct(val,this.areaListData)
      //     }
      //   });
      // }
    },
        setHandleProvice(val, city_pramas) {
      let city_arr = city_pramas;
      for (let i = 0; i < city_arr.length; i++) {
        if (city_arr[i].value == val.cityCode) {
          this.formValidate.cityName = city_arr[i].label;
          this.formValidate.cityCode = city_arr[i].value;
        }
      }
    },
    setHandleDisct(val, disctrice_pramas) {
      // let district_arr = this.areaListData;
         let district_arr = disctrice_pramas;
      for (let i = 0; i < district_arr.length; i++) {
        if (district_arr[i].value == val.districtCode) {
          this.formValidate.districtName = district_arr[i].label;
           this.formValidate.districtCode = district_arr[i].value;
        }
      };


    }
  }
};
</script>

<style lang="less" scoped>
.footerButton {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
.buttonCommon {
  margin-right: 10px;
  margin-bottom: 10px;
}

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

.field-tip {
  color: #9ea7b4;
  font-size: 12px;
  margin-left: 16px;
}
.field-width {
  width: 200px;
}

.addressContent {
  display: flex;
}
</style>
