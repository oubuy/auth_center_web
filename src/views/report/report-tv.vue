<template>
<div>
    <Tabs v-model="tabs" type="card" :animated="false" @on-click="handleTabsClick">
        <TabPane name="productHits" label="产品访问量排行"></TabPane>
        <TabPane name="spaceHits" label="案例访问量排行"></TabPane>
        <TabPane name="buildingHits" label="楼盘访问量排行"></TabPane>
        <TabPane name="modelHits" label="户型访问量排行"></TabPane>
        <TabPane name="storeActivity" label="门店活跃度排行"></TabPane>
    </Tabs>
    <div v-show="tabs=='productHits'">
        <report-query :param="productParam" @on-search="queryProductHits(productParam, productTable)"></report-query>
        <report-table-product :tableData="productTable"></report-table-product>
    </div>
    <div v-show="tabs=='spaceHits'">
        <report-query :param="spaceParam" @on-search="querySpaceHits(spaceParam, spaceTable)"></report-query>
        <report-table-space :tableData="spaceTable"></report-table-space>
    </div>
    <div v-show="tabs=='buildingHits'">
        <report-query :param="buildingParam" @on-search="queryBuildingHits(buildingParam, buildingTable)"></report-query>
        <report-table-building :tableData="buildingTable"></report-table-building>
    </div>
    <div v-show="tabs=='modelHits'">
        <report-query :param="modelParam" @on-search="queryBuildingModelHits(modelParam, modelTable)"></report-query>
        <report-table-model :tableData="modelTable"></report-table-model>
    </div>
    <div v-show="tabs=='storeActivity'">
        <report-query :param="storeParam" @on-search="queryStoreActivity(storeParam, storeTable)"></report-query>
        <report-table-store :tableData="storeTable"></report-table-store>
    </div>
</div>
</template>

<script>
import {
    queryProductHits,
    querySpaceHits,
    queryBuildingHits,
    queryBuildingModelHits,
    queryStoreActivity
} from "@/api/report.js";
import reportQuery from "@/views/report/report-query";
import reportTableSpace from "@/views/report/report-table-space";
import reportTableProduct from "@/views/report/report-table-product";
import reportTableBuilding from "@/views/report/report-table-building";
import reportTableModel from "@/views/report/report-table-buildingmodel";
import reportTableStore from "@/views/report/report-table-store";

