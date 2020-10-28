<template>
<div :style="{position: 'relative'}">
    <table class="edit_table" style="margin-bottom:25px;">
        <tr>
            <td class="param_name" style="width:100px;">姓名</td>
            <td class="param_field">{{realName}}</td>
        </tr>
        <tr>
            <td class="param_name">工号</td>
            <td class="param_field">{{staffCode}}</td>
        </tr>
        <tr>
            <td class="param_name">职位</td>
            <td class="param_field">{{position}}</td>
        </tr>
        <tr>
            <td class="param_name">手机</td>
            <td class="param_field">{{mobile}}</td>
        </tr>
        <tr>
            <td class="param_name">性别</td>
            <td class="param_field">{{gender}}</td>
        </tr>
        <tr>
            <td class="param_name">固定电话</td>
            <td class="param_field">{{telephone}}</td>
        </tr>
        <tr>
            <td class="param_name">移动短号</td>
            <td class="param_field">{{phoneShort}}</td>
        </tr>
        <tr>
            <td class="param_name">状态</td>
            <td class="param_field" :style="{color : disabled?'#c5c8ce':'#2db7f5'}">{{disabled?'禁用':'启用'}}</td>
        </tr>
        <tr>
            <td class="param_name">密码</td>
            <td class="param_field">
                <Button :disabled="disabled==null || disabled" @click="$refs.resetPwd.showModal(formData.id)">重置密码</Button>
                <span class="field-tip">重置后会将新密码通过短信方式通知</span>
                <reset-pwd ref="resetPwd"></reset-pwd>
            </td>
        </tr>
        <tr>
            <td class="param_name">所属组织</td>
            <td class="param_field">{{fullOrgName}}</td>
        </tr>
        <tr>
            <td class="param_name">所属外部组织</td>
            <td class="param_field">
                <Button @click="outerOrgModal=true">选择</Button>
                <!-- 选择所属外部组织 -->
                <Modal v-model="outerOrgModal" title="选择所属外部组织">
                    <div style="height:500px; padding: 10px; overflow:auto;">
                        <org-tree ref="orgTree" type="outer" @org-select="handleOuterOrgSelect"></org-tree>
                    </div>
                    <Card :bordered="false">
                        <span style="color: #2db7f5;">已选组织：</span>
                        <span>{{fullOuterOrgNameSelection}}</span>
                    </Card>
                    <div slot="footer">
                        <Button type="text" size="large" @click="outerOrgModal=false">取消</Button>
                        <Button type="primary" size="large" @click="handleOuterOrgSelectOk">确定</Button>
                    </div>
                </Modal>
            </td>
        </tr>
        <tr>
            <td></td>
            <td class="param_field" style="padding-top:0;">
                <Table :columns="outerOrgColumns" :data="outerOrgData" :show-header="false" no-data-text="未选择所属外部组织" class="field-width"></Table>
            </td>
        </tr>
        <tr>
            <td class="param_name">管辖范围</td>
            <td class="param_field">
                <Button @click="handleMgtSelect">选择</Button>
                <!-- 选择管辖范围对话框 -->
                <Modal v-model="orgModal" title="选择管辖范围" width="750">
                    <Row :gutter="16">
                        <Col span="12">
                        <Card dis-hover style="height:500px; overflow:auto;">
                            <org-tree ref="orgTree" type="outer" @org-select="handleOrgSelect"></org-tree>
                        </Card>
                        </Col>
                        <Col span="12">
                        <Card dis-hover style="height:500px; overflow:auto;">
                            <p slot="title" style="color:#2db7f5; font-weight:normal;">已选管辖范围</p>
                            <a href="javascript:void(0)" slot="extra" @click="clearOrgSelect">清空</a>
                            <org-tree-selected ref="orgTreeSelected" />
                        </Card>
                        </Col>
                    </Row>
                    <div slot="footer">
                        <Button type="text" size="large" @click="orgModal=false">取消</Button>
                        <Button type="primary" size="large" @click="handleOrgSelectOk">确定</Button>
                    </div>
                </Modal>
            </td>
        </tr>
        <tr>
            <td></td>
            <td class="param_field" style="padding-top:0;">
                <Card dis-hover :padding="8" class="field-width">
                    <org-tree-selected ref="mgtOrgTree" />
                </Card>
            </td>
        </tr>
        <tr>
            <td class="param_name">用户角色</td>
            <td class="param_field" style="padding-bottom:4px;">
                <Transfer :data="roleData" :target-keys="formData.userRoles" @on-change="handleRoleChange" :render-format="userRolesRender" :titles="['可选角色', '已选角色']" filterable :list-style="{width:'220px', height:'235px'}"></Transfer>
            </td>
        </tr>
        <tr>
            <td class="param_name"></td>
            <td class="param_field" style="padding-top:0; text-align:right;">
                <Button :disabled="formData.userRoles.length == 0" @click="$refs.showRolePermission.showModal(formData.userRoles)" style="margin-left: 16px">查看操作权限</Button>
                <show-role-permission ref="showRolePermission"></show-role-permission>
            </td>
        </tr>
        <tr>
            <td class="param_name">备注</td>
            <td class="param_field"><Input v-model="formData.remark" type="textarea" :autosize="{minRows: 3,maxRows: 3}" class="field-width" clearable></Input></td>
        </tr>
    </table>
    <Spin v-if="spinShow" fix></Spin>

    <!-- 底部工具栏 -->
    <div class="toolbar-footer" style="padding-left:120px;">
        <Button type="primary" :loading="saveBtnLoading" @click="handleSubmit">提 交</Button>
        <Button @click="handleBack('false')" style="margin-left: 8px">返 回</Button>
    </div>
