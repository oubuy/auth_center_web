<template>
  <div>
    <div v-show="showPage">
      <div class="top_box">
        <div class="border_bottom" style="display: flex;padding: 0.2rem .4rem 0.2rem 0;">
          <div style="width: 2.5rem;text-align: left;"><span style="color: red;">*</span> <span>空间类型</span></div>
          <div @click="showSpaceBox"><input type="text" :value="spaceVal" style="border: none;outline: none;background: #fff;"
              placeholder="请选择空间类型" readonly="readonly"></div>
          <van-popup v-model="showSpacePicker" round position="bottom">
            <van-picker title="空间类型" show-toolbar :columns="columns" @confirm="onSpaceConfirm" @cancel="onSpaceCancel" />
          </van-popup>
        </div>
        <div class="border_bottom" style="display: flex;padding: 0.5rem 1rem 0.5rem 0;">
          <div style="width: 2.5rem;text-align: left;"><span style="color: red;">*</span> <span>图片</span></div>
          <div>
            <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" @delete="deleteUploadImg" :disabled="readonly" :deletable="!readonly"/>
            <div style="color: red;">请上传1M以上JPG格式的图片。</div>
          </div>
        </div>
      </div>
      <div class="product_box">
        <div style="margin: 0 .8rem;">
          <van-divider :style="{fontSize: '.36rem'}">产品</van-divider>
        </div>
        <div class="select_box">
          <div style="display:flex;height: 1rem;background: #f1f1f1;align-items: center;" v-if="!readonly">
            <van-search v-model="value" placeholder="请输入产品名称或产品编码查询" @input="onSearch" @blur="onBlur" @focus="onFocus"
              style="height: .7rem;padding: 0;width: 100%;margin: 0 .8rem;" />
          </div>
          <div class="select_list" v-if="showList">
            <div class="product_item" v-for="(item,index) in products" @click="chooseProduct(index)" :key="index">
              <van-image width="2.5rem" height="2.5rem" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,w_200,h_200/quality,q_70'" />
              <div style="margin-left: .5rem;">
                <div style="margin-bottom: .8rem;">{{item.modityName}}</div>
                <div style="margin-top: .8rem;">{{item.officialModel}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="selected_product" v-if="selectedList.length">
          <div class="selected_product_item" v-for="(item,index) in selectedList">
            <van-image width="2.5rem" height="2.5rem" fit="contain" :src="item.imageUrl+'?x-oss-process=image/resize,w_200,h_200/quality,q_70'" />
            <div style="margin-left: .5rem;text-align: left;">
              <div>{{item.modityName}}</div>
              <div style="margin: .4rem 0;">{{item.officialModel}}</div>
              <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.moditySize||item.skuModitySize}}</div>
            </div>
            <div class="icon_box" @click="deleteProduct(index)" v-if="!readonly">
              <van-icon class="iconfont" class-prefix='icon' name='ashbin' size=".7rem" />
            </div>
          </div>
          <div class="mask_box" v-if="showList" @click="showList=false"></div>
        </div>
      </div>
      <div class="button_box" v-if="!readonly">
        <van-button type="info" style="width:3.5rem;height: 1rem;font-size: .36rem;margin: 0;margin-right: .8rem;"
          @click="save">保存</van-button>
        <van-button type="default" style="width:3.5rem;height: 1rem;font-size: .36rem;"
          @click="cancel">取消</van-button>
      </div>
    </div>
    <v-loading :showPage="showPage" :saveFlag="saveFlag"></v-loading>
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
        programmeId: this.$route.query.id||localStorage.getItem("id"),
        spaceId: this.$route.query.spaceId,
        value: '',
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
      this.readonly = this.$route.query.readonly ||localStorage.getItem("readonly");
      this.readonly = JSON.parse(this.readonly);
      if(!this.spaceId) this.showPage = true;
      this.getListSpace();
      this.sceneSpaceDetail();
    },
    mounted() {
      // document.styleSheets[0].addRule('body::-webkit-scrollbar', 'width:0px');
      if(!this.readonly) {
        document.getElementsByClassName("van-field__value")[0].style.height = '100%';
        document.getElementsByClassName("van-field__body")[0].style.height = '100%';
        document.getElementsByClassName("van-field__control")[0].style.height = '100%';
        document.getElementsByClassName("van-cell")[0].style.fontSize = '0.36rem';
        document.getElementsByClassName("van-cell")[0].style.padding = '0';
        document.getElementsByClassName("van-cell")[0].style.background = '#fff';
        document.getElementsByClassName("van-field__left-icon")[0].style.display = "flex";
        document.getElementsByClassName("van-field__left-icon")[0].style.alignItems = "center";
      }
    },
    methods: {
      sceneSpaceDetail() {
        if(!this.spaceId) return;
        sceneSpaceDetail(this.spaceId).then(res=>{
          this.showPage = true;
          if(res.data.code==200) {
            let data = res.data.data.sceneSpace;
            this.spaceVal = data.spaceTypeName;
            this.spaceTypeId = data.spaceTypeId;
            this.spaceImgList = res.data.data.imageList;
            this.selectedList = res.data.data.productList;
            for(let i=0;i<this.spaceImgList.length;i++) {
              let obj = {
                url: this.spaceImgList[i].imageUrl+'?x-oss-process=image/resize,w_200,h_200/quality,q_70'
              };
              this.fileList.push(obj);
            }
            console.log(this.fileList)
          }
        }).catch(e=>{
          this.showPage = true;
        })
      },
      getListSpace() {
        getListSpaceTyle().then(res => {
          if (res.data.code == 200 && res.data.msg == "Success") {
            this.spaceList = res.data.data;
            for (let i = 0; i < this.spaceList.length; i++) {
              this.columns.push(this.spaceList[i].spaceTypeName);
            }
          }
        });
      },
      showSpaceBox() {
        if(this.readonly) return;
        this.showSpacePicker=true;
      },
      onSpaceConfirm(spaceItem) {
        this.spaceVal = spaceItem;
        this.showSpacePicker = false;
        for(let i=0;i<this.spaceList.length;i++) {
          if(spaceItem==this.spaceList[i].spaceTypeName) {
            this.spaceTypeId = this.spaceList[i].spaceTypeId;
          }
        }
      },
      onSpaceCancel() {
        this.showSpacePicker = false;
      },
      beforeRead(file) {
        let size = file.size;
        let minSize = size/1024;
        if (/\.(ogm|mpeg|asx|mpg|ogv|webm|mov|mp4|m4v)$/.test(file.name)) {
          this.$toast('不能上传视频');
          return false;
        }
        if (!/\.(jpg)$/.test(file.name)) {
          this.$toast('请上传jpg格式的图片');
          return false;
        }
        if(minSize<1024) {
          this.$toast('您上传的图片质量过小（建议在1M以上）,请重新上传');
          return;
        }
        if(this.fileList.length==1) {
          this.$toast('每次只能上传一张图片');
          return;
        }
        return true;
      },
      afterRead(file) {
        file.status = 'uploading';
        file.message = '上传中...';
        let formData = new FormData();
        formData.append('file',file.file);
        uploadImage(formData).then(res=>{
          if(res.data.code==200) {
            let obj = res.data.data;
            obj.imageUrl = obj.imageUrl+'?x-oss-process=image/resize,w_200,h_200/quality,q_70';
            this.spaceImgList.push(obj);
            file.status = 'done';
            file.message = '';
          }else {
            file.status = 'failed';
            file.message = '上传失败';
          }
        }).catch(err=>{
          {
            file.status = 'failed';
            file.message = '上传失败';
          }
        })
      },
      deleteUploadImg(file,obj) {
        if(this.readonly) return;
        this.spaceImgList.splice(obj.index,1);
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
        findProducts(obj).then(res=>{
          if(res.data.code == 200) {
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
        this.showList = false;
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
      save() {
        this.saveFlag = true;
        let param = {};
        param.programmeId = this.programmeId;
        param.spaceTypeId = this.spaceTypeId;
        param.id = this.spaceId?this.spaceId:"",
        param.imageList = [];
        param.productList = [];
        for(let i=0;i<this.spaceImgList.length;i++) {
          let obj = {};
          obj.imageUrl = this.spaceImgList[i].imageUrl;
          if(obj.imageUrl.indexOf("?")!=-1)
            obj.imageUrl = obj.imageUrl.substring(0,obj.imageUrl.indexOf("?"))
          param.imageList.push(obj);
        }
        for(let i=0;i<this.selectedList.length;i++) {
          let obj = {};
          obj.productId = this.selectedList[i].skuModityId||this.selectedList[i].productId;
          param.productList.push(obj);
        }
        if(!param.id) delete param.id;
        if(!param.productList.length) {
          this.$toast("请选择与空间搭配的瓷砖产品");
          this.saveFlag = false;
          return;
        }
        if(!param.programmeId) {
          this.$toast("实景案例id缺失");
          this.saveFlag = false;
          return;
        }
        if(!param.spaceTypeId) {
          this.$toast("请选择空间类型");
          this.saveFlag = false;
          return;
        }
        if(!param.imageList.length) {
          this.$toast("请上传实景案例空间图片");
          this.saveFlag = false;
          return;
        }
        sceneSpaceSave(param).then(res=>{
          this.saveFlag = false;
          this.$toast(res.data.msg);
          if(res.data.code==200) {
            this.$router.push({
              path: '/uploadImgDetail',
              query: {
                id: this.programmeId
              }
            });
          }
        }).catch(e=>{
          this.saveFlag = false;
        })
        //
      },
      cancel() {
        this.$router.back(-1);
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
    margin-top: 1.6rem;
    margin-bottom: 1rem;
    /* margin-right: .4rem; */
  }

  .van-cell {
    /* font-size: .8rem !important;
    line-height: 1.64rem !important;
    padding: 0 .5rem;
    background: #fff; */
  }

  .van-search__content {
    height: 100%;
    background: none !important;
    /* padding: 0 .8rem; */
  }

  .select_box {
    position: relative;
    margin: 0 auto;
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
  }

  .product_item {
    display: flex;
    align-items: center;
    margin-left: .4rem;
    border-bottom: 1px solid #f1f1f1;
    padding: .3rem 0;
    font-size: .36rem;
  }

  .selected_product {
    position: relative;
  }

  .selected_product_item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: .5rem 0;
    margin: 0 0 0 .4rem;
    border-bottom: 1px solid #ebedf0;
    font-size: .36rem;
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
  }

  .border_bottom {
    border-bottom: 1px solid #ebedf0;
  }
</style>
