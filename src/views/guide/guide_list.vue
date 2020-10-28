<template>
  <div id="hole">
      <div class="osn_center" v-if="index==0">
          <div class="osn_center_list" shadow v-for="(item,index) in list1" :key="index">
              <div class="pic"><img :src="item.src" alt=""></div>
              <div class="content">
                  <div class="title">{{item.title}}</div>
                  <div class="tips">{{item.content}}</div>
                  <div class="button other" @click="openGuide(index)">立即查看</div>
              </div>
          </div>
      </div>
      <div class="osn_center" v-if="index==1">
          <div class="osn_center_list" shadow v-for="(item,index) in list2" :key="index">
              <div class="pic"><img :src="item.src" alt=""></div>
              <div class="content">
                  <div class="title">{{item.title}}</div>
                  <div class="tips">{{item.content}}</div>
                  <div class="button" @click="openGuide(index)">立即查看</div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        index: this.$route.query.index,
        step: 0,
        list1: [{
            src: require('@/assets/guide/custom_manage.png'),
            title: '客户管理',
            content: '创建客户、编辑客户、客户资料、订单详情等',

        },
        {
            src: require('@/assets/guide/product.png'),
            title: '产品库',
            content: '快速浏览产品瓷砖数据、生成订单',

        },
        {
            src: require('@/assets/guide/fit_up_case.png'),
            title: '装修案例',
            content: '平面效果图、720°效果图、DIY场景图',

        },
        {
            src: require('@/assets/guide/village_building.png'),
            title: '小区楼盘',
            content: '本地区楼盘、户型',

        },
        {
            src: require('@/assets/guide/problem.png'),
            title: '常见问题',
            content: '无法登录、无法打开',
        }],
        list2:[{
            src: require('@/assets/guide/man_manage.png'),
            title: '人员管理',
            content: '开通企信，业务账号，人员账号授权',

        },
        {
            src: require('@/assets/guide/store_manage.png'),
            title: '门店商品',
            content: '管理门店价格、打印价格牌、下载瓷砖二维码',

        },
        {
            src: require('@/assets/guide/building_manage.png'),
            title: '楼盘管理',
            content: '增加、删除本城市楼盘数据',

        },
        {
            src: require('@/assets/guide/layout_manage.png'),
            title: '户型管理',
            content: '增加、删除本楼盘对于的户型数据',

        },
        {
            src: require('@/assets/guide/case_manage.png'),
            title: '案例管理',
            content: '增加、删除本经销商的案例数据',

        },
        {
            src: require('@/assets/guide/web_building.png'),
            title: '互联网来源楼盘',
            content: '从互联网快速批量创建楼盘',

        }]
      };
    },
    created() {
        var name;
        let index = this.$route.query.index;
        if(index==0) name = "Ipad导购系统";
        else if(index==1) name = "中台管理系统";
        else if(index==2) name = "聚客宝系统";
        let breadcrumbs = [
            {name: "新手教程"},
            {name: name}
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
        
    },
    mounted() {
        document.getElementById("main-content").style.background='#f5f7f9';
    },
    destroyed() {
        document.getElementById("main-content").style.background='#fff';
    },
    components: {
      
    },
    methods: {
        openGuide(i) {
            var system, step, guideName;
            if(this.index==0) system = 'ipad';
            else if(this.index==1) system = 'osn';
            else system = 'routine';
            if(system=='osn') {
                if(i==0) step = 4;
                else if(i==1) step=6;
                else if(i==2) step=3;
                else if(i==3) step=4;
                else if(i==4) step=3;
                else if(i==5) step=2;
            }else if(system=='ipad') {
                if(i==0) step = 6;
                else if(i==1) step=6;
                else if(i==2) step=4;
                else if(i==3) step=5;
            }
            let routeUrl = this.$router.resolve({
                path: "/steps",
                query: {index:i,system:system,step:step,guideName:guideName}
            });
            window.open(routeUrl .href, '_blank');
        }
    },

  };
</script>
<style lang="less" scoped>
    body{
        font-family: 'SimHei';
        color: #515a6d;
    }
    #hole{
        width: 100%;
        background: #f5f7f9;
    }
    img{
        display: block;
    }
    .osn_center{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .osn_center_list{
            width: 308px;
            background: #fff;
            margin: 10px;
            border-radius: 10px;
            box-shadow: 0 5px 5px #ccc;
            .content{
                height: 160px;
                .title{
                    font-size: 20px;
                    color: #555;
                    margin: 30px 0 20px;
                }
                .tips{
                    font-size: 14px;
                    color: #777c91;
                    margin-bottom: 20px;
                }
                .button{
                    width: 134px;
                    height: 30px;
                    border: 1px solid #5fc5fb;
                    font-size: 12px;
                    color: #5fc5fb;
                    text-align: center;
                    line-height: 30px;
                    margin: 0 auto;
                    border-radius: 20px;
                    cursor: pointer;
                }
                .other{
                    color: orange;
                    border: 1px solid orange;
                }
            }
        }
    }
</style>
