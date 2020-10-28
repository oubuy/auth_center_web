<template>
   <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="名字" prop="name">
            <Input style="width:300px" v-model="formValidate.name" placeholder="请输入图片名称"></Input>
        </FormItem>
        
       <div style="display: flex;">
          <FormItem label="链接" prop="linkUrl" style="width:406px">
            <Input style="width:300px" v-model="formValidate.linkUrl" @on-blur="handleCheckUrl" placeholder="请输入链接地址"></Input>
          </FormItem>
          <span class="linkUrlTip" v-show="!checkUrlFlag">{{linkUrlText}}</span>
       </div>
        
         <FormItem label="排序" prop="seq">
            <Input style="width:150px" v-model="formValidate.seq" placeholder="请输入排序号"></Input>
        </FormItem>
        <!-- <FormItem label="图片">
            <upload-img></upload-img>
        </FormItem> -->
        <div style="height: 190px;">
          <div class="comonbox" >
            <span class="conmomSpan">*</span>
            <FormItem :label-width="418" label="图片 ：支持一张，3840px*1416px以上,图片类型只能为gif，png，jpg，jpeg" >
            </FormItem>
              <span class="commonTip" v-show="mainTipFlag">图片不能为空</span>
          </div>
          <upload-img  @child-upload="handleUploadImg" :imageUrl="uploadImageUrl"></upload-img>
        </div>
        <FormItem label="启用状态" prop="enabled">
             <RadioGroup v-model="formValidate.enabled">
               <!-- true 1 是启用 -->
                <Radio label="1">启 用</Radio>
                <!-- false 0 是禁用 -->
                <Radio label="0">禁 用</Radio>
            </RadioGroup>
        </FormItem>
     
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')" :loading="loading">保 存</Button>
            <Button @click="handleReset" style="margin-left: 8px">返 回</Button>
        </FormItem>
    </Form>
     
   </div>
</template>
<script>
import { getBannerList, saveRotation, getBannerInfo } from "@/api/rotation.js";
import uploadImg from "./uploadImg";
export default {
  data() {
    return {
      linkUrlText:'',
      loading: false,
      checkUrlFlag: true, //判断url是否合法
      text: "添加轮播图",
      mainTipFlag: false,
      uploadImageUrl: "",
      formValidate: {
        name: "",
        linkUrl: "",
        enabled: "1",
        imageUrl: "",
        id: "",
        seq: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入图片名称",
            trigger: "blur"
          }
        ],
        enabled: [
          { required: true, message: "请选择上架状态", trigger: "change" }
        ],
        seq: [
          {
            required: true,
            message: "请输入排序号",
            trigger: "change"
          }
        ]
      }
    };
  },
  components: {
    uploadImg
  },
  created() {
    let id = this.$route.query.id;
    if (this.$route.query.id) {
      this.text = "编辑轮播图";
      this.handleGetInfo(id);
    }
    let breadcrumbs = [{ name: "交互屏管理" }, { name: this.text }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleUploadImg(url) {
      //添加图片
      this.formValidate.imageUrl = url;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            typeof this.formValidate.imageUrl == "undefined" ||
            this.formValidate.imageUrl == null ||
            this.formValidate.imageUrl == ""
          ) {
            this.mainTipFlag = true;
            this.$Message.error("图片不能为空，保存失败!");
            return;
          } else {
            this.mainTipFlag = false;
          }

          if (this.$route.query.id) {
            //编辑
            let params = {};
            params.id = this.formValidate.id;
            params.name = this.formValidate.name;
            params.linkUrl = this.formValidate.linkUrl;
            params.imageUrl = this.formValidate.imageUrl;
            params.seq = this.formValidate.seq;
            if (this.formValidate.enabled == 1) {
              params.enabled = true;
            } else {
              params.enabled = false;
            }
            saveRotation(params).then(res => {
              if (res.data.code == 200) {
                this.$Message.info(res.data.msg);
                this.$router.go(-1);
              } else {
                this.$Message.warning(res.data.msg);
              }
            });
          } else {
            //增加
            let params = {};
            params.name = this.formValidate.name;
            params.linkUrl = this.formValidate.linkUrl;
            params.imageUrl = this.formValidate.imageUrl;
            params.seq = this.formValidate.seq;
            if (this.formValidate.enabled == 1) {
              params.enabled = true;
            } else {
              params.enabled = false;
            }
            saveRotation(params).then(res => {
              if (res.data.code == 200) {
                this.$Message.info(res.data.msg);
                this.$router.go(-1);
              } else {
                this.$Message.warning(res.data.msg);
              }
            });
          }
        } else {
          this.mainTipFlag = true;
          this.$Message.error("保存失败！!");
        }
      });
    },
    handleGetInfo(dataId) {
      let params = {
        id: dataId
      };
      getBannerInfo(params).then(res => {
        if (res.data.code == 200) {
          let dataInfo = res.data.data;
        
          this.formValidate.id = dataInfo.id;
          this.formValidate.name = dataInfo.name;
          this.formValidate.linkUrl = dataInfo.linkUrl;
          this.formValidate.seq = dataInfo.seq.toString();
         
          if (dataInfo.enabled == true) {
            this.formValidate.enabled = "1";
          } else {
            this.formValidate.enabled = "0";
          }
          this.formValidate.imageUrl = dataInfo.imageUrl;
          this.uploadImageUrl = this.formValidate.imageUrl;
        }
      });
    },
    handleReset(name) {
      this.$router.push({
        path: "/admin/rotation/list"
      });
    },
    handleCheckUrl() {
     
      if (
        typeof this.formValidate.linkUrl == "undefined" ||
        this.formValidate.linkUrl == null ||
        this.formValidate.linkUrl == ""
      ) {
      } else {
        if (this.formValidate.linkUrl.length < 200) {
          let urlStatus = this.checkURL(this.formValidate.linkUrl);
          if (urlStatus == true) {
            //合法
            this.checkUrlFlag = true;
            this.loading = false;
          } else {
            //不合法
             this.linkUrlText='链接不合法！！'
            this.checkUrlFlag = false;
            this.loading = true;
          }
        }else{
           this.linkUrlText='链接太长了！！'
           this.checkUrlFlag = false;
            this.loading = true;
         
        }
      }
    },
    checkURL(URL) {
      var str = URL;
      var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      var objExp = new RegExp(Expression);
      if (objExp.test(str) == true) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.comonbox {
  display: flex;
  .conmomSpan {
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
    padding-left: 15px;
    padding-top: 7px;
  }
  .commonTip {
    line-height: 1;
    padding-top: 10px;
    color: #ed4014;
    padding-left: 15px;
  }
}
.linkUrlTip {
  line-height: 1;
  padding-top: 10px;
  color: #ed4014;
  padding-left: 15px;
}
</style>

