<template>
 <div>
  <Form ref="loginInfoForm" :model="formValidate" :rules="ruleValidate" :label-width="120" style="width:500px;">
     <FormItem label="姓名：" prop="name" class="form-item">
           {{formValidate.name}}
      </FormItem>
       <FormItem label="工号：" prop="jobNumber" class="form-item">
           {{formValidate.jobNumber}}
      </FormItem>
       <FormItem label="职位：" prop="position" class="form-item">
           {{formValidate.position}}
      </FormItem>
       <FormItem label="手机号：" prop="phone" class="form-item">
           {{formValidate.phone}}
         
        <span class="text">手机号为登录账号，如需修改请联系相关负责人</span>
      </FormItem>
      <FormItem label="性别：" prop="gender" class="form-item">
           {{formValidate.gender}}
      </FormItem>
       <FormItem label="所属组织：" prop="orization" class="form-item">
           {{formValidate.orization}}
      </FormItem>
       <FormItem label="管辖范围：" prop="relativeOrization" class="form-item">
           {{formValidate.relativeOrization}}
      </FormItem>
        <FormItem label="固定电话：" prop="fixedPhone" class="form-item" style="width:650px;">
            <Input v-model="formValidate.areaCode" placeholder="区号" style="width:90px;"></Input>&nbsp;&nbsp;-&nbsp;&nbsp;<Input v-model="formValidate.phoneNumber" placeholder="号码" style="width:150px;"></Input>&nbsp;&nbsp;-&nbsp;&nbsp;<Input v-model="formValidate.otherNumber" placeholder="分机号" style="width:200px;"></Input>
      </FormItem>
       <FormItem label="移动短号：" prop="shortPhome">
            <Input v-model="formValidate.shortPhome" placeholder="请输入移动短号"></Input>
      </FormItem>
  </Form>
   <div class="bottomButton">
            <Button type="primary" @click="submitForm()">保存</Button>
            <i class="buttonG"></i>
            <Button>取消</Button>
    </div>
 </div>
</template>

<script>
import { getLoginInfo } from "@/api/api.js";
import { updateUserInfo } from "@/api/home.js";
export default {
  data() {
    return {
      formValidate: {
        name: "",
        jobNumber: "",
        position: "",
        phone: "",
        gender: "",
        orization: "",
        relativeOrization: "", //管辖范围
        areaCode: "",
        phoneNumber: "",
        otherNumber: "",
        shortPhome: ""
      },

      ruleValidate: {
        name: [
          {
            required: true
          }
        ],
        jobNumber: [
          {
            required: true
          }
        ],
        position: [
          {
            required: true
          }
        ],
        phone: [
          {
            required: true
          }
        ],
        orization: [
          {
            required: true
          }
        ],
        relativeOrization: [
          {
            required: true
          }
        ]
      },
      tempData: {}
    };
  },
  computed: {
    // loginInfoForm() {
    //   // return (this.tempData = this.$store.getters.loginInfo);
    // },
  },
  mounted() {
    // console.log(this.$store.getters.loginInfo,8889999)
    //设置登录信息
    getLoginInfo().then(res => {
      // console.log(res.data.data, "main.vue-created");
      if (res.data.code === 200) {
        // this.$store.dispatch("setLoginInfo", res.data.data);
        this.tempData = res.data.data;
        this.formValidate.name = this.tempData.realName;
        this.formValidate.jobNumber = this.tempData.staffCode;
        this.formValidate.position = this.tempData.position;
        this.formValidate.phone = this.tempData.mobile;
        // gender
       if(this.tempData.gender!=null){
          if (this.tempData.gender) {
          this.formValidate.gender = "男";
        } else {
          this.formValidate.gender = "女";
        }
       }else{
           this.formValidate.gender = "";
       }
        this.formValidate.orization = this.tempData.orgName;
        // 管辖范围
        if (this.tempData.userManagementOrgList.length > 0) {
          let str = "";
          for (let i = 0; i < this.tempData.userManagementOrgList.length; i++) {
            str += this.tempData.userManagementOrgList[i] + ",";
          }
          this.formValidate.relativeOrization = str.substring(
            0,
            str.length - 1
          );
        }
        this.formValidate.areaCode = this.tempData.areaCode;
        this.formValidate.phoneNumber = this.tempData.telephoneCode;
        this.formValidate.otherNumber = this.tempData.extensionCode;
        this.formValidate.shortPhome = this.tempData.phoneShort;
      }
    });

    // this.breadcrumbs = [{name:'123'}]
    let breadcrumbs = [{ name: "个人信息" }];
    // this.$store.commit(this.GLOBAL_TYPES.SET_breadcrumbs,breadcrumbs)
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    // console.log("设置面包屑")
  },
  methods: {
    submitForm() {
      let objParams = {};
      objParams.phoneShort = this.formValidate.shortPhome;
      objParams.areaCode = this.formValidate.areaCode;
      objParams.telephoneCode = this.formValidate.phoneNumber;
      objParams.extensionCode = this.formValidate.otherNumber;
      updateUserInfo(objParams).then((response)=>{
        //  console.log(response,'更新')
         if(response.data.code==200){
           this.$Message.success(response.data.msg);
         }
      })
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";

.form-item {
  text-align: left;
}

.bottomButton {
  position: absolute;
  bottom: 25px;
  .lr();
  .buttonG {
    padding: 0 10px;
  }
}

.text{
  margin-left: 20px;
  font-size: 12px;
  color: #FF6600;
}
</style>
