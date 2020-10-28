<template>
  <div>
    <div>
             <Form inline :label-width="90" style="text-align:left;">          
            <FormItem label="学员名称/手机号" :label-width="100">
                <Input v-model="formData.keyword" placeholder="请输入学员名称/手机号" clearable style="width:200px">
                </Input> 
            </FormItem> 
            <FormItem>
                <Button type="primary" @click="handleSubmit()">查询</Button>
            </FormItem>
        </Form>
       </div>
    <div class="add_head">
      <Button type="primary" @click="handleAdd">新增学员</Button>
      <Button type="primary" @click="showAddScore()">补充学分</Button>
      <Button type="primary" @click="handleImportUserScore()">导入学员积分</Button>
    </div>
    <div>
      <Table
        :loading="loading"
        border
        :columns="columns7"
        :data="data_list"
        @on-selection-change="handleUserSelectionChange"
      ></Table>
      <div id="page-wrap" style="padding-top:8px; text-align:right;">
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
      </div>
    </div>
    <!-- 添加学员 -->
    <Modal v-model="studentModal" title="添加学员">
      <Form ref="formInline" class="formModal" :model="formInline">
        <FormItem prop="mobile">
          <Input type="text" style="width:300px" v-model="formInline.mobile" placeholder="请输入员工手机号"></Input>
          <Button style="margin-left:25px;" @click="handleSearch">查 询</Button>
        </FormItem>

        <div style="text-align: left;" v-show="searchFlag">
          <div>{{searchValue.name}}</div>
          <div>{{searchValue.mobile}}</div>
          <div>{{searchValue.department}}</div>
          <div>
            <span>当前分值：</span>
            {{searchValue.score}}
          </div>
        </div>
      </Form>

      <div class="bottomStudentButton">
        <Button type="primary" @click="handleAddSubmit">添 加</Button>
        <Button style="margin-left:25px;" @click="handlecancel">取 消</Button>
      </div>
      <div slot="footer"></div>
    </Modal>

    <div>
      <Drawer
        title="补充学分" placement="right" v-model="openAddScore" width="400" :mask-closable="false">
        <Form ref="addScoreForm" :model="formData" :label-width="60">
          <FormItem label="姓名：">
            <Input disabled v-model="formData.name" />
          </FormItem>
          <FormItem label="原因：">
            <Select v-model="formData.source" placeholder="请选择" clearable>
              <Option value="缺勤">缺勤</Option>
              <Option value="心得">心得</Option>
              <Option value="个人奖">个人奖</Option>
              <Option value="团队奖">团队奖</Option>
              <Option value="担任组长">担任组长</Option>
              <Option value="其他">其他</Option>
            </Select>
          </FormItem>
          <FormItem label="分数：">
            <InputNumber
              v-model="formData.score"
              :precision="0"
              :min="-20"
              style="width:100%"
              placeholder="请输入分数"
            />
          </FormItem>
          <FormItem label="备注：">
            <Input
              v-model="formData.description"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="请输入备注"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="addScore">保存</Button>
            <Button style="margin-left: 8px" @click="openAddScore = false">取消</Button>
          </FormItem>
        </Form>
      </Drawer>
    </div>
      <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
  </div>
