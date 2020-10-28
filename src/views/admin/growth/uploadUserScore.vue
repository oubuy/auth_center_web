<template>
  <div>
    <ImportFile :titleList="titleList" :downloadUrl="downloadUrl" :start="start" @handleSubmit="handleSubmit"></ImportFile>
  </div>
</template>


<script>
import { importUserScore } from "@/api/growth.js";
  import ImportFile from '../../../components/importFile'
  export default {
    data() {
      return {
        // titleList: [{
        //   name: '课程',
        //   value: 'course'
        // },{
        //   name: '姓名',
        //   value: 'name'
        // },{
        //   name: '手机号',
        //   value: 'telephone'
        // }],
        titleList: [{
          name: '编号',
          value: 'num',
          key: '编号',
          isNeed: false
        },{
          name: '组别',
          value: 'team',
          key: '组别',
          isNeed: false
        },{
          name: '学员',
          value: 'student',
          key: '学员',
          isNeed: true
        },{
          name: '联系方式',
          value: 'telephone',
          key: '联系方式',
          isNeed: true
        },{
          name: '学习项目',
          value: 'project',
          key: '学习项目',
          isNeed: false
        },{
          name: '课程',
          value: 'course',
          key: '课程',
          isNeed: true
        },{
          name: '基础分',
          value: 'basicPoint',
          key: '基础分',
          isNeed: false
        },{
          name: '缺勤',
          value: 'absent',
          key: '__EMPTY',
          isNeed: true
          },{
          name: '备注1',
          value: 'des1',
          key: '__EMPTY_1',
          isNeed: true
        },{
          name: '心得',
          value: 'summary',
          key: '__EMPTY_2',
          isNeed: true
          },{
          name: '备注2',
          value: 'des2',
          key: '__EMPTY_3',
          isNeed: true
        },{
          name: '个人奖',
          value: 'personReward',
          key: '额外分',
          isNeed: true
        },{
          name: '备注3',
          value: 'des3',
          key: '__EMPTY_4',
          isNeed: true
        },{
          name: '团队奖',
          value: 'teamAward',
          key: '__EMPTY_5',
          isNeed: true
        },{
          name: '备注4',
          value: 'des4',
          key: '__EMPTY_6',
          isNeed: true
        },{
          name: '担任组长',
          value: 'leader',
          key: '__EMPTY_7',
          isNeed: true 
        },{
          name: '备注5',
          value: 'des5',
          key: '__EMPTY_8',
          isNeed: true
        },{
          name: '其他',
          value: 'others',
          key: '__EMPTY_9',
          isNeed: true
        },{
          name: '备注6',
          value: 'des6',
          key: '__EMPTY_10',
          isNeed: true
        },{
          name: '总分',
          value: 'holePoints',
          key: '__EMPTY_11',
          isNeed: false
        // },{
        //   name: '备注',
        //   value: 'mark',
        //   key: '__EMPTY_6',
        //   isNeed: true
        }],
        downloadUrl: 'https://oceano-center.oss-cn-hangzhou.aliyuncs.com/growthCourse/importUserScore/importUserScore_model.xlsx',
        start: 'A2:',
        dataList: []
      }
    },
    components: {
      ImportFile
    },
    methods: {
      handleSubmit(val) {
        console.log(val);
        this.dataList = [];
        if(val[0].course != this.$route.query.courseName){
          this.$Message.warning("课程不匹配");
          return;
        }
        for(let i=0;i<val.length;i++) {
          let obj = {};
          obj.no = val[i].num;
          obj.name = val[i].student;
          obj.mobile = val[i].telephone;
          //obj.course = val[i].course;
          obj.queqinScore = val[i].absent;
          obj.queqinDes = val[i].des1;
          obj.xindeScore = val[i].summary;
          obj.xindeDes = val[i].des2;
          obj.gerenjiangScore = val[i].personReward;
          obj.gerenjiangDes = val[i].des3;
          obj.tuanduijiangScore = val[i].teamAward;
          obj.tuanduijiangDes = val[i].des4;
          obj.zuzhangScore = val[i].leader;
          obj.zuzhangDes = val[i].des5;
          obj.othersScore = val[i].others;
          obj.othersDes = val[i].des6;
          // obj.description = val[i].mark;
          this.dataList.push(obj);
        }
        let params = {};
        params.courseId = this.$route.query.courseId;
        params.importUserScoreList = this.dataList;
        importUserScore(params).then(response => {
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.$router.go(-1);
          }
        });
        console.log(this.dataList)
      }
    }
  }
</script>


<style>
</style>
