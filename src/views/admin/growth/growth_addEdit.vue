<template>
    <div>
        <Form :model="formData" :label-width="100">
            <FormItem label="课程编码">
                <Input v-model="formData.code" disabled style="width:350px"></Input>
            </FormItem>
             <FormItem label="课程名称">
                <Input v-model="formData.name" style="width:350px"></Input>
            </FormItem>
            <FormItem label="课程类型">
              <Select v-model="formData.type" style="width:200px">
                  <Option value="读书慧">读书慧</Option>
                  <Option value="兴趣班">兴趣班</Option>
                  <Option value="扬帆课堂">扬帆课堂</Option>
                  <Option value="一书一课">一书一课</Option>
                  <Option value="运动俱乐部">运动俱乐部</Option>
                  <Option value="MBA专场培训会">MBA专场培训会</Option>
                  <Option value="学习官特训营">学习官特训营</Option>
                  <Option value="职场学院">职场学院</Option>
                  <Option value="主题专场培训">主题专场培训</Option>
              </Select>
            </FormItem>
            <FormItem label="基础分值">
                <Input v-model="formData.score" style="width:350px"></Input>
            </FormItem>
            <FormItem label="课程形式">
              <Select v-model="formData.form" style="width:200px">
                  <Option value="外聘专家莅临落地集中开课">外聘专家莅临落地集中开课</Option>
                  <Option value="外聘嘉宾/学习官带领">外聘嘉宾/学习官带领</Option>
                  <Option value="外聘嘉宾领读，线上打卡分享，线下落地总结">外聘嘉宾领读，线上打卡分享，线下落地总结</Option>
                  <Option value="组团学习App名师课程，分享打卡">组团学习App名师课程，分享打卡</Option>
                  <Option value="学习官带领，徒步/羽毛球/兵乓球/跑步/篮球5大项目">学习官带领，徒步/羽毛球/兵乓球/跑步/篮球5大项目</Option>
                  <Option value="观看视频或专业导师、学习官主讲开课">观看视频或专业导师、学习官主讲开课</Option>
                  <Option value="外聘专业导师引导培训技能提升，仅面向学习官">外聘专业导师引导培训技能提升，仅面向学习官</Option>
                  <Option value="学习官组织专场培训">学习官组织专场培训</Option>
                  <Option value="由人资组织落地分享培训，不定期开展。">由人资组织落地分享培训，不定期开展。</Option>
                  <Option value="不定期开展。">不定期开展。</Option>
                  
              </Select>
            </FormItem>
            <FormItem label="课程地点">
                <Input v-model="formData.address" style="width:350px"></Input>
            </FormItem>
            <FormItem label="课程目的">
                <Input v-model="formData.purpose" style="width:350px"></Input>
            </FormItem>
            <FormItem label="允许报名时间">
                <DatePicker type="date" v-model="formData.openTime" @on-change="formData.openTime=$event"  :editable="false" style="width:200px"></DatePicker>
                 —— 
                <DatePicker type="date" v-model="formData.deadline" @on-change="formData.deadline=$event"  :editable="false" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="开课时间">
                <DatePicker type="datetime" v-model="formData.startedTime" @on-change="formData.startedTime=$event"  :editable="false" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="下课时间">
                <DatePicker type="datetime" v-model="formData.finishTime" @on-change="formData.finishTime=$event"  :editable="false" style="width:200px"></DatePicker>
            </FormItem>
            <FormItem label="限制人数">
                <Input v-model="formData.maxNumber" style="width:350px"></Input>
            </FormItem>
            <FormItem label="可用状态">
              <Select v-model="formData.enabled" style="width:200px">
                  <Option value="1">启用</Option>
                  <Option value="0">停用</Option>
              </Select>
            </FormItem>
            <FormItem label="建议人群">
                <Input v-model="formData.suggestedCrowd" style="width:350px"></Input>
            </FormItem>
            <FormItem label="课程关键词">
                <Input v-model="formData.courseKeyword" style="width:350px"></Input>
            </FormItem>
            <FormItem label="推荐书籍">
                <Input v-model="formData.recommendedBooks" style="width:350px"></Input>
            </FormItem>
            <FormItem label="课程年份">
                <Input v-model="formData.year" style="width:350px"></Input>
            </FormItem>
            <FormItem prop="description" label="描述">
                <Input v-model="formData.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述" style="width:350px"/>
            </FormItem>
            <FormItem label="是否开放报名">
              <Select v-model="formData.open" style="width:200px">
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
              </Select>
            </FormItem>
            <FormItem>
            <Button type="primary" @click="handleSubmit" :loading="saveBtnLoading">确定</Button>
            <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
        </FormItem>
        </Form>
    </div>
</template>

