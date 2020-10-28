<template>
<keep-alive include="listView">
    <list-view is="listView" v-if="view=='list'" @goto-edit="handleGotoEdit"></list-view>
    <edit-view is="editView" v-if="view=='edit'" :spaceId="spaceId" @back="handleGotoList"></edit-view>
</keep-alive>
</template>

<script>
import listView from "@/views/dealer/build/space/space-list";
import editView from "@/components/build/space/space-edit";

export default {
    data() {
        return {
            view: "list",
            spaceId: ''
        }
    },
    components: {
        listView,
        editView
    },
    created() {
        this.spaceId = this.$route.query.spaceId || '';
        this.view = this.$route.query.view || 'list';
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.spaceId = this.$route.query.spaceId || '';
            this.view = this.$route.query.view || 'list';
        }
    },
    methods: {
        handleGotoEdit(spaceId) {
            this.spaceId = spaceId;
            let query = {
                ...this.$route.query
            };
            query.view = 'edit';
            if (spaceId) {
                query.spaceId = spaceId;
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
