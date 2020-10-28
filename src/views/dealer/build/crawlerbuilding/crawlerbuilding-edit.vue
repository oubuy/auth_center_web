<template>
<div style="position:relative; padding-bottom:32px;">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="90">
        <!-- 楼盘信息 -->
        <Divider orientation="left"><span style="color:#2db7f5">楼盘信息</span></Divider>
        <FormItem label="楼盘名称" prop="buildingName">
            <Input v-model.trim="formData.buildingName" placeholder="请输入楼盘名称" style="width:300px;" clearable></Input>
            <span class="field-tip">所在城市：{{formData.cityName}}</span>
        </FormItem>
        <FormItem label="楼盘地址" prop="addressInfo">
            <address-select ref="addressSelectRef" :address="formData"></address-select>
            <Input v-model.trim="formData.buildingPlace" placeholder="请输入楼盘详细地址" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="楼盘图片">
            <upload-img ref="uploadBuildingImg" :quantity="1" watermark="true"></upload-img>
            <div>图片来源：{{formData.buildingImg}}</div>
        </FormItem>
        <FormItem label="均价">
            <Input v-model.trim="formData.averagePrice" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="开盘时间">
            <Input v-model.trim="formData.openingTime" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="交房时间">
            <Input v-model.trim="formData.buildingTime" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="经纬度">
            <Input v-model.trim="formData.buildingMap" placeholder="请输入百度地图上的经纬度，经度纬度请用逗号隔开" style="width:300px;" clearable></Input>
            <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" style="margin-left: 15px; font-size:14px;">获取经纬度</a>
        </FormItem>
        <FormItem label="楼盘标签">
            <Input v-model.trim="formData.buildingLabel" style="width:300px;" clearable></Input>
            <span class="field-tip">标签之间请用" / "分隔</span>
        </FormItem>
        <FormItem label="物业类型">
            <Input v-model.trim="formData.propertyType" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="物业公司">
            <Input v-model.trim="formData.propertyCompany" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="装修状况">
            <Input v-model.trim="formData.decorationStatus" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="建筑类别">
            <Input v-model.trim="formData.buildingType" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="开发商">
            <Input v-model.trim="formData.buildingDevelopers" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="占地面积">
            <Input v-model.trim="formData.coveredArea" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="建筑面积">
            <Input v-model.trim="formData.buildingArea" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="项目特色">
            <Input v-model.trim="formData.projectFeatures" style="width:300px;" clearable></Input>
        </FormItem>
        <!-- 户型信息 -->
        <Divider orientation="left"><span style="color:#2db7f5">户型信息</span></Divider>
        <FormItem label="户型名称" prop="modelName">
            <Input v-model.trim="formData.modelName" placeholder="请输入户型名称" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="户型布局" prop="propertyTypeInfo">
            <Select v-model="formData.roomCount" placeholder="室" style="width:50px;">
                <Option v-for="item in roomCountData" :value="item" :key="item">{{ item }}</Option>
            </Select>室
            <Select v-model="formData.hallCount" placeholder="厅" style="width:50px; margin-left:8px;">
                <Option v-for="item in roomCountData" :value="item" :key="item">{{ item }}</Option>
            </Select>厅
            <Select v-model="formData.bathroomCount" placeholder="卫" style="width:50px; margin-left:8px;">
                <Option v-for="item in roomCountData" :value="item" :key="item">{{ item }}</Option>
            </Select>卫
            <Select v-model="formData.kitchenCount" placeholder="厨" style="width:50px; margin-left:8px;">
                <Option v-for="item in roomCountData" :value="item" :key="item">{{ item }}</Option>
            </Select>厨
        </FormItem>
        <FormItem label="户型面积" prop="modelArea">
            <InputNumber v-model="formData.modelArea" style="width:100px"></InputNumber>㎡
        </FormItem>
        <FormItem label="户型图">
            <upload-img ref="uploadModelImg" :quantity="1" watermark="true" :maxWidth="4000" :maxHeight="4000" style="display: inline-block; vertical-align: middle;"></upload-img>
            <span class="field-tip" style="vertical-align: middle;">户型图分辨率最大不能超过4000</span>
            <div>图片来源：{{formData.modelImage}}</div>
        </FormItem>
        <FormItem label="户型标签">
            <Input v-model.trim="formData.modelLabel" style="width:300px;" clearable></Input>
            <span class="field-tip">标签之间请用" / "分隔</span>
        </FormItem>
        <FormItem label="户型参考均价">
            <Input v-model.trim="formData.modelAveragePrice" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="户型参考总价">
            <Input v-model.trim="formData.modelTotalPrice" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="户型解析">
            <Input v-model.trim="formData.modelDesc" type="textarea" :autosize="{minRows: 5,maxRows: 8}" style="width:300px;" clearable></Input>
        </FormItem>
    </Form>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 底部工具栏 -->
    <div class="toolbar-footer">
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit(true)">保存并同步到楼盘中心</Button>
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit(false)" style="margin-left: 8px">保 存</Button>
        <Button @click="handleBack(false)" style="margin-left: 8px">返 回</Button>
    </div>
