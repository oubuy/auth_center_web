<template>
  <div>
    <div v-show="showPage">
      <div class="input_box">
        <div class="border_bottom">
          <van-field v-model="village" label="小区" clearable required placeholder="请输入小区名称" label-align="left"
            label-width="2.8rem" :readonly="readonly" />
        </div>
        <div class="border_bottom">
          <van-field v-model="buyTimes" label="第*次选购" clearable required placeholder="请输入选购次数" label-align="left"
            label-width="2.8rem" :readonly="readonly" />
        </div>
        <div class="border_bottom">
          <van-field v-model="evaluate" label="买家评价" clearable required placeholder="请输入买家评价" label-align="left"
            label-width="2.8rem" :readonly="readonly" />
        </div>
        <div class="border_bottom">
          <van-field v-model="layoutVal" label="户型" clearable required placeholder="请输入户型" label-align="left"
            label-width="2.8rem" :readonly="readonly" />
        </div>
        <div class="border_bottom">
          <van-field v-model="areaVal" label="面积" clearable required placeholder="请输入面积" label-align="left" label-width="2.8rem"
            :readonly="readonly" />
        </div>
        <div class="border_bottom">
          <van-field :value="addressVal" @click="showAddressBox" label="省/市/区" readonly clickable clearable required
            placeholder="请选择城市" label-align="left" label-width="2.8rem" />
          <van-popup v-model="showCityPicker" round position="bottom">
            <van-picker title="地区" show-toolbar :columns="addressList" value-key="name" @confirm="onConfirm" @cancel="onCancel"
              @change="onChange" />
          </van-popup>
        </div>
        <div class="border_bottom">
          <van-field :value="sceneVal" @click="showSceneBox" label="实景类型" readonly clickable clearable required
            placeholder="请选择实景类型" label-align="left" label-width="2.8rem" />
          <van-popup v-model="showScenePicker" round position="bottom">
            <van-picker title="实景类型" show-toolbar :columns="sceneColumns" @confirm="onSceneConfirm" @cancel="onSceneCancel" />
          </van-popup>
        </div>
        <div class="border_bottom">
          <van-field :value="styleVal" @click="showStyleBox" label="风格" readonly clickable clearable required
            placeholder="请选择风格" label-align="left" label-width="2.8rem" />
          <van-popup v-model="showStylePicker" round position="bottom">
            <van-picker title="风格" show-toolbar :columns="columns" @confirm="onStyleConfirm" @cancel="onStyleCancel" />
          </van-popup>
        </div>
        <div class="border_bottom" style="display: flex;padding: 0.5rem 1rem 0.5rem 0;">
          <div style="width: 3.2rem;text-align: left;padding: 0 .28rem 0 .5rem;font-size: .36rem;">视频</div>
          <div class="video_box" style="max-width: 6rem;text-align: left;position: relative;" id="video" v-if="videoSrc&&showVideo"
            @click="previewVideo">
            <video :src="videoSrc" style="width: 100%;object-fit: fill;" controls webkit-playsinline playsinline
              x5-video-player-type="h5" x5-video-player-fullscreen="true" poster="../../assets/videoBg.jpg"></video>
            <div v-if="!readonly" style="position: absolute;top: -0.3rem;right: -0.3rem;width: .6rem;height: .6rem;" @click.stop="deleteVideo">
              <van-icon name="clear" size=".6rem" />
            </div>
          </div>
          <div style="position: relative;" v-else>
            <van-uploader :before-read="beforeRead" :after-read="afterRead" accept="video/ogm,video/mpeg,video/asx,video/mpg,video/ogv,video/webm,video/mov,video/mp4,video/m4v;" :disabled="readonly"
              :deletable="!readonly" style="opacity: 0;" />
            <div style="position: absolute;top: 0;left: 0;width: 88px;height: 88px;z-index: -1;background: #f7f8fa;display: flex;align-items: center;justify-content: center;">
              <div>
                <van-icon name="video" size="1rem" color="#dcdee0" />
              </div>
            </div>
            </van-uploader>
            <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: #000;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;" v-if="uploadVideoFlag">
              <van-loading color="#fff" vertical size=".8rem" style="padding-top: .5rem;"/><div style="font-size: .3rem;padding: .2rem 0 .5rem 0;color: #fff;width: 100%;">上传中</div></van-loading>
            </div>
            <div style="color: red;text-align: left;margin-top: 10px;">请上传横屏视频，支持MP4、MOV、AVI、WMV格式，文件大小30MB以内。</div>
          </div>
        </div>
        <div class="button_box" v-if="!readonly">
          <van-button type="info" style="width:3.5rem;height: 1rem;font-size: .36rem;margin: 0;margin-right: .8rem;"
            @click="save" :disabled="canSave">保存</van-button>
          <van-button type="default" style="width:3.5rem;height: 1rem;font-size: .36rem;" @click="cancel">取消</van-button>
        </div>
      </div>
      <div class="space_list_box">
        <div class="upload_button" @click="goUpload" v-if="programmeId&&!readonly">
          <van-button type="default" size="large" block style="height: 1rem;font-size: .36rem;">上传空间</van-button>
        </div>
        <div class="space_list" v-show="showListFlag">
          <div class="space_item" v-for="(item,index) in spaceList" v-if="spaceList.length">
            <div style="">
              <van-divider :style="{fontSize: '.36rem'}">{{item.spaceTypeName}}</van-divider>
            </div>
            <div class="space_pic_list" @click="goSpaceDetail(item.id)">
              <van-image width="100%" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,w_500,h_500/quality,q_80'" />
              <div class="icon_box" @click.stop="deleteItem(item.id)" v-if="!readonly">
                <van-icon name="clear" size=".6rem" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="video_mask" v-if="showVideoMask">
      <div style="position: relative;">
        <video :src="videoSrc" style="width: 100%;object-fit:fill;" controls autoplay webkit-playsinline playsinline x5-video-player-type="h5"
          x5-video-player-fullscreen="true">
        </video>
      </div>
      <div v-if="showClose" style="position: absolute;top: 0;right: 0;" @click="closeVideoMask">
        <van-icon name="clear" size=".8rem" color="#fff" />
      </div>
    </div> -->
    <v-loading :showPage="showPage" :saveFlag="saveFlag" :deleteFlag="deleteFlag"></v-loading>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  import {
    getListStyle,
    getProvince,
    getCity,
    getCounty,
    saveSceneProgramme,
    sceneProgrammeDetail,
    deleteMySceneSpace,
    getUploadPolicy
  } from "@/api/uploadImg.js";
  import {
    getComInfo
  } from "@/api/building.js";
  import {
    province,
    city,
    area
  } from "@/api/address.js";
  import {
    ImagePreview
  } from "vant";
  import axios from 'axios'
  export default {
    data() {
      return {
        canSave: false,
        uploadVideoFlag: false,
        showVideo: false,
        showClose: true,
        showVideoMask: false,
        showPage: false,
        saveFlag: false,
        deleteFlag: false,
        showListFlag: true,
        readonly: false,
        programmeId: this.$route.query.id || localStorage.getItem("id"),
        village: '',
        buyTimes: '',
        evaluate: '',
        formData: {},
        showCityPicker: false,
        showStylePicker: false,
        showLayoutPicker: false,
        showAreaPicker: false,
        showScenePicker: false,
        addressVal: '',
        styleVal: '',
        layoutVal: '',
        sceneVal: '',
        areaVal: '',
        sceneType: '',
        columns: [],
        sceneColumns: ["工程", "家装"],
        layoutColumns: [],
        areaColumns: [],
        styleList: [],
        spaceList: [],
        addressList: [{
          values: []
        }, {
          values: []
        }, {
          values: []
        }],
        previewList: [],
        originalData: {},
        videoSrc: "",
        uploadPolicy: {},
        videoUrl: ""
      }
    },
    components: {},
    created() {
      // this.deleteMySceneSpace();
      this.readonly = this.$route.query.readonly || localStorage.getItem("readonly");
      this.readonly = JSON.parse(this.readonly);
      if (!this.programmeId) this.getComInfo();
      this.sceneProgrammeDetail();
      this.getListStyle();
      this.getProvince();
      this.getUploadPolicy();
    },
    mounted() {
      // document.styleSheets[0].addRule('body::-webkit-scrollbar', 'width:0px');
      let spanList = document.getElementsByTagName("span");
      let inputList = document.getElementsByClassName("van-field__control");
      let cellList = document.getElementsByClassName("van-cell");
      let labelList = document.getElementsByClassName("van-field__label--left");
      for (let i = 0; i < labelList.length; i++) {
        spanList[i].style.fontSize = '.36rem';
        inputList[i].style.fontSize = '.36rem';
        cellList[i].style.alignItems = 'center';
        cellList[i].style.padding = '.2rem .5rem';
        labelList[i].style.textAlign = 'left';
      }
    },
    methods: {
      getUploadPolicy(fn,file) {
        let _self = this;
        getUploadPolicy().then(res => {
          if (res.status == 200) {
            this.uploadPolicy = res.data;
            if(fn) fn(file);
          }
        })
      },
      /*
        获取实景案例详情
      */
      sceneProgrammeDetail() {
        let _self = this;
        if (!this.programmeId) {
          this.showPage = true;
          return;
        }
        sceneProgrammeDetail(this.programmeId).then(res => {
          this.showPage = true;
          this.showListFlag = true;
          if (res.data.code == 200) {
            let data = res.data.data.sceneProgramme;
            this.village = data.buildingName;
            this.buyTimes = data.buyTimes;
            this.evaluate = data.buyerComment;
            this.layoutVal = data.modelName;
            this.areaVal = data.modelArea;
            this.addressVal = data.provinceName + '/' + data.cityName + '/' + data.areaName;
            this.styleVal = data.styleName;
            this.sceneType = data.sceneType;
            this.videoSrc = data.videoUrl;
            this.videoUrl = data.videoUrl;
            if(this.videoSrc) this.showVideo = true;
            if (data.sceneType == 0) this.sceneVal = "家装";
            else if (data.sceneType == 1) this.sceneVal = "工程";
            let addressIdStr = data.provinceId + "," + data.cityId + "," + data.areaId;
            this.idList = addressIdStr.split(",");
            this.styleId = data.styleId;
            this.spaceList = res.data.data.sceneSpaceList;
            for (let i = 0; i < this.spaceList.length; i++) {
              this.previewList.push(this.spaceList[i].imageUrl);
            }
          }
        }).catch(e => {
          this.showPage = true;
        })
      },
      getComInfo() {
        getComInfo().then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            if (data.provinceName && data.cityName && data.districtName) {
              let addressIdStr = data.provinceCode + "," + data.cityCode + "," + data.districtCode;
              this.addressVal = data.provinceName + '/' + data.cityName + '/' + data.districtName;
              this.idList = addressIdStr.split(",");
            }
          }
        })
      },
      /*
        选择风格 户型 面积相关方法
      */
      getListStyle() {
        getListStyle().then(res => {
          if (res.data.code == 200) {
            this.styleList = res.data.data;
            for (let i = 0; i < this.styleList.length; i++) {
              this.columns.push(this.styleList[i].styleName);
            }
          }
        });
      },
      showStyleBox() {
        if (this.readonly) return;
        this.showStylePicker = true;
      },
      showSceneBox() {
        if (this.readonly) return;
        this.showScenePicker = true;
      },
      onSceneConfirm(item) {
        this.sceneVal = item;
        if (item == "工程") this.sceneType = 1;
        else if (item == "家装") this.sceneType = 0;
        this.showScenePicker = false;
      },
      onSceneCancel() {
        this.showScenePicker = false;
      },
      onStyleConfirm(style) {
        this.styleVal = style;
        this.showStylePicker = false;
        for (let i = 0; i < this.styleList.length; i++) {
          if (style == this.styleList[i].styleName) {
            this.styleId = this.styleList[i].styleId;
          }
        }
      },
      onStyleCancel() {
        this.showStylePicker = false;
      },
      onLayoutConfirm(val) {
        this.layoutVal = val;
        this.showLayoutPicker = false;
      },
      onLayoutCancel() {
        this.showLayoutPicker = false;
      },
      onAreaConfirm(val) {
        this.areaVal = val;
        this.showAreaPicker = false;
      },
      onAreaCancel() {
        this.showAreaPicker = false;
      },
      /*
        选择省市区相关方法
      */
      showAddressBox() {
        if (this.readonly) return;
        this.showCityPicker = true;
      },
      getProvince() {
        province().then(res => {
          if (res.status == 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].provinceName;
              obj.id = res.data.data[i].provinceId;
              this.addressList[0].values.push(obj);
            }
            let originalObj = {
              name: '请选择'
            };
            this.addressList[0].values.splice(0, 0, originalObj);
          }
        });
      },
      getCity(value, index) {
        let obj = {};
        let provinceId = value[index].id;
        if (!provinceId) {
          this.addressList[1].values = [];
          this.addressList[2].values = [];
          return;
        }
        obj.provinceId = provinceId;
        city(obj).then(res => {
          if (res.status == 200) {
            this.addressList[1].values = [];
            this.addressList[2].values = [];
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].cityName;
              obj.id = res.data.data[i].cityId;
              this.addressList[1].values.push(obj);
            }
            let originalObj = {
              name: '请选择'
            };
            this.addressList[1].values.splice(0, 0, originalObj);
          }
        })
      },
      getCounty(val, i) {
        let obj = {};
        let cityId = val[i].id;
        if (!cityId) {
          this.addressList[2].values = [];
          return;
        }
        obj.cityId = cityId;
        area(obj).then(res => {
          if (res.status == 200) {
            this.addressList[2].values = [];
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].areaName;
              obj.id = res.data.data[i].areaId;
              this.addressList[2].values.push(obj);
            }
            let originalObj = {
              name: '请选择'
            };
            this.addressList[2].values.splice(0, 0, originalObj);
          }
        })
      },
      onChange(picker, value, index) {
        if (index == 0) this.getCity(value, index);
        else if (index == 1) this.getCounty(value, index);
      },
      onConfirm(chooseList) {
        let addArr = [];
        let flag = true;
        this.idList = [];
        for (let i = 0; i < chooseList.length; i++) {
          if (!chooseList[i] || !chooseList[i].id) {
            this.$toast('请选择完整省市区');
            flag = false;
            break;
          } else {
            if (chooseList[i].name && chooseList[i].name != '请选择' && chooseList[i].name != "null")
              addArr.push(chooseList[i].name);
            if (chooseList[i].id)
              this.idList.push(chooseList[i].id);
          }
        }
        if (!flag) return;
        this.addressVal = addArr.join('/');
        this.showCityPicker = false;
      },
      onCancel() {
        this.showCityPicker = false;
      },
      beforeRead(file) {
        console.log(file);
        let maxSize = 30 * 1024;
        let fileSize = file.size / 1024;
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
          this.$toast('不能上传图片');
          return false;
        }
        if (maxSize < fileSize) {
          this.$toast('视频大小不能超过30MB');
          return false;
        }
        if(file.name.indexOf("wmv")!=-1||file.name.indexOf("avi")!=-1) {
          this.$toast('暂不支持该视频格式，请重新上传');
          return false;
        }
        let uploadUrl = window.URL.createObjectURL(file); // 将选中的上传文件转化为二进制文件，显示在页面上
        this.videoSrc = uploadUrl;
        return true;
      },
      afterRead(file) {
        let timestamp = Date.parse(new Date()) / 1000;
        if (this.uploadPolicy.expire < timestamp + 3) {
          this.getUploadPolicy(this.uploadToAliyun,file);
          return;
        }
        this.uploadToAliyun(file);
      },
      uploadToAliyun(file) {
        this.uploadVideoFlag = true;
        this.canSave = true;
        let _self = this;
        var getSuffix = function(fileName) {
          var pos = fileName.lastIndexOf(".");
          var suffix = '';
          if (pos != -1) {
            suffix = fileName.substring(pos);
          }
          return suffix;
        }
        var filename = new Date().getTime() + getSuffix(file.file.name);
        var formData = new FormData();
        formData.append('key', _self.uploadPolicy.dir + filename); //存储在oss的文件路径
        formData.append('OSSAccessKeyId', _self.uploadPolicy.accessid); //accessKeyId
        formData.append('policy', _self.uploadPolicy.policy); //policy
        formData.append('Signature', _self.uploadPolicy.signature); //签名
        formData.append('success_action_status', 200); //成功后返回的操作码
        formData.append('file', file.file);
        var url = _self.uploadPolicy.host;
        var fileUrl = _self.uploadPolicy.host + '/' + _self.uploadPolicy.dir + filename;
        axios({
          method: 'POST',
          url: url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.uploadVideoFlag = false;
          this.canSave = false;
          if (response.status == 200) {
            _self.videoUrl = _self.uploadPolicy.oceanoDomain + '/' + _self.uploadPolicy.dir + filename;
            this.showVideo = true;
          }else {
            this.showVideo = false;
            this.$toast("上传失败");
          }
        }).catch(error => {
            this.showVideo = false;
            this.uploadVideoFlag = false;
            this.canSave = false;
            this.$toast("上传失败");
        })
      },
      previewVideo() {
        this.showVideoMask = true;
        // document.getElementsByTagName("body")[0].style.overflow = 'hidden';
      },
      closeVideoMask() {
        this.showVideoMask = false;
        // document.getElementsByTagName("body")[0].style.overflow = 'auto';
      },
      deleteVideo() {
        this.$dialog.confirm({
            title: '删除视频',
            message: '确定删除该视频吗？',
          })
          .then(() => {
            this.videoSrc = "";
            this.videoUrl = "";
            this.showVideo = false;
          })
          .catch(() => {
            // on cancel
          });
      },
      /*
        点击按钮相关方法
      */
      save() {
        let param = {};
        if (!this.village) {
          this.$toast('请填写小区名称');
          return;
        }
        if (!this.buyTimes) {
          this.$toast('请填写选购次数');
          return;
        }
        if (parseInt(this.buyTimes) < 0 || this.buyTimes.toString().indexOf(".") != -1) {
          this.$toast('选购次数格式错误,只能为正整数');
          return;
        }
        if (isNaN(this.buyTimes)) {
          this.$toast('选购次数格式错误，只能为数字');
          return;
        }
        if (!this.evaluate) {
          this.$toast('请填写买家评价');
          return;
        }
        if (!this.addressVal) {
          this.$toast('请选择城市');
          return;
        }
        if (!this.sceneVal) {
          this.$toast('请选择实景类型');
          return;
        }
        if (!this.styleVal) {
          this.$toast('请选择风格');
          return;
        }
        if (!this.layoutVal) {
          this.$toast('请输入户型');
          return;
        }
        if (!this.areaVal) {
          this.$toast('请输入面积');
          return;
        }
        if (isNaN(this.areaVal)) {
          this.$toast('面积格式错误，只能为数字');
          return;
        }
        if (parseInt(this.areaVal) < 0) {
          this.$toast('面积格式错误，只能为正数');
          return;
        }
        let iconRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
        if(iconRule.test(this.evaluate)||iconRule.test(this.village)||iconRule.test(this.layoutVal)) {
          this.$toast('不能输入表情符号，请重新输入');
          return;
        }
        this.saveFlag = true;
        param.buildingName = this.village;
        param.buyTimes = this.buyTimes;
        param.buyerComment = this.evaluate;
        param.provinceId = this.idList[0];
        param.cityId = this.idList[1];
        param.areaId = this.idList[2];
        param.modelName = this.layoutVal;
        param.modelArea = this.areaVal;
        param.styleId = this.styleId;
        param.sceneType = this.sceneType;
        param.id = this.programmeId ? this.programmeId : '';
        param.videoUrl = this.videoUrl ? this.videoUrl : '';
        saveSceneProgramme(param).then(res => {
          this.saveFlag = false;
          if (res.data.code == 200) {
            this.$toast(res.data.msg);
            if (!this.programmeId || !this.spaceList.length) {
              this.$router.push({
                path: '/editImg',
                query: {
                  id: res.data.data,
                  readonly: this.readonly
                }
              });
              return;
            }
            this.$router.push({
              path: '/uploadImgIndex'
            });
          }
        }).catch(e => {
          this.saveFlag = false;
        })
      },
      cancel() {
        this.$router.back(-1);
      },
      uploadVideo() {
        this.$router.push({
          path: '/uploadVideo',
          query: {
            id: this.programmeId,
            readonly: this.readonly
          }
        });
      },
      goUpload() {
        this.$router.push({
          path: '/editImg',
          query: {
            id: this.programmeId,
            readonly: this.readonly
          }
        });
      },
      goSpaceDetail(spaceId) {
        this.$router.push({
          path: '/editImg',
          query: {
            id: this.programmeId,
            spaceId: spaceId,
            readonly: this.readonly
          }
        });
      },
      deleteItem(id) {
        this.$dialog.confirm({
            title: '删除空间',
            message: '确定删除该空间吗？',
          })
          .then(() => {
            // on confirm
            this.deleteFlag = true;
            deleteMySceneSpace(id).then(res => {
              this.deleteFlag = false;
              this.$toast(res.data.msg);
              if (res.data.code == 200) {
                this.showListFlag = false;
                this.sceneProgrammeDetail();
              }
            })
          })
          .catch(() => {
            // on cancel
          });

      }
    }
  }
</script>

<style scoped>
  /* video::-webkit-media-controls-fullscreen-button {
    display: none;
  } */

  .video_mask {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    background: #000;
    z-index: 9999;
  }

  .loading_box {
    position: absolute;
    display: flex;
    width: 6rem;
    height: 6rem;
    top: 50%;
    left: 50%;
    margin-left: -3rem;
    margin-top: -3rem;
    flex-wrap: wrap;
    background: rgba(0, 0, 0, .5);
    justify-content: center;
    align-items: center;
  }

  .border_bottom {
    border-bottom: 1px solid #ebedf0;
  }

  .input_box {
    margin: 0 0 .6rem .4rem;
    /* font-size: 20px; */
  }

  .button_box {
    margin-top: .6rem;
    margin-right: .4rem;
  }

  .space_list_box {
    padding: 0 .4rem 1rem;
  }

  .space_pic_list {
    position: relative;
    margin-bottom: .6rem;
    color: #000;
    /* box-shadow: 0 0 3px #ccc; */
  }

  .icon_box {
    position: absolute;
    right: -0.5rem;
    top: -0.4rem;
    width: 1rem;
    height: 1rem;
  }

  .van-cell:not(:last-child)::after {
    border: none !important;
  }
</style>
