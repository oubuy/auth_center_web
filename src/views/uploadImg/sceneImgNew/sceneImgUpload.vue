<template>
  <div style="margin-top: 30px;">
    <div>
      <Form :label-width="100" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <FormItem label="类型:" prop="sceneVal">
          <RadioGroup v-model="formValidate.sceneVal" @on-change="changeSceneVal">
            <Radio v-for="(item,index) in sceneColumns" :label="index" :key="index" :disabled="index==0"><span>{{item}}</span></Radio>
          </RadioGroup>
          <div style="color: red;margin-left: 10px;">请如实选择实景类型</div>
        </FormItem>
        <FormItem label="名称:" style="width:300px;" prop="village">
          <Input v-model="formValidate.village" :placeholder="placeHolder" clearable></Input>
        </FormItem>
        <FormItem label="户型:" style="width:300px;" prop="layoutVal" v-if="formValidate.sceneVal==0">
          <Input v-model="formValidate.layoutVal" placeholder="例:3室1厅1厨2卫" clearable></Input>
        </FormItem>
        <FormItem label="面积:" style="width:300px;" prop="areaVal" v-if="formValidate.sceneVal==0">
          <Input v-model="formValidate.areaVal" placeholder="请输入户型面积" clearable></Input>
        </FormItem>
        <FormItem label="风格:" style="width:300px;" prop="styleVal" v-if="formValidate.sceneVal==0">
          <Select v-model="formValidate.styleVal" @on-change="changeStyle" placeholder="请选择风格" clearable>
            <Option v-for="(item,index) in styleColumns" :value="item.styleId" :key="index">{{ item.styleName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="简介:" style="width:300px;" prop="introduction" v-if="formValidate.sceneVal==1">
          <Input v-model="formValidate.introduction" placeholder="请输入项目简介" clearable></Input>
        </FormItem>
        <FormItem label="属性:" v-if="formValidate.sceneVal==1" prop="caseAttr2">
          <Select v-model="formValidate.caseAttr1" @on-change="changeCaseAttrOne" placeholder="请选择" clearable style="width:200px;margin-right: 10px;">
            <Option v-for="(item,index) in caseAttrOneColumns" :value="item" :key="index">{{ item }}</Option>
          </Select>
          <Select v-model="formValidate.caseAttr2" @on-change="changeCaseAttrTwo" placeholder="请选择" clearable style="width:200px;">
            <Option v-for="(item,index) in caseAttrTwoColumns" :value="item" :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联产品:" prop="formData">
          <!-- <Input v-model.sync="formValidate.productVal" placeholder="请输入产品型号或名称" style="width: 200px;" @on-change="handleFindProducts"
            @on-blur="handleProductBlur" @on-focus="handleProductFocus"></Input>
          <div class="select-list" v-if="productFlag">
            <div v-for="(item,index) in productList" :key="index" @click="chooseProduct(item)">
              <span style="padding-right: 5px;">{{item.modityName}}</span>
              <span>{{item.officialModel}}</span>
            </div>
          </div> -->
          <Button @click="addProduct">添加产品</Button>
          <div class="product-table">
            <div class="table-header">
              <div class="header-item" v-for="(item) in headerList">{{item}}</div>
            </div>
            <div class="table-content">
              <div class="content-item" v-for="(item,index) in formValidate.formData">
                <div class="table-cell">
                  <input type="text" v-model="item.officialModel" placeholder="请输入型号"
                  @input="handleInputOfficialmodel(item,index)" @blur="handleProductBlur(index)" @focus="handleProductFocus(index)">
                  <div class="product-search-list" v-if="item.productList.length">
                    <div class="search-list-item" v-for="(cItem,cIndex) in item.productList" @click="chooseProduct(index,cIndex)">
                      <span>{{cItem.modityName}}</span>
                      <span>{{cItem.officialModel}}</span>
                    </div>
                  </div>
                </div>
                <div class="table-cell"><input type="text" v-model="item.modityName" placeholder="请输入名称"></div>
                <div class="table-cell"><input type="text" v-model="item.quantity" placeholder="请输入数量" @keyup="handleNumberInput"></div>
                <div class="table-cell"><input type="text" v-model="item.usePosition" placeholder="例:地面"></div>
                <div class="table-cell" @click="deleteProduct(index)"><Button>删除</Button></div>
              </div>
            </div>
          </div>
          <!-- <Table width="952" border :columns="productColumns" :data="formValidate.formData" style="margin-top: 20px;"></Table> -->
        </FormItem>
        <FormItem label="地址:" prop="countyVal">
          <Select v-model="formValidate.provinceVal" style="margin-right: 10px;width: 100px;" @on-change="changeProvince"
            placeholder="省">
            <Option v-for="(item,index) in provinceList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Select v-model="formValidate.cityVal" style="margin-right: 10px;width: 100px;" @on-change="changeCity"
            placeholder="市">
            <Option v-for="(item,index) in cityList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
          <Select v-model="formValidate.countyVal" @on-change="changeCounty" placeholder="区" style="width: 100px;">
            <Option v-for="(item,index) in countyList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联已有楼盘:">
          <Input v-model="formValidate.buildingVal" placeholder="例:万科缤纷四季" style="width: 200px;margin-right: 10px;"
            @on-change="handleBuildingChange" @on-focus="handleBuildingFocus" @on-blur="handleBuildingBlur" :disabled="buildingDisabled"></Input>
          <Select v-model="formValidate.layoutId" @on-change="changeLayout" placeholder="关联已有户型" style="width: 200px;"
            clearable>
            <Option v-for="(item,index) in columns" :value="item.modelId" :key="index">{{ item.modelName }}</Option>
          </Select>
          <div class="select-list" v-if="buildingFlag">
            <div v-for="(item,index) in buildingList" :key="index" @click="chooseBuilding(item)" :class="{'actived':formValidate.buildingId==item.buildingId}">{{item.buildingName}}</div>
          </div>
        </FormItem>
        <FormItem label="视频:" style="width:800px;">
          <div class="video_box" style="text-align: left;position: relative;" id="video" v-if="videoSrc&&showVideo"
            @click="previewVideo">
            <video :src="videoSrc" style="width: 100%;object-fit: fill;" controls webkit-playsinline playsinline
              x5-video-player-type="h5" x5-video-player-fullscreen="true"></video>
            <div v-if="!readonly" style="position: absolute;top: -12px;right: -12px;width: 24px;height: 24px;cursor: pointer;"
              @click.stop="deleteVideo">
              <van-icon name="clear" size="24" />
            </div>
          </div>
          <div style="position: relative;display: flex;align-items: center;" v-else>
            <van-uploader upload-icon="video" :before-read="beforeRead" :after-read="afterRead" accept="video/ogm,video/mpeg,video/asx,video/mpg,video/ogv,video/webm,video/mov,video/mp4,video/m4v;"
              :disabled="readonly" :deletable="!readonly" />
            </van-uploader>
            <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: #000;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;"
              v-if="uploadVideoFlag">
              <van-loading color="#fff" vertical size=".8rem" style="padding-top: .5rem;" />
              <div style="font-size: .3rem;padding: .2rem 0 .5rem 0;color: #fff;width: 100%;">上传中</div>
              </van-loading>
            </div>
            <div style="color: red;margin-left: 10px;">请上传横屏视频，支持MP4、MOV、AVI、WMV格式，文件大小30MB以内。</div>
          </div>
        </FormItem>
        <FormItem label="实景图:">
          <Upload :show-upload-list="false" :on-success="handleSceneSuccess" accept=".jpeg,.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp"
            :on-format-error="handleSceneError" :before-upload="handleSceneBeforeUpload" multiple action="/build-rest/file/uploadImage"
            :headers="uploadHeaders" :format="uploadImgFormat" style="display: inline-block;cursor: pointer;">
            <div style="display: flex;align-items: center;">
              <div style="width: 80px;height:80px;line-height: 80px;background: #f7f8fa;border-radius: 8px;display: flex;justify-content: center;align-items: center;">
                <Icon type="ios-camera" size="24" color="#dcdee0"></Icon>
              </div>
              <div style="color: red;margin-left: 18px;">为保证效果, 建议上传外立面至少1张远景, 5张近景照片</div>
            </div>
          </Upload>
          <!--  -->
          <div style="display: flex;margin-top: 10px;" v-if="sceneImgList.length">
            <div v-for="(item,index) in sceneImgList" class="scene-upload-list">
              <img :src="item.imageUrl" style="display: block;width: 100%;">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click="previewSceneImg(index)"></Icon>
                <Icon type="ios-trash-outline" @click="deleteSceneImg(index)"></Icon>
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="效果图:">
          <Upload :show-upload-list="false" :on-success="handleRenderingSuccess" accept=".jpeg,.bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp"
            :on-format-error="handleRenderingError" multiple action="/build-rest/file/uploadImage" :headers="uploadHeaders"
            :before-upload="handleRenderingBeforeUpload" :format="uploadImgFormat" style="display: inline-block;cursor: pointer;">
            <div style="display: flex;align-items: center;">
              <div style="width: 80px;height:80px;line-height: 80px;background: #f7f8fa;border-radius: 8px;display: flex;justify-content: center;align-items: center;">
                <Icon type="ios-image" size="24" color="#dcdee0"></Icon>
              </div>
              <div style="color: red;margin-left: 18px;">为保证效果, 建议上传外立面至少1张远景, 5张近景照片</div>
            </div>
          </Upload>
          <!-- v-if="renderingImgList.length" -->
          <div style="display: flex;margin-top: 10px;" v-if="renderingImgList.length">
            <div v-for="(item,index) in renderingImgList" :key="index" class="rendering-upload-list">
              <img :src="item.imageUrl" style="display: block;width: 100%;">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click="previewRenderingImg(index)"></Icon>
                <Icon type="ios-trash-outline" @click="deleteRenderingImg(index)"></Icon>
              </div>
            </div>
          </div>
        </FormItem>
      </Form>
      <div v-if="!pageOrigin">
        <Button type="primary" @click="handleSave(false)" style="margin-right: 20px;">保存</Button>
        <Button @click="cancelSave">取消</Button>
      </div>
      <div v-else>
        <Button type="primary" @click="handleSave(1)">审核通过</Button>
        <Button @click="handleSave(2)" style="margin: 0 20px;">审核不通过</Button>
        <Button @click="handleSave(-1)">跳过</Button>
      </div>
    </div>
    <Spin v-if="spinShow" fix></Spin>
    <Modal v-model="imgModal" title="查看图片" footer-hide scrollable width="1200">
      <div style="position: relative;">
        <img :src="previewUrl" style="display: block;width: 100%;">
        <div style="text-align: center;position: absolute;bottom: 20px;width: 50%;left: 50%;margin-left: -25%;">
          <Button style="margin-right: 10px;" @click="preImg">上一张</Button>
          <Button style="margin-left: 10px;" @click="nextImg">下一张</Button>
        </div>
      </div>

    </Modal>
  </div>
</template>

<script>
  import {
    getListStyle,
    getProvince,
    getCity,
    getCounty,
    getUploadPolicy,
    sceneCaseDetail,
    findBuilding,
    sceneCaseSave,
    findProducts,
    sceneCase
  } from "@/api/uploadImg.js";
  import {
    findBuildingModel,
    getComInfo,
    getBuilding
  } from "@/api/building.js";
  import {
    province,
    city,
    area
  } from "@/api/address.js";
  import axios from 'axios'
  export default {
    data() {
      return {
        id: this.$route.query.id,
        pageOrigin: this.$route.query.origin,
        page: this.$route.query.page,
        placeHolder: "例：地铁3号线",
        hasNextPage: false,
        spinShow: false,
        buildingDisabled: false,
        imgModal: false,
        uploadVideoFlag: false,
        showVideo: false,
        readonly: false,
        showVideoMask: false,
        productFlag: false,
        buildingFlag: false,
        isSceneImg: false,
        isRendering: false,
        currentSceneIndex: -1,
        currentRenderIndex: -1,
        auditStatus: "",
        sceneCaseIdList: [],
        programmeId: this.$route.query.id || localStorage.getItem("id"),
        uploadHeaders: {},
        formValidate: {
          village: '',
          styleVal: '',
          styleId: "",
          productVal: "",
          layoutVal: '',
          layoutId: '',
          sceneVal: 1,
          areaVal: '',
          sceneType: '',
          provinceVal: '',
          cityVal: '',
          countyVal: '',
          buildingVal: "",
          buildingId: "",
          formData: [],
          introduction: "",
          caseAttr1: "",
          caseAttr2: ""
        },
        previewUrl: "",
        videoList: [],
        sceneImgList: [],
        renderingImgList: [],
        provinceList: [],
        cityList: [],
        countyList: [],
        columns: [],
        buildingList: [],
        productList: [],
        sceneColumns: ["家装", "工程"],
        styleColumns: [],
        caseAttrOneColumns: ["市政工程", "标杆性楼盘"],
        caseAttrTwoColumns: [],
        uploadImgFormat: ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr',
          'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp'
        ],
        headerList: ["型号", "名称", "数量/方", "使用位置", "操作"],
        ruleValidate: {
          village: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          introduction: [{
            required: true,
            message: '简介不能为空',
            trigger: 'blur'
          }],
          caseAttr2: [{
            required: true,
            message: '请选择完整工程属性',
            // trigger: 'change'
          }],
          layoutVal: [{
            required: true,
            message: '户型不能为空',
            trigger: 'blur'
          }],
          areaVal: [{
            required: true,
            message: '面积不能为空',
            trigger: 'blur'
          }],
          styleVal: [{
            required: true,
            message: '请选择风格',
            trigger: 'change'
          }],
          countyVal: [{
            required: true,
            message: '请选择完整省市区',
            trigger: 'change'
          }],
          formData: [{
            required: true,
            message: '请输入关联产品',
            // trigger: 'change'
          }]
        },
        videoSrc: "",
        videoUrl: "",
        uploadPolicy: {},
      }
    },
    components: {},
    created() {
      let breadcrumbs = [{
          name: "首页"
        },
        {
          name: "实景图上传"
        }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      this.uploadHeaders.Authorization = localStorage.getItem("jwttoken");
      if (this.pageOrigin) this.getSceneCase(false);
      this.getListStyle();
      this.getUploadPolicy();
      if (!this.id) this.getComInfo();
      else this.getSceneCaseDetail();
    },
    mounted() {
      document.getElementsByClassName("ivu-form-item-content")[0].style.display = "flex";
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
      fetchBuilding() {
        let param = {
          buildingId: this.formValidate.buildingId,
          loadBasicInfo: true
        }
        getBuilding(param).then(resp => {
          if (resp.data.code == 200) {
            this.formValidate.buildingVal = resp.data.data.buildingName;
            this.getBuildingModel();
            if (this.formValidate.buildingVal) this.handleFindBuilding(true);
          }
        });
      },
      getBuildingModel() {
        let param = {
          buildingId: this.formValidate.buildingId,
          rows: 10000
        }
        findBuildingModel(param).then(resp => {
          if (resp.data.code == 200) {
            if (!resp.data.data.list.length) {
              this.formValidate.layoutId = "";
              return;
            }
            this.columns = resp.data.data.list;
          }
        });
      },
      getSceneCase(flag) {
        let params = {
          page: this.page,
          rows: 10,
          keyword: "",
          sceneType: "",
          resourceType: "",
          auditStatus: ""
        }
        sceneCase(params).then(res => {
          if (res.data.code == 200) {
            let list = res.data.data.list;
            this.sceneCaseIdList = [];
            this.hasNextPage = res.data.data.hasNextPage;
            list.forEach(item => {
              this.sceneCaseIdList.push(item.id);
            })
            if (flag) {
              this.$router.push({
                query: {
                  id: this.sceneCaseIdList[0],
                  origin: this.pageOrigin,
                  page: this.page
                }
              })
              this.getSceneCaseDetail();
            }
          }
        })
      },
      getSceneCaseDetail() {
        this.spinShow = true;
        this.videoList = [];
        this.sceneImgList = [];
        this.renderingImgList = [];
        this.formValidate.buildingVal = "";
        this.videoSrc = "";
        this.formValidate.layoutId = "";
        this.formValidate.buildingId = "";
        let id = this.$route.query.id;
        sceneCaseDetail(id).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            let sceneCase = data.sceneCase;
            this.formValidate.sceneVal = sceneCase.sceneType;
            this.formValidate.village = sceneCase.name;
            this.formValidate.layoutVal = sceneCase.modelName;
            this.formValidate.areaVal = sceneCase.modelArea + "";
            this.formValidate.styleVal = sceneCase.styleId;
            this.formValidate.formData = data.productList;
            for (let i = 0, l = this.formValidate.formData.length; i < l; i++) {
              this.formValidate.formData[i].productList = [];
            }
            this.formValidate.provinceVal = sceneCase.provinceId;
            this.formValidate.cityVal = sceneCase.cityId;
            this.formValidate.countyVal = sceneCase.areaId;
            // this.formValidate.provinceVal = "440000";
            // this.formValidate.cityVal = "440600";
            // this.formValidate.countyVal = "440604";
            this.formValidate.layoutId = sceneCase.modelId;
            this.formValidate.buildingId = sceneCase.buildingId;
            this.formValidate.introduction = sceneCase.introduction;
            this.formValidate.caseAttr1 = sceneCase.caseAttr1;
            this.formValidate.caseAttr2 = sceneCase.caseAttr2;
            if (this.formValidate.sceneVal == 0) this.placeHolder = "例：万科缤纷四季";
            else if (this.formValidate.sceneVal == 1) this.placeHolder = "例：地铁3号线";
            if (this.formValidate.caseAttr1 == "市政工程") this.caseAttrTwoColumns = ["学校", "医院", "市政府大楼", "配套服务中心",
              "高速服务区", "机场", "地铁"
            ];
            else if (this.formValidate.caseAttr1 == "标杆性楼盘") this.caseAttrTwoColumns = ["特色小区", "特色建筑"];
            if (sceneCase.videoUrl) {
              this.videoSrc = sceneCase.videoUrl;
              this.showVideo = true;
            }
            for (let i = 0, l = data.videoList.length; i < l; i++) {
              let obj = {
                videoUrl: data.videoList[i].videoUrl
              }
              this.videoList.push(obj);
            }
            for (let i = 0, l = data.imageSjtList.length; i < l; i++) {
              let obj = {
                imageUrl: data.imageSjtList[i].imageUrl
              }
              this.sceneImgList.push(obj);
            }
            for (let i = 0, l = data.imageXgtList.length; i < l; i++) {
              let obj = {
                imageUrl: data.imageXgtList[i].imageUrl
              }
              this.renderingImgList.push(obj);
            }
            if (this.formValidate.buildingId) {
              this.fetchBuilding();
            }
            this.getProvince();
            this.spinShow = false;
            document.getElementsByClassName("ivu-layout-content")[0].scrollTop = 0;
            this.$nextTick(() => {
              let tableCell = document.getElementsByClassName("ivu-table-cell");
              for (let i = 0, l = tableCell.length; i < l; i++) {
                tableCell[i].style.overflow = "visible";
              }
            })
          }
        });
      },
      getComInfo() {
        getComInfo().then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            if (data.provinceCode && data.cityCode && data.districtCode) {
              this.formValidate.provinceVal = data.provinceCode;
              this.formValidate.cityVal = data.cityCode;
              this.formValidate.countyVal = data.districtCode;
              this.buildingDisabled = false;
            } else {
              this.buildingDisabled = true;
            }
            this.getProvince();
          }
        }).catch(e => {})
      },
      addProduct() {
        let obj = {
          officialModel: '',
          modityName: '',
          quantity: '',
          usePosition: '',
          productList: []
        }
        this.formValidate.formData.push(obj);
      },
      handleFindProducts() {
        if (!this.formValidate.productVal) {
          this.productList = [];
          this.productFlag = false;
          return;
        }
        let obj = {
          productName: this.formValidate.productVal
        }
        findProducts(obj).then(res => {
          if (res.data.code == 200) {
            // this.productList = res.data.data;
            // this.productFlag = true;
          }
        })
      },
      handleProductFocus(index) {
        // let data = this.formValidate.formData[index];
        // if(data.officialModel) {
        //   let obj = {
        //     productName: data.officialModel
        //   }
        //   findProducts(obj).then(res => {
        //     if (res.data.code == 200) {
        //       data.productList = res.data.data;
        //       this.$set(this.formValidate.formData, index, data)
        //     }
        //   })
        // }
      },
      handleProductBlur(index) {
        let data = this.formValidate.formData[index];
        setTimeout(() => {
          data.productList = [];
          this.$set(this.formValidate.formData, index, data);
        }, 200)
      },
      chooseProduct(index,cIndex) {
        let data = this.formValidate.formData[index];
        data.officialModel = data.productList[cIndex].officialModel;
        data.modityName = data.productList[cIndex].modityName;
        data.productId = data.productList[cIndex].skuModityId || data.productList[cIndex].productId;
        data.usePosition = data.productList[cIndex].usePosition;
        data.productList = [];
      },
      deleteProduct(index) {
        this.$Modal.confirm({
          title: '请确认',
          content: '<p>确定删除该产品吗？</p>',
          onOk: () => {
            this.formValidate.formData.splice(index, 1);
          }
        });
      },
      handleInputOfficialmodel(item,index) {
        let data = this.formValidate.formData[index];
        let val = data.officialModel;
        if (!val) {
          data.productList = [];
          return;
        }
        let obj = {
          productName: val
        }
        findProducts(obj).then(res => {
          if (res.data.code == 200) {
            data.productList = res.data.data;
            console.log(data.productList)
            if(!data.productList.length) {
              let obj = {};
              obj.productId = null;
              obj.productList = [];
              obj.usePosition = data.usePosition;
              obj.quantity = data.quantity;
              obj.modityName = data.modityName;
              obj.officialModel = data.officialModel;
              data = obj;
            }
            this.$set(this.formValidate.formData, index, data);
            console.log(this.formValidate.formData)
          }
        })
      },
      handleNumberInput(e) {
        if(isNaN(e.target.value)) {
          e.target.value = "";
          this.$Message.warning("只能输入数字");
        }
      },
      handleFindBuilding(flag) {
        if (!this.formValidate.buildingVal) {
          this.buildingList = [];
          this.buildingFlag = false;
          return;
        }
        let params = {
          buildingName: this.formValidate.buildingVal,
          provinceId: this.formValidate.provinceVal,
          cityId: this.formValidate.cityVal,
          areaId: this.formValidate.countyVal,
          isAdminPage: true,
          page: 1,
          rows: 10000
        }
        findBuilding(params).then(res => {
          if (res.data.code == 200) {
            if (!res.data.data.list.length) {
              this.buildingList = [];
              this.buildingFlag = false;
              return;
            }
            this.buildingList = res.data.data.list;
            if (!flag) this.buildingFlag = true;
          }
        })
      },
      handleBuildingChange() {
        if (!this.formValidate.buildingVal) {
          this.buildingFlag = false;
          return;
        }
        this.handleFindBuilding();
      },
      handleBuildingFocus() {
        if (this.buildingList.length) this.buildingFlag = true;
      },
      handleBuildingBlur() {
        setTimeout(() => {
          this.buildingFlag = false;
        }, 200)
      },
      chooseBuilding(item) {
        this.formValidate.buildingVal = item.buildingName;
        this.formValidate.buildingId = item.buildingId;
        this.buildingFlag = false;
        this.getBuildingModel();
      },
      handleSelectBuilding(val) {
        this.formValidate.buildingId = val;
        this.getBuildingModel();
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
            this.getCity(this.formValidate.provinceVal);
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
            this.getCounty(this.formValidate.cityVal);
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
        this.formValidate.provinceVal = provinceId;
        this.formValidate.cityVal = "";
        this.formValidate.countyVal = "";
        this.formValidate.buildingVal = "";
        this.formValidate.layoutId = "";
        this.cityList = [];
        this.countyList = [];
        this.columns = [];
        this.buildingList = [];
        this.buildingDisabled = true;
        this.getCity(provinceId);
      },
      changeCity(cityId) {
        this.formValidate.cityVal = cityId;
        this.formValidate.countyVal = "";
        this.formValidate.buildingVal = "";
        this.formValidate.layoutId = "";
        this.countyList = [];
        this.columns = [];
        this.buildingList = [];
        this.buildingDisabled = true;
        this.getCounty(cityId);
      },
      changeCounty(countyId) {
        this.formValidate.countyVal = countyId;
        this.formValidate.buildingVal = "";
        this.formValidate.layoutId = "";
        if (countyId) this.buildingDisabled = false;
        else this.buildingDisabled = true;
        this.columns = [];
        this.buildingList = [];
      },
      changeStyle(styleId) {
        this.formValidate.styleVal = styleId;
        this.formValidate.styleId = styleId;
      },
      changeCaseAttrOne(val) {
        if (!val) {
          this.formValidate.caseAttr2 = "";
          this.caseAttrTwoColumns = [];
        }
        if (val == "市政工程") {
          this.caseAttrTwoColumns = ["学校", "医院", "市政府大楼", "配套服务中心", "高速服务区", "机场", "地铁"];
        } else if (val == "标杆性楼盘") {
          this.caseAttrTwoColumns = ["特色小区", "特色建筑"];
        }
        this.formValidate.caseAttr1 = val;
      },
      changeCaseAttrTwo(val) {
        this.formValidate.caseAttr2 = val;
      },
      changeLayout(layoutId) {
        this.formValidate.layoutId = layoutId;
      },
      changeSceneVal(secneId) {
        this.formValidate.sceneVal = secneId;
        this.formValidate.sceneType = secneId;
      },
      handleProduct() {

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
      beforeRead(file) {
        let maxSize = 30 * 1024;
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
          this.$Message.warning('视频大小不能超过30MB');
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
            _self.videoList = [];
            let obj = {
              videoUrl: _self.videoUrl
            }
            _self.videoList.push(obj);
            this.showVideo = true;
          } else {
            this.showVideo = false;
            this.$Message.warning("上传失败");
          }
        }).catch(error => {
          this.showVideo = false;
          this.uploadVideoFlag = false;
          this.canSave = false;
          this.$Message.warning("上传失败");
        })
      },
      previewVideo() {
        this.showVideoMask = true;
      },
      deleteVideo() {
        this.$dialog.confirm({
            title: '删除视频',
            message: '确定删除该视频吗？',
          })
          .then(() => {
            this.videoSrc = "";
            this.videoUrl = "";
            this.videoList = []
            this.showVideo = false;
          })
          .catch(() => {
            // on cancel
          });
      },
      preImg() {
        if (this.isSceneImg) {
          if (this.currentSceneIndex == 0) {
            this.$Message.warning("当前为第一张");
            return;
          }
          if (this.currentSceneIndex > 0) {
            this.currentSceneIndex -= 1;
            this.previewUrl = this.sceneImgList[this.currentSceneIndex].imageUrl;
          }
          return;
        }
        if (this.isRendering) {
          if (this.currentRenderIndex == 0) {
            this.$Message.warning("当前为第一张");
            return;
          }
          if (this.currentRenderIndex > 0) {
            this.currentRenderIndex -= 1;
            this.previewUrl = this.renderingImgList[this.currentRenderIndex].imageUrl;
          }
        }
      },
      nextImg() {
        if (this.isSceneImg) {
          if (this.currentSceneIndex == this.sceneImgList.length - 1) {
            this.$Message.warning("当前为最后一张");
            return;
          }
          if (this.currentSceneIndex < this.sceneImgList.length - 1) {
            this.currentSceneIndex += 1;
            this.previewUrl = this.sceneImgList[this.currentSceneIndex].imageUrl;
          }
          return;
        }
        if (this.isRendering) {
          if (this.currentRenderIndex == this.renderingImgList.length - 1) {
            this.$Message.warning("当前为最后一张");
            return;
          }
          if (this.currentRenderIndex < this.renderingImgList.length - 1) {
            this.currentRenderIndex += 1;
            this.previewUrl = this.renderingImgList[this.currentRenderIndex].imageUrl;
          }
        }
      },
      previewSceneImg(i) {
        this.isSceneImg = true;
        this.isRendering = false;
        this.imgModal = true;
        if (this.previewUrl == this.sceneImgList[i].imageUrl) return;
        this.previewUrl = this.sceneImgList[i].imageUrl;
        this.currentSceneIndex = i;
      },
      previewRenderingImg(i) {
        this.isSceneImg = false;
        this.isRendering = true;
        this.imgModal = true;
        if (this.previewUrl == this.renderingImgList[i].imageUrl) return;
        this.previewUrl = this.renderingImgList[i].imageUrl;
        this.currentRenderIndex = i;
      },
      deleteSceneImg(i) {
        this.$dialog.confirm({
            title: '删除图片',
            message: '确定删除该图片吗？',
          })
          .then(() => {
            this.sceneImgList.splice(i, 1);
          })
          .catch(() => {
            // on cancel
          });

      },
      deleteRenderingImg(i) {
        this.$dialog.confirm({
            title: '删除图片',
            message: '确定删除该图片吗？',
          })
          .then(() => {
            this.renderingImgList.splice(i, 1);
          })
          .catch(() => {
            // on cancel
          });
      },
      handleSceneSuccess(res, file) {
        if (res.code == 200) {
          let data = res.data;
          let obj = {
            imageUrl: data.imageUrl
          }
          this.sceneImgList.push(obj);
        } else {

        }
      },
      handleRenderingSuccess(res, file) {
        if (res.code == 200) {
          let data = res.data;
          let obj = {
            imageUrl: data.imageUrl
          }
          this.renderingImgList.push(obj);
        } else {

        }
      },
      handleSceneError(file) {
        if (!/\.(jpeg|bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp)$/.test(file
            .name)) {
          this.$Message.warning('只能上传图片');
          return false;
        }
      },
      handleRenderingError(file) {
        if (!/\.(jpeg|bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp)$/.test(file
            .name)) {
          this.$Message.warning('只能上传图片');
          return false;
        }
      },
      handleSceneBeforeUpload(file) {

      },
      handleRenderingBeforeUpload() {

      },
      handleSave(auditStatus) {
        this.$refs["formValidate"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            if (auditStatus == -1) {
              for (let i = 0, l = this.sceneCaseIdList.length; i < l; i++) {
                if (this.$route.query.id == this.sceneCaseIdList[i]) {
                  this.page = Number(this.page);
                  if (this.hasNextPage) {
                    if (i == l - 1) {
                      this.page++;
                      this.getSceneCase(true);
                      return;
                    }
                  } else {
                    if (i == l - 1) {
                      this.spinShow = false;
                      this.$Modal.confirm({
                        title: '提示',
                        content: '<p>当前为最后一条案例，是否返回列表页。</p>',
                        okText: '返回列表',
                        cancelText: '取消',
                        onOk: () => {
                          this.$router.push({
                            path: '/sceneImgManage'
                          })
                        }
                      });
                      return;
                    }
                  }
                  this.$router.push({
                    query: {
                      id: this.sceneCaseIdList[i + 1],
                      origin: this.pageOrigin,
                      page: this.page
                    }
                  })
                  this.getSceneCaseDetail();
                  break;
                }
              }
              return;
            }
            let productList = [];
            let haveProductFlag = true;
            for (let i = 0, l = this.formValidate.formData.length; i < l; i++) {
              let obj = {};
              if(!this.formValidate.formData[i].modityName||!this.formValidate.formData[i].officialModel||!this.formValidate.formData[i].quantity||!this.formValidate.formData[i].usePosition) {
                haveProductFlag = false;
                break;
              }
              if(this.formValidate.formData[i].productId) {
                obj = {
                  productId: this.formValidate.formData[i].productId,
                  quantity: this.formValidate.formData[i].quantity || "",
                  usePosition: this.formValidate.formData[i].usePosition || ""
                }
              } else {
                obj = {
                  modityName: this.formValidate.formData[i].modityName,
                  officialModel: this.formValidate.formData[i].officialModel,
                  quantity: this.formValidate.formData[i].quantity || "",
                  usePosition: this.formValidate.formData[i].usePosition || ""
                }
              }
              productList.push(obj);
            }
            if(!haveProductFlag) {
              this.spinShow = false;
              this.$Message.warning("请完整填写关联产品信息");
              return;
            }
            let params = {
              id: this.$route.query.id,
              sceneType: this.formValidate.sceneVal,
              name: this.formValidate.village,
              modelName: this.formValidate.layoutVal,
              modelArea: Number(this.formValidate.areaVal),
              styleId: this.formValidate.styleVal,
              provinceId: this.formValidate.provinceVal,
              cityId: this.formValidate.cityVal,
              areaId: this.formValidate.countyVal,
              buildingId: this.formValidate.buildingId,
              modelId: this.formValidate.layoutId,
              auditStatus: auditStatus || "",
              productList: productList,
              videoList: this.videoList,
              imageSjtList: this.sceneImgList,
              imageXgtList: this.renderingImgList,
              caseAttr1: this.formValidate.caseAttr1,
              caseAttr2: this.formValidate.caseAttr2,
              introduction: this.formValidate.introduction
            };
            if (!params.videoList.length && !params.imageSjtList.length && !params.imageXgtList.length) {
              this.spinShow = false;
              this.$Message.warning('需至少选择视频、实景图、效果图中任意一个进行上传!');
              return;
            }
            if (!params.imageSjtList.length && !params.imageXgtList.length) {
              this.spinShow = false;
              this.$Message.warning('请至少上传实景图或效果图!');
              return;
            }
            sceneCaseSave(params).then(res => {
              if (res.data.code == 200) {
                this.$Message.success('保存成功!');
                if (auditStatus) {
                  for (let i = 0, l = this.sceneCaseIdList.length; i < l; i++) {
                    if (params.id == this.sceneCaseIdList[i]) {
                      this.page = Number(this.page);
                      let index = 0;
                      if (this.hasNextPage) {
                        if (i == l - 1) {
                          this.page++;
                          this.getSceneCase(true);
                          return;
                        }
                      } else {
                        if (i == l - 1) {
                          this.$Modal.confirm({
                            title: '提示',
                            content: '<p>当前为最后一条案例，是否返回列表页。</p>',
                            okText: '返回列表',
                            cancelText: '取消',
                            onOk: () => {
                              this.$router.push({
                                path: '/sceneImgManage'
                              })
                            }
                          });
                          return;
                        }
                      }
                      this.$router.push({
                        query: {
                          id: this.sceneCaseIdList[i + 1],
                          origin: this.pageOrigin,
                          page: this.page
                        }
                      })
                      this.getSceneCaseDetail();
                      break;
                    }
                  }
                } else {
                  this.$router.go(-1);
                }
              }
            });
          } else {
            this.$Message.error('表单验证失败,请补充完整表单内容!');
          }
        })
      },
      cancelSave() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>
  .product-table {
    width: 1000px;
    margin-top: 20px;
    border: 1px solid #dcdee2;
    border-right: 0;
    border-bottom: 0;
  }

  .table-header {
    display: flex;
    color: #515a6e;
    font-weight: bold;
  }

  .header-item {
    width: 200px;
    border-right: 1px solid #e8eaec;
    border-bottom: 1px solid #e8eaec;
    text-align: center;
    background-color: #f8f8f9;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    text-overflow: ellipsis;
  }

  .table-cell {
    position: relative;
    display: flex;
    width: 200px;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e8eaec;
    border-bottom: 1px solid #e8eaec;
    text-overflow: ellipsis;
  }

  .table-cell input {
    text-align: center;
    border: 1px solid rgb(220, 222, 226);
    border-radius: 4px;
  }

  .content-item {
    display: flex;
    height: 48px;
    text-align: center;
  }

  .product-search-list {
    position: absolute;
    width: 100%;
    max-height: 160px;
    text-align: left;
    margin: 5px 0;
    padding: 5px 0;
    left: 0;
    top: 40px;
    z-index: 999;
    will-change: top, left;
    transform-origin: center top;
    overflow: auto;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    background: #fff;
  }

  .search-list-item {
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    color: #515a6e;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
  }

  .search-list-item:hover {
    background: #f3f3f3;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    align-items: center;
    justify-content: center;
  }

  .scene-upload-list,
  .rendering-upload-list {
    display: flex;
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 10px 10px 0;
    align-items: center;
  }

  .scene-upload-list:hover .demo-upload-list-cover,
  .rendering-upload-list:hover .demo-upload-list-cover {
    display: flex;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .select-list {
    position: absolute;
    width: 200px;
    max-height: 200px;
    will-change: top, left;
    transform-origin: center top;
    top: 33px;
    left: 0px;
    overflow: auto;
    z-index: 999;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  }

  .select-list div {
    margin: 0;
    line-height: normal;
    padding: 7px 16px;
    color: #515a6e;
    font-size: 12px !important;
    white-space: nowrap;
    cursor: pointer;
  }

  .select-list div:hover {
    background: #f3f3f3;
  }

  .actived {
    background: #f3f3f3;
    color: #2d8cf0 !important;
  }

  .ivu-table-cell {
    overflow: visible !important;
  }

  .ivu-table-wrapper {
    overflow: visible !important;
  }
</style>
