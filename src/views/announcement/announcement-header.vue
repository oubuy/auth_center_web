<template>
    <div>
        <Card>
            <Form ref="formData" :label-width='80' inline style="display:flex;" :model="formData">
                <FormItem label="公告" prop="name">
                    <Input type="text" v-model.trim="formData.name" placeholder="请输入公告名称/创建人" clearable></Input>
                </FormItem>
                <FormItem label="发布渠道" prop="channel">
                    <Select v-model="formData.channel" placeholder="请选择" clearable style="width:150px;">
                        <Option value="交互大屏">交互大屏</Option>
                        <Option value="iPad">iPad</Option>
                        <Option value="官网">官网</Option>
                        <Option value="中台">中台</Option>
                    </Select>
                </FormItem>
                <FormItem label="发布状态" prop="noticeState">
                    <Select v-model="formData.noticeState" placeholder="请选择" clearable style="width:150px;">
                        <Option value="未发布">未发布</Option>
                        <Option value="发布中">发布中</Option>
                        <Option value="已发布">已发布</Option>
                    </Select>
                </FormItem>
                <FormItem label="状态" prop="enabledState">
                    <Select v-model="formData.enabledState" placeholder="请选择" clearable style="width:100px;">
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
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
import {announcementList} from "@/api/announcement.js"
export default {
    data() {
        return {
            formData: {
                name: '',
                channel: '',
                noticeState: '',
                enabledState: ''
            },
        };
    },
    components: {
            
    },
    mounted() {
        
    },
    methods: {
        searchList() {
            let param = {
                page: 1,
                rows: 15,
            }
            if(this.formData.name) param.name = this.formData.name;
            if(this.formData.channel) param.channel = this.formData.channel;
            if(this.formData.noticeState) param.noticeState = this.formData.noticeState;
            if(this.formData.enabledState) param.enabledState = this.formData.enabledState;
            this.$parent.$refs.dataList.getAnnouncementList(param);
        },
        resetFiled() {
            this.$refs.formData.resetFields();
            this.$parent.$refs.dataList.getAnnouncementList();
        }
    }
};
</script>