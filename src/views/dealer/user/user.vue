<template>
<div class="user">
    <Card>
        <Form :model="formData" :label-width="80" class="form_box">
            <FormItem label="姓名">
                <Input v-model="formData.realName" placeholder="请输入姓名" />
            </FormItem>

                <FormItem label="手机">

                    <Input ref="phoneNumber" v-model="formData.mobile" placeholder="请输入手机号" />

            </FormItem>

                    <v-origanation @child-orgId="handleOrgId" :child-msg="formData.orgId"></v-origanation>

                    <FormItem label="状态">
                        <Select v-model="formData.disabled" style="width:200px">
                           <Option v-for="(item,index) in authoudStatus" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <div style="margin-left:80px;">
                        <Button type="primary" @click="handleSearch()">搜索</Button>
                        <Button @click="handleResetForm()" style="margin-left: 8px">重置</Button>
                    </div>

        </Form>
    </Card>
    <div>
        <div class="editButton">
            <Button class="buttonCommon" size="small" @click="addUser()">新增</Button>
            <Button class="buttonCommon" size="small" @click="editUser()">编辑</Button>
            <Button size="small" @click="deleteUser()">禁用</Button>
        </div>
        <Table border ref="selection" :loading="loading" :columns="columns4" :data="tableData" @on-row-click="handleRowClick" @on-selection-change="handleSelectionChange"></Table>
        <Page :total="total" :page-size="formData.rows" :current="formData.page" show-total class="paging" @on-change="changepage"></Page>
    </div>

</div>
</template>

<script>
import vOriganation from "@/components/origanation";
import ahoudStatus from "@/components/ahoudStatus";
import {
  persionList,
  persionAthoud,
  dealerOrganizations,
  deleteList,
  positionList,
  addDealerOrganizations,
  dealerShopsList,
  rolesList,
  userSave,
  editPersion,
  resetPassword
} from "@/api/persionalManage.js";
import userColoms from "@/views/dealer/user/userColoms";

