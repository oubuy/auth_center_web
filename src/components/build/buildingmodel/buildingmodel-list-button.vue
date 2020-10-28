<template>
<div style="text-align:left; margin-bottom:8px;">
    <Button type="primary" @click="handleGotoEdit">新增户型</Button>
    <Button @click="handleCopyModel" style="margin-left: 8px">复制户型</Button>
    <Button @click="handleOpen3DCloud" style="margin-left: 8px">3D云编辑</Button>
    <Button @click="handleOnShelf(1)" :loading="onShelfBtnLoading" style="margin-left: 8px">上架</Button>
    <Button @click="handleOnShelf(0)" :loading="lowerShelfBtnLoading" style="margin-left: 8px">下架</Button>
    <Button v-if="isAdminPage" @click="handleAudit(1)" :loading="auditPassBtnLoading" style="margin-left: 8px">审核通过</Button>
    <Button v-if="isAdminPage" @click="handleAudit(2)" :loading="auditNoPassBtnLoading" style="margin-left: 8px">审核不通过</Button>
    <Button v-if="isAdminPage" @click="handleGotoEditProgramme" style="margin-left: 8px">添加方案</Button>
    <Button @click="handleDelete" :loading="deleteBtnLoading" style="margin-left: 8px">删除</Button>
    <Button @click="handleRefresh" style="margin-left: 8px">刷新</Button>
</div>
</template>

<script>
import {
    onShelfBuildingModel,
    deleteBuildingModel,
    auditBuildingModel,
    get3DCloudUrl
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
            this.$emit("goto-edit", '', false);
        },
        handleGotoEditProgramme(modelId) {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            if (this.tableData.selection.length > 1) {
                this.$Message.warning("只能选择一条记录");
                return;
            }
            let row = this.tableData.selection[0];
            this.$emit("goto-edit-programme", row.modelId);
        },
        handleCopyModel() {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            if (this.tableData.selection.length > 1) {
                this.$Message.warning("只能选择一条记录");
                return;
            }
            let row = this.tableData.selection[0];
            this.$emit("goto-edit", row.modelId, true);
        },
        handleOpen3DCloud() {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            if (this.tableData.selection.length > 1) {
                this.$Message.warning("只能选择一条记录");
                return;
            }
            let row = this.tableData.selection[0];
            if (!this.isAdminPage && row.auditStatus == 1 && row.onShelf == 1) {
                this.$Message.warning("您无权限编辑此户型");
                return;
            }
            var param = {
                imageSource: "1",
                entityId: row.modelId,
                designId: row.designId,
                imageUrl: row.imageUrl
            };
            get3DCloudUrl(param).then(resp => {
                if (resp.data.code == 200) {
                    window.open(resp.data.data);
                }
            });
        },
        handleOnShelf(onShelf) {
            if (this.tableData.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            let modelIds = [];
            this.tableData.selection.forEach(item => {
                modelIds.push(item.modelId);
            });
            let params = {
                modelIds: modelIds,
                onShelf: onShelf
            };
            if (onShelf == 0) {
                this.lowerShelfBtnLoading = true;
            } else if (onShelf == 1) {
                this.onShelfBtnLoading = true;
            }
            onShelfBuildingModel(params).then(resp => {
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
                content: '<p>确定删除所选户型？</p>',
                onOk: () => {
                    let modelIds = [];
                    this.tableData.selection.forEach(item => {
                        modelIds.push(item.modelId);
                    });
                    let params = {
                        modelIds
                    };
                    this.deleteBtnLoading = true;
                    deleteBuildingModel(params).then(resp => {
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
            let modelIds = [];
            this.tableData.selection.forEach(item => {
                modelIds.push(item.modelId);
            });
            let params = {
                modelIds,
                auditStatus
            };
            if (auditStatus == 1) {
                this.auditPassBtnLoading = true;
            } else if (auditStatus == 2) {
                this.auditNoPassBtnLoading = true;
            }
            auditBuildingModel(params).then(resp => {
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
        },
        handleRefresh() {
            this.$emit("data-change");
        }
    }
}
</script>
