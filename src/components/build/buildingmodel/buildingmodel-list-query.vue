<template>
<Card style="margin-bottom:16px; text-align:left;" dis-hover>
    <Form :label-width='80' inline>
        <FormItem label="户型名称">
            <Input type="text" v-model.trim="param.modelName" placeholder="请输入户型名称" @on-enter="handleSearch" clearable style="width:150px;"></Input>
        </FormItem>
        <FormItem label="楼盘名称">
            <Input type="text" v-model.trim="param.buildingName" placeholder="请输入楼盘名称" @on-enter="handleSearch" clearable style="width:150px;"></Input>
        </FormItem>
        <FormItem v-if="displayAuditStatus" label="审核状态">
            <Select v-model="param.auditStatus" clearable style="width:120px;">
                <Option value="0">待审核</Option>
                <Option value="1">审核通过</Option>
                <Option value="2">审核不通过</Option>
            </Select>
        </FormItem>
        <FormItem v-if="displayOnShelf" label="是否上架">
            <Select v-model="param.onShelf" clearable style="width:120px;">
                <Option value="1">上架</Option>
                <Option value="0">下架</Option>
            </Select>
        </FormItem>
        <FormItem label="是否3D户型">
            <Select v-model="param.is3DModel" clearable style="width:120px;">
                <Option value="true">是</Option>
                <Option value="false">否</Option>
            </Select>
        </FormItem>
        <FormItem label="户型类别">
            <InputNumber v-model="param.roomCount" placeholder="室" :min="0" :max="99" :precision="0" style="width:50px"></InputNumber>
            <InputNumber v-model="param.hallCount" placeholder="厅" :min="0" :max="99" :precision="0" style="width:50px"></InputNumber>
            <InputNumber v-model="param.bathroomCount" placeholder="卫" :min="0" :max="99" :precision="0" style="width:50px"></InputNumber>
            <InputNumber v-model="param.kitchenCount" placeholder="厨" :min="0" :max="99" :precision="0" style="width:50px"></InputNumber>
        </FormItem>
        <FormItem label="地区">
            <address-select ref="addressSelectRef" :address="param"></address-select>
        </FormItem>
        <FormItem v-if="displayDataSource" label="来源">
            <Select v-model="param.dataSource" clearable style="width:120px;">
                <Option value="1">楼盘中心</Option>
                <Option value="2">互联网</Option>
                <Option value="3">3D云设计</Option>
                <Option value="4">经销商后台</Option>
            </Select>
        </FormItem>
        <FormItem label="创建时间">
            <DatePicker type="date" v-model="param.createTimeStart" @on-change="param.createTimeStart=$event" placeholder="开始时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker> 至
            <DatePicker type="date" v-model="param.createTimeEnd" @on-change="param.createTimeEnd=$event" placeholder="结束时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker>
        </FormItem>
        <FormItem label="创建人">
            <Input type="text" v-model.trim="param.creater" placeholder="请输入创建人名称" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>
        <FormItem label="更新人">
            <Input type="text" v-model.trim="param.updator" placeholder="请输入更新人名称" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSearch">搜 索</Button>
            <Button @click="handleResetForm" style="margin-left: 8px">重 置</Button>
        </FormItem>
    </Form>
</Card>
</template>

<script>
import addressSelect from "@/components/build/address";

export default {
    props: {
        param: {
            type: Object,
            required: true
        },
        displayOnShelf: {
            type: Boolean,
            default: false
        },
        displayAuditStatus: {
            type: Boolean,
            default: false
        },
        displayDataSource: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectDateOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                }
            }
        }
    },
    components: {
        addressSelect
    },
    methods: {
        handleSearch() {
            this.param.page = 1;
            this.$emit("refresh-table");
        },
        handleResetForm() {
            this.param.modelName = '';
            this.param.buildingName = '';
            this.param.onShelf = '';
            this.param.auditStatus = '';
            this.param.roomCount = null;
            this.param.hallCount = null;
            this.param.bathroomCount = null;
            this.param.kitchenCount = null;
            this.param.provinceId = '';
            this.param.cityId = '';
            this.param.areaId = '';
            this.$refs.addressSelectRef.initAddressInfo(this.param.provinceId, this.param.cityId, this.param.areaId);
            this.param.is3DModel = '';
            this.param.creater = "";
            this.param.updator = "";
            this.param.dataSource = "";
            this.param.createTimeStart = '';
            this.param.createTimeEnd = '';
            this.handleSearch();
        }
    }
}
</script>
