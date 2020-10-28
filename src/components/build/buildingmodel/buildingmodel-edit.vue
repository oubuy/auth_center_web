<template>
<div style="position:relative; padding-bottom:32px;">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="90">
        <FormItem label="楼盘名称" prop="buildingId">
            <Input v-model="formData.buildingName" :disabled="formData.modelId!=null" readonly @on-focus="$refs.searchBuildingRef.showModal()" placeholder="请选择关联楼盘" style="width:300px;"></Input>
            <search-building ref="searchBuildingRef" @on-select="handleSelectBuilding"></search-building>
        </FormItem>
        <FormItem label="户型名称" prop="modelName">
            <Input v-model.trim="formData.modelName" placeholder="请输入户型名称" style="width:300px;" clearable></Input>
            <span class="field-tip">如为客户单独调整的户型，调整命名方式为：<span style="color:#ed4014;">17栋1梯02户型-13953836216</span> 更容易辨别</span>
        </FormItem>
        <FormItem label="户型类别" prop="propertyTypeInfo">
            <Select v-model="formData.propertyType" style="width:100px">
                <Option v-for="item in ['居室', '复式', '别墅', '单身公寓']" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="formData.roomCount" placeholder="室" style="width:50px; margin-left:16px;">
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
            <upload-img ref="uploadImgRef" :quantity="1" watermark="true" :isLayout="true" :maxWidth="4000" :maxHeight="4000" style="display: inline-block; vertical-align: middle;"></upload-img>
            <span class="field-tip" style="vertical-align: middle;">户型图分辨率最大不能超过4000</span>
            <!-- <Button type="primary" @click="handleOpen3DCloud" style="display: inline-block; position:absolute; margin-left: 8px">3D云编辑</Button> -->
        </FormItem>
        <FormItem label="3D设计图">
            <upload-img ref="uploadDesignImg" :quantity="1" watermark="true"></upload-img>
        </FormItem>
        <FormItem label="是否上架">
            <RadioGroup v-model="formData.onShelf">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="房型明细">
            <div style="margin-bottom:8px;">
                <Button type="primary" @click="handleOpenSelectSpaceLayout">选择房型</Button>
                <Button @click="formData.modelSpaceList=[]" style="margin-left: 8px">移除全部</Button>
            </div>
            <Table :columns="modelSpaceColumns" :data="formData.modelSpaceList" :width="680">
                <template slot-scope="{ row, index }" slot="spaceLayoutImage">
                    <table-img v-if="row.spaceLayoutImage" :data="[row.spaceLayoutImage]"></table-img>
                </template>
            </Table>
        </FormItem>
        <FormItem label="参考均价">
            <Input v-model.trim="formData.averagePrice" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="参考总价">
            <Input v-model.trim="formData.totalPrice" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="户型解析">
            <Input v-model.trim="formData.modelDesc" type="textarea" :autosize="{minRows: 5,maxRows: 8}" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="户型特点">
            <label-select :value="formData.modelLabelList" :data="modelLabelOptions" desc="户型特点"></label-select>
        </FormItem>
    </Form>
    <!-- 选择房型明细对话框 -->
    <Modal v-model="selectSpaceModal" title="选择房型明细" draggable :width="800">
        <!-- 查询条件 -->
        <Form ref="spaceQueryForm" :model="spaceQueryForm" :label-width='80' inline>
            <FormItem label="空间类型">
                <space-type-select :spaceTypeId="spaceQueryForm.spaceTypeId" @on-change="handleChangeSpaceType"></space-type-select>
            </FormItem>
            <FormItem label="房型">
                <space-shape-select :spaceTypeId="spaceQueryForm.spaceTypeId" :spaceShapeId="spaceQueryForm.spaceShapeId" @on-change="handleChangeSpaceShape"></space-shape-select>
            </FormItem>
            <FormItem label="房型明细">
                <space-layout-select :spaceShapeId="spaceQueryForm.spaceShapeId" :spaceLayoutId="spaceQueryForm.spaceLayoutId" @on-change="handleChangeSpaceLayout"></space-layout-select>
            </FormItem>
        </Form>
        <Table :height="300" :width="768" :loading="spaceLayoutTableLoading" @on-row-click="handleClickRowSelct" :columns="spaceLayoutColumns" :data="spaceLayoutData">
            <template slot-scope="{ row, index }" slot="spaceLayoutImage">
                <table-img v-if="row.spaceLayoutImage" :data="[row.spaceLayoutImage]"></table-img>
            </template>
        </Table>
        <!-- <div style="padding-top:8px; padding-bottom:8px; text-align:right;">
            <Page :total="spaceLayoutTotal" :page-size="spaceQueryForm.rows" :current="spaceQueryForm.page" show-total show-sizer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div> -->
        <Card :bordered="false">
            <span style="color: #2db7f5;">已选房型：</span>
            <Tag type="dot" color="primary" closable @on-close="handleRemoveSpaceLayout" v-for="item in spaceLayoutSelection" :key="item.spaceLayoutId" :name="item.spaceLayoutId">{{item.spaceTypeName + "，" + item.spaceShapeName + "，" + item.spaceLayoutName}}</Tag>
        </Card>
        <div slot="footer">
            <Button type="text" size="large" @click="selectSpaceModal=false">取消</Button>
            <Button type="primary" size="large" @click="handleSelectSpaceLayoutOk">确定</Button>
        </div>
    </Modal>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 底部工具栏 -->
    <div class="toolbar-footer">
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit(true)">保存后继续添加</Button>
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit(false)" style="margin-left: 8px">保 存</Button>
        <Button @click="handleBack" style="margin-left: 8px">返 回</Button>
    </div>
