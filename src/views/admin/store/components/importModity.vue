<template>
    <div>
           <Form :label-width="80">
                <FormItem label="上传文件：" class="fileContent">
                    <Upload 
                        ref="upload"
                        action="/modity/importUploadFile"    
                        name="excel-file"
                        :show-upload-list="false"
                        :on-format-error="handleFormatError"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                         :headers="headerToken"
                        :format ="['xlsx','xls','csv']">
                            <Button type="info" icon="ios-cloud-upload-outline">选择文件</Button>
                              <span class="tip">注意：仅支持CSV、xls、xlsx格式件文件。</span>
                    </Upload>
                  
                </FormItem>
            </Form>
            <Form :label-width="80">
              <FormItem label="" class="fileContent">
                <Button type="info" >
                  <a style="color: white" href="http://oceano-center.oss-cn-hangzhou.aliyuncs.com/Auth-web/orgImportTemplate/%E9%97%A8%E5%BA%97%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E8%A1%A8%E5%AF%BC%E5%85%A5%E8%A1%A8%20.xlsx">下载导入模板文件</a>
                </Button>
              </FormItem>
            </Form>
              <div class="title">当前导入内容</div>
              <Table border ref="selection" :columns="columns4" :data="importTableData"></Table>

            <div class="footerButton">
                 <Button type="primary" @click="handleSubmit">保存</Button>
                 <Button style="margin-left: 8px" @click="handleBack">取消</Button>
            </div>

            <!-- 编辑 -->
            <Modal
        v-model="editImportShow"
        title="编辑："
       >
         <Form :model="formItem" :label-width="110">
            <FormItem label="产品型号：">
               {{formItem.officialModel}}
            </FormItem>
             <FormItem label="产品名称：">
               {{formItem.modityName}}
            </FormItem>
             <FormItem label="价格（片）：">
                <Input v-model="formItem.price1"></Input>
            </FormItem>
              <FormItem label="活动价格（片）：">
                <Input v-model="formItem.activityPrice1"></Input>
            </FormItem>
             <FormItem label="价格（方）：">
               <Input v-model="formItem.price2"></Input>
            </FormItem>
             <FormItem label="活动价格（方）：">
               <Input v-model="formItem.activityPrice2"></Input>
            </FormItem>
            <FormItem label="是否实物展示：">
                <Select v-model="formItem.physicalDisplay">
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                   
                </Select>
            </FormItem>
          
            <FormItem>
                <Button type="primary" @click="handleEditImportTable">保存</Button>
                <Button style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
        
    </Modal>
    </div>
</template>
<script>
import { importShopModity } from "@/api/store.js";


export default {
  data() {
    return {
      headerToken: { Authorization: "" }, //token

      columns4: [
        {
          title: "产品型号",
          key: "officialModel"
        },
        {
          title: "产品名称",
          key: "modityName"
        },
        {
          title: "价格（片）",
          key: "price1"
        },
        {
          title: "活动价格（片）",
          key: "activityPrice1"
        },
        {
          title: "价格（方）",
          key: "price2"
        },
        {
          title: "活动价格（方）",
          key: "activityPrice2"
        },
        // {
        //   title: "活动开始时间(格式年-月-日)",
        //   key: "startDate"
        // },
        // {
        //   title: "活动结束时间(格式年-月-日)",
        //   key: "endDate"
        // },
        {
          title: "是否实物展示",
          key: "physicalDisplay",
          render: (h, params) => {
            return h("div", params.row.physicalDisplay == 1 ? "是" : "否");
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      // this.show(params.index)
                      this.handleEditImport(params);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      importTableData: [],

      editImportShow: false,
      formItem: {
        officialModel: "",
        modityName: "",
        price1: "",
        activityPrice1: "",
        price2: "",
        activityPrice2: "",
        physicalDisplay: "0",
        
      },
      tableIndex: "",
    };
  },
  mounted() {
       let breadcrumbs = [{ name: "首页" }, { name: "内部商品管理" },{name:'导入商品'}];
    this.$store.dispatch("updateBreadcrumbs", breadcrumbs);
    this.headerToken.Authorization = localStorage.getItem("jwttoken");
  },
  methods: {
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件 " + file.name + " 格式不正确，请上传.xls,.xlsx文件。"
      });
    },
    handleSuccess(res, file) {
      //   if (res.errcode === 0) {
      //     this.dialoLead = false;
      //     this.$Message.success("数据导入成功！");
      //     this._getBookList();
      //     this.$refs.upload.clearFiles();
      //   }

      this.importTableData = [];
      if (res.code == 200) {
        let dataArr = res.data;
        this.$Message.success("数据导入成功！");
        this.$refs.upload.clearFiles();
        dataArr.forEach(item => {
          this.importTableData.push(item);
        });
      }
    },
    handleError(error, file) {
      this.$Message.error("数据导入失败！");
    },
    handleSubmit() {
      let params = {};
      params.storeId = this.$route.query.storeId;
      params.importModityInfoList = this.importTableData;
      importShopModity(params).then(response => {
        if (response.data.code == 200) {
          this.$Message.success(response.data.msg);
          this.$router.go(-1);
        }
      });
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleEditImport(params) {
      this.editImportShow = true;
      let dataValue = params.row;
      this.tableIndex = params.index;
      this.formItem.officialModel = dataValue.officialModel;
      this.formItem.modityName = dataValue.modityName;
      this.formItem.price1 = dataValue.price1;
      this.formItem.activityPrice1 = dataValue.activityPrice1;
      this.formItem.price2 = dataValue.price2;
      this.formItem.activityPrice2 = dataValue.activityPrice2;
      if (dataValue.physicalDisplay !== null) {
        this.formItem.physicalDisplay = dataValue.physicalDisplay.toString();
      }
    },
    handleEditImportTable(){
     
      for(var i=0;i<this.importTableData.length;i++){
         if(this.importTableData[i].officialModel==this.formItem.officialModel){
          this.importTableData[i].price1=this.formItem.price1;
          this.importTableData[i].activityPrice1=this.formItem.activityPrice1;
          this.importTableData[i].price2=this.formItem.price2;
          this.importTableData[i].activityPrice2=this.formItem.activityPrice2;
          this.importTableData[i].physicalDisplay=this.formItem.physicalDisplay;
         }
      }


      this.editImportShow = false;
    }
  }
};
</script>
<style lang="less" scoped>
.footerButton {
  position: absolute;
  bottom: 20px;
  left: 50%;
}
.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}
.tip {
  color: #9ea7b4;
  font-size: 12px;
  margin-left: 15px;
}
</style>
