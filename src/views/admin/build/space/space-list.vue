<template>
<div>
    <space-list-query id="query-wrap" :param="queryParam" displayOnShelf displayAuditStatus displayDataSource @refresh-table="handleRefreshTableData"></space-list-query>
    <space-list-button id="button-wrap" :tableData="tableData" isAdminPage @goto-edit="handleGotoEdit" @data-change="handleRefreshTableData"></space-list-button>
    <space-list-table :tableData="tableData" :queryParam="queryParam" isAdminPage @goto-edit="handleGotoEdit" @change-page="handleRefreshTableData"></space-list-table>
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
            queryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                isAdminPage: true,
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
            tableData: {
                loading: false,
                height: 400,
                total: 0,
                data: [],
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
            this.fetchData(this.queryParam, this.tableData);
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
