<template>
    <div class="user">
        <Form :model="formData" :label-width="80">
            <Row type="flex">
                <Col span="4">
                <FormItem label="姓名:">
                    <Input v-model="formData.realName" placeholder="请输入姓名"/>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem label="手机:">
                    <!-- <Input ref="phoneNumber" v-model="formData.mobile" placeholder="请输入手机号" @on-blur="phoneBlur()"/> -->
                    <Input ref="phoneNumber" v-model="formData.mobile" placeholder="请输入手机号"/>

                </FormItem>
                </Col>
                <Col span="4"></Col>
                <Col span="4"></Col>
                <Col span="4">
                <Button @click="handleSearch(formData)">搜索</Button>
                <Button @click="handleResetForm()">重置</Button>
                </Col>
            </Row>
        </Form>
        <div>
            <Table border ref="selection" :loading="loading" :columns="columns4" :data="tableData"></Table>
            <Page :total="total" :page-size="pageSize" :current="current" show-total class="paging" @on-change="changepage"></Page>
        </div>
    </div>
</template>
<script>
    import {
      persionList
    } from "@/api/persionalManage.js";

    export default {
        data() {
            return {
                formData: {
                    realName: null,
                    mobile: ""
                },
                // 初始化信息总条数
                total: 0,
                // 每页显示多少条
                pageSize: 10,
                current: 1, //当前页
                loading: false,
                tableData: [],
                columns4: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "姓名",
                        key: "realName"
                    },
                    {
                        title: "手机",
                        key: "mobile"
                    },
                    {
                        title: "职位",
                        key: "position",
                        width: 100
                    },
                    {
                        title: "所属组织",
                        key: "orgName"
                    },
                    {
                        title: "状态",
                        key: "disabled",
                        width: 100,
                        render: (h, params) => {
                        return h("span", params.row.disabled == false ? "启动" : "禁用");
        }
        },
            {
                title: "创建人",
                  key: "creater",
              width: 100
            },
            {
                title: "创建时间",
                  key: "createDate",
              width: 200
            }
        ]
        }
        },
        mounted(){
            let breadcrumbs = [
                { name: "首页" },
                { name: "demo例子" },
                { name: "url参数查询" }
            ];
            this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        },
        created(){
            this.fetchData();
        },
        watch:{
            // 如果路由有变化，会再次执行该方法
            '$route': 'fetchData'
        },
        methods:{
            fetchData(){
                console.log('fetchData','userURLQuery')
                //获取url参数
                let page = this.$route.query.page;
                let realName = this.$route.query.realName;
                let mobile = this.$route.query.mobile;

                if(page&&!isNaN(page)){
                    this.current = parseInt(page);
                }else{
                    this.current=1;
                }
                //关键字设置到搜索输入框
                this.formData.realName = realName;
                this.formData.mobile = mobile;
                //形成搜索条件查询接口
                let params = {
                    page: this.current,
                    rows: this.pageSize,
                    realName: realName,
                    mobile: mobile
                };
                persionList(params).then(data => {
                    let _this = this;
                    _this.tableData = [];
                    if (data.data.code == 200) {
                        if(data.data.data.pages==1){
                            this.current = 1
                        }
                        this.total = data.data.data.total;
                        let tableDataListOne = data.data.data.list;
                        tableDataListOne.forEach(item => {
                            let obj = {};
                            obj.id = item.id;
                            obj.realName = item.realName;
                            obj.mobile = item.principal;
                            obj.position = item.position;
                            obj.orgName = item.orgName;
                            obj.disabled = item.disabled;
                            obj.creater = item.creater;
                            obj.createDate = item.createDate;
                            _this.tableData.push(obj);
                        });
                    }
                })
            },
            handleSearch(formData){
                //根据搜索框查询条件进行路由跳转
                this.$router.push({
                    query: {
                        realName:formData.realName,
                        mobile:formData.mobile}
                });
            },
            handleResetForm(){
                //清空搜索框内容
                this.formData.realName = "";
                this.formData.mobile = "";
                //根据搜索框查询条件进行路由跳转
                this.$router.push({
                    query: {}
                });
            },
            changepage(val) {
                // 修改路由参数值
                this.$router.push({
                    query: {...this.$route.query,page: val}
                });
            }
        }

    }
</script>
