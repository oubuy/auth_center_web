<template lang="html">
  <div>管理员-经销商角色管理</div>
</template>

<script>
export default {
  mounted() {
    // this.breadcrumbs = [{name:'123'}]
    let breadcrumbs = [{name:"首页"},{name:"经销商组织"},{name:"角色管理"}]

    // this.$store.commit(this.GLOBAL_TYPES.SET_breadcrumbs,breadcrumbs)
    this.$store.dispatch('updateBreadcrumbs',breadcrumbs)
    // console.log("设置面包屑")

  }
}
</script>

<style lang="css">
</style>
