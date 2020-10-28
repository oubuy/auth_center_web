<template>
  <div style="margin-top: 30px;">
    <div v-show="showPage">
      <Form :label-width="100">
        <FormItem label="空间类型:" style="width:300px;">
          <Select v-model="spaceVal" @on-change="changeSpaceVal">
            <Option v-for="(item,index) in columns" :value="item.spaceTypeId" :key="index">{{ item.spaceTypeName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="图片:" style="width:300px;">
          <div style="margin-top: 10px;position: relative;">
            <div style="width: 80px;height: 80px;position: relative;cursor: pointer;" v-for="(item,index) in spaceImgList" @click="previewImg(item.imageUrl)">
              <img :src="item.imageUrl" style="width: 100%;height:100%;display: block;">
              <div style="position: absolute;top: -9px;right: -9px;width: 18px;height: 18px;cursor: pointer;" @click.stop="deleteSpaceImg(index)"><van-icon name="clear" size="18" /></div>
            </div>
            <div v-if="uploadDone" style="width: 80px;height: 80px;position: relative;">
              <div style="position: absolute;width: 24px;height: 24px;top: 50%;left: 50%;margin-top: -12px;margin-left: -12px;"><van-loading color="#1989fa" /></div>
            </div>
            <van-uploader :max-count="1" :preview-full-image="false" :preview-image="false" v-model="fileList" :before-read="beforeRead" :after-read="afterRead" @delete="deleteUploadImg"
              :disabled="readonly" :deletable="!readonly" />
            <div style="color: red;" v-if="!spaceImgList.length">请上传1M以上JPG格式的图片。</div>
          </div>
        </FormItem>
        <div class="product_box">
          <FormItem label="产品:" style="width:300px;">
            <div class="select_box">
              <div style="width: 400px;" v-if="!readonly">
                <Input v-model="value" placeholder="请输入产品名称或产品编码查询" @input="onSearch" @blur="onBlur" @focus="onFocus"></Input>
              </div>
              <div class="select_list" v-show="showList">
                <div class="product_item" v-for="(item,index) in products" @click.stop="chooseProduct(index)" :key="index">
                  <van-image width="1rem" height="1rem" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,w_200,h_200/quality,q_70'" />
                  <div style="margin-left: .5rem;">
                    <div style="margin-bottom: .3rem;">{{item.modityName}}</div>
                    <div style="margin-top: .3rem;">{{item.officialModel}}</div>
                  </div>
                </div>
              </div>
            </div>
          </FormItem>
          <div class="selected_product" v-if="selectedList.length">
            <div class="selected_product_item" v-for="(item,index) in selectedList">
              <van-image width="1.5rem" height="1.5rem" style="" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,w_200,h_200/quality,q_70'" />
              <div style="margin-left: .2rem;text-align: left;">
                <div>{{item.modityName}}</div>
                <div style="margin: .2rem 0;">{{item.officialModel}}</div>
                <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.moditySize||item.skuModitySize}}</div>
              </div>
              <div class="icon_box" @click="deleteProduct(index)" v-if="!readonly">
                <van-icon class="iconfont" class-prefix='icon' name='ashbin' size="18" />
              </div>
            </div>
          </div>
        </div>
      </Form>
      <div class="button_box" v-if="!readonly">
        <Button type="primary" size="large" @click.prevent="save" style="margin-right: 20px;">保存</Button>
        <Button size="large" @click.prevent="cancel">返回</Button>
      </div>
    </div>
    <div style="position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,.8);top: 0;left: 0;z-index: 2000;" v-show="previewFlag">
      <div style="display: flex;width: 100%;height: 100%;justify-content: center;align-items: center;" @click="closePreview"><img :src="previewUrl" style="width: 80%;" @click.stop></div>
    </div>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  import {
    getListSpaceTyle,
    uploadImage,
    findProducts,
    sceneSpaceSave,
    sceneSpaceDetail
  } from "@/api/uploadImg.js";
  export default {
    data() {
      return {
        showPage: false,
        saveFlag: false,
        previewFlag: false,
        uploadDone: false,
        programmeId: this.$route.query.id || localStorage.getItem("id"),
        spaceId: this.$route.query.spaceId,
        value: '',
        previewUrl: "",
        fileList: [],
        products: [],
        selectedList: [],
        showList: false,
        spaceVal: '',
        columns: [],
        spaceList: [],
        showSpacePicker: false,
        spaceTypeId: '',
        spaceImgList: [],
        readonly: false
      }
    },
    created() {
      this.readonly = this.$route.query.readonly || localStorage.getItem("readonly");
      this.readonly = JSON.parse(this.readonly);
      if (!this.spaceId) this.showPage = true;
      this.getListSpace();
      this.sceneSpaceDetail();
    },
    mounted() {
      let labelLength = document.getElementsByClassName("ivu-form-item-label").length;
      for(let i=0;i<labelLength;i++) {
        document.getElementsByClassName("ivu-form-item-label")[i].style.color = "red";
      }
    },
    methods: {
      sceneSpaceDetail() {
        if (!this.spaceId) return;
        sceneSpaceDetail(this.spaceId).then(res => {
          this.showPage = true;
          if (res.data.code == 200) {
            let data = res.data.data.sceneSpace;
            this.spaceVal = data.spaceTypeId;
            this.spaceTypeId = data.spaceTypeId;
            this.spaceImgList = res.data.data.imageList;
            this.selectedList = res.data.data.productList;
            for (let i = 0; i < this.spaceImgList.length; i++) {
              let obj = {
                url: this.spaceImgList[i].imageUrl + '?x-oss-process=image/resize,w_200,h_200/quality,q_70'
              };
              this.fileList.push(obj);
            }
            console.log(this.spaceImgList)
          }
        }).catch(e => {
          this.showPage = true;
        })
      },
      getListSpace() {
        getListSpaceTyle().then(res => {
          if (res.data.code == 200 && res.data.msg == "Success") {
            this.spaceList = res.data.data;
            for (let i = 0; i < this.spaceList.length; i++) {
              this.columns.push(this.spaceList[i]);
            }
          }
        });
      },
      changeSpaceVal(val) {
        this.spaceTypeId = val;
      },
      showSpaceBox() {
        if (this.readonly) return;
        this.showSpacePicker = true;
      },
      onSpaceConfirm(spaceItem) {
        this.spaceVal = spaceItem;
        this.showSpacePicker = false;
        for (let i = 0; i < this.spaceList.length; i++) {
          if (spaceItem == this.spaceList[i].spaceTypeName) {
            this.spaceTypeId = this.spaceList[i].spaceTypeId;
          }
        }
      },
      onSpaceCancel() {
        this.showSpacePicker = false;
      },
      beforeRead(file) {
        let size = file.size;
        let minSize = size / 1024;
        if (/\.(ogm|mpeg|asx|mpg|ogv|webm|mov|mp4|m4v)$/.test(file.name)) {
          this.$toast('不能上传视频');
          return false;
        }
        if (!/\.(jpg)$/.test(file.name)) {
          this.$toast('请上传jpg格式的图片');
          return false;
        }
        if (minSize < 1024) {
          this.$toast('您上传的图片质量过小（建议在1M以上）,请重新上传');
          return;
        }
        if (this.fileList.length == 1) {
          this.$toast('每次只能上传一张图片');
          return;
        }
        return true;
      },
      afterRead(file) {
        file.status = 'uploading';
        file.message = '上传中...';
        this.uploadDone = true;
        let formData = new FormData();
        formData.append('file', file.file);
        uploadImage(formData).then(res => {
          if (res.data.code == 200) {
            let obj = res.data.data;
            obj.imageUrl = obj.imageUrl + '?x-oss-process=image/resize,w_200,h_200/quality,q_70';
            this.spaceImgList.push(obj);
            file.status = 'done';
            file.message = '';
          } else {
            file.status = 'failed';
            file.message = '上传失败';
          }
          this.uploadDone = false;
        }).catch(err => {
          this.uploadDone = false;
          {
            file.status = 'failed';
            file.message = '上传失败';
          }
        })
      },
      deleteUploadImg(file, obj) {
        if (this.readonly) return;
        this.spaceImgList.splice(obj.index, 1);
      },
      onSearch(val) {
        this.products = [];
        if (!val) {
          this.showList = false;
          return;
        }
        let obj = {
          productName: val
        }
        findProducts(obj).then(res => {
          if (res.data.code == 200) {
            this.products = res.data.data;
            if (this.products.length) this.showList = true;
            else this.showList = false;
          }
        })

      },
      onFocus() {
        if (this.products.length) this.showList = true;
      },
      onBlur() {
        let _self = this;
        setTimeout(function() {
          _self.showList = false;
        }, 100)
      },
      chooseProduct(i) {
        this.value = '';
        this.showList = false;
        this.selectedList.push(this.products[i]);
        this.products = [];
      },
      deleteProduct(i) {
        this.$dialog.confirm({
            title: '删除产品',
            message: '确定删除该产品吗？',
          })
          .then(() => {
            // on confirm
            this.selectedList.splice(i, 1);
          })
          .catch(() => {
            // on cancel
          });

      },
      previewImg(url) {
        this.previewFlag = true;
        if(url.indexOf("?")!=-1) url = url.substring(0,url.indexOf("?"));
        this.previewUrl = url;
      },
      closePreview() {
        this.previewFlag = false;
        this.previewUrl = "";
      },
      deleteSpaceImg(i) {
        if (this.readonly) return;
        this.$dialog.confirm({
            title: '删除图片',
            message: '确定删除该图片吗？',
          })
          .then(() => {
            // on confirm
            this.spaceImgList.splice(i, 1);
            this.fileList.splice(i, 1);
          })
          .catch(() => {
            // on cancel
          });

      },
      save() {
        this.saveFlag = true;
        let param = {};
        param.programmeId = this.programmeId;
        param.spaceTypeId = this.spaceTypeId;
        param.id = this.spaceId ? this.spaceId : "",
        param.imageList = [];
        param.productList = [];
        for (let i = 0; i < this.spaceImgList.length; i++) {
          let obj = {};
          obj.imageUrl = this.spaceImgList[i].imageUrl;
          if (obj.imageUrl.indexOf("?") != -1)
            obj.imageUrl = obj.imageUrl.substring(0, obj.imageUrl.indexOf("?"))
          param.imageList.push(obj);
        }
        for (let i = 0; i < this.selectedList.length; i++) {
          let obj = {};
          obj.productId = this.selectedList[i].skuModityId || this.selectedList[i].productId;
          param.productList.push(obj);
        }
        if (!param.id) delete param.id;
        if (!param.productList.length) {
          this.$toast("请选择与空间搭配的瓷砖产品");
          this.saveFlag = false;
          return;
        }
        if (!param.programmeId) {
          this.$toast("实景案例id缺失");
          this.saveFlag = false;
          return;
        }
        if (!param.spaceTypeId) {
          this.$toast("请选择空间类型");
          this.saveFlag = false;
          return;
        }
        if (!param.imageList.length) {
          this.$toast("请上传实景案例空间图片");
          this.saveFlag = false;
          return;
        }
        sceneSpaceSave(param).then(res => {
          this.saveFlag = false;
          this.$toast(res.data.msg);
          if (res.data.code == 200) {
            this.$router.push({
              path: '/uploadImgDetailPc',
              query: {
                id: this.programmeId,
                comeFrom: this.$route.query.comeFrom
              }
            });
          }
        }).catch(e => {
          this.saveFlag = false;
        })
        //
      },
      cancel() {
        this.$router.push({
          path: '/uploadImgDetailPc',
          query: {
            id: this.programmeId,
            readonly: this.readonly,
            comeFrom: this.$route.query.comeFrom
          }
        });
      }
    },
    watch: {
      showList: function(newVal) {
        if (newVal) document.getElementsByTagName("body")[0].style.overflow = 'hidden';
        else document.getElementsByTagName("body")[0].style.overflow = 'auto';
      }
    }
  }
