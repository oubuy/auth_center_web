<template>
    <div>
      <Layout>
        <Sider hide-trigger :style="{minWidth:'300px', background: '#fff'}">
            <Card :padding="10" :style="{height: maxHeight+'px', overflow: 'auto'}">
                <org-tree ref="orgTree" type="inner" @org-select="handleOrgSelect"></org-tree>
            </Card>
        </Sider>
          <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}" id="content_box">
              <Card>
                <div>
                      <Form inline :label-width="90" style="text-align:left;">          
                        <FormItem label="学员名称/手机号" :label-width="100">
                            <Input v-model="formData.keyword" placeholder="请输入学员名称/手机号" clearable style="width:200px">
                            </Input>
                        </FormItem> 
                        <FormItem label="课程名称">
                            <Input v-model="formData.courseName" placeholder="请输入课程名称" clearable style="width:200px">
                            </Input>
                        </FormItem> 
                        <FormItem label="课程类型">
                            <Select v-model="formData.courseType" placeholder="课程类型" clearable style="width:200px">
                              <Option value="读书慧">读书慧</Option>
                              <Option value="一书一课">一书一课</Option>
                              <Option value="兴趣班">兴趣班</Option>
                              <Option value="扬帆课堂">扬帆课堂</Option>
                              <Option value="运动俱乐部">运动俱乐部</Option>
                              <Option value="其他专场培训">其他专场培训</Option>
                              <Option value="MBA专场培训">MBA专场培训</Option>
                              <Option value="学习官特训">学习官特训</Option>
                              <Option value="职场培训会">职场培训会</Option>
                            </Select>
                        </FormItem>
                        
                        <FormItem>
                            <Button type="primary" @click="handleSubmit()">查询</Button>
                        </FormItem>
                    </Form>
                </div>
              </Card>
              <div class="add_head" style="padding:16px 0 8px 0">
                <Button type="primary" @click="showEnrolled">导入报名数据</Button>
                <Button type="primary" @click="exportUsers">导出查询结果</Button>
                <Button type="primary" @click="showChangeSocre">调整学分上限</Button>

                <Poptip confirm title="删除后将清空该用户数据，确定要删除吗？" @on-ok="removeUser" ok-text="确定" cancel-text="取消">
                    <Button type="error" style="margin-left: 8px">删除</Button>
                </Poptip>
                
              </div>
                <div>
                    <Table :loading="loading" border :columns="columns7" :data="data_list"  @on-selection-change="handleUserSelectionChange"></Table>
                    <div id="page-wrap" style="padding-top:8px; text-align:right;"> 
                        <Page show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" :total="total" show-total :page-size="formData.rows" @on-page-size-change="changePageSize" :current="formData.page" />
                    </div>
              </div>

              <div>
                <Drawer title="调整学分上限" placement="right" v-model="openChangeScore" width="400" :mask-closable="false">
                  <Form ref="enrolledForm" :model="formData" :label-width="80">
                    <FormItem label="分数下限：">
                      <Input v-model="formData.enrollmentMinScore" />
                    </FormItem> 
                    <FormItem label="分数上限：">
                      <Input v-model="formData.enrollmentMaxScore" />
                    </FormItem>     
                    <FormItem>
                      <Button type="primary" @click="handelChangeScore">提交</Button>
                      <Button style="margin-left: 8px" @click="openChangeScore = false">取消</Button>
                    </FormItem>
                  </Form>
                </Drawer>
              </div>
          </Content>
       </Layout>
   </div>
