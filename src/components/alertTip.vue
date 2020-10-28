 <template>
    <div class="alet_container">
	    <section class="tip_text_container">
             <h3 class="headerBox">{{alertTipParams.headTip}}</h3>
            <div class="centerBox">
               {{alertTipParams.titleTip}}
            </div>
            <div class="bottomBox">
                <p class="tip_text" @click="canelTip">取消</p>
               <div class="confrim" @click="closeTip">确认</div>
            </div>
      </section>
    </div>
</template>

<script>
export default {
  data() {
    return {
      positionY: 0,
      timer: null
    };
  },
  mounted() {},
  props: ["alertTipParams"],
  methods: {
    closeTip() {
      this.$emit("child-tip", "true");
    },
    canelTip() {
      this.$emit("child-tip", "false");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
@keyframes tipMove {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.alet_container {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
.tip_text_container {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -6rem;
  margin-left: -6rem;
  width: 27rem;
  animation: tipMove 0.4s;
  background-color: rgba(255, 255, 255, 1);
  border: 1px;
  height: 147px;
  border: 1px;
  border-radius: 0.25rem;
  // padding: 0 10px;
  .headerBox {
    padding: 12px 0;
  }
  .centerBox {
    margin-bottom: 20px;
  }
  .bottomBox {
    .fj(center);
  }

  .tip_text {
    .sc(0.7rem,#333);
    height: 25px;
    line-height: 25px;
    text-align: center;
    background: rgb(204, 204, 204);
    cursor: pointer;
    padding: 0 0.4rem;
    width: 60px;
    border: 1px;
    border-radius: 3px;
  }
  .confrim {
    .sc(0.8rem,#fff);
    font-weight: bold;
    margin-left: 15px;
    background-color: #2d8cf0;
    width: 60px;
    text-align: center;
    height: 25px;
    line-height: 25px;
    border: 1px;
    border-radius: 3px;
    cursor: pointer;
  }
}
</style>
