<template>
    <div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="角色名称:" prop="roleName" style="width:300px">
                    <Input v-model="formValidate.roleName" placeholder="请输入角色名称"></Input>
                </FormItem>
                   <FormItem label="角色代码:" prop="roleCode" style="width:300px">
                    <Input v-model="formValidate.roleCode" placeholder="请输入角色代码"></Input>
                </FormItem>
                <FormItem label="角色类型:" prop="roleLevel" style="width:300px">
                    <Select v-model="formValidate.roleLevel" @on-change="handleRoleChange">
                      <Option v-for="item in roleLevelTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="可用组织:" v-if="showPuplic">
                    <!-- <Button @click="showOrg=true">添加</Button> -->
                    <Button @click="handleAddRole">添加</Button>
                     <Modal
                        v-model="showOrg"
                        title="选择组织">
                           <role-tree ref="selectionOrg" :parentTree="userOrgArr" @child-tree="handleTree" :style="{height:'500px', overflow: 'auto'}"></role-tree>
                           <div slot="footer">
                                <Button type="text" size="large" @click="showOrg=false">取消</Button>
                                <Button type="primary" size="large" @click="handleOrgSelectOk">确定</Button>
                            </div>
                    </Modal>
                     <Card style="width:300px;height:150px;overflow:auto;marginTop:3px">
                         <p class="pShow" v-for="(item,index) in userOrgArr" :key="index"><span>{{item.title}}</span><Icon style="cursor: pointer;" @click="handleIcon(index)" type="md-close" /></p>
                     </Card>
              </FormItem>
               <FormItem label="备注:" prop="description" style="width:400px;">
                 <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
              </FormItem>
                <FormItem label="操作权限:" prop="systemId" style="width:300px">
                    <Select v-model="formValidate.systemId" filterable  @on-open-change="handleOpen" @on-change="handleSystem">
                        <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                      <Card style="width:350px;height:300px;overflow:auto">
                            <Tree :data="treeData" :render="renderContent" show-checkbox ref="tree" multiple @on-check-change="handleAtuhodTree"></Tree>
                      </Card>
                </FormItem>
            </Form>
            <div class="footerButton">
                <Button type="primary" :loading="saveBtnLoading" @click="handleSubmit('formValidate')">保 存</Button>
                <Button style="margin-left:15px;" @click="handleBack()">返 回</Button>
            </div>
               <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
import roleTree from "./role-tree";
import { systemList, permissionTree } from "@/api/authod.js";

import { addRole, getRoleInfo, editPutRole } from "@/api/roleList.js";