export default {
    data() {
        return {
            tabs: "productHits",
            tabsClick: [],
            spaceParam: {
                dateRange: [],
                pageSize: 8
            },
            spaceTable: {
                loading: false,
                data: []
            },
            productParam: {
                dateRange: [],
                pageSize: 8
            },
            productTable: {
                loading: false,
                data: []
            },
            buildingParam: {
                dateRange: [],
                pageSize: 8
            },
            buildingTable: {
                loading: false,
                data: []
            },
            modelParam: {
                dateRange: [],
                pageSize: 8
            },
            modelTable: {
                loading: false,
                data: []
            },
            storeParam: {
                dateRange: [],
                pageSize: 10
            },
            storeTable: {
                loading: false,
                data: []
            }
        }
    },
    components: {
        reportQuery,
        reportTableSpace,
        reportTableProduct,
        reportTableBuilding,
        reportTableModel,
        reportTableStore
    },
    created() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "交互大屏报表"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setTime(startDate.getTime() - 3600 * 1000 * 24 * 7);
        let start = this.dateFormat("YYYY-mm-dd", startDate);
        let end = this.dateFormat("YYYY-mm-dd", endDate);
        this.productParam.dateRange = [start, end];
        this.spaceParam.dateRange = [start, end];
        this.buildingParam.dateRange = [start, end];
        this.modelParam.dateRange = [start, end];
        this.storeParam.dateRange = [start, end];
        this.handleTabsClick('productHits');
    },
    methods: {
        queryProductHits(queryParam, table) {
            if (queryParam.dateRange.length != 2 || !queryParam.dateRange[0]) {
                this.$Message.warning('请选择日期范围');
                return;
            }
            table.loading = true;
            let param = {
                dateStart: queryParam.dateRange[0],
                dateEnd: queryParam.dateRange[1],
                pageSize: queryParam.pageSize
            };
            queryProductHits(param).then(resp => {
                table.data = [];
                if (resp.data.code == 200) {
                    resp.data.data.forEach(item => {
                        table.data.push(item);
                    });
                }
                table.loading = false;
            });
        },
        querySpaceHits(queryParam, table) {
            if (queryParam.dateRange.length != 2 || !queryParam.dateRange[0]) {
                this.$Message.warning('请选择日期范围');
                return;
            }
            table.loading = true;
            let param = {
                dateStart: queryParam.dateRange[0],
                dateEnd: queryParam.dateRange[1],
                pageSize: queryParam.pageSize
            };
            querySpaceHits(param).then(resp => {
                table.data = [];
                if (resp.data.code == 200) {
                    resp.data.data.forEach(item => {
                        table.data.push(item);
                    });
                }
                table.loading = false;
            });
        },
        queryBuildingHits(queryParam, table) {
            if (queryParam.dateRange.length != 2 || !queryParam.dateRange[0]) {
                this.$Message.warning('请选择日期范围');
                return;
            }
            table.loading = true;
            let param = {
                dateStart: queryParam.dateRange[0],
                dateEnd: queryParam.dateRange[1],
                pageSize: queryParam.pageSize
            };
            queryBuildingHits(param).then(resp => {
                table.data = [];
                if (resp.data.code == 200) {
                    resp.data.data.forEach(item => {
                        table.data.push(item);
                    });
                }
                table.loading = false;
            });
        },
        queryBuildingModelHits(queryParam, table) {
            if (queryParam.dateRange.length != 2 || !queryParam.dateRange[0]) {
                this.$Message.warning('请选择日期范围');
                return;
            }
            table.loading = true;
            let param = {
                dateStart: queryParam.dateRange[0],
                dateEnd: queryParam.dateRange[1],
                pageSize: queryParam.pageSize
            };
            queryBuildingModelHits(param).then(resp => {
                table.data = [];
                if (resp.data.code == 200) {
                    resp.data.data.forEach(item => {
                        table.data.push(item);
                    });
                }
                table.loading = false;
            });
        },
        queryStoreActivity(queryParam, table) {
            if (queryParam.dateRange.length != 2 || !queryParam.dateRange[0]) {
                this.$Message.warning('请选择日期范围');
                return;
            }
            table.loading = true;
            let param = {
                dateStart: queryParam.dateRange[0],
                dateEnd: queryParam.dateRange[1],
                pageSize: queryParam.pageSize
            };
            queryStoreActivity(param).then(resp => {
                table.data = [];
                if (resp.data.code == 200) {
                    resp.data.data.forEach(item => {
                        table.data.push(item);
                    });
                }
                table.loading = false;
            });
        },
        handleTabsClick(name) {
            if (name == "productHits") {
                if (this.tabsClick.indexOf(name) == -1) {
                    this.queryProductHits(this.productParam, this.productTable);
                    this.tabsClick.push(name);
                }
            } else if (name == "spaceHits") {
                if (this.tabsClick.indexOf(name) == -1) {
                    this.querySpaceHits(this.spaceParam, this.spaceTable);
                    this.tabsClick.push(name);
                }
            } else if (name == "buildingHits") {
                if (this.tabsClick.indexOf(name) == -1) {
                    this.queryBuildingHits(this.buildingParam, this.buildingTable);
                    this.tabsClick.push(name);
                }
            } else if (name == "modelHits") {
                if (this.tabsClick.indexOf(name) == -1) {
                    this.queryBuildingModelHits(this.modelParam, this.modelTable);
                    this.tabsClick.push(name);
                }
            } else if (name == "storeActivity") {
                if (this.tabsClick.indexOf(name) == -1) {
                    this.queryStoreActivity(this.storeParam, this.storeTable);
                    this.tabsClick.push(name);
                }
            }
        },
        dateFormat(fmt, date) {
            let ret;
            const opt = {
                "Y+": date.getFullYear().toString(), // 年
                "m+": (date.getMonth() + 1).toString(), // 月
                "d+": date.getDate().toString(), // 日
                "H+": date.getHours().toString(), // 时
                "M+": date.getMinutes().toString(), // 分
                "S+": date.getSeconds().toString() // 秒
                // 有其他格式化字符需求可以继续添加，必须转化成字符串
            };
            for (let k in opt) {
                ret = new RegExp("(" + k + ")").exec(fmt);
                if (ret) {
                    fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
                };
            };
            return fmt;
        }
    }
}
</script>
