<template>
    <div>
         <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload v-show="showFlag"
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png','gif']"
            :max-size="500"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="action"
              :headers="headerToken"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
import $ from 'jquery';
export default {
  data() {
    return {
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: [],
      showFlag: true,
      headerToken: { Authorization: "" }, //token
      functionName: "modity",
      imageId: "",
      action: ""
    };
  },
   props: ["mainParamId",],
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
      this.headerToken.Authorization = localStorage.getItem("jwttoken");
     
       setTimeout(() => {
      if (this.mainParamId) {
        this.imageId = this.mainParamId;
      

        this.action =
          "modity-fileUpload/uploadImage?uuid=" +
          this.imageId +
          "&function=" +
          this.functionName;
      }
    }, 1000);
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      // file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      this.showFlag = true;
      $('.demo-upload-list').css('display','none')
   
      if(res.status==200){
        this.$emit('child-uploadimg',res.imageUrl)
      }
    },
    handleFormatError(file) {
         this.showFlag = true;
      this.$Notice.warning({
        title: "请上传指定格式图片！",
       
      });
    },
    handleMaxSize(file) {
         this.showFlag = true;
      this.$Notice.warning({
        title: "文件大小不能超过500kb!!",
        
      });
     
    },
    handleBeforeUpload() {
      this.showFlag = false;
    //   const check = this.uploadList.length < 1;
    //   if (!check) {
    //     this.$Notice.warning({
    //       title: "只能上传一条信息"
    //     });
    //   }
    //   return check;
    }
  },
  
};
</script>

<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
