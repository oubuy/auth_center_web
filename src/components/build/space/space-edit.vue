<template>
<div style="position:relative; padding-bottom:32px;">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="110">
        <FormItem label="案例名称" prop="spaceName">
            <Input v-model.trim="formData.spaceName" placeholder="请输入案例名称" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="案例类型" prop="spaceTypeId">
            <space-type-select :spaceTypeId="formData.spaceTypeId" @on-change="handleChangeSpaceType"></space-type-select>
        </FormItem>
        <FormItem label="风格" prop="styleId">
            <space-style-select :styleId="formData.styleId" @on-change="handleChangeStyle"></space-style-select>
        </FormItem>
        <FormItem label="关联商品" prop="spaceProductList">
            <Select v-model="productSearch" filterable remote :remote-method="handleSearchProducts" @on-change="handleSelectProducts" icon="ios-search" placeholder="请输入商品型号或名称搜索" clearable style="width:300px; margin-right:12px;">
                <Option v-for="item in productData" :value="item.skuModityId + ',' + item.officialModel + ',' + item.modityName" :key="item.skuModityId">{{ item.officialModel + "&nbsp;&nbsp;" + item.modityName + "&nbsp;&nbsp;" + item.skuModitySize }}</Option>
            </Select>
            <Table :columns="spaceProductColumns" :data="formData.spaceProductList" :width="550" size="small" style="margin-top:8px;"></Table>
        </FormItem>
        <FormItem label="户型面积" prop="caseModelArea">
            <Select v-model="formData.caseModelArea" style="width:120px">
                <Option v-for="item in modelAreaData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
        <FormItem label="案例户型" prop="spaceModelTypeList">
            <CheckboxGroup v-model="formData.spaceModelTypeList">
                <Checkbox v-for="item in modelTypeData" :label="item.value" :key="item.value">{{item.label}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="是否上架">
            <RadioGroup v-model="formData.onShelf">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem v-if="isAdminPage" label="上架渠道">
            <CheckboxGroup v-model="spaceChannelSelected">
                <Checkbox v-for="item in channelData" :label="item.value" :key="item.value">{{item.label}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="案例面积">
            <InputNumber v-model="formData.spaceArea" style="width:120px"></InputNumber>㎡
        </FormItem>
        <FormItem label="关联楼盘">
            <div style="display:inline-block;"><Input v-model="buildingName" @on-focus="$refs.searchBuildingRef.showModal()" readonly placeholder="请选择关联楼盘" style="width:300px;"><Button slot="append" @click="handleCancelRelateBuilding">取消关联</Button></Input></div>
            <span v-if="building!=null" class="field-tip" style="vertical-align: top;">楼盘地址：{{building.provinceName}}{{building.cityName}}{{building.areaName}} - {{building.buildingPlace}}</span>
            <search-building ref="searchBuildingRef" :isAdminPage="isAdminPage" @on-select="handleSelectBuilding"></search-building>
        </FormItem>
        <FormItem label="关联户型">
            <Select v-model="formData.modelId" @on-change="handleSelectBuildingModel" placeholder="请选择关联户型" clearable style="width:300px;">
                <Option v-for="model in buildingModelData" :value="model.modelId" :label="model.modelName" :key="model.modelId">
                    <span>{{ model.modelName }}</span>
                    <span style="float:right; color:#9ea7b4; margin-left:8px;">{{model.modelType}}</span>
                </Option>
            </Select>
            <span v-if="buildingModel!=null" class="field-tip">户型类别：{{buildingModel.modelType}}</span>
        </FormItem>
        <FormItem label="UE4场景ID">
            <Input v-model.trim="formData.ue4SceneId" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="H5换砖DIY场景ID">
            <Input v-model.trim="formData.sceneId" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="推荐人群">
            <Input v-model.trim="formData.recommendCrowd" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="房型">
            <space-shape-select :spaceTypeId="formData.spaceTypeId" :spaceShapeId="formData.spaceShapeId" @on-change="handleChangeSpaceShape"></space-shape-select>
        </FormItem>
        <FormItem label="房型明细">
            <space-layout-select :spaceShapeId="formData.spaceShapeId" :spaceLayoutId="formData.spaceLayoutId" @on-change="handleChangeSpaceLayout" width="300px"></space-layout-select>
        </FormItem>
        <FormItem label="案例特点">
            <label-select :value="formData.spaceLabelList" :data="spaceLabelOptions" desc="案例特点"></label-select>
        </FormItem>
        <FormItem label="图片信息" required>
            <Table :columns="imgTableColumns" :data="imgTableData" :width="900" disabled-hover border></Table>
        </FormItem>
    </Form>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 底部工具栏 -->
    <div class="toolbar-footer">
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit()" style="margin-left: 16px">保 存</Button>
        <Button @click="handleBack(false)" style="margin-left: 8px">返 回</Button>
    </div>
</div>
</template>

<script>
import {
    getSpace,
    saveSpace,
    findProducts,
    listSpaceModelArea,
    listSpaceModelType,
    listSpaceChannel,
    findBuilding,
    findBuildingModel,
    getHotSpaceLabels,
    getBuilding
} from "@/api/building.js";
import uploadImg from "@/components/build/upload-img";
import labelSelect from "@/components/build/label-select";
import searchBuilding from "@/components/build/search-building";
import spaceTypeSelect from "@/components/build/space/space-type-select";
import spaceShapeSelect from "@/components/build/space/space-shape-select";
import spaceLayoutSelect from "@/components/build/space/space-layout-select";
import spaceStyleSelect from "@/components/build/space/space-style-select";

export default {
    props: {
        modelId: {
            type: String
        },
        buildingId: {
            type: String
        },
        spaceId: {
            type: String
        },
        isAdminPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                spaceId: '',
                spaceName: '',
                spaceTypeId: '',
                spaceTypeName: '',
                spaceShapeId: null,
                spaceLayoutId: null,
                styleId: '',
                styleName: '',
                caseModelArea: '',
                onShelf: null,
                spaceArea: null,
                buildingId: '',
                modelId: '',
                ue4SceneId: '',
                sceneId: '',
                recommendCrowd: '',
                spaceProductList: [],
                spaceModelTypeList: [],
                spaceChannelList: [],
                spaceLabelList: [],
                imageXgtList: [],
                image720List: [],
                imagePttList: [],
                imageSjtList: []
            },
            spaceChannelSelected: [],
            productSearch: '',
            productData: [],
            modelAreaData: [],
            modelTypeData: [],
            channelData: [],
            buildingName: '',
            building: null, // 关联楼盘对象
            buildingModel: null, // 关联户型对象
            buildingModelData: [],
            spaceLabelOptions: [],
            saveBtnDisabled: true,
            saveBtnLoading: false,
            spinShow: false,
            ruleValidate: {
                spaceName: [{
                    required: true,
                    message: "请输入案例名称",
                    trigger: "blur"
                }],
                spaceTypeId: [{
                    required: true,
                    message: "请选择案例类型"
                }],
                styleId: [{
                    required: true,
                    message: "请选择风格"
                }],
                spaceProductList: [{
                    required: true,
                    message: "请选择关联商品"
                }],
                caseModelArea: [{
                    required: true,
                    message: "请选择户型面积"
                }],
                spaceModelTypeList: [{
                    required: true,
                    message: "请选择案例户型"
                }]
            },
            spaceProductColumns: [{
                title: '商品型号',
                key: 'productModel',
                width: 150,
                align: 'center'
            }, {
                title: '商品名称',
                key: 'productName',
                width: 150,
                align: 'center'
            }, {
                title: '使用数量(片)',
                key: 'quantity',
                align: 'center',
                render: (h, params) => {
                    let currentRow = this.formData.spaceProductList[params.index];
                    return h('InputNumber', {
                        props: {
                            min: 1,
                            max: 99999,
                            precision: 0,
                            value: currentRow.quantity
                        },
                        on: {
                            'on-change'(value) {
                                currentRow.quantity = value;
                            }
                        }
                    });
                }
            }, {
                title: '操作',
                key: 'opt',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                size: 'small',
                                type: 'info'
                            },
                            on: {
                                click: () => {
                                    this.formData.spaceProductList.splice(params.index, 1);
                                }
                            }
                        }, '移除')
                    ]);
                }
            }],
            imgTableColumns: [{
                    title: '图片类型',
                    key: 'imgType',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                class: 'required-tip'
                            }, params.row.required ? '*' : ''),
                            h('span', params.row.imgType)
                        ]);
                    }
                },
                {
                    title: '选择图片上传',
                    key: 'upload',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                paddingTop: "8px"
                            }
                        }, [
                            this.$createElement(uploadImg, {
                                props: {
                                    quantity: params.row.quantity,
                                    watermark: params.row.watermark
                                },
                                ref: params.row.ref
                            })
                        ]);
                    }
                }
            ],
            imgTableData: [{
                imgType: '效果图',
                quantity: 10,
                watermark: 'true',
                ref: "uploadImgXgt"
            }, {
                imgType: '720全景',
                quantity: 1,
                watermark: 'false',
                ref: "uploadImg720"
            }, {
                imgType: '实景图',
                quantity: 10,
                watermark: 'true',
                ref: "uploadImgSjt"
            }, {
                imgType: '铺贴图',
                quantity: 10,
                watermark: 'false',
                ref: "uploadImgPtt"
            }]
        };
    },
    components: {
        uploadImg,
        labelSelect,
        searchBuilding,
        spaceTypeSelect,
        spaceShapeSelect,
        spaceLayoutSelect,
        spaceStyleSelect
    },
    created() {
        if (this.spaceId) { // 编辑
            this.fetchData(this.spaceId);
        } else { // 新增
            this.formData.onShelf = '1';
            this.saveBtnDisabled = false;
            if (this.buildingId) {
                this.fetchBuilding(this.buildingId);
            }
        }
        this.fetchSpaceModelAreaData();
        this.fetchSpaceModelTypeData();
        this.fetchSpaceChannelData();
        this.fetchSpaceLabel();
    },
    methods: {
        handleSubmit() {
            this.formData.imageXgtList = this.$refs.uploadImgXgt.getUploadList();
            this.formData.image720List = this.$refs.uploadImg720.getUploadList();
            this.formData.imagePttList = this.$refs.uploadImgPtt.getUploadList();
            this.formData.imageSjtList = this.$refs.uploadImgSjt.getUploadList();
            if (this.formData.imageXgtList == null || this.formData.image720List == null || this.formData.imagePttList == null || this.formData.imageSjtList == null) {
                return;
            }
            if (!this.formData.spaceId) {
                this.formData.dataSource = this.isAdminPage ? 1 : 4;
            }
            this.formData.spaceChannelList = [];
            this.spaceChannelSelected.forEach(channelCode => {
                for (let i = 0; i < this.channelData.length; i++) {
                    if (this.channelData[i].value == channelCode) {
                        let obj = {
                            channelCode: this.channelData[i].value,
                            channelName: this.channelData[i].label
                        };
                        this.formData.spaceChannelList.push(obj);
                        break;
                    }
                }
            });

            this.$refs["formData"].validate(valid => {
                if (!valid) {
                    return;
                }
                if (this.formData.buildingId && !this.formData.modelId) {
                    this.$Message.warning('当前案例已关联楼盘，请选择关联户型');
                    return;
                }
                if (this.formData.imageXgtList.length == 0 && this.formData.imageSjtList.length == 0) {
                    this.$Message.warning('请至少上传一张效果图或实景图');
                    return;
                }
                this.saveBtnLoading = true;
                saveSpace(this.formData).then(resp => {
                    this.saveBtnLoading = false;
                    if (resp.data.code == 200) {
                        this.$Message.success(resp.data.msg);
                        this.handleBack(true);
                    }
                });
            });
        },
        handleBack(dataChange) {
            this.$emit("back", dataChange);
        },
        handleResetForm() {
            this.saveBtnDisabled = false;
            this.formData.spaceId = '';
            this.formData.spaceName = '';
            this.formData.spaceTypeId = '';
            this.formData.spaceTypeName = '';
            this.formData.spaceShapeId = null;
            this.formData.spaceLayoutId = null;
            this.formData.styleId = '';
            this.formData.styleName = '';
            this.formData.caseModelArea = '';
            this.formData.onShelf = null;
            this.formData.spaceArea = null;
            this.formData.buildingId = '';
            this.formData.modelId = '';
            this.formData.ue4SceneId = '';
            this.formData.sceneId = '';
            this.formData.recommendCrowd = '';
            this.formData.spaceProductList = [];
            this.formData.spaceModelTypeList = [];
            this.formData.spaceChannelList = [];
            this.spaceChannelSelected = [];
            this.formData.spaceLabelList = [];
            this.formData.imageXgtList = [];
            this.formData.image720List = [];
            this.formData.imagePttList = [];
            this.formData.imageSjtList = [];
            this.productSearch = '';
            this.productData = [];
            this.buildingName = '';
            this.building = null;
            this.buildingModel = null;
            this.buildingModelData = [];
            this.$refs.uploadImgXgt.initUploadList(this.formData.imageXgtList);
            this.$refs.uploadImg720.initUploadList(this.formData.image720List);
            this.$refs.uploadImgPtt.initUploadList(this.formData.imagePttList);
            this.$refs.uploadImgSjt.initUploadList(this.formData.imageSjtList);
        },
        handleChangeSpaceType(item) {
            if (item) {
                this.formData.spaceTypeId = item.value;
                this.formData.spaceTypeName = item.label;
            } else {
                this.formData.spaceTypeId = "";
                this.formData.spaceTypeName = "";
            }
            this.formData.spaceShapeId = null;
        },
        handleChangeSpaceShape(val) {
            this.formData.spaceShapeId = val;
            this.formData.spaceLayoutId = null;
        },
        handleChangeSpaceLayout(val) {
            this.formData.spaceLayoutId = val;
        },
        handleChangeStyle(item) {
            if (item) {
                this.formData.styleId = item.value;
                this.formData.styleName = item.label;
            } else {
                this.formData.styleId = "";
                this.formData.styleName = "";
            }
        },
        handleSearchProducts(value) {
            if (value) {
                let param = {
                    productName: value
                }
                findProducts(param).then(resp => {
                    this.productData = [];
                    if (resp.data.code == 200) {
                        resp.data.data.forEach(item => {
                            this.productData.push(item);
                        });
                    }
                });
            } else {
                this.productData = [];
            }
        },
        handleSelectProducts(val) {
            if (val) {
                let arr = val.split(",");
                let productId = arr[0];
                let productModel = arr[1];
                let productName = arr[2];
                let quantity = null;
                let exists = false;
                for (let i = 0; i < this.formData.spaceProductList.length; i++) {
                    if (productId == this.formData.spaceProductList[i].productId) {
                        exists = true;
                        this.$Message.warning("该商品已添加");
                        break;
                    }
                }
                if (!exists) {
                    this.formData.spaceProductList.push({
                        productId,
                        productModel,
                        productName,
                        quantity
                    });
                }
                this.$nextTick(function () {
                    this.productSearch = '';
                });
            }
        },
        fetchSpaceModelAreaData() {
            listSpaceModelArea().then(resp => {
                if (resp.data.code == 200) {
                    this.modelAreaData = resp.data.data;
                }
            });
        },
        fetchSpaceModelTypeData() {
            listSpaceModelType().then(resp => {
                if (resp.data.code == 200) {
                    this.modelTypeData = resp.data.data;
                }
            });
        },
        fetchSpaceChannelData() {
            listSpaceChannel().then(resp => {
                if (resp.data.code == 200) {
                    this.channelData = resp.data.data;
                }
            });
        },
        handleSelectBuilding(building) {
            let buildingId = building.buildingId;
            if (this.building == null || this.building.buildingId != buildingId) {
                this.formData.buildingId = buildingId;
                this.building = building;
                this.buildingName = building.buildingName;
                this.formData.modelId = '';
                this.buildingModel = null;
                this.handleSearchBuildingModel(buildingId);
            }
        },
        handleCancelRelateBuilding() {
            this.formData.buildingId = '';
            this.formData.modelId = '';
            this.building = null;
            this.buildingModel = null;
            this.buildingName = '';
            this.buildingModelData = [];
        },
        fetchBuilding(buildingId) {
            if (buildingId) {
                let param = {
                    buildingId,
                    loadBasicInfo: true
                }
                getBuilding(param).then(resp => {
                    if (resp.data.code == 200) {
                        this.building = resp.data.data;
                        if (this.building != null) {
                            this.formData.buildingId = this.building.buildingId;
                            this.buildingName = this.building.buildingName;
                            this.handleSearchBuildingModel(this.building.buildingId);
                        }
                    }
                });
            }
        },
        handleSearchBuildingModel(buildingId) {
            let param = {
                buildingId,
                isAdminPage: this.isAdminPage,
                rows: 10000
            }
            findBuildingModel(param).then(resp => {
                this.buildingModelData = [];
                if (resp.data.code == 200) {
                    resp.data.data.list.forEach(item => {
                        this.buildingModelData.push(item);
                    });
                }
            });
        },
        handleSelectBuildingModel(val) {
            if (val) {
                this.buildingModelData.forEach(item => {
                    if (item.modelId == val) {
                        this.buildingModel = item;
                    }
                });
            } else {
                this.buildingModel = null;
            }
        },
        fetchSpaceLabel() {
            getHotSpaceLabels().then(resp => {
                if (resp.data.code == 200) {
                    this.spaceLabelOptions = resp.data.data;
                }
            });
        },
        fetchData(spaceId) {
            let params = {
                spaceId
            };
            this.spinShow = true;
            getSpace(params).then(resp => {
                if (resp.data.code == 200) {
                    let space = resp.data.data.space;
                    this.formData.spaceId = space.spaceId;
                    this.formData.spaceName = space.spaceName;
                    this.formData.spaceTypeId = space.spaceTypeId;
                    this.formData.spaceTypeName = space.spaceTypeName;
                    this.formData.spaceShapeId = space.spaceShapeId;
                    this.formData.spaceLayoutId = space.spaceLayoutId;
                    this.formData.styleId = space.styleId;
                    this.formData.styleName = space.styleName;
                    this.formData.caseModelArea = space.caseModelArea;
                    this.formData.onShelf = String(space.onShelf);
                    this.formData.spaceArea = space.spaceArea;
                    this.formData.buildingId = space.buildingId;
                    this.formData.modelId = space.modelId;
                    this.formData.ue4SceneId = space.ue4SceneId;
                    this.formData.sceneId = space.sceneId;
                    this.formData.recommendCrowd = space.recommendCrowd;
                    this.formData.spaceProductList = resp.data.data.spaceProductList;
                    this.formData.spaceModelTypeList = resp.data.data.spaceModelTypeList;
                    this.formData.spaceChannelList = resp.data.data.spaceChannelList;
                    resp.data.data.spaceChannelList.forEach(item => {
                        this.spaceChannelSelected.push(item.channelCode);
                    });
                    this.formData.spaceLabelList = resp.data.data.spaceLabelList;
                    this.formData.imageXgtList = resp.data.data.imageXgtList;
                    this.formData.image720List = resp.data.data.image720List;
                    this.formData.imagePttList = resp.data.data.imagePttList;
                    this.formData.imageSjtList = resp.data.data.imageSjtList;
                    this.building = resp.data.data.building;
                    this.buildingModel = resp.data.data.buildingModel;
                    if (this.building != null) {
                        this.buildingName = this.building.buildingName;
                        this.handleSearchBuildingModel(this.building.buildingId);
                    }
                    this.$refs.uploadImgXgt.initUploadList(this.formData.imageXgtList);
                    this.$refs.uploadImg720.initUploadList(this.formData.image720List);
                    this.$refs.uploadImgPtt.initUploadList(this.formData.imagePttList);
                    this.$refs.uploadImgSjt.initUploadList(this.formData.imageSjtList);
                    if (this.isAdminPage) {
                        this.saveBtnDisabled = false;
                    } else {
                        this.saveBtnDisabled = space.auditStatus == 1 && space.onShelf == 1;
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

.required-tip {
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
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
