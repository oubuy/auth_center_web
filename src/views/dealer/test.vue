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
    }
  },
  props:['persionAthouds'],
}
</script>

<style lang="less" scoped>
.testContont{
  float:left;
}
</style>

