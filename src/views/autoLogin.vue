<template>

</template>

<script>
// import axios from 'axios'
// import axios from '@/api/axios'
// import * as api from '@/api/api.js'
import * as tools from "@/libs/tools.js";

export default {
    data() {
        return {};
    },
    methods: {},
    created() {
        let token = this.$route.query.token;
            //  console.log(this.$route.query.token,"token")
        if (token) {
            this.$store.dispatch("setToken", token);
            localStorage.setItem("jwttoken", token); //本地存储token,防止刷新页面后需要重新登录
            //判断是否需要回到登录前访问页面
            // let redirect = tools.getQueryString("redirect");
            let redirect = this.$route.query.redirect;
            console.log(redirect,"redirect")

            if (redirect) {
                //存在重定向参数则跳到重定向指定页面
                this.$router.push({
                    path: redirect
                });
            } else {
                // this.$store.dispatch("chageHomeStatus", true);
                this.$router.push({
                    name: "loginUserInfo"
                });
            }

        } else {
            this.$router.push({
                name: "login"
            });
        }
    }
};
</script>
