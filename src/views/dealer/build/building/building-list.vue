<template>
<div style="text-align:left;">
    <Tabs id="tabs" v-model="tabs" type="card" :animated="false">
        <TabPane name="private" label="门店数据"></TabPane>
        <TabPane name="public" label="总部数据"></TabPane>
    </Tabs>
    <div v-show="tabs=='private'">
        <building-list-query id="query-wrap-private" :param="privateQueryParam" displayOnShelf @refresh-table="fetchData(privateQueryParam, privateTableData)"></building-list-query>
        <building-list-button id="button-wrap-private" :tableData="privateTableData" @goto-edit="handleGotoEdit" @data-change="handleRefreshTableData"></building-list-button>
        <building-list-table :queryParam="privateQueryParam" :tableData="privateTableData" :displayAuditStatus="false" @change-page="fetchData(privateQueryParam, privateTableData)" @goto-edit="handleGotoEdit"></building-list-table>
    </div>
    <div v-show="tabs=='public'">
        <building-list-query id="query-wrap-public" :param="publicQueryParam" :displayDataSource="false" :displayOnShelf="false" @refresh-table="fetchData(publicQueryParam, publicTableData)"></building-list-query>
        <building-list-table :queryParam="publicQueryParam" :tableData="publicTableData" :displayAuditStatus="false" @change-page="fetchData(publicQueryParam, publicTableData)" @goto-edit="handleGotoEdit"></building-list-table>
    </div>
</div>
</template>

<script>
import buildingListQuery from "@/components/build/building/building-list-query";
import buildingListTable from "@/components/build/building/building-list-table";
import buildingListButton from "@/components/build/building/building-list-button";
import {
    findBuilding,
    deleteBuilding,
    onShelfBuilding,
    getBuildingModelCount,
    getBuildingSpaceCount
} from "@/api/building.js";
import $ from 'jquery';

export default {
    data() {
        return {
            tabs: 'private',
            privateQueryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                dataScope: 'private',
                buildingName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                onShelf: '',
                auditStatus: '',
                dataSource: '',
                creater: ''
            },
            publicQueryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                dataScope: 'public',
                buildingName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                onShelf: '',
                auditStatus: '',
                dataSource: '',
                creater: ''
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
        buildingListQuery,
        buildingListTable,
        buildingListButton
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
                name: "楼盘管理"
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
            findBuilding(param).then(resp => {
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
            let buildingIds = [];
            tableData.data.forEach(item => {
                buildingIds.push(item.buildingId);
                if (item.auditStatus == 1 && item.onShelf == 1) {
                    item._disabled = true;
                }
            });
            // 查询经销商楼盘户型数量
            getBuildingModelCount({
                buildingIds
            }).then(resp => {
                if (resp.data.code == 200) {
                    tableData.data.forEach(row => {
                        for (let i = 0; i < resp.data.data.length; i++) {
                            let item = resp.data.data[i];
                            if (row.buildingId == item.buildingId) {
                                this.$set(row, 'modelCount', item.modelCount);
                                break;
                            }
                        }
                        if (!row.modelCount) {
                            this.$set(row, 'modelCount', '无户型');
                        }
                    });
                }
            });
            // 查询经销商楼盘关联案例数
            getBuildingSpaceCount({
                buildingIds
            }).then(resp => {
                if (resp.data.code == 200) {
                    tableData.data.forEach(row => {
                        for (let i = 0; i < resp.data.data.length; i++) {
                            let item = resp.data.data[i];
                            if (row.buildingId == item.buildingId) {
                                this.$set(row, 'spaceCount', item.spaceCount);
                            }
                        }
                        if (!row.spaceCount) {
                            this.$set(row, 'spaceCount', '无案例');
                        }
                    });
                }
            });
        },
        handleGotoEdit(buildingId, tab) {
            this.$emit("goto-edit", buildingId, tab);
        }
    }
}
</script>
