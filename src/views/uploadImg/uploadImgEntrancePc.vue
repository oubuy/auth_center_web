<template>
  <div style="text-align: center;">
    <img src="../../assets/sceneIndex.jpg" usemap="#clickmap">
    <map name="clickmap" id="clickmap">
      <area shape="rect" :coords="coords" href="#/uploadImgIndexPc" />
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
          path: '/uploadImgIndexPc'
        });
      },
      coordsAdjust() {
        let coords = "310,1750,640,1840";
        // this.coords = coords;
        var pageWidth = document.body.clientWidth; //获取页面宽度
        var each = coords.split(",");
        this.pageWidth = pageWidth;
        //获取每个坐标点
        for (var i = 0; i < each.length; i++) {
          each[i] = Math.round(parseInt(each[i]) * pageWidth / 1908).toString();
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
        console.log(this.coords)
      }
    }
  }
</script>

<style scoped>
  img {
    /* display: block; */
    width: 50%;
  }
</style>
