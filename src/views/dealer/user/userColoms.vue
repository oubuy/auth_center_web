<template>
  <div class="test">
         <div class="testContont" v-for="(item,index) in persionAthouds" :key="index">
         <Tag>{{item}}</Tag>
       </div>
    
  </div> 
</template>

<script>
export default {
  data(){
    return{
      // arr:[1,2,3,4]
    }
  },
  props:['persionAthouds'],
  mounted(){
      // console.log(this.persionAthouds,888999)
  }
}
</script>

<style lang="less" scoped>
.testContont{
  float:left;
}
</style>

