<template>
    <div>
        <div class="button_box">
            <Button @click="addDetailMsg" type="primary" style='padding: 4px 12px 4px;'>创建</Button>
            <Button @click="editDetailMsg" type="primary" style='padding: 4px 12px 4px;margin-left: 10px;'>编辑</Button>
        </div>
        <ul>
            <li class="tree_list" v-for="(item,index) in treeData">
                <div :class="activeClass == index ? 'active':''" @click='renderTable(index)' style="padding: 0 4px;border-radius: 3px;transition: all .2s ease-in-out;cursor: pointer;">{{item.basicName}}</div>
                <Button :type=item.type size="small" style="padding: 0 2px 0;" @click.stop="disabledToggle(index)">{{item.status}}</Button>
            </li>
        </ul>
        <Modal title="基础数据添加" v-model="showAddModal">
            <Form :label-width="120" ref="addForm" :model="addForm" :rules="ruleInline">
                <FormItem label="编码" prop='basicCode'>
                    <Input v-model.trim="addForm.basicCode" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="名称" prop='basicName'>
                    <Input v-model.trim="addForm.basicName" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="addForm.status" placeholder="请选择" clearable style="width:25%;">
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序" prop='sortNum'>
                    <Input v-model="addForm.sortNum" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="备注" prop='remark'>
                    <Input v-model="addForm.remark" type="textarea" clearable style="width:65%;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="saveData(addForm)">保存</Button>
                <Button style="margin-left: 8px" @click="cancelAdd()">取消</Button>
            </div>
        </Modal>
        <Modal title="修改基础数据" v-model="showEditModal">
            <Form :label-width="120" ref="editForm" :model="editForm" :rules="rules">
                <FormItem label="编码" prop='basicCode'>
                    <span>{{editForm.basicCode}}</span>
                </FormItem>
                <FormItem label="名称" prop='basicName'>
                    <Input v-model.trim="editForm.basicName" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="editForm.status" placeholder="请选择" clearable style="width:25%;">
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序" prop='sortNum'>
                    <Input v-model="editForm.sortNum" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="备注" prop='remark'>
                    <Input v-model="editForm.remark" type="textarea" clearable style="width:65%;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="saveDataEdit">保存</Button>
                <Button style="margin-left: 8px" @click="cancelEdit()">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getDataTree, add, getPage, disableBasicData, editBasicData } from "@/api/basicData.js";
