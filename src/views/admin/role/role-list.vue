<template>
     <Layout> 
        <Layout style="background:#fff">
            <Content style="textAlign:left">

                 <div>
                   <Form ref="formInline" :model="formInline" inline :label-width="60">
                        <FormItem prop="roleName" label="角色名称">
                            <Input type="text" clearable v-model="formInline.roleName" @on-enter="handleSearch">
                            </Input>
                        </FormItem>
                        <FormItem prop="roleLevel" label="类型" style="width:200px">
                            <Select v-model="formInline.roleLevel">
                               <Option value="ALL">全部</Option>
                                <Option value="PUBLIC">公共</Option>
                                <Option value="SUPER">集团</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSearch()">搜 索</Button>
                             <Button style="margin-left:20px;" @click="handleReset()">重 置</Button>
                        </FormItem>
                    </Form>
                 </div>
                 <div style="padding:15px 0 15px 0" class="buttonList">
                    <add-buton></add-buton>
                </div>
                <div class="contentBox">
                    <div>
                      <!-- width="813" -->
                        <!-- <Table width='1072' height="520" @on-selection-change="handleSelcet" @on-row-click="handleRow" :loading="loading" border :columns="columsTableRoles" :data="dataTableRoles"></Table> -->
                        <Table width='1072' height="520" @on-selection-change="handleSelcet" :loading="loading" border :columns="columsTableRoles" :data="dataTableRoles"></Table>
                        <Page class="pageClass" show-sizer :page-size-opts="[10,20,50,80,100]" @on-page-size-change="changePageSize" :total="total" :current="formInline.page" :page-size="formInline.rows" @on-change="handlePage" show-total />
                    </div>

                      <Card style="width:550px;height:520px;position:relative;">
                           <div class="showIdTableList" v-if="showIdTableList">
                             <h4 class="roleTop">角色名称:&nbsp;&nbsp;{{mainTableTitle}}</h4>
                            <Table height="475" width="530" :loading="twoLoading" :columns="columns1" border :data="dataIdTable"></Table>
                            <Page class="pageClassTwo" show-sizer @on-page-size-change="changeTwoPageSize" :page-size-opts="[9,20,50,80,100]" :total="twoTotal" :current="twoPage" :page-size="towRows" @on-change="handleTwoPage" show-total />  
                           </div>
                           <div v-else>
                             <h4 class="roleTop">角色使用人员</h4>
                             <p class="titleTip">点击左侧表格行查看对应角色使用人员</p>
                           </div>
                      </Card>                   
                </div>
                
            </Content>
            <Modal
                v-model="showAddPersion"
                width="1100"
                title="选择人员"
               >
                   <Row style="background:#eee;padding:20px">
                    <Col span="11">
                        <Card :bordered="false">
                            <Input class="searchInput" v-model="searchParams.searchValue" icon="ios-search" @on-click="handleClickSearch" @on-enter="handleUserSearch" placeholder="输入姓名/职位/手机号/组织，按回车键搜索" style="width: 86%">
                            </Input>
                          <div class="demo-spin-article leftBox">
                                <ul v-if="leftUserData.length>0">
                                  <li v-for="(item,index) in leftUserData" :key="item.id" @click="handleSelectUser(item)">
                                    <p>{{item.realName}}({{item.username}})</p>
                                    <p>{{item.orgPathName}}</p>
                                  </li>
                                </ul>
                                <p v-else>暂时无数据</p>
                              <Spin size="large" fix v-if="spinShow"></Spin>
                          </div>
                           
                        </Card>
                    </Col>
                    <Col span="11" offset="2">
                        <Card shadow>
                            <div class="rightBox">
                              <h3>已选择的人员：</h3>
                            <ul>
                              <li v-for="(item,index) in rightUserData" :key="item.id">
                                  <div>
                                     <p>{{item.realName}}({{item.username}})</p>
                                    <p>{{item.orgPathName}}</p>
                                  </div>
                                  <span @click="handleUserDelete(item)"><Icon type="md-close" /></span>
                              </li>
                            </ul>
                             <Spin size="large" fix v-if="spinShow"></Spin>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <div class="footerButton">
                        <Button type="primary" @click="handleSave">保 存</Button>
                        <Button @click="handelBack" style="margin-left:15px;">返 回</Button>
                    </div>
                </Row>
              
                <div slot="footer"></div>
            </Modal>

             <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
        </Layout>
    </Layout>
