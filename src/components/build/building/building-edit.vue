<template>
<div>
    <Tabs id="header-div" v-model="tab" type="card" :animated="false">
        <TabPane name="tab1" label="楼盘信息"></TabPane>
        <TabPane name="tab2" label="户型列表" :disabled="!buildingId"></TabPane>
        <TabPane name="tab3" label="案例列表" :disabled="!buildingId"></TabPane>
    </Tabs>
    <div>
        <building-edit-form v-show="tab=='tab1'" :buildingId="buildingId" :isAdminPage="isAdminPage" @to-edit="handleEditView" @save-success="handleSaveBuildingSuccess" @back="handleBackToBuildingList"></building-edit-form>
        <div v-show="tab=='tab2'">
            <keep-alive include="modelListView">
                <template is="modelListView" v-if="modelView=='list'">
                    <div>
                        <model-list-button :tableData="modelTableData" :isAdminPage="isAdminPage" @goto-edit="handleGotoEditModel" @goto-edit-programme="handleGotoEditProgramme" @data-change="handleRefresh(true, true, true);" style="margin-bottom:8px;"></model-list-button>
                        <model-list-table :tableData="modelTableData" :queryParam="modelQueryParam" :isAdminPage="isAdminPage" @goto-edit="handleGotoEditModel" @goto-space-list="handleGotoSpaceList" @change-page="handleQueryBuildingModel" linkToSpaceList></model-list-table>
                    </div>
                </template>
                <model-edit v-if="modelView=='edit'" :isAdminPage="isAdminPage" :buildingId="buildingId" :modelId="modelId" :isCopyModel="isCopyModel" @back="handleBackToModelList"></model-edit>
                <programme-edit is="programmeEdit" v-if="modelView=='programmeEdit'" programmeId="" :modelId="modelId" :displayAuditStatus="isAdminPage" @goto-list="handleBackToModelList"></programme-edit>
            </keep-alive>
        </div>
        <div v-show="tab=='tab3'">
            <keep-alive include="spaceListView">
                <template is="spaceListView" v-if="spaceView=='list'">
                    <div>
                        <div style="margin-bottom:16px; text-align:left;">
                            <span style="margin-right:4px;">户型</span>
                            <Select v-model="spaceQueryParam.modelId" @on-change="handleQuerySpace" clearable style="width:250px;">
                                <Option v-for="model in buildingModelList" :value="model.modelId" :label="model.modelName" :key="model.modelId">
                                    <span>{{ model.modelName }}</span>
                                    <span style="float:right; color:#9ea7b4; margin-left:8px;">{{model.modelType}}</span>
                                </Option>
                            </Select>
                        </div>
                        <space-list-button :tableData="spaceTableData" @goto-edit="handleGotoEditSpace" :isAdminPage="isAdminPage" @data-change="handleRefresh(true, false, true);"></space-list-button>
                        <space-list-table :tableData="spaceTableData" :queryParam="spaceQueryParam" :isAdminPage="isAdminPage" @goto-edit="handleGotoEditSpace" @change-page="handleQuerySpace"></space-list-table>
                    </div>
                </template>
                <space-edit v-if="spaceView=='edit'" :isAdminPage="isAdminPage" :buildingId="buildingId" :spaceId="spaceId" @back="handleBackToSpaceList"></space-edit>
            </keep-alive>
        </div>
    </div>
    <!-- 底部工具栏 -->
    <div v-show="tab=='tab2' && modelView=='list' || tab=='tab3' && spaceView=='list'" class="toolbar-footer">
        <Button @click="handleBackToBuildingList">返 回</Button>
    </div>
</div>
</template>

<script>
import {
    findBuildingModel,
    getBuildingByIds,
    getBuildingModelByIds,
    getBuildingModelSpaceCount,
    findSpace
} from "@/api/building.js";
import buildingEditForm from "@/components/build/building/building-edit-form";
import modelListButton from "@/components/build/buildingmodel/buildingmodel-list-button";
import modelListTable from "@/components/build/buildingmodel/buildingmodel-list-table";
import modelEdit from "@/components/build/buildingmodel/buildingmodel-edit";
import spaceListButton from "@/components/build/space/space-list-button";
import spaceListTable from "@/components/build/space/space-list-table";
import spaceEdit from "@/components/build/space/space-edit";
import programmeEdit from "@/components/build/programme/programme-edit";

