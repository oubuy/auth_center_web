<template>
    <div>
       <span v-if="false">{{shop}}</span>
        <div class="demo-upload-list" v-for="(item,keyIndex) in uploadList">
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
         :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        action="/rest/shopUploadImage"
        :headers="headerToken"
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
      headerToken: { Authorization: "" }, //token
      defaultList: [],
      temp: []
    };
  },

  props: ["shop", "picUrl",'picOnlyUrl'],
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // console.log(file, "删除上传图片");

      const fileList = this.$refs.upload.fileList;
      // console.log(fileList, "fileList");
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.$emit("child-delete", file.url);
    },
    handleSuccess(res, file,fileList) {
        console.log(res, "-----", file,'99999999999',fileList);
       if (res.code == 200) {
        let obj = {};
        let urlObject = res.data[0];
        fileList[0].url=urlObject.waterUrl;
        obj.url = urlObject.url;
        obj.name = file.name;
        obj.index = this.shop;
        obj.watchUrl = urlObject.waterUrl;

        this.$emit("child-upload", obj);
      }


      // file.url = res.data[0];
      // res.name = file.name;
      // res.index = this.shop;
      // this.$emit("child-upload", res);
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
          title: "只能上传一张图!"
        });
      }
      return check;
    },
  
  },
  mounted() {
    // console.log(this.picUrl, "图片");
    this.uploadList = this.$refs.upload.fileList;
    this.headerToken.Authorization = localStorage.getItem("jwttoken");
    if (this.picUrl) {
      let obj = {};
      obj.status = "finished";
      obj["url"] = this.picUrl;
      this.uploadList.push(obj);
    }
  },

};
</script>

<style>
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
  top: 17px;
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
