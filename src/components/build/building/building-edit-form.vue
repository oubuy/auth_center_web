<template>
<div style="position:relative; padding-bottom:32px;">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="90">
        <FormItem label="楼盘名称" prop="buildingName">
            <Input v-model.trim="formData.buildingName" placeholder="请输入楼盘名称" @on-blur="checkBuildingName" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="楼盘地址" prop="addressInfo">
            <address-select ref="addressSelectRef" :address="formData" @area-change="checkBuildingName"></address-select>
            <Input v-model.trim="formData.buildingPlace" placeholder="请输入楼盘详细地址" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="楼盘图片" prop="imageUrl">
            <upload-img ref="uploadImgRef" :quantity="1" watermark="true" style="display: inline-block;"></upload-img>
        </FormItem>
        <FormItem label="是否上架">
            <RadioGroup v-model="formData.onShelf">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="经纬度">
            <Input v-model.trim="formData.buildingLonLat" placeholder="请输入百度地图上的经纬度，经度纬度请用逗号隔开" style="width:300px;" clearable></Input>
            <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" style="margin-left: 15px; font-size:14px;">获取经纬度</a>
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
        <FormItem label="装修状况">
            <RadioGroup v-model="formData.decorationStatus">
                <Radio label="毛坯">毛坯</Radio>
                <Radio label="标准装修">标准装修</Radio>
                <Radio label="精装修">精装修</Radio>
                <Input v-model.trim="formData.decorationStatus" placeholder="其它" clearable style="width:150px;"></Input>
            </RadioGroup>
        </FormItem>
        <FormItem label="建筑类别">
            <Input v-model.trim="formData.buildingType" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="开发商">
            <Input v-model.trim="formData.buildingDevelopers" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="物业类型">
            <label-select :value="propertyTypeSelected" :data="propertyTypeOptions" desc="物业类型"></label-select>
        </FormItem>
        <FormItem label="楼盘特点">
            <label-select :value="formData.buildingLabelList" :data="buildingLabelOptions" desc="楼盘特点"></label-select>
        </FormItem>
    </Form>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 底部工具栏 -->
    <div class="toolbar-footer">
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit(true)">保存并添加户型</Button>
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit(false)" style="margin-left: 8px">保 存</Button>
        <Button @click="handleBack()" style="margin-left: 8px">返 回</Button>
    </div>
</div>
</template>

<script>
import {
    getHotBuildingLabels,
    listPropertyType,
    saveBuilding,
    getBuilding,
    findBuilding
} from "@/api/building.js";
import uploadImg from "@/components/build/upload-img";
import labelSelect from "@/components/build/label-select";
import addressSelect from "@/components/build/address";

