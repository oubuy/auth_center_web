<template>
  <div style="margin: 0 20px 20px;">
    <Form :label-width="100" :model="formData" ref="formData">
      <FormItem label="小区:" style="width:300px;" prop="buildingName">
        <Input v-model="formData.buildingName" placeholder="请输入小区名称" clearable></Input>
      </FormItem>
      <FormItem label="风格:" style="width:300px;" prop="styleId">
        <Select v-model="formData.styleId" placeholder="请选择风格" clearable>
          <Option v-for="(item,index) in styleColumns" :value="item.styleId" :key="index">{{ item.styleName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="户型:" style="width:300px;" prop="modelName">
        <Input v-model="formData.modelName" placeholder="请输入户型" clearable></Input>
      </FormItem>
      <FormItem label="面积:" style="width:300px;" prop="modelArea">
        <Input v-model="formData.modelArea" placeholder="请输入面积" clearable></Input>
      </FormItem>
      <FormItem label="实景图类型:" style="width:300px;" prop="sceneType">
        <Select v-model="formData.sceneType" placeholder="请选择类型" clearable>
          <Option v-for="(item,index) in sceneTypeColumns" :value="index" :key="index">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="第*次选购:" style="width:300px;" prop="buyTimes">
        <Input v-model="formData.buyTimes" placeholder="请输入选购次数" clearable></Input>
      </FormItem>
      <FormItem label="省/市/区:">
        <Select v-model="formData.provinceVal" style="margin-right: 10px;width: 100px;" @on-change="changeProvince"
          placeholder="省">
          <Option v-for="(item,index) in provinceList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
        <Select v-model="formData.cityVal" style="margin-right: 10px;width: 100px;" @on-change="changeCity" placeholder="市">
          <Option v-for="(item,index) in cityList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
        <Select v-model="formData.countyVal" @on-change="changeCounty" placeholder="区" style="width: 100px;">
          <Option v-for="(item,index) in countyList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="买家评价:">
        <div>{{formData.buyerComment}}</div>
      </FormItem>
      <FormItem label="提交经销商:" style="width:300px;">
        <div>{{formData.orgName}}</div>
      </FormItem>
      <FormItem label="提交人:" style="width:300px;" prop="buyTimes">
        <div>{{formData.creater}}</div>
      </FormItem>
      <FormItem label="提交时间:" style="width:300px;" prop="updateTime">
        <div>{{formData.updateTime}}</div>
      </FormItem>
	  <FormItem label="720全景链接:">
      <span >{{formData.panoramaUrl}}</span>
      <span style="color: red;padding-left: 10px;cursor: pointer;text-decoration: underline;" v-if="formData.panoramaUrl!='无'" @click="go720Link(formData.panoramaUrl)">查看</span>
      <div v-if="formData.panoramaUrl!='无'">
        <RadioGroup v-model="formData.panoramaAuditStatus" @on-change="panoramaAuditStatusChange">
          <Radio :label="1">通过</Radio>
          <Radio :label="2">不通过</Radio>
        </RadioGroup>
      </div>
	  </FormItem>
      <FormItem label="实景视频:">
        <div class="item">
          <!-- <span>实景视频：</span> -->
          <div v-if="formData.videoUrl">
            <RadioGroup v-model="formData.videoAuditStatus" @on-change="videoStatusChange">
              <Radio :label="1">通过</Radio>
              <Radio :label="2">不通过</Radio>
            </RadioGroup>
          </div>
          <div style="max-width: 400px;">
            <div v-if="formData.videoUrl" style="position: relative;">
              <video :src="formData.videoUrl" style="width: 100%;object-fit: fill;" controls></video>
              <div style="position: absolute;width: 24px;height: 24px;top: -12px;right: -12px;cursor: pointer;"
                @click.stop="deleteVideo">
                <van-icon name="clear" size="24" />
              </div>
            </div>
            <!-- <div class="no-video" v-if="noVideo">暂无上传实景视频</div> -->
            <div style="position: relative;display: flex;align-items: center;" v-else>
              <van-uploader upload-icon="video" :before-read="beforeRead" :after-read="afterRead" accept="video/ogm,video/mpeg,video/asx,video/mpg,video/ogv,video/webm,video/mov,video/mp4,video/m4v;" />
              </van-uploader>
              <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: #000;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;"
                v-if="uploadVideoFlag">
                <van-loading color="#fff" vertical size=".8rem" style="padding-top: .5rem;" />
                <div style="font-size: .3rem;padding: .2rem 0 .5rem 0;color: #fff;width: 100%;">上传中</div>
                </van-loading>
              </div>
            </div>
          </div>
        </div>
      </FormItem>
    </Form>

    <div class="item" style="display: flex;">
      <span>实景照片：</span>
      <div style="width: 1000px;">
        <div v-for="(item,index) in formData.sceneSpaceList" :key="index" @mouseenter="handleShowButton(index)"
          @mouseleave="handleHideButton" :class="editing&&editIndex==index?'actived':'unactived'" style="margin: 0 10px;border: 1px solid #dcdee2;margin-bottom: 20px;position: relative;">
          <div style="text-align: left;padding: 10px 20px;border-bottom: 1px solid #dcdee2;font-size: 18px;">{{item.spaceTypeName}}</div>
          <div style="display: flex;border-bottom: 1px solid #dcdee2;padding: 0 10px;">
            <div style="width: 50%;text-align: center;border-right: 1px solid #dcdee2;padding: 10px 0;">实景图片</div>
            <div style="width: 50%;text-align: center;padding: 10px 0;">关联产品</div>
          </div>
          <div class="search-product" v-if="editing&&editIndex==index">
            <div style="display: flex;justify-content: center;width: 50%;padding-top: 10px;border-right: 1px solid #dcdee2;">
              <Select v-model="item.spaceTypeId" @on-change="changeSpace" placeholder="请选择空间类型" clearable style="width: 400px;">
                <Option v-for="(spaceItem,spaceIndex) in spaceColumns" :value="spaceItem.spaceTypeId" :key="spaceIndex">{{ spaceItem.spaceTypeName }}</Option>
              </Select>
            </div>
            <div style="display: flex;justify-content: center;width: 50%;position: relative;padding-top: 10px;">
              <Input placeholder="请输入产品名称或产品编码查询" v-model="productVal" @input="onSearch" @on-blur="onBlur" @on-focus="onFocus"
                style="width: 400px;"></Input>
              <div class="drop-box" v-show="showDropBox">
                <div style="display: flex;align-items: center;padding: 20px;border-bottom: 1px solid #f5f5f5;cursor: pointer;"
                  v-for="(imgItem,imgIndex) in productResult" @click="chooseProduct(index,imgItem)">
                  <div style="margin-right: 50px;"><img :src="imgItem.imageUrl" style="display: block;width: 60px;"></div>
                  <div>
                    <div style="margin-bottom: 10px;">{{imgItem.modityName}}</div>
                    <div style="margin-top: 10px;">{{imgItem.officialModel}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex;justify-content: space-between;" ref="content">
            <div style="width: 50%;display: flex;justify-content: center;padding: 10px 0 20px;border-right: 1px solid #dcdee2;">
              <Upload v-if="!item.imageUrl" :show-upload-list="false" :on-success="handleSceneSuccess" accept=".jpeg,.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp"
                :on-format-error="handleSceneError" action="/build-rest/file/uploadImage" :headers="uploadHeaders"
                :format="uploadImgFormat" style="display: inline-block;cursor: pointer;">
                <div>
                  <div style="width: 100px;height:100px;line-height: 100px;background: #f5f5f5;border-radius: 8px;display: flex;justify-content: center;align-items: center;">
                    <Icon type="ios-image" size="24" color="rgb(105, 104, 104)"></Icon>
                  </div>
                  <div style="text-align: center;margin-top: 10px;">上传实景图</div>
                </div>
              </Upload>
              <div v-else style="position: relative;width: 90%;" @mouseover="showClose(index)" @mouseout="hideClose(index)">
                <img ref="sceneImg" :src="item.imageUrl+'?x-oss-process=image/resize,m_fixed,w_2000/quality,q_70'"
                  style="display: block;width: 100%;cursor: pointer;" @click="previewImg(item.imageUrl)">
                <div v-if="editIndex==index&&showSceneClose" style="position: absolute;width: 24px;height: 24px;top: -12px;right: -12px;cursor: pointer;"
                  @click.stop="deleteSpaceImg(index)">
                  <van-icon name="clear" size="24" />
                </div>
                <div style="margin-top: 20px;">
                  <RadioGroup v-model="item.imageList[0].auditStatus" @on-change="imgReview($event,index)">
                    <Radio :label="1">通过</Radio>
                    <Radio :label="2">不通过</Radio>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div style="width: 50%;padding: 10px 0 20px;">
              <div style="display: flex;width: 90%;flex-wrap: wrap;justify-content: space-between;padding: 0 20px;margin: 0 auto;">
                <div v-for="(cItem,cIndex) in item.productList" style="width: 100px;margin: 0 5px 10px;">
                  <div style="position: relative;border: 1px solid #dcdee2;margin-bottom: 4px;" @mouseover="showProductClose(cItem)"
                    @mouseout="hideProductClose(cItem)">
                    <img :src="cItem.imageUrl+'?x-oss-process=image/resize,m_pad,h_1000,w_1000/quality,q_70'" style="display: block;width: 100%;">
                    <div v-if="editing&&currentIndex==cItem" style="position: absolute;width: 18px;height: 18px;top: -9px;right: -9px;cursor: pointer;"
                      @click.stop="deleteProduct(index,cIndex)">
                      <van-icon name="clear" size="18" />
                    </div>
                  </div>
                  <div>
                    <div style="text-align: center;">{{cItem.modityName}}</div>
                    <div style="text-align: center;">{{cItem.officialModel}}</div>
                    <div style="text-align: center;">{{cItem.moditySize}}</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div style="margin: 10px 0;text-align: center;" v-show="editing&&editIndex==index">
            <div style="text-align: center;">
              <Button type="primary" style="margin-right: 10px;" @click="saveEdit(index)">保存</Button>
              <Button @click="cancelEdit(index)">取消</Button>
            </div>
          </div>
          <div class="button-zone">
            <Button type="primary" size="small" style="margin-right: 5px;" @click="editSpace(index,item)">编辑</Button>
            <Button type="error" size="small" @click="deleteSpace(index)">删除</Button>
          </div>
        </div>
        <div style="margin-left: 10px;"><Button @click="addSpace">新增空间</Button></div>
      </div>
    </div>
    <div class="item" style="display: flex;">
      <span style="color: red;">评审结果：</span>
      <div>
        <RadioGroup v-model="formData.auditStatus" @on-change="changeStatus">
          <Radio :label="1">通过</Radio>
          <Radio :label="2">不通过</Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="item" style="display: flex;align-items: center;padding-bottom: 20px;">
      <span style="color: red;">得分：</span>
      <div style="margin-right: 10px;">
        <Input v-model="formData.score" placeholder="请输入得分" clearable @on-change="changePoint"></Input>
      </div>
      <Rate allow-half :value.sync="starValue" @on-change="changeStar" disabled></Rate>
    </div>
    <!-- <div class="item">
      <Button type="primary" style="margin-right: 20px;" @click="saveReview" :loading="saveLoading">保存</Button>
      <Button @click="cancelReview">取消</Button>
    </div> -->
    <div class="toolbar-footer">
      <Button type="primary" style="margin-right: 20px;" @click="saveReview" :loading="saveLoading" :disabled="saveDisabled">保存</Button>
      <Button @click="cancelReview">返回</Button>
    </div>
    <div v-show="previewImgFlag" style="position: fixed;width: 100%;height: 100%;top: 0;left: 0;
        background: rgba(0,0,0,.8);z-index: 1000;overflow: auto;">
      <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;" @click="closePreview">
        <img :src="previewImgUrl+'?x-oss-process=image/resize,m_fixed,w_2000/quality,q_70'" style="display: block;width: 66%;"
          @click.stop>
      </div>
    </div>
    <Spin v-if="spinShow" fix></Spin>
  </div>
</template>

<script>
  import {
    getsceneProgramme,
    sceneProgrammeSave,
    findProducts,
    getListStyle,
    getListSpaceTyle,
    getUploadPolicy,
    sceneProgrammeSaveAudit
  } from "@/api/uploadImg.js";
  import {
    province,
    city,
    area
  } from "@/api/address.js";
  import qs from 'qs';
  import axios from 'axios';
  export default {
    data() {
      return {
        previewImgFlag: false,
        noVideo: false,
        isEdit: false,
        showButton: false,
        editing: false,
        showDropBox: false,
        uploadVideoFlag: false,
        showSceneClose: false,
        saveLoading: false,
        spinShow: false,
        saveDisabled: true,
        buttonActivedIndex: -1,
        editIndex: -1,
        currentIndex: -1,
        previewImgUrl: "",
        productVal: "",
        uploadHeaders: {},
        originalItem: {},
        uploadImgFormat: ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr',
          'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp'
        ],
        programmeId: this.$route.query.id,
        starValue: 0,
        productResult: [],
        styleColumns: [],
        provinceList: [],
        cityList: [],
        countyList: [],
        spaceColumns: [],
        sceneTypeColumns: ["家装", "工程"],
        columns: [{
          title: '空间类型',
          key: 'spaceTypeName',
          width: 200,
          align: "center"
        }, {
          title: "实景照片",
          key: "imageUrl",
          // width: 200,
          align: "center",
          render: (h, params) => {
            let _self = this;
            return h("img", {
              attrs: {
                src: params.row.imageUrl + '?x-oss-process=image/resize,h_500,w_500/quality,q_80'
              },
              style: {
                width: "100px",
                height: "80px",
                padding: "5px 0",
                cursor: "pointer"
              },
              on: {
                click: function() {
                  _self.previewImg(params.row.imageUrl);
                }
              }
            });
          }
        }],
        formData: {
          buildingName: "",
          styleId: "",
          modelName: "",
          modelArea: "",
          sceneType: "",
          buyTimes: "",
          address: "",
          buyerComment: "",
          orgName: "",
          creater: "",
          updateTime: "",
          videoUrl: "",
          provinceVal: '',
          cityVal: '',
          countyVal: '',
          sceneProgramme: {},
          sceneSpaceList: []
        },
        uploadPolicy: {}
      }
    },
    created() {
      this.uploadHeaders.Authorization = localStorage.getItem("jwttoken");
      this.getsceneProgramme();
      this.getListStyle();
      this.getListSpace();
      this.getUploadPolicy();
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'SceneImgReviewList') {
        to.meta.keepAlive = true;
      }
      next();
    },
    methods: {
      getListStyle() {
        getListStyle().then(res => {
          if (res.data.code == 200) {
            let list = res.data.data;
            for (let i = 0; i < list.length; i++) {
              this.styleColumns.push(list[i]);
            }
          }
        });
      },
      getListSpace() {
        getListSpaceTyle().then(res => {
          if (res.data.code == 200 && res.data.msg == "Success") {
            this.spaceColumns = res.data.data;
          }
        });
      },
      getImgNaturalDimensions(oImg, index) {
        var nImg = new Image();
        let _self = this;
        nImg.onload = function() {
          var nWidth = nImg.width,
            nHeight = nImg.height;
          _self.formData.sceneSpaceList[index].imageUrl = _self.formData.sceneSpaceList[index].imageUrl +
            '?x-oss-process=image/resize,m_fixed,w_' + nWidth + '/quality,q_70';
        }
        nImg.src = oImg.src;
      },
      getsceneProgramme() {
        this.spinShow = true;
        getsceneProgramme(this.programmeId).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            this.formData.sceneProgramme = data.sceneProgramme;
            this.formData.buildingName = data.sceneProgramme.buildingName;
            this.formData.styleId = data.sceneProgramme.styleId;
            this.formData.modelName = data.sceneProgramme.modelName;
            this.formData.modelArea = data.sceneProgramme.modelArea;
            this.formData.sceneType = data.sceneProgramme.sceneType;
            this.formData.buyTimes = data.sceneProgramme.buyTimes;
            this.formData.address = data.sceneProgramme.provinceName + "/" + data.sceneProgramme.cityName + "/" +
              data.sceneProgramme.areaName;
            this.formData.buyerComment = data.sceneProgramme.buyerComment;
            if (data.com) this.formData.orgName = data.com.orgName;
            this.formData.creater = data.sceneProgramme.creater;
            this.formData.updateTime = data.sceneProgramme.updateTime;
            this.formData.videoUrl = data.sceneProgramme.videoUrl;
            this.formData.sceneSpaceList = data.sceneSpaceList;
            this.formData.auditStatus = data.sceneProgramme.auditStatus;
            this.formData.score = data.sceneProgramme.score;
            this.formData.provinceVal = data.sceneProgramme.provinceId;
            this.formData.cityVal = data.sceneProgramme.cityId;
            this.formData.countyVal = data.sceneProgramme.areaId;
            this.formData.panoramaAuditStatus = data.sceneProgramme.panoramaAuditStatus || "";
            this.formData.panoramaUrl = data.sceneProgramme.panoramaUrl || "无";
            this.formData.videoAuditStatus = data.sceneProgramme.videoAuditStatus ? data.sceneProgramme.videoAuditStatus :
              "";
            for (let i = 0, l = this.formData.sceneSpaceList.length; i < l; i++) {
              this.formData.sceneSpaceList[i].imageList[0].auditStatus = this.formData.sceneSpaceList[i].imageList[
                0].auditStatus ? this.formData.sceneSpaceList[i].imageList[0].auditStatus : "";
            }
            if (!this.formData.videoUrl) this.noVideo = true;
            if (this.formData.score > 0 && this.formData.score < 20) {
              this.starValue = 0.5;
            } else if (this.formData.score >= 20 && this.formData.score < 30) {
              this.starValue = 1;
            } else if (this.formData.score >= 30 && this.formData.score < 40) {
              this.starValue = 1.5;
            } else if (this.formData.score >= 40 && this.formData.score < 50) {
              this.starValue = 2;
            } else if (this.formData.score >= 50 && this.formData.score < 60) {
              this.starValue = 2.5;
            } else if (this.formData.score >= 60 && this.formData.score < 70) {
              this.starValue = 3;
            } else if (this.formData.score >= 70 && this.formData.score < 80) {
              this.starValue = 3.5;
            } else if (this.formData.score >= 80 && this.formData.score < 90) {
              this.starValue = 4;
            } else if (this.formData.score >= 90 && this.formData.score < 100) {
              this.starValue = 4.5;
            } else if (this.formData.score >= 100) {
              this.starValue = 5;
            }
            // this.$nextTick(() => {
            //   for (let i = 0, l = this.formData.sceneSpaceList.length; i < l; i++) {
            //     let width = this.getImgNaturalDimensions(this.$refs.sceneImg[i],i);
            //   }
            // })
            this.getProvince();
          }
          this.spinShow = false;
          this.saveDisabled = false;
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
      getProvince() {
        province().then(res => {
          if (res.status == 200) {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {};
              obj.name = res.data.data[i].provinceName;
              obj.id = res.data.data[i].provinceId;
              this.provinceList.push(obj);
            }
            this.getCity(this.formData.provinceVal);
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
            this.getCounty(this.formData.cityVal);
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
      addSpace() {
        this.originalItem = {
          id: "",
          spaceTypeId: "",
          spaceTypeName: "空间",
          imageUrl: "",
          imageList: [],
          productList: []
        }
        this.formData.sceneSpaceList.push({
          id: "",
          spaceTypeId: "",
          spaceTypeName: "空间",
          imageUrl: "",
          imageList: [],
          productList: []
        });
        this.editing = true;
        this.editIndex = this.formData.sceneSpaceList.length - 1;
      },
      showClose(index) {
        if (this.editIndex == index) this.showSceneClose = true;
      },
      hideClose(index) {
        this.showSceneClose = false;
      },
      showProductClose(index) {
        this.currentIndex = index;
      },
      hideProductClose(index) {
        this.currentIndex = -1;
      },
      changeProvince(provinceId) {
        this.formData.provinceVal = provinceId;
        this.formData.cityVal = "";
        this.formData.countyVal = "";
        this.cityList = [];
        this.countyList = [];
        this.getCity(provinceId);
      },
      changeCity(cityId) {
        this.formData.cityVal = cityId;
        this.formData.countyVal = "";
        this.countyList = [];
        this.getCounty(cityId);
      },
      changeCounty(countyId) {
        this.formData.countyVal = countyId;
      },
      beforeRead(file) {
        let maxSize = 100 * 1024;
        let fileSize = file.size / 1024;
        if (!/\.(ogm|mpeg|asx|mpg|ogv|webm|mov|mp4|m4v)$/.test(file.name)) {
          this.$Message.warning('只能上传视频');
          return false;
        }
        if (file.name.indexOf("wmv") != -1 || file.name.indexOf("avi") != -1) {
          this.$Message.warning('暂不支持该视频格式，请重新上传');
          return false;
        }
        if (maxSize < fileSize) {
          this.$Message.warning('视频大小不能超过100M');
          return false;
        }
        let uploadUrl = window.URL.createObjectURL(file); // 将选中的上传文件转化为二进制文件，显示在页面上
        // this.formData.videoUrl = uploadUrl;
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
          if (response.status == 200) {
            this.uploadVideoFlag = false;
            _self.formData.videoUrl = _self.uploadPolicy.oceanoDomain + '/' + _self.uploadPolicy.dir + filename;
          } else {
            this.uploadVideoFlag = false;
            this.$Message.warning("上传失败");
          }
        }).catch(error => {
          this.uploadVideoFlag = false;
          this.$Message.warning("上传失败");
        })
      },
      handleShowButton(index) {
        this.showButton = true;
        this.buttonActivedIndex = index;
      },
      handleHideButton() {
        this.showButton = false;
        this.buttonActivedIndex = -1;
      },
      editSpace(index, item) {
        if (this.editing && this.editIndex != index) {
          this.$Message.warning("您还有未编辑完成的空间，请先保存或取消编辑！");
          return;
        }
        this.$refs.content[index].style.borderBottom = "1px solid rgb(220, 222, 226)";
        this.editing = true;
        this.editIndex = index;
        this.originalItem = JSON.parse(JSON.stringify(item));
      },
      changeSpace(val) {
        this.spaceColumns.forEach(item => {
          if (val == item.spaceTypeId) {
            this.formData.sceneSpaceList[this.editIndex].spaceTypeName = item.spaceTypeName;
          }
        })
        this.formData.sceneSpaceList[this.editIndex].spaceTypeId = val;
      },
      onSearch(val) {
        if (!val) {
          this.showDropBox = false;
          return;
        }
        let obj = {
          productName: val
        }
        findProducts(obj).then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.productResult = res.data.data;
            if (this.productResult.length) this.showDropBox = true;
          }
        })

      },
      chooseProduct(index, item) {
        let obj = {};
        obj.spaceId = this.formData.sceneSpaceList[index].id;
        obj.modityName = item.modityName;
        obj.productId = item.skuModityId;
        obj.imageUrl = item.imageUrl;
        obj.moditySize = item.skuModitySize;
        obj.mainPicture = item.mainPicture;
        obj.id = "";
        obj.officialModel = item.officialModel;
        this.formData.sceneSpaceList[index].productList.push(obj);
        this.showDropBox = false;
        this.productResult = [];
        this.productVal = "";
      },
      onFocus() {
        if (this.productResult.length) this.showDropBox = true;
      },
      onBlur() {
        let _self = this;
        setTimeout(function() {
          _self.showDropBox = false;
        }, 200)
      },
      saveEdit(index) {
        if (!this.formData.sceneSpaceList[index].imageUrl) {
          this.$Message.warning("请上传空间图");
          return;
        }
        if (!this.formData.sceneSpaceList[index].productList.length) {
          this.$Message.warning("请选择关联产品");
          return;
        }
        if (!this.formData.sceneSpaceList[index].spaceTypeId) {
          this.$Message.warning("请选择空间");
          return;
        }
        this.$refs.content[index].style.border = "none";
        this.editing = false;
        this.editIndex = -1;
        if (!this.formData.sceneSpaceList[index].id) this.formData.sceneSpaceList[index].canCancel = true;
      },
      cancelEdit(index) {
        this.$refs.content[index].style.border = "none";
        this.editing = false;
        this.editIndex = -1;
        if (!this.formData.sceneSpaceList[index].id && !this.formData.sceneSpaceList[index].canCancel) {
          this.formData.sceneSpaceList.splice(index, 1);
        } else {
          this.formData.sceneSpaceList[index] = this.originalItem;
        }
      },
      deleteVideo() {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除该视频？</p>',
          onOk: () => {
            this.formData.videoUrl = "";
            this.uploadVideoFlag = false;
          }
        });
      },
      imgReview(e, index) {
        this.formData.sceneSpaceList[index].imageList[0].auditStatus = Number(e);
      },
      videoStatusChange(val) {
        this.formData.videoAuditStatus = val;
      },
      panoramaAuditStatusChange(val) {
        this.formData.panoramaAuditStatus = val;
      },
      deleteSpace(index) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除该空间？</p>',
          onOk: () => {
            if (index == this.editIndex) {
              this.editing = false;
              this.editIndex = -1;
            }
            this.formData.sceneSpaceList.splice(index, 1);
          }
        });
      },
      deleteSpaceImg(index) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除该空间图片？</p>',
          onOk: () => {
            this.formData.sceneSpaceList[index].imageUrl = "";
          }
        });
      },
      deleteProduct(index, productIndex) {
        this.formData.sceneSpaceList[index].productList.splice(productIndex, 1);
      },
      handleSceneSuccess(res, file) {
        if (res.code == 200) {
          let data = res.data;
          let obj = {};
          obj.imageUrl = data.imageUrl;
          obj.isMain = false;
          this.formData.sceneSpaceList[this.editIndex].imageUrl = data.imageUrl;
          this.formData.sceneSpaceList[this.editIndex].imageList[0] = obj;
          console.log(this.formData.sceneSpaceList)
        } else {

        }
      },
      handleSceneError() {

      },
      previewImg(imgUrl) {
        this.previewImgUrl = imgUrl;
        this.previewImgFlag = true;
      },
      closePreview() {
        this.previewImgFlag = false;
        this.previewImgUrl = "";
      },
      changeStatus(val) {
        this.formData.auditStatus = val;
      },
      changePoint(e) {
        if (!this.formData.score) {
          this.starValue = 0;
          return;
        }
        if (isNaN(this.formData.score)) {
          this.starValue = 0;
          return;
        }
        if (this.formData.score < 0) {
          this.starValue = 0;
          return;
        }
        if (this.formData.score > 0 && this.formData.score < 20) {
          this.starValue = 0.5;
        } else if (this.formData.score >= 20 && this.formData.score < 30) {
          this.starValue = 1;
        } else if (this.formData.score >= 30 && this.formData.score < 40) {
          this.starValue = 1.5;
        } else if (this.formData.score >= 40 && this.formData.score < 50) {
          this.starValue = 2;
        } else if (this.formData.score >= 50 && this.formData.score < 60) {
          this.starValue = 2.5;
        } else if (this.formData.score >= 60 && this.formData.score < 70) {
          this.starValue = 3;
        } else if (this.formData.score >= 70 && this.formData.score < 80) {
          this.starValue = 3.5;
        } else if (this.formData.score >= 80 && this.formData.score < 90) {
          this.starValue = 4;
        } else if (this.formData.score >= 90 && this.formData.score < 100) {
          this.starValue = 4.5;
        } else if (this.formData.score >= 100) {
          this.starValue = 5;
        }
      },
      changeStar(val) {

      },
      go720Link(url) {
        if(url)
          window.open(url);
      },
      saveReview() {
        let imgPreviewFlag = true;
        if (!this.formData.buildingName) {
          this.$Message.warning("请输入小区名称");
          return;
        }
        if (!this.formData.styleId) {
          this.$Message.warning("请选择风格");
          return;
        }
        if (!this.formData.modelName) {
          this.$Message.warning("请输入户型");
          return;
        }
        if (!this.formData.modelArea) {
          this.$Message.warning("请输入面积");
          return;
        }
        if (this.formData.sceneType + "" == "undefined" || this.formData.sceneType + "" == "null" || this.formData.sceneType +
          "" == "") {
          this.$Message.warning("请选择实景类型");
          return;
        }
        if (!this.formData.buyTimes) {
          this.$Message.warning("请输入选购次数");
          return;
        }
        if (!this.formData.provinceVal || !this.formData.cityVal || !this.formData.countyVal) {
          this.$Message.warning("请选择完整省市区");
          return;
        }
        if (!this.formData.sceneSpaceList.length) {
          this.$Message.warning("请上传实景照片");
          return;
        }
        if (this.editing) {
          this.$Message.warning("您还有未编辑完成的空间，请先保存或取消编辑");
          return;
        }
        for (let i = 0, l = this.formData.sceneSpaceList.length; i < l; i++) {
          if (!this.formData.sceneSpaceList[i].imageList[0].auditStatus) {
            imgPreviewFlag = false;
            break;
          }
        }
        if (!imgPreviewFlag) {
          this.$Message.warning("请先对每张实景图进行审核");
          return;
        }
        if (this.formData.auditStatus == "0") {
          this.$Message.warning("请勾选评审结果");
          return;
        }
        if (!this.formData.score) {
          this.$Message.warning("请输入分数");
          return;
        }
        if (isNaN(this.formData.score)) {
          this.$Message.warning("分数格式有误，请输入数字");
          return;
        }
        if (Number(this.formData.score) > 100 || Number(this.formData.score) < 0) {
          this.$Message.warning("分数范围在0-100，请重新输入");
          return;
        }
        if (!this.formData.videoUrl) {
          this.formData.videoAuditStatus = "";
        } else {
          if (!this.formData.videoAuditStatus) {
            this.$Message.warning("请对视频进行审核");
            return;
          }
        }
        if (this.formData.panoramaUrl=="无") {
          this.formData.panoramaAuditStatus = "";
        } else {
          if (!this.formData.panoramaAuditStatus) {
            this.$Message.warning("请对720全景链接进行审核");
            return;
          }
        }
        this.saveLoading = true;
        this.spinShow = true;
        this.formData.score = Number(this.formData.score);
        let data = this.formData.sceneProgramme;
        let param = {
          id: data.id,
          sceneType: this.formData.sceneType,
          styleId: this.formData.styleId,
          buildingName: this.formData.buildingName,
          provinceId: this.formData.provinceVal,
          cityId: this.formData.cityVal,
          areaId: this.formData.countyVal,
          modelId: data.modelId,
          modelName: this.formData.modelName,
          modelArea: this.formData.modelArea,
          buyTimes: this.formData.buyTimes,
          buyerComment: this.formData.buyerComment,
          videoUrl: this.formData.videoUrl,
          auditStatus: this.formData.auditStatus,
          score: this.formData.score,
          imageUrl: data.imageUrl,
          videoAuditStatus: this.formData.videoAuditStatus,
          panoramaAuditStatus: this.formData.panoramaAuditStatus,
          sceneSpaceList: this.formData.sceneSpaceList
        }
        if (!param.videoUrl) delete param.videoAuditStatus;
        sceneProgrammeSaveAudit(param).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("保存成功");
            this.spinShow = false;
            this.saveLoading = false;
            this.$router.back(-1);
          }
        })
      },
      cancelReview() {
        this.$router.back(-1);
      }
    }
  }
</script>

<style scoped>
  div {
    text-align: left;
  }

  .item {
    /* display: flex; */
    margin-bottom: 20px;
  }

  .item span {
    width: 80px;
    text-align: right;
    margin-right: 20px;
  }

  .no-video {
    width: 350px;
    height: 200px;
    line-height: 200px;
    text-align: center;
    border: 1px dashed rgba(0, 0, 0, .4);
  }

  .search-product {
    position: relative;
    display: flex;
    /* margin: 10px 0 0; */
  }

  .drop-box {
    position: absolute;
    width: 400px;
    max-height: 250px;
    top: 32px;
    left: 50%;
    margin-left: -200px;
    overflow: auto;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .4);
    background: #fff;
    z-index: 1;
  }

  .button-zone {
    position: absolute;
    top: 0;
    right: 0;
  }

  .actived {
    box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, .5);
    transition: box-shadow .5s;
  }

  .unactived {
    box-shadow: none;
    transition: box-shadow .5s;
  }

  .toolbar-footer {
    position: fixed;
    width: 100%;
    padding: 10px 20px;
    text-align: left;
    bottom: 0px;
    left: 210px;
    z-index: 100;
    background: rgba(248, 248, 249, 0.8);
  }
</style>
