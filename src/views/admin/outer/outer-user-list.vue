<template>
<Layout>
    <Sider hide-trigger :style="{ background: '#fff'}">
        <Card :padding="10" :style="{height: maxHeight+'px', overflow: 'auto'}">
            <org-tree ref="orgTree" type="outer" @org-select="handleOrgSelect"></org-tree>
        </Card>
    </Sider>
    <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
        <div id="header-div">
            <!-- 查询条件 -->
            <Card>
                <Form ref="formQuery" :label-width='80' inline>
                    <FormItem label="姓名" prop="realName">
                        <Input type="text" v-model.trim="formData.realName" placeholder="请输入姓名" @on-enter="handleSearch" clearable style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="手机" prop="mobile">
                        <Input type="text" v-model.trim="formData.mobile" placeholder="请输入手机号码" @on-enter="handleSearch" clearable style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="职位">
                        <Input type="text" v-model.trim="formData.position" placeholder="请输入职位" @on-enter="handleSearch" clearable style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="状态" prop="disabled">
                        <Select v-model="formData.disabled" placeholder="请选择" @on-change="handleSearch" clearable style="width:200px">
                            <Option value="false">启用</Option>
                            <Option value="true">禁用</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="经销商地区" prop="address">
                        <address-select :addressInfo="address" @child-province="handleProvince" @child-city="handleCity" @child-area="handleArea"></address-select>
                    </FormItem>
                    <FormItem label="所属经销商" prop="dealerName">
                        <AutoComplete v-model.trim="formData.dealerName" :data="dealerList" @on-search="handleSearchDealer" @on-select="handleSearch" placeholder="请输入经销商名称" clearable style="width:200px"></AutoComplete>
                    </FormItem>
                    <FormItem label="创建时间">
                        <DatePicker type="date" v-model="formData.createDateStart" @on-change="formData.createDateStart=$event" placeholder="开始时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker> 至
                        <DatePicker type="date" v-model="formData.createDateEnd" @on-change="formData.createDateEnd=$event" placeholder="结束时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker>
                    </FormItem>
                    <FormItem label="修改时间">
                        <DatePicker type="date" v-model="formData.modifyDateStart" @on-change="formData.modifyDateStart=$event" placeholder="开始时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker> 至
                        <DatePicker type="date" v-model="formData.modifyDateEnd" @on-change="formData.modifyDateEnd=$event" placeholder="结束时间" :options="selectDateOptions" :editable="false" style="width:110px"></DatePicker>
                    </FormItem>
                    <FormItem label="显示下级" prop="includeSub">
                        <Checkbox v-model="formData.includeSub" @on-change="handleSearch"></Checkbox>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSearch()">搜 索</Button>
                        <Button @click="handleResetForm()" style="margin-left: 8px">重 置</Button>
                    </FormItem>
                </Form>
                <div style="position:absolute; left:16px; bottom:8px;">
                    <Tag v-if="showOrgTag" @on-close="handleOrgTagClose" closable>{{fullOrgName}}</Tag>
                </div>
            </Card>
            <!-- 功能键 -->
            <div style="padding:16px 0 8px 0">
                <Button @click="editUser(0)" :style="{ display: showOuterUserAdd }">新增</Button>
                <Button :loading="disableBtnLoading" @click="disableUsers()" style="margin-left: 8px" :style="{ display: showOuterUserDisabled }">禁用</Button>
            </div>
        </div>
        <!-- 查询结果 -->
        <Table border :loading="loading" ref="selection" @on-row-click="handleRowClick" :columns="columns" :data="tableData" :height="tableHeight" @on-sort-change="handleTableSort" @on-selection-change="handleSelectionChange"></Table>
        <div id="page-wrap" style="padding-top:8px; text-align:right;">
            <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total show-sizer :page-size-opts="[10,20,50,80,100]" @on-change="changePage" @on-page-size-change="changePageSize"></Page>
        </div>
    </Content>
</Layout>
</template>

