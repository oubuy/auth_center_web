<template>
    <div>
       
         <div class="typeContent">
               <ul>
                   <li>
                     
                        <label><input name="Fruit" type="radio" value="" />类型一：尺寸70*120 </label> 
                        <img :src="bigPrice" alt="">
                   </li>
                    <li>
                        
                        <label><input name="Fruit" type="radio" value="" />类型二：尺寸95*65 </label> 
                        <img :src="smallPrice" alt="">
                   </li>
                    <li>
                      
                        <label><input name="Fruit" type="radio" value="" />类型三：尺寸100*28 </label> 
                        <img class="imgItem" :src="acrossOne" alt="">
                   </li>
                    <li>
                      
                        <label><input name="Fruit" type="radio" value="" />类型四：尺寸110*30 </label> 
                        <img class="imgItem" :src="acrossTwo" alt="">
                   </li>
               </ul>
         </div>
         <div class="footerButton">
                 <Button type="primary" @click="">保存</Button>
                 <Button style="margin-left: 8px" @click="">取消</Button>
            </div>
    </div>
</template>

<script>
import { shopModityPriceInfo } from "@/api/store.js";

import importModityVue from "./importModity.vue";
export default {
  data() {
    return {
      bigSingle: false,
      smallSingle: false,
      acrossOneSingle: false,
      acrossTwoSingle: false,
      bigPrice: require("@/assets/bigPrint.jpg"),
      smallPrice: require("@/assets/print5.png"),
      acrossOne: require("@/assets/print3.png"),
      acrossTwo: require("@/assets/smallPrint.jpg")
    };
  },
  mounted(){

  },
  methods:{

  }
};
</script>
<style lang="less" scoped>
.footerButton {
   text-align: center;
}
.typeContent {
  ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    li {
      list-style-type: none;
      width: 50%;
      display: flex;
      flex-direction: column;
      margin-bottom: 50px;
      text-align: center;
      img {
        margin: 0 auto;
        width: 200px;
        height: 300px;
      }
        .imgItem{
            width:300px;
            height: auto;
        }
      label {
          margin-bottom: 20px;
        input {
          vertical-align: middle;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>


