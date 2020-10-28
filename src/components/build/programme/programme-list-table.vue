<template>
<div>
    <Table border :loading="tableData.loading" :data="tableData.data" ref="table" @on-row-click="handleRowClick" :height="tableData.height" :columns="columns" @on-selection-change="handleSelectionChange">
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
import {
    onShelfSpace,
    cancelRelateBuildingModel,
    deleteSpace,
    getXgtImages
} from "@/api/building.js";
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
            default: true
        }
    },
    components: {
        tableImg
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
                    title: '方案主图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                },
                {
                    title: '方案名称',
                    key: 'programmeName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.handleGotoEdit(params.row.programmeId);
                                }
                            }
                        }, params.row.programmeName);
                    }
                },
                {
                    title: '楼盘',
                    key: 'buildingName',
                    minWidth: 150
                },
                {
                    title: '户型',
                    key: 'modelName',
                    minWidth: 150
                },
                {
                    title: '全屋720',
                    key: 'panoramaUrl',
                    width: 100,
                    render: (h, params) => {
                        return h("span", params.row.panoramaUrl ? "是" : "否");
                    }
                },
                {
                    title: '空间数',
                    key: 'spaceCount',
                    width: 100,
                    render: (h, params) => {
                        return h("span", params.row.spaceCount == 0 ? "--" : params.row.spaceCount);
                    }
                },
                {
                    title: '来源',
                    key: 'dataSource',
                    width: 100,
                    render: (h, params) => {
                        let val = '';
                        if (params.row.dataSource == 1) {
                            val = '楼盘中心';
                        } else if (params.row.dataSource == 3) {
                            val = '3D云设计';
                        } else if (params.row.dataSource == 4) {
                            val = '经销商后台';
                        }
                        return h("span", val);
                    }
                },
                {
                    title: '审核状态',
                    key: 'auditStatus',
                    width: 100,
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
                    width: 100,
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
                    title: '创建人',
                    key: 'creater',
                    width: 100
                },
                {
                    title: '创建日期',
                    key: 'createTime',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return h("span", params.row.createTime == null ? "" : params.row.createTime.substr(0, 10));
                    }
                }
            ]
        }
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
        handleGotoEdit(programmeId) {
            this.$emit("goto-edit", programmeId);
        }
    }
}
</script>
