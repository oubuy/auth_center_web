<template>
<div style="text-align:left;">
    <div id="header-div">
        <!-- 查询条件 -->
        <Card>
            <Form ref="formQuery" :label-width='100' inline>
                <FormItem label="客户基本分类">
                    <Select v-model="formData.browseGroupId" placeholder="请选择" @on-change="handleSearch" clearable style="width:150px">
                        <Option v-for="item in browseGroupIdList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="名称">
                    <Input type="text" v-model.trim="formData.name" placeholder="请输入名称" @on-enter="handleSearch" clearable style="width:250px;"></Input>
                </FormItem>
                <FormItem label="ID">
                    <Input type="text" v-model.trim="formData.id" placeholder="请输入ID" @on-enter="handleSearch" clearable style="width:250px;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSearch">搜 索</Button>
                    <Button @click="handleResetForm" style="margin-left: 8px">重 置</Button>
                </FormItem>
            </Form>
        </Card>
        <!-- 功能键 -->
        <div style="padding:16px 0 8px 0">
            <Button @click="syncModal=true">同步主数据客户信息</Button>
            <Button @click="handleSyncSalesMgt" :loading="syncSalesMgtBtnLoading" style="margin-left: 8px">同步销区经理管辖范围</Button>
        </div>
    </div>
    <!-- 查询结果 -->
    <Table border :loading="loading" :columns="columns" :data="tableData" :height="tableHeight" @on-sort-change="handleTableSort"></Table>
    <div id="page-wrap" style="padding-top:8px; text-align:right;">
        <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>

    <!-- 同步主数据客户信息 -->
    <Modal v-model="syncModal" title="同步主数据客户信息">
        <Form ref="syncForm" :model="syncFormData" :label-width="100">
            <FormItem label="客户基本分类">
                <Select v-model="syncFormData.browseGroupId" placeholder="请选择" style="width:250px">
                    <Option value="">全部</Option>
                    <Option v-for="item in browseGroupIdList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" size="large" @click="syncModal=false">取消</Button>
            <Button type="primary" size="large" :loading="syncBtnLoading" @click="handleSyncCustomer">同步</Button>
        </div>
    </Modal>

</div>
</template>

<script>
import {
    findCustomer,
    listBrowseGroupId,
    syncCustomerToLocal,
    syncSalesMgt
} from "@/api/sync.js";
import $ from 'jquery';

export default {
    data() {
        return {
            formData: {
                id: '',
                name: '',
                browseGroupId: '',

                orderByClause: 'number asc',
                page: 1, // 当前页
                rows: 10 // 每页显示多少条
            },
            syncFormData: {
                browseGroupId: '',
            },
            syncModal: false,
            syncBtnLoading: false,
            syncSalesMgtBtnLoading: false,
            browseGroupIdList: [], // 客户基本类型选项
            maxHeight: 600, // 页面最大高度
            tableHeight: 500, // 表格高度
            total: 0, // 初始化信息总条数
            loading: false,
            tableData: [],
            columns: [{
                    title: 'ID',
                    key: 'id',
                    sortable: 'custom',
                    width: 250
                },
                {
                    title: '编码',
                    key: 'number',
                    sortable: 'custom',
                    width: 120
                },
                {
                    title: '名称',
                    key: 'name',
                    sortable: 'custom',
                    minWidth: 300
                },
                {
                    title: '客户类型',
                    key: 'customerType',
                    sortable: 'custom',
                    width: 110
                },
                {
                    title: '是否集团内公司',
                    key: 'isInternalCompany',
                    sortable: 'custom',
                    width: 150
                },
                {
                    title: '条形码',
                    key: 'barCode',
                    sortable: 'custom',
                    width: 100
                },
                {
                    title: '助记码',
                    key: 'mnemonicCode',
                    sortable: 'custom',
                    width: 150
                },
                {
                    title: '生效状态',
                    key: 'effectedStatus',
                    sortable: 'custom',
                    width: 110
                },
                {
                    title: '状态',
                    key: 'usedStatus',
                    sortable: 'custom',
                    width: 100
                },
                {
                    title: '同步时间',
                    key: 'syncTime',
                    sortable: 'custom',
                    width: 150
                }
            ]
        }
    },
    mounted() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "数据同步"
            },
            {
                name: "客户信息同步"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        this.$nextTick(function () {
            this.maxHeight = $('#main-content').height();
            this.tableHeight = this.maxHeight - $('#header-div').outerHeight(true) - $('#page-wrap').outerHeight(true);
        });
    },
    created() {
        this.fetchBrowseGroupIdList();
        this.fetchData();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.fetchData();
        }
    },
    methods: {
        fetchBrowseGroupIdList() {
            listBrowseGroupId().then(resp => {
                if (resp.data.code == 200) {
                    this.browseGroupIdList = resp.data.data;
                }
            });
        },
        fetchData() {
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
            this.formData.id = this.$route.query.id;
            this.formData.name = this.$route.query.name;
            this.formData.browseGroupId = this.$route.query.browseGroupId;
            this.loading = true;
            findCustomer(this.formData).then(resp => {
                this.tableData = [];
                if (resp.data.code == 200) {
                    this.total = resp.data.data.total;
                    resp.data.data.list.forEach(item => {
                        this.tableData.push(item);
                    });
                }
                this.loading = false;
            });
        },
        handleTableSort(param) { // 排序处理
            if ("asc" == param.order || "desc" == param.order) {
                this.formData.orderByClause = param.key + ' ' + param.order;
            } else {
                this.formData.orderByClause = "number asc";
            }
            this.formData.page = 1;
            this.updateRouterParam();
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
        handleSyncCustomer() {
            this.syncBtnLoading = true;
            syncCustomerToLocal(this.syncFormData).then(resp => {
                this.syncBtnLoading = false;
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                    this.syncModal = false;
                }
            });
        },
        handleSyncSalesMgt() {
            this.syncSalesMgtBtnLoading = true;
            syncSalesMgt().then(resp => {
                this.syncSalesMgtBtnLoading = false;
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                }
            });
        },
        handleResetForm() {
            this.formData.page = 1;
            this.formData.id = '';
            this.formData.name = '';
            this.formData.browseGroupId = '';
            this.updateRouterParam();
        },
        changePage(val) {
            this.formData.page = val;
            this.updateRouterParam();
        },
        changePageSize(val) {
            this.formData.rows = val;
            this.updateRouterParam();
        }
    }
}
</script>
