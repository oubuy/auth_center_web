<template>
    <div style="padding-top: 20px;" >
        <draggable v-model="formData" @update="datadragEnd" @start="handleStart" @end="handleEnd" v-bind="dragOptions">
            <transition-group type="transition" :name="'flip-list'">
                <Form class="drag-zone" v-for="(item,index) in formData" :model="item" :rules="ruleValidate" :key="index" :label-width="100" style="position:relative;width:1000px;margin-top: 20px;border:1px solid #2d8cf0;padding: 20px 0;cursor: move;">
                    <div @click.stop="dragFn" class="outer_box">
                        <div class="detial-box" style="display: flex;align-items: center;">
                            <div class="left_box">
                                <FormItem label="章节名称：" prop="name">
                                    <Input v-model="item.name" style="width:350px" @on-focus="focuFlag=true" @on-blur="focuFlag=false" ></Input>
                                </FormItem>
                                <FormItem label="章节代码：" prop="code">
                                    <Input v-model="item.code" style="width:350px"  @on-focus="focuFlag=true" @on-blur="handleBlur(index)"  ></Input>
                                </FormItem>
                                <FormItem label="章节排序：" prop="seq">
                                    <Input v-model="seqArr[index]" style="width:350px"  @on-focus="focuFlag=true" @on-blur="focuFlag=false"  ></Input>
                                </FormItem>
                                <FormItem prop="description" label="章节描述：">
                                    <Input  v-model="item.description" type="textarea"  @on-focus="focuFlag=true" @on-blur="focuFlag=false"   :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注" style="width:350px"/>
                                </FormItem>
                            </div>
                            <div class="right_box" style="margin-left: 46px;">
                                <FormItem label="">
                                    <div class="chapter-upload-list no-drag" v-for="(child,cIndex) in item.chapterList">
                                        <template v-if="child.status === 'finished'">
                                            <img :src="child.url + '?x-oss-process=image/resize,m_fixed,h_250,w_300'" >
                                            <div class="chapter-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="handleChapterImgModal(index,child.url, '交互屏头像')"></Icon>
                                                <Icon type="ios-trash-outline" @click.native="handleChapterRemove(cIndex,index)"></Icon>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <Progress v-if="child.showProgress" :percent="child.percentage" hide-info></Progress>
                                        </template>
                                    </div>
                                    <upload-img ref="uploadAttachmentOne" prop="chapterList" v-show="item.chapterList.length<1" :quantity="10" :index="index" @get-img="getChapterImg" style="display: inline-block;"></upload-img>
                                </FormItem>
                            </div>
                        </div>
                        
                        <div class="upload-box" style="text-align: left;margin-left: 50px;">
                            <div class="upload-list no-drag" v-for="(imgItem,cIndex) in item.attachments"  v-if="item.attachments[cIndex].enabled">
                                <template v-if="imgItem.status === 'finished'">
                                    <img :src="imgItem.path + '?x-oss-process=image/resize,m_fixed,h_100,w_100'" :id=imgItem.id>
                                    <div class="upload-list-cover">
                                        <Icon type="ios-eye-outline" @click.native="handleImgModal(index,imgItem.path, '交互屏头像')"></Icon>
                                        <Icon type="ios-paper-outline" @click.native="chapterImgEdit(imgItem,cIndex,index)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(imgItem,cIndex,index)"></Icon>
                                    </div>
                                </template>
                                <template v-else>
                                    <Progress v-if="imgItem.showProgress" :percent="imgItem.percentage" hide-info></Progress>
                                </template>
                            </div>
                            <chapter-img ref="uploadAttachmentTwo" v-show="item.attachments.length<10" @return-img="getImg" :quantity="10" :attachments="item.attachments" :index="index" style="display: inline-block;margin: 20px 0 0 50px;"></chapter-img>
                        </div>
                        <div style="text-align: left;margin: 10px 0 0 50px;" v-if="item.attachments.length"><Button class="img-sort" @click="attachmentsSort(item)">附件排序</Button></div>
                        <Button class="no-drag" type="primary" @click="handleSubmit(index)" :loading="saveBtnLoading" style="width: 90%;margin-top: 20px;">保存</Button>
                    </div>
                    <div style="position: absolute;top:-13px;right:-13px;background: rgba(0,0,0,.6);border-radius: 50%;cursor: pointer;" @click="deleteChapter(item,index)"><Icon type="ios-close"></Icon></div>
                </Form>
            </transition-group>
        </draggable>
        <Modal v-model="imgEdit" title="图片编辑" footer-hide scrollable width="1000">
            <img-edit @cancle-edit="cancleEdit" :imgData='imgData' :totalPage='totalPage'></img-edit>
        </Modal>
        <Modal v-model="imgSort" title="附件排序" footer-hide scrollable width="1200">
            <div style="display: flex;justify-content: center;">
                <draggable v-model="attachmentsArr" v-bind="imgDragOptions">
                    <transition-group type="transition">
                        <div class="attachments-list" v-for="(item,index) in attachmentsArr" :key="index" style="display: inline-block;cursor:move;margin: 0 20px 20px;">
                            <div style="width:240px;height:108px;position: relative;" class="attachments-item">
                                <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                                <div class="attachments-list-cover" style="width: 100%;align-items: center;justify-content: center;">
                                    <Icon type="ios-eye-outline" @click.native="handleImgModal(index,item.path, '交互屏头像')"></Icon>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
            </div>
            <div style="margin: 50px 0 0 0;text-align: center;">
                <Button type="primary" style="margin: 0 10px 0 0;" @click="attachmentsSortSave">保存</Button>
                <Button @click="imgSort=false;">取消</Button>
            </div>
        </Modal>
        <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>

