<template>
<Select :value="spaceShapeId" clearable @on-change="handleChangeSelect" style="width:120px">
    <Option v-for="(item,index) in optionData"  :value="item.spaceShapeId" :label="item.spaceShapeName" :key="index">{{ item.spaceShapeName }}</Option>
</Select>
</template>

<script>
import {
    listSpaceShape
} from "@/api/building.js";

export default {
    props: {
        spaceTypeId: {
            type: String
        },
        spaceShapeId: {
            type: Number
        }
    },
    data() {
        return {
            optionData: []
        };
    },
    mounted() {},
    watch: {
        spaceTypeId: function (val) {
            if (val) {
                this.fetchOptionData();
            } else {
                this.optionData = [];
            }
        }
    },
    methods: {
        fetchOptionData() {
            let params = {
                spaceTypeId: this.spaceTypeId
            };
            listSpaceShape(params).then(resp => {
                if (resp.data.code == 200) {
                    this.optionData = [];
                    resp.data.data.forEach(item => {
                        this.optionData.push(item);
                    });
                }
            });
        },
        handleChangeSelect(val) {
            this.$emit("on-change", val);
        }
    }
};
</script>
