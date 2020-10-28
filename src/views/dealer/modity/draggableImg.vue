<template>
    <div class="draggleContainer">
       <!-- <Upload
        ref="upload"
        :show-upload-list="false"
         :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="foramType"
      
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :action="action"
        :headers="headerToken"
        style="display: inline-block;width:100px;height:70px;cursor: pointer;margin-top:25px">
        <div style="width: 100px;height:70px;line-height: 58px;display: inline-block;border: 1px solid rgb(220, 222, 226);">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload> -->
    
      <draggable v-model="uplodDraggbleList" :move="getdata" @update="datadragEnd">
                <transition-group class="draggle-upload-list">
                    <div v-for="(item,index) in uplodDraggbleList" :key="index" >
                       <div class="attachments-item" style="width: 100px;height: 132px;margin: 0 15px;">
                           <div class="magImageBox">
                              <img :src="item.imageUrl" ref="draggbleMentImg">
                                <div class="attachments-list-cover" ref="listCoverElect" :class="[showInput?'magImg':'mainImg']">
                                    <div class="removeIcon">
                                        <Icon type="ios-eye-outline" @click.native="handleView(index,item)"></Icon>
                                      <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                                    </div>
                                 </div>
                           </div>
                           <img :src="item.waterImageUrl" ref="draggbleMentWatchImg" hidden>
                            <input type="text"  name="" v-show="false" ref="draggableIdEelent" :value="item.imageId" placeholder="">
                           <Input v-model="item.name" placeholder=""  v-show="showInput" style="width: 100px;" ref="draggbleInput" />
                        
                       </div>
                      
                    </div>
                </transition-group>
       </draggable>

                
       <Upload
        ref="upload"
        multiple
        :show-upload-list="false"
         :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="foramType"
      
        :max-size="5048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :action="action"
        :headers="headerToken"
        style="display: inline-block;width:100px;height:70px;cursor: pointer;margin-top:25px">
        <div style="width: 100px;height:70px;line-height: 58px;display: inline-block;border: 1px solid rgb(220, 222, 226);">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload>

        

  
   
      <Modal title="查看图片" v-model="visible" class="draggelModal">
        <img :src="imgPath" style="width: 100%">
    </Modal>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import $ from "jquery";
