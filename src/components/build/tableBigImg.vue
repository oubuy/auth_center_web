<template>
<div>
    <viewer :images="data" :options="options" style="max-width:600px; max-height:600px;">
       <div v-if="data.length > 0" class="img_container">
          <!-- <img
                v-for="(item,index) in data"
                :src="item"
                :key="index"> -->
           <img :src="data[0]"></img>
         <div v-if="data.length > 1" class="img_count">共{{data.length}}张</div>
       </div>
    </viewer>
</div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";

export default {
  props: {
    data: {
      type: Array,
      default: [],
      required: true
    }
  },
  data() {
    return {
      bigFlag: false,
      imgModal: false,
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
    };
  },
  methods: {
    handelBigImg() {
      this.bigFlag = true;
    }
  }
};
</script>

<style scoped>
.img_container {
  position: relative;
  padding: 5px 0;
  width: 80px;
  height: 70px;
  cursor: pointer;
  margin: 0 auto;
}

.img_container img {
  border-radius: 4px;
  width: 100%;
  height: 100%;
}

.img_container .img_count {
  position: absolute;
  bottom: 5px;
  left: 0;
  height: 20px;
  width: 80px;
  background: rgba(0, 0, 0, 0.5);
  color: #f5f1e5;
  line-height: 20px;
  text-align: center;
  border-radius: 4px;
}
</style>
