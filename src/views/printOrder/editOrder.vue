<template>
  <div>
    <Form>
      <div class="form_item">
        <div class="label"><span style="color: red;">* </span>电话：</div>
        <Input v-model="formValidate.telephone" placeholder="请输入电话" style="width: 150px;" :maxlength="11" @on-blur="handleNumBlur"
          @on-change="checkCustomer" />
        <div style="color: red;margin-left: 10px;" v-if="telFlag">格式错误，请输入11位数字</div>
      </div>
      <div class="form_item">
        <div class="label"><span style="color: red;">* </span>姓名：</div>
        <Input v-model.sync="formValidate.name" placeholder="请输入姓名" clearable style="width: 150px;" />
      </div>
      <div class="line"></div>
      <div class="order_detail">
        <div class="order_num">
          <span>订单编号：</span>
          <span>{{orderNum}}</span>
        </div>
        <div>
          <div style="display: flex;justify-content: space-around;">
            <div v-for="(tItem,tIndex) in titleList" style="width: 160px;text-align: center;">{{tItem}}</div>
          </div>
          <div v-for="(item,index) in productList" class="product_list">
            <!-- <AutoComplete style="width: 160px;height: auto;" v-model.trim="item.itemCode" :data="item.itemCodeList"
              @on-search="checkChange(index,'itemCode',$event)" @on-select="handleSelect" @on-focus="clearList"></AutoComplete> -->
            <div style="width: 160px;position: relative;">
              <input type="text" v-model.trim="item.itemCode" style="width: 100%;" @input="checkChange(index,'itemCode')"
                @focus="handleFocus(index)" @blur="handleBlur">
              <div v-show="activedIndex==index" style="position: absolute;width: 100%;top: 33px;left: 0;box-shadow: 0 1px 6px rgba(0,0,0,.2);border-radius: 4px;z-index: 100;background: #fff;max-height: 200px;overflow: auto;">
                <div v-for="(cItem,cIndex) in item.itemCodeList" :class="overIndex==cIndex?'over_actived':''" style="width: 100%;height: 32px;padding: 4px 8px;line-height: 26px;cursor: pointer;"
                  @click="chooseItem(cItem,index,cIndex)" @mouseenter="overIndex=cIndex" @mouseleave="overIndex=-1">{{cItem}}</div>
              </div>
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.itemSpec" @keyup="checkChange(index,'itemSpec')" style="width: 100%;">
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.pcs" @keyup="checkChange(index,'pcs')" style="width: 100%;">
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.price" @keyup="checkChange(index,'price')" style="width: 100%;">
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.processCost" @keyup="checkChange(index,'processCost')" style="width: 100%;">
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.uses" maxlength="12" @keyup="checkChange(index,'uses')" style="width: 100%;">
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.amount" @keyup="checkChange(index,'amount')" disabled="disabled" style="width: 100%;">
            </div>
            <div style="width: 160px;position: relative;">
              <input type="text" v-model="item.discount" @keyup="checkChange(index,'discount')" style="width: 100%;">
            </div>
            <div style="width: 160px;"><Button @click="deleteItem(index)" v-if="index!=productList.length-1">删除</Button></div>
          </div>
        </div>
        <div class="logistics">
          <div class="form_item">
            <div class="label"><span style="color: red;">* </span>送货地址：</div>
            <Input v-model="formValidate.address" placeholder="请输入送货地址" clearable style="width: 300px;" />
          </div>
          <div class="form_item">
            <div class="label"><span style="color: red;">* </span>付款方式：</div>
            <Select @on-change="changePayWay" clearable v-model="payWay" style="width: 150px;">
              <Option v-for="(item,index) in payWayColumns" :value="item" :key="index">{{ item }}</Option>
            </Select>
          </div>
          <div class="form_item">
            <div class="label" style="width: 68px;text-align: right;">定金：</div>
            <Input v-model="formValidate.downPayment" placeholder="请输入定金" clearable style="width: 150px;" @on-change="changeDownPayment" />
            <div style="color: red;margin-left: 10px;" v-if="downPaymentFlag">格式错误，请输入数字</div>
          </div>
          <div class="form_item" style="align-items: flex-start;">
            <div class="label">订单备注：</div>
            <textarea v-model="formValidate.remark" style="width: 500px;height: 150px;border: 1px solid #dcdee2;border-radius: 4px;padding: 7px;resize:none"></textarea>
          </div>
        </div>
      </div>
    </Form>
    <div class="toolbar-footer">
      <Button style="width: 150px;" type="primary" @click="printOrder" v-if="orderId" :disabled="spinShow" :loading="saveLoading">打印</Button>
      <Button style="width: 150px;margin: 0 20px;" type="primary" @click.prevent="saveOrder(false)" :disabled="spinShow" :loading="saveLoading">保存</Button>
      <Button style="width: 150px;" @click="cancelSave">取消</Button>
    </div>
    <!-- <div style="text-align: center;margin-top: 100px;">
      <Button style="width: 150px;" type="primary" @click="printOrder" v-if="orderId">打印</Button>
      <Button style="width: 150px;margin: 0 20px;" type="primary" @click.prevent="saveOrder(false)">保存</Button>
      <Button style="width: 150px;" @click="cancelSave">取消</Button>
    </div> -->
    <Modal v-model="openPrintFlag" width="1200" title="打印订单" :mask-closable="false" @on-ok="clearPrint" @on-cancel="clearPrint">
      <iframe :src="printPage" style="width: 100%;height: 1000px;"></iframe>
      <div slot="footer" style="text-align: center;"><Button type="primary" @click="closePrint">关闭</Button></div>
    </Modal>
    <Spin v-if="spinShow" fix></Spin>
  </div>
