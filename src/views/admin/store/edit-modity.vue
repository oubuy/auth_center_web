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
                <Input v-model="formItem.price1" placeholder="请输入价格"></Input>
            </FormItem>
             <FormItem label="活动价格（方）:" style="width:300px;">
                <Input v-model="formItem.activityPrice1" placeholder="请输入价格"></Input>
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
  editShopModityPriceInfo
} from "@/api/store.js";

export default {
  data() {
    return {
      formItem: {
        officialModel: "",
        modityName: "",
        modityModel: "",
        price1: "",
        activityPrice1: "",
        price2: "",
        activityPrice2: "",
        physicalDisplay: "",
        characteristics: "", //特点
        applicationSpace: "", //应用范围
        description: "",
        storeModityId: "",
        id: ""
      },
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
    if (this.$route.query.storeModityId) {
      this.getShopModityPriceInfo(this.$route.query.storeModityId);
    }
  },
  methods: {
    getShopModityPriceInfo(storeModityId) {
      shopModityPriceInfo({ storeModityId: storeModityId }).then(response => {
        if (response.data.code == 200) {
          let redultData = JSON.parse(response.data.data);
          // console.log(redultData, "redultData");
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

       if (this.$route.query.storeId) {
            this.qrCode.storeId = this.$route.query.storeId;
          } else {
            this.qrCode.storeId = localStorage.getItem("defaultAdiminStoreId");
          }
          // this.qrCode.storeId = this.$route.query.storeId;
          this.qrCode.modityId = resultModity.id;
          this.qrCode.skuModityId = resultStoreSku.id;


          this.getModityQrcode(this.qrCode.storeId,this.qrCode.modityId,this.qrCode.skuModityId);
        }
      });
    },
    getModityQrcode(storeId, modityId, skuModityId) {
      this.srcUrl =
        this.api +
        "/modity-download/shopModityQrCode?storeId=" +
        storeId +
        "&modityId=" +
        modityId +
        "&skuModityId=" +
        skuModityId+"&v="+Date.now();
    },
    handelSubmit() {
      let params = {};
      params.storeModityId = this.formItem.id;
      params.price1 = this.formItem.price1;
      params.activityPrice1 = this.formItem.activityPrice1;
      params.price2 = this.formItem.price2;
      params.activityPrice2 = this.formItem.activityPrice2;
      params.physicalDisplay = this.formItem.physicalDisplay;

      editShopModityPriceInfo(params).then(result => {
        if (result.data.code == 200) {
          this.$Message.success(result.data.msg);
            this.$router.go(-1);
        }
      });
    },
    handlBack() {
      this.$router.go(-1);
    },
    handleloadingQcord() {
        window.open(
            this.api+"/modity-download/shopDownLoadModityQrCode?storeId=" +
            this.qrCode.storeId+"&modityId="+this.qrCode.modityId+
            "&skuModityId="+this.qrCode.skuModityId
        )
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

