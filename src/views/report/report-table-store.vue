<template>
<Table border :loading="tableData.loading" :data="tableData.data" :columns="columns">
</Table>
</template>

<script>
import tableImg from "@/components/build/table-img";

export default {
    props: {
        tableData: {
            type: Object,
            required: true
        }
    },
    components: {
        tableImg
    },
    data() {
        return {
            columns: [{
                    title: '门店名称',
                    key: 'orgName'
                },
                {
                    title: '所属经销商',
                    key: 'comName'
                },
                {
                    title: '活跃度',
                    key: 'activity',
                    align: 'center'
                }
            ]
        }
    },
    methods: {}
}
</script>
