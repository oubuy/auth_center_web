<template>
    <div >
        <p class="one">销售价: <Input v-model="numberPriceValue" size="small" style="width: 100px" @on-blur="handleNumberPrice" /></p>
        <p style="margin-bottom: 5px;">活动价: <Input v-model="activePriceValue" @on-blur="handleActive" size="small" style="width: 100px" /></p>
        <!-- <p>指导价:{{storeObj.storePriceVo.numPrice}}</p> -->
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
      getVuexDataTemp: this.dataArr, //从vuex中取值出来
      resultData: []
    };
  },
  props: ["storeObj"],
  computed: {
    ...mapGetters(["dataArr"])
  },
  mounted() {

    this.numberPriceValue = this.storeObj.storePriceVo.storeNumPrice?this.storeObj.storePriceVo.storeNumPrice:0; //销售价
    this.activePriceValue = this.storeObj.storePriceVo.storeActivityNumPrice?this.storeObj.storePriceVo.storeActivityNumPrice:0; //活动价
    this.handleNumberPrice();
    this.handleActive()
  },
  methods: {
    handleNumberPrice() {
      if (tools.isNumber(this.numberPriceValue)) {
        let objNumberPriceValue = {};
        objNumberPriceValue.id = this.storeObj.id;
        objNumberPriceValue.modityId = this.storeObj.modityId;
        objNumberPriceValue.numberPriceValue = this.numberPriceValue;
        this.columsTemp.push(objNumberPriceValue);
        this.$store.dispatch("recordEditColums", this.columsTemp);
      } else {
        // this.$Message.warning("请输入正确得价格！");
      }
    },
    handleActive() {
      if (tools.isNumber(this.activePriceValue)) {
        let obj = {};
        obj.id = this.storeObj.id;
        obj.modityId = this.storeObj.modityId;
        obj.activePriceValue = this.activePriceValue;
        this.columsTemp.push(obj);
        this.$store.dispatch("recordEditColums", this.columsTemp);
      } else {
        // this.$Message.warning("请输入正确得价格！");
      }
    },
    handleAssign() {
      return this.resultData;
    },
    handleFormatter(newVal) {
      this.getVuexDataTemp = newVal;
      //   this.resultData = this.getVuexDataTemp;

      let arr = [];
      for (var i = 0; i < this.getVuexDataTemp.length; i++) {
        if (
          this.getVuexDataTemp[i].numberPriceValue!=null &&
          this.getVuexDataTemp[i].activePriceValue!=null
        ) {
          arr.push(this.getVuexDataTemp[i]);
        }else{

        }
      }
      this.resultData = arr;
    }
  },
  watch: {
    dataArr(newVal) {
      this.handleFormatter(newVal);
    },
    storeObj: {
      deep: true,
      handler: function(newVal, oldVal) {
      }
    }
  }
};
</script>
<style lang="less" scoped>
.one {
  margin: 5px 0;
}
</style>
