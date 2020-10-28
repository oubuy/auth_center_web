<template>
    <div>
        <Form :model="formData" :label-width="100" ref="formData">
            <FormItem label="页码：" prop="seq">
            <Input v-model="formData.seq" style="width:350px" disabled></Input>
            </FormItem>
            <FormItem label="按钮坐标-top：" prop="topSide">
                <Input v-model="formData.topSide" style="width:350px"></Input>
            </FormItem>
            <FormItem label="按钮坐标-left：" prop="leftSide">
                <Input v-model="formData.leftSide" style="width:350px"></Input>
            </FormItem>
            <div class="img_zone">
                <div>拖动图片中按钮区域设置按钮位置：</div>
                <div style="width: 650px;height:400px;margin-top: 20px;position: relative;">
                    <img :src="formData.path" alt="">
                    <div class="img_button" :style="{top:formData.topSide+'%',left:formData.leftSide+'%'}" v-show="formData.showButton" draggable="true" v-drag="formData">
                        <img src="@/assets/guide/back.png" alt="" class="back" v-show="imgData.imgIndex+1>1">
                        <img src="@/assets/guide/next_step.png" alt="" v-show="imgData.imgIndex+1<totalPage">
                        <img src="@/assets/guide/skip.png" alt="" style="margin-left:10px;" v-show="imgData.imgIndex+1<totalPage">
                        <img src="@/assets/guide/finish.png" alt="" style="margin-left:10px;" v-show="imgData.imgIndex+1==totalPage">
                        <div class="mask"></div>
                    </div>
                </div>
            </div>
        </Form>
        <div class="button_box" style="text-align: left;margin-left: 70px;">
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading" style="margin-left: 30px;">保存</Button>
            <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
        </div>
    </div>
</template>
    
<script>
    import { saveAttachment } from "@/api/course.js";
    export default {
      data() {
        return {
          formData: {
              topSide: '',
              leftSide: '',
              seq: '',
              courseId: '',
              id: '',
              enabled: '',
              showButton: false,
          },
          saveBtnLoading: false,
          courseId: this.$route.query.courseId,
        };
      },
      props:['imgData','totalPage'],
      mounted() {
        this.formData.showButton = true;
      },
      directives: {
        drag: {
            inserted:function(el,binding){
                el.onmousedown=function(e){
                    e.stopPropagation();
                    let disx = e.pageX - el.offsetLeft;
                    let disy = e.pageY - el.offsetTop;
                    document.onmousemove = function (e){
                        e.preventDefault();
                        let parentWidth = el.parentNode.clientWidth;
                        let parentHeight = el.parentNode.clientHeight;
                        let overX = parentWidth-el.clientWidth;
                        let overY = parentHeight-el.clientHeight;
                        if(e.pageX - disx>overX) el.style.left = overX+'px';
                        else if(e.pageX - disx<0) el.style.left = '0';
                        else el.style.left = e.pageX - disx+'px';
                        if(e.pageY - disy>overY) el.style.top= overY+'px';
                        else if(e.pageY - disy<0) el.style.top= '0';
                        else el.style.top = e.pageY - disy+'px';
                    }
                    document.onmouseup = function(){
                        e.stopPropagation();
                        document.onmousemove = document.onmouseup = null;
                        let width = e.target.parentNode.parentNode.clientWidth;
                        let height = e.target.parentNode.parentNode.clientHeight;
                        var top = e.target.parentNode.offsetTop;
                        var left = e.target.parentNode.offsetLeft;
                        top = (top/height*100).toFixed(2);
                        left = (left/width*100).toFixed(2);
                        binding.value.topSide = top;
                        binding.value.leftSide = left;
                    }
                }
            }
        }
      },
      methods: {
        handleSubmit() {
            let param = {};
            param.id = this.formData.id;
            param.chapterId = this.formData.chapterId;
            param.seq = this.formData.seq;
            param.enabled = this.formData.enabled;
            param.topSide = this.formData.topSide;
            param.leftSide = this.formData.leftSide;
            param.path = this.formData.path;
            saveAttachment(param).then(res=>{
                if(res.data.code==200) {
                    this.$Message.success("保存成功");
                    this.$parent.$parent.$parent.handleGetCourse(this.courseId,false);
                    this.handleCancle();
                }
            });
        },
        handleCancle() {
            let val = this.imgData;
            this.$emit("cancle-edit",false);
            this.formData.id = val.id;
            this.formData.chapterId = val.chapterId;
            this.formData.seq = val.seq;
            this.formData.enabled = val.enabled;
            this.formData.topSide = val.topSide;
            this.formData.leftSide = val.leftSide;
            this.formData.path = val.path;
            this.formData.showButton = true;
        }
      },
      watch: {
        imgData:{
            handler:function(val,oldval){
                this.formData.id = val.id;
                this.formData.chapterId = val.chapterId;
                this.formData.seq = val.seq;
                this.formData.enabled = val.enabled;
                this.formData.topSide = val.topSide;
                this.formData.leftSide = val.leftSide;
                this.formData.path = val.path;
                this.formData.showButton = true;
            },
            deep:true
        }
      },
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
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
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