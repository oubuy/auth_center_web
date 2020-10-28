<template>
<div style="text-align:left;">
    <Tabs id="tabs" v-model="tabs" type="card" :animated="false">
        <TabPane name="private" label="门店数据"></TabPane>
        <TabPane name="public" label="总部数据"></TabPane>
    </Tabs>
    <div v-show="tabs=='private'">
        <programme-list-query id="query-wrap-private" :param="privateQueryParam" :displayDataSource="false" @refresh-table="fetchData(privateQueryParam, privateTableData)"></programme-list-query>
        <programme-list-button id="button-wrap-private" :tableData="privateTableData" @goto-edit="handleGotoEdit" @data-change="fetchData(privateQueryParam, privateTableData)"></programme-list-button>
        <programme-list-table :queryParam="privateQueryParam" :tableData="privateTableData" :displayAuditStatus="false" @change-page="fetchData(privateQueryParam, privateTableData)" @goto-edit="handleGotoEdit"></programme-list-table>
    </div>
    <div v-show="tabs=='public'">
        <programme-list-query id="query-wrap-public" :param="publicQueryParam" :displayDataSource="false" :displayOnShelf="false" @refresh-table="fetchData(publicQueryParam, publicTableData)"></programme-list-query>
        <programme-list-table :queryParam="publicQueryParam" :tableData="publicTableData" :displayAuditStatus="false" @change-page="fetchData(publicQueryParam, publicTableData)" @goto-edit="handleGotoEdit"></programme-list-table>
    </div>
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
            privateQueryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                dataScope: 'private',
                keyword: '',
                onShelf: '',
                dataSource: '',
                sceneType: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                creater: ''
            },
            publicQueryParam: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                dataScope: 'public',
                keyword: '',
                onShelf: '',
                dataSource: '',
                sceneType: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                creater: ''
            },
            privateTableData: {
                loading: false,
                height: 400,
                data: [],
                selection: []
            },
            publicTableData: {
                loading: false,
                height: 400,
                data: [],
                total: 0,
                selection: []
            },
            onShelfBtnLoading: false,
            lowerShelfBtnLoading: false,
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
            let contentHeight = $('#main-content').height() - $("#tabs").outerHeight(true);
            this.privateTableData.height = contentHeight - $("#query-wrap-private").outerHeight(true) - $("#button-wrap-private").outerHeight(true) - $("div.page-wrap").outerHeight(true);
            this.publicTableData.height = contentHeight - $("#query-wrap-private").outerHeight(true) - $("div.page-wrap").outerHeight(true);
            if (this.privateTableData.height < 400) {
                this.privateTableData.height = 400;
            }
            if (this.publicTableData.height < 400) {
                this.publicTableData.height = 400;
            }
        });
    },
    activated() {
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
