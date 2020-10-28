<template>
  <div id="hole">
    <div class="title">新手教程</div>
    <div class="list_box">
        <div class="list" v-for="(item,index) in list" @click="goList(index)" :key="index">
            <div class="guide_pic"><img :src="item.src" alt=""></div>
            <div class="guide_name">{{item.name}}</div>
        </div>
    </div>
    <div class="tips">
        <p>请使用电脑版企信打开<span>应用>中台管理</span>,就可以正常进行后台业务了。如功能显示不全，请管理员在<span>人员管理>编辑</span>中调整权限</p>
        <p>企信下载地址：<a href="http://qixin.osnyun.com/sms/download.html" target="view_window">http://qixin.osnyun.com/sms/download.html</a></p>
        <p>Ipad下载地址：<a href="http://data.osnyun.com/ipad/" target="view_windows">http://data.osnyun.com/ipad/</a></p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [{
            name: 'Ipad导购系统',
            src: require('@/assets/guide/ipad.png')
        },{
            name: '中台管理系统',
            src: require('@/assets/guide/center_web.png')
        }
        // ,{
        //     name: '聚客宝系统',
        //     src: require('@/assets/guide/small_routine.png')
        // }
        ]
      };
    },
    created() {
      let breadcrumbs = [{
          name: "首页"
        },
        {
          name: "新手教程"
        }
      ];
      this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    },
    mounted() {

    },
    components: {
      
    },
    methods: {
        goList(i) {
            let index = i;
            this.$router.push({
                path: '/guide/list',
                query: {index:index}
            });
        },
        openLink() {
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
    img{
        display: block;
    }
    span,a{
        color: #00a7fe;
    }
    a{
        cursor: pointer;
    }
    #hole{
        padding: 0 140px;
    }
    .title{
        font-size: 36px;
        text-align: center;
        margin-top: 20px;
    }

    .list_box{
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 30px;
    }
    .list{
        cursor: pointer;
        .guide_pic{
            margin-bottom: 30px;
        }
        .guide_name {
            font-size: 24px;
        }
    }
    .list:nth-child(2) {
        margin: 0 30px;
    }
    .tips{
        margin-top: 100px;
        p{
            text-align: left;
            font-size: 16px;
            color: #666;
        }
    }
</style>
