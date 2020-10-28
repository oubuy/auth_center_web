<template>
    <div>
        <Form :model="formData" :label-width="100">
            <FormItem label="版本号" v-if="versionFlag">
                <Input v-model="formData.version" disabled style="width:350px"></Input>
            </FormItem>
            <FormItem label="版本号" v-else>
                <Input v-model="formData.version" style="width:350px"></Input>
            </FormItem>
             <FormItem label="程序名称">
                <Input v-model="formData.name" style="width:350px"></Input>
            </FormItem>
            <FormItem label="更新包地址">
                <Input v-model="formData.asar" style="width:350px"></Input>
            </FormItem>
            <FormItem label="sha1校验码">
                <Input v-model="formData.sha1" style="width:350px"></Input>
            </FormItem>
            <FormItem label="备注">
                <Input v-model="formData.info" style="width:350px;" type="textarea"></Input>
            </FormItem>
            <FormItem label="安装包地址">
                <Input v-model="formData.packagePath" style="width:350px"></Input>
            </FormItem>
            <FormItem label="安装包大小">
                <Input v-model="formData.packageSize" style="width:350px"></Input>
            </FormItem>
            <FormItem label="安装包说明">
                <Input v-model="formData.packageInfo" style="width:350px"></Input>
            </FormItem>
            <FormItem label="发版时间">
                <DatePicker type="datetime" v-model="formData.editionTime" @on-change="formData.editionTime=$event"  :editable="false" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="架构">
              <Select v-model="formData.arch" style="width:200px">
                  <Option value="ia32">ia32</Option>
                  <Option value="x64">x64</Option>
              </Select>
            </FormItem>
            <FormItem label="是否强制更新">
              <Select v-model="formData.forcedUpdated" style="width:200px">
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
              </Select>
            </FormItem>
            <FormItem>
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading">确定</Button>
            <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
        </FormItem>
        </Form>
    </div>
</template>

<script>
import { versionInfo, updateVersion, addVersion } from "@/api/version.js";
export default {
  data() {
    return {
      formData: {
        id: "",
        version: "",
        name: "",
        arch: "",
        forcedUpdated: "1",
        editionTime: "",
        asar: "",
        sha1: "",
        info: ""
      },
      headTitle: "",
      saveBtnLoading: false,
      versionFlag:false
    };
  },
  mounted() {
    if (this.$route.query.versionId) {
        this.versionFlag=true
      this.headTitle = "编辑";
      this.handleGetVersion(this.$route.query.versionId);
    } else {
      this.headTitle = "新增";
    }

    let breadcrumbs = [
      { name: "交互屏管理" },
      { name: "版本管理" },
      { name: this.headTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleSubmit() {
      this.saveBtnLoading = true;
      let param = {};
      param.id = this.formData.id;
      param.version = this.formData.version;
      param.name = this.formData.name;
      param.arch = this.formData.arch;
      if(this.formData.forcedUpdated == "1"){
        param.forcedUpdated = true;
      }else if(this.formData.forcedUpdated == "0"){
        param.forcedUpdated = false;
      }
      param.asar = this.formData.asar;
      param.sha1 = this.formData.sha1;
      param.info = this.formData.info;
      param.packagePath = this.formData.packagePath;
      param.packageSize = this.formData.packageSize;
      param.packageInfo = this.formData.packageInfo;
      //iview的DatePicker时间带T带Z格式转化时间戳
      //此方法为处理不触发on-change时间的情况
      var dateee = new Date(this.formData.editionTime).toJSON();
      var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      param.editionTime = date;

      if (this.$route.query.versionId) {
        //更新
        updateVersion(param).then(res => {

          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
      } else {
        addVersion(param).then(res => {
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
    handleGetVersion(versionId) {
      versionInfo({ versionId: versionId }).then(res => {
        if (res.data.code == 200) {
          let version_info = res.data.data;
          this.formData.id = version_info.id;
          this.formData.version = version_info.version;
          this.formData.name = version_info.name;
          this.formData.arch = version_info.arch;
          if(version_info.forcedUpdated == true){
            this.formData.forcedUpdated = "1";
          }else if(version_info.forcedUpdated == false){
            this.formData.forcedUpdated = "0";
          }
          this.formData.asar = version_info.asar;
          this.formData.sha1 = version_info.sha1;
          this.formData.info = version_info.info;
          this.formData.editionTime = version_info.editionTime;
          this.formData.packagePath = version_info.packagePath;
          this.formData.packageSize = version_info.packageSize;
          this.formData.packageInfo = version_info.packageInfo;
        }
      });
    }
  }
};
</script>
