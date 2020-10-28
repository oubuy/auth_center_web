<template>
  <div>
    <div>
      <Table
        :loading="loading"
        border
        :columns="columns7"
        :data="data_list"
        @on-selection-change="handleUserSelectionChange"
      ></Table>
      <!-- <div id="page-wrap" style="padding-top:8px; text-align:right;">
        <Page
          show-sizer
          :page-size-opts="[10,20,50,80,100]"
          @on-change="changePage"
          :total="total"
          show-total
          :page-size="formData.rows"
          @on-page-size-change="changePageSize"
          :current="formData.page"
        />
      </div> -->
    </div>

  </div>
</template>
<script>
import {
  growthInfo,
  scoreList
} from "@/api/growth.js";
export default {
  data() {
    return {
      userSelection: [],
      formData: {
        page: 1, //当前页
        rows: 50, //每页显示多少条
        courseId: "",
        courseName: "",
        source:"",
        score:1,
        description:"",
        userId:""
      },
      loading: true,
      total: 0, //总数
      columns7: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "课程名称",
          key: "courseName"
        },
        {
          title: "来源",
          key: "source"
        },
        {
          title: "分数",
          key: "score"
        },
        {
          title: "描述",
          key: "description"
        },
        
      ],
      data_list: []
    };
  },
  mounted() {
    
    this.formData.courseId = this.$route.query.courseId;
    this.formData.userId = this.$route.query.userId;
    this.handleGetCourse();
    this.handleScoreList();
    
  },
  methods: {
    handleScoreList() {
      this.loading = true;
      let params = {
        rows: this.formData.rows,
        page: this.formData.page,
        courseId: this.formData.courseId,
        userId: this.formData.userId
      };
      scoreList(params).then(res => {
        if (res.data.code == 200) {
          console.log(res.data)
          if (res.data.data != null) {
            // this.total = res.data.data.total;
            this.data_list = res.data.data;
          } else {
            this.data_list = [];
          }

          setTimeout(() => {
            this.loading = false;
          }, 500);
        } else {
          this.loading = false;
        }
      });
    },
    handleUserSelectionChange(selection) {
      this.userSelection = selection;
    },
    handleGetCourse() {
      if (this.$route.query.courseId) {
        let growthId = this.formData.courseId;
        growthInfo({ growthId: growthId }).then(res => {
          if (res.data.code == 200) {
            let growth_info = res.data.data;
            this.formData.courseId = growth_info.id;
            this.formData.courseName = growth_info.name;
            let breadcrumbs = [
              { name: "首页" },
              { name: "人才成长管理" },
              { name: "学员管理("+this.formData.courseName+")" },
              { name: "学分记录" }
            ];
            this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
          }
        });
      }else{
        let breadcrumbs = [
              { name: "首页" },
              { name: "人才成长管理" },
              { name: "学员管理" },
              { name: "学分记录" }
            ];
            this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      }

      
    },
    
  },
  watch: {
    $route: function() {
      this.handleScoreList();
    }
  }
};
</script>
<style lang="less" scoped>
.add_head {
  text-align: left;
  margin-bottom: 15px;
}
.formModal {
  height: 200px;
}
</style>