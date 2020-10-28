<template>
<div style="text-align:left;">
    <building-list-query id="query-wrap" :param="queryParam" @refresh-table="fetchData(queryParam, tableData)" displayOnShelf displayAuditStatus displayDataSource></building-list-query>
    <building-list-button id="button-wrap" :tableData="tableData" @goto-edit="handleGotoEdit" @data-change="handleRefreshTableData" isAdminPage></building-list-button>
    <building-list-table :queryParam="queryParam" :tableData="tableData" @change-page="handleRefreshTableData" @goto-edit="handleGotoEdit" displayAuditStatus displayDataSource></building-list-table>
</div>
</template>

<script>
import buildingListQuery from "@/components/build/building/building-list-query";
import buildingListTable from "@/components/build/building/building-list-table";
import buildingListButton from "@/components/build/building/building-list-button";
import {
    findBuilding,
    getBuildingModelCount,
    getBuildingSpaceCount
} from "@/api/building.js";

export default {
    data() {
        return {
            tabs: 'private',
            queryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                isAdminPage: true,
                buildingName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                onShelf: '',
                auditStatus: '',
                dataSource: '',
                creater: ''
            },
            tableData: {
                loading: false,
                height: 400,
                data: [],
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
            let height = $('#main-content').height() - $("#query-wrap").outerHeight(true) - $("#button-wrap").outerHeight(true) - $("div.page-wrap").outerHeight(true);
            this.tableData.height = height < 400 ? 400 : height;
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
            this.fetchData(this.queryParam, this.tableData);
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
            });
            // 查询经销商楼盘户型数量
            getBuildingModelCount({
                buildingIds,
                isAdminPage: true
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
                buildingIds,
                isAdminPage: true
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