</template>
<script>
import orgTree from "@/components/org-tree";
import $ from "jquery";
import { usreList, deleteUser, saveStudent, readExcel,exportUsers,changeLimitScore } from "@/api/growth.js";
import axios from "axios";
export default {
  data() {
    return {
      maxHeight: 600, // 页面最大高度
      keyword: "",
      courseId: "",
      courseName: "",
      courseType: "",
      formInline: {
        mobile: ""
      },
      searchFlag: false,
      searchValue: {}, //c查询结果
      studentModal: false,
      userSelection: [],
      openChangeScore: false,
      formData: {
        page: 1, //当前页
        rows: 50, //每页显示多少条
        courseId: "",
        userId: "",
        filePath: "",
        orgLongId: "",
        score: "",
        enrollmentMinScore: "",
        enrollmentMaxScore: "",
        
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
          title: "报名学分",
          key: "enrollmentScore"
        },
        {
          title: "总分",
          key: "score"
        },
        {
          title: "报名分数下限",
          key: "enrollmentMinScore"
        },
        {
          title: "报名分数上限",
          key: "enrollmentMaxScore"
        },
        {
          title: "运动俱乐部",
          key: "isEnrollSport",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.isEnrollSport ? "#2db7f5" : "#c5c8ce"
                }
              },
              params.row.isEnrollSport ? "已报" : "未报"
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 250,
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
            ]);
          }
        }
        // {
        //   title: "操作",
        //   key: "action",
        //   width: 150,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "error",
        //             size: "small"
        //           },
        //           on: {
        //             click: () => {
        //               this.handleRemove(params);
        //             }
        //           }
        //         },
        //         "删除"
        //       )
        //     ]);
        //   }
        // }
      ],
      data_list: []
    };
  },
  components: {
    orgTree
  },
  mounted() {
    let breadcrumbs = [
      { name: "首页" },
      { name: "人才成长管理" },
      { name: "学员管理" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.handleUserList();
    this.$nextTick(function() {
      this.maxHeight = $("#content_box").height();
    });
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
    handleUserList() {
      this.loading = true;
      let params = {
        rows: this.formData.rows,
        page: this.formData.page,
        keyword: this.formData.keyword,
        courseName: this.formData.courseName,
        courseType: this.formData.courseType,
        orgLongId:this.formData.orgLongId,
      };
      usreList(params).then(res => {
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
    handleSubmit() {
      this.handleUserList();
    },
    handleOrgSelect(org) {
      this.formData.orgLongId = (org && org.longId) ? org.longId : '';

      this.formData.page = 1;
      console.log(333)
      this.updataRouterParam();
    },
    updataRouterParam() {
      let params = this.formData;
      this.$router.push({
        query: params
      });
    },
    removeUser() {
      if (this.userSelection.length == 0) {
        this.$Message.warning("请选择一条数据");
        return;
      } else if (this.userSelection.length > 1) {
        this.$Message.warning("只能选择一条数据");
        return;
      }
      let params = {
        userId: this.userSelection[0].userId
      };
      deleteUser(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.handleUserList();
        }
      });
    },
    exportUsers() {
      let params = {
        keyword: this.formData.keyword,
        courseName: this.formData.courseName,
        courseType: this.formData.courseType,
        orgLongId:this.formData.orgLongId,
      };
      axios({
          method: "get",
          url: "/rest/growth/exportUsers",
          params: params,
          responseType: "blob"
      })
      .then(response => {
          this.download(response);
      })
      .catch(error => {
          this.$Message.warning("下载组织失败");
          return;
      });
    },
    download(response) {
        if (!response) {
            return;
        }

        if (response.headers.fail) {
            
        } else {
            this.$Message.warning("下载失败");
            return;
        }

        let url = window.URL.createObjectURL(new Blob([response.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "学员信息表.xlsx");

        document.body.appendChild(link);
        link.click();
    },

    handleUserSelectionChange(selection) {
      this.userSelection = selection;
    },
    handleRemove(data) {
      let params = {
        userId: data.row.userId
      };
      deleteUser(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.handleUserList();
        }
      });
    },
    handlecancel() {
      this.formInline.mobile = "";
      this.searchValue = {};
      this.searchFlag = false;
      this.studentModal = false;
    },
    showEnrolled() {
      // this.openChangeScore = true;
      this.$router.push({
        path: "/admin/growth/growthUploadEnrolled",
        
      });
    },
    showChangeSocre() {
      if (this.userSelection.length == 0) {
        this.$Message.warning("请选择一条数据");
        return;
      } else if (this.userSelection.length > 1) {
        this.$Message.warning("只能选择一条数据");
        return;
      } 
      this.formData.userId = this.userSelection[0].userId;
      this.formData.enrollmentMaxScore = this.userSelection[0].enrollmentMaxScore;
      this.formData.enrollmentMinScore = this.userSelection[0].enrollmentMinScore;
      this.openChangeScore = true;
    },
    handelChangeScore() {
      let params = {
        // filePath: this.formData.filePath,
        userId: this.formData.userId,
        enrollmentMinScore: this.formData.enrollmentMinScore,
        enrollmentMaxScore: this.formData.enrollmentMaxScore
      };
      changeLimitScore(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.handleUserList();
        } else {
          this.$Message.warning(res.data.msg);
        }
      });
    },
    handleScore(params) {
      this.$router.push({
        path: "/admin/growth/growthScoreList",
        query: {
          courseId: null,
          userId: params.row.userId
        }
      });
    },
    handleSign(params) {
      this.$router.push({
        path: "/admin/growth/growthSignList",
        query: {
          courseId: null,
          userId: params.row.userId
        }
      });
    }, 
       
  },

  watch: {
    $route: function() {
      this.handleUserList();
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