<template>
    <div>
        <!-- 公告部分 -->
        <header class="hender_box">
           <div style="padding-top: 8px;">
               维护公告
           </div>
          <div>
               <div class="leftNoticeUser">尊敬的客户:</div>
               <div class="noticeContent">登录后调用获取登录人员权限信息接口（新接口，本需求对应的后端任务），获取权限信息后保存在客户端本地数据中。</div>
               <div class="rightNoticeUser">
                   <div>欧神诺平台研发部</div>
                   <div>2020年9月10日</div>
               </div>
          </div>
        </header>
        <div class="fuctionLine"><span class="line_span"></span><p>快速功能区</p></div>
        <div class="functionBox">
            <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/1.png" alt=""></div>
                    <div class="right_text">打印价格牌</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>
             <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/2.png" alt=""></div>
                    <div class="right_text">上传案例</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>
              <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/3.png" alt=""></div>
                    <div class="right_text">上传实景</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>
              <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/4.png" alt=""></div>
                    <div class="right_text">管理员工</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>
                <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/6.png" alt=""></div>
                    <div class="right_text">打印订单</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>
              <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/5.png" alt=""></div>
                    <div class="right_text">管理门店</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>
        
             <div class="li_content">
                <div class="li_itemContent">
                  <div class="li_header">
                    <div class="left_img"> <img src="~@/assets/7.png" alt=""></div>
                    <div class="right_text">上传户型</div>
                  </div>
                  <!-- <div class="li_bottom">
                    <div class="left_course">查看教程</div>
                    <div class="right_course">进入</div>
                  </div> -->
                </div>
            </div>

          
        </div>
    </div>
</template>
<script>
import {getUserPermission} from '@/api/homePage.js'

export default {
  data() {
    return {};
  },
  created() {
    let breadcrumbs = [{ name: "经销商首页" }];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);

    this.getUserPermission()
  },
  methods: {
    getUserPermission(){
      getUserPermission().then(res=>{
        console.log(res,8888)
      })
    }
  }
};
</script>


<style lang="less" scoped>
.hender_box {
  max-height: 300px;
  border: 1px solid #a0bbfb;
  overflow-y: auto;
  background: #eff6ff;
}
.leftNoticeUser {
  text-align: left;
  padding-left: 4px;
}
.noticeContent {
  text-align: left;
  padding: 10px 6px 10px 24px;
}
.rightNoticeUser {
  text-align: right;
  padding-right: 10px;
  margin-bottom: 20px;
}
.hender_box::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.hender_box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/

  border-radius: 10px;

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

  background: #9e9e9e;
}

.hender_box::-webkit-scrollbar-track {
  /*滚动条里面轨道*/

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

  border-radius: 10px;

  background: #ededed;
}
.fuctionLine {
  display: flex;
  align-items: center;
  margin: 10px 0;
  .line_span {
    display: inline-block;
    width: 3px;
    height: 13px;
    background: #a0bbfb;
    margin-right: 5px;
  }
}

.functionBox {
  display: flex;
  flex-wrap: wrap;
  .li_content {
    width: 19.9%;
    margin-bottom: 10px;
    height: 118px;
    padding: 0 10px;

    .li_itemContent {
      background: #f6f7fa;
      height: 100%;
      width: 100%;
      .li_header {
        display: flex;
        justify-content: center;
        align-items: center;
        // height: 64%;
        // border-bottom: 2px solid #fff;

        height: 100%;
        .left_img {
          width: 30px;
          height: 30px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .right_text {
          margin-left: 10px;
        }
      }
      .li_bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36%;
        .left_course,.right_course{
          width:50%;
          height: 100%;
   
        }
        .right_course{
           border-left: 2px solid #fff;
        }
      }
    }
  }
}
</style>

