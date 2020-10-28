<template>
  <div style="margin-top: 30px;">
    <div v-show="showPage">
      <Form :label-width="100">
        <FormItem label="小区:" style="width:300px;">
          <Input v-model="village" placeholder="请输入小区名称"></Input>
        </FormItem>
        <FormItem label="第*次选购:" style="width:300px;">
          <Input v-model="buyTimes" placeholder="请输入选购次数"></Input>
        </FormItem>
        <FormItem label="买家评价:" style="width:300px;">
          <Input v-model="evaluate" placeholder="请输入买家评价"></Input>
        </FormItem>
        <FormItem label="户型:" style="width:300px;">
          <Input v-model="layoutVal" placeholder="请输入户型"></Input>
        </FormItem>
        <FormItem label="面积:" style="width:300px;">
          <Input v-model="areaVal" placeholder="请输入面积"></Input>
        </FormItem>
        <FormItem label="省/市/区:">
          <Select v-model="provinceVal" style="margin-right: 10px;width: 100px;" @on-change="changeProvince">
            <Option v-for="(item,index) in provinceList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Select v-model="cityVal" style="margin-right: 10px;width: 100px;" @on-change="changeCity">
            <Option v-for="(item,index) in cityList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Select v-model="countyVal" @on-change="changeCounty" style="width: 100px;">
            <Option v-for="(item,index) in countyList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="实景类型:" style="width:300px;">
          <Select v-model="sceneVal" @on-change="changeSceneVal">
            <Option v-for="(item,index) in sceneColumns" :value="index+1" :key="index">{{ item }}</Option>
          </Select>
        </FormItem> -->
        <FormItem label="风格:" style="width:300px;">
          <Select v-model="styleVal" @on-change="changeStyle">
            <Option v-for="(item,index) in columns" :value="item.styleId" :key="index">{{ item.styleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="720全景链接:">
          <Input v-model="panoramaUrl" placeholder="请输入720全景链接" style="width: 400px;"></Input>
          <div style="color: red;">
            <span>请使用欧神诺720度全景工具生成的链接！</span>
            <span @click="goYunUrl" style="color: red;cursor: pointer;text-decoration: underline;">点我查看</span>
          </div>
        </FormItem>
        <FormItem label="视频:">
          <div class="video_box" style="max-width: 6rem;text-align: left;position: relative;" id="video" v-if="videoSrc&&showVideo"
            @click="previewVideo">
            <video :src="videoSrc" style="width: 100%;object-fit: fill;" controls webkit-playsinline playsinline
              x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>
            <div v-if="!readonly" style="position: absolute;top: -12px;right: -12px;width: 24px;height: 24px;cursor: pointer;"
              @click.stop="deleteVideo">
              <van-icon name="clear" size="24" />
            </div>
          </div>
          <div style="position: relative;" v-else>
            <van-uploader upload-icon="video" :before-read="beforeRead" :after-read="afterRead" accept="video/ogm,video/mpeg,video/asx,video/mpg,video/ogv,video/webm,video/mov,video/mp4,video/m4v;"
              :disabled="readonly" :deletable="!readonly" />
            </van-uploader>
            <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: #000;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;"
              v-if="uploadVideoFlag">
              <van-loading color="#fff" vertical size=".8rem" style="padding-top: .5rem;" />
              <div style="font-size: .3rem;padding: .2rem 0 .5rem 0;color: #fff;width: 100%;">上传中</div>
              </van-loading>
            </div>
            <div style="color: red;">请上传横屏视频，支持MP4、MOV、AVI、WMV格式，文件大小30MB以内。</div>
          </div>
        </FormItem>
        <div class="button_box" v-if="!readonly">
          <Button type="primary" size="large" @click.prevent="save" :disabled="canSave" style="margin-right: 20px;">保存</Button>
          <Button @click.prevent="cancel" size="large">返回</Button>
          <Button size="large" style="width: 100px;margin-left: 20px;" @click="goUpload" :disabled="canUpload">上传空间</Button>
          <span style="color: red;padding-left: 10px;" v-if="canUpload">先保存基本信息后再上传空间图片</span>
        </div>
      </Form>
      <div class="space_list_box">
        <!-- <div class="upload_button" v-if="programmeId&&!readonly">
          <Button size="large" style="width: 100px;" @click="goUpload">上传空间</Button>
        </div> -->
        <div class="space_list" v-show="showListFlag">
          <div class="space_item" v-for="(item,index) in spaceList" v-if="spaceList.length" style="width: 460px;margin: 0 20px;">
            <div>
              <van-divider :style="{fontSize: '16px',width: '300px'}">{{item.spaceTypeName}}</van-divider>
            </div>
            <div class="space_pic_list" @click="goSpaceDetail(item.id)">
              <van-image width="100%" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,w_500,h_500/quality,q_80'" />
              <div class="icon_box" @click.stop="deleteItem(item.id)" v-if="!readonly">
                <van-icon name="clear" size="24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <v-loading :showPage="showPage" :saveFlag="saveFlag" :deleteFlag="deleteFlag"></v-loading> -->
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
    getUploadPolicy,
    get720yunTicket
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
        canUpload: true,
        uploadVideoFlag: false,
        showVideo: false,
        showClose: true,
        showVideoMask: false,
        showPage: false,
        saveFlag: false,
        deleteFlag: false,
        showListFlag: true,
        readonly: false,
        programmeId: this.$route.query.id,
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
        panoramaUrl: '',
        provinceVal: '',
        cityVal: '',
        countyVal: '',
        provinceList: [],
        cityList: [],
        countyList: [],
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
        videoUrl: "",
        yunUrl: ""
      }
    },
    components: {},
    created() {
      console.log(this.programmeId)
      // this.deleteMySceneSpace();
      this.readonly = this.$route.query.readonly;
      if(this.readonly) this.readonly = JSON.parse(this.readonly);
      if (!this.programmeId) {
        this.getComInfo();
        this.canUpload = true;
      } else {
        this.sceneProgrammeDetail();
        this.canUpload = false;
      }
      this.get720yunTicket();
      this.getListStyle();
      this.getUploadPolicy();
      // this.getProvince();
    },
    mounted() {
      document.getElementsByClassName("ivu-form-item-content")[5].style.display = "flex";
      document.getElementsByClassName("ivu-form-item-content")[5].style.margin = "0";
      let labelLength = document.getElementsByClassName("ivu-form-item-label").length;
      for (let i = 0; i < labelLength; i++) {
        document.getElementsByClassName("ivu-form-item-label")[i].style.color = "red";
      }
      document.getElementsByClassName("ivu-form-item-label")[8].style.color = "#515a6e";
    },
    beforeRouteLeave(to, from, next) {
      if (to.name == 'SceneImgReviewList') {
        to.meta.isUseCache = true;
      }
      next();
    },
    methods: {
      get720yunTicket() {
        get720yunTicket().then(res=>{
          console.log(res);
          if(res.data.code == 200) {
            if(res.data.data)
              this.yunUrl = "http://720yun.oceano.com.cn/member/project?ticket=" + res.data.data;
            else this.yunUrl = "http://720yun.oceano.com.cn/member/project";
          }
        })
      },
      getUploadPolicy(fn, file) {
        let _self = this;
        getUploadPolicy().then(res => {
          if (res.status == 200) {
            this.uploadPolicy = res.data;
            if (fn) fn(file);
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
            this.provinceVal = data.provinceId;
            this.cityVal = data.cityId;
            this.countyVal = data.areaId;
            this.styleVal = data.styleId;
            this.sceneType = data.sceneType;
            this.videoSrc = data.videoUrl;
            this.videoUrl = data.videoUrl;
            this.panoramaUrl = data.panoramaUrl;
            if (this.videoSrc) this.showVideo = true;
            if (data.sceneType == 0) this.sceneVal = 1;
            else if (data.sceneType == 1) this.sceneVal = 2;
            let addressIdStr = data.provinceId + "," + data.cityId + "," + data.areaId;
            this.idList = addressIdStr.split(",");
            this.styleId = data.styleId;
            this.spaceList = res.data.data.sceneSpaceList;
            for (let i = 0; i < this.spaceList.length; i++) {
              this.previewList.push(this.spaceList[i].imageUrl);
            }
            this.getProvince();
          }
        }).catch(e => {
          this.showPage = true;
        })
      },
      getComInfo() {
        getComInfo().then(res => {
          this.showPage = true;
          this.showListFlag = true;
          if (res.data.code == 200) {
            let data = res.data.data;
            if (data.provinceCode && data.cityCode && data.districtCode) {
              this.provinceVal = data.provinceCode;
              this.cityVal = data.cityCode;
              this.countyVal = data.districtCode;
            }
            this.getProvince();
          }
        }).catch(e => {
          this.showPage = true;
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
              this.columns.push(this.styleList[i]);
            }
          }
        });
      },
      changeSceneVal(secneId) {
        this.sceneVal = secneId;
        this.sceneType = secneId - 1;
      },
      changeStyle(styleId) {
        this.styleVal = styleId;
        this.styleId = styleId;
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
              this.provinceList.push(obj);
            }
            this.getCity(this.provinceVal);
          }
        });
      },
      getCity(provinceId) {
        let obj = {};
        if (!provinceId) {
          return;
        }
        obj.provinceId = provinceId;
        city(obj).then(res => {
          if (res.status == 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].cityName;
              obj.id = res.data.data[i].cityId;
              this.cityList.push(obj);
            }
            this.getCounty(this.cityVal);
          }
        })
      },
      getCounty(cityId) {
        let obj = {};
        if (!cityId) {
          return;
        }
        obj.cityId = cityId;
        area(obj).then(res => {
          if (res.status == 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].areaName;
              obj.id = res.data.data[i].areaId;
              this.countyList.push(obj);
            }
          }
        })
      },
      changeProvince(provinceId) {
        this.provinceVal = provinceId;
        this.cityVal = "";
        this.countyVal = "";
        this.cityList = [];
        this.countyList = [];
        this.getCity(provinceId);
      },
      changeCity(cityId) {
        this.cityVal = cityId;
        this.countyVal = "";
        this.countyList = [];
        this.getCounty(cityId);
      },
      changeCounty(countyId) {
        this.countyVal = countyId;
      },
      goYunUrl() {
        if(this.yunUrl)
          window.open(this.yunUrl);
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
        if (file.name.indexOf("wmv") != -1 || file.name.indexOf("avi") != -1) {
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
          this.getUploadPolicy(this.uploadToAliyun, file);
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
          } else {
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
        if (!this.provinceVal) {
          this.$toast('请选择省');
          return;
        }
        if (!this.cityVal) {
          this.$toast('请选择市');
          return;
        }
        if (!this.countyVal) {
          this.$toast('请选择区');
          return;
        }
        // if (!this.sceneVal) {
        //   this.$toast('请选择实景类型');
        //   return;
        // }
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
        let iconRule =
          /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
        if (iconRule.test(this.evaluate) || iconRule.test(this.village) || iconRule.test(this.layoutVal)) {
          this.$toast('不能输入表情符号，请重新输入');
          return;
        }
        this.saveFlag = true;
        param.buildingName = this.village;
        param.buyTimes = this.buyTimes;
        param.buyerComment = this.evaluate;
        param.provinceId = this.provinceVal;
        param.cityId = this.cityVal;
        param.areaId = this.countyVal;
        param.modelName = this.layoutVal;
        param.modelArea = this.areaVal;
        param.styleId = this.styleId;
        // param.sceneType = this.sceneType;
        param.sceneType = 1;
        param.id = this.programmeId ? this.programmeId : '';
        param.videoUrl = this.videoUrl ? this.videoUrl : '';
        param.panoramaUrl = this.panoramaUrl;
        saveSceneProgramme(param).then(res => {
          this.saveFlag = false;
          if (res.data.code == 200) {
            this.$toast(res.data.msg);
            if (!this.programmeId || !this.spaceList.length) {
              // this.$router.push({
              //   path: '/editImgPc',
              //   query: {
              //     id: res.data.data,
              //     readonly: this.readonly
              //   }
              // });
              this.programmeId = res.data.data;
              this.canUpload = false;
              return;
            }
            // if(this.$route.query.comeFrom=="review") {
            //   this.$router.push({
            //     path: '/sceneImgReviewList'
            //   });
            // }else {
            //   this.$router.push({
            //     path: '/uploadImgIndexPc'
            //   });
            // }
          }
        }).catch(e => {
          this.saveFlag = false;
        })
      },
      cancel() {
        let origin = this.$route.query.comeFrom;
        if (origin == "review") {
          this.$router.push({
            path: '/sceneImgReviewList'
          });
        } else {
          this.$router.push({
            path: '/uploadImgIndexPc'
          });
        }
      },
      goUpload() {
        this.$router.push({
          path: '/editImgPc',
          query: {
            id: this.programmeId,
            readonly: this.readonly,
            comeFrom: this.$route.query.comeFrom
          }
        });
      },
      goSpaceDetail(spaceId) {
        this.$router.push({
          path: '/editImgPc',
          query: {
            id: this.programmeId,
            spaceId: spaceId,
            readonly: this.readonly,
            comeFrom: this.$route.query.comeFrom
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

  .border_bottom {
    border-bottom: 1px solid #ebedf0;
  }

  .button_box {
    text-align: left;
    margin: .6rem .4rem 30px 42px;
  }

  .space_list_box {
    padding: 0 .4rem 1rem;
  }

  .space_pic_list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    margin-bottom: .6rem;
    color: #000;
    cursor: pointer;
    /* box-shadow: 0 0 3px #ccc; */
  }

  .icon_box {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 24px;
    height: 24px;
  }

  .van-cell:not(:last-child)::after {
    border: none !important;
  }

  .upload_button {
    margin-left: 20px;
    text-align: left;
  }
</style>
