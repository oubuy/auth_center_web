<template>
  <div>

    <div :style="{display: 'flex',margin: '0 150px 30px 0','justify-content': disabledFlag?'space-between':'center',
    'align-items':'center',background: '#f8f8f9',border:'1px solid #ccc',height:'800px'}">
      <div class="components_button" style="width: 330px;height: 798px;background: #fff;box-shadow: 2px 0 5px #ccc;"
        v-show="disabledFlag">
        <div style="width: 100%;height: 50px;line-height: 50px;background: #f8f8f8;font-size: 18px;">组件库</div>
        <div style="display: flex;flex-wrap: wrap;align-content:flex-start;width: 100%;">
          <div class="button" @click="addContentZone">
            <div><img src="../assets/tinymcePic/li10.png"></div>
            <div>富文本</div>
          </div>
          <div class="button" @click="addSwiperZone">
            <div><img src="../assets/tinymcePic/li4.png"></div>
            <div>轮播图</div>
          </div>
          <div class="button" @click="addBlank">
            <div><img src="../assets/tinymcePic/li15.png"></div>
            <div>辅助空白</div>
          </div>
          <div class="button" @click="showMulPic">
            <div><img src="../assets/tinymcePic/fimg.png"></div>
            <div>多图片</div>
          </div>
        </div>
      </div>

      <div class="phone_content">
        <div style="width: 340px;height:636px;box-shadow: 0 0 10px #999;position: relative;border-radius: 30px;">

          <div style="position: relative;top: 30px;z-index: 2;margin: 0 auto;width: 320px;height: 64px;">
            <img src="../assets/titlebar.png" style="position: absolute;top: 0;left: 0;">
            <span style="position: absolute;top: 32px;left: 129px;color: #fff;font-size: 14px;">页面标题</span>
          </div>

          <div class="content_box">
            <draggable v-model="domList" @end="domHandleEnd" v-bind="dragOptionsTwo">
              <div :class="activeIndex==index?'actived zone':'zone'" :id="isShowIndex==index?'hoverActived': ''" v-for="(item,index) in domList"
                @mouseover="isShowIndex=index" @mouseleave="isShowIndex=-1" :key="index" @click.stop="editContent(index,$event)">
                <!-- 富文本 -->
                <div v-if="item.isContent">
                  <div style="font-size: 20px;" v-show="!item.content">编辑富文本内容</div>
                  <div style="word-wrap:break-word;word-break:normal; " v-html="item.content" v-show="item.content"></div>
                </div>
                <!-- 辅助空白 -->
                <div class="blank_zone" :style="{height: item.blankHeight+'px'}" v-if="item.isBlank"></div>
                <!-- 多图片 -->
                <div class="multpic_zone" v-if="item.isPic" style="width: 100%;">
                  <img src="../assets/tinymcePic/placehold.jpg" v-if="item.list.length==0" style="width: 100%;display: block;">
                  <img v-for="(citem,cindex) in item.list" :key="cindex" :src="citem" style="width: 100%;display: block;"
                    v-else>
                </div>
                <!-- 轮播图 -->
                <div class="swiper_zone" v-if="item.isSwiper">
                  <div class="default_pic" v-if="!item.list.length"><img src="../assets/tinymcePic/empty.jpg" style="width: 100%;display: block;"></div>
                  <swiper :options="swiperOption" ref="mySwiper" v-else>
                    <!-- slides -->
                    <swiper-slide v-for="(sItem,sIndex) in item.list" :key="sIndex">
                      <img :src="sItem" style="width: 100%;display: block;">
                    </swiper-slide>
                    <!-- Optional controls -->
                    <div class="swiper-pagination" slot="pagination"></div>
                  </swiper>
                </div>
                <div class="button_zone" v-if="isShowIndex===index&&disabledFlag">
                  <div class="edit_button">编辑</div>
                  <div class="delete_button" @click.stop="deleteItem(index)">删除</div>
                </div>
                <div class="mask" v-if="(activeIndex===index||isShowIndex===index)&&!disabledFlag" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background: rgba(0,0,0,.3);z-index: 99;"></div>
              </div>
            </draggable>
          </div>

          <img src="../assets/call.png" style="position: absolute;left: -2px;top: 0;">
        </div>
        <div>
          <Button style="margin-top: 20px;" @click="moduleSort" v-if="disabledFlag">模块排序</Button>
          <Button style="margin-top: 20px;margin-right: 20px;" type="primary" @click="saveSort" v-if="!disabledFlag">保存</Button>
          <Button style="margin-top: 20px;" @click="cancelSort" v-if="!disabledFlag">取消</Button>
        </div>
      </div>

      <div class="tinymce-editor" style="position: relative;" v-show="disabledFlag">
        <div class="title" style="width: 100%;color: #333;">
          <div>{{templateTitle}}</div>
        </div>
        <!-- 富文本组件 -->
        <div class="template_content" style="width: 350px;margin: 0 auto;" v-show="showRichText">
          <div>
            <!-- @input="inputValue" -->
            <editor v-model="myValue" :init="init" :disabled="disabled" id="tinymceId" @input="inputValue">
            </editor>
          </div>
        </div>
        <!-- 辅助空白组件 -->
        <div class="blank_template" v-if="showBlankTemplate">
          <div style="display: flex;align-items: center;justify-content: center;">
            <span>空白高度：</span>
            <div style="width: 350px;margin-left: 10px;">
              <Slider v-model="value1" :max="maxNum" @on-input="onChange"></Slider>
            </div>
          </div>
        </div>
        <!-- 多图片上传 -->
        <div class="multiple_pic_template" v-if="showMultPic">
          <div style="display: flex;align-items: center;">
            <span style="margin: 0 20px;">上传图片：</span>
            <upload-img ref="uploadAttachmentOne" prop="mulpPicList" :quantity="10" @return-img="getChapterImg" style="display: inline-block;"></upload-img>
          </div>
          <div class="upload_pic_list" style="display: flex;flex-wrap: wrap;">
            <draggable v-model="uploadList" @end="handleEnd" v-bind="dragOptions">
              <div class="upload_item" v-for="(item,index) in uploadList" :key="index">
                <img :src="item" style="width: 100%;">
                <!-- <div class="reupload">重新上传</div> -->
                <Icon type="ios-close" @click="deleteUploadPic(index)" style="font-size: 20px;border: 1px solid #ccc;border-radius: 50%;position: absolute;top: -12px;right: -12px;cursor: pointer;"></Icon>
              </div>
            </draggable>
          </div>
          <div style="margin-left: 20px;text-align: left;" v-if="uploadList.length">提示：拖动图片可进行排序</div>
        </div>
      </div>
    </div>
    <div class="button_box" style="margin-bottom: 30px;" v-show="disabledFlag">
      <Button type="primary" @click="saveContent" style="margin-right: 20px;">保存</Button>
      <Button @click="cancelContent">取消</Button>
    </div>
  </div>