</template>

<script>
import {
  rolePage,
  roleLevelTypeList,
  rolePermissionAndUserNum,
  roleUserList,
  getFullOrgName,
  deleteRoleInfo,
  deleteRoleUser,
  getUserNumber,
  addRoleUser,
  checkRoleUser
} from "@/api/roleList.js";
import addButon from "./addButton";
import aletTip from "@/components/alertTip.vue";

export default {
  data() {
    return {
      alertTipParams:{
        headTip:'删除角色',
        titleTip:'你确认全部移除使用人员并删除该角色吗？'
      },
      deleteRowId: "",
      alertShow: false,
      deleteComfirm: false,
      showAddPersion: false,
      mainTableTitle: "", //显示题目
      showIdTableList: false,
      fromId: "", //根据id获取对应的table
      columsTableRoles: [
        {
          title: "角色名称",
          key: "roleName",
          width: 200,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let paramsRoleName = {
                      id: params.row.id,
                      roleName: params.row.roleName
                    };
                    this.handleRow(paramsRoleName);
                  }
                }
              },
              params.row.roleName
            );
          }
        },

        {
          title: "类型",
          key: "roleType",
          width: 80,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let paramsRoleType = {
                      id: params.row.id,
                      roleName: params.row.roleName
                    };
                    this.handleRow(paramsRoleType);
                  }
                }
              },
              this.roleTypeList[params.row.roleType]
            );
          }
        },
        {
          title: "使用人数",
          key: "userNum",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    let paramsUserNum = {
                      id: params.row.id,
                      roleName: params.row.roleName
                    };
                    this.handleRow(paramsUserNum);
                  }
                }
              },
              params.row.userNum
            );
          }
        },
        {
          title: "备注",
          key: "description",
          width: 238,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer",
                  width: "220px",
                  height: "25px"
                },
                on: {
                  click: () => {
                    let paramsDescription = {
                      id: params.row.id,
                      roleName: params.row.roleName
                    };
                    this.handleRow(paramsDescription);
                  }
                }
              },
              params.row.description
            );
          }
        },
        {
          title: "创建人",
          key: "creater",
          width: 100,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer",
                  width: "80px",
                  height: "25px"
                },
                on: {
                  click: () => {
                    let paramsCreater = {
                      id: params.row.id,
                      roleName: params.row.roleName
                    };
                    this.handleRow(paramsCreater);
                  }
                }
              },
              params.row.creater
            );
          }
        },
        {
          title: "创建时间",
          key: "createDate",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  cursor: "pointer",
                  width: "130px",
                  height: "25px"
                },
                on: {
                  click: () => {
                    let paramsCreateDate = {
                      id: params.row.id,
                      roleName: params.row.roleName
                    };
                    this.handleRow(paramsCreateDate);
                  }
                }
              },
              params.row.createDate
            );
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
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
                      this.handleAddPerson(params);
                    }
                  }
                },
                "添加人员"
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
                      this.handleEditShow(params);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    // marginLeft:'10px'
                  },
                  on: {
                    click: () => {
                      this.handleRemove(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      multipleSelection: [], //勾选中的值
      dataTem: [], //临时存储数据
      dataTableRoles: [],
      formInline: {
        roleName: "",
        roleLevel: "",
        page: 1,
        rows: 10
      },
      // page: 1, //第一个table分页
      // rows: 10, //第一个
      total: 0, //第一个
      roleTypeList: {}, //类型
      loading: true, //第一个
      roleLeftId: "", //角色id

      //   第二个
      columns1: [
        {
          title: "姓名/电话/部门",
          key: "",
          render: (h, params) => {
            return h("showInfoTableColums", {
              props: {
                infoRows: params.row
              }
            });
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleRightRemove(params);
                    }
                  }
                },
                "移除"
              )
            ]);
          }
        }
      ],
      dataIdTable: [],
      dataIdTem: [], //临时
      twoPage: 1,
      towRows: 9,
      twoTotal: 0,
      twoLoading: true,
      searchParams: {
        //添加人员搜索参数
        roleId: "",
        searchValue: ""
      },
      leftUserData: [],
      rightUserData: [],
      rightTemp: [],
      modal_loading: false,
      spinShow: true //加载
    };
  },
  components: {
    addButon,
    aletTip
  },
  created() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "权限/角色"
      },
      {
        name: "角色管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.getRoleLevelTypeList();
    this.getRolePage();
  },
  methods: {
    // 获取第一个table的列表
    getRolePage() {
      let page = this.$route.query.page;
      let rows = this.$route.query.rows;
      if (page && !isNaN(page)) {
        this.formInline.page = parseInt(page);
      } else {
        this.formInline.page = 1;
      }
      if (rows && !isNaN(rows)) {
        this.formInline.rows = parseInt(rows);
      } else {
        this.formInline.rows = 10;
      }
      let params = {};
      params.page = this.formInline.page;
      params.rows = this.formInline.rows;
      params.roleName = this.$route.query.roleName;
      if (this.$route.query.roleLevel == "ALL") {
        params.roleLevel = "";
      } else {
        params.roleLevel = this.$route.query.roleLevel;
      }

      this.dataTem = [];
      this.dataTableRoles = [];
      this.loading = true;
      rolePage(params).then(response => {
        if (response.data.code == 200) {
          this.total = response.data.data.total;
          let dataArr = response.data.data.list;
          let ids = [];
          dataArr.forEach(item => {
            let tableObject = {};
            ids.push(item.id);
            tableObject.id = item.id;
            tableObject.roleName = item.roleName;
            tableObject.roleType = item.roleLevel;
            tableObject.description = item.description;
            tableObject.creater = item.creater;
            tableObject.createDate = item.createDate;
            this.dataTem.push(tableObject);
          });
          this.getRolePermissionAndUserNum(ids.join(","));
        }
      });
    },
    // 获取角色类型
    getRoleLevelTypeList() {
      roleLevelTypeList().then(response => {
        if (response.data.code == 200) {
          response.data.data.forEach(item => {
            this.roleTypeList[item["id"]] = item["text"];
          });
        }
      });
    },
    // 重置
    handleReset() {
      this.formInline.roleName = "";
      this.formInline.roleLevel = "";
      this.updateParams();
    },

    handleAddPerson(data) {
      this.searchParams.roleId = data.row.id;
      this.rightUserData = [];
      this.rightTemp = [];
      this.showAddPersion = true;
      this.handleGetUer();
    },
    handleGetUer() {
      //获取人员数
      this.leftUserData = [];
      this.spinShow = true;
      getUserNumber(this.searchParams).then(response => {
        if (response.data.code == 200) {
          this.leftUserData = response.data.data;
          this.spinShow = false;
        }
      });
    },
    handleUserSearch() {
      this.handleGetUer();
    },
    handleClickSearch() {
      this.handleGetUer();
    },
    handleSelectUser(data) {
   
      let params = {
        roleId: this.searchParams.roleId,
        userId: data.id
      };
        this.rightTemp.push(data);
          let rightArr = this.removeDuplicatedItem(this.rightTemp);
          this.rightUserData = rightArr;
      // checkRoleUser(params).then(response => {
       
      //   if (response.data.data == 1) {
      //     this.rightTemp.push(data);
      //     let rightArr = this.removeDuplicatedItem(this.rightTemp);
      //     this.rightUserData = rightArr;
      //   } else {
      //     this.$Message.warning("没有添加到相应的可用组织！！");
      //   }
      // });
    },
    handleUserDelete(data) {
      let deleteTemp = [];
      deleteTemp.push(data);
      for (let i = 0; i < this.rightUserData.length; i++) {
        for (let j = 0; j < deleteTemp.length; j++) {
          if (this.rightUserData[i].id == deleteTemp[j].id) {
             
            this.rightUserData.splice(i, 1);
           
          }
        }
      }
     
    },
    // 去掉旧数据
    removeDuplicatedItem(arr) {
      for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].id == arr[j].id) {
            arr.splice(j, 1); //console.log(arr[j]);
            j--;
          }
        }
      }
      return arr;
    },
    handleSave() {
      let params = {};
      params.roleId = this.searchParams.roleId;
      let userIds = [];
      this.rightUserData.forEach(item => {
        userIds.push(item.id);
      });
      params.userIdList = userIds;
      addRoleUser(params).then(reponse => {
        if (reponse.data.code == 200) {
          this.$Message.success(reponse.data.msg);
          this.showAddPersion = false;
          this.getRolePage();
          // this.handleRoleName();
        }
      });
    },
    handelBack() {
      this.showAddPersion = false;
         this.rightTemp=[];
    },
    // 获取权限和人数
    getRolePermissionAndUserNum(ids) {
      rolePermissionAndUserNum({ ids: ids }).then(response => {
        if (response.data.code == 200) {
          let retArr = response.data.data;
          this.dataTem.forEach(itemTemp => {
            retArr.forEach(item => {
              if (itemTemp.id == item.roleId) {
                itemTemp.permissionNameList = item.permissionNameList;
                itemTemp.userNum = item.userNum;
              }
            });
          });
          this.dataTableRoles = this.dataTem;
          this.loading = false;
        }
      });
    },
    handlePage(page) {
      this.formInline.page = page;
      this.updateParams();
    },
    changePageSize(val) {
      this.formInline.rows = val;
      this.updateParams();
    },
    changeTwoPageSize(val) {
      this.towRows = val;
      let obj = {};
      obj.id = this.fromId;
      obj.roleName = this.mainTableTitle;
      this.handleRow(obj);
    },
    // 第二个table
    handleTwoPage(page) {
      this.twoPage = page;
      // this.handleRoleName();
      let obj = {};
      obj.id = this.fromId;
      obj.roleName = this.mainTableTitle;
      this.handleRow(obj);
    },
    updateParams() {
      this.$router.push({
        query: this.formInline
      });
    },
    // 点击行
    handleRow(data) {
      // console.log(data,'行')
      this.roleLeftId = data.id;
      this.mainTableTitle = data.roleName;
      this.fromId = data.id;
      let params = {
        roleId: this.fromId,
        page: this.twoPage,
        rows: this.towRows
      };

      this.dataIdTable = [];
      this.showIdTableList = false;
      this.twoLoading = true;
      roleUserList(params).then(response => {
        if (response.data.code == 200) {
          this.showIdTableList = true;

          this.twoTotal = response.data.data.total;
          response.data.data.list.forEach(item => {
            getFullOrgName({ orgId: item.orgId }).then(response => {
              if (response.data.code == 200) {
                // console.log(response,88888)
                item.orgName = response.data.data;
                let objParams = {};
                objParams.id = item.id;
                objParams.realName = item.realName;
                objParams.mobile = item.mobile;
                objParams.position = item.position;
                objParams.disabled = item.disabled;
                objParams.creater = item.creater;
                objParams.createDate = item.createDate;
                objParams.orgName = item.orgName;
                this.dataIdTable.push(objParams);
                this.twoLoading = false;
              }
            });
          });
          this.twoLoading = false;
        }
      });
    },
    // 点击单元格获取第二个table数据
    handleRoleName() {
      let params = {
        roleId: this.fromId,
        page: this.twoPage,
        rows: this.towRows
      };

      this.dataIdTable = [];
      this.showIdTableList = false;
      this.twoLoading = true;
      roleUserList(params).then(response => {
        if (response.data.code == 200) {
          this.showIdTableList = true;

          this.twoTotal = response.data.data.total;
          response.data.data.list.forEach(item => {
            getFullOrgName({ orgId: item.id }).then(response => {
              if (response.data.code == 200) {
                item.orgName = response.data.data;
                let objParams = {};
                objParams.id = item.id;
                objParams.realName = item.realName;
                objParams.mobile = item.mobile;
                objParams.position = item.position;
                objParams.disabled = item.disabled;
                objParams.creater = item.creater;
                objParams.createDate = item.createDate;
                objParams.orgName = item.orgName;
                this.dataIdTable.push(objParams);
                this.twoLoading = false;
              }
            });
          });
          this.twoLoading = false;
        }
      });
    },
    handleSelcet(data) {
      this.multipleSelection = data;
    },
    handleEditShow(params) {
      this.$router.push({
        path: "/admin/role/add",
        query: {
          type: params.row.roleType,
          id: params.row.id,
          editTye: true
        }
      });
    },
    handleRemove(params) {
      this.alertShow = true;
      // console.log(params,'params')
      this.deleteRowId = params.row.id;
    },
    handleRightRemove(params) {
      let roleUserIds = [];
      roleUserIds.push(params.row.id.toString());
      let paramsObj = {
        userIdList: roleUserIds,
        roleId: this.roleLeftId
      };
      deleteRoleUser(paramsObj).then(response => {
        if (response.data.code == 200) {
          this.$Message.success(response.data.msg);
          this.handleRoleName();
           this.getRolePage();
        }
      });
    },
    handleSearch() {
      this.updateParams();
    },
    handleCloseTip(data) {
      this.deleteComfirm = data;
      if (this.deleteComfirm == "true") {
        let paramsLis = [];
        paramsLis.push(this.deleteRowId.toString());
        deleteRoleInfo({ roleIdList: paramsLis }).then(response => {
          if (response.data.code == 200) {
            this.$Message.success(response.data.msg);
            this.getRolePage();
          }
        });
        this.alertShow = false;
      } else {
        this.alertShow = false;
      }
    }
  },
  watch: {
    $route: "getRolePage"
  }
};
</script>
<style lang="less" scoped>
.pageClass {
  margin-top: 10px;
  position: absolute;
  left: 57%;
  transform: translateX(-50%);
}
.contentBox {
  display: flex;
  justify-content: space-between;
}
.pageClassTwo {
  margin-top: 15px;
  position: absolute;
  right: 3px;
}
.roleTop {
  margin-bottom: 3px;
}
.titleTip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  color: #ff7836;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 2s;
}

.loading-enter,
.loading-leave-active {
  opacity: 0;
}

.buttonList {
  display: flex;
}
.leftBox {
  margin-top: 40px;
  height: 500px;
  overflow-y: scroll;
  ul {
    list-style: none;
    margin-top: 15px;
    li {
      width: 95%;
      line-height: 30px;
      border-bottom: 1px solid #e8eaec;
      cursor: pointer;
    }
  }
}
.rightBox {
  height: 500px;

  overflow-y: scroll;
  ul {
    list-style: none;
    margin-top: 30px;
    li {
      display: flex;
      line-height: 30px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8eaec;
      div {
        flex: 1;
      }
      span {
        display: inline-block;
        padding: 0 15px;
        cursor: pointer;
      }
    }
  }
}

.footerButton {
  text-align: center;
  margin-top: 25px;
}
.searchInput {
  position: absolute;
}
</style>