</div>
</template>
<script>
import {
    getHotModelLabels,
    saveBuildingModel,
    getBuildingModel,
    get3DCloudUrl,
    getBuilding,
    findSpaceLayout
} from "@/api/building.js";
import tableImg from "@/components/build/table-img";
import uploadImg from "@/components/build/upload-img";
import labelSelect from "@/components/build/label-select";
import searchBuilding from "@/components/build/search-building";
import spaceTypeSelect from "@/components/build/space/space-type-select";
import spaceShapeSelect from "@/components/build/space/space-shape-select";
import spaceLayoutSelect from "@/components/build/space/space-layout-select";

export default {
    props: {
        modelId: {
            type: String
        },
        buildingId: {
            type: String
        },
        isCopyModel: {
            type: Boolean,
            default: false
        },
        isAdminPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const validatePropertyTypeInfo = (rule, value, callback) => {
            if (
                !this.formData.propertyType ||
                this.formData.roomCount == null ||
                this.formData.hallCount == null ||
                this.formData.bathroomCount == null ||
                this.formData.kitchenCount == null
            ) {
                callback(new Error("请选择户型类别"));
            }
            callback();
        };
        return {
            formData: {
                modelId: null,
                buildingId: null,
                buildingName: "",
                modelName: "",
                propertyType: null,
                roomCount: null,
                hallCount: null,
                bathroomCount: null,
                kitchenCount: null,
                modelArea: null,
                imageUrl: null,
                designImageUrl: null,
                designWatermarkUrl: null,
                onShelf: "",
                averagePrice: "",
                totalPrice: "",
                modelDesc: "",
                modelImage: null,
                modelLabelList: [],
                modelSpaceList: []
            },
            spaceQueryForm: {
                spaceTypeId: "",
                spaceShapeId: null,
                spaceLayoutId: null,
                rows: 10000,
                page: 1
            },
            dataChange: false,
            spaceLayoutTotal: 0,
            roomCountData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            modelLabelOptions: [], // 户型特点选项列表
            saveBtnDisabled: true,
            saveBtnLoading: false,
            spinShow: false,
            selectSpaceModal: false,
            ruleValidate: {
                buildingId: [{
                    required: true,
                    message: "请关联楼盘信息"
                }],
                modelName: [{
                    required: true,
                    message: "请输入户型名称",
                    trigger: "blur"
                }],
                modelArea: [{
                    required: true,
                    message: "请输入户型面积"
                }],
                propertyTypeInfo: [{
                    required: true,
                    validator: validatePropertyTypeInfo
                }]
            },
            modelSpaceColumns: [{
                    type: "index",
                    width: 50,
                    align: "center"
                },
                {
                    title: "房型图",
                    key: "spaceLayoutImage",
                    slot: "spaceLayoutImage",
                    align: "center",
                    width: 100
                },
                {
                    title: "空间类型",
                    key: "spaceTypeName",
                    align: "center",
                    width: 100
                },
                {
                    title: "房型",
                    key: "spaceShapeName",
                    align: "center",
                    width: 100
                },
                {
                    title: "房型明细",
                    key: "spaceLayoutName",
                    align: "center"
                },
                {
                    title: "操作",
                    key: "opt",
                    align: "center",
                    width: 100,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button", {
                                    props: {
                                        size: "small",
                                        type: "info"
                                    },
                                    on: {
                                        click: () => {
                                            this.formData.modelSpaceList.splice(params.index, 1);
                                        }
                                    }
                                },
                                "移除"
                            )
                        ]);
                    }
                }
            ],
            spaceLayoutTableLoading: false,
            spaceLayoutData: [],
            spaceLayoutSelection: [],
            spaceLayoutColumns: [{
                    title: '',
                    key: 'index',
                    width: 80,
                    align: 'center'
                }, {
                    title: "房型图",
                    key: "spaceLayoutImage",
                    slot: "spaceLayoutImage",
                    align: "center",
                    width: 100
                },
                {
                    title: "空间类型",
                    key: "spaceTypeName",
                    align: "center",
                    width: 100
                },
                {
                    title: "房型",
                    key: "spaceShapeName",
                    align: "center",
                    width: 100
                },
                {
                    title: "房型明细",
                    key: "spaceLayoutName",
                    align: "center"
                }
            ]
        };
    },
    components: {
        tableImg,
        uploadImg,
        labelSelect,
        searchBuilding,
        spaceTypeSelect,
        spaceShapeSelect,
        spaceLayoutSelect
    },
    created() {
        if (this.modelId) {
            this.fetchData(this.modelId);
        } else {
            this.formData.onShelf = "1";
            this.formData.propertyType = "居室";
            this.formData.roomCount = 1;
            this.formData.hallCount = 1;
            this.formData.bathroomCount = 1;
            this.formData.kitchenCount = 1;
            this.saveBtnDisabled = false;
        }
        this.fetchBuildingInfo(this.buildingId);
        this.fetchBuildingModelLabel();
        this.fetchSpaceLayoutData();
    },
    methods: {
        handleClickRowSelct(params) {
            for (let i = 0; i < this.spaceLayoutSelection.length; i++) {
                if (
                    this.spaceLayoutSelection[i].spaceLayoutId == params.spaceLayoutId
                ) {
                    this.$Message.warning("已选用过该房型了");
                    return;
                }
            }
            let obj = {};
            obj.spaceTypeId = params.spaceTypeId;
            obj.spaceTypeName = params.spaceTypeName;
            obj.spaceShapeId = params.spaceShapeId;
            obj.spaceShapeName = params.spaceShapeName;
            obj.spaceLayoutId = params.spaceLayoutId;
            obj.spaceLayoutImage = params.spaceLayoutImage;
            obj.spaceLayoutName = params.spaceLayoutName;
            this.spaceLayoutSelection.push(obj);
        },
        handleSubmit(continueToAdd) {
            let uploadImgList = this.$refs.uploadImgRef.getUploadList();
            let uploadDesignImgList = this.$refs.uploadDesignImg.getUploadList();
            if (uploadImgList == null || uploadDesignImgList == null) {
                return;
            }
            if (uploadImgList.length > 0) {
                this.formData.modelImage = uploadImgList[0];
                this.formData.imageUrl = uploadImgList[0].imageUrl;
            } else {
                this.formData.modelImage = null;
                this.formData.imageUrl = null;
            }
            if (uploadDesignImgList.length > 0) {
                this.formData.designImageUrl = uploadDesignImgList[0].imageUrl;
                this.formData.designWatermarkUrl = uploadDesignImgList[0].markImageUrl;
            } else {
                this.formData.designImageUrl = null;
                this.formData.designWatermarkUrl = null;
            }
            if (!this.formData.modelId) {
                this.formData.dataSource = this.isAdminPage ? 1 : 4;
            }

            this.$refs["formData"].validate(valid => {
                if (!valid) {
                    return;
                } else if (
                    this.formData.roomCount == 0 &&
                    this.formData.hallCount == 0 &&
                    this.formData.bathroomCount == 0 &&
                    this.formData.kitchenCount == 0
                ) {
                    this.$Message.warning("户型类别有误，室、厅、卫、厨个数不能全为零");
                    return;
                }
                this.saveBtnLoading = true;
                saveBuildingModel(this.formData).then(resp => {
                    this.saveBtnLoading = false;
                    if (resp.data.code == 200) {
                        this.dataChange = true;
                        this.$Message.success(resp.data.msg);
                        if (continueToAdd) {
                            this.handleResetForm(continueToAdd);
                        } else {
                            this.handleBack();
                        }
                    }
                });
            });
        },
        handleResetForm(continueToAdd) {
            // 重置户型编辑表单
            this.saveBtnDisabled = false;
            this.formData.modelId = null;
            if (!continueToAdd) {
                if (!this.buildingId) {
                    this.formData.buildingId = null;
                    this.formData.buildingName = "";
                } else {
                    this.fetchBuildingInfo(this.buildingId);
                }
            }
            this.formData.modelName = "";
            this.formData.propertyType = "居室";
            this.formData.roomCount = 1;
            this.formData.hallCount = 1;
            this.formData.bathroomCount = 1;
            this.formData.kitchenCount = 1;
            this.formData.modelArea = null;
            this.formData.modelImage = null;
            this.formData.designImageUrl = null;
            this.formData.designWatermarkUrl = null;
            this.formData.onShelf = "1";
            this.formData.averagePrice = "";
            this.formData.totalPrice = "";
            this.formData.modelDesc = "";
            this.formData.modelImage = null;
            this.formData.modelLabelList = [];
            this.formData.modelSpaceList = [];
            this.modelLabel = "";
            this.$refs.uploadImgRef.initUploadList();
            this.$refs.uploadDesignImg.initUploadList();
            this.handleResetSpaceQueryForm();
        },
        handleBack() {
            this.$emit("back", this.dataChange);
        },
        handleSelectBuilding(building) {
            this.formData.buildingId = building.buildingId;
            this.formData.buildingName = building.buildingName;
        },
        handleOpenSelectSpaceLayout() {
            this.spaceLayoutSelection = [];
            this.formData.modelSpaceList.forEach(item => {
                this.spaceLayoutSelection.push(item);
            });
            this.selectSpaceModal = true;
            this.handleResetSpaceQueryForm();
        },
        changePage(val) {
            this.spaceQueryForm.page = val;
            this.fetchSpaceLayoutData();
        },
        changePageSize(val) {
            this.spaceQueryForm.rows = val;
            this.fetchSpaceLayoutData();
        },
        handleSearchSpaceLayout() {
            this.spaceQueryForm.page = 1;
            this.fetchSpaceLayoutData();
        },
        handleResetSpaceQueryForm() {
            this.spaceQueryForm.page = 1;
            this.spaceQueryForm.spaceTypeId = "";
            this.spaceQueryForm.spaceShapeId = null;
            this.spaceQueryForm.spaceLayoutId = null;
            this.fetchSpaceLayoutData();
        },
        fetchSpaceLayoutData() {
            this.spaceLayoutTableLoading = true;
            findSpaceLayout(this.spaceQueryForm).then(resp => {
                this.spaceLayoutTableLoading = false;
                this.spaceLayoutData = [];
                this.spaceLayoutTotal = 0;
                if (resp.data.code == 200) {
                    let total = resp.data.data.total;
                    let pageNum = resp.data.data.pageNum;
                    let pageSize = resp.data.data.pageSize;
                    let index = (pageNum - 1) * pageSize + 1;
                    this.spaceLayoutTotal = total;
                    resp.data.data.list.forEach(item => {
                        item.index = index;
                        index++;
                        this.spaceLayoutData.push(item);
                    });
                }
            });
        },
        handleRemoveSpaceLayout(event, name) {
            for (let i = 0; i < this.spaceLayoutSelection.length; i++) {
                if (name == this.spaceLayoutSelection[i].spaceLayoutId) {
                    this.spaceLayoutSelection.splice(i, 1);
                    return;
                }
            }
        },
        handleSelectSpaceLayoutOk() {
            this.formData.modelSpaceList = [];
            this.spaceLayoutSelection.forEach(item => {
                this.formData.modelSpaceList.push(item);
            });
            this.selectSpaceModal = false;
        },
        handleChangeSpaceType(item) {
            if (item) {
                this.spaceQueryForm.spaceTypeId = item.value;
            } else {
                this.spaceQueryForm.spaceTypeId = "";
            }
            this.spaceQueryForm.spaceShapeId = null;
            this.fetchSpaceLayoutData();
        },
        handleChangeSpaceShape(val) {
            this.spaceQueryForm.spaceShapeId = val;
            this.spaceQueryForm.spaceLayoutId = null;
            this.fetchSpaceLayoutData();
        },
        handleChangeSpaceLayout(val) {
            this.spaceQueryForm.spaceLayoutId = val;
            this.fetchSpaceLayoutData();
        },
        handleOpen3DCloud() {
            let uploadImgList = this.$refs.uploadImgRef.getUploadList();
            this.buildingImage = null;
            if (uploadImgList.length > 0) {
                this.formData.modelImage = uploadImgList[0];
                this.formData.imageUrl = uploadImgList[0].imageUrl;
            }

            if (this.formData.modelId == null) {
                this.$Message.warning("请先保存当前户型信息，再跳转到3D云编辑");
                return;
            }
            let param = {
                imageSource: "1",
                entityId: this.formData.modelId,
                designId: this.formData.designId,
                imageUrl: this.formData.imageUrl
            };
            get3DCloudUrl(param).then(resp => {
                if (resp.data.code == 200) {
                    window.open(resp.data.data);
                }
            });
        },
        fetchBuildingModelLabel() {
            getHotModelLabels().then(resp => {
                if (resp.data.code == 200) {
                    this.modelLabelOptions = resp.data.data;
                }
            });
        },
        fetchBuildingInfo(buildingId) {
            if (!buildingId) {
                return;
            }
            let params = {
                buildingId: buildingId,
                loadBasicInfo: true
            };
            getBuilding(params).then(resp => {
                if (resp.data.code == 200) {
                    let building = resp.data.data;
                    this.formData.buildingId = building.buildingId;
                    this.formData.buildingName = building.buildingName;
                }
            });
        },
        fetchData(modelId) {
            let params = {
                modelId
            };
            this.spinShow = true;
            getBuildingModel(params).then(resp => {
                if (resp.data.code == 200) {
                    let buildingModel = resp.data.data;
                    this.formData.modelId = buildingModel.modelId;
                    this.formData.buildingId = buildingModel.buildingId;
                    this.formData.buildingName = buildingModel.buildingName;
                    this.formData.modelName = buildingModel.modelName;
                    this.formData.propertyType = buildingModel.propertyType;
                    this.formData.roomCount = buildingModel.roomCount;
                    this.formData.hallCount = buildingModel.hallCount;
                    this.formData.bathroomCount = buildingModel.bathroomCount;
                    this.formData.kitchenCount = buildingModel.kitchenCount;
                    this.formData.modelArea = buildingModel.modelArea;
                    this.formData.onShelf = String(buildingModel.onShelf);
                    this.formData.averagePrice = buildingModel.averagePrice;
                    this.formData.totalPrice = buildingModel.totalPrice;
                    this.formData.modelDesc = buildingModel.modelDesc;
                    this.formData.modelImage = buildingModel.modelImage;
                    this.formData.modelLabelList = buildingModel.modelLabelList;
                    this.formData.modelSpaceList = buildingModel.modelSpaceList;
                    this.$refs.uploadImgRef.initUploadList(buildingModel.modelImage);
                    if (buildingModel.designImageUrl) {
                        this.$refs.uploadDesignImg.initUploadList({
                            imageUrl: buildingModel.designImageUrl,
                            markImageUrl: buildingModel.designWatermarkUrl
                        });
                    }
                    if (this.isCopyModel) {
                        // 复制户型
                        this.formData.modelId = null;
                        this.formData.modelName = buildingModel.modelName + " - 副本";
                        this.saveBtnDisabled = false;
                    } else {
                        if (this.isAdminPage) {
                            this.saveBtnDisabled = false;
                        } else {
                            if (
                                buildingModel.auditStatus == 1 &&
                                buildingModel.onShelf == 1
                            ) {
                                // this.$Message.warning("本户型是公用数据，不可编辑，如需调整请复制户型进行调整！");
                                this.saveBtnDisabled = true;
                            } else {
                                this.saveBtnDisabled = false;
                            }
                        }
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
