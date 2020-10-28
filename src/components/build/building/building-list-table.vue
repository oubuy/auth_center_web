<template>
<div>
    <Table border :loading="tableData.loading" :data="tableData.data" ref="table" :height="tableData.height" @on-row-click="handleRowClick" :columns="columns" @on-selection-change="handleSelectionChange">
        <template slot-scope="{ row, index }" slot="imageUrl">
            <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
        </template>
    </Table>
    <div class="page-wrap" style="padding-top:8px; text-align:right;">
        <Page :total="tableData.total" :page-size="queryParam.rows" :current="queryParam.page" show-total show-sizer @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,80,100]"></Page>
    </div>
</div>
</template>

<script>
import tableImg from "@/components/build/table-img";

export default {
    props: {
        tableData: {
            type: Object,
            required: true
        },
        queryParam: {
            type: Object,
            required: true
        },
        displayAuditStatus: {
            type: Boolean,
            default: false
        },
        displayDataSource: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columns: [{
                    title: '',
                    key: 'index',
                    width: 80,
                    align: 'center'
                }, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '楼盘图片',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                },
                {
                    title: '楼盘名称',
                    key: 'buildingName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.handleGotoEdit(params.row.buildingId, 'tab1');
                                }
                            }
                        }, params.row.buildingName);
                    }
                },
                {
                    title: '楼盘地址',
                    key: 'buildingPlace',
                    minWidth: 200,
                    render: (h, params) => {
                        let ret = '';
                        let row = params.row;
                        if (row.provinceName) {
                            ret += row.provinceName + '/';
                        }
                        if (row.cityName) {
                            ret += row.cityName + '/';
                        }
                        if (row.areaName) {
                            ret += row.areaName + '/';
                        }
                        if (row.buildingPlace) {
                            ret += row.buildingPlace;
                        }
                        return h("span", ret);
                    }
                },
                {
                    title: '户型数',
                    key: 'modelCount',
                    width: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.handleGotoEdit(params.row.buildingId, 'tab2');
                                }
                            }
                        }, params.row.modelCount);
                    }
                },
                {
                    title: '案例数',
                    key: 'spaceCount',
                    width: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.handleGotoEdit(params.row.buildingId, 'tab3');
                                }
                            }
                        }, params.row.spaceCount);
                    }
                },
                {
                    title: '审核状态',
                    key: 'auditStatus',
                    width: 110,
                    render: (h, params) => {
                        let val = params.row.auditStatus;
                        let color = "#515a6e";
                        if (params.row.auditStatus == 0) {
                            val = '待审核';
                        } else if (params.row.auditStatus == 1) {
                            color = "#2db7f5";
                            val = '审核通过';
                        } else if (params.row.auditStatus == 2) {
                            color = "#c5c8ce";
                            val = '审核不通过';
                        }
                        return h("span", {
                            style: {
                                color: color
                            }
                        }, val);
                    }
                },
                {
                    title: '是否上架',
                    key: 'onShelf',
                    width: 110,
                    render: (h, params) => {
                        return h("span", {
                                style: {
                                    color: params.row.onShelf == 0 ? "#c5c8ce" : "#2db7f5"
                                }
                            },
                            params.row.onShelf == 0 ? "否" : "是");
                    }
                },
                {
                    title: '来源',
                    key: 'dataSource',
                    width: 110,
                    render: (h, params) => {
                        let val = '';
                        if (params.row.dataSource == 1) {
                            val = '楼盘中心';
                        } else if (params.row.dataSource == 2) {
                            val = '互联网';
                        } else if (params.row.dataSource == 3) {
                            val = '3D云设计';
                        } else if (params.row.dataSource == 4) {
                            val = '经销商后台';
                        }
                        return h("span", val);
                    }
                },
                {
                    title: '创建人',
                    key: 'creater',
                    width: 110,
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 110,
                    render: (h, params) => {
                        return h("span", params.row.createTime == null ? "" : params.row.createTime.substr(0, 10));
                    }
                },
                {
                    title: '更新人',
                    key: 'updator',
                    width: 110,
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    width: 110,
                    render: (h, params) => {
                        return h("span", params.row.updateTime == null ? "" : params.row.updateTime.substr(0, 10));
                    }
                }
            ]
        }
    },
    components: {
        tableImg
    },
    created() {
        if (!this.displayAuditStatus) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].key == 'auditStatus') {
                    this.columns.splice(i, 1);
                    break;
                }
            }
        }
        if (!this.displayDataSource) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].key == 'dataSource') {
                    this.columns.splice(i, 1);
                    break;
                }
            }
        }
    },
    methods: {
        handleSelectionChange(selection) {
            this.tableData.selection = selection;
        },
        handleRowClick(value, index) {
            this.$refs.table.toggleSelect(index);
        },
        changePage(val) {
            this.queryParam.page = val;
            this.$emit("change-page");
        },
        changePageSize(val) {
            this.queryParam.rows = val;
            this.$emit("change-page");
        },
        handleGotoEdit(buildingId, tab) {
            this.$emit("goto-edit", buildingId, tab);
        }
    }
}
</script>
