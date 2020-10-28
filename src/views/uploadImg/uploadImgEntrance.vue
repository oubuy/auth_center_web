<template>
  <div>
    <img src="https://center.oceano.com.cn/Auth-web/img/3831dc7fe1896ef147b8b3f9f9e4f35f.png" usemap="#clickmap">
    <map name="clickmap" id="clickmap">
      <area shape="rect" :coords="coords" href="#/uploadImgIndex" />
    </map>
  </div>
</template>

<script>
  import '@/utils/setRem.js'
  export default {
    data() {
      return {
        coords: "",
        pageWidth: ""
      }
    },
    created() {
      this.coordsAdjust();
    },
    mounted() {
      let _self = this;
      window.onresize = function() {
        _self.coordsAdjust();
      }
    },
    methods: {
      goIndex() {
        this.$router.push({
          path: '/uploadImgIndex'
        });
      },
      coordsAdjust() {
        let coords = "90,1240,215,1280";
        var pageWidth = document.body.clientWidth; //获取页面宽度
        var each = coords.split(",");
        this.pageWidth = pageWidth;
        //获取每个坐标点
        for (var i = 0; i < each.length; i++) {
          each[i] = Math.round(parseInt(each[i]) * pageWidth / 320).toString();
        }
        //生成新的坐标点
        var newPosition = "";
        for (var i = 0; i < each.length; i++) {
          newPosition += each[i];
          if (i < each.length - 1) {
            newPosition += ",";
          }
        }
        this.coords = newPosition;
      }
    }
  }
</script>

<style scoped>
  img {
    display: block;
    width: 100%;
  }
</style>
