<template>
    <div>
        <Card>
            <Form ref="formData" :label-width='80' inline style="display:flex;" :model="formData">
                <FormItem label="详细信息名" prop="detailName">
                    <Input type="text" v-model.trim="formData.detailName" placeholder="请输入名称" clearable></Input>
                </FormItem>
                <FormItem label="状态" prop="detailStatus">
                    <Select v-model="formData.detailStatus" placeholder="请选择" clearable style="width:80px;">
                        <Option value="null">全部</Option>
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button style="margin-left: 8px" @click="searchList" type="primary">查询</Button>
                    <Button style="margin-left: 8px" @click="resetFiled">重置</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import { detailDisable } from "@/api/basicData.js";
export default {
    data() {
        return {
            formData: {
                detailCode: '',
                detailName: '',
                detailStatus: 'null',
                detailSort: '',
                remark: '',
                basicId: '',
                page: 1,
                rows: 10,
            },
        }
    },
    props: ['basicId'],
    methods: {
        // 搜索列表
        searchList() { 
            this.formData.basicId = this.basicId;
            this.formData.page = 1;
            let obj = {};
            obj.detailCode = this.formData.detailCode;
            obj.detailName = this.formData.detailName;
            obj.detailStatus = this.formData.detailStatus;
            obj.detailSort = this.formData.detailSort;
            obj.remark = this.formData.remark;
            obj.basicId = this.formData.basicId;
            obj.page = this.formData.page;
            obj.rows = this.formData.rows;
            this.$emit('search-data',obj);
        },
        resetFiled() {
            this.formData.basicId = this.basicId;
            this.formData.page = 1;
            this.$refs.formData.resetFields();
            let obj = {};
            obj.detailCode = this.formData.detailCode;
            obj.detailName = this.formData.detailName;
            obj.detailStatus = this.formData.detailStatus;
            obj.detailSort = this.formData.detailSort;
            obj.remark = this.formData.remark;
            obj.basicId = this.formData.basicId;
            obj.page = this.formData.page;
            obj.rows = this.formData.rows;
            this.$emit('search-data',obj);
        }
    }
}
</script>

<style lang="less" scoped>

</style>
