<template>
    <div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="类别:" prop="type" style="width: 300px">
            <Select v-model="formValidate.type" placeholder="请选择类别" disabled>
                <Option v-for="item in typesDataList" :value="item.value" :key="item.value">
                {{item.label}}
                </Option>
            </Select>
        </FormItem>
        <!-- <FormItem label="类别:" prop="type" style="width: 300px">
            <Input v-model="formValidate.type" readonly></Input>
        </FormItem> -->
         <FormItem label="上级组织" prop="parentName">
            <Input v-model="formValidate.parentName" placeholder="请选择上级组织" @on-focus="handleOtherType" class="field-width" readonly/>
            <span class="field-tip">{{fullOrgName}}</span>
            <Modal v-model="orgModal" title="选择所属组织">
                <div style="height:500px; padding: 10px; overflow:auto;">
                    <org-tree ref="orgTree" type="outer" :otherArrTop="topOrgArr" :org="otherType" @org-select="handleOrgSelect"></org-tree>
                </div>
                <Card :bordered="false">
                    <span style="color: #2db7f5;">已选组织：</span>
                    <span>{{fullOrgNameSelection}}</span>
                </Card>
                <div slot="footer">
                    <Button type="text" size="large" @click="orgModal=false">取消</Button>
                    <Button type="primary" size="large" @click="handleOrgSelectOk">确定</Button>
                </div>
            </Modal>
        </FormItem>
        <FormItem label="名称:" prop="orgName" style="width:300px">
            <Input v-model="formValidate.orgName" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="SAP编码:" style="width:300px">
            <Input v-model.trim="formValidate.sapCode" placeholder="请输入SAP编码"></Input>
        </FormItem>
      </Form>
       <div class="footerButton">
        
         <Button type="primary" @click="handleSubmit('formValidate')">保 存</Button>
        <Button style="margin-left:15px;" @click="handleBack()">返 回</Button>
    </div>
    </div>
</template>

<script>
import {
  outerOrgOtherTypeList,
  outerOrgOtherType,
  outerOrgAllInfo,
  editOuterOrgOtherType
} from "@/api/outOrgDealer.js";
import orgTree from "@/components/org-tree";
import { getFullOrgName } from "@/api/adminOuter.js";

export default {
  data() {
    return {
      formValidate: {
        id: "",
        type: "OTHER",
        parentId: "",
        orgName: "",
        sapCode: "",
        disabled: 0,
        parentName: "" // 上级组织名称
      },
      //  topOrgArr:{ parentId: 0, title: "置顶", orgName: "置顶",id:0 },
      topOrgArr:[{ parentId: 0, title: "置顶", orgName: "置顶",id:0 }],
      // 上级组织
      orgModal: false,
      fullOrgName: "", // 所属组织全称
      fullOrgNameSelection: "", // 已选组织全称

      typesDataList: [], //类型
      ruleValidate: {
        type: [
          {
            required: true,
            message: "类别不能为空",
            trigger: "change"
          }
        ],
        parentId: [
          {
            required: true,
            message: "上级组织不能为空",
            trigger: "change"
          }
        ],
        parentName: [
          {
            required: true,
            message: "请选择上级组织",
            trigger: "change"
          }
        ],
        orgName: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ]
      },
      outShopTypeTitle: "",
      otherType: ""
    };
  },
  created() {
    if (this.$route.query.id) {
      this.outShopTypeTitle = "编辑组织";
    } else {
      this.outShopTypeTitle = "新增组织";
    }
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "组织管理" },
      { name: this.outShopTypeTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.getOuterOtherType();

    this.formValidate.parentId=this.$route.query.pageParentId;
    this.formValidate.parentName=this.$route.query.pageParentName;

  },
  mounted() {
    if (this.$route.query.id) {
      this.handleEdit(this.$route.query.id);
    }
  },
  components: {
    orgTree
  },
  methods: {
    // orgModal=true
    handleOtherType() {
      this.orgModal = true;
      this.otherType = "orgOther";
    },
    getOuterOtherType() {
      outerOrgOtherTypeList().then(response => {
        if (response.data.code == 200) {
          let dataArr = response.data.data;
          dataArr.forEach(item => {
            let obj = {};
            obj.value = item.id;
            obj.label = item.text;
            this.typesDataList.push(obj);
          });
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {};
          params.id = this.formValidate.id;
          params.type = this.formValidate.type;
          params.parentId = this.formValidate.parentId;
          params.orgName = this.formValidate.orgName;
          params.sapCode = this.formValidate.sapCode;
          params.disabled = this.formValidate.disabled;
          if (this.formValidate.id) {
            editOuterOrgOtherType({ organization: params }).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              }
            });
          } else {
            outerOrgOtherType({ organization: params }).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              }
            });
          }
        }
      });
    },
    // 编辑
    handleEdit(id) {
      outerOrgAllInfo({ orgId: id }).then(response => {
        if (response.data.code == 200) {
          let paramsInfoObj = response.data.data.organization;
          this.formValidate.id = paramsInfoObj.id;
          if (paramsInfoObj.type) {
            this.formValidate.type = paramsInfoObj.type;
          } else {
            this.formValidate.type = "OTHER";
          }

          if (
            !response.data.data.parentOrgName &&
            !response.data.data.parentOrgLongName
          ) {
            this.formValidate.parentName = "置顶";
             this.formValidate.parentId = "0";//置顶
            // this.fullOrgName = response.data.data.parentOrgLongName;
          } else {
            this.formValidate.parentName = response.data.data.parentOrgName;
            this.fullOrgName = response.data.data.parentOrgLongName;
          }

          if (paramsInfoObj.parentId) {
            this.formValidate.parentId = paramsInfoObj.parentId.toString();
          }

          this.formValidate.orgName = paramsInfoObj.orgName;
          this.formValidate.sapCode = paramsInfoObj.sapCode;
          this.formValidate.disabled = 0;
        }
      });
    },
    handleBack() {
      this.$router.go(-1);
    },
    // 上级组织
    handleOrgSelect(org) {
      this.orgSelection = org;
      getFullOrgName({
        orgId: org.id
      }).then(resp => {
        if (resp.data.code == 200) {
          this.fullOrgNameSelection = resp.data.data;
        }
      });
    },
    handleOrgSelectOk() {
      // 确定选择
      if (this.orgSelection == null) {
        this.$Message.warning("请选择所属组织");
        return;
      }
      this.formValidate.parentId = this.orgSelection.id;
      this.formValidate.parentName = this.orgSelection.orgName;
      if (!this.fullOrgNameSelection) {
        this.fullOrgName = "置顶";
      } else {
        this.fullOrgName = this.fullOrgNameSelection;
      }

      if (this.comId != this.orgSelection.comId) {
        this.comId = this.orgSelection.comId;
      }
      this.orgModal = false;
    }
  }
};
</script>

<style lang="less" scoped>
.field-width {
  width: 200px;
}
.footerButton {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
.field-tip {
  color: #9ea7b4;
  font-size: 12px;
  margin-left: 16px;
}
</style>