</div>
</template>

<script>
import {
    getCrawlerBuilding,
    updateCrawlerBuilding
} from "@/api/building.js";
import uploadImg from "@/components/build/upload-img";
import addressSelect from "@/components/build/address";

export default {
    props: {
        id: {
            type: String
        }
    },
    data() {
        const validateAddressInfo = (rule, value, callback) => {
            if (!this.formData.provinceId || !this.formData.cityId || !this.formData.areaId) {
                callback(new Error('请选择省市区'));
            }
            if (this.formData.buildingPlace == '') {
                callback(new Error('请输入楼盘详细地址'));
            }
            callback();
        };
        const validatePropertyTypeInfo = (rule, value, callback) => {
            if (this.formData.roomCount == null || this.formData.hallCount == null || this.formData.bathroomCount == null || this.formData.kitchenCount == null) {
                callback(new Error('请选择户型布局'));
            }
            callback();
        };
        return {
            formData: {
                id: null,
                cityName: '',
                buildingName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                buildingPlace: '',
                buildingImg: '',
                buildingImgOss: null,
                buildingImgMark: null,
                averagePrice: '',
                openingTime: '',
                buildingTime: '',
                buildingMap: '',
                buildingLabel: '',
                propertyType: '',
                propertyCompany: '',
                decorationStatus: '',
                buildingType: '',
                buildingDevelopers: '',
                coveredArea: '',
                buildingArea: '',
                projectFeatures: '',
                modelName: '',
                roomCount: null,
                hallCount: null,
                bathroomCount: null,
                kitchenCount: null,
                modelArea: null,
                modelImage: '',
                modelImageOss: null,
                modelImageMark: null,
                modelLabel: '',
                modelAveragePrice: '',
                modelTotalPrice: '',
                modelDesc: ''
            },
            saveBtnLoading: false,
            saveBtnDisabled: true,
            spinShow: false,
            roomCountData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            ruleValidate: {
                buildingName: [{
                    required: true,
                    message: "请输入楼盘名称",
                    trigger: "blur"
                }],
                addressInfo: [{
                    required: true,
                    validator: validateAddressInfo,
                    trigger: "blur"
                }],
                modelName: [{
                    required: true,
                    message: "请输入户型名称",
                    trigger: "blur"
                }],
                propertyTypeInfo: [{
                    required: true,
                    validator: validatePropertyTypeInfo
                }],
                modelArea: [{
                    required: true,
                    message: "请输入户型面积"
                }]
            }
        };
    },
    components: {
        uploadImg,
        addressSelect
    },
    created() {
        if (this.id) {
            this.fetchData(this.id);
        }
    },
    activated() {
        this.$refs.formData.resetFields();
        if (this.id) {
            this.fetchData(this.id);
        }
    },
    methods: {
        handleSubmit(isSync) {
            let buildingImgList = this.$refs.uploadBuildingImg.getUploadList();
            let modelImgList = this.$refs.uploadModelImg.getUploadList();
            if (buildingImgList == null || modelImgList == null) {
                return;
            }
            if (buildingImgList.length > 0) {
                this.formData.buildingImgOss = buildingImgList[0].imageUrl;
                this.formData.buildingImgMark = buildingImgList[0].markImageUrl;
            } else {
                this.formData.buildingImgOss = null;
                this.formData.buildingImgMark = null;
            }
            if (modelImgList.length > 0) {
                this.formData.modelImageOss = modelImgList[0].imageUrl;
                this.formData.modelImageMark = modelImgList[0].markImageUrl;
            } else {
                this.formData.modelImageOss = null;
                this.formData.modelImageMark = null;
            }

            this.$refs["formData"].validate(valid => {
                if (!valid) {
                    return;
                }
                this.saveBtnLoading = true;
                this.formData.isSync = isSync;
                updateCrawlerBuilding(this.formData).then(resp => {
                    this.saveBtnLoading = false;
                    if (resp.data.code == 200) {
                        this.$Message.success(resp.data.msg);
                        this.handleBack();
                    }
                });
            });
        },
        handleBack() {
            this.$emit("back");
        },
        fetchData(id) {
            let params = {
                id
            };
            this.spinShow = true;
            this.saveBtnDisabled = true;
            this.formData.provinceId = '';
            this.formData.cityId = '';
            this.formData.areaId = '';
            getCrawlerBuilding(params).then(resp => {
                if (resp.data.code == 200) {
                    let build = resp.data.data;
                    this.formData.id = build.id;
                    this.formData.cityName = build.cityName;
                    this.formData.buildingName = build.buildingName;
                    this.formData.provinceId = build.provinceId;
                    this.formData.cityId = build.cityId;
                    this.formData.areaId = build.areaId;
                    this.formData.buildingPlace = build.buildingPlace;
                    this.formData.buildingImg = build.buildingImg;
                    this.formData.buildingImgOss = build.buildingImgOss;
                    this.formData.buildingImgMark = build.buildingImgMark;
                    this.formData.averagePrice = build.averagePrice;
                    this.formData.openingTime = build.openingTime;
                    this.formData.buildingTime = build.buildingTime;
                    this.formData.buildingMap = build.buildingMap;
                    this.formData.buildingLabel = build.buildingLabel;
                    this.formData.propertyType = build.propertyType;
                    this.formData.propertyCompany = build.propertyCompany;
                    this.formData.decorationStatus = build.decorationStatus;
                    this.formData.buildingType = build.buildingType;
                    this.formData.buildingDevelopers = build.buildingDevelopers;
                    this.formData.coveredArea = build.coveredArea;
                    this.formData.buildingArea = build.buildingArea;
                    this.formData.projectFeatures = build.projectFeatures;
                    this.formData.modelName = build.modelName;
                    this.formData.roomCount = build.roomCount;
                    this.formData.hallCount = build.hallCount;
                    this.formData.bathroomCount = build.bathroomCount;
                    this.formData.kitchenCount = build.kitchenCount;
                    if (build.modelArea && !isNaN(build.modelArea)) {
                        this.formData.modelArea = parseInt(build.modelArea);
                    } else {
                        this.formData.modelArea = null;
                    }
                    this.formData.modelImage = build.modelImage;
                    this.formData.modelImageOss = build.modelImageOss;
                    this.formData.modelImageMark = build.modelImageMark;
                    this.formData.modelLabel = build.modelLabel;
                    this.formData.modelAveragePrice = build.modelAveragePrice;
                    this.formData.modelTotalPrice = build.modelTotalPrice;
                    this.formData.modelDesc = build.modelDesc;

                    this.$refs.addressSelectRef.initAddressInfo(build.provinceId, build.cityId, build.areaId);
                    if (build.buildingImgOss) {
                        this.$refs.uploadBuildingImg.initUploadList({
                            imageUrl: build.buildingImgOss,
                            markImageUrl: build.buildingImgMark
                        });
                    }
                    if (build.modelImageOss) {
                        this.$refs.uploadModelImg.initUploadList({
                            imageUrl: build.modelImageOss,
                            markImageUrl: build.modelImageMark
                        });
                    }
                }
                this.saveBtnDisabled = false;
                this.spinShow = false;
            });
        }
    }
};
</script>

<style>
.field-tip {
    color: #9ea7b4;
    font-size: 12px;
    margin-left: 16px;
}

.toolbar-footer {
    position: fixed;
    width: 100%;
    padding: 10px 110px;
    text-align: left;
    bottom: 0px;
    left: 210px;
    z-index: 100;
    background: rgba(248, 248, 249, 0.8);
}
</style>
