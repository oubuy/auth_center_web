<template>
        <div>
            <Form :model="formData" :label-width="100" ref="formData" :rules="ruleValidate">
                <div style="display: flex;">
                    <div class="left_box">
                        <FormItem label="章节名称：" prop="name">
                            <Input v-model="formData.name" style="width:350px"></Input>
                        </FormItem>
                        <FormItem label="章节代码：" prop="code">
                            <Input v-model="formData.code" style="width:350px"></Input>
                        </FormItem>
                        <FormItem label="章节排序：" prop="seq">
                            <Input v-model="formData.seq" style="width:350px"></Input>
                        </FormItem>
                        <FormItem prop="description" label="章节描述：">
                            <Input v-model="formData.description" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注" style="width:350px"/>
                        </FormItem>
                    </div>
                    <div class="right_box" style="margin-left: 150px;">
                        <upload-img2 @return-img="returnImg" ref="chapterImg"></upload-img2>
                    </div>
                </div>
                <!-- <div style="margin: 20px 0 30px 100px;">
                    <new-upload-img @get-img="getImg"></new-upload-img>
                </div> -->
            </Form>
            <div class="button_box" style="text-align: left;margin-left: 70px;">
                <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading" style="margin-left: 30px;">保存</Button>
                <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
            </div>
        </div>
    </template>

    <script>
        import { editChapter, saveAttachment } from "@/api/course.js";
        import uploadImg from "@/views/admin/course/upload-url-img";
        import uploadImg2 from "@/views/admin/course/upload-url-img2";
        import newUploadImg from "./new_chapter_imgUpload.vue";
        export default {
          data() {
            return {
              formData: {
                  courseId: this.$route.query.courseId,
                  code: '',
                  name: '',
                  seq: '',
                  description: '',
                  showedUrl: ''
              },
              attachmentList: [],
              saveBtnLoading: false,
              ruleValidate: {
                name: [
                    {
                        type:'string',
                        required: true,
                        message: "章节名称不能为空",
                        trigger: "blur"
                    }
                ],
                code:[
                    {
                        required: true,
                        type: 'string',
                        message: '章节代码不能为空',
                        trigger: 'blur'
                    }
                ],
                description: [
                    {
                        required: true,
                        message: "章节描述不能为空",
                        type: "string",
                        trigger: "blur",
                    }
                ],
              },
            };
          },
          components: {
            uploadImg,
            uploadImg2,
            newUploadImg
        },
          props:[],
          mounted() {

          },
          methods: {
            handleSubmit() {
                let param = {};
                param.courseId = this.formData.courseId;
                param.code = this.formData.code;
                param.name = this.formData.name;
                param.seq = this.formData.seq;
                param.description = this.formData.description;
                param.showedUrl = this.formData.showedUrl;
                if(!param.name) {
                    this.$Message.warning("请填写章节名称");
                    return false;
                }
                if(!param.code) {
                    this.$Message.warning("请填写章节代码");
                    return false;
                }
                if(!param.seq) {
                    this.$Message.warning("请填写章节排序");
                    return false;
                }
                if(!param.description) {
                    this.$Message.warning("请填写章节描述");
                    return false;
                }
                if(!param.showedUrl) {
                    this.$Message.warning("请上传章节封面图片");
                    return false;
                }
                if(!(/(^[1-9]\d*$)/.test(param.seq))) {
                    this.$Message.warning("章节排序请输入正整数");
                    return false;
                }
                editChapter(param).then(res=>{
                    if(res.data.code==200) {
                        this.$Message.success("添加成功");
                        this.$emit("close-box",false);
                        this.$refs.formData.resetFields();
                        this.$refs.chapterImg.uploadList = [];
                        this.$parent.$options.parent.handleGetCourse(this.$route.query.courseId,false);
                    }
                });
            },
            handleCancle() {
                this.$refs.formData.resetFields();
                this.$refs.chapterImg.uploadList = [];
                this.$parent.$options.parent.newChapter=false;
            },
            getImg(d) {
                this.attachmentList = d;
            },
            returnImg(d) {
                this.formData.showedUrl = d.url;
            },
            saveAttachmentList() {
                this.attachmentList.forEach((item,index)=>{
                    let param = {};
                    param.chapterId = this.$route.query.courseId;
                    param.seq = index+1;
                    param.enabled = true;
                    param.topSide = 50;
                    param.leftSide = 50;
                    param.path = item.url;
                    // saveAttachment(param).then(res=>{
                    //     console.log(res);
                    // });
                });
            },
          }
        };
    </script>

    <style lang="less" scoped>
        img{
            display: block;
            width: 100%;
            height: 100%;
        }
        .img_zone{
            margin: 0 0 20px 100px;
        }
        .img_button{
            display: flex;
            align-items: center;
            position: absolute;
            width: 25%;
        }
        .img_button>img{
            width: 30% !important;
        }
        .img_button>.back{
            margin-right: 10px;
            width: 20% !important;
        }
        .mask{
            position:absolute;
            z-index: 100;
            width: 100%;
            height: 100%;
            background: transparent;
        }
    </style>