<script>
import { editChapter, saveAttachment, deleteChapter, courseInfo } from "@/api/course.js";
import uploadImg from "@/views/admin/course/upload-url-img";
import chapterImg from "./chapter_img"
import imgEdit from "./chapter_img_edit"
import draggable from 'vuedraggable'
import aletTip from "@/components/alertTip.vue";
export default {
  props: {
      chapterList: {
          type: Array,
          default: []
      },
      seqArr: {
          type: Array,
          default: []
      }
  },
  data() {
    const validateCodeCheck = (rule, value, callback) => {
        var flag = true;
        if(!value) {
            callback(new Error('请填写章节代码'));
        }else {
            for(var i=0;i<this.formData.length;i++) {
                if(i!=this.blurIndex&&value==this.formData[i].code) {
                    flag = false;
                    break;
                }
            }
            if(flag) {
                callback();
            }else {
                callback(new Error('该章节代码已存在'));
                flag = true;
            }
        }
    };
    return {
        formData: [],
        attachmentsArr: [],
        imgData:{},
        saveBtnLoading: false,
        drag: false,
        imgEdit: false,
        imgSort: false,
        totalPage: '',
        index: '',
        disabled: false,
        focuFlag: false,
        courseId: this.$route.query.courseId,
        blurIndex: '',
        alertShow: false,
        deleteData: {},
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
                    trigger: 'blur',
                    validator: validateCodeCheck
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
        alertTipParams: {
            headTip: "删除",
            titleTip: "是否确认删除当前章节？"
        },
    };
  },
  components: {
    uploadImg,
    chapterImg,
    draggable,
    imgEdit,
    aletTip
  },
  created() {

  },
  mounted() {
    //为了防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 150,
        group: "description",
        ghostClass: "ghost",
        handle: ".drag-zone",
        filter: ".no-drag",
        disabled: this.disabled
      };
    },
    imgDragOptions() {
      return {
        animation: 150,
        group: "description",
        ghostClass: "ghost",
        filter: ".no-drag",
      };
    },
  },
  methods: {
    dragFn(e) {
        if(this.focuFlag) this.disabled = true;
        else this.disabled = false;
    },
    handleSubmit(i) {
        let param = {};
        let index = i;
        param.id = this.formData[index].id;
        param.courseId = this.formData[index].courseId;
        param.code = this.formData[index].code;
        param.name = this.formData[index].name;
        param.seq = this.seqArr[index];
        param.description = this.formData[index].description;
        if(!this.formData[index].chapterList.length) {
            this.$Message.warning("请上传章节封面图片");
            return false;
        }
        if(!param.name) {
            this.$Message.warning("请填写章节名称");
            return false;
        }
        if(!param.code) {
            this.$Message.warning("请填写章节代码");
            return false;
        }else {
            var flag = true
            for(var i=0;i<this.formData.length;i++) {
                if(param.code==this.formData[i].code&&index!=i) {
                    this.$Message.warning("该章节代码已存在");
                    flag = false;
                    break;
                }
            }
            if(!flag) return false;
            else flag = true;
        }
        if(!param.seq&&param.seq!=0) {
            this.$Message.warning("请填写章节排序");
            return false;
        }
        if(!param.description) {
            this.$Message.warning("请填写章节描述");
            return false;
        }
        if(!(/(^[1-9]\d*$)/.test(param.seq))) {
            this.$Message.warning("章节排序请输入正整数");
            return false;
        }
        param.showedUrl = this.formData[index].chapterList[0].url;
        editChapter(param).then(res=>{
            if(res.data.code==200) {
                this.$Message.success("保存成功");
                this.$parent.handleGetCourse(this.courseId,false);
            }
        });
    },
    handleStart(e) {
        let formData = this.formData[e.oldIndex];
        if(!formData.name||!formData.code||!this.seqArr[e.oldIndex]||!formData.description) {
            this.disabled = true;
            this.$Message.warning("请完整填写信息后再进行拖拽排序");
        }
    },
    datadragEnd (evt) {
        evt.preventDefault();
        this.$refs.uploadAttachmentOne[evt.oldIndex].handleReset();
        this.$refs.uploadAttachmentOne[evt.newIndex].handleReset();
        this.$refs.uploadAttachmentTwo[evt.oldIndex].handleReset();
        this.$refs.uploadAttachmentTwo[evt.newIndex].handleReset();
    },
    handleEnd(e) {
        this.drag = false;
        if(e.newIndex-e.oldIndex==0) {
            return false;
        }else if(e.newIndex>e.oldIndex){
            for(var i=e.oldIndex;i<e.newIndex+1;i++) {
                this.handleSubmit(i);
            }
        }else if(e.newIndex<e.oldIndex) {
            for(var i=e.newIndex;i<e.oldIndex+1;i++) {
                this.handleSubmit(i);
            }
        }
    },
    cancleEdit(d){
        this.imgEdit = d;
    },
    getImg(d) {
        this.index = d.index;
        let obj = {};
        obj.chapterId = this.formData[this.index].id;
        obj.enabled = true;
        obj.topSide = 90;
        obj.leftSide = 38;
        obj.path = d.url;
        obj.uid = d.uid;
        obj.status = "finished";
        this.formData[this.index].attachments.push(obj);
        let attachments = this.formData[this.index].attachments;
        attachments = attachments.sort(this.compare("uid"));
        for(var i=0;i<attachments.length;i++) {
            obj.seq = i+1;
            this.formData[this.index].attachments[i].seq = obj.seq;
        }
        let param = {};
        param.id = "";
        param.chapterId = obj.chapterId;
        param.seq = obj.seq;
        param.enabled = obj.enabled;
        param.topSide = obj.topSide;
        param.leftSide = obj.leftSide;
        param.path = obj.path;
        saveAttachment(param).then(res=>{
            if(res.data.code==200) {
                this.$parent.handleGetCourse(this.courseId,false);
            }
        });
    },
    compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },
    saveAttachment(i) {
        this.formData[i].attachments.forEach((item,index)=>{
            let param = {};
            if(item.id) param.id=item.id;
            else param.id = "";
            param.chapterId = this.formData[i].id;
            param.seq = item.seq;
            param.enabled = item.enabled;
            param.topSide = item.topSide;
            param.leftSide = item.leftSide;
            param.path = item.path;
            saveAttachment(param).then(res=>{

            });
        });
    },
    getChapterImg(d) {
        this.index = d.index;
        d.uploadList.forEach(item=>{
            this.formData[this.index].chapterList.push(item);
        });
        this.formData=[...this.formData];
    },
    chapterImgEdit(d,i,index) {
        var $index = i;
        this.imgData = d;
        this.imgData.index = index;
        this.imgData.imgIndex = $index;
        this.imgEdit = true;
        this.totalPage = this.formData[index].attachments.length;
    },
    handleChapterImgModal(index,imgUrl) {
        this.$refs.uploadAttachmentOne[index].handleImgModal(imgUrl);
    },
    handleChapterRemove(index,parentIndex) {
        this.formData[parentIndex].chapterList.splice(index, 1);
        this.formData=[...this.formData];
        this.$refs.uploadAttachmentOne[parentIndex].handleReset();
    },
    handleImgModal(index,imgUrl) {
        this.$refs.uploadAttachmentTwo[index].handleImgModal(imgUrl);
    },
    handleRemove(d,index,parentIndex) {
        let param = {};
        param.id = d.id;
        param.chapterId = this.formData[parentIndex].id;
        param.seq = d.seq;
        param.enabled = false;
        param.topSide = d.topSide;
        param.leftSide = d.leftSide;
        param.path = d.path;
        saveAttachment(param).then(res=>{
            this.$Message.success("删除成功");
            this.$parent.handleGetCourse(this.courseId,false);
        });
    },
    handleBlur(i) {
        this.blurIndex = i;
        this.focuFlag=false;
    },
    attachmentsSort(d) {
        if(!d.attachments.length) {
            this.$Message.warning("请先保存附件");
            return;
        }
        this.attachmentsArr = d.attachments;
        this.imgSort = true;
    },
    attachmentsSortSave() {
        this.attachmentsArr.forEach((item,index)=>{
            let param = {};
            if(item.id) param.id=item.id;
            else param.id = "";
            param.chapterId = item.chapterId;
            param.seq = index+1;
            param.enabled = item.enabled;
            param.topSide = item.topSide;
            param.leftSide = item.leftSide;
            param.path = item.path;
            saveAttachment(param).then(res=>{});
        });
        this.imgSort = false;
        this.$Message.success("保存成功");
        this.$parent.handleGetCourse(this.courseId,false);
    },
    handleCloseTip(data) {
        if(data=="true") {
            let param = {};
            param.chapterId = this.deleteData.chapterId;
            deleteChapter(param).then(res=>{
                if(res.data.code==200) {
                    this.$Message.success("删除成功");
                    this.seqArr.splice(this.deleteData.index,1);
                    this.$parent.handleGetCourse(this.courseId,false);
                }else {
                    this.$Message.warning("删除失败");
                }
                this.alertShow = false;
            }).catch(err=>{
                this.$Message.warning("删除失败");
                this.alertShow = false;
            })
        }else {
            this.alertShow = false;
        }
    },
    deleteChapter(data,index) {
        this.deleteData.chapterId = data.id;
        this.deleteData.index = index;
        this.alertShow = true;
    }
  },
  watch: {
      chapterList: {
        handler:function(newVal,oldVal) {
            this.formData = newVal;
        },
        deep: true
      },
  },
};
</script>

<style lang="less" scoped>
    .chapter_list{
        margin-top: 20px;
    }
    .ghost {
        opacity: 1;
    }
    .upload-list {
        display: inline-block;
        width: 80px;
        height: 80px;
        text-align: center;
        line-height: 80px;
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

    .upload-list-cover,
    .attachments-list-cover {
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
    .attachments-item:hover .attachments-list-cover {
        display: flex;
    }
    .upload-list-cover i,
    .attachments-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .attachments-list-cover i{
        font-size: 28px;
    }
    .chapter-upload-list {
        position: relative;
        display: inline-block;
        /* width: 300px;
        height: 250px; */
        text-align: center;
        line-height: 250px;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
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
        top: -32px;
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

    form i{
        font-size: 26px;
        color: #fff;
    }
</style>
