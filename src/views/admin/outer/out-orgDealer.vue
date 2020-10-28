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
         <FormItem label="上级组织" prop="parentName">
            <Input v-model="formValidate.parentName" placeholder="请选择上级组织" @on-focus="orgModal=true" class="field-width" readonly/>
            <span class="field-tip">{{fullOrgName}}</span>
            <Modal v-model="orgModal" title="选择所属组织">
                <div style="height:500px; padding: 10px; overflow:auto;">
                    <org-tree ref="orgTree" type="outer" @org-select="handleOrgSelect"></org-tree>
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
            <Input v-model="formValidate.orgName" placeholder="请输入经销商名称"></Input>
        </FormItem>
        <FormItem label="简称:" prop="orgNameAbbr" style="width:300px">
            <Input v-model="formValidate.orgNameAbbr" placeholder="请输入经销商简称"></Input>
        </FormItem>
         <FormItem label="经销商编号:" prop="baseCstCode" style="width:300px">
            <Input v-model="formValidate.baseCstCode" placeholder="请输入编号"></Input>
        </FormItem>
        <FormItem label="SAP编码:" prop="sapCode" style="width:300px">
            <Input v-model.trim="formValidate.sapCode" placeholder="请输入SAP编码"></Input>
        </FormItem>
        <FormItem label="地址:" prop="address">
            <v-address :addressInfo="addInfoAddress" @child-province="handleProvince" @child-city="handleCity" @child-area="handleArea" @child-all="handleAllInfo"></v-address>
            <Input style="margin-top:18px;width:300px" v-model="formValidate.address" placeholder="请输入地址"></Input>
        </FormItem>
        <FormItem label="经纬度:" prop="lngLat">
            <Input  style="width:200px;" v-model="formValidate.lngLat" placeholder="请输入经纬度，以逗号分隔"></Input>
            <a href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank" style="margin-left: 15px;">获取经纬度</a>
        </FormItem>
          <FormItem label="条形码:" prop="barCode" style="width:300px">
            <Input v-model="formValidate.barCode" placeholder="请输入条形码"></Input>
        </FormItem>
        <FormItem label="员工上限:" prop="maxUserNum" style="width:300px">
            <Input v-model="formValidate.maxUserNum" placeholder="请输入员工上限总数"></Input>
        </FormItem>
         <ahoud-status @child-authodstats="handleStatus" :parentStatus="formValidate.disabled" :parentDisabled="flagDisabled"></ahoud-status>
           <FormItem label="备注:" prop="remark" style="width:400px;">
              <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
           </FormItem>
    </Form>
    <div class="footerButton">
         <Button type="primary" @click="handleSubmit('formValidate')">保 存</Button>
        <Button style="margin-left:15px;" @click="handleBack()">返 回</Button>
    </div>
    </div>
</template>

<script>
import vAddress from "@/components/address";
import ahoudStatus from "@/components/ahoudStatus";
import {
  outerOrgDealerTypeList,
  addOuterOrgDealerType,
  outerOrgAllInfo,
  editeOuterOrgDealerType
} from "@/api/outOrgDealer.js";

import orgTree from "@/components/org-tree";
import { getFullOrgName } from "@/api/adminOuter.js";

