<template>
  <div id="wrap-div">
    <Layout>
      <Content :style="{textAlign:'left', paddingLeft:'15px', background: '#fff'}">
        <!-- 查询条件 -->
        <Card>
          <Form ref="formQuery"
            :label-width='80'
            inline>
            <FormItem label="名称"
              prop="name">
              <Input type="text"
                v-model="routerParams.name"
                placeholder="请输入名称"
                clearable
                style="width:200px"></Input>
            </FormItem>
            <FormItem label="类型"
              prop="type">
              <Select v-model="routerParams.type"
                placeholder="请选择"
                clearable
                style="width:200px">
                <Option value="PLATFORM">中台</Option>
                <Option value="O2O">O2O项目</Option>
                <Option value="3D">3D云设计</Option>
              </Select>
            </FormItem>

            <FormItem label="状态"
              prop="disable">
              <Select v-model="routerParams.disable"
                placeholder="请选择"
                clearable
                style="width:200px">
                <Option value="false">启用</Option>
                <Option value="true">禁用</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary"
                @click="handleSearch()">搜 索
              </Button>
              <Button @click="handleResetForm()"
                style="margin-left: 8px">重 置
              </Button>
            </FormItem>
          </Form>
          <!--<div>-->
            <!--<Tag v-if="showOrgTag"-->
              <!--@on-close="handleOrgTagClose"-->
              <!--closable>{{fullOrgName}}-->
            <!--</Tag>-->
          <!--</div>-->
        </Card>
        <!-- 功能键 -->
        <div style="padding:15px 0 15px 0">
          <Button size="small"
            @click="addSystem">新增
          </Button>
          <Button size="small"
            @click="editSystem"
            style="margin-left: 8px">编辑
          </Button>
          <Button size="small"
            @click="disableSystem()"
            style="margin-left: 8px">禁用
          </Button>
        </div>
        <!-- 查询结果 -->
        <div>
          <Table border
            :loading="loading"
            @on-row-click="handleRowClick"
            ref="selection"
            :columns="columns"
            :data="tableData"
            @on-selection-change="handleSystemSelectionChange"></Table>
          <Page :total="total"
            :page-size="routerParams.rows"
            :current="routerParams.page"
            show-total
            class="paging"
            @on-change="changePage"></Page>
        </div>

        <Modal
          v-model="showAddEdit"
          :title='showText'>
          <system-add :systemId="systemId"
            @child-show="handleShow"
            @child-back="handleClose"></system-add>
          <div slot="footer"></div>
        </Modal>
      </Content>
    </Layout>
  </div>
</template>

