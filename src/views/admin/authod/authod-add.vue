<template>
    <div @click="handleTest">
     <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="显示名称:" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
    
        <FormItem label="权限编码:" prop="code">
            <Input v-model="formValidate.code" placeholder="请输入权限编码"></Input>
        </FormItem>
        <FormItem label="所属系统:" prop="systemId">
            <Select v-model="formValidate.systemId" filterable clearable @on-open-change="handleOpen" @on-change="handleSystem">
                <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
         <FormItem label="上级权限:" prop="heightValue">
           <!-- <Input v-model="formValidate.parentName" placeholder="请选择上级权限" class="authodHeightSelect" @on-change="handleChangeInput" @on-focus="handlePerimission"></Input>
            <div v-if="showParantModel">
                 <Card class="parentCard">
                      <div>
                            <Tree :data="treeData" :render="renderContent"></Tree>
                      </div>
                </Card>
            </div> -->

             <Cascader :data="heightData" change-on-select @on-change="handelHeigthPersimison" v-model="formValidate.heightValue"></Cascader>
        </FormItem>
         <FormItem label="经销商可用:" prop="dealerDisabled">
            <Select v-model="formValidate.dealerDisabled" clearable>
                <Option v-for="item in dealerData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
            <FormItem label="排序码:" prop="seq">
            <Input v-model="formValidate.seq" placeholder="请输入排序码" @on-blur="handelNumber"></Input>
        </FormItem>
         <FormItem label="描述:" prop="description">
            <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保 存</Button>
            <Button @click="handleBack" style="margin-left: 8px">返 回</Button>
          
        </FormItem>
       
       
    </Form>
  
    </div>
</template>

