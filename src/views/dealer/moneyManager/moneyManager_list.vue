<template>
    <div>
    
        <div v-if="formValidateData.length!=0" > 
            <div v-for="(item,index) in formValidateData" :key="index" class="user_content">
           
              <div class="content_item">
                <span>账号名：</span>
                <span>{{item.accountName}}</span>
              </div>
              <div class="content_item">
                <span>开户行：</span>
                <span>{{item.bank}}</span>
              </div>
              <div v-for="(itemChild,indexChild) in item.accounts" :key="indexChild">
                  <div class="itemChild">
                    <div>
                      <span>账号：</span>
                    </div>
                     <div>
                       <div>{{itemChild.oneKey}}</div>
                       <span>(</span>{{itemChild.oneValue}}<span>)</span>
                     </div>
                  </div>
                
              </div>
            </div>
        </div>
        <div v-else>
          <span>无法查到账户信息</span>
        </div>
     
      
    </div>
</template>

<script>
import { moneyManager } from "@/api/dealerModity.js";

export default {
  data() {
    return {
      formValidateData: [],
     
    };
  },
  created() {
    let breadcrumbs = [
      { name: "首页" },
      { name: "经销商管理" },
      { name: "资金管理账号" }
    ];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.handleInfo();
  },
  methods: {
    handleInfo() {
      moneyManager().then(res => {
        if (res.data.code == 200) {
          let dataList = res.data.data;
          if (dataList.length != 0) {
            for (var i = 0; i < dataList.length; i++) {
              let params = {};
              params.bank = dataList[i].bank;
              params.accountName = dataList[i].accountName;
              let arrData = [];
              let accountsData = dataList[i].accounts;
              for (var key in accountsData) {
                let obj = {};
                obj.oneKey = key;
                obj.oneValue = accountsData[key];
                arrData.push(obj);
              }
              params.accounts = arrData;
              this.formValidateData.push(params);
            }
          }
        }
      });

    }
  }
};
</script>
<style lang="less" scoped>
.user_content {
  margin-bottom: 50px;
  text-align: left;
  padding-left: 74px;
  .content_item {
    margin-bottom: 7px;
  }
  .itemChild {
    display: flex;
    margin-bottom: 10px;
  }
}
.form-item {
  text-align: left;
  margin-bottom: 0px !important;
}
</style>


