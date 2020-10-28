<template>
    <div>
      <div>
             <Form inline :label-width="90" style="text-align:left;">          
            <FormItem label="课程名称/创建人" :label-width="100">
                <Input v-model="formData.keyword" placeholder="请输入课程名称/创建人" clearable style="width:200px">
                </Input> 
            </FormItem> 
            <FormItem label="课程类别" :label-width="100">
                <Select v-model="formData.type" placeholder="课程类别" clearable style="width:200px">
                   <Option value="读书慧">读书慧</Option>
                   <Option value="兴趣班">兴趣班</Option>
                   <Option value="一书一课">一书一课</Option>
                   <Option value="扬帆课堂">扬帆课堂</Option>
                   <Option value="运动俱乐部">运动俱乐部</Option>
                   <Option value="职场学院">职场学院</Option>
                   <Option value="其他专场培训">其他专场培训</Option>
                   <Option value="MBA专场培训">MBA专场培训</Option>
                   <Option value="学习官特训">学习官特训</Option>
                   <Option value="职场培训会">职场培训会</Option>
                </Select>
            </FormItem>
            <FormItem label="开课日期" :label-width="100">
                <Date-picker type="date" placeholder="开课日期" style="width: 200px" v-model="formData.startedTime" @on-change="formData.startedTime=$event" :editable="false" :disabled="editDisabled"></Date-picker>
            </FormItem>   
            <FormItem label="课程创建日期" :label-width="100">
                <Date-picker type="date" placeholder="课程创建日期" style="width: 200px" v-model="formData.createdTime" @on-change="formData.createdTime=$event" :editable="false" :disabled="editDisabled"></Date-picker>
            </FormItem>
            <FormItem label="报名开始日期" :label-width="100">
                <Date-picker type="date" placeholder="报名开始日期" style="width: 200px" v-model="formData.openTime" @on-change="formData.openTime=$event" :editable="false" :disabled="editDisabled"></Date-picker>
            </FormItem>
            <FormItem label="报名截止日期" :label-width="100">
                <Date-picker type="date" placeholder="报名截止日期" style="width: 200px" v-model="formData.deadline" @on-change="formData.deadline=$event" :editable="false" :disabled="editDisabled"></Date-picker>
            </FormItem>
            <FormItem label="课程状态" :label-width="100">
                <Select v-model="formData.courseState" placeholder="课程状态" clearable style="width:200px">
                   <Option value="未开始">未开始</Option>
                    <Option value="进行中">进行中</Option>
                    <Option value="已结束">已结束</Option>
                    
                </Select>
            </FormItem>
            <FormItem label="可用状态" :label-width="100">
                <Select v-model="formData.enabled" placeholder="可用状态" clearable style="width:200px">
                    <Option value="true">可用</Option>
                    <Option value="false">禁用</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit()">查询</Button>
            </FormItem>
        </Form>
       </div>
        <div class="add_head" style="padding:16px 0 8px 0">
                <Button type="primary" @click="handleAdd">新增课程</Button>
                <Poptip confirm title="确定要立即开放报名时间吗？" @on-ok="handleSetOpenTime" ok-text="确定" cancel-text="取消">
                  <Button type="primary" style="margin-left: 8px">开放报名时间</Button>
                </Poptip>
                <Poptip confirm title="确定要恢复报名时间吗？" @on-ok="handleResetOpenTime" ok-text="确定" cancel-text="取消">
                  <Button type="primary" style="margin-left: 8px">重置报名时间</Button>
                </Poptip>
              </div>
         <div>
              <Table :loading="loading" border :columns="columns7" :data="data_list"></Table>
               <div id="page-wrap" style="padding-top:8px; text-align:right;"> 
                   <Page show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" :total="total" show-total :page-size="formData.rows" @on-page-size-change="changePageSize" :current="formData.page" />
              </div>
         </div>
          <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    </div>
