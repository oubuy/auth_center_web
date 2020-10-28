<template>
    <div v-if="strLength>0">
      <span v-for="(item,index) in strLength-1" :key="index">
        &nbsp;&nbsp;&nbsp;
      </span>
    <Icon  v-if="showNoLast" style="margin-right:10px;" type="ios-arrow-forward"/>
    <span v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    {{strName}} 
    </div>
    <div v-else>
     <Icon v-if="showNoLast" style="margin-right:10px;" type="ios-arrow-forward" />{{strName}}
    </div>
</template>


<script>
export default {
  data() {
    return {
      strLength: 0,
      strName: "",
      showNoLast:false,
      dataL:this.data_List,
      id:0
    };
  },
  props: ["parentIds",'data_List'],
  mounted() {
   
    this.id=this.parentIds.id;
    if (this.parentIds.long_id) {
      var long_id_array=[];
      this.data_List.forEach(element => {
          long_id_array=element.long_id.split(",");
          var idd=element.id;
           long_id_array.forEach(element1 => {
              if(this.id==element1 && this.id!=idd){
                this.showNoLast=true;
              }
            });
      })
     
      if (this.parentIds.long_id.indexOf(",") != -1) {
        this.strLength = this.parentIds.long_id.split(",").length;
      } else {
        this.strLength=-1;
      }
    this.strName = this.parentIds.org_name;
    }
  }
};
</script>