<script>
import {
  systemList,
  permissionTree,
  addLeftPermission,
  getPermissionInfo,
  editPermission
} from "@/api/authod.js";
export default {
  data() {
    return {
      formValidate: {
        id: "",
        name: "",
        seq: "", //排序码
        code: "",
        systemId: "",
        parentId: "", //上级权限
        parentName: "",
        description: "",
        dealerDisabled: "",
        heightValue: [] //上级权限178, 231, 232
      },
      treeData: [],
      heightData: [],
      parentParams: {
        systemParams: "",
        authodParams: ""
      },
      parentSearchAuthod: "",
      parentSearchSysten: "",
      fullParentNameSelection: "",
      showParantModel: false,
      ruleValidate: {
        name: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "权限编码不能为空",
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
        // heightValue: [
        //   {
        //     required: true,
        //     type: "array",
        //     message: "请选择上级组织",
        //     trigger: "change"
        //   }
        // ],
        // dealerDisabled
        dealerDisabled: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      systemList: [],
      dealerData: [
        {
          value: "0",
          label: "可用"
        },
        {
          value: "1",
          label: "不可用"
        }
      ]
    };
  },
  props: ["athoudParmas", "athodId", "athoudEditTable"],
  created() {
    this.getSystemList();
    this.getOrgTree();
  },
  mounted() {},
  methods: {
    handleTest(e) {
      if (e.path[1].getAttribute("class") != null) {
        let flagSelect =
          e.path[1].getAttribute("class").indexOf("authodHeightSelect") > -1;
        let selectTreeElen =
          e.path[1].getAttribute("class").indexOf("ivu-tree-arrow") > -1;
        if (flagSelect == "false" && selectTreeElen == "true") {
          this.showParantModel = true;
        }
        if (!flagSelect && !selectTreeElen) {
          this.showParantModel = false;
        }
      } else {
        this.showParantModel = false;
      }
    },
    handelNumber() {
      var rep = /^[0-9]+.?[0-9]*$/;
      if (!rep.test(this.formValidate.seq)) {
        this.$Message.warning("请输入数字!!");
      }
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
    handleSystem(value) {
      this.parentParams.systemParams = value;
      this.parentParams.authodParams = "";
      this.formValidate.parentName = "";
      this.getOrgTree(this.parentParams);
    },
    handleChangeInput(e) {
      this.parentParams.authodParams = e.data;
    },

    // 获取列表数据
    getOrgTree(data) {
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
          this.heightData = dataValue;
        }
      });
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.title = item.name;
          obj.label = item.name;
          obj.value = item.id;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;
          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
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
    // 赋值给上级权限
    handleTreeSelect(node) {
      this.parentParams.authodParams = node.title;
      this.formValidate.parentName = node.title;
      this.formValidate.parentId = node.parentId;
      this.showParantModel = false;
    },
    handelHeigthPersimison(value, selectedData) {
      let sectionArr = selectedData;
      this.formValidate.heightValue = [];
      sectionArr.forEach(item => {
        this.formValidate.heightValue.push(item.value);
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let paramsSubmit = {};
          paramsSubmit.id = this.formValidate.id;
          paramsSubmit.name = this.formValidate.name;
          paramsSubmit.code = this.formValidate.code;
          paramsSubmit.seq = this.formValidate.seq;
          paramsSubmit.systemId = this.formValidate.systemId;

          // paramsSubmit.parentId = this.formValidate.parentId;
          paramsSubmit.parentId = this.formValidate.heightValue[
            this.formValidate.heightValue.length - 1
          ];

          paramsSubmit.description = this.formValidate.description;
          paramsSubmit.dealerDisabled = this.formValidate.dealerDisabled;
          if (this.formValidate.id) {
            editPermission(paramsSubmit).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.handleReset("formValidate");
                let responseObject = {};
                responseObject.disabled = false;
                responseObject.finish = true;
                this.$emit("child-show", responseObject);
              }
            });
          } else {
            addLeftPermission(paramsSubmit).then(response => {
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
        }
      });
    },
    handleEdit(val) {
      this.handleReset("formValidate");
      let id = val;
      getPermissionInfo({ permissionId: id }).then(response => {
        if (response.data.code == 200) {
          let paramInfo = response.data.data.permission;
          this.formValidate.name = paramInfo.name;
          this.formValidate.code = paramInfo.code;
          this.formValidate.seq = paramInfo.seq;
          this.formValidate.systemId = paramInfo.systemId.toString();
          let heightStr = response.data.data.permissionIdPath;
          if (heightStr) {
            let arrRet = heightStr.split(",");
            for (var i = 0; i < arrRet.length - 1; i++) {
              this.formValidate.heightValue.push(parseInt(arrRet[i]));
            }
          }
          if (response.data.data.parentPermissionName) {
            this.formValidate.parentName =
              response.data.data.parentPermissionName;
          } else {
            this.formValidate.parentName = "根节点";
          }

          this.formValidate.description = paramInfo.description;

          this.formValidate.dealerDisabled = paramInfo.dealerDisabled.toString();
          this.formValidate.id = paramInfo.id;
          
        }
      });
    },

    handleBack() {
      // this.$router.go(-1);
      this.$emit("child-back", false);
    },
    handleOpen() {
      this.showParantModel = false;
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handlePerimission() {
      this.showParantModel = true;
      let obj = {};
      obj.systemParams = this.formValidate.systemId;
      obj.authodParams = "";
      this.getOrgTree(obj);
    },
    handleAddSystem(val) {
      this.formValidate.systemId = val.systemId.toString();
      this.formValidate.heightValue=val.heigthIds;
      this.formValidate.id="";
   
      // this.formValidate.parentId = this.athoudParmas.addId;
      // this.formValidate.parentName = this.athoudParmas.name;
    }
  },
  watch: {}
};
</script>

<style lang="less" scoped>
.parentTree {
  overflow: auto;
  height: 500px;
}
.parentCard {
  width: 200px;
  height: 300px;
  overflow: auto;
  position: fixed;
  z-index: 2000;
}
.footerButton {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
.ivu-select-dropdown {
  z-index: 100000 !important;
}
</style>

