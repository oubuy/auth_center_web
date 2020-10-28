<template>
<keep-alive include="listView">
    <list-view is="listView" v-if="view=='list'" @goto-edit="handleGotoEdit"></list-view>
    <edit-view is="editView" v-if="view=='edit'" :modelId="modelId" :isCopyModel="isCopyModel" @back="handleGotoList"></edit-view>
</keep-alive>
</template>

<script>
import listView from "@/views/dealer/build/buildingmodel/buildingmodel-list";
import editView from "@/components/build/buildingmodel/buildingmodel-edit";

export default {
    data() {
        return {
            view: "list",
            modelId: '',
            isCopyModel: false
        }
    },
    components: {
        listView,
        editView
    },
    created() {
        this.modelId = this.$route.query.modelId || '';
        this.isCopyModel = this.$route.query.isCopyModel || false;
        this.view = this.$route.query.view || 'list';
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.modelId = this.$route.query.modelId || '';
            this.isCopyModel = this.$route.query.isCopyModel || false;
            this.view = this.$route.query.view || 'list';
        }
    },
    methods: {
        handleGotoEdit(modelId, isCopyModel) {
            this.modelId = modelId;
            this.isCopyModel = isCopyModel;
            let query = {
                ...this.$route.query
            };
            query.view = 'edit';
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
        handleGotoList(dataChange) {
            let query = {};
            if (dataChange) {
                query.refresh = 'true';
            }
            this.$router.push({
                query
            });
        }
    }
}
</script>
