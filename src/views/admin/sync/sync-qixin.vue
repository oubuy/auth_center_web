<template>
<div style="text-align:left;">
    <Row :gutter="16">
        <Col span="12">
        <Card dis-hover :style="{height: mainContentHeight+'px', overflow: 'hidden'}">
            <Row :gutter="16">
                <Col span="12">
                <div id="orgOptDiv">
                    <div style="margin-bottom:16px;">
                        <Button :loading="syncQixinBtnLoading" @click="handleSyncOrgToQixin()">同步组织到企信</Button>
                    </div>
                    <div>
                        <Input v-model.trim="orgName" placeholder="请输入组织名称，按回车键搜索" @on-enter="filterOrgTreeData" clearable ></Input>
                    </div>
                    <div style="padding:5px 0; margin-bottom:10px;">
                        <Checkbox v-model="showDisabled" @on-change="filterOrgTreeData">显示禁用</Checkbox>
                    </div>
                </div>
                <Tree :data="orgTreeData" @on-select-change="handleOrgSelect" ref="orgTree" :style="{overflow: 'auto', height: orgTreeHeight+'px'}"></Tree>
                </Col>
                <Col span="12">
                <div id="syncUserBtnDiv" style="margin-bottom:16px;">
                    <Button @click="handleSyncUserToQixin()">同步人员到企信</Button>
                </div>
                <Table :columns="userColumns" :data="userData" @on-selection-change="handleUserSelectionChange" :height="userTableHeight"></Table>
                </Col>
            </Row>
            <Spin v-if="orgTreeSpinShow" fix></Spin>
        </Card>
        </Col>
        <Col span="12">
        <Card dis-hover title="企信数据" :style="{height: mainContentHeight+'px', overflow: 'hidden'}">
            <p slot="title">企信数据</p>
            <a href="javascript:void(0)" slot="extra" @click="fetchQixinOrgTreeData">刷新</a>
            <Row :gutter="16">
                <Col span="12">
                <Tree :data="qixinOrgTreeData" @on-select-change="handleQixinOrgSelect" :style="{overflow: 'auto', height: qixinUserTableHeight+'px'}"></Tree>
                </Col>
                <Col span="12">
                <Table :columns="qixinUserColumns" :data="qixinUserData" :style="{overflow: 'auto', height: qixinUserTableHeight+'px'}"></Table>
                </Col>
            </Row>
            <Spin v-if="qixinOrgTreeSpinShow" fix></Spin>
        </Card>
        </Col>
    </Row>
</div>
</template>

<script>
import {
    syncOrgToQixin,
    getAllOrgs,
    getQixinOrgs,
    findUsers,
    getQixinUsers,
    syncUserToQixin
} from "@/api/sync.js";
import $ from 'jquery';

