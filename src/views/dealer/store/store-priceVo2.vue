<template>
    <div>
        <p>销售价:{{storePrice2.storeSquarePrice}}</p>
        <p>活动价:{{storePrice2.storeActivitySquarePrice}}</p>
        <!-- <p>指导价:{{storePrice2.squarePrice}}</p> -->
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["storePrice2"],
  mounted(){

  }

};
</script>
