<template>
<div style="position:relative; padding-bottom:32px; text-align:left;">
    <Form ref="formData" :model="formData" :label-width="110">
        <FormItem label="方案名称" required>
            <Input v-model.trim="formData.programmeName" placeholder="请输入方案名称" style="width:300px;" clearable></Input>
        </FormItem>
        <FormItem label="关联楼盘">
            <div style="display:inline-block;"><Input v-model="buildingName" @on-focus="$refs.searchBuildingRef.showModal()" readonly placeholder="请选择关联楼盘" style="width:300px;"><Button slot="append" @click="handleCancelRelateBuilding">取消关联</Button></Input></div>
            <span v-if="building!=null" class="field-tip" style="vertical-align: top;">楼盘地址：{{building.provinceName}}{{building.cityName}}{{building.areaName}} - {{building.buildingPlace}}</span>
            <search-building ref="searchBuildingRef" :isAdminPage="displayAuditStatus" @on-select="handleSelectBuilding"></search-building>
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
        <FormItem label="方案主图" required>
            <div style="margin-bottom:8px;">
                <Button @click="handleUseImage(0)" style="width:100px;">使用户型图</Button>
                <Button @click="handleUseImage(1)" style="width:100px; margin-left:8px;">使用3D设计图</Button>
            </div>
            <upload-img ref="uploadImgRef" :quantity="1"></upload-img>
        </FormItem>
        <FormItem v-if="displayAuditStatus" label="审核通过">
            <RadioGroup v-model="formData.auditStatus">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否上架">
            <RadioGroup v-model="formData.onShelf">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="全屋720">
            <Input v-model.trim="formData.panoramaUrl" placeholder="请输入3D云设计的720全屋场景链接" style="width:300px;" clearable></Input>
        </FormItem>
    </Form>
    <Card dis-hover>
        <p slot="title">空间</p>
        <div style="margin-bottom:8px;">
            <Button type="primary" @click="spaceModal=true">添加</Button>
        </div>
        <Table :data="spaceList" :columns="spaceColumns">
            <template slot-scope="{ row, index }" slot="imageUrl">
                <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
            </template>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="warning" size="small" @click="removeTableRow(index)">移除</Button>
            </template>
        </Table>
    </Card>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 底部工具栏 -->
    <div class="toolbar-footer">
        <Button type="primary" :loading="saveBtnLoading" :disabled="saveBtnDisabled" @click="handleSubmit" style="margin-left: 16px">保 存</Button>
        <Button @click="handleBack(false)" style="margin-left: 8px">返 回</Button>
    </div>
    <programme-space-select :modal.sync="spaceModal" :selection="spaceList" :isAdminPage="displayAuditStatus"></programme-space-select>
</div>
</template>

<script>
import {
    getProgramme,
    findBuildingModel,
    saveProgramme,
    getBuilding,
    getBuildingModel
} from "@/api/building.js";
import searchBuilding from "@/components/build/search-building";
import uploadImg from "@/components/build/upload-img";
import tableImg from "@/components/build/table-img";
import programmeSpaceSelect from "@/components/build/programme/programme-space-select";