export default {
    data() {
        return {
            orgName: "",
            showDisabled: false, // 是否显示禁用
            mainContentHeight: 600,
            orgTreeHeight: 400,
            userTableHeight: 400,
            qixinUserTableHeight: 400,
            orgTreeData: [],
            orgTreeDataCache: [],
            orgTreeSpinShow: false,
            qixinOrgTreeData: [],
            qixinOrgTreeSpinShow: false,
            syncQixinBtnLoading: false,
            userColumns: [{
                type: 'selection',
                width: 50,
                align: 'center'
            }, {
                title: '姓名/手机/职位',
                key: 'userInfo',
                render: (h, params) => {
                    return h("span", {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [h("span", {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, params.row.realName + " (" + params.row.mobile + ")"), h("span", {
                        style: {
                            display: 'inline-block',
                            width: '100%',
                            color: '#9ea7b4'
                        }
                    }, params.row.position)]);
                }
            }, {
                title: '状态',
                key: 'disabled',
                width: 60,
                render: (h, params) => {
                    return h("span", {
                            style: {
                                color: params.row.disabled ? "#c5c8ce" : "#2db7f5"
                            }
                        },
                        params.row.disabled ? "禁用" : "启用");
                }
            }],
            userData: [],
            qixinUserColumns: [{
                title: '姓名/手机/职位',
                key: 'userInfo',
                render: (h, params) => {
                    return h("span", {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, [h("span", {
                        style: {
                            display: 'inline-block',
                            width: '100%'
                        }
                    }, params.row.name + " (" + params.row.mobile + ")"), h("span", {
                        style: {
                            display: 'inline-block',
                            width: '100%',
                            color: '#9ea7b4'
                        }
                    }, params.row.position)]);
                }
            }],
            qixinUserData: [],
            userSelection: []
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
                name: "企信同步"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        this.$nextTick(function () {
            this.mainContentHeight = $('#main-content').height();
            this.orgTreeHeight = this.mainContentHeight - $('#orgOptDiv').outerHeight(true) - 35 - 8;
            this.userTableHeight = this.mainContentHeight - $('#syncUserBtnDiv').outerHeight(true) - 35;
            this.qixinUserTableHeight = this.mainContentHeight - 35 - 48;
        });
    },
    created() {
        this.fetchOrgTreeData();
        this.fetchQixinOrgTreeData();
    },
    watch: {
        orgName: function (val) {
            if (val == "") {
                this.filterOrgTreeData();
            }
        }
    },
    methods: {
        fetchOrgTreeData() {
            this.orgTreeSpinShow = true;
            getAllOrgs({}).then(resp => {
                if (resp.data.code == 200) {
                    this.orgTreeDataCache = [];
                    let treeList = this.handleOrgQueryResult(resp.data.data);
                    treeList.forEach(item => {
                        this.orgTreeDataCache.push(item);
                    });
                    this.filterOrgTreeData();
                }
                this.orgTreeSpinShow = false;
            });
        },
        filterOrgTreeData() {
            let treeData = [];
            this.orgTreeDataCache.forEach(item => {
                treeData.push(this.copyNode(item));
            });
            this.filterOrgTreeNode(treeData);
            this.orgTreeData = treeData;
            this.userData = [];
        },
        filterOrgTreeNode(treeData) {
            for (let i = 0; i < treeData.length; i++) {
                let item = treeData[i];
                if (this.orgName != '') {
                    item.expand = true;
                }
                if (item.children.length > 0) {
                    this.filterOrgTreeNode(item.children);
                }
                if (item.children.length == 0) {
                    if (!this.showDisabled && item.isDisabled || this.orgName != '' && item.orgName.indexOf(this.orgName) == -1) {
                        treeData.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
                        i--; // 如果不减，将漏掉一个元素
                    }
                }
            }
        },
        copyNode(node) { // 拷贝树节点
            let obj = {};
            obj.title = node.title;
            obj.orgName = node.orgName;
            obj.isDisabled = node.isDisabled;
            obj.id = node.id;
            obj.longId = node.longId;
            obj.children = [];
            for (let i = 0; i < node.children.length; i++) {
                obj.children.push(this.copyNode(node.children[i]));
            }
            return obj;
        },
        handleOrgQueryResult(treeList) {
            let ret = [];
            if (treeList && treeList != null) {
                treeList.forEach(item => {
                    let obj = {};
                    obj.title = (item.org.disabled ? "【已禁用】" : "") + item.org.orgName;
                    obj.orgName = item.org.orgName;
                    obj.isDisabled = item.org.disabled;
                    obj.id = item.org.id;
                    obj.longId = item.org.longId;
                    obj.children = this.handleOrgQueryResult(item.children);
                    ret.push(obj);
                });
            }
            return ret;
        },
        fetchQixinOrgTreeData() {
            this.qixinOrgTreeSpinShow = true;
            getQixinOrgs({}).then(resp => {
                if (resp.data.code == 200) {
                    this.qixinOrgTreeData = [];
                    this.qixinUserData = [];
                    let treeList = this.handleQixinOrgQueryResult(resp.data.data);
                    treeList.forEach(item => {
                        this.qixinOrgTreeData.push(item);
                    });
                }
                this.qixinOrgTreeSpinShow = false;
            });
        },
        handleQixinOrgQueryResult(treeList) {
            let ret = [];
            if (treeList && treeList != null) {
                treeList.forEach(item => {
                    let obj = {};
                    obj.title = item.department.name;
                    obj.departmentId = item.department.department_id;
                    obj.children = this.handleQixinOrgQueryResult(item.children);
                    ret.push(obj);
                });
            }
            return ret;
        },
        handleSyncOrgToQixin() {
            let selectedNodes = this.$refs.orgTree.getSelectedNodes();
            if (selectedNodes.length == 0) {
                this.$Message.warning('请选择待同步的组织');
                return;
            }
            this.$Modal.confirm({
                title: '请确认',
                content: '<p>已选组织：<b>' + selectedNodes[0].orgName + '</b></p></p>确定要同步该组织（含下级组织）到企信吗？</p>',
                onOk: () => {
                    this.syncQixinBtnLoading = true;
                    syncOrgToQixin({
                        longId: selectedNodes[0].longId
                    }).then(response => {
                        this.syncQixinBtnLoading = false;
                        if (response.data.code == 200) {
                            this.$Message.success(response.data.msg);
                            this.fetchQixinOrgTreeData();
                        }
                    });
                }
            });
        },
        handleSyncUserToQixin() {
            if (this.userSelection.length == 0) {
                this.$Message.warning("请选择待同步的人员");
                return;
            }
            let userIds = [];
            this.userSelection.forEach(item => {
                userIds.push(item.id);
            });
            let params = {
                userIds: userIds
            };
            this.orgTreeSpinShow = true;
            syncUserToQixin(params).then(resp => {
                this.orgTreeSpinShow = false;
                if (resp.data.code == 200) {
                    this.$Message.success(resp.data.msg);
                    this.fetchQixinOrgTreeData();
                }
            });
        },
        handleOrgSelect(nodes) {
            if (nodes.length == 0) {
                return;
            } else {
                this.fetchOrgUsers(nodes[0].id);
            }
        },
        handleQixinOrgSelect(nodes) {
            if (nodes.length == 0) {
                return;
            } else {
                this.fetchQixinOrgUsers(nodes[0].departmentId);
            }
        },
        fetchOrgUsers(orgId) {
            let params = {
                orgId
            };
            this.orgTreeSpinShow = true;
            findUsers(params).then(resp => {
                if (resp.data.code == 200) {
                    this.userData = [];
                    resp.data.data.forEach(item => {
                        this.userData.push(item);
                    });
                }
                this.orgTreeSpinShow = false;
            });
        },
        fetchQixinOrgUsers(departmentId) {
            let params = {
                departmentId
            };
            this.qixinOrgTreeSpinShow = true;
            getQixinUsers(params).then(resp => {
                if (resp.data.code == 200) {
                    this.qixinUserData = [];
                    resp.data.data.forEach(item => {
                        this.qixinUserData.push(item);
                    });
                }
                this.qixinOrgTreeSpinShow = false;
            });
        },
        handleUserSelectionChange(selection) {
            this.userSelection = selection;
        }
    }
}
</script>
