<template>
  <div>
    <Form ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="80">
      <FormItem label="许可证号:"
        prop="licenseCode"
        style="width:300px">
        <Input v-model="formValidate.licenseCode"
          placeholder="请输入许可证号"></Input>
      </FormItem>
      <FormItem label="网卡地址:"
        prop="mac"
        style="width:300px">
        <Input v-model="formValidate.mac"
          placeholder="请输入网卡地址"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary"
          @click="handleSubmit('formValidate')">保 存
        </Button>
        <Button @click="handleBack"
          style="margin-left: 8px">返 回
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import {
    addLicense,
    editLicense,
    getLicenseInfo
  } from "@/api/license.js";
  export default {
    data() {
      return {
        formValidate: {
          licenseCode: "",
          mac: "",
        },
        ruleValidate: {
          licenseCode: [
            {
              required: true,
              message: "许可证号不能为空",
              trigger: "blur"
            }
          ],
          mac: [
            {
              required: true,
              message: "网卡地址不能为空",
              trigger: "blur"
            }
          ],
        },
      };
    },
    props: ['licenseCode'],
    created() {
    },
    mounted() {
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let paramsSubmit = {
              licenseCode: '',
              mac: ''
            };
            paramsSubmit.licenseCode = this.formValidate.licenseCode;
            paramsSubmit.mac = this.formValidate.mac;
              editLicense(paramsSubmit).then(response => {
                if (response.data.code == 200) {
                  this.$Message.success(response.data.msg);
                  this.handleReset("formValidate");
                  this.$emit("child-show");
                }
              });
            
          }
        });
      },
      getLicenseInfoFun(){
        alert(123);
      },

      handleBack() {
        this.$emit('child-back', false);
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
     
    },
  };
</script>

<style lang="less"
  scoped>
  .parentTree {
    overflow: auto;
    height: 500px;
  }

  .parentCard {
    width: 220px;
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

