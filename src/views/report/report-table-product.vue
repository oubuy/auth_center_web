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
                    title: '产品图',
                    key: 'mainPicture',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                }, {
                    title: '产品型号',
                    key: 'officialModel',
                    align: 'center'
                },
                {
                    title: '产品名称',
                    key: 'modityName'
                },
                {
                    title: '产品规格',
                    key: 'moditySize'
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
