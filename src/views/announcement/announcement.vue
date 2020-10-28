<template>
    <div>
        <announcement-header></announcement-header>
        <announcement-table @return-data="getData" ref="dataList"></announcement-table>
        <Modal :title="title" v-model="showAddModal" footer-hide scrollable width="800">
            <announcement-add @cancle-add="cancleAdd" :editData="editData"></announcement-add>
        </Modal>
    </div>
</template>

<script>
    import announcementHeader from "./announcement-header.vue"
    import announcementTable from "./announcement-table.vue"
    import announcementAdd from "./announcement-add.vue"
    export default {
        data() {
            return {
                showAddModal: false,
                editData: [],
                title: '',
                formData: {
                    
                },
            };
        },
        components: {
            announcementHeader,
            announcementTable,
            announcementAdd
        },
        mounted() {
            let breadcrumbs = [
                { name: "首页" },
                { name: "公告管理" }
            ];
            this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        },
        methods: {
            cancleAdd(d) {
                this.showAddModal = d;
            },
            getData(d) {
                this.editData = [];
                if(d=="") return;
                let obj = {}
                obj.name = d.name;
                obj.content = d.content;
                obj.beginDate = d.begin_date;
                obj.endDate = d.end_date;
                obj.disabled = d.enabled_state;
                obj.channel = d.channel;
                obj.id = d.id;
                if(d.details) obj.details = d.details;
                this.editData.push(obj);
            }
        }
    };
</script>
