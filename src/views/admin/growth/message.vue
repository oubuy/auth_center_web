<template>
    <div>
        <Form :model="formData" :label-width="100">
            <FormItem label="标题">
                <Input v-model="formData.title" style="width:350px"></Input>
            </FormItem>
            <FormItem label="课程:">
            <Select v-model="formData.courseId" style="width:350px">
                <Option v-for="item in courseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>
            <FormItem label="对象类型">
              <Select v-model="formData.target" style="width:350px">
                  <Option value="全体成员">全体成员</Option>
                  <Option value="已报名">已报名</Option>
                  <Option value="未报名">未报名</Option>
                  <Option value="目标对象">目标对象</Option>
              </Select>
            </FormItem>
            <FormItem label="描述">
                <Input v-model="formData.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述" style="width:350px"/>
            </FormItem>
            <FormItem label="目标对象">
                <Input v-model="formData.toUsers" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入目标对象，用英文,隔开" style="width:350px"/>
            </FormItem>
            <FormItem label="公告图片">
              <upload-img ref="uploadPicUrl" :quantity="1" style="display: inline-block;"></upload-img>
              <div style="display: inline-block; position:absolute; margin-left: 78px;">请上传公告图片</div>
            </FormItem>
            <FormItem>
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading">确定</Button>
            <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
        </FormItem>
        </Form>
    </div>
</template>

<script>
import {  
  saveGrowth,
  addQixinMessage,
  allCourses 
  } from "@/api/growth.js";
import uploadImg from "@/views/admin/growth/upload-img";
export default {
  data() {
    return {
      formData: {
        id: "",
        title: "",
        description: "",
        code: "",
        name: "",
        toUsers: "",
        courseId: "",
        target: "",
        type: ""
      },
      headTitle: "",
      saveBtnLoading: false,
      courseList: [],
    };
  },
  components: {
    uploadImg
  },
  mounted() {
    this.getCourseList();
    let breadcrumbs = [
      { name: "公告管理" },
      { name: "发送公告" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    
  },
  
  methods: {
    getCourseList() {
        allCourses().then(response => {
          if (response.data.code == 200) {
            let courseDataArr = response.data.data;
            courseDataArr.forEach(item => {
              let obj = {};
              obj.value = item.id.toString();
              obj.label = item.type + ":" +item.name;
              this.courseList.push(obj);
            });
          }
        });
    },

    handleSubmit() {
      if(this.formData.title == ''){
        this.$Message.warning("请填写标题");
        return;
      }
      if(this.formData.courseId == ''){
        this.$Message.warning("请选择课程");
        return;
      }
      if(this.formData.description == ''){
        this.$Message.warning("请填写描述内容");
        return;
      }
      if(this.formData.target == '' && this.formData.toUsers == ''){
        this.$Message.warning("请选择对象类型或手动填写目标对象");
        return;
      }
      this.saveBtnLoading = true;
      let param = {};
      param.title = this.formData.title;
      param.courseId = this.formData.courseId;
      param.target = this.formData.target;
      param.description = this.formData.description;
      param.toUsers = this.formData.toUsers;
      let picUrlUploadList = this.$refs.uploadPicUrl.getUploadList();
      if (picUrlUploadList.length > 0) {
          this.formData.picUrlUploadList = picUrlUploadList[0].url;
      }
      param.picUrl = this.formData.picUrlUploadList;
      //保存
        addQixinMessage(param).then(res => {
       
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            // this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
    },
    handleCancle() {
      this.$router.go(-1);
    },
    
  }
};
</script>
