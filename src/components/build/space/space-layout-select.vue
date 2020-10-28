<template>
<Select :value="spaceLayoutId" clearable @on-change="handleChangeSelect" :style="{width: width}">
    <Option v-for="(item,index) in optionData"  :value="item.spaceLayoutId" :label="item.spaceLayoutName" :key="index">
        <img :src="item.spaceLayoutImage" style="vertical-align:middle; width:60px; height:40px; display:inline;"></img>
        <span style="vertical-align:middle; margin-left:8px;">{{item.spaceLayoutName}}</span>
    </Option>
</Select>
</template>

<script>
import {
    listSpaceLayout
} from "@/api/building.js";

export default {
    props: {
        spaceShapeId: {
            type: Number
        },
        spaceLayoutId: {
            type: Number
        },
        width: {
            type: String,
            default: "250px"
        }
    },
    data() {
        return {
            optionData: []
        };
    },
    watch: {
        spaceShapeId: function (val) {
            if (val && val != null) {
                this.fetchOptionData();
            } else {
                this.optionData = [];
            }
        }
    },
    mounted() {},
    methods: {
        fetchOptionData() {
            let params = {
                spaceShapeId: this.spaceShapeId
            };
            listSpaceLayout(params).then(resp => {
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
