<template>
<div>
    <Table border :loading="tableData.loading" ref="table" @on-row-click="handleRowClick" :data="tableData.data" :height="tableData.height" :columns="columns" @on-selection-change="handleSelectionChange">
        <template slot-scope="{ row, index }" slot="imageUrl">
            <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
        </template>
        <template slot-scope="{ row, index }" slot="designImageUrl">
            <table-img v-if="row.designImageUrl" :data="[row.designImageUrl]"></table-img>
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
        isAdminPage: {
            type: Boolean,
            default: false
        },
        linkToSpaceList: {
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
                    title: '户型图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                },
                {
                    title: '3D设计图',
                    key: 'designImageUrl',
                    slot: 'designImageUrl',
                    align: 'center',
                    width: 120
                },
                {
                    title: '户型名称',
                    key: 'modelName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.handleGotoEdit(params.row.modelId);
                                }
                            }
                        }, params.row.modelName);
                    }
                },
                {
                    title: '楼盘名称',
                    key: 'buildingName',
                    minWidth: 150
                },
                {
                    title: '户型类别',
                    key: 'modelType',
                    width: 120
                },
                {
                    title: '户型面积',
                    key: 'modelArea',
                    width: 100
                },
                {
                    title: '案例数',
                    key: 'spaceCount',
                    width: 100,
                    render: (h, params) => {
                        if (this.linkToSpaceList) {
                            return h('a', {
                                on: {
                                    click: () => {
                                        this.$emit("goto-space-list", params.row.modelId);
                                    }
                                }
                            }, params.row.spaceCount);
                        } else {
                            return h('span', params.row.spaceCount);
                        }
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
                    title: '来源',
                    key: 'dataSource',
                    width: 100,
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
                    width: 100,
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 100,
                    render: (h, params) => {
                        return h("span", params.row.createTime == null ? "" : params.row.createTime.substr(0, 10));
                    }
                },
                {
                    title: '更新人',
                    key: 'updator',
                    width: 100,
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    width: 100,
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
        if (!this.isAdminPage) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].key == 'auditStatus') {
                    this.columns.splice(i, 1);
                    break;
                }
            }
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
        handleGotoEdit(modelId) {
            this.$emit("goto-edit", modelId, false);
        }
    }
}
</script>