export default {
    props: {
        buildingId: {
            type: String
        },
        isAdminPage: {
            type: Boolean,
            default: false
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
        return {
            formData: {
                buildingId: null,
                buildingName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                buildingPlace: '',
                imageUrl: '',
                onShelf: '',
                averagePrice: '',
                openingTime: '',
                buildingTime: '',
                buildingLonLat: '',
                propertyType: '',
                decorationStatus: '',
                buildingType: '',
                buildingDevelopers: '',
                buildingLabelList: [],
                buildingImage: null
            },
            buildingLabelOptions: [], // 楼盘特点选项列表
            propertyType: '',
            propertyTypeOptions: [], // 楼盘物业类型选项列表
            propertyTypeSelected: [], // 当前已选的楼盘物业类型
            ruleValidate: {
                buildingName: [{
                    required: true,
                    message: "请输入楼盘名称",
                    trigger: "blur"
                }],
                imageUrl: [{
                    required: true,
                    message: "请上传楼盘图片"
                }],
                addressInfo: [{
                    required: true,
                    validator: validateAddressInfo,
                    trigger: "blur"
                }]
            },
            saveBtnDisabled: true,
            saveBtnLoading: false,
            selectSpaceModal: false,
            spinShow: false,
            checkRepeatBuildingParam: ''
        }
    },
    created() {
        this.fetchBuildingLabel();
        this.fetchPropertyType();
        if (this.buildingId) { // 编辑
            this.fetchData(this.buildingId);
        } else { // 新增
            this.formData.onShelf = "1";
            this.formData.decorationStatus = "毛坯";
            this.saveBtnDisabled = false;
        }
    },
    components: {
        uploadImg,
        labelSelect,
        addressSelect
    },
    methods: {
        checkBuildingName() {
            if (this.formData.buildingId) {
                return;
            }
            if (this.formData.buildingName && this.formData.provinceId && this.formData.cityId && this.formData.areaId) {
                let temp = this.formData.buildingName + this.formData.provinceId + this.formData.cityId + this.formData.areaId;
                if (this.checkRepeatBuildingParam == temp) {
                    return;
                }
                let param = {
                    buildingName_equal: this.formData.buildingName,
                    provinceId: this.formData.provinceId,
                    cityId: this.formData.cityId,
                    areaId: this.formData.areaId
                }
                findBuilding(param).then(resp => {
                    if (resp.data.code == 200) {
                        this.checkRepeatBuildingParam = temp;
                        if (resp.data.data.size > 0) {
                            let building = resp.data.data.list[0];
                            this.$Modal.confirm({
                                title: '请确认',
                                content: '<p>已存在该楼盘，是否再次创建？重复创建同名楼盘将影响交互屏户型库中楼盘的体验！</p>',
                                okText: '是',
                                cancelText: '否，使用已有楼盘',
                                onCancel: () => {
                                    let buildingId = resp.data.data.list[0].buildingId;
                                    this.fetchData(resp.data.data.list[0].buildingId);
                                    this.$emit("to-edit", buildingId);
                                }
                            });
                        }
                    }
                });
            }
        },
        handleSubmit(isAddModel) {
            let uploadImgList = this.$refs.uploadImgRef.getUploadList();
            if (uploadImgList == null) {
                return;
            }
            if (uploadImgList.length > 0) {
                this.formData.buildingImage = uploadImgList[0];
                this.formData.imageUrl = uploadImgList[0].imageUrl;
            } else {
                this.formData.buildingImage = null;
                this.formData.imageUrl = '';
            }

            let arr = [];
            this.propertyTypeSelected.forEach(item => {
                arr.push(item.labelName);
            });
            this.formData.propertyType = arr.join(',');
            if (!this.formData.buildingId) {
                this.formData.dataSource = this.isAdminPage ? 1 : 4;
            }

            this.$refs["formData"].validate(valid => {
                if (!valid) {
                    return;
                }
                this.saveBtnLoading = true;
                saveBuilding(this.formData).then(resp => {
                    this.saveBtnLoading = false;
                    if (resp.data.code == 200) {
                        this.$Message.success(resp.data.msg);
                        this.$emit("save-success", resp.data.data.buildingId, isAddModel);
                    }
                });
            });
        },
        handleBack() {
            this.$emit("back");
        },
        fetchBuildingLabel() {
            getHotBuildingLabels().then(resp => {
                if (resp.data.code == 200) {
                    this.buildingLabelOptions = resp.data.data;
                }
            });
        },
        fetchPropertyType() {
            listPropertyType().then(resp => {
                if (resp.data.code == 200) {
                    this.propertyTypeOptions = resp.data.data;
                }
            });
        },
        fetchData(buildingId) {
            let params = {
                buildingId
            };
            this.spinShow = true;
            getBuilding(params).then(resp => {
                if (resp.data.code == 200) {
                    let building = resp.data.data;
                    this.formData.buildingId = building.buildingId;
                    this.formData.buildingName = building.buildingName;
                    this.formData.provinceId = building.provinceId;
                    this.formData.cityId = building.cityId;
                    this.formData.areaId = building.areaId;
                    this.formData.buildingPlace = building.buildingPlace;
                    this.formData.onShelf = String(building.onShelf);
                    this.formData.averagePrice = building.averagePrice;
                    this.formData.openingTime = building.openingTime;
                    this.formData.buildingTime = building.buildingTime;
                    this.formData.buildingLonLat = building.buildingLonLat;
                    this.formData.propertyType = building.propertyType;
                    this.formData.decorationStatus = building.decorationStatus;
                    this.formData.buildingType = building.buildingType;
                    this.formData.buildingDevelopers = building.buildingDevelopers;
                    this.formData.buildingLabelList = building.buildingLabelList;
                    this.formData.buildingImage = building.buildingImage;
                    this.$refs.uploadImgRef.initUploadList(building.buildingImage);
                    this.$refs.addressSelectRef.initAddressInfo(building.provinceId, building.cityId, building.areaId);
                    if (building.propertyType) {
                        building.propertyType.split(",").forEach(item => {
                            if (item) {
                                this.propertyTypeSelected.push({
                                    labelName: item
                                });
                            }
                        });
                    }
                    if (this.isAdminPage) {
                        this.saveBtnDisabled = false;
                    } else {
                        this.saveBtnDisabled = building.auditStatus == 1 && building.onShelf == 1;
                    }
                }
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
</style>
