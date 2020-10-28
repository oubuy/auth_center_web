<template>
<keep-alive include="listView">
    <list-view is="listView" v-if="view=='list'" @goto-edit="handleGotoEdit"></list-view>
    <edit-view is="editView" v-if="view=='edit'" @goto-list="handleGotoList"></edit-view>
</keep-alive>
</template>

<script>
import listView from "@/views/dealer/build/building/building-list";
import editView from "@/components/build/building/building-edit";

export default {
    data() {
        return {
            view: "list"
        }
    },
    components: {
        listView,
        editView
    },
    created() {
        this.view = this.$route.query.view || 'list';
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.view = this.$route.query.view || 'list';
        }
    },
    methods: {
        handleGotoEdit(buildingId, tab) {
            this.view = "edit";
            let query = {
                view: this.view,
                tab: tab || 'tab1'
            };
            if (buildingId) {
                query.buildingId = buildingId;
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
        }
    }
}
</script>
