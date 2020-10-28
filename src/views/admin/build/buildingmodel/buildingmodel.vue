<template>
<keep-alive include="modelList">
    <model-list is="modelList" v-if="view=='list'" @goto-edit="handleGotoEdit" @goto-edit-programme="handleGotoEditProgramme"></model-list>
    <model-edit is="modelEdit" v-if="view=='edit'" :modelId="modelId" :isCopyModel="isCopyModel" isAdminPage @back="handleGotoList"></model-edit>
    <programme-edit is="programmeEdit" v-if="view=='programmeEdit'" programmeId="" :modelId="modelId" displayAuditStatus @goto-list="handleGotoList"></programme-edit>
</keep-alive>
</template>

<script>
import modelList from "@/views/admin/build/buildingmodel/buildingmodel-list";
import modelEdit from "@/components/build/buildingmodel/buildingmodel-edit";
import programmeEdit from "@/components/build/programme/programme-edit";

export default {
    data() {
        return {
            view: "list",
            modelId: '',
            isCopyModel: false
        }
    },
    components: {
        modelList,
        modelEdit,
        programmeEdit
    },
    created() {
        this.handleRouteParam();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.handleRouteParam();
        }
    },
    methods: {
        handleRouteParam() {
            this.modelId = this.$route.query.modelId || '';
            this.isCopyModel = this.$route.query.isCopyModel || false;
            this.view = this.$route.query.view || 'list';
        },
        handleGotoEdit(modelId, isCopyModel) {
            let query = {
                view: "edit"
            };
            if (modelId) {
                query.modelId = modelId;
            }
            if (isCopyModel) {
                query.isCopyModel = isCopyModel;
            }
            this.$router.push({
                query
            });
        },
        handleGotoList(refresh) {
            let query = {};
            if (refresh) {
                query.refresh = 'true';
            }
            this.$router.push({
                query
            });
        },
        handleGotoEditProgramme(modelId) {
            let query = {
                view: "programmeEdit"
            };
            if (modelId) {
                query.modelId = modelId;
            }
            this.$router.push({
                query
            });
        }
    }
}
</script>
