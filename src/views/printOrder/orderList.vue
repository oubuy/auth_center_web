<template>
  <div>
    <div style="text-align: left;margin: 0 0 20px 30px;">
      <Input style="width: 250px;margin-right: 20px;" v-model="searchVal" placeholder="请输入客户姓名/电话/订单编号" clearable />
      <Button type="primary" style="width: 100px;" @click="searchOrder(true)">搜索</Button>
    </div>
    <div>
      <div style="text-align: left;margin: 0 0 20px 30px;">
        <Button type="primary" @click="newOrder" style="margin-right: 20px;width: 100px;">新增</Button>
        <!-- <Button @click="deleteOrder" style="width: 100px;">删除</Button> -->
      </div>
      <Table width="1262" border ref="table" @on-row-click="handleRowClick" :columns="columns" :data="formData" @on-selection-change="handleSelect" style="margin-left: 30px;"
        :loading="loading"></Table>
      <div style="overflow: hidden;width: 1262px;margin: 10px 0 0 30px;">
        <div style="float: right;">
          <Page :total="total" show-total :current="formValidate.page" :page-size="formValidate.rows" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <alet-tip v-show="alertShow" @child-tip="handleCloseTip" :alertTipParams="alertTipParams"></alet-tip>
    <Modal v-model="openPrintFlag" width="1200" title="打印订单" :mask-closable="false" @on-ok="clearPrint" @on-cancel="clearPrint">
      <iframe :src="printPage" style="width: 100%;height: 1000px;"></iframe>
      <div slot="footer" style="text-align: center;"><Button type="primary" @click="closePrint">关闭</Button></div>
    </Modal>
  </div>
</template>

<script>
import aletTip from "@/components/alertTip.vue";
import { searchOrder, deleteOrder } from "@/api/printOrder.js";
export default {
  data() {
    return {
      openPrintFlag: false,
      printPage: "",
      formValidate: {
        page: 1,
        rows: 10
      },
      orderId: "",
      searchVal: "",
      alertShow: false,
      loading: false,
      total: 0,
      formData: [],
      alertTipParams: {
        headTip: "删除确认",
        titleTip: "确认删除该订单吗？"
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "订单号",
          key: "order_num",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h(
              "a",
              {
                on: {
                  click: () => {
                    this.editOrder(params.row.id);
                  }
                }
              },
              params.row.order_num
            );
          }
        },
        {
          title: "姓名",
          key: "name",
          width: 150,
          align: "center"
        },
        {
          title: "电话",
          key: "telephone",
          width: 150,
          align: "center"
        },
        {
          title: "创建日期",
          key: "creat_date",
          width: 150,
          align: "center"
        },
        {
          title: "创建人",
          key: "createdBy",
          width: 150,
          align: "center"
        },
        {
          title: "所属门店",
          key: "store",
          width: 200,
          align: "center"
        },
        {
          title: "操作",
          key: "",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.editOrder(params.row.id);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  style: {
                    margin: "0 20px 0"
                  },
                  on: {
                    click: () => {
                      this.deleteOrder(params.row.id);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.printOrder(params.row.id);
                    }
                  }
                },
                "打印"
              )
            ]);
          }
        }
      ]
    };
  },
  components: {
    aletTip
  },
  created() {
    let breadcrumbs = [
      {
        name: "首页"
      },
      {
        name: "打印订单管理"
      }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.searchOrder();
  },
  activated() {
    if(this.$route.query.reFreshFlag=='true') {
      this.searchOrder();
    }
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    next();
  },
  methods: {
    searchOrder(flag) {
      if (flag) {
        this.formValidate.page = 1;
      }
      let obj = {
        page: this.formValidate.page,
        rows: this.formValidate.rows,
        keyword: this.searchVal
      };
      searchOrder(obj).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          let data = res.data.data;
          let list = data.list;
          this.formData = [];
          this.total = data.total;
          for (let i = 0, len = list.length; i < len; i++) {
            let obj = {
              order_num: list[i].number,
              name: list[i].customerName,
              telephone: list[i].customerMobile,
              creat_date: list[i].createdOn,
              createdBy: list[i].createdBy,
              store: list[i].store,
              id: list[i].id
            };
            this.formData.push(obj);
          }
        }
      });
    },
    newOrder() {
      this.$router.push({
        path: "/editOrder"
      });
    },
    editOrder(id) {
      this.$router.push({
        path: "/editOrder",
        query: {
          id: id
        }
      });
    },
    deleteOrder(id) {
      this.$Modal.confirm({
        title: "请确认",
        content: "<p>确定删除所选数据？</p>",
        onOk: () => {
          this.orderId = id;
          let obj = {
            orderId: this.orderId
          };
          deleteOrder(obj).then(res => {
            if (res.data.code == 200) {
              this.$Message.success("删除成功");
              this.searchOrder();
            } else {
              this.$Message.error("删除失败");
            }
          });
        }
      });
    },
    printOrder(id) {
      this.printPage = "/rest/salesorder/printOrder?orderId=" + id;
      this.openPrintFlag = true;
    },
    clearPrint() {
      this.openPrintFlag = false;
      this.printPage = "";
    },
    closePrint() {
      this.openPrintFlag = false;
      this.printPage = "";
    },
    handleCloseTip(flag) {
      if (flag == "true") {
        let obj = {
          orderId: this.orderId
        };
        deleteOrder(obj).then(res => {
          if (res.data.code == 200) {
            this.$Message.success("删除成功");
            this.searchOrder();
          } else {
            this.$Message.error("删除失败");
          }
        });
      } else {
        this.orderId = "";
      }
      this.alertShow = false;
    },
    handleSelect(row) {
      console.log(row);
    },
    handleRowClick(value, index) {
      this.$refs.table.toggleSelect(index);
    },
    changePage(val) {
      this.formValidate.page = val;
      this.searchOrder();
    }
  }
};
</script>

<style scoped>
</style>
