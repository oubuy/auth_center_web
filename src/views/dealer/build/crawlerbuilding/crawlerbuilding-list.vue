<template>
<div>
    <div id="header-div" style="text-align:left;">
        <Card>
            <Form ref="formData" :model="formData" :label-width='80' inline>
                <FormItem label="楼盘名称">
                    <Input type="text" v-model.trim="formData.buildingName" placeholder="请输入楼盘名称" @on-enter="handleSearch" clearable style="width:150px;"></Input>
                </FormItem>
                <FormItem label="户型名称">
                    <Input type="text" v-model.trim="formData.modelName" placeholder="请输入户型名称" @on-enter="handleSearch" clearable style="width:150px;"></Input>
                </FormItem>
                <FormItem label="地区">
                    <address-select ref="addressSelectRef" :address="address"></address-select>
                </FormItem>
                <FormItem label="详细地址">
                    <Input type="text" v-model.trim="formData.buildingPlace" placeholder="请输入楼盘详细地址" @on-enter="handleSearch" clearable style="width:150px;"></Input>
                </FormItem>
                <FormItem label="同步状态">
                    <Select v-model="formData.status" clearable style="width:150px;">
                        <Option value="0">未同步</Option>
                        <Option value="1">已同步</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSearch()">搜 索</Button>
                    <Button @click="handleResetForm()" style="margin-left: 8px">重 置</Button>
                </FormItem>
            </Form>
        </Card>
        <!-- 功能键 -->
        <div style="padding:16px 0 8px 0">
            <Button :loading="syncBtnLoading" @click="handleSync">同步到楼盘中心</Button>
        </div>
    </div>
    <!-- 查询结果 -->
    <Table border :loading="loading" ref="selection" @on-row-click="handleRowClick" :columns="columns" :data="tableData" :height="tableHeight" @on-selection-change="handleSelectionChange">
        <template slot-scope="{ row, index }" slot="buildingImgOss">
            <table-img v-if="row.buildingImgOss" :data="[row.buildingImgOss]"></table-img>
            <!-- <big-img v-if="row.buildingImgOss" :data="[row.buildingImgOss]"></big-img> -->
        </template>
        <template slot-scope="{ row, index }" slot="modelImageOss">
            <!-- <table-img v-if="row.modelImageOss" :data="[row.modelImageOss]"></table-img> -->
           <big-img v-if="row.modelImageOss" :data="[row.modelImageOss]"></big-img>
        </template>
    </Table>
    <div id="page-wrap" style="padding-top:8px; text-align:right;">
        <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    </div>
</div>
</template>

<script>
import {
    findCrawlerBuilding,
    syncCrawlerBuilding,
    getComInfo
} from "@/api/building.js";
import tableImg from "@/components/build/table-img";
import bigImg from "@/components/build/tableBigImg";
import addressSelect from "@/components/build/address";
import $ from 'jquery';