export default {
    data() {
        const validateCodeCheck = (rule, value, callback) => {
            var flag = true;
            if(!value) {
                callback(new Error('请填写编码'));
            }else {
                let self = this;
                for(var i=0;i<self.treeData.length;i++) {
                    if(value==self.treeData[i].basicCode) {
                        flag = false;
                        break;
                    }else {
                        flag = true;
                    }
                }
                if(flag) {
                    callback();
                }else {
                    callback(new Error('该编码已存在'));
                }
            }
            
        };
        return {
            treeData: [],
            formData: {
                detailCode: '',
                detailName: '',
                detailStatus: '0',
                detailSort: '',
                remark: '',
                basicId: '',
            },
            addForm: {
                basicCode: '',
                basicName: '',
                status: '0',
                sortNum: '',
                remark: '',
            },
            editForm: {},
            ruleInline: {
                basicCode: [
                    { required: true, trigger: 'blur',validator: validateCodeCheck }
                ],
                basicName: [
                    { required: true, message: '请填写名称', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ]
            },
            rules: {
                basicName: [
                    { required: true, message: '请填写名称', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ]
            },
            showAddModal: false,
            showEditModal: false,
            activeClass: 0,
        }
    },
    created() {
        this.getPage();
    },
    methods: {
        getPage() { // 获取左侧列表数据
            getPage().then(res=>{
                console.log(res);
                let arr = res.data.rows;
                this.editForm = arr[0];
                this.$emit('first-data',this.editForm.id);
                arr.forEach(item=>{
                    let obj = {};
                    obj.basicName = item.basicName;
                    obj.basicCode = item.basicCode;
                    obj.id = item.id;
                    obj.status = item.status;
                    obj.sortNum = item.sortNum;
                    obj.remark = item.remark;
                    if(obj.status == '0') {
                        obj.status='禁用';
                        obj.type='error';
                    }
                    else if(obj.status=='1') {
                        obj.status='启用';
                        obj.type='info';
                    }
                    this.treeData.push(obj);
                });
                this.renderTable(0);
            }).catch(err=>{
                console.log(err);
            })
        },
        // 启用/禁用基础数据
        disabledToggle(index) {
            let data = this.treeData[index];
            let id = data.id;
            let status = data.status;
            if(status == '禁用') { // 禁用
                disableBasicData(id).then(res=>{
                    if(res.data.type=='success') {
                        this.$Message.success(res.data.content);
                        this.treeData[index].status='启用';
                        this.treeData[index].type = 'info';
                    }
                }).catch(err=>{
                    console.log(err);
                });
            }else { // 启用
                let status = '0';
                if(data.sortNum==null) data.sortNum = '';
                let jsonData = 'id='+id+'&basicName='+data.basicName+'&status='+status+'&sortNum='+data.sortNum+'&remark='+data.remark;
                editBasicData(jsonData).then(res=>{
                    if(res.data.type=='success') {
                        this.$Message.success('基础数据启用成功');
                        this.treeData[index].status='禁用';
                        this.treeData[index].type = 'error';
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        // 创建详细信息弹出模态框
        addDetailMsg() { 
            this.showAddModal = true;
        },
        // 创建详细信息接口
        saveData(name) { 
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    let param = this.addForm;
                    var dataJson = 'basicCode='+param.basicCode+'&basicName='+param.basicName
                        +'&status='+param.status+'&sortNum='+param.sortNum+'&remark='+param.remark;
                    add(dataJson).then(res=>{
                        if(res.data.type=="success") {
                            this.$Message.success("创建成功");
                            this.cancelAdd();
                            this.treeData = [];
                            this.getPage();
                        }else {
                            this.$Message.error("创建失败");
                        }
                    }).catch(err=>{
                        console.log(err);
                        this.$Message.error("创建失败");
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
            
        },
        checkCode(e) {
            console.log(e);
            console.log(1);
        },
        // 编辑基础数据
        editDetailMsg() {
            this.showEditModal = true;
        },
        // 保存修改基础数据
        saveDataEdit() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let param = this.editForm;
                    if(param.sortNum==null) param.sortNum = '';
                    var dataJson = 'id='+param.id+'&basicCode='+param.basicCode+'&basicName='+param.basicName
                        +'&status='+param.status+'&sortNum='+param.sortNum+'&remark='+param.remark;
                    editBasicData(dataJson).then(res=>{
                        if(res.data.type=="success") {
                            this.$Message.success(res.data.content);
                            this.showEditModal = false;
                            this.treeData = [];
                            this.getPage();
                        }else {
                            this.$Message.error("编辑失败");
                        }
                    }).catch(err=>{
                        console.log(err);
                        this.$Message.error("编辑失败");
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        // 取消创建、隐藏模态框
        cancelAdd() { 
            this.showAddModal = false;
            this.$refs.addForm.resetFields(); // 重置formData数据
        },
        // 取消编辑基础数据
        cancelEdit() {
            this.showEditModal = false;
        },
        // 点击左边列表渲染表格
        renderTable(index) {
            this.activeClass = index;
            let id = this.treeData[index].id;
            this.editForm.basicCode = this.treeData[index].basicCode;
            this.editForm.basicName = this.treeData[index].basicName;
            this.editForm.id = this.treeData[index].id;
            this.editForm.remark = this.treeData[index].remark;
            this.editForm.sortNum = this.treeData[index].sortNum;
            this.editForm.status = this.treeData[index].status;
            this.editForm.type = this.treeData[index].type;
            if(this.editForm.status == '禁用') {
                this.editForm.status = '0';
            }else if(this.editForm.status == '启用'){
                this.editForm.status = '1';
            }
            this.$emit("org-select", id);
        },
    }
}
</script>

<style lang="less" scoped>
    ul{
        padding-top: 10px;
    }
    li{
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
        font-size: 12px;
    }
    .active{
        background: rgb(213, 232, 252);
    }
    .button_box{
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
</style>