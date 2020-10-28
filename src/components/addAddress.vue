<template>
    <div> 
     
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
           <FormItem label="E-mail" prop="mail">
             <Select v-model="formValidate.province" placeholder="省" style="width:150px" clearable label-in-value @on-change="handleprovice">
                <Option v-for="(item,index) in provinceListData"  :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <span style="margin:0 10px;"></span>
            <Select v-model="formValidate.city" placeholder="市" style="width:150px" clearable label-in-value @on-change="handlecity">
                  <Option v-for="(item,index) in cityListData"  :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
              <span style="margin:0 10px;"></span>
            <Select v-model="formValidate.area" placeholder="区" style="width:150px" clearable label-in-value @on-change="handlearea">
                <Option v-for="(item,index) in areaListData"  :value="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
           </FormItem>
        </Form>
    </div>
</template>

<script>
import { province, city, area } from "@/api/address.js";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
    

      ruleValidate: {
        city: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ]
      },
      formValidate: {
        provinceListData: [],
        province: "",
        cityListData: [],
        city: "",
        areaListData: [],
        area: ""
      },

     
    };
  },
  props: ["addressInfo"],
  mounted() {
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
      this.area = "";
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
      this.province = val.provinceCode;
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
            this.city = val.cityCode;
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
            this.area = val.districtCode;
          }
        });
      }
    }
  },
  watch: {
    addressInfo(val) {
      this.setHadeleAddress(val);
    }
  }
};
</script>