export default {
  data() {
    return {
      saveBtnLoading: false,
      spinShow: false,
      showSpin: false,
      formValidate: {
        id: "",
        roleName: "",
        roleLevel: "",
        description: "",
        systemId: "",
        roleCode: ""
      },
      permissionList: [], //最后勾选权限的值
      permissionObject: {},

      userOrgArr: [], //可用组织
      tempOrgArr: [], //不是DEALER 类型存储的
      showPuplic: false, //公共显示
      statusTree: false, //permissionTree状态值
      showOrg: false,
      systemList: [],
      treeData: [], //操作权限的树

      formatTreeStatus: false, //编辑的时候再处理tree
      rolePermissionListData: [], //编辑权限
      parentParams: {
        //传递参数
        systemParams: "",
        authodParams: ""
      },
      roleLevelTypeList: [
        {
          value: "PUBLIC",
          label: "公共"
        },
        {
          value: "SUPER",
          label: "集团"
        }
      ],
      ruleValidate: {
        roleName: [
          {
            required: true,
            message: "请输入权限名称",
            trigger: "blur"
          }
        ],
        roleCode: [
          {
            required: true,
            message: "请输入角色代码",
            trigger: "blur"
          }
        ]
      },
      tempEditOrgList: [] //储存编辑可用组织
    };
  },
  components: {
    roleTree
  },
  created() {
    this.getSystemList();
  },
  mounted() {
    this.getOrgTree(); //权限的树
    if (this.$route.query.type == "PUBLIC") {
      this.showPuplic = true;
      this.formValidate.roleLevel = "PUBLIC";
    } else {
      this.showPuplic = false;
      this.formValidate.roleLevel = "SUPER";
    }

    if (this.$route.query.id) {
      this.spinShow = true;
      this.getEditRoleInfo(this.$route.query.id); //编辑
    }
  },
  methods: {
    handleSubmit(name) {
      let params = {};
      let formValueObj = {};
      formValueObj.id = this.formValidate.id;
      formValueObj.roleName = this.formValidate.roleName;
      formValueObj.roleLevel = this.formValidate.roleLevel;
      formValueObj.description = this.formValidate.description;
      formValueObj.roleCode = this.formValidate.roleCode;

      params.role = formValueObj;
      let orgArr = [];
      this.userOrgArr.forEach(item => {
        orgArr.push(item.id);

        // if (item.type == "DEALER") {
        //   orgArr.push(item.id);
        // } else {
        //   // this.tempOrgArr.push(item);
        //   // localStorage.setItem("tempOrgArr", JSON.stringify(this.tempOrgArr));
        // }
      });
      params.orgList = orgArr;
      let permissionArr = [];
      this.permissionList.forEach(item => {
        permissionArr.push(item.id);
      });

      // 去重
      let permissionDataList = this.uniq(permissionArr);
      params.permissionList = permissionDataList;

      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate.id) {
            this.saveBtnLoading = true;
            editPutRole(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              } else {
                this.saveBtnLoading = false;
              }
            });
          } else {
            this.saveBtnLoading = true;
            addRole(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              } else {
                this.saveBtnLoading = false;
              }
            });
          }
        } else {
          this.$Message.error("保存失败!");
        }
      });
    },
    getEditRoleInfo(id) {
      getRoleInfo({ roleId: id }).then(response => {
        if (response.data.code == 200) {
          let dataInfo = response.data.data;
          let organizationListData = dataInfo.organizationList; //可用组织
          let rolePermissionArrObject = dataInfo.rolePermissionList; //操作权限
          let objTest = {};
          rolePermissionArrObject.forEach(item => {
            let permissionArrData = [];
            if (objTest[item.systemId]) {                                 
              let objEdit = {};
              objEdit.id = item.permissionId;
              objTest[item.systemId].push(objEdit);
            } else {
              let objEdit = {};
              objEdit.id = item.permissionId;
              permissionArrData.push(objEdit);
              objTest[item.systemId] = permissionArrData;
            }
          });
          this.permissionObject = objTest;
          this.permissionList = rolePermissionArrObject;
          this.rolePermissionListData = rolePermissionArrObject;

          this.rolePermissionListData.forEach(item => {
            item.id = item.permissionId;
          });
          if (this.rolePermissionListData.length !== 0) {
            this.formatTreeStatus = true;
          }

          let roleBasicInfo = dataInfo.role; //角色信息
          this.formValidate.id = roleBasicInfo.id;
          this.formValidate.roleName = roleBasicInfo.roleName;
          this.formValidate.roleLevel = roleBasicInfo.roleLevel;
          this.formValidate.description = roleBasicInfo.description;
          this.formValidate.roleCode = roleBasicInfo.roleCode;
          this.formValidate.systemId = this.systemList[0].value;
          let obj = {
            systemParams: this.systemList[0].value
          };
          this.getOrgTree(obj);

          //   添加按钮
          let tempOrgListData = JSON.parse(localStorage.getItem("tempOrgArr"));
          organizationListData.forEach(item => {
            item.title = item.orgName;
          });
          this.tempEditOrgList = organizationListData; //储存起来
          if (tempOrgListData != null) {
            let resultOrgArr = [...organizationListData, ...tempOrgListData];
            this.userOrgArr = resultOrgArr;
          } else {
            let resultOrgArr = [...organizationListData];
            this.userOrgArr = resultOrgArr;
          }

          this.spinShow = false;
        }
      });
    },
    handleTree(data) {
      let addData = data;
   
      if (this.tempEditOrgList.length != 0) {
        let temArr = this.tempEditOrgList;
        for (var j = 0; j < addData.length; j++) {
          let flag = false;
          for (var i = 0; i < temArr.length; i++) {
            if (temArr[i].id == addData[j].id) {
              temArr[i].title = addData[j].title;
              temArr[i].orgName = addData[j].orgName;
              flag = true;
            }
          }
          if (!flag) {
            temArr.push(addData[j]);
          }
        }
        this.userOrgArr = temArr;
      } else {
        this.userOrgArr = data;
      }
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleOrgSelectOk() {
      this.showOrg = false;
    },
    handleIcon(index) {
      this.userOrgArr.splice(index, 1);
    },
    getSystemList() {
      systemList().then(response => {
        if (response.data.code == 200) {
          let systemDataArr = response.data.data;
          systemDataArr.forEach(item => {
            let obj = {};
            obj.value = item.id.toString();
            obj.label = item.name;
            this.systemList.push(obj);
          });
        }
      });
    },
    handleOpen() {},
    handleSystem(value) {
      //   this.showAuthodTree = true;
      this.parentParams.systemParams = value;
      this.parentParams.authodParams = "";
      this.statusTree = false;
      this.getOrgTree(this.parentParams);
    },
    // 操作权限事件
    // 获取列表数据
    getOrgTree(data) {
      // expandPermissionTree
      //    this.treeData=[];
      let params = {};
      if (typeof data == "undefined") {
      } else {
        params.permissionName = data.authodParams;
        params.systemId = data.systemParams;
      }
      permissionTree(params).then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.getTree(dataArr);
          this.treeData = dataValue;
          if (this.formatTreeStatus) {
            this.checkTree(this.rolePermissionListData, this.treeData); //处理树
          }
        }
      });
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.id = item.id;
          obj.title = item.name;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;
          obj.checked = false;
          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    // 编辑处理树勾选的
    checkTree(editTreeArr, treeDataList) {
      for (var i = 0; i < treeDataList.length; i++) {
        if (treeDataList[i].children.length > 0) {
          this.checkTree(editTreeArr, treeDataList[i].children);
        } else {
          for (var j = 0; j < editTreeArr.length; j++) {
            if (editTreeArr[j].permissionId == treeDataList[i].id) {
              treeDataList[i].checked = true;
              treeDataList[i].expand = true;
            }
          }
        }
      }
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            color: "#999",
            width: "80%"
          },
          class: "ivu-tree-title"
          //   on: {
          //     click: e => {
          //       this.handleTreeSelect(data);
          //       e.path[0].style.backgroundColor = "#d5e8fc";
          //     }
          //   }
        },
        data.title
      );
    },
    handleAtuhodTree(data) {
      //操作权限
      let checkedArr = this.$refs.tree.getCheckedNodes();
      let getCheckedAndIndeterminateNodesArr = this.$refs.tree.getCheckedAndIndeterminateNodes();

      if (this.formValidate.id) {
        if (this.permissionObject[this.formValidate.systemId]) {
          // this.permissionObject[this.formValidate.systemId] = checkedArr;
          this.permissionObject[
            this.formValidate.systemId
          ] = getCheckedAndIndeterminateNodesArr;
        } else {
          // this.permissionObject[this.formValidate.systemId] = checkedArr;
          this.permissionObject[
            this.formValidate.systemId
          ] = getCheckedAndIndeterminateNodesArr;
        }
        let keyArr = Object.keys(this.permissionObject);
        let arrB = [];
        for (var i = 0; i < keyArr.length; i++) {
          var newB = this.permissionObject[keyArr[i]];
          if (newB.length > 0) {
            for (var j = 0; j < newB.length; j++) {
              arrB.push(newB[j]);
            }
          }
        }
        this.permissionList = arrB;
      } else {
        this.permissionObject[
          this.formValidate.systemId
        ] = getCheckedAndIndeterminateNodesArr;
        let keyArr = Object.keys(this.permissionObject);
        let arr = [];
        keyArr.forEach(item => {
          var newA = this.permissionObject[item];
          if (newA.length > 0) {
            newA.forEach(function(it) {
              arr.push(it);
            });
          }
        });
        this.permissionList = arr.concat(this.rolePermissionListData);
      }
    },
    uniq(array) {
      //去重
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    handleAddRole() {
      this.$refs.selectionOrg.getOrgTree();
      this.showOrg = true;
    },
    handleRoleChange(data) {
      if (data == "PUBLIC") {
        this.showPuplic = true;
        this.userOrgArr = [];
        this.formValidate.roleLevel = data;
      } else {
        this.showPuplic = false;
        this.formValidate.roleLevel = data;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.pShow {
  display: flex;
  justify-content: space-between;
}
.footerButton {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
</style>


