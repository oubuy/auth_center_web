<template>
    <div>
        <p class="one">销售价: <Input v-model="numberPriceValue" size="small" style="width: 100px" @on-blur="handleNumberPrice" /></p>
        <p style="margin-bottom: 5px;">活动价: <Input v-model="activePriceValue" @on-blur="handleActive" size="small" style="width: 100px" /></p>
        <!-- <p>指导价:{{storeParams.storePriceVo2.numPrice}}</p> -->
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as tools from "@/libs/tools.js";

export default {
  data() {
    return {
      numberPriceValue: "", //销售价
      activePriceValue: "", //活动价
      columsTemp: [],
      getVuexDataTemp: this.priceVo2Arr, //从vuex中取值出来
      resultData: []
    };
  },
  props: ["storeParams"],
  computed: {
    ...mapGetters(["priceVo2Arr"])
  },
  mounted() {
    this.numberPriceValue = this.storeParams.storePriceVo2.storeSquarePrice?this.storeParams.storePriceVo2.storeSquarePrice:0; //销售价
    this.activePriceValue = this.storeParams.storePriceVo2.storeActivitySquarePrice?this.storeParams.storePriceVo2.storeActivitySquarePrice:0; //活动价
    this.handleNumberPrice();
    this.handleActive()
  },
  methods: {
    handleNumberPrice() {
      if (tools.isNumber(this.numberPriceValue)) {
        let objNumberPriceValue = {};
        objNumberPriceValue.id = this.storeParams.id;
        objNumberPriceValue.modityId = this.storeParams.modityId;
        objNumberPriceValue.numberPriceTwoValue = this.numberPriceValue;
        this.columsTemp.push(objNumberPriceValue);
        this.$store.dispatch("recordPriceVo2", this.columsTemp);
      } else {
        // this.$Message.warning("请输入正确得价格！");
      }
    },
    handleActive() {
      if (tools.isNumber(this.activePriceValue)) {
        let obj = {};
        obj.id = this.storeParams.id;
        obj.modityId = this.storeParams.modityId;
        obj.activePriceTwoValue = this.activePriceValue;
        this.columsTemp.push(obj);
        this.$store.dispatch("recordPriceVo2", this.columsTemp);
      } else {
        // this.$Message.warning("请输入正确得价格！");
      }
    },
    handleAssign() {
      return this.resultData;
    },
    handleFormatter(newVal) {
      this.getVuexDataTemp = newVal;
      let arr = [];
      for (var i = 0; i < this.getVuexDataTemp.length; i++) {
        if (
          this.getVuexDataTemp[i].numberPriceTwoValue!=null &&
          this.getVuexDataTemp[i].activePriceTwoValue!=null
        ) {
          arr.push(this.getVuexDataTemp[i]);
        }
      }
      this.resultData = arr;
    }
  },
  watch: {
    priceVo2Arr(newVal) {
      this.handleFormatter(newVal);
    }
  }
};
</script>

<style lang="less" scoped>
.one {
  margin: 5px 0;
}
</style>
