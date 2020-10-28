<template>
   <div>
      <Dropdown trigger="click"  @on-click="handleClick">
       <Button >
           新增
            <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name='orgOther'>其他</DropdownItem>
            <DropdownItem name='orgDealer'>经销商</DropdownItem>
            <DropdownItem name='orgShopType'>门店/部门</DropdownItem>
          
        </DropdownMenu>
    </Dropdown>
   </div>
</template>
<script>
export default {
  data() {
    return {
      pageParmas: {}
    };
  },

  methods: {
   
    handleClick(val) {
      if (val == "orgDealer") {
          this.pageParmas = {
        ...this.$route.query
      };
        this.$router.push({
          path: "/admin/outer/orgDealer",
          query: this.pageParmas
        });
      } else if (val == "orgShopType") {
          this.pageParmas = {
        ...this.$route.query
      };
        this.$router.push({
          path: "/admin/outer/orgShopType",
          query: this.pageParmas
        });
      } else if (val == "orgOther") {
          this.pageParmas = {
        ...this.$route.query
      };
        this.$router.push({
          path: "/admin/outer/orgOtherType",
          query: {
            orgTherType: "orgOther",
            pageParentId: this.pageParmas.pageParentId,
            pageParentName: this.pageParmas.pageParentName
          }
        });
      }
    }
  }
};
</script>