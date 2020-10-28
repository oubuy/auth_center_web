<template>
<div id="wrap-div">
    <Layout>
        <Layout>
            <Sider hide-trigger :style="{minWidth:'300px',background:'#fff'}">
                <Card :style="{height: maxHeight+'px', overflow: 'auto'}">
                    <org-tree ref="orgTree" type="userOuter" :selectedId="selectedId" :expandIds="expandIds" @child-disabled="handleDisabled" @org-select="handleOrgSelect" @org-toggle-expand="handleOrgToggleExpand" @child-dom="handleDom"></org-tree>
                </Card>
            </Sider>
            <Content class="rightContent" :style="{textAlign:'left',paddingLeft:'15px',background:'#fff'}">
                <div id="header-div">
                    <Card>
                        <Form ref="formInline" :label-width='70' :model="formData" inline>
                            <FormItem label="编号">
                                <InputNumber v-model="formData.orgId" :precision="0" :min="1" style="width:120px"></InputNumber >
                            </FormItem>
                            <FormItem label="组织名称">
                                <Input v-model="formData.orgName" clearable placeholder="请输入组织名称" style="width:150px"></Input>
                            </FormItem>
                            <FormItem label="类型" prop="type">
                                <Select v-model="formData.type" label-in-value multiple clearable style="width:150px">
                                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="地区" prop="address">
                                <address-select :addressInfo="address" @child-province="handleProvince" @child-city="handleCity" @child-area="handleArea"></address-select>
                            </FormItem>
                            <FormItem label="编码" style="width:200px">
                                <Input v-model="formData.baseCstCode" clearable placeholder="请输入编码"></Input>
                            </FormItem>
                            <FormItem label="创建时间" style="width:445px">
                                <date-picker type="date" style="width: 150px" v-model="formData.startCreateDate" clearable placeholder="开始时间" @on-change="handleStartCreateDateChange"></date-picker>&nbsp;&nbsp;至&nbsp;&nbsp;
                                <date-picker type="date" style="width: 150px" v-model="formData.endCreateDate" clearable placeholder="开始时间" @on-change="handleEndCreateDateChange"></date-picker>
                            </FormItem>
                            <FormItem label="修改时间" style="width:415px">
                                <date-picker type="date" style="width: 150px" v-model="formData.startModifyDate" clearable placeholder="开始时间" @on-change="handleStartModifyDateChange"></date-picker>&nbsp;&nbsp;至&nbsp;&nbsp;
                                <date-picker type="date" style="width: 150px" v-model="formData.endModifyDate" clearable placeholder="开始时间" @on-change="handleEndModifyDateChange"></date-picker>
                            </FormItem>
                            <FormItem label="显示禁用">
                                <Checkbox v-model="formData.showDisabled"></Checkbox>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSearch()">搜 索</Button>
                                <Button @click="handleResetForm()" style="margin-left: 8px">重 置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <div style="padding:15px 0 15px 0" class="buttonList">
                        <new-add :style="{ display: showOuterOrgAdd }"></new-add>
                        <Button size="small" @click="handleEdit()" style="margin-left: 8px;" :style="{ display: showOuterOrgEdit }"> 编辑</Button>
                        <Button size="small" @click="hadnleDelete()" style="margin-left: 8px" :style="{ display: showOuterOrgDisabled }">禁用</Button>
                        <Button size="small" @click="handleEndisable()" style="margin-left: 8px" :style="{ display: showOuterOrgEnabled }">启用</Button>
                        <Button size="small" @click="handleDownLoadOrg()" style="margin-left: 8px" :style="{ display: showOuterOrgExport }">导出数据</Button>
                    </div>
                </div>
                <!-- table表格 -->
                <div>
                    <Table :height="tableHeight" :loading="loading" ref="table" @on-row-click="handleRowClick" border @on-sort-change="handleTableSort" :columns="columns" :data="tableData" @on-selection-change="handleSelectionChange"></Table>
                    <div id="page-wrap" style="padding-top:8px; text-align:right;">
                        <Page show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" :total="total" show-total :page-size="formData.rows" @on-page-size-change="changePageSize" :current="formData.page" />
                    </div>
                </div>
            </Content>

            <Modal v-model="showLeaveExecls" title="导出数据选项">
                <Form ref="formLeave" :model="formLeave" :label-width="80">
                    <FormItem label="导出范围：">
                        <RadioGroup v-model="formLeave.selectAll">
                            <Radio label="1">全部</Radio>
                            <Radio label="0">勾选的数据</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="导出内容：">
                        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                            <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                        </div>
                        <CheckboxGroup v-model="formLeave.names" @on-change="checkAllGroupChange">
                            <Checkbox :label="item" v-for="(item,index) in checkAllGroupData" :key="index"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>

                </Form>
                <div slot="footer">
                    <Button type="primary" :disabled="loadFinishFalg" @click="handleLeaveOk">确定</Button>
                    <Button style="margin-left: 8px" :disabled="loadFinishFalg" @click="handleLeaveCancel">取消</Button>
                </div>
            </Modal>

        </Layout>
    </Layout>

