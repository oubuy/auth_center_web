<template>
<div style="display:inline-block;">
    <Select v-model="address.provinceId" placeholder="省" clearable @on-change="handleSelectProvince" style="width:100px">
        <Option v-for="(item,index) in provinceData" :value="item.value" :key="index">{{ item.label }}</Option>
    </Select>
    <Select v-model="address.cityId" placeholder="市" clearable @on-change="handleSelectCity" style="width:100px">
        <Option v-for="(item,index) in cityData" :value="item.value" :key="index">{{ item.label }}</Option>
    </Select>
    <Select v-model="address.areaId" placeholder="区" clearable @on-change="handleSelectArea" style="width:100px">
        <Option v-for="(item,index) in areaData" :value="item.value" :key="index">{{ item.label }}</Option>
    </Select>
</div>
</template>

<script>
import {
    province,
    city,
    area
} from "@/api/address.js";

export default {
    props: {
        address: {
            type: Object
        }
    },
    data() {
        return {
            provinceData: [],
            cityData: [],
            areaData: []
        };
    },
    created() {
        this.fetchProvinceData();
    },
    methods: {
        initAddressInfo(provinceId, cityId, areaId) {
            this.address.provinceId = provinceId;
            this.address.cityId = "";
            this.address.areaId = "";
            this.cityData = [];
            this.areaData = [];
            if (provinceId) {
                this.fetchCityData(provinceId, cityId);
            }
            if (cityId) {
                this.fetchAreaData(cityId, areaId);
            }
        },
        fetchProvinceData() {
            province().then(resp => {
                if (resp.data.code == 200) {
                    this.provinceData = [];
                    resp.data.data.forEach(item => {
                        let obj = {};
                        obj.value = item.provinceId;
                        obj.label = item.provinceName;
                        this.provinceData.push(obj);
                    });
                }
            });
        },
        fetchCityData(provinceId, cityId) {
            let param = {
                provinceId
            };
            city(param).then(resp => {
                if (resp.data.code == 200) {
                    this.cityData = [];
                    resp.data.data.forEach(item => {
                        let obj = {};
                        obj.value = item.cityId;
                        obj.label = item.cityName;
                        this.cityData.push(obj);
                    });
                    if (cityId) {
                        this.address.cityId = cityId;
                    }
                }
            });
        },
        fetchAreaData(cityId, areaId) {
            let param = {
                cityId
            };
            area(param).then(resp => {
                if (resp.data.code == 200) {
                    this.areaData = [];
                    resp.data.data.forEach(item => {
                        let obj = {};
                        obj.value = item.areaId;
                        obj.label = item.areaName;
                        this.areaData.push(obj);
                    });
                    if (areaId) {
                        this.address.areaId = areaId;
                    }
                }
            });
        },
        handleSelectProvince(val) {
            this.address.cityId = "";
            this.address.areaId = "";
            this.cityData = [];
            this.areaData = [];
            if (val) {
                this.fetchCityData(val);
            }
        },
        handleSelectCity(val) {
            this.address.areaId = "";
            this.areaData = [];
            if (val) {
                this.fetchAreaData(val);
            }
        },
        handleSelectArea(val) {
            this.$emit("area-change", val);
        }
    }
};
</script>