import merge from "webpack-merge";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      formData: {
        realName: null,
        mobile: "",
        orgId: "",
        disabled: 2,
        page: 1, // 当前页
        rows: 10 // 每页显示多少条
      },
      tableData: [],
      userIds: [], //权限参数
      userData: [], //权限数据
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "realName",
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleNameEdit(params.row.id);
                  }
                }
              },
              params.row.realName
            );
          }
        },
        {
          title: "手机",
          key: "mobile"
        },
        {
          title: "职位",
          key: "position",
          width: 100
        },
        {
          title: "所属组织",
          key: "orgName"
        },
        {
          title: "权限",
          key: "athoud",
          render: (h, params) => {
            let strArr = params.row.athoud;
            return h("div", [
              h("test", {
                props: {
                  persionAthouds: strArr
                }
              })
            ]);
          }
        },
        {
          title: "交互屏头像",
          key: "avatar",
          align: "center",
          width: 100,
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
          width: 110,
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
          width: 100,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.disabled == true ? "#c5c8ce" : "#2db7f5"
                }
              },
              params.row.disabled == false ? "启用" : "禁用"
            );
          }
        },
        {
          title: "企信状态",
          key: "qixinStatus",
          width: 100,
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
          width: 100
        },
        {
          title: "创建时间",
          key: "createDate",
          width: 200
        }
      ],
      // 初始化信息总条数
      total: 0,
      // 每页显示多少条
      pageSize: 10,
      current: 1, //当前页
      loading: true,
      modal1: false,
      modalEdit: false,
      titleText: "", //标题
      multipleSelection: [], //勾选中的值
      parentObj: "", //储存内容
      flag: false,
      dataList: [], //储存数据

      addShow: false, //新增
      editShow: false,

      // 添加
      id: null,

      value: "",

      // 状态
      authoudStatus: [
        {
          value: 0,
          label: "启用" //false
        },
        {
          value: 1,
          label: "禁用" //true
        },
        {
          value: 2,
          label: "全部" //null
        }
      ]
    };
  },
  mounted() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "经销商管理"
      },
      {
        name: "人员管理"
      }
    ];
    // this.$store.commit(this.GLOBAL_TYPES.SET_breadcrumbs,breadcrumbs)
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    // console.log("设置面包屑")
    this.tableDataList();
  },
  components: {
    vOriganation,
    ahoudStatus,
    userColoms
  },
  created() {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    //  初始化table
    tableDataList() {
      this.loading = true;
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
      this.formData.realName = this.$route.query.realName;
      this.formData.orgId = this.$route.query.orgId;
      this.formData.mobile = this.$route.query.mobile;
      let disabled = this.$route.query.disabled;
      if (disabled == 0) {
        this.formData.disabled = parseInt(disabled);
      } else if (disabled == 1) {
        this.formData.disabled = parseInt(disabled);
      } else {
        this.formData.disabled = 2;
      }

      let params = {};
      if (this.formData.disabled == 0) {
        params.disabled = false;
      } else if (this.formData.disabled == 1) {
        params.disabled = true;
      } else if (this.formData.disabled == 2) {
        params.disabled = null;
      }

      params.page = this.formData.page;
      params.rows = this.formData.rows;
      params.realName = this.formData.realName;
      params.orgId = this.formData.orgId;
      params.mobile = this.formData.mobile;

      persionList(params).then(data => {
        let _this = this;
        _this.dataList = [];
        if (data.data.code == 200) {
          this.total = data.data.data.total;
          let tableDataListOne = data.data.data.list;
          tableDataListOne.forEach(item => {
            let obj = {};
            obj.id = item.id;
            obj.realName = item.realName;
            obj.mobile = item.principal;
            obj.position = item.position;
            obj.orgName = item.orgName;
            obj.disabled = item.disabled;
            obj.creater = item.creater;
            obj.createDate = item.createDate;
            obj.avatar = item.avatar;
            obj.appletQrcode = item.appletQrcode;
            obj.qixinStatus = item.qixinStatus;
            _this.dataList.push(obj);
          });

          //  获取权限的id
          _this.dataList.forEach(item => {
            this.userIds.push(item.id);
          });
          persionAthoud({
            userIdList: this.userIds
          }).then(data => {
            // console.log(data, "角色");
            if (data.data.code == 200) {
              _this.userData = data.data.data;
              _this.loading = false;

              if (_this.dataList.length > 0) {
                for (let i = 0; i < _this.dataList.length; i++) {
                  for (let j = 0; j < _this.userData.length; j++) {
                    if (_this.dataList[i].id == _this.userData[j].userId) {
                      let authoudList = _this.userData[j].userRoleList;
                      // let str = "";

                      let arr = [];
                      for (let i = 0; i < authoudList.length; i++) {
                        // str += authoudList[i].name + ",";
                        arr.push(authoudList[i].name);
                      }

                      // dataList[i].athoud = str.substring(0, str.length - 1);

                      _this.dataList[i].athoud = arr;
                      // console.log(_this.dataList, 88889997777);
                      _this.tableData = _this.dataList;
                    }
                  }
                }
              } else {
                _this.tableData = _this.dataList;
              }
            }
          });
        }
      });
    },
    // 改变路由的参数
    updateRouterParam() {
      // 修改路由参数值
      this.$router.push({
        query: this.formData
      });
    },
    handleOrgId(val) {
      // console.log(val, "组织");
      this.formData.orgId = val;
    },
    handleStatus(val) {
      // console.log(val, "状态");
      if (val == 0) {
        this.formData.disabled = false;
      } else if (val == 1) {
        this.formData.disabled = true;
      }
      this.formData.disabled = val;
    },
    //搜索
    handleSearch() {
      this.formData.page = 1;
      this.updateRouterParam();
    },

    handleResetForm() {
      this.loading = true;
      this.formData.realName = null;
      this.formData.mobile = "";
      this.formData.orgId = null;
      this.formData.disabled = 2;
      this.formData.page = 1;
      this.formData.rows = 10;
      this.updateRouterParam();
    },
    changepage(val) {
      this.formData.page = val;
      this.updateRouterParam();
    },
    addUser() {
      this.$router.push({
        name: "dealer_user_edit"
      });
    },

    //   勾选获取的row
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
    deleteUser() {
      if (this.multipleSelection.length > 0) {
        let params = this.multipleSelection;
        let deleteId = [];
        for (let i = 0; i < params.length; i++) {
          deleteId.push(params[i].id.toString());
        }
        deleteList({
          userIdList: deleteId
        }).then(response => {
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.multipleSelection = [];
            // 初始化 table列表
            let params = {
              page: 1,
              rows: 10,
              realName: null,
              mobile: null,
              orgId: null,
              disabled: undefined
            };
            this.current = 1;
            this.loading = true;
            this.tableDataList(params);
          }
        });
      } else {
        this.$Message.warning("请勾选禁用选项！");
      }
    },

    // 编辑
    editUser() {
      if (this.multipleSelection.length == 0) {
        this.$Message.info("请勾选内容");
      } else if (this.multipleSelection.length > 1) {
        this.$Message.info("不能勾选多条");
      } else {
        let choosePersersion = this.multipleSelection[0];
        let persionID = choosePersersion.id;
        this.$router.push({
          name: "dealer_user_edit",
          query: {
            id: persionID
          }
        });
      }
    },
    handleNameEdit(id) {
      let persionID = id;
      this.$router.push({
        name: "dealer_user_edit",
        query: {
          id: persionID
        }
      });
    }
  },
  watch: {
    $route: "tableDataList"
  }
};
</script>

<style lang="less">
.form_box {
  display: flex;
}

.buttonCommon {
  margin-right: 10px;
}

.paging {
  float: right;
  margin-top: 10px;
}

.editButton {
  display: flex;
  margin: 10px 0;
}

.buttonCommon {
  margin-right: 10px;
}

.select-drop {
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 200px;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  position: absolute;
  z-index: 1000;
  width: 100%;

  .ulPosition {
    min-width: 100%;
    list-style: none;
    position: relative;

    li {
      cursor: pointer;
      padding: 1px 4px;
    }
  }
}

.text {
  font-size: 12px;
  color: #ff6600;
}
</style>