</div>
</template>

<script>
import orgTree from "@/components/org-tree";
import addressSelect from "@/components/address";
import {
    getTable,
    outTypeList,
    outHeightOrgName,
    outUserNumber,
    outDelet,
    outEndisable,
    checkPermission
} from "@/api/outerOrg.js";
import $ from "jquery";

import newAdd from "@/views/admin/outer/newAdd"; //新增按钮
import axios from "axios";

export default {
    computed: {
        selectedId() {
            return this.$store.getters.treeSelectedId;
        },
        expandIds() {
            return this.$store.getters.treeExpandIds;
        }
    },
    data() {
        return {
           
            typeList: [], //外部类型
            typeObj: {}, //列表中的类型
            loadFinishFalg: false,
            showLeaveExecls: false,
            //      secletiongList: [],
            showOuterOrgAdd:'none',
            showOuterOrgEdit:'none',
            showOuterOrgDisabled:'none',
            showOuterOrgEnabled:'none',
            showOuterOrgExport:'none',

            formLeave: {
                //导出
                selectAll: "0",
                names: []
            },
            indeterminate: false,
            checkAll: false,
            checkAllGroupData: [
                "ID",
                "名称",
                "类型",
                "上级组织",
                "编码",
                "条形码",
                "状态",
                "地址",
                "经纬度",
                "电话",
                "当前员工总数",
                "员工上限",
                "创建人",
                "创建时间"
            ],

            formData: {
                orgId: null,
                orgName: "",
                startCreateDate: "",
                endCreateDate: "",
                startModifyDate: "",
                endModifyDate: "",
                type: [],
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                longId: null, //treeId
                page: 1, //当前页
                rows: 10, //每页显示多少条
                baseCstCode: "", //编码
                disabled: false,
                orderByClause: null,
                showDisabled: false
            },
            pageParentParams: {
                pageParentId: "",
                pageParentName: ""
            },

            maxHeight: 600, // 页面最大高度
             tableHeight: 450, // 表格高度
            total: 0, //总数
            address: {}, //地区
            loading: false,
            tableTemp: [], //临时存储数据
            multipleSelection: [], //勾选中的值
            tableData: [],
            tableTwoTemp: [],
            userIds: [], //获取可用员工数量的id
            columns: [{
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "编号",
                    key: "id",
                    sortable: "custom",
                    width: 100
                },
                {
                    title: "组织名称",
                    key: "org_name",
                    align: "left",
                    width: 360,
                    sortable: "custom",
                    render: (h, params) => {
                        let strParams = params.row;
                        return h("div", [
                            h("orgColoms", {
                                props: {
                                    parentIds: strParams,
                                    data_List: this.tableData
                                }
                            })
                        ]);
                    }
                },
                {
                    title: "类型",
                    key: "type",
                    width: 80,
                    sortable: "custom",
                    render: (h, params) => {
                        return h(
                            "div",
                            params.row.type ? this.typeObj[params.row.type] : ""
                        );
                    }
                },
                {
                    title: "上级组织",
                    key: "parentOrg",
                    width: 250
                },
                {
                    title: "SAP编码",
                    key: "sap_code",
                    sortable: "custom",
                    width: 105
                },
                {
                    title: "编码",
                    key: "base_cst_code",
                    // base_cst_code
                    sortable: "custom",
                    width: 80
                },
                {
                    title: "状态",
                    key: "disabled",
                    width: 80,
                    sortable: "custom",
                    render: (h, params) => {
                        return h(
                            "span", {
                                style: {
                                    color: params.row.disabled == true ? "#c5c8ce" : "#2db7f5"
                                }
                            },
                            params.row.disabled == false ? "启用" : "禁用"
                        );
                    }
                },
                {
                    title: "地址",
                    key: "address",
                    sortable: "custom",
                    width: 180
                },
                {
                    title: "经纬度",
                    key: "lng_lat",
                    sortable: "custom",
                    width: 160
                },
                {
                    title: "电话",
                    key: "phone",
                    sortable: "custom",
                    width: 120
                },
                {
                    title: "员工上限",
                    key: "max_user_num",
                    sortable: "custom",
                    width: 120,
                    //  width: 100,
                    render: (h, params) => {
                        return h(
                            "span",
                            params.row.max_user_num ? params.row.max_user_num : "-"
                        );
                    }
                },
                {
                    title: "当前员工总数", //要接口
                    width: 120,
                    // sortable: "custom",
                    key: "user_Number"
                },
                {
                    title: "创建人",
                    key: "creater",
                    sortable: "custom",
                    width: 170
                },
                {
                    title: "修改时间",
                    key: "modify_date",
                    sortable: "custom",
                    width: 170
                },
                {
                    title: "创建时间",
                    key: "create_date",
                    sortable: "custom",
                    width: 190
                },

                {
                    title: "备注",
                    key: "remark",
                    width: 190
                }
            ],
            ativeAutoLeft: true
        };
    },
    components: {
        orgTree,
        addressSelect,
        newAdd
    },
    created() {
        this.initFormatter(); // 为Date 对象添加Format方法
    },
    mounted() {
        // this.breadcrumbs = [{name:'123'}]
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "经销商组织"
            },
            {
                name: "外部组织"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

        this.fetchData();
        this.getOutTypeList();

        this.checkPermission();

        // this.$nextTick(function() {
        //   this.maxHeight = $("#wrap-div")
        //     .parent()
        //     .height();
        // });
        this.$nextTick(function () {        
            this.maxHeight = $("#wrap-div").height();
            
            this.tableHeight =
                this.maxHeight -
                $("#header-div").outerHeight(true) -
                $("#page-wrap").outerHeight(true);
        });
    },
    methods: {
        handleStartCreateDateChange(changeTime, type) {
            this.formData.startCreateDate = changeTime;

            if (
                this.formData.endCreateDate != "" &&
                this.formData.endCreateDate != null
            ) {
                if (
                    this.formData.startCreateDate != "" &&
                    this.formData.startCreateDate != null
                ) {
                    let dateValue = new Date(this.formData.startCreateDate);
                    let dateValue2 = new Date(this.formData.endCreateDate);

                    if (dateValue > dateValue2) {
                        this.formData.startCreateDate = "";
                        this.$Message.warning("开始时间不能大于结束时间");
                    }
                }
            }
        },
        handleEndCreateDateChange(changeTime, type) {
            this.formData.endCreateDate = changeTime;

            if (
                this.formData.endCreateDate != "" &&
                this.formData.endCreateDate != null
            ) {
                if (
                    this.formData.startCreateDate != "" &&
                    this.formData.startCreateDate != null
                ) {
                    let dateValue = new Date(this.formData.startCreateDate);
                    let dateValue2 = new Date(this.formData.endCreateDate);

                    if (dateValue > dateValue2) {
                        this.formData.endCreateDate = "";
                        this.$Message.warning("开始时间不能大于结束时间");
                    }
                }
            }
        },
        handleStartModifyDateChange(changeTime, type) {
            this.formData.startModifyDate = changeTime;

            if (
                this.formData.endModifyDate != "" &&
                this.formData.endModifyDate != null
            ) {
                if (
                    this.formData.startModifyDate != "" &&
                    this.formData.startModifyDate != null
                ) {
                    let dateValue = new Date(this.formData.startModifyDate);
                    let dateValue2 = new Date(this.formData.endModifyDate);

                    if (dateValue > dateValue2) {
                        this.formData.startModifyDate = "";
                        this.$Message.warning("开始时间不能大于结束时间");
                    }
                }
            }
        },
        handleEndModifyDateChange(changeTime, type) {
            this.formData.endModifyDate = changeTime;

            if (
                this.formData.endModifyDate != "" &&
                this.formData.endModifyDate != null
            ) {
                if (
                    this.formData.startModifyDate != "" &&
                    this.formData.startModifyDate != null
                ) {
                    let dateValue = new Date(this.formData.startModifyDate);
                    let dateValue2 = new Date(this.formData.endModifyDate);

                    if (dateValue > dateValue2) {
                        this.formData.endModifyDate = "";
                        this.$Message.warning("开始时间不能大于结束时间");
                    }
                }
            }
        },
        handleDownLoadOrg() {
            this.showLeaveExecls = true;
            this.checkAll = true;
            this.formLeave.names = this.checkAllGroupData;
        },
        download(response) {
            if (!response) {
                return;
            }

            if (response.headers.fail) {
                if (response.headers.fail == "userId is null") {
                    this.$Message.warning("用户ID为空");
                    return;
                }

                if (response.headers.fail == "permission is null") {
                    this.$Message.warning("用户没有权限");
                    return;
                }
            } else {
                this.$Message.warning("下载失败");
                return;
            }

            let url = window.URL.createObjectURL(new Blob([response.data]));
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "组织信息表.xlsx");

            document.body.appendChild(link);
            link.click();
        },
        checkAllGroupChange(data) {
            // console.log(data, 8888888888888);
            this.formLeave.names = data;
            if (data.length === this.checkAllGroupData.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = false;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.formLeave.names = this.checkAllGroupData;
            } else {
                this.formLeave.names = [];
            }
        },
        handleLeaveOk() {
            this.loadFinishFalg = true;

            if (this.formLeave.names.length == 0) {
                this.$Message.warning("请勾选导出的内容");
                this.loadFinishFalg = false;
                return;
            }

            let namesTemp = this.formLeave.names;
            namesTemp = namesTemp.join(",");

            let selectAllTemp = this.formLeave.selectAll;
            let selectionOrgList = this.multipleSelection;

            if (selectAllTemp == "0") {
                if (selectionOrgList.length == 0) {
                    this.$Message.warning("当前没有勾选的组织");
                    this.loadFinishFalg = false;
                    return;
                }
            }

            let idsTemp = [];
            selectionOrgList.forEach(item => {
                idsTemp.push(item.id);
            });

            //--------------
            let tmp = this.formData.type;

            if (tmp.length > 0) {
                tmp = this.formData.type.join(",");
            }

            let dataTemp = {};

            dataTemp.type = tmp;
            dataTemp.provinceCode = this.formData.provinceCode;
            dataTemp.cityCode = this.formData.cityCode;
            dataTemp.districtCode = this.formData.districtCode;
            dataTemp.longId = this.formData.longId;
            dataTemp.baseCstCode = this.formData.baseCstCode;
            dataTemp.disabled = this.formData.disabled;

            dataTemp.orgId = this.formData.orgId;
            dataTemp.orgName = this.formData.orgName;
            dataTemp.startCreateDate = this.formData.startCreateDate;
            dataTemp.endCreateDate = this.formData.endCreateDate;
            dataTemp.startModifyDate = this.formData.startModifyDate;
            dataTemp.endModifyDate = this.formData.endModifyDate;
            dataTemp.showDisabled = this.formData.showDisabled;

            //      let orderByClause=this.formData.orderByClause;
            //--------------
            dataTemp.ids = idsTemp.join(",");
            dataTemp.selectAll = selectAllTemp;
            dataTemp.names = namesTemp;
            //            console.info(dataTemp);

            axios({
                    method: "get",
                    url: "/rest/exportOuterOrganizations",
                    params: dataTemp,
                    responseType: "blob"
                })
                .then(response => {
                    this.download(response);
                    this.loadFinishFalg = false;
                    this.showLeaveExecls = false;
                })
                .catch(error => {
                    this.$Message.warning("下载组织失败");
                    this.loadFinishFalg = false;
                    return;
                });
        },
        handleLeaveCancel() {
            this.showLeaveExecls = false;
        },

        handleTableSort(param) {
            if ("asc" == param.order || "desc" == param.order) {
                this.formData.orderByClause = "o" + "." + param.key + " " + param.order;
            } else {
                this.formData.orderByClause = null;
            }
            this.formData.page = 1;
            this.updateRouterParam();
        },
        handleDisabled(data) {
            if (!data) {
                // 不显示禁用
                this.formData.disabled = false;
            } else {
                //        delete this.formData.disabled;
                this.formData.disabled = true;
            }

            // this.formData.disabled=data;
            this.updateRouterParam();
        },

        fetchData() {
            //如果无参数（即点击了菜单），则清空原有选中状态
            if (!this.$route.query.page) {
                this.$store.dispatch("setTreeSelectedId", -1);
                this.$store.dispatch("setTreeExpandIds", []);
                this.formData.page = 1;
                this.formData.rows = 10;
                this.formData.provinceCode = "";
                this.formData.cityCode = "";
                this.formData.districtCode = "";
                this.formData.type = [];
                this.formData.longId = null;
                this.formData.orgId = null;
                this.formData.orgName = "";
                this.formData.startCreateDate = "";
                this.formData.endCreateDate = "";
                this.formData.startModifyDate = "";
                this.formData.endModifyDate = "";
                this.formData.showDisabled = false;
                this.address = {};
                this.$refs.orgTree.cancelSelect();
            }

            let page = this.$route.query.page;
            let rows = this.$route.query.rows;

            if (page && !isNaN(page)) {
                this.formData.page = parseInt(page);
            } else {
                this.formData.page = 1;
            }
            if (rows && !isNaN(rows)) {
                this.formData.rows = parseInt(rows);
            } else {
                this.formData.rows = 10;
            }
            let routeType = this.$route.query.type;

            if (typeof routeType == "string") {
                this.formData.type = routeType.split(",");
            }

            this.formData.provinceCode = this.$route.query.provinceCode;
            this.formData.cityCode = this.$route.query.cityCode;
            this.formData.districtCode = this.$route.query.districtCode;
            this.formData.longId = this.$route.query.longId;
            this.formData.baseCstCode = this.$route.query.baseCstCode;
            this.formData.orderByClause = this.$route.query.orderByClause;
            this.formData.orgId = this.$route.query.orgId ? this.$route.query.orgId : null;
            this.formData.orgName = this.$route.query.orgName;
            this.formData.startCreateDate = this.$route.query.startCreateDate;
            this.formData.endCreateDate = this.$route.query.endCreateDate;
            this.formData.startModifyDate = this.$route.query.startModifyDate;
            this.formData.endModifyDate = this.$route.query.endModifyDate;

            if (
                this.$route.query.showDisabled == undefined ||
                this.$route.query.showDisabled == ""
            ) {
                this.formData.showDisabled = false;
            } else {
                if (this.$route.query.showDisabled == "false") {
                    this.formData.showDisabled = false;
                } else {
                    this.formData.showDisabled = true;
                }
            }

            //      var value2 = this.$route.query.showDisabled;
            //      var value3 = this.$route.query.type;

            let params = {};
            params.page = this.formData.page;
            params.rows = this.formData.rows;
            params.provinceCode = this.formData.provinceCode;
            params.cityCode = this.formData.cityCode;
            params.districtCode = this.formData.districtCode;
            params.longId = this.formData.longId;
            params.baseCstCode = this.formData.baseCstCode;

            //      var value = this.formData.type;

            if (this.formData.type.length > 0) {
                params.type = this.formData.type.join(",");
            }
            params.disabled = this.formData.disabled;
            params.orderByClause = this.formData.orderByClause;
            params.orgId = this.formData.orgId;
            params.orgName = this.formData.orgName;

            //      let dateValue2 = this.formData.startCreateDate.getTime();
            //      if(this.formData.startCreateDate){
            params.startCreateDate = this.formData.startCreateDate;
            //      }
            //      if(this.formData.endCreateDate){
            params.endCreateDate = this.formData.endCreateDate;
            //      }
            //      if(this.formData.startModifyDate){
            params.startModifyDate = this.formData.startModifyDate;
            //      }
            //      if(this.formData.endModifyDate){
            params.endModifyDate = this.formData.endModifyDate;
            //      }
            params.showDisabled = this.formData.showDisabled;

            this.$store.dispatch("recordTreeLongId", this.formData.longId);

            this.loading = true;
            this.tableData = [];
            this.tableTemp = [];

            getTable(params).then(response => {
                if (response.data.code == 200) {
                    this.total = response.data.data.total;
                    let resultArr = response.data.data.list;
                    let idArr = []; //获取上级组织的id
                    this.userIds = []; //获取可用员工数量的id
                    resultArr.forEach(item => {
                        this.userIds.push(item.id);
                        if (item.parent_id) {
                            idArr.push(item.parent_id);
                        } else {
                            item.parentOrg = "顶级";
                        }

                        this.tableTemp.push(item);
                    });
                    this.getOutHeightOrgList(idArr.join(",")); //上级组织
                }
            });
        },
        // 修改路由参数值
        updateRouterParam() {
            let query = Object.assign(this.formData, this.pageParentParams);
            this.$router.push({
                query: query
            });
        },
        handleDom(data) {
            this.$store.dispatch("recordElement", data);
        },
        // 获取外部组织搜索的类型
        getOutTypeList() {
            outTypeList().then(response => {
                if (response.data.code == 200) {
                    let typeArr = response.data.data;
                    typeArr.forEach(item => {
                        let obj = {};
                        obj.value = item.id;
                        obj.label = item.text;
                        this.typeList.push(obj);
                        // 列表中类型
                        this.typeObj[item.id] = item.text;
                    });
                }
            });
        },
        // 获取外部组织列表上级组织
        getOutHeightOrgList(heightOrgId) {
            this.tableTwoTemp = [];
            outHeightOrgName({
                ids: heightOrgId
            }).then(response => {
                if (response.data.code == 200) {
                    let dataValueArr = response.data.data;
                    if (dataValueArr.length != 0) {
                        this.tableTemp.forEach(item => {
                            dataValueArr.forEach(itemArr => {
                                if (item.parent_id == itemArr.id) {
                                    item.parentOrg = itemArr.orgLongName;
                                }
                            });
                            this.tableTwoTemp.push(item);
                        });

                        this.getOutUserNumberList(this.userIds.join(",")); //当前员工总数
                    } else {
                        this.tableTemp.forEach(item => {
                            this.tableTwoTemp.push(item);
                        });
                        this.getOutUserNumberList(this.userIds.join(",")); //当前员工总数
                    }
                }
            });
        },
        // 获取可用员工数量
        getOutUserNumberList(userOrgId) {
            outUserNumber({
                ids: userOrgId
            }).then(response => {
                if (response.data.code == 200) {
                    let userValueData = response.data.data;
                    userValueData.forEach(item => {
                        this.tableTwoTemp.forEach(itemArr => {
                            if (item.id == itemArr.id) {
                                itemArr.user_Number = item.userNum;
                                // this.tableData.push(itemArr)
                            }
                        });
                    });

                    this.tableData = this.tableTwoTemp;
                    // console.log(this.tableData,'tableData')
                    this.loading = false;
                }
            });
        },
        handleOrgToggleExpand(org, expandNodes) {
            if (expandNodes && expandNodes.length > 0) {
                let expandIds = new Array();
                for (let i = 0; i < expandNodes.length; i++) {
                    expandIds.push(expandNodes[i]);
                }
                this.$store.dispatch("setTreeExpandIds", expandIds);
            }
        },
        handleOrgSelect(org, root) {
            this.$store.dispatch("setTreeSelectedId", org.id);

            this.pageParentParams.pageParentId = org.id;
            this.pageParentParams.pageParentName = org.title;

            this.formData.longId = org.longId;
            this.formData.page = 1;
            this.updateRouterParam();
        },
        handleProvince(val) {
            this.formData.provinceCode = val.value;
        },
        handleCity(val) {
            this.formData.cityCode = val.value;
        },
        handleArea(val) {
            this.formData.districtCode = val.value;
        },
        initFormatter() {
            Date.prototype.Format = function (fmt) {
                console.log(fmt,888888)
                //
                let o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    S: this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(
                        RegExp.$1,
                        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
                    );
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(
                            RegExp.$1,
                            RegExp.$1.length == 1 ?
                            o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length)
                        );
                return fmt;
            };
        },
        handleSearch() {
            this.formData.page = 1;
            let tmp = this.formData.type;

            if (typeof this.formData.startCreateDate == "object") {
                this.formData.startCreateDate = this.formData.startCreateDate.Format(
                    "yyyy-MM-dd"
                );
            }

            if (typeof this.formData.endCreateDate == "object") {
                this.formData.endCreateDate = this.formData.endCreateDate.Format(
                    "yyyy-MM-dd"
                );
            }

            if (typeof this.formData.startModifyDate == "object") {
                this.formData.startModifyDate = this.formData.startModifyDate.Format(
                    "yyyy-MM-dd"
                );
            }

            if (typeof this.formData.endModifyDate == "object") {
                this.formData.endModifyDate = this.formData.endModifyDate.Format(
                    "yyyy-MM-dd"
                );
            }

            if (!tmp && typeof tmp != "undefined" && tmp != 0) {
                this.formData.type = null;
            } else {
                if (typeof this.formData.type == "string") {
                    this.formData.type = this.formData.type.split(",");
                }

                //        if(this.formData.type==""){
                //          this.formData.type=[];
                //        }else{
                this.formData.type = this.formData.type.join(",");
                //        }
            }

            this.formData.longId = null;
            this.$refs.orgTree.cancelSelect();

            this.updateRouterParam();
        },
        handleResetForm() {
            this.formData.orgId = null;
            this.formData.orgName = "";
            this.formData.startCreateDate = "";
            this.formData.endCreateDate = "";
            this.formData.startModifyDate = "";
            this.formData.endModifyDate = "";
            //      this.formData.endModifyDate = null;
            this.formData.showDisabled = false;
            this.formData.disabled = false;
            this.formData.page = 1;
            this.formData.rows = 10;
            this.formData.provinceCode = "";
            this.formData.cityCode = "";
            this.formData.districtCode = "";
            this.formData.baseCstCode = "";
            this.formData.type = [];
            this.formData.longId = null;
            this.address = {};
            this.$refs.orgTree.cancelSelect();
            this.updateRouterParam();
        },
        // 获取勾选值
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
             handleRowClick(value, index) {
      this.$refs.table.toggleSelect(index);
    },
        // 禁用
        hadnleDelete() {
            if (this.multipleSelection.length == 0) {
                this.$Message.warning("请勾选禁用选项！");
            } else if (this.multipleSelection.length > 1) {
                this.$Message.warning("只能一条一条禁用！");
            } else {
                let paramsDelet = this.multipleSelection;
                let deleteId = [];
                for (let i = 0; i < paramsDelet.length; i++) {
                    deleteId.push(paramsDelet[i].id.toString());
                }
                outDelet({
                    organizationIdList: deleteId
                }).then(response => {
                    if (response.data.code == 200) {
                        this.$Message.success(response.data.msg);
                        this.multipleSelection = [];
                        this.fetchData();
                    }
                });
            }
        },
        // 启用
        handleEndisable() {
            if (this.multipleSelection.length == 0) {
                this.$Message.warning("请勾选启用选项！");
            } else if (this.multipleSelection.length > 1) {
                this.$Message.warning("只能一条一条启用！");
            } else {
                let paramsEndisable = this.multipleSelection;
                let endisableId = [];
                for (let i = 0; i < paramsEndisable.length; i++) {
                    endisableId.push(paramsEndisable[i].id.toString());
                }
                outEndisable({
                    organizationIdList: endisableId
                }).then(response => {
                    if (response.data.code == 200) {
                        this.$Message.success(response.data.msg);
                        this.multipleSelection = [];
                        this.fetchData();
                    }
                });
            }
        },
        // 需改页码数
        changePage(val) {
            this.formData.page = val;
            this.updateRouterParam();
        },
        changePageSize(val) {
            this.formData.rows = val;
            this.updateRouterParam();
        },
        // 编辑
        handleEdit() {
            if (this.multipleSelection.length == 0) {
                this.$Message.warning("请勾选启用选项！");
            } else if (this.multipleSelection.length > 1) {
                this.$Message.warning("只能一条一条编辑！");
            } else {
                let paramsObj = this.multipleSelection[0];
                if (paramsObj.type) {
                    if (paramsObj.type == "DEALER") {
                        //经销商
                        if (paramsObj.id) {
                            this.$router.push({
                                path: "/admin/outer/orgDealer",
                                query: {
                                    id: paramsObj.id
                                }
                            });
                        }
                    } else if (paramsObj.type == "OTHER") {
                        //其他
                        this.$router.push({
                            path: "/admin/outer/orgOtherType",
                            query: {
                                id: paramsObj.id,
                                orgTherType: "orgOther"
                            }
                        });
                    } else {
                        //门店/部门
                        this.$router.push({
                            path: "/admin/outer/orgShopType",
                            query: {
                                id: paramsObj.id
                            }
                        });
                    }
                } else {
                    // this.$Message.warning("数据错误!");
                    //其他
                    this.$router.push({
                        path: "/admin/outer/orgOtherType",
                        query: {
                            id: paramsObj.id
                        }
                    });
                }
            }
        },
        checkPermission() {
            let params = {};
            checkPermission(params).then(response => {
                if (response.data.code == 200) {
                    if(response.data.data.isOuterOrgAdd == true){
                         this.showOuterOrgAdd = ''
                    }
                    if(response.data.data.isOuterOrgEdit == true){
                        this.showOuterOrgEdit = ''
                    }
                    if(response.data.data.isOuterOrgDisabled == true){
                        this.showOuterOrgDisabled = ''
                    }
                    if(response.data.data.isOuterOrgEnabled == true){
                        this.showOuterOrgEnabled = ''
                    }
                    if(response.data.data.isOuterOrgExport == true){
                        this.showOuterOrgExport = ''
                    }
                }else{
                    this.$Message.warning(response.data.msg)
                }
            })
        }
    },
    watch: {
        $route: function () {
            this.fetchData();
        },
        "formData.showDisabled": {
            deep: true,
            handler: function (newVal, oldVal) {
                this.handleSearch()
            }
        }
    }
};
</script>

<style lang="less" scoped>
.paging {
    text-align: right;
    margin-top: 10px;
}

.buttonList {
    display: flex;
}

.leftContent {
    min-width: 344px !important;
    background: rgb(255, 255, 255);
}
</style>
