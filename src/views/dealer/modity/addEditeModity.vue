<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">

            <!-- <FormItem label="系列" prop="categoryName">
              <Cascader :data="categoryList" style="width:300px" @on-change="handleCategoryCascader" v-model="formValidate.categoryName"></Cascader>
             </FormItem> -->
        <FormItem label="系列" prop="categoryId">
              <Cascader :data="categoryList" style="width:300px" filterable @on-change="handleCategoryCascader" v-model="formValidate.categoryId"></Cascader>
             </FormItem>

        <FormItem label="名称" prop="modityName">
            <Input v-model="formValidate.modityName" style="width:300px" placeholder="请输入产品名称"></Input>
        </FormItem>
        <!-- officialModel -->
        <FormItem label="型号" prop="officialModel">
            <Input v-model="formValidate.officialModel" style="width:300px" placeholder="请输入产品型号"></Input>
        </FormItem>
        <FormItem label="适用风格" prop="applicableStyle">
            <div class="line_button">
              <div>
                <Checkbox v-model="style_checkAll"  @on-change="handleStyleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formValidate.applicableStyle " @on-change="style_checkAllGroupChange">
                <Checkbox v-for="item in applicableStyleList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
            </div>
        </FormItem>

         <FormItem label="适用空间" prop="applicableSpace">
           <div class="line_button">
              <div>
                <Checkbox v-model="space_checkAll" @on-change="handleSpaceCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formValidate.applicableSpace" @on-change="space_checkAllGroupChange">
                <Checkbox v-for="item in applicableSpaceList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>

           </div>

        </FormItem>
        <FormItem label="色系" prop="colourCode">
          <div class="line_button">
            <div>
                <Checkbox v-model="colourCode_checkAll" @on-change="handleColourCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formValidate.colourCode" @on-change="colourCode_checkAllGroupChange">
                <Checkbox v-for="item in colourCodeList" :label="item.name" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>

          </div>

        </FormItem>
        <FormItem label="销售渠道" prop="saleChannel">
          <div class="line_button">
             <div>
                <Checkbox v-model="saleChannel_checkAll" @on-change="handleSaleChannelCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formValidate.saleChannel" @on-change="saleChannel_checkAllGroupChange">
                <Checkbox v-for="item in saleChannelList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>

          </div>

        </FormItem>
          <FormItem label="上架渠道" prop="">
            <div class="line_button">
                <div>
                <Checkbox v-model="recommend_checkAll" @on-change="handleRecommendCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formValidate.recommendationIdList" @on-change="recommend_checkAllGroupChange">
                <Checkbox v-for="item in recommendList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>

            </div>

        </FormItem>
         <FormItem label="特点" prop="characteristics">
            <Input type="textarea" v-model="formValidate.characteristics" style="width:300px" placeholder="特点将呈现在交互大屏上辅助导购销售"></Input>
        </FormItem>
          <FormItem label="应用范围" prop="applicationSpace">
            <Input type="textarea" v-model="formValidate.applicationSpace" style="width:300px" placeholder="应用范围将呈现在交互大屏上辅助导购销售"></Input>
        </FormItem>
        <FormItem label="排序" prop="">
            <Input v-model="formValidate.sortNum" style="width:300px" placeholder="请输入排序号"></Input>
        </FormItem>

       <!-- <div class="comonbox">
           <span class="conmomSpan">*</span>
           <FormItem label="规格" :label-width="45" prop="modityModel" >             
               <InputNumber v-model="formValidate.ruleOne" style="width:100px;margin-left:10px;" @on-blur="handleRuleOne"></InputNumber >&nbsp;x&nbsp;
               <InputNumber v-model="formValidate.ruleTwo" style="width:100px" @on-blur="handleRuleTwo"></InputNumber >
             
           </FormItem>
            <span class="commonTip" v-show="ruleShowFlag">规格不能为空</span>
       </div> -->

         <FormItem label="规格" prop="modityModel">
            <Input v-model="formValidate.modityModel" style="width:300px" placeholder="请输入规格"></Input>
         </FormItem>
    
         
           <div class="comonbox"> 
              <span class="conmomSpan">*</span>
              <FormItem label="SKU表" prop="skuData" :label-width="50" >
                <Table :columns="skuColumns" :data="formValidate.skuData" border width="692"></Table>
              </FormItem>
              <Button style="margin-left:8px;height: 29px;" @click="handleAddSku">新增</Button>
              <span class="commonTip" v-show="tipFlag">SKU表不能为空</span>
          </div>
        <!-- 详情介绍 -->
              <div style="margin-bottom: 30px;">
                <div class="comonbox" style="margin-bottom: 20px;">
                  <span>详情介绍</span>
                  <span style="padding-left: 20px;color: red;">门店客户扫描价格牌上的二维码即可查看该内容</span>
                  <Button style="margin-left:10px;height: 24px;" type="primary" size="small" @click="editDetail" v-show="!isEditing">编辑</Button>
                </div>
                <!-- 详情预览 -->
                <div v-show="!isEditing" style="width: 340px;height:636px;box-shadow: 0 0 10px #999;position: relative;border-radius: 30px;">
                  <div style="position: relative;top: 28px;z-index: 2;margin: 0 auto;width: 320px;height: 64px;">
                    <img src="../../../assets/titlebar.png" style="position: absolute;top: 0;left: 0;">
                    <span style="position: absolute;top: 32px;left: 129px;color: #fff;font-size: 14px;">页面标题</span>
                  </div>
                  <!-- 详情内容  v-html="detailContent" -->
                  <div class="content_detail">
                    <div v-for="(item,index) in richtextData.items">
                      <div v-if="item.type=='richText'" v-html="item.content"></div>
                      <div v-if="item.type=='blank'" v-html="item.content"></div>
                      <div v-if="item.type=='swiperPics'" v-html="item.content"></div>
                      <div v-if="item.type=='pictures'" v-html="item.content"></div>
                    </div>
                  </div>
                  <img src="../../../assets/call.png" style="position: absolute;left: -2px;top: 0;">
                </div>
                <!-- 富文本编辑 -->
                <div v-show="isEditing">
                  <tinymce-editor @saveContent="saveContent" @cancelContent="cancelContent" ref="editor"
                    :domList="domList" :content="detailContent" :richtextData="richtextData"></tinymce-editor>
                </div>
              </div>

    <!-- 主图 -->
        <div style="height: 190px;">
          <div class="comonbox" >
            <span class="conmomSpan">*</span>
            <FormItem :label-width="520" label="主图 ：支持多张，800px*800px以上,图片类型只能为gif，png，jpg，jpeg，且大小不能超过5M" prop="imageMainList">
           </FormItem>
              <span class="commonTip" v-show="mainTipFlag">主图不能为空</span>
          </div>
         <upload-img :uploadType="1" :mainParamId="addModityId" :mainInfoImgList='mainInfoImgParams' :mainStyle="mainPicture" @child-upload="handleUploadMainImg"></upload-img>
        </div>
    <!-- 纹理图 -->
        <div style="margin-top:60px; height: 190px;">
          <div class="comonbox">
             <span class="conmomSpan">*</span>
            <FormItem :label-width="530" label="纹理图 ：支持多张，800px*800px以上,图片类型只能为gif，png，jpg，jpeg，且大小不能超过5M" prop="imageList">
           </FormItem>
             <span class="commonTip" v-show="imgTipFlag">纹理图不能为空</span>
          </div>

         <upload-img :uploadType="1" :mainParamId="addModityId" :InfoImgList="infoImgParams" :InfoImgFlag="true" @child-upload="handleUploadMapImg"></upload-img>
        </div>
        <!-- 移动主图 -->
         <div style="margin-top:60px;height: 190px;">
          <div class="comonbox">
            <FormItem :label-width="550" label="移动主图 ：支持多张，800px*800px以上,图片类型只能为gif，png，jpg，jpeg，且大小不能超过5M" prop="imageMainList">
           </FormItem>
          </div>
         <upload-img :uploadType="1" :mainParamId="addModityId" :mobileImgParams='mobileImgParams' @child-upload="handleUploadMobileImg" :mainStyle="mobilePicture"></upload-img>
        </div>
        <!-- 上传音频 -->
         <div style="margin-top:60px;height: 190px;">
          <div class="comonbox">
            <FormItem :label-width="330" label="音频 ：只支持上传一条音频,建议在保证质量的情况下上传">
           </FormItem>
          </div>
         <upload-video ref="audioRef" :uploadType="2"  @child-uploadmusic="handleUploadMusic" :mainParamId="addModityId"></upload-video>
        </div>
       <!-- 上传视频 -->
        <div style="margin-top:60px;height: 190px;">
          <div class="comonbox">
            <FormItem :label-width="400" label="视频 ：只支持上传一条视频,建议在保证质量的情况下压缩后再上传视频">
           </FormItem>
          </div>
         <upload-video :uploadType="3" ref="videoRef" @child-uploadmusic="handleUploadMusic" :mainParamId="addModityId"></upload-video>
        </div>


         <FormItem label="图片展示规则" prop="" :label-width="100" style="margin-top:50px;">
            <Input v-model="formValidate.col_num" style="width:100px"></Input>&nbsp;X&nbsp;<Input v-model="formValidate.row_num" style="width:100px"></Input><Button style="margin-left:8px;" @click="handleWatch">查看效果</Button>
            <!-- <InputNumber v-model="formValidate.col_num" style="width:100px"></InputNumber >&nbsp;x&nbsp;
               <InputNumber v-model="formValidate.row_num" style="width:100px"></InputNumber ><Button style="margin-left:8px;" @click="handleWatch">查看效果</Button> -->
        </FormItem>
         <FormItem label="审核状态" prop="audit">
            <RadioGroup v-model="formValidate.audit">
                <Radio label="0">待审核</Radio>
                <Radio label="1">审核通过</Radio>
                 <Radio label="2">审核不通过</Radio>
            </RadioGroup>
        </FormItem>
         <FormItem label="上架状态" prop="status">
            <RadioGroup v-model="formValidate.status">
                <Radio label="0">上架</Radio>
                <Radio label="1">下架</Radio>
            </RadioGroup>
        </FormItem>
         <!-- <FormItem label="上架渠道" prop="">
            <div>
                <Checkbox v-model="recommend_checkAll" @on-change="handleRecommendCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="formValidate.recommendationIdList" @on-change="recommend_checkAllGroupChange">
                <Checkbox v-for="item in recommendList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem> -->
        <FormItem>
            <Button type="primary" :loading="saveBtnLoading" @click="handleSubmit('formValidate')">提 交</Button>
            <Button @click="handleBack" style="margin-left: 8px">返 回</Button>
        </FormItem>
    </Form>
    <Modal
        v-model="modelSkuFlag"
       :title='showText'
        @on-ok="handleSummitSku"
        @on-cancel="handleCancelSku">
       <Form :model="formItem" ref="formItem" :label-width="80" :rules="skuRuleValidate">
            <div class="modelContainer" style="display:flex;">
               <FormItem label="规格" prop="modityLength">
               </FormItem>
              <div>
               
                <!-- <InputNumber v-model="formItem.modityLength" :step="1" @on-blur="changeLengthNumber()" style="width:70px"></InputNumber >&nbsp;X&nbsp;
                <InputNumber v-model="formItem.modityWidth"  style="width:70px" @on-change="changeWidthhNumber()"></InputNumber >  <span style="color:#ed4014;margin-left:40px;">(只能输入正整数)</span> -->
                 <InputNumber v-model="formItem.modityLength" :step="1" @on-change="changeLengthNumber()" style="width:70px"></InputNumber >&nbsp;X&nbsp;
                <InputNumber v-model="formItem.modityWidth"  style="width:70px" @on-change="changeWidthhNumber()"></InputNumber >  <span style="color:#ed4014;margin-left:40px;">(只能输入正整数)</span>
              </div>
            </div>
             <!-- <FormItem label="建议价格">
               <div> <Input v-model="formItem.price2" clearable placeholder="" :disabled="pridceDisabled" style="width:200px" @on-blur="handlePrice()"></Input>&nbsp;元/片</div>
                <div style="margin-top:20px;"><Input v-model="formItem.price1" clearable placeholder="" style="width:200px" disabled ></Input>&nbsp;元/方</div>
              </FormItem> -->
               <div class="other_box">
                  <div class="other_item_on"><div>建议价格</div><div> <Input v-model="formItem.price2" clearable placeholder="" :disabled="pridceDisabled" style="width:200px" @on-blur="handlePrice()"></Input>&nbsp;元/片</div></div>
                <div class="other_item_bottom"><Input v-model="formItem.price1" clearable placeholder="" style="width:200px" disabled ></Input>&nbsp;元/方</div>
              </div>
            <!-- <FormItem label="上架状态" prop="status">
                <RadioGroup v-model="formItem.status">
                    <Radio label="0">上架</Radio>
                    <Radio label="1">下架</Radio>

                </RadioGroup>
            </FormItem> -->
            <FormItem style="margin-top:20px">
                <Button type="primary" :loading="skuBtnLoading" @click="handleSummitSku">提 交</Button>
                <Button style="margin-left: 8px" @click="handleCancelSku">取 消</Button>
            </FormItem>
    </Form>
       <div slot="footer"></div>
    </Modal>
    <!-- 查看图片效果 -->
     <Modal
        v-model="watchImageFlag"
       title='查看图片效果'
       >
        <transition-group tag="div" class="container">
         <!-- <div v-for="col in colNumber" :key="col" class="contaner_box">
              <div class="item" v-for="(item,index) in items" :key="item.key" v-if="index%colNumber==col-1" :style="{background:item.color,width:'80px',height:'80px'}"
                    draggable="true"
                @dragstart="handleDragStart($event, item)"
                    @dragover.prevent="handleDragOver($event, item)"
                    @dragenter="handleDragEnter($event, item)"
                    @dragend="handleDragEnd($event, item)" >
                </div>
         </div> -->
          <div v-for="col in colNumber" :key="col" class="contaner_box">
              <div class="item" v-for="(item,index) in items" :key="index" v-if="index%colNumber==col-1"  style="{width:'80px',height:'80px'}"
                    draggable="true"
                @dragstart="handleDragStart($event, item)"
                    @dragover.prevent="handleDragOver($event, item)"
                    @dragenter="handleDragEnter($event, item)"
                    @dragend="handleDragEnd($event, item)" >
                    <img :src="item.imageUrl" alt="">
                </div>
         </div>


      </transition-group>
       <div slot="footer"></div>
    </Modal>
    </div>
