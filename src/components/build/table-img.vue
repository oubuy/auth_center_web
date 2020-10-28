<template>
<div>
    <div v-if="data.length > 0" class="img_container" @click="handleImg">
        <img :src="data[0].replace(/pic.oceano.com.cn/, 'oceano-osnhome.oss-cn-hangzhou.aliyuncs.com') + '?x-oss-process=image/resize,m_fixed,h_120,w_160'"></img>
        <div v-if="data.length > 1" class="img_count">共{{data.length}}张</div>
    </div>
    <!-- 查看图片详细 -->
    <Modal v-model="imgModal" title="查看图片" footer-hide scrollable :width="634">
        <Carousel v-if="imgModal && data.length>1" dots="outside" arrow="always" :height="600" loop>
            <CarouselItem v-for="(imgUrl,index) in data" :key="index">
                <div style="text-align:center; height:100%;"><img :src="imgUrl" style="max-width:600px; max-height:600px;" /></div>
            </CarouselItem>
        </Carousel>
        <div v-if="imgModal && data.length==1" style="text-align:center;">
            <img :src="data[0]" v-if="imgModal" style="max-width:600px;">
        </div>
    </Modal>
</div>
</template>

<script>
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
            imgModal: false
        };
    },
    methods: {
      handleImg(){
        this.$emit('child-img',true)
        this.imgModal=true;

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
