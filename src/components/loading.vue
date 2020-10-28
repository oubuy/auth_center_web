<template>
  <div class="mask-box" v-if="!showPage||saveFlag||deleteFlag">
    <div class="loading_box" v-if="!showPage">
      <div>
        <van-loading type="spinner" color="#fff" vertical/><div style="font-size: .4rem;padding-top: .4rem;color: #fff;">加载中</div></van-loading>
      </div>
    </div>
    <div class="loading_box" v-if="saveFlag">
      <div>
        <van-loading type="spinner" color="#fff" vertical/><div style="font-size: .4rem;padding-top: .4rem;color: #fff;">保存中</div></van-loading>
      </div>
    </div>
    <div class="loading_box" v-if="deleteFlag">
      <div>
        <van-loading type="spinner" color="#fff" vertical/><div style="font-size: .4rem;padding-top: .4rem;color: #fff;">删除中</div></van-loading>
      </div>
    </div>
    <div class="loading_box" v-if="submitFlag">
      <div>
        <van-loading type="spinner" color="#fff" vertical/><div style="font-size: .4rem;padding-top: .4rem;color: #fff;">提交中</div></van-loading>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      showPage: {
        type: Boolean,
        default: true
      },
      saveFlag: {
        type: Boolean,
        default: false
      },
      deleteFlag: {
        type: Boolean,
        default: false
      },
      submitFlag: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .mask-box{
    position: fixed;
    width: 100%;
    height: 100%;
    background: transparent;
    top: 0;
  }
  .loading_box {
    position: fixed;
    display: flex;
    width: 3rem;
    height: 3rem;
    top: 50%;
    left: 50%;
    margin-left: -1.5rem;
    margin-top: -1.5rem;
    flex-wrap: wrap;
    background: rgba(0,0,0,.5);
    justify-content: center;
    align-items: center;
  }
</style>
