<template>
<div>
    <Table border :loading="tableData.loading" :data="tableData.data" ref="table" @on-row-click="handleRowClick" :columns="columns" :height="tableData.height" @on-selection-change="handleSelectionChange">
        <template slot-scope="{ row, index }" slot="imageUrl">
            <space-table-img v-if="row.imageUrl" :spaceId="row.spaceId" :imageUrl="row.imageUrl" :count="row.imageXgtCount"></space-table-img>
        </template>
    </Table>
    <div class="page-wrap" style="padding-top:8px; text-align:right;">
        <Page :total="tableData.total" :page-size="queryParam.rows" :current="queryParam.page" show-total show-sizer @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,80,100]"></Page>
    </div>
</div>
</template>

<script>
import spaceTableImg from "@/components/build/space/space-table-img";

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
        }
    },
    components: {
        spaceTableImg
    },
    data() {
        return {
            columns: [{
                    title: '',
                    key: 'index',
                    width: 80,
                    align: 'center'
                },{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '案例编号',
                    key: 'spaceId',
                    width: 100
                },
                {
                    title: '案例名称',
                    key: 'spaceName',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.handleGotoEdit(params.row.spaceId);
                                }
                            }
                        }, params.row.spaceName);
                    }
                },
                {
                    title: '效果图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 110
                },
                {
                    title: '风格',
                    key: 'styleName',
                    width: 90
                },
                {
                    title: '案例类型',
                    key: 'spaceTypeName',
                    width: 90
                },
                {
                    title: '关联楼盘/户型',
                    key: 'relateBuildingModel',
                    width: 150,
                    render: (h, params) => {
                        let buildingName = params.row.buildingName;
                        let modelName = params.row.modelName;
                        if (buildingName || modelName) {
                            return h('div', [
                                h('div', buildingName),
                                h('div', {
                                    style: {
                                        color: '#9ea7b4'
                                    }
                                }, modelName)
                            ]);
                        } else {
                            return '';
                        }
                    }
                },
                {
                    title: '关联商品',
                    key: 'productCount',
                    width: 90,
                    render: (h, params) => {
                        return h("span", params.row.productCount == 0 ? "无" : params.row.productCount);
                    }
                },
                {
                    title: '720全景',
                    key: 'image720Count',
                    width: 85,
                    render: (h, params) => {
                        return h("span", params.row.image720Count == 0 ? "无" : params.row.image720Count);
                    }
                },
                {
                    title: '实景图',
                    key: 'imageSjtCount',
                    width: 75,
                    render: (h, params) => {
                        return h("span", params.row.imageSjtCount == 0 ? "无" : params.row.imageSjtCount);
                    }
                },
                {
                    title: '铺贴图',
                    key: 'imagePttCount',
                    width: 75,
                    render: (h, params) => {
                        return h("span", params.row.imagePttCount == 0 ? "无" : params.row.imagePttCount);
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
                    width: 90,
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
                        } else if (params.row.dataSource == 5) {
                            val = 'UE4程序';
                        } else if (params.row.dataSource == 6) {
                            val = '换砖DIY';
                        }
                        return h("span", val);
                    }
                },
                {
                    title: '创建人',
                    key: 'creater',
                    width: 90
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
                    width: 90
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
    created() {
        if (!this.isAdminPage) {
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
        handleGotoEdit(spaceId) {
            this.$emit("goto-edit", spaceId);
        }
    }
}
</script>