</script>

<style scoped>
  .top_box {
    margin: .2rem 0 .6rem .4rem;
    font-size: .36rem;
  }

  .button_box {
    text-align: left;
    margin: 1.6rem 0 1rem 100px;
  }

  .van-search__content {
    height: 100%;
    background: none !important;
    /* padding: 0 .8rem; */
  }

  .select_box {
    width: 400px;
    position: relative;
    /* margin: 0 .8rem; */
  }

  .mask_box {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 90;
    top: 0;
    background: rgba(0, 0, 0, .4);
  }

  .select_list {
    position: absolute;
    width: 100%;
    max-height: 7rem;
    text-align: left;
    overflow: auto;
    background: #fff;
    z-index: 100;
    border: 1px solid #f1f1f1;
  }

  .product_item {
    display: flex;
    align-items: center;
    margin-left: .4rem;
    border-bottom: 1px solid #f1f1f1;
    padding: .3rem 0;
    font-size: 14px;
    cursor: pointer;
  }

  .selected_product {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin-left: 56px;
  }

  .selected_product_item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: .2rem .4rem;
    margin: 24px 0 0 44px;
    border: 1px solid #ebedf0;
    font-size: 12px;
    /* width: 300px; */
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .icon_box {
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }

  .border_bottom {
    border-bottom: 1px solid #ebedf0;
  }
</style>