export default {
    props: {
        isAdminPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tab: 'tab1',
            buildingId: null,
            modelId: null,
            spaceId: null,
            isCopyModel: false, // 是否复制户型
            modelQueryParam: {
                buildingId: null,
                page: 1,
                rows: 10
            },
            modelTableData: {
                data: [],
                total: 0,
                selection: [],
                loading: false
            },
            spaceQueryParam: {
                buildingId: null,
                modelId: null,
                page: 1,
                rows: 10
            },
            spaceTableData: {
                data: [],
                total: 0,
                selection: [],
                loading: false
            },
            buildingModelList: [],
            modelView: 'list',
            spaceView: 'list',
        };
    },
    components: {
        buildingEditForm,
        modelListButton,
        modelListTable,
        modelEdit,
        spaceListButton,
        spaceListTable,
        spaceEdit,
        programmeEdit
    },
    created() {
        this.tab = this.$route.query.tab || 'tab1';
        this.buildingId = this.$route.query.buildingId || '';
        if (this.buildingId) {
            this.initEditData(this.buildingId);
        }
    },
    mounted() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "楼盘案例"
            },
            {
                name: "楼盘管理"
            },
            {
                name: this.$route.query.buildingId ? "编辑" : "新增"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        this.$nextTick(function () {
            this.maxHeight = $('#main-content').height();
            this.modelTableData.height = this.maxHeight - $('#header-div').outerHeight(true) - 128;
            this.spaceTableData.height = this.maxHeight - $('#header-div').outerHeight(true) - 128 - 48;
        });
    },
    methods: {
        initEditData(buildingId) {
            this.buildingId = buildingId;
            this.modelQueryParam.buildingId = buildingId;
            this.spaceQueryParam.buildingId = buildingId;
            this.handleRefresh(true, true, true);
        },
        handleRefresh(refreshBuildingModel, refreshBuildingModelSelect, refreshSpace) {
            if (refreshBuildingModel) {
                this.handleQueryBuildingModel();
            }
            if (refreshBuildingModelSelect) {
                this.fetchBuildingModelList();
            }
            if (refreshSpace) {
                this.handleQuerySpace();
            }
        },
        handleSaveBuildingSuccess(buildingId, isAddModel) {
            if (isAddModel) {
                this.buildingId = buildingId;
                this.modelQueryParam.buildingId = buildingId;
                this.spaceQueryParam.buildingId = buildingId;
                this.tab = "tab2";
                this.handleGotoEditModel("", false);
            } else {
                this.handleBackToBuildingList();
            }
        },
        handleEditView(buildingId) {
            this.initEditData(buildingId, "tab1");
        },
        handleBackToBuildingList() { // 返回到楼盘列表
            this.$emit("goto-list", true);
        },
        handleBackToModelList(dataChange) { // 返回到户型列表Tab
            this.modelView = 'list';
            if (dataChange) {
                this.handleRefresh(true, true, true);
            }
        },
        handleBackToSpaceList(dataChange) { // 返回到案例列表Tab
            this.spaceView = 'list';
            if (dataChange) {
                this.handleRefresh(true, false, true);
            }
        },
        handleGotoSpaceList(modelId) { // 从户型Tab跳转到案例列表Tab
            this.tab = "tab3";
            this.spaceView = 'list';
            this.spaceQueryParam.modelId = modelId;
            this.handleQuerySpace();
        },
        handleGotoEditModel(modelId, isCopyModel) { // 跳转到户型编辑界面
            this.modelId = modelId || '';
            this.isCopyModel = isCopyModel;
            this.modelView = "edit";
        },
        handleGotoEditProgramme(modelId) {
            this.modelId = modelId || '';
            this.modelView = "programmeEdit";
        },
        handleGotoEditSpace(spaceId) { // 跳转到案例编辑界面
            this.spaceId = spaceId;
            this.spaceView = "edit";
        },
        handleQueryBuildingModel() { // 查询户型列表
            this.modelTableData.loading = true;
            this.modelQueryParam.isAdminPage = this.isAdminPage;
            findBuildingModel(this.modelQueryParam).then(resp => {
                this.modelTableData.data = [];
                this.modelTableData.selection = [];
                if (resp.data.code == 200) {
                    this.modelTableData.total = resp.data.data.total;
                    let total = resp.data.data.total;
                    let pageNum = resp.data.data.pageNum;
                    let pageSize = resp.data.data.pageSize;
                    let index = (pageNum - 1) * pageSize + 1;
                    resp.data.data.list.forEach(item => {
                        if (!this.isAdminPage && item.auditStatus == 1 && item.onShelf == 1) {
                            this.$set(item, '_disabled', true);
                        }
                        item.index = index;
                        index++;
                        this.modelTableData.data.push(item);
                    });
                    if (this.modelTableData.data.length > 0) {
                        let modelIds = [];
                        this.modelTableData.data.forEach(item => {
                            modelIds.push(item.modelId);
                        });
                        // 查询户型关联案例数
                        getBuildingModelSpaceCount({
                            modelIds,
                            isAdminPage: this.isAdminPage
                        }).then(resp => {
                            if (resp.data.code == 200) {
                                this.modelTableData.data.forEach(row => {
                                    for (let i = 0; i < resp.data.data.length; i++) {
                                        let item = resp.data.data[i];
                                        if (row.modelId == item.modelId) {
                                            this.$set(row, 'spaceCount', item.spaceCount);
                                        }
                                    }
                                    if (!row.spaceCount) {
                                        this.$set(row, 'spaceCount', "无案例");
                                    }
                                });
                            }
                        });
                    }
                }
                this.modelTableData.loading = false;
            });
        },
        handleQuerySpace() { // 查询案例列表
            this.spaceTableData.loading = true;
            this.spaceQueryParam.isAdminPage = this.isAdminPage;
            findSpace(this.spaceQueryParam).then(resp => {
                this.spaceTableData.data = [];
                this.spaceTableData.selection = [];
                if (resp.data.code == 200) {
                    this.spaceTableData.total = resp.data.data.total;
                    let total = resp.data.data.total;
                    let pageNum = resp.data.data.pageNum;
                    let pageSize = resp.data.data.pageSize;
                    let index = (pageNum - 1) * pageSize + 1;
                    resp.data.data.list.forEach(item => {
                        if (!this.isAdminPage && item.auditStatus == 1 && item.onShelf == 1) {
                            this.$set(item, '_disabled', true);
                        }
                        item.index = index;
                        index++;
                        this.spaceTableData.data.push(item);
                    });
                    let buildingIds = new Set();;
                    let modelIds = new Set();;
                    this.spaceTableData.data.forEach(item => {
                        if (item.buildingId) {
                            buildingIds.add(item.buildingId);
                        }
                        if (item.modelId) {
                            modelIds.add(item.modelId);
                        }
                    });
                    if (buildingIds.size > 0) {
                        getBuildingByIds({
                            buildingIds: Array.from(buildingIds)
                        }).then(resp => {
                            if (resp.data.code == 200) {
                                let list = resp.data.data;
                                if (list.length >= 0) {
                                    this.spaceTableData.data.forEach(item => {
                                        for (let i = 0; i < list.length; i++) {
                                            let building = list[i];
                                            if (building.buildingId === item.buildingId) {
                                                this.$set(item, 'buildingName', building.buildingName);
                                                break;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                    if (modelIds.size > 0) {
                        getBuildingModelByIds({
                            modelIds: Array.from(modelIds)
                        }).then(resp => {
                            if (resp.data.code == 200) {
                                let list = resp.data.data;
                                if (list.length > 0) {
                                    this.spaceTableData.data.forEach(item => {
                                        for (let i = 0; i < list.length; i++) {
                                            let buildingModel = list[i];
                                            if (buildingModel.modelId === item.modelId) {
                                                this.$set(item, 'modelName', buildingModel.modelName);
                                                break;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                this.spaceTableData.loading = false;
            });
        },
        fetchBuildingModelList() {
            if (this.buildingId) {
                let param = {
                    buildingId: this.buildingId,
                    isAdminPage: this.isAdminPage,
                    rows: 10000
                }
                findBuildingModel(param).then(resp => {
                    this.buildingModelList = [];
                    if (resp.data.code == 200) {
                        resp.data.data.list.forEach(item => {
                            this.buildingModelList.push(item);
                        });
                    }
                });
            }
        },
    }
};
</script>

<style>
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
