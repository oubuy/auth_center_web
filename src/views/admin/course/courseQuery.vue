<template>
<div id="wrap-div">
    <Layout>
        <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
            <!-- 查询条件 -->
            <Card>
                <Form ref="formQuery" :label-width='100' inline>
                    <FormItem label="教程名称/创建人" prop="keyword">
                        <Input type="text" v-model="routerParams.keyword" placeholder="请输入教程名称/创建人" clearable style="width:200px"/>
                    </FormItem>
                    <FormItem label="状态" prop="enabled">
                        <Select v-model="routerParams.enabled" placeholder="请选择" clearable style="width:200px">
                            <Option value="true">启用</Option>
                            <Option value="false">禁用</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSearch()">搜 索
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
                <Button type="primary" @click="handleAdd">新增
                </Button>
            </div>
            <!-- 查询结果 -->
            <div>
                <Table border :loading="loading" ref="selection" :columns="columns" :data="tableData"></Table>
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

</div>
</template>

<script>
import licenseAdd from "./course-add";
import { systemList } from "@/api/authod";
import { findMenuList, updateLicense, getFullMenuName, menuSystemName } from "@/api/course.js";
import $ from 'jquery';

export default {
    data() {
        return {
            openEdit:false,
            formData:{
              courseId:'',
              enabled:true,
              description:'',
              licenseCode: ''
            },
            formValidate: {
                description:[
                    { type: 'string', max: 100, message: '不能超过100个字符', trigger: 'blur' }
                ]
            },
            showAddEdit: false,
            showEdit: false,
            showText: '',
            maxHeight: 600, // 页面最大高度
            total: 0, // 初始化信息总条数
            loading: false,
            tableData: [],
            dataTemp: [],
            systemList: [], //所属系统
            courseId: undefined,
            licenseCode: undefined,
            routerParams: {
                licenseCode: undefined,
                page: 1,
                rows: 10,
                systemId: undefined,
                enabled: undefined,
                keyword: undefined
            },
            columns: [
                {
                    title: '教程名称',
                    key: 'name',
                    width: 150,
                    render:(h,params)=>{
                      return h("span",[
                        h("a",{
                          on:{
                            click:event=>{
                              this.handleEidt(params);
                            }
                          }
                        },params.row.name)
                      ])
                    }
                },
                {
                    title: '排序',
                    key: 'seq',
                    width: 150
                },
                // {
                //     title: '匹配菜单',
                //     key: 'menuName',
                //     width: 378
                // },
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
                    title: '创建人',
                    key: 'createdByName',
                    width: 100
                },

                {
                    title: '创建日期',
                    key: 'createdTime',
                    width: 120,
                    render: (h, params) => {
                        return h("span",
                            (params.row.createdTime&&params.row.createdTime!=null) ? params.row.createdTime.substring(0, 10) : "");
                    }
                },
                {
                    title: '修改人',
                    key: 'modifyByName',
                    width: 100
                },

                {
                    title: '修改日期',
                    key: 'modifyTime',
                    width: 120,
                    render: (h, params) => {
                        return h("span",
                            (params.row.modifyTime&&params.row.modifyTime!=null) ? params.row.modifyTime.substring(0, 10) : "");
                    }
                },
                {
                    title: '描述',
                    key: 'description',
                    width: 440
                }
            ]
        }
    },
    components: {
        licenseAdd
    },
    mounted() {
        this.getSystemList();

 let breadcrumbs = [
      {
        name: "教程管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        this.getMenuPageList();
    },
    created() {
        this.$store.dispatch("recordAddress", {});
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': function (val) {
            this.getMenuPageList();
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
                this.getMenuPageList();
            }else{
                this.$Message.warning(response.data.msg)
            }
            }).catch(err=>{
                this.$Message.error(err)
            })
          }
        })
      },
        getMenuPageList() {
            let params = {
                page: 1,
                rows: 10,
                enabled: '',
                keyword: '',
                systemId: '',
            };
            this.loading = true;
            this.dataTable = [];
            this.dataTemp = [];

            let page = this.$route.query.page;
            let rows = this.$route.query.rows;
            let keyword = this.$route.query.keyword;
            let enabled = this.$route.query.enabled;
            let systemId = this.$route.query.systemId;
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
            this.routerParams.keyword = keyword;
            this.routerParams.enabled = enabled;
            this.routerParams.systemId = systemId;

            params.enabled = this.routerParams.enabled;
            params.keyword = this.routerParams.keyword;
            params.page = this.routerParams.page;
            params.rows = this.routerParams.rows;
            params.systemId = this.routerParams.systemId;
            params.seq = this.routerParams.seq;
            findMenuList(params).then(response => {
                if (response.data.code == 200) {
                    this.tableData = response.data.data.list;
                    this.total = response.data.data.total;

                    this.systemIdArr = []; //所属系统id

                    let pageList = response.data.data.list;
                    pageList.forEach(item => {
                        this.systemIdArr.push(item.systemId); //功能
                        this.dataTemp.push(item);
                    });
                    this.getMenuSystemName(this.systemIdArr.join(",")); //系统
                    this.formatTableData();
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
                }
            })
        },
        // 所属系统
        getMenuSystemName(idList) {
            menuSystemName({ ids: idList }).then(response => {
                if (response.data.code == 200) {
                let systemListArr = response.data.data;
                this.dataTemp.forEach(item => {
                    systemListArr.forEach(itemList => {
                        if (item.systemId == itemList.id) {
                            item.system = itemList.name;
                        }
                    });
                });
                this.tableData = this.dataTemp;

                this.loading = false;
                }
            });
        },
        formatTableData() {
            if (this.tableData.length == 0) {
                return;
            }
            let menuIds = new Set();
            this.tableData.forEach(item => {
                if (item.menuId != null) {
                    menuIds.add(item.menuId);
                }
            });
            for (let menuId of menuIds.keys()) {
                // 获取组织名称
                getFullMenuName({
                    menuId: menuId
                }).then(resp => {
                    if (resp.data.code == 200) {
                        this.tableData.forEach(item => {
                            if (menuId == item.menuId) {
                                this.$set(item, 'menuName', resp.data.data);
                            }
                        });
                    }
                });
            }
        },
        getSystemList() {
            systemList().then(response => {
                let systemDataArr = response.data.data;
                systemDataArr.forEach(item => {
                    let obj = {};
                    obj.value = item.id.toString();
                    obj.label = item.name;
                    this.systemList.push(obj);
                });
            });
        },
        handleAdd() {
            this.$router.push({
                path: "/admin/course/addEdit"
            });
        },
        handleEidt(data) {
            this.$router.push({
                path: "/admin/course/addEdit",
                query: {
                    courseId: data.row.id
                }
            });
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
        addLicense(id) { // 生成许可证
            this.licenseCode = undefined;
            this.$refs.selection.selectAll(false);
            this.showAddEdit = true;
            this.showText = '生成许可证';
        },
        handleSearch() {
            this.routerParams.page = 1;
            this.updateRouterParam();
        },
        handleShow() {
            this.showAddEdit = false;
            this.licenseCode = undefined;
            this.systemSelection = [];
            this.getMenuPageList();
        },
        handleClose(data) {
            this.showAddEdit = false;
            this.licenseCode = undefined;
            this.systemSelection = [];
            this.getMenuPageList();
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
