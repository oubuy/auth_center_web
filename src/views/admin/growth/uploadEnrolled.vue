<template>
  <div>
    <ImportFile :titleList="titleList" :downloadUrl="downloadUrl" :start="start" @handleSubmit="handleSubmit"></ImportFile>
  </div>
</template>


<script>
import { importEnrolled } from "@/api/growth.js";
  import ImportFile from '../../../components/importFile'
  export default {
    data() {
      return {
         titleList: [{
           name: '课程名称',
           value: 'course'
         },{
           name: '类型',
           value: 'type'
         },{
           name: '姓名',
           value: 'name'
         },{
           name: '手机号',
           value: 'telephone'
         }],
        downloadUrl: 'https://oceano-center.oss-cn-hangzhou.aliyuncs.com/growthCourse/importEnrolled/importEnrolled_model.xlsx',
        start: '',
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
        for(let i=0;i<val.length;i++) {
          let obj = {};
          obj.name = val[i].name;
          obj.mobile = val[i].telephone;
          obj.courseType = val[i].type;
          obj.courseName = val[i].course;
          this.dataList.push(obj);
        }
        let params = {};
        params.importEnrolledList = this.dataList;
        importEnrolled(params).then(response => {
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
