<template>
    <div>
          <p class="one"><Input v-model="sort" size="small" style="width: 60px" @on-blur="handleSort" /></p>
    </div>
</template>
<script>
import * as tools from "@/libs/tools.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      sort: "",
      columsTemp: [],
      getVuexDataTemp: this.dataCategoryArr, //从vuex中取值出来
      resultData: []
    };
  },
  props: ["categorySortObj"],
  computed: {
    ...mapGetters(["dataCategoryArr"])
  },
  methods: {
    handleSort() {
      if (tools.isNumber(this.sort)) {
        let objCategorySortValue = {};
        objCategorySortValue.id = this.categorySortObj.id;
        objCategorySortValue.sortValue = this.sort;
        this.columsTemp.push(objCategorySortValue);
        this.$store.dispatch("handleRecordCategorySort", this.columsTemp);
      } else {
        this.$Message.warning("请输入正确排序号！");
      }
    },
    handleAssign() {
      return this.resultData;
    },
    handleFormatter(newVal) {
          this.getVuexDataTemp = newVal;
           this.resultData=this.getVuexDataTemp;
    }
  },
  watch: {
    dataCategoryArr(newVal) {
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