export default {
    props: {
        programmeId: {
            type: String,
            default: ''
        },
        modelId: {
            type: String
        },
        displayAuditStatus: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                programmeId: '',
                programmeName: '',
                modelId: '',
                imageUrl: '',
                auditStatus: '',
                onShelf: '',
                panoramaUrl: ''
            },
            building: null, // 关联楼盘对象
            buildingModel: null, // 关联户型对象
            buildingName: '',
            buildingModelData: [],
            spinShow: false,
            saveBtnDisabled: true,
            saveBtnLoading: false,
            spaceModal: false,
            spaceList: [],
            spaceColumns: [{
                    title: '编号',
                    key: 'spaceId',
                    align: 'center',
                    width: 100
                },
                {
                    title: '案例名称',
                    key: 'spaceName',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '效果图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                },
                {
                    title: '空间类型',
                    key: 'spaceTypeName',
                    align: 'center',
                },
                {
                    title: '风格',
                    key: 'styleName',
                    align: 'center',
                },
                {
                    title: '审核状态',
                    key: 'auditStatus',
                    align: 'center',
                    render: (h, params) => {
                        let val = '';
                        if (params.row.auditStatus == 0) {
                            val = '待审核';
                        } else if (params.row.dataSource == 1) {
                            val = '审核通过';
                        } else if (params.row.dataSource == 2) {
                            val = '审核不通过';
                        }
                        return h("span", val);
                    }
                },
                {
                    title: '是否上架',
                    key: 'onShelf',
                    align: 'center',
                    render: (h, params) => {
                        return h("span", {
                                style: {
                                    color: params.row.onShelf == 0 ? "#c5c8ce" : "#2db7f5"
                                }
                            },
                            params.row.onShelf == 0 ? "否" : "是");
                    }
                },
                {
                    title: '来源',
                    key: 'dataSource',
                    align: 'center',
                    render: (h, params) => {
                        let val = '';
                        if (params.row.dataSource == 1) {
                            val = '楼盘中心';
                        } else if (params.row.dataSource == 2) {
                            val = '互联网';
                        } else if (params.row.dataSource == 3) {
                            val = '3D云设计';
                        } else if (params.row.dataSource == 4) {
                            val = '经销商后台';
                        } else if (params.row.dataSource == 5) {
                            val = 'UE4程序';
                        } else if (params.row.dataSource == 6) {
                            val = '换砖DIY';
                        }
                        return h("span", val);
                    }
                },
                {
                    title: '创建人',
                    key: 'creater',
                    align: 'center'
                },
                {
                    title: '创建日期',
                    key: 'createTime',
                    align: 'center',
                    render: (h, params) => {
                        return h("span", params.row.createTime == null ? "" : params.row.createTime.substr(0, 10));
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    width: 100
                }
            ]
        }
    },
    components: {
        searchBuilding,
        uploadImg,
        programmeSpaceSelect,
        tableImg
    },
    created() {
        if (this.programmeId) {
            this.fetchData(this.programmeId);
        } else {
            this.saveBtnDisabled = false;
            this.formData.onShelf = '1';
            if (this.displayAuditStatus) {
                this.formData.auditStatus = '1';
            }
            if (this.modelId) {
                this.formData.modelId = this.modelId;
                this.fetchBuildingModelInfo(this.modelId);
            }
        }
    },
    methods: {
        fetchData(programmeId) {
            let params = {
                programmeId
            };
            this.spinShow = true;
            getProgramme(params).then(resp => {
                if (resp.data.code == 200) {
                    let programme = resp.data.data.programme;
                    this.formData.programmeId = programme.programmeId;
                    this.formData.programmeName = programme.programmeName || '';
                    this.formData.modelId = programme.modelId || '';
                    this.formData.imageUrl = programme.imageUrl || '';
                    this.formData.auditStatus = String(programme.auditStatus);
                    this.formData.onShelf = String(programme.onShelf);
                    this.formData.panoramaUrl = programme.panoramaUrl || '';
                    this.spaceList = resp.data.data.spaceList;
                    this.building = resp.data.data.building;
                    this.buildingModel = resp.data.data.buildingModel;
                    if (this.building != null) {
                        this.buildingName = this.building.buildingName;
                        this.handleSearchBuildingModel(this.building.buildingId);
                    }
                    if (programme.imageUrl) {
                        this.$refs.uploadImgRef.initUploadList(programme);
                    }
                    if (this.displayAuditStatus) {
                        this.saveBtnDisabled = false;
                    } else {
                        this.saveBtnDisabled = programme.auditStatus == 1 && programme.onShelf == 1;
                    }
                }
                this.spinShow = false;
            });
        },
        handleSubmit() {
            if (!this.formData.programmeName) {
                this.$Message.warning('请输入方案名称');
                return;
            }

            if (this.building != null && this.buildingModel == null) {
                this.$Message.warning('当前方案已关联楼盘，请选择关联户型');
                return;
            }

            let uploadImgList = this.$refs.uploadImgRef.getUploadList();
            if (uploadImgList == null) {
                return;
            }
            if (uploadImgList.length == 0) {
                this.$Message.warning('请选用或上传方案主图');
                return;
            }
            this.formData.imageUrl = uploadImgList[0].imageUrl;
            this.formData.programmeSpaceList = [];
            this.spaceList.forEach(item => {
                this.formData.programmeSpaceList.push({
                    spaceId: item.spaceId
                });
            });
            if (!this.formData.programmeId) {
                this.formData.dataSource = this.displayAuditStatus ? 1 : 4;
            }

            this.saveBtnLoading = true;
            saveProgramme(this.formData).then(resp => {
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                    this.handleBack(true);
                } else {
                    this.saveBtnLoading = false;
                }
            });
        },
        handleBack(refresh) {
            this.$emit("goto-list", refresh);
        },
        handleSelectBuilding(building) {
            let buildingId = building.buildingId;
            if (this.building == null || this.building.buildingId != buildingId) {
                this.building = building;
                this.buildingName = building.buildingName;
                this.formData.modelId = '';
                this.buildingModel = null;
                this.handleSearchBuildingModel(buildingId);
            }
        },
        handleCancelRelateBuilding() {
            this.building = null;
            this.buildingModel = null;
            this.buildingName = '';
            this.buildingModelData = [];
            this.formData.modelId = '';
        },
        handleSearchBuildingModel(buildingId) {
            let param = {
                isAdminPage: this.displayAuditStatus,
                buildingId: buildingId,
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
        handleUseImage(type) {
            if (this.buildingModel == null) {
                this.$Message.warning('请先选择关联楼盘与户型');
                return;
            }
            if (type == 0 && !this.buildingModel.imageUrl) {
                this.$Message.warning('户型图不存在');
                return;
            }
            if (type == 1 && !this.buildingModel.designImageUrl) {
                this.$Message.warning('3D设计图不存在');
                return;
            }
            let image = {
                imageUrl: type == 0 ? this.buildingModel.imageUrl : this.buildingModel.designImageUrl
            };
            this.$refs.uploadImgRef.initUploadList(image);
        },
        removeTableRow(index) {
            this.spaceList.splice(index, 1);
        },
        handleSelectSpace(val) {
            this.spaceList = val;
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
                    this.building = resp.data.data;
                    this.buildingName = this.building.buildingName;
                    this.handleSearchBuildingModel(this.building.buildingId);
                }
            });
        },
        fetchBuildingModelInfo(modelId) {
            if (!modelId) {
                return;
            }
            let params = {
                modelId: modelId,
                loadBasicInfo: true
            };
            getBuildingModel(params).then(resp => {
                if (resp.data.code == 200) {
                    this.buildingModel = resp.data.data;
                    this.fetchBuildingInfo(this.buildingModel.buildingId);
                }
            });
        }
    }
}
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
