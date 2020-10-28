<template>
  <div id="hole">
      <div class="osn_center">
          <div class="osn_center_list" shadow v-for="(item,index) in list" :key="index">
              <div class="pic"><img :src="item.src" alt=""></div>
              <div class="content">
                  <div class="title">{{item.title}}</div>
                  <div class="tips">{{item.content}}</div>
                  <div class="button other" @click="openGuide(index)">立即查看</div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import { courseInfo } from "@/api/course.js";
  export default {
    data() {
      return {
        courseId: this.$route.query.courseId,
        step: 0,
        list: [],
        name: '',
        formData: []
      };
    },
    created() {
        let breadcrumbs = [
            {name: "新手教程"},
            {name: this.name}
        ];
        this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    },
    mounted() {
        document.getElementById("main-content").style.background='#f5f7f9';
        this.courseInfo();
    },
    destroyed() {
        document.getElementById("main-content").style.background='#fff';
    },
    components: {

    },
    methods: {
        courseInfo() {
            let param = {courseId:this.courseId}
            courseInfo(param).then(res=>{
                // console.log(res);
                if(res.data.code==200) {
                    let chapterList = res.data.data.chapters;
                    this.name = res.data.data.name;
                    this.formData = res.data.data.chapters;
                    chapterList.forEach(item=>{
                        let obj = {};
                        obj.src = item.showedUrl;
                        obj.title = item.name;
                        obj.content = item.description;
                        obj.seq = item.seq;
                        this.list.push(obj);
                    });
                    this.list = this.list.sort(this.compare('seq'));
                    let breadcrumbs = [
                        {name: "新手教程"},
                        {name: this.name}
                    ];
                    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
                }
            })
        },
        compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        openGuide(i) {
            console.log(this.formData[i])
            let routeUrl = this.$router.resolve({
                path: "/courseSteps",
                query: {courseId:this.courseId,index:i}
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
                    margin: 0 10px 20px;
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
