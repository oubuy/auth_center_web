<template>
<Select :value="spaceTypeId" @on-change="handleChangeSelect" label-in-value clearable :style="{width: width}">
    <Option v-for="(item,index) in optionData"  :value="item.spaceTypeId" :label="item.spaceTypeName" :key="index">{{ item.spaceTypeName }}</Option>
</Select>
</template>

<script>
import {
    listSpaceType
} from "@/api/building.js";

export default {
    props: {
        spaceTypeId: {
            type: String
        },
        width: {
            type: String,
            default: "120px"
        }
    },
    data() {
        return {
            optionData: []
        };
    },
    mounted() {
        this.fetchOptionData();
    },
    methods: {
        fetchOptionData() {
            listSpaceType().then(resp => {
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