export default {
  data() {
    return {
      imgValue: "",
      imgPath: "",
      visible: false,
      uploadList: [],
      sortIndex: 0,
      uplodDraggbleList: [],
      headerToken: { Authorization: "" }, //token
      defaultList: [],
      mainImgFlag: false,
      imageId: "",
      action: "",
      functionName: "modity",
      mainImgList: [], //主图
      mobileImgList: [], //移动端主图
      showInput: false,
      infoImgList: [], //纹理图
      time: null,
      foramType: [] //格式
    };
  },
  components: {
    draggable
  },
  props: [
    "shop",
    "picUrl",
    "picOnlyUrl",
    "mainParamId",
    "mainStyle",
    "mainInfoImgList",
    "InfoImgList",
    "mobileImgParams",
    "uploadType",
    "InfoImgFlag"
  ],
  created() {
    // console.log(this.InfoImgFlag, "InfoImgFlag");
    if (this.uploadType == 1) {
      this.foramType = ["jpg", "jpeg", "png"];
    } else {
      this.foramType = ["mp4", "avi"];
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
    this.headerToken.Authorization = localStorage.getItem("jwttoken");
    if (this.picUrl) {
      // console.log(444);
      let obj = {};
      obj.status = "finished";
      obj["url"] = this.picUrl;
      this.uploadList.push(obj);
    }

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
      if (this.mainStyle == "mainPicture") {
        // console.log(this.mainInfoImgList, "mainInfoImgList");
        this.showInput = false;

        if (this.mainInfoImgList.editMainImg) {
          if (this.mainInfoImgList.mainInfoImgList.length != 0) {
            this.mainImgList = this.mainInfoImgList.mainInfoImgList;
            this.uplodDraggbleList = this.mainImgList;
          }
        }
      } else if (this.mainStyle == "mobilePicture") {
        //移动端
        this.showInput = false;
        // console.log(this.mobileImgParams, 7777);
        if (this.mobileImgParams.editMobileImg) {
          if (this.mobileImgParams.imageMobileList.length != 0) {
            this.mobileImgList = this.mobileImgParams.imageMobileList;
            this.uplodDraggbleList = this.mobileImgList;
          }
        }
      } else {
        this.showInput = true;
        if (this.InfoImgList.editImg) {
          //  console.log(this.InfoImgList, 88888);
          if (this.InfoImgList.infoImgList.length != 0) {
            this.infoImgList = this.InfoImgList.infoImgList;

            this.uplodDraggbleList = this.infoImgList;
          }
        }
      }
    }, 1000);
  },
  methods: {
    handleView(index, item) {
      // this.imgPath = item.waterImageUrl;
      this.imgPath = item.imageUrl;
      this.visible = true;
    },
    handleRemove(file) {
      this.uplodDraggbleList.splice(file, 1);

      // this.$emit("child-delete", file.url);
    },
    handleSuccess(res, file, fileList) {
      // console.log(res, "res");
      // console.log(file, "file");
      // console.log(fileList, "fileList");
      if (res.status == 200) {
        let obj = {};
        let urlObject = res;

        fileList[0].url = urlObject.waterImageUrl;
        // obj.imageUrl = urlObject.imageUrl;
        obj.imageUrl = urlObject.imageUrl + "?x-oss-process=image/resize,w_100";
        obj.imageId = urlObject.imageId;
        // obj.name = file.name;

        obj.waterImageUrl = urlObject.waterImageUrl;
        obj.name = "";
        obj.mainSign = 0;
        obj.sort = this.sortIndex;
        if (this.mainStyle == "mainPicture") {
          obj.type = "mainPicture";
        } else if (this.mainStyle == "mobilePicture") {
          obj.type = "mobilePicture";
        } else {
          obj.type = "modityPicture";
        }
        this.uplodDraggbleList.push(obj);
        // console.log(this.uplodDraggbleList, "this.uplodDraggbleList");
        this.sortIndex++;

        this.$emit("child-upload", this.uplodDraggbleList);
      }

      // fileList[0].url = file.response.waterImageUrl;
      // let obj = {};
      // obj.imageId = file.response.imageId;
      // obj.mainSign = 0;
      // obj.name = "";
      // obj.sort = this.sortIndex;
      // obj.imageUrl =
      //   file.response.imageUrl + "?x-oss-process=image/resize,w_100";
      // obj.waterImageUrl = file.response.waterImageUrl;
      // obj.status = file.status;
      // obj.percentage = file.percentage;
      // obj.showProgress = file.showProgress;
      // if (this.mainStyle == "mainPicture") {
      //   obj.type = "mainPicture";
      // } else if (this.mainStyle == "mobilePicture") {
      //   obj.type = "mobilePicture";
      // } else {
      //   obj.type = "modityPicture";
      // }
      // this.uplodDraggbleList.push(obj);
      // console.log(this.uplodDraggbleList, "this.uplodDraggbleList");
      // this.sortIndex++;

      // this.$emit("child-upload", this.uplodDraggbleList);

      // if (res.status == 200) {
      //   // file.imgObj = res.data;
      //   file.imageUrl = res.imageUrl;

      // }
    },
    handleBeforeUpload(item) {
      if (this.InfoImgFlag != true) {
        const check = this.uplodDraggbleList.length < 5;
        if (!check) {
          this.$Notice.warning({
            title: "只能上传5张图!"
          });
        }
        return check;
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件类型错误"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片大小不能超过5M"
        // desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },

    getdata(evt) {
      // console.log(evt.draggedContext.element.id, "-----", evt);
    },
    datadragEnd(evt) {
      let getDraggbleImgUrl = this.$refs.draggbleMentImg;
      let getDraggbleWatchUrl = this.$refs.draggbleMentWatchImg;
      let getDraggbleInputValues = this.$refs.draggbleInput;
      let getDraggbleIds = this.$refs.draggableIdEelent;
      this.uplodDraggbleList = [];
      for (var i = 0; i < getDraggbleImgUrl.length; i++) {
        let obj = {
          imageUrl: getDraggbleImgUrl[i].src,
          waterImageUrl: getDraggbleWatchUrl[i].src,
          sort: i,
          imageId: getDraggbleIds[i].value,
          name: getDraggbleInputValues[i].value,
          mainSign: 0
        };

        if (this.mainStyle == "mainPicture") {
          obj.type = "mainPicture";
        } else {
          obj.type = "modityPicture";
        }

        this.uplodDraggbleList.push(obj);
      }
      this.$emit("child-upload", this.uplodDraggbleList);
    },
    // 移入
    mouseOver(e, i) {
      e.stopPropagation();
      this.$refs.listCoverElect[i].style.display = "block";
    },
    // 移出
    mouseLeave(e, i) {
      e.stopPropagation();
      let _this = this;

      _this.$refs.listCoverElect[i].style.display = "none";
    }
  }
};
</script>




<style lang="less" scoped>
.draggleContainer {
  display: flex;
  padding-left: 20px;
}
.draggle-upload-list {
  display: flex !important;
  justify-content: center;
  align-items: center;

  .attachments-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.draggle-upload-list img {
  width: 100%;
  // height: 90%;
}
.attachments-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
// .draggle-upload-list:hover .demo-upload-list-cover {
//   display: block;
// }
.magImageBox:hover .attachments-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.attachments-list-cover {
  display: none;
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.magImg {
  // bottom: 40px;
  bottom: -15px;
}
.magImageBox {
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  img {
    height: 100%;
    width: 100%;
  }
}
.mainImg {
  bottom: -10px;
}
// .attachments-item:hover .attachments-list-cover {
//   display: flex;
// }

// .attachments-item:hover .attachments-list-cover {
//   display: block;
// }

.upload-list-cover i,
.attachments-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.attachments-list-cover i {
  font-size: 28px;
}
.removeIcon {
  position: absolute;
  top: 32%;
  bottom: 0;
  left: 4%;
  right: 0;
}
// .draggelModal{
//   width:550px;
//   height: 650px;
// }
.ivu-modal {
  height: 650px !important;
}
</style>
