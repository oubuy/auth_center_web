<template>
<keep-alive include="listView">
    <list-view ref="listViewRef" is="listView" v-if="view=='list'" @goto-edit="handleGotoEdit"></list-view>
    <edit-view is="editView" v-if="view=='edit'" :programmeId="programmeId" displayAuditStatus @goto-list="handleGotoList"></edit-view>
</keep-alive>
</template>

<script>
import listView from "@/views/admin/build/programme/programme-list";
import editView from "@/components/build/programme/programme-edit";

export default {
    data() {
        return {
            view: "list",
            programmeId: ''
        }
    },
    components: {
        listView,
        editView
    },
    created() {
        this.initPage();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.initPage();
        }
    },
    methods: {
        initPage() {
            this.programmeId = this.$route.query.programmeId || '';
            this.view = this.$route.query.view || 'list';
            let breadcrumbs = [{
                    name: "首页"
                },
                {
                    name: "楼盘案例"
                },
                {
                    name: "方案管理"
                }
            ];
            if (this.view == 'edit') {
                breadcrumbs.push({
                    name: this.programmeId ? "编辑" : "新增"
                });
            }
            this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        },
        handleGotoEdit(programmeId) {
            this.view = "edit";
            let query = {
                view: this.view
            };
            if (programmeId) {
                query.programmeId = programmeId;
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
