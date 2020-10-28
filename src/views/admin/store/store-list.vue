<template>
  <div>
    <Layout>
      <Sider hide-trigger
        style="background:#ffffff;">
        <p class="storeTitle">门店:</p>
        <Card style="height:700px;overflow: auto;padding-top:10px;">
          <org-tree ref="orgTree"
            type="outer"
            :selectedId="selectedId"
            :expandIds="expandIds"
            @org-select="handleOrgSelect"
            @org-toggle-expand="handleOrgToggleExpand"></org-tree>
        </Card>
      </Sider>
      <Layout style="background:#ffffff;padding:0px 0 0 10px">
        <store-header></store-header>
        <Content>
          <div class="buttonList"
            style="display:flex;padding: 16px 0px 8px;">
            <Button @click="handleAddModity"
            :disabled="dealerFalg"
              >添加商品
            </Button>
            <!-- <Button @click="handleInnerphysicalDisplay" style="margin-left:8px;" :disabled="dealerFalg">设置实物展示</Button> -->
            <Button style="margin-left:8px;"
              @click="handlePrice"
              :disabled="dealerFalg">打印价格牌
            </Button>
            <Button style="margin-left:8px;"
              @click="handleImport"
              :disabled="dealerFalg">导入商品
            </Button>

            <Button @click="handleExportShopModity"
              style="margin-left:8px;"
              :disabled="dealerFalg">导出商品
            </Button>
           
            <Button style="margin-left:8px;"
            @click="handleAdminEditPrice"
              :disabled="dealerFalg">批量修改价格
            </Button>
            <Button @click="handleDownLoadModityQrCode"
              style="margin-left:8px;"
              :disabled="dealerFalg">下载二维码
            </Button>
            <!--<Button @click="handleDownLoadTest"-->
              <!--style="margin-left:8px;"-->
            <!--&gt;下载测试-->
            <!--</Button>-->
          </div>
          <store-table ref="defualtTable"
          @child-cancleStatus="handleTreeStatus"
            @child-table="handleEmpty"
            @child-qcord="handleQcordSeclet"></store-table>
        </Content>
        <!-- 下载二维码 -->
        <Modal
          v-model="showQcord"
          title="下载二维码"
        >
          <Form :model="formItem"
            :label-width="80">
            <FormItem label="下载范围：">
              <RadioGroup v-model="formItem.selectAll">
                <Radio label="1">全部</Radio>
                <Radio label="0">勾选的数据</Radio>
              </RadioGroup>
            </FormItem>

          </Form>
          <div slot="footer">
            <Button type="primary"
              @click="handleOk">确定
            </Button>
            <Button style="margin-left: 8px"
              @click="handleCancel">取消
            </Button>
          </div>
        </Modal>
        <!-- 导入 -->
        <Modal
          v-model="showLeaveExecls"
          title="导出数据选项"
        >
          <Form ref="formLeave"
            :model="formLeave"
            :label-width="80">
            <FormItem label="导出范围：">
              <RadioGroup v-model="formLeave.selectAll">
                <Radio label="1">全部</Radio>
                <Radio label="0">勾选的数据</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="导出内容：">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选
                </Checkbox>
              </div>
              <CheckboxGroup v-model="formLeave.names"
                @on-change="checkAllGroupChange">
                <Checkbox :label="item"
                  v-for="(item,index) in checkAllGroupData"
                  :key="index"></Checkbox>
              </CheckboxGroup>
            </FormItem>

          </Form>
          <div slot="footer">
            <Button type="primary" :disabled="loadFinishFalg"
              @click="handleLeaveOk">确定
            </Button>
            <Button style="margin-left: 8px"
              @click="handleLeaveCancel">取消
            </Button>
          </div>
        </Modal>
      </Layout>

    </Layout>
  </div>
</template>

<script>
import storeHeader from "./store-listHeader";
import storeTable from "./store-table";
import storeLeft from "./store-leftTable";
import orgTree from "./components/user-mgt-org-tree";
import axios from "axios";
import { downLoadModityQrCodeList, userShopList } from "@/api/store.js";

