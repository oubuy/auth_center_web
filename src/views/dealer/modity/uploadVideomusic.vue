<template>
   <div class="draggleContainer">
      <!-- <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="formatType"
        :max-size="102400"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :action="action"
         :headers="headerToken"
        style="display: inline-block;width:58px;">
        <div style="width: 100px;height:100px;line-height: 58px;border: 1px solid rgb(220, 222, 226);display: flex;justify-content: center;align-items: center;cursor: pointer;">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload> -->
      <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
      
        <div class="magImageBox">
          
           <audio controls class="audio_btn" :src="item.url" v-show="uploadType == 2"></audio>
            <video controls class="video_btn" :src="item.url" v-show="uploadType == 3"></video>
           <div class="attachments-list-cover"><Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon></div>
        </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info style="margin-top:30px"></Progress>
        </template>
    </div>
   
   <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="formatType"
        :max-size="102400"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :action="action"
         :headers="headerToken"
        style="display: inline-block;width:58px;">
        <div style="width: 100px;height:110px;line-height: 58px;border: 1px solid rgb(220, 222, 226);display: flex;justify-content: center;align-items: center;cursor: pointer;">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload>
   </div>
</template>
<script>
export default {
  data() {
    return {
      defaultList: [],
      imgName: "",
      visible: false,
      uploadList: [],
      action: "",
      functionName: "modity",
      imageId: "",
      headerToken: { Authorization: "" }, //token
      formatType: [],
      titleTip:''
    };
  },
  props: ["mainParamId", "uploadType"],
  mounted() {
    if (this.uploadType == 2) {
      this.formatType = ["mp3", "mkv", "wma"];
    } else {
      this.formatType = ["3gp", "mp4", "wmv", "rmvb", "avi", "wav"];
    }
    this.headerToken.Authorization = localStorage.getItem("jwttoken");
    this.uploadList = this.$refs.upload.fileList;
    setTimeout(() => {
      if (this.mainParamId) {
        this.imageId = this.mainParamId;
        // console.log(this.imageId, 8888844);

        this.action =
          "modity-fileUpload/uploadImage?uuid=" +
          this.imageId +
          "&function=" +
          this.functionName;
      }
    }, 1000);
  },
  methods: {
    initUploadList(imgInfo) {
      console.log(imgInfo);

      this.uploadList.push({
        url: imgInfo,
        status: "finished"
      });
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);

      let obj = {};
      if (this.uploadType == 2) {
        obj.audioFlag = true;
        obj.imageUrl = "";
      } else {
        obj.audioFlag = false;
        obj.imageUrl = "";
      }
      this.$emit("child-uploadmusic", obj);
    },
    handleSuccess(res, file) {
      // console.log(res, "res");
      if (res.status == 200) {
        file.url = res.imageUrl;
        let obj = {};
        if (this.uploadType == 2) {
          obj.audioFlag = true;
          obj.imageUrl = res.imageUrl;
        } else {
          obj.audioFlag = false;
          obj.imageUrl = res.imageUrl;
        }
        this.$emit("child-uploadmusic", obj);
      } else {
        this.$Message.warning(res.msg);
        this.handleRemove(file);
      }
    },
    handleFormatError(file) {
      // 请上传指定格式音频文件！！
       if (this.uploadType == 2) {
        this.titleTip = "请上传指定格式音频文件！！";
      }else{
         this.titleTip = "请上传指定格式视频文件！！";
      }
      this.$Notice.warning({
        title: this.titleTip
      });
    },
    handleMaxSize(file) {
      if (this.uploadType == 2) {
        this.titleTip = "上传音频文件最大不能超过100M！！";
      }else{
         this.titleTip = "上传视频文件最大不能超过100M！！";
      }
      this.$Notice.warning({
        title: this.titleTip
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Notice.warning({
          title: "只能上传一条信息"
        });
      }
      return check;
    }
  }
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

.draggleContainer {
  display: flex;
  padding-left: 20px;
}
.demo-upload-list {
  width: 325px !important;
  margin-left: 61px !important;
  height: 110px !important;
  // background: rgba(0, 0, 0, 0.1) !important;
}
.audio_btn {
  width: 325px !important;
  position: absolute;
  bottom: 9px;
}
.video_btn {
  height: 100%;
  width: 100%;
}
.magImageBox {
  height: 110px;
  display: flex;
  align-items: center;

  position: relative;
}
.attachments-list-cover {
  height: 40px;
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  display: none;
}

.attachments-list-cover i {
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
.magImageBox:hover .attachments-list-cover {
  display: block;
}
.ivu-icon {
  vertical-align: inherit !important;
}
</style>