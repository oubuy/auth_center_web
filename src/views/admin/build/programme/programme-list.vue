<template>
<div style="text-align:left;">
    <programme-list-query id="query-wrap" :param="queryParam" @refresh-table="fetchData(queryParam, tableData)"></programme-list-query>
    <programme-list-button id="button-wrap" :tableData="tableData" isAdminPage @goto-edit="handleGotoEdit" @data-change="handleRefreshTableData"></programme-list-button>
    <programme-list-table :queryParam="queryParam" :tableData="tableData" @change-page="handleRefreshTableData" @goto-edit="handleGotoEdit"></programme-list-table>
</div>
</template>

<script>
import programmeListQuery from "@/components/build/programme/programme-list-query";
import programmeListButton from "@/components/build/programme/programme-list-button";
import programmeListTable from "@/components/build/programme/programme-list-table";
import {
    findProgrammeForDealer
} from "@/api/building.js";

export default {
    data() {
        return {
            tabs: 'private',
            queryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                isAdminPage: true,
                keyword: '',
                onShelf: '',
                dataSource: '',
                sceneType: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                creater: ''
            },
            tableData: {
                loading: false,
                height: 500,
                total: 0,
                data: [],
                selection: []
            },
            onShelfBtnLoading: false,
            lowerShelfBtnLoading: false,
            auditPassBtnLoading: false,
            auditNoPassBtnLoading: false,
            deleteBtnLoading: false
        }
    },
    components: {
        programmeListQuery,
        programmeListButton,
        programmeListTable
    },
    created() {
        this.handleRefreshTableData();
    },
    mounted() {
        this.$nextTick(function () {
            this.tableData.height = $('#main-content').height() - $("#query-wrap").outerHeight(true) - $("#button-wrap").outerHeight(true) - $("div.page-wrap").outerHeight(true);
        });
    },
    activated() {
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
            findProgrammeForDealer(param).then(resp => {
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
                }
                tableData.loading = false;
            });
        },
        handleGotoEdit(programmeId) {
            this.$emit("goto-edit", programmeId);
        }
    }
}
</script>
