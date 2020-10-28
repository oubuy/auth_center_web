<template>
<div id="wrap-div">
    <Layout>
        <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
            <!-- 查询条件 -->
            <Card>
                <Form ref="formQuery" :label-width='80' inline>
                    <FormItem label="激活码" prop="licenseCode">
                        <Input type="text" v-model="routerParams.licenseCode" placeholder="请输入许可证号" clearable style="width:200px"/>
                    </FormItem>
                    <FormItem label="激活状态" prop="activated">
                        <Select v-model="routerParams.activated" placeholder="请选择" clearable style="width:200px">
                            <Option value="true">已激活</Option>
                            <Option value="false">未激活</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="启用状态" prop="enabled">
                        <Select v-model="routerParams.enabled" placeholder="请选择" clearable style="width:200px">
                            <Option value="true">启用</Option>
                            <Option value="false">禁用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="激活码类型" prop="activatedType">
                        <Select v-model="routerParams.activatedType" placeholder="请选择" clearable style="width:200px">
                            <Option value="交互大屏">交互大屏</Option>
                            <Option value="电脑">电脑</Option>
                            <Option value="内部使用">内部使用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="激活经销商" prop="activatedDealerName">
                        <Input type="text" v-model="routerParams.activatedDealerName" placeholder="请输入激活经销商" clearable style="width:200px"/>
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input type="text" v-model="routerParams.remark" placeholder="请输入备注信息" clearable style="width:200px"/>
                    </FormItem>
                    <FormItem label="创建人" prop="createdByName">
                        <Input type="text" v-model="routerParams.createdByName" placeholder="请输入创建人" clearable style="width:200px"/>
                    </FormItem>
                    <FormItem label="最近使用经销商" prop="lastVerifyDealerName">
                        <!-- <Input type="text" v-model="routerParams.lastVerifyDealerId" placeholder="请输入所属经销商" clearable style="width:200px"/> -->
                        <!-- @on-select="handleSearch" -->
                        <AutoComplete v-model.trim="routerParams.lastVerifyDealerName" :data="dealerList" @on-search="handleSearchDealer" @on-focus="handleFocus" placeholder="请输入经销商名称" clearable></AutoComplete>
                        <!-- <Cascader :render-format="format" filterable v-model="belongDealerNameId" :data="categoryCascaderData" change-on-select style="width:200px;"></Cascader> -->
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSearch()">搜 索
                        </Button>
                        <Button @click="handleResetForm()" style="margin-left: 8px">重 置
                        </Button>
                    </FormItem>
                </Form>
                <!--<div>-->
                <!--<Tag v-if="showOrgTag"-->
                <!--@on-close="handleOrgTagClose"-->
                <!--closable>{{fullOrgName}}-->
                <!--</Tag>-->
                <!--</div>-->
            </Card>
            <!-- 功能键 -->
            <div style="padding:15px 0 15px 0">
               <Button type="primary" @click="addLicense" :style="{ display: showLicenceMgtAdd }">生成激活码</Button>

                <Button type="primary" @click="showBeginEndTime" :style="{ display: showLicenceMgtResetTime }">设置生效时间</Button>

                <Poptip confirm title="重置激活码后需要重新激活才能使用，是否确认重置？" @on-ok="resetActivated" ok-text="确定" cancel-text="取消">
                    <Button type="primary" :style="{ display: showResetActivated }">重置激活码</Button>
                </Poptip>
                <!-- <Poptip trigger="hover" title="谨慎操作" content="禁用后交互屏程序需要用新的激活码重新激活">
            <Button size="small" type="error" ghost
              @click="disableLicense()"
              style="margin-left: 8px">禁用 
            </Button>
          </Poptip> -->
                <Poptip confirm title="是否确认要禁用选中的激活码？" @on-ok="disableLicense" ok-text="确定" cancel-text="取消">
                    <Button type="error" style="margin-left: 8px" :style="{ display: showLicenceMgtDisabled }">禁用</Button>
                </Poptip>
            </div>
            <!-- 查询结果 -->
            <div>
                <Table border :loading="loading" ref="selection" :columns="columns" :data="tableData" @on-selection-change="handleLicenseSelectionChange"></Table>
                <Page :total="total" :page-size="routerParams.rows" :current="routerParams.page" show-total class="paging" @on-change="changePage"></Page>
            </div>

            <Modal v-model="showAddEdit" :title='showText'>
                <license-add :licenseCode="licenseCode" @child-show="handleShow" @child-back="handleClose"></license-add>
                <div slot="footer"></div>
            </Modal>

            <!-- <Modal v-model="showEdit" :title='showText'>
                <license-edit :licenseCode="licenseCode" @child-show="handleShow" @child-back="handleClose"></license-edit>
                <div slot="footer"></div>
            </Modal> -->

        </Content>
    </Layout>

    <div>
      <Drawer title="激活码"  placement="right" v-model="openEdit" width="400" :mask-closable="false" >
        <Form ref="editForm" :model="formData" :rules="formValidate" :label-width="60">
            <FormItem label="激活码">
                <Input disabled v-model="formData.licenseCode"/>
            </FormItem>
            <FormItem label="启用状态">
                <i-switch v-model="formData.enabled" size="large">
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                </i-switch>
            </FormItem>
            <FormItem prop="remark" label="备注">
                <Input v-model="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"/>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="update" :style="{ display: showLicenceMgtEdit }">保存</Button>
                <Button style="margin-left: 8px" @click="openEdit = false">取消</Button>
            </FormItem>
        </Form>
      </Drawer>
    </div>

    <div>
      <Drawer title="设置生效时间"  placement="right" v-model="openBeginEndTime" width="400" :mask-closable="false" >
        <Form ref="beginEndTimeForm" :model="formData" :rules="formValidate" :label-width="60">
            <FormItem label="激活码">
                <Input disabled v-model="formData.licenseCode"/>
            </FormItem>
            <FormItem label="开始时间">
                <DatePicker type="datetime" v-model="formData.beginTime" @on-change="formData.beginTime=$event"  :editable="false" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间">
                <DatePicker type="datetime" v-model="formData.endTime" @on-change="formData.endTime=$event"  :editable="false" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="updateBeginEndTime">保存</Button>
                <Button style="margin-left: 8px" @click="openBeginEndTime = false">取消</Button>
            </FormItem>
        </Form>
      </Drawer>
    </div>
