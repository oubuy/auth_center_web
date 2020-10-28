<template>
<keep-alive>
    <crawlerbuilding-list v-if="view=='list'" @goto-edit="handleGotoEdit"></crawlerbuilding-list>
    <crawlerbuilding-edit v-if="view=='edit'" :id="id" @back="handleBackTolList"></crawlerbuilding-edit>
</keep-alive>
</template>

<script>
import crawlerbuildingList from "@/views/dealer/build/crawlerbuilding/crawlerbuilding-list";
import crawlerbuildingEdit from "@/views/dealer/build/crawlerbuilding/crawlerbuilding-edit";

export default {
    data() {
        return {
            view: "list",
            id: ''
        }
    },
    components: {
        crawlerbuildingList,
        crawlerbuildingEdit
    },
    created() {
        this.view = (this.$route.query.view == 'edit') ? "edit" : "list";
        this.updateBreadcrumbs();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.view = (this.$route.query.view == 'edit') ? "edit" : "list";
            this.updateBreadcrumbs();
        }
    },
    methods: {
        updateBreadcrumbs() {
            let breadcrumbs = [{
                    name: "首页"
                },
                {
                    name: "楼盘案例"
                },
                {
                    name: "互联网来源楼盘"
                }
            ];
            if (this.view == 'edit') {
                breadcrumbs.push({
                    name: this.id ? '编辑' : '新增'
                });
            }
            this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        },
        handleBackTolList() { // 返回到列表界面
            let query = {
                ...this.$route.query,
                view: "list"
            };
            this.$router.push({
                query
            });
        },
        handleGotoEdit(id) { // 跳转到编辑界面
            this.id = id;
            let query = {
                ...this.$route.query,
                view: "edit"
            };
            this.$router.push({
                query
            });
        }
    }
}
</script>
