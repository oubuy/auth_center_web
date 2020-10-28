<template>
<Table border :loading="tableData.loading" :data="tableData.data" :columns="columns">
    <template slot-scope="{ row, index }" slot="imageUrl">
        <space-table-img v-if="row.imageUrl" :spaceId="row.spaceId" :imageUrl="row.imageUrl" :count="row.imageXgtCount"></space-table-img>
    </template>
</Table>
</template>

<script>
import spaceTableImg from "@/components/build/space/space-table-img";

export default {
    props: {
        tableData: {
            type: Object,
            required: true
        }
    },
    components: {
        spaceTableImg
    },
    data() {
        return {
            columns: [{
                    title: '效果图',
                    key: 'imageUrl',
                    slot: 'imageUrl',
                    align: 'center',
                    width: 120
                }, {
                    title: '编号',
                    key: 'spaceId',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '案例名称',
                    key: 'spaceName',
                    // render: (h, params) => {
                    //     return h('a', {
                    //         on: {
                    //             click: () => {
                    //                 this.handleGotoEdit(params.row.spaceId);
                    //             }
                    //         }
                    //     }, params.row.spaceName);
                    // }
                },
                {
                    title: '风格',
                    key: 'styleName',
                    align: 'center'
                },
                {
                    title: '案例类型',
                    key: 'spaceTypeName',
                    align: 'center'
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
