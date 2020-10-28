<template>
    <div>
       <div class="imgBox">
           <div>
               <img :src="editImageObj.src" alt="" style="width:45px;height:45px;">
           </div>
          <p class="iconDelete" v-if="showDelete" @click="handleClose"><Icon type="md-close" style="color:#fff;" /></p>
       </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           showDelete:false,
        }
    },
      props: ["editImageObj"],
      mounted(){
          setTimeout(()=>{
              this.showDelete=true;
          },500)
      },
      methods:{
          handleClose(){
              let data={
                  physicalDisplay:'1',
                  storeModityId:this.editImageObj.storeModityId
              }
              this.$emit('on-setPhysical',data)
          }
      }
}
</script>
<style lang="less" scoped>
.imgBox{
    display: flex;
    justify-content:space-between;
    //  align-items:flex-end;
}
.iconDelete{
    width: 15px;
    height: 15px;
    text-align: center;
    background: #ff7836;//#2d8cf0
    line-height: 15px;
    cursor: pointer;
    // position: absolute;
}
</style>


