<template>
    <div>
        <span v-for="(item,index) in permissionArr" :key="index">
         <Tag class="tabButton">{{item}}</Tag>
       </span>
       <span class="drop" v-if="permissionNameList.length>permissionArr.length">.....</span>
    </div>
</template>
<script>
export default {
  data() {
    return {
      permissionArr: []
    };
  },
  props: ["permissionNameList"],
  mounted() {
    if (this.permissionNameList.length!=0) {
      this.permissionArr = this.permissionNameList.slice(0, 2);
    }
  }
};
</script>

<style lang="less" scoped>
.drop {
  font-size: 20px;
  color: #666;
}
.ivu-tag{
    cursor: auto !important;
}
</style>
