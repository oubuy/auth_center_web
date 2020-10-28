<template>
    <div>
        <div class="buttonList" style="display:flex;padding: 16px 0px 8px;">
            <Button @click="addDetailMsg">新增详细信息</Button>
            <Button @click="edit" style="margin-left:8px;">修改详细信息</Button>
            <Button @click="detailDisable" style="margin-left:8px;">禁用详细信息</Button>
        </div>
        <Table border :loading="loading" @on-selection-change="handleSelect" :columns="columns" :data="tableData" height="550" style="margin-top:10px;"></Table>
        <Page @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" style="margin-top:10px;text-align:right;"/>
        <Modal title="修改详细信息" v-model="showEditModal">
            <Form label="详细信息编码" :label-width="120" ref="editData" :model="editData" :rules="rules">
                <FormItem label="详细信息编码" prop='detailCode'>
                    <span>{{editData.detailCode}}</span>
                </FormItem>
                <FormItem label="详细信息名称" prop='detailName'>
                    <Input v-model.trim="editData.detailName" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="状态" prop="detailStatus">
                    <Select v-model="editData.detailStatus" placeholder="请选择" clearable style="width:25%;">
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序" prop='detailSort'>
                    <Input v-model="editData.detailSort" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="备注" prop='remark'>
                    <Input v-model="editData.remark" type="textarea" clearable style="width:65%;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="saveDataEdit">保存</Button>
                <Button style="margin-left: 8px" @click="cancelEdit()">取消</Button>
            </div>
        </Modal>
        <Modal title="详细信息添加" v-model="showAddModal">
            <Form :label-width="120" ref="formData" :model="formData" :rules="ruleInline">
                <FormItem label="详细信息编码" prop='detailCode'>
                    <Input v-model.trim="formData.detailCode" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="详细信息名称" prop='detailName'>
                    <Input v-model.trim="formData.detailName" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="状态" prop="detailStatus">
                    <Select v-model="formData.detailStatus" placeholder="请选择" clearable style="width:25%;">
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序" prop='detailSort'>
                    <Input v-model="formData.detailSort" clearable style="width:65%;"></Input>
                </FormItem>
                <FormItem label="备注" prop='remark'>
                    <Input v-model="formData.remark" type="textarea" clearable style="width:65%;"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="saveDataAdd">保存</Button>
                <Button style="margin-left: 8px" @click="cancelAdd()">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { getDetailPage, detailDisable, detailEdit, detailAdd, checkDetailCode } from "@/api/basicData.js"
