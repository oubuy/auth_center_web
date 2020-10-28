<template>
    <div>
     <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="mobile">
            <Input type="text" style="width:300px" v-model="formInline.mobile"  placeholder="请输入员工手机号">
            </Input>
              <Button style="margin-left:25px;" v-if="buttonFlag" @click="handleSearch">查 询</Button>
               <Button style="margin-left:25px;" disabled v-else>查 询</Button>
        </FormItem>
    
       
       
    </Form>
          <div style="text-align: left;" v-show="searchFlag">
             <div>{{searchValue.name}}</div>
             <div>{{searchValue.mobile}}</div>
              <div>{{searchValue.department}}</div>
            <div><span>当前分值：</span>{{searchValue.score}}</div>
        </div>
     <div class="bottomStudentButton">
           <Button type="primary" @click="handleSubmit">添 加</Button>
             <Button style="margin-left:25px;">取 消</Button>
    </div>
    </div>
</template>
<script>
import { searchStudent,saveStudent } from "@/api/growth.js";
export default {
  data() {
       const validateMobile = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入手机号码"));
                this.buttonFlag=false;
            } else if (!/^1\d{10}$/.test(value)) {
                callback(new Error("请输入有效的手机号码"));
                  this.buttonFlag=false;
            } else {
                callback();
                this.buttonFlag=true;
            }
        };

    return {
      formInline: {
        mobile: ""
      },
      searchValue: {},
      buttonFlag:false,
      searchFlag:false,
         ruleInline: {
                     mobile: [{
                    required: true,
                    validator: validateMobile,
                    trigger: "blur"
                }]
                 
                }
    };
  },
  methods: {
    handleSearch() {
      let params = {
        mobile: this.formInline.mobile
      };
      searchStudent(params).then(res => {
        if (res.data.code == 200) {
            this.searchFlag=true;
          this.searchValue = res.data.data;
        }else{
             this.searchFlag=false;
        }
      });
    },

    handleSubmit() {}
  }
};
</script>
<style lang="less" scoped>
.bottomStudentButton {
  position: absolute;
  top: 300px;
 
}
</style>