export default {
    data() {
        return {
            formData: {
                page: 1, // 当前页
                rows: 10, // 每页显示多少条
                buildingName: '',
                modelName: '',
                provinceId: '',
                cityId: '',
                areaId: '',
                buildingPlace: '',
                status: ''
            },
            address: {
                provinceId: '',
                cityId: '',
                areaId: '',
            },
            provinceId: '', // 经销商属性省份ID
            cityId: '', // 经销商属性城市ID
            total: 0, // 初始化信息总条数
            tableHeight: 500, // 表格高度
            loading: false,
            syncBtnLoading: false,
            tableData: [],
            selection: [],
            columns: [{
                    title: '',
                    key: 'index',
                    width: 80,
                    align: 'center'
                }, {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '楼盘名称',
                    key: 'buildingName',
                    minWidth: 150,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.edit(params.row.id);
                                }
                            }
                        }, params.row.buildingName);
                    }
                },
                {
                    title: '楼盘图',
                    key: 'buildingImgOss',
                    slot: 'buildingImgOss',
                    align: 'center',
                    width: 120
                },
                {
                    title: '户型名称',
                    key: 'modelName',
                    width: 150
                },
                {
                    title: '户型图',
                    key: 'modelImageOss',
                    slot: 'modelImageOss',
                    align: 'center',
                    width: 120
                },
                {
                    title: '城市',
                    key: 'cityName',
                    width: 90
                },
                {
                    title: '详细地址',
                    key: 'buildingPlace',
                    width: 200
                },
                {
                    title: '户型布局',
                    key: 'modelLayout',
                    width: 120
                },
                {
                    title: '户型面积',
                    key: 'modelArea',
                    width: 90
                },
                {
                    title: '同步状态',
                    key: 'status',
                    width: 90,
                    render: (h, params) => {
                        let status = params.row.status;
                        return h("span", {
                                style: {
                                    color: status == 1 ? "#c5c8ce" : "#2db7f5"
                                }
                            },
                            status == 1 ? "已同步" : "未同步");
                    }
                },
                {
                    title: '开盘日期',
                    key: 'openingTime',
                    width: 120
                },
                {
                    title: '交房日期',
                    key: 'buildingTime',
                    width: 120
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    width: 100,
                    render: (h, params) => {
                        return h("span", params.row.updateTime == null ? "" : params.row.updateTime.substr(0, 16));
                    }
                }
            ]
        }
    },
    components: {
        addressSelect,
        tableImg,
        bigImg
    },
    mounted() {
        this.$nextTick(function () {
            this.tableHeight = $('#main-content').height() - $('#header-div').outerHeight(true) - $('#page-wrap').outerHeight(true);
        });
    },
    created() {
        getComInfo().then(resp => {
            if (resp.data.code == 200) {
                let com = resp.data.data;
                if (com != null && com.provinceCode && com.cityCode) {
                    this.provinceId = com.provinceCode;
                    this.cityId = com.cityCode;
                }
                this.initFormData();
                this.fetchData();
            }
        });
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            if (this.$route.query.view != 'edit') {
                if (Object.getOwnPropertyNames(this.$route.query).length == 0) {
                    this.initFormData();
                }
                this.fetchData();
            }
        }
    },
    methods: {
        initFormData() {
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
            this.formData.buildingName = this.$route.query.buildingName;
            this.formData.modelName = this.$route.query.modelName;
            if (Object.getOwnPropertyNames(this.$route.query).length == 0 && this.provinceId && this.cityId) {
                this.formData.provinceId = this.provinceId;
                this.formData.cityId = this.cityId;
                this.formData.areaId = '';
            } else {
                this.formData.provinceId = this.$route.query.provinceId ? this.$route.query.provinceId : '';
                this.formData.cityId = this.$route.query.cityId ? this.$route.query.cityId : '';
                this.formData.areaId = this.$route.query.areaId ? this.$route.query.areaId : '';
            }
            this.$refs.addressSelectRef.initAddressInfo(this.formData.provinceId, this.formData.cityId, this.formData.areaId);
            this.formData.buildingPlace = this.$route.query.buildingPlace;
            if (Object.getOwnPropertyNames(this.$route.query).length == 0) {
                this.formData.status = "0";
            } else {
                this.formData.status = this.$route.query.status;
            }
        },
        fetchData() {
            this.loading = true;
            findCrawlerBuilding(this.formData).then(resp => {
                this.tableData = [];
                this.selection = [];
                if (resp.data.code == 200) {
                    this.total = resp.data.data.total;
                    let pageNum = resp.data.data.pageNum;
                    let pageSize = resp.data.data.pageSize;
                    let index = (pageNum - 1) * pageSize + 1;
                    resp.data.data.list.forEach(item => {
                        item.index = index;
                        index++;
                        this.tableData.push(item);
                    });
                }
                this.loading = false;
            });
        },
        updateRouterParam() {
            // 修改路由参数值
            this.$router.push({
                query: this.formData
            });
        },
        handleSelectionChange(selection) {
            this.selection = selection;
        },
        handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
        handleSearch() {
            this.formData.page = 1;
            this.formData.provinceId = this.address.provinceId;
            this.formData.cityId = this.address.cityId;
            this.formData.areaId = this.address.areaId;
            this.formData.v = new Date().getTime();
            this.updateRouterParam();
        },
        handleResetForm() {
            this.formData.page = 1;
            this.formData.buildingName = '';
            this.formData.modelName = '';
            this.formData.provinceId = '';
            this.formData.cityId = '';
            this.formData.areaId = '';
            if (this.provinceId && this.cityId) {
                this.formData.provinceId = this.provinceId;
                this.formData.cityId = this.cityId;
            }
            this.$refs.addressSelectRef.initAddressInfo(this.formData.provinceId, this.formData.cityId, this.formData.areaId);
            this.formData.buildingPlace = '';
            this.formData.status = '0';
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
        handleSync() {
            if (this.selection.length == 0) {
                this.$Message.warning("请至少选择一条数据");
                return;
            }
            this.$Modal.confirm({
                title: '请确认',
                content: '<p>是否将所选楼盘与户型同步到楼盘中心？【同步成功后默认为上架状态】</p>',
                onOk: () => {
                    let ids = [];
                    this.selection.forEach(item => {
                        ids.push(item.id);
                    });
                    this.syncBtnLoading = true;
                    syncCrawlerBuilding({
                        ids
                    }).then(resp => {
                        this.syncBtnLoading = false;
                        if (resp.data.code == 200) {
                            this.$Message.success(resp.data.msg);
                        }
                        this.fetchData();
                    });
                }
            });
        },
        edit(id) {
            this.$emit("goto-edit", id);
        }
    }
}
</script>
