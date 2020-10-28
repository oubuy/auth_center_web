<template>
    <div>
        <Select v-model="province" placeholder="省" style="width:150px" clearable label-in-value @on-change="handleprovice">
            <Option v-for="(item,index) in provinceListData"  :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <span style="margin:0 10px;"></span>
         <Select v-model="city" placeholder="市" style="width:150px" clearable label-in-value @on-change="handlecity">
              <Option v-for="(item,index) in cityListData"  :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
          <span style="margin:0 10px;"></span>
         <Select v-model="districtCode" placeholder="区" style="width:150px" clearable label-in-value @on-change="handlearea">
            <Option v-for="(item,index) in areaListData"  :value="item.value" :key="index" >{{ item.label }}</Option>
        </Select>
    </div>
</template>

<script>
import { province, city, area } from "@/api/address.js";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      provinceListData: [],
      province: "",
      provinceName: "",
      cityListData: [],
      city: "",
      cityName: "",
      areaListData: [],
      // area: "",
      // areaName:'',

      districtCode: "",
      districtName: "",
      temp: {}
    };
  },
  props: ["addressInfo"],
  created() {

  },
  mounted() {

  },
  methods: {
    getProvinceList(val) {
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
              this.provinceName = provice_arr[i].label;
              this.province = val.provinceCode;
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
                // this.city = val.cityCode;
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
                //  this.area = val.districtCode;

                // this.districtCode = val.districtCode;
                this.setHandleDisct(val,this.areaListData)
              }
            });

          }
        }
      });
    },
    handleprovice(val) {
      this.cityListData = [];
      this.city = "";
      if (typeof val != "undefined") {
        this.$emit("child-province", val);
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
      // this.area = "";
      this.districtCode = "";

      if (typeof val != "undefined") {
        this.$emit("child-city", val);
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
        this.$emit("child-area", val);
      }
    },
    setHadeleAddress(val) {
      this.getProvinceList(val);
    },
    setHandleProvice(val, city_pramas) {
      let city_arr = city_pramas;
      for (let i = 0; i < city_arr.length; i++) {
        if (city_arr[i].value == val.cityCode) {
          this.cityName = city_arr[i].label;
          this.city = city_arr[i].value;
        }
      }
    },
    setHandleDisct(val, disctrice_pramas) {
      let district_arr = this.areaListData;
      for (let i = 0; i < district_arr.length; i++) {
        if (district_arr[i].value == val.districtCode) {
          this.districtName = district_arr[i].label;
          this.districtCode = district_arr[i].value;
        }
      };

        let params={
          province:this.province,
          provinceName:this.provinceName,
          city:this.city,
          cityName:this.cityName,
          districtCode:this.districtCode,
          districtName:this.districtName

        }
        this.$emit("child-all",params)
    }
  },
  watch: {
    addressInfo(val) {
      this.setHadeleAddress(val);
    }
  }
};
</script>
