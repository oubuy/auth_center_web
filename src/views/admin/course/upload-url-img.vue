<template>
    <div>
        <Upload ref="upload" action="/rest/outerUser/uploadImage" :headers="uploadHeaders" type="drag" name="file" :show-upload-list="false" :format="uploadImgFormat" :on-success="handleSuccess" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" class="upload">
            <div style="width: 300px;height:250px;line-height: 250px;">
                <div style="font-size: 18px;">+添加章节封面</div>
            </div>
        </Upload>
        <!-- 查看图片详细 -->
        <Modal v-model="imgModal" title="查看图片" footer-hide scrollable width="600">
            <div style="text-align:center;"><img :src="imgUrl" v-if="imgModal" style="max-width:568px;"></div>
        </Modal>
    </div>
</template>

<script>
export default {
    props: {
        quantity: { // 上传图片数量限制
            type: Number,
            default: 10
        },
        index: {
            type: Number
        },
    },
    data() {
        return {
            uploadList: [], // 上传文件列表
            uploadImgFormat: ['jpg', 'jpeg', 'png'], // 上传图片支持的文件类型
            uploadHeaders: {}, // 设置上传的请求头部
            imgModal: false,
            imgUrl: ''
        }
    },
    mounted() {
        this.uploadHeaders.Authorization = localStorage.getItem("jwttoken");
        this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
        initUploadList2(imgUrl) { // 初始化已上传文件列表
            console.log(imgUrl,9999)
            if (imgUrl) {
                for(var i=0;i<imgUrl.length;i++){
                    let obj={};
                    obj.url=imgUrl[i];
                    obj.status='finished';
                    this.uploadList.push(obj)
                }
            }
        },
        getUploadList() { // 获取上传文件列表
            let ret = [];
            this.uploadList.forEach(item => {
                ret.push({
                    url: item.url
                });
            });
            return ret;
        },

        handleImgModal(imgUrl) {
            this.imgUrl = imgUrl;
            this.imgModal = true;
        },
        handleRemove(file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess(res, file) {
            if (res.code == 200) {
                file.url = res.data;
                file.status === 'finished';
                this.uploadList = this.$refs.upload.fileList;
                let obj = {
                    index: this.index,
                    uploadList: this.uploadList
                }
                this.$emit("get-img",obj);
            } else {
                this.$Message.warning(res.msg);
                this.handleRemove(file);
            }
        },
        handleFormatError(file) {
            this.$Message.warning("图片格式错误, 请选择：jpg、jpeg、png");
        },
        handleBeforeUpload() {
            const check = this.uploadList.length < this.quantity;
            if (!check) {
                this.$Message.warning("只能上传一张图片");
            }
            return check;
        },
        handleReset() {
            this.$refs.upload.clearFiles();
        }
    }
}
</script>

<style scoped>
    .upload-list {
        display: inline-block;
        width: 300px;
        height: 250px;
        text-align: center;
        line-height: 250px;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    }

    .upload-list img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
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
        width: 300px;
        height: 250px;
        margin-right: 4px;
    }
</style>
        