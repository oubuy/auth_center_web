<template>
<div style="text-align:left; margin-bottom:8px;">
    <Button type="primary" @click="handleGotoEdit()">新增楼盘</Button>
    <Button @click="handleOnShelf(1)" :loading="onShelfBtnLoading" style="margin-left: 8px">上架</Button>
    <Button @click="handleOnShelf(0)" :loading="lowerShelfBtnLoading" style="margin-left: 8px">下架</Button>
    <Button v-if="isAdminPage" @click="handleAudit(1)" :loading="auditPassBtnLoading" style="margin-left: 8px">审核通过</Button>
    <Button v-if="isAdminPage" @click="handleAudit(2)" :loading="auditNoPassBtnLoading" style="margin-left: 8px">审核不通过</Button>
    <Button @click="handleDelete()" :loading="deleteBtnLoading" style="margin-left: 8px">删除</Button>
    <Button @click="handleRefresh" style="margin-left: 8px">刷新</Button>
</div>
</template>

<script>
import {
    deleteBuilding,
    onShelfBuilding,
    auditBuilding
} from "@/api/building.js";

export default {
    props: {
        tableData: {
            type: Object,
            required: true
        },
        isAdminPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            onShelfBtnLoading: false,
            lowerShelfBtnLoading: false,
            deleteBtnLoading: false,
            auditPassBtnLoading: false,
            auditNoPassBtnLoading: false
        }
    },
    methods: {
        handleGotoEdit() {
            this.$emit("goto-edit", '');
        },
        handleRefresh() {
            this.$emit("data-change");
        },
        handleOnShelf(onShelf) {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            let buildingIds = [];
            this.tableData.selection.forEach(item => {
                buildingIds.push(item.buildingId);
            });
            let params = {
                buildingIds: buildingIds,
                onShelf: onShelf
            };
            if (onShelf == 0) {
                this.lowerShelfBtnLoading = true;
            } else if (onShelf == 1) {
                this.onShelfBtnLoading = true;
            }
            onShelfBuilding(params).then(resp => {
                if (onShelf == 0) {
                    this.lowerShelfBtnLoading = false;
                } else if (onShelf == 1) {
                    this.onShelfBtnLoading = false;
                }
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                }
                this.$emit("data-change");
            });
        },
        handleDelete() {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            this.$Modal.confirm({
                title: '请确认',
                content: '<p>确定删除所选数据？</p>',
                onOk: () => {
                    let buildingIds = [];
                    this.tableData.selection.forEach(item => {
                        buildingIds.push(item.buildingId);
                    });
                    let params = {
                        buildingIds
                    };
                    this.deleteBtnLoading = true;
                    deleteBuilding(params).then(resp => {
                        this.deleteBtnLoading = false;
                        if (resp.data.code == 200) {
                            this.$Message.success(resp.data.msg);
                        }
                        this.$emit("data-change");
                    });
                }
            });
        },
        handleAudit(auditStatus) {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            let buildingIds = [];
            this.tableData.selection.forEach(item => {
                buildingIds.push(item.buildingId);
            });
            let params = {
                buildingIds,
                auditStatus
            };
            if (auditStatus == 1) {
                this.auditPassBtnLoading = true;
            } else if (auditStatus == 2) {
                this.auditNoPassBtnLoading = true;
            }
            auditBuilding(params).then(resp => {
                if (auditStatus == 1) {
                    this.auditPassBtnLoading = false;
                } else if (auditStatus == 2) {
                    this.auditNoPassBtnLoading = false;
                }
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                }
                this.$emit("data-change");
            });
        }
    }
}
</script>