</div>
</template>

<script>
import {
    get,
    update
} from "@/api/adminInner.js";
import {
    getOrg,
    getFullOrgName,
    findDirectSubs
} from "@/api/org.js";
import resetPwd from "@/components/reset-password";
import orgTree from "@/components/org-tree";
import orgTreeSelected from "@/views/admin/inner/org-tree-selected";
import showRolePermission from "@/components/show-role-permission";

export default {
    data() {
        return {
            formData: {
                id: null,
                remark: '',
                userMgtOrgs: [], // 管辖范围，组织ID数组
                userRoles: [], // 用户角色，角色ID数组
                outerOrgs: [] // 所属外部组织，组织ID数组
            },
            realName: '',
            staffCode: '',
            position: '',
            mobile: '',
            gender: null,
            fullOrgName: '', // 所属组织全称
            telephone: '', // 固定电话
            phoneShort: '', // 移动短号
            disabled: null,
            roleData: [], // 公共角色与私有角色集合
            mgtOrgSelected: [], // 已选管辖范围，树状结构
            orgModal: false,
            spinShow: false,
            saveBtnLoading: false,
            outerOrgModal: false,
            outerOrgSelection: null,
            fullOuterOrgNameSelection: '',
            outerOrgData: [],
            outerOrgColumns: [{
                    title: '组织名称',
                    key: 'orgName'
                },
                {
                    title: '操作',
                    key: 'opt',
                    align: 'right',
                    width: 55,
                    render: (h, params) => {
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    content: '点击移除',
                                    theme: 'light',
                                    placement: 'right'
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'ios-remove'
                                    },
                                    on: {
                                        click: () => {
                                            this.outerOrgData.splice(params.index, 1);
                                        }
                                    }
                                })
                            ])
                        ]);
                    }
                }
            ]
        }
    },
    computed: {
        statusColor: function () {
            return this.disabled ? "#c5c8ce" : "#2db7f5";
        }
    },
    components: {
        resetPwd,
        orgTree,
        orgTreeSelected,
        showRolePermission
    },
    created() {
        let id = this.$route.query.id;
        if (id) {
            this.formData.id = id;
            this.fetchUserInfo();
        }
    },
    mounted() {
        let breadcrumbs = [{
                name: "首页"
            },
            {
                name: "内部架构"
            },
            {
                name: "内部人员"
            },
            {
                name: "编辑"
            }
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    },
    methods: {
        handleSubmit() {
            this.formData.userMgtOrgs = this.$refs.mgtOrgTree.getLeafNodeIds();
            this.formData.outerOrgs = [];
            this.outerOrgData.forEach(item => {
                this.formData.outerOrgs.push(item.id);
            });
            this.saveBtnLoading = true;
            update(this.formData).then(response => {
                this.saveBtnLoading = false;
                if (response.data.code == 200) {
                    this.$Message.success(response.data.msg);
                    this.handleBack('true');
                }
            });
        },
        handleBack(refresh) {
            let query = {
                ...this.$route.query,
                refresh: refresh
            };
            delete query.view;
            delete query.id;
            this.$router.push({
                name: "admin_inner_user_mgr",
                query: query
            });
        },
        handleOrgSelect(org, root) {
            let nodeArray = [];
            let orgIds = org.longId.split(',');
            orgIds.forEach(orgId => {
                for (let i = 0; i < root.length; i++) {
                    let item = root[i];
                    if (item.node.id == parseInt(orgId)) {
                        nodeArray.push(item.node);
                        break;
                    }
                }
            });
            this.$refs.orgTreeSelected.addNodes(nodeArray);
        },
        clearOrgSelect() {
            this.$refs.orgTreeSelected.clear();
        },
        handleMgtSelect() {
            let treeData = this.$refs.mgtOrgTree.getTreeData();
            this.$refs.orgTreeSelected.setTreeData(treeData);
            this.orgModal = true;
        },
        handleOrgSelectOk() {
            let treeData = this.$refs.orgTreeSelected.getTreeData();
            this.$refs.mgtOrgTree.setTreeData(treeData);
            this.orgModal = false;
        },
        handleRoleChange(targetKeys) {
            this.formData.userRoles = targetKeys;
        },
        userRolesRender(item) {
            let label = '';
            if (item.roleLevel == 'SUPER') {
                label += '<span style="color:#2db7f5">[集团] </span>';
            } else if (item.roleLevel == 'PUBLIC') {
                label += '<span style="color:#9ea7b4">[公共] </span>';
            }
            label += item.roleName;
            return label;
        },
        handleOuterOrgSelect(org, root) {
            this.outerOrgSelection = org;
            getFullOrgName({
                orgId: org.id
            }).then(resp => {
                if (resp.data.code == 200) {
                    this.fullOuterOrgNameSelection = resp.data.data;
                }
            });
        },
        handleOuterOrgSelectOk() {
            if (this.outerOrgSelection == null) {
                this.$Message.warning("请选择所属外部组织");
                return;
            }
            let isExist = false;
            for (let i = 0; i < this.outerOrgData.length; i++) {
                if (this.outerOrgData[i].id == this.outerOrgSelection.id) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                let org = {
                    id: this.outerOrgSelection.id,
                    orgName: this.fullOuterOrgNameSelection
                }
                this.outerOrgData.push(org);
            }
            this.outerOrgModal = false;
        },
        fetchUserInfo() { // 获取用户详细信息
            let params = {
                userId: this.formData.id
            };
            this.spinShow = true;
            get(params).then(resp => {
                if (resp.data.code == 200) {
                    let user = resp.data.data.user; // 用户实体
                    let org = resp.data.data.org; // 所属组织实体
                    let fullOrgName = resp.data.data.fullOrgName; // 所属组织全称
                    let outerOrgs = resp.data.data.outerOrgs; // 所属外部组织
                    let userMgtOrgs = resp.data.data.userMgtOrgs; // 管辖范围
                    let userMgtOrgTree = resp.data.data.userMgtOrgTree; // 管辖范围树
                    let allRoles = resp.data.data.allRoles; // 可选角色
                    let userRoles = resp.data.data.userRoles; // 用户角色

                    this.realName = user.realName;
                    this.staffCode = user.staffCode;
                    this.position = user.position;
                    this.mobile = user.mobile;
                    if (typeof user.gender != 'undefined' && user.gender != null) {
                        this.gender = user.gender ? '男' : '女';
                    }
                    this.fullOrgName = fullOrgName;
                    if (user.areaCode != null && user.areaCode != '') {
                        this.telephone += user.areaCode;
                    }
                    if (user.telephoneCode != null && user.telephoneCode != '') {
                        if (this.telephone.length > 0) {
                            this.telephone += "-";
                        }
                        this.telephone += user.telephoneCode;
                    }
                    if (user.extensionCode != null && user.extensionCode != '') {
                        if (this.telephone.length > 0) {
                            this.telephone += "-";
                        }
                        this.telephone += user.extensionCode;
                    }
                    this.phoneShort = user.phoneShort;
                    this.disabled = user.disabled;
                    this.formData.remark = user.remark;
                    this.$refs.mgtOrgTree.setTreeData(userMgtOrgTree);
                    outerOrgs.forEach(item => {
                        this.outerOrgData.push(item);
                    });
                    userMgtOrgs.forEach(item => {
                        this.formData.userMgtOrgs.push(item.organizationId);
                    });
                    allRoles.forEach(item => {
                        this.roleData.push({
                            key: item.id,
                            label: item.roleName,
                            roleName: item.roleName,
                            roleLevel: item.roleLevel
                        });
                    });
                    userRoles.forEach(item => {
                        this.formData.userRoles.push(item.id);
                    });
                }
                this.spinShow = false;
            });
        }
    }
}
</script>

<style scoped>
.field-width {
    width: 500px;
}

.edit_table .param_name {
    width: 80px;
    text-align: right;
    vertical-align: middle;
    font-size: 12px;
    color: #515a6e;
    padding: 8px 16px 8px 0;
}

.edit_table .param_field {
    text-align: left;
    vertical-align: middle;
    font-size: 12px;
    color: #2c3e50;
    padding: 8px 0;
}

.field-tip {
    color: #9ea7b4;
    font-size: 12px;
    margin-left: 16px;
}

.toolbar-footer {
    position: fixed;
    width: 100%;
    padding: 10px 110px;
    text-align: left;
    bottom: 0px;
    left: 210px;
    z-index: 100;
    background: rgba(248, 248, 249, 0.8);
}
</style>
