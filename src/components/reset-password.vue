<template>
<Modal v-model="resetPwdModal" title="重置密码">
    <Form :label-width="80">
        <FormItem label="自定义密码">
            <Input ref="pwdInput" v-model.trim="newPassword" placeholder="请输入自定义密码"></Input>
            <span style="color: #9ea7b4;">不输入自定义密码则发送随机密码到用户手机</span>
        </FormItem>
    </Form>
    <div slot="footer">
        <Button type="text" size="large" @click="resetPwdModal=false">取消</Button>
        <Button type="primary" size="large" @click="handleResetPassword">发送密码</Button>
    </div>
</Modal>
</template>

<script>
import {
    resetPassword
} from "@/api/adminOuter.js";

export default {
    data() {
        return {
            resetPwdModal: false,
            userId: null,
            newPassword: ''
        }
    },
    methods: {
        showModal(userId) {
            this.userId = userId
            this.newPassword = '';
            this.resetPwdModal = true;
            setTimeout(() => {
                this.$refs.pwdInput.focus();
            }, 200);
        },
        handleResetPassword() { // 重置密码
            if (this.newPassword.length > 0 && this.newPassword.length < 6) {
                this.$Message.warning('请至少输入6位长度的密码！');
                return;
            }
            resetPassword({
                userId: this.userId,
                newPassword: this.newPassword
            }).then(response => {
                if (response.data.code == 200) {
                    this.$Message.success(response.data.msg);
                    this.resetPwdModal = false;
                }
            });
        },
    }
}
</script>
