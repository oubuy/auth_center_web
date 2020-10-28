<template>
<div style="text-align:left;">
    <Tabs id="tabs" v-model="tabs" type="card" :animated="false">
        <TabPane name="private" label="门店数据"></TabPane>
        <TabPane name="public" label="总部数据"></TabPane>
    </Tabs>
    <div v-show="tabs=='private'">
        <space-list-query id="query-wrap-private" :param="privateQueryParam" displayOnShelf @refresh-table="fetchData(privateQueryParam, privateTableData)"></space-list-query>
        <space-list-button id="button-wrap-private" :tableData="privateTableData" @goto-edit="handleGotoEdit" @data-change="handleRefreshTableData"></space-list-button>
        <space-list-table :tableData="privateTableData" :queryParam="privateQueryParam" @goto-edit="handleGotoEdit" @change-page="fetchData(privateQueryParam, privateTableData)"></space-list-table>
    </div>
    <div v-show="tabs=='public'">
        <space-list-query id="query-wrap-public" :param="publicQueryParam" @refresh-table="fetchData(publicQueryParam, publicTableData)"></space-list-query>
        <space-list-table :tableData="publicTableData" :queryParam="publicQueryParam" @goto-edit="handleGotoEdit" @change-page="fetchData(publicQueryParam, publicTableData)"></space-list-table>
    </div>
</div>
</template>

<script>
import {
    findSpace,
    getBuildingByIds,
    getBuildingModelByIds
} from "@/api/building.js";
import spaceListQuery from "@/components/build/space/space-list-query";
import spaceListButton from "@/components/build/space/space-list-button";
import spaceListTable from "@/components/build/space/space-list-table";
import $ from 'jquery';

export default {
    data() {
        return {
            tabs: 'private',
            privateQueryParam: {
                page: 1,
                rows: 10,
                dataScope: 'private',
                spaceId: '',
                spaceName: '',
                spaceTypeId: '',
                styleId: '',
                auditStatus: '',
                onShelf: '',
                caseType: '',
                productModel: '',
                creater: '',
                isUE4: '',
                dataSource: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                createTimeStart: '',
                createTimeEnd: '',
                isRealScene: false
            },
            publicQueryParam: {
                page: 1,
                rows: 10,
                dataScope: 'public',
                spaceId: '',
                spaceName: '',
                spaceTypeId: '',
                styleId: '',
                auditStatus: '',
                onShelf: '',
                caseType: '',
                productModel: '',
                creater: '',
                isUE4: '',
                dataSource: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                createTimeStart: '',
                createTimeEnd: '',
                isRealScene: false
            },
            privateTableData: {
                loading: false,
                height: 400,
                data: [],
                total: 0,
                selection: []
            },
            publicTableData: {
                loading: false,
                height: 400,
                data: [],
                total: 0,
                selection: []
            }
        }
    },
    components: {
        spaceListQuery,
        spaceListButton,
        spaceListTable
    },
    created() {
        this.handleRefreshTableData();
    },
    mounted() {
        this.$nextTick(function () {
            let contentHeight = $('#main-content').height() - $("#tabs").outerHeight(true);
            let height = contentHeight - $("#query-wrap-private").outerHeight(true) - $("#button-wrap-private").outerHeight(true) - $("div.page-wrap").outerHeight(true);
            this.privateTableData.height = height < 400 ? 400 : height;
            height = contentHeight - $("#query-wrap-private").outerHeight(true) - $("div.page-wrap").outerHeight(true);
            this.publicTableData.height = height < 400 ? 400 : height;
        });
    },
    activated() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "楼盘案例"
            },
            {
                name: "案例管理"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        if (this.$route.query.refresh == 'true') {
            this.handleRefreshTableData();
        }
    },
    methods: {
        handleRefreshTableData() {
            this.fetchData(this.privateQueryParam, this.privateTableData);
            this.fetchData(this.publicQueryParam, this.publicTableData);
        },
        fetchData(param, tableData) {
            tableData.loading = true;
            findSpace(param).then(resp => {
                tableData.data = [];
                tableData.selection = [];
                if (resp.data.code == 200) {
                    let total = resp.data.data.total;
                    let pageNum = resp.data.data.pageNum;
                    let pageSize = resp.data.data.pageSize;
                    let index = (pageNum - 1) * pageSize + 1;
                    tableData.total = total;
                    resp.data.data.list.forEach(item => {
                        item.index = index;
                        index++;
                        tableData.data.push(item);
                    });
                    this.formatTableData(tableData);
                }
                tableData.loading = false;
            });
        },
        formatTableData(tableData) {
            if (tableData.data.length == 0) {
                return;
            }
            let buildingIds = new Set();;
            let modelIds = new Set();;
            tableData.data.forEach(item => {
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
                            tableData.data.forEach(item => {
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
                            tableData.data.forEach(item => {
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
        },
        handleGotoEdit(spaceId) {
            this.$emit("goto-edit", spaceId);
        }
    }
}
</script>
