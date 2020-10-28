<template>
  <div>
    <Form :model="formItem" :label-width="100">
      <FormItem label="商品名称:">
        {{shopObj.modityName}}
      </FormItem>
      <FormItem label="型号:">
        {{shopObj.officicalModel}}
      </FormItem>
      <div class="preview">
        <FormItem label="预览效果:"></FormItem>
        <div class="preview_box">
          <div style="position: relative;box-shadow: 0px 0px 8px 4px #f1f1f1;width: 100%;">
            <img :src="shopObj.imageUrl" style="max-width: 100%;max-height: 100%;display: block;position: absolute;top: 0;left: 0;bottom: 0;right: 0;margin: auto;">
            <img v-for="(item,index) in tagImgList" :src="item.imgUrl" ref="tagImage" @click="handleTagWidth(index)"
              :style="{width: item.percentage*300/100+'px',position: 'absolute',top: item.top>100?'':item.top+'%',
              left: item.left>100?'':item.left+'%',bottom: item.top>100?0:'',right: item.left>100?0:'',cursor:'pointer',border: currentIndex==index?'1px solid #2d8cf0':'none'}"
              draggable="true" v-drag="item">
          </div>
        </div>
        <div style="margin: 20px 0 0 100px;display: flex;align-items: center;">
          <span>缩小</span>
          <Slider :value.sync="widthValue" :step="1" @on-input="changeWidth" style="width: 238px;margin: 0 10px;" :max="100"
            :min="10" :disabled="currentIndex==-1"></Slider>
          <span>放大</span>
        </div>
      </div>

      <div style="color: red;text-align: left;margin: 20px 0 0 100px;display: flex;">
        <div>提示：</div>
        <div>
          <div>可通过拖动标签图片改变位置</div>
          <div>点击上方标签后，可通过拖动右边滑块对标签大小进行缩放</div>
        </div>
      </div>
      <div style="text-align: left;margin: 20px 0 20px 40px;"><Button type="primary" @click="chooseTag">选择标签</Button></div>
      <Table width="1000" border :columns="columns" :data="formData" style="margin-left: 30px;"></Table>
      <div class="button_box">
        <Button type="primary" style="margin-right: 20px;" @click="saveStoreModityTag">保存</Button>
        <Button @click="cancelSaveStoreModityTag">取消</Button>
      </div>
    </Form>
    <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    <Modal v-model="chooseTagFlag" title="选择标签" footer-hide scrollable width="800" :mask-closable="false">
      <div>
        <span>标签名称</span>
        <Input v-model="tagsName" placeholder="输入标签名称查询" style="width:200px;margin: 0 20px;" />
        <Button type="primary" @click="findTags">查询</Button>
      </div>
      <div>
        <Table width="770" border :columns="tagsColumns" :data="tagsFormData" style="margin-top: 30px;margin-bottom: 30px;"></Table>
        <div style="overflow: hidden;">
          <div style="float: right;">
            <Page :total="total" show-total :current="page" :page-size="size" @on-change="changePage"></Page>
          </div>
        </div>
        <div style="text-align: center;">
          <Button type="primary" style="margin-right: 20px;" @click="saveTagsChoose">保存</Button>
          <Button @click="cancelTagsChoose">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import aletTip from "@/components/alertTip.vue";
  import {
    findStoreModityTags,
    findTags,
    saveStoreModityTag
  } from "@/api/store.js"
  export default {
    data() {
      return {
        widthValue: 17,
        currentIndex: -1,
        storeModityId: this.$route.query.id,
        total: 0,
        page: 1,
        size: 10,
        chooseTagFlag: false,
        changeFlag: false,
        alertShow: false,
        rowIndex: -1,
        activedIndex: -1,
        parentIndex: -1,
        chooseList: [],
        shopObj: {},
        alertTipParams: {
          headTip: '删除确认',
          titleTip: '确认删除该条吗？'
        },
        tagsName: "",
        formItem: {},
        tagImgList: [],
        newTagImgList: [],
        columns: [{
            title: '名称',
            key: 'name',
            width: 100,
            align: "center",
            fixed: 'left'
          },
          {
            title: '样式',
            key: '',
            align: "center",
            render: (h, params) => {
              let _self = this;
              let arr = params.row.imgList;
              return h("div", {
                attrs: {
                  class: "tags_row"
                },
                style: {
                  textAlign: "left"
                },
              }, arr.map(function(item, index) {
                return h("img", {
                  attrs: {
                    src: item.url
                  },
                  style: {
                    display: item.disabled ? "none" : "inline-block",
                    // width: "60px",
                    height: "50px",
                    margin: "5px",
                    cursor: "pointer",
                    border: params.row.storeModityTagStyleId == item.id ? "2px solid #2d8cf0" : "none"
                  },
                  on: {
                    click: () => {
                      _self.chooseStyle(index, params.index);
                    }
                  }
                })
              }));
            }
          },
          {
            title: "操作",
            key: "",
            fixed: 'right',
            width: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.deleteRow(params.index)
                      }
                    }
                  },
                  "删除"
                )

              ]);
            }
          }
        ],
        formData: [],
        newFormData: [],
        tagsColumns: [{
            title: '标签名称',
            key: 'name',
            width: 100,
            align: "center",
          },
          {
            title: '描述',
            key: 'describe',
            align: "center",
            fixed: 'center',
            width: 518,
          },
          {
            title: "操作",
            key: "",
            width: 150,
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button", {
                    style: {
                      display: params.row.chooseDisplay
                    },
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.handleChoose(params.index);
                      }
                    }
                  },
                  "选择"
                ),
                h(
                  "Button", {
                    style: {
                      display: params.row.cancelDisplay
                    },
                    props: {
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.handleCancelChoose(params.index)
                      }
                    }
                  },
                  "取消选择"
                )

              ]);
            }
          }
        ],
        tagsFormData: []
      }
    },
    components: {
      aletTip
    },
    directives: {
      drag: {
        inserted: function(el, binding) {
          el.onmousedown = function(e) {
            e.stopPropagation();
            let disx = e.pageX - el.offsetLeft;
            let disy = e.pageY - el.offsetTop;
            document.onmousemove = function(e) {
              e.preventDefault();
              let parentWidth = el.parentNode.clientWidth;
              let parentHeight = el.parentNode.clientHeight;
              let overX = parentWidth - el.clientWidth;
              let overY = parentHeight - el.clientHeight;
              let leftPercent = "";
              let topPercent = "";
              let rightPercent = "";
              let bottomPercent = "";
              if (e.pageX - disx > overX) {
                // leftPercent = overX / parentWidth*100 + '%';
                leftPercent = '';
                rightPercent = 0;
              } else if (e.pageX - disx < 0) {
                leftPercent = '0%';
                rightPercent = "";
              } else {
                leftPercent = (e.pageX - disx) / parentWidth * 100 + '%';
                rightPercent = "";
              }
              if (e.pageY - disy > overY) {
                // topPercent = overY / parentHeight * 100 + '%';
                topPercent = '';
                bottomPercent = 0;
              } else if (e.pageY - disy < 0) {
                topPercent = '0%';
                bottomPercent = "";
              } else {
                topPercent = (e.pageY - disy) / parentHeight * 100 + '%';
                bottomPercent = "";
              }
              el.style.left = leftPercent;
              el.style.top = topPercent;
              el.style.right = rightPercent;
              el.style.bottom = bottomPercent;
            }
            document.onmouseup = function() {
              e.stopPropagation();
              document.onmousemove = document.onmouseup = null;
              let width = e.target.parentNode.clientWidth;
              let height = e.target.parentNode.clientHeight;
              var top = e.target.offsetTop;
              var left = e.target.offsetLeft;
              top = (top / height * 100).toFixed(2);
              left = (left / width * 100).toFixed(2);
              if(el.style.right=='0px') left = '110';
              if(el.style.bottom=='0px') top = "110";
              binding.value.top = top;
              binding.value.left = left;
            }
          }
        }
      }
    },
    created() {
      // this.findTag();
      this.shopObj = JSON.parse(localStorage.getItem("shopObj"));
      if (this.shopObj.imageUrl.indexOf("?") != -1) {
        this.shopObj.imageUrl = this.shopObj.imageUrl.substring(0, this.shopObj.imageUrl.indexOf("?"));
      }
      this.findStoreModityTags();
    },
    methods: {
      rollImg(i) {
        let targetWidth = this.$refs.tagImage[i].style.width;
        targetWidth = parseInt(targetWidth.substring(0, targetWidth.indexOf("px")));
        /* event.wheelDelta 获取滚轮滚动值并将滚动值叠加给缩放比zoom
              wheelDelta统一为±120，其中正数表示为向上滚动，负数表示向下滚动
          */
        targetWidth += Math.floor(event.wheelDelta / 12);
        let maxWidth = (this.$refs.tagImage[i].parentNode.clientWidth) / 2;
        /* 最小范围 和 最大范围 的图片缩放尺度 */
        if (targetWidth >= 10 && targetWidth < maxWidth) {
          this.$refs.tagImage[i].style.width = targetWidth + "px";
        } else if (targetWidth >= maxWidth) {
          this.$refs.tagImage[i].style.width = maxWidth + "px";
        } else if (targetWidth < 10) {
          this.$refs.tagImage[i].style.width = "10px";
        }
        return false;
      },
      findStoreModityTags() {
        findStoreModityTags(this.storeModityId).then(res => {
          if (res.data.code == 200) {
            let tagsList = res.data.data;
            for (let i = 0; i < tagsList.length; i++) {
              for (let j = 0; j < tagsList[i].modityTagStyleList.length; j++) {
                if (tagsList[i].storeModityTagStyleId == tagsList[i].modityTagStyleList[j].id) {
                  if (tagsList[i].yAxes.indexOf("%") != -1) {
                    tagsList[i].yAxes = tagsList[i].yAxes.substring(0, tagsList[i].yAxes.indexOf("%"))
                  }
                  if (tagsList[i].xAxes.indexOf("%") != -1) {
                    tagsList[i].xAxes = tagsList[i].xAxes.substring(0, tagsList[i].xAxes.indexOf("%"))
                  }
                  let param = {
                    imgUrl: tagsList[i].modityTagStyleList[j].url,
                    top: tagsList[i].yAxes,
                    left: tagsList[i].xAxes,
                    percentage: tagsList[i].percentage ? parseInt(tagsList[i].percentage) : 17
                  }
                  this.tagImgList.push(param);
                  this.newTagImgList.push(param);
                }
              }
              let obj = {
                name: tagsList[i].tagName,
                imgList: tagsList[i].modityTagStyleList,
                storeModityTagStyleId: tagsList[i].storeModityTagStyleId,
                tagId: tagsList[i].tagId,
                xAxes: tagsList[i].xAxes,
                yAxes: tagsList[i].yAxes,
                percentage: tagsList[i].percentage ? tagsList[i].percentage : 17
              }
              this.formData.push(obj);
              this.newFormData.push(obj);
            }
          }
          this.findTag();
        }).catch(err => {})
      },
      changeWidth(val) {
        if (this.currentIndex == -1) return;
        let el = this.$refs["tagImage"][this.currentIndex];
        let parentWidth = el.parentNode.clientWidth;
        let parentHeight = el.parentNode.clientHeight;
        let tagWidth = el.clientWidth;
        let tagHeight = el.clientHeight;
        let offsetLeft = el.offsetLeft;
        let offsetTop = el.offsetTop;
        if (parentWidth - offsetLeft < tagWidth) {
          el.style.left = "";
          el.style.right = 0;
        }
        if (parentHeight - offsetTop < tagHeight) {
          el.style.top = "";
          el.style.bottom = 0;
        }
        this.tagImgList[this.currentIndex].percentage = val;
        this.formData[this.currentIndex].percentage = val;
      },
      handleTagWidth(index) {
        this.currentIndex = index;
        this.widthValue = this.tagImgList[index].percentage;
      },
      findTag() {
        let param = {
          page: this.page,
          rows: this.size,
          tagName: this.tagsName ? this.tagsName : ""
        }
        this.tagsFormData = [];
        findTags(param).then(res => {
          if (res.data.code == 200) {
            let tagsList = res.data.data.list;
            this.total = res.data.data.total;
            for (let i = 0; i < tagsList.length; i++) {
              let chooseDisplay = "inline-block";
              let cancelDisplay = "none";
              for (let j = 0; j < this.formData.length; j++) {
                if (this.formData[j].tagId == tagsList[i].id) {
                  chooseDisplay = "none";
                  cancelDisplay = "inline-block";
                }
              }
              let obj = {
                name: tagsList[i].tagName,
                describe: tagsList[i].remark,
                chooseDisplay: chooseDisplay,
                cancelDisplay: cancelDisplay,
                tagId: tagsList[i].id,
                imgList: tagsList[i].modityTagStyleList,
                storeModityTagStyleId: tagsList[i].modityTagStyleList[0].id,
                xAxes: "0",
                yAxes: "0",
                percentage: tagsList[i].percentage ? tagsList[i].percentage : 17
              }
              this.tagsFormData.push(obj);
            }
          }
        }).catch(err => {})
      },
      chooseTag() {
        this.chooseTagFlag = true;
        this.chooseList = [];
        if (this.changeFlag) this.findTag();
        this.changeFlag = false;
      },
      chooseStyle(index, parentIndex) {
        let parentEl = document.getElementsByClassName("tags_row")[parentIndex];
        this.activedIndex = index;
        this.parentIndex = parentIndex;
        if (parentEl.children[index].style.border != 'none' && parentEl.children[index].style.border) {
          return;
        }
        for (let i = 0; i < parentEl.children.length; i++) {
          parentEl.children[i].style.border = "none";
        }
        parentEl.children[index].style.border = "2px solid #2d8cf0";
        let top = this.$refs["tagImage"][parentIndex].style.top;
        let left = this.$refs["tagImage"][parentIndex].style.left;
        if(top=="") top = "110";
        if(left=="") left = "110";
        this.formData[parentIndex].storeModityTagStyleId = this.formData[parentIndex].imgList[index].id;
        this.tagImgList[parentIndex].imgUrl = this.formData[parentIndex].imgList[index].url;
        // this.tagImgList[parentIndex].top = this.tagImgList[parentIndex].yAxes;
        // this.tagImgList[parentIndex].left = this.tagImgList[parentIndex].xAxes;
        this.tagImgList[parentIndex].top = top;
        this.tagImgList[parentIndex].left = left;
      },
      deleteRow(i) {
        this.rowIndex = i;
        this.alertShow = true;
      },
      handleCloseTip(flag) {
        if (flag == 'true') {
          console.log(this.rowIndex)
          this.changeFlag = true;
          this.formData.splice(this.rowIndex, 1);
          this.newFormData.splice(this.rowIndex, 1);
          this.tagImgList.splice(this.rowIndex, 1);
          this.newTagImgList.splice(this.rowIndex, 1);
          this.currentIndex = -1;
        }
        this.alertShow = false;
      },
      changePage(val) {
        this.page = val;
        this.findTag();
      },
      findTags() {
        this.findTag();
      },
      handleChoose(i) {
        this.changeFlag = true;
        this.tagsFormData[i].chooseDisplay = "none";
        this.tagsFormData[i].cancelDisplay = "inline-block";
        this.newFormData.push(this.tagsFormData[i]);
        for (let j = 0; j < this.tagsFormData[i].imgList.length; j++) {
          if (this.tagsFormData[i].storeModityTagStyleId == this.tagsFormData[i].imgList[j].id) {
            let obj = {
              imgUrl: this.tagsFormData[i].imgList[j].url,
              top: "0",
              left: "0",
              percentage: 17
            }
            this.newTagImgList.push(obj);
          }
        }
      },
      handleCancelChoose(i) {
        this.changeFlag = true;
        this.tagsFormData[i].chooseDisplay = "inline-block";
        this.tagsFormData[i].cancelDisplay = "none";
        for (let j = 0; j < this.newFormData.length; j++) {
          if (this.newFormData[j].tagId == this.tagsFormData[i].tagId) {
            this.newFormData.splice(j, 1);
            this.newTagImgList.splice(j, 1);
          }
        }
      },
      saveTagsChoose() {
        this.chooseTagFlag = false;
        if (!this.changeFlag) return;
        this.formData = [];
        this.tagImgList = [];
        for (let i = 0; i < this.newTagImgList.length; i++) {
          this.tagImgList.push(this.newTagImgList[i]);
        }
        for (let i = 0; i < this.newFormData.length; i++) {
          this.formData.push(this.newFormData[i]);
        }
      },
      cancelTagsChoose() {
        this.chooseTagFlag = false;
        this.newFormData = [];
        this.newTagImgList = [];
        for (let i = 0; i < this.tagImgList.length; i++) {
          this.newTagImgList.push(this.tagImgList[i]);
        }
        for (let i = 0; i < this.formData.length; i++) {
          this.newFormData.push(this.formData[i]);
        }
        if (this.changeFlag) this.findTag();
        this.changeFlag = false;
      },
      saveStoreModityTag() {
        let data = [];
        let storeId = this.$route.query.storeId;
        let modityId = this.$route.query.modityId;
        for (let i = 0; i < this.formData.length; i++) {
          let left = '';
          let top = '';
          if (this.$refs.tagImage[i].style.left.indexOf("%") != -1) {
            left = this.$refs.tagImage[i].style.left.substring(0, this.$refs.tagImage[i].style.left.indexOf("%"));
          }
          if (this.$refs.tagImage[i].style.top.indexOf("%") != -1) {
            top = this.$refs.tagImage[i].style.top.substring(0, this.$refs.tagImage[i].style.top.indexOf("%"));
          }
          if (this.$refs.tagImage[i].style.left == "") left = '110';
          if (this.$refs.tagImage[i].style.top == "") top = "110";
          let obj = {
            storeModityId: this.storeModityId,
            tagId: this.formData[i].tagId,
            storeModityTagStyleId: this.formData[i].storeModityTagStyleId ? this.formData[i].storeModityTagStyleId : "",
            xAxes: left,
            yAxes: top,
            storeId: storeId,
            modityId: modityId,
            percentage: this.formData[i].percentage
          }
          data.push(obj)
        }
        let param = {};
        param.storeModityTags = data;
        param.storeModityId = this.storeModityId;
        console.log(param)
        saveStoreModityTag(param).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("保存成功");
            this.$router.back(-1);
          }
        }).catch(err => {})
      },
      cancelSaveStoreModityTag() {
        this.$router.back(-1);
      }
    }
  }
</script>

<style scoped>
  .preview {
    display: flex;
  }

  .preview_box {
    position: relative;
    display: flex;
    width: 300px;
    height: 300px;
    /* border: 1px solid #ccc; */
  }

  .button_box {
    text-align: left;
    margin: 40px 0 0 30px;
  }
</style>