</template>

<script>
  import 'swiper/css/swiper.css'
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'
  import {
    uploadImgs
  } from "@/api/dealerModity.js";
  import draggable from 'vuedraggable'
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import uploadImg from "@/views/admin/course/chapter_img";
  import 'tinymce/themes/silver'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/wordcount'

  export default {
    components: {
      Editor,
      uploadImg,
      draggable
    },
    props: {
      //传入一个value，使组件支持v-model绑定
      value: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'image',
      },
      toolbar: {
        type: [String, Array],
        default: 'code undo redo forecolor backcolor bold italic underline strikethrough alignleft aligncenter alignright alignjustify outdent indent image fontselect fontsizeselect'
      },
      richtextData: {
        type: Object,
        default: {}
      }
    },

    data() {
      return {
        // 初始化配置
        init: {
          skin_url: '/static/tinymce/skins/ui/oxide',
          language_url: '/static/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          width: 350,
          height: 600,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
          font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
          //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
          images_upload_handler: (blobInfo, success, failure) => {
            // const img = 'data:image/jpeg;base64,' + blobInfo.base64();
            // success(img)
            const formData = new FormData();
            formData.append('file', blobInfo.blob());
            uploadImgs(formData).then(res => {
              if (res.data.code == 200) {
                let file = res.data.data;
                success(file);
                return
              }
              failure('上传失败')
            }).catch(() => {
              failure('上传出错')
            })
          },
          // setup: (editor) =>{
          //   let _this = this;
          //   editor.on('keyup',function(e){
          //     _this.inputValue(e.target.innerHTML);
          //   })
          // }
        },
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          //循环
          loop: true
        },
        myValue: this.value,
        tinyContent: "", // 富文本内容
        activeIndex: -1,
        isShowIndex: -1,
        isShowButton: false,
        allContent: '',
        templateTitle: '富文本组件',
        value1: 30,
        maxNum: 200,
        showRichText: true,
        showBlankTemplate: false,
        showMultPic: false,
        disabledFlag: true,
        uploadList: [],
        domList: [],
        // originalList: [],
        orignalDomList: [],
        originalObj: {}
      }
    },
    created() {},
    mounted() {
      tinymce.init({}); // 初始化富文本
      // this.initDomList();
    },
    computed: {
      dragOptions() {
        return {
          animation: 100,
          group: "description",
          ghostClass: "ghost",
          filter: ".no-drag"
        };
      },
      dragOptionsTwo() {
        return {
          animation: 100,
          ghostClass: "ghost",
          filter: ".no-drag",
          disabled: this.disabledFlag
        };
      }
    },
    methods: {
      initDomList() {
        this.domList = [];
        this.uploadList = [];
        tinymce.activeEditor.setContent("");
        if (this.richtextData.items) {
          if (!this.richtextData.items.length) return;
          for (let i = 0; i < this.richtextData.items.length; i++) {
            let item = this.richtextData.items[i];
            if (item.type == 'richText') {
              item.isContent = true;
            } else if (item.type == 'swiperPics') {
              item.isSwiper = true;
              item.uploadList = [];
            } else if (item.type == 'blank') {
              item.isBlank = true;
            } else if (item.type == 'pictures') {
              item.isPic = true;
              item.uploadList = [];
            }
            this.domList.push(item);
          }
          this.originalObj = JSON.parse(JSON.stringify(this.richtextData));
          this.activeIndex = this.domList.length - 1;
          let type = this.domList[this.activeIndex].type;
          if (type == "richText") {
            tinymce.activeEditor.setContent(this.domList[this.activeIndex].content);
            this.showBlankTemplate = false;
            this.showMultPic = false;
            this.showRichText = true;
          } else if (type == "blank") {
            this.showMultPic = false;
            this.showRichText = false;
            this.showBlankTemplate = true;
          } else if (type == "swiperPics" || type == "pictures") {
            this.uploadList = this.domList[this.activeIndex].list;
            this.showBlankTemplate = false;
            this.showRichText = false;
            this.showMultPic = true;
          }
          this.editContent(this.activeIndex)
        }
      },
      domHandleEnd(e) { // 拖动模块
        this.activeIndex = e.newIndex;
      },
      handleEnd() { // 拖动图片列表
        this.domList[this.activeIndex].list = [];
        for (let i = 0; i < this.uploadList.length; i++) {
          this.domList[this.activeIndex].list.push(this.uploadList[i]);
        }
      },
      moduleSort() { // 点击排序按钮
        this.disabledFlag = false;
        this.orignalDomList = []
        for (let i = 0; i < this.domList.length; i++) {
          this.orignalDomList.push(this.domList[i]);
        }
      },
      saveSort() { // 保存模块排序
        this.disabledFlag = true;
        let type = this.domList[this.activeIndex];
        if (type == "richText") {
          this.showBlankTemplate = false;
          this.showMultPic = false;
          this.showRichText = true;
        } else if (type == "blank") {
          this.showMultPic = false;
          this.showRichText = false;
          this.showBlankTemplate = true;
        } else if (type == "swiperPics" || type == "pictures") {
          this.uploadList = this.domList[this.activeIndex].list;
          this.showBlankTemplate = false;
          this.showRichText = false;
          this.showMultPic = true;
        }
      },
      cancelSort() { // 取消模块排序
        this.disabledFlag = true;
        this.domList = [];
        for (let i = 0; i < this.orignalDomList.length; i++) {
          this.domList.push(this.orignalDomList[i]);
        }
      },
      inputValue(e) { // 富文本输入事件
        if (!this.domList.length) {
          this.myValue = '';
          tinymce.activeEditor.setContent("");
          return;
        }
        if (this.domList[this.activeIndex].isBlank) {
          tinymce.activeEditor.setContent("");
          return;
        }
        let tinyContent = e;
        if (tinyContent.indexOf('<img') != -1) {
          const regex = new RegExp('<img', 'gi')
          tinyContent = tinyContent.replace(regex, `<img style="max-width: 100%;"`);
        }
        this.domList[this.activeIndex].content = tinyContent;
        if (this.domList[this.activeIndex].isContent) {
          var bm = tinymce.activeEditor.selection.getBookmark(2);
          this.domList[this.activeIndex].bm = bm;
        }
      },
      addContentZone() { //添加富文本区域
        let obj = {
          content: '',
          bm: '',
          isContent: true,
          type: 'richText'
        }
        this.domList.push(obj);
        this.activeIndex = this.domList.length - 1;
        this.templateTitle = "富文本组件";
        this.showBlankTemplate = false;
        this.showMultPic = false;
        this.showRichText = true;
        tinymce.editors[0].editorManager.get('tinymceId').focus();
        tinymce.activeEditor.setContent("");
      },
      addSwiperZone() { // 添加轮播图
        let obj = {
          isSwiper: true,
          list: [],
          uploadList: [],
          type: 'swiperPics'
        }
        this.domList.push(obj);
        this.activeIndex = this.domList.length - 1;
        this.uploadList = [];
        this.templateTitle = "轮播图组件";
        this.showBlankTemplate = false;
        this.showRichText = false;
        this.showMultPic = true;
        tinymce.activeEditor.setContent("");
        this.$nextTick(() => {
          this.$refs.uploadAttachmentOne.handleReset();
        })
      },
      addBlank() { // 添加辅助空白
        tinymce.activeEditor.setContent("");
        let obj = {
          isBlank: true,
          blankHeight: 30,
          type: 'blank',
          blankContent: ''
        };
        this.domList.push(obj);
        this.activeIndex = this.domList.length - 1;
        this.templateTitle = "辅助空白组件";
        this.showRichText = false;
        this.showMultPic = false;
        this.showBlankTemplate = true;
        this.value1 = 30;
      },
      showMulPic() { // 添加多图片
        let obj = {
          isPic: true,
          list: [],
          uploadList: [],
          type: 'pictures'
        }
        this.domList.push(obj);
        this.activeIndex = this.domList.length - 1;
        this.uploadList = [];
        this.templateTitle = '多图片上传组件';
        this.showBlankTemplate = false;
        this.showRichText = false;
        this.showMultPic = true;
        tinymce.activeEditor.setContent("");
      },
      editContent(i, e) { //编辑富文本
        this.activeIndex = i;
        if (this.domList[i].isBlank) {
          this.templateTitle = "辅助空白组件";
          this.showMultPic = false;
          this.showRichText = false;
          this.showBlankTemplate = true;
          tinymce.activeEditor.setContent("");
          tinymce.activeEditor.getBody().setAttribute('contenteditable', false);
          this.value1 = this.domList[i].blankHeight;
          return;
        } else if (this.domList[i].isPic) {
          this.templateTitle = '多图片上传组件';
          this.showBlankTemplate = false;
          this.showRichText = false;
          this.showMultPic = true;
          this.uploadList = [];
          for (let j = 0; j < this.domList[i].list.length; j++) {
            this.uploadList.push(this.domList[i].list[j]);
          }
          return;
        } else if (this.domList[i].isContent) {
          this.templateTitle = "富文本组件";
          this.showMultPic = false;
          this.showBlankTemplate = false;
          this.showRichText = true;
        } else if (this.domList[i].isSwiper) {
          this.templateTitle = "轮播图组件";
          this.showBlankTemplate = false;
          this.showRichText = false;
          this.showMultPic = true;
          this.uploadList = [];
          for (let j = 0; j < this.domList[i].list.length; j++) {
            this.uploadList.push(this.domList[i].list[j]);
          }
          return;
        }
        tinymce.activeEditor.getBody().setAttribute('contenteditable', true);
        let _self = this;
        tinymce.editors[0].editorManager.get('tinymceId').focus();
        if (_self.domList[i].content) {
          tinymce.activeEditor.setContent(_self.domList[i].content);
        } else {
          tinymce.activeEditor.setContent("");
        }
        tinymce.activeEditor.selection.moveToBookmark(_self.domList[i].bm);
      },
      deleteItem(i) { // 删除富文本区域
        this.isShowIndex = -1;
        this.uploadList = [];
        tinymce.activeEditor.setContent("");
        this.domList.splice(i, 1);
        if (i < this.activeIndex) {
          this.activeIndex--;
        }
        if (i == this.domList.length) {
          this.activeIndex = this.domList.length - 1;
        }
        if (this.domList.length == 1) {
          this.activeIndex = 0;
        } else if (!this.domList.length) {
          this.activeIndex = -1;
          tinymce.activeEditor.setContent("");
          this.showMultPic = false;
          this.showBlankTemplate = false;
          this.showRichText = true;
          return;
        }
        if (this.domList[this.activeIndex].isContent) {
          tinymce.activeEditor.setContent(this.domList[this.activeIndex].content);
          this.showMultPic = false;
          this.showBlankTemplate = false;
          this.showRichText = true;
        } else if (this.domList[this.activeIndex].isPic) {
          for (let i = 0; i < this.domList[this.activeIndex].list.length; i++) {
            this.uploadList.push(this.domList[this.activeIndex].list[i]);
          }
          this.showBlankTemplate = false;
          this.showRichText = false;
          this.showMultPic = true;
        } else if (this.domList[this.activeIndex].isSwiper) {
          for (let i = 0; i < this.domList[this.activeIndex].list.length; i++) {
            this.uploadList.push(this.domList[this.activeIndex].list[i]);
          }
          this.showBlankTemplate = false;
          this.showRichText = false;
          this.showMultPic = true;
        } else if (this.domList[this.activeIndex].isBlank) {
          this.showRichText = false;
          this.showMultPic = false;
          this.showBlankTemplate = true;
        }
      },
      deleteUploadPic(i) { // 删除图片上传列表
        this.uploadList.splice(i, 1);
        this.domList[this.activeIndex].list.splice(i, 1);
      },
      showButton(e) { // 显示按钮
        this.isShowButton = true;
      },
      hideButton() { // 隐藏按钮
        this.isShowButton = false;
      },
      onChange(val) { // 滑动辅助空白滑块
        this.domList[this.activeIndex].blankHeight = val;
      },
      getChapterImg(val) { // 获取上传图片
        if (!this.domList.length) return;
        console.log(val.url)
        this.domList[this.activeIndex].uploadList.push(val.url);
        if (this.domList[this.activeIndex].uploadList.length == val.list.length) {
          for (let i = 0; i < val.list.length; i++) {
            this.domList[this.activeIndex].list.push(val.list[i].url);
            this.uploadList.push(val.list[i].url);
          }
          this.domList[this.activeIndex].uploadList = [];
          this.$refs.uploadAttachmentOne.handleReset();
        }
      },
      saveContent() { // 保存
        let flag = true;
        this.isShowIndex = -1;
        // this.allContent = document.getElementsByClassName('content_box')[0].innerHTML;
        let data = {
          items: []
        }
        for (let i = 0; i < this.domList.length; i++) {
          if (this.domList[i].isContent) {
            if (!this.domList[i].content) {
              flag = false;
              break;
            }
          }
          if (this.domList[i].isPic) {
            if (!this.domList[i].list.length) {
              flag = false;
              break;
            }
          }
          if (this.domList[i].isSwiper) {
            if (!this.domList[i].list.length) {
              flag = false;
              break;
            }
          }
          let content = document.getElementsByClassName('zone')[i].innerHTML;
          if (this.domList[i].type == 'richText') {
            data.items.push({
              type: 'richText',
              content: this.domList[i].content
            })
          } else if (this.domList[i].type == 'swiperPics') {
            data.items.push({
              type: 'swiperPics',
              list: this.domList[i].list,
              content: content
            })
          } else if (this.domList[i].type == 'pictures') {
            data.items.push({
              type: 'pictures',
              list: this.domList[i].list,
              content: content
            })
          } else if (this.domList[i].type == 'blank') {
            data.items.push({
              type: 'blank',
              content: content,
              blankHeight: this.domList[i].blankHeight
            })
          }
        }
        if (!flag) {
          alert("您还有未编辑的模块，请编辑或删除后保存");
          return;
        }
        let obj = {
          isEditing: false,
          content: this.allContent,
          list: this.domList,
          data: data
        }
        this.$emit("saveContent", obj);
      },
      cancelContent() { // 取消
        let obj = {
          isEditing: false,
          data: this.originalObj
        }
        this.$emit("cancelContent", obj);
      }
    },
    watch: {

    }
  }
