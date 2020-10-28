<template>
    <div>
        <Form ref="formData" :label-width='90' :model="formData" :rules="ruleInline">
            <FormItem label="公告名称：" prop="publicName">
                <Input type="text" v-model.trim="formData.publicName" placeholder="请输入公告名称" clearable style="width: 300px;" :disabled="editDisabled"></Input>
            </FormItem>
            <FormItem prop="publicContent" label="公告内容：">
                <Input v-model="formData.publicContent" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入公告内容，尽量简短" style="width:350px" :disabled="editDisabled"/>
            </FormItem>
            <FormItem prop="startDate" label="开始日期：">
                <Date-picker type="date" placeholder="选择日期和时间" style="width: 200px" v-model="formData.startDate" @on-change="formData.startDate=$event" :editable="false" :disabled="editDisabled"></Date-picker>
                <span style="margin-left: 10px;color: #c1c1c1;">开始日期从凌晨开始</span>
            </FormItem>
            <FormItem prop="endDate" label="截止日期：">
                <Date-picker type="date" placeholder="选择日期和时间" style="width: 200px" v-model="formData.endDate" @on-change="formData.endDate=$event" :editable="false" :disabled="editDisabled"></Date-picker>
                <span style="margin-left: 10px;color: #c1c1c1;">截止日期至当日23时59分59秒</span>
            </FormItem>
            <FormItem label="发布渠道：">
                <CheckboxGroup v-model="formData.channel" @on-change="chooseChannel($event)">
                    <Checkbox label="交互大屏" :disabled="editDisabled"></Checkbox>
                    <Checkbox label="iPad" :disabled="editDisabled"></Checkbox>
                    <Checkbox label="官网" :disabled="editDisabled"></Checkbox>
                    <Checkbox label="中台" :disabled="editDisabled"></Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem prop="disabled" label="启用状态：">
                <RadioGroup v-model="formData.disabled">
                    <Radio label="1" :disabled="editDisabled">启用</Radio>
                    <Radio label="0" :disabled="editDisabled">停用</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem v-show="!editDisabled">
                <Button style="margin-left: 8px" @click="save" type="primary" :loading="saveBtnLoading">保存</Button>
                <Button style="margin-left: 8px" @click="cancel">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import {add,modityAnnouncement} from '@/api/announcement.js'
export default {
    data() {
        return {
            formData: {
                publicName: '',
                publicContent: '',
                publicStatus: '',
                disabled: '1',
                channel: ["交互大屏"],
                startDate: '',
                endDate: '',
                id: ''
            },
            saveBtnLoading: false,
            editDisabled: false,
            ruleInline: {
                publicName: [{
                    type:'string',
                    required: true,
                    message: "公告名称不能为空",
                    trigger: "blur"
                }],
                publicContent: [{
                    type:'string',
                    required: true,
                    message: "公告内容不能为空",
                    trigger: "blur"
                }],
                startDate: [{
                    type:'string',
                    required: true,
                    message: "开始日期不能为空",
                    trigger: "blur"
                }],
                endDate: [{
                    type:'string',
                    required: true,
                    message: "截止日期不能为空",
                    trigger: "blur"
                }]
            },
            editDataArr: []
        };
    },
    props:{
        editData: Array
    },
    components: {
            
    },
    mounted() {

    },
    methods: {
        save() {
            let param = {};
            if(this.formData.id) param.id = this.formData.id;
            param.name = this.formData.publicName;
            param.channel = this.formData.channel;
            param.beginDate = this.switchTimeFormat(this.formData.startDate)+" 00:00:00";
            param.endDate = this.switchTimeFormat(this.formData.endDate)+" 23:59:59";
            param.enabledState = this.formData.disabled;
            param.content = this.formData.publicContent;
            param.channel = param.channel.join(",");
            let flag = this.timeCompare(param.beginDate,param.endDate);
            if(!param.name) {
                this.$Message.warning("公告名称不能为空");
                return;
            }
            if(!param.content) {
                this.$Message.warning("公告内容不能为空");
                return;
            }
            if(!param.beginDate||param.beginDate=="NaN-NaN-NaN 00:00:00") {
                this.$Message.warning("开始时间不能为空");
                return;
            }
            if(!param.endDate||param.endDate=="NaN-NaN-NaN 23:59:59") {
                this.$Message.warning("截止时间不能为空");
                return;
            }
            if(!param.channel) {
                this.$Message.warning("发布渠道不能为空");
                return;
            }
            if(!flag) {
                this.$Message.warning("开始时间不能大于结束时间");
                return;
            }
            this.saveBtnLoading = true;
            if(param.id) {
                modityAnnouncement(param).then(res=>{
                    if(res.data.code==200) {
                        this.$Message.success("修改成功");
                        this.$parent.$options.parent.showAddModal=false;
                        this.$parent.$options.parent.$refs.dataList.getAnnouncementList();
                    }
                    this.saveBtnLoading = false;
                }).catch(err=>{
                    this.saveBtnLoading = false;
                });
            }else {
                add(param).then(res=>{
                    if(res.data.code==200) {
                        this.$Message.success("新增成功");
                        this.$parent.$options.parent.showAddModal=false;
                        this.$parent.$options.parent.$refs.dataList.getAnnouncementList();
                    }
                    this.saveBtnLoading = false;
                }).catch(err=>{
                    this.saveBtnLoading = false;
                });
            }
        },
        timeCompare(startTime,endTime) {
            var date1 = new Date(startTime);
            var date2 = new Date(endTime);
            if(date1.getTime()>date2.getTime()) {
                return false;
            }else {
                return true;
            }
        },
        switchTimeFormat (time) {
            const dateTime = new Date(time);
            const year = dateTime.getFullYear();
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();
            const hour = dateTime.getHours();
            const minute = dateTime.getMinutes();
            const second = dateTime.getSeconds();
            return year+"-"+this.addZero(month)+"-"+this.addZero(date);
        },
        addZero (v) {
            return v < 10 ? '0' + v : v;
        },
        cancel() {
            this.saveBtnLoading = false;
            this.$emit("cancle-add",false);
        },
        chooseChannel(e) {
            this.formData.channel = e;
        }
    },
    watch: {
        editData: {
            handler: function(newVal,oldVal) {
                if(newVal.length) {
                    let item = newVal[0];
                    if(item.details) this.editDisabled = true;
                    else this.editDisabled = false;
                    if(typeof(item.channel) == "string") item.channel = item.channel.split(",");
                    this.formData.publicName = item.name;
                    this.formData.publicContent = item.content;
                    this.formData.startDate = item.beginDate;
                    this.formData.endDate = item.endDate;
                    this.formData.channel = item.channel;
                    this.formData.id = item.id;
                    if(item.enabled_state == '启用') {
                        this.formData.disabled='1';
                    }else if(item.enabled_state == '禁用'){
                        this.formData.disabled = '0';
                    }
                }else {
                    this.editDisabled = false;
                    this.$refs.formData.resetFields();
                    this.formData.channel = ['交互大屏'];
                    this.formData.id = "";
                }
            },
            deep: true
        }
    },
};
</script>