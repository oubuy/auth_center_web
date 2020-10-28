<template>
<div>
    <model-list-query id="query-wrap" :param="queryParam" displayOnShelf displayAuditStatus displayDataSource @refresh-table="handleRefreshTableData"></model-list-query>
    <model-list-button id="button-wrap" :tableData="tableData" isAdminPage @goto-edit="handleGotoEdit" @goto-edit-programme="handleGotoEditProgramme" @data-change="handleRefreshTableData"></model-list-button>
    <model-list-table :tableData="tableData" :queryParam="queryParam" isAdminPage @goto-edit="handleGotoEdit" @change-page="handleRefreshTableData"></model-list-table>
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

export default {
    data() {
        return {
            queryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                isAdminPage: true,
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
        modelListQuery,
        modelListButton,
        modelListTable
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
            this.fetchData(this.queryParam, this.tableData);
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
                modelIds,
                isAdminPage: true
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
        },
        handleGotoEditProgramme(modelId) {
            this.$emit("goto-edit-programme", modelId);
        }
    }
}
</script>