<script>
import { growthInfo, saveGrowth } from "@/api/growth.js";
export default {
  data() {
    return {
      formData: {
        id: "",
        code: "",
        name: "",
        type: "",
        minNumber: "",
        maxNumber: "",
        startedTime: "",
        finishTime: "",
        year: "",
        description: "",
        duration: "",
        enabled: "",
        seq: "",
        address: "",
        open: "",
        score: "",
        form: "",
        purpose: "",
        openTime: "",
        deadline: "",
        suggestedCrowd: "",
        courseKeyword: "",
        recommendedBooks: ""
      },
      headTitle: "",
      saveBtnLoading: false
    };
  },
  mounted() {
    if (this.$route.query.growthId) {
      this.headTitle = "编辑";
      this.handleGetVersion(this.$route.query.growthId);
    } else {
      this.headTitle = "新增";
    }

    let breadcrumbs = [
      { name: "课程管理" },
      { name: "课程维护" },
      { name: this.headTitle }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  methods: {
    handleSubmit() {
      this.saveBtnLoading = true;
      let param = {};
      param.id = this.formData.id;
      param.code = this.formData.code;
      param.name = this.formData.name;
      param.type = this.formData.type;
      if(this.formData.open == "1"){
        param.open = true;
      }else if(this.formData.open == "0"){
        param.open = false;
      }
      if(this.formData.enabled == "1"){
        param.enabled = true;
      }else if(this.formData.enabled == "0"){
        param.enabled = false;
      }
      param.minNumber = this.formData.minNumber;
      param.maxNumber = this.formData.maxNumber;
      param.description = this.formData.description;
      param.duration = this.formData.duration;
      param.seq = this.formData.seq;
      param.address = this.formData.address;
      param.year = this.formData.year;
      //iview的DatePicker时间带T带Z格式转化时间戳
      //此方法为处理不触发on-change时间的情况
      if(this.formData.startedTime != '' && this.formData.startedTime != null){
        var dateeeStart = new Date(this.formData.startedTime).toJSON();
        var startedTime = new Date(+new Date(dateeeStart)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        param.startedTime = startedTime;
      }
      if(this.formData.finishTime != '' && this.formData.finishTime != null){
         var dateeeFinish = new Date(this.formData.finishTime).toJSON();
         var finishTime = new Date(+new Date(dateeeFinish)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        param.finishTime = finishTime;
      }
      if(this.formData.openTime != '' && this.formData.openTime != null){
         var dateOpenTime = new Date(this.formData.openTime).toJSON();
         var openTime = new Date(+new Date(dateOpenTime)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        param.openTime = openTime;
      }
      if(this.formData.deadline != '' && this.formData.deadline != null){
         var dateDeadline = new Date(this.formData.deadline).toJSON();
         var deadline = new Date(+new Date(dateDeadline)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        param.deadline = deadline;
      }
      param.score = this.formData.score;
      param.form = this.formData.form;
      param.purpose = this.formData.purpose;
      param.suggestedCrowd = this.formData.suggestedCrowd;
      param.courseKeyword = this.formData.courseKeyword;
      param.recommendedBooks = this.formData.recommendedBooks;

      //保存
        saveGrowth(param).then(res => {
       
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
            this.saveBtnLoading = false;
            this.$router.go(-1);
          } else {
            this.saveBtnLoading = false;
          }
        });
    },
    handleCancle() {
      this.$router.go(-1);
    },
    handleGetVersion(growthId) {
      growthInfo({ growthId: growthId }).then(res => {
        if (res.data.code == 200) {
          let growth_info = res.data.data;
          this.formData.id = growth_info.id;
          this.formData.code = growth_info.code;
          this.formData.name = growth_info.name;
          this.formData.minNumber = growth_info.minNumber;
          this.formData.maxNumber = growth_info.maxNumber;
          this.formData.startedTime = growth_info.startedTime;
          this.formData.finishTime = growth_info.finishTime;
          this.formData.year = growth_info.year;
          this.formData.description = growth_info.description;
          this.formData.duration = growth_info.duration;
          this.formData.duration = growth_info.duration;
          this.formData.seq = growth_info.seq;
          this.formData.address = growth_info.address;
          this.formData.type = growth_info.type;
          if(growth_info.open == true){
            this.formData.open = "1";
          }else if(growth_info.open == false){
            this.formData.open = "0";
          }
          if(growth_info.enabled == true){
            this.formData.enabled = "1";
          }else if(growth_info.enabled == false){
            this.formData.enabled = "0";
          }
          this.formData.openTime = growth_info.openTime;
          this.formData.deadline = growth_info.deadline;

          this.formData.score = growth_info.score;
          this.formData.form = growth_info.form;
          this.formData.purpose = growth_info.purpose;
          this.formData.suggestedCrowd = growth_info.suggestedCrowd;
          this.formData.courseKeyword = growth_info.courseKeyword;
          this.formData.recommendedBooks = growth_info.recommendedBooks;
        }
      });
    }
  }
};
</script>
