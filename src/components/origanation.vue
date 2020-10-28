<template>
    <div class="origation">
          <FormItem label="所属组织">
                        <Select v-model="orgId" clearable style="width:200px">
                           <Option v-for="(item,index) in options" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
            </FormItem>
    </div>
</template>

<script>
import {
  persionList,
  persionAthoud,
  dealerOrganizations
} from "@/api/persionalManage.js";



export default {
  data() {
    return {
        orgId:"",
      options: []
    };
  },
   props: ["childMsg"],
  created(){
      // console.log(this.childMsg,5555)
        // 获取所属门店
        let _this=this;
    dealerOrganizations().then(response => {
      
      if (response.data.code == 200) {
        let oranizationList = response.data.data;
        // console.log(oranizationList, 888);
        for (let i = 0; i < oranizationList.length; i++) {
          let obj = {};
          obj.value = (oranizationList[i].id).toString();
          obj.label = oranizationList[i].orgName;
          _this.options.push(obj);
        }
      }

    });
  },
  watch:{
      orgId(val){
          this.orgId=val;
        this.$emit('child-orgId',this.orgId)
      },
      childMsg(val){
          console.log(val,'组织管理')
         if(val==null){
          this.orgId='';
         }else{
            this.orgId=val;
         }
      }
  }
};
</script>

<style lang="less" scoped>
.origation{
   
}
</style>