</template>
<script>
import { growthList, deleteVersion,setOpenTime,resetOpenTime } from "@/api/growth.js";
import aletTip from "@/components/alertTip.vue";
export default {
  data() {
    return {
       total: 0, //总数
       formData: {
        page: 1, //当前页
        rows: 10, //每页显示多少条
        keyword: "",
        startedTime: undefined,
        type: "",
        createdTime: undefined,
        openTime: undefined,
        deadline: undefined,
        courseState: "",
        enabled: undefined,
      },
      editDisabled: false,
      alertTipParams: {
        headTip: "删除",
        titleTip:
          "确认删除当前版本吗？删除有可能会影响场景的正常使用，请谨慎操作！"
      },
      deleteComfirm: false,
      deleteRowId: "",
      alertShow: false,
       loading: false,
      columns7: [
        {
          title: "名称",
          key: "name",
          width: 200,
           fixed: 'left'
        },
        {
          title: "类型",
          key: "type",
          width: 100,
           fixed: 'left'
        },
        {
          title: "开课时间",
          key: "startedTime",
          width: 150
        },
        {
          title: '报名开始日期',
          key: 'openTime',
          width: 150,
            render: (h, params) => {
                return h("span",
                    (params.row.openTime&&params.row.openTime!=null) ? params.row.openTime.substring(0, 10) : "");
            }
        },
        {
          title: '报名截止日期',
          key: 'deadline',
          width: 150,
            render: (h, params) => {
                return h("span",
                    (params.row.deadline&&params.row.deadline!=null) ? params.row.deadline.substring(0, 10) : "");
            }
        },
        {
          title: "当前报名人数",
          key: "",
          width: 150,
          render: (h, params) => {
            let enrollmentInfo = "";
            enrollmentInfo = params.row.enrollment + "/"  + params.row.maxNumber;
            return h("div", enrollmentInfo);
          }
        },
        {
          title: "课程状态",
          key: "courseState",
          width: 150
        },
        {
            title: '启用状态',
            key: 'enabled',
            width: 110,
            render: (h, params) => {
                return h("span", {
                        style: {
                            color: params.row.enabled ? "#2db7f5" : "#c5c8ce"
                        }
                    },
                    params.row.enabled ? "启用" : "关闭");
            }
        },
        {
          title: "创建人",
          key: "createdBy",
          width: 100
        },
        {
          title: "创建时间",
          key: "createdTime",
          width: 150
        },
               
        {
          title: "操作",
          key: "action",
          width: 255,
          fixed: 'right',
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
                      this.handleStudent(params);
                    }
                  }
                },
                "学员管理"
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
                      this.handleEidt(params);
                    }
                  }
                },
                "编辑"
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
                      this.handleErWeiMa(params);
                    }
                  }
                },
                "签到二维码"
              ),
              // h(
              //   "Button",
              //   {
              //     props: {
              //       type: "error",
              //       size: "small"
              //     },
              //     on: {
              //       click: () => {
              //         this.handleRemove(params);
              //       }
              //     }
              //   },
              //   "删除"
              // )
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
  created() {
    let breadcrumbs = [{ name: "课程管理" }, { name: "课程列表" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.handleGetList();
  },
  methods: {
     // 需改页码数
    changePage(val) {
      this.formData.page = val;
      this.updateRouterParam();
    },
    changePageSize(val) {
      this.formData.rows = val;
      this.updateRouterParam();
    },
      // 修改路由参数值
    updateRouterParam() {
      let query = this.formData;
      this.$router.push({
        query: query
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/admin/growth/addEdit"
      });
    },
    handleSubmit() {
      this.handleGetList();
    },
    handleGetList() {
      let page = this.$route.query.page;
      let rows = this.$route.query.rows;

      if (page && !isNaN(page)) {
        this.formData.page = parseInt(page);
      } else {
        this.formData.page = 1;
      }
      if (rows && !isNaN(rows)) {
        this.formData.rows = parseInt(rows);
      } else {
        this.formData.rows = 10;
      }
       this.loading=true;

       let params = {};
       params.page = this.formData.page;
       params.rows = this.formData.rows;
       params.keyword = this.formData.keyword;
       params.type = this.formData.type;
       if(this.formData.startedTime != '' && this.formData.startedTime != null){
        var dateeeStart = new Date(this.formData.startedTime).toJSON();
        var startedTime = new Date(+new Date(dateeeStart)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        params.startedTime = startedTime;
      }
      if(this.formData.createdTime != '' && this.formData.createdTime != null){
        var dateeeCreate = new Date(this.formData.createdTime).toJSON();
        var createdTime = new Date(+new Date(dateeeCreate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        params.createdTime = createdTime;
      }
      if(this.formData.openTime != '' && this.formData.openTime != null){
        var dateOpen = new Date(this.formData.openTime).toJSON();
        var openTime = new Date(+new Date(dateOpen)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        params.openTime = openTime;
      }
      if(this.formData.deadline != '' && this.formData.deadline != null){
        var dateDeadline = new Date(this.formData.deadline).toJSON();
        var deadline = new Date(+new Date(dateDeadline)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
        params.deadline = deadline;
      }
       params.courseState = this.formData.courseState;
       params.enabled = this.formData.enabled;

       this.data_list=[];
      growthList(params).then(res => {
        if (res.data.code == 200) {
           
          if (res.data.data.list.length != 0) {
             this.total = res.data.data.total;
            let data_arr = res.data.data.list;
            data_arr.forEach(item => {
              this.data_list.push(item);
            });
             this.loading=false;
          }else{
             this.loading=false;
          }
        }
      });
    },
    handleEidt(data) {
      this.$router.push({
        path: "/admin/growth/addEdit",
        query: {
          growthId: data.row.id
        }
      });
    },
    handleRemove(params) {
      this.alertShow = true;
      this.deleteRowId = params.row.id;
    },
    handleCloseTip(data) {
      this.deleteComfirm = data;
      if (this.deleteComfirm == "true") {
        let ids = [];
        ids.push(this.deleteRowId.toString());

        deleteVersion({ ids: ids }).then(res => {
       
          if (res.data.code == 200) {
            this.$Message.success(res.data.msg);
             this.handleGetList();
          }
        });
        this.alertShow = false;
      } else {
        this.alertShow = false;
      }
    },
    handleStudent(data){
      
      this.$router.push({
        path:'/admin/student/list',
        query:{
          id:data.row.id
        }
      })
    },
    handleSetOpenTime(){
      let params = {};
      setOpenTime(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.handleGetList();
        }
      });
    },
    handleErWeiMa(data){
      var courseId = data.row.id;
      var url = "https://course.osnyun.com/course/toSignErWeiMa?courseId="+courseId+"&simple=1";
      window.open(url);
    },
    handleResetOpenTime(){
      let params = {};
      resetOpenTime(params).then(res => {
        if (res.data.code == 200) {
          this.$Message.success(res.data.msg);
          this.handleGetList();
        }
      });
    }
  },
  watch:{
     $route: function() {
      this.handleGetList();
    },
  }
  
};
</script>

<style lang="less" scoped>
.add_head {
  text-align: left;
  margin-bottom: 15px;
}
</style>
