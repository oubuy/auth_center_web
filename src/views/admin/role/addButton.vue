<template>
    <div>
        <Dropdown trigger="click"  @on-click="handleClick">
            <Button >
                新增角色
                    <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
                    <DropdownItem name='PUBLIC'>公共</DropdownItem>
                    <DropdownItem name='SUPER'>集团</DropdownItem>
            </DropdownMenu>
        </Dropdown>

    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        handleClick(val){
          if(val=='PUBLIC'){
              this.$router.push({
                  path:'/admin/role/add',
                  query:{
                      type:'PUBLIC'
                  }
              })

          }else{
               this.$router.push({
                  path:'/admin/role/add',
                  query:{
                      type:'SUPER'
                  }
              })
          }
        }
    }
}
</script>

