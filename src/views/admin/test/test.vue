<template>
  <div class="box">
    <div class="person-wrap" ref="personWrap">
      <ul class="person-list" ref="li1">
        <li
          class="person-item"
          v-for="(item,index) in 10"
          :key="index"
        >第{{item}}块</li>
      </ul>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  data() {
    return {
    //   currentIndex: 0, //当前显示的下标
      
    //   scrollY: 0,
    //   menuIndexChange: true
    };
  },
  created() {
    this.$nextTick(() => {
      this.personScroll();
    });
  },
  mounted() {},
  methods: {
    // 横轴初始化
    personScroll() {
      // 动态设置宽度
      let width = this.width();
      console.log(width,'width')
      this.$refs.li1.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personWrap, {
            startX: 0,
            click: true,
          
            scrollX: true,
            scrollY: false,
          
            bounce: false
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    //获取横轴宽度
    width() {
      let wrap1 = this.$refs.li1.children;
       console.log(wrap1,'wrap1')
      let sum = 0;
      for (var i = 0; i < wrap1.length; i++) {
        sum += wrap1[i].offsetHeight;
      }
      console.log(sum,'sum')
      return sum + wrap1.length * 20* 2;
    }
  }
};
</script>

<style scoped lang="less">
.box {
  width: 40rem;
  overflow: hidden;
}
.person-wrap {
  overflow: hidden;
  .person-list {
      cursor: pointer;
    list-style-type: none;
    display: flex;
    .person-item {
    //   float: left;
    //   line-height: 36px;
     width: 112px;
    height: 112px;
      margin: 0 16px;
      white-space: nowrap;
      background: red;
    }
    .current {
      color: #004299;
    }
  }
}

</style>

