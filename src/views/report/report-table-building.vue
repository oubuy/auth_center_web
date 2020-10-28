<template>
<Table border :loading="tableData.loading" :data="tableData.data" :columns="columns">
    <template slot-scope="{ row, index }" slot="imageUrl">
        <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
    </template>
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
                    title: '楼盘图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                }, {
                    title: '编号',
                    key: 'buildingId',
                    align: 'center',
                    width: 120
                },
                {
                    title: '楼盘名称',
                    key: 'buildingName'
                },
                {
                    title: '详细地址',
                    key: 'buildingPlace'
                },
                {
                    title: '访问量',
                    key: 'clicks',
                    align: 'center'
                }
            ]
        }
    },
    methods: {}
}
</script>
