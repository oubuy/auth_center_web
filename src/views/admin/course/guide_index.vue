<template>
  <div id="hole">
    <div class="title">新手教程</div>
    <div class="list_box">
        <div class="list" v-for="(item,index) in list" @click="goList(item.id)" :key="index">
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
  import {findMenuList} from "@/api/course.js"
  export default {
    data() {
      return {
        list: []
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
        this.findMenuList();
    },
    components: {
      
    },
    methods: {
        goList(courseId) {
            this.$router.push({
                path: '/admin/course/chapterList',
                query: {courseId:courseId}
            });
        },
        openLink() {
            let routeUrl = this.$router.resolve({
                path: "/steps",
                query: {index:i,system:system,step:step,guideName:guideName}
            });
            window.open(routeUrl .href, '_blank');
        },
        findMenuList() {
            var param = {
                page: 1,
                rows: 20
            }
            findMenuList(param).then(res=>{
                // console.log(res);
                if(res.data.code==200) {
                    let list = res.data.data.list;
                    list.forEach(item=>{
                        let obj = {};
                        obj.name = item.name;
                        obj.src = item.showedUrl;
                        obj.id = item.id;
                        obj.seq = item.seq;
                        if(!item.enabled) return;
                        this.list.push(obj);
                    });
                    this.list = this.list.sort(this.compare('seq'));
                }
            });
        },
        compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
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
        width: 100%;
        height: 100%;
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
        flex-wrap: wrap;
        margin-top: 30px;
    }
    .list{
        cursor: pointer;
        margin-bottom: 30px;
    }
    .guide_pic{
            width: 380px;
            height: 260px;
            margin-bottom: 30px;
    }
    .guide_name {
        font-size: 24px;
    }
    .tips{
        margin-top: 100px;
        
    }
    .tips p{
        text-align: left;
        font-size: 16px;
        color: #666;
    }
</style>
