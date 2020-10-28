<template>
    <div style="text-align: left;padding-left: 80px;">
       
         <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
         </div>
      
        <Upload
            ref="upload"
            :show-upload-list="false"
            action="/rest/shopUploadImage"
            :headers="headerToken"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
        
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
        
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>
      <Modal title="查看图片" v-model="visible">
        <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
    </div>
</template>
<script>
export default {
  data() {
    return {
      imgName: "",
      visible: false,
      uploadList: [],
      headerToken: { Authorization: "" } //token
    };
  },

  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
       this.$emit("child-upload", '');
    },
    handleSuccess(res, file) {
      if (res.code == 200) {
        file.url = res.data[0].url;
        this.$emit("child-upload", res.data[0].url);
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: "只能上传一张图片."
        });
      }
      return check;
    },
    handleEditUrl(url) {//编辑图片
      
      let obj = {};
      obj.status = "finished";
      obj["url"] = url;
      this.uploadList.push(obj);
    }
  },
  props: ["imageUrl"],
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    this.headerToken.Authorization = localStorage.getItem("jwttoken");
  
  },
  watch: {
    imageUrl: {
      handler(val, oldVal) {
        this.handleEditUrl(val);
      },
      deep: true
    }
  }
};
</script>
<style scoped>
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

