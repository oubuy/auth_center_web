<template>
    <div>
        <p>销售价:{{storeObj.storeNumPrice}}</p>
        <p>活动价:{{storeObj.storeActivityNumPrice}}</p>
        <!-- <p>指导价:{{storeObj.numPrice}}</p> -->
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["storeObj"],

};
</script>