</script>

<style lang="less" scoped>
  .phone_content {
    // height: 636px;

    .zone {
      position: relative;
      width: 320px;
      cursor: move;
      margin: 0 auto;
      margin-top: 2px;
    }

    .actived {
      outline: rgb(249, 97, 50) dashed 2px;
    }

    .button_zone {
      display: flex;
      font-size: 12px;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      z-index: 100;

      div {
        padding: 0 2px;
        background: #3f3f3f;
        color: #fff;
      }
    }

    .edit_button {
      margin-right: 2px;
    }

    #hoverActived {
      position: relative;
      width: 320px;
      cursor: move;
      margin: 0 auto;
      margin-top: 2px;
      outline: rgb(249, 97, 50, .5) dashed 2px;
    }
  }

  .tinymce-editor {
    width: 450px;
    height: 798px;
    // border: 1px solid #ccc;
    background: #fff;
    box-shadow: -2px 0 5px #ccc;
  }



  .blank_template {
    width: 448px;
    height: 650px;
    background: #fff;
  }

  .content_box {
    position: relative;
    top: 32px;
    z-index: 3;
    font-size: 14px;
    text-align: left;
    width: 324px;
    height: 524px;
    overflow: auto;
    margin: auto;
    padding-bottom: 20px;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .button {
    width: 33.3%;
    height: 100px;
    border: 1px solid #f2f2f2;
    cursor: pointer;
    padding-top: 20px;
  }

  .button:hover {
    background: #ccc;
  }

  .title {
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    background: #f8f8f8;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 20px;
  }

  .upload_pic_list>div {
    display: flex;
    flex-wrap: wrap;
  }

  .upload_pic_list {
    margin-left: 20px;
    margin-top: 20px;

    .upload_item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: move;

      img {
        height: 100%;

      }
    }

    .reupload {
      position: absolute;
      width: 100%;
      height: 30px;
      bottom: -1px;
      left: 0;
      color: #fff;
      background: rgba(0, 0, 0, .5);
      cursor: pointer;
      font-size: 12px;
    }
  }

  .ghost {
    opacity: 1;
  }
</style>
