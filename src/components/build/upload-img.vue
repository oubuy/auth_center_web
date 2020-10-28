<template>
  <div>
    <div class="upload-list" v-for="(item, index) in uploadList">
      <div v-if="item.status === 'finished'">
        <viewer :images="[item.url]" :options="options" style="height:150px; width:150px; cursor: pointer;">
          <img :id="'uploadImg'+index" :src="item.url" style="height:100%; width:100%;">
        </viewer>
        <div class="upload-list-cover">
          <Icon v-if="isLayout" type="ios-crop-outline" @click.native="handleImgModal(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </div>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload v-show="!(quantity==1 && uploadList.length==1)" ref="upload" action="/build-rest/file/uploadImage" :data="{watermark:watermark}"
      :headers="uploadHeaders" type="drag" name="file" :show-upload-list="false" :format="uploadImgFormat" :on-success="handleSuccess"
      :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" class="upload">
      <div style="width: 148px; height:148px; line-height: 148px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <!-- 查看图片详细 -->
    <Modal v-model="imgModal" title="编辑图片" footer-hide scrollable width="1200" :closable="false" :mask-closable="false">
      <div style="text-align: center;" v-if="!isChangeSize">
        <img :src="imgUrl" v-if="imgModal" style="max-width: 568px;">
        <div v-if="isLayout" style="text-align: center;margin-top: 20px;"><Button @click="changeSize" type="primary">修改尺寸</Button></div>
      </div>
      <div v-else>
        <div style="display: flex;justify-content: space-around;">
          <div>
            <div style="font-size: 16px;margin-bottom: 10px;">修改前：</div>
            <div class="before-box" style="width: 568px;border: 1px solid #ccc;padding: 10px;display: flex;justify-content: center;align-items: center;height: 400px;">
              <div style="display: flex;align-items: center;justify-content: center;height: 100%;width: 100%;">
                <img :src="imgUrl" v-if="imgModal" :style="{width:oldWidth,'max-height': '100%','max-width': '100%'}" class="oldImg">
              </div>
            </div>
          </div>
          <div>
            <div style="font-size: 16px;margin-bottom: 10px;">修改后：</div>
            <div class="after-box" style="width: 568px;border: 1px solid #ccc;padding: 10px;display: flex;justify-content: center;align-items: center;height: 400px;">
              <!-- single?newHeight:'auto' -->
              <div :style="{display: 'flex',alignItems: 'center','justify-content': 'center',width: '100%',height:'100%'}">
                <img :src="newImgUrl" v-if="imgModal" ref="imageWrapper" :style="{'width': single?newWidth:'auto',height:'auto',maxHeight: '100%',maxWidth: '100%'}"
                  class="newImg">
              </div>
            </div>
          </div>
        </div>
        <div style="display: flex;padding: 20px;">
          <span>修改图片尺寸：</span>
          <div>
            <div style="display: flex;align-items: center;">
              <div>
                <div style="margin-bottom: 10px;">
                  <span>宽</span>
                  <Input type="number" :value="originalWidth" style="width: 80px;text-align: center;" @input="changeWidth"></Input>
                  <span>像素</span>
                </div>
                <div>
                  <span>高</span>
                  <Input type="number" :value="originalHeight" style="width: 80px;text-align: center;" @input="changeHeight"></Input>
                  <span>像素</span>
                </div>
              </div>
              <div style="margin-left: 20px;display: flex;align-items: center;">
                <van-checkbox v-model="single" @change="changeLock">锁定比例</van-checkbox>
              </div>
              <Button @click="handleUnlockPic" v-if="!single" style="height: 30px;margin-left: 20px;">预览</Button>
              <span v-if="!single" style="padding-left: 20px;color: red;">如不锁定比例，请先点击预览查看修改尺寸后的图片再进行保存。</span>
            </div>
            <div style="display: flex;align-items: center;">
              <span>按比例缩放</span>
              <div style="width: 300px;margin: 0 10px;">
                <Slider v-model="percentage" :step="1" :max="200" @on-input="changeSlide" :disabled="!single"></Slider>
              </div>
              <Input type="number" v-model="percentage" style="width: 55px;margin: 0 5px;" @input="changePercentage"
                :disabled="!single"></Input>
              <span>%</span>
            </div>
          </div>
        </div>
        <div style="text-align: center;">
          <Button type="primary" style="margin-right: 20px;" @click="saveImg" :disabled="canSave">保存</Button>
          <Button @click="cancelSave">取消</Button>
        </div>
      </div>
      <Spin v-if="spinShow" fix></Spin>
    </Modal>
  </div>
