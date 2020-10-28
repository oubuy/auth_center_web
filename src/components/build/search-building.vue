<style lang="less">
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
        top: 0;
    }
}
</style>

<template>
<Modal v-model="modal" title="搜索楼盘" class-name="vertical-center-modal" footer-hide>
    <Select v-model="buildingSearch" filterable remote :loading="loading" :remote-method="handleSearchBuilding" @on-change="handleSelectBuilding" placeholder="请输入楼盘名称搜索" clearable>
        <Option v-for="building in buildingData" :value="building.buildingId" :label="building.buildingName" :key="building.buildingId">
            <span>{{ building.buildingName }}</span>
            <span style="float:right;color:#9ea7b4">{{building.cityName}}</span>
        </Option>
    </Select>
</Modal>
</template>

<script>
import {
    findBuilding
} from "@/api/building.js";

export default {
    props: {
        isAdminPage: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            buildingSearch: '',
            buildingData: [],
            loading: false,
            modal: false,
        };
    },
    methods: {
        showModal() {
            this.buildingSearch = '';
            this.buildingData = [];
            this.modal = true;
        },
        handleSearchBuilding(val) {
            if (val) {
                let param = {
                    buildingName: val,
                    isAdminPage: this.isAdminPage
                }
                this.loading = true;
                findBuilding(param).then(resp => {
                    this.loading = false;
                    this.buildingData = [];
                    if (resp.data.code == 200) {
                        resp.data.data.list.forEach(item => {
                            this.buildingData.push(item);
                        });
                    }
                });
            } else {
                this.buildingData = [];
            }
        },
        handleSelectBuilding(val) {
            if (val) {
                this.buildingData.forEach(item => {
                    if (item.buildingId == val) {
                        this.modal = false;
                        this.$emit("on-select", item);
                    }
                });
            } else {
                this.buildingData = [];
            }
        }
    }
};
</script>
