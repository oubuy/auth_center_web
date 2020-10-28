<template>
<div :style="{position: 'relative', paddingBottom:'24px'}">
    <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="90">
        <FormItem label="姓名" prop="realName">
            <Input v-model="formData.realName" placeholder="请输入姓名" class="field-width" clearable></Input>
        </FormItem>
        <!-- <FormItem label="职位" prop="position">
            <AutoComplete v-model="formData.position" :data="positionData" @on-search="handleSearchPosition" placeholder="请输入职位" class="field-width" clearable></AutoComplete>
        </FormItem> -->
         <FormItem label="职位" prop="position">
             <Select v-model="formData.position" placeholder="请选择职位" class="field-width">
                <Option value="管理员">管理员</Option>
                <Option value="店长">店长</Option>
                <Option value="导购">导购</Option>
                <Option value="设计师">设计师</Option>
                <Option value="其他">其他</Option>
            </Select>
        </FormItem>
        <FormItem label="名片职位">
            <Input v-model="formData.cardPosition" placeholder="请输入名片职位" class="field-width" clearable></Input>
            <span class="field-tip">名片职位将用于客户在交互屏扫码后看到的您的职位信息</span>
        </FormItem>
         <!-- <FormItem label="名片职位" prop="cardPosition">
            <Select v-model="formData.cardPosition" placeholder="请选择名片职位" class="field-width">
                <Option value="管理员">管理员</Option>
                <Option value="店长">店长</Option>
                <Option value="导购">导购</Option>
                <Option value="设计师">设计师</Option>
                <Option value="其他">其他</Option>
            </Select>
             <span class="field-tip">名片职位将用于客户在交互屏扫码后看到的您的职位信息</span>
        </FormItem> -->

        <FormItem label="配置权限" prop="userRoles">
            <Select v-model="formData.userRoles" placeholder="请选择用户权限" class="field-width" multiple>
                <Option value="">无</Option>
                <Option v-for="role in roleList" :value="role.id" :key="role.id" :label="role.roleName">
                    <Tooltip placement="right" style="display:block;">{{ role.roleName }}
                        <div slot="content" style="white-space: normal;">{{role.description}}</div>
                    </Tooltip>
                </Option>
            </Select>
            <div style="display: inline-block; vertical-align: top;">
                <Button :disabled="formData.userRoles.length == 0" @click="$refs.showRolePermission.showModal(formData.userRoles)" style="margin-left: 16px">查看操作权限</Button>
                <show-role-permission ref="showRolePermission"></show-role-permission>
            </div>
        </FormItem>
        <FormItem label="手机" prop="mobile">
            <Input v-model="formData.mobile" placeholder="请输入手机号码" class="field-width" :disabled="formData.id!=null" :clearable="!formData.id"></Input>
            <span class="field-tip">手机号为登录账号，请注意填写否则将影响登录。填写后不可修改</span>
        </FormItem>
        <FormItem label="性别">
            <RadioGroup v-model="formData.gender">
                <Radio label="true">男</Radio>
                <Radio label="false">女</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <RadioGroup v-model="formData.disabled">
                <Radio label="false">启用</Radio>
                <Radio label="true">禁用</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="企信状态">
            <RadioGroup v-model="formData.qixinStatus">
                <Radio label="normal">启用</Radio>
                <Radio label="lock">停用</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem v-if="formData.id != null" label="密码">
            <Button :disabled="resetPwdDisabled" @click="$refs.resetPwd.showModal(formData.id)">重置密码</Button>
            <span class="field-tip">重置后会将新密码通过短信方式通知</span>
            <reset-pwd ref="resetPwd"></reset-pwd>
        </FormItem>
        <FormItem label="所属组织" prop="orgId">
            <Select v-model="formData.orgId" class="field-width">
                <Option v-for="item in orgList" :value="item.id" :key="item.id">{{ item.orgName }}</Option>
            </Select>
        </FormItem>
        <FormItem label="管辖范围">
            <div>
                <Checkbox v-model="checkAll" :disabled="comId == null" @on-change="handleCheckAll">全选</Checkbox>
                <span class="field-tip">勾选全选后，新增加的门店/部门自动成为该人员的管辖范围</span>
            </div>
            <div v-if="mgtOrgList.length == 0">暂无数据</div>
            <CheckboxGroup v-model="mgtOrgSelection" @on-change="checkAllGroupChange">
                <Checkbox v-for="org in mgtOrgList" :label="org.id" :key="org.id">{{org.orgName}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="交互屏头像">
            <upload-img ref="uploadAvatar" :quantity="1" style="display: inline-block;"></upload-img>
            <div class="field-tip" style="display: inline-block; position:absolute;">请上传清晰、形象良好的上半身照片</div>
        </FormItem>
        <FormItem label="交互屏二维码">
            <upload-img ref="uploadAppletQrcode" :quantity="1" style="display: inline-block;"></upload-img>
            <div class="field-tip" style="display: inline-block; position:absolute;">请上传自己的小程序二维码</div>
        </FormItem>
        <Divider orientation="left">
            <a @click="handelShowMore" style="font-size:14px;">
                <Icon :type="showMore?'ios-arrow-forward':'ios-arrow-down'" /><span style="padding-left:8px;">{{showMore?'收起':'查看更多'}}</span></a>
        </Divider>
        <div id="showMore" style="display:none;">
            <FormItem label="固定电话">
                <Input v-model="formData.areaCode" placeholder="区号" style="width:100px" clearable></Input>
                <Input v-model="formData.telephoneCode" placeholder="座机号" style="width:100px" clearable></Input>
                <Input v-model="formData.extensionCode" placeholder="分机号" style="width:100px" clearable></Input>
            </FormItem>
            <FormItem label="移动短号">
                <Input v-model="formData.phoneShort" placeholder="请输入移动短号" class="field-width" clearable></Input>
            </FormItem>
            <FormItem label="备注">
                <Input v-model="formData.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" class="field-width" clearable></Input>
            </FormItem>
        </div>
    </Form>
    <Spin v-if="spinShow" fix></Spin>
    <!-- 底部工具栏 -->
    <div class="toolbar-footer">
        <Button type="primary" :loading="saveBtnLoading" @click="handleSubmit">提 交</Button>
        <Button @click="handleBack" style="margin-left: 8px">返 回</Button>
    </div>
</div>
</template>

<script>
import {
  get,
  save,
  findRoles,
  findRolesByOrgId,
  resetPassword
} from "@/api/adminOuter.js";
import { getOrg, getFullOrgName, findDirectSubs } from "@/api/org.js";
import { getRolesList } from "@/api/roles.js";
import {
  positionList,
  getUserInfo,
  addDealerOrganizations,
  dealerShopsList
} from "@/api/persionalManage.js";
import $ from "jquery";
import orgTree from "@/components/org-tree";
import resetPwd from "@/components/reset-password";
import showRolePermission from "@/components/show-role-permission";
import uploadImg from "@/views/admin/outer/upload-img";

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error("请输入有效的手机号码"));
      } else {
        callback();
      }
    };

    return {
      formData: {
        id: null,
        realName: "",
        position: "",
        cardPosition: "",
        mobile: "",
        gender: "",
        orgId: "",
        areaCode: "",
        telephoneCode: "",
        extensionCode: "",
        phoneShort: "",
        disabled: "false",
        qixinStatus: null,
        remark: "",
        avatar: null,
        appletQrcode: "",
        userMgtOrgs: [], //管辖范围，组织ID数组
        userRoles: [] // 用户角色，角色ID数组
      },
      ruleValidate: {
        realName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        position: [
          // {
          //   required: true,
          //   message: "请输入职位",
          //   trigger: "blur"
          // }
           { required: true, message: "请选择职位", trigger: "change" }
        ],
        // cardPosition: [
        //   { required: true, message: "请选择名片职位", trigger: "change" }
        // ],
        userRoles: [
          {
            type: "array",
            required: true,
            message: "请选择用户权限"
          }
        ],
        mobile: [
          {
            required: true,
            validator: validateMobile,
            trigger: "blur"
          }
        ],
        orgId: [
          {
            required: true,
            message: "请选择所属组织"
          }
        ]
      },
      orgList: [], // 所属组织选项列表

      resetPwdDisabled: true,
      spinShow: false,
      saveBtnLoading: false,
      orgModal: false,
      positionDataCache: [], // 职位选项缓存
      positionData: [], // 职位选项
      fullOrgName: "", // 所属组织全称
      comId: null, // 所属公司ID
      orgSelection: null, // 已选组织对象
      fullOrgNameSelection: "", // 已选组织全称
      checkAll: false, // 管辖范围全选
      mgtOrgList: [], // 管辖范围列表
      mgtOrgSelection: [], // 已选管辖范围
      roleList: [], // 公用角色列表
      showMore: false // 是否显示更多
    };
  },
  components: {
    orgTree,
    resetPwd,
    showRolePermission,
    uploadImg
  },
  created() {
    this.fetchPositionData();
    this.fetchRoleList();
    this.fetchOrgList();
    let id = this.$route.query.id;
    if (id) {
      this.formData.id = id;
      this.fetchUserInfo();
    } else {
      this.formData.qixinStatus = "normal";
      this.fetchMgtOrgList();
    }
  },
  mounted() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "经销商管理"
      },
      {
        name: "人员管理"
      },
      {
        name: this.$route.query.id ? "编辑" : "新增"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleSubmit() {
      this.formData.userMgtOrgs = [];
      if (this.checkAll) {
        this.formData.userMgtOrgs.push(this.comId);
      } else {
        this.mgtOrgSelection.forEach(item => {
          this.formData.userMgtOrgs.push(item);
        });
      }

      let avatarUploadList = this.$refs.uploadAvatar.getUploadList();
      if (avatarUploadList.length > 0) {
        this.formData.avatar = avatarUploadList[0].url;
      }

      let appletQrcodeUploadList = this.$refs.uploadAppletQrcode.getUploadList();
      if (appletQrcodeUploadList.length > 0) {
        this.formData.appletQrcode = appletQrcodeUploadList[0].url;
      }
    //   console.log(this.formData, "this.formData");

      this.$refs["formData"].validate(valid => {
        if (!valid) {
          return;
        }
        this.saveBtnLoading = true;
        save(this.formData).then(response => {
          this.saveBtnLoading = false;
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.handleBack();
          }
        });
      });
    },
    handleBack() {
      let query = {
        ...this.$route.query
      };
      delete query.id;
      this.$router.push({
        name: "dealer_user_mgr",
        query: query
      });
    },
    fetchRoleList() {
      getRolesList().then(resp => {
        if (resp.data.code == 200) {
          resp.data.data.forEach(item => {
            this.roleList.push(item);
          });
        }
      });
    },
    fetchOrgList() {
      addDealerOrganizations().then(resp => {
        if (resp.data.code == 200) {
          resp.data.data.forEach(item => {
            this.orgList.push(item);
            if (item.type == "DEALER") {
              this.comId = item.id;
            }
          });
        }
      });
    },
    fetchMgtOrgList(userMgtOrgs, comId) {
      // 获取管辖范围选项列表
      dealerShopsList().then(resp => {
        if (resp.data.code == 200) {
          resp.data.data.forEach(item => {
            this.mgtOrgList.push(item);
          });
          if (userMgtOrgs && comId) {
            for (let i = 0; i < userMgtOrgs.length; i++) {
              if (userMgtOrgs[i].organizationId == comId) {
                this.checkAll = true;
                break;
              }
            }
            if (this.checkAll) {
              this.mgtOrgList.forEach(item => {
                this.mgtOrgSelection.push(item.id);
              });
            } else {
              userMgtOrgs.forEach(item1 => {
                this.mgtOrgList.forEach(item2 => {
                  if (item1.organizationId === item2.id) {
                    this.mgtOrgSelection.push(item2.id);
                  }
                });
              });
            }
          }
        }
      });
    },
    handleCheckAll() {
      this.mgtOrgSelection = [];
      if (this.checkAll) {
        this.mgtOrgList.forEach(item => {
          this.mgtOrgSelection.push(item.id);
        });
      }
    },
    checkAllGroupChange(data) {
      if (data.length != this.mgtOrgList.length) {
        this.checkAll = false;
      }
    },
    fetchUserInfo() {
      // 获取用户详细信息
      let params = {
        userId: this.formData.id
      };
      this.spinShow = true;
      getUserInfo(params).then(resp => {
        if (resp.data.code == 200) {
          let user = resp.data.data.user; // 用户实体
          let userMgtOrgs = resp.data.data.userMgtOrgs; // 管辖范围
          let userRoles = resp.data.data.userRoles; // 用户角色
          let comId = resp.data.data.comId;

          this.formData.realName = user.realName;
          this.formData.position = user.position;
          this.formData.cardPosition = user.cardPosition;
          this.formData.mobile = user.mobile;
          this.formData.gender = user.gender == null ? "" : String(user.gender);
          this.formData.orgId = user.orgId;
          this.formData.areaCode = user.areaCode;
          this.formData.telephoneCode = user.telephoneCode;
          this.formData.extensionCode = user.extensionCode;
          this.formData.phoneShort = user.phoneShort;
          this.formData.disabled = String(user.disabled);
          this.formData.qixinStatus = user.qixinStatus;
          this.formData.remark = user.remark;
          this.resetPwdDisabled = user.disabled;
          if (user.avatar) {
            this.$refs.uploadAvatar.initUploadList(user.avatar);
          }
          if (user.appletQrcode) {
            this.$refs.uploadAppletQrcode.initUploadList(user.appletQrcode);
          }
          this.fetchMgtOrgList(userMgtOrgs, comId);
          userRoles.forEach(item => {
            this.formData.userRoles.push(item.id);
          });
        }
        this.spinShow = false;
      });
    },
    fetchPositionData() {
      positionList().then(resp => {
        if (resp.data.code == 200) {
          resp.data.data.forEach(item => {
            this.positionDataCache.push(Object.values(item)[0]);
          });
        }
      });
    },
    handleResetPassword() {
      // 重置密码
      this.$Modal.confirm({
        title: "请确认",
        content: "<p>确定重置密码吗？</p>",
        onOk: () => {
          resetPassword({
            userId: this.formData.id
          }).then(response => {
            if (response.data.code == 200) {
              this.$Message.success(response.data.msg);
            }
          });
        }
      });
    },
    handleSearchPosition(value) {
      this.positionData = [];
      this.positionDataCache.forEach(item => {
        if (item.indexOf(value) != -1) {
          this.positionData.push(item);
        }
      });
    },
    handelShowMore() {
      this.showMore = !this.showMore;
      $("#showMore").slideToggle();
    }
  }
};
</script>

<style scoped>
.field-width {
  width: 300px;
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
