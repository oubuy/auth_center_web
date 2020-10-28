<template>
<Table border :loading="tableData.loading" :data="tableData.data" :columns="columns">
    <template slot-scope="{ row, index }" slot="imageUrl">
        <table-img v-if="row.imageUrl" :data="[row.imageUrl]"></table-img>
    </template>
    <template slot-scope="{ row, index }" slot="designImageUrl">
        <table-img v-if="row.designImageUrl" :data="[row.designImageUrl]"></table-img>
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
                    title: '户型图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                }, {
                    title: '3D设计图',
                    key: 'designImageUrl',
                    slot: 'designImageUrl',
                    align: 'center',
                    width: 120
                }, {
                    title: '编号',
                    key: 'modelId',
                    align: 'center',
                    width: 120
                },
                {
                    title: '户型名称',
                    key: 'modelName'
                },
                {
                    title: '楼盘名称',
                    key: 'buildingName'
                },
                {
                    title: '户型类别',
                    key: 'modelType'
                },
                {
                    title: '户型面积',
                    key: 'modelArea'
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
