<template>
    <div>
         <Form :model="formItem" :label-width="100">
            <FormItem label="产品型号:">
               {{formItem.officialModel}}
            </FormItem>
            <FormItem label="产品名称:">
               {{formItem.modityName}}
            </FormItem>
             <FormItem label="规格:">
               {{formItem.modityModel}}
            </FormItem>
            <FormItem label="价格（片）:" style="width:300px;">
                <Input v-model="formItem.price2" placeholder="请输入价格"></Input>
            </FormItem>
             <FormItem label="活动价格（片):" style="width:300px;">
                <Input v-model="formItem.activityPrice2" placeholder="请输入价格"></Input>
            </FormItem>
              <FormItem label="价格（方）:" style="width:300px;">
                <!-- price1 -->
                <Input v-model="formItem.price1" placeholder="请输入价格"></Input>
            </FormItem>
             <FormItem label="活动价格（方）:" style="width:300px;">
               <!-- activityPrice1 -->
                <Input v-model="formItem.activityPrice1" placeholder="请输入价格"></Input>
            </FormItem>
            <FormItem label="活动开始时间：" style="width: 300px;">
              <Date-picker type="date" placeholder="请选择活动开始日期" v-model="formItem.startDate" :editable="false" :disabled="editDisabled"></Date-picker>
            </FormItem>
            <FormItem label="活动结束时间：" style="width: 300px;">
                <Date-picker type="date" placeholder="请选择活动结束日期" v-model="formItem.endDate" :editable="false" :disabled="editDisabled"></Date-picker>
            </FormItem>
             <FormItem label="实物展示:">
                <RadioGroup v-model="formItem.physicalDisplay">
                    <Radio label="0">是</Radio>
                    <Radio label="1">否</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="特点:">
                {{formItem.characteristics}}
            </FormItem>
             <FormItem label="应用范围:">
                {{formItem.applicationSpace}}
            </FormItem>
              <FormItem label="描述:">
                {{formItem.description}}
            </FormItem>

        </Form>
        <div class="qCore">

               <img :src="srcUrl" alt="">
                <Button type="primary" @click="handleloadingQcord">下载二维码</Button>
        </div>
        <div class="bottomButton">
             <Button type="primary" @click="handelSubmit">确定</Button>
            <Button style="margin-left: 8px" @click="handlBack">取消</Button>

        </div>
    </div>
</template>

<script>
import {
  shopModityPriceInfo,
  shopModityQrCode,
  editShopModityPriceInfo,
  shopAddModity
} from "@/api/store.js";

