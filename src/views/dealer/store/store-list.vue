<template>
  <div>
    <Layout>
      <Sider hide-trigger
        style="background:#ffffff;">
        <p class="storeTitle">门店:</p>
        <Card style="height:700px;overflow: auto;padding-top:10px;">
           <ul class="leftStore" id="test">
             <!-- <p v-show="false" @click="handleTest(item.id)" v-for="(item,index) in storeTemp" :key="index" v-trigger></p> -->
              <li v-for="(item,index) in storeList" :key="item.id" @click="handleLeftStore(item.id)">
                  <p :ref="item.id">{{item.orgName}}</p>
              </li>
           </ul>
        </Card>
      </Sider>
      <Layout style="background:#ffffff;padding:0px 0 0 10px">
        <store-header></store-header>
        <Content>
          <div class="buttonList"
            style="display:flex;padding: 16px 0px 8px;align-items: center;justify-content: space-between;">
            <div>
              <!-- <Button @click="handleAddModity">添加商品</Button> -->
              <!-- <Button style="margin-left:8px;" @click="handlephysicalDisplay">设置实物展示</Button> -->
              <Button style="margin-left:8px;" @click="handlePrice">打印价格牌</Button>
              <Button style="margin-left:8px;" @click="handleImport">导入商品</Button>
              <Button @click="handleExportShopModity" style="margin-left:8px;">导出商品</Button>
              <Button @click="handleEditMannyPrice" style="margin-left:8px;">修改价格</Button>

              <Button @click="handleDownLoadModityQrCode"
                style="margin-left:8px;">下载二维码
              </Button>
              <Button @click="handleTags"
                style="margin-left:8px;">商品标签
              </Button>
            </div>
            <div>
              <CheckboxGroup @on-change="showPriceGoods($event)">
                <Checkbox label="只显示有价格商品"></Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <store-table ref="defualtTable" @child-table="handleEmpty" @child-qcord="handleQcordSeclet"></store-table>
        </Content>
        <!-- 下载二维码 -->
           <Modal
              v-model="showQcord"
              title="下载二维码"
             >
                 <Form :model="formItem" :label-width="80">
                  <FormItem label="下载范围：">
                      <RadioGroup v-model="formItem.selectAll">
                          <Radio label="1">全部</Radio>
                          <Radio label="0">勾选的数据</Radio>
                      </RadioGroup>
                  </FormItem>

              </Form>
               <div slot="footer">
                  <Button type="primary" @click="handleOk">确定</Button>
                  <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
               </div>
          </Modal>
          <!-- 导入 -->
          <Modal
        v-model="showLeaveExecls"
        title="导出数据选项"
       >
        <Form ref="formLeave" :model="formLeave" :label-width="80">
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
                        @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <CheckboxGroup v-model="formLeave.names" @on-change="checkAllGroupChange">
                      <Checkbox :label="item" v-for="(item,index) in checkAllGroupData" :key="index"></Checkbox>
                </CheckboxGroup>
            </FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" :disabled="loadFinishFalg" @click="handleLeaveOk">确定</Button>
            <Button style="margin-left: 8px" @click="handleLeaveCancel">取消</Button>
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
import { downLoadModityQrCodeList, dealerShopList, shopModityMannyPrice } from "@/api/store.js";


