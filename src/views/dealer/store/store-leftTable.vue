<template>
    <div >
        
        <ul class="leftStore">
            <li v-for="(item,index) in storeList" :key="item.id" @click="handleLeftStore(item.id)">
                <p :ref="item.id">{{item.orgName}}</p>
            </li>
        </ul>
       
    </div>
</template>

<script>
import { dealerShopList } from "@/api/store.js";
export default {
  data() {
    return {
      storeList: [],
      selectStore: "",
      activeStatus: false,
      currentSelected:null
    };
  },
  mounted() {
    this.getDealerShopList();
  },
  methods: {
    getDealerShopList() {
      dealerShopList().then(response => {
        if (response.data.code == 200) {
          let stoteArr = response.data.data;
          stoteArr.forEach(item => {
            this.storeList.push(item);
          });
        }
      });
    },
    handleLeftStore(id) {
        this.cancelSelect();
          this.$refs[id][0].style.background = "rgb(213, 232, 252)";
         this.currentSelected= this.$refs[id][0].style;
    
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
  }
};
</script>

<style lang="less" scoped>
.leftStore {
  text-align: left;
  list-style: none;
  li {
    cursor: pointer;
  }
}
</style>


