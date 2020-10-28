<template>
<!-- 查询结果 -->
<Table border :loading="loading" :columns="columns" :data="tableData"></Table>
</template>

<script>
import {
    getRolesList
} from "@/api/roles.js";

export default {
    data() {
        return {
            loading: false,
            tableData: [],
            columns: [{
                    title: '权限名称',
                    key: 'roleName',
                    width: 250
                },
                {
                    title: '说明',
                    key: 'description'
                }
            ]
        }
    },
    mounted() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "经销商管理"
            },
            {
                name: "权限说明"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.loading = true;
            getRolesList().then(resp => {
                this.tableData = [];
                if (resp.data.code == 200) {
                    resp.data.data.forEach(item => {
                        this.tableData.push(item);
                    });
                }
                this.loading = false;
            });
        }
    }
}
</script>
