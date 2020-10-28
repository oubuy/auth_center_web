<template>
    <div>
        <Form :model="formData" :rules="ruleValidate"  :label-width="100">
            <FormItem label="UE4版本" prop="ue4Version" v-if="versionFlag">
                <Input v-model="formData.ue4Version" disabled style="width:350px"></Input>
            </FormItem>
             <FormItem label="UE4版本" prop="ue4Version" v-else>
                <Input v-model="formData.ue4Version" style="width:350px"></Input>
            </FormItem>
             <FormItem label="程序版本" prop="programVersion">
                <Input v-model="formData.programVersion" style="width:350px"></Input>
            </FormItem>
            <FormItem label="路径" prop="uri">
                <Input v-model="formData.uri" style="width:350px"></Input>
            </FormItem>
            <FormItem label="md5">
                <Input v-model="formData.md5" style="width:350px"></Input>
            </FormItem>
              <FormItem>
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading">确定</Button>
            <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
        </FormItem>
        </Form>
    </div>
</template>

<script>
import { versionInfo, updateVersion, addVersion } from "@/api/ue4.js";
export default {
  data() {
    return {
      formData: {
        ue4Version: "",
        programVersion: "",
        uri: "",
        md5: ""
      },
      headTitle: "",
      saveBtnLoading: false,
      versionFlag:false,
      ruleValidate: {
        ue4Version: [{ required: true, message: "请输入UE4版本号", trigger: "blur" }],
        programVersion: [{ required: true, message: "请输入程序版本号", trigger: "blur" }],
        uri: [{ required: true, message: "请输入下载路径", trigger: "blur" }]
      },
    };
  },
  mounted() {
    if (this.$route.query.ueId) {
        this.versionFlag=true
      this.headTitle = "编辑";
      this.handleGetVersion(this.$route.query.ueId);
    } else {
      this.headTitle = "新增";
    }

    let breadcrumbs = [
      { name: "VR场景管理" },
      { name: "版本管理" },
      { name: this.headTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleSubmit() {
    
      this.saveBtnLoading = true;
      if (this.$route.query.ueId) {
        //更新
        updateVersion(this.formData).then(res => {
       
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
      } else {
        addVersion(this.formData).then(res => {
           if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
      }
    },
    handleCancle() {
      this.$router.go(-1);
    },
    handleGetVersion(ueId) {
      versionInfo({ Ue4programId: ueId }).then(res => {
        if (res.data.code == 200) {
          let version_info = res.data.data;
          this.formData.ue4Version = version_info.ue4Version;
          this.formData.programVersion = version_info.programVersion;
          this.formData.uri = version_info.uri;
          this.formData.md5 = version_info.md5;
        }
      });
    }
  }
};
</script>