export default {
  data() {
    return {
      index: "",
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
      single: false,

      testObjParma: {}
    };
  },
  created() {
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "门店商品" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.getDealerShopList();
  },
  mounted() {
    // this.handleCheckAll();
  },
  components: {
    storeHeader,
    storeTable,
    storeLeft
  },
  methods: {
    handleSetBackgound() {
      if (this.$route.query.storeId != null) {
        let store_id = this.$route.query.storeId;

        for (let i = 0; i < this.storeList.length; i++) {
          if (this.storeList[i].id == store_id) {
            this.index = i;
          }
        }
        // console.log(this.index, "index");

        setTimeout(() => {
          document.getElementById("test").childNodes[
            this.index
          ].style.background =
            "rgb(213, 232, 252)";
        }, 300);
      } else {
        setTimeout(() => {
          document.getElementById("test").childNodes[0].style.background =
            "rgb(213, 232, 252)";
        }, 300);
      }
    },
    updateRuter(id) {
      this.$router.push({
        query: {
          storeId: id
        }
      });
    },
    getDealerShopList() {
      dealerShopList().then(response => {
        if (response.data.code == 200) {
          let stoteArr = response.data.data;
          if (stoteArr.length != 0) {
            stoteArr.forEach(item => {
              this.storeList.push(item);
            });
            // storeTemp
            this.testObjParma = this.storeList[0];
            localStorage.setItem("defaultStoreId", this.testObjParma.id);

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
      } else {
        // console.log(this.index,'this.index')
        if (this.index != '') {
          document.getElementById("test").childNodes[
            this.index
          ].style.background =
            "#fff";
        } else {
          document.getElementById("test").childNodes[0].style.background =
            "#fff";
        }
      }
    },

    handleAddModity() {
      if (this.$route.query.storeId) {
        let storeId = this.$route.query.storeId;
         let type=this.$route.query.type;
        this.$router.push({
          path: "/dealer/addModity",
          query: {
            storeId,
              type
          }
        });
      } else {
        let defaultStoreId = localStorage.getItem("defaultStoreId");
        let storeId = defaultStoreId;
        this.$router.push({
          path: "/dealer/addModity",
          query: {
            storeId
          }
        });
      }
    },
    handleQcordSeclet(data) {
      this.secletiongList = data;
    },
    handleDownLoadModityQrCode() {
      if (this.secletiongList.length == 0) {
        this.$Message.warning("请选择下载的内容");
      } else {
        this.showQcord = true;
      }
    },
    handleTags() {
      if(!this.secletiongList.length) {
        this.$Message.warning("请选择商品");
        return;
      }else if(this.secletiongList.length>1) {
        this.$Message.warning("只能选择一个商品");
        return;
      }
      console.log(this.secletiongList[0])
      let id = this.secletiongList[0].storeModityId;
      let storeId = this.$route.query.storeId?this.$route.query.storeId:localStorage.getItem("defaultStoreId");
      let modityId = this.secletiongList[0].modityId;
      let shopObj = {
        id: id,
        modityName: this.secletiongList[0].modityName,
        imageUrl: this.secletiongList[0].imageUrl,
        officicalModel: this.secletiongList[0].officicalModel
      }
      if(shopObj.id) {
        this.$router.push({
          path: "/dealer/tags",
          query: {
            id: id,
            storeId: storeId,
            modityId: modityId
          }
        });
      }else {
        let params = {};
        params.storeModityId = shopObj.id;
        params.price1 = this.secletiongList[0].storePriceVo2.storeSquarePrice?this.secletiongList[0].storePriceVo2.storeSquarePrice:0;
        params.activityPrice1 = this.secletiongList[0].storePriceVo2.storeActivitySquarePrice?this.secletiongList[0].storePriceVo2.storeActivitySquarePrice:0;
        params.price2 = this.secletiongList[0].storePriceVo.storeNumPrice?this.secletiongList[0].storePriceVo.storeNumPrice:0;
        params.activityPrice2 = this.secletiongList[0].storePriceVo.storeActivityNumPrice?this.secletiongList[0].storePriceVo.storeActivityNumPrice:0;
        params.storeId = storeId;
        params.modityId = modityId;
        params.physicalDisplay = 1;
        shopModityMannyPrice(params).then(res=>{
          if(res.data.code==200) {
            this.$router.push({
              path: "/dealer/tags",
              query: {
                id: res.data.data,
                storeId: storeId,
                modityId: modityId
              }
            });
          }
        })
      }
      localStorage.setItem('shopObj',JSON.stringify(shopObj));
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
      //   this.checkAll=true;
      //    this.formLeave.names = this.checkAllGroupData;
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
      let storeId = "";
      if (this.$route.query.storeId != null) {
        storeId = this.$route.query.storeId;
      } else {
        let defaultStoreId = localStorage.getItem("defaultStoreId");
        storeId = defaultStoreId;
      }

      let ids = [];
      this.secletiongList.forEach(item => {
        // storeModityId  门店商品id
        // ids.push(item.storeModityId);
        ids.push(item.modityId);
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
      //    this.loadFinishFalg = false;
      //   return;
      // } else {
      //   let storeId = "";
      //   if (this.$route.query.storeId != null) {
      //     storeId = this.$route.query.storeId;
      //   } else {
      //     let defaultStoreId = localStorage.getItem("defaultStoreId");
      //     storeId = defaultStoreId;
      //   }

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
        // ids.push(item.storeModityId);
        ids.push(item.modityId);
      });
      let selectAll = this.formLeave.selectAll;
      let names = this.formLeave.names;
      // console.log(names,'names')
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
          path: "/dealer/importModity",
          query: { storeId: this.$route.query.storeId }
        });
      } else {
        let defaultStoreId = localStorage.getItem("defaultStoreId");
        let storeId = defaultStoreId;
        this.$router.push({
          path: "/dealer/importModity",
          query: { storeId }
        });
      }
    },
    handlePrice() {
      if (this.$route.query.storeId) {
        let storeId = this.$route.query.storeId;
        this.$router.push({
          path: "/dealer/printList",
          query: {
            storeId
          }
        });
      } else {
        let defaultStoreId = localStorage.getItem("defaultStoreId");
        let storeId = defaultStoreId;
        this.$router.push({
          path: "/dealer/printList",
          query: {
            storeId
          }
        });
      }
    },
    handleEditMannyPrice() {
      //批量修改价格
      this.$refs.defualtTable.handleEditPrice();
    },

    handlephysicalDisplay() {
      //设置实物图
      this.$refs.defualtTable.handleSetPhysicalDisplay();
    },
    handleEmpty(data) {
      this.secletiongList = data;
    },
    showPriceGoods(d) {
      this.single = !this.single;
      this.$refs.defualtTable.hasPrice=this.single;
    }
  },
  watch: {
    storeList: {
      handler: function(newValue, oldValue) {
        this.handleSetBackgound();
      },
      deep: true
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