</div>
</template>

<script>
import licenseAdd from "./license-add";

import {
    findLicenseList,
    disableLicenseByIdList,
    updateLicense,
    saveBeginEndTime,
    checkPermission,
    resetActivated,
    getLicenseInfo
} from "@/api/license.js";
import {findDealer} from "@/api/adminOuter.js";
import $ from 'jquery';

export default {
    data() {
        return {
            times: 0,
            dataArr: [],
            categoryCascaderData: [],
            belongDealerNameId: [],
            openEdit:false,
            openBeginEndTime:false,
            showLicenceMgtEdit:'none',
            showLicenceMgtDisabled:'none',
            showLicenceMgtResetTime:'none',
            showLicenceMgtAdd:'none',
            showResetActivated:'none',
            formData:{
              licenseCode:'',
              enabled:true,
              remark:'',
              beginTime:'',
              endTime:''
            },
            formValidate: {
                remark:[
                    { type: 'string', max: 100, message: '不能超过100个字符', trigger: 'blur' }
                ]
            },
            showAddEdit: false,
            showEdit: false,
            showText: '',
            maxHeight: 600, // 页面最大高度
            //        showOrgTag: false, // 是否显示“已选组织”标签
            //        fullOrgName: '', // 已选组织全称
            //        address: {},
            dealerList: [],
            total: 0, // 初始化信息总条数
            loading: false,
            tableData: [],
            licenseSelection: [],
            licenseCode: undefined,
            routerParams: {
                licenseCode: undefined,
                page: 1,
                rows: 10,
                activated: undefined,
                enabled: undefined,
                activatedDealerName: undefined,
                activatedShopName: undefined,
                remark: undefined,
                createdByName: undefined,
                lastVerifyDealerName: undefined,
                activatedType: undefined
            },
            columns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '激活码',
                    key: 'licenseCode',
                    width: 180,
                    fixed: 'left',
                    render:(h,params)=>{
                      return h("span",[
                        h("a",{
                          on:{
                            click:event=>{
                              this.formData.licenseCode = params.row.licenseCode
                              this.formData.enabled = params.row.enabled
                              this.formData.remark = params.row.remark
                              this.openEdit = true
                            }
                          }
                        },params.row.licenseCode)
                      ])
                    }
                },
                {
                    title: '激活人',
                    key: 'activatedByName',
                    width: 80
                },
                {
                    title: '激活日期',
                    width: 100,
                    key: 'activatedTime',
                    render: (h, params) => {
                        return h("span",
                            (params.row.activatedTime&&params.row.activatedTime!=null) ? params.row.activatedTime.substring(0, 10) : "");
                    }
                },
                {
                    title: '激活状态',
                    key: 'activated',
                    width: 90,
                    render: (h, params) => {
                        return h("span", {
                                style: {
                                    color: params.row.activated ? "#2db7f5" : "#c5c8ce"
                                }
                            },
                            params.row.activated ? "已激活" : "未激活");
                    }
                },
                {
                    title: '启用状态',
                    key: 'enabled',
                    width: 90,
                    render: (h, params) => {
                        return h("span", {
                                style: {
                                    color: params.row.enabled ? "#2db7f5" : "#c5c8ce"
                                }
                            },
                            params.row.enabled ? "启用" : "禁用");
                    }
                },
                {
                    title: '最近使用人',
                    width: 100,
                    key: 'lastVerifyRealname'
                },
                {
                    title: '激活经销商',
                    width: 150,
                    key: 'activatedDealerName'
                    // width: 220
                },
                {
                    title: '最近使用经销商',
                    width: 150,
                    key: 'lastVerifyDealerName'
                    // width: 220
                },
                {
                    title: '有效时间',
                    key: 'lastVerifyUsername',
                    width: 175,
                    render: (h, params) => {
                        let timeInfo = "";
                        if (params.row.beginTime) {
                        timeInfo = params.row.beginTime.substring(0, 10) + "至无限制";
                        }
                        if (params.row.endTime) {
                        timeInfo = "无限制至" + params.row.endTime.substring(0, 10);
                        }
                        if (params.row.beginTime && params.row.endTime) {
                        timeInfo = params.row.beginTime.substring(0, 10) + "至" + params.row.endTime.substring(0, 10);
                        }
                        return h("div", timeInfo);
                    }
        
                },
                {
                    title: "修改人/修改时间",
                    key: "",
                    width: 160,
                    render: (h, params) => {
                        let updateInfo = "";
                        if (params.row.modifyTime) {
                        updateInfo = params.row.modifyTime.substring(0, 10);
                        }
                        if (params.row.modifyByName) {
                        updateInfo = params.row.modifyByName.substring(0, 10);
                        }
                        if (params.row.modifyTime && params.row.modifyByName) {
                        updateInfo = params.row.modifyByName + " / " + params.row.modifyTime.substring(0, 10);
                        }
                        return h("div", updateInfo);
                    }
                },
                {
                    title: '最近登录日期',
                    key: 'lastVerifyTime',
                    width: 110,
                    render: (h, params) => {
                        return h("span",
                            (params.row.lastVerifyTime&&params.row.lastVerifyTime!=null) ? params.row.lastVerifyTime.substring(0, 10) : "");
                    }
                },
                {
                    title: '激活码类型',
                    width: 100,
                    key: 'activatedType'
                },
                {
                    title: '创建人',
                    width: 90,
                    key: 'createdByName'
                },
                {
                    title: '备注',
                    key: 'remark',
                    width: 100,
                    fixed:'right'
                }
            ]
        }
    },
    components: {
        licenseAdd
    },
    mounted() {
        let breadcrumbs = [
            {
                name: "交互屏管理"
            },
            {
                name: "激活码管理"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

        this.getLicensePageList();
        this.checkPermission();
    },
    created() {
        this.$store.dispatch("recordAddress", {});
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.getLicensePageList();
        }
    },
    methods: {
      update(){
        this.$refs.editForm.validate(valid => {
          if (valid) {
            updateLicense(this.formData).then(response=>{
            if (response.data.code == 200) {
                this.$Message.success(response.data.msg)
                this.openEdit = false
                this.getLicensePageList();
            }else{
                this.$Message.warning(response.data.msg)
            }
            }).catch(err=>{
                this.$Message.error(err)
            })
          }
        })



      },
        getLicensePageList() {
            let params = {
                page: 1,
                rows: 10,
                licenseCode: '',
                activated: '',
                enabled: '',
                activatedDealerName: '',
                activatedShopName: '',
                remark: '',
                createdByName: '',
                lastVerifyDealerName: '',
                activatedType: ''
            };
            this.loading = true;
            this.dataTable = [];
            let licenseCode = this.$route.query.licenseCode;
            let page = this.$route.query.page;
            let rows = this.$route.query.rows;
            let activated = this.$route.query.activated;
            let enabled = this.$route.query.enabled;
            let activatedDealerName = this.$route.query.activatedDealerName;
            let activatedShopName = this.$route.query.activatedShopName;
            let remark = this.$route.query.remark;
            let createdByName = this.$route.query.createdByName;
            let lastVerifyDealerName = this.$route.query.lastVerifyDealerName;
            let activatedType = this.$route.query.activatedType;
            if (page != undefined) {
                this.routerParams.page = Number(page);

            } else {
                this.routerParams.page = 1;
            }
            if (rows != undefined) {
                this.routerParams.rows = Number(rows);
            } else {
                this.routerParams.rows = 10;
            }
            this.routerParams.licenseCode = licenseCode;
            this.routerParams.activated = activated;
            this.routerParams.enabled = enabled;
            this.routerParams.activatedDealerName = activatedDealerName;
            this.routerParams.activatedShopName = activatedShopName;
            this.routerParams.remark = remark;
            this.routerParams.createdByName = createdByName;
            this.routerParams.lastVerifyDealerName = lastVerifyDealerName;
            this.routerParams.activatedType = activatedType;

            params.licenseCode = this.routerParams.licenseCode;
            params.page = this.routerParams.page;
            params.rows = this.routerParams.rows;
            params.activated = this.routerParams.activated;
            params.enabled = this.routerParams.enabled;
            params.activatedDealerName = this.routerParams.activatedDealerName;
            params.activatedShopName = this.routerParams.activatedShopName;
            params.remark = this.routerParams.remark;
            params.createdByName = this.routerParams.createdByName;
            params.lastVerifyDealerName = this.routerParams.lastVerifyDealerName;
            params.activatedType = this.routerParams.activatedType;
            findLicenseList(params).then(response => {
                if (response.data.code == 200) {
                    this.tableData = response.data.data.list;
                    this.total = response.data.data.total;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }
            })
        },
        changePage(val) {
            this.routerParams.page = val;
            this.updateRouterParam();
        },
        updateRouterParam() {
            // 修改路由参数值
            this.$router.push({
                query: this.routerParams
            });
        },
        addLicense(id) { // 生成激活码
            this.licenseCode = undefined;
            this.$refs.selection.selectAll(false);
            this.licenseSelection = [];
            this.showAddEdit = true;
            this.showText = '生成激活码';
        },
        showBeginEndTime() {
            if (this.licenseSelection.length == 0) {
                this.$Message.warning("请选择一条数据");
                return;
            } else if (this.licenseSelection.length > 1) {
                this.$Message.warning("只能选择一条数据");
                return;
            }
            let params = {};
            params.licenseCode = this.licenseSelection[0].licenseCode;
            getLicenseInfo(params).then(response => {
                if (response.data.code == 200) {
                    this.formData.licenseCode = response.data.data.licenseCode;
                    this.formData.beginTime = response.data.data.beginTime;
                    this.formData.endTime = response.data.data.endTime;
                    this.openBeginEndTime = true;
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }
            })
        },
        updateBeginEndTime() {
            let params = {};
            params.licenseCode = this.formData.licenseCode;
            params.beginTime = this.formData.beginTime;
            params.endTime = this.formData.endTime;
            if(this.formData.beginTime == ''){
                this.$Message.warning("请填写开始时间");
                return;
            }
            if(this.formData.endTime == ''){
                this.$Message.warning("请填写结束时间");
                return;
            }
            if(this.formData.beginTime > this.formData.endTime){
                this.$Message.warning("开始时间必须早于结束时间");
                return;
            }
            saveBeginEndTime(params).then(response => {
                if (response.data.code == 200) {
                    this.$Message.success(response.data.msg)
                    this.openBeginEndTime = false
                    this.getLicensePageList();
                }else{
                    this.$Message.warning(response.data.msg)
                }
            })
            
        },
        checkPermission() {
            let params = {};
            checkPermission(params).then(response => {
                if (response.data.code == 200) {
                    if(response.data.data.isLicenceMgtEdit == true){
                         this.showLicenceMgtEdit = ''
                    }
                    if(response.data.data.isLicenceMgtDisabled == true){
                        this.showLicenceMgtDisabled = ''
                    }
                    if(response.data.data.isLicenceMgtResetTime == true){
                        this.showLicenceMgtResetTime = ''
                    }
                    if(response.data.data.isLicenceMgtAdd == true){
                        this.showLicenceMgtAdd = ''
                    }
                    if(response.data.data.isLicenceMgtResetActivated == true){
                        this.showResetActivated = ''
                    }
                }else{
                    this.$Message.warning(response.data.msg)
                }
            })
        },
        resetActivated() {
            if (this.licenseSelection.length == 0) {
                this.$Message.warning("请选择一条数据");
                return;
            } else if (this.licenseSelection.length > 1) {
                this.$Message.warning("只能选择一条数据");
                return;
            }
            let params = {};
            params.licenseCode = this.licenseSelection[0].licenseCode;
            resetActivated(params).then(response => {
                if (response.data.code == 200) {
                    this.$Message.success(response.data.msg)
                    this.getLicensePageList();
                }else{
                    this.$Message.warning(response.data.msg)
                }
            })
        },
        editSystem() { // 编辑
            if (this.systemSelection.length == 0) {
                this.$Message.warning("请选择一条数据");
                return;
            } else if (this.systemSelection.length > 1) {
                this.$Message.warning("只能选择一条数据");
                return;
            }

            this.licenseCode = this.systemSelection[0].id;

            this.showAddEdit = true;
            this.showText = '编辑';
        },
        disableLicense() {
            if (this.licenseSelection.length == 0) {
                this.$Message.warning("请勾选选项！");
            } else {
                let licenseSelectionTemp = this.licenseSelection;
                let disableId = [];
                for (let i = 0; i < licenseSelectionTemp.length; i++) {
                    disableId.push(licenseSelectionTemp[i].licenseCode.toString());
                }
                //          console.info('disableId == ' + disableId)
                disableLicenseByIdList({
                    licenseCodes: disableId
                }).then(response => {
                    if (response.data.code == 200) {
                        this.$Message.success(response.data.msg);
                        this.licenseSelection = [];
                        this.getLicensePageList();
                    }
                });
            }
        },
        handleSearch() {
            this.routerParams.page = 1;
            this.updateRouterParam();
        },
        handleResetForm() {
            this.routerParams.page = Number(1);
            this.routerParams.rows = Number(10);
            this.routerParams.licenseCode = undefined;
            this.routerParams.activated = undefined;
            this.routerParams.enabled = undefined;
            this.routerParams.activatedDealerName = undefined;
            this.routerParams.activatedShopName = undefined;
            this.routerParams.remark = undefined;
            this.routerParams.createdByName = undefined;
            this.routerParams.lastVerifyDealerName = undefined;
            this.belongDealerNameId = [];
            this.dealerList = [];
            this.updateRouterParam();
        },
        handleLicenseSelectionChange(selection) {
            this.licenseSelection = selection;
        },
        handleEidt(data) {
            //        console.info('editSystem',data.row.id)
            this.licenseCode = data.row.id;

            this.showEdit = true;
            this.showText = '编辑';
            //        this.$emit("system-edit", data.row);
        },
        handleShow() {
            this.showAddEdit = false;
            this.licenseCode = undefined;
            this.systemSelection = [];
            this.getLicensePageList();
        },
        handleClose(data) {
            this.showAddEdit = false;
            this.licenseCode = undefined;
            this.systemSelection = [];
            this.getLicensePageList();
        },
        handleSearchDealer(value) {
            if (value == '') {
                return;
            }
            let params = {
                dealerName: value
            };
            findDealer(params).then(data => {
                if (data.data.code == 200) {
                    this.dealerList = [];
                    data.data.data.list.forEach(item => {
                        this.dealerList.push(item.orgName);
                    });
                }
            });
        },
        handleFocus(e) {
            if(e.target.value=='') this.dealerList = [];
        }
    }
}
</script>

<style scoped>
.paging {
    text-align: right;
    margin-top: 10px;
}
</style>