<script>
  import systemAdd from "./system-add";

  import {
    findSystemList,
    disableSystemByIdList,
  } from "@/api/system.js";

  import $ from 'jquery';

  export default {
    data() {
      return {
        showAddEdit: false,
        showText: '',
        maxHeight: 600,// 页面最大高度
        //        showOrgTag: false, // 是否显示“已选组织”标签
        //        fullOrgName: '', // 已选组织全称
        //        address: {},
        //        dealerList: [],
        total: 0, // 初始化信息总条数
        loading: false,
        tableData: [],
        systemSelection: [],
        systemId: undefined,
        routerParams: {
          name: undefined,
          page: 1,
          rows: 10,
          type: undefined,
          disable: undefined
        },
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center'
        },
          {
            title: '名称',
            key: 'name',
              render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.handleEidt(params);
                  }
                }
              },
              params.row.name
            );
          }
          },
          {
            title: '代码',
            key: 'code',
            width: 200
          },
          {
            title: '类型',
            key: 'type',
            width: 120,
            render: (h, params) => {
              if (params.row.type == 'PLATFORM') {
                return h(
                  "span",
                  '中台'
                );
              } else if (params.row.type == 'O2O') {
                return h(
                  "span",
                  'O2O项目'
                );
              }
              else if (params.row.type == '3D') {
                return h(
                  "span",
                  '3D云设计'
                );
              } else {
                return h(
                  "span",
                  ''
                );
              }
            }
          },
          {
            title: '状态',
            key: 'disable',
            width: 80,
            render: (h, params) => {
              return h("span", {
                  style: {
                    color: params.row.disable ? "#c5c8ce" : "#2db7f5"
                  }
                },
                params.row.disable ? "禁用" : "启用");
            }
          },
          {
            title: '描述',
            key: 'description',
            tooltip: false,
            ellipsis: true
          },
          {
            title: "操作",
            key: "",
            render: (h, params) => {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.handleEidt(params);
                    }
                  }
                },
                "编辑"
              );
            }
          }
        ]
      }
    },
    components: {
      systemAdd
    },
    mounted() {
  
 let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "系统设置"
      },
      {
        name: "系统管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

      this.getSystemPageList();
    },
    created() {
      this.$store.dispatch("recordAddress", {});
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': function (val) {
        this.getSystemPageList();
      }
    },
    methods: {
      getSystemPageList() {
        let params = {
          name: "",
          page: 1,
          rows: 10,
          type: '',
          disable: ''
        };
        this.loading = true;
        this.dataTable = [];
        let name = this.$route.query.name;
        let page = this.$route.query.page;
        let rows = this.$route.query.rows;
        let type = this.$route.query.type;
        let disable = this.$route.query.disable;

        if (page != undefined) {
          this.routerParams.page = Number(page);

        } else {
          this.routerParams.page = 1;
        }
        if (rows != undefined) {
          this.routerParams.rows = Number(rows);
        } else {
          this.routerParams.rows = 10;
        }
        this.routerParams.name = name;
        this.routerParams.type = type;
        this.routerParams.disable = disable;

        params.name = this.routerParams.name;
        params.page = this.routerParams.page;
        params.rows = this.routerParams.rows;
        params.type = this.routerParams.type;
        params.disable = this.routerParams.disable;

        findSystemList(params).then(response => {
          if (response.data.code == 200) {
            this.tableData = response.data.data.list;
            this.total = response.data.data.total;
            setTimeout(() => {
              this.loading = false;
            }, 1000);
          }
        })
      },
      changePage(val) {
        this.routerParams.page = val;
        this.updateRouterParam();
      },
      updateRouterParam() {
        // 修改路由参数值
        this.$router.push({
          query: this.routerParams
        });
      },
      addSystem(id) { // 新增
        this.systemId = undefined;
        this.$refs.selection.selectAll(false);
        this.systemSelection = [];
        this.showAddEdit = true;
        this.showText = '新增';
      },
      editSystem() { // 编辑
        if (this.systemSelection.length == 0) {
          this.$Message.warning("请选择一条数据");
          return;
        } else if (this.systemSelection.length > 1) {
          this.$Message.warning("只能选择一条数据");
          return;
        }

        this.systemId = this.systemSelection[0].id;

        this.showAddEdit = true;
        this.showText = '编辑';
      },
      disableSystem() {
        if (this.systemSelection.length == 0) {
          this.$Message.warning("请勾选选项！");
        } else {
          let systemSelectionTemp = this.systemSelection;
          let disableId = [];
          for (let i = 0; i < systemSelectionTemp.length; i++) {
            disableId.push(systemSelectionTemp[i].id.toString());
          }
          //          console.info('disableId == ' + disableId)
          disableSystemByIdList({ systemIdList: disableId }).then(response => {
            if (response.data.code == 200) {
              this.$Message.success(response.data.msg);
              this.systemSelection = [];
              this.getSystemPageList();
            }
          });
        }
      },
      handleSearch() {
        this.routerParams.page = 1;
        this.updateRouterParam();
      },
      handleResetForm() {
        this.routerParams.page = Number(1);
        this.routerParams.rows = Number(10);
        this.routerParams.name = undefined;
        this.routerParams.type = undefined;
        this.routerParams.disable = undefined;
      },
      handleSystemSelectionChange(selection) {
        this.systemSelection = selection;
      },
          handleRowClick(value, index) {
      this.$refs.selection.toggleSelect(index);
    },
      handleEidt(data){
//        console.info('editSystem',data.row.id)
        this.systemId = data.row.id;

        this.showAddEdit = true;
        this.showText = '编辑';
        //        this.$emit("system-edit", data.row);
      },
      handleShow() {
        this.showAddEdit = false;
        this.systemId = undefined;
        this.systemSelection = [];
        this.getSystemPageList();
      },
      handleClose(data) {
        this.showAddEdit = false;
        this.systemId = undefined;
        this.systemSelection = [];
        this.getSystemPageList();
      }
    }
  }
</script>

<style scoped>
  .paging {
    text-align: right;
    margin-top: 10px;
  }
</style>