</template>
<script>
import TinymceEditor from "../../../components/tinymce-editor";
import uploadImg from "./draggableImg";

import uploadVideo from "./uploadVideomusic";
import qs from "qs";
import {
  addDealerModity,
  getAddModityId,
  getCategoryAll,
  getCommoncheckBox,
  getAModityInfo,
  editAddDealerModity,
  getRecommendBox
} from "@/api/dealerModity.js";

export default {
  name: "Toolbar",
  data() {
    return {
      ruleShowFlag: false,
      pridceDisabled: true,
      watchImageFlag: false,
      tipFlag: false,
      mainTipFlag: false,
      imgTipFlag: false,
      saveBtnLoading: false,
      skuBtnLoading: true,
      formValidate: {
        id: "",
        // categoryName: [],
        // categoryId: "",
        sortNum: "",
        categoryName: "",
        categoryId: [],
        modityName: "",
        officialModel: "",
        applicableStyle: [],
        applicableSpace: [],
        colourCode: [],
        saleChannel: [],
        recommendationIdList: [], //推荐位
        characteristics: "",
        applicationSpace: "",
        imageMainList: [], //主图
        imageList: [], //纹理图
        imageMainForMobileList: [], //移动端主图
        // col_num: "",
        // row_num: "",
        col_num: null,
        row_num: null,
        audit: "1",
        status: "0",
        skuData: [], //sku表
        ruleOne: null,
        ruleTwo: null,
        modityModel: "",
        video: "",
        audio: ""
      },
      mainPicture: "mainPicture",
      mainInfoImgParams: {
        mainInfoImgList: [],
        editMainImg: true
      }, //主图
      infoImgParams: {
        infoImgList: [],
        editImg: true
      }, //纹理图
      mobilePicture: "mobilePicture",
      mobileImgParams: {
        //移动端主图
        imageMobileList: [],
        editMobileImg: true
      },
      // imageMainList: [], //主图
      // imageList: [], //纹理图
      addModityId: "", //原来的uuid
      style_checkAll: false,
      space_checkAll: false,
      colourCode_checkAll: false,
      saleChannel_checkAll: false,
      recommend_checkAll: false,

      isEditing: false, // 显示隐藏富文本
      detailContent: "", // 富文本内容
      domList: [],
      richtextData: {},

      categoryList: [],
      applicableStyleList: [],
      applicableSpaceList: [],
      colourCodeList: [],
      saleChannelList: [],
      recommendList: [], //推荐位

      ruleValidate: {
        // categoryName: [
        //   {
        //     required: true,
        //     type: "array",
        //     trigger: "change",
        //     message: "系列不能为空"
        //   }
        // ],
        categoryId: [
          {
            required: true,
            type: "array",
            trigger: "change",
            message: "系列不能为空"
          }
        ],
        modityName: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur"
          }
        ],
        modityModel: [
          {
            required: true,
            message: "规格不能为空不能为空",
            trigger: "blur"
          }
        ],
        officialModel: [
          {
            required: true,
            message: "型号不能为空",
            trigger: "blur"
          }
        ],
        applicableStyle: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "适应风格不能为空",
            trigger: "change"
          }
        ],
        applicableSpace: [
          {
            required: true,
            type: "array",
            message: "适应空间不能为空",
            min: 1,
            trigger: "change"
          }
        ],
        colourCode: [
          {
            required: true,
            type: "array",
            message: "色系不能为空",
            min: 1,
            trigger: "change"
          }
        ],
        saleChannel: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "销售渠道不能为空",
            trigger: "change"
          }
        ],
        // characteristics: [
        //   {
        //     required: true,
        //     message: "特点不能为空",
        //     trigger: "blur"
        //   }
        // ],
        // imageMainList: [
        //   {
        //     required: true,
        //     type: "array",
        //     min: 1,
        //     message: "主图不能为空",
        //     trigger: "change"
        //   }
        // ],
        // imageList: [
        //   {
        //     required: true,
        //     type: "array",
        //     min: 1,
        //     message: "纹理图不能为空",
        //     trigger: "change"
        //   }
        // ],
        audit: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择上架状态", trigger: "change" }
        ]
        // skuData: [
        //   {
        //     required: true,
        //     type: "array",
        //     min: 1,
        //     message: "sku表不能为空",
        //     trigger: "change"
        //   }
        // ]
      },
      skuColumns: [
        {
          title: "规格",
          key: "moditySize",
          width: 180
        },
        {
          title: "建议价格(片)",
          key: "price2",
          width: 180
        },
        {
          title: "建议价格(方)",
          key: "price1",
          width: 180
        },

        // {
        //   title: "上架状态",
        //   key: "status",
        //   width: 100,
        //   render: (h, params) => {
        //     if (params.row.status == "0") {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "#2db7f5"
        //           }
        //         },
        //         "上架"
        //       );
        //     } else if (params.row.status == "1") {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: "#c5c8ce"
        //           }
        //         },
        //         "下架"
        //       );
        //     }
        //   }
        // },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleEditeSku(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleRemoveSku(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      // skuData: [],
      modelSkuFlag: false,
      formItem: {
        modityLength: null,
        modityWidth: null,
        price2: 0,
        price1: "",
        status: "0"
      },
      skuRuleValidate: {
        modityLength: [
          {
            required: true,
            message: "规格不能为空",
            trigger: "blur"
          }
        ]
      },
      showText: "",
      skuIndex: null,
      nameText: "",
      // 查看图片效果
      items: [
        // { key: 1, color: '#ffebcc'},
        // { key: 2, color: '#ffb86c'},
        // { key: 3, color: '#f01b2d'},
        //  { key: 4, color: '#19be6b'},
        //   { key: 5, color: '#2c3e50'}
      ],
      colNumber: null,
      dragging: null
    };
  },
  components: {
    uploadImg,
    TinymceEditor,
    uploadVideo
  },
  created() {
    // this.colNumber=4
    if (this.$route.query.add) {
      this.handleGetAddId();
      this.nameText = "添加商品";
    }
    if (this.$route.query.id) {
      this.handleGetModityInfo(this.$route.query.id);
      this.nameText = "编辑商品";
    }
    let breadcrumbs = [
      { name: "首页" },
      { name: "商品管理" },
      { name: this.nameText }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.handleGetCategoryAll();
    this.handleStyleChecks(
      { basicCode: "applicable_style" },
      this.applicableStyleList
    ); //风格
    this.handleStyleChecks(
      { basicCode: "applicable_space" },
      this.applicableSpaceList
    ); //空间
    this.handleStyleChecks({ basicCode: "color_style" }, this.colourCodeList); //色系
    this.handleStyleChecks({ basicCode: "sale_channel" }, this.saleChannelList); //渠道
    this.handleRecommend(this.recommendList); //推荐位
    // 排列数
  },
  methods: {
    saveContent(val) {
      console.log(val);
      this.isEditing = val.isEditing;
      this.detailContent = val.content;
      this.richtextData = val.data;
    },
    cancelContent(val) {
      this.isEditing = val.isEditing;
      this.richtextData = val.data;
    },
    editDetail() {
      this.isEditing = true;
      this.$refs.editor.initDomList();
    },
    handleDragStart(e, item) {
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      this.dragging = null;
    },
    //首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver(e) {
      e.dataTransfer.dropEffect = "move"; // e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = "move"; //为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return;
      }
      const newItems = [...this.items];
      // console.log(newItems);
      const src = newItems.indexOf(this.dragging);
      const dst = newItems.indexOf(item);

      newItems.splice(dst, 0, ...newItems.splice(src, 1));

      this.items = newItems;
      // this.formValidate.imageList = newItems
    },
    handleGetAddId() {
      getAddModityId().then(res => {
        if (res.data.code == 200) {
          this.formValidate.id = res.data.data;
        }
      });
    },
    handleSubmit(name) {
      // console.log(this.formValidate);
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formValidate.skuData.length != 0) {
            this.tipFlag = false;
          } else {
            this.tipFlag = true;
            this.$Message.error("保存失败!");
            return;
          }
          if (this.formValidate.imageMainList.length != 0) {
            this.mainTipFlag = false;
          } else {
            this.mainTipFlag = true;
            this.$Message.error("保存失败!");
            return;
          }
          if (this.formValidate.imageList.length != 0) {
            this.imgTipFlag = false;
          } else {
            this.imgTipFlag = true;
            this.$Message.error("保存失败!");
            return;
          }
          //  if (this.formValidate.ruleOne && this.formValidate.ruleTwo) {
          //   this.ruleShowFlag = false;
          // } else {
          //   this.ruleShowFlag = true;
          //   this.$Message.error("保存失败!");
          //   return;
          // }

          if (this.$route.query.id) {
            let paramsModity = {
              id: this.formValidate.id, //添加需要id
              categoryId: this.formValidate.categoryId[
                this.formValidate.categoryId.length - 1
              ],
              categoryName: this.formValidate.categoryName,
              modityName: this.formValidate.modityName,
              officialModel: this.formValidate.officialModel,
              applicableStyle: this.formValidate.applicableStyle.join(","),
              applicableSpace: this.formValidate.applicableSpace.join(","),
              colourCode: this.formValidate.colourCode.join(","),
              saleChannel: this.formValidate.saleChannel.join(","),

              characteristics: this.formValidate.characteristics,
              applicationSpace: this.formValidate.applicationSpace,
              // modityModel:
              //   this.formValidate.ruleOne + "x" + this.formValidate.ruleTwo,
              modityModel: this.formValidate.modityModel,
              sortNum: this.formValidate.sortNum,
              col_num: this.formValidate.col_num,
              row_num: this.formValidate.row_num,
              audit: this.formValidate.audit,
              status: this.formValidate.status,
              details: this.richtextData,
              video: this.formValidate.video,
              audio: this.formValidate.audio
            };

            let params = {
              modity: paramsModity,
              skuModityList: this.formValidate.skuData,
              recommendationIdList: this.formValidate.recommendationIdList,
              imageMainList: JSON.stringify(this.formValidate.imageMainList),
              imageList: JSON.stringify(this.formValidate.imageList),
              imageMainForMobileList: JSON.stringify(
                this.formValidate.imageMainForMobileList
              )
            };
            this.saveBtnLoading = true;

            editAddDealerModity(params).then(res => {
              if (res.data.code == 200) {
                this.$Message.info(res.data.msg);
                this.$router.go(-1);
              } else {
                this.$Message.warning(res.data.msg);
                this.saveBtnLoading = false;
              }
            });
          } else {
            let paramsModity = {
              id: this.formValidate.id, //添加需要id
              //  categoryId: this.formValidate.categoryId,
              categoryId: this.formValidate.categoryId.join(","),
              categoryName: this.formValidate.categoryName,
              modityName: this.formValidate.modityName,
              officialModel: this.formValidate.officialModel,
              applicableStyle: this.formValidate.applicableStyle.join(","),
              applicableSpace: this.formValidate.applicableSpace.join(","),
              colourCode: this.formValidate.colourCode.join(","),
              saleChannel: this.formValidate.saleChannel.join(","),

              characteristics: this.formValidate.characteristics,
              applicationSpace: this.formValidate.applicationSpace,
              // modityModel:
              //   this.formValidate.ruleOne + "x" + this.formValidate.ruleTwo,
              modityModel: this.formValidate.modityModel,
              sortNum: this.formValidate.sortNum,
              col_num: this.formValidate.col_num,
              row_num: this.formValidate.row_num,
              audit: this.formValidate.audit,
              status: this.formValidate.status,
              details: this.richtextData,
              video: this.formValidate.video,
              audio: this.formValidate.audio
            };

            let params = {
              modity: paramsModity,
              skuModityList: this.formValidate.skuData,
              recommendationIdList: this.formValidate.recommendationIdList,
              imageMainList: JSON.stringify(this.formValidate.imageMainList),
              imageList: JSON.stringify(this.formValidate.imageList),
              imageMainForMobileList: JSON.stringify(
                this.formValidate.imageMainForMobileList
              )
            };
            this.saveBtnLoading = true;
            addDealerModity(params).then(res => {
              if (res.data.code == 200) {
                this.$Message.info(res.data.msg);
                this.$router.go(-1);
              } else {
                this.$Message.warning(res.data.msg);
                this.saveBtnLoading = false;
              }
            });
          }
        } else {
          this.$Message.error("保存失败!");
        }
      });
    },
    handleGetModityInfo(data) {
      //编辑
      getAModityInfo({ id: data }).then(res => {
        if (res.data.code == 200) {
          let dataInfo = res.data.data;
          let modityInfoData = JSON.parse(dataInfo.modity);
          console.log(modityInfoData, "modityInfoData");

          setTimeout(() => {
            let categoryInfoList = this.handleGetcategoryParentId(
              this.categoryList,
              modityInfoData.categoryId
            );
            this.formValidate.categoryId = categoryInfoList;
            this.formValidate.categoryName = modityInfoData.categoryName;

            this.formValidate.recommendationIdList = JSON.parse(
              dataInfo.recommendationIdList
            );

            this.recommend_checkAllGroupChange(
              this.formValidate.recommendationIdList
            );
          }, 300);

          this.formValidate.id = modityInfoData.id;
          this.formValidate.sortNum = modityInfoData.sortNum;
          this.formValidate.modityName = modityInfoData.modityName;
          this.formValidate.modityModel = modityInfoData.modityModel;
          this.formValidate.officialModel = modityInfoData.officialModel;
          this.formValidate.applicableStyle = modityInfoData.applicableStyle.split(
            ","
          );
          this.formValidate.applicableSpace = modityInfoData.applicableSpace.split(
            ","
          );
          this.formValidate.colourCode = modityInfoData.colourCode.split(",");
          this.formValidate.saleChannel = modityInfoData.saleChannel.split(",");
          this.formValidate.characteristics = modityInfoData.characteristics;
          this.formValidate.applicationSpace = modityInfoData.applicationSpace;

          this.style_checkAllGroupChange(this.formValidate.applicableStyle);
          this.space_checkAllGroupChange(this.formValidate.applicableSpace);
          this.colourCode_checkAllGroupChange(this.formValidate.colourCode);
          this.saleChannel_checkAllGroupChange(this.formValidate.saleChannel);
          let modityModelArr = modityInfoData.modityModel.split("x");
          this.formValidate.ruleOne = parseFloat(modityModelArr[0]);
          this.formValidate.ruleTwo = parseFloat(modityModelArr[1]);
          this.formValidate.col_num = modityInfoData.colNum;
          this.formValidate.row_num = modityInfoData.rowNum;
          this.formValidate.audit = modityInfoData.audit.toString();
          this.formValidate.status = modityInfoData.status.toString();
          this.formValidate.skuData = JSON.parse(dataInfo.skuModityList);
          console.log(dataInfo.imageMainList, "主图");
          if (dataInfo.imageMainList.length != 0) {
            this.formValidate.imageMainList = JSON.parse(
              dataInfo.imageMainList
            );
            this.mainInfoImgParams.mainInfoImgList = this.formValidate.imageMainList;
          }
          if (dataInfo.imageMainForMobileList.length != 0) {
            this.formValidate.imageMainForMobileList = JSON.parse(
              dataInfo.imageMainForMobileList
            );
            this.mobileImgParams.imageMobileList = this.formValidate.imageMainForMobileList;
          }

          if (dataInfo.imageList.length != 0) {
            this.formValidate.imageList = JSON.parse(dataInfo.imageList);
            this.infoImgParams.infoImgList = this.formValidate.imageList;
          }

          if (modityInfoData.details) {
            this.richtextData = JSON.parse(modityInfoData.details);
          }

          this.formValidate.video = modityInfoData.video;
          if (this.formValidate.video) {
            this.$refs.videoRef.initUploadList(this.formValidate.video);
          }
          this.formValidate.audio = modityInfoData.audio;
          if (this.formValidate.audio) {
            this.$refs.audioRef.initUploadList(this.formValidate.audio);
          }
        }
      });
    },
    handleCategoryCascader(value, selectedData) {
      // console.log(selectedData,888)
      if (selectedData.length != 0) {
        if (this.$route.query.id) {
          let sectionArr = selectedData;

          this.formValidate.categoryId = [];
          this.formValidate.categoryId.push(
            sectionArr[sectionArr.length - 1].value
          );
          let strArr = [];
          sectionArr.forEach(item => {
            strArr.push(item.label);
          });
          this.formValidate.categoryName = strArr.join("/");
        } else {
          let sectionArr = selectedData;
          this.formValidate.categoryId.push(
            sectionArr[sectionArr.length - 1].value
          );
          let strArr = [];
          sectionArr.forEach(item => {
            strArr.push(item.label);
          });
          this.formValidate.categoryName = strArr.join("/");
        }
      }
    },
    handleGetcategoryParentId(data2, nodeId2) {
      //获取类目父类id
      var arrRes = [];

      let rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          let node = data[i];
          if (node.value == nodeId) {
            arrRes.unshift(nodeId);
            rev(data2, node.parentId);
            break;
          } else {
            if (!!node.children) {
              rev(node.children, nodeId);
            }
          }
        }
        return arrRes;
      };
      arrRes = rev(data2, nodeId2);
      return arrRes;
    },
    handleGetCategoryAll() {
      getCategoryAll({ status: 0 }).then(res => {
        if (res.data.code == 200) {
          let dataArr = res.data.data;
          let treeData = this.getTree(dataArr);

          this.categoryList = treeData;
        }
      });
    },
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.label = item.cateName;
          obj.value = item.id;
          obj.parentId = item.parentId;
          obj.status = item.status;

          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    style_checkAllGroupChange(data) {
      if (data.length == this.applicableStyleList.length) {
        this.style_checkAll = true;
      } else {
        this.style_checkAll = false;
      }
    },
    space_checkAllGroupChange(data) {
      if (data.length == this.applicableSpaceList.length) {
        this.space_checkAll = true;
      } else {
        this.space_checkAll = false;
      }
    },
    colourCode_checkAllGroupChange(data) {
      if (data.length == this.colourCodeList.length) {
        this.colourCode_checkAll = true;
      } else {
        this.colourCode_checkAll = false;
      }
    },
    saleChannel_checkAllGroupChange(data) {
      if (data.length == this.saleChannelList.length) {
        this.saleChannel_checkAll = true;
      } else {
        this.saleChannel_checkAll = false;
      }
    },
    handleRecommendCheckAll() {
      this.formValidate.recommendationIdList = [];
      if (this.recommend_checkAll) {
        this.recommendList.forEach(item => {
          this.formValidate.recommendationIdList.push(item.id);
        });
      }
    },
    recommend_checkAllGroupChange(data) {
      if (data.length == this.recommendList.length) {
        this.recommend_checkAll = true;
      } else {
        this.recommend_checkAll = false;
      }
    },
    handleStyleCheckAll() {
      this.formValidate.applicableStyle = [];
      if (this.style_checkAll) {
        this.applicableStyleList.forEach(item => {
          this.formValidate.applicableStyle.push(item.id);
        });
      }
    },

    handleStyleChecks(data, temp) {
      getCommoncheckBox(data).then(res => {
        if (res.data.code == 200) {
          let dataStyleArr = res.data.data;
          dataStyleArr.forEach(item => {
            let obj = {
              id: item.id,
              name: item.detailName
            };
            temp.push(obj);
          });
        }
      });
    },
    handleRecommend(temp) {
      getRecommendBox().then(res => {
        if (res.status == 200) {
          let dataStyleArr = res.data;
          dataStyleArr.forEach(item => {
            let obj = {
              id: item.id,
              name: item.name
            };
            temp.push(obj);
          });
        }
      });
    },
    handleSpaceCheckAll() {
      this.formValidate.applicableSpace = [];
      if (this.space_checkAll) {
        this.applicableSpaceList.forEach(item => {
          this.formValidate.applicableSpace.push(item.id);
        });
      }
    },
    handleColourCheckAll() {
      this.formValidate.colourCode = [];
      if (this.colourCode_checkAll) {
        this.colourCodeList.forEach(item => {
          this.formValidate.colourCode.push(item.name);
        });
      }
    },
    handleSaleChannelCheckAll() {
      this.formValidate.saleChannel = [];
      if (this.saleChannel_checkAll) {
        this.saleChannelList.forEach(item => {
          this.formValidate.saleChannel.push(item.id);
        });
      }
    },

    handleUploadMainImg(data) {
      //主图

      this.formValidate.imageMainList = data;
    },
    handleUploadMapImg(data) {
      // console.log(data, "上传纹理图图片");

      this.formValidate.imageList = data;
    },
    handleUploadMobileImg(data) {
      this.formValidate.imageMainForMobileList = data;
    },
    handleUploadMusic(data) {
      // console.log(data, "视频");
      if (data.audioFlag == true) {
        this.formValidate.audio = data.imageUrl;
      } else {
        this.formValidate.video = data.imageUrl;
      }
    },
    handleReduce(arr) {
      //去重
      var result = [];
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].imageId]) {
          result.push(arr[i]);
          obj[arr[i].imageId] = true;
        }
      }
      return result;
    },
    handleAddSku() {
      this.skuBtnLoading = true;
      this.pridceDisabled = true;
      this.modelSkuFlag = true;
      this.showText = "添加";
      this.skuIndex = null;
      this.formItem.modityLength = null;
      this.formItem.modityWidth = null;
      this.formItem.price2 = 0;
      this.formItem.price1 = "";
      this.formItem.status = "0";
    },
    handleCancelSku() {
      this.modelSkuFlag = false;
      this.formItem.modityLength = null;
      this.formItem.modityWidth = null;
      this.formItem.price2 = 0;
      this.formItem.price1 = "";
      this.formItem.status = "0";
    },
    handleSummitSku() {
      let dataSku = this.formItem;

      if (this.skuIndex != null) {
        let editSkuobj = {
          moditySize:
            this.formItem.modityLength + "x" + this.formItem.modityWidth,
          price2: this.formItem.price2,
          price1: this.formItem.price1,
          status: this.formItem.status
        };
        this.formValidate.skuData.splice(this.skuIndex, 1, editSkuobj);
        this.modelSkuFlag = false;
      } else {
        // let skuModityLength = this.formItem.modityLength
        //   ? this.formItem.modityLength
        //   : 0;
        // let skuModityWidth = this.formItem.modityWidth
        //   ? this.formItem.modityWidth
        //   : 0;
        let skuModityLength = this.formItem.modityLength;
        let skuModityWidth = this.formItem.modityWidth;
        let obj = {
          moditySize: skuModityLength + "x" + skuModityWidth,
          price2: this.formItem.price2 ? this.formItem.price2 : 0,
          price1: this.formItem.price1 ? this.formItem.price1 : 0,
          status: this.formItem.status
        };
        this.formValidate.skuData.push(obj);
        this.modelSkuFlag = false;
      }

      // this.modelSkuFlag = false;
    },

    handleBack() {
      this.$router.go(-1);
    },
    handleEditeSku(data) {
      this.modelSkuFlag = true;
      this.pridceDisabled = false;
       this.skuBtnLoading = false;
      this.showText = "编辑";
      this.skuIndex = data.index;

      let moditySizeArr = data.row.moditySize.split("x");
      this.formItem.modityLength = parseFloat(moditySizeArr[0]);
      this.formItem.modityWidth = parseFloat(moditySizeArr[1]);
      this.formItem.price2 = data.row.price2;
      this.formItem.price1 = data.row.price1;
      this.formItem.status = data.row.status;
    },
    handleRemoveSku(data) {
      this.formValidate.skuData.splice(data.index, 1);
    },
    handleWatch() {
      if (this.formValidate.imageList.length != 0) {
        this.colNumber = Number(this.formValidate.col_num);

        this.watchImageFlag = true;
        this.items = this.formValidate.imageList;
        // container
      } else {
        this.$Message.warning("请上传纹理图");
      }
    },
    changeLengthNumber() {
      var regu = /^([0]|[1-9][0-9]*)$/;
      let val = this.formItem.modityLength;
      // if (val != "") {
      //   if (!regu.test(val)) {
      //     this.$Message.warning("请输入正确的规格");
      //      this.skuBtnLoading = true;
      //     return;
      //   } else {
      //     if (this.formItem.price2) {
      //       if (this.formItem.modityLength && this.formItem.modityWidth) {
      //         let price2 = Number(this.formItem.price2)*1000000;
      //         let area = this.formItem.modityLength * this.formItem.modityWidth;
      //         let num = price2 / area;
      //         let price1 = num.toFixed(2);
      //         this.formItem.price1 = price1;
      //          this.skuBtnLoading = false;
      //       }
      //     }
      //   }
      // } else {
      //    this.$Message.warning("请输入正确的规格");
      //   this.skuBtnLoading = true;
      // }
    
      if (val != "") {
        if (!regu.test(val)) {
          this.$Message.warning("请输入正确的规格");
          this.skuBtnLoading = true;
          this.pridceDisabled = true;
          return;
        } else {
          if (this.formItem.price2) {
            if (
              !regu.test(this.formItem.modityLength) ||
              !regu.test(this.formItem.modityWidth) ||
              !regu.test(this.formItem.price2)
            ) {
              this.$Message.warning("请输入正确的值");
              this.skuBtnLoading = true;
              this.formItem.price1 = "";
              return;
            } else {
              if (this.formItem.modityLength && this.formItem.modityWidth) {
                let price2 = Number(this.formItem.price2) * 1000000;
                let area =
                  this.formItem.modityLength * this.formItem.modityWidth;
                let num = price2 / area;
                let price1 = num.toFixed(2);
                this.formItem.price1 = price1;
                this.pridceDisabled = false;
                this.skuBtnLoading = false;
              } else {
                this.formItem.price1 = "";
              }
            }
          } else {
            if (
              regu.test(this.formItem.modityLength) &&
              regu.test(this.formItem.modityWidth)
            ) {
              this.pridceDisabled = false;
              this.skuBtnLoading = false;
            } else {
              console.log("modityLength");
            }
          }
        }
      } else {
        this.$Message.warning("请输入正确的规格");
        this.pridceDisabled = true;
        this.skuBtnLoading = true;
        this.formItem.price1 = "";
      }
    },
    changeWidthhNumber() {
      console.log("changeWidthhNumber");
      var regu = /^([0]|[1-9][0-9]*)$/;
      let val = this.formItem.modityWidth;
      // if (val != "") {
      //   if (!regu.test(val)) {
      //     this.$Message.warning("请输入正确的规格");
      //     this.skuBtnLoading = true;
      //     return;
      //   } else {
      //     if (this.formItem.price2) {
      //       if (this.formItem.modityLength && this.formItem.modityWidth) {
      //         let price2 = Number(this.formItem.szz) * 1000000;
      //         let area = this.formItem.modityLength * this.formItem.modityWidth;
      //         let num = price2 / area;
      //         let price1 = num.toFixed(2);
      //         this.formItem.price1 = price1;
      //         this.skuBtnLoading = false;
      //       }
      //     }
      //   }
      // } else {
      //   this.$Message.warning("请输入正确的规格");
      //   this.skuBtnLoading = true;
      // }

      if (val != "") {
        if (!regu.test(val)) {
          this.$Message.warning("请输入正确的规格");
          this.skuBtnLoading = true;
          this.pridceDisabled = true;
          return;
        } else {
          if (this.formItem.price2) {
            if (
              !regu.test(this.formItem.modityLength) ||
              !regu.test(this.formItem.modityWidth) ||
              !regu.test(this.formItem.price2)
            ) {
              this.$Message.warning("请输入正确的值");
              this.skuBtnLoading = true;
              this.formItem.price1 = "";
              return;
            } else {
              if (this.formItem.modityLength && this.formItem.modityWidth) {
                let price2 = Number(this.formItem.price2) * 1000000;
                let area =
                  this.formItem.modityLength * this.formItem.modityWidth;
                let num = price2 / area;
                let price1 = num.toFixed(2);
                this.formItem.price1 = price1;
                this.pridceDisabled = false;
                this.skuBtnLoading = false;
              } else {
                this.formItem.price1 = "";
              }
            }
          } else {
            if (
              regu.test(this.formItem.modityLength) &&
              regu.test(this.formItem.modityWidth)
            ) {
              this.pridceDisabled = false;
              this.skuBtnLoading = false;
            } else {
              console.log("modityWidth");
            }
          }
        }
      } else {
        this.$Message.warning("请输入正确的规格");
        this.pridceDisabled = true;
        this.skuBtnLoading = true;
        this.formItem.price1 = "";
      }
    },
    handleRuleOne() {
      if (this.formValidate.ruleTwo) {
        if (this.formValidate.ruleOne && this.formValidate.ruleTwo) {
          this.ruleShowFlag = false;
        } else {
          this.ruleShowFlag = true;
          // return;
        }
      }
    },
    handleRuleTwo() {
      if (this.formValidate.ruleOne) {
        if (this.formValidate.ruleOne && this.formValidate.ruleTwo) {
          this.ruleShowFlag = false;
        } else {
          this.ruleShowFlag = true;
          // return;
        }
      }
    },
    handlePrice() {
      let modelLength = this.formItem.modityLength;
      let modelWidth = this.formItem.modityWidth;
      var regu = /^([0]|[1-9][0-9]*)$/;
      if (this.formItem.price2 != "") {
        if (regu.test(this.formItem.price2)) {
          if (modelLength && modelWidth) {
            let price2 = Number(this.formItem.price2) * 1000000;
            let area = modelLength * modelWidth;
            let num = price2 / area;
            let price1 = num.toFixed(2);
            this.formItem.price1 = price1;
            this.skuBtnLoading = false;
          } else {
            this.formItem.price1 = "";
          }
        }
      }
    }
  },
  watch: {
    "formValidate.id": function(newVal, oldVal) {
      // console.log(newVal, "----", oldVal);
      if (newVal) {
        this.addModityId = newVal;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.line_button {
  display: flex;
}
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

.container {
  // width: 80px;
  // height: 300px;
  display: flex;
}
.contaner_box {
  flex: 1;
  .item {
    margin-bottom: 10px;
  }
}
.item {
  width: 90px;
  height: 90px;
  margin-top: 10px;
  transition: all linear 0.3s;
  cursor: pointer;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.other_box {
  padding-left: 20px;
  .other_item_on {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    div:nth-child(1) {
      margin-right: 12px;
    }
  }
  .other_item_bottom {
    margin-top: 20px;
    margin-left: 60px;
  }
}

.content_detail {
  position: relative;
  top: 32px;
  z-index: 3;
  font-size: 14px;
  text-align: left;
  width: 320px;
  height: 530px;
  margin: 0 auto;
  overflow: auto;
}

::-webkit-scrollbar {
  display: none;
}
</style>