</template>

<script>
  import axios from 'axios';
  import {
    orderDetail,
    saveOrder,
    checkCustomer,
    generateOCNumber,
    printOrder,
    getCodeDetail,
    deleteDetail
  } from "@/api/printOrder.js"
  export default {
    data() {
      return {
        orderId: this.$route.query.id,
        spinShow: true,
        saveLoading: false,
        printPage: "",
        activedIndex: -1,
        overIndex: -1,
        interval: null,
        openPrintFlag: false,
        telFlag: false,
        downPaymentFlag: false,
        refreshFlag: false,
        payWay: "",
        orderNum: "",
        formValidate: {
          telephone: "",
          name: "",
          address: ""
        },
        titleList: ["产品型号", "产品规格（mm）", "数量（片）", "价格（元/片）","加工费", "用途", "总额", "优惠金额", ""],
        productList: [],
        originalData: {},
        payWayColumns: ["微信", "支付宝", "线下支付", "转账", "其他"],
        itemCodeList: [],
        codeList: [],
        blankObj: {
          itemCode: "",
          itemSpec: "",
          pcs: "",
          price: "",
          processCost: "",
          uses: "",
          amount: "",
          discount: "",
          itemCodeList: []
        }
      }
    },
    created() {
      let breadcrumbs = [{
          name: "首页"
        },
        {
          name: "新增/编辑订单"
        }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
      if (this.$route.query.id) {
        this.orderDetail();
      } else {
        this.spinShow = false;
        this.productList.push(this.blankObj);
        this.getOrderNum();
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'OrderList'&&!this.refreshFlag) {
        to.meta.keepAlive = true;
      }
      next();
    },
    mounted() {

    },
    destroyed() {
      clearInterval(this.interval);
    },
    methods: {
      orderDetail() {
        let obj = {
          orderId: this.$route.query.id
        }
        this.productList = [];
        orderDetail(obj).then(res => {
          if (res.data.code == 200) {
            let data = res.data.data;
            let list = data.details;
            this.orderNum = data.number;
            this.formValidate.telephone = data.customerMobile;
            this.formValidate.name = data.customerName;
            this.formValidate.address = data.customerAddress;
            this.payWay = data.payment;
            this.formValidate.downPayment = data.prepaymentAmount;
            this.formValidate.remark = data.remark;
            this.formValidate.paymentAmount = data.paymentAmount;
            if (list.length) {
              for (let i = 0, l = list.length; i < l; i++) {
                list[i].itemCodeList = [];
                list[i].pcs = list[i].pcs ? list[i].pcs : 0;
                list[i].price = list[i].price ? list[i].price : 0;
                list[i].processCost = list[i].processCost ? list[i].processCost : 0;
                list[i].amount = list[i].amount ? list[i].amount : 0;
                list[i].discount = list[i].discount ? list[i].discount : 0;
                this.productList.push(list[i]);
              }
            }
            this.productList.push(this.blankObj);
            this.interval = setInterval(() => {
              this.saveOrder(true);
            }, 30000)
          }
          this.spinShow = false;
        })
      },
      getOrderNum() {
        generateOCNumber().then(res => {
          if (res.data.code == 200) {
            this.orderNum = res.data.data;
            this.interval = setInterval(() => {
              this.saveOrder(true);
            }, 30000)
          }
        })
      },
      changeItemCode(val) {},
      changePayWay(val) {
        this.payWay = val;
      },
      handleSelect(val) {},
      checkChange(index, item, val) {
        let list = this.productList;
        let lenth = list.length;
        let flag = true;
        if (item != 'itemSpec' && item != 'itemCode' && item !="uses") {
          if (isNaN(list[index][item])) {
            this.$Message.warning("只能填入数字");
            list[index][item] = list[index][item].replace(/[^\.\d]/g, '');
            return;
          } else {
            if (list[index][item] < 0) {
              this.$Message.warning("只能填入正数");
              list[index][item] = list[index][item].replace(/[^\.\d]/g, '');
              return;
            }
          }
          if (item == "pcs") {
            if (list[index][item].indexOf(".") != -1) {
              this.$Message.warning("数量只能填入正整数");
              list[index][item] = list[index][item].replace(/[^\d]/g, '');
              return;
            }
          }
          if (item == ("price") || item == "processCost") {
            if (list[index][item].indexOf(".") != -1) {
              let i = list[index][item].indexOf(".");
              let str = list[index][item].substring(i + 1, list[index][item].length);
              // if(str.length>2) list[index][item] = Math.round(Number(list[index][item])*100)/100;
              if (str.length > 2) {
                this.$Message.warning("价格只能输入两位小数");
                list[index][item] = list[index][item].substring(0, i + 3);
                return;
              }
            }
          }
        }
        if (item == 'itemCode') {
          let itemCode = list[index]["itemCode"];
          let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/;
          if (patrn.test(itemCode)) {
            this.$Message.warning("型号不能输入中文汉字");
            list[index]["itemCode"] = list[index]["itemCode"].replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '');
            return;
          }
          if (!itemCode) {
            this.itemCodeList = [];
            this.codeList = [];
            list[index].itemCodeList = [];
            this.activedIndex = -1;
            return;
          }
          getCodeDetail({
            itemCode: itemCode
          }).then(res => {
            if (res.data.code == 200) {
              let dataList = res.data.data;
              this.itemCodeList = [];
              this.codeList = [];
              list[index].itemCodeList = [];
              if (!dataList.length) {
                this.activedIndex = -1;
                return;
              }
              this.activedIndex = index;
              for (let i = 0, l = dataList.length; i < l; i++) {
                list[index].itemCodeList.push(dataList[i].specCode);
                this.codeList.push(dataList[i]);
              }
              for (let i = 0, l = this.codeList.length; i < l; i++) {
                if (itemCode == this.codeList[i].specCode) {
                  list[index].itemSpec = this.codeList[i].itemSpec;
                  list[index].price = this.codeList[i].price;
                }
              }
            }
          })
        }
        if (item == "pcs" || item == "price" || item == "processCost") {
          // if (list[index].price + "" && list[index].pcs + "" && list[index].processCost) {
            let pcs = list[index].pcs * 1000;
            let price = list[index].price * 1000;
            let processCost = Number(list[index].processCost);
            list[index].amount = pcs * price / 1000000 + processCost;
          // }
        }
        if (!(list[index]["price"] + '') || !list[index]["itemSpec"] || !list[index]["itemCode"] || !list[index]["pcs"])
          flag = false;
        if (flag && index == lenth - 1) {
          let obj = {
            itemCode: "",
            itemSpec: "",
            pcs: "",
            price: "",
            processCost: "",
            uses: "",
            amount: "",
            discount: "",
            itemCodeList: []
          }
          this.productList.push(obj);
        }
      },
      chooseItem(item, index, cIndex) {
        this.productList[index].itemCode = item;
        this.productList[index].itemSpec = this.codeList[cIndex].itemSpec;
        this.productList[index].price = this.codeList[cIndex].price;
        this.activedIndex = -1;
      },
      handleFocus(index) {
        let _self = this;
        let timer = setTimeout(() => {
          _self.activedIndex = index;
          clearTimeout(timer);
        }, 400)
      },
      handleBlur() {
        let _self = this;
        let timer = setTimeout(() => {
          _self.activedIndex = -1;
          clearTimeout(timer);
        }, 300)
      },
      changeDownPayment() {
        if (isNaN(this.formValidate.downPayment)) {
          this.downPaymentFlag = true;
          return;
        }
        this.downPaymentFlag = false;
      },
      handleNumBlur() {
        if (!(/^1[23456789]\d{9}$/.test(this.formValidate.telephone))) {
          this.telFlag = true;
          return false;
        }
        if (this.formValidate.telephone.length < 11) {
          this.telFlag = true;
          return false;
        }
      },
      checkCustomer() {
        if (this.formValidate.telephone.length == 11) {
          if (!(/^1[23456789]\d{9}$/.test(this.formValidate.telephone))) {
            this.telFlag = true;
            return false;
          }
          this.telFlag = false;
          let obj = {
            mobile: this.formValidate.telephone
          }
          checkCustomer(obj).then(res => {
            if (res.data.code == 200) {
              if (res.data.data.isExist) {
                this.$Modal.confirm({
                  title: '请确认',
                  content: '<p>检测到客户已存在，是否读取客户信息</p>',
                  onOk: () => {
                    this.formValidate.name = res.data.data.customerName;
                    this.formValidate.address = res.data.data.customerAddress ? res.data.data.customerAddress :
                      "";
                  }
                });
              }
            }
          })
        }
      },
      deleteItem(index) {
        if (this.productList[index].id) {
          let param = {
            detailId: this.productList[index].id
          }
          deleteDetail(param).then(res => {
            console.log(res);
            if (res.status == 200) {
              this.productList.splice(index, 1);
            }
          })
        } else {
          this.productList.splice(index, 1);
        }
      },
      printOrder() {
        let orderId = this.$route.query.id;
        if (!orderId) return;
        this.printPage = '/rest/salesorder/printOrder?orderId=' + orderId;
        this.openPrintFlag = true;
      },
      clearPrint() {
        this.openPrintFlag = false;
        this.printPage = '';
      },
      closePrint() {
        this.openPrintFlag = false;
        this.printPage = '';
      },
      saveOrder(flag) {
        let data = this.formValidate;
        let productList = JSON.parse(JSON.stringify(this.productList));
        let sum = 0;
        let paymentAmount = 0;
        let discount = 0;
        let validateFlag = true;
        let notAllowZero = false;
        this.formValidate.paymentAmount = 0;
        if (flag) {
          for (let i = 0, l = productList.length - 1; i < l; i++) {
            let item = productList[i];
            if(!item.processCost) item.processCost = 0;
            if(!item.price) item.price == 0;
            sum += Number(productList[i].amount) - Number(productList[i].discount);
            paymentAmount += Number(productList[i].amount);
            discount += Number(productList[i].discount);
            if (!(item.pcs + "") || !item.pcs) item.pcs = 1;
            if (!(item.discount + "") || !item.discount) item.discount = 0;
            if (!item.itemSpec || item.price === '' || !item.itemCode) {
              validateFlag = false;
            }
            delete productList[i].itemCodeList;
          }
          if (!data.telephone) {
            return;
          }
          if (data.telephone.length != 11) {
            return;
          }
          if (this.telFlag) {
            return;
          }
          if (!data.address) {
            return;
          }
          if (!this.payWay) {
            return;
          }
          if (!data.name) {
            return;
          }
          if (!validateFlag) return;
          if (productList.length == 1) return;
        } else {
          for (let i = 0, l = productList.length - 1; i < l; i++) {
            let item = productList[i];
            if(!item.processCost) item.processCost = 0;
            if(!item.price) item.price = 0;
            sum += Number(productList[i].amount) - Number(productList[i].discount);
            paymentAmount += Number(productList[i].amount);
            discount += Number(productList[i].discount);
            if (item.price === '' || !item.itemSpec || !item.itemCode || !(item.pcs + "")) {
              validateFlag = false;
            }
            // if(item.price==0) {
            //   notAllowZero = true;
            // }
            delete productList[i].itemCodeList;
          }
          if (productList.length == 1) {
            this.$Message.warning("请完整填写产品信息");
            return;
          }
          if (!data.telephone) {
            this.$Message.warning("请输入手机号码");
            return;
          }
          if (data.telephone.length != 11) {
            this.$Message.warning("手机号码应为11位");
            return;
          }
          if (this.telFlag) {
            this.$Message.warning("手机号码格式错误");
            return;
          }
          if (this.downPaymentFlag) {
            this.$Message.warning("定金格式错误");
            return;
          }
          if (!validateFlag) {
            this.$Message.warning("请完整填写产品信息");
            return;
          }
          if (!this.payWay) {
            this.$Message.warning("请选择付款方式");
            return;
          }
          // if(notAllowZero) {
          //   this.$Message.warning("价格不能为0");
          //   return;
          // }
          if (!data.address) {
            this.$Message.warning("请填写送货地址");
            return;
          }
        }
        this.saveLoading = true;
        productList = productList.splice(0, productList.length - 1);
        let param = {
          customerMobile: data.telephone,
          customerName: data.name,
          customerAddress: data.address,
          payment: this.payWay,
          prepaymentAmount: data.downPayment,
          remark: data.remark,
          details: productList,
          number: this.orderNum,
          // paymentAmount: sum,
          paymentAmount: paymentAmount,
          discount: discount,
          id: this.$route.query.id ? this.$route.query.id : this.orderId
        }
        saveOrder(param).then(res => {
          if (res.data.code == 200) {
            if (!flag) {
              clearInterval(this.interval);
              this.$Message.success("保存成功");
              this.refreshFlag = true;
              this.$router.push({
                path: "/orderList",
                query: {
                  refreshFlag: this.refreshFlag
                }
              });
            } else {
              let data = res.data.data;
              if (!this.$route.query.id) {
                this.$router.replace({
                  path: '/editOrder',
                  query: {
                    id: data.id
                  },
                  replace: true
                });
              }
              for (let i = 0, l = this.productList.length; i < l; i++) {
                if (!this.productList[i].id) {
                  for (let j = i, len = data.details.length; j < len; j++) {
                    if (this.productList[i].itemCode == data.details[j].itemCode &&
                      this.productList[i].itemSpec == data.details[j].itemSpec &&
                      this.productList[i].pcs == data.details[j].pcs &&
                      this.productList[i].price == data.details[j].price &&
                      this.productList[i].discount == data.details[j].discount) {
                      this.productList[i].id = data.details[j].id;
                      break;
                    }
                  }
                }
              }
            }
          }
          this.saveLoading = false;
        })
      },
      cancelSave() {
        clearInterval(this.interval);
        this.$router.push({
          path: "/orderList"
        });
      }
    }
  }
</script>

<style scoped>
  input {
    width: 160px;
    height: 32px;
    /* text-align: center; */
    padding: 4px 7px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
  }

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #dcdee2;
  }

  div {
    text-align: left;
  }

  .form_item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-left: 30px;
  }

  .label {
    margin-right: 10px;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #ccc;
    margin: 20px 0;
  }

  .order_detail {
    margin: 0 0 0 20px;
  }

  .order_num {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 40px;
  }

  .product_list {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    /* margin-bottom: 20px; */
  }

  .logistics {
    margin-top: 50px;
  }

  .logistics .form_item {
    margin-left: 0;
  }

  .over_actived {
    background: #f3f3f3;
  }
  .toolbar-footer {
    position: fixed;
    width: 100%;
    padding: 10px 20px;
    text-align: left;
    bottom: 0px;
    left: 210px;
    z-index: 100;
    background: rgba(248, 248, 249, 0.8);
  }
</style>
