<template>
  <div class="set-width">
    <div class="top">
      <div class="position-box">
        <div class="box-one">
          <div class="pic-box" style="margin: 0 auto;padding-top: 20px;"><img src="@/assets/tvDownload/logo.png"></div>
          <div style="color: #fff;">
            <div class="title" style="font-size: 18px;margin-top: .5%;letter-spacing: 3px;">交互大屏</div>
            <div class="version" style="margin:0 0 1%;">{{version}}</div>
          </div>
          <div class="download-button" style="margin-bottom: 1%;">
            <div>
              <img src="@/assets/tvDownload/64.png" alt="">
              <a @click="getFile64"></a>
            </div>
            <div>
              <img src="@/assets/tvDownload/32.png" alt="">
              <a @click="getFile32"></a>
            </div>
          </div>
          <div class="tv-img" style="width: 50%;margin: 0 auto;">
            <img src="@/assets/tvDownload/home.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="single" v-for="(item,index) in imgList"><img :src="showScreen(index+1)" alt=""></div>
      <div class="version-update">
        <div class="version-title">版本更新</div>
        <div style="width: 50%;margin: 0 auto;margin-bottom: .5%;overflow: hidden;">
          <div style="display: flex;width: 100%;position: relative;left: 0;" class="year-box">
            <div v-for="(item,index) in versionList" class="year">{{item.editionTime}}</div>
          </div>
        </div>
        <div style="display: flex;justify-content: center;position: relative;">
          <div class="left-arrow" @click="goLeft"><img src="@/assets/tvDownload/jiantou_1.png" style="width: 100%;"></div>
          <div style="overflow: hidden;width: 50%;padding-bottom: 1%;margin: 0 1%;">
            <div class="version-line">
              <div class="dashed-line" style="width: 100%;height: 1px;position: absolute;border-top: 1px dashed #eecb92;top: 0;left: 0;"></div>
              <div v-for="(item,index) in versionList" style="position: relative;top: -8px;flex: 0 0 33.3%;">
                <div>
                  <div>
                    <div v-if="index!=activedIndex" style="width: 16px;height: 16px;border: 1px solid #eecb92;border-radius: 50%;margin: 0 auto;background: #fff;"></div>
                    <div v-else style="width: 16px;height: 16px;margin: 0 auto;background: #eecb92;border-radius: 50%;display: flex;justify-content: center;align-items: center;">
                      <div style="width: 8px;height: 8px;background: #fff;border-radius: 50%;"></div>
                    </div>
                    <div class="shu-line" style="width: 1px;background: #eecb92;margin: 0 auto;"></div>
                    <div style="width: 8px;height: 8px;background: #eecb92;border-radius: 50%;margin: 0 auto;"></div>
                  </div>
                  <div style="position: relative;margin-top: 6%;">
                    <div style="width: 30%;border-radius: 20px;padding: 1% 0;background: #be9357;position: absolute;top: -15%;left: 50%;margin-left: -15%;color: #fff;font-weight: bold;">{{item.version}}</div>
                    <div style="width: 50%;background: #fff;padding: 8% 1%;box-shadow: 0 0 10px -3px rgba(0,0,0,.3);border-radius: 8px;margin: 0 auto;color: #c7a16f;">
                      <!-- <div>{{item.info}}</div> -->
                      <pre style="margin: 0;">{{item.info}}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-arrow"><img src="@/assets/tvDownload/jiantou.png" style="width: 100%;" @click="goRight"></div>
        </div>
      </div>
    </div>
    <div class="bottom-box" style="color:#fff;position: relative;">
      <div><img src="@/assets/tvDownload/screens6.png" alt=""></div>
      <div class="bottom-button" @click="checkBook"><img src="@/assets/tvDownload/check.png" alt=""></div>
    </div>
    <Modal title="操作教程" width="1300px" v-model="showSlide" footer-hide scrollable>
      <div class="slide">
        <img :src="showPic(page)" alt="" style="display: block;width:100%;height: 100%;">
        <div class="btn-box">
          <Button type="primary" style="margin-right: 20px;" @click="prePic" v-if="page>1">上一张</Button>
          <Button type="primary" @click="nextPic" v-if="page<29">下一张</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getLatest,
    getUpdate
  } from '@/api/version.js'
  export default {
    data() {
      return {
        file32: '',
        file64: '',
        imgList: [1, 2, 3, 4, 5, 6],
        versionList: [],
        showSlide: false,
        page: 1,
        version: '',
        activedIndex: 1,
        flag: false,
        leftPosition: 0
      };
    },
    mounted() {
      this.windowResize();
    },
    methods: {
      setFontsize() {
        this.$nextTick(() => {
          let titleWidth = $('body').width() * 0.012 + 'px';
          let versionWidth = $('body').width() * 0.009 + 'px';
          let logoWidth = $('body').width() * 0.046 + 'px';
          let versionTitleWidth = $('body').width() * 0.018 + 'px';
          let yearWidth = $('body').width() * 0.012 + 'px';
          let arrowWidth = $(".left-arrow").width();
          let shuHeight = $('body').width() * 0.02 + 'px';
          $(".title").css({
            fontSize: titleWidth
          });
          $(".version").css({
            fontSize: versionWidth
          });
          $(".pic-box").css({
            width: logoWidth,
            height: logoWidth + 20
          });
          $(".version-title").css({
            fontSize: versionTitleWidth
          });
          $(".year").css({
            fontSize: yearWidth
          });
          $(".version-line").css({
            top: arrowWidth / 2
          });
          $(".shu-line").css({
            height: shuHeight
          });
        });
      },
      windowResize() {
        this.setFontsize();
        window.onresize = this.setFontsize;
      },
      download32() {
        let param = {
          arch: "ia32"
        }
        getLatest(param).then(res => {
          if (res.data.code == 200) {
            this.file32 = res.data.data.packagePath;
          }
        });
      },
      download64() {
        let param = {
          arch: "x64"
        }
        getLatest(param).then(res => {
          if (res.data.code == 200) {
            this.version = res.data.data.version + "版本";
            this.file64 = res.data.data.packagePath;
          }
        });
      },
      getUpdates() {
        let param = {
          arch: ""
        }
        getUpdate(param).then(res => {
          if (res.data.code == 200) {
            this.versionList = res.data.data;
            this.$nextTick(() => {
              let versionTitleWidth = $('body').width() * 0.018 + 'px';
              let yearWidth = $('body').width() * 0.012 + 'px';
              let arrowWidth = $(".left-arrow").width();
              let shuHeight = $('body').width() * 0.02 + 'px';
              $(".version-title").css({
                fontSize: versionTitleWidth
              });
              $(".year").css({
                fontSize: yearWidth
              });
              $(".version-line").css({
                top: arrowWidth / 2
              });
              $(".shu-line").css({
                height: shuHeight
              });
            });
          }
        })
      },
      goLeft() {
        if (this.versionList.length > 3 && this.activedIndex < this.versionList.length - 2) {
          this.leftPosition += 33.3;
          $(".version-line").css({
            left: -this.leftPosition + '%'
          });
          $(".year-box").css({
            left: -this.leftPosition + '%'
          });
          $(".dashed-line").css({
            left: this.leftPosition + '%'
          });
          if (this.activedIndex == this.versionList.length - 2) return;
          this.activedIndex++;
        }
      },
      goRight() {
        if (this.versionList.length > 3 && this.activedIndex > 1) {
          this.leftPosition -= 33.3;
          $(".version-line").css({
            left: -this.leftPosition + '%'
          });
          $(".year-box").css({
            left: -this.leftPosition + '%'
          });
          $(".dashed-line").css({
            left: this.leftPosition + '%'
          });
          if (this.activedIndex == 1) return;
          this.activedIndex--;
        }
      },
      getFile32(e) {
        if (!this.file32) this.$Message.warning("下载失败，请稍后再试");
        else e.target.href = this.file32;
      },
      getFile64(e) {
        if (!this.file64) this.$Message.warning("下载失败，请稍后再试");
        else e.target.href = this.file64;
      },
      checkBook() {
        this.page = 1;
        this.showSlide = true;
      },
      showPic(page) {
        return require("@/assets/tvDownload/slide/slide" + page + ".png");
      },
      showScreen(index) {
        let type = '.png';
        if (index == 2) type = '.jpg';
        return require("@/assets/tvDownload/screen" + index + type);
      },
      prePic() {
        if (this.page <= 0) return;
        this.page--;
      },
      nextPic() {
        if (this.page >= 29) return;
        this.page++;
      }
    },
    created() {
      this.download64();
      this.download32();
      this.getUpdates();
    }
  };
