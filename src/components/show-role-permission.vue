<template>
<Modal v-model="modal" title="操作权限" footer-hide>
    <div style="position: relative;">
        <Tree :data="treeData" style="height:500px; overflow:auto;"></Tree>
        <Spin v-if="spinShow" fix></Spin>
    </div>
</Modal>
</template>

<script>
import {
    findRolePermissions
} from "@/api/adminOuter.js";

export default {
    data() {
        return {
            modal: false,
            spinShow: false,
            treeData: [],
            roleIdsCache: []
        }
    },
    methods: {
        showModal(roleIds) {
            this.modal = true;
            if (this.isArrayEqual(roleIds, this.roleIdsCache)) {
                return;
            }
            this.roleIdsCache = [];
            roleIds.forEach(element => {
                this.roleIdsCache.push(element);
            });
            this.spinShow = true;
            findRolePermissions({
                roleIds
            }).then(resp => {
                if (resp.data.code == 200) {
                    this.treeData = resp.data.data;
                }
                this.spinShow = false;
            });
        },
        isArrayEqual(array1, array2) {
            if (array1.length != array2.length) {
                return false;
            }
            for (let i = 0; i < array1.length; i++) {
                if (array1[i] != array2[i]) {
                    return false;
                }
            }
            return true;
        }
    }
}
</script>
