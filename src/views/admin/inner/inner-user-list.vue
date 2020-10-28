<template>
<Layout>
    <Sider hide-trigger :style="{minWidth:'300px', background: '#fff'}">
        <Card :padding="10" :style="{height: maxHeight+'px', overflow: 'auto'}">
            <org-tree ref="orgTree" type="inner" @org-select="handleOrgSelect"></org-tree>
        </Card>
    </Sider>
    <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
        <div id="header-div">
            <!-- 查询条件 -->
            <Card>
                <Form ref="formQuery" :label-width='80' inline>
                    <FormItem label="姓名" prop="realName">
                        <Input type="text" v-model.trim="formData.realName" placeholder="请输入姓名" @on-enter="handleSearch" clearable style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="手机" prop="mobile">
                        <Input type="text" v-model.trim="formData.mobile" placeholder="请输入手机号码" @on-enter="handleSearch" clearable style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="职位">
                        <Input type="text" v-model.trim="formData.position" placeholder="请输入职位" @on-enter="handleSearch" clearable style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="状态" prop="disabled">
                        <Select v-model="formData.disabled" placeholder="请选择" @on-change="handleSearch" clearable style="width:200px">
                            <Option value="false">启用</Option>
                            <Option value="true">禁用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="创建时间">
                        <DatePicker type="date" v-model="formData.createDateStart" @on-change="formData.createDateStart=$event" placeholder="开始时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker> 至
                        <DatePicker type="date" v-model="formData.createDateEnd" @on-change="formData.createDateEnd=$event" placeholder="结束时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker>
                    </FormItem>
                    <FormItem label="修改时间">
                        <DatePicker type="date" v-model="formData.modifyDateStart" @on-change="formData.modifyDateStart=$event" placeholder="开始时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker> 至
                        <DatePicker type="date" v-model="formData.modifyDateEnd" @on-change="formData.modifyDateEnd=$event" placeholder="结束时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker>
                    </FormItem>
                    <FormItem label="显示下级" prop="includeSub">
                        <Checkbox v-model="formData.includeSub" @on-change="updateRouterParam"></Checkbox>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSearch()">搜 索</Button>
                        <Button @click="handleResetForm()" style="margin-left: 8px">重 置</Button>
                    </FormItem>
                </Form>
                <div style="position:absolute; left:16px; bottom:8px;">
                    <Tag v-if="showOrgTag" @on-close="handleOrgTagClose" closable>{{fullOrgName}}</Tag>
                </div>
            </Card>
            <!-- 功能键 -->
            <div style="padding:16px 0 8px 0">
                <Button @click="handleSyncSalesMgt" :loading="syncSalesMgtBtnLoading">同步管辖范围</Button>
            </div>
        </div>
        <!-- 查询结果 -->
        <Table border :loading="loading" ref="selection"  @on-row-click="handleRowClick" :columns="columns" :data="tableData" :height="tableHeight" @on-sort-change="handleTableSort"></Table>
        <div id="page-wrap" style="padding-top:8px; text-align:right;">
            <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
    </Content>
</Layout>
</template>

<script>
import {
    find
} from "@/api/adminInner.js";
import {
    getFullOrgName
} from "@/api/org.js";
import {
    syncCustomerToLocal
} from "@/api/sync.js";
import orgTree from "@/components/org-tree";
import $ from 'jquery';

