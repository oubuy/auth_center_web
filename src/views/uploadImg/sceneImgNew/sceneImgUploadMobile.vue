<template>
  <div>
    <div style="padding: 0 .2rem;">
      <div class="top_box">
        <div class="img-sjt-box">
          <div class="border_bottom" style="display: flex;padding: 0.2rem .4rem 0.2rem 0;">
            <div><span style="padding-left: .2rem;">实景图</span> <span style="font-size: .3rem;">(为保证效果, 建议上传至少1张远景,
                5张近景)</span></div>
          </div>
          <div style="display: flex;padding: .3rem 0;">
            <van-uploader v-model="fileList" preview-size="2.9rem" multiple accept="image/*" :before-read="beforeRead"
              :after-read="afterRead" @delete="deleteUploadImg" />
          </div>
        </div>
        <div class="img-xgt-box">
          <div class="border_bottom" style="display: flex;padding: 0.2rem .4rem 0.2rem 0;">
            <div><span style="padding-left: .2rem;">效果图</span> <span style="font-size: .3rem;">(为保证效果, 建议上传至少1张远景,
                5张近景)</span></div>
          </div>
          <div style="display: flex;padding: .3rem 0;">
            <van-uploader v-model="xgtFileList" preview-size="2.9rem" multiple accept="image/*" :before-read="xgtBeforeRead"
              :after-read="xgtAfterRead" @delete="deleteXgtImg" />
          </div>
        </div>
      </div>
      <div class="button_box" @click="save">完成</div>
    </div>
    <v-loading :showPage="showPage" :saveFlag="saveFlag"></v-loading>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  import {
    uploadImage,
    sceneCaseSave
  } from "@/api/uploadImg.js";
  export default {
    data() {
      return {
        showPage: false,
        saveFlag: false,
        value: '',
        fileList: [],
        xgtFileList: [],
        imageSjtList: [],
        imageXgtList: [],
        formData: {}
      }
    },
    created() {
      this.sceneSpaceDetail();
    },
    mounted() {
      document.getElementsByTagName("body")[0].style.background = "#fff";
    },
    methods: {
      sceneSpaceDetail() {
        let data = localStorage.getItem("formData");
        this.formData = JSON.parse(data);
        this.imageSjtList = this.formData.imageSjtList;
        this.imageXgtList = this.formData.imageXgtList;
        for (let i = 0; i < this.imageSjtList.length; i++) {
          let obj = {
            url: this.imageSjtList[i].imageUrl
          };
          this.fileList.push(obj);
        }
        for (let i = 0; i < this.imageXgtList.length; i++) {
          let obj = {
            url: this.imageXgtList[i].imageUrl
          };
          this.xgtFileList.push(obj);
        }
        this.showPage = true;
      },
      beforeRead(file) {
        if (file.length) {
          for (let i = 0, l = file.length; i < l; i++) {
            let size = file[i].size;
            let minSize = size / 1024;
            if (!/\.(jpeg|bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|wmf|webp)$/.test(file[i].name.toLowerCase())) {
              this.$toast('只能上传图片');
              return false;
            }
            // if (minSize < 2048) {
            //   this.$toast('您上传的图片质量过小（建议在2M以上）,请重新上传');
            //   return;
            // }
          }
        } else {
          let size = file.size;
          let minSize = size / 1024;
          console.log(file.name.toLowerCase())
          if (!/\.(jpeg|bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|wmf|webp)$/.test(file.name.toLowerCase())) {
            this.$toast('只能上传图片');
            return false;
          }
          // if (minSize < 2048) {
          //   this.$toast('您上传的图片质量过小（建议在2M以上）,请重新上传');
          //   return;
          // }
        }
        return true;
      },
      xgtBeforeRead(file) {
        if (file.length) {
          for (let i = 0, l = file.length; i < l; i++) {
            let size = file[i].size;
            let minSize = size / 1024;
            if (!/\.(jpeg|bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp)$/.test(file[
                i].name)) {
              this.$toast('只能上传图片');
              return false;
            }
            // if (minSize < 2048) {
            //   this.$toast('您上传的图片质量过小（建议在2M以上）,请重新上传');
            //   return;
            // }
          }
        } else {
          let size = file.size;
          let minSize = size / 1024;
          if (!/\.(jpeg|bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp)$/.test(file.name)) {
            this.$toast('只能上传图片');
            return false;
          }
          // if (minSize < 2048) {
          //   this.$toast('您上传的图片质量过小（建议在2M以上）,请重新上传');
          //   return;
          // }
        }
        return true;
      },
      afterRead(file) {
        if (file.length) {
          for (let i = 0, l = file.length; i < l; i++) {
            file.status = 'uploading';
            file.message = '上传中...';
            let formData = new FormData();
            formData.append('file', file[i].file);
            uploadImage(formData).then(res => {
              if (res.data.code == 200) {
                let obj = {};
                obj.imageUrl = res.data.data.imageUrl;
                this.imageSjtList.push(obj);
                file.status = 'done';
                file.message = '';
              } else {
                file.status = 'failed';
                file.message = '上传失败';
              }
            }).catch(err => {
              {
                file.status = 'failed';
                file.message = '上传失败';
              }
            })
          }
        } else {
          file.status = 'uploading';
          file.message = '上传中...';
          let formData = new FormData();
          formData.append('file', file.file);
          uploadImage(formData).then(res => {
            if (res.data.code == 200) {
              let obj = {};
              obj.imageUrl = res.data.data.imageUrl;
              this.imageSjtList.push(obj);
              file.status = 'done';
              file.message = '';
            } else {
              file.status = 'failed';
              file.message = '上传失败';
            }
          }).catch(err => {
            {
              file.status = 'failed';
              file.message = '上传失败';
            }
          })
        }
      },
      xgtAfterRead(file) {
        if (file.length) {
          for (let i = 0, l = file.length; i < l; i++) {
            file.status = 'uploading';
            file.message = '上传中...';
            let formData = new FormData();
            formData.append('file', file[i].file);
            uploadImage(formData).then(res => {
              if (res.data.code == 200) {
                let obj = {};
                obj.imageUrl = res.data.data.imageUrl;
                this.imageXgtList.push(obj);
                file.status = 'done';
                file.message = '';
              } else {
                file.status = 'failed';
                file.message = '上传失败';
              }
            }).catch(err => {
              {
                file.status = 'failed';
                file.message = '上传失败';
              }
            })
          }
        } else {
          file.status = 'uploading';
          file.message = '上传中...';
          let formData = new FormData();
          formData.append('file', file.file);
          uploadImage(formData).then(res => {
            if (res.data.code == 200) {
              let obj = {};
              obj.imageUrl = res.data.data.imageUrl;
              this.imageXgtList.push(obj);
              file.status = 'done';
              file.message = '';
            } else {
              file.status = 'failed';
              file.message = '上传失败';
            }
          }).catch(err => {
            {
              file.status = 'failed';
              file.message = '上传失败';
            }
          })
        }
      },
      deleteUploadImg(file, obj) {
        this.imageSjtList.splice(obj.index, 1);
      },
      deleteXgtImg(file, obj) {
        this.imageXgtList.splice(obj.index, 1);
      },
      save() {
        if (!this.imageSjtList.length && !this.imageXgtList.length) {
          this.$toast("请至少上传1张实景图或效果图");
          return;
        }
        this.saveFlag = true;
        let productList = [];
        let imageXgtList = [];
        let imageSjtList = [];
        for (let i = 0, l = this.formData.productList.length; i < l; i++) {
          let obj = {}
          if(this.formData.productList[i].productId) {
            obj = {
              productId: this.formData.productList[i].productId,
              quantity: this.formData.productList[i].quantity,
              usePosition: this.formData.productList[i].usePosition
            }
          }else {
            obj = {
              officialModel: this.formData.productList[i].officialModel,
              modityName: this.formData.productList[i].modityName,
              quantity: this.formData.productList[i].quantity,
              usePosition: this.formData.productList[i].usePosition
            }
          }
          productList.push(obj);
        }
        for (let i = 0, l = this.imageSjtList.length; i < l; i++) {
          let obj = {
            imageUrl: this.imageSjtList[i].imageUrl
          }
          imageSjtList.push(obj);
        }
        for (let i = 0, l = this.imageXgtList.length; i < l; i++) {
          let obj = {
            imageUrl: this.imageXgtList[i].imageUrl
          }
          imageXgtList.push(obj);
        }
        this.formData.imageXgtList = imageXgtList;
        this.formData.imageSjtList = imageSjtList;
        this.formData.productList = productList;
        if (this.formData.videoList.length) this.formData.videoList = [{
          videoUrl: this.formData.videoList[0].videoUrl
        }];
        sceneCaseSave(this.formData).then(res => {
          if (res.data.code == 200) {
            this.saveFlag = false;
            this.$toast("保存成功");
            this.$router.push({
              path: '/sceneImgManageMobile'
            })
          }
        });
      }
    }
  }
</script>

<style scoped>
  .top_box {
    margin: .2rem 0 .6rem 0;
    font-size: .36rem;
  }

  .button_box {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    color: #fff;
    background: #1889f9;
    font-size: .36rem;
    padding: .34rem 0;
  }

  .border_bottom {
    border-bottom: 1px solid #ebedf0;
  }

  .upload {
    background: #fff;
    border: 1px dashed #ccc;
    border-radius: 0;
  }
</style>
