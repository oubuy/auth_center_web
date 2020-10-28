<template>
<div>
    <div class="upload-list" v-for="item in uploadList">
        <div v-if="item.status === 'finished'">
            <viewer :images="[item.url]" :options="options" style="height:150px; width:150px; cursor: pointer;">
                <img :src="item.url" style="height:100%; width:100%;">
            </viewer>
            <div class="upload-list-cover">
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </div>
        <div v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </div>
    </div>
    <Upload v-show="!(quantity==1 && uploadList.length==1)" ref="upload" action="/build-rest/file/uploadImage" :data="{watermark:watermark}" :headers="uploadHeaders" type="drag" name="file" :show-upload-list="false" :format="uploadImgFormat" :on-success="handleSuccess" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" class="upload">
        <div style="width: 148px;height:148px;line-height: 148px;">
            <Icon type="ios-camera" size="20"></Icon>
        </div>
    </Upload>
</div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";

export default {
    props: {
        quantity: { // 上传图片数量限制
            type: Number,
            default: 10
        },
        maxWidth: {
            type: Number
        },
        maxHeight: {
            type: Number
        },
        watermark: {
            type: String,
            default: "false"
        }
    },
    data() {
        return {
            uploadList: [], // 上传文件列表
            uploadImgFormat: ['jpg', 'jpeg', 'png'], // 上传图片支持的文件类型
            uploadHeaders: {}, // 设置上传的请求头部
            imgModal: false,
            imgUrl: '',
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
        }
    },
    mounted() {
        this.uploadHeaders.Authorization = localStorage.getItem("jwttoken");
        this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
        initUploadList(imgInfo) { // 初始化已上传文件列表
            this.uploadList.splice(0, this.uploadList.length);
            if (imgInfo) {
                let arr = [];
                if (imgInfo instanceof Array) {
                    arr = imgInfo;
                } else if (imgInfo instanceof Object) {
                    arr.push(imgInfo);
                }
                arr.forEach(item => {
                    this.uploadList.push({
                        imgObj: item,
                        url: item.imageUrl,
                        status: 'finished'
                    });
                });
            }
        },
        getUploadList() { // 获取已上传文件列表
            let ret = [];
            for (let i = 0; i < this.uploadList.length; i++) {
                let item = this.uploadList[i];
                if (item.status != 'finished') {
                    this.$Message.warning("图片上传中，请稍候...");
                    return null;
                }
                ret.push(item.imgObj);
            }
            return ret;
        },
        handleRemove(file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file) {
            if (res.code == 200) {
                file.imgObj = res.data;
                file.url = res.data.imageUrl;
                file.resizeImageUrl = this.getResizeImageUrl(res.data.imageUrl);
            } else {
                this.$Message.warning(res.msg);
                this.handleRemove(file);
            }
        },
        handleFormatError(file) {
            this.$Message.warning("图片格式错误, 请选择：jpg、jpeg、png");
        },
        handleBeforeUpload(file) {
            if (this.uploadList.length >= this.quantity) {
                this.$Message.warning("最多只能上传" + this.quantity + "张图片");
                return false;
            }
            if (this.maxWidth || this.maxHeight) {
                return this.checkImageWH(file, this.maxWidth, this.maxHeight);
            }
            return true;
        },
        checkImageWH(file, width, height) {
            let self = this;
            return new Promise(function (resolve, reject) {
                let filereader = new FileReader();
                filereader.onload = e => {
                    let src = e.target.result;
                    const image = new Image();
                    image.onload = function () {
                        if (width && this.width > width) {
                            self.$Message.warning("上传的图片宽度不能超过" + width);
                            reject();
                        } else if (height && this.height > height) {
                            self.$Message.warning("上传的图片高度不能超过" + height);
                            reject();
                        } else {
                            resolve();
                        }
                    };
                    image.onerror = reject;
                    image.src = src;
                };
                filereader.readAsDataURL(file);
            });
        }
    }
}
</script>

<style scoped>
.upload-list {
    display: inline-block;
    width: 150px;
    height: 150px;
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
}

.upload-list-cover {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    height: 30px;
    line-height: 30px;
}

.upload-list:hover .upload-list-cover {
    display: block;
}

.upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.upload {
    display: inline-block;
    position: relative;
    line-height: normal;
    width: 150px;
    height: 150px;
    margin-right: 4px;
}
</style>
