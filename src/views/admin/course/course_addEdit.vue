<template>
    <div>
        <Form :model="formData" ref="formData" :label-width="100" :rules="ruleValidate" style="display: flex;align-items: center;">

            <div class="left_box">
              <FormItem label="教程名称：" porp="name">
                <Input v-model="formData.name" style="width:350px"></Input>
              </FormItem>
              <FormItem label="排序：" prop="seq">
                  <Input v-model="formData.seq" style="width:350px"></Input>
              </FormItem>
              <FormItem label="启用状态：" prop="enabled">
                <Select v-model="formData.enabled" style="width:350px">
                    <Option value="1">启用</Option>
                    <Option value="0">停用</Option>
                </Select>
              </FormItem>
              <FormItem prop="description" label="备注：">
                  <Input v-model="formData.description" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注" style="width:350px"/>
              </FormItem>
            </div>

            <div class="right_box">
              <FormItem label="">
                <upload-img2 ref="uploadAttachment" :quantity="10" style="display: inline-block;" @return-img="getImg"></upload-img2>
              </FormItem>
            </div>

        </Form>
        <div class="button_box" style="text-align: left;">
          <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading" style="margin-left: 30px;">保存</Button>
          <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
        </div>
        <chapter-list :chapterList="chapterList" :seqArr="seqArr"></chapter-list>
        <div style="text-align: left;"><Button type="dashed" style="width: 1000px;height: 40px;margin-top: 30px;cursor: pointer;" @click="creatChapter">新章节</Button></div>
        <Modal v-model="newChapter" title="新增教程" footer-hide scrollable width="1100">
            <new-chapter @close-box="closeBox"></new-chapter>
        </Modal>
    </div>
</template>

<script>
import { courseInfo, updateCourse, addCourse } from "@/api/course.js";
import { menuTree } from "@/api/menu";
import uploadImg from "@/views/admin/course/upload-url-img";
import uploadImg2 from "@/views/admin/course/upload-url-img2";
import chapterList from "./chapter_edit"
import newChapter from './new_chapter'
export default {
  data() {
    return {
      formData: {
        id: "",
        name: "",
        menuId: "",
        enabled: "1",
        systemId: "",
        heightMenu: [], //上级菜单
        description: "",
        showedUrl: null,
        attachmentsData: [],
        sort: ''
      },
      ruleValidate: {
        name: [
          {
            type:'string',
            required: true,
            message: "教程名称不能为空",
            trigger: "blur"
          }
        ],
        description:[
          {
            type: 'string',
            max: 200,
            message: '不能超过200个字符',
            trigger: 'blur'
          }
        ],
        showedUrl: [
          {
            type:'string',
            required: true,
            message: "菜单效果图不能为空",
            trigger: "blur"
          }
        ],
        attachmentsData: [
          {
            required: true,
            message: "教程内容不能为空",
            type: "array",
            trigger: "change"
          }
        ],
      },
      headTitle: "",
      newChapter: false,
      saveBtnLoading: false,
      chapterList: [],
      seqArr: []
    };
  },
  components: {
        uploadImg,
        uploadImg2,
        chapterList,
        newChapter
    },
  mounted() {
    if (this.$route.query.courseId) {
      this.headTitle = "编辑";
      this.handleGetCourse(this.$route.query.courseId,true);
    } else {
      this.headTitle = "新增";
    }

    let breadcrumbs = [
      { name: "教程管理" },
      { name: this.headTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleSubmit() {
      let param = {};
      param.id = this.formData.id;
      param.name = this.formData.name;
      param.seq = this.formData.seq;
      if(this.formData.enabled == "1"){
        param.enabled = true;
      }else if(this.formData.enabled == "0"){
        param.enabled = false;
      }
      param.description = this.formData.description;
      param.showedUrl = this.formData.showedUrl;
      if(!param.name) {
          this.$Message.warning("请填写教程名称");
          return false;
      }
      if(!param.seq) {
          this.$Message.warning("请填写教程排序");
          return false;
      }
      if(!(/(^[1-9]\d*$)/.test(param.seq))) {
          this.$Message.warning("请输入正整数");
          return false;
      }
      if(!param.showedUrl) {
          this.$Message.warning("请上传教程封面图片");
          return false;
      }
      this.saveBtnLoading = true;
      if (this.$route.query.courseId) {
        //更新
        updateCourse(param).then(res => {

          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
      } else {
        addCourse(param).then(res => {
           if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
      }
    },
    closeBox(d){
      this.newChapter = d;
    },
    getImg(d) {
      this.formData.showedUrl = d.url;
    },
    handleCancle() {
      this.$router.go(-1);
    },
    // 处理tree数据
    getTree(tree) {
      let arr = [];
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.label = item.name;
          obj.value = item.id;
          obj.title = item.name;
          obj.id = item.id;
          obj.parentId = item.parentId; // 其他你想要添加的属性
          obj.expand = false;
          obj.children = this.getTree(item.children); // 递归调用
          arr.push(obj);
        });
      }
      return arr;
    },
    compare(property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },
    creatChapter() {
      let courseId = this.$route.query.courseId;
      if(!courseId) {
        this.$Message.warning("该教程未保存，不能新增章节");
        return;
      }
      this.newChapter=true
    },
    handleGetCourse(courseId,flag) {
      courseInfo({ courseId: courseId }).then(res => {
        if (res.data.code == 200) {
          let course_info = res.data.data;
          this.seqArr = [];
          this.formData.id = course_info.id;
          this.formData.name = course_info.name;
          this.formData.seq = course_info.seq;
          if(course_info.enabled == true){
            this.formData.enabled = "1";
          }else if(course_info.enabled == false){
            this.formData.enabled = "0";
          }
          this.formData.description = course_info.description;
          if(course_info.showedUrl&&flag){
            this.$refs.uploadAttachment.initUploadList2(course_info.showedUrl);
            this.formData.showedUrl = course_info.showedUrl;
          }
          this.chapterList = [];
          course_info.chapters.forEach(item=>{
            this.chapterList.push(item);
          });
          this.chapterList = this.chapterList.sort(this.compare("seq"));
          for(var i=0;i<this.chapterList.length;i++) {
            var num = 0;
            let chapterList = [];
            let attachments = [];
            let obj = {
                status: "finished",
                url: '',
            }
            this.seqArr.push(this.chapterList[i].seq);
            this.chapterList[i].chapterList=chapterList;
            if(this.chapterList[i].showedUrl) {
                obj.url=this.chapterList[i].showedUrl;
                this.chapterList[i].chapterList.push(obj);
            }
            this.chapterList[i].attachments = this.chapterList[i].attachments.sort(this.compare("seq"));
            for(var j=0;j<this.chapterList[i].attachments.length;j++) {
              this.chapterList[i].attachments[j].status = "finished";
              if(this.chapterList[i].attachments[j].enabled) {
                num = num+1;
                attachments.push(this.chapterList[i].attachments[j]);
              }
            }
            this.chapterList[i].num = num;
            this.chapterList[i].attachments = attachments;
          }
        }
      });
    }
  }
};
</script>
