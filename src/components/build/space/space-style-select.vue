<template>
<Select :value="styleId" @on-change="handleChangeSelect" label-in-value clearable :style="{width: width}">
    <Option v-for="(item,index) in optionData"  :value="item.styleId" :label="item.styleName" :key="index">{{ item.styleName }}</Option>
</Select>
</template>

<script>
import {
    listStyle
} from "@/api/building.js";

export default {
    props: {
        styleId: {
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
            listStyle().then(resp => {
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
