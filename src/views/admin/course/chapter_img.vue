<template>
    <div>
        <Upload v-show="!(quantity==1 && uploadList.length==1)" ref="upload" :action="action" multiple :headers="uploadHeaders" type="drag" name="file" :show-upload-list="false" :format="uploadImgFormat" :on-success="handleSuccess" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" class="upload">
            <div style="width: 58px;height:58px;line-height: 58px;">+</div>
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
                type: Number,
            },
            action: {
              type: String,
              default: "/rest/outerUser/uploadImage"
            }
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
            initUploadList(imgUrl) { // 初始化已上传文件列表
                if (imgUrl) {
                    this.uploadList.push({
                        url: imgUrl,
                        status: 'finished'
                    });
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
                    file.index = this.index;
                    file.length = this.$refs.upload.fileList.length;
                    this.uploadList = this.$refs.upload.fileList;
                    file.list = this.uploadList;
                    let obj = {
                        index: this.index,
                        uploadList: this.uploadList
                    }
                    this.$emit("return-img",file);
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
                // if (!check) {
                //     this.$Message.warning("只能上传一张图片");
                // }
                return check;
            },
            handleReset() {
                this.$refs.upload.clearFiles();
            }
        }
    }
</script>

<style scoped>
    .upload {
        display: inline-block;
        position: relative;
        width: 60px;
        height: 60px;
        margin-right: 4px;
    }
    .upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 10px;
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

    .chapter-upload-list {
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

    .chapter-upload-list img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .chapter-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .chapter-upload-list:hover .chapter-upload-list-cover {
        display: block;
    }

    .chapter-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
