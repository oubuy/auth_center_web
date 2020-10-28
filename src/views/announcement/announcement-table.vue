<template>
    <div>
        <div style="text-align: left;margin-top:20px;padding-bottom:10px;"><Button @click="addPublicity">新增公告</Button></div>
        <Table border :loading="loading" @on-selection-change="handleSelect" :columns="columns" :data="tableData" height="550" style="margin-top:10px;"></Table>
        <Page @on-change="handelPage" class="paging" :total="total" show-total :current="formData.page" :page-size="formData.rows" style="margin-top:10px;text-align:right;"/>
        <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>

<script>
import {announcementList,deleteAnnouncement} from "@/api/announcement.js"
import aletTip from "@/components/alertTip.vue";
export default {
    data() {
        return {
            maxHeight: 680,
            loading: false,
            alertShow: false,
            total: 0,
            formData: {
                page: 1,
                rows: 15,
            },
            alertTipParams: {
                headTip: "删除",
                titleTip: "是否确认删除当前公告？"
            },
            deleteParam: {},
            tableData: [],
            columns: [
                // {
                //     type: "selection",
                //     width: 60,
                //     align: "center",
                //     fixed: 'left'
                // },
                {
                    title: "公告名称",
                    key: "name",
                    align: "center",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer",
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.name
                        );
                    }
                },
                {
                    title: "公告内容",
                    key: "content",
                    align: "center",
                    ellipsis: true,
                    render: (h, params) => {
                        var content = params.row.content;
                        if(content.length>7) {
                            content = content.substr(0,7)+"...";
                        }
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer",
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            content
                        );
                    }
                },
                {
                    title: "发布渠道",
                    align: "center",
                    key: "channel",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.channel
                        );
                    }
                },
                {
                    title: "开始日期",
                    align: "center",
                    key: "begin_date",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.begin_date
                        );
                    }
                },
                {
                    title: "截止日期",
                    align: "center",
                    key: "end_date",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.end_date
                        );
                    }
                },
                {
                    title: "发布状态",
                    align: "center",
                    key: "notice_state",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.notice_state
                        );
                    }
                },
                {
                    title: "启用状态",
                    align: "center",
                    key: "enabled_state",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.enabled_state
                        );
                    }
                },
                {
                    title: "创建人",
                    align: "center",
                    key: "creater",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.creater
                        );
                    }
                },
                {
                    title: "创建日期",
                    align: "center",
                    key: "create_time",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.create_time
                        );
                    }
                },
                {
                    title: "修改人",
                    align: "center",
                    key: "updator",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.updator
                        );
                    }
                },
                {
                    title: "修改日期",
                    align: "center",
                    key: "update_time",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                style: {
                                    cursor: "pointer"
                                },
                                on: {
                                    click: () => {
                                        this.handleRow(params);
                                    }
                                }
                            },
                            params.row.update_time
                        );
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 150,
                    fixed: 'right',
                    align: "center",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                props: {
                                    type: "primary",
                                    size: "small"
                                },
                                style: {
                                    marginRight: "5px"
                                },
                                on: {
                                    click: () => {
                                        this.handleEidt(params);
                                    }
                                }
                                },
                                "编辑"
                            ),
                            h(
                                "Button",
                                {
                                props: {
                                    type: "error",
                                    size: "small"
                                },
                                on: {
                                    click: () => {
                                    this.handleRemove(params);
                                    }
                                }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ]
        }
    },
    components: {
        aletTip
    },
    created() {
        
    },
    mounted() {
        this.getAnnouncementList();
    },
    methods: {
        getAnnouncementList(d) {
            let param = {
                page: this.formData.page,
                rows: this.formData.rows,
            }
            if(d) param=d;
            announcementList(param).then(res=>{
                if(res.data.code==200) {
                    let arr = res.data.data.list;
                    this.total = res.data.data.total;
                    arr.forEach(item=>{
                        if(item.enabled_state==1) item.enabled_state = "启用";
                        else item.enabled_state = "禁用";
                    });
                    this.tableData = arr;
                }
            });
        },
        handleCloseTip(data) {
            if(data=="true") {
                deleteAnnouncement(this.deleteParam).then(res=>{
                    if(res.data.code==200) {
                        this.$Message.success(res.data.msg);
                        this.getAnnouncementList();
                    }
                });
                this.alertShow = false;
            } else {
                this.alertShow = false;
            }
        },
        handleRow(data) {
            this.$parent.showAddModal = true;
            this.$parent.title = "公告详情";
            data.row.details = true;
            this.$emit("return-data",data.row);
        },
        handleSelect() {

        },
        addPublicity() {
            this.$parent.showAddModal = true;
            this.$parent.title = "新增公告";
            this.$emit("return-data","");
        },
        handelPage(val) {
            this.formData.page = val;
            this.getAnnouncementList();
        },
        handleEidt(data) {
            this.$parent.showAddModal = true;
            this.$parent.title = "编辑公告";
            data.row.details = false;
            this.$emit("return-data",data.row);
        },
        handleRemove(data) {
            let param = {};
            param.id = data.row.id;
            this.deleteParam = param;
            this.alertShow = true;
        }
    },
}
</script>

<style>

</style>
    