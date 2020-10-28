<template>
    <div @click="handleTest">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="显示名称:" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
         <FormItem label="菜单编码:" prop="code">
            <Input v-model="formValidate.code" placeholder="请输入菜单编码"></Input>
        </FormItem>
       
       <FormItem label="所属系统:" prop="systemId">
            <Select v-model="formValidate.systemId" filterable  @on-open-change="handleOpen" @on-change="handleSystem">
                <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
         <!-- <FormItem label="对应功能:" prop="permissionName" style="width:300px">
             <Input v-model="formValidate.permissionName" class="premissionInput" placeholder="请选择对应的功能" @on-change="handleChangeInput" @on-focus="handleFocus"></Input>
            <div v-if="showParantModel">
                 <Card class="parentCard">
                      <div>
                            <Tree  class="premissionInput" :data="treeData" :render="renderContent"></Tree>
                            
                      </div>
                </Card>
            </div>
        </FormItem> -->
          <FormItem label="对应功能:" prop="function">
              <Cascader change-on-select @on-change="handleFunction" :data="functionData" v-model="formValidate.function"></Cascader>
        </FormItem>
          <FormItem label="打开方式:" prop="openType">
             <Select v-model="formValidate.openType">
                <Option value="0">子窗口打开</Option>
                <Option value="1">新窗口打开</Option>
            </Select>
       </FormItem>
        <FormItem label="菜单图标:" prop="icon" >
            <Input v-model="formValidate.icon"></Input>
        </FormItem>
          <!-- <FormItem label="上级菜单:" prop="parentName">
        
           <Input id="inputEleqqq" ref="inputSelect" class="treeSelectInput" v-model="formValidate.parentName" placeholder="请选择上级菜单" @on-focus="handleHeightMenu">
            </Input>
           <div v-if="showPermisionShow">
                 <Card class="parentCard">
                      <div>
                        <menu-permisson :heightMenuRelativeSystem="heightMenuRelativeSystemId" @child-permission="handlePermision"></menu-permisson>
                      </div>
                </Card>
            </div>
        </FormItem> -->
          <FormItem label="上级菜单:" prop="heightMenu">
              <Cascader change-on-select @on-change="handleFormatterHeightMenu" :data="heightMenuData" v-model="formValidate.heightMenu"></Cascader>
        </FormItem>
        <FormItem label="排序:" prop="seq">
            <Input v-model="formValidate.seq" placeholder="请输入排序码"></Input>
        </FormItem>
         <FormItem label="url:" prop="url">
            <Input v-model="formValidate.url" placeholder="请输入链接"></Input>
        </FormItem>
        <FormItem label="描述" prop="description">
            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保 存</Button>
            <Button @click="handleBack" style="margin-left: 8px">返 回</Button>
        </FormItem>
        
    </Form>
   
    </div>
</template>
<script>
import { permissionTree, systemList } from "@/api/authod";
import menuPermisson from "./menuPermissonTree";
import { addMenu, getMenuInfo, editMenu, menuTree } from "@/api/menu";
import $ from "jquery";


// import logo from '../../../../build/logo.png'