<script>
import {
  find,
  findDealer,
  getRoles,
  disable,
  checkPermission
} from "@/api/adminOuter.js";
import { getFullOrgName } from "@/api/org.js";
import addressSelect from "@/components/address";
import orgTree from "@/components/org-tree";
import $ from "jquery";

export default {
  data() {
    return {
      formData: {
        realName: "",
        mobile: "",
        position: "",
        disabled: "",
        dealerName: "",
        provinceCode: "",
        cityCode: "",
        districtCode: "",
        orgId: "",
        orgLongId: "",
        includeSub: true,
        createDateStart: "",
        createDateEnd: "",
        modifyDateStart: "",
        modifyDateEnd: "",

        orderByClause: "createDate desc",
        page: 1, // 当前页
        rows: 10 // 每页显示多少条
      },
      maxHeight: 600, // 页面最大高度
      tableHeight: 500, // 表格高度
      showOrgTag: false, // 是否显示“已选组织”标签
      fullOrgName: "", // 已选组织全称
      address: {},
      dealerList: [],
      total: 0, // 初始化信息总条数
      loading: false,
      disableBtnLoading: false, // “禁用”按钮是否显示“加载中”
      tableData: [],
      selection: [],
      showOuterUserAdd: "none",
      showOuterUserDisabled: "none",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "realName",
          width: 100,
          sortable: "custom",
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.editUser(params.row.id);
                  }
                }
              },
              params.row.realName
            );
          }
        },
        {
          title: "手机",
          key: "mobile",
          sortable: "custom",
          width: 120
        },
        {
          title: "职位",
          key: "position",
          sortable: "custom",
          width: 100,
          render: (h, params) => {
            if (params.row.position == "null") {
              return h("span", "-");
            } else {
              return h("span", params.row.position);
            }
          }
        },
        {
          title: "权限",
          key: "roles",
          width: 150,
          tooltip: false
        },
        {
          title: "所属组织",
          key: "orgName",
          sortable: "custom",
          tooltip: false,
          minWidth: 250
        },
        {
          title: "交互屏头像",
          key: "avatar",
          align: "center",
          width: 80,
          render: (h, params) => {
            if (params.row.avatar) {
              return h("Icon", {
                props: {
                  type: "md-checkmark"
                }
              });
            } else {
              return "";
            }
          }
        },
        {
          title: "交互屏二维码",
          key: "appletQrcode",
          align: "center",
          width: 80,
          render: (h, params) => {
            if (params.row.appletQrcode) {
              return h("Icon", {
                props: {
                  type: "md-checkmark"
                }
              });
            } else {
              return "";
            }
          }
        },
        {
          title: "状态",
          key: "disabled",
          sortable: "custom",
          width: 80,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.disabled ? "#c5c8ce" : "#2db7f5"
                }
              },
              params.row.disabled ? "禁用" : "启用"
            );
          }
        },
        {
          title: "企信状态",
          key: "qixinStatus",
          sortable: "custom",
          width: 80,
          render: (h, params) => {
            if (params.row.qixinStatus) {
              return h(
                "span",
                {
                  style: {
                    color:
                      params.row.qixinStatus == "lock" ? "#c5c8ce" : "#2db7f5"
                  }
                },
                params.row.qixinStatus == "lock" ? "停用" : "启用"
              );
            } else {
              return "";
            }
          }
        },
        {
          title: "创建人",
          key: "creater",
          width: 100,
          sortable: "custom"
        },
        {
          title: "创建时间",
          key: "createDate",
          sortable: "custom",
          width: 105,
          render: (h, params) => {
            return h(
              "span",
              params.row.createDate == null
                ? ""
                : params.row.createDate.substr(0, 10)
            );
          }
        },
        {
          title: "修改时间",
          key: "modifyDate",
          sortable: "custom",
          width: 105,
          render: (h, params) => {
            return h(
              "span",
              params.row.modifyDate == null
                ? ""
                : params.row.modifyDate.substr(0, 10)
            );
          }
        }
      ],
      selectDateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      }
    };
  },
  components: {
    addressSelect,
    orgTree
  },
  mounted() {
    this.address = {};
    this.checkPermission();

    this.$nextTick(function() {
      this.maxHeight = $("#main-content").height();

      this.tableHeight =
        this.maxHeight -
        $("#header-div").outerHeight(true) -
        $("#page-wrap").outerHeight(true);
      if (this.tableHeight < 400) {
        this.tableHeight = 400;
      }
    });
  },
  activated() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "外部架构"
      },
      {
        name: "外部人员"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
  },
  created() {
    this.$store.dispatch("recordAddress", {});
    this.fetchData();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: function(val) {
      if (typeof this.$route.query.orgLongId == "undefined") {
        this.$refs.orgTree.cancelSelect();
      }
      if (this.$route.query.refresh != "false") {
        this.fetchData();
      }
    }
  },
  methods: {
    fetchData() {
      let page = this.$route.query.page;
      let rows = this.$route.query.rows;
      let includeSub = this.$route.query.includeSub;
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
      this.formData.realName = this.$route.query.realName;
      this.formData.mobile = this.$route.query.mobile;
      this.formData.position = this.$route.query.position;
      this.formData.disabled = this.$route.query.disabled;
      this.formData.dealerName = this.$route.query.dealerName;
      this.formData.provinceCode = this.$route.query.provinceCode;
      this.formData.cityCode = this.$route.query.cityCode;
      this.formData.districtCode = this.$route.query.districtCode;
      this.formData.orgId = this.$route.query.orgId;
      this.formData.orgLongId = this.$route.query.orgLongId;
      this.formData.includeSub =
        typeof includeSub == "undefined" || String(includeSub) == "true";
      this.formData.createDateStart = this.$route.query.createDateStart;
      this.formData.createDateEnd = this.$route.query.createDateEnd;
      this.formData.modifyDateStart = this.$route.query.modifyDateStart;
      this.formData.modifyDateEnd = this.$route.query.modifyDateEnd;
      this.handleOrgTag(this.formData.orgId);

      this.loading = true;
      find(this.formData).then(data => {
        this.tableData = [];
        this.selection = [];
        if (data.data.code == 200) {
          this.total = data.data.data.total;
          data.data.data.list.forEach(item => {
            this.tableData.push(item);
          });
          this.formatTableData();
        }
        this.loading = false;
      });
    },
    updateRouterParam() {
      // 修改路由参数值
      this.$router.push({
        query: this.formData
      });
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
    handleSearch() {
      this.formData.page = 1;
      this.updateRouterParam();
    },
    handleResetForm() {
      this.formData.page = 1;
      this.formData.realName = "";
      this.formData.mobile = "";
      this.formData.position = "";
      this.formData.disabled = "";
      this.formData.dealerName = "";
      this.formData.provinceCode = "";
      this.formData.cityCode = "";
      this.formData.districtCode = "";
      this.formData.orgId = "";
      this.formData.orgLongId = "";
      this.formData.includeSub = true;
      this.formData.createDateStart = "";
      this.formData.createDateEnd = "";
      this.formData.modifyDateStart = "";
      this.formData.modifyDateEnd = "";
      this.address = {};
      this.$refs.orgTree.cancelSelect();
      this.updateRouterParam();
    },
    changePage(val) {
      this.formData.page = val;
      this.updateRouterParam();
    },
    changePageSize(val) {
      this.formData.rows = val;
      this.updateRouterParam();
    },
    handleOrgTag(orgId) {
      if (typeof orgId == "undefined" || orgId == null || orgId == "") {
        this.fullOrgName = "";
        this.showOrgTag = false;
        return;
      }
      let params = {
        orgId: orgId
      };
      getFullOrgName(params).then(resp => {
        if (resp.data.code == 200) {
          this.fullOrgName = resp.data.data;
          if (this.fullOrgName != null) {
            this.fullOrgName = "已选组织：" + this.fullOrgName;
            this.showOrgTag = true;
          }
        }
      });
    },
    handleOrgTagClose() {
      this.showOrgTag = false;
      this.fullOrgName = "";
      this.formData.orgId = "";
      this.formData.orgLongId = "";
      this.$refs.orgTree.cancelSelect();
      this.updateRouterParam();
    },
    handleSearchDealer(value) {
      if (value == "") {
        return;
      }
      let params = {
        dealerName: value
      };
      findDealer(params).then(data => {
        if (data.data.code == 200) {
          this.dealerList = [];
          data.data.data.list.forEach(item => {
            this.dealerList.push(item.orgName);
          });
        }
      });
    },
    handleProvince(val) {
      this.formData.provinceCode = val.value;
    },
    handleCity(val) {
      this.formData.cityCode = val.value;
    },
    handleArea(val) {
      this.formData.districtCode = val.value;
    },
    handleOrgSelect(org) {
      this.formData.orgId = org && org.id ? String(org.id) : "";
      this.formData.orgLongId = org && org.longId ? org.longId : "";
      this.formData.page = 1;
      this.updateRouterParam();
    },
    handleTableSort(param) {
      // 排序处理
      if ("asc" == param.order || "desc" == param.order) {
        let key = param.key;
        if (key == "orgName") {
          key = "orgId";
        }
        this.formData.orderByClause = key + " " + param.order;
      } else {
        this.formData.orderByClause = "createDate desc";
      }
      this.formData.page = 1;
      this.updateRouterParam();
    },
    disableUsers() {
      if (this.selection.length == 0) {
        this.$Message.warning("请至少选择一条数据");
        return;
      }
      let userIds = [];
      this.selection.forEach(item => {
        userIds.push(item.id);
      });
      let params = {
        userIds: userIds
      };
      this.disableBtnLoading = true;
      disable(params).then(resp => {
        this.disableBtnLoading = false;
        if (resp.data.code == 200) {
          this.$Message.success(resp.data.msg);
          this.fetchData();
        }
      });
    },
    formatTableData() {
      if (this.tableData.length == 0) {
        return;
      }
      let orgIds = new Set();
      this.tableData.forEach(item => {
        if (item.orgId != null) {
          orgIds.add(item.orgId);
        }
      });
      for (let orgId of orgIds.keys()) {
        // 获取组织名称
        getFullOrgName({
          orgId: orgId
        }).then(resp => {
          if (resp.data.code == 200) {
            this.tableData.forEach(item => {
              if (orgId == item.orgId) {
                this.$set(item, "orgName", resp.data.data);
              }
            });
          }
        });
      }

      this.tableData.forEach(item => {
        // 获取角色名称
        getRoles({
          userId: item.id
        }).then(resp => {
          if (resp.data.code == 200) {
            let roleList = resp.data.data;
            if (roleList.length > 0) {
              let roles = roleList[0].roleName;
              for (let i = 1; i < roleList.length; i++) {
                roles += "、" + roleList[i].roleName;
              }
              this.$set(item, "roles", roles);
            }
          }
        });
      });
    },
    checkPermission() {
      let params = {};
      checkPermission(params).then(response => {
        if (response.data.code == 200) {
          if (response.data.data.isOuterUserAdd == true) {
            this.showOuterUserAdd = "";
          }
          if (response.data.data.isOuterUserDisabled == true) {
            this.showOuterUserDisabled = "";
          }
        } else {
          this.$Message.warning(response.data.msg);
        }
      });
    },
    editUser(id) {
      let query = {
        ...this.$route.query,
        view: "userEdit"
      };
      if (id == 0) {
        delete query.id;
      } else {
        query.id = id;
      }
      this.$router.push({
        name: "admin_outer_user_mgr",
        query: query
      });
    }
  }
};
</script>

<style lang="less" scoped>
.ivu-card-body {
  padding: 6px !important;
}
</style>
