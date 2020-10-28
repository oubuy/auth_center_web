<template>
  <div class="infoContent">
    <Form ref="formValidate" :model="formData" :label-width="80" :rules="ruleValidate">
      
                    <FormItem label="编号:" prop="baseCstCode">
                        <span>{{formData.baseCstCode}}</span>
                    </FormItem>
                    <FormItem label="经销商名称:" prop="orgName">
                        <span>{{formData.orgName}}</span>
                    </FormItem>
                    <FormItem label="条形码:" prop="barCode">
                         <span>{{formData.barCode}}</span>
                    </FormItem>
         <div class="addressContent">
              <FormItem label="地址:" prop="provinceCode">
              <Row>
               <Col span="18">
                 <Select v-model="formData.provinceCode" placeholder="省" style="width:150px" clearable label-in-value @on-change="handleprovice">
                    <Option v-for="(item,index) in provinceListData"  :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
             </Col>
             
            </Row>
          </FormItem>
           <FormItem class="cityCodeButton" prop="cityCode" :label-width="20">
                <Select v-model="formData.cityCode" placeholder="市" style="width:150px" clearable label-in-value @on-change="handlecity">
                      <Option v-for="(item,index) in cityListData"  :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
          </FormItem>
           
            <FormItem :label-width="20">
               <Select v-model="formData.districtCode" placeholder="区" style="width:150px" clearable label-in-value @on-change="handlearea">
                    <Option v-for="(item,index) in areaListData"  :value="item.value" :key="index" >{{ item.label }}</Option>
              </Select>
            </FormItem>
         </div>
           


           <FormItem class="addressButton" prop="address" style="width:400px">
                <Input v-model="formData.address" placeholder="请输入地址"></Input>
          </FormItem>
    </Form>
     <div class="bottomButton">
            <Button type="primary" @click="submitForm('formValidate')">保存</Button>
            <i class="buttonG"></i>
            <Button>返回</Button>
      </div>
  </div>
</template>

<script>
import { getBasicInfoData, updateBasic } from "@/api/basicInformation.js";
import { province, city, area } from "@/api/address.js";

import VDistpicker from "v-distpicker";

export default {
  data() {
    return {
      formData: {
        baseCstCode: "",
        orgName: "",
        barCode: "",
        address: "",
        provinceName: "",
        provinceCode: "",
        cityName: "",
        cityCode: "",
        districtName: "",
        districtCode: ""
      },
      provinceListData: [],
      cityListData: [],
      areaListData: [],

      ruleValidate: {
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
      }
    };
  },
  mounted() {
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "基础信息" }
    ];
    // this.$store.commit(this.GLOBAL_TYPES.SET_breadcrumbs,breadcrumbs)
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
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

    // 初始化值
    getBasicInfoData().then(response => {
      if (response.data.code == 200) {
        this.formData.baseCstCode = response.data.data.baseCstCode;
        this.formData.orgName = response.data.data.orgName;
        this.formData.barCode = response.data.data.barCode;
        this.formData.address = response.data.data.address;

        let paramsObject = {
          provinceCode: response.data.data.provinceCode,
            provinceName: response.data.data.provinceName,
          cityCode: response.data.data.cityCode,
        
          cityName: response.data.data.cityName,
          districtName: response.data.data.districtName,
          districtCode: response.data.data.districtCode
        };
        this.handleEditAddress(paramsObject);
      }
    });
 
  },
  components: {},
  methods: {
    handleEditAddress(val) {
      let provice_arr = this.provinceListData;
      for (let i = 0; i < provice_arr.length; i++) {
        if (provice_arr[i].value == val.provinceCode) {
         this.formData.provinceName = provice_arr[i].label;
         this.formData.provinceCode = val.provinceCode;
        }
      }


      // this.formData.provinceCode = val.provinceCode;
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
            // this.formData.cityCode = val.cityCode;
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
            // this.formData.districtCode = val.districtCode;
                this.setHandleDisct(val,this.areaListData)
          }
        });
      }
    },
      setHandleProvice(val, city_pramas) {
      let city_arr = city_pramas;
      for (let i = 0; i < city_arr.length; i++) {
        if (city_arr[i].value == val.cityCode) {
          this.formData.cityName = city_arr[i].label;
          this.formData.cityCode = city_arr[i].value;
        }
      }
    },
    setHandleDisct(val, disctrice_pramas) {
      let district_arr = disctrice_pramas;
      for (let i = 0; i < district_arr.length; i++) {
        if (district_arr[i].value == val.districtCode) {
          this.formData.districtName = district_arr[i].label;
           this.formData.districtCode = district_arr[i].value;
        }
      };
       
      
    },
    handleprovice(val) {
      this.cityListData = [];
      this.formData.cityCode = "";
      if (typeof val != "undefined") {
        this.formData.provinceName = val.label;
        this.formData.provinceCode = val.value;

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
      this.formData.districtCode = "";
      if (typeof val != "undefined") {
        this.formData.cityName = val.label;
        this.formData.cityCode = val.value;

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
      this.formData.districtName = val.label;
      this.formData.districtCode = val.value;
    },

    submitForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let objParams = {};
          objParams.provinceCode = this.formData.provinceCode;
          objParams.provinceName = this.formData.provinceName;
          objParams.cityCode = this.formData.cityCode;
          objParams.cityName = this.formData.cityName;
          objParams.districtCode = this.formData.districtCode;
          objParams.districtName = this.formData.districtName;
          objParams.address = this.formData.address;
          updateBasic(objParams).then(data => {
            if (data.status == 200) {
              this.$Message.success(data.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/mixin";
.ivu-form-item-content {
  width: 180px !important;
}

.distpicker-address-wrapper {
  width: 550px;
}

.bottomButton {
  position: absolute;
  bottom: 25px;
  .lr();
  .buttonG {
    padding: 0 10px;
  }
}

.addressContent {
  display: flex;
}
</style>