export default {
  data() {
    return {
      // imgsrc: logo,


      // 上级菜单关联系统属性
      heightMenuRelativeSystemId: "",
      systemIdArr: [],

      formValidate: {
        id: "",
        icon: "",
        openType: "",
        name: "",
        seq: "",
        url: "",
        code: "",
        systemId: "",
        parentId: "", //上级菜单
        parentName: "",
        permissionId: "", //对应功能
        permissionName: "", //对应功能名字
        description: "",
        function: [], //对应功能
        heightMenu: [] //上级菜单
      },
      treeData: [], //上级菜单
      functionData: [], //对应功能
      heightMenuData: [], //上级菜单

      parentParams: {
        systemParams: "",
        authodParams: ""
      },
      showParantModel: false,
      showPermisionShow: false,
      systemList: [], //所属系统
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入名称!",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入编码!",
            trigger: "blur"
          }
        ],
        systemId: [
          {
            required: true,
            message: "所属系统不能为空",
            trigger: "change"
          }
        ],
        // parentName: [
        //   {
        //     required: true,
        //     message: "上级菜单不能为空",
        //     trigger: "change"
        //   }
        // ],function
        function: [
          {
            required: true,
            message: "对应功能不能为空",
            type: "array",
            trigger: "change"
          }
        ],
        openType: [
          {
            required: true,
            message: "打开方式不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  props: ["editMenuId", "defaultHeightMenuId"],
  components: {
    menuPermisson
  },
  mounted() {
    this.getSystemList();
  },
  methods: {
    handleTest(e) {
      if (e.path[1].getAttribute("class") != null) {
        let flagSelect =
          e.path[1].getAttribute("class").indexOf("treeSelectInput") > -1;
        let selectTreeElen =
          e.path[1].getAttribute("class").indexOf("ivu-tree-arrow") > -1;

        // 上级菜单
        if (flagSelect == "false" && selectTreeElen == "true") {
          this.showPermisionShow = true;
        }
        if (!flagSelect && !selectTreeElen) {
          this.showPermisionShow = false;
        }

        // 对应功能
        let permissionInput =
          e.path[1].getAttribute("class").indexOf("premissionInput") > -1;
        if (permissionInput == "false" && selectTreeElen == "true") {
          this.showParantModel = true;
        }
        if (!permissionInput && !selectTreeElen) {
          this.showParantModel = false;
        }
      } else {
        this.showPermisionShow = false;
        this.showParantModel = false;
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
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {};
          params.id = this.formValidate.id;
          params.name = this.formValidate.name;
          params.code = this.formValidate.code;
          params.systemId = this.formValidate.systemId;

          // params.parentId = this.formValidate.parentId;
          // params.permissionId = this.formValidate.permissionId;
          // 上级菜单
          params.parentId = this.formValidate.heightMenu[
            this.formValidate.heightMenu.length - 1
          ];
          // 对应功能Id
          params.permissionId = this.formValidate.function[
            this.formValidate.function.length - 1
          ];

          params.description = this.formValidate.description;
          params.openType = this.formValidate.openType;
          params.seq = this.formValidate.seq;
          params.url = this.formValidate.url;
          params.icon = this.formValidate.icon;

          if (this.formValidate.id) {
            editMenu(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                // this.handleReset("formValidate");
                let responseObject = {};
                responseObject.disabled = false;
                responseObject.finish = true;
                this.$emit("child-show", responseObject);
              }
            });
          } else {
            addMenu(params).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.handleReset("formValidate");
                let responseObject = {};
                responseObject.disabled = false;
                responseObject.finish = true;
                this.$emit("child-show", responseObject);
              }
            });
          }
        } else {
          this.$Message.error(response.data.msg);
        }
      });
    },
    handleEdit(id) {
      this.handleReset("formValidate");
      getMenuInfo({ menuId: id }).then(response => {
        if (response.data.code == 200) {
          let editData = response.data.data.menu;
          this.formValidate.id = editData.id;
          this.formValidate.openType = editData.openType.toString();
          this.formValidate.name = editData.name;
          this.formValidate.seq = editData.seq;
          this.formValidate.code = editData.code;
          this.formValidate.systemId = editData.systemId.toString();
          this.formValidate.parentId = editData.parentId;
          this.formValidate.permissionId = editData.permissionId;
          this.formValidate.icon = editData.icon;
          this.formValidate.description = editData.description;
          if (editData.url) {
            this.formValidate.url = editData.url;
          }

          let objFuntion = { systemParams: editData.systemId };
          this.getOrgTree(objFuntion); //功能
          this.getMenuTree(editData.systemId);

          let permissionStr = response.data.data.permissionIdPath; //操作权限
          if (permissionStr) {
            // console.log(permissionStr,'permissionStr')
            let arrRet = permissionStr.split(",");
            for (var i = 0; i < arrRet.length; i++) {
              this.formValidate.function.push(parseInt(arrRet[i]));
            }
          }
          let menuStr = response.data.data.menuIdPath; //操作权限
          if (menuStr) {
            let arrRet = menuStr.split(",");
            for (var i = 0; i < arrRet.length - 1; i++) {
              this.formValidate.heightMenu.push(parseInt(arrRet[i]));
            }
          }
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handlePermision(data) {
      //   this.$refs.inputEle.focus();
      this.formValidate.parentId = data.id;
      this.formValidate.parentName = data.name;
      this.showPermisionShow = false;
    },
    // 获取对应功能数据
    getOrgTree(data) {
      let params = {};
      if (typeof data == "undefined") {
      } else {
        // params.permissionName = data.authodParams;
        params.systemId = data.systemParams;
      }
      permissionTree(params).then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.getTree(dataArr);
          this.treeData = dataValue;
          this.functionData = dataValue;
        }
      });
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.label = item.name;
          obj.value = item.id;
          obj.title = item.name;
          obj.id = item.id;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;
          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    // 获取上级菜单数据
    getMenuTree(systemId) {
      menuTree({ systemId: systemId }).then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          let dataValue = this.getTree(dataArr);
          this.heightMenuData = dataValue;
        }
      });
    },
    // 上级菜单
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            color: "#999",
            width: "100%"
          },
          class: "ivu-tree-title",
          on: {
            click: e => {
              this.handleTreeSelect(data);
              e.path[0].style.backgroundColor = "#d5e8fc";
            }
          }
        },
        data.title
      );
    },

    handleTreeSelect(node) {
      this.parentParams.authodParams = node.title;
      this.formValidate.permissionName = node.title;
      this.formValidate.permissionId = node.id;
      this.showParantModel = false;
    },
    handleSystem(value) {
      this.parentParams.systemParams = value;
      // this.parentParams.authodParams = "";
      this.formValidate.parentName = "";
      this.getOrgTree(this.parentParams);
      this.getMenuTree(this.formValidate.systemId);
    },
    handleChangeInput(e) {
      this.parentParams.authodParams = e.data;
    },
    handleOpen() {
      this.showParantModel = false;
    },

    handleBack() {
      this.$emit("child-back", false);
    },
    handleFocus() {
      this.showParantModel = true;
      if (this.formValidate.systemId) {
        let params = {
          systemParams: this.formValidate.systemId,
          authodParams: ""
        };
        this.getOrgTree(params);
      }
    },
    handleHeightMenu() {
      this.showPermisionShow = true;
    },
    handleFunction(value, selectedData) {
      let sectionArr = selectedData;
      this.formValidate.function = [];
      sectionArr.forEach(item => {
        this.formValidate.function.push(item.value);
      });
    },
    handleFormatterHeightMenu(value, selectedData) {
      let sectionMenuArr = selectedData;
      this.formValidate.heightMenu = [];
      sectionMenuArr.forEach(item => {
        this.formValidate.heightMenu.push(item.value);
      });
    },
    handleSetHeigthMenu(data) {
      this.formValidate.id = "";
      if (data.disabled) {
        this.getMenuTree(null);
        let dataMenuArr = data.heightMenuId;
        for (let i = 0; i < dataMenuArr.length; i++) {
          this.formValidate.heightMenu.push(dataMenuArr[i]);
        }
      }
    }
  },
  watch: {
    // defaultHeightMenuId: {
    //   //深度监听，可监听到对象、数组的变化
    //   handler(val, oldVal) {
    //     this.formValidate.parentId = oldVal.id;
    //     this.formValidate.parentName = oldVal.title;
    //   },
    //   deep: true
    // }
  }
};
</script>
<style lang="less" scoped>
.parentCard {
  width: 220px;
  height: 300px;
  overflow: auto;
  position: fixed;
  z-index: 2000;
}
</style>