export default {
  data() {
    return {
      formItem: {
        officialModel: "",
        modityName: "",
        modityModel: "",
        price1: "",//方
        activityPrice1: "",
        price2: "",//片
        activityPrice2: "",
        physicalDisplay: "",
        characteristics: "", //特点
        applicationSpace: "", //应用范围
        description: "",
        storeModityId: "",
        id: "",
        startDate:"",
        endDate:""
      },
      editDisabled: false,
      qrCode: {
        storeId: "",
        modityId: "",
        skuModityId: ""
      },
      srcUrl: "",
      api: ""
    };
  },
  mounted() {
    if (this.$route.query.storeModityId||this.$route.query.modityId) {
      this.getShopModityPriceInfo(this.$route.query.storeModityId,this.$route.query.modityId);
    }
  },
  methods: {
    getShopModityPriceInfo(storeModityId,modityId) {
      shopModityPriceInfo({ storeModityId: storeModityId,modityId:modityId }).then(response => {

        if (response.data.code == 200) {
          let redultData = JSON.parse(response.data.data);
          let resultModity = redultData.modity;
          let resultStorePrice = redultData.storeModity;
          let resultStoreSku = redultData.skuModity;
          this.formItem.officialModel = resultModity.officialModel;

          this.formItem.storeModityId = resultStorePrice.id;

          this.formItem.modityName = resultModity.modityName;
          this.formItem.modityModel = resultModity.modityModel;
          this.formItem.characteristics = resultModity.characteristics;
          this.formItem.applicationSpace = resultModity.applicationSpace;
          this.formItem.description = resultModity.description;
          this.formItem.physicalDisplay = resultStorePrice.physicalDisplay.toString();
          this.formItem.price1 = resultStorePrice.price1;
          this.formItem.activityPrice1 = resultStorePrice.activityPrice1;
          this.formItem.price2 = resultStorePrice.price2;
          this.formItem.activityPrice2 = resultStorePrice.activityPrice2;
          this.formItem.id = resultStorePrice.id;
          this.formItem.modityId = this.$route.query.modityId;
          if(resultStorePrice.modityPriceId) this.formItem.modityPriceId = resultStorePrice.modityPriceId;
          else this.formItem.modityPriceId = resultStoreSku.id;
          if (this.$route.query.storeId) {
            this.qrCode.storeId = this.$route.query.storeId;
            this.formItem.storeId = this.$route.query.storeId;
          } else {
            this.qrCode.storeId = localStorage.getItem("defaultStoreId");
            this.formItem.storeId = localStorage.getItem("defaultStoreId");
          }
          // this.qrCode.storeId = this.$route.query.storeId;
          this.qrCode.modityId = resultModity.id;
          this.qrCode.skuModityId = resultStoreSku.id;

          this.getModityQrcode(
            this.qrCode.storeId,
            this.qrCode.modityId,
            this.qrCode.skuModityId
          );
        }
      });
    },
    getModityQrcode(storeId, modityId, skuModityId) {
      // ?v=" + Date.now()
      this.srcUrl =
        this.api +
        "/modity-download/shopModityQrCode?storeId=" +
        storeId +
        "&modityId=" +
        modityId +
        "&skuModityId=" +
        skuModityId+"&v="+Date.now();
    },
    handleTime(time) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        month = month>9?month:"0"+month;
        day = day>9?day:"0"+day;
        return year+"-"+month+"-"+day;
    },
    timeCompare(startTime,endTime) {
        var date1 = new Date(startTime);
        var date2 = new Date(endTime);
        if(date1.getTime()>date2.getTime()) {
            return false;
        }else {
            return true;
        }
    },
    handelSubmit() {
      let params = {};
      params.storeModityId = this.formItem.id;
      params.price1 = this.formItem.price1;
      params.activityPrice1 = this.formItem.activityPrice1;
      params.price2 = this.formItem.price2;
      params.activityPrice2 = this.formItem.activityPrice2;
      params.physicalDisplay = this.formItem.physicalDisplay;
      params.modityId = this.formItem.modityId;
      params.storeId = this.formItem.storeId;
      params.startDate = this.formItem.startDate;
      params.endDate = this.formItem.endDate;
      if(params.startDate&&params.endDate) {
        params.startDate = this.handleTime(params.startDate);
        params.endDate = this.handleTime(params.endDate);
        let flag = this.timeCompare(params.startDate,params.endDate);
        if(!flag) {
          this.$Message.warning("开始时间不能大于结束时间");
          return;
        }
      }else if(params.startDate&&!params.endDate) {
        this.$Message.warning("请选择结束时间");
        return;
      }else if(!params.startDate&&params.endDate) {
        this.$Message.warning("请选择开始时间");
        return;
      }
      if(!this.formItem.id) {
        let arrSubmit = [];
        let obj = {};
        obj.modityId = params.modityId;
        obj.modityPriceId = this.formItem.modityPriceId;
        obj.storeId = params.storeId;
        obj.price1 = params.price1;
        obj.activityPrice1 = params.activityPrice1;
        obj.price2 = params.price2;
        obj.activityPrice2 = params.activityPrice2;
        arrSubmit.push(obj);
        shopAddModity({ storeModityList: arrSubmit }).then(res=>{
          if(res.data.code==200) {
            this.$Message.success(res.data.msg);
            this.$router.go(-1);
          }
        })
      }else{
        editShopModityPriceInfo(params).then(result => {
          if (result.data.code == 200) {
            this.$Message.success(result.data.msg);
            this.$router.go(-1);
          }
        });
      }

    },
    handlBack() {
      this.$router.go(-1);
    },
    handleloadingQcord() {
      window.open(
        this.api +

           "/modity-download/shopDownLoadModityQrCode?storeId=" +
          this.qrCode.storeId +
          "&modityId=" +
          this.qrCode.modityId +
          "&skuModityId=" +
          this.qrCode.skuModityId
      );
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../style/mixin.less";

.bottomButton {
  .cbtom;
}
.qCore {
  position: absolute;
  top: 12%;
  right: 30%;
  img {
    .wh(200px,200px);
    display: block;
    margin-bottom: 20px;
  }
}
</style>
