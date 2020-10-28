<template>
<div>
    <div v-if="imageUrl && count>0" class="img_container" @click="handleShowImg">
        <img :src="imageUrl.replace(/pic.oceano.com.cn/, 'oceano-osnhome.oss-cn-hangzhou.aliyuncs.com') + '?x-oss-process=image/resize,m_fixed,h_120,w_160'"></img>
        <div v-if="count > 1" class="img_count">共{{count}}张</div>
    </div>
    <!-- 查看图片详细 -->
    <Modal v-model="imgModal" title="查看图片" footer-hide scrollable :width="634">
        <Carousel v-if="imgModal && count>1" dots="outside" arrow="always" :height="600" loop>
            <CarouselItem v-for="(img,index) in imageList" :key="index">
                <div style="text-align:center; height:100%;"><img :src="img" style="max-width:600px; max-height:600px;" /></div>
            </CarouselItem>
        </Carousel>
        <div v-if="imgModal && count==1" style="text-align:center;">
            <img :src="imageUrl" v-if="imgModal" style="max-width:600px;">
        </div>
    </Modal>
</div>
</template>

<script>
import {
    getXgtImages
} from "@/api/building.js";

export default {
    props: {
        spaceId: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        count: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            imgModal: false,
            imageList: []
        };
    },
    methods: {
        handleShowImg() {
            if (this.count > 1 && this.imageList.length == 0) {
                let params = {
                    spaceId: this.spaceId
                };
                getXgtImages(params).then(resp => {
                    if (resp.data.code == 200) {
                        resp.data.data.forEach(item => {
                            this.imageList.push(item.imageUrl);
                        });
                    }
                });
            }
            this.imgModal = true;
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
