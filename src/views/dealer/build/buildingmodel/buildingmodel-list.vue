<template>
<div style="text-align:left;">
    <Tabs id="tabs" v-model="tabs" type="card" :animated="false">
        <TabPane name="private" label="门店数据"></TabPane>
        <TabPane name="public" label="总部数据"></TabPane>
    </Tabs>
    <div v-show="tabs=='private'">
        <model-list-query id="query-wrap-private" :param="privateQueryParam" displayOnShelf @refresh-table="fetchData(privateQueryParam, privateTableData)"></model-list-query>
        <model-list-button id="button-wrap-private" :tableData="privateTableData" @goto-edit="handleGotoEdit" @data-change="handleRefreshTableData"></model-list-button>
        <model-list-table :tableData="privateTableData" :queryParam="privateQueryParam" @goto-edit="handleGotoEdit" @change-page="fetchData(privateQueryParam, privateTableData)"></model-list-table>
    </div>
    <div v-show="tabs=='public'">
        <model-list-query id="query-wrap-public" :param="publicQueryParam" @refresh-table="fetchData(publicQueryParam, publicTableData)"></model-list-query>
        <model-list-table :tableData="publicTableData" :queryParam="publicQueryParam" @goto-edit="handleGotoEdit" @change-page="fetchData(publicQueryParam, publicTableData)"></model-list-table>
    </div>
</div>
</template>

<script>
import {
    findBuildingModel,
    getBuildingModelSpaceCount
} from "@/api/building.js";
import modelListQuery from "@/components/build/buildingmodel/buildingmodel-list-query";
import modelListButton from "@/components/build/buildingmodel/buildingmodel-list-button";
import modelListTable from "@/components/build/buildingmodel/buildingmodel-list-table";
import $ from 'jquery';

export default {
    data() {
        return {
            tabs: 'private',
            privateQueryParam: {
                page: 1,
                rows: 10,
                dataScope: 'private',
                modelName: '',
                buildingName: '',
                onShelf: '',
                auditStatus: '',
                roomCount: null,
                hallCount: null,
                bathroomCount: null,
                kitchenCount: null,
                provinceId: '',
                cityId: '',
                areaId: '',
                is3DModel: '',
                creater: '',
                updator: '',
                dataSource: '',
                createTimeStart: '',
                createTimeEnd: ''
            },
            publicQueryParam: {
                page: 1,
                rows: 10,
                dataScope: 'public',
                modelName: '',
                buildingName: '',
                onShelf: '',
                auditStatus: '',
                roomCount: null,
                hallCount: null,
                bathroomCount: null,
                kitchenCount: null,
                provinceId: '',
                cityId: '',
                areaId: '',
                is3DModel: '',
                creater: '',
                updator: '',
                dataSource: '',
                createTimeStart: '',
                createTimeEnd: ''
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
        modelListQuery,
        modelListButton,
        modelListTable
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
                name: "户型管理"
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
            findBuildingModel(param).then(resp => {
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
            let modelIds = [];
            tableData.data.forEach(item => {
                modelIds.push(item.modelId);
            });
            // 查询户型关联案例数
            getBuildingModelSpaceCount({
                modelIds
            }).then(resp => {
                if (resp.data.code == 200) {
                    tableData.data.forEach(row => {
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
        },
        handleGotoEdit(modelId, isCopyModel) {
            this.$emit("goto-edit", modelId, isCopyModel);
        }
    }
}
</script>
