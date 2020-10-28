<template>
<Card style="margin-bottom:16px; text-align:left;" dis-hover>
    <Form :label-width='80' inline>
        <FormItem label="方案/楼盘">
            <Input type="text" v-model.trim="param.keyword" placeholder="请输入方案/楼盘名称" @on-enter="handleSearch" clearable></Input>
        </FormItem>
        <FormItem v-if="displayOnShelf" label="是否上架">
            <Select v-model="param.onShelf" clearable style="width:120px;">
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        </FormItem>
        <FormItem v-if="displayDataSource" label="来源">
            <Select v-model="param.dataSource" clearable style="width:120px;">
                <Option value="3">3D云设计</Option>
                <Option value="4">经销商后台</Option>
                <Option value="1">楼盘中心</Option>
            </Select>
        </FormItem>
        <FormItem label="场景">
            <Select v-model="param.sceneType" clearable style="width:120px;">
                <Option value="0">全屋720</Option>
                <Option value="1">案例组合方案</Option>
            </Select>
        </FormItem>
        <FormItem label="地区">
            <address-select ref="addressSelectRef" :address="param"></address-select>
        </FormItem>
        <FormItem label="创建人">
            <Input type="text" v-model.trim="param.creater" placeholder="创建人姓名" @on-enter="handleSearch" clearable style="width:120px;"></Input>
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
        displayDataSource: {
            type: Boolean,
            default: true
        },
        displayOnShelf: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {

        }
    },
    components: {
        addressSelect
    },
    methods: {
        handleSearch() {
            this.$emit("refresh-table");
        },
        handleResetForm() {
            this.param.page = 1;
            this.param.keyword = '';
            this.param.onShelf = '';
            this.param.dataSource = '';
            this.param.sceneType = '';
            this.param.provinceId = '';
            this.param.cityId = '';
            this.param.areaId = '';
            this.param.creater = '';
            this.$refs.addressSelectRef.initAddressInfo(this.param.provinceId, this.param.cityId, this.param.areaId);
            this.$emit("refresh-table");
        }
    }
}
</script>
