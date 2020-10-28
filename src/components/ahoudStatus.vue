<template>
   <div id="atuhodStatus">
         <FormItem label="状态:" v-if="parentDisabled">
                        <Select v-model="statusModel" disabled style="width:200px">
                           <Option v-for="(item,index) in authoudStatus" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
            </FormItem>
          <FormItem label="状态:" v-else>
                        <Select v-model="statusModel" style="width:200px">
                           <Option v-for="(item,index) in authoudStatus" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
            </FormItem>
           
   </div>
</template>

<script>
export default {
  data() {
    return {
      authoudStatus: [
        {
          value: 0,
          label: "开启" //false
        },
        {
          value: 1,
          label: "禁用" //true
        }
      ],
      statusModel: 0,
    };
  },
  props: ["parentStatus",'parentDisabled'],
  mounted() {
    // console.log(this.parentStatus, 998887777);
  },
  watch: {
    statusModel(val) {
      // console.log(val);
      this.$emit("child-authodstats", val);
    },
    parentStatus(val) {
      console.log(val,'状态值')
      if (val == false) {
        this.statusModel = 0;
      } else if (val == true) {
        this.statusModel = 1;
      } else if (val == 0) {
        this.statusModel = 0;
      } else if (val == 1) {
        this.statusModel = 1;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.athoudStatus {
  display: flex;
  align-items: center;
  margin: 10px 0;
  i {
    color: #ff7836;
  }
}
</style>