</template>
<script>
import {
  studentList,
  searchStudent,
  saveStudent,
  deleteStudent,
  growthInfo,
  addScore
} from "@/api/growth.js";
import aletTip from "@/components/alertTip.vue";
export default {
  data() {
    return {
      formInline: {
        mobile: "",
      },
      alertTipParams: {
        headTip: "删除",
        titleTip:
          "确认取消报名吗？取消报名会清空学员该课程的数据，请谨慎操作！"
      },
      searchFlag: false,
      searchValue: {}, //c查询结果
      studentModal: false,
      openAddScore: false,
      alertShow: false,
      userSelection: [],
      deleteRowUserId: "",
      formData: {
        page: 1, //当前页
        rows: 50, //每页显示多少条
        courseId: "",
        courseName: "",
        source:"",
        score:1,
        description:"",
        userId:"",
        keyword: ""
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
          title: "名称",
          key: "name"
        },
        {
          title: "电话",
          key: "mobile"
        },
        {
          title: "部门",
          key: "department"
        },
        {
          title: "分数",
          key: "score"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleScore(params);
                    }
                  }
                },
                "学分记录"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handleSign(params);
                    }
                  }
                },
                "签到记录"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      
                      this.handleRemove(params);
                    }
                  }
                },
                "取消报名"
              )
            ]);
          }
        }
      ],
      data_list: []
    };
  },
  components: {
    aletTip
  },
  mounted() {
    if (this.$route.query.id) {
      this.formData.courseId = this.$route.query.id;
      this.handleGetCourse();
      this.handleStudentList();
    }
  },
  methods: {
    changePage(val) {
      this.formData.page = val;
      this.updataRouterParam();
    },
    changePageSize(val) {
      this.formData.rows = val;
      this.updataRouterParam();
    },
    handleStudentList() {
      this.loading = true;
      let params = {
        rows: this.formData.rows,
        page: this.formData.page,
        courseId: this.formData.courseId,
        keyword: this.formData.keyword
      };
      studentList(params).then(res => {
        if (res.data.code == 200) {
          if (res.data.data.list != null) {
            this.total = res.data.data.total;
            this.data_list = res.data.data.list;
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
    updataRouterParam() {
      let params = this.formData;
      this.$router.push({
        query: params
      });
    },
    handleRemove(params) {
      this.alertShow = true;
      this.deleteRowUserId = params.row.userId;
    },
    handleCloseTip(data) {
      this.deleteComfirm = data;
      if (this.deleteComfirm == "true") {
      let params = {
        // userId: data.row.userId,
        userId: this.deleteRowUserId,
        courseId: this.formData.courseId
      };
      deleteStudent(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.handleStudentList();
        }
      });        
        this.alertShow = false;
      }else{
        this.alertShow = false;
      }
    },
    handleAdd() {
      this.studentModal = true;
    },
    handleAddSubmit() {
      console.log(this.searchValue.userId)
      if(typeof this.searchValue.userId == "undefined"){
        this.$Message.warning("请先查询学员");
        return;
      }
      let params = {
        courseId: this.formData.courseId,
        userId: this.searchValue.userId
      };
      saveStudent(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.studentModal = false;
          this.handleStudentList();
        }
      });
    },
    handlecancel() {
      this.formInline.mobile = "";
      this.searchValue = {};
      this.searchFlag = false;
      this.studentModal = false;
    },
    handleSearch() {
      if (this.formInline.mobile == "") {
        this.$Message.warning("请输入手机号码");
      } else if (!/^1\d{10}$/.test(this.formInline.mobile)) {
        this.$Message.error("请输入有效的手机号码");
      } else {
        let params = {
          mobile: this.formInline.mobile
        };
        searchStudent(params).then(res => {
          if (res.data.code == 200) {
            this.searchFlag = true;
            this.searchValue = res.data.data;
          } else {
            this.searchFlag = false;
          }
        });
      }
    },
    showAddScore() {
      if (this.userSelection.length == 0) {
        this.$Message.warning("请选择一条数据");
        return;
      } else if (this.userSelection.length > 1) {
        this.$Message.warning("只能选择一条数据");
        return;
      }
      this.formData.userId = this.userSelection[0].userId;
      this.formData.name = this.userSelection[0].name;
      this.openAddScore = true;
    },
    handleUserSelectionChange(selection) {
      this.userSelection = selection;
    },
    handleGetCourse() {
      let growthId = this.formData.courseId;
      growthInfo({ growthId: growthId }).then(res => {
        if (res.data.code == 200) {
          let growth_info = res.data.data;
          this.formData.courseId = growth_info.id;
          this.formData.courseName = growth_info.name;
          let breadcrumbs = [
            { name: "首页" },
            { name: "人才成长管理" },
            { name: "学员管理("+this.formData.courseName+")" }
          ];
          this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        }
      });
    },
    handleImportUserScore() {
      this.$router.push({
        path: "/admin/growth/growthUploadUserScore",
        query: {
          courseId:this.formData.courseId,
          courseName:this.formData.courseName
        }
      });
    },
    handleScore(params) {
      this.$router.push({
        path: "/admin/growth/growthScoreList",
        query: {
          courseId: this.formData.courseId,
          userId: params.row.userId
        }
      });
    },
    handleSign(params) {
      this.$router.push({
        path: "/admin/growth/growthSignList",
        query: {
          courseId: this.formData.courseId,
          userId: params.row.userId
        }
      });
    },
    addScore() {
      if (this.formData.source == '') {
        this.$Message.warning("请选择原因");
        return;
      }
      let params = {
        courseId: this.formData.courseId,
        userId: this.formData.userId,
        source: this.formData.source,
        score: this.formData.score,
        description: this.formData.description
      };
      addScore(params).then(res => {
          if (res.data.code == 200) {
              this.$Message.success(res.data.msg)
              this.openAddScore = false
              this.handleStudentList();
          }else{
              this.$Message.warning(res.data.msg)
          }
      })
    },
    handleSubmit() {
      this.handleStudentList();
    },

  },
  watch: {
    $route: function() {
      this.handleStudentList();
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