</template>

<script>
  // import html2canvas from "html2canvas";
  import "viewerjs/dist/viewer.css";
  import Viewer from "v-viewer/src/component.vue";
  import {
    uploadImage
  } from "@/api/uploadImg.js";
  export default {
    props: {
      quantity: { // 上传图片数量限制
        type: Number,
        default: 10
      },
      maxWidth: {
        type: Number
      },
      maxHeight: {
        type: Number
      },
      watermark: {
        type: String,
        default: "false"
      },
      isLayout: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        uploadList: [], // 上传文件列表
        uploadImgFormat: ['jpg', 'jpeg', 'png'], // 上传图片支持的文件类型
        uploadHeaders: {}, // 设置上传的请求头部
        imgModal: false,
        isChangeSize: false,
        canSave: false,
        spinShow: false,
        imgUrl: '',
        newImgUrl: '',
        single: true,
        percentage: 100,
        newWidth: "auto",
        newHeight: 'auto',
        originalWidth: '',
        originalHeight: '',
        sizePercentage: '',
        width: '',
        height: '',
        compareWidth: '',
        compareHeight: '',
        isHeighter: false,
        widthPercentage: '',
        heightPercentage: '',
        oldWidth: 'auto',
        options: {
          button: true,
          toolbar: false,
          rotatable: false,
          scalable: false,
          navbar: true,
          movable: true,
          title: false,
          // toolbar: false,
          fullscreen: false
        }
      }
    },
    mounted() {
      this.uploadHeaders.Authorization = localStorage.getItem("jwttoken");
      this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
      getUrlBase64(url, ext) {
        var canvas = document.createElement("canvas"); //创建canvas DOM元素
        var ctx = canvas.getContext("2d");
        var img = new Image;
        let _self = this;
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function() {
          canvas.width = img.width; //指定画板的宽度，自定义
          canvas.height = img.height; //指定画板的高度,自定义
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //参数可自定义
          var dataURL = canvas.toDataURL("image/" + ext, 1);
          let file = _self.base64ToFile(dataURL);
          let formData = new FormData();
          formData.append('file', file);
          const mainImg = _self.$refs.upload; // 如果已经有文件 删除列表中的文件
          if (mainImg && mainImg.fileList.length) {
            mainImg.clearFiles();
            _self.uploadList = mainImg.fileList;
          }
          let canUpload = _self.handleBeforeUpload(file);
          if (!canUpload) return;
          uploadImage(formData).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              let obj = {};
              obj.imgObj = res.data.data;
              obj.url = res.data.data.imageUrl;
              obj.status = 'finished';
              _self.$refs.upload.fileList.push(obj);
              _self.$Message.success("修改成功");
            } else {
              _self.$Message.warning("修改失败");
            }
            _self.percentage = 100;
            _self.originalWidth = "";
            _self.originalHeight = "";
            _self.width = "";
            _self.height = "";
            _self.newWidth = "auto";
            _self.newHeight = "auto";
            _self.sizePercentage = "";
            _self.widthPercentage = "";
            _self.heightPercentage = "";
            _self.oldWidth = "auto";
            _self.imgModal = false;
            _self.isChangeSize = false;
            _self.canSave = false;
            _self.spinShow = false;
          }).catch(err => {})
          canvas = null;
        };
      },
      initUploadList(imgInfo) { // 初始化已上传文件列表
        this.uploadList.splice(0, this.uploadList.length);
        if (imgInfo) {
          let arr = [];
          if (imgInfo instanceof Array) {
            arr = imgInfo;
          } else if (imgInfo instanceof Object) {
            arr.push(imgInfo);
          }
          arr.forEach(item => {
            this.uploadList.push({
              imgObj: item,
              url: item.imageUrl,
              status: 'finished'
            });
          });
        }
      },
      getUploadList() { // 获取已上传文件列表
        let ret = [];
        for (let i = 0; i < this.uploadList.length; i++) {
          let item = this.uploadList[i];
          if (item.status != 'finished') {
            this.$Message.warning("图片上传中，请稍候...");
            return null;
          }
          ret.push(item.imgObj);
        }
        return ret;
      },
      handleImgModal(imgUrl, resizeImageUrl) {
        imgUrl = this.getResizeImageUrl(imgUrl);
        this.imgUrl = imgUrl;
        this.newImgUrl = imgUrl;
        this.imgModal = true;
        this.changeSize();
      },
      getResizeImageUrl(imageUrl) {
        imageUrl = imageUrl.replace(/pic.oceano.com.cn/, "oceano-osnhome.oss-cn-hangzhou.aliyuncs.com");
        // imageUrl = imageUrl.replace(/center.oceano.com.cn/, "oceano-center.oss-cn-hangzhou.aliyuncs.com");
        return imageUrl;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess(res, file) {
        if (res.code == 200) {
          file.imgObj = res.data;
          file.url = res.data.imageUrl;
        } else {
          this.$Message.warning(res.msg);
          this.handleRemove(file);
        }
      },
      handleFormatError(file) {
        this.$Message.warning("图片格式错误, 请选择：jpg、jpeg、png");
      },
      handleBeforeUpload(file) {
        if (this.uploadList.length >= this.quantity) {
          this.$Message.warning("最多只能上传" + this.quantity + "张图片");
          return false;
        }
        if (this.maxWidth || this.maxHeight) {
          return this.checkImageWH(file, this.maxWidth, this.maxHeight);
        }
        return true;
      },
      checkImageWH(file, width, height) {
        let self = this;
        return new Promise(function(resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
            let src = e.target.result;
            const image = new Image();
            image.onload = function() {
              if (width && this.width > width) {
                self.$Message.warning("上传的图片宽度不能超过" + width);
                reject();
              } else if (height && this.height > height) {
                self.$Message.warning("上传的图片高度不能超过" + height);
                reject();
              } else {
                resolve();
              }
            };
            image.onerror = reject;
            image.src = src;
          };
          filereader.readAsDataURL(file);
        });
      },
      handleUnlockPic() {
        this.spinShow = true;
        this.canSave = false;
        let url = this.imgUrl + "?x-oss-process=image/resize,m_fixed,w_" + this.originalWidth + ",h_" + this.originalHeight +
          ",limit_0";
        var img = new Image;
        let _self = this;
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function() {
          _self.newImgUrl = url;
          _self.canSave = false;
          _self.spinShow = false;
        };
      },
      changeSize() {
        this.isChangeSize = true;
        this.spinShow = true;
        this.$nextTick(() => {
          let imgEle = document.getElementsByClassName("oldImg")[0];
          this.getImgNaturalDimensions(imgEle);
        })
      },
      changeWidth(val) {
        if (val.indexOf('.') != -1) {
          val = parseInt(val);
          this.originalWidth = val;
          this.$Message.warning("请输入整数");
          return;
        }
        if (val > 4000) {
          this.$Message.warning("宽不能大于4000");
          val = 4000;
        }
        this.originalWidth = val;
        let width = parseInt(this.originalWidth / this.widthPercentage);
        if (this.single) {
          this.canSave = false;
          this.originalHeight = parseInt(val / this.sizePercentage);
          if (width > this.compareWidth) {
            this.oldWidth = parseInt(this.compareWidth / (width / this.compareWidth)) + 'px';
            this.newWidth = "auto";
          } else {
            this.oldWidth = "auto";
            this.newWidth = width + 'px';
          }
        } else {
          this.canSave = true;
        }
      },
      changeHeight(val) {
        if (val.indexOf('.') != -1) {
          this.$Message.warning("请输入整数");
          return;
        }
        if (val > 4000) {
          this.$Message.warning("高不能大于4000");
          val = 4000;
        }
        this.originalHeight = val;
        if (this.single) {
          this.canSave = false;
          this.originalWidth = parseInt(val * this.sizePercentage);
          let width = parseInt(this.originalWidth / this.widthPercentage);
          if (width > this.compareWidth) {
            this.oldWidth = parseInt(this.compareWidth / (width / this.compareWidth)) + 'px';
            this.newWidth = "auto";
          } else {
            this.oldWidth = "auto";
            this.newWidth = width + 'px';
          }
        } else {
          this.canSave = true;
          this.newHeight = parseInt(this.originalHeight / this.heightPercentage) + 'px';
        }
      },
      changeLock(val) {
        if (this.single) {
          this.canSave = false;
          this.originalHeight = parseInt(this.originalWidth / this.sizePercentage);
          this.newHeight = parseInt(this.height / this.heightPercentage) + 'px';
          this.newImgUrl = this.imgUrl;
          let width = parseInt(this.originalWidth / this.widthPercentage);
          if (width > this.compareWidth) {
            this.oldWidth = parseInt(this.compareWidth / (width / this.compareWidth)) + 'px';
            this.newWidth = "auto";
          } else {
            this.oldWidth = "auto";
            this.newWidth = width + 'px';
          }
        } else {
          this.canSave = true;
          this.oldWidth = "auto";
          this.newWidth = parseInt(this.originalWidth / this.widthPercentage) + 'px';
          this.newHeight = parseInt(this.originalHeight / this.heightPercentage) + 'px';
        }
      },
      changeSlide(val) {
        this.percentage = val;
        this.originalWidth = parseInt(val * this.width / 100);
        this.originalHeight = parseInt(val * this.height / 100);
        let width = parseInt(this.originalWidth / this.widthPercentage);
        if (width > this.compareWidth) {
          this.oldWidth = parseInt(this.compareWidth / (width / this.compareWidth)) + 'px';
        } else {
          this.oldWidth = "auto";
          this.newWidth = width + 'px';
        }
      },
      changePercentage(val) {
        this.percentage = Number(val);
      },
      getImgNaturalDimensions(oImg) {
        var nImg = new Image();
        let _self = this;
        nImg.onload = function() {
          var nWidth = nImg.width,
            nHeight = nImg.height;
          _self.sizePercentage = nWidth / nHeight;
          if (nWidth > 4000) {
            nWidth = 4000;
            nHeight = parseInt(nWidth / _self.sizePercentage);
          }
          _self.originalWidth = nWidth;
          _self.originalHeight = nHeight;
          _self.widthPercentage = nWidth / oImg.offsetWidth;
          _self.heightPercentage = nHeight / oImg.offsetHeight;
          _self.newWidth = parseInt(nWidth / _self.widthPercentage) + 'px';
          _self.newHeight = parseInt(nHeight / _self.heightPercentage) + 'px';
          _self.width = nWidth;
          _self.height = nHeight;
          _self.compareWidth = parseInt(nWidth / _self.widthPercentage);
          _self.compareHeight = parseInt(nHeight / _self.heightPercentage);
          _self.spinShow = false;
        }
        nImg.src = oImg.src;
      },
      toImage() {
        if (this.originalWidth > 4000 || this.originalHeight > 4000) {
          this.$Message.warning("宽高不能超过4000");
          return false;
        }
        this.canSave = true;
        this.spinShow = true;
        let url = "";
        if (this.single) {
          url = this.imgUrl + "?x-oss-process=image/resize,m_fixed,w_" + this.originalWidth + ",limit_0";
        } else {
          url = this.newImgUrl;
        }
        this.getUrlBase64(url, 'jpg');
      },
      base64ToFile(data) {
        // 将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
        let binary = atob(data.split(',')[1]);
        let mime = data.split(',')[0].match(/:(.*?);/)[1];
        let array = [];
        for (let i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }
        let fileData = new Blob([new Uint8Array(array)], {
          type: mime,
        });
        let file = new File([fileData], `${new Date().getTime()}.png`, {
          type: mime
        });
        return file;
      },
      saveImg() {
        if (!this.originalWidth || !this.originalHeight) {
          this.$Message.warning("宽高不能为0或空");
          return;
        }
        if (this.originalWidth < 0 || this.originalHeight < 0) {
          this.$Message.warning("宽高不能为负数");
          return;
        }
        if (this.width == this.originalWidth && this.height == this.originalHeight) {
          this.imgModal = false;
          this.percentage = 100;
          return;
        }
        this.canSave = true;
        this.spinShow = true;
        this.toImage();
      },
      cancelSave() {
        this.imgModal = false;
        this.percentage = 100;
        this.isChangeSize = false;
        this.single = true;
        this.canSave = false;
        this.oldWidth = "auto";
      }
    }
  }
</script>

<style scoped>
  .upload-list {
    display: inline-block;
    width: 150px;
    height: 150px;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    height: 30px;
    line-height: 30px;
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .upload {
    display: inline-block;
    position: relative;
    line-height: normal;
    width: 150px;
    height: 150px;
    margin-right: 4px;
  }

  .heighter {
    height: 100%;
  }
</style>
