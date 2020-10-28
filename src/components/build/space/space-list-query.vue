<template>
<Card style="margin-bottom:16px; text-align:left;" dis-hover>
    <Form :label-width='75' inline>
        <FormItem label="案例编号">
            <Input type="text" v-model.trim="param.spaceId" placeholder="请输入案例编号" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>
        <FormItem label="案例名称">
            <Input type="text" v-model.trim="param.spaceName" placeholder="请输入案例名称" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>
        <FormItem label="案例类型">
            <space-type-select :spaceTypeId="param.spaceTypeId" @on-change="handleChangeSpaceType" style="width:120px;"></space-type-select>
        </FormItem>
        <FormItem label="风格">
            <space-style-select :styleId="param.styleId" @on-change="handleChangeStyle" style="width:120px;"></space-style-select>
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
        <FormItem label="效果图分类">
            <Select v-model="param.caseType" clearable style="width:120px;">
                <Option value="VR">720效果图</Option>
                <Option value="DIY">DIY效果图</Option>
                <Option value="UE4">UE4效果图</Option>
            </Select>
        </FormItem>
        <FormItem label="产品型号">
            <Input type="text" v-model.trim="param.productModel" placeholder="关联产品型号" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>
        <FormItem label="创建人">
            <Input type="text" v-model.trim="param.creater" placeholder="创建人姓名" @on-enter="handleSearch" clearable style="width:120px;"></Input>
        </FormItem>
        <FormItem label="UE4场景">
            <Select v-model="param.isUE4" clearable style="width:120px;">
                <Option value="true">是</Option>
                <Option value="false">否</Option>
            </Select>
        </FormItem>
        <FormItem v-if="displayDataSource" label="来源">
            <Select v-model="param.dataSource" clearable style="width:120px;">
                <Option value="1">楼盘中心</Option>
                <Option value="3">3D云设计</Option>
                <Option value="4">经销商后台</Option>
                <Option value="5">UE4程序</Option>
                <Option value="6">换砖DIY</Option>
            </Select>
        </FormItem>
        <FormItem label="地区">
            <address-select ref="addressSelectRef" :address="param"></address-select>
        </FormItem>
        <FormItem label="创建时间">
            <DatePicker type="date" v-model="param.createTimeStart" @on-change="param.createTimeStart=$event" placeholder="开始时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker> 至
            <DatePicker type="date" v-model="param.createTimeEnd" @on-change="param.createTimeEnd=$event" placeholder="结束时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker>
        </FormItem>
        <FormItem>
            <Checkbox v-model="param.isRealScene">只看实景案例</Checkbox>
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
import spaceTypeSelect from "@/components/build/space/space-type-select";
import spaceStyleSelect from "@/components/build/space/space-style-select";

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
        addressSelect,
        spaceTypeSelect,
        spaceStyleSelect
    },
    methods: {
        handleSearch() {
            this.param.page = 1;
            this.$emit("refresh-table");
        },
        handleResetForm() {
            this.param.spaceId = '';
            this.param.spaceName = '';
            this.param.spaceTypeId = '';
            this.param.styleId = '';
            this.param.auditStatus = '';
            this.param.onShelf = '';
            this.param.caseType = '';
            this.param.creater = '';
            this.param.isUE4 = '';
            this.param.dataSource = '';
            this.param.productModel = '';
            this.param.isRealScene = false;
            this.param.provinceId = '';
            this.param.cityId = '';
            this.param.areaId = '';
            this.param.createTimeStart = '';
            this.param.createTimeEnd = '';
            this.$refs.addressSelectRef.initAddressInfo(this.param.provinceId, this.param.cityId, this.param.areaId);
            this.handleSearch();
        },
        handleChangeSpaceType(item) {
            this.param.spaceTypeId = item ? item.value : "";
        },
        handleChangeStyle(item) {
            this.param.styleId = item ? item.value : "";
        }
    }
}
</script>