</script>

<style lang="less" scoped>
  .download-button a {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  img {
    display: block;
    width: 100%;
  }

  .download-button div {
    position: relative;
    display: inline-block;
    width: 10%;
    margin: 0 10px;
  }

  .top {
    position: relative;
    background: url('../assets/tvDownload/bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 0 0 3%;
  }

  .set-width {
    width: 100%;
    margin: 0 auto;
  }

  .position-box {
    width: 100%;
    top: 0;
    left: 0;
  }

  .flex-box {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sixty-four,
  .thirty-two {
    width: 10%;
    height: 100%;
    background: #c59a5f;
    color: #fff;
    margin: 0 10px;
    border-radius: 5px;
  }

  .bottom-button {
    position: absolute;
    display: flex;
    width: 20%;
    height: 5%;
    align-items: center;
    justify-content: center;
    background: #c59a5f;
    border-radius: 20px;
    cursor: pointer;
    bottom: 20%;
    left: 50%;
    margin-left: -10%;
  }

  .btn-box {
    margin-top: 20px;
    text-align: center;
  }

  .version-update {
    background: #fff;
    padding: 4% 0;
  }

  .version-title {
    margin-bottom: 3%;
  }

  .left-arrow,
  .right-arrow {
    width: 1.6%;
    cursor: pointer;
  }

  .version-line {
    position: relative;
    display: flex;
    width: 100%;
    // border-top: 1px dashed #eecb92;
    left: 0;
  }

  .year {
    color: #c7a16f;
    flex: 0 0 33.3%;
  }
</style>