export default {
    data() {
        const validateCodeCheck = (rule, value, callback) => {
            if(!value) {
                callback(new Error('请填写编码'));
            }else {
                this.handleRepeatCode(callback);
            }
        };
        return {
            maxHeight: 680,
            formData: {
                detailCode: '',
                detailName: '',
                detailStatus: '0',
                detailSort: '',
                remark: '',
                basicId: '',
                page: 1,
                rows: 10,
            },
            editData: {
                id:'',
                basicId:'',
                detailName:'',
                detailCode: '',
                detailStatus:'',
                detailSort:'',
                remark:''
            },
            ruleInline: {
                detailCode: [
                    { required: true, trigger: 'blur', validator: validateCodeCheck }
                ],
                detailName: [
                    { required: true, message: '请填写名称', trigger: 'blur' },
                ],
                detailStatus: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ]
            },
            rules: {
                detailName: [
                    { required: true, message: '请填写名称', trigger: 'blur' },
                ],
                detailStatus: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ]
            },
            columns: [{
                    type: "selection",
                    width: 60,
                    align: "center",
                    fixed: 'left'
                },
                {
                    title: "详细信息编码",
                    key: "detailCode",
                },
                {
                    title: "详细信息名称",
                    key: "detailName",
                },
                {
                    title: "状态",
                    key: "detailStatus"
                },
                {
                    title: "排序",
                    key: "detailSort"
                },
                {
                    title: "备注",
                    key: "remark"
                },
            ],
            tableData: [],
            total: 0,
            loading: true,
            showAddModal: false,
            showEditModal: false,
            ids: [],
            singleData: []
        }
    },
    props: ['basicId'],
    created() {

    },
    mounted() {

    },
    methods: {
        //获取表格数据
        getTable(d) { 
            this.loading = true;
            let param = {};
            if(d) this.formData = d;
            param.detailName = this.formData.detailName;
            param.detailStatus = this.formData.detailStatus;
            param.page = this.formData.page;
            param.rows = this.formData.rows;
            param.basicId = this.formData.basicId;
            if(param.detailStatus=="null") param.detailStatus='';
            // 请求接口
            getDetailPage(param).then(res=>{ 
                this.total = res.data.total;
                let dataArr = res.data.rows;
                dataArr.forEach(item=>{
                    if(item.detailStatus==0) item.detailStatus = '启用';
                    else if(item.detailStatus==1) item.detailStatus = '禁用';
                });
                this.tableData = dataArr;
                this.loading = false;
            }).catch(err=>{
                console.log(err);
            })
        },
        // 表格勾选对象的id
        handleSelect(d) { 
            this.ids = [];
            this.singleData = d;
            d.forEach(item=>{
                this.ids.push(item.id)
            });
        },
        // 翻页
        handelPage(val) {
            this.formData.page = val;
            this.getTable();
        },
        // 点击修改按钮弹出模态框
        edit() { 
            console.log(this.singleData);
            if(!this.singleData.length||!this.singleData) {
                this.$Message.warning("请选择一个目标进行修改");
                return;
            }
            if(this.singleData.length>1) {
                this.$Message.warning("只能勾选一个目标进行修改");
                return;
            }
            let singleData = this.singleData;
            singleData.forEach(item=>{
                this.editData.id = item.id;
                this.editData.basicId = item.basicId;
                this.editData.detailName = item.detailName;
                this.editData.detailCode = item.detailCode;
                this.editData.detailStatus = item.detailStatus;
                this.editData.detailSort = item.detailSort;
                this.editData.remark = item.remark;
            });
            if(!this.editData.detailSort) this.editData.detailSort='';
            if(this.editData.detailStatus=="启用") this.editData.detailStatus='0';
            else this.editData.detailStatus='1';
            this.showEditModal = true;
        },
        // 创建详细信息接口
        saveDataAdd() { 
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    let param = this.formData;
                    var dataJson = 'basicId='+param.basicId+'&detailCode='+param.detailCode+'&detailName='+param.detailName
                        +'&detailStatus='+param.detailStatus+'&detailSort='+param.detailSort+'&remark='+param.remark;
                    detailAdd(dataJson).then(res=>{
                        if(res.data.type=="success") {
                            this.$Message.success("创建成功");
                            this.cancelAdd();
                            this.formData.detailStatus = 'null';
                            this.getTable();
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
        // 禁用接口调用
        detailDisable() { 
            if(!this.ids.length||!this.ids) {
                this.$Message.warning("请勾选需要操作的目标");
                return;
            }
            // 接口调用
            detailDisable(this.ids).then(res=>{ 
                console.log(res);
                if(res.data.type=="success") {
                    this.$Message.success(res.data.content);
                    this.$refs.editData.resetFields();
                    this.getTable();
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 保存修改的数据
        saveDataEdit() { 
            this.$refs.editData.validate((valid) => {
                if (valid) {
                    let param = this.editData;
                    var dataJson = 'id='+param.id+'&basicId='+param.basicId+'&detailCode='+param.detailCode+'&detailName='+param.detailName
                        +'&detailStatus='+param.detailStatus+'&detailSort='+param.detailSort+'&remark='+param.remark;
                    // 接口调用
                    detailEdit(dataJson).then(res=>{ 
                        if(res.data.type=='success') {
                            this.$Message.success(res.data.content);
                            this.singleData = [];
                            this.cancelEdit();
                            this.getTable();
                        }
                    }).catch(err=>{
                        console.log(err);
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
            
        },
        // 创建时处理重复编码的数据
        handleRepeatCode(callback) { 
            let param = this.formData;
            var dataJson = 'basicId='+param.basicId+'&detailCode='+param.detailCode;
            // 接口调用
            checkDetailCode(dataJson).then(res=>{ 
                if(res.status==200) {
                    if(res.data) callback();
                    else callback(new Error("该编码已存在"));
                }
            }).catch(err=>{
                console.log(err);
            })
        },
        // 取消修改，隐藏模态框
        cancelEdit() { 
            this.showEditModal = false;
            this.$refs.editData.resetFields(); // 重置formData数据
        },
        // 取消创建
        cancelAdd() { 
            this.showAddModal = false;
            this.$refs.formData.resetFields(); // 重置formData数据
        },
        addDetailMsg() { 
            this.showAddModal = true;
        },
    },
}
</script>

<style>

</style>