export default {
    data() {
        return {
            formData: {
                realName: '',
                mobile: '',
                position: '',
                disabled: '',
                orgId: '',
                orgLongId: '',
                includeSub: true,
                createDateStart: '',
                createDateEnd: '',
                modifyDateStart: '',
                modifyDateEnd: '',

                orderByClause: 'createDate desc',
                page: 1, // 当前页
                rows: 10 // 每页显示多少条
            },
            maxHeight: 600, // 页面最大高度
            tableHeight: 500, // 表格高度
            syncSalesMgtBtnLoading: false,
            showOrgTag: false, // 是否显示“已选组织”标签
            fullOrgName: '', // 已选组织全称
            total: 0, // 初始化信息总条数
            loading: false,
            tableData: [],
            columns: [{
                    title: '姓名',
                    key: 'realName',
                    sortable: 'custom',
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.editUser(params.row.id);
                                }
                            }
                        }, params.row.realName);
                    }
                },
                {
                    title: '手机',
                    key: 'mobile',
                    sortable: 'custom',
                    width: 120
                },
                {
                    title: '职位',
                    key: 'position',
                    sortable: 'custom',
                },
                {
                    title: '所属组织',
                    key: 'orgName',
                    sortable: 'custom',
                    tooltip: false,
                    minWidth: 250
                },
                {
                    title: '状态',
                    key: 'disabled',
                    sortable: 'custom',
                    width: 80,
                    render: (h, params) => {
                        return h("span", {
                                style: {
                                    color: params.row.disabled ? "#c5c8ce" : "#2db7f5"
                                }
                            },
                            params.row.disabled ? "禁用" : "启用");
                    }
                },
                {
                    title: '创建人',
                    key: 'creater',
                    sortable: 'custom',
                },
                {
                    title: '创建时间',
                    key: 'createDate',
                    sortable: 'custom',
                    render: (h, params) => {
                        return h("span", params.row.createDate == null ? "" : params.row.createDate.substr(0, 16));
                    }
                },
                {
                    title: '修改时间',
                    key: 'modifyDate',
                    sortable: 'custom',
                    render: (h, params) => {
                        return h("span", params.row.modifyDate == null ? "" : params.row.modifyDate.substr(0, 16));
                    }
                }
            ],
            selectDateOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                }
            }
        }
    },
    components: {
        orgTree
    },
    mounted() {
        this.$nextTick(function () {
            this.maxHeight = $('#main-content').height();
            this.tableHeight = this.maxHeight - $('#header-div').outerHeight(true) - $('#page-wrap').outerHeight(true);
        });
    },
    activated() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "内部架构"
            },
            {
                name: "内部人员"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    },
    created() {
        this.fetchData();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            if (typeof this.$route.query.orgLongId == 'undefined') {
                this.$refs.orgTree.cancelSelect();
            }
            if (this.$route.query.refresh != 'false') {
                this.fetchData();
            }
        }
    },
    methods: {
        fetchData() {
            let page = this.$route.query.page;
            let rows = this.$route.query.rows;
            let includeSub = this.$route.query.includeSub;
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
            this.formData.realName = this.$route.query.realName;
            this.formData.mobile = this.$route.query.mobile;
            this.formData.position = this.$route.query.position;
            this.formData.disabled = this.$route.query.disabled;
            this.formData.orgId = this.$route.query.orgId;
            this.formData.orgLongId = this.$route.query.orgLongId;
            this.formData.includeSub = (typeof includeSub == 'undefined' || String(includeSub) == 'true');
            this.formData.createDateStart = this.$route.query.createDateStart;
            this.formData.createDateEnd = this.$route.query.createDateEnd;
            this.formData.modifyDateStart = this.$route.query.modifyDateStart;
            this.formData.modifyDateEnd = this.$route.query.modifyDateEnd;
            this.handleOrgTag(this.formData.orgId);

            this.loading = true;
            find(this.formData).then(data => {
                this.tableData = [];
                this.selection = [];
                if (data.data.code == 200) {
                    this.total = data.data.data.total;
                    data.data.data.list.forEach(item => {
                        this.tableData.push(item);
                    });
                    this.formatTableData();
                }
                this.loading = false;
            })
        },
        handleTableSort(param) { // 排序处理
            if ("asc" == param.order || "desc" == param.order) {
                let key = param.key;
                if (key == "orgName") {
                    key = "orgId";
                }
                this.formData.orderByClause = key + ' ' + param.order;
            } else {
                this.formData.orderByClause = "createDate desc";
            }
            this.formData.page = 1;
            this.updateRouterParam();
        },
           handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
        updateRouterParam() {
            // 修改路由参数值
            this.$router.push({
                query: this.formData
            });
        },
        handleSearch() {
            this.formData.page = 1;
            this.updateRouterParam();
        },
        handleResetForm() {
            this.formData.page = 1;
            this.formData.realName = '';
            this.formData.mobile = '';
            this.formData.position = '';
            this.formData.disabled = '';
            this.formData.orgId = '';
            this.formData.orgLongId = '';
            this.formData.includeSub = true;
            this.formData.createDateStart = '';
            this.formData.createDateEnd = '';
            this.formData.modifyDateStart = '';
            this.formData.modifyDateEnd = '';
            this.$refs.orgTree.cancelSelect();
            this.updateRouterParam();
        },
        changePage(val) {
            this.formData.page = val;
            this.updateRouterParam();
        },
        changePageSize(val) {
            this.formData.rows = val;
            this.updateRouterParam();
        },
        handleOrgTag(orgId) {
            if (typeof orgId == 'undefined' || orgId == null || orgId == '') {
                this.fullOrgName = '';
                this.showOrgTag = false;
                return;
            }
            let params = {
                orgId: orgId
            };
            getFullOrgName(params).then(resp => {
                if (resp.data.code == 200) {
                    this.fullOrgName = resp.data.data;
                    if (this.fullOrgName != null) {
                        this.fullOrgName = "已选组织：" + this.fullOrgName;
                        this.showOrgTag = true;
                    }
                }
            });
        },
        handleOrgTagClose() {
            this.showOrgTag = false;
            this.fullOrgName = '';
            this.formData.orgId = '';
            this.formData.orgLongId = '';
            this.$refs.orgTree.cancelSelect();
            this.updateRouterParam();
        },
        handleOrgSelect(org) {
            this.formData.orgId = (org && org.id) ? String(org.id) : '';
            this.formData.orgLongId = (org && org.longId) ? org.longId : '';
            this.formData.page = 1;
            this.updateRouterParam();
        },
        disableUsers() {
            this.disableBtnLoading = true;
            if (this.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            let userIds = [];
            this.selection.forEach(item => {
                userIds.push(item.id);
            });
            let params = {
                userIds: userIds
            };
            disable(params).then(resp => {
                this.disableBtnLoading = false;
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                    this.fetchData();
                }
            });
        },
        editUser(id) {
            let query = {
                ...this.$route.query,
                view: "userEdit"
            };
            if (id == 0) {
                delete query.id;
            } else {
                query.id = id;
            }
            this.$router.push({
                name: "admin_inner_user_mgr",
                query: query
            });
        },
        handleSyncSalesMgt() {
            this.$Modal.confirm({
                title: '请确认',
                content: '<p>本操作会从主数据系统获取客户信息，并同步销区经理管辖范围，确定继续吗？</p>',
                onOk: () => {
                    this.syncSalesMgtBtnLoading = true;
                    let params = {
                        syncSalesMgt: true
                    }
                    syncCustomerToLocal(params).then(resp => {
                        this.syncSalesMgtBtnLoading = false;
                        if (resp.data.code == 200) {
                            this.$Message.success(resp.data.msg);
                        }
                    });
                }
            });
        },
        formatTableData() {
            if (this.tableData.length == 0) {
                return;
            }
            let orgIds = new Set();
            this.tableData.forEach(item => {
                if (item.orgId != null) {
                    orgIds.add(item.orgId);
                }
            });
            for (let orgId of orgIds.keys()) {
                // 获取组织名称
                getFullOrgName({
                    orgId: orgId
                }).then(resp => {
                    if (resp.data.code == 200) {
                        this.tableData.forEach(item => {
                            if (orgId == item.orgId) {
                                this.$set(item, 'orgName', resp.data.data);
                            }
                        });
                    }
                });
            }
        },
    }
}
</script>
