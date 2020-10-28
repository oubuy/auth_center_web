<template>
    <div>
        <Layout>
            <Sider hide-trigger :style="{ background: '#fff', minWidth: '250px'}">
                <Card :padding="10" :style="{height: maxHeight+'px', overflow: 'auto'}">
                    <data-tree ref="tree" @org-select="treeSelect" @first-data="getFirstId"  @reload-table="getTable"></data-tree>
                </Card>
            </Sider>
            <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
                <data-header :basicId='formData.basicId' @search-data='getTable'></data-header>
                <data-table ref='table' :singleData='singleData' :basicId='formData.basicId'></data-table>
            </Content>
        </Layout>
    </div>
</template>

<script>
import dataTree from './basic-data-tree.vue'
import dataHeader from './basic-data-header.vue'
import dataTable from './basic-data-table.vue'
import { detailDisable } from "@/api/basicData.js"
export default {
    data() {
        return {
            maxHeight: 760,
            formData: {
                detailName: '',
                detailStatus: '',
                page: 1,
                rows: 10,
                basicId: ''
            },
            ids: [],
            singleData: []
        }
    },
    components: {
        dataTree,
        dataHeader,
        dataTable
    },
    created() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "基础数据"
            },
            {
                name: "基础数据"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    },
    mounted() {

    },
    methods: {
        // 根据左侧列表选择渲染表格
        treeSelect(d) { 
            this.formData.basicId = d;
            this.$refs.table.getTable(this.formData);
        },
        // 进入页面的默认表格渲染
        getFirstId(d) { 
            this.formData.basicId = d;
        },
        // 获取表格数据
        getTable(d) { 
            console.log(d);
            this.$refs.table.getTable(d);
        },
    },
}
</script>

<style>

</style>
