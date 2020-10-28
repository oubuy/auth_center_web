<template>
<keep-alive exclude="spaceEdit">
    <space-list is="spaceList" v-if="view=='list'" @goto-edit="handleGotoEdit"></space-list>
    <space-edit is="spaceEdit" v-else :spaceId="spaceId" isAdminPage @back="handleGotoList"></space-edit>
</keep-alive>
</template>

<script>
import spaceList from "@/views/admin/build/space/space-list";
import spaceEdit from "@/components/build/space/space-edit";

export default {
    data() {
        return {
            spaceId: '',
            view: "list"
        }
    },
    components: {
        spaceList,
        spaceEdit
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
            this.spaceId = this.$route.query.spaceId || '';
            this.view = this.$route.query.view || 'list';
        },
        handleGotoEdit(spaceId) {
            let query = {
                view: "edit"
            };
            if (spaceId) {
                query.spaceId = spaceId;
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