export default {
  data() {
    return {
      formValidate: {
        id: "",
        parentName: "", // 上级组织名称
        parentId: "",
         lngLat: "",
        orgName: "",
        orgNameAbbr: "",
        baseCstCode: "",
        sapCode: "",
        address: "", //地址
        provinceCode: "",
        provinceName: "",
        cityCode: "",
        cityName: "",
        districtCode: "",
        districtName: "",
        barCode: "", //条形码
        maxUserNum: "", //可用员工总数
        disabled: 0,
        remark: "",
        type: "DEALER"
      },
      // 上级组织
      orgModal: false,
      fullOrgName: "", // 所属组织全称
      fullOrgNameSelection: "", // 已选组织全称

      addInfoAddress: {}, //地址详情
      flagDisabled: false, //勾选状态值
      typesDataList: [], //类型
      heigtLevelList: [], //上级组织
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
        orgName: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        barCode: [
          {
            required: true,
            message: "条形码不能为空",
            trigger: "blur"
          }
        ],
        parentName: [
          {
            required: true,
            message: "请选择上级组织",
            trigger: "change"
          }
        ],
        baseCstCode: [
          {
            required: true,
            message: "编号不能为空",
            trigger: "blur"
          }
        ],
        sapCode: [
          {
            required: true,
            message: "SAP编码不能为空",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "blur"
          }
        ]
        // maxUserNum: [
        //   {
        //     required: true,
        //     message: "可用员工总数不能为空",
        //     trigger: "blur"
        //   }
        // ]
      },
      outShopTypeTitle: ""
    };
  },
  components: {
    vAddress,
    ahoudStatus,
    orgTree
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

    this.getOutDealer();

    this.formValidate.parentId = this.$route.query.pageParentId;
    this.formValidate.parentName = this.$route.query.pageParentName;
  },
  mounted() {
    if (this.$route.query.id) {
      this.handleEdit(this.$route.query.id);
    }else {
      this.addInfoAddress = {};
    }
  },
  methods: {
    // 获取经销商
    getOutDealer() {
      outerOrgDealerTypeList().then(response => {
        if (response.data.code == 200) {
          let outerOrgDealerList = response.data.data;
          outerOrgDealerList.forEach(item => {
            let obj = {};
            obj.value = item.id;
            obj.label = item.text;
            this.typesDataList.push(obj);
          });
        }
      });
    },
    // 保存
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate.disabled == 0) {
            this.formValidate.disabled = false;
          } else if (this.formValidate.disabled == 1) {
            this.formValidate.disabled = true;
          }

          let params = {};
          console.log(this.formValidate,'formValidateformValidate')
          params.id = this.formValidate.id;
          params.parentId = this.formValidate.parentId;
          params.orgName = this.formValidate.orgName;
          params.orgNameAbbr = this.formValidate.orgNameAbbr;
          params.baseCstCode = this.formValidate.baseCstCode;
          params.sapCode = this.formValidate.sapCode;
          params.address = this.formValidate.address;
          params.provinceCode = this.formValidate.provinceCode;
          params.provinceName = this.formValidate.provinceName;
          params.cityCode = this.formValidate.cityCode;
          params.cityName = this.formValidate.cityName;
          params.districtCode = this.formValidate.districtCode;
          params.districtName = this.formValidate.districtName;
          params.barCode = this.formValidate.barCode;
          params.maxUserNum = this.formValidate.maxUserNum;
          params.disabled = this.formValidate.disabled;
          params.remark = this.formValidate.remark;
          params.type = this.formValidate.type;
           params.lngLat = this.formValidate.lngLat;

          if (this.formValidate.id) {
            //编辑
            editeOuterOrgDealerType({ organization: params }).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$router.go(-1);
              }
            });
          } else {
            //添加
            addOuterOrgDealerType({ organization: params }).then(response => {
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
          this.flagDisabled = true;
          let paramsInfoObj = response.data.data.organization;
          //  console.log(paramsInfoObj,'paramsInfoObjparamsInfoObj')
          this.formValidate.id = paramsInfoObj.id;
          this.formValidate.type = paramsInfoObj.type;
          this.formValidate.orgName = paramsInfoObj.orgName;
          this.formValidate.orgNameAbbr = paramsInfoObj.orgNameAbbr;
          this.formValidate.baseCstCode = paramsInfoObj.baseCstCode;
          this.formValidate.sapCode = paramsInfoObj.sapCode;
          this.formValidate.address = paramsInfoObj.address;
            this.formValidate.lngLat = paramsInfoObj.lngLat;

          this.formValidate.provinceCode = paramsInfoObj.provinceCode;
          this.formValidate.provinceName = paramsInfoObj.provinceName;
          this.formValidate.cityCode = paramsInfoObj.cityCode;
          this.formValidate.cityName = paramsInfoObj.cityName;
          this.formValidate.districtCode = paramsInfoObj.districtCode;
          this.formValidate.districtName = paramsInfoObj.districtName;

          this.formValidate.barCode = paramsInfoObj.barCode;
          if (paramsInfoObj.maxUserNum) {
            this.formValidate.maxUserNum = paramsInfoObj.maxUserNum.toString();
          }

          this.formValidate.remark = paramsInfoObj.remark;
          this.formValidate.disabled = paramsInfoObj.disabled;

          this.formValidate.parentName = response.data.data.parentOrgName;
          this.fullOrgName = response.data.data.parentOrgLongName;

          if (paramsInfoObj.parentId) {
            this.formValidate.parentId = paramsInfoObj.parentId.toString();
          }

          // 省市区
          let addressObj = {};
          addressObj.provinceCode = this.formValidate.provinceCode;
          addressObj.provinceName = this.formValidate.provinceName;
          addressObj.cityCode = this.formValidate.cityCode;
          addressObj.cityName = this.formValidate.cityName;
          addressObj.districtCode = this.formValidate.districtCode;
          addressObj.districtName = this.formValidate.districtName;
          this.addInfoAddress = addressObj;
        }
      });
    },
    handleAllInfo(val) {

      this.formValidate.provinceCode = val.province;
      this.formValidate.provinceName = val.provinceName;
      this.formValidate.cityCode = val.city;
      this.formValidate.cityName = val.cityName;
      this.formValidate.districtCode = val.districtCode;
      this.formValidate.districtName = val.districtName;
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleProvince(val) {
      if (typeof val != undefined) {
        this.formValidate.provinceName = val.label;
        this.formValidate.provinceCode = val.value;
      }
    },
    handleCity(val) {
      if (typeof val != undefined) {
        this.formValidate.cityName = val.label;
        this.formValidate.cityCode = val.value;
      }
    },
    handleArea(val) {
      if (typeof val != undefined) {
        this.formValidate.districtName = val.label;
        this.formValidate.districtCode = val.value;
      }
    },
    // 状态
    handleStatus(val) {
      // console.log(val, "状态");
      if (val == 0) {
        this.formValidate.disabled = false;
      } else if (val == 1) {
        this.formValidate.disabled = true;
      }
      this.formValidate.disabled = val;
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
      this.fullOrgName = this.fullOrgNameSelection;
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