export default {
  computed: {
    selectedId() {
      return this.$store.getters.treeSelectedId;
    },
    expandIds() {
      return this.$store.getters.treeExpandIds;
    }
  },
  data() {
    return {
      showQcord: false,
      loadFinishFalg: false,
      formItem: {
        //下载二维码
        selectAll: "0"
      },
      secletiongList: [],
      api: "",
      showLeaveExecls: false,
      formLeave: {
        //导出
        selectAll: "0",
        names: []
      },
      indeterminate: false,
      checkAll: false,
      checkAllGroupData: [
        "门店名称",
        "产品型号",
        "产品名称",
        "规格",
        "价格（片）",
        "活动价格（片）",
        "价格（方）",
        "活动价格（方）",
        "活动开始时间(年/月/日)",
        "活动结束时间(年/月/日)",
        "特点",
        "应用范围",
        "描述",
        "类目"
      ],

      storeTemp: [],
      storeList: [],
      selectStore: "",
      activeStatus: false,
      currentSelected: null,

      testObjParma: {},
      dealerFalg: true
    };
  },
  created() {
    this.getUserShopList();
  },
  mounted() {
    let breadcrumbs = [{ name: "首页" }, { name: "内部商品管理" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.fetchData();
  },
  components: {
    storeHeader,
    storeTable,
    storeLeft,
    orgTree
  },
  methods: {
    handleOrgToggleExpand(org, expandNodes) {
      if (expandNodes && expandNodes.length > 0) {
        let expandIds = new Array();
        for (let i = 0; i < expandNodes.length; i++) {
          expandIds.push(expandNodes[i]);
        }
        this.$store.dispatch("setTreeExpandIds", expandIds);
      }
    },
    handleOrgSelect(org, root) {
      this.$store.dispatch("setTreeSelectedId", org.id);
      this.$router.push({
        query: {
          storeId: org.id,
          // type: org.type,
          type: org.type
        }
      });
    },

    fetchData() {
      //如果无参数（即点击了菜单），则清空原有选中状态
       let exp = this.$route.query.storeId;
      if(!exp){
         this.$store.dispatch("setTreeSelectedId", -1);
        this.$store.dispatch("setTreeExpandIds", []);
      }

      let storeId = this.$route.query.storeId;
      let type = this.$route.query.type;
      if (type != "DEALER_SHOP") {
        this.dealerFalg = true;
      } else {
        this.dealerFalg = false;
      }
    },

    updateRuter(id) {
      this.$router.push({
        query: {
          storeId: id
        }
      });
    },
    getUserShopList() {
      userShopList().then(response => {
        if (response.data.code == 200) {
          let stoteArr = response.data.data;
          if (stoteArr.length != 0) {
            stoteArr.forEach(item => {
              this.storeList.push(item);
            });
            // storeTemp
            this.testObjParma = this.storeList[0];
            // console.log(this.testObjParma, 7777);
            localStorage.setItem("defaultAdiminStoreId", this.testObjParma.id);

            this.$refs.defualtTable.getTable();
            let storeObj = this.storeList[0];
            this.storeTemp.push(storeObj);
          }
        }
      });
    },
    handleLeftStore(id) {
      this.cancelSelect();
      this.$refs[id][0].style.background = "rgb(213, 232, 252)";
      this.currentSelected = this.$refs[id][0].style;

      this.$router.push({
        query: {
          storeId: id
        }
      });
    },
    // 取消选中状态
    cancelSelect() {
      if (this.currentSelected != null) {
        this.currentSelected.background = "#fff";
      }
    },

    handleAddModity() {
      // console.log(this.$route.query.type)
      if (this.$route.query.storeId) {
        let storeId = this.$route.query.storeId;
        let type=this.$route.query.type;
        this.$router.push({
          path: "/admin/store/addModity",
          query: {
            storeId,
             type
          }
        });
      } else {
        //  let defaultId= localStorage.getItem("defaultAdiminStoreId");
        // let storeId = defaultId;
        // this.$router.push({
        //   path: "/admin/store/addModity",
        //   query: {
        //     storeId
        //   }
        // });
      }
    },
    handleQcordSeclet(data) {
      this.secletiongList = data;
    },
    handleDownLoadModityQrCode() {
      if (this.$route.query.storeId) {
        if (this.secletiongList.length == 0) {
          this.$Message.warning("请选择下载的内容");
        } else {
          this.showQcord = true;
        }
      } else {
        this.$Message.warning("请先选择门店!");
      }
    },
    downLoadModityQrCode(storeId, ids, selectAll) {
      window.open(
        this.api +
          "/modity-download/modityQrCodeList?storeId=" +
          storeId +
          "&ids=" +
          ids +
          "&selectAll=" +
          selectAll
      );
    },
    handleExportShopModity() {
      // if (this.secletiongList.length == 0) {
      //   this.$Message.warning("请选择导出的内容");
      // } else {
      //   this.showLeaveExecls = true;
      //    this.checkAll=true;
      //  this.formLeave.names = this.checkAllGroupData;
      // }
      this.showLeaveExecls = true;
      this.checkAll = true;
      this.formLeave.names = this.checkAllGroupData;
    },
    exportShopModity(storeId, ids, selectAll, names) {
      window.open(
        this.api +
          "/modity-download/exportShopModity?storeId=" +
          storeId +
          "&ids=" +
          ids +
          "&selectAll=" +
          selectAll +
          "&names=" +
          names
      );
    },

    handleOk() {
      let storeId = this.$route.query.storeId;
      let ids = [];
      this.secletiongList.forEach(item => {
        ids.push(item.storeModityId);
      });
      let selectAll = this.formItem.selectAll;
      this.showQcord = false;
      this.downLoadModityQrCode(storeId, ids.join(","), selectAll);
    },
    handleCancel() {
      this.showQcord = false;
    },
    // 导出
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.formLeave.names = this.checkAllGroupData;
      } else {
        this.formLeave.names = [];
      }
    },
    checkAllGroupChange(data) {
      this.formLeave.names = data;
      if (data.length === this.checkAllGroupData.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = false;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    handleLeaveOk() {
      // if (this.formLeave.names.length == 0) {
      //   this.$Message.warning("请勾选导出的内容");
      //   return;
      // } else {
      //   let storeId = this.$route.query.storeId;
      //   let ids = [];
      //   this.secletiongList.forEach(item => {
      //     ids.push(item.storeModityId);
      //   });
      //   let selectAll = this.formLeave.selectAll;
      //   let names = this.formLeave.names;
      //   this.showLeaveExecls = false;
      //   this.$refs["formLeave"].resetFields();
      //   this.exportShopModity(storeId, ids.join(","), selectAll, names);
      // }

      this.loadFinishFalg = true;
      if (this.formLeave.names.length == 0) {
        this.$Message.warning("请勾选导出的内容");
        this.loadFinishFalg = false;
        return;
      }

      let namesTemp = this.formLeave.names;
      namesTemp = namesTemp.join(",");

      let selectAllTemp = this.formLeave.selectAll;
      let selectionOrgList = this.secletiongList;

      if (selectAllTemp == "0") {
        if (selectionOrgList.length == 0) {
          this.$Message.warning("请选择导出的商品！！");
          this.loadFinishFalg = false;
          return;
        }
      }

      let storeId = "";
      if (this.$route.query.storeId != null) {
        storeId = this.$route.query.storeId;
      } else {
        let defaultStoreId = localStorage.getItem("defaultStoreId");
        storeId = defaultStoreId;
      }

      let ids = [];
      selectionOrgList.forEach(item => {
        ids.push(item.storeModityId);
      });
      let selectAll = this.formLeave.selectAll;
      let names = this.formLeave.names;
      this.showLeaveExecls = false;
      this.$refs["formLeave"].resetFields();
      this.exportShopModity(storeId, ids.join(","), selectAll, names);
      this.loadFinishFalg = false;
    },
    handleLeaveCancel() {
      this.showLeaveExecls = false;
    },
    handleImport() {
      if (this.$route.query.storeId) {
        this.$router.push({
          path: "/admin/store/importModity",
          query: { storeId: this.$route.query.storeId }
        });
      } else {
        this.$Message.warning("请先选择门店!");
      }
    },
    handlePrice() {
      if (this.$route.query.storeId) {
        let storeId = this.$route.query.storeId;
        this.$router.push({
          path: "/admin/store/printList",
          query: {
            storeId
          }
        });
      } else {
        this.$Message.warning("请先选择门店!");
      }
    },
    handleAdminEditPrice() {
      this.$refs.defualtTable.handleEditPrice();
    },
    handleInnerphysicalDisplay() {
      this.$refs.defualtTable.handleSetPhysicalDisplay();
    },
    handleEmpty(data) {
      this.secletiongList = data;
    },
    handleTreeStatus(data) {
      if (data) {
        this.$refs.orgTree.cancelStatus();
      }
    }
  },
  watch: {
    $route: function() {
      this.fetchData();
    }
  }
};
</script>
<style lang="less"
  scoped>
.storeTitle {
  left: 5px;
  position: absolute;
  z-index: 100;
  top: 2px;
  font-size: 13px;
}

.leftStore {
  text-align: left;
  list-style: none;

  li {
    cursor: pointer;
  }
}
</style>


