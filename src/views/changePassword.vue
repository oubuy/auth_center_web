<template>
    <Form ref="formChangePassword" :model="formChangePassword" :rules="ruleChangePassword" :label-width="80">
      <FormItem label="旧密码" prop="oldPassword">
          <Input type="password" v-model="formChangePassword.oldPassword"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPassword">
          <Input type="password" v-model="formChangePassword.newPassword"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="formChangePassword.confirmPassword"></Input>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formChangePassword')">提交</Button>
          <Button @click="handleReset('formChangePassword')" style="margin-left: 8px">重置</Button>
      </FormItem>
  </Form>
</template>
<script>
import { changePassword } from "@/api/api.js";

export default {
  data() {
    return {
      formChangePassword: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      },
      ruleChangePassword: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            this.formChangePassword.newPassword !=
            this.formChangePassword.confirmPassword
          ) {
            this.$Message.error("两次输入的密码不一致，请重新确认密码");
          } else {
            changePassword(this.formChangePassword).then(response => {
              if (response.data.code == 200) {
                this.$Message.success(response.data.msg);
                this.$emit("is_modal_visible", false);
              }
            });
          }
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
