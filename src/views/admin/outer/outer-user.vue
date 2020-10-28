<template>
    <keep-alive include="userList">
        <component :is="view"></component>
    </keep-alive>
</template>

<script>
import userList from "@/views/admin/outer/outer-user-list";
import userEdit from "@/views/admin/outer/outer-user-edit";

export default {
    data() {
        return {
            view: "userList"
        }
    },
    components: {
        userList,
        userEdit
    },
    created() {
        this.view = (this.$route.query.view == "userEdit" ? "userEdit" : "userList");
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.view = (this.$route.query.view == "userEdit" ? "userEdit" : "userList");
        }
    }
}
</script>
